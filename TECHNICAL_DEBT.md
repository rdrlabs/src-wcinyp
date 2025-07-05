# Technical Debt Documentation

## Overview
This document tracks technical debt and temporary workarounds in the WCINYP codebase.

## Current Technical Debt Items

### 1. Fumadocs UI Components - Build Error Workaround
**Date Added**: January 2025  
**Severity**: High  
**Status**: Temporary Fix Applied

**Problem**: 
- Fumadocs UI components (Callout, Cards, Tabs, Steps, etc.) are causing build errors
- Error: "Cannot read properties of undefined (reading 'useMDXComponents')"
- This prevents the production build from completing

**Current Workaround**:
1. All Fumadocs UI component imports have been commented out in MDX files
2. Stub components have been added to `mdx-components.tsx` to prevent runtime errors
3. MDX content has been converted to use standard Markdown syntax where possible
4. Despite these changes, the build still fails with "Callout is not defined" errors

**Build Error Details**:
- Error occurs during static generation of `/knowledge` pages
- The MDX compilation process appears to be evaluating component references even when commented out
- This suggests a deeper integration issue between Fumadocs MDX loader and Next.js 15

**Files Affected**:
- `/content/docs/index.mdx`
- `/content/docs/features/documents.mdx`
- `/content/docs/features/forms.mdx`
- `/content/docs/guides/form-builder.mdx`
- `/content/docs/guides/components-showcase.mdx`
- `/mdx-components.tsx`

**Proper Fix Required**:
- Investigate why Fumadocs UI components are not working with the current setup
- Possibly related to MDX v3 compatibility or Next.js 15 changes
- May need to update Fumadocs packages or configuration
- Consider alternative documentation UI component libraries if issue persists

**Impact**:
- Documentation pages lack visual components (callouts, cards, tabs)
- User experience is degraded with plain markdown instead of rich components
- Some interactive documentation features are not available

### 2. Next.js 15 Async Props Migration
**Date Added**: January 2025  
**Severity**: Medium  
**Status**: Partially Resolved

**Problem**:
- Next.js 15 requires async handling of params and searchParams props
- Many components were using synchronous access patterns

**Current State**:
- Most pages have been updated to use `await props.params`
- Some test files may still need updates

**Remaining Work**:
- Audit all page components for proper async prop handling
- Update any remaining synchronous usages

### 3. Test Infrastructure Warnings
**Date Added**: January 2025  
**Severity**: Low  
**Status**: Active

**Problem**:
- ESLint warnings about `any` types in test files
- Some test utilities use `any` for flexibility

**Files Affected**:
- `src/app/knowledge/sidebar.test.tsx`
- Various test files using mock data

**Proper Fix**:
- Define proper types for test utilities
- Create typed mock factories

## Documentation Requirements

### 1. Migration Guide
**Status**: Not Started  
**Priority**: High

Need to create documentation for:
- Next.js 14 to 15 migration steps
- Breaking changes encountered
- Solutions implemented

### 2. Component Documentation
**Status**: In Progress  
**Priority**: Medium

The `components-showcase.mdx` file was intended to document all Fumadocs components but is currently non-functional due to the build issues.

### 3. Development Setup Guide
**Status**: Exists (CLAUDE.md)  
**Priority**: Low

Current documentation in CLAUDE.md is adequate but could be expanded with:
- Troubleshooting section
- Common development tasks
- Testing guidelines

## Recommendations

1. **Immediate Actions**:
   - Fix the Fumadocs UI components issue to restore full documentation functionality
   - Complete the async props migration

2. **Short-term** (1-2 weeks):
   - Create proper TypeScript types for test utilities
   - Document the migration process
   - Add integration tests for documentation pages

3. **Long-term** (1-2 months):
   - Evaluate alternative documentation solutions if Fumadocs issues persist
   - Consider creating custom MDX components if needed
   - Implement automated checks for technical debt accumulation

## Tracking

Technical debt items should be:
1. Added to this document when discovered
2. Linked to GitHub issues when applicable
3. Reviewed monthly to prioritize fixes
4. Removed only when properly resolved (not just worked around)

---

Last Updated: January 2025