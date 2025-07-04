// import { isRouteErrorResponse, useRouteError } from "react-router";
import { Button } from "./ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";

interface RouteError {
  status?: number;
  statusText?: string;
}

export function ErrorBoundary() {
  // This component is not used in Next.js app
  const error: Error | RouteError | null = null; // useRouteError();
  
  let title = "Oops! Something went wrong";
  let message = "An unexpected error occurred. Please try again.";
  
  if (false) { // isRouteErrorResponse(error)) {
    const routeError = error as RouteError;
    if (routeError?.status === 404) {
      title = "Page Not Found";
      message = "The page you're looking for doesn't exist.";
    } else if (routeError?.status === 401) {
      title = "Unauthorized";
      message = "You need to be logged in to access this page.";
    } else if (routeError?.status === 403) {
      title = "Forbidden";
      message = "You don't have permission to access this page.";
    } else {
      title = `Error ${routeError?.status}`;
      message = routeError?.statusText || message;
    }
  } else if (error instanceof Error) {
    message = error.message;
  }
  
  const handleReload = () => {
    window.location.reload();
  };
  
  const handleGoHome = () => {
    window.location.href = '/';
  };
  
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Card className="max-w-md w-full">
        <CardHeader>
          <CardTitle className="text-2xl text-red-600">{title}</CardTitle>
          <CardDescription>{message}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {process.env.NODE_ENV === 'development' && error instanceof Error && error.stack && (
            <pre className="text-xs bg-gray-100 p-3 rounded overflow-x-auto">
              <code>{error.stack}</code>
            </pre>
          )}
          <div className="flex gap-3">
            <Button onClick={handleReload} variant="outline">
              Try Again
            </Button>
            <Button onClick={handleGoHome}>
              Go to Dashboard
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}