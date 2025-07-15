'use client'

import Link from 'next/link'
import { useEffect } from 'react'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error)
  }, [error])

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="text-center">
        <div className="mb-8">
          <svg
            className="mx-auto h-16 w-16 text-destructive"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
        </div>
        <h1 className="text-2xl font-semibold text-foreground mb-2">
          Knowledge Base Error
        </h1>
        <p className="text-muted-foreground mb-8 max-w-md">
          {error.message || 'An error occurred while loading the knowledge base'}
        </p>
        <div className="space-x-4">
          <button
            onClick={reset}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-semibold rounded-md text-destructive-foreground bg-destructive hover:bg-destructive/90"
          >
            Try again
          </button>
          <Link
            href="/"
            className="inline-flex items-center px-4 py-2 border border-border text-sm font-semibold rounded-md text-secondary-foreground bg-secondary hover:bg-secondary/80"
          >
            Go home
          </Link>
        </div>
      </div>
    </div>
  )
}