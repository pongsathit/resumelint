# API Design Document

## Authentication

### POST /api/auth/login

**Purpose**: Authenticate user with OAuth provider or email/password

**Method**: POST

**Request Body**:

```json
{
  "provider": "google" | "github" | "email",
  "code": "string", // OAuth code for OAuth providers
  "email": "string", // For email auth
  "password": "string" // For email auth
}
```

**Response**:

```json
{
  "accessToken": "string",
  "refreshToken": "string",
  "user": {
    "id": "string",
    "email": "string",
    "name": "string",
    "avatar": "string"
  }
}
```

**Auth Required**: No

---

### POST /api/auth/refresh

**Purpose**: Refresh access token

**Method**: POST

**Request Body**:

```json
{
  "refreshToken": "string"
}
```

**Response**:

```json
{
  "accessToken": "string",
  "refreshToken": "string"
}
```

**Auth Required**: No (but requires valid refresh token)

---

### POST /api/auth/logout

**Purpose**: Logout user and invalidate tokens

**Method**: POST

**Request Body**: None

**Response**:

```json
{
  "success": true
}
```

**Auth Required**: Yes

---

## User Management

### GET /api/users/me

**Purpose**: Get current authenticated user profile

**Method**: GET

**Request Params**: None

**Response**:

```json
{
  "id": "string",
  "email": "string",
  "name": "string",
  "avatar": "string",
  "subscriptionTier": "free" | "pro",
  "usageCount": {
    "analyses": 0,
    "matches": 0,
    "rewrites": 0
  },
  "limits": {
    "maxAnalyses": 1,
    "maxMatches": 0,
    "maxRewrites": 0
  },
  "createdAt": "2024-01-01T00:00:00Z"
}
```

**Auth Required**: Yes

---

### PATCH /api/users/me

**Purpose**: Update user profile

**Method**: PATCH

**Request Body**:

```json
{
  "name": "string",
  "defaultRole": "Backend Engineer" | "Frontend Engineer" | "Fullstack Developer" | "Mobile Developer" | "Tech Lead"
}
```

**Response**:

```json
{
  "id": "string",
  "email": "string",
  "name": "string",
  "defaultRole": "string",
  "updatedAt": "2024-01-01T00:00:00Z"
}
```

**Auth Required**: Yes

---

## Resume Management

### POST /api/resumes

**Purpose**: Upload and parse resume (PDF or text)

**Method**: POST

**Request Body** (multipart/form-data):

```
file: File (PDF, max 5MB) OR
text: string (resume text content)
role: "Backend Engineer" | "Frontend Engineer" | "Fullstack Developer" | "Mobile Developer" | "Tech Lead"
```

**Response**:

```json
{
  "id": "string",
  "userId": "string",
  "fileName": "string",
  "rawText": "string",
  "parsedSections": {
    "contact": {},
    "experience": [],
    "education": [],
    "skills": [],
    "projects": []
  },
  "role": "string",
  "createdAt": "2024-01-01T00:00:00Z",
  "status": "parsed" | "processing" | "error"
}
```

**Auth Required**: Yes (optional for MVP, required for saving)

---

### GET /api/resumes

**Purpose**: Get all resumes for current user

**Method**: GET

**Request Params**:

- `page`: number (default: 1)
- `limit`: number (default: 20)

**Response**:

```json
{
  "resumes": [
    {
      "id": "string",
      "fileName": "string",
      "role": "string",
      "createdAt": "2024-01-01T00:00:00Z",
      "updatedAt": "2024-01-01T00:00:00Z",
      "hasAnalysis": true,
      "hasMatch": false
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 5,
    "totalPages": 1
  }
}
```

**Auth Required**: Yes

---

### GET /api/resumes/:id

**Purpose**: Get specific resume details

**Method**: GET

**Request Params**: None

**Response**:

```json
{
  "id": "string",
  "userId": "string",
  "fileName": "string",
  "rawText": "string",
  "parsedSections": {},
  "role": "string",
  "createdAt": "2024-01-01T00:00:00Z",
  "updatedAt": "2024-01-01T00:00:00Z"
}
```

**Auth Required**: Yes (must own the resume)

---

### DELETE /api/resumes/:id

**Purpose**: Delete a resume

**Method**: DELETE

**Request Params**: None

**Response**:

```json
{
  "success": true,
  "message": "Resume deleted successfully"
}
```

**Auth Required**: Yes (must own the resume)

---

## Resume Analysis

### POST /api/resumes/:id/analyze

**Purpose**: Analyze resume and generate AI feedback with scores

**Method**: POST

**Request Body**:

```json
{
  "role": "Backend Engineer" | "Frontend Engineer" | "Fullstack Developer" | "Mobile Developer" | "Tech Lead" // Optional, defaults to resume role
}
```

**Response**:

```json
{
  "analysisId": "string",
  "resumeId": "string",
  "scores": {
    "overall": 82,
    "clarity": 90,
    "impact": 65,
    "atsFriendliness": 88,
    "technicalDepth": 45
  },
  "suggestions": [
    {
      "id": "string",
      "section": "experience" | "skills" | "projects" | "summary",
      "severity": "critical" | "warning" | "info",
      "title": "string",
      "description": "string",
      "originalText": "string",
      "suggestedText": "string",
      "reasoning": "string"
    }
  ],
  "summary": "string",
  "generatedAt": "2024-01-01T00:00:00Z"
}
```

**Auth Required**: Yes (must own the resume)

---

### GET /api/resumes/:id/analysis

**Purpose**: Get latest analysis results for a resume

**Method**: GET

**Request Params**: None

**Response**: Same as POST /api/resumes/:id/analyze response

**Auth Required**: Yes (must own the resume)

---

### GET /api/analyses/:analysisId

**Purpose**: Get specific analysis by ID

**Method**: GET

**Request Params**: None

**Response**: Same as POST /api/resumes/:id/analyze response

**Auth Required**: Yes (must own the resume associated with analysis)

---

## Job Description Matching

### POST /api/job-descriptions

**Purpose**: Create a job description entry

**Method**: POST

**Request Body**:

```json
{
  "rawText": "string",
  "title": "string", // Optional
  "company": "string" // Optional
}
```

**Response**:

```json
{
  "id": "string",
  "rawText": "string",
  "title": "string",
  "company": "string",
  "createdAt": "2024-01-01T00:00:00Z"
}
```

**Auth Required**: Yes (optional for MVP)

---

### POST /api/resumes/:resumeId/match

**Purpose**: Match resume against a job description

**Method**: POST

**Request Body**:

```json
{
  "jobDescriptionId": "string", // Optional if jobDescriptionText provided
  "jobDescriptionText": "string" // Optional if jobDescriptionId provided
}
```

**Response**:

```json
{
  "matchId": "string",
  "resumeId": "string",
  "jobDescriptionId": "string",
  "matchScore": 75,
  "breakdown": {
    "keywords": 82,
    "experience": 65,
    "skills": 70,
    "education": 80
  },
  "missingKeywords": [
    {
      "keyword": "Docker",
      "importance": "high" | "medium" | "low",
      "frequency": 5
    }
  ],
  "strengths": [
    {
      "keyword": "React.js",
      "matchStrength": "high" | "medium" | "low",
      "context": "string"
    }
  ],
  "aiExplanation": {
    "summary": "string",
    "whyMismatch": "string",
    "priorityChanges": ["string"],
    "improvementTips": ["string"]
  },
  "generatedAt": "2024-01-01T00:00:00Z"
}
```

**Auth Required**: Yes (must own the resume)

---

### GET /api/resumes/:resumeId/matches

**Purpose**: Get all matches for a resume

**Method**: GET

**Request Params**:

- `page`: number (default: 1)
- `limit`: number (default: 20)

**Response**:

```json
{
  "matches": [
    {
      "matchId": "string",
      "jobDescriptionId": "string",
      "jobTitle": "string",
      "company": "string",
      "matchScore": 75,
      "createdAt": "2024-01-01T00:00:00Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 3,
    "totalPages": 1
  }
}
```

**Auth Required**: Yes (must own the resume)

---

### GET /api/matches/:matchId

**Purpose**: Get specific match details

**Method**: GET

**Request Params**: None

**Response**: Same as POST /api/resumes/:resumeId/match response

**Auth Required**: Yes (must own the resume associated with match)

---

## Resume Rewriting

### POST /api/resumes/:id/rewrite

**Purpose**: Generate AI-rewritten version of resume using STAR method

**Method**: POST

**Request Body**:

```json
{
  "sections": ["experience", "projects"], // Optional, defaults to all sections
  "focus": "impact" | "metrics" | "seniority" | "ats", // Optional
  "jobDescriptionId": "string" // Optional, for JD-specific rewrites
}
```

**Response**:

```json
{
  "rewriteId": "string",
  "resumeId": "string",
  "originalText": "string",
  "rewrittenText": "string",
  "changes": [
    {
      "section": "experience",
      "originalBullet": "string",
      "rewrittenBullet": "string",
      "improvements": ["quantified_impact", "star_method"],
      "explanation": "string"
    }
  ],
  "scoreImprovement": {
    "before": 65,
    "after": 85,
    "delta": 20
  },
  "generatedAt": "2024-01-01T00:00:00Z"
}
```

**Auth Required**: Yes (must own the resume, Pro tier for unlimited)

---

### POST /api/rewrites/:rewriteId/improve

**Purpose**: Further improve specific sections using AI

**Method**: POST

**Request Body**:

```json
{
  "prompt": "string", // User's instruction for AI
  "section": "experience",
  "bulletIndex": 0
}
```

**Response**:

```json
{
  "rewrittenBullet": "string",
  "explanation": "string",
  "improvements": ["string"]
}
```

**Auth Required**: Yes (must own the rewrite, Pro tier)

---

### PUT /api/rewrites/:rewriteId

**Purpose**: Save edited rewrite version

**Method**: PUT

**Request Body**:

```json
{
  "rewrittenText": "string",
  "changes": [] // Array of user edits
}
```

**Response**:

```json
{
  "rewriteId": "string",
  "savedAt": "2024-01-01T00:00:00Z",
  "version": 2
}
```

**Auth Required**: Yes (must own the rewrite)

---

### GET /api/resumes/:id/rewrites

**Purpose**: Get all rewrite versions for a resume

**Method**: GET

**Request Params**: None

**Response**:

```json
{
  "rewrites": [
    {
      "rewriteId": "string",
      "version": 1,
      "scoreImprovement": 20,
      "createdAt": "2024-01-01T00:00:00Z",
      "updatedAt": "2024-01-01T00:00:00Z"
    }
  ]
}
```

**Auth Required**: Yes (must own the resume)

---

### GET /api/rewrites/:rewriteId

**Purpose**: Get specific rewrite details

**Method**: GET

**Request Params**: None

**Response**: Same as POST /api/resumes/:id/rewrite response

**Auth Required**: Yes (must own the rewrite)

---

## Career Gap Analysis (V1)

### POST /api/career-gap

**Purpose**: Analyze skill gaps between current role and target role

**Method**: POST

**Request Body**:

```json
{
  "resumeId": "string",
  "currentRole": "Backend Engineer",
  "targetRole": "Tech Lead",
  "targetLevel": "senior" | "staff" | "principal"
}
```

**Response**:

```json
{
  "gapAnalysisId": "string",
  "resumeId": "string",
  "currentRole": "string",
  "targetRole": "string",
  "gaps": {
    "technicalSkills": [
      {
        "skill": "System Design",
        "currentLevel": "intermediate",
        "requiredLevel": "expert",
        "gap": "large",
        "importance": "critical"
      }
    ],
    "systemDesign": [
      {
        "skill": "Distributed Systems",
        "gap": "missing",
        "recommendation": "string"
      }
    ],
    "leadership": [
      {
        "skill": "Team Leadership",
        "gap": "large",
        "recommendation": "string"
      }
    ]
  },
  "strengths": ["string"],
  "generatedAt": "2024-01-01T00:00:00Z"
}
```

**Auth Required**: Yes (Pro tier)

---

### GET /api/career-gap/:gapAnalysisId

**Purpose**: Get specific gap analysis

**Method**: GET

**Request Params**: None

**Response**: Same as POST /api/career-gap response

**Auth Required**: Yes (Pro tier)

---

## Learning Roadmap (V1)

### POST /api/learning-roadmap

**Purpose**: Generate personalized learning roadmap based on gap analysis

**Method**: POST

**Request Body**:

```json
{
  "gapAnalysisId": "string",
  "timeline": 30 | 60 | 90, // Days
  "focusAreas": ["technical", "systemDesign", "leadership"] // Optional
}
```

**Response**:

```json
{
  "roadmapId": "string",
  "gapAnalysisId": "string",
  "timeline": 30,
  "modules": [
    {
      "id": "string",
      "week": 1,
      "title": "string",
      "description": "string",
      "topics": [
        {
          "title": "string",
          "description": "string",
          "links": [
            {
              "title": "string",
              "url": "string",
              "type": "article" | "video" | "course" | "documentation"
            }
          ],
          "estimatedHours": 5,
          "completed": false
        }
      ],
      "completed": false
    }
  ],
  "estimatedTotalHours": 40,
  "generatedAt": "2024-01-01T00:00:00Z"
}
```

**Auth Required**: Yes (Pro tier)

---

### GET /api/learning-roadmap/:roadmapId

**Purpose**: Get specific learning roadmap

**Method**: GET

**Request Params**: None

**Response**: Same as POST /api/learning-roadmap response

**Auth Required**: Yes (Pro tier)

---

### PUT /api/learning-roadmap/:roadmapId/progress

**Purpose**: Update progress on roadmap items

**Method**: PUT

**Request Body**:

```json
{
  "moduleId": "string",
  "topicId": "string",
  "completed": true
}
```

**Response**:

```json
{
  "success": true,
  "progress": {
    "completedModules": 2,
    "totalModules": 4,
    "completedTopics": 8,
    "totalTopics": 20,
    "progressPercentage": 40
  }
}
```

**Auth Required**: Yes (Pro tier)

---

## Export

### POST /api/resumes/:id/export

**Purpose**: Export resume or analysis as PDF

**Method**: POST

**Request Body**:

```json
{
  "type": "resume" | "analysis" | "match" | "rewrite",
  "rewriteId": "string", // Required if type is "rewrite"
  "matchId": "string", // Required if type is "match"
  "format": "pdf"
}
```

**Response**: Binary PDF file (Content-Type: application/pdf)

**Auth Required**: Yes (must own the resource)

---

## Usage & Limits

### GET /api/usage

**Purpose**: Get current usage statistics and limits

**Method**: GET

**Request Params**: None

**Response**:

```json
{
  "tier": "free" | "pro",
  "usage": {
    "analyses": {
      "used": 1,
      "limit": 1,
      "resetAt": "2024-02-01T00:00:00Z"
    },
    "matches": {
      "used": 0,
      "limit": 0,
      "resetAt": "2024-02-01T00:00:00Z"
    },
    "rewrites": {
      "used": 0,
      "limit": 0,
      "resetAt": "2024-02-01T00:00:00Z"
    }
  },
  "canAnalyze": false,
  "canMatch": false,
  "canRewrite": false
}
```

**Auth Required**: Yes

---

## Error Responses

All endpoints may return the following error responses:

**400 Bad Request**:

```json
{
  "error": "validation_error",
  "message": "Invalid request body",
  "details": [
    {
      "field": "role",
      "message": "Invalid role value"
    }
  ]
}
```

**401 Unauthorized**:

```json
{
  "error": "unauthorized",
  "message": "Authentication required"
}
```

**403 Forbidden**:

```json
{
  "error": "forbidden",
  "message": "You do not have permission to access this resource"
}
```

**404 Not Found**:

```json
{
  "error": "not_found",
  "message": "Resource not found"
}
```

**429 Too Many Requests**:

```json
{
  "error": "rate_limit_exceeded",
  "message": "Usage limit reached. Please upgrade to Pro.",
  "retryAfter": 86400
}
```

**500 Internal Server Error**:

```json
{
  "error": "internal_error",
  "message": "An unexpected error occurred"
}
```

---

## Authentication

Most endpoints require authentication via Bearer token in the Authorization header:

```
Authorization: Bearer <access_token>
```

For MVP, authentication may be optional for analysis endpoints (with limitations). For V1, authentication is required for all user-specific operations.

---

## Rate Limiting

- Free tier: 1 resume analysis per month
- Pro tier: Unlimited analyses, matches, and rewrites
- Public endpoints: 10 requests per minute per IP

---

## Notes

- All timestamps are in ISO 8601 format (UTC)
- File uploads limited to 5MB for PDFs
- AI processing is asynchronous for analyses/matches/rewrites; use webhooks or polling for status updates
- Vector DB integration for JD similarity is V1 feature (can use OpenAI embeddings API directly for MVP)
