# Theme Testing Guide

This guide explains how to test components with light/dark theme support using the theme test utilities.

## Quick Start

```typescript
import { renderWithTheme, expectSemanticColors } from '@/test/theme-test-utils'
import { Button } from '@/components/ui/button'

describe('Button Theme Tests', () => {
  it('renders correctly in dark mode', () => {
    const { container } = renderWithTheme(
      <Button>Click me</Button>,
      { theme: 'dark' }
    )
    
    const button = screen.getByRole('button')
    expectSemanticColors(button)
  })
})
```

## Available Utilities

### `renderWithTheme()`

Renders a component with theme support.

```typescript
const { container } = renderWithTheme(
  <YourComponent />,
  { 
    theme: 'light', // 'light' | 'dark' | 'system'
    withProviders: false // Include all app providers
  }
)
```

### `renderInBothThemes()`

Renders the same component in both light and dark themes for comparison.

```typescript
const { light, dark, rerender } = renderInBothThemes(<Card />)

// Test both renders
expect(light.container).toMatchSnapshot('light')
expect(dark.container).toMatchSnapshot('dark')

// Switch themes
rerender('light')
```

### `expectSemanticColors()`

Verifies that an element uses semantic color classes (like `bg-card`, `text-foreground`) instead of hard-coded colors.

```typescript
const element = screen.getByRole('button')
expectSemanticColors(element) // Passes if semantic colors are used
```

### `expectThemeClasses()`

Verifies that the correct theme is applied to an element.

```typescript
expectThemeClasses(container.firstChild, 'dark')
```

### `expectThemeCSSVariables()`

Ensures all required CSS variables are defined.

```typescript
expectThemeCSSVariables(container.firstChild as HTMLElement)
```

### `describeThemeTests()`

Generates a standard test suite for theme testing.

```typescript
describeThemeTests('MyComponent', () => <MyComponent />)
// Automatically tests light/dark rendering, semantic colors, and contrast
```

## Best Practices

### 1. Always Use Semantic Colors

```typescript
// ❌ Bad - Hard-coded colors
<div className="bg-gray-100 dark:bg-gray-900">

// ✅ Good - Semantic colors
<div className="bg-card">
```

### 2. Test Both Themes

```typescript
describe('Component', () => {
  it('works in light mode', () => {
    renderWithTheme(<Component />, { theme: 'light' })
    // ... tests
  })
  
  it('works in dark mode', () => {
    renderWithTheme(<Component />, { theme: 'dark' })
    // ... tests
  })
})
```

### 3. Test Theme Toggle Functionality

```typescript
it('toggles theme', async () => {
  const user = userEvent.setup()
  const { container } = renderWithTheme(<ThemeToggle />)
  
  await testThemeToggle(container, user)
  // Verify theme changed
})
```

### 4. Use Data Attributes for Theme-Specific Testing

```typescript
<div data-testid="card" data-theme={theme}>
  {/* content */}
</div>

// In tests
const card = screen.getByTestId('card')
expect(card).toHaveAttribute('data-theme', 'dark')
```

## Common Patterns

### Testing a Card Component

```typescript
describe('Card Theme Tests', () => {
  const renderCard = (theme: 'light' | 'dark') =>
    renderWithTheme(
      <Card>
        <h2>Title</h2>
        <p>Content</p>
      </Card>,
      { theme }
    )

  it('uses semantic colors in light mode', () => {
    const { container } = renderCard('light')
    const card = container.querySelector('.bg-card')
    
    expect(card).toBeInTheDocument()
    expectSemanticColors(card as HTMLElement)
  })

  it('maintains structure in both themes', () => {
    const { light, dark } = renderInBothThemes(
      <Card>Test</Card>
    )
    
    expect(light.container.innerHTML).toContain('Test')
    expect(dark.container.innerHTML).toContain('Test')
  })
})
```

### Testing Form Components

```typescript
describe('Form Theme Tests', () => {
  it('input borders are visible in both themes', () => {
    const { rerender } = renderWithTheme(
      <input className="border-input" />
    )
    
    const input = screen.getByRole('textbox')
    expect(input).toHaveClass('border-input')
    
    // Test in dark mode
    rerender(<input className="border-input" />, { theme: 'dark' })
    expect(input).toHaveClass('border-input')
  })
})
```

### Testing with Providers

```typescript
it('works with full app context', () => {
  renderWithTheme(
    <YourComponent />,
    { theme: 'dark', withProviders: true }
  )
  
  // Component has access to all providers
})
```

## Troubleshooting

### Theme Not Applying

Ensure your component is wrapped in the theme provider:

```typescript
// If using withProviders: true, theme is already included
renderWithTheme(<Component />, { withProviders: true })
```

### CSS Variables Not Found

Make sure your test environment includes the CSS file that defines theme variables:

```typescript
// In your test setup
import '@/styles/globals.css'
```

### Flaky Theme Tests

Use `disableTransitionOnChange` to prevent animation timing issues:

```typescript
<ThemeProvider disableTransitionOnChange>
  {children}
</ThemeProvider>
```

## Advanced Usage

### Custom Theme Wrapper

```typescript
const CustomThemeWrapper = ({ children, theme }) => (
  <ThemeProvider theme={theme}>
    <div className="min-h-screen bg-background">
      {children}
    </div>
  </ThemeProvider>
)

render(<Component />, { wrapper: CustomThemeWrapper })
```

### Testing Theme Persistence

```typescript
it('persists theme selection', () => {
  const { rerender } = renderWithTheme(<App />)
  
  // Change theme
  fireEvent.click(screen.getByText('Dark mode'))
  
  // Unmount and remount
  rerender(<App />)
  
  // Theme should still be dark
  expectThemeClasses(container, 'dark')
})
```

### Visual Regression Testing

```typescript
it('looks consistent across themes', () => {
  const { light, dark } = renderInBothThemes(<Component />)
  
  expect(light.container).toMatchSnapshot('light-theme')
  expect(dark.container).toMatchSnapshot('dark-theme')
})
```