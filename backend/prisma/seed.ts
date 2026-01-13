import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('Starting database seed...');

  // Hash passwords for test users
  const password123Hash = await bcrypt.hash('password123', 12);
  const propassword456Hash = await bcrypt.hash('propassword456', 12);

  // Create test users
  const user1 = await prisma.user.upsert({
    where: { email: 'john.doe@example.com' },
    update: {},
    create: {
      email: 'john.doe@example.com',
      password: password123Hash,
      name: 'John Doe',
      avatar: 'https://i.pravatar.cc/150?img=1',
      subscriptionTier: 'free',
      defaultRole: 'Backend Engineer',
      usageCount: {
        analyses: 0,
        matches: 0,
        rewrites: 0,
      },
      limits: {
        maxAnalyses: 1,
        maxMatches: 0,
        maxRewrites: 0,
      },
    },
  });

  const user2 = await prisma.user.upsert({
    where: { email: 'jane.smith@example.com' },
    update: {},
    create: {
      email: 'jane.smith@example.com',
      password: propassword456Hash,
      name: 'Jane Smith',
      avatar: 'https://i.pravatar.cc/150?img=2',
      subscriptionTier: 'pro',
      defaultRole: 'Fullstack Developer',
      usageCount: {
        analyses: 5,
        matches: 3,
        rewrites: 2,
      },
      limits: {
        maxAnalyses: 999999,
        maxMatches: 999999,
        maxRewrites: 999999,
      },
    },
  });

  console.log('Created test users:', { user1, user2 });
  console.log('\nTest Credentials:');
  console.log('User 1: john.doe@example.com / password123');
  console.log('User 2: jane.smith@example.com / propassword456');
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error('Error seeding database:', e);
    await prisma.$disconnect();
    process.exit(1);
  });
