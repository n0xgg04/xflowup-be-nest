import { Query, Resolver } from '@nestjs/graphql';
import { ServiceManagementService } from './service-management.service';
import { GetDatabaseServiceResult } from './models/get-database-service';
import { AuthGuard } from '../../users/auth/auth.guard';
import { UseGuards } from '@nestjs/common';

@UseGuards(AuthGuard)
@Resolver()
export class ServiceManagementResolver {
  constructor(
    private readonly serviceManagementService: ServiceManagementService,
  ) {}

  @Query(() => GetDatabaseServiceResult, {
    description: 'Get all database services for creating new service',
  })
  async get_database_services(): Promise<typeof GetDatabaseServiceResult> {
    return this.serviceManagementService.getDatabaseServices();
  }
}
