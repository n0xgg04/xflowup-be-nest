import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class UserInfo {
  @Field(() => String, { description: 'The name of the user' })
  name: string;

  @Field(() => String, { description: 'The email of the user' })
  email: string;

  @Field(() => String, {
    nullable: true,
    description: 'The avatar URL of the user',
  })
  profile_pic_url?: string;
}
