import { Args, Query } from '@nestjs/graphql';
import { Repository } from './models/repository';
import GithubService from './github.service';

export class GithubResolver {
  constructor(private readonly githubService: GithubService) {}

  @Query(() => [Repository])
  async repositories(
    @Args('username') username: string,
  ): Promise<Repository[]> {
    return this.githubService.getRepositories(username);
  }
}
