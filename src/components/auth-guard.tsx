'use client'

import React, { useEffect } from 'react'
import { useAuth } from '@/contexts/auth-context'
import { useDemo } from '@/contexts/demo-context'
import { useRouter, usePathname } from 'next/navigation'
import { GlobalLoading } from '@/components/global-loading'

interface AuthGuardProps {
  children: React.ReactNode
}

// Authentication is now enabled with access request system
const AUTHENTICATION_DISABLED = false

// List of public paths that don't require authentication
const PUBLIC_PATHS = ['/login']

export function AuthGuard({ children }: AuthGuardProps) {
  const { user, loading } = useAuth()
  const { isDemoMode } = useDemo()
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    // Skip auth check for public paths
    if (PUBLIC_PATHS.includes(pathname)) {
      return
    }

    // Skip auth check if in demo mode
    if (isDemoMode) {
      return
    }

    // Redirect to login if not authenticated and not loading
    // This applies even when authentication is disabled - users must explicitly enter demo mode
    if (!loading && !user) {
      router.push('/login')
    }
  }, [user, loading, isDemoMode, router, pathname])

  // Show loading state while checking authentication (unless auth is disabled)
  if (loading && !AUTHENTICATION_DISABLED) {
    return <GlobalLoading />
  }

  // For public paths, always render children
  if (PUBLIC_PATHS.includes(pathname)) {
    return <>{children}</>
  }

  // Allow access if in demo mode
  if (isDemoMode) {
    return <>{children}</>
  }

  // For protected paths, only render if authenticated
  if (!user) {
    // Return null while redirecting
    return null
  }

  return <>{children}</>
}