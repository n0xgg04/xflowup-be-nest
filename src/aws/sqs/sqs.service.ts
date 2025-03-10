import { PrismaService } from '@/prisma/prisma.service';
import { SQS } from '@aws-sdk/client-sqs';
import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { catchError, defer, from, switchMap, tap } from 'rxjs';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class SqsService {
  constructor(
    private readonly sqs: SQS,
    private readonly configService: ConfigService,
    private readonly prisma: PrismaService,
  ) {}

  send(
    message: Record<string, string>,
    jobType: string,
    messageGroupId: string = 'general',
  ) {
    const isFifo: boolean = this.configService.get('SQS_IS_FIFO') === 'true';

    const messageId = uuidv4();
    const sqsMessage: SQSMessage = {
      QueueUrl: this.configService.get<string>('sqs.url')!,
      MessageBody: JSON.stringify({
        messageId,
        message,
        date: new Date().toISOString(),
        MessageAttributes: {
          job: {
            DataType: 'String',
            StringValue: jobType,
          },
        },
      }),
    };

    if (isFifo) {
      sqsMessage.MessageGroupId = messageGroupId;
      sqsMessage.MessageDeduplicationId = messageId;
    }

    return defer(() =>
      this.prisma.db
        .insertInto('QueueJob')
        .values({
          message_id: messageId,
          message: JSON.stringify(sqsMessage),
          entity: JSON.stringify(message),
          job_type: jobType,
          queue: this.configService.get<string>('sqs.queueName') || '',
          updated_at: new Date(),
          status: 0,
          counter: 0,
        })
        .execute(),
    ).pipe(
      switchMap(() =>
        from(this.sqs.sendMessage(sqsMessage)).pipe(
          catchError((error) => {
            throw new InternalServerErrorException(error);
          }),
        ),
      ),
    );
  }
}
