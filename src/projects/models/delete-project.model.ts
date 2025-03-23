import { createUnionType, ObjectType } from '@nestjs/graphql';
import { Status } from '../../shared/enums/base-response';
import { Field } from '@nestjs/graphql';

@ObjectType()
export class DeleteProjectSuccess {
  @Field(() => Status)
  status: Status;

  @Field(() => String)
  message: string;
}

@ObjectType()
export class DeleteProjectError {
  @Field(() => Status)
  status: Status;

  @Field(() => String)
  message: string;
}

export const DeleteProjectResult = createUnionType({
  name: 'DeleteProjectResult',
  types: () => [DeleteProjectSuccess, DeleteProjectError] as const,
  resolveType(value) {
    if (value instanceof DeleteProjectSuccess) {
      return DeleteProjectSuccess;
    }
    return DeleteProjectError;
  },
});
