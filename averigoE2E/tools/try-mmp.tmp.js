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
  await o.open('Locations'); await o.goto(p.url().split('?')[0].replace(/\/$/, '') + '/4682'); await o.openTab('Products');
  await o.fill({ single_product_ids: [d.products.p2.name, d.products.p3.name, d.products.p4.name] });
  console.log('TAGS', await o.field('single_product_ids').locator('.o_av_cdd_tags').innerText());
  await o.field('add').locator('button').click(); await o.waitReady(); await p.waitForTimeout(2500);
  console.log('ROWS', (await o.field('market_product_ids').locator('.o_data_row').allInnerTexts()).map((t) => t.replace(/\s+/g, ' ').slice(0, 60)));
  console.log('MODALS', (await p.locator('.modal:visible').allInnerTexts()).map((t) => t.slice(0, 200)));
  await b.close();
})();
