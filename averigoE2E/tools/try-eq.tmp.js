const { chromium } = require('@playwright/test');
const env = require('../config/env');
const { EquipmentPage } = require('../pages/OtherModulesPage');
(async () => {
  const b = await chromium.launch();
  const c = await b.newContext({ storageState: env.AUTH_FILE, baseURL: env.BASE_URL, viewport: { width: 1600, height: 1000 } });
  const p = await c.newPage();
  await p.addLocatorHandler(p.locator('.modal.o_technical_modal').filter({ hasText: 'Open Customer Activities' }), (m) => m.locator('.btn-close').first().click({ timeout: 5000 }).catch(() => m.page().keyboard.press('Escape')));
  const o = new EquipmentPage(p);
  await o.open('Equipment');
  console.log('LIST COLS', await p.locator('th[data-name]').evaluateAll((t) => t.map((x) => x.dataset.name + ':' + x.innerText.trim()).join(' | ')));
  await o.rows().first().locator('td.o_data_cell').first().click().catch(() => o.rows().first().click()); await o.waitReady(); await p.waitForTimeout(1500);
  console.log('URL', p.url());
  console.log('STATUSBAR', (await p.locator('.o_statusbar_status').innerText().catch(() => 'none')).replace(/\s+/g, ' '));
  console.log('BUTTONS', await p.evaluate(() => [...document.querySelectorAll('.o_form_view button, .o_control_panel button')].filter((b) => b.offsetParent && b.innerText.trim()).map((b) => b.innerText.trim().replace(/\s+/g, ' ') + (b.name ? `{${b.name}}` : '')).join(' | ')));
  await p.locator('button[name=action_view_asset_transfer]').click(); await o.waitReady(); await p.waitForTimeout(2000);
  console.log('AFTER URL', p.url(), 'MODAL', (await p.locator('.modal:visible').filter({ hasNotText: 'Open Customer Activities' }).allInnerTexts()).map((t) => t.replace(/\s+/g, ' ').slice(0, 400)));
  console.log('VIEW BUTTONS', await p.evaluate(() => [...document.querySelectorAll('.o_control_panel button, .modal button')].filter((b) => b.offsetParent && b.innerText.trim()).map((b) => b.innerText.trim()).join(' | ')));
  const newBtn = p.locator('.o_control_panel button').filter({ hasText: /^\s*New\s*$/ }).first();
  if (await newBtn.isVisible().catch(() => false)) { await newBtn.click(); await o.waitReady(); await p.waitForTimeout(1500); console.log('NEW FORM FIELDS', await p.evaluate(() => [...document.querySelectorAll('.o_form_view .o_field_widget[name]')].filter((e) => e.offsetParent).map((e) => e.getAttribute('name') + (e.classList.contains('o_required_modifier') ? '*' : '')).join(' '))); console.log('NEW FORM BUTTONS', await p.evaluate(() => [...document.querySelectorAll('.o_form_view button')].filter((b) => b.offsetParent && b.innerText.trim()).map((b) => b.innerText.trim() + (b.name ? `{${b.name}}` : '')).join(' | '))); }
  console.log('FIELDS', await p.evaluate(() => [...document.querySelectorAll('.o_form_view .o_field_widget[name]')].filter((e) => e.offsetParent).map((e) => e.getAttribute('name')).join(' ')));
  await b.close();
})();
