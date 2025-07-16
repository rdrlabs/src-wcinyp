'use client'

import { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { getSupabaseClient } from '@/lib/supabase-client'
import { authSessionManager } from '@/lib/auth-session'
import { logger } from '@/lib/logger'

export default function AuthCallbackPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [status, setStatus] = useState<'processing' | 'success' | 'error'>('processing')
  const [message, setMessage] = useState('Authenticating...')
  const supabase = getSupabaseClient()

  useEffect(() => {
    async function handleCallback() {
      try {
        // Get the session token from URL
        const sessionToken = searchParams.get('session')
        
        // Check if this is a cross-device auth flow
        if (sessionToken) {
          // This is the device where the magic link was clicked
          // We need to mark the session as authenticated
          const { error } = await authSessionManager.authenticateSession(sessionToken)
          
          if (error) {
            throw new Error('Failed to authenticate session')
          }
          
          setStatus('success')
          setMessage('Authentication successful! You can now close this tab and return to your original device.')
          
          // The original device will detect the authentication through polling
          // and complete the sign-in process automatically
        } else {
          // Standard auth callback flow (same device)
          // Supabase will handle the authentication automatically
          setStatus('success')
          setMessage('Authentication successful! Redirecting...')
          
          // Give Supabase time to process the auth
          setTimeout(() => {
            router.push('/')
          }, 2000)
        }
      } catch (error) {
        logger.error('Auth callback error', error, 'AuthCallback')
        setStatus('error')
        setMessage('Authentication failed. Please try again.')
      }
    }

    handleCallback()
  }, [searchParams, router, supabase])

  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <div className="mx-auto max-w-md space-y-6 p-6 text-center">
        <div className="space-y-2">
          <h1 className="text-2xl font-bold tracking-tight">
            {status === 'processing' && 'Processing Authentication'}
            {status === 'success' && 'Authentication Successful'}
            {status === 'error' && 'Authentication Failed'}
          </h1>
          <p className="text-muted-foreground">{message}</p>
        </div>
        
        {status === 'processing' && (
          <div className="flex justify-center">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
          </div>
        )}
        
        {status === 'success' && (
          <div className="flex justify-center">
            <svg
              className="h-16 w-16 text-green-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
        )}
        
        {status === 'error' && (
          <div className="flex justify-center">
            <svg
              className="h-16 w-16 text-red-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
        )}
      </div>
    </div>
  )
}