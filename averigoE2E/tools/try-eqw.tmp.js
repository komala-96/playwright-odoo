const { chromium } = require('@playwright/test');
const env = require('../config/env');
const d = require('../data/testData');
const state = require('../utils/state');
const { EquipmentPage } = require('../pages/OtherModulesPage');
(async () => {
  const b = await chromium.launch();
  const c = await b.newContext({ storageState: env.AUTH_FILE, baseURL: env.BASE_URL, viewport: { width: 1600, height: 1000 } });
  const p = await c.newPage();
  await p.addLocatorHandler(p.locator('.modal.o_technical_modal').filter({ hasText: 'Open Customer Activities' }), (m) => m.locator('.btn-close').first().click({ timeout: 5000 }).catch(() => m.page().keyboard.press('Escape')));
  const o = new EquipmentPage(p);
  const cfg = d.equipmentConfig;
  if (0) for (const [menu, name] of [['Equipment Type', cfg.type], ['Equipment Name', cfg.name], ['Equipment Model', cfg.model], ['Equipment Model Number', cfg.modelNumber]]) {
    try { await o.createConfig(menu, name); console.log('CREATED', menu); } catch (e) { console.log('CONFIG ERR', menu, e.message.split('\n')[0]); }
  }
  const url = state.optional('equipment1Url') || await o.createEquipment({ serial: d.equipment1.serial }, cfg);
  await o.goto(url);
  state.set('equipment1Url', url);
  console.log('EQUIPMENT', url, 'STATUS', await o.status());
  await p.locator('button[name=action_view_asset_transfer]').click(); await o.waitReady(); await p.waitForTimeout(1500);
  const m = o.dialogs().last();
  console.log('WIZ FIELDS', await m.evaluate((e) => [...e.querySelectorAll('.o_field_widget[name]')].filter((x) => x.offsetParent).map((x) => x.getAttribute('name') + ':' + (x.className.match(/o_field_(?!widget)\w+/g) || []).join(',') + (x.classList.contains('o_required_modifier') ? '*' : '')).join(' ')));
  console.log('WIZ BUTTONS', await m.evaluate((e) => [...e.querySelectorAll('button')].filter((b) => b.offsetParent && b.innerText.trim()).map((b) => b.innerText.trim() + (b.name ? `{${b.name}}` : '')).join(' | ')));
  console.log('WIZ TEXT', (await m.innerText()).replace(/\s+/g, ' ').slice(0, 500));
  await b.close();
})();
