/**
 * Standard theme test template for UI components
 * 
 * Usage:
 * 1. Copy the describeThemeTests function call into your component test file
 * 2. Import renderWithTheme from '@/test/theme-test-utils'
 * 3. Add the theme tests describe block to your test suite
 */

import { renderWithTheme } from '@/test/theme-test-utils'

// Example usage in a component test file:
/*
describe('ComponentName Theme Tests', () => {
  it('renders correctly in light mode', () => {
    renderWithTheme(<ComponentName>Content</ComponentName>, { theme: 'light' })
    const element = screen.getByTestId('component-testid') // or getByRole
    expect(element).toBeInTheDocument()
    // Add specific light mode assertions if needed
  })

  it('renders correctly in dark mode', () => {
    renderWithTheme(<ComponentName>Content</ComponentName>, { theme: 'dark' })
    const element = screen.getByTestId('component-testid') // or getByRole
    expect(element).toBeInTheDocument()
    // Add specific dark mode assertions if needed
  })

  it('maintains semantic colors for all variants/states', () => {
    // Test different variants or states if applicable
    const variants = ['default', 'variant1', 'variant2'] // adjust based on component
    
    variants.forEach(variant => {
      ['light', 'dark'].forEach(theme => {
        const { unmount } = renderWithTheme(
          <ComponentName variant={variant}>Content</ComponentName>,
          { theme: theme as 'light' | 'dark' }
        )
        
        const element = screen.getByTestId('component-testid')
        const classList = element.className
        
        // Check for semantic color classes
        expect(classList).toMatch(/bg-\w+|text-\w+|border-\w+/)
        
        // Ensure no hard-coded colors
        expect(classList).not.toMatch(/bg-(gray|slate|zinc|neutral|stone|red|orange|amber|yellow|lime|green|emerald|teal|cyan|sky|blue|indigo|violet|purple|fuchsia|pink|rose)-\d+/)
        
        unmount()
      })
    })
  })
})
*/

// Minimal theme test for simple components
export const minimalThemeTest = `
describe('Theme Tests', () => {
  it('renders correctly in light mode', () => {
    renderWithTheme(<ComponentName />, { theme: 'light' })
    expect(screen.getByRole('role-name')).toBeInTheDocument()
  })

  it('renders correctly in dark mode', () => {
    renderWithTheme(<ComponentName />, { theme: 'dark' })
    expect(screen.getByRole('role-name')).toBeInTheDocument()
  })
})
`

// Standard theme test for components with variants
export const standardThemeTest = `
describe('Theme Tests', () => {
  it('renders correctly in light mode', () => {
    renderWithTheme(<ComponentName>Content</ComponentName>, { theme: 'light' })
    const element = screen.getByRole('role-name')
    expect(element).toBeInTheDocument()
  })

  it('renders correctly in dark mode', () => {
    renderWithTheme(<ComponentName>Content</ComponentName>, { theme: 'dark' })
    const element = screen.getByRole('role-name')
    expect(element).toBeInTheDocument()
  })

  it('maintains semantic colors across variants', () => {
    const variants = ['default', 'variant1', 'variant2'] as const
    
    variants.forEach(variant => {
      const { unmount } = renderWithTheme(
        <ComponentName variant={variant}>Content</ComponentName>,
        { theme: 'dark' }
      )
      const element = screen.getByRole('role-name')
      expectSemanticColors(element)
      unmount()
    })
  })
})
`