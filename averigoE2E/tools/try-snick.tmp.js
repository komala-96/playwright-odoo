const { chromium } = require('@playwright/test');
const env = require('../config/env');
const d = require('../data/testData');
const { SalesPage } = require('../pages/SalesPage');
(async () => {
  const b = await chromium.launch();
  const c = await b.newContext({ storageState: env.AUTH_FILE, baseURL: env.BASE_URL, viewport: { width: 1600, height: 1000 } });
  const p = await c.newPage();
  await p.addLocatorHandler(p.locator('.modal.o_technical_modal').filter({ hasText: 'Open Customer Activities' }), (m) => m.locator('.btn-close').first().click({ timeout: 5000 }).catch(() => m.page().keyboard.press('Escape')));
  const s = new SalesPage(p);
  await s.openOrders(); await s.clickNew();
  await s.fill({ partner_id: d.customer1.name });
  await s.fill({ sell_all_item: true });
  await s.fill({ associated_product: true });
  const f = s.field('cus_product_assoc_ids');
  console.log('widget:', (await f.evaluate((e) => e.className)));
  const inp = f.locator('input').first();
  for (const q of ['', 'Snick', '10013']) {
    await inp.click(); await inp.fill(q); await p.waitForTimeout(2500);
    console.log(`"${q}":`, (await p.locator('.o-autocomplete--dropdown-item').allInnerTexts()).map((t) => t.trim()).slice(0, 10).join(' | '));
  }
  await inp.fill(''); await p.keyboard.press('Escape');
  await s.fill({ associated_product: false });
  await inp.click(); await inp.fill('Snick'); await p.waitForTimeout(2500);
  console.log('assoc OFF "Snick":', (await p.locator('.o-autocomplete--dropdown-item').allInnerTexts()).map((t) => t.trim()).slice(0, 10).join(' | '));
  await s.discard().catch(() => {});
  await b.close();
})();
