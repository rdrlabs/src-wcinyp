# Knowledge Base Restoration Guide

## Overview
This document contains instructions for restoring the full Fumadocs knowledge base implementation after the design system work is complete.

## Files to Restore

### 1. `/app/knowledge/layout.tsx`
- Contains RootProvider from fumadocs-ui
- Imports fumadocs.css for isolated styling
- Uses DocsLayout component with sidebar

### 2. `/app/knowledge/page.tsx`
- Currently a full implementation with MDX support
- Uses mock-source.tsx for navigation tree

### 3. `/app/knowledge/mock-source.tsx`
- Defines the page tree structure
- Creates navigation hierarchy

### 4. `/app/knowledge/fumadocs.css`
- Contains Fumadocs-specific styling
- Isolated from main app styles

## Key Components

### RootProvider Configuration
```typescript
<RootProvider
  search={{
    enabled: true,
    options: {
      type: 'static',
    },
  }}
  theme={{
    defaultTheme: 'system',
    enabled: true,
  }}
>
```

### DocsLayout Configuration
```typescript
<DocsLayout
  tree={pageTree}
  nav={{
    title: 'Knowledge Base',
    transparentMode: 'top',
  }}
  sidebar={{
    enabled: true,
    collapsible: true,
    defaultOpenLevel: 1,
  }}
>
```

## Dependencies
- fumadocs-ui
- fumadocs-core
- MDX support packages

## Why Temporarily Removed
- Fumadocs has its own design system
- Uses different color variables (not following our 60/30/10 rule)
- Has its own typography scale
- Isolated styling could conflict during global design system implementation

## Restoration Steps
1. Restore the original layout.tsx with RootProvider
2. Restore the full page.tsx implementation
3. Ensure mock-source.tsx is active
4. Re-enable fumadocs.css import
5. Test that isolation still works with new design system

## Notes
- The placeholder implementation maintains the route and navigation
- Tests should continue to pass with simplified version
- Full functionality can be restored without breaking changes