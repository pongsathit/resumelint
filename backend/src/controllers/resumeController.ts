import { Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { resumes, mockHelpers } from '../models/mockData';
import { Resume, Role } from '../types';

export const resumeController = {
  // POST /api/resumes
  create: (req: Request, res: Response) => {
    const { text, role } = req.body;
    const file = req.file;

    // Validate role
    const validRoles: Role[] = [
      'Backend Engineer',
      'Frontend Engineer',
      'Fullstack Developer',
      'Mobile Developer',
      'Tech Lead'
    ];

    if (!role || !validRoles.includes(role)) {
      return res.status(400).json({
        error: 'validation_error',
        message: 'Invalid or missing role',
        details: [{ field: 'role', message: 'Invalid role value' }]
      });
    }

    let rawText = '';
    let fileName = '';

    if (file) {
      // For file upload
      fileName = file.originalname;
      // In real implementation, would parse PDF here
      // For mock, just use dummy text
      rawText = `Mock parsed content from ${fileName}\n\nJohn Doe\nSoftware Engineer\n\nExperience:\n- Senior Backend Engineer at Tech Corp (2020-2024)\n- Built scalable microservices handling 1M+ requests/day\n- Led team of 5 engineers\n\nSkills:\nNode.js, TypeScript, PostgreSQL, Docker, Kubernetes`;
    } else if (text) {
      // For text input
      fileName = 'resume.txt';
      rawText = text;
    } else {
      return res.status(400).json({
        error: 'validation_error',
        message: 'Either file or text is required',
        details: [{ field: 'file/text', message: 'Either file or text must be provided' }]
      });
    }

    const resumeId = uuidv4();
    const userId = req.user?.id || 'anonymous';

    const resume: Resume = {
      id: resumeId,
      userId,
      fileName,
      rawText,
      parsedSections: {
        contact: {
          name: 'John Doe',
          email: 'john.doe@example.com',
          phone: '+1-555-0100',
          location: 'San Francisco, CA'
        },
        experience: [
          {
            title: 'Senior Backend Engineer',
            company: 'Tech Corp',
            duration: '2020-2024',
            description: 'Built scalable microservices handling 1M+ requests/day'
          }
        ],
        education: [
          {
            degree: 'BS Computer Science',
            institution: 'Stanford University',
            year: '2019'
          }
        ],
        skills: ['Node.js', 'TypeScript', 'PostgreSQL', 'Docker', 'Kubernetes'],
        projects: [
          {
            name: 'E-commerce Platform',
            description: 'Built a full-stack e-commerce platform with React and Node.js'
          }
        ]
      },
      role,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      status: 'parsed'
    };

    resumes.set(resumeId, resume);

    res.json(resume);
  },

  // GET /api/resumes
  list: (req: Request, res: Response) => {
    if (!req.user) {
      return res.status(401).json({
        error: 'unauthorized',
        message: 'Authentication required'
      });
    }

    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;

    const userResumes = mockHelpers.getResumesByUser(req.user.id);

    // Paginate
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedResumes = userResumes.slice(startIndex, endIndex);

    // Map to list format with hasAnalysis and hasMatch flags
    const resumeList = paginatedResumes.map(resume => {
      const analyses = mockHelpers.getAnalysesByResume(resume.id);
      const matches = mockHelpers.getMatchesByResume(resume.id);

      return {
        id: resume.id,
        fileName: resume.fileName,
        role: resume.role,
        createdAt: resume.createdAt,
        updatedAt: resume.updatedAt,
        hasAnalysis: analyses.length > 0,
        hasMatch: matches.length > 0
      };
    });

    res.json({
      resumes: resumeList,
      pagination: {
        page,
        limit,
        total: userResumes.length,
        totalPages: Math.ceil(userResumes.length / limit)
      }
    });
  },

  // GET /api/resumes/:id
  getById: (req: Request, res: Response) => {
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

    res.json(resume);
  },

  // DELETE /api/resumes/:id
  delete: (req: Request, res: Response) => {
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

    resumes.delete(id);

    res.json({
      success: true,
      message: 'Resume deleted successfully'
    });
  }
};
