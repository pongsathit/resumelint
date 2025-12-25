import { mockHelpers } from '../models/mockData';

type UsageType = 'analyses' | 'matches' | 'rewrites';

export const usageService = {
  canPerformAction: (userId: string, type: UsageType): boolean => {
    return mockHelpers.canPerformAction(userId, type);
  },

  incrementUsage: (userId: string, type: UsageType): void => {
    mockHelpers.incrementUsage(userId, type);
  },
};
