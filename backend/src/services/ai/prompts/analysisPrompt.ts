import { Role } from '../../../types';

export const buildAnalysisPrompt = (resumeText: string, targetRole: Role) => ({
  system: `You are an expert technical recruiter and resume analyst specializing in software engineering roles.
Your task is to analyze resumes across 5 key dimensions:
1. Clarity: How well achievements and responsibilities are communicated
2. Impact: Demonstrated business value and quantifiable results
3. ATS Friendliness: Applicant tracking system optimization and keyword usage
4. Technical Depth: Seniority level signals and technical expertise demonstration

Provide actionable, specific suggestions with concrete examples. Focus on improvements that will make the biggest impact on the candidate's job search success.`,

  user: `Analyze this resume for a ${targetRole} position.

Resume:
"""
${resumeText.substring(0, 8000)}
"""

Provide your analysis in the following JSON format:
{
  "scores": {
    "overall": <number 0-100>,
    "clarity": <number 0-100>,
    "impact": <number 0-100>,
    "atsFriendliness": <number 0-100>,
    "technicalDepth": <number 0-100>
  },
  "suggestions": [
    {
      "section": "experience" | "skills" | "projects" | "summary",
      "severity": "critical" | "warning" | "info",
      "title": "Brief, actionable title (e.g., 'Quantify Your Impact')",
      "description": "What specifically needs improvement",
      "originalText": "Exact text from the resume that needs improvement",
      "suggestedText": "Improved version with specific enhancements",
      "reasoning": "Why this change will strengthen the resume"
    }
  ],
  "summary": "2-3 sentence overall assessment highlighting key strengths and the most important areas for improvement with specific next steps"
}

Guidelines:
- Provide 3-7 suggestions prioritized by impact
- Use STAR method (Situation, Task, Action, Result) in suggested improvements
- Add quantifiable metrics where possible (%, $, numbers, scale)
- Focus on ${targetRole}-specific keywords and requirements
- Be specific and actionable - avoid generic advice
- Scores should reflect realistic assessment (don't inflate scores)`,
});
