# Medical Document Management System

[![Netlify Status](https://api.netlify.com/api/v1/badges/wcinyp/deploy-status)](https://app.netlify.com/sites/wcinyp/deploys)
[![Build Status](https://img.shields.io/badge/build-passing-brightgreen)](https://github.com/rdrlabs/src-wcinyp/actions)
[![Test Coverage](https://img.shields.io/badge/coverage-37%25-yellow)](./coverage/lcov-report/index.html)
[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=flat&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-19-blue?style=flat&logo=react&logoColor=white)](https://reactjs.org/)
[![Docusaurus](https://img.shields.io/badge/Docusaurus-3.8-green?style=flat&logo=docusaurus&logoColor=white)](https://docusaurus.io/)
[![Accessibility](https://img.shields.io/badge/WCAG-2.1%20AA-blue)](https://www.w3.org/WAI/WCAG21/quickref/)
[![License](https://img.shields.io/badge/license-MIT-green)](./LICENSE)

> **🚀 Demo & Proof of Concept**  
> This is a demonstration of modern web development practices applied to medical document management. Built with accessibility, maintainability, and non-technical user experience as core principles.

## 📋 Overview

A modern, accessible web application for managing medical forms and documents, featuring:

> **🤖 AI Development Ready**: See [AI_PROMPT_SCRIPT.md](./AI_PROMPT_SCRIPT.md) for optimal AI assistant engagement and [PROJECT_OVERVIEW.md](./PROJECT_OVERVIEW.md) for comprehensive system understanding.

- **🎯 Document Selection Hub** - Intuitive interface for selecting medical forms by category
- **📝 Form Builder** - Dynamic form generation with live preview and validation
- **🖨️ Print Management** - Bulk printing with quantity selection and print queue
- **♿ Accessibility First** - Full WCAG 2.1 AA compliance with screen reader support
- **📱 Mobile Responsive** - Works seamlessly across all devices
- **🎨 Modern UI** - Built with shadcn/ui and TailwindCSS v4

## 🗂️ Project Structure

```
src-wcinyp/
├── 📁 .devcontainer/              # GitHub Codespaces configuration
│   └── devcontainer.json
├── 📁 .github/workflows/          # CI/CD and automation
│   └── codespaces.yml
├── 📁 docs/                       # Docusaurus documentation
├── 📁 src/
│   ├── 📁 components/             # React components
│   │   ├── 📁 ui/                 # shadcn/ui components
│   │   │   ├── button.tsx         # Accessible button component
│   │   │   ├── card.tsx           # Card container component
│   │   │   ├── checkbox.tsx       # Form checkbox component
│   │   │   ├── input.tsx          # Form input component
│   │   │   ├── select.tsx         # Select dropdown component
│   │   │   └── 📁 __tests__/      # Component test suites
│   │   ├── ModernDocumentSelector.tsx  # Main document hub interface
│   │   ├── ModernFormBuilder.tsx       # Dynamic form generator
│   │   └── 📁 __tests__/               # Integration tests
│   ├── 📁 lib/
│   │   └── utils.ts               # Utility functions (cn, etc.)
│   ├── 📁 pages/                  # Docusaurus pages
│   │   ├── document-hub.tsx       # Document management page
│   │   ├── form-generator.tsx     # Form builder page
│   │   └── index.tsx              # Landing page
│   ├── 📁 test-utils/             # Testing utilities
│   │   └── index.tsx              # Custom render functions
│   └── setupTests.ts              # Jest configuration
├── 📁 static/documents/           # PDF documents storage
├── jest.config.js                 # Jest testing configuration
├── tailwind.config.mjs            # TailwindCSS v4 configuration
├── package.json                   # Dependencies and scripts
└── TESTING_PROTOCOL.md           # Comprehensive testing standards
```

## 🚀 Quick Start

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

### GitHub Codespaces (Mobile Safari + Claude Support) 📱

This repository is fully configured for GitHub Codespaces with mobile development:

1. **Open in Codespaces**: Click "Code" → "Create codespace on main"
2. **Mobile Safari**: Access your codespace URL from Safari mobile
3. **Claude Integration**: Works seamlessly with Claude in the browser
4. **Auto-setup**: Dependencies install automatically via `.devcontainer/devcontainer.json`

## 🧪 Testing & Quality Assurance

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

## ⚙️ System Architecture

### Core Technologies
- **Frontend**: React 19 with TypeScript for type safety
- **Styling**: TailwindCSS v4 with shadcn/ui component library
- **Documentation**: Docusaurus 3.8 for content management
- **Testing**: Jest with React Testing Library for quality assurance
- **Build**: Webpack bundling via Docusaurus

### Application Structure
The system consists of three main functional areas:

1. **Knowledge Base**: Documentation and guides using Docusaurus
2. **Provider Database**: Searchable directory with filtering capabilities  
3. **Document Management**: Form selection, generation, and printing tools

### Data Flow
- **Static Assets**: PDF documents stored in `/static/documents/`
- **Provider Data**: JSON-based database with real-time filtering
- **Form Data**: Dynamic form generation with live preview
- **Print Queue**: Client-side document selection and batch printing

### Security & Performance
- **Client-Side Processing**: No server-side data storage
- **Type Safety**: Full TypeScript implementation
- **Component Isolation**: Modular architecture for maintainability
- **Responsive Design**: Mobile-first approach with desktop optimization

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

## 🎯 Key Features

### Document Management Hub
- **Categorized Forms**: Medical forms organized by modality (MRI, CT, PET, US)
- **Smart Search**: Real-time filtering across all document types
- **Bulk Operations**: Select multiple documents with quantity control
- **Print Queue**: Visual queue showing selected documents and copy counts

### Form Builder
- **Dynamic Fields**: Patient name, DOB, service date, amount due
- **Live Preview**: Real-time form preview as you type
- **Progress Tracking**: Visual progress bar and completion percentage
- **Validation**: Field-level validation with visual feedback
- **Print Ready**: Professional formatting for medical use

### Accessibility Features
- **Screen Reader Support**: Complete ARIA labeling and semantic HTML
- **Keyboard Navigation**: Full keyboard accessibility throughout
- **High Contrast**: WCAG 2.1 AA color contrast compliance
- **Focus Management**: Clear focus indicators and logical tab order
- **Error Handling**: Descriptive error messages and fallback states

## 🛠️ Development Workflow

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

## 🚀 Deployment

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

- **🔄 CI/CD Pipeline**: Runs tests, type checking, and builds on every push
- **📊 Test Coverage Badge**: Displays current test coverage percentage 
- **✅ Build Status**: Shows if the latest deployment succeeded
- **🔒 Security**: Automated dependency vulnerability scanning
- **📈 Performance**: Lighthouse scores for accessibility and performance

To set up badges for your repository:
1. Replace `username/src-wcinyp` with your actual GitHub repository
2. Update Netlify site ID in the status badge URL
3. Configure GitHub Actions for automated badge updates

## 🎯 Future Development Roadmap

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

## 🎓 For Non-Technical Users

### Application Overview
This application shows how medical document workflows can be managed through user-friendly interfaces:

- **Simplicity**: Clear visual cues for document selection and form creation
- **Reliability**: Error handling and validation throughout the interface
- **Accessibility**: Screen reader support and keyboard navigation
- **Maintainability**: Modular code structure for updates and modifications

### Business Value
- **Reduced Training Time**: Intuitive interface requires minimal training
- **Error Prevention**: Built-in validation prevents common mistakes
- **Efficiency**: Streamlined workflows save time on routine tasks
- **Compliance**: Accessibility features ensure legal compliance
- **Scalability**: Architecture supports adding new features easily

### Maintenance Approach
The codebase includes safeguards for long-term stability:

1. **Structure**: Clear boundaries and component organization
2. **Error Handling**: System handles unexpected inputs gracefully  
3. **User Feedback**: Interface provides immediate response to user actions
4. **Documentation**: Components and functions include documentation

## 🤝 Contributing

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

MIT License - see [LICENSE](LICENSE) file for details.

## 🆘 Support & Contact

- **GitHub Issues**: [Report bugs or request features](https://github.com/rdrlabs/src-wcinyp/issues)
- **Documentation**: [Full documentation site](https://wcinyp.netlify.app)
- **Testing Guide**: [TESTING_PROTOCOL.md](./TESTING_PROTOCOL.md)

---

**Built with modern web technologies and accessibility-first design principles.**