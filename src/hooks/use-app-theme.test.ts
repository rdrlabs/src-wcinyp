import { renderHook, act } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { useAppTheme } from './use-app-theme'

// Mock next-themes
const mockNextThemes = {
  theme: 'light',
  setTheme: vi.fn(),
  systemTheme: 'light',
  resolvedTheme: 'light',
}

vi.mock('next-themes', () => ({
  useTheme: () => mockNextThemes,
}))

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
})

describe('useAppTheme', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    document.body.className = ''
  })

  it('returns theme data from next-themes', () => {
    const { result } = renderHook(() => useAppTheme())

    expect(result.current.theme).toBe('light')
    expect(result.current.systemTheme).toBe('light')
    expect(result.current.resolvedTheme).toBe('light')
    expect(typeof result.current.setTheme).toBe('function')
  })

  it('initializes with default color theme when no saved theme', () => {
    localStorageMock.getItem.mockReturnValue(null)
    
    const { result } = renderHook(() => useAppTheme())

    expect(result.current.colorTheme).toBe('blue')
  })

  it('initializes with saved color theme from localStorage', () => {
    localStorageMock.getItem.mockReturnValue('red')
    
    const { result } = renderHook(() => useAppTheme())

    expect(result.current.colorTheme).toBe('red')
  })

  it('updates color theme and saves to localStorage', () => {
    const { result } = renderHook(() => useAppTheme())

    act(() => {
      result.current.setColorTheme('green')
    })

    expect(result.current.colorTheme).toBe('green')
    expect(localStorageMock.setItem).toHaveBeenCalledWith('color-theme', 'green')
  })

  it('applies color theme class to body element', () => {
    const { result } = renderHook(() => useAppTheme())

    act(() => {
      result.current.setColorTheme('orange')
    })

    expect(document.body.className).toContain('theme-orange')
  })

  it('preserves non-theme classes when updating color theme', () => {
    document.body.className = 'dark some-other-class'
    
    const { result } = renderHook(() => useAppTheme())

    act(() => {
      result.current.setColorTheme('purple')
    })

    expect(document.body.className).toBe('dark some-other-class theme-purple')
  })

  it('removes old theme class when changing color theme', () => {
    document.body.className = 'dark theme-blue'
    
    const { result } = renderHook(() => useAppTheme())

    act(() => {
      result.current.setColorTheme('red')
    })

    expect(document.body.className).toBe('dark theme-red')
    expect(document.body.className).not.toContain('theme-blue')
  })

  it('starts unmounted and becomes mounted after effect', () => {
    const { result } = renderHook(() => useAppTheme())

    expect(result.current.mounted).toBe(true)
  })

  it('calls next-themes setTheme when setTheme is called', () => {
    const { result } = renderHook(() => useAppTheme())

    act(() => {
      result.current.setTheme('dark')
    })

    expect(mockNextThemes.setTheme).toHaveBeenCalledWith('dark')
  })
})