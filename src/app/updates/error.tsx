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
          <div className="p-4 bg-red-100 dark:bg-red-900/20 rounded-full">
            <AlertCircle className="h-12 w-12 text-red-600 dark:text-red-400" />
          </div>
        </div>
        
        <h1 className="text-4xl font-bold text-gray-900 dark:text-gray-100 mb-4">
          Updates Error
        </h1>
        
        <p className="text-lg text-gray-600 dark:text-gray-400 mb-2">
          Failed to load updates
        </p>
        
        <p className="text-sm text-gray-500 dark:text-gray-500 mb-8 max-w-md mx-auto">
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
            className="px-6 py-3 bg-gray-200 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-700 transition-colors"
          >
            Go home
          </Link>
        </div>
      </div>
    </div>
  );
}