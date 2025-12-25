import { Request, Response } from 'express';
import { resumeService } from '../services/resumeService';
import { analysisService } from '../services/analysisService';
import { usageService } from '../services/usageService';
import { sendUnauthorized, sendNotFound, sendForbidden, sendRateLimitError } from '../utils/errors';
import { ERROR_MESSAGES } from '../constants/errors';
import { RATE_LIMIT } from '../constants/validation';
import { Role } from '../types';

export const analysisController = {
  analyzeResume: (req: Request, res: Response) => {
    if (!req.user) {
      return sendUnauthorized(res, ERROR_MESSAGES.AUTH_REQUIRED);
    }

    const { id } = req.params;
    const { role } = req.body;

    const resume = resumeService.getResumeById(id);

    if (!resume) {
      return sendNotFound(res, ERROR_MESSAGES.RESUME_NOT_FOUND);
    }

    if (!resumeService.userOwnsResume(req.user.id, id)) {
      return sendForbidden(res, ERROR_MESSAGES.FORBIDDEN_ACCESS);
    }

    if (!usageService.canPerformAction(req.user.id, 'analyses')) {
      return sendRateLimitError(res, ERROR_MESSAGES.RATE_LIMIT, RATE_LIMIT.RETRY_AFTER);
    }

    const targetRole = (role || resume.role) as Role;
    const analysis = analysisService.createAnalysis(id, targetRole);

    usageService.incrementUsage(req.user.id, 'analyses');

    res.json(analysis);
  },

  getLatestAnalysis: (req: Request, res: Response) => {
    if (!req.user) {
      return sendUnauthorized(res, ERROR_MESSAGES.AUTH_REQUIRED);
    }

    const { id } = req.params;
    const resume = resumeService.getResumeById(id);

    if (!resume) {
      return sendNotFound(res, ERROR_MESSAGES.RESUME_NOT_FOUND);
    }

    if (!resumeService.userOwnsResume(req.user.id, id)) {
      return sendForbidden(res, ERROR_MESSAGES.FORBIDDEN_ACCESS);
    }

    const analysis = analysisService.getLatestResumeAnalysis(id);

    if (!analysis) {
      return sendNotFound(res, ERROR_MESSAGES.NO_ANALYSIS_FOUND);
    }

    res.json(analysis);
  },

  getById: (req: Request, res: Response) => {
    if (!req.user) {
      return sendUnauthorized(res, ERROR_MESSAGES.AUTH_REQUIRED);
    }

    const { analysisId } = req.params;
    const analysis = analysisService.getAnalysisById(analysisId);

    if (!analysis) {
      return sendNotFound(res, ERROR_MESSAGES.ANALYSIS_NOT_FOUND);
    }

    if (!resumeService.userOwnsResume(req.user.id, analysis.resumeId)) {
      return sendForbidden(res, ERROR_MESSAGES.FORBIDDEN_ACCESS);
    }

    res.json(analysis);
  },
};
