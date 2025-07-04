'use client';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="max-w-md w-full rounded-lg border border-red-200 bg-red-50 p-8 text-center">
        <h2 className="mb-4 text-2xl font-bold text-red-900">
          Oops! Something went wrong
        </h2>
        <p className="mb-6 text-red-700">
          {error.message || "An unexpected error occurred"}
        </p>
        <div className="flex gap-4 justify-center">
          <button
            onClick={reset}
            className="rounded-md bg-red-600 px-4 py-2 text-white hover:bg-red-700"
          >
            Try again
          </button>
          <a
            href="/"
            className="rounded-md bg-gray-600 px-4 py-2 text-white hover:bg-gray-700"
          >
            Go home
          </a>
        </div>
      </div>
    </div>
  );
}