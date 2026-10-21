const { chromium } = require('@playwright/test');
const { execFileSync } = require('child_process');
const env = require('../config/env');
const state = require('../utils/state');
const { SalesPage } = require('../pages/SalesPage');
(async () => {
  const b = await chromium.launch();
  const c = await b.newContext({ storageState: env.AUTH_FILE, baseURL: env.BASE_URL, viewport: { width: 1600, height: 1000 }, acceptDownloads: true });
  const p = await c.newPage();
  await p.addLocatorHandler(p.locator('.modal.o_technical_modal').filter({ hasText: 'Open Customer Activities' }), (m) => m.locator('.btn-close').first().click({ timeout: 5000 }).catch(() => m.page().keyboard.press('Escape')));
  const s = new SalesPage(p);
  const out = process.argv[2];
  for (const [label, url, item] of [['invoice', state.get('c1Invoice').url, /^\s*Invoices\s*$/], ['order', state.get('c1Invoice').orderUrl, /^\s*Quotation \/ Order\s*$/]]) {
    await s.goto(url);
    await p.locator('.o_control_panel button, .o_cp_action_menus button').filter({ hasText: /^\s*Action\s*$/ }).first().click();
    await p.waitForTimeout(800);
    const print = p.locator('.o-dropdown--menu .dropdown-item').filter({ hasText: /^\s*Print\s*$/ }).first();
    if (await print.isVisible().catch(() => false)) { await print.hover(); await p.waitForTimeout(500); }
    const download = p.waitForEvent('download', { timeout: 60000 }).catch(() => null);
    const popup = c.waitForEvent('page', { timeout: 60000 }).catch(() => null);
    await p.locator('.o-dropdown--menu .dropdown-item').filter({ hasText: item }).last().click();
    const res = await Promise.race([download.then((d) => d && { d }), popup.then((pg) => pg && { pg })]);
    let file = `${out}/${label}.pdf`;
    if (res?.d) { await res.d.saveAs(file); console.log(label, 'DOWNLOAD', res.d.suggestedFilename()); }
    else if (res?.pg) { console.log(label, 'POPUP', res.pg.url()); }
    else { console.log(label, 'nothing'); continue; }
    console.log(execFileSync('pdftotext', ['-layout', file, '-']).toString());
  }
  await b.close();
})();
