import { Module } from '@nestjs/common';
import { OctokitService } from './octokit-service.service';

@Module({
  imports: [],
  controllers: [],
  providers: [OctokitService],
  exports: [OctokitService],
})
export class OctokitModule {}
