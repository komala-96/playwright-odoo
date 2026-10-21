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
  await pp.open('Purchase Order'); await pp.search('P00785');
  await pp.rows('P00785').first().locator('td.o_data_cell').filter({ hasText: 'P00785' }).first().click();
  await pp.field('order_line').waitFor();
  console.log('PO COLS:', await pp.field('order_line').evaluate((e) => [...e.querySelectorAll('th[data-name]')].map((t) => t.dataset.name).join(',')));
  for (const [label, item] of [['po', /^\s*Purchase Order\s*$/]]) {
    await p.locator('.o_control_panel button, .o_cp_action_menus button').filter({ hasText: /^\s*Action\s*$/ }).first().click();
    const print = p.locator('.o-dropdown--menu .dropdown-item').filter({ hasText: /^\s*Print\s*$/ }).first();
    if (await print.isVisible().catch(() => false)) await print.hover();
    const dl = p.waitForEvent('download', { timeout: 60000 });
    await p.locator('.o-dropdown--menu .dropdown-item').filter({ hasText: item }).last().click();
    const f = `${process.argv[2]}/${label}.pdf`; await (await dl).saveAs(f);
    console.log(execFileSync('pdftotext', ['-layout', f, '-']).toString().slice(0, 2500));
  }
  await b.close();
})();
