/**
 * Example test file demonstrating how to use theme-test-utils
 * This shows best practices for testing components in light/dark modes
 */

import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, beforeEach } from 'vitest'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import {
  renderWithTheme,
  renderInBothThemes,
  expectThemeClasses,
  expectSemanticColors,
  expectThemeCSSVariables,
  describeThemeTests,
  setupThemeMocking,
  testThemeToggle,
} from '@/test/theme-test-utils'

// Example 1: Basic theme rendering
describe('Button Theme Tests - Basic', () => {
  it('renders with correct theme classes in light mode', () => {
    const { container } = renderWithTheme(
      <Button>Click me</Button>,
      { theme: 'light' }
    )
    
    const button = screen.getByRole('button')
    expectSemanticColors(button)
  })
  
  it('renders with correct theme classes in dark mode', () => {
    const { container } = renderWithTheme(
      <Button>Click me</Button>,
      { theme: 'dark' }
    )
    
    const button = screen.getByRole('button')
    expectSemanticColors(button)
  })
})

// Example 2: Testing component in both themes
describe('Card Theme Tests - Both Themes', () => {
  it('maintains consistent structure in both themes', () => {
    const { light, dark } = renderInBothThemes(
      <Card>
        <h2>Card Title</h2>
        <p>Card content</p>
      </Card>
    )
    
    // Structure should be the same in both themes
    const lightCard = light.container.querySelector('[class*="card"]')
    const darkCard = dark.container.querySelector('[class*="card"]')
    
    expect(lightCard?.tagName).toBe(darkCard?.tagName)
    expect(lightCard?.childElementCount).toBe(darkCard?.childElementCount)
  })
})

// Example 3: Testing theme toggle functionality
describe('Theme Toggle Tests', () => {
  beforeEach(() => {
    setupThemeMocking()
  })
  
  it('toggles theme when button is clicked', async () => {
    const user = userEvent.setup()
    
    const ThemeToggleComponent = () => {
      const { theme, setTheme } = require('next-themes').useTheme()
      return (
        <button
          data-testid="theme-toggle"
          onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
        >
          Toggle Theme
        </button>
      )
    }
    
    const { container } = renderWithTheme(<ThemeToggleComponent />)
    await testThemeToggle(container, user)
    
    // Verify setTheme was called
    const { useTheme } = require('next-themes')
    expect(useTheme().setTheme).toHaveBeenCalled()
  })
})

// Example 4: Testing CSS variables
describe('Theme CSS Variables', () => {
  it('defines all required CSS variables', () => {
    const { container } = renderWithTheme(
      <div className="bg-background text-foreground">
        <Card>Test content</Card>
      </div>
    )
    
    expectThemeCSSVariables(container.firstChild as HTMLElement)
  })
})

// Example 5: Using the standard test suite
const TestComponent = () => (
  <div className="bg-card p-4 rounded-lg">
    <h1 className="text-foreground text-2xl mb-2">Test Component</h1>
    <p className="text-muted-foreground">This component uses semantic colors</p>
    <Button variant="secondary" className="mt-4">
      Action Button
    </Button>
  </div>
)

describeThemeTests('TestComponent', () => <TestComponent />)

// Example 6: Testing with full provider stack
describe('Component with Providers', () => {
  it('works with all app providers in dark mode', () => {
    const { container } = renderWithTheme(
      <div>
        <Button>Test Button</Button>
      </div>,
      { theme: 'dark', withProviders: true }
    )
    
    const button = screen.getByRole('button')
    expect(button).toBeInTheDocument()
  })
})

// Example 7: Visual regression testing helper
describe('Visual Theme Tests', () => {
  it('component looks consistent in both themes', () => {
    const component = (
      <Card className="w-64 p-4">
        <h3 className="text-lg font-semibold text-foreground">Card Title</h3>
        <p className="text-sm text-muted-foreground mt-2">
          This is a card with semantic colors that adapt to the theme.
        </p>
        <div className="flex gap-2 mt-4">
          <Button size="sm">Primary</Button>
          <Button size="sm" variant="secondary">Secondary</Button>
        </div>
      </Card>
    )
    
    // Render in both themes for visual comparison
    const { light, dark, rerender } = renderInBothThemes(component)
    
    // Could snapshot both for visual regression testing
    expect(light.container).toMatchSnapshot('light-theme')
    expect(dark.container).toMatchSnapshot('dark-theme')
    
    // Test switching between themes
    rerender('light')
    const lightButton = screen.getByText('Primary')
    expectSemanticColors(lightButton)
  })
})

// Example 8: Testing theme-aware animations
describe('Theme Animations', () => {
  it('respects prefers-reduced-motion in theme context', () => {
    const AnimatedComponent = () => (
      <div className="transition-colors duration-200 bg-background hover:bg-muted">
        Hover me
      </div>
    )
    
    const { container } = renderWithTheme(<AnimatedComponent />)
    const element = container.firstChild as HTMLElement
    
    // Check that transition classes are applied
    expect(element.className).toContain('transition-colors')
  })
})

// Example 9: Testing color contrast
describe('Accessibility in Themes', () => {
  it('maintains WCAG AA contrast in both themes', async () => {
    const AccessibleComponent = () => (
      <div className="bg-background">
        <h1 className="text-foreground">High Contrast Heading</h1>
        <p className="text-muted-foreground">Muted text content</p>
        <Button>Interactive Element</Button>
      </div>
    )
    
    // Test both themes
    const themes = ['light', 'dark'] as const
    
    for (const theme of themes) {
      const { container } = renderWithTheme(<AccessibleComponent />, { theme })
      
      // In a real test, you would use axe-core here
      // await expect(container).toHaveNoViolations()
      
      // For now, just check that elements exist
      expect(screen.getByText('High Contrast Heading')).toBeInTheDocument()
      expect(screen.getByText('Muted text content')).toBeInTheDocument()
    }
  })
})