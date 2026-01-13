/**
 * Extract text from PDF buffer
 *
 * @param buffer - PDF file buffer
 * @returns Extracted text from the PDF
 * @throws Error if PDF parsing fails
 */
export const extractTextFromPDF = async (buffer: Buffer): Promise<string> => {
  try {
    // Use dynamic import for ES module compatibility (pdf-parse 2.4.5 is ES module)
    const { PDFParse } = await import('pdf-parse');
    
    // Create parser instance with buffer data
    const parser = new PDFParse({ data: buffer });
    
    // Extract text
    const result = await parser.getText();
    
    // Clean up parser resources
    await parser.destroy();

    // Check if text was extracted successfully
    if (!result.text || result.text.trim().length === 0) {
      throw new Error('PDF appears to be empty or contains no extractable text. It may be a scanned image.');
    }

    return result.text;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Failed to parse PDF: ${error.message}`);
    }
    throw new Error('Failed to parse PDF: Unknown error');
  }
};
