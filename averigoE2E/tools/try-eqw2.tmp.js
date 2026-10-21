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
  const url = state.get('equipment1Url');
  await o.goto(url);
  await o.click('action_view_asset_transfer');
  const dlg = o.dialogs().filter({ has: p.locator('.o_field_widget[name="activity_type"]') }).last();
  await dlg.waitFor();
  console.log('ACTIVITY WIDGET', (await dlg.locator('.o_field_widget[name=activity_type]').evaluate((e) => e.outerHTML)).replace(/\s+/g, ' ').slice(0, 500));
  console.log('LOCTYPE WIDGET', (await dlg.locator('.o_field_widget[name=transfer_location_type]').evaluate((e) => e.outerHTML)).replace(/\s+/g, ' ').slice(0, 400));
  await o.fill({ activity_type: 'Install' }, dlg);
  console.log('after type', await o.read('activity_type', dlg));
  for (const [lt, field, q] of [['Other', 'destination_location_id', 'a']]) {
    await o.fill({ transfer_location_type: lt }, dlg); await p.waitForTimeout(1000);
    if (lt === 'Other') await o.fill({ transfer_location_partner_id: d.customer1.name }, dlg).catch((e) => console.log('CUST ERR', e.message.split('\n')[0]));
    await p.waitForTimeout(1000);
    console.log(lt, 'VISIBLE FIELDS', await dlg.evaluate((e) => [...e.querySelectorAll('.o_field_widget[name]')].filter((x) => x.offsetParent).map((x) => x.getAttribute('name') + (x.classList.contains('o_required_modifier') ? '*' : '')).join(' ')));
    const f = dlg.locator(`.o_field_widget[name=${field}]`);
    if (await f.count()) {
      await f.locator('input').click(); await f.locator('input').fill(q); await p.waitForTimeout(3000);
      console.log(field, 'OPTIONS a', (await p.locator('.o-autocomplete--dropdown-item').allInnerTexts()).slice(0, 10)); for (const q2 of ['CUST', '1700', 'Stock', 'WH']) { await f.locator('input').fill(q2); await p.waitForTimeout(2500); console.log(field, 'OPTIONS', q2, (await p.locator('.o-autocomplete--dropdown-item').allInnerTexts()).slice(0, 8)); }
      await p.keyboard.press('Escape');
    } else console.log(field, 'not present');
  }
  await b.close();
})();
