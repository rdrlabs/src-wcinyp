# Design System Implementation TODO

## Overview
This document contains the complete plan for implementing the strict design system based on shadcn/ui + Tailwind v4 principles. Created during the UI simplification phase after removing wiki, command palette, and excess provider card features.

## Current State Analysis (As of Phase 2)

### ✅ Completed
1. **Removed from Provider Cards**:
   - Star ratings
   - Provider flags (VIP, urgent, new, teaching, research)
   - "Available Today" badge
   - Languages section
   - Schedule & vCard buttons

2. **Simplified Navbar**:
   - Removed command palette/search
   - Removed quick links dropdown
   - Removed feedback button
   - Removed fake login system
   - Structure: Logo | Navigation | Theme Toggle

### ❌ Design System Violations Found

#### Typography Problems
- **Currently using**: 10+ text sizes (text-xs through text-6xl)
- **Font weights**: Using medium, semibold, and bold (3 weights instead of 2)
- **Examples found**:
  ```
  text-6xl (404 page)
  text-5xl (hero text)
  text-4xl (page titles)
  text-3xl (document page)
  text-2xl (various headings)
  text-xl (subheadings)
  text-base (body)
  text-sm (small text)
  text-xs (tiny labels)
  ```

#### Spacing Violations
- **Non-8pt grid values**: gap-1.5 (6px) found in multiple places
- **Should be**: All spacing divisible by 8 or 4 (4px, 8px, 12px, 16px, 24px, 32px, 48px, 64px)

#### Color Overuse
- **Current badge colors**: blue, purple, green, orange, pink, indigo, red, yellow
- **Theme colors in lib/theme.ts**: 10+ color variants
- **Should be**: 60% neutral, 30% text, 10% accent

## Implementation Plan

### Phase 1: Create Design System Foundation

#### 1.1 Typography Constants
Create `src/constants/typography.ts`:
```typescript
export const TYPOGRAPHY = {
  // Only 4 sizes allowed
  size: {
    large: 'text-2xl',    // 24px - Page titles, major headings
    medium: 'text-lg',    // 18px - Section headings, card titles
    base: 'text-base',    // 16px - Body text, form inputs
    small: 'text-sm'      // 14px - Labels, captions, badges
  },
  // Only 2 weights allowed
  weight: {
    normal: 'font-normal',      // 400 - Body text
    semibold: 'font-semibold'   // 600 - Headings, emphasis
  }
}

// Helper function for consistent application
export function getTextClass(size: keyof typeof TYPOGRAPHY.size, weight?: keyof typeof TYPOGRAPHY.weight) {
  const sizeClass = TYPOGRAPHY.size[size];
  const weightClass = weight ? TYPOGRAPHY.weight[weight] : '';
  return `${sizeClass} ${weightClass}`.trim();
}
```

#### 1.2 Spacing Constants
Create `src/constants/spacing.ts`:
```typescript
export const SPACING = {
  // All values follow 8pt grid
  px: {
    0: '0px',
    4: '4px',    // 0.25rem
    8: '8px',    // 0.5rem
    12: '12px',  // 0.75rem
    16: '16px',  // 1rem
    24: '24px',  // 1.5rem
    32: '32px',  // 2rem
    48: '48px',  // 3rem
    64: '64px',  // 4rem
    96: '96px',  // 6rem
  },
  // Tailwind classes
  class: {
    0: 'p-0 m-0 gap-0',
    1: 'p-1 m-1 gap-1',      // 4px
    2: 'p-2 m-2 gap-2',      // 8px
    3: 'p-3 m-3 gap-3',      // 12px
    4: 'p-4 m-4 gap-4',      // 16px
    6: 'p-6 m-6 gap-6',      // 24px
    8: 'p-8 m-8 gap-8',      // 32px
    12: 'p-12 m-12 gap-12',  // 48px
    16: 'p-16 m-16 gap-16',  // 64px
  }
}
```

#### 1.3 Color System Update
Update `src/app/globals.css` to use OKLCH format:
```css
@layer base {
  :root {
    /* 60% Neutral (backgrounds) */
    --background: oklch(1 0 0);              /* white */
    --card: oklch(0.99 0 0);                 /* off-white */
    
    /* 30% Complementary (text, borders) */
    --foreground: oklch(0.2 0 0);            /* near-black */
    --muted-foreground: oklch(0.6 0 0);      /* gray */
    --border: oklch(0.9 0 0);                /* light gray */
    
    /* 10% Accent (CTAs, important elements) */
    --primary: oklch(0.5 0.2 250);           /* brand blue */
    --primary-foreground: oklch(1 0 0);       /* white on primary */
    
    /* Semantic colors (use sparingly) */
    --destructive: oklch(0.5 0.3 25);        /* red for errors only */
  }
}
```

### Phase 2: Component Migration Strategy

#### 2.1 Migration Order (by impact)
1. **Global Components** (affects entire app):
   - `src/app/globals.css` - Color variables
   - `src/constants/ui.ts` - Replace TEXT_SIZES
   - `src/lib/theme.ts` - Simplify to single accent

2. **High-Traffic Components**:
   - `src/app/page.tsx` - Homepage
   - `src/components/navbar.tsx` - Already simplified, needs typography
   - `src/components/footer.tsx` - Typography and spacing
   - `src/components/ui/provider-table.tsx` - Typography update

3. **Page Headers** (standardize all):
   - Documents page: text-3xl → text-2xl
   - Providers page: text-3xl → text-2xl
   - Directory page: text-3xl → text-2xl
   - Forms pages: various → text-2xl

4. **Badges & Status Indicators**:
   - Convert all colorful badges to neutral
   - Use accent color only for primary CTAs

#### 2.2 Specific Changes Needed

**Typography Replacements**:
```
text-6xl → text-2xl (large)
text-5xl → text-2xl (large)
text-4xl → text-2xl (large)
text-3xl → text-2xl (large)
text-2xl → text-lg (medium)
text-xl → text-lg (medium)
text-base → text-base (base)
text-sm → text-sm (small)
text-xs → text-sm (small)

font-bold → font-semibold
font-medium → font-normal or font-semibold (context dependent)
```

**Spacing Replacements**:
```
gap-1.5 → gap-2 (6px → 8px)
p-5 → p-4 or p-6 (20px → 16px or 24px)
m-7 → m-6 or m-8 (28px → 24px or 32px)
Any arbitrary values → nearest 8pt grid value
```

**Color Replacements**:
- Badge variants: Keep only default (neutral) and primary
- Remove: blue, purple, green, orange, pink, indigo category colors
- Status colors: Only use semantic colors for errors/warnings

### Phase 3: Testing & Enforcement

#### 3.1 Create Validation Script
Create `scripts/validate-design-system.js`:
```javascript
// Check for design system violations
// - Text sizes outside allowed 4
// - Font weights outside allowed 2
// - Spacing not on 8pt grid
// - Excessive color usage
```

#### 3.2 Update Component Tests
- Add tests to verify design system compliance
- Check computed styles match constraints

#### 3.3 ESLint Rules
Add custom rules or use existing plugins to enforce:
- Allowed Tailwind classes only
- No arbitrary values
- No inline styles

## Future Enhancement: Combine Provider & Directory Pages

### Concept
Similar to how Documents & Forms were combined with a toggle, we can merge:
- **Providers** (medical staff)
- **Directory** (all contacts)

### Implementation Approach
1. Create unified "People" or "Contacts" page
2. Add toggle: "Providers Only" | "All Contacts"
3. Shared components:
   - Search functionality
   - Filter sidebar
   - Contact cards
4. Provider-specific fields shown only in provider mode:
   - NPI, specialty, department
   - Clinical notes
5. Directory shows additional:
   - Administrative staff
   - External contacts
   - Vendors

### Benefits
- Reduced navigation complexity
- Unified search experience
- Code reuse for similar functionality
- Consistent UI patterns

## Migration Checklist

### Pre-Implementation
- [ ] Review all components for violations
- [ ] Create constants files
- [ ] Update globals.css to OKLCH
- [ ] Plan component update order

### During Implementation
- [ ] Update each component systematically
- [ ] Run tests after each change
- [ ] Document any edge cases
- [ ] Keep design guidelines visible

### Post-Implementation
- [ ] Run full test suite
- [ ] Validate with design system checker
- [ ] Update documentation
- [ ] Add monitoring for violations

## Notes for Future Implementation

1. **Start Small**: Begin with constants and globals.css
2. **Test Frequently**: Run tests after each component update
3. **Be Systematic**: Follow the migration order
4. **Document Decisions**: Note any exceptions needed
5. **Provider/Directory Merge**: Save for after design system is complete

## Related Files
- Design Guidelines: `/docs/DESIGN-GUIDELINES.md`
- Current Theme: `/src/lib/theme.ts`
- UI Constants: `/src/constants/ui.ts`
- Tailwind Config: `/tailwind.config.ts`
- Global Styles: `/src/app/globals.css`

## Commands to Run
```bash
# After each component update
npm run lint
npm run type-check
npm test -- --run

# Find violations
grep -r "text-\(xs\|xl\|2xl\|3xl\|4xl\|5xl\|6xl\)" src/
grep -r "gap-1\.5" src/
grep -r "font-\(bold\|medium\)" src/
```

This plan ensures a systematic approach to implementing the strict design system while maintaining functionality and test coverage.