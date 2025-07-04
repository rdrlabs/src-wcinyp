import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, vi } from 'vitest'
import { ThemeToggle } from './theme-toggle'

// Mock next-themes
const mockSetTheme = vi.fn()
const mockTheme = vi.fn()

vi.mock('next-themes', () => ({
  useTheme: () => ({
    setTheme: mockSetTheme,
    theme: mockTheme()
  })
}))

describe('ThemeToggle', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders theme toggle button', () => {
    mockTheme.mockReturnValue('light')
    render(<ThemeToggle />)
    
    expect(screen.getByRole('button')).toBeInTheDocument()
    
    // Check for screen reader text
    expect(screen.getByText('Toggle theme')).toBeInTheDocument()
  })

  it('toggles from light to dark theme', async () => {
    const user = userEvent.setup()
    mockTheme.mockReturnValue('light')
    
    render(<ThemeToggle />)
    
    const button = screen.getByRole('button')
    await user.click(button)
    
    expect(mockSetTheme).toHaveBeenCalledWith('dark')
  })

  it('toggles from dark to light theme', async () => {
    const user = userEvent.setup()
    mockTheme.mockReturnValue('dark')
    
    render(<ThemeToggle />)
    
    const button = screen.getByRole('button')
    await user.click(button)
    
    expect(mockSetTheme).toHaveBeenCalledWith('light')
  })

  it('handles undefined theme state', async () => {
    const user = userEvent.setup()
    mockTheme.mockReturnValue(undefined)
    
    render(<ThemeToggle />)
    
    const button = screen.getByRole('button')
    await user.click(button)
    
    // When theme is undefined, it defaults to toggling to "light"
    expect(mockSetTheme).toHaveBeenCalledWith('light')
  })

  it('has correct accessibility attributes', () => {
    mockTheme.mockReturnValue('light')
    render(<ThemeToggle />)
    
    const srText = screen.getByText('Toggle theme')
    
    // Screen reader text should be present but visually hidden
    expect(srText).toHaveClass('sr-only')
  })
})