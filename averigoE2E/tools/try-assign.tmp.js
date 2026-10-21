const { chromium } = require('@playwright/test');
const env = require('../config/env');
const state = require('../utils/state');
const { CustomerCarePage } = require('../pages/CustomerCarePage');
(async () => {
  const b = await chromium.launch();
  const c = await b.newContext({ storageState: env.AUTH_FILE, baseURL: env.BASE_URL, viewport: { width: 1600, height: 1000 } });
  const p = await c.newPage();
  await p.addLocatorHandler(p.locator('.modal.o_technical_modal').filter({ hasText: 'Open Customer Activities' }), (m) => m.locator('.btn-close').first().click({ timeout: 5000 }).catch(() => m.page().keyboard.press('Escape')));
  const i = new CustomerCarePage(p);
  await i.goto(state.get('parentCustomerUrl'));
  await i.openTab('Preventive Cases');
  await i.field('case_ids').locator('button, a').filter({ hasText: /^\s*Add/ }).first().click();
  const dlg = i.dialogs().last(); await dlg.waitFor(); await p.waitForTimeout(1500);
  const f = i.field('employee_ids', dlg);
  await f.locator('.o_av_cdd_trigger').click(); await p.waitForTimeout(2000);
  console.log('ASSIGNED TO OPTIONS:', (await f.locator('.o_av_cdd_list li').allInnerTexts()).map((t) => t.trim()).join(' | '));
  await b.close();
})();
