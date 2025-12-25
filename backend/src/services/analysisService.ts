import { v4 as uuidv4 } from 'uuid';
import { analyses, mockHelpers } from '../models/mockData';
import { Analysis, Suggestion, Role } from '../types';

const generateMockSuggestions = (targetRole: Role): Suggestion[] => {
  return [
    {
      id: uuidv4(),
      section: 'experience',
      severity: 'critical',
      title: 'Quantify Your Impact',
      description: 'Add specific metrics to demonstrate the scale and impact of your work',
      originalText: 'Built scalable microservices',
      suggestedText: 'Built scalable microservices handling 1M+ requests/day with 99.9% uptime',
      reasoning: 'Adding quantifiable metrics makes your achievements more concrete and impressive to recruiters',
    },
    {
      id: uuidv4(),
      section: 'experience',
      severity: 'warning',
      title: 'Use STAR Method',
      description: 'Structure your bullet points using Situation, Task, Action, Result format',
      originalText: 'Led team of 5 engineers',
      suggestedText: 'Led cross-functional team of 5 engineers to deliver a critical microservices migration, reducing infrastructure costs by 40% and improving response times by 60%',
      reasoning: 'STAR method provides context and demonstrates leadership impact with measurable outcomes',
    },
    {
      id: uuidv4(),
      section: 'skills',
      severity: 'info',
      title: 'Add Relevant Technologies',
      description: `For ${targetRole} role, consider adding: GraphQL, Redis, AWS Lambda`,
      originalText: 'Node.js, TypeScript, PostgreSQL',
      suggestedText: 'Node.js, TypeScript, PostgreSQL, GraphQL, Redis, AWS Lambda',
      reasoning: 'These technologies are commonly required for modern backend engineering roles',
    },
  ];
};

export const analysisService = {
  createAnalysis: (resumeId: string, targetRole: Role): Analysis => {
    const analysisId = uuidv4();
    const suggestions = generateMockSuggestions(targetRole);

    const analysis: Analysis = {
      analysisId,
      resumeId,
      scores: {
        overall: 82,
        clarity: 90,
        impact: 65,
        atsFriendliness: 88,
        technicalDepth: 85,
      },
      suggestions,
      summary: `Your resume shows strong technical foundation for a ${targetRole} position. Key areas for improvement: quantifying impact with metrics (65% score), adding more context using STAR method, and ensuring ATS compatibility. Your technical depth is solid, but adding specific project outcomes would strengthen your profile.`,
      generatedAt: new Date().toISOString(),
    };

    analyses.set(analysisId, analysis);
    return analysis;
  },

  getAnalysisById: (analysisId: string): Analysis | null => {
    return analyses.get(analysisId) || null;
  },

  getLatestResumeAnalysis: (resumeId: string): Analysis | null => {
    const resumeAnalyses = mockHelpers.getAnalysesByResume(resumeId);
    return resumeAnalyses.length > 0 ? resumeAnalyses[0] : null;
  },
};
