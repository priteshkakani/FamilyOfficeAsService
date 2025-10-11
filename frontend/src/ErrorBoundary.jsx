import React from "react";

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }
  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }
  componentDidCatch(error, errorInfo) {
    // Optionally log errorInfo
  }
  render() {
    if (this.state.hasError) {
      return (
        <div
          style={{
            padding: 32,
            textAlign: "center",
            color: "#b91c1c",
            fontSize: 20,
          }}
        >
          <span role="img" aria-label="construction">
            🏗️
          </span>{" "}
          Something went wrong.
          <br />
          <pre style={{ color: "#991b1b", marginTop: 16 }}>
            {String(this.state.error)}
          </pre>
        </div>
      );
    }
    return this.props.children;
  }
}

export default ErrorBoundary;
