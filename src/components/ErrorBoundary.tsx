'use client';

import React, { Component, ErrorInfo, ReactNode } from 'react';
import { motion } from 'framer-motion';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Log error to error reporting service in production
    if (process.env.NODE_ENV === 'production') {
      // TODO: Integrate with error reporting service (e.g., Sentry)
      // Sentry.captureException(error, { contexts: { react: { componentStack: errorInfo.componentStack } } });
    } else {
      console.error('ErrorBoundary caught an error:', error, errorInfo);
    }
  }

  public render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="min-h-screen flex items-center justify-center bg-zinc-950 p-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-md w-full rounded-2xl border border-zinc-800 bg-zinc-900/50 backdrop-blur-xl p-8"
          >
            <div className="text-center">
              <div className="text-6xl mb-4">⚠️</div>
              <h1 className="text-2xl font-bold text-zinc-100 mb-2">
                Something went wrong
              </h1>
              <p className="text-zinc-400 mb-6">
                We&apos;re sorry, but something unexpected happened. Please try refreshing the page.
              </p>
              {process.env.NODE_ENV === 'development' && this.state.error && (
                <details className="text-left mb-6">
                  <summary className="text-sm text-zinc-500 cursor-pointer mb-2">
                    Error details (development only)
                  </summary>
                  <pre className="text-xs text-red-400 bg-zinc-950 p-4 rounded overflow-auto">
                    {this.state.error.toString()}
                    {this.state.error.stack}
                  </pre>
                </details>
              )}
              <button
                onClick={() => {
                  this.setState({ hasError: false, error: null });
                  window.location.reload();
                }}
                className="px-6 py-3 rounded-lg bg-gradient-to-r from-piko-teal to-piko-pink font-semibold text-white shadow-lg shadow-piko-pink/20 transition-all hover:scale-105 hover:shadow-piko-pink/40"
              >
                Refresh Page
              </button>
            </div>
          </motion.div>
        </div>
      );
    }

    return this.props.children;
  }
}

