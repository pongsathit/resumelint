# ResumeLint Backend API

Backend implementation for ResumeLint with mock data (no database).

## Setup

1. Install dependencies:
```bash
cd backend
npm install
```

2. Create `.env` file (copy from `.env.example`):
```bash
cp .env.example .env
```

3. Start the development server:
```bash
npm run dev
```

The server will start on `http://localhost:3000`

## API Documentation

All APIs are implemented according to the `API_DESIGN.md` specification with mock data.

### Health Check

- **GET** `/health` - Check server status

### Authentication

- **POST** `/api/auth/login` - Login with OAuth or email/password
- **POST** `/api/auth/refresh` - Refresh access token
- **POST** `/api/auth/logout` - Logout and invalidate tokens

### User Management

- **GET** `/api/users/me` - Get current user profile
- **PATCH** `/api/users/me` - Update user profile

### Resume Management

- **POST** `/api/resumes` - Upload and parse resume (supports file upload or text)
- **GET** `/api/resumes` - List all resumes for current user (with pagination)
- **GET** `/api/resumes/:id` - Get specific resume details
- **DELETE** `/api/resumes/:id` - Delete a resume

### Resume Analysis

- **POST** `/api/resumes/:id/analyze` - Analyze resume and generate feedback
- **GET** `/api/resumes/:id/analysis` - Get latest analysis for a resume
- **GET** `/api/analyses/:analysisId` - Get specific analysis by ID

### Job Description & Matching

- **POST** `/api/job-descriptions` - Create a job description entry
- **POST** `/api/resumes/:resumeId/match` - Match resume against job description
- **GET** `/api/resumes/:resumeId/matches` - Get all matches for a resume
- **GET** `/api/matches/:matchId` - Get specific match details

### Resume Rewriting

- **POST** `/api/resumes/:id/rewrite` - Generate AI-rewritten version
- **POST** `/api/rewrites/:rewriteId/improve` - Further improve specific sections (Pro only)
- **PUT** `/api/rewrites/:rewriteId` - Save edited rewrite version
- **GET** `/api/resumes/:id/rewrites` - Get all rewrites for a resume
- **GET** `/api/rewrites/:rewriteId` - Get specific rewrite details

### Career Gap Analysis (Pro)

- **POST** `/api/career-gap` - Analyze skill gaps between current and target role
- **GET** `/api/career-gap/:gapAnalysisId` - Get specific gap analysis

### Learning Roadmap (Pro)

- **POST** `/api/learning-roadmap` - Generate personalized learning roadmap
- **GET** `/api/learning-roadmap/:roadmapId` - Get specific roadmap
- **PUT** `/api/learning-roadmap/:roadmapId/progress` - Update progress

### Export & Usage

- **POST** `/api/resumes/:id/export` - Export resume/analysis/match/rewrite as PDF
- **GET** `/api/usage` - Get current usage statistics and limits

## Mock Data

All data is stored in-memory in `/src/models/mockData.ts`. The mock data includes:

### Pre-configured Users

1. **Free Tier User**
   - Email: `john.doe@example.com`
   - ID: `user-1`
   - Subscription: Free
   - Limits: 1 analysis, 0 matches, 0 rewrites

2. **Pro Tier User**
   - Email: `jane.smith@example.com`
   - ID: `user-2`
   - Subscription: Pro
   - Limits: Unlimited

### Testing Authentication

Login with email (any password works in mock):
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "provider": "email",
    "email": "john.doe@example.com",
    "password": "any"
  }'
```

This will return an access token that you can use for authenticated requests:
```bash
curl -X GET http://localhost:3000/api/users/me \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

### Mock Data Storage

All mock data is stored in the following Map structures:

- `users` - User profiles
- `resumes` - Resume documents
- `analyses` - Resume analyses
- `jobDescriptions` - Job descriptions
- `matches` - Resume-JD matches
- `rewrites` - Resume rewrites
- `careerGapAnalyses` - Career gap analyses
- `learningRoadmaps` - Learning roadmaps
- `accessTokens` - Active access tokens
- `refreshTokens` - Active refresh tokens

**Location**: `/Users/pongsathitpoolsawat/resumelint/backend/src/models/mockData.ts`

## Project Structure

```
backend/
├── src/
│   ├── controllers/        # Request handlers
│   │   ├── authController.ts
│   │   ├── userController.ts
│   │   ├── resumeController.ts
│   │   ├── analysisController.ts
│   │   ├── matchController.ts
│   │   ├── rewriteController.ts
│   │   ├── careerController.ts
│   │   ├── exportController.ts
│   │   └── usageController.ts
│   ├── middleware/         # Express middleware
│   │   └── auth.ts
│   ├── models/             # Data models and mock data
│   │   └── mockData.ts
│   ├── routes/             # Route definitions
│   │   └── index.ts
│   ├── types/              # TypeScript types
│   │   └── index.ts
│   └── server.ts           # Main server file
├── package.json
├── tsconfig.json
└── README.md
```

## Features Implemented

- All endpoints from API_DESIGN.md specification
- Mock authentication with token management
- Mock resume parsing (returns dummy parsed data)
- Mock AI analysis with realistic suggestions
- Mock job matching with keyword analysis
- Mock resume rewriting with STAR method improvements
- Mock career gap analysis for Pro users
- Mock learning roadmap generation for Pro users
- Usage tracking and limits enforcement
- Error handling and validation
- Request/response schemas matching API design

## Notes

- No real database - all data is in-memory and will be lost on server restart
- No real AI integration - all analysis/matching/rewriting returns realistic mock data
- No real PDF parsing - file uploads return dummy parsed content
- No real PDF generation - exports return mock PDF content
- Authentication is simplified - any password works for mock users
- Pro features (career gap, learning roadmap) check subscription tier but don't require payment

## Development

- `npm run dev` - Start development server with auto-reload
- `npm run build` - Build TypeScript to JavaScript
- `npm start` - Run production build
- `npm run typecheck` - Type check without building
