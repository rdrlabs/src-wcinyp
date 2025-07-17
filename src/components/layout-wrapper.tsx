'use client'

import { usePathname } from 'next/navigation'
import { NavBar } from '@/components/navbar'
import { Footer } from '@/components/footer'

interface LayoutWrapperProps {
  children: React.ReactNode
}

// Routes that should not display navbar/footer
const STANDALONE_ROUTES = ['/login']

// Routes that are completely independent apps
const FUMADOCS_ROUTES = '/knowledge/docs'

export function LayoutWrapper({ children }: LayoutWrapperProps) {
  const pathname = usePathname()
  const isStandaloneRoute = STANDALONE_ROUTES.includes(pathname)
  const isFumadocsRoute = pathname.startsWith(FUMADOCS_ROUTES)

  // For standalone routes and Fumadocs, return children without any wrapper
  if (isStandaloneRoute || isFumadocsRoute) {
    return <>{children}</>
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <NavBar />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  )
}