import { PrismaService } from '../../prisma/prisma.service';
import { Injectable } from '@nestjs/common';
import { GetDatabaseServiceResult } from './models/get-database-service';
import { Status } from '../../shared/enums/base-response';
import { CacheManagerService } from '../../cache/cache.service';
@Injectable()
export class ServiceManagementService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly cacheManager: CacheManagerService,
  ) {}

  async getDatabaseServices(): Promise<typeof GetDatabaseServiceResult> {
    try {
      const databaseServices = await this.cacheManager.remember(
        'database-services',
        async () => {
          return await this.prisma.dockerImageServices.findMany();
        },
        60 * 60 * 24,
      );

      return {
        status: Status.SUCCESS,
        data: databaseServices.map((service) => ({
          id: service.id.toString(),
          name: service.name,
          icon: service.icon,
        })),
      };
    } catch (error) {
      return {
        status: Status.ERROR,
        message: error.message ?? 'Internal server error',
      };
    }
  }
}
