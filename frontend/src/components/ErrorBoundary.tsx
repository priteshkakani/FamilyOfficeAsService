import React from "react";
import { logError, logRemote } from "../utils/logger";

export class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, info) {
    logError("React runtime error:", error, info);
    logRemote && logRemote("error", error.message, { info });
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: 32, textAlign: "center" }}>
          <h2>Something went wrong.</h2>
          <pre style={{ color: "#b91c1c" }}>{this.state.error?.message}</pre>
        </div>
      );
    }
    return this.props.children;
  }
}
