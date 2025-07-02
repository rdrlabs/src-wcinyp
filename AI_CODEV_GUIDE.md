# AI Co-Development Guide

## 📋 Overview
This guide provides essential context for AI assistants working on the **Weill Cornell Imaging at NewYork-Presbyterian (WCINYP)** medical document management system codebase.

## 🏥 **Organizational Context**
**WCINYP** is a prestigious academic medical center providing comprehensive diagnostic imaging services:
- **9 locations** across Manhattan and Queens
- **100+ expert clinicians** requiring streamlined workflows
- **Multiple imaging modalities**: CT, MRI, PET/CT, PET/MRI, Ultrasound, X-ray, Mammography, DEXA, EOS, Fluoroscopy
- **Academic medical center** with research and educational missions
- **Patient-centered care** with emphasis on accessibility and usability

This system directly supports clinical workflows for real medical professionals serving actual patients, making quality, accessibility, and reliability absolutely critical.

## 🚨 CRITICAL REMINDERS - READ FIRST

### Testing Protocol Compliance
- **ALWAYS run tests after ANY code change**: `npm run test:ci`
- **Update test assertions when UI changes** - don't just make tests pass
- **Follow TESTING_PROTOCOL.md standards** - 90%+ coverage required
- **Tests must validate REAL functionality** - not just pass for sake of passing
- **Fix broken tests immediately** - don't leave failing tests

### Consistency Requirements
- **Match Provider layout pattern EXACTLY** - it's the design standard
- **Use inline styles** - consistent with existing codebase approach
- **Preserve ALL existing functionality** - never break what works
- **Update documentation** - keep README and this guide current
- **Test UI changes thoroughly** - verify layout + functionality

## 🏗️ Architecture Overview

### Technology Stack
- **Frontend**: React 19 + TypeScript
- **Styling**: TailwindCSS v4 + shadcn/ui components
- **Documentation**: Docusaurus 3.8
- **Testing**: Jest + React Testing Library
- **Build**: Webpack (via Docusaurus)

### Design Patterns
- **Layout Consistency**: All pages follow the Provider layout pattern
- **Header Structure**: Title + Search + Filters + Content
- **Color System**: HSL-based design tokens for theme consistency
- **Component Structure**: Inline styles match existing patterns

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
- **Total Tests**: 64 (55 passing, 9 failing)
- **Coverage**: 36% overall, 83% on ModernDocumentSelector, 100% on ModernFormBuilder
- **Protocol**: Follow `TESTING_PROTOCOL.md` standards

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

### Component Development
1. **Read existing components first** - understand patterns
2. **Match Provider styling exactly** - consistency is critical
3. **Preserve functionality** - don't break existing features
4. **Test UI changes** - verify layout works after changes

## 🔧 Development Workflow

### MANDATORY Steps for Every Change
1. **Read existing component** - understand current patterns first
2. **Plan the change** - don't break existing functionality  
3. **Update tests FIRST** - modify assertions for new UI structure
4. **Make the change** - implement with testing in mind
5. **Run full test suite** - `npm run test:ci` must pass
6. **Verify build works** - `npm run build` must succeed
7. **Update documentation** - README, this guide, etc.
8. **Commit with clear message** - explain what and why

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

## 🚨 Critical Rules

### DO NOT
- ❌ Modify the Provider component layout
- ❌ Break the existing navbar/theme system
- ❌ Change the header structure pattern
- ❌ Remove existing functionality
- ❌ Use different styling approaches than existing code

### DO
- ✅ Match the Provider layout exactly for new components
- ✅ Update tests when making UI changes
- ✅ Use inline styles to match existing patterns
- ✅ Preserve all existing functionality
- ✅ Follow the established component patterns

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

This guide ensures consistent, high-quality development while maintaining established patterns and functionality. Always prioritize stability and user experience over speed of implementation.