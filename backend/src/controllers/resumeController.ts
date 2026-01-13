import { Request, Response } from 'express';
import { resumeService } from '../services/resumeService';
import { sendUnauthorized, sendNotFound, sendForbidden, sendValidationError } from '../utils/errors';
import { validateRole } from '../utils/validators';
import { ERROR_MESSAGES } from '../constants/errors';
import { PAGINATION_DEFAULTS } from '../constants/validation';
import { Role } from '../types';

export const resumeController = {
  create: async (req: Request, res: Response) => {
    try {
      const { text, role } = req.body;
      const file = req.file;

      const roleValidation = validateRole(role);
      if (!roleValidation.isValid) {
        return sendValidationError(res, 'Invalid or missing role', roleValidation.details);
      }

      // Validate that either file or text is provided
      if (!file && !text) {
        return sendValidationError(res, 'Either file or text is required', [
          { field: 'file/text', message: 'Either file or text must be provided' },
        ]);
      }

      const userId = req.user?.id || 'anonymous';
      let fileName = 'pasted-text.txt';
      let fileBuffer: Buffer | undefined = undefined;
      let rawText: string | undefined = undefined;

      if (file) {
        // File upload case
        fileName = file.originalname;
        fileBuffer = file.buffer;
      } else if (text) {
        // Text paste case
        fileName = 'pasted-text.txt';
        rawText = text;
      }

      const resume = await resumeService.createResume({
        userId,
        fileName,
        role: role as Role,
        fileBuffer,
        rawText,
      });

      res.json(resume);
    } catch (error) {
      console.error('Error in resume creation:', error);

      if (error instanceof Error) {
        // Handle specific parsing errors with clear user-facing messages
        if (error.message.includes('Unsupported file type')) {
          return sendValidationError(res, error.message);
        }
        if (error.message.includes('PDF') || error.message.includes('DOCX')) {
          return res.status(400).json({
            error: 'parse_error',
            message: 'Failed to parse resume file. Please ensure it is a valid PDF, DOCX, DOC, or TXT file.',
            details: error.message,
          });
        }
        if (error.message.includes('empty')) {
          return res.status(400).json({
            error: 'validation_error',
            message: error.message,
          });
        }

        // Generic error
        return res.status(500).json({
          error: 'server_error',
          message: 'Failed to create resume. Please try again.',
          details: error.message,
        });
      }

      // Unknown error type
      return res.status(500).json({
        error: 'server_error',
        message: 'An unexpected error occurred while creating the resume.',
      });
    }
  },

  list: async (req: Request, res: Response) => {
    if (!req.user) {
      return sendUnauthorized(res, ERROR_MESSAGES.AUTH_REQUIRED);
    }

    const page = parseInt(req.query.page as string) || PAGINATION_DEFAULTS.PAGE;
    const limit = parseInt(req.query.limit as string) || PAGINATION_DEFAULTS.LIMIT;

    const userResumes = await resumeService.getUserResumes(req.user.id);

    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedResumes = userResumes.slice(startIndex, endIndex);

    const resumeList = await resumeService.getResumeListItems(paginatedResumes);

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

  getById: async (req: Request, res: Response) => {
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

    res.json(resume);
  },

  delete: async (req: Request, res: Response) => {
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

    await resumeService.deleteResume(id);

    res.json({
      success: true,
      message: 'Resume deleted successfully',
    });
  },
};
