import { Controller, Get, Logger, Res } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Response } from 'express';

@Controller('auth-debug')
export class AuthDebugController {
  private readonly logger = new Logger(AuthDebugController.name);

  constructor(private configService: ConfigService) {}

  @Get('github-config')
  async checkGithubConfig(@Res() res: Response) {
    const clientID = this.configService.get<string>('GITHUB_CLIENT_ID');
    const clientSecret = this.configService.get<string>('GITHUB_CLIENT_SECRET');
    const callbackURL = this.configService.get<string>('GITHUB_CALLBACK_URL');
    const frontendURL = this.configService.get<string>('FRONTEND_URL');

    const checkResult = {
      clientID: !!clientID,
      clientIDLength: clientID?.length || 0,
      clientSecret: !!clientSecret,
      clientSecretLength: clientSecret?.length || 0,
      callbackURL,
      frontendURL,
    };

    this.logger.debug('GitHub OAuth configuration check', checkResult);

    return res.json({
      status: 'Debug information collected',
      config: checkResult,
      checksPassed: !!(clientID && clientSecret && callbackURL),
      info: `The callback URL (${callbackURL}) must match the one registered in GitHub OAuth app settings exactly.`,
    });
  }
}
