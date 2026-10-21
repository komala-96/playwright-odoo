const { chromium } = require('@playwright/test');
const env = require('../config/env');
const { OdooPage } = require('../pages/OdooPage');
(async () => {
  const b = await chromium.launch();
  const c = await b.newContext({ storageState: env.AUTH_FILE, baseURL: env.BASE_URL, viewport: { width: 1600, height: 1000 } });
  const p = await c.newPage();
  await p.addLocatorHandler(p.locator('.modal.o_technical_modal').filter({ hasText: 'Open Customer Activities' }), (m) => m.locator('.btn-close').first().click({ timeout: 5000 }).catch(() => m.page().keyboard.press('Escape')));
  const o = new OdooPage(p);
  await o.goto('https://martiserv.averigoqa.com/odoo/product-master/124461');
  await p.locator('.o_cp_action_menus button, .o_control_panel button:has-text("Action")').filter({ visible: true }).first().click(); await p.waitForTimeout(800);
  console.log('ACTION MENU', await p.locator('.o-dropdown--menu .dropdown-item').allInnerTexts());
  await p.locator('.o-dropdown--menu .dropdown-item').filter({ hasText: 'Uom category Update' }).click(); await o.waitReady(); await p.waitForTimeout(1500);
  console.log('URL', p.url(), 'NOTIF', await p.locator('.o_notification').allInnerTexts());
  console.log('UOM FIELD', (await p.locator('.o_field_widget[name=uom_id]').evaluate((e) => e.outerHTML)).slice(0, 300));
  await b.close();
})();
