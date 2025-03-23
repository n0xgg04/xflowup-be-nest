import { PrismaService } from '../../prisma/prisma.service';
import { Injectable } from '@nestjs/common';
import { Environment, GetEnvironmentsResult } from './models/environments';
import { CacheManagerService } from '../../cache/cache.service';
import { Status } from '../../shared/enums/base-response';
import {
  AddEnvironmentsError,
  AddEnvironmentsInput,
  AddEnvironmentsResult,
  AddEnvironmentsSuccess,
} from './models/add-environments';
import {
  GetEnvironmentValuesInput,
  GetEnvironmentValuesResult,
} from './models/environments-values';

@Injectable()
export class EnvironmentsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly cacheManager: CacheManagerService,
  ) {}

  async allEnvironments(
    user: User,
    projectSlug: string,
  ): Promise<typeof GetEnvironmentsResult> {
    const isExisted = await this.prisma.projects.findUnique({
      where: {
        slug: projectSlug,
        team: {
          UserInTeam: {
            some: {
              user_id: user.id,
            },
          },
        },
      },
      select: {
        slug: true,
        ProjectsEnvironment: {
          select: {
            id: true,
            name: true,
            description: true,
          },
        },
      },
    });

    if (!isExisted) {
      return {
        status: Status.ERROR,
        message: 'Project not found or you are not a member of this project',
      };
    }

    return {
      status: Status.SUCCESS,
      environments: isExisted.ProjectsEnvironment.map((environment) => ({
        id: environment.id.toString(),
        name: environment.name,
        description: environment.description,
      })),
    };
  }

  async addEnvironments(
    user: User,
    projectSlug: string,
    environment: AddEnvironmentsInput,
  ): Promise<typeof AddEnvironmentsResult> {
    try {
      const environments = await this.prisma.projects.findUnique({
        where: {
          slug: projectSlug,
          team: {
            UserInTeam: {
              some: {
                user_id: user.id,
              },
            },
          },
        },
        select: {
          id: true,
          ProjectsEnvironment: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      });

      if (!environments) {
        return {
          status: Status.ERROR,
          message: 'Project not found or you are not a member of this project',
        } as AddEnvironmentsError;
      }

      const isExisted = environments.ProjectsEnvironment.find(
        (env) => env.name === environment.name,
      );

      if (isExisted) {
        return {
          status: Status.ERROR,
          message: 'Environment already exists',
        } as AddEnvironmentsError;
      }

      await this.prisma.projectsEnvironment.create({
        data: {
          name: environment.name,
          description: environment.description || '',
          projectId: environments.id,
        },
      });

      return {
        status: Status.SUCCESS,
      } as AddEnvironmentsSuccess;
    } catch (error) {
      return {
        status: Status.ERROR,
        message: error.message,
      } as AddEnvironmentsError;
    }
  }

  async getEnvironmentValues(
    user: User,
    input: GetEnvironmentValuesInput,
  ): Promise<typeof GetEnvironmentValuesResult> {
    return {
      status: Status.SUCCESS,
    };
  }
}
