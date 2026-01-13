import { v4 as uuidv4 } from 'uuid';
import { Analysis, Suggestion } from '../../../types';

/**
 * Clamps a number between min and max values
 */
const clamp = (value: number, min: number, max: number): number => {
  return Math.min(Math.max(value, min), max);
};

/**
 * Validates that a value is one of the allowed options
 */
const validateEnum = <T>(value: any, allowedValues: T[], defaultValue: T): T => {
  return allowedValues.includes(value) ? value : defaultValue;
};

/**
 * Parses AI response JSON string into typed Analysis object
 * @param aiResponse JSON string from OpenAI
 * @param resumeId ID of the resume being analyzed
 * @returns Validated and typed Analysis object
 * @throws Error if parsing or validation fails
 */
export const parseAnalysisResponse = (aiResponse: string, resumeId: string): Analysis => {
  try {
    const parsed = JSON.parse(aiResponse);

    // Validate structure
    if (!parsed || typeof parsed !== 'object') {
      throw new Error('AI response is not a valid object');
    }

    if (!parsed.scores || !parsed.suggestions || !parsed.summary) {
      throw new Error('AI response is missing required fields (scores, suggestions, or summary)');
    }

    // Validate and transform scores
    const scores = {
      overall: clamp(parsed.scores.overall || 0, 0, 100),
      clarity: clamp(parsed.scores.clarity || 0, 0, 100),
      impact: clamp(parsed.scores.impact || 0, 0, 100),
      atsFriendliness: clamp(parsed.scores.atsFriendliness || 0, 0, 100),
      technicalDepth: clamp(parsed.scores.technicalDepth || 0, 0, 100),
    };

    // Validate and transform suggestions
    if (!Array.isArray(parsed.suggestions)) {
      throw new Error('Suggestions must be an array');
    }

    const suggestions: Suggestion[] = parsed.suggestions.map((s: any) => ({
      id: uuidv4(),
      section: validateEnum(s.section, ['experience', 'skills', 'projects', 'summary'], 'experience'),
      severity: validateEnum(s.severity, ['critical', 'warning', 'info'], 'info'),
      title: String(s.title || 'Improvement Suggestion'),
      description: String(s.description || ''),
      originalText: String(s.originalText || ''),
      suggestedText: String(s.suggestedText || ''),
      reasoning: String(s.reasoning || ''),
    }));

    // Validate summary
    const summary = String(parsed.summary || 'Analysis completed successfully.');

    // Construct final Analysis object
    const analysis: Analysis = {
      analysisId: uuidv4(),
      resumeId,
      scores,
      suggestions,
      summary,
      generatedAt: new Date().toISOString(),
    };

    return analysis;
  } catch (error: any) {
    // Provide detailed error message for debugging
    const errorMessage = error.message || 'Unknown parsing error';
    throw new Error(`Failed to parse AI response: ${errorMessage}`);
  }
};
