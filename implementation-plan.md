# WCI@NYP Implementation Plan

## Overview
This document outlines the implementation plan for the requested changes to improve theming, dark mode contrast, and page consistency across the application.

## 1. Change Default Theme from Blue to Neutral (renamed as "Default")

### Changes Needed:

#### a. Update Default Theme Constant
**File:** `src/contexts/app-context.tsx`
```typescript
// Change from:
const DEFAULT_COLOR_THEME: ColorTheme = 'blue';

// To:
const DEFAULT_COLOR_THEME: ColorTheme = 'default';
```

#### b. Update Type Definition
**File:** `src/types/index.ts` (or wherever ColorTheme is defined)
```typescript
// Change from:
export type ColorTheme = 'blue' | 'red' | 'orange' | 'green' | 'yellow' | 'neutral';

// To:
export type ColorTheme = 'blue' | 'red' | 'orange' | 'green' | 'yellow' | 'default';
```

#### c. Fix Neutral/Default Theme Colors
**File:** `src/app/globals.css`
```css
/* Default Theme (Neutral - No color, adapts to light/dark) */
.theme-default {
  --color-primary: oklch(25% 0 0);  /* Dark gray for light mode */
  --color-primary-foreground: oklch(98% 0 0);
  --color-ring: oklch(45% 0 0);
}

[data-theme="dark"].theme-default {
  --color-primary: oklch(85% 0 0);  /* Light gray for dark mode */
  --color-primary-foreground: oklch(10% 0 0);
  --color-ring: oklch(85% 0 0);
}
```

#### d. Update Theme Arrays
**Files to update:**
- `src/app/diagnostics/page.tsx`
- `src/components/theme-selector.tsx`
- Any other files referencing theme arrays

```typescript
// Change from:
{ value: 'neutral', name: 'Neutral', color: 'oklch(40% 0.01 0)' }

// To:
{ value: 'default', name: 'Default', color: 'oklch(25% 0 0)' }
```

## 2. Fix Dark Mode Contrast Issues

### Update Dark Mode Colors
**File:** `src/app/globals.css`

```css
/* Dark mode color overrides */
[data-theme="dark"] {
  --color-background: oklch(10% 0 0);        /* Was 15%, darker background */
  --color-foreground: oklch(95% 0 0);        /* Was 98%, slightly less bright */
  --color-muted: oklch(20% 0 0);             /* Was 25%, more contrast */
  --color-muted-foreground: oklch(70% 0 0);  /* Was 65%, brighter muted text */
  --color-card: oklch(13% 0 0);              /* Was 18%, more contrast from bg */
  --color-card-foreground: oklch(95% 0 0);
  --color-popover: oklch(13% 0 0);           /* Was 18% */
  --color-popover-foreground: oklch(95% 0 0);
  --color-border: oklch(27% 0 0);            /* Was 25%, slightly brighter */
  --color-input: oklch(18% 0 0);             /* Was 25%, darker inputs */
  --color-primary: oklch(69.8% 0.195 238.4);
  --color-primary-foreground: oklch(15% 0 0);
  --color-accent: oklch(17% 0 0);            /* Was 25%, darker accent */
  --color-accent-foreground: oklch(95% 0 0);
  --color-secondary: oklch(17% 0 0);         /* Was 25%, darker secondary */
  --color-secondary-foreground: oklch(95% 0 0);
  --color-destructive: oklch(50% 0.25 27);
  --color-destructive-foreground: oklch(95% 0 0);
  --color-ring: oklch(69.8% 0.195 238.4);
  --color-success: oklch(70% 0.15 150);
  --color-success-foreground: oklch(15% 0 0);
  --color-warning: oklch(80% 0.15 85);
  --color-warning-foreground: oklch(15% 0 0);
  --color-info: oklch(70% 0.15 235);
  --color-info-foreground: oklch(15% 0 0);
}
```

## 3. Apply Updates Page Pattern to Knowledge Base

### Transform Knowledge Page
**File:** `src/app/knowledge/page.tsx`

```tsx
'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BookOpen, FileText, Users, Settings, HelpCircle, Lightbulb } from "lucide-react";
import { TYPOGRAPHY } from "@/constants/typography";
import { cn } from "@/lib/utils";

export default function KnowledgePage() {
  const comingSoonFeatures = [
    // ... existing features array
  ];

  return (
    <div className="container mx-auto py-8">
      <Card className="border rounded-lg bg-muted/10">
        <CardHeader className="text-center pb-12">
          <h1 className={TYPOGRAPHY.pageTitle}>Knowledge Base</h1>
          <p className={cn(TYPOGRAPHY.pageDescription, "mt-2")}>
            Comprehensive documentation and guides for using the imaging center portal
          </p>
        </CardHeader>
        
        <CardContent>
          <h2 className={cn(TYPOGRAPHY.sectionTitle, "text-center mb-8")}>Coming Soon</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {comingSoonFeatures.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div
                  key={index}
                  className="p-6 border rounded-lg bg-background hover:shadow-md transition-shadow"
                >
                  <div className="flex items-center gap-4 mb-3">
                    <div className="p-2 rounded-lg bg-primary/10">
                      <Icon className="h-6 w-6 text-primary" />
                    </div>
                    <h3 className="font-semibold">{feature.title}</h3>
                  </div>
                  <p className="text-sm text-muted-foreground mb-3">
                    {feature.description}
                  </p>
                </div>
              );
            })}
          </div>
          
          <div className="text-center mt-12">
            <p className="text-sm text-muted-foreground">
              Need immediate assistance? Contact the IT Help Desk at{" "}
              <a href="mailto:imaging@med.cornell.edu" className="text-primary hover:underline">
                imaging@med.cornell.edu
              </a>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
```

## 4. Create Unified Top Component for Documents & Directory

### Shared Header Component Pattern

#### Documents Page Update
**File:** `src/app/documents/page.tsx`

```tsx
export default function DocumentsPage() {
  // ... existing state

  return (
    <div className="container mx-auto py-8 space-y-6">
      {/* Unified Header Card */}
      <Card className="border-0 shadow-sm">
        <CardHeader>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className={TYPOGRAPHY.pageTitle}>Documents & Forms</h1>
              <p className={cn(TYPOGRAPHY.pageDescription, "mt-1")}>
                Access medical forms, documents, and create custom forms
              </p>
            </div>
            <div className="flex items-center gap-4">
              {/* Search */}
              <div className="relative w-64">
                <Input
                  type="search"
                  placeholder="Search..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              </div>
              
              {/* View Toggle */}
              <div className="flex items-center gap-2">
                <Label className="text-sm">Documents</Label>
                <Switch
                  checked={viewMode === 'forms'}
                  onCheckedChange={(checked) => setViewMode(checked ? 'forms' : 'documents')}
                />
                <Label className="text-sm">Forms</Label>
              </div>
            </div>
          </div>
        </CardHeader>
        
        <CardContent>
          {/* Stats Row */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
            <div className="text-center">
              <p className="text-2xl font-semibold">{documentsCount}</p>
              <p className="text-sm text-muted-foreground">Total Documents</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-semibold">{categoriesCount}</p>
              <p className="text-sm text-muted-foreground">Categories</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-semibold">{formsCount}</p>
              <p className="text-sm text-muted-foreground">Form Templates</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-semibold">{recentCount}</p>
              <p className="text-sm text-muted-foreground">Recent Updates</p>
            </div>
          </div>
          
          {/* Category Filter */}
          <div className="flex gap-2 flex-wrap">
            <Button
              variant={selectedCategory === 'all' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedCategory('all')}
            >
              All Categories
            </Button>
            {/* Other category buttons */}
          </div>
        </CardContent>
      </Card>

      {/* Table Card */}
      <Card className="border-0 shadow-sm">
        <CardContent className="p-0">
          <Table>
            {/* Existing table content */}
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
```

#### Directory Page Update
**File:** `src/app/directory/page.tsx`

```tsx
export default function DirectoryPage() {
  // ... existing state

  return (
    <div className="container mx-auto py-8 space-y-6">
      {/* Unified Header Card */}
      <Card className="border-0 shadow-sm">
        <CardHeader>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className={TYPOGRAPHY.pageTitle}>Contact Directory</h1>
              <p className={cn(TYPOGRAPHY.pageDescription, "mt-1")}>
                Comprehensive database of contacts and referring providers
              </p>
            </div>
            <div className="flex items-center gap-4">
              {/* Search */}
              <div className="relative w-64">
                <Input
                  type="search"
                  placeholder="Search contacts..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              </div>
              
              {/* View Toggle */}
              <div className="flex items-center gap-2">
                <Label className="text-sm">Directory</Label>
                <Switch
                  checked={viewMode === 'providers'}
                  onCheckedChange={(checked) => setViewMode(checked ? 'providers' : 'directory')}
                />
                <Label className="text-sm">Providers</Label>
              </div>
            </div>
          </div>
        </CardHeader>
        
        <CardContent>
          {/* Stats Row */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
            <div className="text-center">
              <p className="text-2xl font-semibold">{totalContacts}</p>
              <p className="text-sm text-muted-foreground">Total Contacts</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-semibold">{providersCount}</p>
              <p className="text-sm text-muted-foreground">Providers</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-semibold">{facilitiesCount}</p>
              <p className="text-sm text-muted-foreground">Facilities</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-semibold">{vendorsCount}</p>
              <p className="text-sm text-muted-foreground">Vendors</p>
            </div>
          </div>
          
          {/* Type Filter */}
          <div className="flex gap-2 flex-wrap">
            <Button
              variant={selectedType === 'all' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedType('all')}
            >
              All Types
            </Button>
            {/* Other type buttons */}
          </div>
        </CardContent>
      </Card>

      {/* Table Card */}
      <Card className="border-0 shadow-sm">
        <CardContent className="p-0">
          {viewMode === 'directory' ? (
            <DataTable columns={columns} data={filteredContacts} />
          ) : (
            <ReferringProviderTable providers={providers} />
          )}
        </CardContent>
      </Card>
    </div>
  );
}
```

## 5. Additional Updates

### Update Theme Validation
**File:** `src/contexts/app-context.tsx`
```typescript
// Update theme validation check
if (savedTheme && ['blue', 'red', 'orange', 'green', 'yellow', 'default'].includes(savedTheme)) {
  setColorThemeState(savedTheme);
  document.body.classList.add(`theme-${savedTheme}`);
}
```

### Update Theme Selector Component
**File:** `src/components/theme-selector.tsx`
- Update the label from "Neutral" to "Default"
- Update the value from "neutral" to "default"

### Update ThemeBody Component
**File:** `src/components/theme-body.tsx`
```typescript
const colorTheme = localStorage.getItem('color-theme') || 'default'
```

## Implementation Order

1. **Fix Dark Mode Colors** (globals.css)
   - Update all dark mode CSS variables for better contrast
   - Test with different components to ensure readability

2. **Update Neutral Theme to Default**
   - Rename all "neutral" references to "default"
   - Update CSS classes from `.theme-neutral` to `.theme-default`
   - Fix the default theme colors for proper light/dark adaptation

3. **Change Default Theme**
   - Update DEFAULT_COLOR_THEME constant
   - Update initial theme in ThemeBody component

4. **Apply Updates Page Pattern**
   - Transform knowledge base page
   - Ensure consistent spacing and styling

5. **Create Unified Headers**
   - Implement shared header pattern for documents page
   - Implement shared header pattern for directory page
   - Ensure responsive design works properly

## Testing Checklist

- [ ] Default theme loads correctly on first visit
- [ ] Dark mode has sufficient contrast for all text
- [ ] All theme colors work properly in both light and dark modes
- [ ] Knowledge base page matches updates page styling
- [ ] Documents page header is consistent and functional
- [ ] Directory page header is consistent and functional
- [ ] Search functionality works in unified headers
- [ ] View mode toggles work correctly
- [ ] All responsive breakpoints work properly
- [ ] No console errors or warnings

## Notes

- The default theme should provide a neutral, professional appearance that works well in both light and dark modes
- Dark mode improvements focus on creating more visual hierarchy through better contrast ratios
- The unified header pattern creates consistency across data-heavy pages while maintaining functionality
- All changes maintain backward compatibility with existing data structures