const { chromium } = require('@playwright/test');
const env = require('../config/env');
const { SalesPage } = require('../pages/SalesPage');
(async () => {
  const b = await chromium.launch();
  const c = await b.newContext({ storageState: env.AUTH_FILE, baseURL: env.BASE_URL, viewport: { width: 1600, height: 1000 } });
  const p = await c.newPage();
  await p.addLocatorHandler(p.locator('.modal.o_technical_modal').filter({ hasText: 'Open Customer Activities' }), (m) => m.locator('.btn-close').first().click({ timeout: 5000 }).catch(() => m.page().keyboard.press('Escape')));
  const s = new SalesPage(p);
  await s.openOrder('S01360');
  const btns = await p.locator('.o_form_view .o_statusbar_buttons button, .o_form_view .o_form_statusbar button').filter({ visible: true }).evaluateAll((bs) => bs.map((x) => `${x.innerText.trim()}{name=${x.getAttribute('name') || ''} type=${x.getAttribute('type') || ''}}`));
  console.log('STATUSBAR BUTTONS:', btns.join(' | '));
  console.log('INVOICES smart:', (await p.locator('button[name="action_view_invoice"]').innerText().catch(() => 'none')).replace(/\s+/g, ' '));
  console.log('LINES:', (await s.field('order_line').locator('.o_data_row').allInnerTexts()).map((t) => t.replace(/\s+/g, ' ').slice(0, 120)).join('\n  '));
  b.close();
})();
