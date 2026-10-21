const { chromium } = require('@playwright/test');
const env = require('../config/env');
const { InventoryPage } = require('../pages/InventoryPage');
(async () => {
  const b = await chromium.launch();
  const c = await b.newContext({ storageState: env.AUTH_FILE, baseURL: env.BASE_URL, viewport: { width: 1600, height: 1000 } });
  const p = await c.newPage();
  await p.addLocatorHandler(p.locator('.modal.o_technical_modal').filter({ hasText: 'Open Customer Activities' }), (m) => m.locator('.btn-close').first().click({ timeout: 5000 }).catch(() => m.page().keyboard.press('Escape')));
  const i = new InventoryPage(p);
  for (const T of ['Warehouse', 'Truck']) {
    await i.open(); await i.openMenu('Locations'); await i.clickNew();
    await i.fill({ location_type: T });
    await i.fill({ zip: '94158' }); await i.fill({ street: '1700 Owens St' });
    await p.waitForTimeout(2000);
    console.log('=====', T);
    for (const f of ['store_no','warehouse_id','sales_tax','city','state_id','county','street2','country_id','location_id','division_id','branch','route','po_no','frequency','frequency_start_date','frequency_date','contact_person','email','active_date','vms_id','truck_driver']) {
      const fld = i.field(f);
      if (!(await fld.count())) continue;
      const editable = await fld.locator('input:not([readonly]):not([disabled]), textarea:not([readonly]), select, .o_av_cdd').count();
      const type = await i.widgetType(fld);
      const val = await i.read(f).catch(async () => (await fld.innerText()).trim());
      console.log(`${f} [${type}] editable=${editable} value=${JSON.stringify(val)}`);
    }
    for (const f of ['division_id', 'frequency', 'route', 'truck_driver']) {
      const fld = i.field(f);
      if (!(await fld.count())) continue;
      if (await fld.locator('.o_av_cdd').count()) await fld.locator('.o_av_cdd').first().click(); else await fld.locator('input').first().click();
      await p.waitForTimeout(2000);
      const opts = await p.locator('.o-autocomplete--dropdown-item, .o_av_cdd_option, .o_av_cdd li, .o_av_cdd label').filter({ visible: true }).allInnerTexts();
      console.log(f, 'OPTIONS:', opts.slice(0, 10).map((o) => o.trim()).join(' | '));
      await p.keyboard.press('Escape'); await p.waitForTimeout(300);
    }
    await i.discard().catch(() => {});
  }
  await b.close();
})();
