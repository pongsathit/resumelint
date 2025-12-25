import { Request, Response } from 'express';
import { users } from '../models/mockData';

export const usageController = {
  // GET /api/usage
  getUsage: (req: Request, res: Response) => {
    if (!req.user) {
      return res.status(401).json({
        error: 'unauthorized',
        message: 'Authentication required'
      });
    }

    const user = users.get(req.user.id);

    if (!user) {
      return res.status(404).json({
        error: 'not_found',
        message: 'User not found'
      });
    }

    // Calculate reset date (first day of next month)
    const now = new Date();
    const nextMonth = new Date(now.getFullYear(), now.getMonth() + 1, 1);
    const resetAt = nextMonth.toISOString();

    const isPro = user.subscriptionTier === 'pro';

    res.json({
      tier: user.subscriptionTier,
      usage: {
        analyses: {
          used: user.usageCount.analyses,
          limit: user.limits.maxAnalyses,
          resetAt
        },
        matches: {
          used: user.usageCount.matches,
          limit: user.limits.maxMatches,
          resetAt
        },
        rewrites: {
          used: user.usageCount.rewrites,
          limit: user.limits.maxRewrites,
          resetAt
        }
      },
      canAnalyze: isPro || user.usageCount.analyses < user.limits.maxAnalyses,
      canMatch: isPro || user.usageCount.matches < user.limits.maxMatches,
      canRewrite: isPro || user.usageCount.rewrites < user.limits.maxRewrites
    });
  }
};
