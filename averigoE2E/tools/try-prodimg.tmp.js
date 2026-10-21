const { chromium } = require('@playwright/test');
const env = require('../config/env');
const { InventoryPage } = require('../pages/InventoryPage');
(async () => {
  const b = await chromium.launch();
  const c = await b.newContext({ storageState: env.AUTH_FILE, baseURL: env.BASE_URL, viewport: { width: 1600, height: 1000 } });
  const p = await c.newPage();
  await p.addLocatorHandler(p.locator('.modal.o_technical_modal').filter({ hasText: 'Open Customer Activities' }), (m) => m.locator('.btn-close').first().click({ timeout: 5000 }).catch(() => m.page().keyboard.press('Escape')));
  const i = new InventoryPage(p);
  await i.openProductMaster(); await i.clickNew();
  await i.openTab('Additional Images');
  await i.field('product_image_ids').locator('button, a').filter({ hasText: /Add/ }).first().click();
  await p.waitForTimeout(2000);
  const dlg = i.dialogs().last();
  console.log('IMG DIALOG:', await dlg.evaluate((el) => [...el.querySelectorAll('.o_field_widget[name]')].filter((e) => e.offsetParent).map((e) => `${e.getAttribute('name')}[${(e.className.match(/o_field_\w+/g) || []).slice(1).join(',')}]${e.classList.contains('o_required_modifier') ? '*' : ''}`).join(' ')).catch(() => 'none'));
  console.log('BUTTONS:', (await dlg.locator('.modal-footer button').allInnerTexts()).join(' | '));
  await i.openTab('TAX');
  for (const f of ['sale_acc', 'cogs_acc']) {} 
  await i.openTab('Sales & Purchase');
  for (const f of ['sale_acc', 'cogs_acc', 'res_partner']) {
    const fld = i.field(f);
    console.log(f, 'cdd:', await fld.locator('.o_av_cdd').count());
  }
  await b.close();
})();
