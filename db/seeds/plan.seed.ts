import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

(async () => {
  const plan = await prisma.plan.count({
    where: {
      id: 1,
    },
  });
  if (!plan) {
    await prisma.plan.create({
      data: {
        id: 1,
        name: 'Free',
        max_deployments: 10,
        max_projects: 10,
      },
    });
    console.info('[SEED] Created free plan');
  }
})();
