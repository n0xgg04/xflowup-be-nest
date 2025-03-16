import { Controller, Get, UseGuards, Req } from '@nestjs/common';
import { AuthGuard } from './auth.guard';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';

@Controller('auth-debug')
export class AuthDebugController {
  constructor(private readonly jwtService: JwtService) {}

  @Get('token-info')
  tokenInfo(@Req() req: any) {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return { error: 'No token provided' };
    }

    const token = authHeader.substring(7);
    try {
      const decoded = this.jwtService.decode(token);
      return { decoded };
    } catch (error) {
      return { error: 'Invalid token' };
    }
  }

  @Get('user')
  @UseGuards(AuthGuard)
  getUser(@Req() req: Request) {
    return { user: req.user };
  }
}
