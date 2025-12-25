import { v4 as uuidv4 } from 'uuid';
import { resumes, mockHelpers } from '../models/mockData';
import { Resume, Role } from '../types';

interface CreateResumeParams {
  userId: string;
  rawText: string;
  fileName: string;
  role: Role;
}

interface ResumeListItem {
  id: string;
  fileName: string;
  role: Role;
  createdAt: string;
  updatedAt: string;
  hasAnalysis: boolean;
  hasMatch: boolean;
}

export const resumeService = {
  createResume: (params: CreateResumeParams): Resume => {
    const { userId, rawText, fileName, role } = params;
    const resumeId = uuidv4();

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
          location: 'San Francisco, CA',
        },
        experience: [
          {
            title: 'Senior Backend Engineer',
            company: 'Tech Corp',
            duration: '2020-2024',
            description: 'Built scalable microservices handling 1M+ requests/day',
          },
        ],
        education: [
          {
            degree: 'BS Computer Science',
            institution: 'Stanford University',
            year: '2019',
          },
        ],
        skills: ['Node.js', 'TypeScript', 'PostgreSQL', 'Docker', 'Kubernetes'],
        projects: [
          {
            name: 'E-commerce Platform',
            description: 'Built a full-stack e-commerce platform with React and Node.js',
          },
        ],
      },
      role,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      status: 'parsed',
    };

    resumes.set(resumeId, resume);
    return resume;
  },

  getResumeById: (resumeId: string): Resume | null => {
    return resumes.get(resumeId) || null;
  },

  getUserResumes: (userId: string): Resume[] => {
    return mockHelpers.getResumesByUser(userId);
  },

  getResumeListItems: (resumes: Resume[]): ResumeListItem[] => {
    return resumes.map((resume) => {
      const analyses = mockHelpers.getAnalysesByResume(resume.id);
      const matches = mockHelpers.getMatchesByResume(resume.id);

      return {
        id: resume.id,
        fileName: resume.fileName,
        role: resume.role,
        createdAt: resume.createdAt,
        updatedAt: resume.updatedAt,
        hasAnalysis: analyses.length > 0,
        hasMatch: matches.length > 0,
      };
    });
  },

  deleteResume: (resumeId: string): boolean => {
    return resumes.delete(resumeId);
  },

  userOwnsResume: (userId: string, resumeId: string): boolean => {
    return mockHelpers.userOwnsResume(userId, resumeId);
  },
};
