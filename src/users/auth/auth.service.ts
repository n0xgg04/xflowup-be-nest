import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export default class AuthService {
  constructor(
    private prismaService: PrismaService,
    private jwtService: JwtService,
  ) {}

  async validateGithubUser(profile: GithubUserProfile) {
    const email = profile.emails?.[0]?.value;

    if (!email) {
      throw new Error('GitHub profile does not have an email');
    }

    const user = await this.prismaService.db
      .selectFrom('Users')
      .where('email', '=', email)
      .selectAll()
      .executeTakeFirst();

    if (user) {
      return await this.prismaService.db
        .updateTable('Users')
        .set({
          name: profile.displayName || profile.username || user.name,
          profile_pic_url: profile.photos?.[0]?.value || user.profile_pic_url,
          updated_at: new Date(),
        })
        .where('email', '=', email)
        .returningAll()
        .executeTakeFirstOrThrow();
    } else {
      const defaultPlan = await this.prismaService.db
        .selectFrom('Plan')
        .select('id')
        .limit(1)
        .executeTakeFirst();

      if (!defaultPlan) {
        throw new Error('No plan found in the database');
      }

      return await this.prismaService.db
        .insertInto('Users')
        .values({
          email: email,
          name: profile.displayName || profile.username || '',
          profile_pic_url: profile.photos?.[0]?.value || '',
          current_plan: defaultPlan.id,
          created_at: new Date(),
          updated_at: new Date(),
        })
        .returningAll()
        .executeTakeFirstOrThrow();
    }
  }

  async login(user: User) {
    const payload = { email: user.email, sub: user.id };
    return {
      accessToken: this.jwtService.sign(payload),
      user,
    };
  }
}
