const { chromium } = require('@playwright/test');
const { execFileSync } = require('child_process');
const env = require('../config/env');
const { AccountingPage } = require('../pages/AccountingPage');
(async () => {
  const b = await chromium.launch();
  const c = await b.newContext({ storageState: env.AUTH_FILE, baseURL: env.BASE_URL, viewport: { width: 1600, height: 1000 }, acceptDownloads: true });
  const p = await c.newPage();
  await p.addLocatorHandler(p.locator('.modal.o_technical_modal').filter({ hasText: 'Open Customer Activities' }), (m) => m.locator('.btn-close').first().click({ timeout: 5000 }).catch(() => m.page().keyboard.press('Escape')));
  const a = new AccountingPage(p);
  for (const memo of ['DM84', 'DM82']) {
    await a.openAP('Credit Memo');
    await a.rows(memo).first().locator('td.o_data_cell').filter({ hasText: memo }).first().click();
    await p.locator('.o_form_view').first().waitFor(); await a.waitReady(); await p.waitForTimeout(1000);
    console.log(memo, 'FIELDS:', await p.evaluate(() => [...document.querySelectorAll('.o_action_manager .o_form_view .o_field_widget[name]')].filter((e) => e.offsetParent && !e.closest('.o_data_row') && /monetary|float|char|many2one|selection/.test(e.className)).map((e) => e.getAttribute('name') + '=' + (e.querySelector('input,select')?.value ?? e.innerText.trim()).slice(0, 25)).join(' | ')));
    console.log(memo, 'DIALOG:', (await p.locator('.modal:visible').allInnerTexts()).map((t) => t.slice(0, 300).replace(/\n+/g, ' | ')).join(' || '));
    await p.locator('.o_control_panel button, .o_cp_action_menus button').filter({ hasText: /^\s*Action\s*$/ }).first().click(); await p.waitForTimeout(800);
    const pr = p.locator('.o-dropdown--menu .dropdown-item').filter({ hasText: /^\s*Print\s*$/ }).first();
    if (await pr.isVisible().catch(() => false)) { await pr.hover(); await p.waitForTimeout(500); }
    const items = (await p.locator('.o-dropdown--menu .dropdown-item').filter({ visible: true }).allInnerTexts()).map((t) => t.trim());
    console.log(memo, 'MENU:', items.join(' | '));
    const rep = items.find((t) => /memo|credit|debit|bill/i.test(t) && !/Switch|Block|Payment Link/i.test(t));
    if (rep) {
      const dl = p.waitForEvent('download', { timeout: 60000 });
      await p.locator('.o-dropdown--menu .dropdown-item').filter({ hasText: new RegExp(`^\\s*${rep.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\s*$`) }).last().click();
      const f = `${process.argv[2]}/${memo}.pdf`; await (await dl).saveAs(f);
      console.log(execFileSync('pdftotext', ['-layout', f, '-']).toString().replace(/\n\s*\n+/g, '\n').slice(0, 1400));
    } else await p.keyboard.press('Escape');
  }
  await b.close();
})();
