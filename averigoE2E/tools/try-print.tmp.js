const { chromium } = require('@playwright/test');
const env = require('../config/env');
const state = require('../utils/state');
const { SalesPage } = require('../pages/SalesPage');
(async () => {
  const b = await chromium.launch();
  const c = await b.newContext({ storageState: env.AUTH_FILE, baseURL: env.BASE_URL, viewport: { width: 1600, height: 1000 }, acceptDownloads: true });
  const p = await c.newPage();
  await p.addLocatorHandler(p.locator('.modal.o_technical_modal').filter({ hasText: 'Open Customer Activities' }), (m) => m.locator('.btn-close').first().click({ timeout: 5000 }).catch(() => m.page().keyboard.press('Escape')));
  const s = new SalesPage(p);
  for (const [label, url] of [['INVOICE', state.get('c1Invoice').url], ['ORDER', state.get('c1Invoice').orderUrl]]) {
    await s.goto(url);
    await p.locator('.o_control_panel button, .o_cp_action_menus button').filter({ hasText: /^\s*Action\s*$/ }).first().click();
    await p.waitForTimeout(800);
    const items = (await p.locator('.o-dropdown--menu .dropdown-item, .o-dropdown--menu .o_menu_item').filter({ visible: true }).allInnerTexts()).map((t) => t.trim());
    console.log(label, 'ACTION:', items.join(' | '));
    const printItem = p.locator('.o-dropdown--menu .dropdown-item, .o-dropdown--menu .o_menu_item').filter({ hasText: /^\s*Print\s*$/ }).first();
    if (await printItem.count()) {
      await printItem.hover().catch(() => {}); await printItem.click().catch(() => {});
      await p.waitForTimeout(800);
      console.log(label, 'PRINT SUBMENU:', (await p.locator('.o-dropdown--menu .dropdown-item').filter({ visible: true }).allInnerTexts()).map((t) => t.trim()).join(' | '));
    }
    await p.keyboard.press('Escape');
  }
  await b.close();
})();
