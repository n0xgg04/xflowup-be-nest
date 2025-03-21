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

  @Query(() => ProjectResult, {
    description: 'Get all projects',
  })
  async all_projects(@CurrentUser() user: User) {
    return this.projectService.list(user);
  }

  @Query(() => GetTeamResult, {
    description: 'Get the team members of a project',
  })
  async team_members(
    @Args('slug', {
      description: 'The slug of the project',
    })
    slug: string,
    @CurrentUser() user: User,
  ) {
    return this.projectService.team_members(slug, user);
  }

  @Mutation(() => CreateProjectResult, {
    description: 'Create a new project',
  })
  async create_project(
    @CurrentUser() user: User,
    @Args('name', {
      description: 'The name of the project',
    })
    name: string,
    @Args('description', {
      description: 'The description of the project',
      nullable: true,
    })
    description?: string,
  ) {
    return null;
  }
}
