export default function UpdatesLoading() {
  return (
    <div className="container mx-auto py-8">
      <div className="mb-8">
        <div className="h-8 w-48 bg-muted rounded animate-pulse mb-4" />
        <div className="h-6 w-96 bg-muted rounded animate-pulse" />
      </div>
      
      <div className="border rounded-lg p-12">
        <div className="flex flex-col items-center">
          <div className="h-8 w-32 bg-muted rounded animate-pulse mb-4" />
          <div className="h-6 w-80 bg-muted rounded animate-pulse mb-2" />
          <div className="h-6 w-72 bg-muted rounded animate-pulse" />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="p-6 border rounded-lg">
              <div className="flex items-center gap-4 mb-3">
                <div className="h-8 w-8 bg-muted rounded-lg animate-pulse" />
                <div className="h-6 w-32 bg-muted rounded animate-pulse" />
              </div>
              <div className="h-4 w-full bg-muted rounded animate-pulse mb-2" />
              <div className="h-4 w-5/6 bg-muted rounded animate-pulse mb-3" />
              <div className="h-3 w-24 bg-muted rounded animate-pulse" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}