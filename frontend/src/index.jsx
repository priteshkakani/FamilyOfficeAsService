console.log("Vercel env check:", import.meta.env.VITE_SUPABASE_URL);
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import { ErrorBoundary } from "./components/ErrorBoundary";
import { logError } from "./utils/logger";

// Global error listeners
window.addEventListener("error", (e) => {
  logError("Global error:", e.message, e.error);
});
window.addEventListener("unhandledrejection", (e) => {
  logError("Unhandled promise rejection:", e.reason);
});

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </React.StrictMode>
);
