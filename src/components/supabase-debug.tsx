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
    } catch (error) {
      info.session = { error: String(error) }
    }

    // Check pending session
    if (pendingSessionToken) {
      // TODO: getSession method needs to be implemented
      // const pendingSession = authSessionManager.getSession(pendingSessionToken)
      info.pendingSession = { token: pendingSessionToken }
    }

    setDebugInfo(info)
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Supabase Auth Debug</CardTitle>
        <CardDescription>
          Current authentication state and configuration
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center gap-2">
          <span className="font-medium">Status:</span>
          {loading && <Badge variant="secondary">Loading</Badge>}
          {!loading && user && <Badge variant="default">Authenticated</Badge>}
          {!loading && !user && <Badge variant="outline">Not Authenticated</Badge>}
          {isPollingForAuth && <Badge variant="secondary">Polling for Auth</Badge>}
        </div>

        {error && (
          <div className="text-sm text-destructive">
            Error: {error}
          </div>
        )}

        <Button onClick={runDebugChecks} size="sm">
          Run Debug Checks
        </Button>

        {debugInfo && (
          <pre className="text-xs bg-muted p-4 rounded-md overflow-auto max-h-96">
            {JSON.stringify(debugInfo, null, 2)}
          </pre>
        )}
      </CardContent>
    </Card>
  )
}