const { chromium } = require('@playwright/test');
const env = require('../config/env');
const { SalesPage } = require('../pages/SalesPage');
(async () => {
  const b = await chromium.launch();
  const c = await b.newContext({ storageState: env.AUTH_FILE, baseURL: env.BASE_URL, viewport: { width: 1600, height: 1000 } });
  const p = await c.newPage();
  await p.addLocatorHandler(p.locator('.modal.o_technical_modal').filter({ hasText: 'Open Customer Activities' }), (m) => m.locator('.btn-close').first().click({ timeout: 5000 }).catch(() => m.page().keyboard.press('Escape')));
  const s = new SalesPage(p);
  // 1) confirmed order buttons
  await s.openOrder('S01355');
  const btns = await p.locator('.o_form_view button').filter({ visible: true }).evaluateAll((bs) => bs.map((x) => `${x.innerText.trim()}{${x.getAttribute('name') || ''}}`).filter((t) => !t.startsWith('{')));
  console.log('CONFIRMED ORDER BUTTONS:', btns.join(' | '));
  console.log('SMART:', (await p.locator('.oe_button_box button, .o_stat_button').filter({ visible: true }).allInnerTexts()).map((t) => t.replace(/\s+/g, ' ').trim()).join(' | '));
  // 2) delivery wizard on its in-progress slip
  await s.openApp('Customer Care'); await s.openMenu('Delivery', 'Packing Slip');
  await s.openRecord('PACK/01088');
  const f = p.locator('.o_action_manager .o_form_view').first();
  await s.fill({ select_all_delivery: true }, f);
  await f.locator('button[name="deliver_pack_slip_wizard"]').click();
  await s.waitReady(); await p.waitForTimeout(1500);
  const w = p.locator('.modal:visible').filter({ hasNotText: 'Open Customer Activities' }).last();
  console.log('WIZARD TEXT:', (await w.innerText()).slice(0, 900).replace(/\n+/g, ' | '));
  console.log('WIZARD FIELDS:', await w.evaluate((el) => [...el.querySelectorAll('.o_field_widget[name]')].filter((e) => e.offsetParent).map((e) => e.getAttribute('name') + '[' + (e.className.match(/o_field_\w+/g) || []).slice(1).join(',') + ']').join(' ')));
  console.log('WIZARD COLS:', await w.evaluate((el) => [...el.querySelectorAll('th[data-name]')].map((t) => t.dataset.name + ':' + t.innerText.trim()).join(' | ')));
  console.log('WIZARD BUTTONS:', (await w.locator('button, a.o_field_x2many_list_row_add a, .o_field_x2many_list_row_add a').filter({ visible: true }).evaluateAll((bs) => bs.map((x) => `${x.innerText.trim()}{${x.getAttribute('name') || ''}}`))).join(' | '));
  await p.screenshot({ path: 'tools/last.png' });
  // close without delivering
  await w.locator('.modal-footer button, .btn-close').filter({ hasText: /Cancel|Discard|Close/ }).first().click().catch(() => p.keyboard.press('Escape'));
  await b.close();
})();
