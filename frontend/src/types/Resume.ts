export interface Resume {
  id: string
  userId: string
  fileName: string
  rawText: string
  parsedSections: ParsedSections
  uploadedAt: Date
}

export interface ParsedSections {
  summary?: string
  experience: Experience[]
  education: Education[]
  skills: string[]
  projects?: Project[]
}

export interface Experience {
  title: string
  company: string
  startDate: string
  endDate: string
  bullets: string[]
}

export interface Education {
  degree: string
  institution: string
  graduationDate: string
}

export interface Project {
  name: string
  description: string
  technologies: string[]
  link?: string
}
