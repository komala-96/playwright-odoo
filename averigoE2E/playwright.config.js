// @ts-check
const { defineConfig, devices } = require('@playwright/test');
const env = require('./config/env');

// One RUN_ID per `playwright test` invocation. Set here (main process) so all
// workers inherit the same value and every spec shares the same test data
// suffix. Export RUN_ID yourself to resume/re-run against an earlier run.
process.env.RUN_ID = process.env.RUN_ID || String(Date.now());

module.exports = defineConfig({
  testDir: './tests',
  // The test cases are one chained business flow (master data -> products ->
  // sales -> AR -> purchase -> AP -> reports), so files run in name order on
  // a single worker and tests inside a file run serially.
  fullyParallel: false,
  workers: 1,
  retries: 0,
  // Business flows (order -> delivery -> invoice -> payment) are long on this instance.
  timeout: 15 * 60 * 1000,
  expect: { timeout: 20 * 1000 },
  reporter: [
    ['list'],
    ['html', { outputFolder: 'reports/html', open: 'never' }],
    ['./reporters/excelExecutionReporter.js', { outputFile: 'reports/Execution_Results.xlsx' }],
  ],
  use: {
    ...devices['Desktop Chrome'],
    // Headed by default (browser visible). Set HEADLESS=1 for CI / machines without a display.
    headless: process.env.HEADLESS === '1',
    baseURL: env.BASE_URL,
    viewport: { width: 1600, height: 900 },
    actionTimeout: 30 * 1000,
    navigationTimeout: 60 * 1000,
    screenshot: 'only-on-failure',
    trace: 'retain-on-failure',
    video: 'retain-on-failure',
  },
});
