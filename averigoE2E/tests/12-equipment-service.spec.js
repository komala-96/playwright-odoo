const { test, expect, tc } = require('../fixtures');
const d = require('../data/testData');
const state = require('../utils/state');
const { today, firstOfMonth, usDate, addDays } = require('../utils/dates');
const { ReportsPage } = require('../pages/ReportsPage');

const cfg = d.equipmentConfig;

test.describe.serial('Equipment & case management (TC-079..TC-084, TC-086)', () => {
  test(...tc('TC-079'), async ({ equipmentPage, servicePage }) => {
    const equipment = [['Equipment Type', cfg.type], ['Equipment Name', cfg.name], ['Equipment Model', cfg.model], ['Equipment Model Number', cfg.modelNumber]];
    for (const [menu, name] of equipment) {
      await test.step(menu, async () => {
        await equipmentPage.open('Configuration', menu);
        if (!(await equipmentPage.rows(name).count())) await equipmentPage.createConfig(menu, name);
        await equipmentPage.expectInList(name);
      });
    }
    await test.step('Equipment Area/POS Location (list only, no New in this instance)', async () => {
      await equipmentPage.open('Configuration', 'Equipment Area/POS Location');
      await expect(equipmentPage.page.locator('.o_list_view')).toBeVisible();
    });
    for (const [menu, name] of [['Case Categories', cfg.caseCategory], ['Case Origins', cfg.caseOrigin], ['Case Type', cfg.caseType]]) {
      await test.step(menu, async () => {
        await servicePage.open('Configuration', menu);
        if (!(await servicePage.rows(name).count())) await servicePage.createConfig(menu, name);
        await servicePage.expectInList(name);
      });
    }
    await test.step('Case Stages', async () => {
      await servicePage.open('Configuration', 'Case Stages');
      if (!(await servicePage.rows(cfg.caseStage).count())) {
        await servicePage.clickNew();
        await servicePage.fill({ name: cfg.caseStage, sequence: 99 });
        await servicePage.save();
        await servicePage.open('Configuration', 'Case Stages');
      }
      await servicePage.expectInList(cfg.caseStage);
    });
  });

  test(...tc('TC-080'), async ({ equipmentPage }) => {
    // Every field on the part form; a part from an earlier run is updated instead of duplicated.
    const part = { ...d.part, uom: d.uom.name, vendor: d.vendor.name };
    const { url, priceError } = await equipmentPage.createPart(part, { category: d.category.name, url: state.optional('partUrl') });
    state.set('partUrl', url);
    await test.step('Equipment Parts list shows the part with its price and cost', async () => {
      const card = await equipmentPage.partCard(d.part.name);
      if (!priceError) expect.soft(card.listPrice, `list price on the card: ${card.text}`).toBeCloseTo(part.price, 2);
      expect.soft(card.cost, `cost on the card: ${card.text}`).toBeCloseTo(part.cost, 2);
    });
  });

  test(...tc('TC-081'), async ({ equipmentPage }) => {
    // Every field, located in the TC-005 warehouse (WH-QA-001). An Equipment 1 created earlier without them is replaced
    // (its warehouse can't change once In Service), using a new serial.
    const e1 = d.equipment1;
    let url = state.optional('equipment1AllFields') ? state.optional('equipment1Url') : undefined;
    if (!url) {
      const serial = state.optional('equipment1Url') ? `${e1.serial}-WH` : e1.serial;
      const extras = {
        warehouse: `${d.warehouse.name}/Stock`, image: e1.image, assetNo: e1.assetNo, frontage: e1.frontage, finance: e1.finance,
        manufacture: e1.manufacture, distributor: e1.distributor, purchaseDate: today(), warrantyEnd: usDate(addDays(365)),
        flags: e1.flags, recurring: e1.recurring, parts: [{ name: d.part.name, qty: e1.partQty }], note: e1.note,
      };
      url = await equipmentPage.createEquipment({ serial, value: e1.value }, cfg, extras);
      state.set('equipment1Url', url);
      state.set('equipment1AllFields', true);
    }
    await equipmentPage.goto(url);
    if (/Active/.test(await equipmentPage.status())) {
      expect(await equipmentPage.equipmentActivity(url, { type: 'Install', customer: d.customer1.name }), 'status after Install').toMatch(/In Service/i);
    }
    await equipmentPage.expectStatus(/In Service/i);
    expect(await equipmentPage.read('location_partner_id')).toContain(d.customer1.name);
    if (e1.recurring && !state.optional('equipment1Recurring')) {
      await test.step('Recurring Details (available once In Service)', async () => {
        const r = await equipmentPage.setRecurring(url, e1.recurring);
        state.set('equipment1Recurring', r.picked);
      });
    }
  });

  test(...tc('TC-082'), async ({ equipmentPage }) => {
    // Same as TC-081: every field, in the TC-005 warehouse; an Equipment 2 created earlier without them is replaced (new serial).
    const e2 = d.equipment2;
    let url = state.optional('equipment2AllFields') ? state.optional('equipment2Url') : undefined;
    if (!url) {
      const serial = state.optional('equipment2Url') ? `${e2.serial}-WH` : e2.serial;
      const extras = {
        warehouse: `${d.warehouse.name}/Stock`, image: e2.image, assetNo: e2.assetNo, frontage: e2.frontage, finance: e2.finance,
        manufacture: e2.manufacture, distributor: e2.distributor, purchaseDate: today(), warrantyEnd: usDate(addDays(730)),
        flags: e2.flags, parts: [{ name: d.part.name, qty: e2.partQty }], note: e2.note,
      };
      url = await equipmentPage.createEquipment({ serial, value: e2.value }, cfg, extras);
      state.set('equipment2Url', url);
      state.set('equipment2AllFields', true);
    }
    await equipmentPage.goto(url);
    if (/Active/.test(await equipmentPage.status())) {
      expect(await equipmentPage.equipmentActivity(url, { type: 'Install', customer: d.customer1.name, market: d.microMarket.name }), 'status after Install').toMatch(/In Service/i);
    }
    await equipmentPage.expectStatus(/In Service/i);
    expect(await equipmentPage.read('location_partner_id')).toContain(d.customer1.name);
    expect(await equipmentPage.read('micro_market_id')).toContain(d.microMarket.name);
    if (e2.recurring && !state.optional('equipment2Recurring')) {
      await test.step('Recurring Details (available once In Service)', async () => {
        const r = await equipmentPage.setRecurring(url, e2.recurring);
        state.set('equipment2Recurring', r.picked);
      });
    }
  });

  test(...tc('TC-083'), async ({ equipmentPage }) => {
    // Lifecycle via Equipment Activity (allowed path from In Service). Statuses on this instance:
    // Active / In Service / OutSide Repair / Inactive / Archived; there is no separate "Repair"/"Exchange"
    // status, Exchange is an activity on an In Service equipment.
    const url = state.get('equipment2Url');
    const install = { customer: d.customer1.name, market: d.microMarket.name };
    const steps = [
      ['Remove', {}, /Active/i],
      ['OutSide Repair', {}, /OutSide Repair/i],
      ['Install', install, /In Service/i],
    ];
    const history = [];
    // Start from In Service whatever state an earlier run left it in.
    await equipmentPage.goto(url);
    if (!/In Service/i.test(await equipmentPage.status())) {
      if (/OutSide Repair/i.test(await equipmentPage.status())) await equipmentPage.equipmentActivity(url, { type: 'Install', ...install });
      else await equipmentPage.equipmentActivity(url, { type: 'Install', ...install });
    }
    for (const [type, opts, expected] of steps) {
      await test.step(`${type} -> ${expected}`, async () => {
        const status = await equipmentPage.equipmentActivity(url, { type, ...opts });
        history.push(`${type}: ${status}`);
        expect.soft(status, `status after ${type}`).toMatch(expected);
      });
    }
    await test.step('Exchange with a replacement equipment', async () => {
      const url3 = state.optional('equipment3Url') || (await equipmentPage.createEquipment({ serial: `${d.equipment2.serial}-X` }, cfg));
      state.set('equipment3Url', url3);
      await equipmentPage.goto(url3);
      const code3 = (await equipmentPage.read('code')).trim();
      const status = await equipmentPage.equipmentActivity(url, { type: 'Exchange', ...install, exchangeWith: code3 });
      history.push(`Exchange: ${status}`);
      await equipmentPage.goto(url3);
      expect.soft(await equipmentPage.status(), 'replacement equipment installed').toMatch(/In Service/i);
    });
    test.info().annotations.push({ type: 'Status history', description: history.join(' | ') });
    await equipmentPage.goto(url);
    await expect(equipmentPage.page.locator('button[name="open_location_history"]')).toBeVisible();
  });

  test(...tc('TC-084'), async ({ servicePage, equipmentPage }) => {
    await equipmentPage.goto(state.get('equipment1Url'));
    const equipmentCode = (await equipmentPage.read('code')).trim();
    const issue = `QA issue on ${d.equipment1.serial}`;
    const resolution = `QA resolved ${d.equipment1.serial}`;
    // Every field on the case form.
    const extras = {
      contactName: 'QA Case Contact', email: 'case.contact.qa@example.com', assignedTo: true /* first offered */,
      route: d.route.name, billable: true, preventive: true, priority: 2,
      reportedPhone: '4155550161', reportedBy: 'QA Reporter', reportedEmail: 'qa.reporter@example.com',
      partsWarehouse: true /* first offered */, equipmentLocation: true,
    };
    const url = await servicePage.createCase({
      customer: d.customer1.name, equipment: equipmentCode,
      category: cfg.caseCategory, type: cfg.caseType, origin: cfg.caseOrigin,
      description: issue, comment: `Internal: ${issue}`, extras,
    });
    state.set('caseUrl', url);
    // An assigned case starts In Progress, an unassigned one Open/New.
    expect(await servicePage.read('stage_id')).toMatch(/Open|New|In Progress/i);

    await test.step('Add a case note (Notes) and a chatter log note', async () => {
      await servicePage.addCaseNote(`QA case note for ${issue}`);
      expect.soft(await servicePage.caseCounter('open_notes'), 'Notes counter').toBeGreaterThanOrEqual(1);
      await servicePage.logNote(`QA log note: ${issue}`);
    });
    await test.step('Add an attachment', async () => {
      await servicePage.addCaseAttachment(url, { name: 'QA case photo', file: d.equipment1.image });
      expect.soft(await servicePage.caseCounter('action_get_attachment_view'), 'Attachments counter').toBeGreaterThanOrEqual(1);
    });

    // Tech Person: the first technician offered in the Close Case dropdown.
    const close = async () => {
      const r = await servicePage.closeCase({ resolution, comment: `Closing ${issue}`, tech: true });
      if (r.tech) test.info().annotations.push({ type: 'Tech Person', description: r.tech });
      return r;
    };
    const first = await close();
    expect.soft(first.error, 'Close Case on a Billable case (see FINDINGS.md TC-084)').toBeUndefined();
    if (first.error) {
      await test.step('Billable close failed: untick Billable and close again', async () => {
        await servicePage.goto(url);
        await servicePage.setBoolean('is_billable', false);
        await servicePage.save();
        const second = await close();
        expect(second.error, 'Close Case (not billable)').toBeUndefined();
      });
    }
    await servicePage.goto(url);
    expect(await servicePage.read('stage_id'), 'final stage').toMatch(/Clos|Resolv|Done/i);
    await expect(servicePage.page.locator('button[name="action_open_resolution"]')).toContainText(/[1-9]/);
    await expect(servicePage.page.locator('button[name="action_open_descriptions"]')).toContainText(/[1-9]/);
    // Notes and attachment still on the closed case.
    expect.soft(await servicePage.caseCounter('open_notes'), 'Notes after close').toBeGreaterThanOrEqual(1);
    expect.soft(await servicePage.caseCounter('action_get_attachment_view'), 'Attachments after close').toBeGreaterThanOrEqual(1);
  });

  test(...tc('TC-086'), async ({ reportsPage, servicePage, equipmentPage }) => {
    const day = today();
    await servicePage.goto(state.get('caseUrl'));
    const caseNo = await servicePage.recordTitle();
    await test.step('Equipment Case Report', async () => {
      const text = await reportsPage.run({ category: 'Equipment Management', tile: 'Equipment Case Report', filters: { customers: [d.customer1.name], start: day, end: day }, expectContains: [caseNo, d.equipment1.serial] });
      expect(ReportsPage.rowFor(text, caseNo)).toMatch(/Clos/i);
    });
    await test.step('Equipment Addition/Archive Report', () => reportsPage.run({
      category: 'Equipment Management', tile: 'Equipment Addition/Archive Report', filters: { start: day, end: day, Status: 'All' },
      expectContains: [d.equipment1.serial, d.equipment2.serial],
    }));
    await test.step('Equipment Inventory Report', () => reportsPage.run({
      category: 'Equipment Management', tile: 'Equipment Inventory Report', filters: { start: day, end: day }, expectContains: [cfg.name],
    }));
    await test.step('Equipment Move Report', async () => {
      const text = await reportsPage.run({ category: 'Equipment Management', tile: 'Equipment Move Report', filters: { customers: [d.customer1.name], 'Activity Type': 'All', start: day, end: day }, expectContains: [d.equipment2.serial] });
      for (const type of ['Install', 'Remove', 'Exchange']) expect.soft(text, `${type} move listed`).toMatch(new RegExp(type, 'i'));
    });
    await test.step('Equipment Location Report', async () => {
      // Equipment 1 (TC-081): installed at Customer 1, manufacturer from its Other Details.
      await equipmentPage.goto(state.get('equipment1Url'));
      const serial = (await equipmentPage.read('serial_no')).trim();
      const status = (await equipmentPage.status()).trim();
      const manufacturer = d.equipment1.manufacture;
      const text = await reportsPage.run({
        category: 'Equipment Management', tile: 'Equipment Location Report',
        filters: { customers: [d.customer1.name], Manufacturer: [manufacturer], Status: [status] },
        expectContains: [serial],
      });
      // Columns: Equipment Name | Manufacturer | Serial No | Area/Pos | Customer | Customer Address | Date | Status.
      const row = ReportsPage.rowFor(text, serial);
      expect.soft(row, 'equipment name').toContain(cfg.name);
      expect.soft(row, 'manufacturer').toContain(manufacturer);
      expect.soft(row, 'customer').toMatch(new RegExp(`${d.customer1.code || 'CUST-QA-001'}|${d.customer1.name}`));
      expect.soft(row, 'area/pos').toContain('QA Area');
      expect.soft(row, 'status').toMatch(new RegExp(status, 'i'));
    });
    await test.step('Equipment Preventive Maintenance Report', async () => {
      await reportsPage.openReport('Equipment Management', 'Equipment Preventive Maintenance Report');
      await reportsPage.generate();
      await expect(reportsPage.page.locator('.o_action_manager table')).toBeVisible();
    });
    await test.step('Case Detailed Report', () => reportsPage.run({
      category: 'Case Management', tile: 'Case Detailed Report', filters: { 'Reported From Date': day, 'Reported To Date': day }, expectContains: [caseNo],
    }));
    await test.step('Repeat Cases Report', async () => {
      await reportsPage.openReport('Case Management', 'Repeat Cases Report');
      await reportsPage.setFilters({ customers: [d.customer1.name], start: day, end: day });
      await reportsPage.generate();
      await expect(reportsPage.page.locator('.o_action_manager table')).toBeVisible();
    });
  });
});
