import { isRouteErrorResponse, useRouteError } from "react-router";
import { Button } from "./ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";

export function ErrorBoundary() {
  const error = useRouteError();
  
  let title = "Oops! Something went wrong";
  let message = "An unexpected error occurred. Please try again.";
  
  if (isRouteErrorResponse(error)) {
    if (error.status === 404) {
      title = "Page Not Found";
      message = "The page you're looking for doesn't exist.";
    } else if (error.status === 401) {
      title = "Unauthorized";
      message = "You need to be logged in to access this page.";
    } else if (error.status === 403) {
      title = "Forbidden";
      message = "You don't have permission to access this page.";
    } else {
      title = `Error ${error.status}`;
      message = error.statusText || message;
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
          {import.meta.env.DEV && error instanceof Error && error.stack && (
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