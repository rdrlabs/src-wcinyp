'use client'

import React, { createContext, useContext, useState, useCallback, useEffect } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import type { User } from '@supabase/supabase-js'

interface DemoUser extends Partial<User> {
  id: string
  email: string
  user_metadata: {
    full_name: string
    avatar_url?: string
  }
}

interface DemoContextType {
  isDemoMode: boolean
  demoUser: DemoUser | null
  enterDemoMode: () => void
  exitDemoMode: () => void
}

const DemoContext = createContext<DemoContextType | undefined>(undefined)

// Demo user data
const DEMO_USER: DemoUser = {
  id: 'demo-user-001',
  email: 'demo1234@med.cornell.edu',
  user_metadata: {
    full_name: 'Demo User',
    avatar_url: undefined
  },
  created_at: new Date().toISOString(),
}

export function DemoProvider({ children }: { children: React.ReactNode }) {
  const [isDemoMode, setIsDemoMode] = useState(false)
  const [demoUser, setDemoUser] = useState<DemoUser | null>(null)
  const router = useRouter()
  const pathname = usePathname()

  // Check if demo mode on mount
  useEffect(() => {
    const storedDemoMode = localStorage.getItem('demo_mode') === 'true'
    if (storedDemoMode) {
      setIsDemoMode(true)
      setDemoUser(DEMO_USER)
    }
  }, [])

  // Prevent access to certain pages in demo mode
  useEffect(() => {
    if (isDemoMode) {
      const restrictedPaths = ['/settings/sessions', '/diagnostics']
      if (restrictedPaths.includes(pathname)) {
        router.push('/')
      }
    }
  }, [isDemoMode, pathname, router])

  const enterDemoMode = useCallback(() => {
    setIsDemoMode(true)
    setDemoUser(DEMO_USER)
    localStorage.setItem('demo_mode', 'true')
    
    // Navigate to home page
    router.push('/')
  }, [router])

  const exitDemoMode = useCallback(() => {
    setIsDemoMode(false)
    setDemoUser(null)
    localStorage.removeItem('demo_mode')
    
    // Navigate back to login
    router.push('/login')
  }, [router])

  const value: DemoContextType = {
    isDemoMode,
    demoUser,
    enterDemoMode,
    exitDemoMode,
  }

  return <DemoContext.Provider value={value}>{children}</DemoContext.Provider>
}

export function useDemo() {
  const context = useContext(DemoContext)
  if (context === undefined) {
    throw new Error('useDemo must be used within a DemoProvider')
  }
  return context
}

// Helper hook to check if we should use demo data
export function useDemoAware() {
  const { isDemoMode } = useDemo()
  const pathname = usePathname()
  
  // Always show real login page
  if (pathname === '/login') {
    return { isDemoMode: false, shouldUseDemoData: false }
  }
  
  return { isDemoMode, shouldUseDemoData: isDemoMode }
}