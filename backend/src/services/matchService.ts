import { v4 as uuidv4 } from 'uuid';
import { MatchRepository } from '../repositories';
import { JobDescription, Match, MissingKeyword, Strength } from '../types';

const generateMockMissingKeywords = (): MissingKeyword[] => {
  return [
    {
      keyword: 'Docker',
      importance: 'high',
      frequency: 5,
    },
    {
      keyword: 'GraphQL',
      importance: 'high',
      frequency: 4,
    },
    {
      keyword: 'Redis',
      importance: 'medium',
      frequency: 3,
    },
    {
      keyword: 'CI/CD',
      importance: 'medium',
      frequency: 2,
    },
  ];
};

const generateMockStrengths = (): Strength[] => {
  return [
    {
      keyword: 'Node.js',
      matchStrength: 'high',
      context: 'Strong experience with Node.js in building scalable backend systems',
    },
    {
      keyword: 'TypeScript',
      matchStrength: 'high',
      context: 'Proficient in TypeScript for type-safe development',
    },
    {
      keyword: 'PostgreSQL',
      matchStrength: 'medium',
      context: 'Database experience matches job requirements',
    },
  ];
};

export const matchService = {
  createJobDescription: async (params: {
    userId?: string;
    rawText: string;
    title?: string;
    company?: string;
  }): Promise<JobDescription> => {
    const jdId = uuidv4();

    return await MatchRepository.createJobDescription({
      id: jdId,
      userId: params.userId,
      rawText: params.rawText,
      title: params.title || 'Software Engineer',
      company: params.company || 'Tech Company',
    });
  },

  createMatch: async (resumeId: string, jobDescriptionId: string): Promise<Match> => {
    const matchId = uuidv4();

    return await MatchRepository.createMatch({
      matchId,
      resumeId,
      jobDescriptionId,
      matchScore: 75,
      breakdown: {
        keywords: 82,
        experience: 65,
        skills: 70,
        education: 80,
      },
      missingKeywords: generateMockMissingKeywords(),
      strengths: generateMockStrengths(),
      aiExplanation: {
        summary: 'Your resume is a 75% match for this position. You have strong technical skills but are missing some key technologies mentioned in the job description.',
        whyMismatch: 'The job description emphasizes containerization (Docker) and GraphQL experience, which are not evident in your resume. Additionally, CI/CD pipeline experience could be highlighted more prominently.',
        priorityChanges: [
          'Add Docker and containerization experience to your skills and project descriptions',
          "Include any GraphQL API development work you've done",
          'Highlight CI/CD pipeline setup and automation experience',
        ],
        improvementTips: [
          'Add a project showcasing microservices architecture with Docker',
          'Mention specific GraphQL implementations if applicable',
          'Quantify the impact of your automation work',
          'Align your technical skills section with the job requirements',
        ],
      },
    });
  },

  getMatchById: async (matchId: string): Promise<Match | null> => {
    return await MatchRepository.getMatchById(matchId);
  },

  getResumeMatches: async (resumeId: string): Promise<Match[]> => {
    return await MatchRepository.getResumeMatches(resumeId);
  },

  getJobDescriptionById: async (jdId: string): Promise<JobDescription | null> => {
    return await MatchRepository.getJobDescriptionById(jdId);
  },
};
