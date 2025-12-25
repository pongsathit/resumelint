import { Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { resumes, analyses, mockHelpers } from '../models/mockData';
import { Analysis, Suggestion } from '../types';

export const analysisController = {
  // POST /api/resumes/:id/analyze
  analyzeResume: (req: Request, res: Response) => {
    if (!req.user) {
      return res.status(401).json({
        error: 'unauthorized',
        message: 'Authentication required'
      });
    }

    const { id } = req.params;
    const { role } = req.body;

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

    // Check usage limits
    if (!mockHelpers.canPerformAction(req.user.id, 'analyses')) {
      return res.status(429).json({
        error: 'rate_limit_exceeded',
        message: 'Usage limit reached. Please upgrade to Pro.',
        retryAfter: 86400
      });
    }

    // Generate mock analysis
    const analysisId = uuidv4();
    const targetRole = role || resume.role;

    const mockSuggestions: Suggestion[] = [
      {
        id: uuidv4(),
        section: 'experience',
        severity: 'critical',
        title: 'Quantify Your Impact',
        description: 'Add specific metrics to demonstrate the scale and impact of your work',
        originalText: 'Built scalable microservices',
        suggestedText: 'Built scalable microservices handling 1M+ requests/day with 99.9% uptime',
        reasoning: 'Adding quantifiable metrics makes your achievements more concrete and impressive to recruiters'
      },
      {
        id: uuidv4(),
        section: 'experience',
        severity: 'warning',
        title: 'Use STAR Method',
        description: 'Structure your bullet points using Situation, Task, Action, Result format',
        originalText: 'Led team of 5 engineers',
        suggestedText: 'Led cross-functional team of 5 engineers to deliver a critical microservices migration, reducing infrastructure costs by 40% and improving response times by 60%',
        reasoning: 'STAR method provides context and demonstrates leadership impact with measurable outcomes'
      },
      {
        id: uuidv4(),
        section: 'skills',
        severity: 'info',
        title: 'Add Relevant Technologies',
        description: `For ${targetRole} role, consider adding: GraphQL, Redis, AWS Lambda`,
        originalText: 'Node.js, TypeScript, PostgreSQL',
        suggestedText: 'Node.js, TypeScript, PostgreSQL, GraphQL, Redis, AWS Lambda',
        reasoning: 'These technologies are commonly required for modern backend engineering roles'
      }
    ];

    const analysis: Analysis = {
      analysisId,
      resumeId: id,
      scores: {
        overall: 82,
        clarity: 90,
        impact: 65,
        atsFriendliness: 88,
        technicalDepth: 85
      },
      suggestions: mockSuggestions,
      summary: `Your resume shows strong technical foundation for a ${targetRole} position. Key areas for improvement: quantifying impact with metrics (65% score), adding more context using STAR method, and ensuring ATS compatibility. Your technical depth is solid, but adding specific project outcomes would strengthen your profile.`,
      generatedAt: new Date().toISOString()
    };

    analyses.set(analysisId, analysis);
    mockHelpers.incrementUsage(req.user.id, 'analyses');

    res.json(analysis);
  },

  // GET /api/resumes/:id/analysis
  getLatestAnalysis: (req: Request, res: Response) => {
    if (!req.user) {
      return res.status(401).json({
        error: 'unauthorized',
        message: 'Authentication required'
      });
    }

    const { id } = req.params;
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

    const resumeAnalyses = mockHelpers.getAnalysesByResume(id);

    if (resumeAnalyses.length === 0) {
      return res.status(404).json({
        error: 'not_found',
        message: 'No analysis found for this resume'
      });
    }

    res.json(resumeAnalyses[0]); // Most recent
  },

  // GET /api/analyses/:analysisId
  getById: (req: Request, res: Response) => {
    if (!req.user) {
      return res.status(401).json({
        error: 'unauthorized',
        message: 'Authentication required'
      });
    }

    const { analysisId } = req.params;
    const analysis = analyses.get(analysisId);

    if (!analysis) {
      return res.status(404).json({
        error: 'not_found',
        message: 'Analysis not found'
      });
    }

    // Check if user owns the resume
    if (!mockHelpers.userOwnsResume(req.user.id, analysis.resumeId)) {
      return res.status(403).json({
        error: 'forbidden',
        message: 'You do not have permission to access this resource'
      });
    }

    res.json(analysis);
  }
};
