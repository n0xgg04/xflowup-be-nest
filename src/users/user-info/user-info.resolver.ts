import { Query, Resolver } from '@nestjs/graphql';
import { UserInfoService } from './user-info.service';
import { UserInfo } from './models/user-info';
import { UseGuards } from '@nestjs/common';
import { AuthGuard } from '@/users/auth/auth.guard';
import { CurrentUser } from '@/users/auth/current-user.decorator';

@Resolver()
export class UserInfoResolver {
  constructor(private readonly userInfoService: UserInfoService) {}

  @Query(() => UserInfo)
  @UseGuards(AuthGuard)
  async userInfo(@CurrentUser() user: User) {
    if (!user) {
      throw new Error('User not authenticated');
    }
    return this.userInfoService.userInfo(user);
  }
}
