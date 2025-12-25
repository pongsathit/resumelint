# ResumeLint Backend - Quick Start Guide

## Installation

```bash
cd backend
npm install
```

## Running the Server

```bash
# Development mode (with hot reload)
npm run dev

# Production build
npm run build
npm start
```

The server will start on `http://localhost:3000`

## Quick Test

### 1. Check Health
```bash
curl http://localhost:3000/health
```

### 2. Login
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "provider": "email",
    "email": "john.doe@example.com",
    "password": "anything"
  }'
```

Save the `accessToken` from the response.

### 3. Get User Profile
```bash
curl http://localhost:3000/api/users/me \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

### 4. Create Resume
```bash
curl -X POST http://localhost:3000/api/resumes \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "text": "John Doe\nSoftware Engineer\nExperience: Built microservices\nSkills: Node.js, TypeScript",
    "role": "Backend Engineer"
  }'
```

Save the `id` from the response.

### 5. Analyze Resume
```bash
curl -X POST http://localhost:3000/api/resumes/RESUME_ID/analyze \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -H "Content-Type: application/json"
```

## Using the Test Script

```bash
# Run automated tests (requires jq)
./test-api.sh
```

## Using API Collection

Import `api-collection.json` into:
- Postman
- Thunder Client (VS Code)
- Insomnia
- Any API client that supports Postman collections

## Mock Users

**Free Tier**:
- Email: `john.doe@example.com`
- Any password works

**Pro Tier**:
- Email: `jane.smith@example.com`
- Any password works

## Available Endpoints

See `IMPLEMENTATION_SUMMARY.md` for complete list of 30+ endpoints.

### Key Endpoints:
- `POST /api/auth/login` - Login
- `GET /api/users/me` - Get profile
- `POST /api/resumes` - Upload resume
- `POST /api/resumes/:id/analyze` - Analyze resume
- `POST /api/resumes/:id/match` - Match to job
- `POST /api/resumes/:id/rewrite` - Rewrite resume
- `GET /api/usage` - Check usage limits

## Project Structure

```
backend/
├── src/
│   ├── controllers/    # 9 controllers for all endpoints
│   ├── middleware/     # Authentication middleware
│   ├── models/         # Mock data store
│   ├── routes/         # Route definitions
│   ├── types/          # TypeScript types
│   └── server.ts       # Main server
├── package.json
├── tsconfig.json
└── README.md
```

## Documentation

- `README.md` - Full documentation
- `IMPLEMENTATION_SUMMARY.md` - Implementation details
- `API_DESIGN.md` - Original API specification (in project root)

## Notes

- All data is in-memory and resets on server restart
- Mock AI responses return realistic data
- Any password works for authentication
- Free tier limited to 1 analysis, Pro tier unlimited
