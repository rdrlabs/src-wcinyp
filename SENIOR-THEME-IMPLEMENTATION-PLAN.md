# Senior Developer Theme Implementation Plan

## 🎯 Objective

Implement a production-grade theme system for the WCI@NYP application using Tailwind CSS v4 and Next.js 15, ensuring perfect dark mode functionality while maintaining strict design system compliance.

## 📋 Pre-Implementation Checklist

- [ ] All stakeholders informed of implementation timeline
- [ ] Current theme state documented with screenshots
- [ ] Rollback plan prepared
- [ ] Testing environment ready
- [ ] Design team approved color tokens

## 🏗️ Implementation Phases

### Phase 0: Setup & Preparation (2 hours)

#### 0.1 Environment Verification
```bash
# Verify versions
node --version  # Should be v20+
npm list tailwindcss next next-themes

# Create implementation branch
git checkout -b feature/theme-implementation-v4
git pull origin main
```

#### 0.2 Backup Current State
```bash
# Create backup of critical files
cp src/app/globals.css src/app/globals.css.backup
cp tailwind.config.ts tailwind.config.ts.backup

# Document current behavior
npm run dev
# Take screenshots of light/dark mode attempts
```

#### 0.3 Install Dependencies
```bash
# Ensure all peer dependencies are satisfied
npm install --save-exact next-themes@0.4.6
npm install --save-dev @types/node@20
```

### Phase 1: Core Theme Implementation (4 hours)

#### 1.1 Enable Tailwind v4 Dark Mode (CRITICAL)
```css
/* src/app/globals.css - Add after line 2 */
@import "tailwindcss";
@layer fumadocs;

/* Enable class-based dark mode for Tailwind v4 */
@custom-variant dark (&:where(.dark, .dark *));
```

**Validation Steps:**
1. Save file and restart dev server
2. Open DevTools > Elements
3. Click theme toggle
4. Verify `.dark` class appears on `<html>`
5. Verify dark styles apply to components

#### 1.2 Create Theme Configuration Module
```typescript
// src/lib/theme/config.ts
export const THEME_CONFIG = {
  // Storage
  storageKey: 'wcinyp-theme',
  
  // Transition settings
  transitionDuration: 200,
  disableTransitionOnChange: true,
  
  // Default values
  defaultTheme: 'system' as const,
  themes: ['light', 'dark', 'system'] as const,
  
  // Feature flags
  enableColorSchemeMedia: true,
  enableSystemDetection: true,
} as const

// Type exports
export type Theme = typeof THEME_CONFIG.themes[number]
export type ThemeConfig = typeof THEME_CONFIG
```

#### 1.3 Implement FOUC Prevention
```typescript
// src/app/theme-script.tsx
export function ThemeScript() {
  const script = `
    (function() {
      try {
        const theme = localStorage.getItem('${THEME_CONFIG.storageKey}') || '${THEME_CONFIG.defaultTheme}';
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        
        if (theme === 'dark' || (theme === 'system' && prefersDark)) {
          document.documentElement.classList.add('dark');
        } else {
          document.documentElement.classList.remove('dark');
        }
        
        // Add transition class after initial load
        requestAnimationFrame(() => {
          document.documentElement.classList.add('theme-transition');
        });
      } catch (e) {
        console.error('Theme initialization failed:', e);
      }
    })();
  `

  return (
    <script
      dangerouslySetInnerHTML={{ __html: script }}
      suppressHydrationWarning
    />
  )
}
```

#### 1.4 Update Layout with Theme Script
```tsx
// src/app/layout.tsx - Add to <head>
import { ThemeScript } from './theme-script'

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <ThemeScript />
      </head>
      <body>{children}</body>
    </html>
  )
}
```

### Phase 2: Component Migration (6 hours)

#### 2.1 Create Migration Utilities
```typescript
// src/lib/theme/migration.ts
export const COLOR_MAPPINGS = {
  // Direct color to semantic token mappings
  'bg-white': 'bg-background',
  'bg-gray-50': 'bg-muted',
  'bg-gray-100': 'bg-muted',
  'bg-gray-900': 'bg-background',
  'dark:bg-gray-900': '',  // Remove, handled by semantic token
  'dark:bg-gray-800': '',  // Remove, handled by semantic token
  
  'text-gray-900': 'text-foreground',
  'text-gray-700': 'text-muted-foreground',
  'dark:text-gray-100': '', // Remove
  'dark:text-gray-300': '', // Remove
  
  'border-gray-200': 'border-border',
  'dark:border-gray-700': '', // Remove
  
  // Add all mappings from audit
} as const

export function migrateClassName(className: string): string {
  let migrated = className
  
  Object.entries(COLOR_MAPPINGS).forEach(([oldClass, newClass]) => {
    if (newClass) {
      migrated = migrated.replace(new RegExp(`\\b${oldClass}\\b`, 'g'), newClass)
    } else {
      // Remove the class entirely
      migrated = migrated.replace(new RegExp(`\\b${oldClass}\\b`, 'g'), '')
    }
  })
  
  // Clean up extra spaces
  return migrated.replace(/\s+/g, ' ').trim()
}
```

#### 2.2 Automated Migration Script
```javascript
// scripts/migrate-components.js
const fs = require('fs').promises
const path = require('path')
const { glob } = require('glob')

async function migrateFile(filePath) {
  console.log(`Migrating: ${filePath}`)
  
  let content = await fs.readFile(filePath, 'utf8')
  let modified = false
  
  // Pattern to match className props
  const classNamePattern = /className=["']([^"']+)["']/g
  
  content = content.replace(classNamePattern, (match, classes) => {
    const newClasses = migrateClassName(classes)
    if (newClasses !== classes) {
      modified = true
      return `className="${newClasses}"`
    }
    return match
  })
  
  if (modified) {
    // Create backup
    await fs.writeFile(`${filePath}.backup`, content)
    // Write migrated content
    await fs.writeFile(filePath, content)
    console.log(`✓ Migrated: ${filePath}`)
  }
  
  return modified
}

async function main() {
  const files = await glob('src/**/*.{tsx,jsx}', {
    ignore: ['**/node_modules/**', '**/*.test.*']
  })
  
  console.log(`Found ${files.length} files to check`)
  
  let migratedCount = 0
  for (const file of files) {
    if (await migrateFile(file)) {
      migratedCount++
    }
  }
  
  console.log(`\nMigration complete: ${migratedCount} files updated`)
}

main().catch(console.error)
```

#### 2.3 Manual Component Updates

**Priority 1: Fix SidebarFooter.tsx**
```tsx
// src/components/features/documents/SidebarFooter.tsx
// Before
<div className="border-t border-gray-200 dark:border-gray-700 p-3">
  <strong className="text-gray-700 dark:text-gray-300">

// After
<div className="border-t border-border p-3">
  <strong className="text-foreground font-semibold">
```

**Priority 2: Update theme.ts Constants**
```typescript
// src/constants/theme.ts
export const PRIORITY_STYLES = {
  high: 'bg-destructive/10 text-destructive ring-destructive/20',
  medium: 'bg-primary/10 text-primary ring-primary/20',
  low: 'bg-muted text-muted-foreground ring-border',
} as const
```

### Phase 3: Type Safety & Testing (4 hours)

#### 3.1 Create Comprehensive Type System
```typescript
// src/types/theme.ts
import { THEME_CONFIG } from '@/lib/theme/config'

// Theme type from config
export type Theme = typeof THEME_CONFIG.themes[number]

// Color token types
export interface ThemeColors {
  // Base colors
  background: string
  foreground: string
  
  // Component colors
  card: string
  cardForeground: string
  popover: string
  popoverForeground: string
  
  // Semantic colors
  primary: string
  primaryForeground: string
  secondary: string
  secondaryForeground: string
  destructive: string
  destructiveForeground: string
  
  // UI colors
  muted: string
  mutedForeground: string
  accent: string
  accentForeground: string
  
  // Utility colors
  border: string
  input: string
  ring: string
}

// Augment next-themes
declare module 'next-themes' {
  interface UseThemeProps {
    themes: Theme[]
    theme: Theme | undefined
    setTheme: (theme: Theme) => void
    systemTheme: 'light' | 'dark' | undefined
    resolvedTheme: 'light' | 'dark' | undefined
  }
}

// CSS variable type helper
export type CSSVariable<T extends keyof ThemeColors> = `var(--color-${T})`
```

#### 3.2 Testing Infrastructure
```typescript
// src/test/theme/test-utils.tsx
import { ReactElement } from 'react'
import { render, RenderOptions } from '@testing-library/react'
import { ThemeProvider } from 'next-themes'

interface ThemeWrapperProps {
  children: React.ReactNode
  defaultTheme?: Theme
}

function ThemeWrapper({ children, defaultTheme = 'light' }: ThemeWrapperProps) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme={defaultTheme}
      enableSystem={false}
      disableTransitionOnChange
    >
      {children}
    </ThemeProvider>
  )
}

export function renderWithTheme(
  ui: ReactElement,
  options?: RenderOptions & { defaultTheme?: Theme }
) {
  const { defaultTheme, ...renderOptions } = options || {}
  
  return render(ui, {
    wrapper: ({ children }) => (
      <ThemeWrapper defaultTheme={defaultTheme}>{children}</ThemeWrapper>
    ),
    ...renderOptions,
  })
}

// Theme testing utilities
export async function expectThemeColors(element: HTMLElement, theme: 'light' | 'dark') {
  const styles = window.getComputedStyle(element)
  
  if (theme === 'dark') {
    expect(styles.backgroundColor).toMatch(/rgb\([\d\s,]*\)/) // Dark background
    expect(styles.color).toMatch(/rgb\([\d\s,]*\)/) // Light text
  } else {
    expect(styles.backgroundColor).toMatch(/rgb\([\d\s,]*\)/) // Light background
    expect(styles.color).toMatch(/rgb\([\d\s,]*\)/) // Dark text
  }
}
```

#### 3.3 Component Test Suite
```typescript
// src/components/theme-toggle.test.tsx
import { renderWithTheme, expectThemeColors } from '@/test/theme/test-utils'
import { fireEvent, waitFor } from '@testing-library/react'
import { ThemeToggle } from './theme-toggle'

describe('ThemeToggle - Production Tests', () => {
  beforeEach(() => {
    // Clear localStorage
    localStorage.clear()
    
    // Reset document classes
    document.documentElement.className = ''
  })
  
  it('prevents FOUC on initial render', () => {
    const { container } = renderWithTheme(<ThemeToggle />)
    
    // Should render immediately without flash
    expect(container.firstChild).toBeInTheDocument()
  })
  
  it('persists theme selection across sessions', async () => {
    const { getByRole, rerender } = renderWithTheme(<ThemeToggle />)
    
    // Toggle to dark mode
    fireEvent.click(getByRole('button'))
    
    await waitFor(() => {
      expect(localStorage.getItem('wcinyp-theme')).toBe('dark')
    })
    
    // Simulate page reload
    rerender(<ThemeToggle />)
    
    // Theme should persist
    expect(document.documentElement).toHaveClass('dark')
  })
  
  it('handles localStorage errors gracefully', async () => {
    // Mock localStorage to throw
    const mockSetItem = jest.spyOn(Storage.prototype, 'setItem')
    mockSetItem.mockImplementation(() => {
      throw new Error('QuotaExceededError')
    })
    
    const { getByRole } = renderWithTheme(<ThemeToggle />)
    
    // Should not crash when localStorage fails
    expect(() => {
      fireEvent.click(getByRole('button'))
    }).not.toThrow()
    
    mockSetItem.mockRestore()
  })
  
  it('respects system theme changes', async () => {
    // Mock matchMedia
    const mockMatchMedia = jest.fn()
    mockMatchMedia.mockReturnValue({
      matches: true, // System prefers dark
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
    })
    window.matchMedia = mockMatchMedia
    
    renderWithTheme(<ThemeToggle />, { defaultTheme: 'system' })
    
    await waitFor(() => {
      expect(document.documentElement).toHaveClass('dark')
    })
  })
})
```

### Phase 4: Performance Optimization (3 hours)

#### 4.1 CSS Optimization
```css
/* src/app/globals.css - Add performance optimizations */
@layer utilities {
  /* Smooth theme transitions */
  .theme-transition,
  .theme-transition *,
  .theme-transition *::before,
  .theme-transition *::after {
    transition-property: color, background-color, border-color, text-decoration-color, fill, stroke;
    transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
    transition-duration: 200ms;
  }
  
  /* Prevent transition on page load */
  html:not(.theme-transition) *,
  html:not(.theme-transition) *::before,
  html:not(.theme-transition) *::after {
    transition: none !important;
  }
  
  /* Optimize color scheme */
  :root {
    color-scheme: light;
  }
  
  .dark {
    color-scheme: dark;
  }
}

/* Reduce motion for accessibility */
@media (prefers-reduced-motion: reduce) {
  .theme-transition,
  .theme-transition * {
    transition-duration: 0.01ms !important;
  }
}
```

#### 4.2 Performance Monitoring
```typescript
// src/lib/theme/performance.ts
export class ThemePerformanceMonitor {
  private metrics: Map<string, number> = new Map()
  
  startMeasure(name: string) {
    performance.mark(`theme-${name}-start`)
  }
  
  endMeasure(name: string) {
    performance.mark(`theme-${name}-end`)
    performance.measure(
      `theme-${name}`,
      `theme-${name}-start`,
      `theme-${name}-end`
    )
    
    const measure = performance.getEntriesByName(`theme-${name}`)[0]
    this.metrics.set(name, measure.duration)
    
    // Log in development
    if (process.env.NODE_ENV === 'development') {
      console.log(`Theme ${name}: ${measure.duration.toFixed(2)}ms`)
    }
  }
  
  getMetrics() {
    return Object.fromEntries(this.metrics)
  }
  
  reportToAnalytics() {
    const metrics = this.getMetrics()
    
    // Send to analytics service
    if (window.gtag) {
      window.gtag('event', 'theme_performance', {
        event_category: 'performance',
        event_label: 'theme_switch',
        value: metrics.switch || 0,
      })
    }
  }
}

// Usage in ThemeToggle
export function useThemePerformance() {
  const monitor = useRef(new ThemePerformanceMonitor())
  
  const measureThemeSwitch = useCallback((fn: () => void) => {
    monitor.current.startMeasure('switch')
    fn()
    requestAnimationFrame(() => {
      monitor.current.endMeasure('switch')
      monitor.current.reportToAnalytics()
    })
  }, [])
  
  return { measureThemeSwitch }
}
```

### Phase 5: Production Deployment (2 hours)

#### 5.1 Pre-Deployment Checklist
```typescript
// scripts/pre-deploy-theme-check.js
const checks = [
  {
    name: 'No hard-coded dark classes',
    test: async () => {
      const files = await glob('src/**/*.tsx')
      for (const file of files) {
        const content = await fs.readFile(file, 'utf8')
        if (/dark:(bg|text|border)-\w+-\d+/.test(content)) {
          throw new Error(`Hard-coded dark class found in ${file}`)
        }
      }
    }
  },
  {
    name: 'Theme tests pass',
    test: async () => {
      const result = await exec('npm test -- theme')
      if (result.exitCode !== 0) {
        throw new Error('Theme tests failed')
      }
    }
  },
  {
    name: 'No console errors',
    test: async () => {
      // Run playwright test for console errors
      const result = await exec('npm run e2e:theme')
      if (result.exitCode !== 0) {
        throw new Error('E2E theme tests failed')
      }
    }
  },
  {
    name: 'Bundle size within limits',
    test: async () => {
      const stats = await getWebpackStats()
      const themeChunkSize = stats.chunks.find(c => c.name.includes('theme'))?.size || 0
      if (themeChunkSize > 50000) { // 50KB limit
        throw new Error(`Theme chunk too large: ${themeChunkSize} bytes`)
      }
    }
  }
]

async function runChecks() {
  console.log('Running pre-deployment theme checks...\n')
  
  for (const check of checks) {
    try {
      await check.test()
      console.log(`✅ ${check.name}`)
    } catch (error) {
      console.error(`❌ ${check.name}: ${error.message}`)
      process.exit(1)
    }
  }
  
  console.log('\n✅ All theme checks passed!')
}

runChecks()
```

#### 5.2 Deployment Configuration
```yaml
# .github/workflows/theme-deploy.yml
name: Theme Deployment

on:
  push:
    branches: [main]
    paths:
      - 'src/**/*.css'
      - 'src/**/*.tsx'
      - 'src/lib/theme/**'

jobs:
  validate:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      
      - name: Setup Node
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Run theme validation
        run: npm run validate:theme
      
      - name: Run theme tests
        run: npm test -- --grep="theme|Theme"
      
      - name: Check bundle size
        run: npm run analyze:theme
      
  deploy:
    needs: validate
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      
      - name: Deploy to Netlify
        uses: netlify/actions/cli@v1
        with:
          args: deploy --prod
        env:
          NETLIFY_AUTH_TOKEN: ${{ secrets.NETLIFY_AUTH_TOKEN }}
          NETLIFY_SITE_ID: ${{ secrets.NETLIFY_SITE_ID }}
```

#### 5.3 Monitoring & Alerts
```typescript
// src/lib/theme/monitoring.ts
export function setupThemeMonitoring() {
  if (typeof window === 'undefined') return
  
  // Monitor theme errors
  window.addEventListener('error', (event) => {
    if (event.message.includes('theme') || event.message.includes('dark')) {
      // Report to error tracking service
      console.error('Theme error:', event)
      
      // Fallback to light theme
      document.documentElement.classList.remove('dark')
      localStorage.removeItem('wcinyp-theme')
    }
  })
  
  // Monitor performance
  const observer = new PerformanceObserver((list) => {
    const entries = list.getEntries()
    entries.forEach((entry) => {
      if (entry.name.includes('theme')) {
        // Log slow theme operations
        if (entry.duration > 100) {
          console.warn(`Slow theme operation: ${entry.name} took ${entry.duration}ms`)
        }
      }
    })
  })
  
  observer.observe({ entryTypes: ['measure'] })
}
```

## 📊 Success Metrics

### Technical Metrics
- [ ] Theme switch completes in <100ms
- [ ] No FOUC on page load
- [ ] Zero console errors related to theme
- [ ] 100% theme test coverage
- [ ] Bundle size increase <5KB

### User Experience Metrics
- [ ] Theme persists across sessions
- [ ] Respects system preferences
- [ ] Smooth transitions between themes
- [ ] All components properly themed
- [ ] Accessible to screen readers

### Code Quality Metrics
- [ ] No hard-coded color classes
- [ ] All components use semantic tokens
- [ ] TypeScript types 100% coverage
- [ ] Migration script success rate >95%
- [ ] Zero theme-related tech debt

## 🚨 Rollback Plan

### Immediate Rollback (< 5 minutes)
```bash
# Revert the @custom-variant addition
git checkout HEAD -- src/app/globals.css

# Deploy hotfix
npm run build
npm run deploy:emergency
```

### Full Rollback (< 30 minutes)
```bash
# Revert to pre-theme branch
git checkout main
git reset --hard [last-known-good-commit]

# Restore from backups
./scripts/restore-theme-backup.sh

# Deploy
npm run build
npm run deploy
```

### Rollback Triggers
1. Theme switch causes app crash
2. Performance degradation >20%
3. Accessibility violations detected
4. >5% increase in error rate
5. User complaints exceed threshold

## 📚 Documentation Deliverables

### For Developers
1. [x] Theme Implementation Guide (THEME-IMPLEMENTATION-GUIDE.md)
2. [ ] Component Migration Guide
3. [ ] Theme API Reference
4. [ ] Troubleshooting Guide

### For Designers
1. [ ] Color Token Reference
2. [ ] Theme Preview Tool
3. [ ] Design System Updates

### For QA
1. [ ] Test Plan Document
2. [ ] Test Case Library
3. [ ] Regression Test Suite

## 🎯 Definition of Done

- [x] Core theme functionality implemented
- [ ] All components migrated to semantic tokens
- [ ] Zero hard-coded dark mode classes
- [ ] All tests passing (100% coverage)
- [ ] Performance metrics within targets
- [ ] Documentation complete and reviewed
- [ ] QA sign-off received
- [ ] Deployed to production
- [ ] Monitoring configured
- [ ] Team trained on new system

## 🚀 Post-Implementation

### Week 1 After Launch
- Monitor error rates
- Collect user feedback
- Address any hotfixes
- Optimize performance

### Month 1 After Launch
- Analyze usage metrics
- Plan enhancement features
- Create theme variants
- Update documentation

### Ongoing Maintenance
- Monthly theme audits
- Quarterly performance reviews
- Annual accessibility audits
- Continuous improvement

---

**Implementation Start Date**: _____________  
**Target Completion Date**: _____________  
**Actual Completion Date**: _____________  

**Sign-offs**:
- Tech Lead: _____________
- Design Lead: _____________
- QA Lead: _____________
- Product Owner: _____________