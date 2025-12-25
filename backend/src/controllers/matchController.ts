import { Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { resumes, jobDescriptions, matches, mockHelpers } from '../models/mockData';
import { JobDescription, Match, MissingKeyword, Strength } from '../types';

export const matchController = {
  // POST /api/job-descriptions
  createJobDescription: (req: Request, res: Response) => {
    const { rawText, title, company } = req.body;

    if (!rawText) {
      return res.status(400).json({
        error: 'validation_error',
        message: 'Job description text is required',
        details: [{ field: 'rawText', message: 'Job description text is required' }]
      });
    }

    const jdId = uuidv4();
    const userId = req.user?.id;

    const jobDescription: JobDescription = {
      id: jdId,
      userId,
      rawText,
      title: title || 'Software Engineer',
      company: company || 'Tech Company',
      createdAt: new Date().toISOString()
    };

    jobDescriptions.set(jdId, jobDescription);

    res.json(jobDescription);
  },

  // POST /api/resumes/:resumeId/match
  matchResume: (req: Request, res: Response) => {
    if (!req.user) {
      return res.status(401).json({
        error: 'unauthorized',
        message: 'Authentication required'
      });
    }

    const { resumeId } = req.params;
    const { jobDescriptionId, jobDescriptionText } = req.body;

    const resume = resumes.get(resumeId);

    if (!resume) {
      return res.status(404).json({
        error: 'not_found',
        message: 'Resume not found'
      });
    }

    if (!mockHelpers.userOwnsResume(req.user.id, resumeId)) {
      return res.status(403).json({
        error: 'forbidden',
        message: 'You do not have permission to access this resource'
      });
    }

    // Check usage limits
    if (!mockHelpers.canPerformAction(req.user.id, 'matches')) {
      return res.status(429).json({
        error: 'rate_limit_exceeded',
        message: 'Usage limit reached. Please upgrade to Pro.',
        retryAfter: 86400
      });
    }

    let jdId = jobDescriptionId;

    // Create JD if text provided
    if (!jdId && jobDescriptionText) {
      jdId = uuidv4();
      const jd: JobDescription = {
        id: jdId,
        userId: req.user.id,
        rawText: jobDescriptionText,
        title: 'Job Position',
        company: 'Company',
        createdAt: new Date().toISOString()
      };
      jobDescriptions.set(jdId, jd);
    }

    if (!jdId) {
      return res.status(400).json({
        error: 'validation_error',
        message: 'Either jobDescriptionId or jobDescriptionText is required',
        details: [{ field: 'jobDescriptionId/jobDescriptionText', message: 'One is required' }]
      });
    }

    // Generate mock match
    const matchId = uuidv4();

    const mockMissingKeywords: MissingKeyword[] = [
      {
        keyword: 'Docker',
        importance: 'high',
        frequency: 5
      },
      {
        keyword: 'GraphQL',
        importance: 'high',
        frequency: 4
      },
      {
        keyword: 'Redis',
        importance: 'medium',
        frequency: 3
      },
      {
        keyword: 'CI/CD',
        importance: 'medium',
        frequency: 2
      }
    ];

    const mockStrengths: Strength[] = [
      {
        keyword: 'Node.js',
        matchStrength: 'high',
        context: 'Strong experience with Node.js in building scalable backend systems'
      },
      {
        keyword: 'TypeScript',
        matchStrength: 'high',
        context: 'Proficient in TypeScript for type-safe development'
      },
      {
        keyword: 'PostgreSQL',
        matchStrength: 'medium',
        context: 'Database experience matches job requirements'
      }
    ];

    const match: Match = {
      matchId,
      resumeId,
      jobDescriptionId: jdId,
      matchScore: 75,
      breakdown: {
        keywords: 82,
        experience: 65,
        skills: 70,
        education: 80
      },
      missingKeywords: mockMissingKeywords,
      strengths: mockStrengths,
      aiExplanation: {
        summary: 'Your resume is a 75% match for this position. You have strong technical skills but are missing some key technologies mentioned in the job description.',
        whyMismatch: 'The job description emphasizes containerization (Docker) and GraphQL experience, which are not evident in your resume. Additionally, CI/CD pipeline experience could be highlighted more prominently.',
        priorityChanges: [
          'Add Docker and containerization experience to your skills and project descriptions',
          'Include any GraphQL API development work you\'ve done',
          'Highlight CI/CD pipeline setup and automation experience'
        ],
        improvementTips: [
          'Add a project showcasing microservices architecture with Docker',
          'Mention specific GraphQL implementations if applicable',
          'Quantify the impact of your automation work',
          'Align your technical skills section with the job requirements'
        ]
      },
      generatedAt: new Date().toISOString()
    };

    matches.set(matchId, match);
    mockHelpers.incrementUsage(req.user.id, 'matches');

    res.json(match);
  },

  // GET /api/resumes/:resumeId/matches
  getResumeMatches: (req: Request, res: Response) => {
    if (!req.user) {
      return res.status(401).json({
        error: 'unauthorized',
        message: 'Authentication required'
      });
    }

    const { resumeId } = req.params;
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;

    const resume = resumes.get(resumeId);

    if (!resume) {
      return res.status(404).json({
        error: 'not_found',
        message: 'Resume not found'
      });
    }

    if (!mockHelpers.userOwnsResume(req.user.id, resumeId)) {
      return res.status(403).json({
        error: 'forbidden',
        message: 'You do not have permission to access this resource'
      });
    }

    const resumeMatches = mockHelpers.getMatchesByResume(resumeId);

    // Paginate
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedMatches = resumeMatches.slice(startIndex, endIndex);

    // Map to list format
    const matchList = paginatedMatches.map(match => {
      const jd = jobDescriptions.get(match.jobDescriptionId);
      return {
        matchId: match.matchId,
        jobDescriptionId: match.jobDescriptionId,
        jobTitle: jd?.title || 'Unknown',
        company: jd?.company || 'Unknown',
        matchScore: match.matchScore,
        createdAt: match.generatedAt
      };
    });

    res.json({
      matches: matchList,
      pagination: {
        page,
        limit,
        total: resumeMatches.length,
        totalPages: Math.ceil(resumeMatches.length / limit)
      }
    });
  },

  // GET /api/matches/:matchId
  getMatchById: (req: Request, res: Response) => {
    if (!req.user) {
      return res.status(401).json({
        error: 'unauthorized',
        message: 'Authentication required'
      });
    }

    const { matchId } = req.params;
    const match = matches.get(matchId);

    if (!match) {
      return res.status(404).json({
        error: 'not_found',
        message: 'Match not found'
      });
    }

    if (!mockHelpers.userOwnsResume(req.user.id, match.resumeId)) {
      return res.status(403).json({
        error: 'forbidden',
        message: 'You do not have permission to access this resource'
      });
    }

    res.json(match);
  }
};
