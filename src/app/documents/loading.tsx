export default function Loading() {
  return (
    <div className="container mx-auto py-8">
      <div className="mb-8">
        <div className="h-8 w-48 animate-pulse rounded bg-muted"></div>
        <div className="mt-2 h-4 w-64 animate-pulse rounded bg-muted"></div>
      </div>

      <div className="mb-6 space-y-4">
        <div className="flex flex-wrap gap-2">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="h-8 w-24 animate-pulse rounded bg-muted"
            ></div>
          ))}
        </div>
        <div className="h-10 w-full max-w-md animate-pulse rounded bg-muted"></div>
      </div>

      <div className="rounded-md border">
        <div className="p-4">
          {[1, 2, 3, 4, 5].map((i) => (
            <div
              key={i}
              className="mb-4 flex items-center space-x-4 last:mb-0"
            >
              <div className="h-4 w-1/3 animate-pulse rounded bg-muted"></div>
              <div className="h-4 w-20 animate-pulse rounded bg-muted"></div>
              <div className="h-4 w-16 animate-pulse rounded bg-muted"></div>
              <div className="h-4 w-20 animate-pulse rounded bg-muted"></div>
              <div className="ml-auto h-8 w-24 animate-pulse rounded bg-muted"></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}