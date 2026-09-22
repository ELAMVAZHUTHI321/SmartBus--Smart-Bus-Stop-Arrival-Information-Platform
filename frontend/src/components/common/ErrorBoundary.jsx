import { Component } from "react";

export default class ErrorBoundary extends Component {
  state = { error: null, stack: null };

  static getDerivedStateFromError(error) {
    return { error, stack: null };
  }

  componentDidCatch(error, info) {
    this.setState({ stack: info?.componentStack || null });
  }

  render() {
    if (this.state.error) {
      return (
        <pre
          style={{
            margin: "24px",
            padding: "16px",
            background: "#0f172a",
            color: "#f87171",
            whiteSpace: "pre-wrap",
            fontFamily: "monospace",
            fontSize: "12px",
          }}
        >
          {"FATAL: " + (this.state.error?.message || String(this.state.error)) + "\n\n" + (this.state.stack || "")}
        </pre>
      );
    }
    return this.props.children;
  }
}