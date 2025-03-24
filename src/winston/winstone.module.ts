import { Global, Module } from '@nestjs/common';
import {
  utilities as nestWinstonModuleUtilities,
  WinstonModule as NestWinstonModule,
} from 'nest-winston';
import * as winston from 'winston';

@Global()
@Module({
  imports: [
    NestWinstonModule.forRoot({
      transports: [
        new winston.transports.File({
          dirname: '../logs/',
          filename: `application-${new Date().toISOString()}.log`,
          format: winston.format.combine(
            winston.format.timestamp(),
            winston.format.json(),
          ),
          maxsize: 5242880,
          maxFiles: 5,
        }),
      ],
    }),
  ],
  controllers: [],
  providers: [],
  exports: [NestWinstonModule],
})
export class WinstonModule {}
