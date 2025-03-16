import { Inject, Injectable, Scope } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { Octokit } from '@octokit/rest';

@Injectable({ scope: Scope.REQUEST })
export class OctokitService {
  private octokitInstant: Octokit;

  constructor(@Inject(REQUEST) private readonly request: Request) {}

  onModuleInit() {
    this.octokitInstant = new Octokit({
      auth: this.request.headers.get('Authorization')?.split(' ')[1],
    });
  }

  octokit() {
    return this.octokitInstant;
  }
}
