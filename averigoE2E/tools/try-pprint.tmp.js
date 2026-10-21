const { chromium } = require('@playwright/test');
const { execFileSync } = require('child_process');
const env = require('../config/env');
const { PurchasePage } = require('../pages/PurchasePage');
(async () => {
  const b = await chromium.launch();
  const c = await b.newContext({ storageState: env.AUTH_FILE, baseURL: env.BASE_URL, viewport: { width: 1600, height: 1000 }, acceptDownloads: true });
  const p = await c.newPage();
  await p.addLocatorHandler(p.locator('.modal.o_technical_modal').filter({ hasText: 'Open Customer Activities' }), (m) => m.locator('.btn-close').first().click({ timeout: 5000 }).catch(() => m.page().keyboard.press('Escape')));
  const pp = new PurchasePage(p);
  const out = process.argv[2];
  for (const [label, menu, name] of [['po', 'Purchase Order', 'P00785'], ['bill', 'Bill', 'BILL/123']]) {
    await pp.open(menu); await pp.search(name);
    await pp.rows(name).first().locator('td.o_data_cell').filter({ hasText: name }).first().click();
    await p.locator('.o_form_view').first().waitFor(); await pp.waitReady(); await p.waitForTimeout(1500);
    await p.locator('.o_control_panel button, .o_cp_action_menus button').filter({ hasText: /^\s*Action\s*$/ }).first().click();
    await p.waitForTimeout(800);
    const print = p.locator('.o-dropdown--menu .dropdown-item').filter({ hasText: /^\s*Print\s*$/ }).first();
    if (await print.isVisible().catch(() => false)) { await print.hover(); await p.waitForTimeout(600); }
    const items = (await p.locator('.o-dropdown--menu .dropdown-item').filter({ visible: true }).allInnerTexts()).map((t) => t.trim());
    console.log(label.toUpperCase(), 'MENU:', items.join(' | '));
    await p.keyboard.press('Escape');
    // UI columns + totals
    const lists = await p.evaluate(() => [...document.querySelectorAll('.o_action_manager .o_form_view .o_field_one2many[name]')].filter((e) => e.offsetParent).map((e) => e.getAttribute('name') + ': ' + [...e.querySelectorAll('th[data-name]')].map((t) => t.dataset.name).join(',')));
    console.log(label.toUpperCase(), 'LISTS:', lists.join(' || '));
    console.log(label.toUpperCase(), 'MONETARY:', await p.evaluate(() => [...document.querySelectorAll('.o_action_manager .o_form_view .o_field_monetary[name]')].filter((e) => e.offsetParent && !e.closest('.o_data_row')).map((e) => e.getAttribute('name') + '=' + e.innerText.trim()).join(' | ')));
  }
  await b.close();
})();
