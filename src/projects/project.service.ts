import { PrismaService } from '../prisma/prisma.service';
import { Injectable } from '@nestjs/common';
import { ProjectResult } from './models/project.model';
import { Status } from '../shared/enums/base-response';
import { GetTeamResult } from './models/team';
import { CreateProjectResult } from './models/create-project.model';
import { uuid4 } from '@sentry/core';
import { DeleteProjectResult } from './models/delete-project.model';
import { AddTeamMemberResult } from './models/add-team-member';
import { AddTeamMemberInput } from './models/add-team-member';
import { MailService } from '../mail/mail.service';
import { CacheManagerService } from '../cache/cache.service';
@Injectable()
export class ProjectService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly cacheManagerService: CacheManagerService,
    private readonly mailService: MailService,
    private readonly cacheService: CacheManagerService,
  ) {}

  async list(user: User): Promise<typeof ProjectResult> {
    try {
      const projects = await this.cacheManagerService.remember(
        `projects:${user.id}`,
        () =>
          this.prismaService.projects.findMany({
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
              slug: true,
              created_at: true,
              updated_at: true,
            },
          }),
        1000 * 60 * 60,
      );

      return {
        result: Status.SUCCESS,
        data: projects.map((project) => ({
          id: project.id.toString(),
          name: project.name,
          url: project.url,
          slug: project.slug,
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
      const project = await this.prismaService.$transaction(async (prisma) => {
        const newProject = await prisma.projects.create({
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

        await this.cacheManagerService.del(`projects:${user.id}`);

        return newProject;
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

  async delete_project(
    user: User,
    slug: string,
  ): Promise<typeof DeleteProjectResult> {
    try {
      await this.prismaService.$transaction(async (prisma) => {
        await prisma.projects.delete({
          where: {
            slug,
            team: {
              UserInTeam: {
                some: {
                  user_id: user.id,
                },
              },
            },
          },
        });

        await this.cacheManagerService.del(`projects:${user.id}`);
      });

      return {
        status: Status.SUCCESS,
        message: 'Project deleted successfully',
      };
    } catch (error) {
      return {
        status: Status.ERROR,
        message: String((error as Error).message),
      };
    }
  }

  async add_team_member(
    user: User,
    project_slug: string,
    input: AddTeamMemberInput,
  ): Promise<typeof AddTeamMemberResult> {
    try {
      await this.prismaService.$transaction(async (prisma) => {
        const teams = await prisma.teams.findUnique({
          where: {
            slug: project_slug,
            UserInTeam: {
              some: {
                user_id: user.id,
              },
            },
          },
        });

        if (!teams) {
          return {
            status: Status.ERROR,
            message: 'Project not found',
          };
        }

        const teamMemberCount = await prisma.users.count({
          where: {
            email: input.email,
          },
        });

        if (teamMemberCount > 0) {
          return {
            status: Status.ERROR,
            message: 'Team member already exists',
          };
        }

        const member = await prisma.users.findUnique({
          where: {
            email: input.email,
          },
        });

        if (!member) {
          return {
            status: Status.ERROR,
            message: 'User not found',
          };
        }

        const project = await prisma.projects.findUnique({
          where: {
            slug: project_slug,
          },
          select: {
            name: true,
          },
        });

        if (!project) {
          return {
            status: Status.ERROR,
            message: 'Project not found',
          };
        }

        const permissions = await this.cacheService.remember(
          `permissions:all`,
          async () =>
            await prisma.permissions.findMany({
              where: {
                id: {
                  in: input.permissions,
                },
              },
              select: {
                id: true,
              },
            }),
        );

        if (permissions.length !== input.permissions.length) {
          return {
            status: Status.ERROR,
            message: 'Invalid permissions',
          };
        }

        await prisma.userInTeam.create({
          data: {
            team_id: teams.id,
            user_id: user.id,
            permissions: {
              createMany: {
                data: input.permissions.map((permission) => ({
                  permissionId: permission,
                })),
              },
            },
          },
        });

        await this.mailService.sendEmailWithTemplate(
          input.email,
          `You are invited to ${project.name} on XFlowUp!`,
          'invite',
          {
            inviter_name: user.name,
            name: member.name,
            project_name: project.name,
            project_url: `${process.env.FRONTEND_URL}/projects/${project_slug}`,
          },
        );
      });

      return {
        status: Status.SUCCESS,
        message: 'Invited to the project',
      };
    } catch (error) {
      return {
        status: Status.ERROR,
        message: String((error as Error).message),
      };
    }
  }
}
