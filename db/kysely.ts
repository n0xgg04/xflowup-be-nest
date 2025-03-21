import { Pool } from 'pg';
import { Kysely, PostgresDialect } from 'kysely';
import { DB } from 'prisma-kysely';

// Create a PostgreSQL dialect using the pg driver
const dialect = new PostgresDialect({
  pool: new Pool({
    connectionString: process.env.DATABASE_URL,
    max: 10,
  }),
});

const db = new Kysely<DB>({
  dialect,
});

export default db;
