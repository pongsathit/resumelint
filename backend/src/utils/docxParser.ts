import mammoth from 'mammoth';

/**
 * Extract text from DOCX buffer
 *
 * @param buffer - DOCX file buffer
 * @returns Extracted text from the DOCX file
 * @throws Error if DOCX parsing fails
 */
export const extractTextFromDOCX = async (buffer: Buffer): Promise<string> => {
  try {
    const result = await mammoth.extractRawText({ buffer });

    // Check if text was extracted successfully
    if (!result.value || result.value.trim().length === 0) {
      throw new Error('DOCX appears to be empty or contains no extractable text.');
    }

    // Log any warnings from mammoth (e.g., unsupported features)
    if (result.messages && result.messages.length > 0) {
      console.warn('DOCX parsing warnings:', result.messages);
    }

    return result.value;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Failed to parse DOCX: ${error.message}`);
    }
    throw new Error('Failed to parse DOCX: Unknown error');
  }
};
