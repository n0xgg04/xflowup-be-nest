import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { ProjectService } from './project.service';
import { ProjectResult } from './models/project.model';
import { UseGuards } from '@nestjs/common';
import { AuthGuard } from '../users/auth/auth.guard';
import { CurrentUser } from '../users/auth/current-user.decorator';
import { GetTeamResult } from './models/team';
import { CreateProjectResult } from './models/create-project.model';
import { DeleteProjectResult } from './models/delete-project.model';
import { WithProjectAccess } from '../users/decorators/project-access-apply';
import { Permissions } from '../users/decorators/permission';
import { ProjectPermission } from '../users/roles';
import {
  AddTeamMemberInput,
  AddTeamMemberResult,
} from './models/add-team-member';

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

  @Permissions([
    ProjectPermission.READ,
    ProjectPermission.OWNER,
    ProjectPermission.MANAGE_PROJECT,
  ])
  @WithProjectAccess()
  @Query(() => GetTeamResult, {
    description: 'Get the team members of a project',
  })
  async team_members(
    @Args('project_slug', {
      description: 'The slug of the project',
    })
    project_slug: string,
    @CurrentUser() user: User,
  ) {
    return this.projectService.team_members(project_slug, user);
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
    return this.projectService.create_project(user, name, description);
  }

  @Permissions([ProjectPermission.OWNER])
  @WithProjectAccess()
  @Mutation(() => DeleteProjectResult, {
    description: 'Delete a project',
  })
  async delete_project(
    @CurrentUser() user: User,
    @Args('slug', { description: 'The slug of the project' }) slug: string,
  ) {
    return this.projectService.delete_project(user, slug);
  }

  @Permissions([ProjectPermission.OWNER, ProjectPermission.MANAGE_PROJECT])
  @WithProjectAccess()
  @Mutation(() => AddTeamMemberResult, {
    description: 'Add a team member to a project',
  })
  async add_team_member(
    @CurrentUser() user: User,
    @Args('project_slug', {
      description: 'The slug of the project',
    })
    project_slug: string,
    @Args('member', {
      description: 'The member to add to the project',
    })
    member: AddTeamMemberInput,
  ) {
    return this.projectService.add_team_member(user, project_slug, member);
  }
}
