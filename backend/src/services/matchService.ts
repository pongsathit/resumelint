import { v4 as uuidv4 } from 'uuid';
import { jobDescriptions, matches, mockHelpers } from '../models/mockData';
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
  createJobDescription: (params: {
    userId?: string;
    rawText: string;
    title?: string;
    company?: string;
  }): JobDescription => {
    const jdId = uuidv4();

    const jobDescription: JobDescription = {
      id: jdId,
      userId: params.userId,
      rawText: params.rawText,
      title: params.title || 'Software Engineer',
      company: params.company || 'Tech Company',
      createdAt: new Date().toISOString(),
    };

    jobDescriptions.set(jdId, jobDescription);
    return jobDescription;
  },

  createMatch: (resumeId: string, jobDescriptionId: string): Match => {
    const matchId = uuidv4();

    const match: Match = {
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
      generatedAt: new Date().toISOString(),
    };

    matches.set(matchId, match);
    return match;
  },

  getMatchById: (matchId: string): Match | null => {
    return matches.get(matchId) || null;
  },

  getResumeMatches: (resumeId: string): Match[] => {
    return mockHelpers.getMatchesByResume(resumeId);
  },

  getJobDescriptionById: (jdId: string): JobDescription | null => {
    return jobDescriptions.get(jdId) || null;
  },
};
