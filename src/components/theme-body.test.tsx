import { render } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { ThemeBody } from './theme-body'

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

describe('ThemeBody', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    // Reset body classes
    document.body.className = ''
  })

  afterEach(() => {
    // Clean up body classes after each test
    document.body.className = ''
  })

  it('renders children correctly', () => {
    const { getByText } = render(
      <ThemeBody>
        <div>Test Child Content</div>
      </ThemeBody>
    )

    expect(getByText('Test Child Content')).toBeInTheDocument()
  })

  it('applies default theme class to body when localStorage is empty', () => {
    localStorageMock.getItem.mockReturnValue(null)
    
    render(
      <ThemeBody>
        <div>Content</div>
      </ThemeBody>
    )

    expect(document.body.classList.contains('theme-blue')).toBe(true)
  })

  it('applies saved theme class from localStorage', () => {
    localStorageMock.getItem.mockReturnValue('red')
    
    render(
      <ThemeBody>
        <div>Content</div>
      </ThemeBody>
    )

    expect(document.body.classList.contains('theme-red')).toBe(true)
    expect(localStorageMock.getItem).toHaveBeenCalledWith('color-theme')
  })

  it('preserves existing body classes', () => {
    document.body.className = 'existing-class another-class'
    localStorageMock.getItem.mockReturnValue('green')
    
    render(
      <ThemeBody>
        <div>Content</div>
      </ThemeBody>
    )

    expect(document.body.classList.contains('existing-class')).toBe(true)
    expect(document.body.classList.contains('another-class')).toBe(true)
    expect(document.body.classList.contains('theme-green')).toBe(true)
  })

  it('does not add duplicate theme classes', () => {
    document.body.className = 'theme-default'
    localStorageMock.getItem.mockReturnValue('default')
    
    render(
      <ThemeBody>
        <div>Content</div>
      </ThemeBody>
    )

    // Should still only have one theme-default class
    const themeClasses = Array.from(document.body.classList).filter(cls => cls === 'theme-default')
    expect(themeClasses.length).toBe(1)
  })

  it('applies theme on mount only (not on re-renders)', () => {
    localStorageMock.getItem.mockReturnValue('orange')
    
    const { rerender } = render(
      <ThemeBody>
        <div>Content 1</div>
      </ThemeBody>
    )

    expect(localStorageMock.getItem).toHaveBeenCalledTimes(1)
    
    // Change localStorage value and re-render
    localStorageMock.getItem.mockReturnValue('yellow')
    
    rerender(
      <ThemeBody>
        <div>Content 2</div>
      </ThemeBody>
    )

    // Should not read from localStorage again
    expect(localStorageMock.getItem).toHaveBeenCalledTimes(1)
    // Should still have the original theme
    expect(document.body.classList.contains('theme-orange')).toBe(true)
    expect(document.body.classList.contains('theme-yellow')).toBe(false)
  })

  it('handles all theme variations', () => {
    const themes = ['blue', 'red', 'orange', 'green', 'yellow', 'default']
    
    themes.forEach(theme => {
      document.body.className = ''
      localStorageMock.getItem.mockReturnValue(theme)
      
      const { unmount } = render(
        <ThemeBody>
          <div>Content</div>
        </ThemeBody>
      )

      expect(document.body.classList.contains(`theme-${theme}`)).toBe(true)
      
      unmount()
    })
  })

  it('does not pass className prop to children', () => {
    const { container } = render(
      <ThemeBody className="should-not-be-used">
        <div>Content</div>
      </ThemeBody>
    )

    // The className prop should not be applied anywhere
    expect(container.querySelector('.should-not-be-used')).toBeNull()
  })
})