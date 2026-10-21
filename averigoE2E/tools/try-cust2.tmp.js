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
  const i = new CustomerCarePage(p);
  await i.goto(state.get('customer1Url'));
  // Accounts Manager options: search for our employee
  // contact types: fresh dialog per type
  await i.openTab('Contacts & Addresses');
  for (const t of ['Contact', 'Billing Address', 'Delivery Address', 'Other Address', 'Private Address', 'Payee Address', 'Remit To Address']) {
    await i.field('child_ids_contacts').locator('button, a').filter({ hasText: /^\s*Add/ }).first().click();
    const dlg = p.locator('.modal:visible').filter({ has: p.locator('.o_field_widget[name="type_address"]') }).last();
    await dlg.waitFor(); await p.waitForTimeout(800);
    const radio = dlg.locator('.o_field_widget[name="type_address"] .form-check').filter({ hasText: new RegExp(`^\\s*${t}\\s*$`) }).locator('input');
    await radio.check({ force: true }).catch((e) => console.log('radio err', e.message.slice(0, 80)));
    await p.waitForTimeout(1000);
    const fields = await dlg.evaluate((el) => [...el.querySelectorAll('.o_field_widget[name]')].filter((e) => e.offsetParent).map((e) => e.getAttribute('name') + (e.classList.contains('o_required_modifier') ? '*' : '')).join(' '));
    console.log(`  [${t}] fields: ${fields}`);
    await dlg.locator('.modal-footer button').filter({ hasText: /Discard/ }).click();
    await dlg.waitFor({ state: 'hidden' });
  }
  // portal tab
  await i.openTab('Portal Users');
  console.log('PORTAL TAB:', (await i.field('child_ids_portal').innerText()).slice(0, 200).replace(/\n+/g, ' | '));
  await i.field('child_ids_portal').locator('button, a').filter({ hasText: /Add/ }).first().click().catch((e) => console.log('no add', e.message));
  await p.waitForTimeout(2000);
  const d2 = i.dialogs().last();
  console.log('PORTAL DIALOG FIELDS:', await d2.evaluate((el) => [...el.querySelectorAll('.o_field_widget[name]')].filter((e) => e.offsetParent).map((e) => e.getAttribute('name') + (e.classList.contains('o_required_modifier') ? '*' : '')).join(' ')).catch(() => 'none'));
  console.log('PORTAL DIALOG BUTTONS:', (await d2.locator('.modal-footer button').allInnerTexts().catch(() => [])).join(' | '));
  await d2.locator('.modal-footer button').filter({ hasText: /Discard|Cancel|Close/ }).first().click().catch(() => p.keyboard.press('Escape'));
  await i.discard().catch(() => {});
  await b.close();
})();
