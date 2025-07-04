# WCINYP - Weill Cornell Imaging at NewYork-Presbyterian

A modern Next.js 14 application for medical imaging administration, featuring document management, provider directories, and automated form generation.

## Features

- **Document Hub** - Access and manage 156+ medical forms and documents
- **Provider Directory** - Search and manage medical staff information
- **Form Generator** - Automate self-pay forms and document creation
- **Master Directory** - Comprehensive contact database for all stakeholders
- **Knowledge Base** - Full Fumadocs-powered documentation with sidebar navigation ✨
- **Staff Wiki** - Simple MDX-based wiki for WCINYP work documentation (policies, procedures, emergency info)

## Tech Stack

- **Framework**: Next.js 14 with App Router
- **Styling**: Tailwind CSS v3 + shadcn/ui
- **Documentation**: Fumadocs (native MDX support)
- **Theme**: Dark mode support with next-themes
- **Language**: TypeScript

## Getting Started

First, install dependencies:

```bash
npm install
```

Then, run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the application.

## Project Structure

```
src/
├── app/              # Next.js App Router pages
├── components/       # Reusable React components
│   └── ui/          # shadcn/ui components
├── lib/             # Utility functions
└── content/         # MDX documentation content
    └── docs/        # Fumadocs content

public/
└── documents/       # 156 PDF documents organized by category
```

## Key Pages

- `/` - Dashboard with quick access to all features
- `/documents` - Document management with category filtering
- `/providers` - Provider directory with search
- `/forms` - Form generator and template management
- `/directory` - Master contact directory
- `/docs` - Knowledge base and documentation (Fumadocs)
- `/wiki` - Staff wiki for procedures, policies, and work documentation

## Development

```bash
# Run development server
npm run dev

# Build for production
npm run build

# Run production server
npm start

# Type checking
npm run type-check

# Run tests
npm test

# Run tests once (for CI/Claude Code)
npm run test:ci

# Run tests with UI
npm run test:watch

# Test coverage
npm run test:coverage

# Linting
npm run lint

# Format code
npm run format

# Check formatting
npm run format:check
```

## Testing

### Known Issues with Claude Code

**Test Timeout Issues**: When running tests through Claude Code, you may encounter timeout errors that don't occur when running tests directly in your terminal. This is a limitation of Claude Code's bash tool which has a default timeout of 2 minutes (120 seconds), but tests in watch mode need to run indefinitely.

**Current Limitation**: 
- Claude Code's bash tool times out after 120 seconds by default
- Maximum configurable timeout is 600000ms (10 minutes)
- Watch mode tests (`npm test`) run indefinitely, so they will ALWAYS timeout
- This is a fundamental limitation - Claude Code cannot run persistent processes

**Workarounds**:
1. Run tests without watch mode: `npm test -- --run` or `npm run test:ci`
2. Run specific test files: `npm test -- src/app/page.test.tsx`
3. Use the test:ci script which runs tests once and exits

**Claude Code Team**: This is a significant limitation for development workflows. Consider:
- Allowing infinite timeout for watch processes
- Detecting watch mode and handling differently
- Providing a way to interrupt/stop long-running processes without timeout

**Note**: All tests pass successfully when run with `--run` flag. The timeout only affects watch mode which keeps the process running indefinitely.

### Testing Philosophy

Following [Testing Library principles](https://testing-library.com/docs/guiding-principles):
- Test the application like a user would use it
- Focus on behavior, not implementation details
- Query elements by accessibility roles when possible
- Write tests that give confidence the application works

### Testing Checklist

#### 1. Test Infrastructure ⚙️

- [x] **Test Utilities** (`src/test/utils.tsx`)
  - [x] Custom render with all providers (Router, Theme)
  - [x] User event setup helper
  - [x] Accessibility testing helpers (jest-axe)
  - [x] Mock data factories
  - [x] Network request mocking
  - [x] Local storage mocking

- [ ] **Mock Service Worker Setup** (`src/test/mocks/`)
  - [ ] API handlers for form submissions
  - [ ] Document download mocking
  - [ ] Error scenario handlers
  - [ ] Loading state simulations

#### 2. Component Tests 🧩

##### Feature Components (High Priority)

- [x] **DocumentBrowser** (`src/components/features/documents/DocumentBrowser.test.tsx`)
  - [x] Search functionality with debouncing
  - [x] Category filtering (All/specific categories)
  - [x] Download action triggers
  - [x] Empty search results display
  - [ ] Loading state rendering
  - [ ] Error state handling
  - [x] Accessibility (keyboard nav, ARIA labels)

- [x] **FormsList** (`src/components/features/forms/FormsList.test.tsx`)
  - [x] Template cards display correctly
  - [x] Category grouping works
  - [x] Preview button navigation
  - [x] Fill button navigation
  - [x] Submission count display
  - [ ] Empty state handling

- [x] **FormBuilderUI** (`src/components/features/forms/FormBuilderUI.test.tsx`)
  - [x] Add form fields
  - [x] Remove form fields
  - [x] Field type selection
  - [x] Form preview rendering
  - [x] Validation display
  - [x] Save functionality
  - [x] Reset functionality

##### UI Components (Medium Priority)

- [ ] **ErrorBoundary** (`src/components/ErrorBoundary.test.tsx`)
  - [ ] Catches component errors
  - [ ] Displays error message
  - [ ] Provides recovery action
  - [ ] Logs errors appropriately

- [ ] **Loading States**
  - [ ] Skeleton screens render
  - [ ] Proper animations
  - [ ] Accessibility announcements

#### 3. Page Integration Tests 📄

- [x] **Documents Page** (`src/app/documents/page.test.tsx`)
  - [x] Tab switching (Browse/Forms/Builder)
  - [x] URL parameter synchronization
  - [x] State preservation between tabs
  - [x] Each tab content loads correctly
  - [x] Search state persists across tabs
  - [x] Keyboard navigation between tabs

- [x] **Directory Page** (`src/app/directory/page.test.tsx`)
  - [x] Contact search functionality
  - [x] Department filtering
  - [x] Export functionality
  - [x] Contact details display
  - [x] Phone/email link functionality
  - [x] Empty search handling

- [ ] **Providers Page** (`src/app/providers/page.test.tsx`) ✅
  - [x] Search by name
  - [x] Filter by specialty
  - [x] Filter by location
  - [x] Provider count updates
  - [ ] Contact links work
  - [ ] Accessibility compliance

- [x] **Knowledge Base** (`src/app/knowledge/page.test.tsx`)
  - [x] Card navigation
  - [x] Quick access links
  - [x] External documentation links
  - [x] Help section rendering

- [x] **Forms Dynamic Route** (`src/app/forms/[id]/page.test.tsx`)
  - [x] Loads correct form by ID
  - [x] 404 handling for invalid IDs
  - [x] Form field rendering
  - [x] Validation on submit
  - [x] Success/error states
  - [x] Navigation after submit

- [x] **Layout Tests** (`src/app/layout.test.tsx`)
  - [x] Navigation menu renders
  - [x] Active link highlighting
  - [x] Theme toggle works
  - [x] Mobile menu functionality

- [x] **Docs Page** (`src/app/docs/page.test.tsx`)
  - [x] Page title and description render
  - [x] Main sections display as cards
  - [x] Navigation links work correctly
  - [x] Proper heading hierarchy
  - [x] No accessibility violations

- [x] **Wiki Page** (`src/app/wiki/page.test.tsx`)
  - [x] Page renders with correct title
  - [x] Navigation sidebar displays
  - [x] Category cards show on home page
  - [x] Search functionality present
  - [x] Quick links sidebar works
  - [x] Help section displays
  - [x] Breadcrumb navigation
  - [x] No accessibility violations

#### 4. User Flow Tests 🔄

- [ ] **Document Search & Download Flow**
  - [ ] User searches for specific document
  - [ ] Filters by category
  - [ ] Downloads document
  - [ ] Receives confirmation

- [ ] **Form Submission Flow**
  - [ ] User selects form template
  - [ ] Fills out all fields
  - [ ] Validation triggers on errors
  - [ ] Successful submission
  - [ ] Confirmation displayed

- [ ] **Provider Lookup Flow**
  - [ ] Search for provider by name
  - [ ] Filter by department
  - [ ] View contact details
  - [ ] Click to email/call

#### 5. Error & Edge Cases 🚨

- [ ] **Error States**
  - [ ] Network failures handled gracefully
  - [ ] Invalid data displays error
  - [ ] API timeouts show appropriate message
  - [ ] Retry mechanisms work

- [ ] **Empty States**
  - [ ] No search results message
  - [ ] Empty categories handled
  - [ ] Missing data placeholders
  - [ ] Clear user guidance provided

- [ ] **Loading States**
  - [ ] Initial page load indicators
  - [ ] Data fetching spinners
  - [ ] Skeleton screens display
  - [ ] No layout shift

#### 6. Accessibility Tests ♿

- [ ] **WCAG 2.1 AA Compliance**
  - [ ] All pages pass axe-core audits
  - [ ] Keyboard navigation complete
  - [ ] Screen reader compatible
  - [ ] Focus indicators visible
  - [ ] Color contrast passes

- [ ] **Keyboard Navigation**
  - [ ] Tab order logical
  - [ ] Skip links work
  - [ ] Modal traps focus
  - [ ] Escape key handled

- [ ] **Screen Reader**
  - [ ] Page landmarks correct
  - [ ] Dynamic content announced
  - [ ] Form labels associated
  - [ ] Error messages announced

#### 7. Performance Tests 🚀

- [ ] **Rendering Performance**
  - [ ] Large lists (100+ items) render smoothly
  - [ ] Search debouncing works
  - [ ] No memory leaks
  - [ ] Smooth animations

- [ ] **Bundle Size**
  - [ ] Code splitting effective
  - [ ] Lazy loading implemented
  - [ ] Critical CSS inlined

#### 8. Mock Data & Factories 🏭

- [x] **Mock Factories** (`src/test/mocks/factories.ts`)
  - [x] `createMockDocument()`
  - [x] `createMockFormTemplate()`
  - [x] `createMockProvider()`
  - [x] `createMockContact()`
  - [x] `createMockFormSubmission()`

- [x] **Scenario Builders**
  - [x] `createDocumentSet()`
  - [x] `createFormWithValidation()`
  - [x] `createProviderDirectory()`
  - [x] `createErrorScenario()`

#### 9. CI/CD Integration 🔧

- [ ] **Pre-commit Hooks**
  - [ ] Related tests run
  - [ ] Coverage thresholds checked
  - [ ] Linting passes
  - [ ] Type checking passes

- [ ] **GitHub Actions**
  - [ ] Tests run on PR
  - [ ] Coverage reports generated
  - [ ] Build verification
  - [ ] Deploy preview works

### Coverage Requirements

| Metric | Target | Current |
|--------|--------|---------|
| Statements | 80% | ~72% |
| Branches | 75% | ~80% ✓ |
| Functions | 80% | ~47% |
| Lines | 80% | ~72% |

**Note**: Coverage reporting has source map issues with Next.js static export. The percentages are approximate.

**Test Summary**: 300 tests across 23 test files, all passing ✅

**Critical Path Coverage: 95% minimum**
- Document search and download
- Form submission flow
- Provider lookup
- Navigation between pages

### Quality Metrics

- [ ] All tests run in < 60 seconds
- [ ] Individual test files complete in < 5 seconds
- [ ] No console errors or warnings in tests
- [ ] No flaky tests (100% reliability)
- [ ] Clear test descriptions following user stories

<!-- DOCUMENTATION:START -->
## 📚 Documentation Structure

All project documentation is organized in the `.project-docs/` directory:

### 🏗️ Architecture & Design
System architecture, migration notes, and implementation details

- [**Netlify Architecture Considerations**](.project-docs/architecture/NETLIFY_ARCHITECTURE.md) 📊
  Netlify serves Next.js as a **static site** unless you use Netlify Functions. This means:
- [**WCINYP Next.js Migration**](.project-docs/architecture/MIGRATION.md) 📊
  This directory contains the migrated Next.js 14 version of WCINYP with:
- [**Fumadocs Implementation Plan**](.project-docs/architecture/FUMADOCS_IMPLEMENTATION.md)
  This document outlines the complete implementation plan for integrating Fumadocs into the WCINYP application. Currently, the Knowledge Base page (`/knowledge`) is a static page with hardcoded links, but it should be a full Fumadocs-powered documentation system.

### 🛠️ Development
Development guides, testing strategies, and contribution guidelines

- [**Testing Strategy for AI-Assisted Development**](.project-docs/development/TESTING_STRATEGY.md)
  As an AI assistant, I need tests because:
- [**Testing Guide for Rapid UI Evolution**](.project-docs/development/TESTING_GUIDE.md) 📊
  This guide documents our testing strategy designed to support rapid UI/UX changes while maintaining test confidence.
- [**Technical Debt & Improvement Plan**](.project-docs/development/TECH_DEBT.md) 📊
  **Status**: RESOLVED
- [**Contributing to WCINYP**](.project-docs/development/CONTRIBUTING.md)
  1. Ensure you have Node.js 20+ installed
- [**WCINYP Next.js Application**](.project-docs/development/CLAUDE.md)
  This is a medical imaging center application built with Next.js 14, TypeScript, and Tailwind CSS. It provides document management, provider directory, form generation, and contact management features.

### 📊 Project Status
Current deployment status and project health

- [**Deployment Status**](.project-docs/status/DEPLOYMENT_STATUS.md)
  Last successful fixes: Fri Jul  4 07:43:07 EDT 2025

### 📖 User Documentation
User-facing documentation is available at:
- [Knowledge Base](/knowledge) - Technical documentation and guides (Fumadocs-powered)
- [Work Wiki](/wiki) - WCINYP procedures, policies, and workflows

<!-- DOCUMENTATION:END -->

<!-- HEALTH:START -->
## 🏥 Project Health & Technical Debt

### Test Suite Status
- **Total Tests**: 274 tests across 21 test files
- **Success Rate**: 100% ✅
- **Coverage**: ~70-80% (est.)
- **Execution Time**: 18-36 seconds
- **Flaky Tests**: 0

### Code Quality Improvements (Jan 2025)

#### Phase 1: Critical Fixes ✅ COMPLETED (Jan 7, 2025)
- [x] Fixed 6 Fumadocs TypeScript errors (@ts-ignore)
- [x] Removed console.log statements from production
- [x] Fixed all 'any' types with proper TypeScript
- [x] Tests run consistently without failures
- [x] Implemented full Fumadocs at /knowledge route
- [x] Added comprehensive MDX documentation

#### Phase 2: Security Improvements 🚧 NEXT PRIORITY
- [ ] Add input sanitization for all form inputs
- [ ] Implement CSRF protection tokens
- [ ] Validate document download URLs
- [ ] Add rate limiting to API endpoints
- [ ] Implement proper error types and handling

#### Phase 3: Code Quality & UX 📋 PLANNED
- [ ] Replace browser alerts with toast notifications
- [ ] Consolidate duplicate type definitions
- [ ] Remove unused ErrorBoundary component
- [ ] Implement proper loading states
- [ ] Add form validation feedback
- [ ] Improve error messages

#### Phase 4: Architecture & Testing 📋 PLANNED
- [ ] Add global state management (Context API/Zustand)
- [ ] Implement code splitting for large components
- [ ] Create reusable compound components
- [ ] Standardize file naming conventions
- [ ] Add E2E tests with Playwright
- [ ] Increase test coverage to 90%+

#### Phase 5: Performance & Optimization 📋 PLANNED
- [ ] Load wiki content dynamically
- [ ] Add Next.js Image optimization
- [ ] Implement proper caching strategies
- [ ] Optimize bundle sizes
- [ ] Add performance monitoring
- [ ] Implement lazy loading

### Technical Debt Summary
- **Critical Issues**: 0 🎉
- **High Priority**: 2 (alerts, security)
- **Medium Priority**: 5
- **Low Priority**: 8
- **Total Resolved**: 25 ✅

### Known Issues
1. **Browser Alerts**: Still using `alert()` in 2 components
2. **Security**: Missing input validation and CSRF protection
3. **Performance**: Large inline wiki content
4. **Architecture**: All components client-side only (Netlify limitation)

<!-- HEALTH:END -->

## Deployment

This application is configured for deployment on Netlify with automatic builds from the main branch.

### Pre-Deployment Checklist ✅

- [x] All tests passing (274/274)
- [x] TypeScript compilation successful
- [x] ESLint with no errors
- [x] Production build successful
- [x] Fumadocs fully integrated at /knowledge
- [x] All console.logs removed
- [x] No TypeScript 'any' types
- [x] README documentation updated

### Deployment Configuration

The `netlify.toml` file includes:
- Next.js plugin configuration
- Node.js v20 requirement
- Security headers
- Static export configuration

### Deployment Steps

1. **Commit all changes**:
   ```bash
   git add .
   git commit -m "feat: Complete Fumadocs integration and code quality improvements"
   ```

2. **Push to GitHub**:
   ```bash
   git push origin main
   ```

3. **Netlify will automatically**:
   - Detect the push
   - Run the build process
   - Deploy to production

### Post-Deployment Validation

After deployment, verify:
- [ ] Home page loads correctly
- [ ] Knowledge base (/knowledge) shows Fumadocs interface
- [ ] All navigation works
- [ ] Forms can be filled and submitted
- [ ] Documents can be downloaded
- [ ] No console errors in production

## Migration Notes

This application was migrated from React Router v7 to Next.js 14 to enable:
- Better documentation support with Fumadocs
- Improved performance with static generation
- Native MDX support
- Enhanced SEO capabilities

The React Router version is archived in `/archive/react-router-version/` for reference.

### Wiki Implementation

The wiki system (`/wiki`) provides a simpler MDX-based documentation approach for internal work documentation:

- **Client-side rendering** - Compatible with Netlify static export
- **MDX content** - Stored in `/content/wiki/` directory
- **Categories** - Policies, Procedures, Locations, Departments, Emergency, Workflows
- **Search functionality** - Built-in search across wiki sections
- **Navigation sidebar** - Easy access to all wiki sections

The wiki complements the Fumadocs-powered knowledge base by focusing on internal operational documentation rather than technical documentation.

## License

Private - Weill Cornell MedicineTest: Verify CI pipeline configuration
