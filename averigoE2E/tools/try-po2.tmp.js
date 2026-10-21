const { chromium } = require('@playwright/test');
const env = require('../config/env');
const d = require('../data/testData');
const { PurchasePage } = require('../pages/PurchasePage');
(async () => {
  const b = await chromium.launch();
  const c = await b.newContext({ storageState: env.AUTH_FILE, baseURL: env.BASE_URL, viewport: { width: 1600, height: 1000 } });
  const p = await c.newPage();
  await p.addLocatorHandler(p.locator('.modal.o_technical_modal').filter({ hasText: 'Open Customer Activities' }), (m) => m.locator('.btn-close').first().click({ timeout: 5000 }).catch(() => m.page().keyboard.press('Escape')));
  const o = new PurchasePage(p);
  await o.open('Purchase Order'); await o.clickNew();
  await o.fill({ partner_id: d.vendor.name });
  await o.fill({ warehouse_id: d.warehouse.name });
  console.log('LOCATION', await o.read('warehouse_id'));
  await o.fill({ product_ids: [d.products.p2.name] });
  console.log('TAGS', await o.field('product_ids').innerText());
  await o.field('add_button').locator('button').click(); await p.waitForTimeout(3000);
  const err = p.locator('.modal:visible').filter({ hasText: /went wrong|Error/i }).last();
  if (await err.isVisible().catch(() => false)) {
    await err.getByText('See technical details').click().catch(() => {}); await p.waitForTimeout(800);
    console.log('ERROR', (await err.innerText()).split('\n').filter((l) => /Error|error|Traceback|line|File/.test(l)).slice(-8).join('\n'));
  } else console.log('ROWS', await o.field('order_line').locator('.o_data_row').allInnerTexts());
  await b.close();
})();
