const { defineConfig } = require("cypress");

module.exports = defineConfig({
  e2e: {
    baseUrl: "http://localhost:3000",
    supportFile: "cypress/support/e2e.js",
    specPattern: "cypress/e2e/**/*.cy.{js,jsx,ts,tsx}",
    video: false,
    chromeWebSecurity: false,
    setupNodeEvents(on, config) {
      // Optional plugin: only require if installed. This avoids hard failures
      // in CI/dev environments that don't have the code-coverage plugin.
      try {
        // eslint-disable-next-line global-require
        const coverageTask = require("@cypress/code-coverage/task");
        if (coverageTask) coverageTask(on, config);
      } catch (e) {
        // plugin not installed — continue without coverage
        // eslint-disable-next-line no-console
        console.warn("@cypress/code-coverage not available, skipping plugin");
      }
      return config;
    },
  },
});
