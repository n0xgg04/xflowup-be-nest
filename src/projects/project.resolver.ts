import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { ProjectService } from './project.service';
import { ProjectResult } from './models/project.model';
import { UseGuards } from '@nestjs/common';
import { AuthGuard } from '@/users/auth/auth.guard';
import { CurrentUser } from '@/users/auth/current-user.decorator';
import { GetTeamResult } from './models/team';
import { CreateProjectResult } from './models/create-project.model';

@UseGuards(AuthGuard)
@Resolver()
export class ProjectResolver {
  constructor(private readonly projectService: ProjectService) {}

  @Query(() => ProjectResult)
  async all_projects(@CurrentUser() user: User) {
    return this.projectService.list(user);
  }

  @Query(() => GetTeamResult)
  async team_members(@Args('slug') slug: string, @CurrentUser() user: User) {
    return this.projectService.team_members(slug, user);
  }

  @Mutation(() => CreateProjectResult)
  async create_project(
    @CurrentUser() user: User,
    @Args('name') name: string,
    @Args('description', { nullable: true }) description?: string,
  ) {
    return null;
  }
}
