import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: "./frontend/src/setupTests.js",
    include: [
      "frontend/src/__tests__/**/*.test.*",
      "frontend/src/tests/**/*.test.*",
    ],
    exclude: [
      "**/*.integration.*",
      "frontend/src/tests/supabase.integration.test.js",
    ],
  },
});
