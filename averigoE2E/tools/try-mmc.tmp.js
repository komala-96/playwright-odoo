const { chromium } = require('@playwright/test');
const env = require('../config/env');
const { MicroMarketPage } = require('../pages/OtherModulesPage');
(async () => {
  const b = await chromium.launch();
  const c = await b.newContext({ storageState: env.AUTH_FILE, baseURL: env.BASE_URL, viewport: { width: 1600, height: 1000 } });
  const p = await c.newPage();
  await p.addLocatorHandler(p.locator('.modal.o_technical_modal').filter({ hasText: 'Open Customer Activities' }), (m) => m.locator('.btn-close').first().click({ timeout: 5000 }).catch(() => m.page().keyboard.press('Escape')));
  const o = new MicroMarketPage(p);
  await o.open('Locations'); await o.clickNew();
  await o.fill({ location_type: 'Micromarket' });
  const f = o.field('partner_id');
  console.log('HTML', (await f.evaluate((e) => e.outerHTML)).replace(/\s+/g, ' ').slice(0, 700));
  await f.click(); await p.waitForTimeout(1500);
  console.log('AFTER', (await f.evaluate((e) => e.outerHTML)).replace(/\s+/g, ' ').slice(0, 1500));
  await b.close();
})();
