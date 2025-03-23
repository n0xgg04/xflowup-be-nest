import { Field, InputType, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class MailResponse {
  @Field(() => Boolean)
  success: boolean;

  @Field(() => String, {
    nullable: true,
  })
  message?: string;
}

@InputType('MailVariables')
@ObjectType()
export class MailVariables {
  @Field(() => String)
  name: string;

  @Field(() => String)
  value: string;
}
