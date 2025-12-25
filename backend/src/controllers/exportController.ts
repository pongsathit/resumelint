import { Request, Response } from 'express';
import { resumeService } from '../services/resumeService';
import { sendUnauthorized, sendNotFound, sendForbidden, sendValidationError } from '../utils/errors';
import { validateExportType } from '../utils/validators';
import { ERROR_MESSAGES } from '../constants/errors';

export const exportController = {
  exportResume: (req: Request, res: Response) => {
    if (!req.user) {
      return sendUnauthorized(res, ERROR_MESSAGES.AUTH_REQUIRED);
    }

    const { id } = req.params;
    const { type, rewriteId, matchId } = req.body;

    const resume = resumeService.getResumeById(id);

    if (!resume) {
      return sendNotFound(res, ERROR_MESSAGES.RESUME_NOT_FOUND);
    }

    if (!resumeService.userOwnsResume(req.user.id, id)) {
      return sendForbidden(res, ERROR_MESSAGES.FORBIDDEN_ACCESS);
    }

    const typeValidation = validateExportType(type);
    if (!typeValidation.isValid) {
      return sendValidationError(res, 'Invalid export type', typeValidation.details);
    }

    if (type === 'rewrite' && !rewriteId) {
      return sendValidationError(res, 'rewriteId is required for rewrite export', [
        { field: 'rewriteId', message: 'Required for rewrite type' },
      ]);
    }

    if (type === 'match' && !matchId) {
      return sendValidationError(res, 'matchId is required for match export', [
        { field: 'matchId', message: 'Required for match type' },
      ]);
    }

    const mockPdfContent = `Mock PDF Export\nType: ${type}\nResume ID: ${id}\nGenerated: ${new Date().toISOString()}`;

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="${type}-${id}.pdf"`);
    res.send(Buffer.from(mockPdfContent));
  },
};
