export interface Analysis {
  id: string
  resumeId: string
  overallScore: number
  metrics: AnalysisMetrics
  suggestions: Suggestion[]
  generatedAt: Date
}

export interface AnalysisMetrics {
  clarity: number
  impact: number
  atsScore: number
  technicalDepth: number
}

export interface Suggestion {
  id: string
  type: 'critical' | 'warning' | 'info'
  category: string
  title: string
  description: string
  original?: string
  suggested?: string
}
