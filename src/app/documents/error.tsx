'use client';


export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="container mx-auto py-8">
      <div className="rounded-lg border border-destructive/20 bg-destructive/10 p-8 text-center">
        <h2 className="mb-4 text-2xl font-semibold text-destructive">
          Something went wrong!
        </h2>
        <p className="mb-6 text-destructive/80">
          {error.message || "Failed to load documents"}
        </p>
        <button
          onClick={reset}
          className="rounded-md bg-destructive text-destructive-foreground hover:bg-destructive/90 px-4 py-2"
        >
          Try again
        </button>
      </div>
    </div>
  );
}