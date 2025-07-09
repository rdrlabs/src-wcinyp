'use client';


export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html>
      <body>
        <div className="min-h-screen flex items-center justify-center px-4 bg-muted">
          <div className="max-w-md w-full rounded-lg border border-destructive/20 bg-card p-8 text-center shadow-lg">
            <h2 className="mb-4 text-2xl font-semibold text-destructive">
              Critical Error
            </h2>
            <p className="mb-6 text-destructive/80">
              A critical error occurred. Please try refreshing the page.
            </p>
            <p className="mb-6 text-sm text-muted-foreground">
              Error: {error.message}
            </p>
            <button
              onClick={reset}
              className="rounded-md bg-destructive text-destructive-foreground hover:bg-destructive/90 px-6 py-2"
            >
              Reset application
            </button>
          </div>
        </div>
      </body>
    </html>
  );
}