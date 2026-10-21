// @ts-check
const { defineConfig } = require('@playwright/test');

module.exports = defineConfig({
  testDir: './tests',
  // The full customerCareAddress flow walks through every address type, portal
  // users, order products and account setup, each with deliberate settle waits
  // for Odoo's async re-renders, so it easily exceeds the default 2-minute budget.
  timeout: 300_000,
  // All specs share one persistent Chrome profile directory (see fixtures/testFixtures.js),
  // the same way the Java suite pointed every ChromeDriver at one --user-data-dir. Chrome
  // locks a profile dir to a single process, so tests must run serially, not in parallel.
  fullyParallel: false,
  workers: 1,
  retries: 0,
  reporter: [
    ['html', { open: 'always' }],
    ['list'],
  ],
  use: {
    actionTimeout: 30_000,
    navigationTimeout: 60_000,
    screenshot: 'only-on-failure',
    trace: 'retain-on-failure',
    video: 'retain-on-failure',
  },
});
