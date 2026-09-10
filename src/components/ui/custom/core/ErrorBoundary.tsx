import React from "react";
import { Link } from "react-router-dom";

interface Props {
    children: React.ReactNode;
}

interface State {
    failed: boolean;
}

// Without a boundary a throw anywhere in the tree unmounts the whole app and
// leaves an empty document. The fallback deliberately says nothing about the
// failure: the message and the component stack can carry a url, a query or a
// field name from the response that caused it
export class ErrorBoundary extends React.Component<Props, State> {
    state: State = { failed: false };

    static getDerivedStateFromError(): State {
        return { failed: true };
    }

    render(): React.ReactNode {
        if (!this.state.failed) return this.props.children;

        return (
            <div className="flex min-h-screen flex-col items-center justify-center gap-4 px-4 text-center">
                <h1>Something went wrong</h1>
                <p>
                    This page could not be displayed. Try reloading, or head
                    back to the <Link to="/">home page</Link>.
                </p>
            </div>
        );
    }
}
