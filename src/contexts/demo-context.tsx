'use client'

import React, { createContext, useContext, useState, useEffect } from 'react'

interface DemoContextType {
  isDemoMode: boolean
  setIsDemoMode: (value: boolean) => void
}

const DemoContext = createContext<DemoContextType | undefined>(undefined)

export function DemoProvider({ children }: { children: React.ReactNode }) {
  const [isDemoMode, setIsDemoMode] = useState(false)

  useEffect(() => {
    // Check if demo mode is enabled in localStorage
    const stored = localStorage.getItem('isDemoMode')
    if (stored === 'true') {
      setIsDemoMode(true)
    }
  }, [])

  useEffect(() => {
    // Persist demo mode state
    localStorage.setItem('isDemoMode', isDemoMode.toString())
  }, [isDemoMode])

  return (
    <DemoContext.Provider value={{ isDemoMode, setIsDemoMode }}>
      {children}
    </DemoContext.Provider>
  )
}

export function useDemoMode() {
  const context = useContext(DemoContext)
  if (context === undefined) {
    throw new Error('useDemoMode must be used within a DemoProvider')
  }
  return context
}