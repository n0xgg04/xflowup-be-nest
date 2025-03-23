import { Controller, Get, Req, Res, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import AuthService from './auth.service';
import { Request, Response } from 'express';
import { ConfigService } from '@nestjs/config';
import { User } from '../decorators/user.decorator';

@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private configService: ConfigService,
  ) {}

  @Get('github')
  @UseGuards(AuthGuard('github'))
  public async githubLogin() {}

  @Get('github/callback')
  @UseGuards(AuthGuard('github'))
  public async githubCallback(@Res() res: Response, @User() user: User) {
    console.log(user);
    try {
      if (!user) {
        return res.redirect(
          `${this.configService.get('FRONTEND_URL', 'http://localhost:3000')}/auth/failed`,
        );
      }

      const { accessToken } = await this.authService.login(user);

      return res.send(`
        <script>
          window.location.href = "${this.configService.get('FRONTEND_URL', 'http://localhost:3000')}/auth/callback?access_token=${accessToken}";
        </script>
      `);
    } catch (error) {
      return res.redirect(
        `${this.configService.get('FRONTEND_URL', 'http://localhost:3000')}/auth/failed`,
      );
    }
  }
}
