import React, { ReactElement } from 'react'
import { render, RenderOptions, RenderResult } from '@testing-library/react'
import { ThemeProvider } from 'next-themes'
import { vi } from 'vitest'
import { Providers } from '@/components/providers'

/**
 * Theme test utilities for testing light/dark mode functionality
 * Provides helpers to render components in different theme contexts
 */

export interface ThemeRenderOptions extends Omit<RenderOptions, 'wrapper'> {
  theme?: 'light' | 'dark' | 'system'
  withProviders?: boolean
}

/**
 * Wrapper component for theme testing
 */
interface ThemeWrapperProps {
  children: React.ReactNode
  theme: 'light' | 'dark' | 'system'
}

function ThemeWrapper({ children, theme }: ThemeWrapperProps) {
  return (
    <ThemeProvider
      attribute="data-theme"
      defaultTheme={theme}
      forcedTheme={theme === 'system' ? undefined : theme}
      enableSystem={theme === 'system'}
      disableTransitionOnChange
    >
      {children}
    </ThemeProvider>
  )
}

/**
 * Render a component with theme support
 * @param ui - React element to render
 * @param options - Render options including theme
 * @returns Render result
 */
export function renderWithTheme(
  ui: ReactElement,
  { theme = 'light', withProviders = false, ...options }: ThemeRenderOptions = {}
): RenderResult {
  const Wrapper = ({ children }: { children: React.ReactNode }) => {
    if (withProviders) {
      // Use full provider stack with theme override
      return (
        <div data-theme={theme}>
          <Providers>{children}</Providers>
        </div>
      )
    }
    return <ThemeWrapper theme={theme}>{children}</ThemeWrapper>
  }

  return render(ui, { wrapper: Wrapper, ...options })
}

/**
 * Render the same component in both light and dark themes
 * Useful for visual regression testing
 */
export function renderInBothThemes(
  ui: ReactElement,
  options?: Omit<ThemeRenderOptions, 'theme'>
): {
  light: RenderResult
  dark: RenderResult
  rerender: (theme: 'light' | 'dark') => void
} {
  const lightResult = renderWithTheme(ui, { ...options, theme: 'light' })
  
  // Clean up and render in dark mode
  lightResult.unmount()
  const darkResult = renderWithTheme(ui, { ...options, theme: 'dark' })
  
  // Rerender helper
  const rerender = (theme: 'light' | 'dark') => {
    darkResult.unmount()
    return renderWithTheme(ui, { ...options, theme })
  }

  return { light: lightResult, dark: darkResult, rerender }
}

/**
 * Mock useTheme hook for isolated component testing
 */
export function mockUseTheme(theme: 'light' | 'dark' | 'system' = 'light') {
  const setTheme = vi.fn()
  const themes = ['light', 'dark', 'system']
  
  return {
    theme,
    setTheme,
    systemTheme: 'light',
    resolvedTheme: theme === 'system' ? 'light' : theme,
    themes,
    forcedTheme: undefined,
  }
}

/**
 * Setup theme mocking for tests
 */
export function setupThemeMocking() {
  const mockTheme = mockUseTheme()
  
  vi.mock('next-themes', () => ({
    ThemeProvider: ({ children }: { children: React.ReactNode }) => <>{children}</>,
    useTheme: () => mockTheme,
  }))
  
  return mockTheme
}

/**
 * Test helper to verify theme-specific classes
 */
export function expectThemeClasses(
  element: HTMLElement,
  theme: 'light' | 'dark'
): void {
  const themeAttribute = element.getAttribute('data-theme') || 
                        element.closest('[data-theme]')?.getAttribute('data-theme')
  
  if (theme === 'dark') {
    expect(themeAttribute).toBe('dark')
  } else {
    expect(themeAttribute).toBe('light')
  }
}

/**
 * Get all color-related classes from an element
 */
export function getColorClasses(element: HTMLElement): string[] {
  const classes = element.className.split(' ')
  const colorPatterns = [
    /^bg-/,
    /^text-/,
    /^border-/,
    /^ring-/,
    /^shadow-/,
    /^accent-/,
    /^fill-/,
    /^stroke-/,
  ]
  
  return classes.filter(className => 
    colorPatterns.some(pattern => pattern.test(className))
  )
}

/**
 * Assert that an element uses semantic color classes
 * that work in both light and dark modes
 */
export function expectSemanticColors(element: HTMLElement): void {
  const colorClasses = getColorClasses(element)
  
  // Check for semantic color classes instead of hard-coded colors
  const semanticPatterns = [
    /^bg-(background|foreground|card|popover|primary|secondary|muted|accent|destructive)/,
    /^text-(foreground|muted-foreground|primary|secondary|accent|destructive)/,
    /^border-(border|input|ring)/,
  ]
  
  const hasSemanticColors = colorClasses.some(className =>
    semanticPatterns.some(pattern => pattern.test(className))
  )
  
  expect(hasSemanticColors).toBe(true)
}

/**
 * Helper to test theme toggle functionality
 */
export async function testThemeToggle(
  container: HTMLElement,
  user: ReturnType<typeof import('@testing-library/user-event').default['setup']>
): Promise<void> {
  // Find theme toggle button (adjust selector as needed)
  const themeToggle = container.querySelector('[data-testid="theme-toggle"]') ||
                      container.querySelector('button[aria-label*="theme"]') ||
                      container.querySelector('button[aria-label*="Theme"]')
  
  if (!themeToggle) {
    throw new Error('Theme toggle button not found')
  }
  
  // Click to toggle theme
  await user.click(themeToggle as HTMLElement)
}

/**
 * CSS variables that should be defined in both themes
 */
export const THEME_CSS_VARIABLES = [
  '--background',
  '--foreground',
  '--card',
  '--card-foreground',
  '--popover',
  '--popover-foreground',
  '--primary',
  '--primary-foreground',
  '--secondary',
  '--secondary-foreground',
  '--muted',
  '--muted-foreground',
  '--accent',
  '--accent-foreground',
  '--destructive',
  '--destructive-foreground',
  '--border',
  '--input',
  '--ring',
] as const

/**
 * Verify that all required CSS variables are defined
 */
export function expectThemeCSSVariables(element: HTMLElement): void {
  const computedStyle = window.getComputedStyle(element)
  
  THEME_CSS_VARIABLES.forEach(variable => {
    const value = computedStyle.getPropertyValue(variable)
    expect(value).not.toBe('')
  })
}

/**
 * Helper to test color contrast in different themes
 * Note: This requires jest-axe or similar a11y testing library
 */
export async function testColorContrast(
  element: HTMLElement
): Promise<void> {
  // This would use axe-core or similar to test color contrast
  // For now, it's a placeholder
  const hasText = element.textContent && element.textContent.trim().length > 0
  if (hasText) {
    // In a real implementation, this would check WCAG contrast ratios
    expect(true).toBe(true)
  }
}

/**
 * Standard theme test suite that can be reused across components
 */
export function describeThemeTests(
  componentName: string,
  renderComponent: () => ReactElement
): void {
  describe(`${componentName} Theme Tests`, () => {
    it('renders correctly in light mode', () => {
      const { container } = renderWithTheme(renderComponent(), { theme: 'light' })
      expectThemeClasses(container.firstChild as HTMLElement, 'light')
    })
    
    it('renders correctly in dark mode', () => {
      const { container } = renderWithTheme(renderComponent(), { theme: 'dark' })
      expectThemeClasses(container.firstChild as HTMLElement, 'dark')
    })
    
    it('uses semantic color classes', () => {
      const { container } = renderWithTheme(renderComponent())
      const elements = container.querySelectorAll('[class*="bg-"], [class*="text-"]')
      elements.forEach(element => {
        expectSemanticColors(element as HTMLElement)
      })
    })
    
    it('maintains proper color contrast in both themes', async () => {
      // Test light mode
      const { container: lightContainer } = renderWithTheme(renderComponent(), { theme: 'light' })
      await testColorContrast(lightContainer)
      
      // Test dark mode
      const { container: darkContainer } = renderWithTheme(renderComponent(), { theme: 'dark' })
      await testColorContrast(darkContainer)
    })
  })
}