'use client'

import { useTheme } from 'next-themes'
import { useEffect, useState, useCallback } from 'react'

export type ColorTheme = 'blue' | 'red' | 'orange' | 'green' | 'yellow' | 'pink' | 'purple' | 'neutral'

interface UseAppThemeReturn {
  // From next-themes
  theme: string
  setTheme: (theme: string) => void
  systemTheme: string | undefined
  resolvedTheme: string | undefined
  
  // Color theme management
  colorTheme: ColorTheme
  setColorTheme: (theme: ColorTheme) => void
  
  // Utility
  mounted: boolean
}

const COLOR_THEME_KEY = 'color-theme'
const DEFAULT_COLOR_THEME: ColorTheme = 'blue'

export function useAppTheme(): UseAppThemeReturn {
  const nextThemes = useTheme()
  const [colorTheme, setColorThemeState] = useState<ColorTheme>(DEFAULT_COLOR_THEME)
  const [mounted, setMounted] = useState(false)

  // Initialize color theme from localStorage and set mounted state
  useEffect(() => {
    setMounted(true)
    const savedColorTheme = localStorage.getItem(COLOR_THEME_KEY) as ColorTheme | null
    if (savedColorTheme) {
      setColorThemeState(savedColorTheme)
    }
  }, [])

  // Apply color theme class to body element
  useEffect(() => {
    if (!mounted || !document.body) return
    
    const body = document.body
    const classes = body.className.split(' ').filter(c => !c.startsWith('theme-'))
    body.className = [...classes, `theme-${colorTheme}`].join(' ')
  }, [colorTheme, mounted])

  // Update color theme
  const setColorTheme = useCallback((theme: ColorTheme) => {
    setColorThemeState(theme)
    localStorage.setItem(COLOR_THEME_KEY, theme)
  }, [])

  return {
    theme: nextThemes.theme || 'system',
    setTheme: nextThemes.setTheme,
    systemTheme: nextThemes.systemTheme,
    resolvedTheme: nextThemes.resolvedTheme,
    colorTheme,
    setColorTheme,
    mounted,
  }
}