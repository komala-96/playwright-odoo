// Dev helper: node tools/rpc.js <model> <method> '<args json>' '<kwargs json>'
const { chromium } = require('@playwright/test');
const env = require('../config/env');
(async () => {
  const [model, method, args = '[]', kwargs = '{}'] = process.argv.slice(2);
  const b = await chromium.launch();
  const c = await b.newContext({ storageState: env.AUTH_FILE, baseURL: env.BASE_URL });
  const p = await c.newPage();
  await p.goto('/web/login'); // same-origin page for fetch, no app load
  const r = await p.evaluate(async ({ model, method, args, kwargs }) => {
    const res = await fetch('/web/dataset/call_kw', { method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ jsonrpc: '2.0', method: 'call', params: { model, method, args: JSON.parse(args), kwargs: JSON.parse(kwargs) } }) });
    const j = await res.json(); return j.result ?? j.error?.data?.message;
  }, { model, method, args, kwargs });
  console.log(JSON.stringify(r, null, 1));
  await b.close();
})();
