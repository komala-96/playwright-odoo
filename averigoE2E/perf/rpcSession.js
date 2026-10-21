// Opens one authenticated browser page on the QA tenant and exposes rpc(model, method, args, kwargs).
// Used by the perf suite to seed bulk data and time server calls (same /web/dataset/call_kw endpoint the UI uses).
const { chromium } = require('@playwright/test');
const env = require('../config/env');

async function openRpc() {
  const browser = await chromium.launch();
  const context = await browser.newContext({ storageState: env.AUTH_FILE, baseURL: env.BASE_URL });
  const page = await context.newPage();
  await page.goto('/web/login');
  const rpc = (model, method, args = [], kwargs = {}) => page.evaluate(async ({ model, method, args, kwargs }) => {
    const res = await fetch('/web/dataset/call_kw', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ jsonrpc: '2.0', method: 'call', params: { model, method, args, kwargs } }),
    });
    const j = await res.json();
    if (j.error) throw new Error(`${model}.${method}: ${j.error.data?.message || j.error.message}`);
    return j.result;
  }, { model, method, args, kwargs });
  return { browser, page, rpc, close: () => browser.close() };
}

module.exports = { openRpc };
