# AI Co-Development Guide

## 📋 Overview
This guide provides essential context for AI assistants working on this medical document management system codebase.

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

### When Making Changes
1. **Check existing tests** - update assertions for UI changes
2. **Run test suite** - ensure no regressions
3. **Verify build** - `npm run build` must succeed
4. **Update documentation** - keep this guide current

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

### When Working on This Codebase
1. **Read this guide first** - understand the context
2. **Check existing patterns** - don't reinvent the wheel
3. **Test changes thoroughly** - verify functionality
4. **Update documentation** - keep guides current
5. **Ask clarifying questions** - when patterns aren't clear

### Communication Style
- Be specific about which component you're modifying
- Reference line numbers when discussing code
- Explain the reasoning behind architectural decisions
- Highlight any potential breaking changes

This guide ensures consistent, high-quality development while maintaining the established patterns and functionality of the medical document management system.