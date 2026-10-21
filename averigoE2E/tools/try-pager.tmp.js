const { chromium } = require('@playwright/test');
const env = require('../config/env');
const { ReportsPage } = require('../pages/ReportsPage');
(async () => {
  const b = await chromium.launch();
  const c = await b.newContext({ storageState: env.AUTH_FILE, baseURL: env.BASE_URL, viewport: { width: 1600, height: 1000 } });
  const p = await c.newPage();
  await p.addLocatorHandler(p.locator('.modal.o_technical_modal').filter({ hasText: 'Open Customer Activities' }), (m) => m.locator('.btn-close').first().click({ timeout: 5000 }).catch(() => m.page().keyboard.press('Escape')));
  const r = new ReportsPage(p);
  await r.openReport('Customer Care', 'Customer Details Report');
  console.log(await p.evaluate(() => [...document.querySelectorAll('.o_action_manager select')].map((s) => s.className + ' => ' + [...s.options].map((o) => o.value + ':' + o.text).join(',')).join('\n')));
  await b.close();
})();
