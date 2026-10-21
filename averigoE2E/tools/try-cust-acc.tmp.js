const { chromium } = require('@playwright/test');
const env = require('../config/env');
const state = require('../utils/state');
const { CustomerCarePage } = require('../pages/CustomerCarePage');
(async () => {
  const b = await chromium.launch();
  const c = await b.newContext({ storageState: env.AUTH_FILE, baseURL: env.BASE_URL, viewport: { width: 1600, height: 1000 } });
  const p = await c.newPage();
  await p.addLocatorHandler(p.locator('.modal.o_technical_modal').filter({ hasText: 'Open Customer Activities' }), (m) => m.locator('.btn-close').first().click({ timeout: 5000 }).catch(() => m.page().keyboard.press('Escape')));
  const i = new CustomerCarePage(p);
  await i.openNewCustomer();
  await i.openTab('Account Setup');
  for (const f of ['property_account_receivable_id','sales_discount_account_id','advance_account_id','insurance_account_id','sales_tax_liability_account_id','terms_discount_account_id','shipping_handling_account_id']) {
    const fld = i.field(f);
    const val = await i.read(f).catch(() => '?');
    await fld.locator('.o_av_cdd_trigger').click().catch(() => {});
    await p.waitForTimeout(1200);
    const opts = (await fld.locator('.o_av_cdd_list li').allInnerTexts().catch(() => [])).map((t) => t.trim());
    console.log(f, '=', JSON.stringify(val), '| offers', opts.length, ':', opts.slice(0, 6).join(' | '));
    await fld.locator('.o_av_cdd_trigger').click().catch(() => {});
    await p.waitForTimeout(300);
  }
  await i.openTab('Order Products');
  console.log('ORDER PRODUCT COLS:', await i.field('customer_product_ids').evaluate((e) => [...e.querySelectorAll('th[data-name]')].map((t) => `${t.dataset.name}:${t.innerText.trim()}`).join(' | ')));
  await b.close();
})();
