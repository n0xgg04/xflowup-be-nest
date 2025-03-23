import { Global, Module } from '@nestjs/common';
import { ServiceManagementService } from './service-management.service';
import { ServiceManagementResolver } from './service-management.resolver';
import { PrismaModule } from '../../prisma/prisma.module';

@Global()
@Module({
  imports: [PrismaModule],
  controllers: [],
  providers: [ServiceManagementService, ServiceManagementResolver],
  exports: [],
})
export class ServiceManagementModule {}
