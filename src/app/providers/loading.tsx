export default function Loading() {
  return (
    <div className="container mx-auto py-8">
      <div className="mb-8">
        <div className="h-8 w-48 animate-pulse rounded bg-gray-200"></div>
        <div className="mt-2 h-4 w-64 animate-pulse rounded bg-gray-200"></div>
      </div>

      <div className="mb-6">
        <div className="h-10 w-full max-w-md animate-pulse rounded bg-gray-200"></div>
      </div>

      <div className="rounded-md border">
        <div className="p-4">
          {[1, 2, 3, 4, 5].map((i) => (
            <div
              key={i}
              className="mb-4 flex items-center space-x-4 last:mb-0"
            >
              <div className="h-4 w-1/4 animate-pulse rounded bg-gray-200"></div>
              <div className="h-4 w-1/6 animate-pulse rounded bg-gray-200"></div>
              <div className="h-4 w-1/6 animate-pulse rounded bg-gray-200"></div>
              <div className="h-4 w-1/6 animate-pulse rounded bg-gray-200"></div>
              <div className="ml-auto h-8 w-20 animate-pulse rounded bg-gray-200"></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}