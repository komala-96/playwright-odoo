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
  await pp.openTab('Contacts & Addresses');
  await pp.field('child_ids').locator('button, a').filter({ hasText: /^\s*Add/ }).first().click();
  const dlg = pp.dialogs().filter({ has: p.locator('.o_field_widget[name="addr_type"]') }).last();
  await dlg.locator('.o_field_widget[name="name"]').waitFor();
  const labels = (await dlg.locator('.o_field_widget[name="addr_type"] .form-check').allInnerTexts()).map((t) => t.trim());
  console.log('ADDR TYPES:', labels.join(' | '));
  const remit = labels.find((l) => /remit/i.test(l));
  if (remit) {
    await dlg.locator('.o_field_widget[name="addr_type"] .form-check').filter({ hasText: remit }).locator('input').check({ force: true });
    await p.waitForTimeout(1500);
    const conf = p.locator('.modal:visible').filter({ hasText: /Are you sure/i });
    if (await conf.isVisible().catch(() => false)) { console.log('CONFIRM shown'); await conf.locator('.modal-footer button').filter({ hasText: /^Ok$/i }).click(); await p.waitForTimeout(1000); }
    console.log('REMIT FIELDS:', await dlg.evaluate((el) => [...el.querySelectorAll('.o_field_widget[name]')].filter((e) => e.offsetParent).map((e) => e.getAttribute('name') + (e.classList.contains('o_required_modifier') ? '*' : '')).join(' ')));
  }
  await dlg.locator('.modal-footer button').filter({ hasText: /Discard/ }).click().catch(() => p.keyboard.press('Escape'));
  await p.waitForTimeout(800);
  // Buy All checkbox behaviour
  const box = pp.field('buy_all').locator('input').first();
  await box.click({ force: true }); await p.waitForTimeout(1500);
  console.log('buy_all after click:', await box.isChecked(), '| dialogs:', (await p.locator('.modal:visible').filter({ hasNotText: 'Open Customer Activities' }).allInnerTexts()).map((t) => t.slice(0, 120).replace(/\n+/g, ' ')).join(' || '));
  await pp.discard().catch(() => {});
  await b.close();
})();
