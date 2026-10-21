const { chromium } = require('@playwright/test');
const env = require('../config/env');
const { SalesPage } = require('../pages/SalesPage');
(async () => {
  const order = process.argv[2];
  const b = await chromium.launch();
  const c = await b.newContext({ storageState: env.AUTH_FILE, baseURL: env.BASE_URL, viewport: { width: 1600, height: 1000 } });
  const p = await c.newPage();
  await p.addLocatorHandler(p.locator('.modal.o_technical_modal').filter({ hasText: 'Open Customer Activities' }), (m) => m.locator('.btn-close').first().click({ timeout: 5000 }).catch(() => m.page().keyboard.press('Escape')));
  const o = new SalesPage(p);
  await o.openApp('Customer Care'); await o.openMenu('Delivery', 'Packing Slip');
  const h = p.locator('.o_list_view th[data-name="name"]'); await h.click(); await o.waitReady();
  console.log('class after 1 click', await h.getAttribute('class'));
  console.log('top rows', (await o.rows().allInnerTexts()).slice(0, 4));
  await o.rows().filter({ hasText: /In progress|Draft/ }).first().locator('td.o_data_cell').first().click(); await o.waitReady();
  console.log('opened', await o.recordTitle(), 'rows', await p.locator('.o_form_view .o_data_row').allInnerTexts());
  await b.close();
})();
