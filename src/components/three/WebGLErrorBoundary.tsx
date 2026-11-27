"use client";

import React, { Component, type ReactNode } from "react";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
}

export class WebGLErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  componentDidCatch() {
    // Gracefully degrade to static atmospheric backdrop if WebGL fails
  }

  render() {
    if (this.state.hasError) {
      return (
        this.props.fallback ?? (
          <div
            aria-hidden="true"
            className="h-full w-full bg-[radial-gradient(ellipse_at_top,_rgba(91,140,255,0.16),_transparent_55%),radial-gradient(ellipse_at_bottom_right,_rgba(155,107,255,0.12),_transparent_50%)]"
          />
        )
      );
    }
    return this.props.children;
  }
}

export function useWebGLSupport(): boolean {
  const [supported, setSupported] = React.useState(true);

  React.useEffect(() => {
    try {
      const canvas = document.createElement("canvas");
      const gl =
        canvas.getContext("webgl2") ||
        canvas.getContext("webgl") ||
        canvas.getContext("experimental-webgl");
      if (!gl) {
        setSupported(false);
      }
    } catch {
      setSupported(false);
    }
  }, []);

  return supported;
}

export function usePrefersReducedMotion(): boolean {
  const [reduced, setReduced] = React.useState(false);

  React.useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(mq.matches);
    const handler = (e: MediaQueryListEvent) => setReduced(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  return reduced;
}
