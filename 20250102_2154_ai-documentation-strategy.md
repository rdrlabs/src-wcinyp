# AI Documentation Strategy for WCI Admin Tools

**Date:** 2025-01-02  
**Status:** Proposed Architecture

## Chosen Approach: CLAUDE.md + Component Hints

After analyzing the options, here's the recommended documentation architecture that maximizes AI comprehension while maintaining code quality:

### Directory Structure
```
/workspaces/src-wcinyp/
├── CLAUDE.md                    # Primary AI context (auto-loaded)
├── .ai/                         # AI-specific documentation
│   ├── ARCHITECTURE.md          # Core decisions & patterns
│   ├── CONVENTIONS.md           # Coding standards
│   ├── CURRENT_TASK.md          # Active work tracking
│   └── prompts/                 # Reusable prompt templates
├── docs/                        # Human documentation
│   ├── README.md                # Project overview
│   └── guides/                  # Setup, deployment, etc.
└── src/
    └── components/
        └── [Feature]/
            ├── [Feature].tsx
            ├── [Feature].test.tsx
            └── [Feature].ai.md  # Component-specific AI hints
```

### Implementation Steps

#### 1. Create CLAUDE.md (Primary Context)
```markdown
# WCI Administrative Tools

## Project Context
Medical administrative tools for Weill Cornell Imaging. No patient data (PHI).

## Quick Commands
\`\`\`bash
npm run dev          # Start development
npm test            # Run tests
npm run build       # Production build
npm run lint        # Lint + type-check
\`\`\`

## Architecture Decisions
- Framework: Next.js 14+ (App Router)
- UI: shadcn/ui + Tailwind CSS
- State: Zustand
- Testing: Vitest + Testing Library
- No Docusaurus (see /archive/POSTMORTEM_FRANKENSTEIN_ARCHITECTURE_2025-01-02.md)

## Key Patterns
- Error boundaries on all pages
- TypeScript strict mode enforced
- TDD approach required
- Accessibility WCAG 2.1 AA

## Current Implementation
- [ ] Base setup with Next.js
- [ ] shadcn/ui integration
- [ ] Document Hub feature
- [ ] Form Generator feature
- [ ] Provider Directory feature
```

#### 2. Architecture Documentation (.ai/ARCHITECTURE.md)
```markdown
# Architecture Decisions

## Core Principles
1. **Separation of Concerns**: Clear boundaries between features
2. **Type Safety**: TypeScript strict mode, no any
3. **Test First**: Write tests before implementation
4. **Performance**: Code splitting, lazy loading, virtualization

## Technology Stack
\`\`\`typescript
{
  "framework": "Next.js 14.x",
  "ui": "shadcn/ui",
  "styling": "Tailwind CSS 3.x", // NOT v4 alpha
  "state": "Zustand",
  "testing": "Vitest + @testing-library/react",
  "validation": "Zod",
  "icons": "Lucide React"
}
\`\`\`

## File Organization
\`\`\`
/app                    # Next.js app router
  /layout.tsx          # Root layout with providers
  /(features)          # Feature-based routing
    /documents/page.tsx
    /forms/page.tsx
    /providers/page.tsx
/components            
  /ui                  # shadcn/ui components
  /features           # Feature-specific components
/lib                  # Utilities and helpers
/hooks                # Custom React hooks
\`\`\`

## Data Flow
1. Server Components fetch data
2. Client Components handle interactivity
3. Zustand for client state
4. Server actions for mutations
```

#### 3. Component-Level AI Documentation
```markdown
<!-- src/components/features/DocumentHub/DocumentHub.ai.md -->
# DocumentHub Component AI Guide

## Purpose
Displays categorized PDF documents for medical staff to browse and print.

## Key Implementation Details
- Uses React.lazy() for PDF viewer
- Virtualized list for performance
- Categories from DOCUMENT_CATEGORIES constant
- Search uses Fuse.js for fuzzy matching

## Common Tasks
- Add document: Update /public/documents/ and DOCUMENTS constant
- Add category: Update DOCUMENT_CATEGORIES
- Modify search: Edit searchDocuments function

## Testing Approach
\`\`\`typescript
// Mock window.print
global.window.print = jest.fn()

// Mock PDF.js
jest.mock('react-pdf', () => ({
  Document: () => null,
  Page: () => null
}))
\`\`\`

## Performance Considerations
- Lazy load PDF viewer only when needed
- Virtualize document list > 50 items
- Debounce search input (300ms)
```

#### 4. Dynamic Context Tracking (.ai/CURRENT_TASK.md)
```markdown
# Current Development Task

**Last Updated:** 2025-01-02 22:00 UTC
**Active Feature:** Initial Setup

## Completed
- [x] Archive old Docusaurus implementation
- [x] Create fresh project structure
- [x] Document lessons learned

## In Progress
- [ ] Set up Next.js with TypeScript strict
- [ ] Configure Tailwind CSS (v3, not v4)
- [ ] Install and configure shadcn/ui

## Next Steps
1. Create base layout with error boundary
2. Implement Document Hub feature
3. Add comprehensive tests

## Known Issues
None yet in fresh codebase

## Important Context
- Coming from failed Docusaurus + shadcn integration
- Must maintain strict separation between app and docs
- Performance and type safety are critical
```

### AI Context Injection Patterns

#### Pattern 1: Prompt Templates
```markdown
<!-- .ai/prompts/add-component.md -->
When creating a new component:

1. Read the component's .ai.md file if it exists
2. Follow patterns in .ai/CONVENTIONS.md
3. Use shadcn/ui components from /components/ui/
4. Write tests first following examples in .test.tsx files
5. Update .ai/CURRENT_TASK.md with progress
```

#### Pattern 2: Auto-Context Scripts
```javascript
// .ai/scripts/pre-session.js
// Run this before AI sessions to update context

const fs = require('fs');
const glob = require('glob');

// Find all TODOs
const todos = glob.sync('src/**/*.{ts,tsx}')
  .map(file => /* extract TODOs */)
  .filter(Boolean);

// Update current task context
fs.writeFileSync('.ai/CURRENT_TASK.md', 
  generateTaskMarkdown(todos)
);
```

### Benefits of This Approach

1. **AI Comprehension**: Clear structure that AI can navigate
2. **Human Readable**: Developers can use the same docs
3. **Git Trackable**: All documentation in version control
4. **Scalable**: Component-level docs grow with codebase
5. **Context Preservation**: Decisions and patterns documented
6. **Avoids Past Mistakes**: Clear warnings about incompatible tech

### Migration Path

1. Create directory structure
2. Write CLAUDE.md with project basics
3. Add ARCHITECTURE.md with core decisions
4. Create component .ai.md files as you build
5. Update CURRENT_TASK.md each session
6. Review and refine based on usage

This approach ensures sustainable, maintainable documentation that serves both human developers and AI assistants effectively.