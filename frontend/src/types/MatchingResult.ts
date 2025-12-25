export interface MatchingResult {
  id: string
  resumeId: string
  jobDescriptionId: string
  overallScore: number
  keywordScore: number
  experienceScore: number
  missingKeywords: Keyword[]
  matchingKeywords: Keyword[]
  gaps: Gap[]
  aiAnalysis: string
  improvementTips: string[]
  generatedAt: Date
}

export interface Keyword {
  term: string
  importance: 'high' | 'medium' | 'low'
}

export interface Gap {
  category: string
  requirement: string
  foundInResume: string
  status: 'missing' | 'partial' | 'match'
}
