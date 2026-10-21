const { chromium } = require('@playwright/test');
const env = require('../config/env');
const state = require('../utils/state');
const { SalesPage } = require('../pages/SalesPage');
(async () => {
  const b = await chromium.launch();
  const c = await b.newContext({ storageState: env.AUTH_FILE, baseURL: env.BASE_URL, viewport: { width: 1600, height: 1000 } });
  const p = await c.newPage();
  await p.addLocatorHandler(p.locator('.modal.o_technical_modal').filter({ hasText: 'Open Customer Activities' }), (m) => m.locator('.btn-close').first().click({ timeout: 5000 }).catch(() => m.page().keyboard.press('Escape')));
  const s = new SalesPage(p);
  await s.goto(state.get('c1Invoice').url);
  await s.field('amount_total_view').waitFor(); await p.waitForTimeout(1500);
  const lists = await p.evaluate(() => [...document.querySelectorAll('.o_action_manager .o_form_view .o_field_one2many[name], .o_action_manager .o_form_view .o_field_x2many[name]')].filter((e) => e.offsetParent).map((e) => e.getAttribute('name') + ': ' + [...e.querySelectorAll('th[data-name]')].map((t) => t.dataset.name).join(',')));
  console.log('INVOICE LISTS:', lists.join('\n  '));
  console.log('HEADER:', await p.evaluate(() => [...document.querySelectorAll('.o_action_manager .o_form_view .o_field_widget[name]')].filter((e) => e.offsetParent && !e.closest('.o_data_row') && !e.closest('.o_field_one2many')).map((e) => e.getAttribute('name') + '=' + (e.querySelector('input,select')?.value ?? e.innerText.trim().slice(0, 30))).join(' | ')));
  await b.close();
})();
