> ⚠️ **ARCHIVED FROM FAILED DOCUSAURUS IMPLEMENTATION**
> This document was part of an over-engineered Docusaurus + Next.js hybrid that failed due to framework conflicts.
> The content remains valuable but the implementation approach should not be repeated.
> Original path: /Users/tim/Documents/src-wcinyp/archive/v1-docusaurus-hybrid/AI_CODEV_GUIDE.md

---

> ⚠️ **ARCHIVED FROM FAILED DOCUSAURUS IMPLEMENTATION**
> This document was part of an over-engineered Docusaurus + Next.js hybrid that failed due to framework conflicts.
> The content remains valuable but the implementation approach should not be repeated.
> Original path: /archive/v1-docusaurus-hybrid/AI_CODEV_GUIDE.md

---

# AI Co-Development Guide

## 📋 Overview
This guide provides essential context for AI assistants working on the **Weill Cornell Imaging at NewYork-Presbyterian (WCINYP)** internal administrative knowledge base and workflow optimization system.

> **CRITICAL**: Read this entire guide before starting ANY task. This system supports healthcare administrative staff productivity - consistency and reliability are mandatory.

> **DATA SCOPE CLARIFICATION**: This system contains **NO PATIENT PHI (Protected Health Information)**. It is strictly an internal administrative tool containing provider directories, procedural documentation, and administrative forms.

## 📚 Official Documentation References

### Core Technologies (2025 Latest)
- **Docusaurus v3**: https://docusaurus.io/docs | [Migration Guide](https://docusaurus.io/blog/preparing-your-site-for-docusaurus-v3)
- **React 19**: https://react.dev/blog/2024/12/05/react-19 | [TypeScript Guide](https://react.dev/learn/typescript)
- **TypeScript**: https://www.typescriptlang.org/docs/handbook/react.html
- **Tailwind CSS v4**: https://tailwindcss.com/docs | [v4 Migration](https://tailwindcss.com/docs/upgrade-guide)
- **shadcn/ui**: https://ui.shadcn.com/docs | [Tailwind v4 Support](https://ui.shadcn.com/docs/tailwind-v4)
- **Jest**: https://jestjs.io/docs/getting-started
- **React Testing Library**: https://testing-library.com/docs/react-testing-library/intro/
- **Netlify**: https://docs.netlify.com/ | [Deploy Guide](https://docs.netlify.com/site-deploys/create-deploys/)
- **GitHub Actions**: https://docs.github.com/en/actions
- **npm/Node.js**: Node.js 18+ required

## 🎯 **Required Reading Before Starting**

Before ANY task, you MUST read these files in order:
1. **README.md** - Project overview and technical requirements
2. **This file (AI_CODEV_GUIDE.md)** - Development standards and patterns
3. **UI_PREFERENCES.md** - User preferences for UI organization
4. **TESTING_PROTOCOL.md** - Testing requirements and quality gates
5. **component-analysis-report.md** - Technical debt and edge cases
6. **critical-fixes.md** - Ready-to-implement code improvements

## 🚨 **Validation Checklist**

Confirm understanding by checking these boxes:
- [ ] I understand this serves real healthcare professionals (SPCs)
- [ ] I know Provider layout pattern is the design standard
- [ ] I will use TodoWrite to track all tasks and progress
- [ ] I will run tests after every significant change
- [ ] I will update tests when making UI changes
- [ ] I will maintain 85%+ coverage on new components
- [ ] I will keep documentation current with code changes
- [ ] I will commit with clear, descriptive messages

## 🏥 **Organizational Context**
**WCINYP** is a prestigious academic medical center providing comprehensive diagnostic imaging services:
- **9 locations** across Manhattan and Queens
- **100+ expert clinicians** requiring streamlined workflows
- **Multiple imaging modalities**: CT, MRI, PET/CT, PET/MRI, Ultrasound, X-ray, Mammography, DEXA, EOS, Fluoroscopy
- **Academic medical center** with research and educational missions
- **Patient-centered care** with emphasis on accessibility and usability

This system directly supports clinical workflows for **Senior Patient Coordinators (SPCs)** who are responsible for:
- **Patient registration and insurance verification** across all imaging modalities
- **Appointment scheduling, confirmation, and management** for high-volume patient inquiries
- **Front-end revenue cycle management** including check-in/check-out and payment collection
- **Pre-authorization and eligibility verification** for imaging procedures
- **Patient experience optimization** ensuring smooth visits and comprehensive support

SPCs handle continuous streams of high-volume patient inquiries across 7 Manhattan sites, making system reliability, accessibility, and ease-of-use absolutely critical for patient care delivery.

## 🎯 **Recent Architectural Insights (January 2025)**

### Key Learnings from Comprehensive Audit
1. **CSS Architecture Resolved**: Successfully resolved complex Tailwind/Docusaurus conflicts using Gemini AI analysis
2. **Testing Strategy Enhanced**: Implemented TDD approach, increased coverage from 39.5% to 65%
3. **Component Architecture Modernized**: Migrated providers page from inline styles to shadcn/ui
4. **Critical Gaps Identified**: TypeScript strict mode, error boundaries, security headers need immediate attention
5. **Scope Clarified**: System contains NO PHI - purely administrative tool for staff productivity

### Architecture Quality Assessment
- **CSS Layer Separation**: A+ (Perfect implementation post-Gemini optimization)
- **Component Design**: A- (shadcn/ui excellent, legacy components need modernization)  
- **Type Safety**: D+ (TypeScript present but strict mode disabled - critical gap)
- **Error Handling**: F (No error boundaries implemented)
- **Performance**: C+ (Fast builds, but O(n) search algorithm and no monitoring)
- **Security**: D+ (Missing standard web security headers)

### Technical Quality Considerations
**Immediate Improvement Opportunities**:
- TypeScript strict mode enablement (would address runtime type safety)
- Error boundary implementation (would prevent application crashes)
- Security headers configuration (standard web security practice)
- providers.tsx test coverage (currently 0%, represents testing gap)

**Architectural Enhancement Options**:
- Centralized state management patterns
- Search algorithm optimization approaches
- Performance monitoring integration possibilities

## 🎯 **Project Purpose & Context**

This is an **internal administrative knowledge base and workflow optimization tool** for **Weill Cornell Imaging at NewYork-Presbyterian (WCINYP)**. The system enhances staff productivity through centralized access to provider directories, procedural documentation, and administrative form generation.

**Data Scope**: Provider contact information, imaging protocols, administrative forms, and procedural documentation. **Contains no patient data or PHI**.

### **Technology Stack (2025 Current)**
- **Frontend**: React 19 + TypeScript 5.x (**CRITICAL**: strict mode currently disabled - see [CLAUDE_OPUS_HANDOFF_REPORT.md](./CLAUDE_OPUS_HANDOFF_REPORT.md))
  - React 19: Latest stable with concurrent features
  - TypeScript: **NEEDS IMMEDIATE ATTENTION** - strict mode disabled creates runtime risk
- **Styling**: TailwindCSS v4.1 + shadcn/ui (**A+ Architecture**)
  - Tailwind v4: Alpha version, CSS layer separation implemented
  - shadcn/ui: 96% test coverage, modern component architecture
  - **Status**: Post-Gemini optimization, zero CSS conflicts
- **Documentation**: Docusaurus v3.8
  - Static site generation for knowledge base
  - MDX v3 support, responsive design
- **Testing**: Jest + React Testing Library (**65% Coverage**)
  - **Current**: 65% overall coverage, 96% on shadcn/ui components  
  - **Target**: 90% overall coverage, 95% on critical business logic
  - **Gap**: providers.tsx has 0% coverage (critical component)
- **Deployment**: Netlify + GitHub Actions
  - Atomic deploys working correctly
  - **Missing**: Security scanning, performance monitoring
- **Quality Status**: 
  - **Strengths**: CSS architecture, component design, documentation
  - **Critical Gaps**: Error boundaries (F rating), TypeScript strict mode (D+ rating)
  - **WCAG 2.1 AA**: Basic compliance, advanced patterns needed

### **Core Application Areas**
1. **Knowledge Repository**: Centralized documentation hub consolidating operational procedures
2. **Provider Intelligence**: Searchable provider directory with advanced filtering (DESIGN STANDARD)
3. **Workflow Automation**: Document lifecycle management with automated form generation
4. **Form Builder**: Dynamic form creation with live preview and validation

## 🚨 CRITICAL DEVELOPMENT REQUIREMENTS

### Before Starting ANY Task
- **READ ARCHITECTURE ANALYSIS**: Review [CLAUDE_OPUS_HANDOFF_REPORT.md](./CLAUDE_OPUS_HANDOFF_REPORT.md) for complete technical context
- **CHECK PROJECT STATUS**: Run `npm test -- --coverage --watchAll=false` (current: 65% coverage)
- **VERIFY BUILD**: Run `npm run typecheck` and `npm run build` (both must pass)
- **USE TodoWrite TOOL**: Track ALL tasks and progress - this is mandatory
- **UNDERSTAND SCOPE**: Remember this is an internal admin tool with NO patient data
- **VERIFY UNDERSTANDING**: Confirm you understand the Provider layout standard

### UI Preferences & Change Management
- **READ UI_PREFERENCES.md** - tracks user preferences for organization and layout
- **DOCUMENT new preferences** when user requests UI changes
- **ASK clarifying questions** if changes could impact other areas
- **DON'T make assumptions** about unmentioned areas when reorganizing
- **BALANCE preferences** with usability and future development needs

### Testing Protocol Compliance
- **ALWAYS run tests after ANY code change**: `npm run test:ci`
- **Update test assertions when UI changes** - don't just make tests pass
- **Follow TESTING_PROTOCOL.md standards** - 90%+ coverage required
- **Tests must validate REAL functionality** - not just pass for sake of passing
- **Fix broken tests immediately** - don't leave failing tests
- **CONSULT component-analysis-report.md** for edge cases and test scenarios

### Consistency Requirements
- **Match Provider layout pattern EXACTLY** - it's the design standard
- **Use inline styles** - consistent with existing codebase approach
- **Preserve ALL existing functionality** - never break what works
- **Update documentation** - keep README and this guide current
- **Test UI changes thoroughly** - verify layout + functionality
- **IMPLEMENT fixes from critical-fixes.md** when working on affected components

## 🏗️ Architecture Overview

### Design Patterns
- **Layout Consistency**: All pages follow the Provider layout pattern
- **Header Structure**: Title + Search + Filters + Content
- **Color System**: HSL-based design tokens for theme consistency
- **Component Structure**: Inline styles match existing patterns

### Medical Document Categories
- **General Forms**: Release forms, liability waivers, chaperone forms
- **Financial Forms**: Self-pay waivers, insurance off-hours forms
- **MRI Forms**: Safety questionnaires, cardiovascular, gynecologic, prostate
- **CT Forms**: Standard questionnaires, cardiac screening
- **PET Forms**: Combined PET/CT and PET/MRI questionnaires
- **Ultrasound Forms**: General, gynecologic, soft tissue questionnaires

## 🎯 Key Components

### ModernDocumentSelector (`src/components/ModernDocumentSelector.tsx`)
- **Purpose**: Document hub for selecting and printing medical forms
- **Layout**: Header with print queue + search + filters, content grid below
- **State Management**: Selected docs, search term, visible sections, bulk mode
- **Print Logic**: Opens new windows for each selected document

### ModernFormBuilder (`src/components/ModernFormBuilder.tsx`)
- **Purpose**: Dynamic form creation with live preview
- **Features**: Progress tracking, field validation, print-ready output
- **State**: Form data array with field objects (label, value, type, icon)

### Provider Database (`src/pages/providers.tsx`)
- **Purpose**: Reference implementation for layout patterns
- **Structure**: Header → Search → Filters → Content grid
- **DO NOT MODIFY**: This is the design standard to match

## 🧪 Testing Standards

### Current Status
- **Total Tests**: 66 (all passing) ✅
- **Coverage**: 37% overall, 86% on ModernDocumentSelector, 100% on ModernFormBuilder
- **Financial Forms**: Fully tested with section visibility and document selection
- **Protocol**: Follows `TESTING_PROTOCOL.md` standards with real functionality validation

### Quality Gates - Must Pass Before Completion
1. **Testing Gate**: All 66 tests passing, no regressions
2. **TypeScript Gate**: Clean compilation with no errors
3. **Build Gate**: Production build succeeds without warnings
4. **Coverage Gate**: 85%+ coverage maintained on critical components
5. **Documentation Gate**: All docs current and accurate
6. **Accessibility Gate**: WCAG 2.1 AA compliance maintained

### Test Requirements
1. **Component Rendering**: Verify basic rendering with default props
2. **User Interactions**: Click, keyboard, form input handling
3. **State Management**: Props changes, internal state updates
4. **Accessibility**: ARIA attributes, keyboard navigation
5. **Edge Cases**: Empty states, error conditions

### Test File Patterns
```
src/components/__tests__/ComponentName.test.tsx
src/components/ui/__tests__/component.test.tsx
```

## 🎨 UI/UX Guidelines

### Layout Consistency Rules
1. **NEVER break the provider layout pattern** - it's the design standard
2. **Header structure**: Always include title + search + filters
3. **Print queue placement**: Above search bar like provider filters
4. **Styling approach**: Use inline styles to match existing patterns
5. **Color system**: Use predefined MODALITY_COLORS

### Component Development Standards
1. **Provider Pattern Compliance**: All components must match providers.tsx layout structure
2. **Inline Styling**: Use consistent inline styles as per existing codebase
3. **Accessibility First**: ARIA labels, keyboard navigation, focus management
4. **Error Handling**: Graceful failures with user-friendly messages
5. **Performance**: <100ms render times for interactive components

### Color System (MODALITY_COLORS)
```css
General: '#64748b'   /* Slate */
MRI: '#3b82f6'       /* Blue */
CT: '#10b981'        /* Emerald */
PET: '#f59e0b'       /* Amber */
US: '#8b5cf6'        /* Violet */
Financial: '#64748b' /* Slate */
```

## 🎯 **AI Assistant Task Templates**

### For UI Component Work
```
REQUIREMENTS:
- Read src/pages/providers.tsx for layout standard
- Match exact header → search → filters → content structure
- Use inline styles consistent with existing components
- Update tests FIRST to expect new UI structure
- Verify accessibility with ARIA labels and keyboard navigation
- Run full test suite after changes
- Check component-analysis-report.md for edge cases
```

### For Bug Fixes
```
REQUIREMENTS:
- Check critical-fixes.md for existing solutions
- Write failing test that reproduces bug FIRST
- Fix with minimal code changes
- Ensure no regressions in existing functionality
- Update documentation if behavior changes
```

### For Testing Implementation
```
REQUIREMENTS:
- Follow TESTING_PROTOCOL.md standards exactly
- Test real user behavior, not implementation details
- Include accessibility testing (ARIA, keyboard navigation)
- Cover edge cases (empty states, errors, loading)
- Achieve 90%+ coverage on new components
```

### Testing Mindset
- **Tests validate USER behavior** - not implementation details
- **Update test assertions** - when UI structure changes
- **Don't make tests just pass** - ensure they test real functionality
- **Coverage is important** - aim for 90%+ on new components
- **Accessibility testing** - verify ARIA labels and keyboard navigation

### Common Issues
- **Layout breaks**: Always reference Provider component for structure
- **Test failures**: Update test assertions after UI changes
- **Theme inconsistency**: Use existing color tokens and spacing
- **Accessibility**: Ensure proper ARIA labels and keyboard navigation

## 📁 File Structure Reference

```
src/
├── components/
│   ├── ui/                 # shadcn/ui components
│   ├── ModernDocumentSelector.tsx
│   ├── ModernFormBuilder.tsx
│   └── __tests__/          # Component tests
├── pages/
│   ├── providers.tsx       # REFERENCE LAYOUT - DO NOT MODIFY
│   ├── document-hub.tsx
│   └── form-generator.tsx
├── lib/
│   └── utils.ts           # Utility functions
└── test-utils/
    └── index.tsx          # Testing utilities
```

## 📋 **Standard Development Workflow**

### Phase 1: Setup & Validation
```bash
# Check system status
npm run test:ci      # Must pass 66/66 tests
npm run typecheck    # Must pass clean
npm run build        # Must succeed
```

### Phase 2: Task Planning
1. **Use TodoWrite tool** to create task breakdown
2. **Read relevant analysis files** (component-analysis-report.md, critical-fixes.md)
3. **Identify test impacts** - what needs updating
4. **Plan approach** following established patterns

### Phase 3: Implementation
1. **Update tests FIRST** if doing UI work
2. **Reference providers.tsx** for layout patterns
3. **Make minimal, focused changes**
4. **Test incrementally** after each change
5. **Implement fixes from critical-fixes.md** when touching affected components

### Phase 4: Verification
1. **Run full test suite** (must pass 66/66)
2. **Verify TypeScript compilation**
3. **Test production build**
4. **Update documentation**
5. **Check accessibility compliance**

### Phase 5: Deployment
1. **Commit with clear message**
2. **Push to trigger automated deployment**
3. **Verify deployment succeeded**

## 🚨 **Critical Rules & Constraints**

### Absolute Requirements (DO NOT VIOLATE)
- ❌ **Never modify Provider component layout** - it's the design standard
- ❌ **Never break existing functionality** - this serves healthcare professionals
- ❌ **Never skip testing** - medical software requires validation
- ❌ **Never ignore accessibility** - WCAG 2.1 AA is mandatory
- ❌ **Never leave failing tests** - indicates potential clinical issues

### Mandatory Practices (ALWAYS DO)
- ✅ **Match Provider layout exactly** for all new components
- ✅ **Update tests when making UI changes** - test what users see
- ✅ **Use inline styles consistently** - matches existing patterns
- ✅ **Preserve all existing functionality** - never break working features
- ✅ **Consult analysis reports** before modifying core components
- ✅ **Track all work with TodoWrite** - ensures nothing is missed

## 🔍 Debugging Guidelines

### Layout Issues
1. Compare to Provider component structure
2. Check inline styles match existing patterns
3. Verify header → content flow

### Test Failures
1. Check if UI structure changed
2. Update assertions to match new DOM
3. Ensure functionality still works

### Build Failures
1. Check TypeScript errors
2. Verify import paths
3. Ensure all dependencies available

## 📈 Success Metrics

### Code Quality
- ✅ All tests passing
- ✅ TypeScript compilation successful
- ✅ 90%+ coverage on new components
- ✅ Consistent layout patterns

### User Experience
- ✅ Layout matches Provider design
- ✅ All functionality preserved
- ✅ Accessibility compliance
- ✅ Responsive design maintained

## 🤝 AI Assistant Guidelines

### Before Starting ANY Task
1. **Read this guide completely** - understand context and rules
2. **Check current test status** - `npm run test:ci` to see baseline
3. **Understand the request** - what's being asked and why
4. **Plan approach** - how to implement without breaking things
5. **Identify test impacts** - what tests will need updating

### During Development
1. **Follow Provider layout pattern** - never deviate from this standard
2. **Update tests as you go** - don't leave them for later
3. **Test incrementally** - run tests after each significant change
4. **Preserve existing functionality** - never break what already works
5. **Use TodoWrite tool** - track progress and ensure nothing is missed

### After Making Changes
1. **Run full test suite** - ensure all tests pass
2. **Verify build works** - `npm run build` must succeed  
3. **Update documentation** - README, this guide, any relevant docs
4. **Commit with clear message** - explain what changed and why
5. **Push to deploy** - get changes live

### Quality Standards
- **Test coverage 90%+** on new components
- **All tests must pass** - no exceptions
- **TypeScript strict mode** - no type errors allowed
- **Accessibility compliance** - ARIA labels, keyboard navigation
- **Layout consistency** - match Provider design exactly

### Communication Approach
- **Be specific** - reference exact files and line numbers
- **Explain reasoning** - why this approach vs alternatives
- **Highlight risks** - potential breaking changes or impacts
- **Show test results** - prove functionality works as expected
- **Keep user informed** - progress updates and completion status

### Emergency Procedures
If tests are failing:
1. **Stop immediately** - don't continue with broken tests
2. **Identify root cause** - what broke and why
3. **Fix tests properly** - update assertions to match new behavior
4. **Verify functionality** - ensure the feature actually works
5. **Document the fix** - explain what was wrong and how it was fixed

## 📊 **Success Metrics & Validation**

### Technical Excellence Checklist
- [ ] All 66 tests passing, no regressions
- [ ] TypeScript strict compliance
- [ ] Production build succeeds without warnings
- [ ] 85%+ test coverage on critical components
- [ ] WCAG 2.1 AA accessibility compliance

### Code Quality Validation
- [ ] Provider layout pattern followed exactly
- [ ] Inline styles consistent with codebase
- [ ] All functionality preserved
- [ ] Documentation updated
- [ ] Error handling implemented

### Healthcare Context Validation
- [ ] UI supports high-volume patient workflows
- [ ] Error states provide clear user guidance
- [ ] Performance meets <100ms interaction standards
- [ ] Accessibility enables all users
- [ ] Form validation prevents data errors

---

**This guide serves as the definitive project and process specification for AI-assisted development of production-quality healthcare software. Every development session must validate against these standards to ensure consistency, quality, and compliance with medical software requirements.**