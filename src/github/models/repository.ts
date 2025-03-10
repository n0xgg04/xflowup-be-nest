import { ObjectType, Field } from '@nestjs/graphql';

@ObjectType()
export class Repository {
  @Field()
  id: number;

  @Field()
  name: string;

  @Field()
  url: string;
}
