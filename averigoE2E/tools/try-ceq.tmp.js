const { chromium } = require('@playwright/test');
const env = require('../config/env');
const state = require('../utils/state');
const { CustomerCarePage } = require('../pages/CustomerCarePage');
(async () => {
  const b = await chromium.launch();
  const c = await b.newContext({ storageState: env.AUTH_FILE, baseURL: env.BASE_URL, viewport: { width: 1600, height: 1000 } });
  const p = await c.newPage();
  await p.addLocatorHandler(p.locator('.modal.o_technical_modal').filter({ hasText: 'Open Customer Activities' }), (m) => m.locator('.btn-close').first().click({ timeout: 5000 }).catch(() => m.page().keyboard.press('Escape')));
  const o = new CustomerCarePage(p);
  await o.goto(state.get('customer1Url'));
  await o.openTab('Equipments');
  const pane = p.locator('.o_form_view .o_notebook .tab-pane.active');
  console.log('PANE', (await pane.evaluate((e) => e.innerText)).replace(/\s+/g, ' ').slice(0, 300));
  console.log('PANE BUTTONS/LINKS', await pane.locator('button, a').allInnerTexts());
  console.log('FIELDS', await pane.evaluate((e) => [...e.querySelectorAll('.o_field_widget[name]')].map((x) => x.getAttribute('name') + ':' + (x.className.match(/o_field_(?!widget)\w+/g) || []).join(',')).join(' ')));
  await b.close();
})();
