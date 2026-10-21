const { chromium } = require('@playwright/test');
const env = require('../config/env');
const { SalesPage } = require('../pages/SalesPage');
(async () => {
  const b = await chromium.launch();
  const c = await b.newContext({ storageState: env.AUTH_FILE, baseURL: env.BASE_URL, viewport: { width: 1600, height: 1000 } });
  const p = await c.newPage();
  await p.addLocatorHandler(p.locator('.modal.o_technical_modal').filter({ hasText: 'Open Customer Activities' }), (m) => m.locator('.btn-close').first().click({ timeout: 5000 }).catch(() => m.page().keyboard.press('Escape')));
  const s = new SalesPage(p);
  await s.openOrder('S01355');
  await p.locator('.o_control_panel button, .o_cp_action_menus button').filter({ hasText: /^\s*Action\s*$/ }).first().click();
  await p.waitForTimeout(1000);
  console.log('ACTION MENU:', (await p.locator('.o-dropdown--menu .dropdown-item').filter({ visible: true }).allInnerTexts()).map((t) => t.trim()).join(' | '));
  await p.keyboard.press('Escape');
  await b.close();
})();
