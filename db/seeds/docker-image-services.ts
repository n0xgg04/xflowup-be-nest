import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
(async () => {
  const dockerImageServices = await prisma.dockerImageServices.findMany();
  if (dockerImageServices.length > 0) {
    return;
  }
  await prisma.dockerImageServices.createMany({
    data: [
      {
        name: 'MySQL',
        image_name: 'mysql',
        image_url: 'https://hub.docker.com/_/mysql',
        icon: 'https://hub.docker.com/_/mysql',
      },
      {
        name: 'PostgreSQL',
        image_name: 'postgres',
        image_url: 'https://hub.docker.com/_/postgres',
        icon: 'https://hub.docker.com/_/postgres',
      },
      {
        name: 'Redis',
        image_name: 'redis',
        image_url: 'https://hub.docker.com/_/redis',
        icon: 'https://hub.docker.com/_/redis',
      },
    ],
  });

  console.info('[SEED] Created docker image services');
})();
