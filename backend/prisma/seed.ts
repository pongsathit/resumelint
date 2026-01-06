import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // Clean existing data (for development only)
  console.log('Cleaning existing data...');
  await prisma.learningRoadmap.deleteMany();
  await prisma.careerGapAnalysis.deleteMany();
  await prisma.rewrite.deleteMany();
  await prisma.match.deleteMany();
  await prisma.analysis.deleteMany();
  await prisma.jobDescription.deleteMany();
  await prisma.resume.deleteMany();
  await prisma.accessToken.deleteMany();
  await prisma.refreshToken.deleteMany();
  await prisma.user.deleteMany();

  // Create test users
  console.log('Creating test users...');

  const user1 = await prisma.user.create({
    data: {
      id: 'user-1',
      email: 'john.doe@example.com',
      name: 'John Doe',
      avatar: 'https://i.pravatar.cc/150?img=1',
      subscriptionTier: 'free',
      defaultRole: 'Backend Engineer',
      usageCount: {
        analyses: 0,
        matches: 0,
        rewrites: 0
      },
      limits: {
        maxAnalyses: 1,
        maxMatches: 0,
        maxRewrites: 0
      }
    }
  });

  const user2 = await prisma.user.create({
    data: {
      id: 'user-2',
      email: 'jane.smith@example.com',
      name: 'Jane Smith',
      avatar: 'https://i.pravatar.cc/150?img=2',
      subscriptionTier: 'pro',
      defaultRole: 'Fullstack Developer',
      usageCount: {
        analyses: 5,
        matches: 3,
        rewrites: 2
      },
      limits: {
        maxAnalyses: 999999,
        maxMatches: 999999,
        maxRewrites: 999999
      }
    }
  });

  // Create access tokens for testing
  console.log('Creating test tokens...');

  const now = new Date();
  const oneHourFromNow = new Date(now.getTime() + 60 * 60 * 1000); // 1 hour
  const sevenDaysFromNow = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000); // 7 days

  await prisma.accessToken.create({
    data: {
      token: 'access-token-1',
      userId: user1.id,
      expiresAt: oneHourFromNow
    }
  });

  await prisma.accessToken.create({
    data: {
      token: 'access-token-2',
      userId: user2.id,
      expiresAt: oneHourFromNow
    }
  });

  await prisma.refreshToken.create({
    data: {
      token: 'refresh-token-1',
      userId: user1.id,
      expiresAt: sevenDaysFromNow
    }
  });

  await prisma.refreshToken.create({
    data: {
      token: 'refresh-token-2',
      userId: user2.id,
      expiresAt: sevenDaysFromNow
    }
  });

  console.log('✅ Seeding complete!');
  console.log('\nCreated users:');
  console.log('  - John Doe (user-1): john.doe@example.com [FREE tier]');
  console.log('  - Jane Smith (user-2): jane.smith@example.com [PRO tier]');
  console.log('\nTest tokens:');
  console.log('  - access-token-1 (user-1)');
  console.log('  - access-token-2 (user-2)');
  console.log('  - refresh-token-1 (user-1)');
  console.log('  - refresh-token-2 (user-2)');
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
