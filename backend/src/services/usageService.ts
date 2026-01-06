import { UserRepository } from '../repositories';

type UsageType = 'analyses' | 'matches' | 'rewrites';

export const usageService = {
  canPerformAction: async (userId: string, type: UsageType): Promise<boolean> => {
    return await UserRepository.canPerformAction(userId, type);
  },

  incrementUsage: async (userId: string, type: UsageType): Promise<void> => {
    await UserRepository.incrementUsage(userId, type);
  },
};
