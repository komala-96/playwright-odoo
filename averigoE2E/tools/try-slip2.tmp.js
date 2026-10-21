const { chromium } = require('@playwright/test');
const env = require('../config/env');
const { SalesPage } = require('../pages/SalesPage');
(async () => {
  const b = await chromium.launch();
  const c = await b.newContext({ storageState: env.AUTH_FILE, baseURL: env.BASE_URL, viewport: { width: 1600, height: 1000 } });
  const p = await c.newPage();
  await p.addLocatorHandler(p.locator('.modal.o_technical_modal').filter({ hasText: 'Open Customer Activities' }), (m) => m.locator('.btn-close').first().click({ timeout: 5000 }).catch(() => m.page().keyboard.press('Escape')));
  const s = new SalesPage(p);
  await s.openApp('Customer Care'); await s.openMenu('Delivery', 'Packing Slip');
  await s.openRecord('PACK/01088');
  const f = p.locator('.o_action_manager .o_form_view').first();
  const sad = f.locator('.o_field_widget[name="select_all_delivery"]');
  console.log('select_all_delivery:', await sad.count(), await sad.evaluate((e) => e.className + ' :: ' + e.outerHTML.slice(0, 300)).catch(() => 'n/a'));
  console.log('checked:', await sad.locator('input').first().isChecked().catch(() => '?'));
  const summary = await f.evaluate((el) => [...el.querySelectorAll('.o_field_widget[name]')].filter((e) => e.offsetParent).map((e) => e.getAttribute('name') + ':' + (e.className.match(/o_field_\w+/g) || []).slice(1).join(',')).join(' '));
  console.log('FIELDS:', summary);
  const rows = f.locator('.o_data_row');
  console.log('ROWS:', (await rows.allInnerTexts()).map((t) => t.replace(/\s+/g, ' ').slice(0, 160)).join('\n  '));
  console.log('ROW checkboxes:', await f.locator('.o_data_row input[type=checkbox]').count(), 'checked:', await f.locator('.o_data_row input[type=checkbox]:checked').count());
  try { await s.fill({ select_all_delivery: true }, f); } catch (e) { console.log('fill err:', e.message.split('\n')[0]); }
  await p.waitForTimeout(1500);
  console.log('after fill: select_all', await sad.locator('input').first().isChecked(), '| row checked:', await f.locator('.o_data_row input[type=checkbox]:checked').count());
  console.log('DIALOGS:', (await p.locator('.modal:visible').filter({ hasNotText: 'Open Customer Activities' }).allInnerTexts()).map((t) => t.slice(0, 150).replace(/\n+/g, ' | ')).join(' || '));
  await p.screenshot({ path: 'tools/last.png', fullPage: true });
  await s.discard().catch(() => {});
  await b.close();
})();
