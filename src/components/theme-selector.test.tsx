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

describe('ThemeSelector', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockMounted.mockReturnValue(true)
    mockTheme.mockReturnValue('light')
    mockColorTheme.mockReturnValue('blue')
  })

  describe('Dropdown variant (default)', () => {
    it('renders dropdown theme selector', () => {
      render(<ThemeSelector />)
      
      expect(screen.getByRole('button')).toBeInTheDocument()
      expect(screen.getByText('Toggle theme')).toBeInTheDocument()
    })

    it('opens dropdown menu on hover', async () => {
      const user = userEvent.setup()
      render(<ThemeSelector />)
      
      const button = screen.getByRole('button')
      await user.hover(button)
      
      // Wait for hover delay
      await new Promise(resolve => setTimeout(resolve, 250))
      
      // Check for dropdown content
      expect(screen.getByText('Appearance')).toBeInTheDocument()
      expect(screen.getByText('Color')).toBeInTheDocument()
      expect(screen.getByText('Light')).toBeInTheDocument()
      expect(screen.getByText('Dark')).toBeInTheDocument()
      expect(screen.getByText('System')).toBeInTheDocument()
    })

    it('changes light/dark theme', async () => {
      const user = userEvent.setup()
      render(<ThemeSelector />)
      
      const button = screen.getByRole('button')
      await user.hover(button)
      
      // Wait for hover delay
      await new Promise(resolve => setTimeout(resolve, 250))
      
      const darkOption = screen.getByText('Dark')
      await user.click(darkOption)
      
      expect(mockSetTheme).toHaveBeenCalledWith('dark')
    })

    it('changes color theme', async () => {
      const user = userEvent.setup()
      render(<ThemeSelector />)
      
      const button = screen.getByRole('button')
      await user.hover(button)
      
      // Wait for hover delay
      await new Promise(resolve => setTimeout(resolve, 250))
      
      const redOption = screen.getByText('Red')
      await user.click(redOption)
      
      expect(mockSetColorTheme).toHaveBeenCalledWith('red')
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
      
      const button = screen.getByRole('button')
      await user.hover(button)
      
      // Wait for hover delay
      await new Promise(resolve => setTimeout(resolve, 250))
      
      // Check that all theme options are buttons
      const lightButton = screen.getByText('Light').closest('button')
      const darkButton = screen.getByText('Dark').closest('button')
      const systemButton = screen.getByText('System').closest('button')
      
      expect(lightButton).toBeInTheDocument()
      expect(darkButton).toBeInTheDocument()
      expect(systemButton).toBeInTheDocument()
    })
  })
})