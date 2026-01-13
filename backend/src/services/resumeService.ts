import { v4 as uuidv4 } from 'uuid';
import { Resume, Role } from '../types';
import { prisma } from '../utils/prisma';
import { extractTextFromPDF } from '../utils/pdfParser';
import { extractTextFromDOCX } from '../utils/docxParser';
import { parseResumeSections } from '../utils/resumeParser';

interface CreateResumeParams {
  userId: string;
  rawText?: string;
  fileName: string;
  role: Role;
  fileBuffer?: Buffer;
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
    const { userId, rawText, fileName, role, fileBuffer } = params;
    const resumeId = uuidv4();

    let extractedText = rawText || '';

    // Extract text from file buffer if provided
    if (fileBuffer) {
      try {
        const fileExtension = fileName.toLowerCase().split('.').pop();

        if (fileExtension === 'pdf') {
          extractedText = await extractTextFromPDF(fileBuffer);
        } else if (fileExtension === 'docx') {
          extractedText = await extractTextFromDOCX(fileBuffer);
        } else if (fileExtension === 'doc') {
          // DOC format is older and more complex, mammoth handles basic cases
          extractedText = await extractTextFromDOCX(fileBuffer);
        } else if (fileExtension === 'txt') {
          extractedText = fileBuffer.toString('utf-8');
        } else {
          throw new Error(`Unsupported file type: ${fileExtension}. Please upload PDF, DOCX, DOC, or TXT files.`);
        }
      } catch (error) {
        console.error('Error extracting text from file:', error);
        if (error instanceof Error) {
          throw new Error(`File parsing failed: ${error.message}`);
        }
        throw new Error('Failed to parse resume file');
      }
    }

    // Validate that we have text to parse
    if (!extractedText || extractedText.trim().length === 0) {
      throw new Error('Resume appears to be empty. Please provide a valid resume file or text.');
    }

    // Parse resume sections using real parsing logic
    const parsedSections = parseResumeSections(extractedText);

    try {
      const dbResume = await prisma.resume.create({
        data: {
          id: resumeId,
          userId,
          fileName,
          rawText: extractedText,
          parsedSections: parsedSections as any,
          role,
          status: 'parsed',
        },
      });

      return {
        id: dbResume.id,
        userId: dbResume.userId,
        fileName: dbResume.fileName,
        rawText: dbResume.rawText,
        parsedSections: dbResume.parsedSections as Resume['parsedSections'],
        role: dbResume.role as Role,
        createdAt: dbResume.createdAt.toISOString(),
        updatedAt: dbResume.updatedAt.toISOString(),
        status: dbResume.status as Resume['status'],
      };
    } catch (error) {
      console.error('Error creating resume in database:', error);
      if (error instanceof Error) {
        throw new Error(`Failed to save resume: ${error.message}`);
      }
      throw new Error('Failed to create resume');
    }
  },

  getResumeById: async (resumeId: string): Promise<Resume | null> => {
    try {
      const dbResume = await prisma.resume.findUnique({
        where: { id: resumeId },
      });

      if (!dbResume) {
        return null;
      }

      return {
        id: dbResume.id,
        userId: dbResume.userId,
        fileName: dbResume.fileName,
        rawText: dbResume.rawText,
        parsedSections: dbResume.parsedSections as Resume['parsedSections'],
        role: dbResume.role as Role,
        createdAt: dbResume.createdAt.toISOString(),
        updatedAt: dbResume.updatedAt.toISOString(),
        status: dbResume.status as Resume['status'],
      };
    } catch (error) {
      console.error('Error fetching resume by ID:', error);
      return null;
    }
  },

  getUserResumes: async (userId: string): Promise<Resume[]> => {
    try {
      const dbResumes = await prisma.resume.findMany({
        where: { userId },
        orderBy: { createdAt: 'desc' },
      });

      return dbResumes.map((dbResume) => ({
        id: dbResume.id,
        userId: dbResume.userId,
        fileName: dbResume.fileName,
        rawText: dbResume.rawText,
        parsedSections: dbResume.parsedSections as Resume['parsedSections'],
        role: dbResume.role as Role,
        createdAt: dbResume.createdAt.toISOString(),
        updatedAt: dbResume.updatedAt.toISOString(),
        status: dbResume.status as Resume['status'],
      }));
    } catch (error) {
      console.error('Error fetching user resumes:', error);
      return [];
    }
  },

  getResumeListItems: async (resumes: Resume[]): Promise<ResumeListItem[]> => {
    try {
      // Get all resume IDs
      const resumeIds = resumes.map((r) => r.id);

      // Fetch analyses and matches counts in parallel
      const [analysesCounts, matchesCounts] = await Promise.all([
        prisma.analyses.groupBy({
          by: ['resumeId'],
          where: { resumeId: { in: resumeIds } },
          _count: { id: true },
        }),
        prisma.matches.groupBy({
          by: ['resumeId'],
          where: { resumeId: { in: resumeIds } },
          _count: { id: true },
        }),
      ]);

      // Create lookup maps
      const analysesMap = new Map(
        analysesCounts.map((a) => [a.resumeId, a._count.id > 0])
      );
      const matchesMap = new Map(
        matchesCounts.map((m) => [m.resumeId, m._count.id > 0])
      );

      return resumes.map((resume) => ({
        id: resume.id,
        fileName: resume.fileName,
        role: resume.role,
        createdAt: resume.createdAt,
        updatedAt: resume.updatedAt,
        hasAnalysis: analysesMap.get(resume.id) || false,
        hasMatch: matchesMap.get(resume.id) || false,
      }));
    } catch (error) {
      console.error('Error getting resume list items:', error);
      // Fallback to basic list items without analysis/match info
      return resumes.map((resume) => ({
        id: resume.id,
        fileName: resume.fileName,
        role: resume.role,
        createdAt: resume.createdAt,
        updatedAt: resume.updatedAt,
        hasAnalysis: false,
        hasMatch: false,
      }));
    }
  },

  deleteResume: async (resumeId: string): Promise<boolean> => {
    try {
      await prisma.resume.delete({
        where: { id: resumeId },
      });
      return true;
    } catch (error) {
      console.error('Error deleting resume:', error);
      return false;
    }
  },

  userOwnsResume: async (userId: string, resumeId: string): Promise<boolean> => {
    try {
      const resume = await prisma.resume.findUnique({
        where: { id: resumeId },
        select: { userId: true },
      });
      return resume?.userId === userId;
    } catch (error) {
      console.error('Error checking resume ownership:', error);
      return false;
    }
  },
};
