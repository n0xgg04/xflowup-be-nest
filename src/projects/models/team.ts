import { Status } from '../../shared/enums/base-response';
import { createUnionType, Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class Team {
  @Field(() => String, {
    description: 'The slug of the project',
  })
  slug: string;

  @Field(() => [TeamMember], {
    description: 'The team members of the project',
  })
  members: TeamMember[];
}

@ObjectType()
export class TeamMember {
  @Field(() => String, {
    description: 'The email of the team member',
  })
  email: string;

  @Field(() => String, {
    description: 'The name of the team member',
  })
  name: string;

  @Field(() => String, {
    nullable: true,
    description: 'The profile URL of the team member',
  })
  profile_url?: string;
}

interface GetTeamResponse {
  status: Status;
}

@ObjectType()
export class GetTeamSuccess implements GetTeamResponse {
  @Field(() => Status, {
    defaultValue: Status.SUCCESS,
    description: 'The status of the response',
  })
  status: Status;

  @Field(() => Team, {
    description: 'The team members of the project',
  })
  team: Team;
}

@ObjectType()
export class GetTeamError implements GetTeamResponse {
  @Field(() => Status, {
    defaultValue: Status.ERROR,
    description: 'The status of the response',
  })
  status: Status;

  @Field(() => String, {
    description: 'The error message',
  })
  message: string;
}

export const GetTeamResult = createUnionType({
  name: 'GetTeamResult',
  types: () => [GetTeamSuccess, GetTeamError] as const,
  resolveType(value) {
    if ((value as GetTeamError).message) {
      return GetTeamError;
    }
    return GetTeamSuccess;
  },
});
