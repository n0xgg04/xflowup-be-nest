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
        const region = configService.get<string>('SQS_REGION');
        const accessKeyId = configService.get<string>('SQS_ACCESS_KEY_ID');
        const secretAccessKey = configService.get<string>(
          'SQS_SECRET_ACCESS_KEY',
        );

        if (!region || !accessKeyId || !secretAccessKey) {
          throw new Error('Missing AWS SQS configuration');
        }

        const sqsConfig = {
          region,
          credentials: {
            accessKeyId,
            secretAccessKey,
          },
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
