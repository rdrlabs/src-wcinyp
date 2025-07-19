import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { ThemeProvider } from 'next-themes'
import { AppProvider } from '@/contexts/app-context'
import { ThemeSelector } from '@/components/theme-selector'
import { ThemeBody } from '@/components/theme-body'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'

// Mock localStorage
const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
  length: 0,
  key: vi.fn(),
}

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
  writable: true,
})

// Helper to render with all necessary providers
function renderWithTheme(ui: React.ReactElement) {
  return render(
    <ThemeProvider attribute="data-theme" defaultTheme="light">
      <AppProvider>
        <ThemeBody>
          {ui}
        </ThemeBody>
      </AppProvider>
    </ThemeProvider>
  )
}

describe('Theme Integration Tests', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    // Clear theme classes but preserve other classes
    document.body.className = document.body.className
      .split(' ')
      .filter(cls => !cls.startsWith('theme-'))
      .join(' ')
    // Set default theme
    localStorageMock.getItem.mockImplementation((key) => {
      if (key === 'color-theme') return 'blue'
      if (key === 'theme') return 'light'
      return null
    })
  })

  afterEach(() => {
    document.body.className = ''
    // Ensure localStorage is restored if it was mocked
    if (!window.localStorage.getItem) {
      Object.defineProperty(window, 'localStorage', {
        value: localStorageMock,
        configurable: true,
        writable: true,
      })
    }
  })

  describe('Theme Application', () => {
    it('applies theme class to body on initial render', async () => {
      renderWithTheme(<div>Test Content</div>)
      
      await waitFor(() => {
        expect(document.body.classList.contains('theme-blue')).toBe(true)
      })
    })

    it('reads and applies saved theme from localStorage', async () => {
      localStorageMock.getItem.mockImplementation((key) => {
        if (key === 'color-theme') return 'red'
        return null
      })

      renderWithTheme(<div>Test Content</div>)
      
      await waitFor(() => {
        expect(document.body.classList.contains('theme-red')).toBe(true)
      })
    })
  })

  describe('Theme Switching', () => {
    it('switches theme when user selects a different color', async () => {
      const user = userEvent.setup()
      
      renderWithTheme(
        <div>
          <ThemeSelector />
          <Button>Test Button</Button>
        </div>
      )

      // Open theme selector
      const themeButton = screen.getByRole('button', { name: /toggle theme/i })
      await user.click(themeButton)

      // Select red theme (using screen reader text since color names are sr-only)
      const redOption = screen.getByText('Red theme').closest('button')
      expect(redOption).toBeInTheDocument()
      if (redOption) await user.click(redOption)

      // Check that theme class was updated
      await waitFor(() => {
        expect(document.body.classList.contains('theme-red')).toBe(true)
        expect(document.body.classList.contains('theme-blue')).toBe(false)
      })

      // Check localStorage was updated
      expect(localStorageMock.setItem).toHaveBeenCalledWith('color-theme', 'red')
    })

    it('maintains theme class when switching between light and dark modes', async () => {
      const user = userEvent.setup()
      
      localStorageMock.getItem.mockImplementation((key) => {
        if (key === 'color-theme') return 'green'
        if (key === 'theme') return 'light'
        return null
      })

      renderWithTheme(
        <div>
          <ThemeSelector />
          <div>Content</div>
        </div>
      )

      await waitFor(() => {
        expect(document.body.classList.contains('theme-green')).toBe(true)
      })

      // Open theme selector
      const themeButton = screen.getByRole('button', { name: /toggle theme/i })
      await user.click(themeButton)

      // Switch to dark mode - dark mode button is inside the mode switcher
      const dropdown = screen.getByRole('menu')
      const modeButtons = dropdown.querySelectorAll('button')
      // Dark mode is the second button in the mode switcher (index 1)
      await user.click(modeButtons[1])

      // Theme class should still be present
      await waitFor(() => {
        expect(document.body.classList.contains('theme-green')).toBe(true)
      })
    })
  })

  describe('Component Styling', () => {
    it('applies primary color to Button component', async () => {
      localStorageMock.getItem.mockImplementation((key) => {
        if (key === 'color-theme') return 'blue'
        return null
      })

      renderWithTheme(
        <Button variant="default">Primary Button</Button>
      )

      const button = screen.getByRole('button', { name: /primary button/i })
      
      // Check that button has primary color classes
      expect(button.className).toContain('bg-primary')
      expect(button.className).toContain('text-primary-foreground')
    })

    it('applies theme-specific styles to Card component', async () => {
      renderWithTheme(
        <Card>
          <div>Card Content</div>
        </Card>
      )

      const card = screen.getByText('Card Content').parentElement
      
      // Check that card has theme-aware classes
      expect(card?.className).toContain('text-card-foreground')
    })
  })

  describe('CSS Variable Resolution', () => {
    it('resolves CSS variables based on current theme', async () => {
      localStorageMock.getItem.mockImplementation((key) => {
        if (key === 'color-theme') return 'red'
        return null
      })

      renderWithTheme(
        <div 
          data-testid="color-test"
          className="bg-primary text-primary"
          style={{ 
            backgroundColor: 'var(--color-primary)',
            color: 'var(--color-primary-foreground)'
          }}
        >
          Test
        </div>
      )

      await waitFor(() => {
        expect(document.body.classList.contains('theme-red')).toBe(true)
      })

      // In a real browser, these CSS variables would resolve to the theme colors
      // Here we're mainly testing that the classes and variables are applied
      const element = screen.getByTestId('color-test')
      expect(element.style.backgroundColor).toBe('var(--color-primary)')
      expect(element.style.color).toBe('var(--color-primary-foreground)')
    })
  })

  describe('Theme Persistence', () => {
    it('persists theme selection across component unmount/remount', async () => {
      const user = userEvent.setup()
      
      const { unmount } = renderWithTheme(
        <ThemeSelector />
      )

      // Open and select orange theme
      await user.click(screen.getByRole('button', { name: /toggle theme/i }))
      const orangeOption = screen.getByText('Orange theme').closest('button')
      if (orangeOption) await user.click(orangeOption)

      // Verify localStorage was updated
      expect(localStorageMock.setItem).toHaveBeenCalledWith('color-theme', 'orange')

      // Unmount
      unmount()
      
      // Mock localStorage to return the saved value
      localStorageMock.getItem.mockImplementation((key) => {
        if (key === 'color-theme') return 'orange'
        return null
      })

      // Remount
      renderWithTheme(<div>Remounted</div>)

      // Should apply the saved theme
      await waitFor(() => {
        expect(document.body.classList.contains('theme-orange')).toBe(true)
      })
    })
  })

  describe('Edge Cases', () => {
    it('handles invalid theme gracefully', () => {
      localStorageMock.getItem.mockImplementation((key) => {
        if (key === 'color-theme') return 'invalid-theme'
        return null
      })

      // Since ThemeBody applies theme in useEffect, we need to test it directly
      const { container } = renderWithTheme(<div>Test</div>)

      // The component should render without crashing
      expect(container.firstChild).toBeTruthy()
      
      // And localStorage should have been accessed
      expect(localStorageMock.getItem).toHaveBeenCalledWith('color-theme')
    })

    it('handles missing localStorage gracefully', async () => {
      // Simulate localStorage being unavailable
      const originalLocalStorage = window.localStorage
      Object.defineProperty(window, 'localStorage', {
        get: () => {
          throw new Error('localStorage not available')
        },
        configurable: true,
      })

      // Should not crash
      expect(() => {
        renderWithTheme(<div>Test</div>)
      }).not.toThrow()

      // Restore localStorage
      Object.defineProperty(window, 'localStorage', {
        value: originalLocalStorage,
        configurable: true,
        writable: true,
      })
    })
  })

  describe('Performance', () => {
    it('does not cause unnecessary re-renders when theme changes', async () => {
      const user = userEvent.setup()
      const renderSpy = vi.fn()
      
      function TestComponent() {
        renderSpy()
        return <div>Test Component</div>
      }

      renderWithTheme(
        <>
          <ThemeSelector />
          <TestComponent />
        </>
      )

      const initialRenderCount = renderSpy.mock.calls.length

      // Change theme
      await user.click(screen.getByRole('button', { name: /toggle theme/i }))
      const purpleOption = screen.getByText('Purple theme').closest('button')
      if (purpleOption) await user.click(purpleOption)

      // Component should not re-render just because theme changed
      // (unless it's using the theme context directly)
      await waitFor(() => {
        expect(document.body.classList.contains('theme-purple')).toBe(true)
      })
      
      // Allow for some re-renders but not excessive
      expect(renderSpy.mock.calls.length).toBeLessThan(initialRenderCount + 3)
    })
  })
})