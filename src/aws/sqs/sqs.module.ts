import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { SQS } from '@aws-sdk/client-sqs';
import { SqsService } from './sqs.service';
import { PrismaModule } from '@/prisma/prisma.module';
import { SqsTestResolver } from './sqs.test.resolver';

@Module({
  imports: [PrismaModule],
  providers: [
    {
      provide: SQS,
      useFactory: (configService: ConfigService) => {
        const region = configService.get<string>('sqs.region');
        const accessKeyId = configService.get<string>('sqs.accessKeyId');
        const secretAccessKey = configService.get<string>(
          'sqs.secretAccessKey',
        );
        const sqsConfig = {
          region,
          accessKeyId,
          secretAccessKey,
        };
        return new SQS(sqsConfig);
      },
      inject: [ConfigService],
    },
    SqsService,
    SqsTestResolver,
  ],
  exports: [SQS, SqsService],
})
export class SqsModule {}
