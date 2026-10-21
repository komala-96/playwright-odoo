const { chromium } = require('@playwright/test');
const env = require('../config/env');
const state = require('../utils/state');
const { EquipmentPage } = require('../pages/OtherModulesPage');
(async () => {
  const b = await chromium.launch();
  const c = await b.newContext({ storageState: env.AUTH_FILE, baseURL: env.BASE_URL, viewport: { width: 1600, height: 1000 } });
  const p = await c.newPage();
  await p.addLocatorHandler(p.locator('.modal.o_technical_modal').filter({ hasText: 'Open Customer Activities' }), (m) => m.locator('.btn-close').first().click({ timeout: 5000 }).catch(() => m.page().keyboard.press('Escape')));
  const o = new EquipmentPage(p);
  await o.goto(state.get('equipment2Url'));
  console.log('STATUS', await o.status());
  await o.click('action_view_asset_transfer');
  const dlg = o.dialogs().last(); await dlg.waitFor(); await p.waitForTimeout(2000);
  console.log('HTML', (await dlg.locator('.o_field_widget[name=activity_type]').evaluateAll((els) => els.map((e) => `visible=${!!e.offsetParent} ${e.outerHTML.replace(/\s+/g, ' ').slice(0, 400)}`))).join('\n'));
  await b.close();
})();
