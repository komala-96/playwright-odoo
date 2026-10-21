const { chromium } = require('@playwright/test');
const env = require('../config/env');
const d = require('../data/testData');
const { SalesPage } = require('../pages/SalesPage');
(async () => {
  const b = await chromium.launch();
  const c = await b.newContext({ storageState: env.AUTH_FILE, baseURL: env.BASE_URL, viewport: { width: 1600, height: 1000 } });
  const p = await c.newPage();
  await p.addLocatorHandler(p.locator('.modal.o_technical_modal').filter({ hasText: 'Open Customer Activities' }), (m) => m.locator('.btn-close').first().click({ timeout: 5000 }).catch(() => m.page().keyboard.press('Escape')));
  const o = new SalesPage(p);
  await o.openOrders(); await o.clickNew();
  await o.fill({ partner_id: process.env.CUST === '1' ? d.customer1.name : d.customer2.name }); await p.waitForTimeout(2000);
  await o.fill({ sell_all_item: true }); await o.fill({ cus_product_assoc_ids: [d.products.p1.name] });
  await o.field('add_button').locator('button').click(); await o.waitReady(); await p.waitForTimeout(1500);
  const ol = o.field('order_line');
  console.log('COLS', await ol.locator('th[data-name]').evaluateAll((t) => t.map((x) => x.dataset.name + ':' + x.innerText.trim()).join(' | ')));
  console.log('ROWS', await ol.locator('.o_data_row').allInnerTexts());
  for (const code of [d.products.p1.code]) {
    const row = ol.locator('.o_data_row').filter({ hasText: code }).first();
    await row.locator('td[name=product_uom_qty]').click();
    await row.locator('td[name=product_uom_qty] input').fill('2');
    await row.locator('td[name=product_uom_qty] input').press('Tab');
    await o.waitReady();
  }
  await p.waitForTimeout(1500);
  console.log('ROWS2', await ol.locator('.o_data_row').allInnerTexts());
  console.log('TOTALS', await o.readAmounts({ subtotal: 'amount_untaxed', sh: 'shipping_handling', tax: 'tax_amount_view', dep: 'container_deposit_view', ins: 'insurance', disc: 'total_discount_view', total: 'amount_total' }));
  console.log('NOTIF', await p.locator('.o_notification, .modal:visible').allInnerTexts());
  await o.save(); console.log('SAVED', p.url());
  console.log('TOTALS SAVED', await o.readAmounts({ subtotal: 'amount_untaxed', sh: 'shipping_handling', tax: 'tax_amount_view', dep: 'container_deposit_view', ins: 'insurance', disc: 'total_discount_view', total: 'amount_total' }));
  await o.click('action_confirm'); await p.waitForTimeout(2500);
  console.log('MODAL', await p.locator('.modal:visible').allInnerTexts());
  console.log('STATUS', await p.locator('.o_statusbar_status').innerText());
  console.log('BUTTONS', await p.evaluate(() => [...document.querySelectorAll('.o_form_view button')].filter((b) => b.offsetParent && b.innerText.trim()).map((b) => b.innerText.trim().replace(/\s+/g, ' ') + (b.name ? `{${b.name}}` : '')).join(' | ')));
  require('fs').writeFileSync('tools/last-order-url.txt', p.url());
  await p.screenshot({ path: 'tools/last.png', fullPage: true });
  await b.close();
})();
