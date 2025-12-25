import { Request, Response } from 'express';
import { resumeService } from '../services/resumeService';
import { sendUnauthorized, sendNotFound, sendForbidden, sendValidationError } from '../utils/errors';
import { validateRole } from '../utils/validators';
import { ERROR_MESSAGES } from '../constants/errors';
import { PAGINATION_DEFAULTS } from '../constants/validation';
import { Role } from '../types';

export const resumeController = {
  create: (req: Request, res: Response) => {
    const { text, role } = req.body;
    const file = req.file;

    const roleValidation = validateRole(role);
    if (!roleValidation.isValid) {
      return sendValidationError(res, 'Invalid or missing role', roleValidation.details);
    }

    let rawText = '';
    let fileName = '';

    if (file) {
      fileName = file.originalname;
      rawText = `Mock parsed content from ${fileName}\n\nJohn Doe\nSoftware Engineer\n\nExperience:\n- Senior Backend Engineer at Tech Corp (2020-2024)\n- Built scalable microservices handling 1M+ requests/day\n- Led team of 5 engineers\n\nSkills:\nNode.js, TypeScript, PostgreSQL, Docker, Kubernetes`;
    } else if (text) {
      fileName = 'resume.txt';
      rawText = text;
    } else {
      return sendValidationError(res, 'Either file or text is required', [
        { field: 'file/text', message: 'Either file or text must be provided' },
      ]);
    }

    const userId = req.user?.id || 'anonymous';
    const resume = resumeService.createResume({
      userId,
      rawText,
      fileName,
      role: role as Role,
    });

    res.json(resume);
  },

  list: (req: Request, res: Response) => {
    if (!req.user) {
      return sendUnauthorized(res, ERROR_MESSAGES.AUTH_REQUIRED);
    }

    const page = parseInt(req.query.page as string) || PAGINATION_DEFAULTS.PAGE;
    const limit = parseInt(req.query.limit as string) || PAGINATION_DEFAULTS.LIMIT;

    const userResumes = resumeService.getUserResumes(req.user.id);

    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedResumes = userResumes.slice(startIndex, endIndex);

    const resumeList = resumeService.getResumeListItems(paginatedResumes);

    res.json({
      resumes: resumeList,
      pagination: {
        page,
        limit,
        total: userResumes.length,
        totalPages: Math.ceil(userResumes.length / limit),
      },
    });
  },

  getById: (req: Request, res: Response) => {
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

    res.json(resume);
  },

  delete: (req: Request, res: Response) => {
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

    resumeService.deleteResume(id);

    res.json({
      success: true,
      message: 'Resume deleted successfully',
    });
  },
};
