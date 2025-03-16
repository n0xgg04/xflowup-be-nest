import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/prisma/prisma.service';

@Injectable()
export class UserInfoService {
  constructor(private readonly prismaService: PrismaService) {}

  async userInfo(user: any) {
    if (!user) {
      throw new Error('User not authenticated');
    }

    return {
      id: user.id,
      email: user.email,
      name: user.name,
      avatar: user.avatar,
      public_url: user.public_url,
    };
  }
}
