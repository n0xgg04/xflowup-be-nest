import { Module } from '@nestjs/common';
import { AuthResolver } from './auth.resolver';
import AuthService from './auth.service';
import { AuthController } from './auth.controller';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { GithubStrategy } from './github.strategy';
import { JwtStrategy } from './jwt.strategy';
import { PrismaModule } from '../../prisma/prisma.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthGuard } from './auth.guard';
import { AuthDebugController } from './auth-debug.controller';

@Module({
  providers: [
    AuthResolver,
    AuthService,
    GithubStrategy,
    JwtStrategy,
    AuthGuard,
  ],
  imports: [
    PrismaModule,
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get('JWT_SECRET', 'superSecretKey'),
        signOptions: {},
      }),
    }),
  ],
  exports: [AuthService, AuthGuard, JwtModule],
  controllers: [AuthController, AuthDebugController],
})
export class AuthModule {}
