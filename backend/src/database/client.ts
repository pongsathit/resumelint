import { PrismaClient } from '@prisma/client';

// Singleton pattern for Prisma Client
// Prevents multiple instances in development with hot-reload
let prisma: PrismaClient;

export const getPrismaClient = (): PrismaClient => {
  if (!prisma) {
    prisma = new PrismaClient({
      log: process.env.NODE_ENV === 'development'
        ? ['query', 'error', 'warn']
        : ['error'],
      errorFormat: 'pretty',
    });

    // Handle shutdown gracefully
    const disconnect = async () => {
      await prisma.$disconnect();
    };

    process.on('beforeExit', disconnect);
    process.on('SIGINT', disconnect);
    process.on('SIGTERM', disconnect);
  }

  return prisma;
};

// Export singleton instance
export const prisma = getPrismaClient();

// Export for dependency injection in tests
export default prisma;
