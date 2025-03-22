import { Status } from '@/shared/enums/base-response';
import { createUnionType, Field, InputType, ObjectType } from '@nestjs/graphql';

@ObjectType({
  description: 'The result of adding environments',
})
export class AddEnvironmentsSuccess {
  @Field(() => Status, {
    description: 'The status of the result',
    defaultValue: Status.SUCCESS,
  })
  status: Status = Status.SUCCESS;
}

@ObjectType({
  description: 'The error result of adding environments',
})
export class AddEnvironmentsError {
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

@InputType('AddEnvironmentsInput', {
  description: 'The input for adding environments',
})
export class AddEnvironmentsInput {
  @Field(() => String, {
    description: 'The name of the environment',
  })
  name: string;

  @Field(() => String, {
    description: 'The description of the environment',
    nullable: true,
  })
  description?: string;
}

export const AddEnvironmentsResult = createUnionType({
  name: 'AddEnvironmentsResult',
  types: () => [AddEnvironmentsSuccess, AddEnvironmentsError],
  resolveType(value) {
    if (value.status === Status.SUCCESS) {
      return AddEnvironmentsSuccess;
    }
    return AddEnvironmentsError;
  },
});
