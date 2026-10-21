// One-off: set Container Deposit Amount on the existing deposit products (P1, P3).
const { chromium } = require('@playwright/test');
const env = require('../config/env');
const state = require('../utils/state');
const d = require('../data/testData');
const { InventoryPage } = require('../pages/InventoryPage');
(async () => {
  const b = await chromium.launch();
  const c = await b.newContext({ storageState: env.AUTH_FILE, baseURL: env.BASE_URL, viewport: { width: 1600, height: 1000 } });
  const p = await c.newPage();
  await p.addLocatorHandler(p.locator('.modal.o_technical_modal').filter({ hasText: 'Open Customer Activities' }), (m) => m.locator('.btn-close').first().click({ timeout: 5000 }).catch(() => m.page().keyboard.press('Escape')));
  const inv = new InventoryPage(p);
  for (const key of ['p1', 'p3']) {
    await inv.goto(state.get(`${key}Url`));
    await inv.openTab('TAX');
    await inv.fill({ container_deposit_amount: d.products[key].depositAmount });
    await inv.page.locator('.o_form_button_save').first().click().catch(() => {});
    await inv.page.waitForTimeout(3000);
    console.log('DIALOG:', await inv.page.locator('.modal:visible .modal-body, .o_notification').allInnerTexts());
    await inv.page.screenshot({ path: 'tools/last.png' });
    await inv.save();
    console.log(key, 'deposit amount', await inv.read('container_deposit_amount'));
  }
  await b.close();
})().catch((e) => { console.error(e.message); process.exit(1); });
