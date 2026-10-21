const { chromium } = require('@playwright/test');
const env = require('../config/env');
const { EmployeePage } = require('../pages/OtherModulesPage');
(async () => {
  const b = await chromium.launch();
  const c = await b.newContext({ storageState: env.AUTH_FILE, baseURL: env.BASE_URL, viewport: { width: 1600, height: 1000 } });
  const p = await c.newPage();
  await p.addLocatorHandler(p.locator('.modal.o_technical_modal').filter({ hasText: 'Open Customer Activities' }), (m) => m.locator('.btn-close').first().click({ timeout: 5000 }).catch(() => m.page().keyboard.press('Escape')));
  const e = new EmployeePage(p);
  await e.openApp('Employees');
  await e.clickNew();
  console.log('PHOTO:', await e.field('image_1920').evaluate((el) => el.outerHTML.slice(0, 1500)));
  await e.openTab('Private Information');
  console.log('PERMIT:', await e.field('has_work_permit').evaluate((el) => el.outerHTML.slice(0, 1500)));
  await b.close();
})();
