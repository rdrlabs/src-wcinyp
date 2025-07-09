'use client'

import { useEffect } from 'react'

export function ThemeBody({ 
  children
}: { 
  children: React.ReactNode
}) {
  useEffect(() => {
    // Apply saved color theme
    try {
      const colorTheme = localStorage.getItem('color-theme') || 'default'
      document.body.classList.add(`theme-${colorTheme}`)
    } catch (error) {
      // If localStorage is not available, use default theme
      document.body.classList.add('theme-default')
    }
  }, [])

  return (
    <>
      {children}
    </>
  )
}