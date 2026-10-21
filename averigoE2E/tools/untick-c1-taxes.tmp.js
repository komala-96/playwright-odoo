// One-off: switch off Fuel Charge / Hazard Fee / Subsidy on the existing Customer 1.
const { chromium } = require('@playwright/test');
const env = require('../config/env');
const state = require('../utils/state');
const d = require('../data/testData');
const { CustomerCarePage } = require('../pages/CustomerCarePage');
(async () => {
  const b = await chromium.launch();
  const c = await b.newContext({ storageState: env.AUTH_FILE, baseURL: env.BASE_URL, viewport: { width: 1600, height: 1000 } });
  const p = await c.newPage();
  await p.addLocatorHandler(p.locator('.modal.o_technical_modal').filter({ hasText: 'Open Customer Activities' }), (m) => m.locator('.btn-close').first().click({ timeout: 5000 }).catch(() => m.page().keyboard.press('Escape')));
  const cc = new CustomerCarePage(p);
  await cc.goto(state.get('customer1Url'));
  for (const f of ['fuel_charge', 'hazard_fee', 'subsidy']) {
    const box = cc.field(f).locator('input[type=checkbox]').first();
    console.log(f, 'before', await box.isChecked().catch(() => 'n/a'));
  }
  await cc.fill({ fuel_charge: false, hazard_fee: false, subsidy: false });
  await cc.save();
  await cc.expectCustomer ? console.log('saved', d.customer1.name) : 0;
  for (const f of ['fuel_charge', 'hazard_fee', 'subsidy']) console.log(f, 'after', await cc.field(f).locator('input[type=checkbox]').first().isChecked());
  await b.close();
})().catch((e) => { console.error(e.message); process.exit(1); });
