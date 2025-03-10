import { Module } from '@nestjs/common';
import GithubService from './github.service';
import { GithubResolver } from './github.resolver';

@Module({
  providers: [GithubService, GithubResolver],
})
export class GithubModule {}
