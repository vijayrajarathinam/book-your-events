"use client";

import { Component } from "react";
import { Button } from "@/components/ui/button";
import { AlertTriangle } from "lucide-react";

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    };
  }

  static getDerivedStateFromError(error) {
    return {
      hasError: true,
      error,
      errorInfo: null,
    };
  }

  componentDidCatch(error, errorInfo) {
    this.setState({
      error,
      errorInfo,
    });

    // Log error to an error reporting service
    console.error("Error caught by ErrorBoundary:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex flex-col items-center justify-center p-6 rounded-lg border bg-background/50 min-h-[300px]">
          <AlertTriangle className="h-12 w-12 text-destructive mb-4" />
          <h2 className="text-xl font-bold mb-2">Something went wrong</h2>
          <p className="text-muted-foreground mb-4 text-center">
            We encountered an error while rendering this page
          </p>
          <div className="space-y-4 w-full max-w-md">
            <details className="border rounded-md p-2 text-sm">
              <summary className="font-medium cursor-pointer">
                Error details
              </summary>
              <p className="mt-2 text-destructive">
                {this.state.error?.toString()}
              </p>
              {this.state.errorInfo && (
                <pre className="mt-2 p-2 bg-muted rounded overflow-auto text-xs">
                  {this.state.errorInfo.componentStack}
                </pre>
              )}
            </details>
            <div className="flex justify-center">
              <Button
                onClick={() => {
                  this.setState({
                    hasError: false,
                    error: null,
                    errorInfo: null,
                  });
                  window.location.reload();
                }}
              >
                Try again
              </Button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
