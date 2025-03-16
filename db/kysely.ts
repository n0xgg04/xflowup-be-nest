import { Kysely, PostgresDialect } from 'kysely';
import { Pool } from 'pg';
import { DB } from './types';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

const db = new Kysely<DB>({
  dialect: new PostgresDialect({
    pool,
  }),
});

export default db;
