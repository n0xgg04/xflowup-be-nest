import { PrismaModule } from '@/prisma/prisma.module';
import { EnvironmentsModule } from './environments/environments.module';
import { ProjectResolver } from './project.resolver';
import { ProjectService } from './project.service';
import { ServiceManagementModule } from './service-management/service-management.module';
import { Module } from '@nestjs/common';

@Module({
  imports: [
    EnvironmentsModule,
    ServiceManagementModule,
    PrismaModule,
    EnvironmentsModule,
  ],
  controllers: [],
  providers: [ProjectService, ProjectResolver],
  exports: [],
})
export class ProjectModule {}
