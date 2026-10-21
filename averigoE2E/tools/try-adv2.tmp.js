const { chromium } = require('@playwright/test');
const env = require('../config/env');
const { AccountingPage } = require('../pages/AccountingPage');
(async () => {
  const b = await chromium.launch();
  const c = await b.newContext({ storageState: env.AUTH_FILE, baseURL: env.BASE_URL, viewport: { width: 1600, height: 1000 } });
  const p = await c.newPage();
  await p.addLocatorHandler(p.locator('.modal.o_technical_modal').filter({ hasText: 'Open Customer Activities' }), (m) => m.locator('.btn-close').first().click({ timeout: 5000 }).catch(() => m.page().keyboard.press('Escape')));
  const o = new AccountingPage(p);
  await o.openAR('Advance'); await o.clickNew();
  const input = o.field('partner_id').locator('input');
  const t0 = Date.now();
  await input.fill('CUST-QA-001-55000-h');
  for (let i = 0; i < 60; i++) {
    const opts = await p.locator('.o-autocomplete--dropdown-item').allInnerTexts();
    if (opts.some((o) => o.includes('CUST-QA-001-55000-h'))) { console.log('FOUND after', (Date.now() - t0) / 1000, 's', opts); break; }
    if (i % 10 === 0) console.log((Date.now() - t0) / 1000, 's', opts);
    await p.waitForTimeout(1000);
  }
  await b.close();
})();
