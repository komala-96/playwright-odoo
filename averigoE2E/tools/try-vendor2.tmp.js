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
  await p.waitForTimeout(2000);
  const dlg = pp.dialogs().last();
  console.log('CONTACT DIALOG:', await dlg.evaluate((el) => [...el.querySelectorAll('.o_field_widget[name]')].filter((e) => e.offsetParent).map((e) => e.getAttribute('name') + (e.classList.contains('o_required_modifier') ? '*' : '') + '[' + (e.className.match(/o_field_\w+/g) || []).slice(1).join(',') + ']').join(' ')).catch(() => 'none'));
  console.log('TYPES:', (await dlg.locator('.o_field_widget[name="type_address"] label, .o_field_widget[name="type"] label').allInnerTexts().catch(() => [])).join(' | '));
  await dlg.locator('.modal-footer button').filter({ hasText: /Discard/ }).click().catch(() => p.keyboard.press('Escape'));
  await p.waitForTimeout(1000);
  await pp.openTab('Products');
  const row = pp.vendorLine(require('../data/testData').products.p1.code);
  await row.locator('td[name="lead_unit"]').click(); await p.waitForTimeout(800);
  const sel = pp.field('vendor_product_ids').locator('.o_data_row.o_selected_row');
  for (const n of ['vendor_part_code', 'vendor_part_name', 'tax_status', 'uom_id', 'cost_price', 'min_qty', 'lead_time', 'lead_unit', 'product_long_desc']) {
    const cell = sel.locator(`td[name="${n}"]`);
    const w = cell.locator('.o_field_widget');
    console.log(n, 'widget:', await w.getAttribute('class').catch(() => 'none'), '| select opts:', (await cell.locator('select option').allInnerTexts().catch(() => [])).join('/'), '| readonly:', await cell.evaluate((e) => e.classList.contains('o_readonly_modifier')).catch(() => '?'));
  }
  await pp.discard().catch(() => {});
  await b.close();
})();
