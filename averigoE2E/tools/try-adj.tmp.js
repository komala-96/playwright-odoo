const { chromium } = require('@playwright/test');
const env = require('../config/env');
const d = require('../data/testData');
const { OdooPage } = require('../pages/OdooPage');
(async () => {
  const b = await chromium.launch();
  const c = await b.newContext({ storageState: env.AUTH_FILE, baseURL: env.BASE_URL, viewport: { width: 1600, height: 900 } });
  const p = await c.newPage();
  await p.addLocatorHandler(p.locator('.modal.o_technical_modal').filter({ hasText: 'Open Customer Activities' }), (m) => m.locator('.btn-close').first().click({ timeout: 5000 }).catch(() => m.page().keyboard.press('Escape')));
  const o = new OdooPage(p);
  await o.openApp('Inventory'); await o.openMenu('Inventory Adjustment', 'Quantity Adjustments'); await o.clickNew();
  console.log('SCAN OPTIONS', await p.locator('.o_field_widget[name=scan_type] select option').allInnerTexts());
  console.log('PREFILL', await p.locator('.o_field_widget[name=prefill_counted_quantity]').innerText());
  await o.fill({ warehouse_id: d.warehouse.name });
  await o.fill({ name: `PROBE-${Date.now()}` });
  console.log('product_ids widget', await o.widgetType(o.field('product_ids')));
  await o.fill({ product_ids: [d.products.p1.code] });
  await o.click('action_start');
  await p.waitForTimeout(3000);
  console.log('URL', p.url());
  console.log('ROWS', await p.locator('.o_field_widget[name=adjustment_lines_ids] .o_data_row').allInnerTexts());
  console.log('BUTTONS', await p.evaluate(() => [...document.querySelectorAll('.o_form_view button')].filter((b) => b.offsetParent && b.innerText.trim()).map((b) => b.innerText.trim() + (b.name ? `{${b.name}}` : '')).join(' | ')));
  await p.screenshot({ path: 'tools/last.png' });
  // discard so nothing is left behind
  await b.close();
})();
