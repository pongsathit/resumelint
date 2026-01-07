# AI Integration Documentation

## Overview

ResumeLint now integrates with OpenAI's GPT models to provide intelligent resume analysis with personalized scoring and actionable suggestions. This document explains how the AI integration works, how to configure it, and best practices for usage.

## Features

- **AI-Powered Resume Analysis**: Uses GPT-3.5 Turbo (upgradeable to GPT-4) to analyze resumes across 5 dimensions
- **Intelligent Caching**: In-memory cache reduces API costs by 50-70%
- **Graceful Degradation**: Falls back to mock data when AI is disabled
- **Cost Optimization**: ~$0.003 per analysis with GPT-3.5 Turbo

## Architecture

```
┌─────────────────┐
│   Controller    │  ← HTTP Request
└────────┬────────┘
         ↓
┌─────────────────┐
│     Service     │  ← Business Logic
└────────┬────────┘
         ↓
    ┌────┴────┐
    ↓         ↓
┌────────┐ ┌────────┐
│ Cache  │ │   AI   │  ← OpenAI API
└────────┘ └────┬───┘
             ↓
         ┌────────┐
         │ Parser │  ← JSON Validation
         └────────┘
```

### File Structure

```
backend/
├── src/
│   ├── config/
│   │   └── ai.ts                      # AI configuration
│   ├── services/
│   │   ├── ai/
│   │   │   ├── openaiService.ts       # OpenAI API wrapper
│   │   │   ├── prompts/
│   │   │   │   └── analysisPrompt.ts  # Prompt templates
│   │   │   ├── parsers/
│   │   │   │   └── analysisParser.ts  # Response parsing
│   │   │   └── cache/
│   │   │       └── cacheService.ts    # In-memory caching
│   │   └── analysisService.ts         # Main analysis logic
│   └── controllers/
│       └── analysisController.ts      # HTTP handlers
└── AI_INTEGRATION.md                  # This file
```

## Configuration

### Environment Variables

Add these variables to your `.env` file:

```bash
# OpenAI Configuration
OPENAI_API_KEY=sk-proj-xxxxx          # Your OpenAI API key (required)
AI_ENABLED=true                         # Enable/disable AI features
AI_MODEL=gpt-3.5-turbo                 # Model to use (gpt-3.5-turbo or gpt-4-turbo-preview)
AI_TEMPERATURE=0.3                     # Creativity (0-1, lower = more deterministic)
AI_MAX_TOKENS=2000                     # Max response length
AI_TIMEOUT_MS=30000                    # Request timeout (30 seconds)
```

### Getting an OpenAI API Key

1. Visit [https://platform.openai.com/api-keys](https://platform.openai.com/api-keys)
2. Sign up or log in to your OpenAI account
3. Click "Create new secret key"
4. Copy the key and add it to your `.env` file as `OPENAI_API_KEY`
5. Set `AI_ENABLED=true` to activate AI features

### Disabling AI

To use mock data instead of AI (useful for development/testing):

```bash
AI_ENABLED=false
```

The system will automatically fall back to mock analysis responses.

## Usage

### API Endpoint

**POST** `/api/resumes/:id/analyze`

**Request Body**:
```json
{
  "role": "Backend Engineer"  // Optional, defaults to resume's role
}
```

**Response** (AI-generated):
```json
{
  "analysisId": "uuid",
  "resumeId": "uuid",
  "scores": {
    "overall": 85,
    "clarity": 88,
    "impact": 78,
    "atsFriendliness": 92,
    "technicalDepth": 84
  },
  "suggestions": [
    {
      "id": "uuid",
      "section": "experience",
      "severity": "critical",
      "title": "Quantify Your Impact",
      "description": "Add specific metrics to demonstrate scale",
      "originalText": "Built microservices",
      "suggestedText": "Built microservices handling 10M+ requests/day with 99.9% uptime",
      "reasoning": "Quantifiable metrics demonstrate concrete impact and scale"
    }
  ],
  "summary": "Your resume shows strong technical depth...",
  "generatedAt": "2024-01-07T12:00:00.000Z"
}
```

### Code Example

```typescript
// Create a resume analysis
const response = await fetch('http://localhost:3000/api/resumes/resume-123/analyze', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer <access-token>',
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    role: 'Backend Engineer'
  })
});

const analysis = await response.json();
console.log('Overall Score:', analysis.scores.overall);
console.log('Suggestions:', analysis.suggestions.length);
```

## Caching

### How It Works

- **Cache Key**: SHA256 hash of `resumeText + targetRole`
- **Storage**: In-memory Map (100 most recent analyses)
- **TTL**: 24 hours
- **Eviction**: LRU (Least Recently Used)

### Cache Hit Example

```
1st Request: Resume A + Backend Engineer → OpenAI API call → Cache MISS
2nd Request: Resume A + Backend Engineer → Cache → Cache HIT (instant response)
```

### Cache Statistics

```typescript
import { aiCache } from './services/ai/cache/cacheService';

const stats = aiCache.getStats();
console.log(stats);
// { size: 42, maxSize: 100, ttlHours: 24 }
```

## Cost Estimation

### GPT-3.5 Turbo Pricing (January 2024)

- **Input**: $0.0005 per 1K tokens
- **Output**: $0.0015 per 1K tokens

### Typical Analysis

- **Input**: ~1500 tokens (resume + prompt)
- **Output**: ~500 tokens (analysis JSON)
- **Cost per analysis**: ~$0.003

### Monthly Estimates

| Users | Analyses/User | API Calls | Cache Hit Rate | Total Cost |
|-------|---------------|-----------|----------------|------------|
| 100   | 5             | 500       | 0%             | $1.50      |
| 100   | 5             | 200       | 60%            | $0.60      |
| 1000  | 5             | 5000      | 0%             | $15.00     |
| 1000  | 5             | 2000      | 60%            | $6.00      |

### Cost Optimization Tips

1. **Enable caching** (default: enabled)
2. **Use GPT-3.5 Turbo** instead of GPT-4 (~20x cheaper)
3. **Optimize prompts** to reduce token usage
4. **Implement usage limits** for free tier users

## Upgrading to GPT-4

For higher quality analysis, upgrade to GPT-4 Turbo:

```bash
AI_MODEL=gpt-4-turbo-preview
```

**Cost Impact**:
- GPT-4: ~$0.08 per analysis (~27x more expensive)
- Better reasoning and more nuanced feedback
- Recommended for Pro tier users only

## Error Handling

### Error Types

| Error | Status | Cause | Solution |
|-------|--------|-------|----------|
| `ai_service_unavailable` | 503 | OpenAI API down or timeout | Retry request |
| `ai_rate_limit` | 429 | OpenAI rate limit exceeded | Wait and retry |
| `ai_auth_error` | 500 | Invalid API key | Check OPENAI_API_KEY |
| `ai_parse_error` | 500 | Invalid AI response | Check prompt format |

### Error Response Example

```json
{
  "error": "ai_service_unavailable",
  "message": "AI analysis is temporarily unavailable. Please try again later.",
  "details": "OpenAI request timed out"
}
```

### Graceful Degradation

When AI fails:
1. Error is logged to console
2. 503 error returned to user
3. User can retry the request
4. System continues working with other features

**Note**: Unlike fallback to mock data, errors are returned to users per your configuration preference.

## Testing

### Development Testing

```bash
# 1. Set AI_ENABLED=false for mock data
echo "AI_ENABLED=false" >> .env

# 2. Test with mock data
npm run dev
curl -X POST http://localhost:3000/api/resumes/resume-123/analyze \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json"
```

### Production Testing

```bash
# 1. Add OpenAI API key
echo "OPENAI_API_KEY=sk-proj-xxxxx" >> .env
echo "AI_ENABLED=true" >> .env

# 2. Restart server
npm run dev

# 3. Test AI analysis
curl -X POST http://localhost:3000/api/resumes/resume-123/analyze \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{"role":"Backend Engineer"}'
```

### Check Cache

```bash
# First request (cache miss)
time curl -X POST http://localhost:3000/api/resumes/resume-123/analyze ...
# Response time: ~3-5 seconds

# Second request (cache hit)
time curl -X POST http://localhost:3000/api/resumes/resume-123/analyze ...
# Response time: ~50-100ms
```

## Monitoring

### Logs

The system logs AI operations:

```
→ Calling OpenAI API for analysis: resume-123
✓ AI analysis completed: analysis-456
✓ Cache hit for analysis: resume-123
```

### Key Metrics to Track

1. **AI API Latency**: p50, p95, p99 response times
2. **Cache Hit Rate**: % of requests served from cache
3. **Error Rate**: % of failed AI requests
4. **Cost**: Daily/monthly OpenAI spend
5. **Token Usage**: Average tokens per request

## Security

### API Key Protection

- ✅ Never commit `.env` to version control
- ✅ Use different API keys for dev/staging/production
- ✅ Rotate keys quarterly
- ✅ Monitor usage on OpenAI dashboard

### Data Privacy

- Resume text is sent to OpenAI API
- OpenAI's data usage policy: https://openai.com/policies/api-data-usage-policies
- OpenAI does NOT use API data for training by default
- Consider adding data processing agreements for enterprise customers

## Troubleshooting

### AI Features Not Working

**Issue**: Getting mock data instead of AI responses

**Solutions**:
1. Check `AI_ENABLED=true` in `.env`
2. Verify `OPENAI_API_KEY` is set correctly
3. Check API key is valid on OpenAI dashboard
4. Review server logs for errors

### High Costs

**Issue**: OpenAI bill is higher than expected

**Solutions**:
1. Check cache hit rate (should be >50%)
2. Verify no infinite retry loops
3. Implement usage limits per user
4. Consider switching to GPT-3.5 from GPT-4

### Slow Responses

**Issue**: Analysis takes >10 seconds

**Solutions**:
1. Check network latency to OpenAI
2. Reduce `AI_MAX_TOKENS` to 1500
3. Optimize prompt to be more concise
4. Increase `AI_TIMEOUT_MS` if needed

## Future Enhancements

Potential improvements (not currently implemented):

- [ ] Retry logic for transient failures
- [ ] Redis caching for multi-instance deployments
- [ ] Job matching AI integration
- [ ] Resume rewriting AI integration
- [ ] Cost analytics dashboard
- [ ] A/B testing framework (GPT-3.5 vs GPT-4)
- [ ] Streaming responses for real-time feedback

## Support

For issues or questions:
- Check logs: `docker-compose logs backend`
- Review OpenAI status: https://status.openai.com/
- OpenAI documentation: https://platform.openai.com/docs

---

**Last Updated**: January 2024
**AI Integration Version**: 1.0.0
**Supported Models**: GPT-3.5 Turbo, GPT-4 Turbo
