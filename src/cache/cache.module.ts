import { Global, Module } from '@nestjs/common';
import { CacheManagerService } from './cache.service';

@Global()
@Module({
  imports: [],
  controllers: [],
  providers: [CacheManagerService],
  exports: [CacheManagerService],
})
export class CacheManagerModule {}
