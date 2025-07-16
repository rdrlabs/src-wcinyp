'use client'

import React from 'react'
import { useAuth } from '@/contexts/auth-context'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { CheckCircle, XCircle, Loader2 } from 'lucide-react'

export function AuthTest() {
  const { user, loading, error } = useAuth()

  if (loading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center p-6">
          <Loader2 className="h-6 w-6 animate-spin" />
          <span className="ml-2">Checking authentication...</span>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Authentication Status</CardTitle>
        <CardDescription>
          Testing Supabase authentication integration
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        
        <div className="flex items-center gap-2">
          {user ? (
            <>
              <CheckCircle className="h-5 w-5 text-green-600" />
              <span className="font-medium">Authenticated</span>
            </>
          ) : (
            <>
              <XCircle className="h-5 w-5 text-red-600" />
              <span className="font-medium">Not authenticated</span>
            </>
          )}
        </div>

        {user && (
          <div className="space-y-2 text-sm">
            <div>
              <span className="font-medium">Email:</span> {user.email}
            </div>
            <div>
              <span className="font-medium">NetID:</span> {user.email?.split('@')[0]}
            </div>
            <div>
              <span className="font-medium">User ID:</span> {user.id}
            </div>
          </div>
        )}

        <div className="pt-2">
          <p className="text-sm text-muted-foreground">
            {user 
              ? 'You have access to the WCINYP application.'
              : 'Please sign in with your @med.cornell.edu email to access the application.'}
          </p>
        </div>
      </CardContent>
    </Card>
  )
}