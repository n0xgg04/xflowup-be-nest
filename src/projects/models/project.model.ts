import { Status } from '@/shared/enums/base-response';
import { Field, ObjectType, createUnionType } from '@nestjs/graphql';

@ObjectType()
export class Project {
  @Field(() => String)
  id: string;

  @Field(() => String)
  name: string;

  @Field(() => String)
  url: string;

  @Field(() => Date)
  created_at: Date;

  @Field(() => Date)
  updated_at: Date;
}

@ObjectType()
export class ProjectResponse {
  @Field(() => Status)
  result: Status;

  @Field(() => [Project])
  data: Project[];
}

@ObjectType()
export class ProjectSuccess extends ProjectResponse {}

@ObjectType()
export class ProjectError {
  @Field(() => Status)
  result: Status;

  @Field(() => String)
  message: string;
}

export const ProjectResult = createUnionType({
  name: 'ProjectResult',
  types: () => [ProjectSuccess, ProjectError] as const,
  resolveType(value) {
    if (value.message) {
      return ProjectError;
    }
    return ProjectSuccess;
  },
});
