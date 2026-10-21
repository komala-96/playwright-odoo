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
  await pp.field('name').waitFor(); await p.waitForTimeout(2000);
  console.log('SMART BUTTONS:', (await p.locator('.oe_button_box button, .o_stat_button, .o-form-buttonbox button').filter({ visible: true }).evaluateAll((bs) => bs.map((x) => `${x.innerText.replace(/\s+/g, ' ').trim()}{${x.getAttribute('name') || ''}}`))).join(' | '));
  console.log('BALANCE-LIKE FIELDS:', await p.evaluate(() => [...document.querySelectorAll('.o_action_manager .o_form_view .o_field_widget[name]')].filter((e) => /balance|debit|credit|payable|due/i.test(e.getAttribute('name'))).map((e) => `${e.getAttribute('name')}${e.offsetParent ? '' : ' (hidden)'}=${e.innerText.trim().slice(0, 30)}`).join(' | ')));
  await b.close();
})();
