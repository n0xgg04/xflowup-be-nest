import { PrismaService } from '../../prisma/prisma.service';
import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { Reflector } from '@nestjs/core';
import { ProjectPermission } from '../roles';

@Injectable()
export class ProjectAccess implements CanActivate {
  constructor(
    private readonly prisma: PrismaService,
    private readonly reflector: Reflector,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const ctx = GqlExecutionContext.create(context);
    const { user } = ctx.getContext().req;

    const projectSlug =
      ctx.getContext().req.body.variables.slug ??
      ctx.getContext().req.body.variables.project_slug;

    const requiredPermissions = this.reflector.get<ProjectPermission[]>(
      'permissions:required',
      context.getHandler(),
    );

    const project = await this.prisma.projects.findUnique({
      where: {
        slug: projectSlug,
        team: {
          UserInTeam: {
            some: {
              user_id: user.id,
              permissions: {
                some: {
                  permission: {
                    id: {
                      in: requiredPermissions,
                    },
                  },
                },
              },
            },
          },
        },
      },
    });

    if (!project) {
      throw new UnauthorizedException(
        'You are not a member of this project or this project does not exist.',
      );
    }

    return true;
  }
}
