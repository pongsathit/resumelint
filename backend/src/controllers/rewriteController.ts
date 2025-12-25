import { Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { resumes, rewrites, mockHelpers } from '../models/mockData';
import { Rewrite, Change } from '../types';

export const rewriteController = {
  // POST /api/resumes/:id/rewrite
  rewriteResume: (req: Request, res: Response) => {
    if (!req.user) {
      return res.status(401).json({
        error: 'unauthorized',
        message: 'Authentication required'
      });
    }

    const { id } = req.params;
    const { sections, focus, jobDescriptionId } = req.body;

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
    if (!mockHelpers.canPerformAction(req.user.id, 'rewrites')) {
      return res.status(429).json({
        error: 'rate_limit_exceeded',
        message: 'Usage limit reached. Please upgrade to Pro.',
        retryAfter: 86400
      });
    }

    // Generate mock rewrite
    const rewriteId = uuidv4();

    const mockChanges: Change[] = [
      {
        section: 'experience',
        originalBullet: 'Built scalable microservices',
        rewrittenBullet: 'Architected and deployed 5 microservices handling 1M+ daily requests, achieving 99.9% uptime through strategic implementation of circuit breakers and auto-scaling policies',
        improvements: ['quantified_impact', 'star_method', 'technical_depth'],
        explanation: 'Added specific metrics (5 microservices, 1M+ requests, 99.9% uptime) and technical details (circuit breakers, auto-scaling) to demonstrate scale and expertise'
      },
      {
        section: 'experience',
        originalBullet: 'Led team of 5 engineers',
        rewrittenBullet: 'Led cross-functional team of 5 engineers through a critical microservices migration, resulting in 40% reduction in infrastructure costs and 60% improvement in API response times',
        improvements: ['quantified_impact', 'star_method', 'business_value'],
        explanation: 'Transformed generic leadership statement into STAR format with quantifiable business outcomes (40% cost reduction, 60% performance improvement)'
      },
      {
        section: 'projects',
        originalBullet: 'Built a full-stack e-commerce platform',
        rewrittenBullet: 'Developed full-stack e-commerce platform using React and Node.js, processing $500K in transactions monthly with 10,000+ active users and achieving 95% customer satisfaction score',
        improvements: ['quantified_impact', 'metrics', 'ats_keywords'],
        explanation: 'Added concrete metrics (revenue, users, satisfaction) and specific technologies for ATS optimization'
      }
    ];

    const originalText = resume.rawText;
    const rewrittenText = `${originalText}\n\n[REWRITTEN VERSION]\n\nJohn Doe\nSenior Software Engineer\n\nPROFESSIONAL EXPERIENCE\n\nSenior Backend Engineer | Tech Corp | 2020-2024\n• Architected and deployed 5 microservices handling 1M+ daily requests, achieving 99.9% uptime through strategic implementation of circuit breakers and auto-scaling policies\n• Led cross-functional team of 5 engineers through a critical microservices migration, resulting in 40% reduction in infrastructure costs and 60% improvement in API response times\n• Implemented comprehensive CI/CD pipeline using GitHub Actions and Docker, reducing deployment time by 75% and eliminating production incidents\n\nPROJECTS\n• E-commerce Platform: Developed full-stack e-commerce platform using React and Node.js, processing $500K in transactions monthly with 10,000+ active users and achieving 95% customer satisfaction score`;

    const rewrite: Rewrite = {
      rewriteId,
      resumeId: id,
      originalText,
      rewrittenText,
      changes: mockChanges,
      scoreImprovement: {
        before: 65,
        after: 85,
        delta: 20
      },
      version: 1,
      generatedAt: new Date().toISOString()
    };

    rewrites.set(rewriteId, rewrite);
    mockHelpers.incrementUsage(req.user.id, 'rewrites');

    res.json(rewrite);
  },

  // POST /api/rewrites/:rewriteId/improve
  improveRewrite: (req: Request, res: Response) => {
    if (!req.user) {
      return res.status(401).json({
        error: 'unauthorized',
        message: 'Authentication required'
      });
    }

    if (req.user.subscriptionTier !== 'pro') {
      return res.status(403).json({
        error: 'forbidden',
        message: 'This feature requires Pro tier subscription'
      });
    }

    const { rewriteId } = req.params;
    const { prompt, section, bulletIndex } = req.body;

    const rewrite = rewrites.get(rewriteId);

    if (!rewrite) {
      return res.status(404).json({
        error: 'not_found',
        message: 'Rewrite not found'
      });
    }

    if (!mockHelpers.userOwnsResume(req.user.id, rewrite.resumeId)) {
      return res.status(403).json({
        error: 'forbidden',
        message: 'You do not have permission to access this resource'
      });
    }

    // Mock improved bullet based on prompt
    res.json({
      rewrittenBullet: 'Spearheaded development of cloud-native microservices architecture serving 2M+ daily users across 15 countries, achieving 99.95% uptime and reducing infrastructure costs by 45% through strategic AWS optimization',
      explanation: `Applied your feedback: "${prompt}". Enhanced the bullet point with more specific metrics, geographic scope, and platform details to strengthen impact and demonstrate scale.`,
      improvements: ['global_scale', 'enhanced_metrics', 'platform_specificity']
    });
  },

  // PUT /api/rewrites/:rewriteId
  updateRewrite: (req: Request, res: Response) => {
    if (!req.user) {
      return res.status(401).json({
        error: 'unauthorized',
        message: 'Authentication required'
      });
    }

    const { rewriteId } = req.params;
    const { rewrittenText, changes } = req.body;

    const rewrite = rewrites.get(rewriteId);

    if (!rewrite) {
      return res.status(404).json({
        error: 'not_found',
        message: 'Rewrite not found'
      });
    }

    if (!mockHelpers.userOwnsResume(req.user.id, rewrite.resumeId)) {
      return res.status(403).json({
        error: 'forbidden',
        message: 'You do not have permission to access this resource'
      });
    }

    // Update rewrite
    if (rewrittenText) rewrite.rewrittenText = rewrittenText;
    if (changes) rewrite.changes = changes;
    rewrite.version += 1;
    rewrite.updatedAt = new Date().toISOString();

    res.json({
      rewriteId: rewrite.rewriteId,
      savedAt: rewrite.updatedAt,
      version: rewrite.version
    });
  },

  // GET /api/resumes/:id/rewrites
  getResumeRewrites: (req: Request, res: Response) => {
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

    const resumeRewrites = mockHelpers.getRewritesByResume(id);

    const rewriteList = resumeRewrites.map(rewrite => ({
      rewriteId: rewrite.rewriteId,
      version: rewrite.version,
      scoreImprovement: rewrite.scoreImprovement.delta,
      createdAt: rewrite.generatedAt,
      updatedAt: rewrite.updatedAt || rewrite.generatedAt
    }));

    res.json({
      rewrites: rewriteList
    });
  },

  // GET /api/rewrites/:rewriteId
  getRewriteById: (req: Request, res: Response) => {
    if (!req.user) {
      return res.status(401).json({
        error: 'unauthorized',
        message: 'Authentication required'
      });
    }

    const { rewriteId } = req.params;
    const rewrite = rewrites.get(rewriteId);

    if (!rewrite) {
      return res.status(404).json({
        error: 'not_found',
        message: 'Rewrite not found'
      });
    }

    if (!mockHelpers.userOwnsResume(req.user.id, rewrite.resumeId)) {
      return res.status(403).json({
        error: 'forbidden',
        message: 'You do not have permission to access this resource'
      });
    }

    res.json(rewrite);
  }
};
