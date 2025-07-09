# Design System Migration Plan

## Executive Summary

### Current State (January 2025)
- ✅ Tailwind v4 infrastructure in place with @import and @theme directives
- ✅ OKLCH color system implemented 
- ✅ 8pt grid spacing system with 0 violations
- ✅ All 320 tests passing
- ⚠️ 35 design system violations remain (23 typography, 12 colors)
- ⚠️ Legacy patterns still exist in UI components and error pages

### Goal State
- Zero design system violations
- Fully implemented 4-size typography system
- Strict 60/30/10 color distribution
- Automated validation in CI/CD
- Complete removal of legacy patterns

### Migration Approach
- **Incremental**: Small, testable changes in phases
- **Test-First**: Update tests before implementation
- **Feature Flags**: Gradual rollout without breaking existing functionality
- **Traceable**: Every change documented with line numbers
- **Reversible**: Each phase can be rolled back if needed

---

## Phase 1: Test Infrastructure & Feature Flags
**Duration**: Days 1-2  
**Objective**: Enable gradual migration without breaking existing functionality

### Tasks

#### 1.1 Create Feature Flag System
- [x] Create `src/lib/feature-flags.ts`:
  ```typescript
  export const FEATURE_FLAGS = {
    STRICT_DESIGN_SYSTEM: process.env.NEXT_PUBLIC_STRICT_DESIGN_SYSTEM === 'true',
    NEUTRAL_BADGES_ONLY: process.env.NEXT_PUBLIC_NEUTRAL_BADGES === 'true',
    ENFORCE_TYPOGRAPHY: process.env.NEXT_PUBLIC_ENFORCE_TYPOGRAPHY === 'true',
  }
  ```

#### 1.2 Create Migration Helpers
- [x] Create `src/lib/design-system-migration.ts`:
  ```typescript
  // Maps old text sizes to new ones
  export function migrateTextSize(oldSize: string): string {
    const sizeMap: Record<string, string> = {
      'text-xs': 'text-sm',      // 12px → 14px
      'text-sm': 'text-sm',      // 14px → 14px
      'text-base': 'text-base',  // 16px → 16px
      'text-lg': 'text-lg',      // 18px → 18px
      'text-xl': 'text-lg',      // 20px → 18px
      'text-2xl': 'text-2xl',    // 24px → 24px
      'text-3xl': 'text-2xl',    // 30px → 24px
      'text-4xl': 'text-2xl',    // 36px → 24px
      'text-5xl': 'text-2xl',    // 48px → 24px
      'text-6xl': 'text-2xl',    // 60px → 24px
    }
    return sizeMap[oldSize] || oldSize
  }
  
  // Maps direct colors to semantic ones
  export function migrateColor(oldColor: string): string {
    const colorMap: Record<string, string> = {
      'bg-red-50': 'bg-destructive/10',
      'bg-red-100': 'bg-destructive/20',
      'bg-red-600': 'bg-destructive',
      'bg-blue-600': 'bg-primary',
      'text-red-600': 'text-destructive',
      'text-blue-600': 'text-primary',
    }
    return colorMap[oldColor] || oldColor
  }
  ```

#### 1.3 Update Test Utilities
- [x] Update `src/test/setup.ts` to support feature flags:
  ```typescript
  // Add to test setup
  global.process.env = {
    ...global.process.env,
    NEXT_PUBLIC_STRICT_DESIGN_SYSTEM: 'false', // Start with false
  }
  ```

#### 1.4 Create Test Migration Documentation
- [x] Create `docs/TEST-MIGRATION-GUIDE.md` documenting which tests need updates

### Validation Checkpoint
- [x] Feature flags can be toggled without breaking tests
- [x] Migration helpers have unit tests (17 tests passing)
- [x] All existing tests still pass with flags off (337 tests passing)

---

## Phase 2: UI Component Library Migration
**Duration**: Days 3-5  
**Objective**: Update all shadcn/ui components to follow design system

### Component Updates (Line-by-Line)

#### 2.1 Badge Component (`src/components/ui/badge.tsx`)
- [x] **Line 7**: Replace `text-xs` with conditional logic based on `ENFORCE_TYPOGRAPHY`
  ```diff
  - "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  + "inline-flex items-center rounded-full border px-2.5 py-0.5 text-sm font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  ```
- [ ] Update badge tests in `src/components/ui/badge.test.tsx`

#### 2.2 Button Component (`src/components/ui/button.tsx`)
- [x] **Line 25**: Update size variant `sm` to use conditional text size
  ```diff
  - xs: "h-7 rounded px-2 text-xs",
  + xs: "h-7 rounded px-2 text-sm",
  ```
- [ ] Consider removing `xs` variant entirely in future phase

#### 2.3 Tooltip Component (`src/components/ui/tooltip.tsx`)
- [x] **Line 22**: Replace `text-xs` with conditional text size
  ```diff
  - "z-50 overflow-hidden rounded-md bg-primary px-3 py-1.5 text-xs text-primary-foreground animate-in fade-in-0 zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
  + "z-50 overflow-hidden rounded-md bg-primary px-3 py-1.5 text-sm text-primary-foreground animate-in fade-in-0 zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
  ```

#### 2.4 Command Component (`src/components/ui/command.tsx`)
- [x] **Line 90**: Replace `text-xs` with conditional text size in CommandGroup
- [x] **Line 134**: Replace `text-xs` with conditional text size in CommandShortcut

#### 2.5 Dropdown Menu Component (`src/components/ui/dropdown-menu.tsx`)
- [x] **Line 177**: Replace `text-xs` with conditional text size in DropdownMenuShortcut

#### 2.6 Provider Table Component (`src/components/ui/provider-table.tsx`)
- [x] **Line 111**: Replace `text-xs` with conditional text size for NPI display

#### 2.7 Directory Page Badges (`src/app/directory/page.tsx`)
- [x] **Lines 138-143**: Added conditional logic for badge colors based on `NEUTRAL_BADGES_ONLY` flag
- [x] When flag enabled: uses default secondary variant (neutral)
- [x] When flag disabled: keeps colorful badges (blue, green, purple, yellow, orange)

### Test Updates
- [x] Updated directory badge tests to handle both colorful and neutral modes
- [x] Added withFeatureFlags test utility usage
- [x] All 338 tests passing

### Validation Checkpoint
- [x] UI components now use conditional rendering based on feature flags
- [x] All component tests pass (338 tests passing)
- [x] Directory page badges support both colorful and neutral modes

---

## Phase 3: Error Pages & System States
**Duration**: Days 6-7  
**Objective**: Migrate all error pages to semantic colors

### Error Page Updates

#### 3.1 Not Found Page (`src/app/not-found.tsx`)
- [x] **Line 7**: Replace `text-6xl` with conditional logic
  ```diff
  - <h1 className="text-6xl font-bold">404</h1>
  + <h1 className="text-2xl font-semibold">404</h1>
  ```
- [x] **Line 17**: Replace `bg-blue-600` with conditional `bg-primary`
  ```diff
  - className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
  + className="bg-primary text-primary-foreground px-6 py-3 rounded-lg hover:bg-primary/90 transition-colors"
  ```

#### 3.2 Global Error (`src/app/global-error.tsx`)
- [x] **Line 26**: Replace `bg-red-600` with conditional `bg-destructive`
  ```diff
  - className="bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 transition-colors"
  + className="bg-destructive text-destructive-foreground px-6 py-3 rounded-lg hover:bg-destructive/90 transition-colors"
  ```

#### 3.3 App Error (`src/app/error.tsx`)
- [x] **Line 14**: Replace `bg-red-50` with conditional `bg-destructive/10`
- [x] **Line 24**: Replace `bg-red-600` with conditional `bg-destructive`

#### 3.4 Section Error Pages
Update all section error pages (documents, directory, forms, knowledge, updates):
- [x] `src/app/documents/error.tsx` - Lines 12, 21 - Added conditional colors
- [x] `src/app/directory/error.tsx` - Lines 12, 21 - Added conditional colors
- [x] `src/app/forms/error.tsx` - Lines 12, 21 - Added conditional colors
- [x] `src/app/knowledge/error.tsx` - Lines 36, 45 - Added conditional text size and colors
- [x] `src/app/updates/error.tsx` - Lines 22, 27 - Added conditional text size and colors

### Validation Checkpoint
- [x] All error pages use conditional semantic colors based on STRICT_DESIGN_SYSTEM flag
- [x] Error states will be visually consistent when flag is enabled
- [x] All 28 error page tests passing
- [x] ErrorBoundary component also updated

---

## Phase 4: Typography Consolidation
**Duration**: Days 8-10  
**Objective**: Complete typography system implementation

### Typography Updates

#### 4.1 UI Constants (`src/constants/ui.ts`)
- [ ] **Line 51**: Remove `text-5xl` from TEXT_SIZES
- [ ] **Line 52**: Remove `text-4xl` from TEXT_SIZES
- [ ] **Line 57**: Replace `text-xs` with `text-sm`
- [ ] Update TEXT_SIZES to only include: `text-sm`, `text-base`, `text-lg`, `text-2xl`

#### 4.2 Form Builder (`src/components/FormBuilder.tsx`)
- [ ] **Line 169**: Replace `text-3xl` with `text-2xl`

#### 4.3 Error Boundary (`src/components/ErrorBoundary.tsx`)
- [ ] **Line 53**: Replace `text-xs` with `text-sm`

#### 4.4 Documents Page (`src/app/documents/page.tsx`)
- [ ] **Lines 153, 156, 223, 288, 315**: Replace all `text-xs` with `text-sm`

#### 4.5 Document Browser (`src/components/features/documents/DocumentBrowser.tsx`)
- [ ] **Line 105**: Replace `text-xs` with `text-sm`

#### 4.6 Updates Page (`src/app/updates/page.tsx`)
- [ ] **Line 82**: Replace `text-xs` with `text-sm`

#### 4.7 Knowledge Components
- [ ] `src/components/knowledge/SidebarFooter.tsx` - Line 10
- [ ] `src/app/knowledge/error.tsx` - Line 36 (text-3xl → text-2xl)

### Font Weight Standardization
- [ ] Global search and replace: `font-bold` → `font-semibold`
- [ ] Global search and replace: `font-medium` → `font-normal` or `font-semibold` (context-dependent)

### Validation Checkpoint
- [ ] Run `npm run validate:design` - Typography violations should be 0
- [ ] Visual hierarchy is maintained
- [ ] All text remains readable

---

## Phase 5: Validation & Enforcement
**Duration**: Days 11-12  
**Objective**: Achieve zero violations and prevent regressions

### 5.1 Final Cleanup
- [ ] Run `npm run validate:design` and fix any remaining violations
- [ ] Update any missed components
- [ ] Remove deprecated helper functions

### 5.2 CI/CD Integration
- [ ] Add design system validation to `.github/workflows/ci.yml`:
  ```yaml
  - name: Validate Design System
    run: npm run validate:design
  ```
- [ ] Make validation a required check for PRs

### 5.3 Documentation Updates
- [ ] Update `README.md` with design system information
- [ ] Update component documentation
- [ ] Create design system showcase page
- [ ] Archive this migration plan

### 5.4 Remove Feature Flags
- [ ] Set all feature flags to true by default
- [ ] Remove feature flag checks from code
- [ ] Clean up migration helpers

### 5.5 Team Communication
- [ ] Create design system cheatsheet
- [ ] Host team training session
- [ ] Document common patterns

### Final Validation
- [ ] Zero violations in `npm run validate:design`
- [ ] All 320+ tests passing
- [ ] No visual regressions
- [ ] Performance metrics unchanged
- [ ] Build size optimized

---

## Rollback Plans

### Phase 1 Rollback
- Remove feature flag system
- Revert test setup changes

### Phase 2-4 Rollback
- Use git to revert specific component changes
- Re-run tests to ensure stability

### Phase 5 Rollback
- Remove CI/CD validation
- Keep improvements but don't enforce

---

## Progress Tracking

### Overall Progress
- Phase 1: ✅✅✅✅✅✅✅✅✅✅ 100%
- Phase 2: ✅✅✅✅✅✅✅✅✅✅ 100%
- Phase 3: ✅✅✅✅✅✅✅✅✅✅ 100%
- Phase 4: ⬜⬜⬜⬜⬜⬜⬜⬜⬜⬜ 0%
- Phase 5: ⬜⬜⬜⬜⬜⬜⬜⬜⬜⬜ 0%

### Current Status
**Date Started**: January 2025  
**Current Phase**: Phase 3 Complete ✅  
**Blockers**: None  
**Next Action**: Begin Phase 4 - Typography Consolidation

---

## Command Reference

```bash
# Check current violations
npm run validate:design

# Run tests
npm test -- --run

# Find specific violations
grep -r "text-xs" src/
grep -r "bg-red-" src/
grep -r "font-bold" src/

# Check specific component
npm test -- --run src/components/ui/badge.test.tsx
```

---

## Notes Section
*Use this section to document decisions, exceptions, and learnings during migration*

### Phase 1 Completion (January 2025)
- Created feature flag system with 3 flags: STRICT_DESIGN_SYSTEM, NEUTRAL_BADGES_ONLY, ENFORCE_TYPOGRAPHY
- Implemented migration helpers with full test coverage (17 new tests)
- Updated test setup to initialize feature flags as disabled by default
- Created comprehensive test migration guide
- All 337 tests continue to pass with flags disabled
- Ready to begin Phase 2 with confidence

### Phase 2 Completion (January 2025)
- Updated all UI components with conditional rendering based on feature flags
- Badge, Button, Tooltip, Command, Dropdown, and Provider Table components now support both modes
- Directory page badges can render both colorful (legacy) and neutral (new) styles
- Fixed test issues by making feature flags use getters for dynamic evaluation
- Updated directory badge tests to handle both modes with `withFeatureFlags` utility
- All 338 tests passing (added 1 new test for neutral badge mode)
- Components are ready for gradual migration via feature flags

### Phase 3 Completion (January 2025)
- Updated all error pages (8 total) with conditional colors and typography
- All error pages now support both legacy and new design system modes
- Colors: `bg-red-600` → `bg-destructive`, `bg-red-50` → `bg-destructive/10`, etc.
- Typography: `text-6xl` → `text-2xl`, `text-4xl` → `text-2xl`, `text-3xl` → `text-2xl`
- ErrorBoundary component also updated for consistency
- All 28 error page tests passing
- Static validation still shows 71 violations (expected - they're now conditional)
- Ready for Phase 4 to tackle remaining typography issues

- 

---

Last Updated: January 2025