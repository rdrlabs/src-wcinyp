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
        <div className="min-h-screen flex items-center justify-center px-4 bg-gray-50">
          <div className="max-w-md w-full rounded-lg border border-red-200 bg-white p-8 text-center shadow-lg">
            <h2 className="mb-4 text-2xl font-bold text-red-900">
              Critical Error
            </h2>
            <p className="mb-6 text-red-700">
              A critical error occurred. Please try refreshing the page.
            </p>
            <p className="mb-6 text-sm text-gray-600">
              Error: {error.message}
            </p>
            <button
              onClick={reset}
              className="rounded-md bg-red-600 px-6 py-2 text-white hover:bg-red-700"
            >
              Reset application
            </button>
          </div>
        </div>
      </body>
    </html>
  );
}