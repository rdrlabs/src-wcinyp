# WCINYP Medical Document Management System

[![Tests](https://img.shields.io/badge/tests-66%20passing-brightgreen)](./coverage/lcov-report/index.html)
[![Coverage](https://img.shields.io/badge/coverage-37%25%20overall%20|%2086%25%20critical-yellow)](./coverage/lcov-report/index.html)
[![TypeScript](https://img.shields.io/badge/TypeScript-strict-007ACC?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-19-blue?logo=react&logoColor=white)](https://reactjs.org/)
[![Accessibility](https://img.shields.io/badge/WCAG-2.1%20AA-blue)](https://www.w3.org/WAI/WCAG21/quickref/)
[![Closed Source](https://img.shields.io/badge/license-proprietary-red)](https://wcinyp.netlify.app)

> **Weill Cornell Imaging at NewYork-Presbyterian**  
> Centralized knowledge repository and automation proof of concept designed to enhance administrative workflows. Provides operational efficiency tools that enable staff to leverage technology for process improvements with quantifiable impact on resource utilization and cost management.

## Overview

Integrated platform serving as both knowledge repository and process automation laboratory. Combines document management capabilities with workflow optimization tools designed to position administrative staff for operational success through technology-enabled process improvements:

> Development Notes: See [AI_PROMPT_SCRIPT.md](./AI_PROMPT_SCRIPT.md) and [PROJECT_OVERVIEW.md](./PROJECT_OVERVIEW.md) for development context.

- Document selection by category
- Form generation with preview
- Print management with bulk options
- WCAG 2.1 AA compliance
- Mobile responsive
- Built with shadcn/ui and TailwindCSS v4

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
- **85%+ coverage** on critical components
- **Accessibility testing** with real screen reader validation
- **User interaction testing** with realistic user scenarios
- **Error boundary testing** for graceful failure handling

See [TESTING_PROTOCOL.md](./TESTING_PROTOCOL.md) for complete testing standards.

## System Architecture

### Core Technologies
- Frontend: React 19 with TypeScript for type safety
- Styling: TailwindCSS v4 with shadcn/ui component library
- Documentation: Docusaurus 3.8 for content management
- Testing: Jest with React Testing Library for quality assurance
- Build: Webpack bundling via Docusaurus

### Application Structure
The system consists of three integrated functional areas:

1. **Knowledge Repository**: Centralized documentation hub consolidating operational procedures, reference materials, and institutional knowledge using Docusaurus
2. **Provider Intelligence**: Searchable provider directory with advanced filtering and data management capabilities designed to streamline administrative decision-making
3. **Workflow Automation**: Document lifecycle management with automated form generation, selection logic, and print queue optimization

### Data Flow
- **Static Assets**: PDF documents stored in `/static/documents/`
- **Provider Data**: JSON-based database with real-time filtering
- **Form Data**: Dynamic form generation with live preview
- **Print Queue**: Client-side document selection and batch printing

### Security & Performance
- Client-Side Processing: No server-side data storage
- Type Safety: Full TypeScript implementation
- Component Isolation: Modular architecture for maintainability
- Responsive Design: Mobile-first approach with desktop optimization

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

## Future Development Roadmap

### Phase 1: Core Functionality ✅
- ✅ Document selection interface
- ✅ Form building capabilities  
- ✅ Basic print functionality
- ✅ Responsive design

### Phase 2: Enhanced User Experience 🔄
- 🔄 Advanced search filters
- 🔄 Document favorites/bookmarks
- 🔄 Form templates and saving
- 🔄 User preferences storage

### Phase 3: Advanced Features 📋
- 📋 Digital signatures
- 📋 Document version control
- 📋 Audit trails
- 📋 Multi-language support

### Phase 4: Integration & Automation 🔮
- 🔮 EHR system integration
- 🔮 Automated form population
- 🔮 Workflow automation
- 🔮 Advanced analytics

## For Non-Technical Users

### Application Overview
This proof of concept validates technology-driven approaches to administrative process optimization:

- Workflow Intelligence: Automated document routing and form generation that eliminates repetitive manual tasks
- Knowledge Consolidation: Unified information architecture providing immediate access to procedures, forms, and reference data
- Administrative Amplification: Technology tools that multiply individual staff capacity and enable handling of increased workload complexity
- Resource Optimization: Process improvements yielding measurable reductions in time-to-completion and operational overhead

### Operational Impact
- Administrative Automation: Systematic reduction of manual intervention points in document workflows
- Information Architecture: Centralized knowledge management eliminating redundant information silos and reducing research overhead
- Capacity Optimization: Technology enablement allowing existing staff to manage increased throughput without proportional resource expansion
- Quality Assurance: Automated validation and error-checking mechanisms preventing costly processing errors before they propagate
- Financial Efficiency: Quantifiable time savings in routine administrative processes translating to measurable cost avoidance and resource reallocation opportunities

### Maintenance Approach
The codebase includes safeguards for long-term stability:

1. **Structure**: Clear boundaries and component organization
2. **Error Handling**: System handles unexpected inputs gracefully  
3. **User Feedback**: Interface provides immediate response to user actions
4. **Documentation**: Components and functions include documentation

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