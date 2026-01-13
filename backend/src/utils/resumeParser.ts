/**
 * Resume Section Parser
 *
 * Extracts structured data from resume text using regex patterns.
 * This is a simplified MVP implementation that works for most standard resumes.
 */

export interface ContactInfo {
  name?: string;
  email?: string;
  phone?: string;
  linkedin?: string;
  github?: string;
  location?: string;
}

export interface ExperienceItem {
  title?: string;
  company?: string;
  dates?: string;
  description?: string;
  bullets?: string[];
}

export interface EducationItem {
  degree?: string;
  institution?: string;
  dates?: string;
  gpa?: string;
  location?: string;
}

export interface ProjectItem {
  title?: string;
  description?: string;
  technologies?: string[];
  dates?: string;
  url?: string;
}

export interface ParsedSections {
  contact?: ContactInfo;
  experience?: ExperienceItem[];
  education?: EducationItem[];
  skills?: string[];
  projects?: ProjectItem[];
}

/**
 * Extract contact information from resume text
 */
const extractContactInfo = (text: string): ContactInfo => {
  const contact: ContactInfo = {};

  // Extract email (most reliable)
  const emailMatch = text.match(/[\w\.-]+@[\w\.-]+\.\w+/i);
  if (emailMatch) {
    contact.email = emailMatch[0];
  }

  // Extract phone (various formats)
  const phoneMatch = text.match(/(\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}/);
  if (phoneMatch) {
    contact.phone = phoneMatch[0];
  }

  // Extract LinkedIn URL
  const linkedinMatch = text.match(/(?:https?:\/\/)?(?:www\.)?linkedin\.com\/in\/[\w-]+/i);
  if (linkedinMatch) {
    contact.linkedin = linkedinMatch[0];
  }

  // Extract GitHub URL
  const githubMatch = text.match(/(?:https?:\/\/)?(?:www\.)?github\.com\/[\w-]+/i);
  if (githubMatch) {
    contact.github = githubMatch[0];
  }

  // Extract name (first few lines, typically before email)
  // Look for capitalized words at the beginning
  const lines = text.split('\n').slice(0, 10); // Check first 10 lines
  for (const line of lines) {
    const trimmedLine = line.trim();
    // Name is typically 2-4 capitalized words at the start
    if (/^[A-Z][a-z]+(\s+[A-Z][a-z]+){1,3}$/.test(trimmedLine) && trimmedLine.length < 50) {
      contact.name = trimmedLine;
      break;
    }
  }

  // Extract location (city, state or country)
  const locationMatch = text.match(/(?:^|\n)([A-Z][a-z]+(?:\s+[A-Z][a-z]+)*,\s*[A-Z]{2}(?:\s+\d{5})?)/m);
  if (locationMatch) {
    contact.location = locationMatch[1];
  }

  return contact;
};

/**
 * Find section by header (case-insensitive)
 */
const findSection = (text: string, headers: string[]): string => {
  const headerPattern = headers.join('|');
  const regex = new RegExp(`(?:^|\\n)\\s*(${headerPattern})\\s*(?:\\n|:)`, 'im');
  const match = text.match(regex);

  if (!match) {
    return '';
  }

  const startIndex = match.index! + match[0].length;

  // Find the next section header (common headers)
  const nextSectionRegex = /\n\s*(?:EXPERIENCE|EDUCATION|SKILLS|PROJECTS|CERTIFICATIONS|AWARDS|PUBLICATIONS|SUMMARY|OBJECTIVE|TECHNICAL SKILLS|WORK EXPERIENCE|PROFESSIONAL EXPERIENCE)\s*(?:\n|:)/im;
  const nextMatch = text.slice(startIndex).match(nextSectionRegex);

  const endIndex = nextMatch ? startIndex + nextMatch.index! : text.length;
  return text.slice(startIndex, endIndex).trim();
};

/**
 * Extract experience section
 */
const extractExperience = (text: string): ExperienceItem[] => {
  const sectionText = findSection(text, [
    'EXPERIENCE',
    'WORK EXPERIENCE',
    'PROFESSIONAL EXPERIENCE',
    'EMPLOYMENT',
    'EMPLOYMENT HISTORY',
  ]);

  if (!sectionText) {
    return [];
  }

  const experiences: ExperienceItem[] = [];

  // Split by common job entry patterns (multiple newlines or job title patterns)
  const entries = sectionText.split(/\n\s*\n/);

  for (const entry of entries) {
    if (entry.trim().length < 10) continue; // Skip very short entries

    const lines = entry.split('\n').map((l) => l.trim()).filter((l) => l.length > 0);
    if (lines.length === 0) continue;

    const experience: ExperienceItem = {};

    // First line typically contains title and/or company
    const firstLine = lines[0];

    // Try to extract dates (various formats)
    const datePatterns = [
      /(\d{4}\s*[-–]\s*(?:\d{4}|Present|Current))/i,
      /([A-Z][a-z]+\s+\d{4}\s*[-–]\s*(?:[A-Z][a-z]+\s+\d{4}|Present|Current))/i,
      /(\d{1,2}\/\d{4}\s*[-–]\s*(?:\d{1,2}\/\d{4}|Present|Current))/i,
    ];

    let dateMatch = null;
    for (const pattern of datePatterns) {
      dateMatch = entry.match(pattern);
      if (dateMatch) {
        experience.dates = dateMatch[1];
        break;
      }
    }

    // Extract company and title
    // Common patterns: "Title | Company", "Title at Company", "Company - Title"
    if (firstLine.includes('|')) {
      const parts = firstLine.split('|').map((p) => p.trim());
      experience.title = parts[0];
      experience.company = parts[1];
    } else if (firstLine.includes(' at ')) {
      const parts = firstLine.split(' at ');
      experience.title = parts[0].trim();
      experience.company = parts[1].trim();
    } else if (firstLine.includes(' - ')) {
      const parts = firstLine.split(' - ');
      // Could be "Company - Title" or "Title - Company"
      // Usually title comes first in resumes
      experience.title = parts[0].trim();
      experience.company = parts[1].trim();
    } else {
      // Fallback: first line is title, second might be company
      experience.title = firstLine;
      if (lines.length > 1 && !lines[1].startsWith('•') && !lines[1].startsWith('-')) {
        experience.company = lines[1];
      }
    }

    // Extract bullet points (responsibilities/achievements)
    const bullets: string[] = [];
    for (const line of lines) {
      if (line.startsWith('•') || line.startsWith('-') || line.startsWith('*')) {
        bullets.push(line.replace(/^[•\-*]\s*/, '').trim());
      }
    }

    if (bullets.length > 0) {
      experience.bullets = bullets;
      experience.description = bullets.join(' ');
    } else {
      // If no bullets, use all text after first few lines as description
      experience.description = lines.slice(1).join(' ').trim();
    }

    // Only add if we have at least a title or company
    if (experience.title || experience.company) {
      experiences.push(experience);
    }
  }

  return experiences;
};

/**
 * Extract education section
 */
const extractEducation = (text: string): EducationItem[] => {
  const sectionText = findSection(text, [
    'EDUCATION',
    'ACADEMIC BACKGROUND',
    'EDUCATIONAL BACKGROUND',
  ]);

  if (!sectionText) {
    return [];
  }

  const educationItems: EducationItem[] = [];

  // Split by multiple newlines or degree patterns
  const entries = sectionText.split(/\n\s*\n/);

  for (const entry of entries) {
    if (entry.trim().length < 10) continue;

    const education: EducationItem = {};

    // Extract degree (BS, BA, MS, MBA, PhD, etc.)
    const degreeMatch = entry.match(/((?:Bachelor|Master|PhD|Ph\.D\.|B\.S\.|B\.A\.|M\.S\.|M\.A\.|MBA)(?:\s+of\s+(?:Science|Arts|Engineering|Business Administration))?(?:\s+in\s+[\w\s]+)?)/i);
    if (degreeMatch) {
      education.degree = degreeMatch[1].trim();
    }

    // Extract institution (university name)
    // Look for lines with "University", "College", "Institute"
    const institutionMatch = entry.match(/([A-Z][\w\s&,]+(?:University|College|Institute|School)[A-Z\w\s&,]*)/);
    if (institutionMatch) {
      education.institution = institutionMatch[1].trim();
    }

    // Extract dates
    const dateMatch = entry.match(/(\d{4}\s*[-–]\s*(?:\d{4}|Present|Current))/i) || entry.match(/(?:Graduated|Class of)\s+(\d{4})/i);
    if (dateMatch) {
      education.dates = dateMatch[1];
    }

    // Extract GPA
    const gpaMatch = entry.match(/GPA:?\s*(\d+\.\d+(?:\s*\/\s*\d+\.\d+)?)/i);
    if (gpaMatch) {
      education.gpa = gpaMatch[1];
    }

    // Only add if we have at least a degree or institution
    if (education.degree || education.institution) {
      educationItems.push(education);
    }
  }

  return educationItems;
};

/**
 * Extract skills section
 */
const extractSkills = (text: string): string[] => {
  const sectionText = findSection(text, [
    'SKILLS',
    'TECHNICAL SKILLS',
    'CORE COMPETENCIES',
    'TECHNOLOGIES',
    'TECH STACK',
  ]);

  if (!sectionText) {
    return [];
  }

  const skills: string[] = [];

  // Remove common separators and split
  const cleaned = sectionText
    .replace(/[•\-*]/g, ',')
    .replace(/\n/g, ',')
    .replace(/\s+/g, ' ');

  const items = cleaned.split(',').map((s) => s.trim()).filter((s) => s.length > 0);

  for (const item of items) {
    // Skip very long items (likely sentences, not skills)
    if (item.length > 50) continue;

    // Skip items that look like section headers
    if (/^(?:Languages|Frameworks|Tools|Databases|Other):?$/i.test(item)) continue;

    skills.push(item);
  }

  return skills;
};

/**
 * Extract projects section
 */
const extractProjects = (text: string): ProjectItem[] => {
  const sectionText = findSection(text, [
    'PROJECTS',
    'PERSONAL PROJECTS',
    'KEY PROJECTS',
    'NOTABLE PROJECTS',
  ]);

  if (!sectionText) {
    return [];
  }

  const projects: ProjectItem[] = [];

  // Split by multiple newlines or project title patterns
  const entries = sectionText.split(/\n\s*\n/);

  for (const entry of entries) {
    if (entry.trim().length < 10) continue;

    const project: ProjectItem = {};
    const lines = entry.split('\n').map((l) => l.trim()).filter((l) => l.length > 0);

    if (lines.length === 0) continue;

    // First line is typically the project title
    project.title = lines[0].replace(/^[•\-*]\s*/, '');

    // Extract URL if present
    const urlMatch = entry.match(/(https?:\/\/[^\s]+)/);
    if (urlMatch) {
      project.url = urlMatch[1];
    }

    // Extract dates
    const dateMatch = entry.match(/(\d{4}(?:\s*[-–]\s*(?:\d{4}|Present))?)/);
    if (dateMatch) {
      project.dates = dateMatch[1];
    }

    // Extract technologies (often in parentheses or after "Tech:")
    const techMatch = entry.match(/(?:Technologies?|Tech|Built with):?\s*([^.\n]+)/i);
    if (techMatch) {
      const techString = techMatch[1];
      project.technologies = techString.split(/[,|]/).map((t) => t.trim()).filter((t) => t.length > 0);
    }

    // Description is everything else
    const description = lines.slice(1)
      .filter((l) => !l.match(/^(?:Technologies?|Tech|Built with):/i))
      .join(' ')
      .replace(/^[•\-*]\s*/, '')
      .trim();

    if (description) {
      project.description = description;
    }

    if (project.title) {
      projects.push(project);
    }
  }

  return projects;
};

/**
 * Main parser function to extract all sections from resume text
 */
export const parseResumeSections = (text: string): ParsedSections => {
  // Normalize text (fix common encoding issues)
  const normalizedText = text
    .replace(/\r\n/g, '\n')
    .replace(/\r/g, '\n')
    .replace(/\u00A0/g, ' '); // Replace non-breaking spaces

  return {
    contact: extractContactInfo(normalizedText),
    experience: extractExperience(normalizedText),
    education: extractEducation(normalizedText),
    skills: extractSkills(normalizedText),
    projects: extractProjects(normalizedText),
  };
};
