import { PrismaService } from '@/prisma/prisma.service';
import { Injectable } from '@nestjs/common';
import { ProjectResult } from './models/project.model';
import { Status } from '@/shared/enums/base-response';
import { GetTeamResult } from './models/team';
import { CreateProjectResult } from './models/create-project.model';
import { uuid4 } from '@sentry/core';

@Injectable()
export class ProjectService {
  constructor(private readonly prismaService: PrismaService) {}

  async list(user: User): Promise<typeof ProjectResult> {
    try {
      const projects = await this.prismaService.projects.findMany({
        where: {
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
          name: true,
          url: true,
          created_at: true,
          updated_at: true,
        },
      });

      return {
        result: Status.SUCCESS,
        data: projects.map((project) => ({
          id: project.id.toString(),
          name: project.name,
          url: project.url,
          created_at: project.created_at,
          updated_at: project.updated_at,
        })),
      };
    } catch (error) {
      return {
        result: Status.ERROR,
        message: String((error as Error).message),
      };
    }
  }

  async team_members(slug: string, user: User): Promise<typeof GetTeamResult> {
    try {
      const team = await this.prismaService.teams.findUnique({
        where: {
          slug,
          UserInTeam: {
            some: {
              user_id: user.id,
            },
          },
        },
        include: {
          UserInTeam: {
            include: {
              user: {
                select: {
                  email: true,
                  profile_pic_url: true,
                  name: true,
                },
              },
            },
          },
        },
      });

      if (!team) {
        return {
          status: Status.ERROR,
          message: 'Team not found',
        };
      }

      return {
        status: Status.SUCCESS,
        team: {
          slug: team.slug,
          members: team.UserInTeam.map((user) => ({
            email: user.user.email,
            profile_url: user.user.profile_pic_url,
            name: user.user.name,
          })),
        },
      };
    } catch (error) {
      return {
        status: Status.ERROR,
        message: String((error as Error).message),
      };
    }
  }

  async create_project(
    user: User,
    name: string,
    description?: string,
  ): Promise<typeof CreateProjectResult> {
    try {
      const project = await this.prismaService.projects.create({
        data: {
          slug: uuid4(),
          name,
          url: '',
          description: description || '',
          team: {
            create: {
              slug: uuid4(),
              UserInTeam: {
                create: {
                  user_id: user.id,
                  permissions: {
                    create: {
                      permissionId: 1,
                    },
                  },
                },
              },
            },
          },
          ProjectsEnvironment: {
            create: {
              name: 'production',
              description: 'Production environment',
            },
          },
        },
      });

      return {
        status: Status.SUCCESS,
        data: {
          slug: String(project.slug),
          name: project.name,
          url: project.url,
          id: String(project.id),
          description: project.description,
        },
      };
    } catch (error) {
      return {
        status: Status.ERROR,
        message: String((error as Error).message),
      };
    }
  }
}
