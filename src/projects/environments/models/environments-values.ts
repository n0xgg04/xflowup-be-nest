import { createUnionType, Field, InputType, ObjectType } from '@nestjs/graphql';
import { Environment } from './environments';
import { Status } from '../../../shared/enums/base-response';

@InputType('GetEnvironmentValuesInput')
@ObjectType({
  description: 'Input for getting environment values',
})
export class GetEnvironmentValuesInput {
  @Field(() => String, {
    description: 'The id of the environment',
  })
  environmentId: string;

  @Field(() => String, {
    description: 'The slug of the project',
  })
  projectSlug: string;
}

@ObjectType({
  description: 'The result of getting environment values',
})
export class GetEnvironmentValuesSuccessResult {
  @Field(() => [Environment], {
    description: 'The environment values',
  })
  environmentValues: Environment[];

  @Field(() => Status, {
    description: 'The status of the result',
    defaultValue: Status.SUCCESS,
  })
  status: Status = Status.SUCCESS;
}

@ObjectType({
  description: 'The error result of getting environment values',
})
export class GetEnvironmentValuesErrorResult {
  @Field(() => Status, {
    description: 'The status of the result',
    defaultValue: Status.ERROR,
  })
  status: Status = Status.ERROR;

  @Field(() => String, {
    description: 'The error message',
    nullable: true,
  })
  message?: string;
}

export const GetEnvironmentValuesResult = createUnionType({
  name: 'GetEnvironmentValuesResult',
  types: () => [
    GetEnvironmentValuesSuccessResult,
    GetEnvironmentValuesErrorResult,
  ],
  resolveType(value) {
    if (value instanceof GetEnvironmentValuesSuccessResult) {
      return GetEnvironmentValuesSuccessResult;
    }
    return GetEnvironmentValuesErrorResult;
  },
});
