import React from "react";

type WebGLErrorBoundaryProps = {
  children: React.ReactNode;
  fallback: React.ReactNode;
};

type WebGLErrorBoundaryState = {
  hasError: boolean;
};

export class WebGLErrorBoundary extends React.Component<WebGLErrorBoundaryProps, WebGLErrorBoundaryState> {
  state: WebGLErrorBoundaryState = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback;
    }

    return this.props.children;
  }
}

export function WebGLFallback({ className }: { className?: string }) {
  return <div className={className} aria-hidden="true" />;
}
