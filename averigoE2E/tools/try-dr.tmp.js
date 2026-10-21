const { chromium } = require('@playwright/test');
const env = require('../config/env');
const d = require('../data/testData');
const { InventoryPage } = require('../pages/InventoryPage');
(async () => {
  const b = await chromium.launch();
  const c = await b.newContext({ storageState: env.AUTH_FILE, baseURL: env.BASE_URL, viewport: { width: 1600, height: 1000 } });
  const p = await c.newPage();
  await p.addLocatorHandler(p.locator('.modal.o_technical_modal').filter({ hasText: 'Open Customer Activities' }), (m) => m.locator('.btn-close').first().click({ timeout: 5000 }).catch(() => m.page().keyboard.press('Escape')));
  const o = new InventoryPage(p);
  const r = await o.directReceipt({ vendor: d.vendor.name, product: d.products.p1, qty: 1, cost: 10 });
  console.log('RECEIPT', r.name, 'LOCATION', await o.read('warehouse_id'));
  await b.close();
})();
