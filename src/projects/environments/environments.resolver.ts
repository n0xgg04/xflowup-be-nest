import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { EnvironmentsService } from './environments.service';
import { GetEnvironmentsResult } from './models/environments';
import { AuthGuard } from '../../users/auth/auth.guard';
import { UseGuards } from '@nestjs/common';
import { CurrentUser } from '../../users/auth/current-user.decorator';
import {
  AddEnvironmentsInput,
  AddEnvironmentsResult,
} from './models/add-environments';
import {
  GetEnvironmentValuesInput,
  GetEnvironmentValuesResult,
} from './models/environments-values';
import { WithProjectAccess } from 'src/users/decorators/project-access-apply';
import { ProjectPermission } from 'src/users/roles';
import { Permissions } from 'src/users/decorators/permission';

@UseGuards(AuthGuard)
@Resolver()
export class EnvironmentsResolver {
  constructor(private readonly environmentsService: EnvironmentsService) {}

  @Query(() => GetEnvironmentsResult, {
    description: 'Get all environments in a project',
  })
  async environments(
    @CurrentUser() user: User,
    @Args('project_slug', { type: () => String }) project_slug: string,
  ) {
    return this.environmentsService.allEnvironments(user, project_slug);
  }

  @Permissions([
    ProjectPermission.READ,
    ProjectPermission.OWNER,
    ProjectPermission.MANAGE_ENVIRONMENT,
    ProjectPermission.MANAGE_PROJECT,
  ])
  @WithProjectAccess()
  @Query(() => GetEnvironmentValuesResult, {
    description: 'Get environment values',
  })
  async environment_values(
    @CurrentUser() user: User,
    @Args('input', { type: () => GetEnvironmentValuesInput })
    input: GetEnvironmentValuesInput,
  ): Promise<typeof GetEnvironmentValuesResult> {
    return this.environmentsService.getEnvironmentValues(user, input);
  }

  @Permissions([
    ProjectPermission.OWNER,
    ProjectPermission.MANAGE_ENVIRONMENT,
    ProjectPermission.MANAGE_PROJECT,
  ])
  @WithProjectAccess()
  @Mutation(() => AddEnvironmentsResult, {
    description: 'Add an environment to a project',
  })
  async add_environment(
    @CurrentUser() user: User,
    @Args('project_slug', { type: () => String }) project_slug: string,
    @Args('environment', { type: () => AddEnvironmentsInput })
    environment: AddEnvironmentsInput,
  ): Promise<typeof AddEnvironmentsResult> {
    return this.environmentsService.addEnvironments(
      user,
      project_slug,
      environment,
    );
  }
}
