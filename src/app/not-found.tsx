import Link from 'next/link';
import { AlertCircle } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-start justify-center px-4 pt-32">
      <div className="text-center">
        <h1 className="text-5xl font-semibold text-foreground mb-6">404</h1>
        <div className="flex items-center justify-center mb-8">
          <div className="relative bg-muted rounded-lg p-8">
            <p className="text-2xl font-medium flex items-center gap-3">
              <AlertCircle className="h-7 w-7 text-destructive flex-shrink-0" />
              Oh no! VIDA 1 is down!
            </p>
          </div>
        </div>
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