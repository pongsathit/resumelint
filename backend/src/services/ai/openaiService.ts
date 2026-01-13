import OpenAI from 'openai';
import { AI_CONFIG } from '../../config/ai';
import { Role } from '../../types';
import { buildAnalysisPrompt } from './prompts/analysisPrompt';

class OpenAIService {
  private client: OpenAI | null = null;

  private getClient(): OpenAI {
    if (!this.client) {
      if (!AI_CONFIG.apiKey) {
        throw new Error('OpenAI API key is not configured');
      }

      this.client = new OpenAI({
        apiKey: AI_CONFIG.apiKey,
        timeout: AI_CONFIG.timeout,
      });
    }

    return this.client;
  }

  /**
   * Analyze a resume using OpenAI GPT model
   * @param resumeText The raw text content of the resume
   * @param targetRole The role to analyze the resume for
   * @returns JSON string containing analysis results
   */
  async analyzeResume(resumeText: string, targetRole: Role): Promise<string> {
    try {
      const client = this.getClient();
      const prompt = buildAnalysisPrompt(resumeText, targetRole);

      const response = await client.chat.completions.create({
        model: AI_CONFIG.model,
        messages: [
          { role: 'system', content: prompt.system },
          { role: 'user', content: prompt.user },
        ],
        temperature: AI_CONFIG.temperature,
        max_tokens: AI_CONFIG.maxTokens,
        response_format: { type: 'json_object' }, // Force JSON output
      });

      const content = response.choices[0]?.message?.content;

      if (!content) {
        throw new Error('Empty response from OpenAI');
      }

      return content;
    } catch (error: any) {
      // Handle specific OpenAI errors
      if (error.status === 429) {
        throw new Error('OpenAI rate limit exceeded. Please try again later.');
      } else if (error.status === 401) {
        throw new Error('OpenAI authentication failed. Invalid API key.');
      } else if (error.status && error.status >= 500) {
        throw new Error('OpenAI service is temporarily unavailable. Please try again later.');
      } else if (error.code === 'ETIMEDOUT' || error.message?.includes('timeout')) {
        throw new Error('OpenAI request timed out. Please try again.');
      } else {
        throw new Error(`OpenAI request failed: ${error.message || 'Unknown error'}`);
      }
    }
  }
}

// Export a singleton instance
export const openaiService = new OpenAIService();
