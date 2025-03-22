import { Status } from '@/shared/enums/base-response';
import { Field, ObjectType, createUnionType } from '@nestjs/graphql';

@ObjectType({
  description: 'The project',
})
export class Project {
  @Field(() => String, {
    description: 'The id of the project',
  })
  id: string;

  @Field(() => String, {
    description: 'The name of the project',
  })
  name: string;

  @Field(() => String, {
    description: 'The slug of the project',
  })
  slug: string;

  @Field(() => String, {
    description: 'The url of the project',
  })
  url: string;

  @Field(() => Date, {
    description: 'The created at date of the project',
  })
  created_at: Date;

  @Field(() => Date, {
    description: 'The updated at date of the project',
  })
  updated_at: Date;
}

@ObjectType({
  description: 'The response of the project',
})
export class ProjectResponse {
  @Field(() => Status, {
    description: 'The status of the response',
  })
  result: Status;

  @Field(() => [Project])
  data: Project[];
}

@ObjectType({
  description: 'The success response of the project',
})
export class ProjectSuccess extends ProjectResponse {}

@ObjectType()
export class ProjectError {
  @Field(() => Status, {
    description: 'The status of the response',
  })
  result: Status;

  @Field(() => String, {
    description: 'The error message',
  })
  message: string;
}

export const ProjectResult = createUnionType({
  name: 'ProjectResult',
  types: () => [ProjectSuccess, ProjectError] as const,
  resolveType(value) {
    if ((value as ProjectError).message) {
      return ProjectError;
    }
    return ProjectSuccess;
  },
});
