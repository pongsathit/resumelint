import prisma from '../database/client';
import { User, Role } from '../types';

/**
 * User Repository
 * Handles all database operations related to users
 */
export const UserRepository = {
  /**
   * Get user by ID
   */
  async getUserById(userId: string): Promise<User | null> {
    const user = await prisma.user.findUnique({
      where: { id: userId }
    });

    if (!user) return null;

    return this.transformToUser(user);
  },

  /**
   * Get user by email
   */
  async getUserByEmail(email: string): Promise<User | null> {
    const user = await prisma.user.findUnique({
      where: { email }
    });

    if (!user) return null;

    return this.transformToUser(user);
  },

  /**
   * Update user profile
   */
  async updateUser(
    userId: string,
    updates: { name?: string; defaultRole?: Role }
  ): Promise<User | null> {
    try {
      const user = await prisma.user.update({
        where: { id: userId },
        data: updates
      });

      return this.transformToUser(user);
    } catch (error: any) {
      if (error.code === 'P2025') {
        // Record not found
        return null;
      }
      throw error;
    }
  },

  /**
   * Increment usage count for a specific action type
   */
  async incrementUsage(
    userId: string,
    type: 'analyses' | 'matches' | 'rewrites'
  ): Promise<void> {
    const user = await prisma.user.findUnique({
      where: { id: userId }
    });

    if (!user) {
      throw new Error('User not found');
    }

    const usageCount = user.usageCount as any;
    usageCount[type] = (usageCount[type] || 0) + 1;

    await prisma.user.update({
      where: { id: userId },
      data: { usageCount }
    });
  },

  /**
   * Check if user can perform an action based on usage limits
   */
  async canPerformAction(
    userId: string,
    type: 'analyses' | 'matches' | 'rewrites'
  ): Promise<boolean> {
    const user = await prisma.user.findUnique({
      where: { id: userId }
    });

    if (!user) return false;

    // Pro users have unlimited access
    if (user.subscriptionTier === 'pro') return true;

    const usageCount = user.usageCount as any;
    const limits = user.limits as any;

    const limitKey = `max${type.charAt(0).toUpperCase() + type.slice(1)}`;

    return (usageCount[type] || 0) < (limits[limitKey] || 0);
  },

  /**
   * Transform database model to API User type
   */
  transformToUser(dbUser: any): User {
    return {
      id: dbUser.id,
      email: dbUser.email,
      name: dbUser.name,
      avatar: dbUser.avatar,
      subscriptionTier: dbUser.subscriptionTier as 'free' | 'pro',
      defaultRole: dbUser.defaultRole as Role | undefined,
      usageCount: dbUser.usageCount as any,
      limits: dbUser.limits as any,
      createdAt: dbUser.createdAt.toISOString(),
      updatedAt: dbUser.updatedAt.toISOString()
    };
  }
};
