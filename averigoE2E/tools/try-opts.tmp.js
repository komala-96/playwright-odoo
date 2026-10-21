const { chromium } = require('@playwright/test');
const env = require('../config/env');
const { OdooPage } = require('../pages/OdooPage');
(async () => {
  const [app, menu, ...fields] = process.argv.slice(2);
  const b = await chromium.launch();
  const c = await b.newContext({ storageState: env.AUTH_FILE, baseURL: env.BASE_URL, viewport: { width: 1600, height: 1000 } });
  const p = await c.newPage();
  await p.addLocatorHandler(p.locator('.modal.o_technical_modal').filter({ hasText: 'Open Customer Activities' }), (m) => m.locator('.btn-close').first().click({ timeout: 5000 }).catch(() => m.page().keyboard.press('Escape')));
  const o = new OdooPage(p);
  await o.openApp(app); await o.openMenu(...menu.split('>')); await o.clickNew();
  for (const f of fields) console.log(f, '=>', await o.field(f).locator('select option').allInnerTexts().catch(() => 'n/a'));
  await b.close();
})();
