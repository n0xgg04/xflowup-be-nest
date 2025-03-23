import { Status } from '../../shared/enums/base-response';
import { createUnionType, Field, Int, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class CreateProjectData {
  @Field(() => String)
  id: string;

  @Field(() => String)
  name: string;

  @Field(() => String, { nullable: true })
  description?: string;

  @Field(() => String, { nullable: true })
  url?: string;

  @Field(() => String)
  slug: string;
}

@ObjectType()
export class CreateProjectSuccess {
  @Field(() => Status)
  status: Status;

  @Field(() => CreateProjectData)
  data: CreateProjectData;
}

@ObjectType()
export class CreateProjectError {
  @Field(() => Status)
  status: Status;

  @Field(() => String)
  message: string;
}

export const CreateProjectResult = createUnionType({
  name: 'CreateProjectResult',
  types: () => [CreateProjectSuccess, CreateProjectError] as const,
  resolveType(value) {
    if (value.message) {
      return CreateProjectError;
    }
    return CreateProjectSuccess;
  },
});
