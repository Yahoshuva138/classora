import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';

interface Props {
  children: ReactNode;
  fallbackTitle?: string;
  onReset?: () => void;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = { hasError: false, error: null };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('[Classora ErrorBoundary caught error]:', error, errorInfo);
  }

  private handleReset = () => {
    this.setState({ hasError: false, error: null });
    if (this.props.onReset) this.props.onReset();
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-[280px] flex flex-col items-center justify-center p-6 sm:p-8 bg-white rounded-3xl border border-rose-200 shadow-sm text-center my-4">
          <div className="w-12 h-12 rounded-2xl bg-rose-100 text-rose-600 flex items-center justify-center mb-4 shadow-sm">
            <AlertTriangle className="w-6 h-6" />
          </div>
          <h3 className="text-base sm:text-lg font-bold text-slate-900 mb-1">
            {this.props.fallbackTitle || 'Something went wrong in this view'}
          </h3>
          <p className="text-xs text-slate-500 max-w-md mb-4 font-mono bg-slate-50 p-2.5 rounded-xl border border-slate-200 text-left overflow-x-auto">
            {this.state.error?.message || 'Unexpected rendering error occurred.'}
          </p>
          <div className="flex flex-wrap items-center justify-center gap-2">
            <button
              onClick={this.handleReset}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-all shadow-sm flex items-center gap-1.5"
            >
              <RefreshCw className="w-3.5 h-3.5" /> Try Again
            </button>
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold transition-colors flex items-center gap-1.5"
            >
              <Home className="w-3.5 h-3.5" /> Reload Application
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}
