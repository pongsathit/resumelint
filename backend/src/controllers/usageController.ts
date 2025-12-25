import { Request, Response } from 'express';
import { userService } from '../services/userService';
import { sendUnauthorized, sendNotFound } from '../utils/errors';
import { ERROR_MESSAGES } from '../constants/errors';

export const usageController = {
  getUsage: (req: Request, res: Response) => {
    if (!req.user) {
      return sendUnauthorized(res, ERROR_MESSAGES.AUTH_REQUIRED);
    }

    const user = userService.getUserById(req.user.id);

    if (!user) {
      return sendNotFound(res, ERROR_MESSAGES.USER_NOT_FOUND);
    }

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
          resetAt,
        },
        matches: {
          used: user.usageCount.matches,
          limit: user.limits.maxMatches,
          resetAt,
        },
        rewrites: {
          used: user.usageCount.rewrites,
          limit: user.limits.maxRewrites,
          resetAt,
        },
      },
      canAnalyze: isPro || user.usageCount.analyses < user.limits.maxAnalyses,
      canMatch: isPro || user.usageCount.matches < user.limits.maxMatches,
      canRewrite: isPro || user.usageCount.rewrites < user.limits.maxRewrites,
    });
  },
};
