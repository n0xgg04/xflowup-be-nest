import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../../prisma/prisma.service';
import { UserBannedException } from '../exceptions/UserBannedException';

interface JwtPayload {
  email: string;
  sub: string;
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly configService: ConfigService,
    private readonly prismaService: PrismaService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('JWT_SECRET') || 'superSecretKey',
    });
  }

  async validate(payload: JwtPayload) {
    const user = await this.prismaService.users.findUnique({
      where: { email: payload.email },
    });

    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    return user;
  }
}
