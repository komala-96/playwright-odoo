const { chromium } = require('@playwright/test');
const env = require('../config/env');
const { OdooPage } = require('../pages/OdooPage');
(async () => {
  const b = await chromium.launch();
  const c = await b.newContext({ storageState: env.AUTH_FILE, baseURL: env.BASE_URL, viewport: { width: 1600, height: 900 } });
  const p = await c.newPage();
  await p.addLocatorHandler(p.locator('.modal.o_technical_modal').filter({ hasText: 'Open Customer Activities' }), (m) => m.locator('.btn-close').first().click({ timeout: 5000 }).catch(() => m.page().keyboard.press('Escape')));
  const o = new OdooPage(p);
  await o.openApp('Averigo Reports'); await p.waitForTimeout(2000);
  const cats = (await p.locator('.category-btn > span:not(.category-count)').allInnerTexts()).filter((c) => !/Frequently|All Reports/.test(c));
  for (const cat of cats) {
    await p.locator('.category-btn').filter({ hasText: cat }).first().click(); await p.waitForTimeout(1200);
    console.log(`${cat}: ${(await p.locator('.report-card .report-name').allInnerTexts()).join(' | ')}`);
  }
  await b.close();
})();
