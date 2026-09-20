import React, { Component, type ErrorInfo, type ReactNode } from 'react';
import { RotateCw, AlertTriangle, Home } from 'lucide-react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  isChunkError: boolean;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
    isChunkError: false,
  };

  public static getDerivedStateFromError(error: Error): State {
    const isChunk = Boolean(
      error?.message?.includes('dynamically imported module') ||
      error?.message?.includes('Failed to fetch dynamically imported module') ||
      error?.message?.includes('Importing a module script failed') ||
      error?.message?.includes('disallowed MIME type')
    );
    return { hasError: true, error, isChunkError: isChunk };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error in component tree:', error, errorInfo);
    if (this.state.isChunkError) {
      const lastReload = sessionStorage.getItem('last_chunk_reload');
      const now = Date.now();
      if (!lastReload || now - parseInt(lastReload) > 10000) {
        sessionStorage.setItem('last_chunk_reload', now.toString());
        window.location.reload();
      }
    }
  }

  private handleReload = () => {
    window.location.reload();
  };

  private handleGoHome = () => {
    this.setState({ hasError: false, error: null, isChunkError: false });
    window.location.href = '/';
  };

  public render() {
    if (this.state.hasError) {
      if (this.state.isChunkError) {
        return (
          <div style={{
            minHeight: '60vh',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: 32,
            textAlign: 'center',
          }}>
            <div style={{
              width: 64,
              height: 64,
              borderRadius: '50%',
              background: 'rgba(37, 99, 235, 0.1)',
              color: '#2563eb',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: 20,
            }}>
              <RotateCw size={32} />
            </div>
            <h2 style={{ fontSize: '1.4rem', fontWeight: 800, marginBottom: 8, color: 'var(--text-main)' }}>
              Application Updated
            </h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', maxWidth: 450, marginBottom: 24, lineHeight: 1.6 }}>
              A newer version of HandleMyFile was deployed. Please reload the page to continue seamlessly.
            </p>
            <button
              onClick={this.handleReload}
              className="btn-primary"
              style={{ padding: '12px 24px', fontSize: '0.95rem', display: 'inline-flex', alignItems: 'center', gap: 8 }}
            >
              <RotateCw size={18} />
              <span>Reload Page</span>
            </button>
          </div>
        );
      }

      return (
        <div style={{
          minHeight: '60vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: 32,
          textAlign: 'center',
        }}>
          <div style={{
            width: 64,
            height: 64,
            borderRadius: '50%',
            background: 'rgba(239, 68, 68, 0.1)',
            color: '#ef4444',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: 20,
          }}>
            <AlertTriangle size={32} />
          </div>
          <h2 style={{ fontSize: '1.4rem', fontWeight: 800, marginBottom: 8, color: 'var(--text-main)' }}>
            Something went wrong
          </h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', maxWidth: 450, marginBottom: 24, lineHeight: 1.6 }}>
            {this.state.error?.message || 'An unexpected error occurred while loading this page.'}
          </p>
          <div style={{ display: 'flex', gap: 12 }}>
            <button
              onClick={this.handleReload}
              className="btn-secondary"
              style={{ padding: '12px 24px', fontSize: '0.95rem', display: 'inline-flex', alignItems: 'center', gap: 8 }}
            >
              <RotateCw size={18} />
              <span>Try Again</span>
            </button>
            <button
              onClick={this.handleGoHome}
              className="btn-primary"
              style={{ padding: '12px 24px', fontSize: '0.95rem', display: 'inline-flex', alignItems: 'center', gap: 8 }}
            >
              <Home size={18} />
              <span>Go to Home</span>
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
