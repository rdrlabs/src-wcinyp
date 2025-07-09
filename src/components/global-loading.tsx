'use client';

import { useAppLoading } from '@/contexts/app-context';
import { Loader2 } from 'lucide-react';

export function GlobalLoading() {
  const { isLoading, loadingMessage } = useAppLoading();

  if (!isLoading) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm">
      <div className="flex flex-col items-center gap-4">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        {loadingMessage && (
          <p className="text-sm text-muted-foreground">{loadingMessage}</p>
        )}
      </div>
    </div>
  );
}

// Simple loading spinner component
export function LoadingSpinner({ className }: { className?: string }) {
  return <Loader2 className={`animate-spin ${className || 'h-4 w-4'}`} />;
}

// Skeleton loader for content
export function ContentSkeleton({ lines = 3 }: { lines?: number }) {
  return (
    <div className="space-y-3">
      {Array.from({ length: lines }).map((_, i) => (
        <div
          key={i}
          className="h-4 animate-pulse rounded bg-muted"
          style={{
            width: `${Math.random() * 40 + 60}%`,
          }}
        />
      ))}
    </div>
  );
}

// Table skeleton loader
export function TableSkeleton({ rows = 5, columns = 4 }: { rows?: number; columns?: number }) {
  return (
    <div className="rounded-md border">
      <div className="border-b p-4">
        <div className="flex gap-4">
          {Array.from({ length: columns }).map((_, i) => (
            <div key={i} className="h-4 w-24 animate-pulse rounded bg-muted" />
          ))}
        </div>
      </div>
      <div className="divide-y">
        {Array.from({ length: rows }).map((_, rowIndex) => (
          <div key={rowIndex} className="p-4">
            <div className="flex gap-4">
              {Array.from({ length: columns }).map((_, colIndex) => (
                <div
                  key={colIndex}
                  className="h-4 animate-pulse rounded bg-muted"
                  style={{
                    width: `${Math.random() * 60 + 40}px`,
                  }}
                />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// Card skeleton loader
export function CardSkeleton() {
  return (
    <div className="rounded-lg border p-6">
      <div className="space-y-3">
        <div className="h-6 w-3/4 animate-pulse rounded bg-muted" />
        <div className="h-4 w-1/2 animate-pulse rounded bg-muted" />
        <div className="space-y-2 pt-4">
          <div className="h-4 animate-pulse rounded bg-muted" />
          <div className="h-4 w-5/6 animate-pulse rounded bg-muted" />
        </div>
      </div>
    </div>
  );
}