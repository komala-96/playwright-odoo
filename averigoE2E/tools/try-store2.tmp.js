const { chromium } = require('@playwright/test');
const env = require('../config/env');
const d = require('../data/testData');
const { MicroMarketPage } = require('../pages/OtherModulesPage');
(async () => {
  const b = await chromium.launch();
  const c = await b.newContext({ storageState: env.AUTH_FILE, baseURL: env.BASE_URL, viewport: { width: 1600, height: 1000 } });
  const p = await c.newPage();
  await p.addLocatorHandler(p.locator('.modal.o_technical_modal').filter({ hasText: 'Open Customer Activities' }), (m) => m.locator('.btn-close').first().click({ timeout: 5000 }).catch(() => m.page().keyboard.press('Escape')));
  const o = new MicroMarketPage(p);
  await o.open('Store Orders'); await o.clickNew();
  await o.fill({ warehouse_id: d.warehouse.name });
  await o.fill({ micro_market_id: d.microMarket.name });
  const lines = o.field('move_ids_without_package').locator('.o_data_row');
  await lines.first().waitFor();
  const show = async (tag) => console.log(tag, 'MM=', await o.read('micro_market_id').catch(() => '?'), '|', (await lines.allInnerTexts()).map((t) => t.replace(/\s+/g, ' ').replace(/CAT-QA-001-55000 /, '').slice(0, 60)).join(' || '));
  await show('START');
  for (const [code, q] of [['PROD-QA-001-55000', 4], ['PROD-QA-002-55000', 4], ['PROD-QA-003-55000', 0], ['PROD-QA-004-55000', 0]]) {
    const idx = (await lines.locator('td[name="product_code"]').allInnerTexts()).findIndex((t) => t.trim() === code);
    const cell = lines.nth(idx).locator('td[name="product_uom_qty"]');
    await cell.click(); await cell.locator('input').fill(String(q)); await cell.locator('input').press('Tab'); await o.waitReady(); await p.waitForTimeout(800);
    await show(`AFTER ${code}=${q}`);
  }
  await b.close();
})();
