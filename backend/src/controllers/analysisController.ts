import { Request, Response } from 'express';
import { resumeService } from '../services/resumeService';
import { analysisService } from '../services/analysisService';
import { usageService } from '../services/usageService';
import { sendUnauthorized, sendNotFound, sendForbidden, sendRateLimitError } from '../utils/errors';
import { ERROR_MESSAGES } from '../constants/errors';
import { RATE_LIMIT } from '../constants/validation';
import { Role } from '../types';

export const analysisController = {
  analyzeResume: async (req: Request, res: Response) => {
    if (!req.user) {
      return sendUnauthorized(res, ERROR_MESSAGES.AUTH_REQUIRED);
    }

    const { id } = req.params;
    const { role } = req.body;

    const resume = await resumeService.getResumeById(id);

    if (!resume) {
      return sendNotFound(res, ERROR_MESSAGES.RESUME_NOT_FOUND);
    }

    if (!(await resumeService.userOwnsResume(req.user.id, id))) {
      return sendForbidden(res, ERROR_MESSAGES.FORBIDDEN_ACCESS);
    }

    if (!(await usageService.canPerformAction(req.user.id, 'analyses'))) {
      return sendRateLimitError(res, ERROR_MESSAGES.RATE_LIMIT, RATE_LIMIT.RETRY_AFTER);
    }

    const targetRole = (role || resume.role) as Role;

    try {
      const analysis = await analysisService.createAnalysis(id, targetRole);
      await usageService.incrementUsage(req.user.id, 'analyses');
      res.json(analysis);
    } catch (error: any) {
      console.error('Analysis controller error:', error.message);
      return res.status(503).json({
        error: 'ai_service_unavailable',
        message: 'AI analysis is temporarily unavailable. Please try again later.',
        details: error.message,
      });
    }
  },

  getLatestAnalysis: async (req: Request, res: Response) => {
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

    const analysis = await analysisService.getLatestResumeAnalysis(id);

    if (!analysis) {
      return sendNotFound(res, ERROR_MESSAGES.NO_ANALYSIS_FOUND);
    }

    res.json(analysis);
  },

  getById: async (req: Request, res: Response) => {
    if (!req.user) {
      return sendUnauthorized(res, ERROR_MESSAGES.AUTH_REQUIRED);
    }

    const { analysisId } = req.params;
    const analysis = await analysisService.getAnalysisById(analysisId);

    if (!analysis) {
      return sendNotFound(res, ERROR_MESSAGES.ANALYSIS_NOT_FOUND);
    }

    if (!(await resumeService.userOwnsResume(req.user.id, analysis.resumeId))) {
      return sendForbidden(res, ERROR_MESSAGES.FORBIDDEN_ACCESS);
    }

    res.json(analysis);
  },
};
