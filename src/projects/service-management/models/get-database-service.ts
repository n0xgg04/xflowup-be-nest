import { Status } from '@/shared/enums/base-response';
import { createUnionType, Field, ObjectType } from '@nestjs/graphql';

@ObjectType({
  description: 'The success response for getting database services',
})
export class GetDatabaseServiceSuccess {
  @Field(() => Status)
  status: Status;

  @Field(() => [DatabaseService], {
    description: 'The database services',
  })
  data: DatabaseService[];
}

@ObjectType({
  description: 'The error response for getting database services',
})
export class GetDatabaseServiceError {
  @Field(() => Status)
  status: Status;

  @Field(() => String, {
    nullable: true,
  })
  message: string;
}

@ObjectType({
  description: 'The database service',
})
export class DatabaseService {
  @Field(() => String, {
    description: 'The id of the database service',
  })
  id: string;

  @Field(() => String, {
    description: 'The name of the database service',
  })
  name: string;

  @Field(() => String, {
    description: 'The icon of the database service',
  })
  icon: string;
}

export const GetDatabaseServiceResult = createUnionType({
  name: 'GetDatabaseServiceResult',
  types: () => [GetDatabaseServiceSuccess, GetDatabaseServiceError] as const,
  resolveType(value) {
    return value.status === Status.SUCCESS
      ? GetDatabaseServiceSuccess
      : GetDatabaseServiceError;
  },
  description: 'The result of getting database services',
});
