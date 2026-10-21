const { chromium } = require('@playwright/test');
const env = require('../config/env');
const state = require('../utils/state');
const { PurchasePage } = require('../pages/PurchasePage');
(async () => {
  const b = await chromium.launch();
  const c = await b.newContext({ storageState: env.AUTH_FILE, baseURL: env.BASE_URL, viewport: { width: 1600, height: 1000 } });
  const p = await c.newPage();
  await p.addLocatorHandler(p.locator('.modal.o_technical_modal').filter({ hasText: 'Open Customer Activities' }), (m) => m.locator('.btn-close').first().click({ timeout: 5000 }).catch(() => m.page().keyboard.press('Escape')));
  const pp = new PurchasePage(p);
  await pp.goto(state.get('vendorUrl'));
  const f = pp.field('vendor_code');
  console.log('vendor_code html:', (await f.evaluate((e) => e.outerHTML)).slice(0, 300));
  await f.locator('input').fill('V92196'); await f.locator('input').press('Tab'); await p.waitForTimeout(1000);
  console.log('after fill:', await f.locator('input').inputValue());
  console.log('dialogs:', (await p.locator('.modal:visible').allInnerTexts()).map((t) => t.slice(0, 150)).join(' || '));
  await pp.discard().catch(() => {});
  await b.close();
})();
