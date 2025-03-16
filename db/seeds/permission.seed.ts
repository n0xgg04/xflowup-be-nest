import db from '../../db/kysely';

(async () => {
  const existed = await db
    .selectFrom('Permissions')
    .where('id', '=', '1')
    .executeTakeFirst();
  if (existed) {
    return;
  }

  await db
    .insertInto('Permissions')
    .values([
      {
        id: '1',
        name: 'owner',
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        id: '2',
        name: 'read_only',
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        id: '3',
        name: 'developer:manage_service',
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        id: '4',
        name: 'developer:manage_project',
        created_at: new Date(),
        updated_at: new Date(),
      },
    ])
    .execute();

  console.info('[SEED] Created permissions');
})();
