import { Module } from '@nestjs/common';
import { UserInfoService } from './user-info.service';
import { UserInfoResolver } from './user-info.resolver';
import { AuthModule } from '../auth/auth.module';
import { PrismaModule } from '../../prisma/prisma.module';

@Module({
  imports: [AuthModule, PrismaModule],
  controllers: [],
  providers: [UserInfoService, UserInfoResolver],
  exports: [],
})
export class UserInfoModule {}
