export default function Loading() {
  return (
    <div className="container mx-auto py-8">
      <div className="mb-8">
        <div className="h-8 w-48 animate-pulse rounded bg-gray-200"></div>
        <div className="mt-2 h-4 w-96 animate-pulse rounded bg-gray-200"></div>
      </div>

      <div className="mb-8 flex gap-4">
        <div className="h-10 w-40 animate-pulse rounded bg-gray-200"></div>
        <div className="h-10 flex-1 animate-pulse rounded bg-gray-200"></div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div
            key={i}
            className="h-48 animate-pulse rounded-lg border bg-gray-50 p-6"
          >
            <div className="mb-3 h-5 w-3/4 animate-pulse rounded bg-gray-200"></div>
            <div className="mb-2 h-4 w-1/2 animate-pulse rounded bg-gray-200"></div>
            <div className="mb-4 h-3 w-full animate-pulse rounded bg-gray-200"></div>
            <div className="flex gap-2">
              <div className="h-3 w-16 animate-pulse rounded bg-gray-200"></div>
              <div className="h-3 w-20 animate-pulse rounded bg-gray-200"></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}