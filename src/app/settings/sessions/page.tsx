'use client'

import React, { useEffect, useState, useCallback } from 'react'
import { useAuth } from '@/contexts/auth-context'
import { sessionManager, type UserSession } from '@/lib/session-manager'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Loader2, Monitor, Smartphone, Globe, Clock, MapPin, AlertCircle } from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'
import { useRouter } from 'next/navigation'
import { logger } from '@/lib/logger'
import { ListLoadingBoundary } from '@/components/loading-boundary'

export default function SessionsPage() {
  const { user } = useAuth()
  const router = useRouter()
  const [sessions, setSessions] = useState<UserSession[]>([])
  const [loading, setLoading] = useState(true)
  const [revoking, setRevoking] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  const loadSessions = useCallback(async () => {
    if (!user) return

    try {
      setLoading(true)
      const userSessions = await sessionManager.getUserSessions(user.id)
      setSessions(userSessions)
    } catch (err) {
      setError('Failed to load sessions')
      logger.error('Load sessions error', { error: err, context: 'SessionsPage' })
    } finally {
      setLoading(false)
    }
  }, [user])

  useEffect(() => {
    if (!user) {
      router.push('/login')
      return
    }

    loadSessions()
  }, [user, router, loadSessions])

  const handleRevokeSession = async (sessionId: string) => {
    if (!user) return

    try {
      setRevoking(sessionId)
      setError(null)
      setSuccess(null)

      const revoked = await sessionManager.revokeSession(sessionId, user.id)
      
      if (revoked) {
        setSuccess('Session revoked successfully')
        // Reload sessions
        await loadSessions()
      } else {
        setError('Failed to revoke session')
      }
    } catch (err) {
      setError('Failed to revoke session')
      logger.error('Revoke session error', { error: err, context: 'SessionsPage' })
    } finally {
      setRevoking(null)
    }
  }

  const handleRevokeAllSessions = async () => {
    if (!user) return

    if (!confirm('Are you sure you want to sign out of all other devices? You will remain signed in on this device.')) {
      return
    }

    try {
      setRevoking('all')
      setError(null)
      setSuccess(null)

      // Get current session token to exclude it
      const currentToken = document.cookie
        .split('; ')
        .find(row => row.startsWith('sb-access-token='))
        ?.split('=')[1]

      const revoked = await sessionManager.revokeAllSessions(user.id, currentToken)
      
      if (revoked) {
        setSuccess('All other sessions revoked successfully')
        // Reload sessions
        await loadSessions()
      } else {
        setError('Failed to revoke sessions')
      }
    } catch (err) {
      setError('Failed to revoke sessions')
      logger.error('Revoke all sessions error', { error: err, context: 'SessionsPage' })
    } finally {
      setRevoking(null)
    }
  }

  const getDeviceIcon = (deviceType?: string) => {
    if (deviceType === 'mobile') {
      return <Smartphone className="h-5 w-5" />
    }
    return <Monitor className="h-5 w-5" />
  }

  const formatLocation = (ipAddress?: string) => {
    // In a real app, you'd use an IP geolocation service
    return ipAddress || 'Unknown location'
  }

  const sessionsContent = loading ? (
    <ListLoadingBoundary>
      <div />
    </ListLoadingBoundary>
  ) : sessions.length === 0 ? (
    <Card>
      <CardContent className="py-8 text-center">
        <p className="text-muted-foreground">No active sessions found</p>
      </CardContent>
    </Card>
  ) : (
    sessions.map((session) => (
      <Card key={session.id}>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="flex items-start space-x-3">
              {getDeviceIcon(session.device_type)}
              <div>
                <CardTitle className="text-lg">
                  {session.browser_name || 'Unknown Browser'} on {session.os_name || 'Unknown OS'}
                </CardTitle>
                <CardDescription>
                  {session.device_name || session.device_type || 'Unknown Device'}
                </CardDescription>
              </div>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleRevokeSession(session.id)}
              disabled={revoking === session.id}
            >
              {revoking === session.id ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Revoking...
                </>
              ) : (
                'Revoke'
              )}
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div className="flex items-center space-x-2 text-muted-foreground">
              <Clock className="h-4 w-4" />
              <span>
                Last active: {formatDistanceToNow(new Date(session.last_activity), { addSuffix: true })}
              </span>
            </div>
            <div className="flex items-center space-x-2 text-muted-foreground">
              <MapPin className="h-4 w-4" />
              <span>{formatLocation(session.ip_address)}</span>
            </div>
            <div className="flex items-center space-x-2 text-muted-foreground">
              <Globe className="h-4 w-4" />
              <span>
                Created: {formatDistanceToNow(new Date(session.created_at), { addSuffix: true })}
              </span>
            </div>
            <div className="flex items-center space-x-2 text-muted-foreground">
              <Clock className="h-4 w-4" />
              <span>
                Expires: {formatDistanceToNow(new Date(session.expires_at), { addSuffix: true })}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
    ))
  )

  return (
    <div className="container max-w-4xl mx-auto py-8 px-4">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Active Sessions</h1>
        <p className="text-muted-foreground">
          Manage your active sessions across all devices. You can sign out of individual sessions or all sessions at once.
        </p>
      </div>

      {error && (
        <Alert variant="destructive" className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {success && (
        <Alert className="mb-6">
          <AlertDescription>{success}</AlertDescription>
        </Alert>
      )}

      <div className="mb-6">
        <Button 
          onClick={handleRevokeAllSessions}
          variant="destructive"
          disabled={revoking === 'all' || sessions.length <= 1}
        >
          {revoking === 'all' ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Revoking...
            </>
          ) : (
            'Sign out of all other sessions'
          )}
        </Button>
      </div>

      <div className="space-y-4">
        {sessionsContent}
      </div>
    </div>
  )
}