import {
  createUnionType,
  Field,
  InputType,
  Int,
  ObjectType,
} from '@nestjs/graphql';
import { Status } from '../../shared/enums/base-response';

@InputType('AddTeamMemberInput')
@ObjectType()
export class AddTeamMemberInput {
  @Field(() => String)
  email: string;

  @Field(() => [Int])
  permissions: number[];
}

@ObjectType()
export class AddTeamMemberSuccessResult {
  @Field(() => String, {
    description: 'The email of the team member',
  })
  email: string;

  @Field(() => Status, {
    defaultValue: Status.SUCCESS,
    description: 'The status of the response',
  })
  status: Status;
}

@ObjectType()
export class AddTeamMemberErrorResult {
  @Field(() => Status, {
    defaultValue: Status.ERROR,
    description: 'The status of the response',
  })
  status: Status;

  @Field(() => String, {
    description: 'The error message',
  })
  message?: string;
}

export const AddTeamMemberResult = createUnionType({
  name: 'AddTeamMemberResult',
  types: () => [AddTeamMemberSuccessResult, AddTeamMemberErrorResult] as const,
  resolveType(value) {
    if (value.status === Status.ERROR) {
      return AddTeamMemberErrorResult;
    }
    return AddTeamMemberSuccessResult;
  },
});
