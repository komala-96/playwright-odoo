// @ts-check
// Performance run against the QA tenant (BASE_URL, default https://martiserv.averigoqa.com).
//   npx playwright test -c perf/playwright.perf.config.js
const { defineConfig, devices } = require('@playwright/test');
const env = require('../config/env');

process.env.RUN_ID = process.env.RUN_ID || String(Date.now());

module.exports = defineConfig({
  testDir: '.',
  testMatch: /.*\.spec\.js/,
  fullyParallel: false,
  workers: 1,
  retries: 0,
  timeout: 60 * 60 * 1000,
  expect: { timeout: 30 * 1000 },
  outputDir: '../test-results/perf',
  reporter: [['list'], ['html', { outputFolder: '../reports/perf-html', open: 'never' }]],
  use: {
    ...devices['Desktop Chrome'],
    headless: process.env.HEADLESS === '1',
    baseURL: env.BASE_URL,
    viewport: { width: 1600, height: 900 },
    actionTimeout: 60 * 1000,
    navigationTimeout: 120 * 1000,
    screenshot: 'only-on-failure',
    trace: 'retain-on-failure',
  },
});
