import { ConfigService } from '@nestjs/config';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { MailResponse, MailVariables } from './models/send';
import { MailService } from './mail.service';
@Resolver()
export class MailResolver {
  constructor(private readonly mailService: MailService) {}

  @Mutation(() => MailResponse)
  async send_email(
    @Args('to') to: string,
    @Args('subject') subject: string,
    @Args('text') text: string,
    @Args('html', {
      nullable: true,
    })
    html?: string,
  ): Promise<MailResponse> {
    try {
      await this.mailService.sendEmail(to, subject, text, html);
      return {
        success: true,
        message: 'Email sent successfully',
      };
    } catch (error) {
      return {
        success: false,
        message: error.message,
      };
    }
  }

  @Mutation(() => MailResponse)
  async send_email_with_template(
    @Args('to') to: string,
    @Args('subject') subject: string,
    @Args('template') template: string,
    @Args('variables', {
      nullable: true,
      type: () => [MailVariables],
    })
    variables?: MailVariables[],
  ): Promise<MailResponse> {
    try {
      await this.mailService.sendEmailWithTemplate(
        to,
        subject,
        template,
        variables?.reduce(
          (acc, variable) => {
            acc[variable.name] = variable.value;
            return acc;
          },
          {} as Record<string, string>,
        ),
      );
      return {
        success: true,
        message: 'Email sent successfully',
      };
    } catch (error) {
      return {
        success: false,
        message: error.message + ' ' + error.stack,
      };
    }
  }
}
