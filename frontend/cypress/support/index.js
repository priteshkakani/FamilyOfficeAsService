// cypress/support/index.js
// Capture browser console errors in Cypress test output
Cypress.on("window:before:load", (win) => {
  win.addEventListener("error", (e) => {
    // Print errors to Cypress output
    // eslint-disable-next-line no-console
    console.error("Cypress captured error:", e.message, e.error);
  });
  win.addEventListener("unhandledrejection", (e) => {
    // eslint-disable-next-line no-console
    console.error("Cypress captured unhandled rejection:", e.reason);
  });
});
