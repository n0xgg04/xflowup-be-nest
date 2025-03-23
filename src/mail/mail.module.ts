import { DynamicModule, Global, Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { MailgunModule } from 'nestjs-mailgun';
import { validateSync } from 'class-validator';
import { MailgunConfig } from './models/mailgun';
import { MailResolver } from './mail.resolver';
import { MailService } from './mail.service';

@Global()
@Module({
  providers: [ConfigService, MailResolver, MailService],
  imports: [
    MailgunModule.forAsyncRoot({
      useFactory: async (configService: ConfigService) => {
        const config = new MailgunConfig();
        config.key = configService.get<string>('MAILGUN_API_KEY', {
          infer: true,
        })!;
        config.url = configService.get<string>('MAILGUN_URL', { infer: true })!;
        config.timeout = configService.get<number>('MAILGUN_TIMEOUT', {
          infer: true,
        })!;

        const errors = validateSync(config);
        if (errors.length > 0) {
          throw new Error(
            errors
              .map((err) => Object.values(err.constraints ?? {}))
              .join(', '),
          );
        }

        return {
          username: 'api',
          key: config.key,
          timeout: config.timeout,
          url: config.url,
        };
      },
      inject: [ConfigService],
    }) as DynamicModule,
  ],
  exports: [MailgunModule, MailService],
})
export class MailModule {}
