import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { MailgunService } from 'nestjs-mailgun';
import { renderFile } from 'pug';

@Injectable()
export class MailService {
  constructor(
    private readonly mailgunService: MailgunService,
    private readonly configService: ConfigService,
  ) {}

  async sendEmail(to: string, subject: string, text: string, html?: string) {
    await this.mailgunService.createEmail(
      this.configService.get('MAILGUN_DOMAIN')!,
      {
        from: this.configService.get('MAILGUN_FROM')!,
        to: to,
        subject: subject,
        text: text,
        html: html,
      },
    );
  }

  async sendEmailWithTemplate(
    to: string,
    subject: string,
    template: string,
    variables?: Record<string, string>,
  ) {
    const html = renderFile(
      `${__dirname}/template/${template}.pug`,
      variables ?? {},
    );
    await this.mailgunService.createEmail(
      this.configService.get('MAILGUN_DOMAIN')!,
      {
        from: this.configService.get('MAILGUN_FROM')!,
        to: to,
        subject: subject,
        html: html,
      },
    );
  }
}
