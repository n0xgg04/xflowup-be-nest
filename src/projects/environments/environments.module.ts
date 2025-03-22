import { Module } from '@nestjs/common';
import { EnvironmentsResolver } from './environments.resolver';
import { EnvironmentsService } from './environments.service';
import { PrismaModule } from '@/prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [],
  providers: [EnvironmentsService, EnvironmentsResolver],
  exports: [],
})
export class EnvironmentsModule {}
