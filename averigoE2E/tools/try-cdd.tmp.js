const { chromium } = require('@playwright/test');
const env = require('../config/env');
const { OdooPage } = require('../pages/OdooPage');
(async () => {
  const b = await chromium.launch();
  const c = await b.newContext({ storageState: env.AUTH_FILE, baseURL: env.BASE_URL, viewport: { width: 1600, height: 900 } });
  const p = await c.newPage();
  await p.addLocatorHandler(p.locator('.modal.o_technical_modal').filter({ hasText: 'Open Customer Activities' }), (m) => m.locator('.btn-close').first().click({ timeout: 5000 }).catch(() => m.page().keyboard.press('Escape')));
  const o = new OdooPage(p);
  await o.openApp('Customer Care'); await o.openMenu('Configuration', 'Parent'); await o.clickNew();
  await o.openTab('Account Setup');
  const f = p.locator('.o_field_widget[name=property_account_receivable_id]').filter({ visible: true }).first();
  console.log('KAM HTML', (await f.evaluate((e) => e.outerHTML)).slice(0, 700));
  await f.locator('button, input').first().click(); await p.waitForTimeout(1500);
  console.log('AFTER CLICK', (await f.evaluate((e) => e.outerHTML)).slice(0, 1500));
  console.log('BODY NEW', await p.evaluate(() => [...document.querySelectorAll('body > div:not(.o_action_manager) [class*=cdd], .o-overlay-container *[class*=cdd], .o-autocomplete--dropdown-menu')].filter((e) => e.offsetParent).map((e) => e.className + ' :: ' + e.outerHTML.slice(0, 400)).slice(0, 6).join('\n')));
  await p.screenshot({ path: 'tools/last.png' });
  await b.close();
})();
