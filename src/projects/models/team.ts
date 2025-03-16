import { Status } from '@/shared/enums/base-response';
import { createUnionType, Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class Team {
  @Field(() => String)
  slug: string;

  @Field(() => [TeamMember])
  members: TeamMember[];
}

@ObjectType()
export class TeamMember {
  @Field(() => String)
  email: string;

  @Field(() => String)
  name: string;

  @Field(() => String, { nullable: true })
  profile_url?: string;
}

interface GetTeamResponse {
  status: Status;
}

@ObjectType()
export class GetTeamSuccess implements GetTeamResponse {
  @Field(() => Status, { defaultValue: Status.SUCCESS })
  status: Status;

  @Field(() => Team)
  team: Team;
}

@ObjectType()
export class GetTeamError implements GetTeamResponse {
  @Field(() => Status, { defaultValue: Status.ERROR })
  status: Status;

  @Field(() => String)
  message: string;
}

export const GetTeamResult = createUnionType({
  name: 'GetTeamResult',
  types: () => [GetTeamSuccess, GetTeamError] as const,
  resolveType(value) {
    if (value.message) {
      return GetTeamError;
    }
    return GetTeamSuccess;
  },
});
