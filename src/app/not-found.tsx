import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center">
        <h1 className="text-2xl font-semibold text-foreground mb-4">404</h1>
        <h2 className="text-2xl font-semibold text-foreground mb-4">
          Page not found
        </h2>
        <p className="text-muted-foreground mb-8">
          Sorry, we couldn&apos;t find the page you&apos;re looking for.
        </p>
        <div className="flex gap-4 justify-center">
          <Link
            href="/"
            className="rounded-md bg-primary text-primary-foreground hover:bg-primary/90 px-4 py-2"
          >
            Go home
          </Link>
          <Link
            href="/documents"
            className="rounded-md bg-secondary text-secondary-foreground hover:bg-secondary/80 px-4 py-2"
          >
            Browse documents
          </Link>
        </div>
      </div>
    </div>
  );
}