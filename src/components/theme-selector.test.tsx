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
    it('renders dropdown theme selector with system button', () => {
      render(<ThemeSelector />)
      
      // Should have 2 buttons: dropdown trigger and system button
      const buttons = screen.getAllByRole('button')
      expect(buttons).toHaveLength(2)
      expect(screen.getByText('Toggle theme')).toBeInTheDocument()
      expect(screen.getByText('Apply system theme')).toBeInTheDocument()
    })

    it('opens dropdown menu on click', async () => {
      const user = userEvent.setup()
      render(<ThemeSelector />)
      
      // Get the first button (dropdown trigger)
      const buttons = screen.getAllByRole('button')
      await user.click(buttons[0])
      
      // Check for dropdown content - mode buttons don't show text anymore
      const dropdown = screen.getByRole('menu')
      const modeButtons = dropdown.querySelectorAll('button')
      expect(modeButtons.length).toBeGreaterThanOrEqual(2)
      
      // Check for color circles (by role and sr-only text)
      expect(screen.getByText('Blue theme')).toBeInTheDocument()
      expect(screen.getByText('Red theme')).toBeInTheDocument()
    })

    it('changes light/dark theme', async () => {
      const user = userEvent.setup()
      render(<ThemeSelector />)
      
      // Get the first button (dropdown trigger)
      const buttons = screen.getAllByRole('button')
      await user.click(buttons[0])
      
      // Find all buttons in the dropdown (excluding the trigger)
      const dropdown = screen.getByRole('menu')
      const modeButtons = dropdown.querySelectorAll('button')
      // Click the second mode button (Dark is at index 1)
      await user.click(modeButtons[1])
      
      expect(mockSetTheme).toHaveBeenCalledWith('dark')
    })

    it('changes color theme', async () => {
      const user = userEvent.setup()
      render(<ThemeSelector />)
      
      // Get the first button (dropdown trigger)
      const buttons = screen.getAllByRole('button')
      await user.click(buttons[0])
      
      // Click on the red color circle button (find by sr-only text)
      const redButton = screen.getByText('Red theme').closest('button')
      if (redButton) await user.click(redButton)
      
      expect(mockSetColorTheme).toHaveBeenCalledWith('red')
    })
    
    it('toggles system theme with system button', async () => {
      const user = userEvent.setup()
      render(<ThemeSelector />)
      
      // Get the second button (system button)
      const buttons = screen.getAllByRole('button')
      const systemButton = buttons[1]
      
      // Click to enable system theme
      await user.click(systemButton)
      expect(mockSetTheme).toHaveBeenCalledWith('system')
      
      // Mock system theme active
      mockTheme.mockReturnValue('system')
      render(<ThemeSelector />)
      
      // Click again to disable system theme
      const newButtons = screen.getAllByRole('button')
      await user.click(newButtons[1])
      expect(mockSetTheme).toHaveBeenCalledWith('light')
    })
    
    it('grays out dropdown when system theme is active', () => {
      mockTheme.mockReturnValue('system')
      render(<ThemeSelector />)
      
      const buttons = screen.getAllByRole('button')
      const dropdownButton = buttons[0]
      
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
      
      // Should have: 2 mode buttons + 6 color buttons = 8 buttons in dropdown
      expect(dropdownButtons.length).toBe(8)
      
      // The first 2 should be mode buttons
      expect(dropdownButtons[0].tagName).toBe('BUTTON')
      expect(dropdownButtons[1].tagName).toBe('BUTTON')
    })
  })
})