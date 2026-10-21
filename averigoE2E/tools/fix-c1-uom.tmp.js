const { chromium } = require('@playwright/test');
const env = require('../config/env');
const d = require('../data/testData');
const { CustomerCarePage } = require('../pages/CustomerCarePage');
(async () => {
  const b = await chromium.launch();
  const c = await b.newContext({ storageState: env.AUTH_FILE, baseURL: env.BASE_URL, viewport: { width: 1600, height: 1000 } });
  const p = await c.newPage();
  await p.addLocatorHandler(p.locator('.modal.o_technical_modal').filter({ hasText: 'Open Customer Activities' }), (m) => m.locator('.btn-close').first().click({ timeout: 5000 }).catch(() => m.page().keyboard.press('Escape')));
  const o = new CustomerCarePage(p);
  await o.updateProductLine(d.customer1.name, d.products.p1.code, { uom_id: d.uom.reference });
  await o.openTab('Order Products');
  console.log('UoM now:', await o.readProductLine(d.products.p1.code, 'uom_id'));
  await b.close();
})();
