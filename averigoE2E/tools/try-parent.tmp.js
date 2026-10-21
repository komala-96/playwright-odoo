const { chromium } = require('@playwright/test');
const env = require('../config/env');
const { CustomerCarePage } = require('../pages/CustomerCarePage');
(async () => {
  const b = await chromium.launch();
  const c = await b.newContext({ storageState: env.AUTH_FILE, baseURL: env.BASE_URL, viewport: { width: 1600, height: 1000 } });
  const p = await c.newPage();
  await p.addLocatorHandler(p.locator('.modal.o_technical_modal').filter({ hasText: 'Open Customer Activities' }), (m) => m.locator('.btn-close').first().click({ timeout: 5000 }).catch(() => m.page().keyboard.press('Escape')));
  const i = new CustomerCarePage(p);
  await i.open(); await i.openMenu('Configuration', 'Parent'); await i.clickNew();
  console.log('remit html:', await i.field('default_remit_to_address_id').evaluate((el) => el.outerHTML.slice(0, 300)));
  for (const f of ['property_payment_term_id','visitors_types_ids','route_id']) {
    const fld = i.field(f);
    console.log(f, 'type', await i.widgetType(fld), 'value', JSON.stringify(await i.read(f).catch(() => '')));
    if (await fld.locator('.o_av_cdd').count()) await fld.locator('.o_av_cdd_trigger').first().click(); else await fld.locator('input').first().click();
    await p.waitForTimeout(2000);
    console.log('   OPTIONS:', (await p.locator('.o-autocomplete--dropdown-item, .o_av_cdd_list li').filter({ visible: true }).allInnerTexts()).slice(0, 8).map((s) => s.trim()).join(' | '));
    await p.keyboard.press('Escape'); await p.waitForTimeout(300);
    await i.field('name').click().catch(() => {});
  }
  await i.openTab('Contacts & Addresses');
  await i.field('child_ids_contacts').locator('button, a').filter({ hasText: /Add/ }).first().click().catch((e) => console.log('add err', e.message));
  await p.waitForTimeout(2000);
  const dlg = p.locator('.modal:visible').last();
  console.log('CONTACT DIALOG FIELDS:', await dlg.evaluate((el) => [...el.querySelectorAll('.o_field_widget[name]')].filter((e) => e.offsetParent).map((e) => e.getAttribute('name') + '[' + (e.className.match(/o_field_\w+/g) || []).slice(1).join(',') + ']').join(' ')).catch(() => 'none'));
  await b.close();
})();
