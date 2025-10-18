// Test setup for frontend unit tests.
// Starts MSW (Mock Service Worker) when TEST_WITH_MOCKS=1 in env.
import "@testing-library/jest-dom";
import { afterEach, beforeAll, afterAll } from "vitest";

// Provide React on the global scope for tests that expect `React` to be in scope
// (some test files were written expecting the old JSX transform).
import React from "react";
if (typeof globalThis !== "undefined") globalThis.React = React;

// Mock react-router hooks used by components (useNavigate) so tests don't need
// to wrap components in a Router. We keep other exports from react-router-dom.
try {
  // vitest global `vi` is available during tests
  vi.mock("react-router-dom", async () => {
    const actual = await vi.importActual("react-router-dom");
    return {
      ...(actual || {}),
      useNavigate: () => vi.fn(),
    };
  });
} catch (e) {
  // ignore if mocking fails in non-test environments
}

let server;
if (process.env.TEST_WITH_MOCKS === "1") {
  // Use dynamic ESM imports so msw (which is ESM) can be loaded reliably under
  // different test runner module resolutions. Register lifecycle hooks only
  // after msw is successfully imported and the server created.
  (async () => {
    try {
      const { setupServer } = await import("msw/node");
      const msw = await import("msw");
      const rest = msw.rest || (msw.default && msw.default.rest);
      const makeHandlersModule = await import("./testMocks/mswHandlers.js");
      const makeHandlers = makeHandlersModule.default || makeHandlersModule;
      const handlers =
        typeof makeHandlers === "function" ? makeHandlers(rest) : makeHandlers;
      server = setupServer(...(handlers || []));

      beforeAll(() => server.listen({ onUnhandledRequest: "warn" }));
      afterAll(() => server.close());
      afterEach(() => server.resetHandlers());
    } catch (e) {
      // eslint-disable-next-line no-console
      console.warn(
        "MSW dynamic import failed; skipping mock server startup.",
        e && e.message
      );
    }
  })();
}
// If MSW couldn't be started, fall back to a lightweight module mock of
// supabaseClient which lives in src/__mocks__/supabaseClient.js
if (!server) {
  // vitest provides a global `vi` to mock modules; only do this in test env
  if (typeof vi !== "undefined" && vi && vi.mock) {
    // point any import of ../supabaseClient or ./supabaseClient to our mock
    try {
      // Common relative paths used across the codebase; register them all.
      // Use inline factory functions to avoid scoping/hoisting issues.
      try {
        vi.mock("./supabaseClient", () =>
          require("./__mocks__/supabaseClient.js")
        );
      } catch (e) {}
      try {
        vi.mock("../supabaseClient", () =>
          require("./__mocks__/supabaseClient.js")
        );
      } catch (e) {}
      try {
        vi.mock("../../supabaseClient", () =>
          require("./__mocks__/supabaseClient.js")
        );
      } catch (e) {}
      try {
        vi.mock("/src/supabaseClient", () =>
          require("./__mocks__/supabaseClient.js")
        );
      } catch (e) {}
    } catch (e) {
      // ignore
    }
  }
}

// Polyfill ResizeObserver used by some chart libraries (recharts) so tests
// that mount responsive charts don't crash in the Node environment.
if (typeof globalThis.ResizeObserver === "undefined") {
  // Minimal noop implementation suitable for tests.
  class ResizeObserver {
    observe() {}
    unobserve() {}
    disconnect() {}
  }
  globalThis.ResizeObserver = ResizeObserver;
}

// Provide a lightweight module mock for 'recharts' in the test environment so
// ResponsiveContainer and chart components don't rely on actual layout in JSDOM
// (which can cause width/height 0 warnings). This only runs when `vi` is
// available (i.e. under Vitest/Jest).
try {
  if (typeof vi !== "undefined" && vi && vi.mock) {
    vi.mock("recharts", () => {
      const React = require("react");
      // Filter out non-DOM props that Recharts components use so we don't pass
      // invalid attributes into real DOM elements in JSDOM tests.
      const filterProps = (props) => {
        const { dataKey, nameKey, outerRadius, innerRadius, label, ...rest } =
          props || {};
        // ensure label isn't boolean when forwarded
        if (typeof label === "boolean") rest.label = String(label);
        return rest;
      };
      const Dummy = ({ children, ...props }) =>
        React.createElement(
          "div",
          { style: { width: "100%", height: 300 }, ...filterProps(props) },
          children
        );

      return {
        ResponsiveContainer: Dummy,
        BarChart: Dummy,
        LineChart: Dummy,
        PieChart: Dummy,
        Pie: Dummy,
        Cell: (p) => React.createElement("div", filterProps(p)),
        Bar: Dummy,
        Line: Dummy,
        XAxis: () => React.createElement("div", null),
        YAxis: () => React.createElement("div", null),
        Tooltip: () => React.createElement("div", null),
        Legend: () => React.createElement("div", null),
        CartesianGrid: () => React.createElement("div", null),
      };
    });
  }
} catch (e) {
  // ignore if mocking not possible in current environment
}

// Intercept axios POST calls to avoid network errors in onboarding tests.
try {
  const axios = require("axios");
  if (axios && axios.post) {
    const originalPost = axios.post.bind(axios);
    axios.post = async (url, data, config) => {
      // Quick heuristic: if calling local API endpoints used in tests, return success
      if (
        typeof url === "string" &&
        (url.includes("/api/v1/users/signup") || url.includes("localhost:8000"))
      ) {
        return { data: { id: "user-test-1", ...data }, status: 200 };
      }
      return originalPost(url, data, config);
    };
  }
} catch (e) {
  // ignore if axios isn't available
}

// Additionally, mock axios module via vi to make sure axios.post isn't replaced
try {
  if (typeof vi !== "undefined" && vi && vi.mock) {
    vi.mock("axios", () => {
      const mock = {
        post: (url, data) => {
          if (
            typeof url === "string" &&
            (url.includes("/api/v1/users/signup") ||
              url.includes("localhost:8000"))
          ) {
            return Promise.resolve({
              data: { user_id: "user-test-1", ...data },
              status: 200,
            });
          }
          return Promise.resolve({ data: {}, status: 200 });
        },
        get: () => Promise.resolve({ data: {} }),
        create: () => ({ post: () => Promise.resolve({ data: {} }) }),
      };
      return { __esModule: true, default: mock, ...mock };
    });
  }
} catch (e) {
  // ignore
}

// Export server for tests that want to set handlers at runtime.
export { server };
