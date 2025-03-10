import { Injectable } from '@nestjs/common';
import { Resolver, Query, Args } from '@nestjs/graphql';

@Resolver()
export class AuthResolver {
  @Query(() => String)
  async addUser(@Args('email') email: string): Promise<string> {
    return `User with email ${email} has been created`;
  }
}
