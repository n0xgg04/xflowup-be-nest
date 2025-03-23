import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { EnvironmentsService } from './environments.service';
import { Environment, GetEnvironmentsResult } from './models/environments';
import { AuthGuard } from '../../users/auth/auth.guard';
import { UseGuards } from '@nestjs/common';
import { CurrentUser } from '../../users/auth/current-user.decorator';
import {
  AddEnvironmentsInput,
  AddEnvironmentsResult,
} from './models/add-environments';

@UseGuards(AuthGuard)
@Resolver()
export class EnvironmentsResolver {
  constructor(private readonly environmentsService: EnvironmentsService) {}

  @Query(() => GetEnvironmentsResult)
  async environments(
    @CurrentUser() user: User,
    @Args('project_slug', { type: () => String }) project_slug: string,
  ) {
    return this.environmentsService.allEnvironments(user, project_slug);
  }

  @Mutation(() => AddEnvironmentsResult)
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
