# UI Generation Prompt for resumelint

## App Overview

resumelint is a web application designed to help software engineers improve their resumes and career direction using AI. The platform provides resume feedback from an engineer's perspective, matches resumes to real job descriptions, and identifies skill gaps with actionable learning roadmaps.

## Target Users

- Software engineers seeking resume improvement
- Job-seeking engineers at various levels (junior to tech lead)
- Engineers targeting specific roles: Backend, Frontend, Mobile, Fullstack, or Tech Lead
- Engineers preparing for job applications who need ATS-optimized resumes

## Key Screens/Pages

### MVP Screens

1. **Landing/Home Page**

   - Hero section with value proposition
   - Feature highlights (Resume Analyzer, Job Description Matcher, Resume Rewrite)
   - Call-to-action buttons for primary flows
   - Optional: Free tier vs Paid tier comparison

2. **Resume Input Page**

   - File upload interface for PDF resume
   - Alternative: Text paste/input area
   - Role selection dropdown (Backend, Frontend, Mobile, Fullstack, Tech Lead)
   - Submit/analyze button

3. **Resume Analysis Results Page**

   - AI scoring dashboard with metrics:
     - Clarity score
     - Impact score
     - ATS friendliness score
     - Technical depth score
   - Actionable suggestions section (bullet-level feedback)
   - Expandable sections for detailed feedback
   - CTA buttons: "Match with Job Description", "Rewrite Resume", "Export Feedback"

4. **Job Description Input Page**

   - Text input/textarea for job description
   - Option to paste JD text
   - "Compare with Resume" button
   - Resume context indicator (which resume is being used)

5. **JD Matching Results Page**

   - Match percentage display (prominent)
   - Comparison breakdown:
     - Missing keywords/skills section
     - Strengths section
     - Match explanation (AI-generated insights)
   - Visual indicators for match quality
   - CTA: "Improve Resume" or "View Suggestions"

6. **Resume Rewrite Page**
   - Original resume text display
   - Editable sections with AI suggestions
   - STAR method guidance/tooltips
   - Quantification suggestions
   - Side-by-side or toggle view (original vs improved)
   - Save/export options

### V1 Additional Screens

7. **Career Gap Analysis Page**

   - Current skills display
   - Target role selector
   - Gap visualization:
     - Missing tech skills
     - Missing system design skills
     - Missing leadership skills
   - Visual comparison (current vs target)

8. **Learning Roadmap Page**

   - Timeline selector (30/60/90-day plans)
   - Structured learning plan display
   - Topic links (organized by category)
   - Progress tracking indicators
   - Export/share roadmap option

9. **Profile/Settings Page**
   - User account information
   - Role preference settings
   - Usage statistics (free tier limits)
   - Subscription/upgrade options (if monetized)

## UI Components Per Screen

### Landing Page

- Navigation bar (logo, nav links, auth buttons)
- Hero section with headline and CTA
- Feature cards grid (3 main features)
- Pricing tiers section (if applicable)
- Footer

### Resume Input Page

- File upload component (drag-and-drop)
- Text input fallback
- Role selector dropdown
- Loading state during upload/processing
- Error handling (invalid file, size limits)

### Resume Analysis Results Page

- Score cards/gauge components (4 metrics)
- Expandable feedback sections
- Bullet point list for suggestions
- Progress indicators for scores
- Action buttons (primary CTAs)
- Share/export controls

### Job Description Input Page

- Large textarea with character counter
- Paste helper button
- Resume selector/badge (showing active resume)
- Submit button with loading state

### JD Matching Results Page

- Large match percentage display (circular progress or large number)
- Two-column layout: Missing Skills vs Strengths
- Keyword/tag components (highlighted)
- Expandable AI explanation section
- Comparison visualizations (bars or charts)

### Resume Rewrite Page

- Split-pane or tabbed interface (original vs improved)
- Text editor component (rich text or markdown)
- Inline suggestion highlights
- STAR method helper/tooltip
- Save button with version history indicator

### Career Gap Analysis Page

- Skills matrix/grid visualization
- Role selector
- Gap indicators (visual badges or progress bars)
- Category tabs (Tech, System Design, Leadership)
- Comparison view

### Learning Roadmap Page

- Timeline selector (tabs: 30/60/90 days)
- Card-based learning modules
- Topic links (external links)
- Checkbox/progress indicators
- Calendar/timeline view option

## User Flows

### Primary Flow 1: Resume Analysis

1. User lands on homepage
2. Clicks "Analyze Resume" CTA
3. Uploads PDF or pastes resume text
4. Selects target role (optional)
5. Views analysis results with scores and feedback
6. Can proceed to "Match with JD" or "Rewrite Resume"

### Primary Flow 2: Job Description Matching

1. User has analyzed resume (from Flow 1) or starts fresh
2. Navigates to "Match with Job Description"
3. Pastes job description text
4. Views match percentage and detailed breakdown
5. Reviews missing skills and strengths
6. Takes action: "Improve Resume" or "Get Suggestions"

### Primary Flow 3: Resume Rewriting

1. User views analysis results or matching results
2. Clicks "Rewrite Resume" or "Improve Resume"
3. Views original resume with AI suggestions
4. Reviews STAR method improvements
5. Edits and accepts suggestions
6. Exports or saves improved resume

### Secondary Flow: Career Gap Analysis (V1)

1. User navigates to "Career Analysis"
2. Selects current role/level
3. Selects target role
4. Views skill gap analysis
5. Generates learning roadmap
6. Follows roadmap with progress tracking

### Secondary Flow: Learning Roadmap (V1)

1. From gap analysis or directly
2. Selects timeline (30/60/90 days)
3. Views structured learning plan
4. Clicks topic links for resources
5. Tracks progress through modules

## Design Style Suggestions

- **Modern and Professional**: Clean, tech-forward aesthetic suitable for software engineers
- **Color Scheme**:
  - Primary: Professional blue or tech-oriented color palette
  - Success/Positive: Green for high scores/good matches
  - Warning/Attention: Amber for medium scores
  - Error/Low: Red for low scores or gaps
  - Neutral: Gray scale for text and backgrounds
- **Typography**:
  - Clear, readable sans-serif fonts
  - Monospace for code snippets or technical terms
  - Clear hierarchy for scores vs descriptions
- **Visual Elements**:
  - Data visualization for scores (gauges, progress bars, circular progress)
  - Card-based layouts for feature sections
  - Minimalist design with focus on content
  - Icons for quick visual recognition (upload, analysis, match, etc.)

## Accessibility and Responsiveness Considerations

- **Responsive Design**:

  - Mobile-first approach
  - Tablet and desktop optimizations
  - Responsive grid layouts for score cards
  - Collapsible navigation for mobile

- **Accessibility**:

  - ARIA labels for interactive elements
  - Keyboard navigation support
  - Screen reader friendly (descriptive alt text for visualizations)
  - Sufficient color contrast for scores and text
  - Focus indicators for interactive elements
  - Text alternatives for visual data (score percentages as text)

- **File Upload**:

  - Clear file size limits displayed
  - File type validation with user feedback
  - Accessible file input with labels
  - Error messages for invalid uploads

- **Text Input**:
  - Clear labels and placeholders
  - Character counters where applicable
  - Validation feedback
  - Large clickable areas for buttons

## Assumptions

1. **Platform**: Web application (React + TypeScript + Tailwind CSS)
2. **Authentication**: Optional - free tier may work without auth, paid features require account (Google/GitHub OAuth suggested)
3. **Monetization**: Assumes free tier (1 resume analysis) and paid tier (unlimited features) - UI should accommodate subscription prompts
4. **Data Persistence**: Assumes users can save resumes and analysis results (requires user accounts for saved data)
5. **AI Processing**: Assumes asynchronous processing - UI should show loading states during AI analysis
6. **File Handling**: Supports PDF uploads with text extraction - fallback to text input required
7. **Browser Support**: Modern browsers with file upload and PDF parsing capabilities
8. **Role Selection**: Default role can be set in profile, but should be selectable per analysis
9. **Export Functionality**: Users may want to export analysis results, improved resumes, or learning roadmaps
10. **Progressive Disclosure**: MVP features should be primary, V1 features can be gated or shown as "Coming Soon" or premium features
