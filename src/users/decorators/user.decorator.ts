import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';

export const User = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): User => {
    const gqlContext = GqlExecutionContext.create(ctx);
    const request = gqlContext.getContext().req;
    return request.user as User;
  },
);
