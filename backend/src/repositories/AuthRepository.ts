import prisma from '../database/client';
import { User, Provider } from '../types';
import { UserRepository } from './UserRepository';

/**
 * Authentication Repository
 * Handles token management and authentication operations
 */
export const AuthRepository = {
  /**
   * Get user by credentials (email-based authentication)
   * For mock compatibility, any password works
   */
  async getUserByCredentials(email: string, password: string): Promise<User | null> {
    // For mock compatibility: any password works, just check if user exists
    return await UserRepository.getUserByEmail(email);
  },

  /**
   * Get user by OAuth provider
   * For mock compatibility, returns first user for any OAuth attempt
   */
  async getUserByOAuth(provider: Provider, code: string): Promise<User | null> {
    // For mock compatibility: return user-1 for any OAuth attempt
    return await UserRepository.getUserById('user-1');
  },

  /**
   * Create access token
   */
  async createAccessToken(userId: string, token: string): Promise<string> {
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

    await prisma.accessToken.create({
      data: {
        token,
        userId,
        expiresAt
      }
    });

    return token;
  },

  /**
   * Create refresh token
   */
  async createRefreshToken(userId: string, token: string): Promise<string> {
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days

    await prisma.refreshToken.create({
      data: {
        token,
        userId,
        expiresAt
      }
    });

    return token;
  },

  /**
   * Get user by access token
   * Checks token validity and expiration
   */
  async getUserByAccessToken(token: string): Promise<User | null> {
    const accessToken = await prisma.accessToken.findUnique({
      where: { token },
      include: { user: true }
    });

    if (!accessToken) return null;

    // Check expiration
    if (new Date() > accessToken.expiresAt) {
      // Token expired, delete it
      await prisma.accessToken.delete({
        where: { id: accessToken.id }
      }).catch(() => {}); // Ignore errors if already deleted

      return null;
    }

    return UserRepository.transformToUser(accessToken.user);
  },

  /**
   * Get user by refresh token
   * Checks token validity and expiration
   */
  async getUserByRefreshToken(token: string): Promise<User | null> {
    const refreshToken = await prisma.refreshToken.findUnique({
      where: { token },
      include: { user: true }
    });

    if (!refreshToken) return null;

    // Check expiration
    if (new Date() > refreshToken.expiresAt) {
      // Token expired, delete it
      await prisma.refreshToken.delete({
        where: { id: refreshToken.id }
      }).catch(() => {}); // Ignore errors if already deleted

      return null;
    }

    return UserRepository.transformToUser(refreshToken.user);
  },

  /**
   * Revoke all tokens for a user
   */
  async revokeUserTokens(userId: string): Promise<void> {
    await prisma.$transaction([
      prisma.accessToken.deleteMany({
        where: { userId }
      }),
      prisma.refreshToken.deleteMany({
        where: { userId }
      })
    ]);
  }
};
