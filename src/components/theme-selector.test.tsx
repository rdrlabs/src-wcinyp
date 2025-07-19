import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { ThemeSelector } from './theme-selector'

// Mock the useAppTheme hook
const mockSetTheme = vi.fn()
const mockSetColorTheme = vi.fn()
const mockTheme = vi.fn()
const mockColorTheme = vi.fn()
const mockMounted = vi.fn()

vi.mock('@/contexts/app-context', () => ({
  useAppTheme: () => ({
    setTheme: mockSetTheme,
    theme: mockTheme(),
    colorTheme: mockColorTheme(),
    setColorTheme: mockSetColorTheme,
    mounted: mockMounted(),
    systemTheme: undefined,
  })
}))

// Mock TooltipProvider
vi.mock('@/components/ui/tooltip', () => ({
  TooltipProvider: ({ children }: { children: React.ReactNode }) => <>{children}</>,
  Tooltip: ({ children }: { children: React.ReactNode }) => <>{children}</>,
  TooltipTrigger: ({ children }: { children: React.ReactNode }) => <>{children}</>,
  TooltipContent: ({ children }: { children: React.ReactNode }) => <div role="tooltip">{children}</div>,
}))

describe('ThemeSelector', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockMounted.mockReturnValue(true)
    mockTheme.mockReturnValue('light')
    mockColorTheme.mockReturnValue('blue')
  })

  describe('Dropdown variant (default)', () => {
    it('renders dropdown theme selector with system button', async () => {
      const user = userEvent.setup()
      render(<ThemeSelector />)
      
      // Should have 1 button initially (dropdown trigger)
      const dropdownTrigger = screen.getByRole('button')
      expect(screen.getByText('Toggle theme')).toBeInTheDocument()
      
      // Open dropdown to see system button
      await user.click(dropdownTrigger)
      
      // Now system button should be visible inside dropdown
      expect(screen.getByText('Apply system theme')).toBeInTheDocument()
    })

    it('opens dropdown menu on click', async () => {
      const user = userEvent.setup()
      render(<ThemeSelector />)
      
      // Click the dropdown trigger
      await user.click(screen.getByTestId('theme-selector-trigger'))
      
      // Check for theme mode buttons
      expect(screen.getByTestId('theme-mode-light')).toBeInTheDocument()
      expect(screen.getByTestId('theme-mode-dark')).toBeInTheDocument()
      
      // Check for color theme buttons
      expect(screen.getByTestId('theme-color-blue')).toBeInTheDocument()
      expect(screen.getByTestId('theme-color-red')).toBeInTheDocument()
    })

    it('changes light/dark theme', async () => {
      const user = userEvent.setup()
      render(<ThemeSelector />)
      
      // Open dropdown
      await user.click(screen.getByTestId('theme-selector-trigger'))
      
      // Click dark mode button
      await user.click(screen.getByTestId('theme-mode-dark'))
      
      expect(mockSetTheme).toHaveBeenCalledWith('dark')
    })

    it('changes color theme', async () => {
      const user = userEvent.setup()
      render(<ThemeSelector />)
      
      // Open dropdown
      await user.click(screen.getByTestId('theme-selector-trigger'))
      
      // Click on the red color button
      await user.click(screen.getByTestId('theme-color-red'))
      
      expect(mockSetColorTheme).toHaveBeenCalledWith('red')
    })
    
    it('enables system theme with system button', async () => {
      const user = userEvent.setup()
      render(<ThemeSelector />)
      
      // Open dropdown
      await user.click(screen.getByTestId('theme-selector-trigger'))
      
      // Click system button to enable system theme
      await user.click(screen.getByTestId('theme-system-button'))
      expect(mockSetTheme).toHaveBeenCalledWith('system')
    })
    
    it('disables system theme and restores previous theme', async () => {
      const user = userEvent.setup()
      mockTheme.mockReturnValue('system')
      render(<ThemeSelector />)
      
      // Open dropdown
      await user.click(screen.getByTestId('theme-selector-trigger'))
      
      // Click system button to disable system theme
      await user.click(screen.getByTestId('theme-system-button'))
      // Should restore previous theme (light is default)
      expect(mockSetTheme).toHaveBeenCalledWith('light')
    })
    
    it('grays out dropdown when system theme is active', () => {
      mockTheme.mockReturnValue('system')
      render(<ThemeSelector />)
      
      const dropdownButton = screen.getByTestId('theme-selector-trigger')
      expect(dropdownButton).toHaveClass('opacity-50')
    })
  })

  describe('Toggle variant', () => {
    it('renders simple toggle button', () => {
      render(<ThemeSelector variant="toggle" />)
      
      expect(screen.getByRole('button')).toBeInTheDocument()
      expect(screen.getByText('Toggle theme')).toBeInTheDocument()
    })

    it('toggles from light to dark', async () => {
      const user = userEvent.setup()
      mockTheme.mockReturnValue('light')
      
      render(<ThemeSelector variant="toggle" />)
      
      const button = screen.getByRole('button')
      await user.click(button)
      
      expect(mockSetTheme).toHaveBeenCalledWith('dark')
    })

    it('toggles from dark to light', async () => {
      const user = userEvent.setup()
      mockTheme.mockReturnValue('dark')
      
      render(<ThemeSelector variant="toggle" />)
      
      const button = screen.getByRole('button')
      await user.click(button)
      
      expect(mockSetTheme).toHaveBeenCalledWith('light')
    })

    it('does not show dropdown in toggle variant', async () => {
      const user = userEvent.setup()
      render(<ThemeSelector variant="toggle" />)
      
      const button = screen.getByRole('button')
      await user.click(button)
      
      // Dropdown content should not appear
      expect(screen.queryByText('Appearance')).not.toBeInTheDocument()
      expect(screen.queryByText('Color')).not.toBeInTheDocument()
    })
  })

  describe('Mounting behavior', () => {
    it('returns null when not mounted', () => {
      mockMounted.mockReturnValue(false)
      
      const { container } = render(<ThemeSelector />)
      
      expect(container.firstChild).toBeNull()
    })
  })

  describe('Accessibility', () => {
    it('has correct accessibility attributes', () => {
      render(<ThemeSelector />)
      
      const srText = screen.getByText('Toggle theme')
      expect(srText).toHaveClass('sr-only')
    })

    it('uses semantic button elements in dropdown', async () => {
      const user = userEvent.setup()
      render(<ThemeSelector />)
      
      // Get the first button (dropdown trigger)
      const buttons = screen.getAllByRole('button')
      await user.click(buttons[0])
      
      // Check buttons in the dropdown menu only
      const dropdown = screen.getByRole('menu')
      const dropdownButtons = dropdown.querySelectorAll('button')
      
      // Should have: 2 mode buttons + 1 system button + 6 color buttons = 9 buttons in dropdown
      expect(dropdownButtons.length).toBe(9)
      
      // The first 2 should be mode buttons
      expect(dropdownButtons[0].tagName).toBe('BUTTON')
      expect(dropdownButtons[1].tagName).toBe('BUTTON')
    })
  })
})