import { v4 as uuidv4 } from 'uuid';
import { ResumeRepository } from '../repositories';
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
  createResume: async (params: CreateResumeParams): Promise<Resume> => {
    const { userId, rawText, fileName, role } = params;

    const parsedSections = {
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
    };

    return await ResumeRepository.createResume({
      userId,
      rawText,
      fileName,
      role,
      parsedSections,
    });
  },

  getResumeById: async (resumeId: string): Promise<Resume | null> => {
    return await ResumeRepository.getResumeById(resumeId);
  },

  getUserResumes: async (userId: string): Promise<Resume[]> => {
    return await ResumeRepository.getUserResumes(userId);
  },

  getResumeListItems: async (resumes: Resume[]): Promise<ResumeListItem[]> => {
    const listItems = await Promise.all(
      resumes.map(async (resume) => {
        const hasAnalysis = await ResumeRepository.hasAnalyses(resume.id);
        const hasMatch = await ResumeRepository.hasMatches(resume.id);

        return {
          id: resume.id,
          fileName: resume.fileName,
          role: resume.role,
          createdAt: resume.createdAt,
          updatedAt: resume.updatedAt,
          hasAnalysis,
          hasMatch,
        };
      })
    );

    return listItems;
  },

  deleteResume: async (resumeId: string): Promise<boolean> => {
    return await ResumeRepository.deleteResume(resumeId);
  },

  userOwnsResume: async (userId: string, resumeId: string): Promise<boolean> => {
    return await ResumeRepository.userOwnsResume(userId, resumeId);
  },
};
