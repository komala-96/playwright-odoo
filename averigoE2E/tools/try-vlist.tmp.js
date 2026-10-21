const { chromium } = require('@playwright/test');
const env = require('../config/env');
const d = require('../data/testData');
const { PurchasePage } = require('../pages/PurchasePage');
(async () => {
  const b = await chromium.launch();
  const c = await b.newContext({ storageState: env.AUTH_FILE, baseURL: env.BASE_URL, viewport: { width: 1600, height: 1000 } });
  const p = await c.newPage();
  await p.addLocatorHandler(p.locator('.modal.o_technical_modal').filter({ hasText: 'Open Customer Activities' }), (m) => m.locator('.btn-close').first().click({ timeout: 5000 }).catch(() => m.page().keyboard.press('Escape')));
  const pp = new PurchasePage(p);
  await pp.open('Vendors');
  console.log('VIEW:', await p.locator('.o_list_view').count() ? 'list' : (await p.locator('.o_kanban_view').count() ? 'kanban' : '?'));
  console.log('HEADERS:', (await p.locator('.o_list_view th').allInnerTexts()).map((t) => t.trim()).filter(Boolean).join(' | '));
  await pp.search(d.vendor.name);
  console.log('ROW:', (await pp.rows(d.vendor.name).first().innerText().catch(() => 'none')).replace(/\s+/g, ' '));
  const toggle = p.locator('.o_optional_columns_dropdown_toggle, .o_optional_columns_dropdown button').first();
  if (await toggle.count()) { await toggle.click(); await p.waitForTimeout(800); console.log('OPTIONAL COLS:', (await p.locator('.o-dropdown--menu .dropdown-item').allInnerTexts()).join(' | ')); }
  await b.close();
})();
