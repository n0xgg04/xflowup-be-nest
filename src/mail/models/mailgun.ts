import { IsDefined } from 'class-validator';

export class MailgunConfig {
  @IsDefined({ message: 'MAILGUN_API_KEY is not set' })
  key: string;

  @IsDefined({ message: 'MAILGUN_URL is not set' })
  url: string;

  @IsDefined({ message: 'MAILGUN_TIMEOUT is not set' })
  timeout: number;
}
