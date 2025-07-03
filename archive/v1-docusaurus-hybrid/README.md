# WCINYP Administrative Knowledge Base

[![Tests](https://img.shields.io/badge/tests-65%25%20coverage-brightgreen)](./coverage/lcov-report/index.html)
[![Coverage](https://img.shields.io/badge/coverage-65%25%20overall%20|%2096%25%20components-green)](./coverage/lcov-report/index.html)
[![TypeScript](https://img.shields.io/badge/TypeScript-enabled-007ACC?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-19-blue?logo=react&logoColor=white)](https://reactjs.org/)
[![Accessibility](https://img.shields.io/badge/WCAG-2.1%20AA-blue)](https://www.w3.org/WAI/WCAG21/quickref/)
[![Closed Source](https://img.shields.io/badge/license-proprietary-red)](https://wcinyp.netlify.app)

> **Weill Cornell Imaging at NewYork-Presbyterian**  
> Internal administrative knowledge base and workflow optimization tool. Contains NO patient PHI - strictly provider directories, procedural documentation, and administrative forms for staff efficiency.

## Overview

Internal administrative tool combining knowledge repository with workflow automation capabilities. Designed to enhance staff productivity through centralized access to provider directories, procedural documentation, and administrative form generation.

**Data Scope**: Provider contact information, imaging protocols, administrative forms, and procedural documentation. Contains no patient data or PHI.

> Development Context: See [AI_CODEV_GUIDE.md](./AI_CODEV_GUIDE.md) for comprehensive development guidance and architectural decisions.

**Core Functions**:
- Provider directory with advanced search and filtering
- Categorized document access and management
- Dynamic form generation with live preview
- Bulk document selection and print management
- Responsive design with WCAG 2.1 AA accessibility
- Modern component architecture using React 19 + TypeScript

## Project Structure

```
src-wcinyp/
├── .devcontainer/              # GitHub Codespaces configuration
│   └── devcontainer.json
├── .github/workflows/          # CI/CD and automation
│   └── codespaces.yml
├── docs/                       # Docusaurus documentation
├── src/
│   ├── components/             # React components
│   │   ├── ui/                 # shadcn/ui components
│   │   │   ├── button.tsx         # Accessible button component
│   │   │   ├── card.tsx           # Card container component
│   │   │   ├── checkbox.tsx       # Form checkbox component
│   │   │   ├── input.tsx          # Form input component
│   │   │   ├── select.tsx         # Select dropdown component
│   │   │   └── __tests__/      # Component test suites
│   │   ├── ModernDocumentSelector.tsx  # Main document hub interface
│   │   ├── ModernFormBuilder.tsx       # Dynamic form generator
│   │   └── __tests__/               # Integration tests
│   ├── lib/
│   │   └── utils.ts               # Utility functions (cn, etc.)
│   ├── pages/                  # Docusaurus pages
│   │   ├── document-hub.tsx       # Document management page
│   │   ├── form-generator.tsx     # Form builder page
│   │   └── index.tsx              # Landing page
│   ├── test-utils/             # Testing utilities
│   │   └── index.tsx              # Custom render functions
│   └── setupTests.ts              # Jest configuration
├── static/documents/           # PDF documents storage
├── jest.config.js                 # Jest testing configuration
├── tailwind.config.mjs            # TailwindCSS v4 configuration
├── package.json                   # Dependencies and scripts
└── TESTING_PROTOCOL.md           # Comprehensive testing standards
```

## Quick Start

### Prerequisites
- Node.js 18+
- npm or yarn

### Local Development

```bash
# Clone the repository
git clone https://github.com/rdrlabs/src-wcinyp.git
cd src-wcinyp

# Install dependencies
npm install

# Start development server
npm start

# Open browser to http://localhost:3000
```

### GitHub Codespaces (Mobile Safari + Claude Support)

This repository is fully configured for GitHub Codespaces with mobile development:

1. **Open in Codespaces**: Click "Code" → "Create codespace on main"
2. **Mobile Safari**: Access your codespace URL from Safari mobile
3. **Claude Integration**: Works seamlessly with Claude in the browser
4. **Auto-setup**: Dependencies install automatically via `.devcontainer/devcontainer.json`

## Testing & Quality Assurance

### Testing Philosophy
Tests validate real functionality and component behavior.

```bash
# Run all tests
npm test

# Run tests with coverage
npm run test:coverage

# Run tests in CI mode
npm run test:ci

# Type checking
npm run typecheck
```

### Testing Standards
- **Current Coverage**: 65% overall, 96% on shadcn/ui components
- **Target Coverage**: 90% overall, 95% on critical business logic
- **Testing Gaps Identified**: providers.tsx (0% coverage), integration tests missing
- **Accessibility**: WCAG 2.1 AA compliance testing integrated
- **Performance**: Component render optimization validation

See [TESTING_PROTOCOL.md](./TESTING_PROTOCOL.md) for complete testing standards.

## System Architecture

### Core Technologies
- **Frontend**: React 19 with TypeScript (strict mode pending - see [CLAUDE_OPUS_HANDOFF_REPORT.md](./CLAUDE_OPUS_HANDOFF_REPORT.md))
- **Styling**: TailwindCSS v4.1 with CSS layer separation + shadcn/ui component library
- **Documentation Platform**: Docusaurus v3.8 for knowledge base management
- **Testing**: Jest + React Testing Library (65% coverage, target 90%)
- **Build & Deployment**: Netlify with atomic deployments

### System Architecture
**Three-tier administrative platform**:

1. **Knowledge Repository**: Docusaurus-powered documentation hub for operational procedures, imaging protocols, and reference materials
2. **Provider Directory**: Real-time searchable database with filtering, contact management, and export capabilities
3. **Administrative Automation**: Form generation, document selection, and workflow optimization tools

### Data Architecture
- **Static Content**: Documentation and PDF forms in `/static/documents/`
- **Provider Database**: JSON-based with client-side filtering (no server dependencies)
- **Form State**: Component-level state management (centralized state management identified as improvement area)
- **No PHI Storage**: All patient data handling occurs outside this system

### Current Architecture Status
- **CSS Architecture**: A+ (Post-Gemini optimization, zero conflicts)
- **Component Design**: A- (shadcn/ui implementation excellent, legacy components need modernization)
- **Type Safety**: D+ (TypeScript present but strict mode disabled - critical gap)
- **Error Handling**: F (No error boundaries - immediate remediation needed)
- **Performance**: C+ (Fast builds, monitoring gaps, O(n) search algorithm)

### Component Architecture

#### UI Components (shadcn/ui)
```typescript
// Consistent, accessible components
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';

// Usage with variant support
<Button variant="primary" size="lg">
  Action Button
</Button>
```

#### Feature Components
```typescript
// ModernDocumentSelector - Document management hub
- Multi-category document organization
- Real-time search and filtering
- Bulk selection and print queue management
- Accessibility: Full keyboard navigation, ARIA labels

// ModernFormBuilder - Dynamic form creation
- Live form preview
- Progress tracking
- Field validation
- Print-ready output formatting
```

### Color System
```css
/* HSL-based design tokens */
:root {
  --primary: 222.2 84% 4.9%;
  --secondary: 210 40% 96%;
  --accent: 210 40% 96%;
  --destructive: 0 84.2% 60.2%;
  --border: 214.3 31.8% 91.4%;
  --ring: 222.2 84% 4.9%;
}
```

## Key Features

### Document Management Hub
- Categorized Forms: Medical forms organized by modality (MRI, CT, PET, US)
- Smart Search: Real-time filtering across all document types
- Bulk Operations: Select multiple documents with quantity control
- Print Queue: Visual queue showing selected documents and copy counts

### Form Builder
- Dynamic Fields: Patient name, DOB, service date, amount due
- Live Preview: Real-time form preview as you type
- Progress Tracking: Visual progress bar and completion percentage
- Validation: Field-level validation with visual feedback
- Print Ready: Professional formatting for medical use

### Accessibility Features
- Screen Reader Support: Complete ARIA labeling and semantic HTML
- Keyboard Navigation: Full keyboard accessibility throughout
- High Contrast: WCAG 2.1 AA color contrast compliance
- Focus Management: Clear focus indicators and logical tab order
- Error Handling: Descriptive error messages and fallback states

## Development Workflow

### Code Quality
```bash
# Linting and formatting
npm run lint
npm run format

# Type checking
npm run typecheck

# Build verification
npm run build
```

### Component Development
1. **Accessibility**: Components include ARIA labels and keyboard navigation
2. **Testing**: Components have comprehensive test coverage
3. **Performance**: Components use React optimization patterns
4. **Standards**: TypeScript strict mode and ESLint configuration

### Testing Workflow
```bash
# Watch mode during development
npm run test:watch

# Run specific test file
npm test -- ModernFormBuilder.test.tsx

# Debug failing tests
npm test -- --verbose
```

## Deployment

### Build Process
```bash
# Production build
npm run build

# Serve locally to test
npm run serve
```

### Netlify Deployment
1. Connect your repository to Netlify
2. Build command: `npm run build`
3. Publish directory: `build`
4. Add environment variables if needed
5. **Status Badge**: Update the Netlify badge URL with your actual site ID from Netlify dashboard

### GitHub Actions & Status Badges
Automatic testing and deployment via `.github/workflows/`:

- CI/CD Pipeline: Runs tests, type checking, and builds on every push
- Test Coverage Badge: Displays current test coverage percentage 
- Build Status: Shows if the latest deployment succeeded
- Security: Automated dependency vulnerability scanning
- Performance: Lighthouse scores for accessibility and performance

To set up badges for your repository:
1. Replace `username/src-wcinyp` with your actual GitHub repository
2. Update Netlify site ID in the status badge URL
3. Configure GitHub Actions for automated badge updates

## Potential Development Paths

### Immediate Considerations 🔍
**Technical Quality Opportunities**:
- TypeScript strict mode enablement (would improve type safety)
- Error boundary implementation (would prevent app crashes)  
- Security headers configuration (standard web security practice)
- Test coverage improvements (providers.tsx currently untested)

### Possible Architectural Enhancements 🛠️
**System Robustness Options**:
- Centralized state management (could improve data consistency)
- Search algorithm optimization (might be needed at scale)
- Performance monitoring capabilities (useful for production insight)
- Input validation patterns (defensive programming approach)

### Future Feature Possibilities 📋
**Administrative Tool Evolution**:
- Enhanced provider directory capabilities
- Form template and versioning systems
- Administrative change tracking
- Staff access control patterns

### Integration Exploration 🔗
**Hospital System Compatibility**:
- API architecture design patterns
- Real-time data synchronization approaches
- Workflow automation concepts
- Analytics and reporting frameworks

*Analysis and recommendations available in [CLAUDE_OPUS_HANDOFF_REPORT.md](./CLAUDE_OPUS_HANDOFF_REPORT.md) - no commitments implied*

## System Status & Readiness

### Current Capabilities
**Production Ready For**:
- ✅ Internal documentation access and management
- ✅ Provider directory search and contact management  
- ✅ Administrative form generation and printing
- ✅ Basic workflow automation for document selection

**Requires Development For**:
- ❌ Multi-department scaling (state management needed)
- ❌ Staff access controls (authentication system needed)
- ❌ Enterprise audit requirements (logging system needed)
- ❌ Hospital IT integration (API architecture needed)

### Technical Quality Assessment
**Strengths**:
- CSS architecture optimized with zero conflicts
- Modern component library (shadcn/ui) with 96% test coverage
- Responsive design with WCAG 2.1 AA accessibility
- Comprehensive documentation and development guides

**Critical Gaps**:
- TypeScript strict mode disabled (runtime error risk)
- No error boundaries (application crash propagation)
- Missing security headers (standard web vulnerabilities)
- Performance bottlenecks at scale (O(n) search complexity)

### Operational Impact
**Current Benefits**:
- Centralized access to provider information and procedural documentation
- Streamlined form generation reducing manual data entry
- Consistent formatting and organization of administrative materials
- Mobile-responsive access for staff working across locations

**Potential Evolution Paths**:
- Integration possibilities with hospital information systems
- Workflow automation concepts for form routing
- Administrative analytics exploration opportunities
- Access control pattern implementation options

*Detailed technical analysis available in [CLAUDE_OPUS_HANDOFF_REPORT.md](./CLAUDE_OPUS_HANDOFF_REPORT.md)*

## Contributing

### For Developers
1. Fork the repository
2. Create feature branch: `git checkout -b feature/feature-name`
3. Implement changes with tests
4. Ensure all tests pass: `npm run test:ci`
5. Create pull request with detailed description

### For Non-Technical Contributors
- Report bugs or suggest features via GitHub Issues
- Provide feedback on user experience
- Test accessibility with assistive technologies
- Help with documentation and user guides

## 📄 License

**Proprietary Software** - All rights reserved. This software is the exclusive property of the owner. Unauthorized use, distribution, or modification is strictly prohibited without explicit written permission.

## Support & Contact

- **GitHub Issues**: [Report bugs or request features](https://github.com/rdrlabs/src-wcinyp/issues)
- **Documentation**: [Full documentation site](https://wcinyp.netlify.app)
- **Testing Guide**: [TESTING_PROTOCOL.md](./TESTING_PROTOCOL.md)

---

Built with modern web technologies and accessibility-first design principles.