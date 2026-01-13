export const AI_CONFIG = {
  apiKey: process.env.OPENAI_API_KEY || '',
  enabled: process.env.AI_ENABLED === 'true',
  model: process.env.AI_MODEL || 'gpt-3.5-turbo',
  temperature: parseFloat(process.env.AI_TEMPERATURE || '0.3'),
  maxTokens: parseInt(process.env.AI_MAX_TOKENS || '2000'),
  timeout: parseInt(process.env.AI_TIMEOUT_MS || '30000'),
};

// Validation
if (AI_CONFIG.enabled && !AI_CONFIG.apiKey) {
  console.warn('⚠️  AI is enabled but OPENAI_API_KEY is not set. AI features will fail.');
}
