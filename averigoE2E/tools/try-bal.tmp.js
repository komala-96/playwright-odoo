const { chromium } = require('@playwright/test');
const env = require('../config/env');
const d = require('../data/testData');
const { CustomerCarePage } = require('../pages/CustomerCarePage');
(async () => {
  const b = await chromium.launch();
  const c = await b.newContext({ storageState: env.AUTH_FILE, baseURL: env.BASE_URL, viewport: { width: 1600, height: 1000 } });
  const p = await c.newPage();
  await p.addLocatorHandler(p.locator('.modal.o_technical_modal').filter({ hasText: 'Open Customer Activities' }), (m) => m.locator('.btn-close').first().click({ timeout: 5000 }).catch(() => m.page().keyboard.press('Escape')));
  const cc = new CustomerCarePage(p);
  for (let i = 0; i < 2; i++) {
    await cc.openCustomer(d.customer1.name);
    for (const f of ['customer_balance', 'total_due', 'credit', 'invoice_balance']) {
      const vis = await cc.field(f).isVisible().catch(() => false);
      console.log(i, f, vis, vis ? await cc.field(f).innerText() : '');
    }
    console.log(i, 'URL', p.url());
  }
  await b.close();
})();
