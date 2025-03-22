import { Status } from '@/shared/enums/base-response';
import { Field, InputType, ObjectType, createUnionType } from '@nestjs/graphql';

@ObjectType('Environment')
@InputType('EnvironmentInput')
export class Environment {
  @Field(() => String, {
    description: 'The id of the environment',
  })
  id: string;

  @Field(() => String, {
    description: 'The name of the environment',
  })
  name: string;
}

@ObjectType({
  description: 'The result of getting environments',
})
export class GetEnvironmentsSuccess {
  @Field(() => [Environment])
  environments: Environment[];

  @Field(() => Status, {
    description: 'The status of the result',
    defaultValue: Status.SUCCESS,
  })
  status: Status;
}

@ObjectType({
  description: 'The error result of getting environments',
})
export class GetEnvironmentsError {
  @Field(() => Status, {
    description: 'The status of the result',
    defaultValue: Status.ERROR,
  })
  status: Status;

  @Field(() => String, {
    description: 'The error message',
    nullable: true,
  })
  message?: string;
}

export const GetEnvironmentsResult = createUnionType({
  name: 'GetEnvironmentsResult',
  types: () => [GetEnvironmentsSuccess, GetEnvironmentsError],
  resolveType(value) {
    if (value.status === Status.SUCCESS) {
      return GetEnvironmentsSuccess;
    }
    return GetEnvironmentsError;
  },
});
