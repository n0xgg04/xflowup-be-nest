import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class UserInfoService {
  constructor(private readonly prismaService: PrismaService) {}

  async userInfo(user: User) {
    if (!user) {
      throw new Error('User not authenticated');
    }

    return {
      email: user.email,
      name: user.name,
      profile_pic_url: user.profile_pic_url,
      current_plan: user.current_plan,
    };
  }
}
