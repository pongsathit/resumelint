import { PrismaClient } from '@prisma/client';

/**
 * Prisma Client Singleton
 *
 * This ensures we only have one instance of PrismaClient across the application.
 * Multiple instances can cause connection pool issues and slow down the application.
 */

// Declare global type for Prisma client in development
declare global {
  // eslint-disable-next-line no-var
  var prisma: PrismaClient | undefined;
}

// Create a singleton instance of Prisma Client
export const prisma = global.prisma || new PrismaClient({
  log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
});

// In development, save the instance to global to prevent multiple instances
// during hot-reload
if (process.env.NODE_ENV !== 'production') {
  global.prisma = prisma;
}

// Graceful shutdown handler
export const disconnectPrisma = async () => {
  await prisma.$disconnect();
};
