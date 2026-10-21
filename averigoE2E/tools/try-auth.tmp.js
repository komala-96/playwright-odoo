const { chromium } = require('@playwright/test');
const env = require('../config/env');
(async () => {
  const b = await chromium.launch();
  const c = await b.newContext({ storageState: env.AUTH_FILE, baseURL: env.BASE_URL });
  const p = await c.newPage();
  await p.goto('/odoo', { waitUntil: 'domcontentloaded', timeout: 90000 }).catch((e) => console.log('goto err', e.message));
  await p.waitForTimeout(5000);
  console.log('URL:', p.url());
  await p.screenshot({ path: 'tools/last.png' }); console.log('title:', await p.title(), '| body:', (await p.locator('body').innerText()).slice(0, 300).replace(/\n+/g, ' | '));
  console.log('navbar:', await p.locator('.o_main_navbar').count(), 'login form:', await p.locator('input[name="login"]').count());
  await b.close();
})();
