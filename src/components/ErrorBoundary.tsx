"use client";

import React, { Component, ErrorInfo, ReactNode } from "react";

interface Props {
    children?: ReactNode;
}

interface State {
    hasError: boolean;
    error?: Error;
}

class ErrorBoundary extends Component<Props, State> {
    public state: State = {
        hasError: false
    };

    public static getDerivedStateFromError(error: Error): State {
        return { hasError: true, error };
    }

    public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        console.error("Uncaught error:", error, errorInfo);
    }

    public render() {
        if (this.state.hasError) {
            return (
                <div className="min-h-screen bg-background-dark flex items-center justify-center p-8 text-white">
                    <div className="max-w-md w-full bg-surface border border-red-500/20 rounded-2xl p-8 text-center space-y-6">
                        <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mx-auto text-red-500 border border-red-500/20">
                            <span className="material-icons text-3xl">error_outline</span>
                        </div>
                        <div>
                            <h2 className="text-xl font-bold mb-2">Something went wrong</h2>
                            <p className="text-slate-400 text-sm">
                                The application encountered an unexpected error. Please try refreshing the page.
                            </p>
                        </div>
                        <button
                            onClick={() => window.location.reload()}
                            className="w-full py-3 bg-primary text-white font-bold rounded-xl hover:bg-primary/90 transition-all flex items-center justify-center gap-2"
                        >
                            <span className="material-icons text-sm">refresh</span>
                            Reload Dashboard
                        </button>
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;
