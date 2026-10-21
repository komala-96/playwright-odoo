const { chromium } = require('@playwright/test');
const env = require('../config/env');
const { InventoryPage } = require('../pages/InventoryPage');
(async () => {
  const b = await chromium.launch();
  const c = await b.newContext({ storageState: env.AUTH_FILE, baseURL: env.BASE_URL, viewport: { width: 1600, height: 1000 } });
  const p = await c.newPage();
  await p.addLocatorHandler(p.locator('.modal.o_technical_modal').filter({ hasText: 'Open Customer Activities' }), (m) => m.locator('.btn-close').first().click({ timeout: 5000 }).catch(() => m.page().keyboard.press('Escape')));
  const i = new InventoryPage(p);
  await i.open(); await i.openMenu('Material Issue');
  await i.search('MI00376');
  await i.rows('MI00376').first().locator('td.o_data_cell').filter({ hasText: 'MI00376' }).first().click();
  await p.locator('.o_form_view').first().waitFor(); await i.waitReady();
  console.log('STATUS BAR:', (await p.locator('.o_statusbar_status').innerText()).replace(/\s+/g, ' '));
  console.log('BUTTONS:', (await p.locator('.o_form_view button').filter({ visible: true }).evaluateAll((bs) => bs.map((x) => `${x.innerText.trim()}{${x.getAttribute('name') || ''}}`).filter((t) => !t.startsWith('{')))).join(' | '));
  console.log('SMART:', (await p.locator('.oe_button_box button, .o_stat_button').filter({ visible: true }).allInnerTexts()).map((t) => t.replace(/\s+/g, ' ')).join(' | '));
  await b.close();
})();
