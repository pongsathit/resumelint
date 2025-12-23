export interface JobDescription {
  id: string
  rawText: string
  parsedRequirements: ParsedRequirements
  createdAt: Date
}

export interface ParsedRequirements {
  title: string
  company?: string
  requiredSkills: string[]
  preferredSkills: string[]
  experience: string
  education?: string
}
