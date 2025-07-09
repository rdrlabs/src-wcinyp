# Theme System Fix Guide

## Overview
Your theme system is properly implemented but has visibility issues due to hard-coded colors in some components. The theme picker works correctly - it applies both dark mode (via `dark` class on `<html>`) and color themes (via `theme-*` classes on `<body>`).

## Issues Fixed ✅
1. `src/app/global-error.tsx` - Changed `bg-white` to `bg-card`
2. `src/app/knowledge/error.tsx` - Changed `text-white` to `text-destructive-foreground`
3. `src/components/ui/dialog.tsx` - Changed `bg-black/80` to `bg-background/80`

## Remaining Issues to Fix

### Critical Components with Hard-coded Colors
These components use hard-coded colors that don't adapt to dark mode:

1. **Status Indicators** - Replace hard-coded colors with theme-aware alternatives:
   - `text-green-500` → `text-success`
   - `text-red-500` → `text-destructive`
   - `text-yellow-500` → `text-warning`
   - `text-blue-500` → `text-info`

2. **Background Colors with Opacity** - Use theme-aware backgrounds:
   - `bg-green-500/10` → `bg-success/10`
   - `bg-red-500/10` → `bg-destructive/10`
   - `bg-yellow-500/10` → `bg-warning/10`

3. **Light-mode Specific Colors** - Add dark mode variants:
   - `bg-green-50` → `bg-success/5 dark:bg-success/10`
   - `border-green-200` → `border-success/20 dark:border-success/30`

### Components in Other Projects (Claudia)
Note: Many issues found are in the `/Users/tim/claudia/` directory, which is a different project. Focus on fixing components in `/Users/tim/Documents/src-wcinyp/`.

## Quick Fix Patterns

### Pattern 1: Status Colors
```tsx
// Before
<div className="text-green-500">Success</div>

// After
<div className="text-success">Success</div>
```

### Pattern 2: Opacity Backgrounds
```tsx
// Before
<div className="bg-red-500/10 text-red-500">Error</div>

// After
<div className="bg-destructive/10 text-destructive">Error</div>
```

### Pattern 3: Dark Mode Specific
```tsx
// Before
<div className="bg-gray-50">Content</div>

// After
<div className="bg-muted">Content</div>
```

## Testing Your Fixes

1. Open the test file: `test-theme-system.html` in a browser
2. Toggle between light/dark modes
3. Switch between different color themes
4. Verify all text is readable and has sufficient contrast

## Recommendations

1. **Audit all components** in `/src/components/` for hard-coded colors
2. **Use semantic color tokens** from your theme (success, warning, destructive, info)
3. **Test in both modes** - always check light AND dark mode
4. **Consider contrast ratios** - ensure WCAG AA compliance (4.5:1 for normal text)

## Next Steps

1. Search for remaining hard-coded colors:
   ```bash
   grep -r "text-\(red\|green\|blue\|yellow\)-[0-9]" src/
   grep -r "bg-\(white\|black\|gray\)-" src/
   ```

2. Replace with theme variables from `globals.css` or semantic Tailwind classes

3. Run your tests to ensure nothing breaks:
   ```bash
   npm run lint
   npm run type-check
   npm test -- --run
   ```