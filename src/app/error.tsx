'use client';

import Link from 'next/link';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="max-w-md w-full rounded-lg border border-destructive/20 bg-destructive/10 p-8 text-center">
        <h2 className="mb-4 text-2xl font-semibold text-destructive">
          Oops! Something went wrong
        </h2>
        <p className="mb-6 text-destructive/80">
          {error.message || "An unexpected error occurred"}
        </p>
        <div className="flex gap-4 justify-center">
          <button
            onClick={reset}
            className="rounded-md bg-destructive text-destructive-foreground hover:bg-destructive/90 px-4 py-2"
          >
            Try again
          </button>
          <Link
            href="/"
            className="rounded-md bg-secondary px-4 py-2 text-secondary-foreground hover:bg-secondary/80"
          >
            Go home
          </Link>
        </div>
      </div>
    </div>
  );
}