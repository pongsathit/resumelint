import { User, Role } from '../types';
import { prisma } from '../utils/prisma';

export const userService = {
  getUserById: async (userId: string): Promise<User | null> => {
    try {
      const dbUser = await prisma.user.findUnique({
        where: { id: userId },
      });

      if (!dbUser) {
        return null;
      }

      return {
        id: dbUser.id,
        email: dbUser.email,
        password: dbUser.password || undefined,
        name: dbUser.name,
        avatar: dbUser.avatar,
        subscriptionTier: dbUser.subscriptionTier as User['subscriptionTier'],
        defaultRole: dbUser.defaultRole as Role | undefined,
        usageCount: dbUser.usageCount as User['usageCount'],
        limits: dbUser.limits as User['limits'],
        createdAt: dbUser.createdAt.toISOString(),
        updatedAt: dbUser.updatedAt.toISOString(),
      };
    } catch (error) {
      console.error('Error fetching user by ID:', error);
      return null;
    }
  },

  updateUser: async (userId: string, updates: { name?: string; defaultRole?: Role }): Promise<User | null> => {
    try {
      const updateData: any = {
        updatedAt: new Date(),
      };

      if (updates.name) {
        updateData.name = updates.name;
      }
      if (updates.defaultRole) {
        updateData.defaultRole = updates.defaultRole;
      }

      const dbUser = await prisma.user.update({
        where: { id: userId },
        data: updateData,
      });

      return {
        id: dbUser.id,
        email: dbUser.email,
        password: dbUser.password || undefined,
        name: dbUser.name,
        avatar: dbUser.avatar,
        subscriptionTier: dbUser.subscriptionTier as User['subscriptionTier'],
        defaultRole: dbUser.defaultRole as Role | undefined,
        usageCount: dbUser.usageCount as User['usageCount'],
        limits: dbUser.limits as User['limits'],
        createdAt: dbUser.createdAt.toISOString(),
        updatedAt: dbUser.updatedAt.toISOString(),
      };
    } catch (error) {
      console.error('Error updating user:', error);
      return null;
    }
  },
};
