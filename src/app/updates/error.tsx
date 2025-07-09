'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { AlertCircle } from 'lucide-react';

export default function UpdatesError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Updates page error:', error);
  }, [error]);

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="text-center">
        <div className="flex justify-center mb-6">
          <div className="p-4 bg-destructive/20 dark:bg-destructive/20 rounded-full">
            <AlertCircle className="h-12 w-12 text-destructive" />
          </div>
        </div>
        
        <h1 className="text-2xl font-semibold text-foreground mb-4">
          Updates Error
        </h1>
        
        <p className="text-lg text-muted-foreground mb-2">
          Failed to load updates
        </p>
        
        <p className="text-sm text-muted-foreground mb-8 max-w-md mx-auto">
          {error.message || 'An unexpected error occurred while loading the updates page'}
        </p>
        
        <div className="flex gap-4 justify-center">
          <button
            onClick={reset}
            className="px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
          >
            Try again
          </button>
          
          <Link
            href="/"
            className="px-6 py-3 bg-secondary text-secondary-foreground rounded-lg hover:bg-secondary/80 transition-colors"
          >
            Go home
          </Link>
        </div>
      </div>
    </div>
  );
}