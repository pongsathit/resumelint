import { Request, Response } from 'express';
import { resumeService } from '../services/resumeService';
import { matchService } from '../services/matchService';
import { usageService } from '../services/usageService';
import { sendUnauthorized, sendNotFound, sendForbidden, sendValidationError, sendRateLimitError } from '../utils/errors';
import { ERROR_MESSAGES } from '../constants/errors';
import { PAGINATION_DEFAULTS, RATE_LIMIT } from '../constants/validation';

export const matchController = {
  createJobDescription: async (req: Request, res: Response) => {
    const { rawText, title, company } = req.body;

    if (!rawText) {
      return sendValidationError(res, 'Job description text is required', [
        { field: 'rawText', message: 'Job description text is required' },
      ]);
    }

    const jobDescription = await matchService.createJobDescription({
      userId: req.user?.id,
      rawText,
      title,
      company,
    });

    res.json(jobDescription);
  },

  matchResume: async (req: Request, res: Response) => {
    if (!req.user) {
      return sendUnauthorized(res, ERROR_MESSAGES.AUTH_REQUIRED);
    }

    const { resumeId } = req.params;
    const { jobDescriptionId, jobDescriptionText } = req.body;

    const resume = await resumeService.getResumeById(resumeId);

    if (!resume) {
      return sendNotFound(res, ERROR_MESSAGES.RESUME_NOT_FOUND);
    }

    if (!(await resumeService.userOwnsResume(req.user.id, resumeId))) {
      return sendForbidden(res, ERROR_MESSAGES.FORBIDDEN_ACCESS);
    }

    if (!(await usageService.canPerformAction(req.user.id, 'matches'))) {
      return sendRateLimitError(res, ERROR_MESSAGES.RATE_LIMIT, RATE_LIMIT.RETRY_AFTER);
    }

    let jdId = jobDescriptionId;

    if (!jdId && jobDescriptionText) {
      const jd = await matchService.createJobDescription({
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

    const match = await matchService.createMatch(resumeId, jdId);
    await usageService.incrementUsage(req.user.id, 'matches');

    res.json(match);
  },

  getResumeMatches: async (req: Request, res: Response) => {
    if (!req.user) {
      return sendUnauthorized(res, ERROR_MESSAGES.AUTH_REQUIRED);
    }

    const { resumeId } = req.params;
    const page = parseInt(req.query.page as string) || PAGINATION_DEFAULTS.PAGE;
    const limit = parseInt(req.query.limit as string) || PAGINATION_DEFAULTS.LIMIT;

    const resume = await resumeService.getResumeById(resumeId);

    if (!resume) {
      return sendNotFound(res, ERROR_MESSAGES.RESUME_NOT_FOUND);
    }

    if (!(await resumeService.userOwnsResume(req.user.id, resumeId))) {
      return sendForbidden(res, ERROR_MESSAGES.FORBIDDEN_ACCESS);
    }

    const resumeMatches = await matchService.getResumeMatches(resumeId);

    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedMatches = resumeMatches.slice(startIndex, endIndex);

    const matchList = await Promise.all(
      paginatedMatches.map(async (match) => {
        const jd = await matchService.getJobDescriptionById(match.jobDescriptionId);
        return {
          matchId: match.matchId,
          jobDescriptionId: match.jobDescriptionId,
          jobTitle: jd?.title || 'Unknown',
          company: jd?.company || 'Unknown',
          matchScore: match.matchScore,
          createdAt: match.generatedAt,
        };
      })
    );

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

  getMatchById: async (req: Request, res: Response) => {
    if (!req.user) {
      return sendUnauthorized(res, ERROR_MESSAGES.AUTH_REQUIRED);
    }

    const { matchId } = req.params;
    const match = await matchService.getMatchById(matchId);

    if (!match) {
      return sendNotFound(res, ERROR_MESSAGES.MATCH_NOT_FOUND);
    }

    if (!(await resumeService.userOwnsResume(req.user.id, match.resumeId))) {
      return sendForbidden(res, ERROR_MESSAGES.FORBIDDEN_ACCESS);
    }

    res.json(match);
  },
};
