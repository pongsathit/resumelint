# Resume Upload API - Testing Guide

## Quick Test Commands

### 1. Health Check
```bash
curl http://localhost:3000/health
```

Expected response:
```json
{
  "status": "healthy",
  "timestamp": "2026-01-09T12:48:19.427Z",
  "service": "resumelint-backend"
}
```

---

### 2. User Authentication

#### Login as Free User (John Doe)
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"provider": "email", "email": "john.doe@example.com", "password": "password123"}'
```

#### Login as Pro User (Jane Smith)
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"provider": "email", "email": "jane.smith@example.com", "password": "propassword456"}'
```

Expected response:
```json
{
  "user": {
    "id": "...",
    "email": "...",
    "name": "...",
    "subscriptionTier": "free" | "pro"
  },
  "tokens": {
    "accessToken": "access_...",
    "refreshToken": "refresh_..."
  }
}
```

---

### 3. Resume Upload - Text Paste (Authenticated)

```bash
# Replace TOKEN with your access token
TOKEN="access_your_token_here"

curl -X POST http://localhost:3000/api/resumes \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer ${TOKEN}" \
  -d '{
    "text": "John Doe\nSoftware Engineer\n\nSkills:\n- Node.js\n- TypeScript\n- PostgreSQL\n\nExperience:\n- 5 years backend development",
    "role": "Backend Engineer"
  }'
```

Expected response:
```json
{
  "id": "uuid",
  "userId": "user-uuid",
  "fileName": "pasted-text.txt",
  "rawText": "...",
  "parsedSections": {
    "contact": { "name": "John Doe" },
    "skills": ["Node.js", "TypeScript", "PostgreSQL"],
    "experience": [...],
    "education": [...],
    "projects": [...]
  },
  "role": "Backend Engineer",
  "status": "parsed",
  "createdAt": "2026-01-09T10:55:32.222Z",
  "updatedAt": "2026-01-09T10:55:32.222Z"
}
```

---

### 4. Resume Upload - Text Paste (Unauthenticated)

```bash
curl -X POST http://localhost:3000/api/resumes \
  -H "Content-Type: application/json" \
  -d '{
    "text": "Anonymous User Resume\nDeveloper\nSkills: JavaScript, Python",
    "role": "Fullstack Developer"
  }'
```

Expected: Same as above but `userId: "anonymous"`

---

### 5. Resume Upload - File Upload

#### Prepare test file
```bash
echo "John Doe
Software Engineer

Contact: john@example.com

Skills:
- Node.js, TypeScript
- PostgreSQL, MongoDB
- Docker, Kubernetes

Experience:
- Senior Backend Engineer at TechCorp (2020-Present)
- Backend Developer at StartupXYZ (2018-2020)" > test-resume.txt
```

#### Upload file (Authenticated)
```bash
TOKEN="access_your_token_here"

curl -X POST http://localhost:3000/api/resumes \
  -H "Authorization: Bearer ${TOKEN}" \
  -F "file=@test-resume.txt" \
  -F "role=Backend Engineer"
```

#### Upload file (Unauthenticated)
```bash
curl -X POST http://localhost:3000/api/resumes \
  -F "file=@test-resume.txt" \
  -F "role=Backend Engineer"
```

---

### 6. List User's Resumes

```bash
TOKEN="access_your_token_here"

curl -X GET http://localhost:3000/api/resumes \
  -H "Authorization: Bearer ${TOKEN}"
```

Expected response:
```json
{
  "resumes": [
    {
      "id": "uuid",
      "fileName": "test-resume.txt",
      "role": "Backend Engineer",
      "createdAt": "2026-01-09T11:04:15.201Z",
      "updatedAt": "2026-01-09T11:04:15.201Z",
      "hasAnalysis": false,
      "hasMatch": false
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 1,
    "totalPages": 1
  }
}
```

---

### 7. Get Specific Resume

```bash
TOKEN="access_your_token_here"
RESUME_ID="your-resume-uuid"

curl -X GET http://localhost:3000/api/resumes/${RESUME_ID} \
  -H "Authorization: Bearer ${TOKEN}"
```

---

### 8. Delete Resume

```bash
TOKEN="access_your_token_here"
RESUME_ID="your-resume-uuid"

curl -X DELETE http://localhost:3000/api/resumes/${RESUME_ID} \
  -H "Authorization: Bearer ${TOKEN}"
```

Expected response:
```json
{
  "success": true,
  "message": "Resume deleted successfully"
}
```

---

## Database Verification Commands

### Connect to database
```bash
docker-compose exec database psql -U resumelint_user -d resumelint
```

### Check all resumes
```sql
SELECT id, "userId", "fileName", role, status, "createdAt"
FROM resumes
ORDER BY "createdAt" DESC;
```

### Count resumes by user
```sql
SELECT "userId", COUNT(*) as resume_count
FROM resumes
GROUP BY "userId"
ORDER BY resume_count DESC;
```

### Check specific user's resumes
```sql
SELECT id, "fileName", role, "createdAt"
FROM resumes
WHERE "userId" = 'user-uuid-here'
ORDER BY "createdAt" DESC;
```

### View latest resume content
```sql
SELECT id, "fileName", LEFT("rawText", 100) as preview
FROM resumes
ORDER BY "createdAt" DESC
LIMIT 1;
```

---

## Supported File Types

| Format | Extension | MIME Type | Status |
|--------|-----------|-----------|--------|
| PDF | .pdf | application/pdf | ✓ Supported |
| DOCX | .docx | application/vnd.openxmlformats-officedocument.wordprocessingml.document | ✓ Supported |
| DOC | .doc | application/msword | ✓ Supported |
| TXT | .txt | text/plain | ✓ Supported |

---

## Supported Roles

- Backend Engineer
- Frontend Engineer
- Fullstack Developer
- Data Engineer
- DevOps Engineer
- Mobile Developer
- QA Engineer
- Product Manager
- UI/UX Designer
- Other

---

## Error Responses

### Invalid Role
```json
{
  "error": "validation_error",
  "message": "Invalid or missing role",
  "details": [
    {
      "field": "role",
      "message": "Role must be one of: Backend Engineer, Frontend Engineer, ..."
    }
  ]
}
```

### Missing File or Text
```json
{
  "error": "validation_error",
  "message": "Either file or text is required",
  "details": [
    {
      "field": "file/text",
      "message": "Either file or text must be provided"
    }
  ]
}
```

### Unsupported File Type
```json
{
  "error": "validation_error",
  "message": "Unsupported file type: exe. Please upload PDF, DOCX, DOC, or TXT files."
}
```

### Empty Resume
```json
{
  "error": "validation_error",
  "message": "Resume appears to be empty. Please provide a valid resume file or text."
}
```

### Authentication Required (for protected endpoints)
```json
{
  "error": "unauthorized",
  "message": "Authentication required"
}
```

### Invalid Token
```json
{
  "error": "unauthorized",
  "message": "Invalid or expired token"
}
```

---

## Common Issues & Solutions

### Issue: "Cannot find module 'pdf-parse'"
**Solution**: Install missing dependencies
```bash
docker-compose exec backend npm install pdf-parse mammoth
docker-compose restart backend
```

### Issue: "Foreign key constraint violated"
**Solution**: Create anonymous user
```bash
docker-compose exec database psql -U resumelint_user -d resumelint -c "
INSERT INTO users (id, email, name, avatar, subscriptionTier, createdAt, updatedAt)
VALUES ('anonymous', 'anonymous@resumelint.internal', 'Anonymous User',
        'https://api.dicebear.com/7.x/avataaars/svg?seed=anonymous', 'free', NOW(), NOW())
ON CONFLICT (id) DO NOTHING;
"
```

### Issue: Backend not starting
**Solution**: Check logs and restart
```bash
docker-compose logs backend --tail 50
docker-compose restart backend
```

### Issue: Database connection failed
**Solution**: Verify database is running
```bash
docker-compose ps database
docker-compose exec database pg_isready -U resumelint_user
```

---

## Test Data

### Test Users

| Name | Email | Password | Tier | Usage Limits |
|------|-------|----------|------|--------------|
| John Doe | john.doe@example.com | password123 | free | analyses: 1, matches: 0, rewrites: 0 |
| Jane Smith | jane.smith@example.com | propassword456 | pro | analyses: 999999, matches: 999999, rewrites: 999999 |

### Sample Resume Text
```
Jane Doe
Senior Backend Engineer

Contact Information:
Email: jane.doe@example.com
Phone: (555) 987-6543
LinkedIn: linkedin.com/in/janedoe
Location: New York, NY

Summary:
Experienced Backend Engineer with 7+ years of expertise in building scalable distributed systems, microservices architectures, and RESTful APIs. Strong background in Node.js, TypeScript, PostgreSQL, Redis, and AWS cloud services.

Technical Skills:
- Languages: TypeScript, JavaScript, Python, Go
- Backend: Node.js, Express, NestJS, GraphQL, gRPC
- Databases: PostgreSQL, MongoDB, Redis, DynamoDB
- Cloud: AWS (EC2, S3, Lambda, RDS, ElastiCache), Docker, Kubernetes
- Tools: Git, CI/CD, Jest, Prisma ORM, RabbitMQ

Professional Experience:

Senior Backend Engineer | TechCorp Inc. | 2021-Present
- Led development of microservices architecture serving 5M+ daily active users
- Designed and implemented RESTful and GraphQL APIs with 99.9% uptime
- Optimized database queries reducing response time by 60%
- Implemented JWT-based authentication and role-based authorization system
- Mentored team of 5 junior developers

Backend Engineer | StartupXYZ | 2018-2021
- Built scalable REST APIs using Node.js, Express, and PostgreSQL
- Implemented Redis caching layer improving performance by 40%
- Developed real-time features using WebSockets and Socket.io
- Integrated payment systems (Stripe, PayPal)
- Set up CI/CD pipelines using GitHub Actions

Junior Developer | DevShop | 2017-2018
- Developed backend services for e-commerce platform
- Wrote unit and integration tests achieving 85% code coverage
- Participated in code reviews and agile development process

Education:

Bachelor of Science in Computer Science
Massachusetts Institute of Technology | 2013-2017
GPA: 3.8/4.0

Certifications:
- AWS Certified Solutions Architect - Associate (2022)
- Certified Kubernetes Administrator (2021)

Notable Projects:
- API Gateway Service: Built a centralized API gateway handling 10K+ requests/second
- Real-time Analytics Platform: Developed streaming data pipeline using Node.js and Kafka
- Microservices Migration: Led migration from monolith to microservices architecture
```

---

## Performance Benchmarks

| Operation | Average Time | Notes |
|-----------|-------------|-------|
| Text upload | 50-100ms | JSON parsing + database insert |
| TXT file upload | 100-150ms | File read + parsing + insert |
| PDF file upload | 200-500ms | PDF parsing + text extraction + insert |
| DOCX file upload | 150-300ms | DOCX parsing + text extraction + insert |
| Resume retrieval | 20-50ms | Database query + JSON serialization |
| List resumes | 30-80ms | Multiple queries with pagination |

---

## Monitoring Commands

### Check container status
```bash
docker-compose ps
```

### View real-time logs
```bash
docker-compose logs -f backend
```

### Check database connections
```bash
docker-compose exec database psql -U resumelint_user -d resumelint \
  -c "SELECT count(*) FROM pg_stat_activity WHERE datname = 'resumelint';"
```

### Check disk usage
```bash
docker-compose exec database du -sh /var/lib/postgresql/data
```

---

Last updated: 2026-01-09
