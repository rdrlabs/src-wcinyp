'use client'

import { useAuth } from '@/contexts/auth-context'
import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { getSupabaseClient } from '@/lib/supabase-client'
import { authSessionManager } from '@/lib/auth-session'

export function SupabaseDebug() {
  const { user, loading, error, pendingSessionToken, isPollingForAuth } = useAuth()
  const [debugInfo, setDebugInfo] = useState<any>(null)
  const supabase = getSupabaseClient()

  const runDebugChecks = async () => {
    const info: any = {
      timestamp: new Date().toISOString(),
      environment: {
        url: process.env.NEXT_PUBLIC_SUPABASE_URL,
        hasAnonKey: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
        hasServiceKey: !!process.env.SUPABASE_SERVICE_ROLE_KEY,
      },
      auth: {
        user: user ? { id: user.id, email: user.email } : null,
        loading,
        error,
        pendingSessionToken,
        isPollingForAuth,
      },
      session: null,
      pendingSession: null,
    }

    // Check current session
    try {
      const { data: { session } } = await supabase.auth.getSession()
      info.session = session ? {
        user: { id: session.user.id, email: session.user.email },
        expiresAt: new Date(session.expires_at! * 1000).toISOString(),
      } : null
    } catch (err) {
      info.session = { error: (err as Error).message }
    }

    // Check pending session if token exists
    if (pendingSessionToken) {
      try {
        const status = await authSessionManager.checkSessionStatus(pendingSessionToken)
        info.pendingSession = status
      } catch (err) {
        info.pendingSession = { error: (err as Error).message }
      }
    }

    // Check tables
    try {
      const { count: profileCount } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true })
      
      const { count: sessionCount } = await supabase
        .from('pending_auth_sessions')
        .select('*', { count: 'exact', head: true })
      
      info.tables = {
        profiles: profileCount !== null ? `${profileCount} records` : 'Not accessible',
        pending_auth_sessions: sessionCount !== null ? `${sessionCount} records` : 'Not accessible',
      }
    } catch (err) {
      info.tables = { error: (err as Error).message }
    }

    setDebugInfo(info)
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Supabase Debug Panel</CardTitle>
        <CardDescription>
          Debug information for authentication and database connection
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center gap-2">
          <Button onClick={runDebugChecks} size="sm">
            Run Debug Checks
          </Button>
          {user && <Badge variant="secondary">Authenticated</Badge>}
          {!user && !loading && <Badge variant="destructive">Not Authenticated</Badge>}
          {loading && <Badge variant="outline">Loading...</Badge>}
          {isPollingForAuth && <Badge variant="default">Polling for Auth</Badge>}
        </div>

        {debugInfo && (
          <pre className="overflow-auto rounded-lg bg-muted p-4 text-xs">
            {JSON.stringify(debugInfo, null, 2)}
          </pre>
        )}

        <div className="space-y-2 text-sm">
          <h3 className="font-medium">Quick Status:</h3>
          <ul className="space-y-1 text-muted-foreground">
            <li>• Supabase URL: {process.env.NEXT_PUBLIC_SUPABASE_URL ? '✅ Set' : '❌ Missing'}</li>
            <li>• Auth State: {loading ? '⏳ Loading' : user ? '✅ Authenticated' : '❌ Not authenticated'}</li>
            <li>• Polling: {isPollingForAuth ? '🔄 Active' : '⏸️ Inactive'}</li>
            <li>• Session Token: {pendingSessionToken ? `🔑 ${pendingSessionToken.substring(0, 8)}...` : '❌ None'}</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  )
}