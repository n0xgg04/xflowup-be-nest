import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Inject, Injectable } from '@nestjs/common';
import { Cache } from '@nestjs/cache-manager';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class CacheManagerService {
  constructor(
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    private readonly configService: ConfigService,
  ) {}

  async get<T>(key: string): Promise<T | null> {
    const value = await this.cacheManager.get<T>(key);
    return value;
  }

  async set(key: string, value: string, ttl?: number): Promise<void> {
    await this.cacheManager.set(key, value, ttl);
  }

  async del(key: string): Promise<void> {
    await this.cacheManager.del(key);
  }

  async remember<T>(
    key: string,
    callback: () => Promise<T>,
    ttl?: number,
  ): Promise<T> {
    const value = await this.get<T>(key);
    if (value) {
      return JSON.parse(
        value as string,
        (_, value): string | number | boolean | null | object =>
          typeof value === 'string' &&
          value.match(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/)
            ? new Date(value)
            : value,
      ) as T;
    }
    const result = await callback();
    await this.set(
      key,
      JSON.stringify(
        result,
        (_, value): string | number | boolean | null | object =>
          typeof value === 'bigint' ? value.toString() : value,
      ),
      ttl ?? Number(this.configService.get<number>('CACHE_DEFAULT_TTL')),
    );
    return result;
  }
}
