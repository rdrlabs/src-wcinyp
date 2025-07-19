'use client'

import React from 'react'
import { useAuth } from '@/contexts/auth-context'
import { useRouter } from 'next/navigation'
import { Loader2, Shield } from 'lucide-react'
import Link from 'next/link'

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { user, loading, isAdmin } = useAuth()
  const router = useRouter()

  React.useEffect(() => {
    if (!loading && (!user || !isAdmin)) {
      router.push('/login')
    }
  }, [user, loading, isAdmin, router])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  if (!user || !isAdmin) {
    return null
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Admin Header */}
      <div className="border-b bg-card">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-primary" />
              <h1 className="text-xl font-semibold">Admin Dashboard</h1>
            </div>
            <nav className="flex items-center gap-4">
              <Link 
                href="/admin" 
                className="text-sm text-muted-foreground hover:text-foreground"
              >
                Overview
              </Link>
              <Link 
                href="/admin/access-requests" 
                className="text-sm text-muted-foreground hover:text-foreground"
              >
                Access Requests
              </Link>
              <Link 
                href="/" 
                className="text-sm text-muted-foreground hover:text-foreground"
              >
                Exit Admin
              </Link>
            </nav>
          </div>
        </div>
      </div>

      {/* Admin Content */}
      <div className="container mx-auto px-4 py-8">
        {children}
      </div>
    </div>
  )
}