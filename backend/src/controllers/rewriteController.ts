import { Request, Response } from 'express';
import { resumeService } from '../services/resumeService';
import { rewriteService } from '../services/rewriteService';
import { usageService } from '../services/usageService';
import { sendUnauthorized, sendNotFound, sendForbidden, sendRateLimitError } from '../utils/errors';
import { ERROR_MESSAGES } from '../constants/errors';
import { RATE_LIMIT } from '../constants/validation';

export const rewriteController = {
  rewriteResume: async (req: Request, res: Response) => {
    if (!req.user) {
      return sendUnauthorized(res, ERROR_MESSAGES.AUTH_REQUIRED);
    }

    const { id } = req.params;
    const resume = await resumeService.getResumeById(id);

    if (!resume) {
      return sendNotFound(res, ERROR_MESSAGES.RESUME_NOT_FOUND);
    }

    if (!(await resumeService.userOwnsResume(req.user.id, id))) {
      return sendForbidden(res, ERROR_MESSAGES.FORBIDDEN_ACCESS);
    }

    if (!(await usageService.canPerformAction(req.user.id, 'rewrites'))) {
      return sendRateLimitError(res, ERROR_MESSAGES.RATE_LIMIT, RATE_LIMIT.RETRY_AFTER);
    }

    const rewrite = await rewriteService.createRewrite(id, resume.rawText);
    await usageService.incrementUsage(req.user.id, 'rewrites');

    res.json(rewrite);
  },

  improveRewrite: async (req: Request, res: Response) => {
    if (!req.user) {
      return sendUnauthorized(res, ERROR_MESSAGES.AUTH_REQUIRED);
    }

    if (req.user.subscriptionTier !== 'pro') {
      return sendForbidden(res, ERROR_MESSAGES.PRO_REQUIRED);
    }

    const { rewriteId } = req.params;
    const { prompt } = req.body;

    const rewrite = await rewriteService.getRewriteById(rewriteId);

    if (!rewrite) {
      return sendNotFound(res, ERROR_MESSAGES.REWRITE_NOT_FOUND);
    }

    if (!(await resumeService.userOwnsResume(req.user.id, rewrite.resumeId))) {
      return sendForbidden(res, ERROR_MESSAGES.FORBIDDEN_ACCESS);
    }

    const improvement = rewriteService.improveRewrite(prompt);
    res.json(improvement);
  },

  updateRewrite: async (req: Request, res: Response) => {
    if (!req.user) {
      return sendUnauthorized(res, ERROR_MESSAGES.AUTH_REQUIRED);
    }

    const { rewriteId } = req.params;
    const { rewrittenText, changes } = req.body;

    const rewrite = await rewriteService.getRewriteById(rewriteId);

    if (!rewrite) {
      return sendNotFound(res, ERROR_MESSAGES.REWRITE_NOT_FOUND);
    }

    if (!(await resumeService.userOwnsResume(req.user.id, rewrite.resumeId))) {
      return sendForbidden(res, ERROR_MESSAGES.FORBIDDEN_ACCESS);
    }

    const updatedRewrite = await rewriteService.updateRewrite(rewriteId, {
      rewrittenText,
      changes,
    });

    if (!updatedRewrite) {
      return sendNotFound(res, ERROR_MESSAGES.REWRITE_NOT_FOUND);
    }

    res.json({
      rewriteId: updatedRewrite.rewriteId,
      savedAt: updatedRewrite.updatedAt,
      version: updatedRewrite.version,
    });
  },

  getResumeRewrites: async (req: Request, res: Response) => {
    if (!req.user) {
      return sendUnauthorized(res, ERROR_MESSAGES.AUTH_REQUIRED);
    }

    const { id } = req.params;
    const resume = await resumeService.getResumeById(id);

    if (!resume) {
      return sendNotFound(res, ERROR_MESSAGES.RESUME_NOT_FOUND);
    }

    if (!(await resumeService.userOwnsResume(req.user.id, id))) {
      return sendForbidden(res, ERROR_MESSAGES.FORBIDDEN_ACCESS);
    }

    const resumeRewrites = await rewriteService.getResumeRewrites(id);

    const rewriteList = resumeRewrites.map((rewrite) => ({
      rewriteId: rewrite.rewriteId,
      version: rewrite.version,
      scoreImprovement: rewrite.scoreImprovement.delta,
      createdAt: rewrite.generatedAt,
      updatedAt: rewrite.updatedAt || rewrite.generatedAt,
    }));

    res.json({
      rewrites: rewriteList,
    });
  },

  getRewriteById: async (req: Request, res: Response) => {
    if (!req.user) {
      return sendUnauthorized(res, ERROR_MESSAGES.AUTH_REQUIRED);
    }

    const { rewriteId } = req.params;
    const rewrite = await rewriteService.getRewriteById(rewriteId);

    if (!rewrite) {
      return sendNotFound(res, ERROR_MESSAGES.REWRITE_NOT_FOUND);
    }

    if (!(await resumeService.userOwnsResume(req.user.id, rewrite.resumeId))) {
      return sendForbidden(res, ERROR_MESSAGES.FORBIDDEN_ACCESS);
    }

    res.json(rewrite);
  },
};
