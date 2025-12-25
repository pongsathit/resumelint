// Types based on API_DESIGN.md

export type Provider = 'google' | 'github' | 'email';
export type SubscriptionTier = 'free' | 'pro';
export type Role = 'Backend Engineer' | 'Frontend Engineer' | 'Fullstack Developer' | 'Mobile Developer' | 'Tech Lead';
export type Section = 'experience' | 'skills' | 'projects' | 'summary';
export type Severity = 'critical' | 'warning' | 'info';
export type Importance = 'high' | 'medium' | 'low';
export type MatchStrength = 'high' | 'medium' | 'low';
export type Focus = 'impact' | 'metrics' | 'seniority' | 'ats';
export type ExportType = 'resume' | 'analysis' | 'match' | 'rewrite';
export type LinkType = 'article' | 'video' | 'course' | 'documentation';
export type TargetLevel = 'senior' | 'staff' | 'principal';
export type Gap = 'large' | 'missing' | 'small';
export type SkillLevel = 'beginner' | 'intermediate' | 'expert';
export type ResumeStatus = 'parsed' | 'processing' | 'error';

export interface User {
  id: string;
  email: string;
  name: string;
  avatar: string;
  subscriptionTier: SubscriptionTier;
  defaultRole?: Role;
  usageCount: {
    analyses: number;
    matches: number;
    rewrites: number;
  };
  limits: {
    maxAnalyses: number;
    maxMatches: number;
    maxRewrites: number;
  };
  createdAt: string;
  updatedAt?: string;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

export interface Resume {
  id: string;
  userId: string;
  fileName: string;
  rawText: string;
  parsedSections: {
    contact?: Record<string, any>;
    experience?: Array<Record<string, any>>;
    education?: Array<Record<string, any>>;
    skills?: Array<string>;
    projects?: Array<Record<string, any>>;
  };
  role: Role;
  createdAt: string;
  updatedAt: string;
  status: ResumeStatus;
}

export interface Suggestion {
  id: string;
  section: Section;
  severity: Severity;
  title: string;
  description: string;
  originalText: string;
  suggestedText: string;
  reasoning: string;
}

export interface Analysis {
  analysisId: string;
  resumeId: string;
  scores: {
    overall: number;
    clarity: number;
    impact: number;
    atsFriendliness: number;
    technicalDepth: number;
  };
  suggestions: Suggestion[];
  summary: string;
  generatedAt: string;
}

export interface JobDescription {
  id: string;
  userId?: string;
  rawText: string;
  title: string;
  company: string;
  createdAt: string;
}

export interface MissingKeyword {
  keyword: string;
  importance: Importance;
  frequency: number;
}

export interface Strength {
  keyword: string;
  matchStrength: MatchStrength;
  context: string;
}

export interface Match {
  matchId: string;
  resumeId: string;
  jobDescriptionId: string;
  matchScore: number;
  breakdown: {
    keywords: number;
    experience: number;
    skills: number;
    education: number;
  };
  missingKeywords: MissingKeyword[];
  strengths: Strength[];
  aiExplanation: {
    summary: string;
    whyMismatch: string;
    priorityChanges: string[];
    improvementTips: string[];
  };
  generatedAt: string;
}

export interface Change {
  section: string;
  originalBullet: string;
  rewrittenBullet: string;
  improvements: string[];
  explanation: string;
}

export interface Rewrite {
  rewriteId: string;
  resumeId: string;
  originalText: string;
  rewrittenText: string;
  changes: Change[];
  scoreImprovement: {
    before: number;
    after: number;
    delta: number;
  };
  version: number;
  generatedAt: string;
  updatedAt?: string;
}

export interface TechnicalSkillGap {
  skill: string;
  currentLevel: SkillLevel;
  requiredLevel: SkillLevel;
  gap: Gap;
  importance: Importance;
}

export interface SkillGap {
  skill: string;
  gap: Gap;
  recommendation: string;
}

export interface CareerGapAnalysis {
  gapAnalysisId: string;
  resumeId: string;
  currentRole: Role;
  targetRole: Role;
  gaps: {
    technicalSkills: TechnicalSkillGap[];
    systemDesign: SkillGap[];
    leadership: SkillGap[];
  };
  strengths: string[];
  generatedAt: string;
}

export interface Link {
  title: string;
  url: string;
  type: LinkType;
}

export interface Topic {
  title: string;
  description: string;
  links: Link[];
  estimatedHours: number;
  completed: boolean;
}

export interface Module {
  id: string;
  week: number;
  title: string;
  description: string;
  topics: Topic[];
  completed: boolean;
}

export interface LearningRoadmap {
  roadmapId: string;
  gapAnalysisId: string;
  timeline: number;
  modules: Module[];
  estimatedTotalHours: number;
  generatedAt: string;
}

export interface Usage {
  tier: SubscriptionTier;
  usage: {
    analyses: {
      used: number;
      limit: number;
      resetAt: string;
    };
    matches: {
      used: number;
      limit: number;
      resetAt: string;
    };
    rewrites: {
      used: number;
      limit: number;
      resetAt: string;
    };
  };
  canAnalyze: boolean;
  canMatch: boolean;
  canRewrite: boolean;
}
