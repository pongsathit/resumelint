# Backend Architecture

## Layered Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    HTTP Request                         │
└─────────────────────────────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────┐
│                   MIDDLEWARE LAYER                      │
├─────────────────────────────────────────────────────────┤
│  • Authentication (auth.ts)                             │
│  • Authorization (authorization.ts)                     │
│  • Request Validation                                   │
│  • Error Handling                                       │
└─────────────────────────────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────┐
│                  CONTROLLER LAYER                       │
├─────────────────────────────────────────────────────────┤
│  • Request/Response handling                            │
│  • Input validation (using utils/validators)            │
│  • Error formatting (using utils/errors)                │
│  • Route to appropriate service                         │
│                                                          │
│  Controllers:                                            │
│  ├── authController                                      │
│  ├── userController                                      │
│  ├── resumeController                                    │
│  ├── analysisController                                  │
│  ├── matchController                                     │
│  ├── rewriteController                                   │
│  ├── careerController                                    │
│  ├── exportController                                    │
│  └── usageController                                     │
└─────────────────────────────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────┐
│                   SERVICE LAYER                         │
├─────────────────────────────────────────────────────────┤
│  • Business logic implementation                        │
│  • Data transformation                                  │
│  • Mock data generation                                 │
│  • Cross-cutting concerns                               │
│                                                          │
│  Services:                                               │
│  ├── authService      (authentication & tokens)         │
│  ├── userService      (user management)                 │
│  ├── resumeService    (resume CRUD)                     │
│  ├── analysisService  (resume analysis)                 │
│  ├── matchService     (job matching)                    │
│  ├── rewriteService   (resume rewriting)                │
│  ├── careerService    (career development)              │
│  └── usageService     (usage tracking)                  │
└─────────────────────────────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────┐
│                    DATA LAYER                           │
├─────────────────────────────────────────────────────────┤
│  • In-memory data stores (mockData.ts)                  │
│  • Data access helpers                                  │
│  • Type definitions (types/index.ts)                    │
│                                                          │
│  Data Stores:                                            │
│  ├── users                                               │
│  ├── resumes                                             │
│  ├── analyses                                            │
│  ├── matches                                             │
│  ├── rewrites                                            │
│  ├── careerGapAnalyses                                   │
│  ├── learningRoadmaps                                    │
│  ├── jobDescriptions                                     │
│  ├── accessTokens                                        │
│  └── refreshTokens                                       │
└─────────────────────────────────────────────────────────┘
```

## Request Flow Example

### POST /api/resumes/:id/analyze

```
1. HTTP Request
   └─> Middleware Layer
       ├─> CORS
       ├─> Body Parser
       ├─> Request Logger
       └─> authMiddleware (validates token)

2. Controller Layer (analysisController.analyzeResume)
   ├─> Validate user authentication
   ├─> Extract and validate parameters
   ├─> Check resume ownership (via resumeService)
   └─> Check usage limits (via usageService)

3. Service Layer
   ├─> analysisService.createAnalysis()
   │   ├─> Generate mock suggestions
   │   ├─> Calculate scores
   │   └─> Store in data layer
   └─> usageService.incrementUsage()

4. Data Layer
   ├─> Store analysis in analyses Map
   └─> Update user usage count

5. Response
   └─> Return analysis JSON
```

## Cross-Cutting Concerns

### Error Handling
```
utils/errors.ts
├─> sendUnauthorized()
├─> sendForbidden()
├─> sendNotFound()
├─> sendValidationError()
└─> sendRateLimitError()

constants/errors.ts
├─> ERROR_CODES (error type constants)
└─> ERROR_MESSAGES (error message constants)
```

### Validation
```
utils/validators.ts
├─> validateRole()
├─> validateProvider()
├─> validateExportType()
└─> validateRequired()

constants/validation.ts
├─> VALID_ROLES
├─> VALID_PROVIDERS
├─> VALID_EXPORT_TYPES
└─> PAGINATION_DEFAULTS
```

### Authorization
```
middleware/authorization.ts
└─> requireProTier() (Pro subscription check)

resumeService
└─> userOwnsResume() (Resource ownership check)
```

## Data Flow Patterns

### Create Operations
```
Controller → Validate Input → Service.create() → Data Layer → Response
```

### Read Operations
```
Controller → Service.getById() → Data Layer → Response
```

### Update Operations
```
Controller → Validate Input → Check Ownership → Service.update() → Response
```

### Delete Operations
```
Controller → Check Ownership → Service.delete() → Response
```

### List Operations
```
Controller → Parse Pagination → Service.list() → Paginate → Response
```

## Service Dependencies

```
analysisController
├── resumeService (ownership check)
├── analysisService (business logic)
└── usageService (rate limiting)

matchController
├── resumeService (ownership check)
├── matchService (business logic)
└── usageService (rate limiting)

rewriteController
├── resumeService (ownership check)
├── rewriteService (business logic)
└── usageService (rate limiting)

careerController
├── resumeService (ownership check)
└── careerService (business logic)

All controllers
└── utils/errors (error handling)
```

## Benefits of This Architecture

### Maintainability
- Clear separation of concerns
- Each layer has distinct responsibility
- Easy to locate and fix bugs
- Changes isolated to specific layers

### Testability
- Services can be unit tested independently
- Controllers can be tested with mocked services
- Clear interfaces between layers

### Scalability
- Easy to add new features
- Services can be reused across controllers
- Can swap data layer without changing services
- Can add caching at service layer

### Readability
- Consistent patterns across all endpoints
- Self-documenting code structure
- Clear naming conventions
- Centralized constants and utilities
