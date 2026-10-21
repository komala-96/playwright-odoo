const { chromium } = require('@playwright/test');
const env = require('../config/env');
const { CustomerCarePage } = require('../pages/CustomerCarePage');
(async () => {
  const b = await chromium.launch();
  const c = await b.newContext({ storageState: env.AUTH_FILE, baseURL: env.BASE_URL, viewport: { width: 1600, height: 1000 } });
  const p = await c.newPage();
  await p.addLocatorHandler(p.locator('.modal.o_technical_modal').filter({ hasText: 'Open Customer Activities' }), (m) => m.locator('.btn-close').first().click({ timeout: 5000 }).catch(() => m.page().keyboard.press('Escape')));
  const o = new CustomerCarePage(p);
  await o.openApp('Customer Care'); await o.openMenu('Customer'); await o.goto(p.url().replace(/\/?(\?.*)?$/, '') + '/30093');
  await o.openTab('Order Products');
  const row = o.field('customer_product_ids').locator('.o_data_row').first();
  console.log('ROW', await row.innerText());
  await row.locator('td[name=uom_id]').click(); await p.waitForTimeout(800);
  const f = row.locator('.o_field_widget[name=uom_id]');
  await f.locator('.o_av_cdd_trigger').click(); await p.waitForTimeout(1200);
  console.log('UOM OPTIONS', await f.locator('.o_av_cdd_list li').allInnerTexts());
  await f.locator('.o_av_cdd_trigger').click();
  await row.locator('td[name=order_type]').click(); await p.waitForTimeout(800);
  const ot = row.locator('.o_field_widget[name=order_type]');
  console.log('ORDER TYPE widget', (await ot.evaluate((e) => e.className)));
  if (await ot.locator('.o_av_cdd_trigger').count()) { await ot.locator('.o_av_cdd_trigger').click(); await p.waitForTimeout(1200); console.log('OT OPTIONS', (await ot.locator('.o_av_cdd_list li').allInnerTexts()).slice(0, 8)); }
  await b.close();
})();
