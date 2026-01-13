import { prisma } from '../utils/prisma';

type UsageType = 'analyses' | 'matches' | 'rewrites';

export const usageService = {
  canPerformAction: async (userId: string, type: UsageType): Promise<boolean> => {
    try {
      const user = await prisma.user.findUnique({
        where: { id: userId },
        select: {
          subscriptionTier: true,
          usageCount: true,
          limits: true,
        },
      });

      if (!user) return false;

      // Pro users have unlimited access
      if (user.subscriptionTier === 'pro') return true;

      // Parse JSON fields
      const usageCount = user.usageCount as any;
      const limits = user.limits as any;

      // Get limit key (e.g., 'analyses' -> 'maxAnalyses')
      const limitKey = `max${type.charAt(0).toUpperCase() + type.slice(1)}`;

      return usageCount[type] < limits[limitKey];
    } catch (error) {
      console.error('Error checking usage limits:', error);
      return false;
    }
  },

  incrementUsage: async (userId: string, type: UsageType): Promise<void> => {
    try {
      const user = await prisma.user.findUnique({
        where: { id: userId },
        select: { usageCount: true },
      });

      if (!user) {
        console.error(`User ${userId} not found for usage increment`);
        return;
      }

      // Parse current usage count
      const usageCount = user.usageCount as any;

      // Increment the specific usage type
      usageCount[type] = (usageCount[type] || 0) + 1;

      // Update in database
      await prisma.user.update({
        where: { id: userId },
        data: { usageCount: usageCount as any },
      });
    } catch (error) {
      console.error('Error incrementing usage:', error);
      throw new Error('Failed to increment usage');
    }
  },
};
