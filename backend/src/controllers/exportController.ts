import { Request, Response } from 'express';
import { resumes, rewrites, matches, mockHelpers } from '../models/mockData';

export const exportController = {
  // POST /api/resumes/:id/export
  exportResume: (req: Request, res: Response) => {
    if (!req.user) {
      return res.status(401).json({
        error: 'unauthorized',
        message: 'Authentication required'
      });
    }

    const { id } = req.params;
    const { type, rewriteId, matchId, format } = req.body;

    const resume = resumes.get(id);

    if (!resume) {
      return res.status(404).json({
        error: 'not_found',
        message: 'Resume not found'
      });
    }

    if (!mockHelpers.userOwnsResume(req.user.id, id)) {
      return res.status(403).json({
        error: 'forbidden',
        message: 'You do not have permission to access this resource'
      });
    }

    // Validate export type
    if (!['resume', 'analysis', 'match', 'rewrite'].includes(type)) {
      return res.status(400).json({
        error: 'validation_error',
        message: 'Invalid export type',
        details: [{ field: 'type', message: 'Type must be resume, analysis, match, or rewrite' }]
      });
    }

    // Validate required IDs
    if (type === 'rewrite' && !rewriteId) {
      return res.status(400).json({
        error: 'validation_error',
        message: 'rewriteId is required for rewrite export',
        details: [{ field: 'rewriteId', message: 'Required for rewrite type' }]
      });
    }

    if (type === 'match' && !matchId) {
      return res.status(400).json({
        error: 'validation_error',
        message: 'matchId is required for match export',
        details: [{ field: 'matchId', message: 'Required for match type' }]
      });
    }

    // In a real implementation, this would generate a PDF
    // For mock, we return a text representation as PDF
    const mockPdfContent = `Mock PDF Export\nType: ${type}\nResume ID: ${id}\nGenerated: ${new Date().toISOString()}`;

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="${type}-${id}.pdf"`);
    res.send(Buffer.from(mockPdfContent));
  }
};
