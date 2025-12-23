# Tech Stack Recommendation

## Frontend

- **Framework**: React 18+ with TypeScript
- **Styling**: Tailwind CSS
- **State Management**: React Query (TanStack Query) for server state + Zustand for client state (or React Context for MVP simplicity)
- **File Upload**: react-dropzone
- **Build Tool**: Vite
- **Routing**: React Router v6

## Backend

- **Language/Framework**: Node.js with Express (TypeScript)
  - _Alternative_: NestJS if prefer structured architecture from start
- **AI Integration**: OpenAI API (GPT-4 for analysis, text-embedding-ada-002 for embeddings)
- **PDF Parsing**: pdf-parse or pdfjs-dist
- **API Documentation**: OpenAPI/Swagger (optional but recommended)

## Database

- **Primary**: PostgreSQL (via Prisma ORM)
  - Simple relational model fits User, Resume, JobDescription, AnalysisResult
  - JSON columns for flexible fields (parsed_sections, ai_feedback, gaps, suggestions)
  - Scalable to millions of records
  - _Alternative for MVP_: SQLite with Prisma for rapid local development

## Auth

- **Solution**: NextAuth.js (Auth.js) or Clerk
  - Google OAuth
  - GitHub OAuth
  - Email/password optional
  - Simple session management

## Infrastructure / Deployment

- **Frontend**: Vercel or Netlify
- **Backend**: Railway, Render, or Fly.io
- **Database**: Supabase (PostgreSQL + auth), Neon, or Railway PostgreSQL
- **File Storage**: Cloudinary or AWS S3 (for resume PDFs if storing)
- **CDN**: Vercel/Netlify edge network (included)

## Optional Tools

- **Vector DB**: Pinecone or Weaviate (for JD similarity embeddings - V1 feature)
- **Testing**: Vitest (unit), Playwright (E2E)
- **CI/CD**: GitHub Actions
- **Monitoring**: Sentry (error tracking)
- **Analytics**: PostHog or Plausible
- **Email**: Resend or SendGrid (for notifications)

## Assumptions

- MVP starts without vector DB (use OpenAI embeddings API directly for similarity)
- Simple data model doesn't require complex caching initially (Redis optional later)
- PDF parsing can be done server-side (no need for client-side libs)
- File uploads can be processed in-memory or temporarily stored (no persistent file storage needed for MVP)
- Single region deployment sufficient initially (multi-region scaling later)
