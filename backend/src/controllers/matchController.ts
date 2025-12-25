import { Request, Response } from 'express';
import { resumeService } from '../services/resumeService';
import { matchService } from '../services/matchService';
import { usageService } from '../services/usageService';
import { sendUnauthorized, sendNotFound, sendForbidden, sendValidationError, sendRateLimitError } from '../utils/errors';
import { ERROR_MESSAGES } from '../constants/errors';
import { PAGINATION_DEFAULTS, RATE_LIMIT } from '../constants/validation';

export const matchController = {
  createJobDescription: (req: Request, res: Response) => {
    const { rawText, title, company } = req.body;

    if (!rawText) {
      return sendValidationError(res, 'Job description text is required', [
        { field: 'rawText', message: 'Job description text is required' },
      ]);
    }

    const jobDescription = matchService.createJobDescription({
      userId: req.user?.id,
      rawText,
      title,
      company,
    });

    res.json(jobDescription);
  },

  matchResume: (req: Request, res: Response) => {
    if (!req.user) {
      return sendUnauthorized(res, ERROR_MESSAGES.AUTH_REQUIRED);
    }

    const { resumeId } = req.params;
    const { jobDescriptionId, jobDescriptionText } = req.body;

    const resume = resumeService.getResumeById(resumeId);

    if (!resume) {
      return sendNotFound(res, ERROR_MESSAGES.RESUME_NOT_FOUND);
    }

    if (!resumeService.userOwnsResume(req.user.id, resumeId)) {
      return sendForbidden(res, ERROR_MESSAGES.FORBIDDEN_ACCESS);
    }

    if (!usageService.canPerformAction(req.user.id, 'matches')) {
      return sendRateLimitError(res, ERROR_MESSAGES.RATE_LIMIT, RATE_LIMIT.RETRY_AFTER);
    }

    let jdId = jobDescriptionId;

    if (!jdId && jobDescriptionText) {
      const jd = matchService.createJobDescription({
        userId: req.user.id,
        rawText: jobDescriptionText,
        title: 'Job Position',
        company: 'Company',
      });
      jdId = jd.id;
    }

    if (!jdId) {
      return sendValidationError(res, 'Either jobDescriptionId or jobDescriptionText is required', [
        { field: 'jobDescriptionId/jobDescriptionText', message: 'One is required' },
      ]);
    }

    const match = matchService.createMatch(resumeId, jdId);
    usageService.incrementUsage(req.user.id, 'matches');

    res.json(match);
  },

  getResumeMatches: (req: Request, res: Response) => {
    if (!req.user) {
      return sendUnauthorized(res, ERROR_MESSAGES.AUTH_REQUIRED);
    }

    const { resumeId } = req.params;
    const page = parseInt(req.query.page as string) || PAGINATION_DEFAULTS.PAGE;
    const limit = parseInt(req.query.limit as string) || PAGINATION_DEFAULTS.LIMIT;

    const resume = resumeService.getResumeById(resumeId);

    if (!resume) {
      return sendNotFound(res, ERROR_MESSAGES.RESUME_NOT_FOUND);
    }

    if (!resumeService.userOwnsResume(req.user.id, resumeId)) {
      return sendForbidden(res, ERROR_MESSAGES.FORBIDDEN_ACCESS);
    }

    const resumeMatches = matchService.getResumeMatches(resumeId);

    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedMatches = resumeMatches.slice(startIndex, endIndex);

    const matchList = paginatedMatches.map((match) => {
      const jd = matchService.getJobDescriptionById(match.jobDescriptionId);
      return {
        matchId: match.matchId,
        jobDescriptionId: match.jobDescriptionId,
        jobTitle: jd?.title || 'Unknown',
        company: jd?.company || 'Unknown',
        matchScore: match.matchScore,
        createdAt: match.generatedAt,
      };
    });

    res.json({
      matches: matchList,
      pagination: {
        page,
        limit,
        total: resumeMatches.length,
        totalPages: Math.ceil(resumeMatches.length / limit),
      },
    });
  },

  getMatchById: (req: Request, res: Response) => {
    if (!req.user) {
      return sendUnauthorized(res, ERROR_MESSAGES.AUTH_REQUIRED);
    }

    const { matchId } = req.params;
    const match = matchService.getMatchById(matchId);

    if (!match) {
      return sendNotFound(res, ERROR_MESSAGES.MATCH_NOT_FOUND);
    }

    if (!resumeService.userOwnsResume(req.user.id, match.resumeId)) {
      return sendForbidden(res, ERROR_MESSAGES.FORBIDDEN_ACCESS);
    }

    res.json(match);
  },
};
