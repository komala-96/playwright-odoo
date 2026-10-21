const { chromium } = require('@playwright/test');
const env = require('../config/env');
const { CustomerCarePage } = require('../pages/CustomerCarePage');
(async () => {
  const b = await chromium.launch();
  const c = await b.newContext({ storageState: env.AUTH_FILE, baseURL: env.BASE_URL, viewport: { width: 1600, height: 1000 } });
  const p = await c.newPage();
  await p.addLocatorHandler(p.locator('.modal.o_technical_modal').filter({ hasText: 'Open Customer Activities' }), (m) => m.locator('.btn-close').first().click({ timeout: 5000 }).catch(() => m.page().keyboard.press('Escape')));
  const i = new CustomerCarePage(p);
  await i.open(); await i.openMenu('Configuration', 'Order Types');
  const t = p.locator('.o_optional_columns_dropdown_toggle, .o_optional_columns_dropdown button');
  console.log('optional columns toggle:', await t.count());
  if (await t.count()) { await t.first().click(); await p.waitForTimeout(800); console.log((await p.locator('.o_optional_columns_dropdown .dropdown-item, .o-dropdown--menu .dropdown-item').allInnerTexts()).join(' | ')); }
  await b.close();
})();
