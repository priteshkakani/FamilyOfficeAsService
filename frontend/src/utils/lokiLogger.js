// src/utils/lokiLogger.js
// Sends logs to Grafana Loki HTTP API

const LOKI_URL =
  process.env.REACT_APP_LOKI_URL || "http://localhost:3100/loki/api/v1/push";
const APP_NAME = "frontend";

export async function sendLogToLoki(level, message, meta = {}) {
  const streams = [
    {
      stream: {
        level,
        app: APP_NAME,
        ...meta,
      },
      values: [[`${Date.now()}000000`, message]],
    },
  ];
  try {
    await fetch(LOKI_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ streams }),
    });
  } catch (e) {
    // Optionally fallback to console
    // console.error("Loki log failed", e);
  }
}

// Global error handlers
if (typeof window !== "undefined") {
  window.onerror = function (msg, url, line, col, error) {
    sendLogToLoki("error", String(msg), {
      url,
      line,
      col,
      error: error?.stack,
    });
  };
  window.onunhandledrejection = function (event) {
    sendLogToLoki("error", String(event.reason), {
      type: "unhandledrejection",
    });
  };
}
