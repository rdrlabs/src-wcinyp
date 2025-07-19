import React, { Component, ErrorInfo, ReactNode } from 'react';
import { Button } from '../ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { AlertCircle, RefreshCw, Home } from 'lucide-react';
import { logger } from '@/lib/logger';

interface Props {
  children: ReactNode;
  fallbackTitle?: string;
  fallbackMessage?: string;
  onReset?: () => void;
  showHomeButton?: boolean;
  customActions?: ReactNode;
  logContext?: string;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

export class BaseErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error, errorInfo: null };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    const { logContext = 'Unknown' } = this.props;
    
    logger.error(`Error caught in ${logContext} ErrorBoundary`, {
      error: {
        message: error.message,
        stack: error.stack,
        name: error.name
      },
      errorInfo: {
        componentStack: errorInfo.componentStack
      },
      timestamp: new Date().toISOString()
    });
    
    this.setState({ errorInfo });
  }

  handleReset = () => {
    const { onReset } = this.props;
    
    if (onReset) {
      onReset();
    }
    
    this.setState({ hasError: false, error: null, errorInfo: null });
  };

  handleReload = () => {
    window.location.reload();
  };

  handleGoHome = () => {
    window.location.href = '/';
  };

  render() {
    const { 
      children, 
      fallbackTitle = "Something went wrong", 
      fallbackMessage = "An unexpected error occurred. Please try again.",
      showHomeButton = true,
      customActions
    } = this.props;
    
    const { hasError, error, errorInfo } = this.state;

    if (hasError) {
      return (
        <div className="flex items-center justify-center p-4 min-h-[400px]">
          <Card className="max-w-md w-full">
            <CardHeader>
              <div className="flex items-center gap-2">
                <AlertCircle className="h-5 w-5 text-destructive" />
                <CardTitle className="text-xl text-destructive">{fallbackTitle}</CardTitle>
              </div>
              <CardDescription>{fallbackMessage}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {process.env.NODE_ENV === 'development' && error && (
                <div className="space-y-2">
                  <p className="text-sm font-medium text-muted-foreground">Error Details:</p>
                  <pre className="text-xs bg-muted p-3 rounded overflow-x-auto max-h-40 overflow-y-auto">
                    <code>{error.message}</code>
                  </pre>
                  {error.stack && (
                    <details className="text-xs">
                      <summary className="cursor-pointer text-muted-foreground hover:text-foreground">
                        View Stack Trace
                      </summary>
                      <pre className="mt-2 bg-muted p-3 rounded overflow-x-auto max-h-60 overflow-y-auto">
                        <code>{error.stack}</code>
                      </pre>
                    </details>
                  )}
                  {errorInfo?.componentStack && (
                    <details className="text-xs">
                      <summary className="cursor-pointer text-muted-foreground hover:text-foreground">
                        View Component Stack
                      </summary>
                      <pre className="mt-2 bg-muted p-3 rounded overflow-x-auto max-h-60 overflow-y-auto">
                        <code>{errorInfo.componentStack}</code>
                      </pre>
                    </details>
                  )}
                </div>
              )}
              
              <div className="flex gap-2 flex-wrap">
                <Button onClick={this.handleReset} variant="default" size="sm">
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Try Again
                </Button>
                <Button onClick={this.handleReload} variant="outline" size="sm">
                  Reload Page
                </Button>
                {showHomeButton && (
                  <Button onClick={this.handleGoHome} variant="outline" size="sm">
                    <Home className="h-4 w-4 mr-2" />
                    Go Home
                  </Button>
                )}
                {customActions}
              </div>
            </CardContent>
          </Card>
        </div>
      );
    }

    return children;
  }
}