import { Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { DB } from 'db/types';
import { Kysely, PostgresDialect } from 'kysely';
import { Pool } from 'pg';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  public db: Kysely<DB>;

  constructor(private configService: ConfigService) {
    super();
  }

  async onModuleInit() {
    await this.$connect();
    if (!this.db) {
      const pool = new Pool({
        connectionString: this.configService.get('DATABASE_URL'),
      });

      this.db = new Kysely<DB>({
        dialect: new PostgresDialect({
          pool,
        }),
      });
    }
  }
}
