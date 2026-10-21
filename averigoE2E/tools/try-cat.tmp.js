const { chromium } = require('@playwright/test');
const env = require('../config/env');
const { InventoryPage } = require('../pages/InventoryPage');
(async () => {
  const b = await chromium.launch();
  const c = await b.newContext({ storageState: env.AUTH_FILE, baseURL: env.BASE_URL, viewport: { width: 1600, height: 1000 } });
  const p = await c.newPage();
  await p.addLocatorHandler(p.locator('.modal.o_technical_modal').filter({ hasText: 'Open Customer Activities' }), (m) => m.locator('.btn-close').first().click({ timeout: 5000 }).catch(() => m.page().keyboard.press('Escape')));
  const i = new InventoryPage(p);
  await i.open(); await i.openMenu('Configuration', 'Product Categories'); await i.clickNew();
  for (const f of ['parent_id','property_cost_method','property_valuation','route_ids','removal_strategy_id','property_account_creditor_price_difference_categ','property_account_income_categ_id','property_account_expense_categ_id','property_stock_account_input_categ_id','property_stock_account_output_categ_id','property_stock_valuation_account_id','property_stock_journal']) {
    const fld = i.field(f);
    const sel = fld.locator('select');
    const opts = await sel.count() ? (await sel.locator('option').allInnerTexts()).join('/') : '';
    console.log(f, '=', JSON.stringify(await i.read(f).catch(() => (fld.innerText()))), opts ? `[${opts}]` : '', 'editable:', await fld.locator('input,select').count());
  }
  for (const f of ['parent_id', 'removal_strategy_id', 'route_ids']) {
    await i.field(f).locator('input').first().click();
    await p.waitForTimeout(1500);
    console.log(f, 'OPTIONS:', (await p.locator('.o-autocomplete--dropdown-item').allInnerTexts()).slice(0, 8).join(' | '));
    await p.keyboard.press('Escape');
  }
  await b.close();
})();
