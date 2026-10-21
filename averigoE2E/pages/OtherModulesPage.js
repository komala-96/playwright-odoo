const { expect, test } = require('@playwright/test');
const { OdooPage } = require('./OdooPage');
const { appears } = require('../utils/wait');

/** Employees app (TC-001). */
class EmployeePage extends OdooPage {
  /** Fills every editable field on the employee form; returns the saved URL and the picked many2one labels. */
  async createEmployee(e) {
    await this.openApp('Employees');
    await this.clickNew();
    await this.fill({ employee_code: e.code, first_name: e.firstName, last_name: e.lastName, work_email: e.workEmail, work_phone: e.workPhone });
    await this.field('image_1920').locator('input[type="file"]').setInputFiles(e.files.photo);
    await expect(this.field('image_1920').locator('img')).not.toHaveAttribute('src', /placeholder/);
    await this.fill({ mobile_phone: e.work.mobile_phone, category_ids: e.work.category_ids });
    const createTag = this.page.locator('.modal:visible').filter({ hasText: 'Create Tags' });
    if (await appears(createTag, 2_000)) {
      await createTag.locator('.modal-footer button').filter({ hasText: /^Save & Close$/ }).click();
      await createTag.waitFor({ state: 'hidden' });
    } else {
      await this.page.keyboard.press('Escape'); // close the Tags dropdown, it covers Department
    }
    await expect(this.field('category_ids')).toContainText(e.work.category_ids);
    await this.fill({ department_id: e.department, purchase_limit: e.work.purchase_limit });
    // Job Position / Manager / Coach / Work Address / Work Location: any existing record on this instance.
    const picked = {};
    picked.job_id = await this.pickFirstOption('job_id');
    picked.parent_id = await this.pickFirstOption('parent_id');
    // Coach defaults to the Manager.
    await expect.poll(() => this.read('coach_id'), { timeout: 10_000 }).not.toBe('').catch(() => {});
    picked.coach_id = (await this.read('coach_id')) || (await this.pickFirstOption('coach_id'));
    await this.openTab('Work Information');
    picked.address_id = await this.pickFirstOption('address_id');
    // Work Location skipped for now (as requested): it differs per instance.
    if (!(await this.read('resource_calendar_id'))) picked.resource_calendar_id = await this.pickFirstOption('resource_calendar_id');
    await this.fill({ tz: e.work.tz });

    await this.openTab('Private Information');
    const p = e.private;
    await this.fill({ private_street: p.private_street, private_street2: p.private_street2, private_city: p.private_city, private_zip: p.private_zip });
    await this.fill({ private_country_id: p.private_country_id });
    await this.fill({ private_state_id: p.private_state_id });
    await this.fill({ private_email: p.private_email, private_phone: p.private_phone, distance_home_work: p.distance_home_work });
    await this.fill({ distance_home_work_unit: p.distance_home_work_unit, private_car_plate: p.private_car_plate });
    await this.fill({ country_id: p.country_id, gender: p.gender, birthday: p.birthday, place_of_birth: p.place_of_birth, country_of_birth: p.country_of_birth });
    await this.fill({ emergency_contact: p.emergency_contact, emergency_phone: p.emergency_phone });
    await this.fill({ marital: p.marital, children: p.children, certificate: p.certificate, study_field: p.study_field, study_school: p.study_school });
    await this.fill({ visa_expire: p.visa_expire, work_permit_expiration_date: p.work_permit_expiration_date });
    await this.field('has_work_permit').locator('input[type="file"]').setInputFiles(e.files.workPermit);
    await expect(this.field('has_work_permit')).not.toContainText('Upload your file');

    await this.openTab('Settings');
    await this.fill({ employee_type: e.settings.employee_type, hourly_cost: e.settings.hourly_cost });
    await this.click('generate_random_barcode');
    await expect.poll(() => this.read('barcode')).not.toBe('');
    picked.barcode = await this.read('barcode');
    // Choosing the Work Address copies its (empty) phone into Work Phone, sometimes late: enter ours last.
    await this.waitReady();
    await this.fill({ work_phone: e.workPhone });
    await expect(this.field('work_phone').locator('input')).toHaveValue(e.workPhone);
    return { url: await this.save(), picked };
  }

  async expectEmployee(url, e, picked = {}) {
    await this.goto(url);
    await expect(this.page.locator('.o_breadcrumb')).toContainText(e.name);
    const text = { employee_code: e.code, first_name: e.firstName, last_name: e.lastName, work_email: e.workEmail, mobile_phone: e.work.mobile_phone };
    for (const [f, v] of Object.entries(text)) expect.soft(await this.read(f), f).toBe(v);
    expect.soft((await this.read('work_phone')).replace(/\D/g, '')).toBe(e.workPhone);
    expect.soft(await this.read('department_id')).toContain(e.department);
    expect.soft(await this.read('job_id'), 'job position picked from the dropdown').toContain(picked.job_id || e.jobTitle);
    await expect.soft(this.field('category_ids')).toContainText(e.work.category_ids);
    expect.soft(await this.read('is_manager'), 'Is Manager left unticked').toBe(false);
    await expect.soft(this.field('image_1920').locator('img'), 'photo uploaded').not.toHaveAttribute('src', /placeholder/);
    expect.soft(parseFloat((await this.read('purchase_limit')).replace(/,/g, '')), 'purchase_limit').toBe(e.work.purchase_limit);
    for (const f of ['parent_id', 'coach_id']) expect.soft(await this.read(f), f).toContain(picked[f]);

    await this.openTab('Work Information');
    for (const f of ['address_id']) expect.soft(await this.read(f), f).toContain(picked[f]);
    expect.soft(await this.read('resource_calendar_id'), 'working hours').not.toBe('');
    expect.soft(await this.read('tz'), 'tz').toContain(e.work.tz);

    await this.openTab('Private Information');
    const p = e.private;
    for (const f of ['private_street', 'private_street2', 'private_city', 'private_zip', 'private_email', 'private_phone', 'private_car_plate', 'place_of_birth', 'emergency_contact', 'emergency_phone', 'study_field', 'study_school', 'birthday', 'visa_expire', 'work_permit_expiration_date']) {
      expect.soft(await this.read(f), f).toBe(String(p[f]));
    }
    for (const f of ['private_country_id', 'country_id', 'country_of_birth', 'gender', 'marital', 'certificate', 'distance_home_work_unit']) expect.soft(await this.read(f), f).toContain(p[f]);
    expect.soft(await this.read('private_state_id'), 'private_state_id').toContain('California');
    expect.soft(parseInt(await this.read('distance_home_work'), 10), 'distance_home_work').toBe(p.distance_home_work);
    expect.soft(parseInt(await this.read('children'), 10), 'children').toBe(p.children);
    await expect.soft(this.field('has_work_permit'), 'work permit uploaded').not.toContainText('Upload your file');

    await this.openTab('Settings');
    expect.soft(await this.read('employee_type'), 'employee_type').toContain(e.settings.employee_type);
    expect.soft(parseFloat((await this.read('hourly_cost')).replace(/[^0-9.]/g, '')), 'hourly_cost').toBe(e.settings.hourly_cost);
    expect.soft(await this.read('barcode'), 'badge id').toBe(picked.barcode);
  }
}

/** Equipment Management app (TC-079..TC-083, TC-085). */
class EquipmentPage extends OdooPage {
  async open(...menu) {
    await this.openApp('Equipment Management');
    if (menu.length) await this.openMenu(...menu);
  }

  /** Configuration lists (Type / Name / Model / Model Number) are editable lists of names. */
  async createConfig(menuItem, name) {
    await this.open('Configuration', menuItem);
    await this.clickNew();
    await this.fill({ name });
    return this.save();
  }

  /** Equipment Parts form (product-like). */
  /**
   * Equipment > Configuration > Equipment Parts. part: { name, type, uom, taxable, price, cost, vendor, image }.
   * Updates the part at `url` when given (no duplicate parts on re-runs), else creates it. Every value is verified after save.
   */
  async createPart(part, { category, url } = {}) {
    if (url) await this.goto(url);
    else { await this.open('Configuration', 'Equipment Parts'); await this.clickNew(); }
    await this.field('name').waitFor();
    await this.fill({ name: part.name });
    await this.fill({ product_type: part.type || 'Product' });
    await this.fill({ categ_id: category });
    if (part.image) {
      await this.field('image_1920').locator('input[type="file"]').setInputFiles(part.image);
      await expect(this.field('image_1920').locator('img')).not.toHaveAttribute('src', /placeholder/);
    }
    if (part.uom) await this.fill({ uom_id: part.uom });
    if (part.taxable !== undefined) await this.field('tax_status').locator('label, .form-check-label').filter({ hasText: part.taxable ? /^\s*Yes\s*$/ : /^\s*No\s*$/ }).first().click();
    // Re-entering an unchanged Cost leaves the form dirty with nothing to save: only enter it when it differs.
    if (part.cost !== undefined && Math.abs((await this.readMoney('standard_price')) - part.cost) > 0.001) await this.fill({ standard_price: part.cost });
    if (part.vendor) await this.fill({ res_partner: part.vendor });
    await this.save();
    const saved = this.currentUrl();
    // Sales Price on its own: saving a price change fails on parts (see FINDINGS.md TC-080) - report it and keep the rest.
    let priceError;
    if (part.price !== undefined && Math.abs((await this.readMoney('list_price')) - part.price) > 0.001) {
      await this.fill({ list_price: part.price });
      await this.page.locator('.o_form_button_save').filter({ visible: true }).first().click();
      const dlg = this.page.locator('.modal:visible').filter({ hasText: /Error|Wrong value/i }).last();
      if (await appears(dlg, 8_000)) {
        priceError = (await dlg.locator('.modal-body').innerText()).trim();
        await dlg.locator('button').filter({ hasText: /Discard|Ok|Close/ }).first().click().catch(() => this.page.keyboard.press('Escape'));
        const discard = this.page.locator('.o_form_button_cancel').filter({ visible: true }).first();
        if (await discard.isVisible().catch(() => false)) await discard.click();
        await this.waitReady();
      } else await this.waitReady();
    }
    expect.soft(priceError, `saving Sales Price ${part.price} (see FINDINGS.md TC-080)`).toBeUndefined();
    // Every value saved.
    expect.soft(await this.read('name'), 'parts name').toContain(part.name);
    expect.soft(await this.read('categ_id'), 'parts category').toContain(category);
    if (part.uom) expect.soft(await this.read('uom_id'), 'unit of measure').toContain(part.uom);
    if (part.taxable !== undefined) expect.soft(await this.field('tax_status').locator('input:checked').first().evaluate((e) => e.closest('.form-check, div')?.innerText.trim()), 'taxable').toBe(part.taxable ? 'Yes' : 'No');
    if (part.price !== undefined && !priceError) expect.soft(await this.readMoney('list_price'), 'sales price').toBeCloseTo(part.price, 2);
    if (part.cost !== undefined) expect.soft(await this.readMoney('standard_price'), 'cost').toBeCloseTo(part.cost, 2);
    if (part.vendor) expect.soft(await this.read('res_partner'), 'preferred vendor').toContain(part.vendor);
    if (part.image) await expect.soft(this.field('image_1920').locator('img'), 'image').not.toHaveAttribute('src', /placeholder/);
    return { url: saved, priceError };
  }

  /** Equipment Parts list card of a part: { listPrice, cost } as shown. */
  async partCard(name) {
    const card = this.page.locator('.o_kanban_record, .o_data_row').filter({ hasText: name }).first();
    // Re-open on a miss (a dropped connection can leave the menu click on another view).
    await expect(async () => {
      await this.open('Configuration', 'Equipment Parts');
      await expect(card).toBeVisible({ timeout: 15_000 });
    }).toPass({ timeout: 90_000 });
    const text = (await card.innerText()).replace(/\s+/g, ' ');
    const num = (re) => { const m = text.match(re); return m ? parseFloat(m[1].replace(/,/g, '')) : undefined; };
    return { text, listPrice: num(/List Price:\s*\$?\s*([\d,.]+)/), cost: num(/Cost:\s*\$?\s*([\d,.]+)/) };
  }

  /**
   * New equipment (status Active). extras (optional) - every other field:
   * { warehouse, image, assetNo, frontage, finance, manufacture, distributor, purchaseDate, warrantyEnd,
   *   flags: { is_inventory, ... }, recurring: true | name, parts: [{ name, qty }], note }. Verified after save.
   */
  async createEquipment({ serial, value = 1000 }, cfg, extras) {
    const { today } = require('../utils/dates');
    const x = extras || {};
    await this.open('Equipment');
    // Resume an equipment a failed run already saved with this serial (serials are unique).
    const existing = extras ? await this.openExistingOrNew(serial) : (await this.clickNew(), false);
    if (x.warehouse && !existing) await this.fill({ operator_location_id: x.warehouse });
    if (x.image) {
      await this.field('image_1920').locator('input[type="file"]').setInputFiles(x.image);
      await expect(this.field('image_1920').locator('img')).not.toHaveAttribute('src', /placeholder/);
    }
    await this.fill({ serial_no: serial }); // Equipment code is auto-generated
    await this.fill({ machine_type_id: cfg.type, equipment_name_id: cfg.name });
    await this.fill({ equipment_model_id: cfg.model, equipment_model_no_id: cfg.modelNumber });
    if (x.assetNo) await this.fill({ asset_no: x.assetNo });
    if (x.frontage) await this.fill({ machine_frontage: x.frontage });
    if (x.finance) await this.fill({ finance_type: x.finance });
    if (x.manufacture) await this.fill({ manufacture: x.manufacture });
    if (x.distributor) await this.fill({ partner_id: x.distributor });
    await this.fill({ purchase_value: value, date_start: x.purchaseDate || today() });
    if (x.warrantyEnd) {
      await this.fill({ warranty: 'Yes' });
      await this.waitReady();
      await this.setDate('warranty_date', x.warrantyEnd);
    } else {
      const warranty = await this.field('warranty').locator('select option').allInnerTexts();
      await this.fill({ warranty: warranty.map((w) => w.trim()).find(Boolean) });
    }
    for (const [f, v] of Object.entries(x.flags || {})) await this.setBoolean(f, v);
    await this.save();
    // Tabs appear once the record exists.
    const picked = {};
    for (const part of x.parts || []) {
      await this.openTab('Parts');
      await this.addLine('parts_line_ids', { parts_id: part.name });
      const row = this.field('parts_line_ids').locator('.o_data_row').filter({ hasText: part.name }).first();
      const edit = this.field('parts_line_ids').locator('.o_data_row.o_selected_row').first();
      const target = (await edit.count()) ? edit : row;
      await target.locator('td[name="quantity"]').click();
      await target.locator('td[name="quantity"] input').fill(String(part.qty));
      await target.locator('td[name="quantity"] input').press('Tab');
    }
    if (x.note) { await this.openTab('Notes'); await this.fill({ note: x.note }); }
    await this.save();
    await this.expectEquipment({ serial, value }, cfg, x, picked);
    return this.currentUrl();
  }

  /** Recurring Details tab (shown once the equipment is In Service): pick a schedule (true = first offered). */
  async setRecurring(url, recurring) {
    await this.goto(url);
    await this.openTab('Recurring Details');
    let picked = recurring;
    if (recurring === true) picked = await this.pickFirstOption('recurring_name');
    else await this.fill({ recurring_name: recurring });
    await this.waitReady();
    await this.save();
    await this.openTab('Recurring Details');
    expect.soft(await this.read('recurring_name'), 'recurring schedule').toContain(picked);
    return { picked, frequency: await this.read('recurring_frequency').catch(() => ''), date: await this.read('frequency_date').catch(() => '') };
  }

  async expectEquipment({ serial, value }, cfg, x, picked = {}) {
    expect.soft(await this.read('serial_no'), 'serial no').toBe(serial);
    for (const [f, v] of [['machine_type_id', cfg.type], ['equipment_name_id', cfg.name], ['equipment_model_id', cfg.model], ['equipment_model_no_id', cfg.modelNumber]]) {
      expect.soft(await this.read(f), f).toContain(v);
    }
    if (x.warehouse) expect.soft(await this.read('operator_location_id'), 'warehouse').toContain(x.warehouse);
    if (x.assetNo) expect.soft(await this.read('asset_no'), 'asset no').toBe(x.assetNo);
    if (x.frontage) expect.soft(await this.read('machine_frontage'), 'equipment frontage').toContain(x.frontage);
    if (await this.page.locator('.o_notebook .nav-link').filter({ hasText: 'Other Details' }).count()) await this.openTab('Other Details');
    if (x.finance) expect.soft(await this.read('finance_type'), 'loan/lease').toContain(x.finance);
    if (x.manufacture) expect.soft(await this.read('manufacture'), 'manufacture').toBe(x.manufacture);
    if (x.distributor) expect.soft(await this.read('partner_id'), 'distributor').toBe(x.distributor);
    expect.soft(await this.readMoney('purchase_value'), 'purchase value').toBeCloseTo(value, 2);
    if (x.warrantyEnd) expect.soft(await this.read('warranty_date'), 'warranty end').toContain(x.warrantyEnd);
    for (const [f, v] of Object.entries(x.flags || {})) expect.soft(await this.field(f).locator('input').first().isChecked(), f).toBe(v);
    if (x.image) await expect.soft(this.field('image_1920').locator('img'), 'image').not.toHaveAttribute('src', /placeholder/);
    for (const part of x.parts || []) {
      await this.openTab('Parts');
      const row = this.field('parts_line_ids').locator('.o_data_row').filter({ hasText: part.name }).first();
      await expect.soft(row, `part ${part.name}`).toBeVisible();
      await expect.soft(row.locator('td[name="quantity"]'), `part ${part.name} qty`).toContainText(String(part.qty));
    }
    if (x.note) { await this.openTab('Notes'); expect.soft(await this.read('note'), 'note').toBe(x.note); }
  }

  /**
   * Equipment Activity dialog on an equipment: Install / Remove / Exchange / Retire / OutSide Repair,
   * to a customer or a Micro Market. Returns the status afterwards.
   */
  async equipmentActivity(url, { type, customer, market, exchangeWith, note = 'QA equipment activity' }) {
    await this.goto(url);
    await this.click('action_view_asset_transfer');
    const dlg = this.dialogs().filter({ has: this.page.locator('.o_field_widget[name="activity_type"]') }).last();
    await dlg.waitFor();
    // The dialog shows the current activity read-only first, then the editable Activity Type select.
    await dlg.locator('.o_field_widget[name="activity_type"] select').selectOption({ label: type });
    await this.waitReady();
    if (customer || market) {
      const options = (await dlg.locator('.o_field_widget[name="transfer_location_type"] select option').allInnerTexts()).map((t) => t.trim()).filter(Boolean);
      const locSelect = dlg.locator('.o_field_widget[name="transfer_location_type"] select');
      // Location Type: "Micromarket" or "Other" (a customer location).
      const want = market ? options.find((o) => /micro/i.test(o)) : options.find((o) => /other|customer/i.test(o));
      if (want) await locSelect.selectOption({ label: want });
      // The customer is required for both; the market list only fills once the customer is set.
      await this.fill({ transfer_location_partner_id: customer }, dlg);
      if (market) await this.fill({ transfer_micro_market_id: market }, dlg);
      // "Other": an Area/POS destination at the customer, created on the fly (no other screen creates them).
      const dest = dlg.locator('.o_field_widget[name="destination_location_id"]');
      if (!market && (await appears(dest, 2_000))) await this.fill({ destination_location_id: `${customer} - QA Area` }, dlg);
    }
    if (exchangeWith) {
      // Exchange: the replacement equipment (by code) goes to the market.
      await this.fill({ new_equipment: exchangeWith }, dlg);
      const serial = dlg.locator('.o_field_widget[name="new_equipment_serial_no"] input');
      if ((await appears(serial, 1_000)) && !(await serial.inputValue())) await this.fill({ new_equipment_serial_no: 'EXCHANGE' }, dlg);
      if (market && (await appears(dlg.locator('.o_field_widget[name="new_transfer_micro_market_id"]'), 1_000))) await this.fill({ new_transfer_micro_market_id: market }, dlg);
    }
    await this.fill({ internal_note: note }, dlg);
    // Remove / Retire / Exchange need a Reason (own tab in the dialog).
    const reasonTab = dlg.locator('.o_notebook .nav-link').filter({ hasText: /^\s*Reason\s*$/ });
    if (await appears(reasonTab, 1_000)) {
      await reasonTab.click();
      const field = dlg.locator('.o_notebook .tab-pane.active .o_field_widget[name]').first();
      if (await appears(field, 2_000)) {
        const name = await field.getAttribute('name');
        const type = await this.widgetType(field);
        if (type === 'many2one' || type === 'cdd') await this.pickFirstOption(name, dlg).catch(() => this.fill({ [name]: 'QA reason' }, dlg));
        else if (type === 'selection') await field.locator('select').selectOption({ index: 1 });
        else await this.fill({ [name]: 'QA lifecycle test' }, dlg);
      }
    }
    // Disallowed transitions show a banner ("... activity is not possible") and no Submit button.
    if (!(await appears(dlg.locator('button[name="act_done"]'), 3_000))) {
      const banner = (await dlg.locator('.alert, .text-danger').first().innerText().catch(() => '')).trim();
      await dlg.locator('button').filter({ hasText: /^\s*Discard\s*$/ }).click().catch(() => {});
      throw new Error(`Equipment Activity "${type}" not allowed: ${banner}`);
    }
    await dlg.locator('button[name="act_done"]').click();
    // Remove/Retire ask "Are you sure ...?".
    const confirm = this.dialogs().filter({ hasText: /Are you sure/i }).last();
    if (await appears(confirm, 3_000)) await confirm.locator('button').filter({ hasText: /^\s*Ok\s*$/ }).click();
    await this.waitReady();
    await this.expectNoError();
    // Processing can take a while; invalid/missing fields keep the dialog open without an error dialog.
    await expect(dlg).toBeHidden({ timeout: 30_000 }).catch(() => {});
    if (await appears(dlg, 1_000)) {
      const invalid = await dlg.locator('.o_field_invalid').evaluateAll((e) => e.map((x) => x.getAttribute('name')));
      throw new Error(`Equipment Activity not submitted; invalid fields: ${invalid.join(', ') || 'unknown'}`);
    }
    await this.goto(url);
    return this.status();
  }
}

/** Service Management app - cases (TC-079, TC-084). */
class ServicePage extends OdooPage {
  async open(...menu) {
    await this.openApp('Service Management');
    if (menu.length) await this.openMenu(...menu);
  }

  async createConfig(menuItem, name) {
    await this.open('Configuration', menuItem);
    await this.clickNew();
    await this.fill({ name });
    return this.save();
  }

  /** Case: customer, category, type, origin, equipment, description + internal comment -> Save. */
  /**
   * Service > Cases > New. extras (optional) - every other field: { contactName, email, assignedTo, route, billable,
   * preventive, priority (1-3 stars), reportedPhone, reportedBy, reportedEmail, partsWarehouse, equipmentLocation: true }.
   * Values are verified after save.
   */
  async createCase({ customer, equipment, category, origin, type, description, comment, extras }) {
    const x = extras || {};
    await this.open('Cases');
    await this.clickNew();
    await this.fill({ partner_id: customer });
    await this.waitReady();
    const picked = {};
    const m2o = async (f, v) => {
      if (v === true) return this.pickFirstOption(f);
      try { await this.fill({ [f]: v }); } catch { await this.page.keyboard.press('Escape').catch(() => {}); return this.pickFirstOption(f); }
      return this.read(f);
    };
    if (x.assignedTo) {
      // true = the first person offered in the dropdown.
      let ok = x.assignedTo !== true;
      if (ok) { try { await this.fill({ employee_ids: [x.assignedTo] }); } catch { ok = false; } }
      if (!ok) {
        if (await this.page.locator('.o-autocomplete--dropdown-menu').isVisible().catch(() => false)) await this.page.keyboard.press('Escape');
        const input = this.field('employee_ids').locator('input').first();
        await input.fill('');
        await input.click();
        const item = this.page.locator('.o-autocomplete--dropdown-item').filter({ visible: true }).filter({ hasNotText: /Search More|Create|Loading|No records/i }).first();
        await item.waitFor();
        await item.click();
        await this.waitReady();
      }
      await this.field('employee_ids').locator('.o_tag').first().waitFor({ timeout: 10_000 }).catch(() => {});
      picked.assignedTo = (await this.field('employee_ids').locator('.o_tag').allInnerTexts()).map((t) => t.trim()).filter(Boolean).join(', ');
      expect.soft(picked.assignedTo, 'Assigned To').toBeTruthy();
    }
    await this.fill({ category_id: category, type_id: type });
    if (x.route) picked.route = await m2o('route_id', x.route);
    if (x.billable !== undefined) await this.setBoolean('is_billable', x.billable);
    if (x.preventive !== undefined) await this.setBoolean('is_preventive', x.preventive);
    if (x.priority) await this.field('priority').locator('.o_priority_star, a').nth(x.priority - 1).click();
    await this.fill({ channel_id: origin }).catch(() => {});
    if (x.reportedPhone) await this.fill({ reported_phone: x.reportedPhone });
    if (x.reportedBy) await this.fill({ reported_by: x.reportedBy });
    if (x.reportedEmail) await this.fill({ reported_email: x.reportedEmail });
    if (equipment) await this.fill({ machine_ids: equipment });
    await this.waitReady();
    if (x.partsWarehouse) picked.partsWarehouse = await m2o('warehouse_id', x.partsWarehouse);
    if (x.equipmentLocation && !(await this.read('location_dest_id'))) picked.equipmentLocation = await m2o('location_dest_id', x.equipmentLocation);
    await this.fill({ case_description: description, internal_comment: comment });
    // Contact Name / Email last: customer and equipment onchanges reset them to the customer's own.
    if (x.contactName) await this.fill({ partner_name: x.contactName });
    if (x.email) await this.fill({ partner_email: x.email });
    await this.waitReady();
    const url = await this.save();
    if (extras) {
      // Contact Name / Email typed on a new case are replaced by the customer's on create (see FINDINGS.md TC-084):
      // report it, then set them again on the saved case (that edit is kept).
      const contactKept = !x.contactName || (await this.read('partner_name')) === x.contactName;
      const emailKept = !x.email || (await this.read('partner_email')) === x.email;
      expect.soft(contactKept && emailKept, `Contact Name/Email entered on the new case kept after create (got "${await this.read('partner_name')}" / "${await this.read('partner_email')}")`).toBe(true);
      if (!contactKept || !emailKept) {
        if (x.contactName) await this.fill({ partner_name: x.contactName });
        if (x.email) await this.fill({ partner_email: x.email });
        await this.save();
      }
      // Every entered value saved.
      if (x.contactName) expect.soft(await this.read('partner_name'), 'contact name').toBe(x.contactName);
      if (x.email) expect.soft(await this.read('partner_email'), 'email').toBe(x.email);
      if (picked.assignedTo) expect.soft((await this.field('employee_ids').locator('.o_tag, .badge').allInnerTexts()).join(', '), 'assigned to').toContain(picked.assignedTo);
      if (picked.route) expect.soft(await this.read('route_id'), 'route').toContain(picked.route);
      if (x.billable !== undefined) expect.soft(await this.field('is_billable').locator('input').first().isChecked(), 'billable').toBe(x.billable);
      if (x.preventive !== undefined) expect.soft(await this.field('is_preventive').locator('input').first().isChecked(), 'preventive').toBe(x.preventive);
      if (x.priority) await expect.soft(this.field('priority').locator('.fa-star, .o_priority_star.fa-star'), 'priority stars').toHaveCount(x.priority);
      if (x.reportedPhone) expect.soft((await this.read('reported_phone')).replace(/\D/g, ''), 'reported phone').toContain(x.reportedPhone.replace(/\D/g, ''));
      if (x.reportedBy) expect.soft(await this.read('reported_by'), 'reported by').toBe(x.reportedBy);
      if (x.reportedEmail) expect.soft(await this.read('reported_email'), 'reported email').toBe(x.reportedEmail);
      if (picked.partsWarehouse) expect.soft(await this.read('warehouse_id'), 'parts warehouse').toContain(picked.partsWarehouse);
      expect.soft(await this.read('case_description'), 'case description').toBe(description);
      expect.soft(await this.read('internal_comment'), 'internal comment').toBe(comment);
    }
    return url;
  }

  /** Case > Notes button: add a line in the Notes dialog -> Save Note. */
  async addCaseNote(text) {
    await this.page.locator('.o_form_view button[name="open_notes"], .o_control_panel button[name="open_notes"]').first().click();
    const dlg = this.dialogs().filter({ has: this.page.locator('.o_field_widget[name="case_notes"]') }).last();
    await dlg.waitFor();
    await dlg.locator('.o_field_x2many_list_row_add a').first().click();
    const row = dlg.locator('.o_data_row.o_selected_row, .o_data_row').last();
    await row.locator('td[name="message"]').click().catch(() => {});
    const input = row.locator('td[name="message"] input, td[name="message"] textarea').first();
    await input.fill(text);
    await input.press('Tab').catch(() => {});
    // The first click can just end the line edit: click until the dialog closes.
    const save = dlg.locator('button').filter({ hasText: /^\s*Save Note\s*$/ });
    await expect(async () => {
      if (await save.isVisible().catch(() => false)) await save.click({ timeout: 3_000 });
      await expect(dlg).toBeHidden({ timeout: 3_000 });
    }).toPass({ timeout: 30_000 });
    await this.waitReady();
  }

  /** Case > Attachments button: New attachment (File) -> upload -> save. Returns to the case. */
  async addCaseAttachment(caseUrl, { name, file }) {
    await this.goto(caseUrl);
    await this.page.locator('button[name="action_get_attachment_view"]').first().click();
    await this.waitReady();
    await this.clickNew();
    await this.fill({ name });
    await this.fill({ type: 'File' }).catch(() => {});
    await this.page.locator('.o_form_view .o_field_widget[name="datas"] input[type="file"]').first().setInputFiles(file);
    await this.waitReady();
    await this.save();
    await this.goto(caseUrl);
  }

  /** Smart-button counter on the case (e.g. open_notes, action_get_attachment_view). */
  async caseCounter(name) {
    const text = await this.page.locator(`button[name="${name}"]`).first().innerText();
    return parseInt((text.match(/\d+/) || ['0'])[0], 10);
  }

  async logNote(text) {
    await this.page.locator('.o-mail-Chatter-logNote, button:has-text("Log note")').first().click();
    await this.page.locator('.o-mail-Composer-input, textarea.o_composer_text_field').first().fill(text);
    await this.page.locator('.o-mail-Composer-send').filter({ visible: true }).first().click();
    await expect(this.page.locator('.o-mail-Message, .o_thread_message').filter({ hasText: text }).first()).toBeVisible();
  }

  /** Close Case dialog: tech person, internal + resolution comments -> Submit. */
  async closeCase({ resolution, comment, tech }) {
    await this.click('close_case_btn');
    const dlg = this.dialogs().filter({ has: this.page.locator('.o_field_widget[name="resolution_comment"]') }).last();
    await dlg.waitFor();
    // Tech Person only offers designated technicians: the requested one when offered, else the first in the dropdown.
    let techPicked = '';
    if (tech) {
      let ok = true;
      if (tech !== true) {
        try { await this.fill({ employee_id: tech }, dlg); } catch { ok = false; }
      }
      if (tech === true || !ok) {
        // Close only an open autocomplete (Escape on the bare dialog would close it).
        if (await this.page.locator('.o-autocomplete--dropdown-menu').isVisible().catch(() => false)) await this.page.keyboard.press('Escape');
        await this.field('employee_id', dlg).locator('input').first().fill('');
        techPicked = await this.pickFirstOption('employee_id', dlg);
      }
      techPicked = (await this.read('employee_id', dlg)) || techPicked;
      expect.soft(techPicked, 'Tech Person assigned').toBeTruthy();
    }
    await this.fill({ internal_comment: comment, resolution_comment: resolution }, dlg);
    await dlg.locator('button[name="close_case_employee"]').click();
    await this.waitReady();
    // Closing can fail server-side (billable cases, see FINDINGS.md TC-084): return the error instead of throwing.
    const error = this.page.locator('.modal:visible').filter({ hasText: /Averigo Error|Error/ }).filter({ hasNot: this.page.locator('.o_field_widget[name="resolution_comment"]') }).last();
    await expect(dlg.or(error).first()).toBeVisible({ timeout: 1_000 }).catch(() => {});
    if (await appears(error, 3_000)) {
      const text = (await error.locator('.modal-body').innerText()).trim();
      await error.locator('.modal-footer button, .btn-close').first().click();
      await dlg.locator('button').filter({ hasText: /^\s*Discard\s*$/ }).click().catch(() => this.page.keyboard.press('Escape'));
      await expect(dlg).toBeHidden();
      return { error: text, tech: techPicked };
    }
    await this.expectNoError();
    await expect(dlg).toBeHidden();
    return { tech: techPicked };
  }

}

/** CRM app (TC-087..TC-089). */
class CrmPage extends OdooPage {
  async open(menu) {
    await this.openApp('CRM');
    if (menu) await this.openMenu(menu);
  }

  /**
   * Leads: Company Name, ZIP, Title and First/Last contact name are mandatory.
   * extras (optional): see fillCrmExtras. An existing lead with the same name is updated. Verified after save.
   */
  async createLead({ name }, d, extras) {
    await this.open('Leads');
    if (extras) await this.openExistingOrNew(name);
    else await this.clickNew();
    await this.fill({ name, partner_name: d.company, street: d.street, zip: d.zip, first_name: 'QA', last_name: 'Contact', email_from: 'lead.qa@example.com', phone: '4155550101' });
    if (!(await this.read('title'))) await this.pickFirstOption('title');
    if (!(await this.read('user_id'))) await this.pickFirstOption('user_id');
    const picked = extras ? await this.fillCrmExtras(extras) : {};
    const url = await this.save();
    if (extras) {
      expect.soft(await this.read('name'), 'lead name').toBe(name);
      expect.soft(await this.read('partner_name'), 'company name').toBe(d.company);
      expect.soft(await this.read('street'), 'street').toBe(d.street);
      expect.soft(await this.read('zip'), 'zip').toBe(d.zip);
      await this.expectCrmExtras(extras, picked);
    }
    return url;
  }

  /**
   * Opportunities (full form, not the pipeline quick-create card). extras (optional): see fillCrmExtras, plus
   * { email, phone, deadline, company, street, zip, title: true, contactName }. An existing one with the same name is updated.
   */
  async createOpportunity({ name, revenue }, customer, extras) {
    await this.open('Opportunities');
    let existing = false;
    if (extras) {
      await this.search(name);
      const row = this.rows(name).first();
      if (await appears(row, 3_000)) { await row.click(); await this.page.locator('.o_form_view').first().waitFor(); await this.waitReady(); existing = true; }
    }
    if (!existing) {
      await this.clickNew();
      const quick = this.page.locator('.o_kanban_quick_create');
      if (await appears(quick, 2_000)) {
        // Pipeline quick-create card: open the full form instead.
        await quick.locator('button').filter({ hasText: /^Edit$/ }).first().click();
        await this.waitReady();
      }
    }
    await this.fill({ name, partner_id: customer });
    // Expected Revenue is not on every instance's form (ultraserv): fillCrmExtras notes it as skipped.
    if (revenue !== undefined && (await this.field('expected_revenue').count())) await this.fill({ expected_revenue: revenue });
    await this.waitReady();
    if (!(await this.read('user_id'))) await this.pickFirstOption('user_id');
    const picked = extras ? await this.fillCrmExtras({ ...extras, revenue }) : {};
    const url = await this.save();
    if (extras) {
      expect.soft(await this.read('name'), 'opportunity name').toBe(name);
      expect.soft(await this.read('partner_id'), 'customer').toContain(customer);
      await this.expectCrmExtras({ ...extras, revenue }, picked);
    }
    return url;
  }

  /** The tab holding a CRM field (fields can sit on the main sheet or in Extra Info / Extra Information). */
  async showCrmField(f) {
    if (await this.field(f).isVisible().catch(() => false)) return;
    for (const tab of ['Extra Info', 'Extra Information', 'Internal Notes']) {
      const link = this.page.locator('.o_notebook .nav-link').filter({ hasText: new RegExp(`^\\s*${tab}\\s*$`) });
      if (await link.count()) { await link.first().click(); if (await appears(this.field(f), 2_000)) return; }
    }
  }

  /**
   * Shared Lead / Opportunity fields: { revenue, probability, email, phone, deadline, company, street, street2, city, state, zip,
   * rooms, occupancy, visitorTypes: true, team: true, title: true, middleName, contactName, jobPosition, mobile, website,
   * tags: true, priority (1-3), properties: true, notes, campaign: true, medium: true, source: true, referred }.
   * true = first option offered. Returns the values picked.
   */
  async fillCrmExtras(x) {
    const picked = {};
    const m2o = async (f, v) => {
      await this.showCrmField(f);
      if (v !== true) { try { await this.fill({ [f]: v }); return this.read(f); } catch { await this.page.keyboard.press('Escape').catch(() => {}); } }
      // "First offered" on a record that already has one (re-run): keep it.
      const current = (await this.read(f)).trim();
      if (v === true && current) return current;
      // Nothing configured on this instance (e.g. no UTM campaigns on ultraserv): skip and note it.
      return this.pickFirstOption(f).catch(async () => {
        await this.page.keyboard.press('Escape').catch(() => {});
        test.info().annotations.push({ type: 'No options offered (skipped)', description: f });
        return '';
      });
    };
    // Fields missing from this instance's CRM form (e.g. Expected Revenue on ultraserv) are skipped and noted.
    this.crmMissing = new Set();
    const present = async (f) => {
      await this.showCrmField(f);
      if (await this.field(f).count()) return true;
      this.crmMissing.add(f);
      test.info().annotations.push({ type: 'Not on this CRM form (skipped)', description: f });
      return false;
    };
    const text = async (f, v) => { if (v === undefined || !(await present(f))) return; await this.fill({ [f]: v }); };
    const tags = async (f) => {
      await this.showCrmField(f);
      const field = this.field(f);
      if (await field.locator('.o_tag').count()) return (await field.locator('.o_tag').allInnerTexts()).join(', ');
      const input = field.locator('input').first();
      await input.click();
      const item = this.page.locator('.o-autocomplete--dropdown-item').filter({ visible: true }).filter({ hasNotText: /Search More|Create|Loading|No records|Start typing/i }).first();
      // Some tag lists only show options once something is typed.
      if (!(await appears(item, 3_000))) await input.fill('a');
      await item.waitFor();
      await item.click();
      await this.waitReady();
      await field.locator('.o_tag').first().waitFor({ timeout: 10_000 });
      return (await field.locator('.o_tag').allInnerTexts()).join(', ');
    };
    await text('expected_revenue', x.revenue);
    await text('probability', x.probability);
    await text('email_from', x.email);
    await text('phone', x.phone);
    if (x.deadline) { await this.showCrmField('date_deadline'); await this.setDate('date_deadline', x.deadline); }
    if (x.team) picked.team = await m2o('team_id', x.team);
    if (x.tags) picked.tags = await tags('tag_ids');
    if (x.priority) {
      const stars = this.field('priority').locator('.o_priority_star, a');
      if ((await this.field('priority').locator('.fa-star').count()) !== x.priority) await stars.nth(x.priority - 1).click();
    }
    if (x.properties) {
      // Lead Properties: one text box per defined property (Property 1, Property 2, ...).
      const props = this.field('lead_properties').locator('.o_property_field').filter({ has: this.page.locator('.o_property_field_value input[type="text"]') });
      picked.properties = [];
      for (let i = 0; i < (await props.count()); i++) {
        const label = (await props.nth(i).locator('.o_field_property_label').innerText()).trim() || `Property ${i + 1}`;
        const value = `QA ${label}`;
        const input = props.nth(i).locator('.o_property_field_value input[type="text"]').first();
        await input.fill(value);
        await input.press('Tab');
        picked.properties.push(value);
      }
      // A box filled right after a re-render can come back empty: refill until every one holds its value.
      await expect(async () => {
        for (let i = 0; i < picked.properties.length; i++) {
          const input = props.nth(i).locator('.o_property_field_value input[type="text"]').first();
          if ((await input.inputValue()) !== picked.properties[i]) { await input.fill(picked.properties[i]); await input.press('Tab'); }
        }
        await this.waitReady();
        const values = await props.locator('.o_property_field_value input[type="text"]').evaluateAll((es) => es.map((e) => e.value));
        expect(values).toEqual(picked.properties);
      }).toPass({ timeout: 30_000 });
    }
    await text('partner_name', x.company);
    await text('street', x.street);
    await text('street2', x.street2);
    await text('city', x.city);
    if (x.state) picked.state = await m2o('state_id', x.state);
    await text('zip', x.zip);
    await text('no_of_rooms', x.rooms);
    await text('checkin_frequency', x.occupancy);
    if (x.visitorTypes) picked.visitorTypes = await tags('visitors_types_ids');
    if (x.title) { await this.showCrmField('title'); picked.title = (await this.read('title')) || (await this.pickFirstOption('title')); }
    await text('middle_name', x.middleName);
    await text('contact_name', x.contactName);
    await text('function', x.jobPosition);
    await text('mobile', x.mobile);
    await text('website', x.website);
    if (x.campaign) picked.campaign = await m2o('campaign_id', x.campaign);
    if (x.medium) picked.medium = await m2o('medium_id', x.medium);
    if (x.source) picked.source = await m2o('source_id', x.source);
    await text('referred', x.referred);
    if (x.notes) {
      await this.openTab('Internal Notes');
      const editor = this.field('description').locator('.odoo-editor-editable, [contenteditable="true"]').first();
      await editor.click();
      await this.page.keyboard.press('Control+a');
      await this.page.keyboard.type(x.notes);
    }
    return picked;
  }

  async expectCrmExtras(x, picked) {
    const missing = this.crmMissing || new Set();
    // Skip the check (undefined) for fields this instance's form doesn't have.
    const skip = (f, v) => (missing.has(f) ? undefined : v);
    const num = async (f) => { await this.showCrmField(f); return parseFloat((await this.read(f)).replace(/[^0-9.-]/g, '')) || 0; };
    const txt = async (f) => { await this.showCrmField(f); return this.read(f); };
    if (skip('expected_revenue', x.revenue) !== undefined) expect.soft(await num('expected_revenue'), 'expected revenue').toBeCloseTo(x.revenue, 2);
    if (skip('probability', x.probability) !== undefined) expect.soft(await num('probability'), 'probability').toBeCloseTo(x.probability, 2);
    if (skip('no_of_rooms', x.rooms) !== undefined) expect.soft(await num('no_of_rooms'), 'no of rooms').toBe(x.rooms);
    for (const [f, v] of [['email_from', x.email], ['partner_name', x.company], ['street', x.street], ['street2', x.street2], ['city', x.city],
      ['zip', x.zip], ['checkin_frequency', x.occupancy], ['middle_name', x.middleName], ['contact_name', x.contactName],
      ['function', x.jobPosition], ['referred', x.referred]]) {
      if (skip(f, v) !== undefined) expect.soft(await txt(f), f).toBe(String(v));
    }
    if (x.phone) expect.soft((await txt('phone')).replace(/\D/g, ''), 'phone').toContain(x.phone.replace(/\D/g, ''));
    if (x.mobile) expect.soft((await txt('mobile')).replace(/\D/g, ''), 'mobile').toContain(x.mobile.replace(/\D/g, ''));
    if (x.website) expect.soft(await txt('website'), 'website').toContain(x.website.replace(/^https?:\/\//, ''));
    if (x.deadline) expect.soft(await txt('date_deadline'), 'expected closing').toContain(x.deadline);
    for (const [f, key, label] of [['state_id', 'state', 'state'], ['team_id', 'team', 'sales team'], ['title', 'title', 'title'],
      ['campaign_id', 'campaign', 'campaign'], ['medium_id', 'medium', 'medium'], ['source_id', 'source', 'source']]) {
      if (picked[key]) expect.soft(await txt(f), label).toContain(picked[key]);
    }
    for (const [f, key, label] of [['visitors_types_ids', 'visitorTypes', 'types of visitors'], ['tag_ids', 'tags', 'tags']]) {
      if (!picked[key]) continue;
      await this.showCrmField(f);
      expect.soft((await this.field(f).locator('.o_tag').allInnerTexts()).join(', '), label).toContain(picked[key].split(', ')[0]);
    }
    if (x.priority) await expect.soft(this.field('priority').locator('.fa-star'), 'priority stars').toHaveCount(x.priority);
    if (picked.properties?.length) {
      const values = await this.field('lead_properties').locator('.o_property_field .o_property_field_value input[type="text"]').evaluateAll((es) => es.map((e) => e.value));
      expect.soft(values, 'properties').toEqual(picked.properties);
    }
    if (x.notes) { await this.openTab('Internal Notes'); await expect.soft(this.field('description'), 'internal notes').toContainText(x.notes); }
  }

  /**
   * Calendar Events: Customer, Event Type, Start and Description are mandatory.
   * extras (optional) - every other field: { employees: true, duration, location, videocall: true, tags: true, showAs, privacy,
   * reminders: true, description }. true = first offered (videocall: the "Averigo meeting" link). All Day / Recurrent stay off
   * (they replace the time / create repeat events). An existing event with the same name is updated. Verified after save.
   */
  async createEvent({ name }, customer, start, extras) {
    const x = extras || {};
    await this.open('Calendar Events');
    if (extras) await this.openExistingOrNew(name);
    else await this.clickNew();
    await this.fill({ name, customer_id: customer });
    const type = (await this.read('activity_type_id')) || (await this.pickFirstOption('activity_type_id'));
    const startInput = this.field('start').locator('input').first();
    await startInput.fill(start);
    await startInput.press('Enter');
    await this.page.keyboard.press('Escape').catch(() => {});
    await expect(startInput).toHaveValue(new RegExp(`^${start.slice(0, 10)}`));
    const picked = {};
    // First option offered; with none (e.g. no meeting tags exist) create `createName` from the picker.
    const tags = async (f, createName) => {
      const field = this.field(f);
      if (await field.locator('.o_tag').count()) return (await field.locator('.o_tag').allInnerTexts()).map((t) => t.trim()).join(', ');
      const input = field.locator('input').first();
      await input.click();
      const item = this.page.locator('.o-autocomplete--dropdown-item').filter({ visible: true }).filter({ hasNotText: /Search More|Create|Loading|No records|Start typing/i }).first();
      if (!(await appears(item, 3_000)) && createName) {
        await input.fill(createName);
        const known = this.page.locator('.o-autocomplete--dropdown-item').filter({ visible: true }).filter({ hasText: new RegExp(`^\\s*${createName}\\s*$`) }).first();
        const create = this.page.locator('.o-autocomplete--dropdown-item').filter({ visible: true }).filter({ hasText: `Create "${createName}"` }).first();
        await expect(known.or(create).first()).toBeVisible();
        await ((await known.isVisible().catch(() => false)) ? known : create).click();
        await this.waitReady();
        await field.locator('.o_tag').first().waitFor({ timeout: 10_000 });
        return (await field.locator('.o_tag').allInnerTexts()).map((t) => t.trim()).join(', ');
      }
      if (!(await item.isVisible().catch(() => false))) await input.fill('a');
      await item.waitFor();
      await item.click();
      await this.waitReady();
      await field.locator('.o_tag').first().waitFor({ timeout: 10_000 });
      return (await field.locator('.o_tag').allInnerTexts()).map((t) => t.trim()).join(', ');
    };
    if (x.employees === true) picked.employees = await tags('employees');
    else if (x.employees) {
      // A named employee (e.g. the TC-001 one): add it unless already there.
      const field = this.field('employees');
      for (const emp of [].concat(x.employees)) {
        if (!(await field.locator('.o_tag').filter({ hasText: emp }).count())) {
          const input = field.locator('input').first();
          await input.click();
          await input.fill(emp);
          const item = this.page.locator('.o-autocomplete--dropdown-item').filter({ visible: true }).filter({ hasText: emp }).filter({ hasNotText: /^\s*(Create|Search More)/ }).first();
          await item.click();
          await this.waitReady();
        }
        await expect(field.locator('.o_tag').filter({ hasText: emp })).toHaveCount(1);
      }
      picked.employees = [].concat(x.employees).join(', ');
    }
    await this.fill({ duration: x.duration || '01:00', location: x.location || 'QA Area' });
    if (x.videocall) {
      const btn = this.page.locator('button[name="set_discuss_videocall_location"]');
      if (!(await this.field('videocall_location').locator('input').first().inputValue().catch(() => '')) && (await btn.isVisible().catch(() => false))) await btn.click();
      await this.waitReady();
      picked.videocall = true;
    }
    if (x.tags) picked.tags = await tags('categ_ids', x.tags === true ? 'QA Meeting' : x.tags);
    if (x.showAs) await this.fill({ show_as: x.showAs });
    if (x.privacy) await this.fill({ privacy: x.privacy });
    if (x.reminders) picked.reminders = await tags('alarm_ids');
    const description = x.description || `QA ${type} for ${customer}`;
    const editor = this.field('description').locator('.odoo-editor-editable, [contenteditable="true"]').first();
    if (await editor.count()) { await editor.click(); await this.page.keyboard.press('Control+a'); await this.page.keyboard.type(description); }
    else await this.fill({ description });
    const url = await this.save();
    if (extras) {
      // Every entered value saved.
      expect.soft(await this.read('name'), 'meeting subject').toBe(name);
      expect.soft(await this.read('customer_id'), 'customer').toContain(customer);
      expect.soft(await startInput.inputValue(), 'start').toContain(start.slice(0, 10));
      expect.soft(await this.field('duration').locator('input').first().inputValue(), 'duration').toBe(x.duration || '01:00');
      expect.soft(await this.read('location'), 'location').toBe(x.location || 'QA Area');
      if (x.employees && x.employees !== true) {
        for (const emp of [].concat(x.employees)) await expect.soft(this.field('employees').locator('.o_tag').filter({ hasText: emp }), `employee ${emp}`).toHaveCount(1);
      }
      for (const [f, key, label] of [['employees', 'employees', 'employees'], ['categ_ids', 'tags', 'tags'], ['alarm_ids', 'reminders', 'reminders']]) {
        if (key === 'employees' && x.employees !== true) continue;
        if (picked[key]) expect.soft((await this.field(f).locator('.o_tag').allInnerTexts()).map((t) => t.trim()).join(', '), label).toContain(picked[key].split(', ')[0]);
      }
      if (x.videocall) {
        // Shown as an input or, once set, as copyable text.
        const vc = this.field('videocall_location');
        const value = (await vc.locator('input').first().inputValue({ timeout: 2_000 }).catch(() => '')) || (await vc.innerText()).trim();
        expect.soft(value, 'videocall URL').toMatch(/https?:\/\/|\/|meet|discuss/i);
      }
      if (x.showAs) expect.soft(await this.read('show_as'), 'show as').toContain(x.showAs);
      if (x.privacy) expect.soft(await this.read('privacy'), 'privacy').toContain(x.privacy);
      await expect.soft(this.field('description'), 'description').toContainText(description);
    }
    return url;
  }
}

/** Surveys app (TC-090). */
class SurveyPage extends OdooPage {
  /**
   * Surveys > New. extras (optional) - every other field: { image, restrictTo: true, layout, progression, selection, roaming,
   * accessMode, loginRequired, timeLimit (minutes), scoring, passPercent, description, endMessage,
   * question: { type, choices: [..], description, comments, mandatory, width: true } }.
   * An existing survey with the same title (and its question) is updated. Verified after save.
   */
  async createSurvey({ title, question }, extras) {
    const x = extras || {};
    await this.openApp('Surveys');
    if (extras) await this.openExistingOrNew(title);
    else await this.clickNew();
    await this.fill({ title });
    const picked = {};
    if (x.image) {
      await this.field('background_image').locator('input[type="file"]').setInputFiles(x.image);
      await this.waitReady();
    }
    if (x.restrictTo) {
      const field = this.field('restrict_user_ids');
      if (!(await field.locator('.o_tag').count())) {
        await field.locator('input').first().click();
        if (x.restrictTo !== true) await field.locator('input').first().fill(x.restrictTo);
        const item = this.page.locator('.o-autocomplete--dropdown-item').filter({ visible: true }).filter({ hasNotText: /Search More|Create|Loading|No records|Start typing/i }).first();
        await item.click();
        await this.waitReady();
      }
      picked.restrictTo = (await field.locator('.o_tag').allInnerTexts()).map((t) => t.trim()).join(', ');
    }
    await this.openTab('Questions');
    await this.fillQuestion(question, x.question);
    const radio = (f, label) => this.field(f).locator('label').filter({ hasText: new RegExp(`^\\s*${label}\\s*$`) }).first().click();
    if (x.layout || x.progression || x.selection || x.roaming !== undefined || x.accessMode || x.loginRequired !== undefined || x.timeLimit || x.scoring) {
      await this.openTab('Options');
      if (x.layout) await radio('questions_layout', x.layout);
      if (x.progression) await radio('progression_mode', x.progression);
      if (x.selection) await radio('questions_selection', x.selection);
      if (x.roaming !== undefined) await this.setBoolean('users_can_go_back', x.roaming);
      if (x.accessMode) await this.fill({ access_mode: x.accessMode });
      if (x.loginRequired !== undefined) await this.setBoolean('users_login_required', x.loginRequired);
      if (x.timeLimit) {
        await this.setBoolean('is_time_limited', true);
        await this.waitReady();
        if (await appears(this.field('time_limit'), 3_000)) await this.fill({ time_limit: x.timeLimit });
      }
      if (x.scoring) {
        await radio('scoring_type', x.scoring);
        await this.waitReady();
        if (x.passPercent && (await appears(this.field('scoring_success_min'), 3_000))) await this.fill({ scoring_success_min: x.passPercent });
      }
    }
    const html = async (tab, f, value) => {
      await this.openTab(tab);
      const editor = this.field(f).locator('.odoo-editor-editable, [contenteditable="true"]').first();
      await editor.click();
      await this.page.keyboard.press('Control+a');
      await this.page.keyboard.type(value);
    };
    if (x.description) await html('Description', 'description', x.description);
    if (x.endMessage) await html('End Message', 'description_done', x.endMessage);
    const url = await this.save();
    if (extras) await this.expectSurvey({ title, question }, x, picked);
    return url;
  }

  /** Questions tab: add the question (or open it when it exists) and fill every field of its dialog. */
  async fillQuestion(question, q = {}) {
    const list = this.field('question_and_page_ids');
    const row = list.locator('.o_data_row').filter({ hasText: question }).first();
    if (await row.count()) await row.locator('td.o_data_cell').filter({ hasText: question }).first().click();
    else await list.locator('a').filter({ hasText: /Add a question/i }).first().click();
    const dlg = this.page.locator('.modal:visible').last();
    await dlg.waitFor();
    await this.fill({ title: question }, dlg);
    await dlg.locator('[name="question_type"]').getByText(new RegExp(`^\\s*${q.type || 'Multiple choice: only one answer'}\\s*$`, 'i')).first().click();
    await this.waitReady();
    for (const choice of q.choices || []) {
      await dlg.locator('.nav-link').filter({ hasText: /^\s*Answers\s*$/ }).click();
      const answers = this.field('suggested_answer_ids', dlg);
      const exactChoice = new RegExp(`^\\s*${choice}\\s*$`);
      if (await answers.locator('.o_data_row td[name="value"]').filter({ hasText: exactChoice }).count()) continue;
      await answers.locator('.o_field_x2many_list_row_add a').first().click();
      const input = answers.locator('.o_data_row.o_selected_row td[name="value"] input').first();
      await input.fill(choice);
      await input.press('Tab').catch(() => {});
      await this.waitReady();
    }
    if (q.choices) {
      // Drop blank answer rows (Enter in the list opens a new line; a blank one fails validation).
      const answers = this.field('suggested_answer_ids', dlg);
      for (let i = 0; i < 5; i++) {
        const empty = await answers.locator('.o_data_row').evaluateAll((rows) => rows.findIndex((r) => {
          const cell = r.querySelector('td[name="value"]');
          return cell && !(cell.querySelector('input')?.value || cell.innerText).trim();
        }));
        if (empty < 0) break;
        await answers.locator('.o_data_row').nth(empty).locator('.o_list_record_remove, button[name="delete"]').first().click();
        await this.waitReady();
      }
    }
    if (q.description) {
      await dlg.locator('.nav-link').filter({ hasText: /^\s*Description\s*$/ }).click();
      const editor = this.field('description', dlg).locator('.odoo-editor-editable, [contenteditable="true"]').first();
      await editor.click();
      await this.page.keyboard.press('Control+a');
      await this.page.keyboard.type(q.description);
    }
    if (q.comments !== undefined || q.mandatory !== undefined || q.width) {
      await dlg.locator('.nav-link').filter({ hasText: /^\s*Options\s*$/ }).click();
      const box = async (f, v) => {
        const input = this.field(f, dlg).locator('input').first();
        if ((await input.isChecked()) !== v) await input.click({ force: true });
      };
      if (q.comments !== undefined) await box('comments_allowed', q.comments);
      if (q.comments && q.commentMessage && (await appears(this.field('comments_message', dlg), 2_000))) await this.fill({ comments_message: q.commentMessage }, dlg);
      if (q.mandatory !== undefined) await box('constr_mandatory', q.mandatory);
      if (q.width) {
        const options = (await this.field('width', dlg).locator('select option').allInnerTexts()).map((t) => t.trim()).filter(Boolean);
        q.widthPicked = q.width === true ? options[0] : q.width;
        await this.field('width', dlg).locator('select').selectOption({ label: q.widthPicked });
      }
    }
    // Save; retry a click that only blurred an editor, and report a field the dialog flags as invalid.
    const save = dlg.locator('.modal-footer button').filter({ hasText: /^\s*Save( & Close)?\s*$/ }).first();
    await expect(async () => {
      if (await save.isVisible().catch(() => false)) await save.click({ timeout: 3_000 });
      const invalid = await dlg.locator('.o_field_invalid').evaluateAll((es) => es.map((e) => e.getAttribute('name'))).catch(() => []);
      expect(invalid, 'invalid fields in the question dialog').toEqual([]);
      await expect(dlg).toBeHidden({ timeout: 3_000 });
    }).toPass({ timeout: 30_000 });
  }

  async expectSurvey({ title, question }, x, picked) {
    expect.soft(await this.read('title'), 'title').toBe(title);
    if (picked.restrictTo) expect.soft((await this.field('restrict_user_ids').locator('.o_tag').allInnerTexts()).join(', '), 'restricted to').toContain(picked.restrictTo.split(', ')[0]);
    if (x.image) await expect.soft(this.field('background_image').locator('img'), 'background image').toHaveCount(1);
    await this.openTab('Questions');
    await expect.soft(this.field('question_and_page_ids'), 'question').toContainText(question);
    const checked = async (f) => (await this.field(f).locator('input[type="radio"]:checked').first().evaluate((e) => e.closest('.o_radio_item, div')?.innerText.trim()).catch(() => ''));
    await this.openTab('Options');
    if (x.layout) expect.soft(await checked('questions_layout'), 'layout').toContain(x.layout);
    if (x.progression) expect.soft(await checked('progression_mode'), 'progression').toContain(x.progression);
    if (x.selection) expect.soft(await checked('questions_selection'), 'selection').toContain(x.selection);
    if (x.scoring) expect.soft(await checked('scoring_type'), 'scoring').toContain(x.scoring);
    if (x.roaming !== undefined) expect.soft(await this.field('users_can_go_back').locator('input').first().isChecked(), 'allow roaming').toBe(x.roaming);
    if (x.loginRequired !== undefined) expect.soft(await this.field('users_login_required').locator('input').first().isChecked(), 'require login').toBe(x.loginRequired);
    if (x.accessMode) expect.soft(await this.read('access_mode'), 'access mode').toContain(x.accessMode);
    if (x.timeLimit) {
      expect.soft(await this.field('is_time_limited').locator('input').first().isChecked(), 'time limit').toBe(true);
      if (await this.field('time_limit').count()) expect.soft(parseFloat(await this.read('time_limit')), 'time limit minutes').toBe(x.timeLimit);
    }
    if (x.passPercent && (await this.field('scoring_success_min').count())) expect.soft(parseFloat(await this.read('scoring_success_min')), 'required score %').toBe(x.passPercent);
    if (x.description) { await this.openTab('Description'); await expect.soft(this.field('description'), 'description').toContainText(x.description); }
    if (x.endMessage) { await this.openTab('End Message'); await expect.soft(this.field('description_done'), 'end message').toContainText(x.endMessage); }
    // Question dialog values.
    const q = x.question || {};
    if (q.choices || q.description || q.comments !== undefined || q.mandatory !== undefined) {
      await this.openTab('Questions');
      await this.field('question_and_page_ids').locator('.o_data_row td.o_data_cell').filter({ hasText: question }).first().click();
      const dlg = this.page.locator('.modal:visible').last();
      await dlg.waitFor();
      for (const choice of q.choices || []) {
        await expect.soft(this.field('suggested_answer_ids', dlg).locator('.o_data_row td[name="value"]').filter({ hasText: new RegExp(`^\\s*${choice}\\s*$`) }), `choice ${choice}`).toHaveCount(1);
      }
      if (q.description) { await dlg.locator('.nav-link').filter({ hasText: /^\s*Description\s*$/ }).click(); await expect.soft(this.field('description', dlg), 'question description').toContainText(q.description); }
      await dlg.locator('.nav-link').filter({ hasText: /^\s*Options\s*$/ }).click();
      if (q.comments !== undefined) expect.soft(await this.field('comments_allowed', dlg).locator('input').first().isChecked(), 'show comments field').toBe(q.comments);
      if (q.mandatory !== undefined) expect.soft(await this.field('constr_mandatory', dlg).locator('input').first().isChecked(), 'mandatory answer').toBe(q.mandatory);
      if (q.widthPicked) expect.soft(await this.field('width', dlg).locator('select option:checked').innerText(), 'width').toContain(q.widthPicked);
      await dlg.locator('.modal-footer button').filter({ hasText: /^\s*Discard\s*$/ }).first().click();
      await dlg.waitFor({ state: 'hidden' });
    }
  }
}

/** Events app (TC-091). */
class EventsPage extends OdooPage {
  /**
   * Events > New. extras (optional) - every other field: { timezone, language, tags: name, venue: true, seatsMax, badgeFormat,
   * badgeImage, ticket: { name, price, seats, saleStart, saleEnd }, question: { title, type, answers, mandatory, oncePerOrder },
   * note, ticketInstructions }. Template stays empty (none defined); Communication keeps its default mails; the stage stays New.
   * An existing event with the same name is updated. Verified after save.
   */
  async createEvent({ name }, { start, end }, extras) {
    // The date fields take "MM/DD/YYYY HH:MM" (a value with seconds is silently ignored).
    const noSeconds = (v) => (v ? String(v).replace(/(\d{1,2}:\d{2}):\d{2}$/, '$1') : v);
    [start, end] = [noSeconds(start), noSeconds(end)];
    const x = extras ? { ...extras, ticket: extras.ticket && { ...extras.ticket, saleStart: noSeconds(extras.ticket.saleStart), saleEnd: noSeconds(extras.ticket.saleEnd) } } : {};
    await this.openApp('Events');
    if (extras) await this.openExistingOrNew(name);
    else await this.clickNew();
    await this.fill({ name });
    const picked = {};
    if (x.timezone) await this.fill({ date_tz: x.timezone });
    if (x.language) await this.fill({ lang: x.language });
    // Date range after the timezone; re-enter until both ends show the requested day.
    const inputs = this.field('date_begin').locator('input');
    await expect(async () => {
      await inputs.nth(0).click();
      await inputs.nth(0).fill(start);
      await inputs.nth(0).press('Enter');
      if ((await inputs.count()) > 1) {
        await inputs.nth(1).click();
        await inputs.nth(1).fill(end);
        await inputs.nth(1).press('Enter');
      }
      await this.page.locator('.o_datetime_picker').waitFor({ state: 'hidden', timeout: 1_000 }).catch(() => this.page.keyboard.press('Escape'));
      await this.waitReady();
      await expect(inputs.nth(0)).toHaveValue(new RegExp(`^${start.slice(0, 10)}`), { timeout: 3_000 });
      if ((await inputs.count()) > 1) await expect(inputs.nth(1)).toHaveValue(new RegExp(`^${end.slice(0, 10)}`), { timeout: 3_000 });
    }).toPass({ timeout: 45_000 });
    if (x.tags) {
      const field = this.field('tag_ids');
      if (!(await field.locator('.o_tag').filter({ hasText: x.tags }).count())) {
        const input = field.locator('input').first();
        await input.click();
        await input.fill(x.tags);
        const known = this.page.locator('.o-autocomplete--dropdown-item').filter({ visible: true }).filter({ hasText: new RegExp(`^\\s*${x.tags}\\s*$`) }).first();
        const create = this.page.locator('.o-autocomplete--dropdown-item').filter({ visible: true }).filter({ hasText: /^\s*Create( and edit)?/ }).first();
        await expect(known.or(create).first()).toBeVisible();
        await ((await known.isVisible().catch(() => false)) ? known : create).click();
        // "Create and edit" opens the tag form (it needs a category): pick the first and save it.
        const dlg = this.page.locator('.modal:visible').filter({ has: this.page.locator('.o_field_widget[name="category_id"]') }).last();
        if (await appears(dlg, 3_000)) {
          if (!(await this.read('category_id', dlg))) {
            // No tag categories may exist: use / create "QA Event Category".
            const cat = this.field('category_id', dlg).locator('input').first();
            await cat.click();
            await cat.fill('QA Event Category');
            const knownCat = this.page.locator('.o-autocomplete--dropdown-item').filter({ visible: true }).filter({ hasText: /^\s*QA Event Category\s*$/ }).first();
            const createCat = this.page.locator('.o-autocomplete--dropdown-item').filter({ visible: true }).filter({ hasText: /^\s*Create/ }).first();
            await expect(knownCat.or(createCat).first()).toBeVisible();
            if (await knownCat.isVisible().catch(() => false)) await knownCat.click();
            else {
              await createCat.click();
              // "Create and edit...": the category form opens in its own dialog.
              const catDlg = this.page.locator('.modal:visible').filter({ hasNotText: 'Create Tags' }).last();
              if (await appears(catDlg, 3_000)) {
                const nameInput = catDlg.locator('.o_field_widget[name="name"] input').first();
                if (!(await nameInput.inputValue())) await nameInput.fill('QA Event Category');
                await catDlg.locator('.modal-footer button').filter({ hasText: /^\s*Save( & Close)?\s*$/ }).first().click();
                await catDlg.waitFor({ state: 'hidden' });
              }
            }
            await this.waitReady();
          }
          await dlg.locator('.modal-footer button').filter({ hasText: /^\s*Save( & Close)?\s*$/ }).first().click();
          await dlg.waitFor({ state: 'hidden' });
        }
        await this.waitReady();
      }
      picked.tags = (await field.locator('.o_tag').allInnerTexts()).map((t) => t.trim()).join(', ');
    }
    if (x.venue) picked.venue = (await this.read('address_id')) || (await this.pickFirstOption('address_id'));
    if (x.seatsMax) {
      await this.setBoolean('seats_limited', true);
      await this.waitReady();
      await this.fill({ seats_max: x.seatsMax });
    }
    if (x.badgeFormat) await this.fill({ badge_format: x.badgeFormat });
    if (x.badgeImage) {
      await this.field('badge_image').locator('input[type="file"]').setInputFiles(x.badgeImage);
      await this.waitReady();
    }
    if (x.ticket) {
      await this.openTab('Tickets');
      const list = this.field('event_ticket_ids');
      // Address the row by position: once edited, its name sits in an input and text filters stop matching.
      const names = await list.locator('.o_data_row td[name="name"]').allInnerTexts();
      let idx = names.findIndex((t) => t.trim() === x.ticket.name);
      if (idx < 0) {
        idx = names.length;
        await list.locator('.o_field_x2many_list_row_add a').first().click();
        await list.locator('.o_data_row.o_selected_row').first().waitFor();
      } else await list.locator('.o_data_row').nth(idx).locator('td[name="name"]').click();
      const row = list.locator('.o_data_row').nth(idx);
      const cell = async (f, v, { date } = {}) => {
        if (v === undefined) return;
        await row.locator(`td[name="${f}"]`).click();
        const input = row.locator(`td[name="${f}"] input`).first();
        await expect(async () => {
          await input.fill(String(v));
          // Dates commit on Enter; others on Tab (never Escape: in an editable list it discards the row's edits).
          await input.press(date ? 'Enter' : 'Tab').catch(() => {});
          await this.waitReady();
          if (date) {
            await this.page.locator('.o_datetime_picker').waitFor({ state: 'hidden', timeout: 1_000 }).catch(() => {});
            await expect(row.locator(`td[name="${f}"]`)).toContainText(String(v).slice(0, 10), { timeout: 2_000 }).catch(async () => {
              await expect(input).toHaveValue(new RegExp(`^${String(v).slice(0, 10)}`), { timeout: 2_000 });
            });
          }
        }).toPass({ timeout: 20_000 });
      };
      // Product first (its onchange sets name/price), then the rest.
      if (await row.locator('td[name="product_id"] input').count() && !(await row.locator('td[name="product_id"] input').inputValue())) {
        await row.locator('td[name="product_id"]').click();
        picked.ticketProduct = await this.pickFirstOption('product_id', row).catch(() => '');
      }
      if (await row.locator('td[name="product_id"] input').count() && !(await row.locator('td[name="product_id"] input').inputValue())) {
        // No event-ticket product on this instance (ultraserv): Product is required, so the ticket can't be saved.
        await this.page.keyboard.press('Escape').catch(() => {});
        await row.locator('.o_list_record_remove, button[name="delete"]').first().click().catch(() => {});
        await this.waitReady();
        picked.ticketSkipped = true;
        test.info().annotations.push({ type: 'Ticket skipped', description: 'No event-ticket product (service tracking = Event) on this instance' });
      }
    }
    if (x.ticket && !picked.ticketSkipped) {
      const list = this.field('event_ticket_ids');
      const row = list.locator('.o_data_row').filter({ has: this.page.locator('td[name="product_id"]') }).last();
      const cell = async (f, v, { date } = {}) => {
        if (v === undefined) return;
        await row.locator(`td[name="${f}"]`).click();
        const input = row.locator(`td[name="${f}"] input`).first();
        await expect(async () => {
          await input.fill(String(v));
          await input.press(date ? 'Enter' : 'Tab').catch(() => {});
          await this.waitReady();
        }).toPass({ timeout: 20_000 });
      };
      await cell('name', x.ticket.name);
      await cell('start_sale_datetime', x.ticket.saleStart, { date: true });
      await cell('end_sale_datetime', x.ticket.saleEnd, { date: true });
      await cell('seats_max', x.ticket.seats);
      // Price last: the product onchange can reset it.
      await cell('price', x.ticket.price);
      await this.waitReady();
    }
    if (x.question) {
      await this.openTab('Questions');
      const list = this.field('question_ids');
      const existing = list.locator('.o_data_row').filter({ hasText: x.question.title }).first();
      if (await existing.count()) await existing.locator('td.o_data_cell').filter({ hasText: x.question.title }).first().click();
      else await list.locator('.o_field_x2many_list_row_add a').first().click();
      const dlg = this.page.locator('.modal:visible').filter({ has: this.page.locator('.o_field_widget[name="question_type"]') }).last();
      await dlg.waitFor();
      await this.fill({ title: x.question.title }, dlg);
      await this.field('question_type', dlg).locator('label').filter({ hasText: new RegExp(`^\\s*${x.question.type}\\s*$`) }).first().click();
      const box = async (f, v) => {
        if (v === undefined) return;
        const input = this.field(f, dlg).locator('input').first();
        if ((await input.isChecked()) !== v) await input.click({ force: true });
      };
      await box('is_mandatory_answer', x.question.mandatory);
      await box('once_per_order', x.question.oncePerOrder);
      for (const answer of x.question.answers || []) {
        const answers = this.field('answer_ids', dlg);
        if (await answers.locator('.o_data_row td[name="name"]').filter({ hasText: new RegExp(`^\\s*${answer}\\s*$`) }).count()) continue;
        await answers.locator('.o_field_x2many_list_row_add a').first().click();
        const input = answers.locator('.o_data_row.o_selected_row td[name="name"] input').first();
        await input.fill(answer);
        // Commit by clicking the dialog header: Tab on the last answer opens a new blank (required) answer row.
        await dlg.locator('.modal-header, .modal-title').first().click().catch(() => input.press('Enter'));
        await this.waitReady();
      }
      // Drop blank answer rows (the list can leave an empty line, which fails "Answer" required on save).
      const answerList = this.field('answer_ids', dlg);
      for (let i = 0; i < 5; i++) {
        const empty = await answerList.locator('.o_data_row').evaluateAll((rows) => rows.findIndex((r) => {
          const cell = r.querySelector('td[name="name"]');
          return cell && !(cell.querySelector('input')?.value || cell.innerText).trim();
        }));
        if (empty < 0) break;
        await answerList.locator('.o_data_row').nth(empty).locator('.o_list_record_remove, button[name="delete"]').first().click();
        await this.waitReady();
      }
      const save = dlg.locator('.modal-footer button').filter({ hasText: /^\s*Save( & Close)?\s*$/ }).first();
      await expect(async () => {
        if (await save.isVisible().catch(() => false)) await save.click({ timeout: 3_000 });
        await expect(dlg).toBeHidden({ timeout: 3_000 });
      }).toPass({ timeout: 30_000 });
    }
    const html = async (f, value) => {
      const editor = this.field(f).locator('.odoo-editor-editable, [contenteditable="true"]').first();
      await editor.click();
      await this.page.keyboard.press('Control+a');
      await this.page.keyboard.type(value);
    };
    if (x.note || x.ticketInstructions) {
      await this.openTab('Notes');
      if (x.note) await html('note', x.note);
      if (x.ticketInstructions) await html('ticket_instructions', x.ticketInstructions);
    }
    if (!x.venue && (await this.field('address_id').locator('input').count())) await this.pickFirstOption('address_id').catch(() => {});
    const url = await this.save();
    if (extras) await this.expectEvent(name, start, x, picked);
    return url;
  }

  async expectEvent(name, start, x, picked) {
    expect.soft(await this.read('name'), 'event name').toBe(name);
    expect.soft(await this.field('date_begin').locator('input').first().inputValue(), 'start').toContain(start.slice(0, 10));
    if (x.timezone) expect.soft(await this.read('date_tz'), 'timezone').toContain(x.timezone);
    if (x.language) expect.soft(await this.read('lang'), 'language').toContain(x.language);
    if (x.tags) expect.soft((await this.field('tag_ids').locator('.o_tag').allInnerTexts()).join(', '), 'tags').toContain(x.tags);
    if (picked.venue) expect.soft(await this.read('address_id'), 'venue').toContain(picked.venue);
    if (x.seatsMax) {
      expect.soft(await this.field('seats_limited').locator('input').first().isChecked(), 'limit registrations').toBe(true);
      expect.soft(parseInt(await this.read('seats_max'), 10), 'maximum registrations').toBe(x.seatsMax);
    }
    if (x.badgeFormat) expect.soft(await this.read('badge_format'), 'badge dimension').toContain(x.badgeFormat);
    if (x.ticket && !picked.ticketSkipped) {
      await this.openTab('Tickets');
      const row = this.field('event_ticket_ids').locator('.o_data_row').filter({ hasText: x.ticket.name }).first();
      await expect.soft(row, `ticket ${x.ticket.name}`).toBeVisible();
      if (x.ticket.price !== undefined) await expect.soft(row.locator('td[name="price"]'), 'ticket price').toContainText(x.ticket.price.toFixed(2));
      if (x.ticket.seats !== undefined) await expect.soft(row.locator('td[name="seats_max"]'), 'ticket maximum').toContainText(String(x.ticket.seats));
      if (x.ticket.saleStart) await expect.soft(row.locator('td[name="start_sale_datetime"]'), 'sales start').toContainText(x.ticket.saleStart.slice(0, 10));
      if (x.ticket.saleEnd) await expect.soft(row.locator('td[name="end_sale_datetime"]'), 'sales end').toContainText(x.ticket.saleEnd.slice(0, 10));
    }
    if (x.question) {
      await this.openTab('Questions');
      const row = this.field('question_ids').locator('.o_data_row').filter({ hasText: x.question.title }).first();
      await expect.soft(row, `question ${x.question.title}`).toBeVisible();
      for (const answer of x.question.answers || []) await expect.soft(row, `answer ${answer}`).toContainText(answer);
    }
    if (x.note || x.ticketInstructions) {
      await this.openTab('Notes');
      if (x.note) await expect.soft(this.field('note'), 'note').toContainText(x.note);
      if (x.ticketInstructions) await expect.soft(this.field('ticket_instructions'), 'ticket instructions').toContainText(x.ticketInstructions);
    }
  }
}

/** Micromarket Services app (TC-094..TC-099). */
class MicroMarketPage extends OdooPage {
  async open(...menu) {
    await this.openApp('Micromarket Services');
    if (menu.length) await this.openMenu(...menu);
  }

  /**
   * Micromarket Services > Locations: Location Type Micromarket + customer + address -> save
   * -> Products tab: add a product directly and load a Micromarket catalogue.
   */
  async createLocation(mm, { customer, product, catalogue, onSaved }) {
    // Re-runs reuse the market created earlier (the Locations list search doesn't filter reliably).
    const existing = require('../utils/state').optional('mmUrl');
    // A slow first save can create the market without the run recording it: reuse a market with this name.
    let found = false;
    if (!existing) {
      await this.open('Locations');
      await this.search(mm.name);
      const row = this.rows(mm.name).filter({ hasNotText: '-CLOSE' }).first();
      if (await appears(row, 5_000)) {
        await row.locator('td.o_data_cell').filter({ hasText: mm.name }).first().click().catch(() => row.click());
        await this.page.locator('.o_form_view').first().waitFor();
        await this.waitReady();
        found = (await this.read('name')).trim() === mm.name;
        if (found && onSaved) onSaved(this.currentUrl());
      }
    }
    if (existing) {
      await this.goto(existing);
    } else if (!found) {
      await this.open('Locations');
      await this.clickNew();
      await this.fill({ location_type: 'Micromarket' });
      await this.fill({ micro_market_type: 'Office' }).catch(() => {});
      await this.fill({ name: mm.name, partner_id: customer });
      await this.fill({ zip: mm.zip });
      await this.fill({ street: mm.street });
      // Creating a market sets up a whole warehouse and can take minutes: click Save once and wait for the record.
      await this.page.locator('.o_form_button_save').filter({ visible: true }).first().click();
      await expect(this.page).not.toHaveURL(/\/new(\?|$)/, { timeout: 180_000 });
      await this.waitReady(180_000);
      await this.expectNoError();
      if (onSaved) onSaved(this.currentUrl());
    }
    const url = this.currentUrl();
    await this.openTab('Products');
    // Pick products and/or catalogues, then one "Add" loads them into Micromarket Products.
    if (product && !(await this.marketProduct(product.name).isVisible().catch(() => false))) await this.fill({ single_product_ids: [product.name] });
    if (catalogue) await this.fill({ catalog_ids: [catalogue] });
    await this.field('add').locator('button').click();
    await this.waitReady();
    // A catalogue Add that loads nothing can leave the form dirty but unsavable; keep what was added.
    await this.save().catch(async () => {
      await this.page.keyboard.press('Escape').catch(() => {});
      await this.discard();
    });
    return url;
  }

  /**
   * Micro Market location: every other editable field. x: { storeNo, image, type, street2, county, division: true, route,
   * frequency: true, flags: { field: bool }, branch, poNo, frequencyStart, nextDate, contact, email, providerId,
   * internalNotes, specialNotes, showPriceList }. Handled Externally and the archive fields are left alone.
   * Verified after save. Returns the options picked.
   */
  async fillLocationExtras(url, x) {
    await this.goto(url);
    await this.field('name').waitFor();
    const picked = {};
    const pick = async (f, v) => {
      const current = (await this.read(f)).trim();
      if (current && !/Select options/i.test(current) && (v === true || current.includes(v))) return current;
      return v === true ? this.pickFirstOption(f) : this.pickPreferredOption(f, v);
    };
    if (x.storeNo) await this.fill({ store_no: x.storeNo });
    if (x.image) {
      await this.field('image').locator('input[type="file"]').setInputFiles(x.image);
      await this.waitReady();
    }
    if (x.type) await this.fill({ micro_market_type: x.type });
    if (x.street2) await this.fill({ street2: x.street2 });
    if (x.county) await this.fill({ county: x.county });
    await this.openTab('General Information');
    if (x.division) picked.division = await pick('division_id', x.division);
    if (x.route) picked.route = await pick('route', x.route);
    if (x.frequency) picked.frequency = await pick('frequency', x.frequency);
    // A checkbox whose onchange crashes (Addl.Tax, see FINDINGS.md TC-094) is reported and left as it is.
    picked.flagErrors = {};
    for (const [f, v] of Object.entries(x.flags || {})) {
      const box = this.field(f).locator('input[type="checkbox"]').first();
      if ((await box.isChecked()) === v) continue;
      await box.click({ force: true });
      const err = this.page.locator('.modal:visible').filter({ hasText: /Averigo Error|Something went wrong|Error/ }).last();
      if (await appears(err, 3_000)) {
        const details = err.getByText('See technical details');
        if (await details.isVisible().catch(() => false)) await details.click().catch(() => {});
        const lines = (await err.innerText()).split('\n').map((l) => l.trim());
        picked.flagErrors[f] = lines.find((l) => /^\w*Error: /.test(l) && !/^RPC_ERROR/.test(l)) || lines[1] || 'error';
        await err.locator('button').filter({ hasText: /^\s*(Close|Ok)\s*$/ }).first().click().catch(() => this.page.keyboard.press('Escape'));
        await this.waitReady();
        continue;
      }
      // Confirmation toggles (e.g. Customer Owned Category) ask first.
      const confirm = this.page.locator('.modal:visible').filter({ hasText: /Are you sure|confirm/i }).last();
      if (await appears(confirm, 1_500)) await confirm.locator('.modal-footer button').filter({ hasText: /^\s*(Ok|Confirm|Yes)\s*$/i }).first().click();
      await this.waitReady();
    }
    for (const [f, e] of Object.entries(picked.flagErrors)) expect.soft(e, `ticking ${f} (see FINDINGS.md TC-094)`).toBeUndefined();
    if (x.branch !== undefined) await this.fill({ branch: x.branch });
    if (x.poNo) await this.fill({ po_no: x.poNo });
    if (x.frequencyStart) await this.setDate('frequency_start_date', x.frequencyStart);
    if (x.nextDate) await this.setDate('frequency_date', x.nextDate);
    if (x.contact) await this.fill({ contact_person: x.contact });
    if (x.email) await this.fill({ email: x.email });
    if (x.providerId) await this.fill({ vms_id: x.providerId });
    if (x.internalNotes || x.specialNotes) {
      await this.openTab('Notes');
      if (x.internalNotes) await this.fill({ internal_notes: x.internalNotes });
      if (x.specialNotes) await this.fill({ special_notes: x.specialNotes });
    }
    if (x.showPriceList !== undefined) {
      await this.openTab('Others');
      await this.setBoolean('show_price_list', x.showPriceList);
    }
    await this.save();

    // Every entered value saved.
    const text = async (f, v, label) => { if (v !== undefined) expect.soft(await this.read(f), label).toBe(String(v)); };
    await text('store_no', x.storeNo, 'store #');
    if (x.type) expect.soft(await this.read('micro_market_type'), 'micromarket type').toContain(x.type);
    await text('street2', x.street2, 'street2');
    await text('county', x.county, 'county');
    if (x.image) await expect.soft(this.field('image').locator('img'), 'image').not.toHaveAttribute('src', /placeholder/);
    await this.openTab('General Information');
    for (const [f, key, label] of [['division_id', 'division', 'division'], ['route', 'route', 'route'], ['frequency', 'frequency', 'frequency']]) {
      if (picked[key]) expect.soft(await this.read(f), label).toContain(picked[key]);
    }
    for (const [f, v] of Object.entries(x.flags || {})) {
      if (picked.flagErrors?.[f]) continue;
      expect.soft(await this.field(f).locator('input[type="checkbox"]').first().isChecked(), f).toBe(v);
    }
    if (x.branch !== undefined) expect.soft(parseInt(await this.read('branch'), 10), 'branch id').toBe(x.branch);
    await text('po_no', x.poNo, 'PO #');
    if (x.frequencyStart) expect.soft(await this.read('frequency_start_date'), 'frequency start date').toContain(x.frequencyStart);
    if (x.nextDate) expect.soft(await this.read('frequency_date'), 'next scheduled date').toContain(x.nextDate);
    await text('contact_person', x.contact, 'contact name');
    await text('email', x.email, 'contact email');
    await text('vms_id', x.providerId, 'provider market id');
    if (x.internalNotes || x.specialNotes) {
      await this.openTab('Notes');
      await text('internal_notes', x.internalNotes, 'internal notes');
      await text('special_notes', x.specialNotes, 'special notes');
    }
    if (x.showPriceList !== undefined) {
      await this.openTab('Others');
      expect.soft(await this.field('show_price_list').locator('input').first().isChecked(), 'show price list').toBe(x.showPriceList);
    }
    return picked;
  }

  /**
   * Setup > Micromarket Fees: the market's row is edited inline. fees: { cc_fees, app_fees, stored_fund_fees, brand_fees,
   * management_fees, platform_fees, platform_fees_per_day, group_fees_percentage, cash_adj }. Verified on the saved row.
   */
  async setMarketFees(market, fees) {
    await this.openApp('Setup');
    await this.openMenu('Micromarket Fees');
    await this.search(market);
    const row = this.rows(market).first();
    await row.waitFor();
    // Click an editable cell (the read-only Warehouse cell doesn't start the edit).
    const editing = this.page.locator('.o_list_view .o_data_row.o_selected_row');
    await expect(async () => {
      if (!(await editing.count())) await row.locator(`td[name="${Object.keys(fees)[0]}"]`).click();
      await expect(editing).toHaveCount(1, { timeout: 3_000 });
    }).toPass({ timeout: 30_000 });
    for (const [f, v] of Object.entries(fees)) {
      const cell = editing.locator(`td[name="${f}"]`);
      await cell.click();
      const input = cell.locator('input').first();
      await input.fill(String(v));
      await input.press('Tab');
      await this.waitReady();
    }
    await this.save();
    const saved = this.rows(market).first();
    for (const [f, v] of Object.entries(fees)) {
      const shown = parseFloat((await saved.locator(`td[name="${f}"]`).innerText()).replace(/[^0-9.-]/g, ''));
      expect.soft(shown, `Micromarket Fees ${f}`).toBeCloseTo(v, 2);
    }
  }

  /** Adds products directly (Products picker + Add) when they're not on the market yet. */
  async addMarketProducts(products) {
    await this.openTab('Products');
    const missing = [];
    for (const p of products) if (!(await this.marketProduct(p.name).isVisible().catch(() => false))) missing.push(p);
    if (!missing.length) return;
    await this.fill({ single_product_ids: missing.map((p) => p.name) });
    await this.field('add').locator('button').click();
    await this.waitReady();
    await this.save();
  }

  marketProduct(name) {
    return this.field('market_product_ids').locator('.o_data_row').filter({ hasText: name }).first();
  }

  /**
   * Store Order: source warehouse + market -> one line per market product (Ordered Quantity)
   * -> Save -> Approve -> Pick (Confirm Picking) -> Receive. qtyByCode: { code: qty } (others set to 0).
   */
  async createStoreOrder({ warehouse, location, qtyByCode, complete = true }) {
    await this.open('Store Orders');
    await this.clickNew();
    await this.fill({ warehouse_id: warehouse });
    await this.fill({ micro_market_id: location });
    // By default only products below Max with nothing pending are listed; show every market product.
    await this.fill({ show_all: true });
    await this.waitReady();
    const lines = this.field('move_ids_without_package').locator('.o_data_row');
    await lines.first().waitFor();
    for (const code of Object.keys(qtyByCode)) await expect(lines.filter({ hasText: code }).first(), `${code} offered on the store order`).toBeVisible();
    // Lines re-render/re-order while editing: find each product's line (by its Product Code cell) right before editing it.
    const codes = (await lines.locator('td[name="product_code"]').allInnerTexts()).map((t) => t.trim());
    for (const code of codes) {
      const idx = (await lines.locator('td[name="product_code"]').allInnerTexts()).findIndex((t) => t.trim() === code);
      if (idx < 0) continue;
      const cell = lines.nth(idx).locator('td[name="product_uom_qty"]');
      await cell.click();
      await cell.locator('input').fill(String(qtyByCode[code] ?? 0));
      await cell.locator('input').press('Tab');
      await this.waitReady();
    }
    await this.save();
    const url = this.currentUrl();
    if (complete) {
      await this.click('action_to_confirm');
      await this.expectStatus(/Approved/);
      await this.click('open_assign_confirm');
      await this.dialogs().filter({ hasText: /Confirm Picking/ }).last().locator('button').filter({ hasText: /^\s*Confirm\s*$/ }).click();
      await this.waitReady();
      await this.expectStatus(/Picked/);
      await this.click('button_validate');
      await this.expectNoError();
      await this.expectStatus(/Received/);
    }
    return { url, name: await this.recordTitle() };
  }

  /** "Current Stock" of a product on the market's Products tab. */
  async marketStock(marketUrl, productName) {
    await this.goto(marketUrl);
    await this.openTab('Products');
    const row = this.marketProduct(productName);
    await row.waitFor();
    return parseFloat((await row.locator('td[name="quantity"]').innerText()).replace(/[^0-9.-]/g, '')) || 0;
  }


  /**
   * Update Location (market reconciliation): market + product -> Get Product List -> line values
   * (new_min/new_max/actual_qty/spoiled_qty/theft_qty/return_qty) -> Update & Reconcile.
   */
  /**
   * Update Location: market -> load product lines -> edit one product's line -> Save -> Update & Reconcile.
   * values: { new_max, new_min, actual_qty, spoiled_qty, theft_qty, return_qty, ... } (Max before Min: Min <= Max is
   * validated per cell). copyActual: click "Copy Actual Qty" first. warehouse: the line's Warehouse (where returns go).
   * Returns { url, name, stockBefore (the line's Stock) }.
   */
  async updateLocation({ market, product, values, copyActual, warehouse }) {
    await this.open('Update Location', 'Update Location');
    await this.clickNew();
    await this.fill({ micro_market_id: market });
    await this.click('action_get_product_lines');
    const rows = this.field('product_ids').locator('.o_data_row');
    await rows.filter({ hasText: product.name }).first().waitFor();
    if (copyActual) {
      await this.click('action_copy_actual_qty');
      await this.waitReady();
    }
    // Lines re-render while editing: find the product's line by position.
    const row = rows.nth((await rows.allInnerTexts()).findIndex((t) => t.includes(product.name)));
    const stock = parseFloat((await row.locator('td[name="cur_mm_stock"]').innerText()).replace(/[^0-9.-]/g, '')) || 0;
    // Click a cell until its input shows (the first click can just select the row).
    const editCell = async (name) => {
      const input = row.locator(`td[name="${name}"] input`).first();
      await expect(async () => {
        if (!(await input.isVisible().catch(() => false))) await row.locator(`td[name="${name}"]`).click();
        await expect(input).toBeVisible({ timeout: 3_000 });
      }).toPass({ timeout: 30_000 });
      return input;
    };
    if (warehouse) {
      await expect(async () => {
        const input = await editCell('warehouse_id');
        await input.fill(warehouse);
        await this.page.locator('.o-autocomplete--dropdown-item').filter({ visible: true }).filter({ hasText: warehouse }).first().click({ timeout: 5_000 });
        await this.waitReady();
        await expect(row.locator('td[name="warehouse_id"]')).toContainText(warehouse, { timeout: 3_000 }).catch(async () => {
          await expect(row.locator('td[name="warehouse_id"] input').first()).toHaveValue(new RegExp(warehouse), { timeout: 2_000 });
        });
      }).toPass({ timeout: 60_000 });
    }
    for (const [name, value] of Object.entries(values)) {
      const input = await editCell(name);
      await input.fill(String(value));
      await input.press('Tab');
      await this.waitReady();
    }
    await this.save();
    // Every entered value saved on the line.
    const saved = rows.nth((await rows.allInnerTexts()).findIndex((t) => t.includes(product.name)));
    for (const [name, value] of Object.entries(values)) {
      const shown = parseFloat((await saved.locator(`td[name="${name}"]`).innerText()).replace(/[^0-9.-]/g, ''));
      expect.soft(shown, `Update Location ${name}`).toBe(Number(value));
    }
    if (warehouse) await expect.soft(saved.locator('td[name="warehouse_id"]'), 'line warehouse').toContainText(warehouse);
    const url = this.currentUrl();
    await this.click('action_confirm_reconcile');
    await this.expectNoError();
    await this.expectStatus(/Reconciled/);
    return { url, name: await this.recordTitle(), stockBefore: stock };
  }

  /** Market product line value (Products tab), e.g. min_qty / max_qty / quantity / list_price. */
  async marketValue(marketUrl, productName, column) {
    await this.goto(marketUrl);
    await this.openTab('Products');
    const row = this.marketProduct(productName);
    await row.waitFor();
    return parseFloat((await row.locator(`td[name="${column}"]`).innerText()).replace(/[^0-9.-]/g, '')) || 0;
  }

  /** Specials: dates/times, discount %, products [Add], customer, market, banner -> Save. */
  async createSpecial({ name, discountPercent }, { customer, market, products, start, end }) {
    await this.open('Specials');
    await this.clickNew();
    await this.fill({ customer_ids: customer });
    await this.fill({ market_id: market });
    await this.fill({ start_date: start, end_date: end });
    await this.fill({ start_time: '00:00', end_time: '23:59' });
    await this.fill({ discount_percentage: discountPercent, banner_text: name });
    await this.fill({ select_product_ids: products.map((p) => p.name) });
    await this.field('add_button').locator('button').click();
    await this.waitReady();
    for (const p of products) await expect(this.field('product_line').locator('.o_data_row').filter({ hasText: p.name }).first()).toBeVisible();
    return this.save();
  }

  /** Front Desk / Employee Discount: type, discount %, bill-to customer, markets, user line -> Confirm. */
  /** Front Desk/Employee Discount. Employee type takes a Discount %; Front Desk type has Allow All instead. */
  async createFrontDeskDiscount({ deskType = 'Employee', percent, allowAll, customer, market, user }) {
    await this.open('Front Desk/Employee Discount');
    await this.clickNew();
    await this.fill({ desk_type: deskType });
    await this.waitReady();
    if (deskType === 'Front Desk') {
      if (allowAll !== undefined) await this.setBoolean('allow_all', allowAll);
      await this.fill({ partner_id: customer });
    } else await this.fill({ discount: percent, partner_id: customer });
    await this.fill({ micro_market_ids: [market] });
    if (user) await this.addLine('user_line', { first_name: user.firstName, last_name: user.lastName, email: user.email });
    await this.save();
    await this.click('action_confirm_desk');
    await this.expectNoError();
    await this.expectStatus(/Confirmed/);
    return this.currentUrl();
  }

  /**
   * Micromarket Services > Surge Pricing > New: name, start/end (MM/DD/YYYY HH:MM), price type + value, customers, markets,
   * category, products -> Add (one line per market product: Current / New Price) -> Save (confirms it) -> Confirmed.
   * Returns { url, name, lines: [{ product, current, next }], state }.
   */
  async createSurgePricing({ name, start, end, type, value, customers, markets, categories = [], products, confirm = true, expectRejected }) {
    await this.open('Surge Pricing');
    await this.clickNew();
    await this.fill({ name });
    for (const [f, v] of [['start_date', start], ['end_date', end]]) {
      const input = this.field(f).locator('input').first();
      await expect(async () => {
        await input.fill(v);
        await input.press('Enter');
        await this.page.keyboard.press('Escape').catch(() => {});
        await expect(input).toHaveValue(new RegExp(`^${v.slice(0, 10)}`), { timeout: 3_000 });
      }).toPass({ timeout: 30_000 });
    }
    await this.fill({ price_update_type: type });
    await this.waitReady();
    await this.fill({ price_value: value });
    await this.fill({ customer_ids: customers });
    await this.fill({ market_ids: markets });
    if (categories.length) await this.fill({ category_ids: categories });
    await this.fill({ select_product_ids: products.map((p) => p.name) });
    for (const p of products) await expect(this.field('select_product_ids')).toContainText(p.name);
    await this.field('add_button').locator('button').click();
    await this.waitReady();
    const lines = this.field('product_line').locator('.o_data_row');
    for (const p of products) await expect(lines.filter({ hasText: p.name }).first(), `${p.code} line added`).toBeVisible();
    if (expectRejected) {
      // Negative case: saving must be refused (e.g. overlapping surge); return the message and discard.
      await this.page.locator('.o_form_button_save').filter({ visible: true }).first().click();
      const err = this.errorDialog();
      await expect(err, 'save refused').toBeVisible();
      const text = (await this.page.locator('.modal:visible').last().innerText()).trim();
      await this.page.locator('.modal:visible').last().locator('button').filter({ hasText: /Discard changes|Close|Ok/ }).first().click();
      await this.discard().catch(() => {});
      return { rejected: text };
    }
    await this.save();
    const url = this.currentUrl();
    const num = (t) => parseFloat(String(t).replace(/[^0-9.-]/g, '')) || 0;
    const out = [];
    for (const p of products) {
      const row = lines.filter({ hasText: p.name }).first();
      out.push({ product: p.code, market: (await row.locator('td[name="micro_market_id"]').innerText()).trim(),
        current: num(await row.locator('td[name="current_price"]').innerText()), next: num(await row.locator('td[name="new_price"]').innerText()) });
    }
    if (confirm) {
      // Saving confirms the surge on this instance; click Confirm only if it is still Draft.
      if (/Draft/i.test(await this.status())) {
        await this.clickAny(['action_confirm', 'Confirm']);
        await this.expectNoError();
      }
      await expect(this.currentStatus()).toHaveText(/Confirmed|Active/);
    }
    return { url, name, lines: out, state: await this.status() };
  }

  /**
   * Micromarket Services > Discontinue Products (dialog): customers -> micro markets -> products -> Discontinue Products.
   * Returns the dialog totals { markets, products } shown before confirming.
   */
  async discontinueProducts({ customers, markets, products }) {
    await this.open('Discontinue Products');
    const dlg = this.dialogs().filter({ has: this.page.locator('.o_field_widget[name="product_ids"]') }).last();
    await dlg.waitFor();
    await this.fill({ partner_ids: customers }, dlg);
    await this.waitReady();
    await this.fill({ micro_market_ids: markets }, dlg);
    await this.waitReady();
    await this.fill({ product_ids: products.map((p) => p.name) }, dlg);
    await this.waitReady();
    for (const p of products) await expect(this.field('product_ids', dlg)).toContainText(p.name);
    const totals = { markets: parseInt(await this.read('total_markets', dlg), 10), products: parseInt(await this.read('total_products', dlg), 10) };
    await dlg.locator('button[name="process"]').click();
    await this.waitReady();
    await this.expectNoError();
    await expect(dlg).toBeHidden();
    return totals;
  }

  /** Micromarket Services > (more) > Discontinued Products: the market's row for a product code, or null. */
  async discontinuedRow(market, code) {
    await this.openApp('Micromarket Services');
    const more = this.page.locator('.o_menu_sections .dropdown-toggle').last();
    await more.click();
    await this.page.locator('.o-dropdown--menu .dropdown-item').filter({ hasText: /^\s*Discontinued Products\s*$/ }).first().click();
    // Large instances (ultraserv: ~150 market groups) load slowly; a search typed too early is lost.
    await this.waitReady(240_000);
    await expect(async () => {
      const box = this.page.locator('.o_searchview_input').first();
      if (!(await this.page.locator('.o_searchview_facet').filter({ hasText: code }).count())) {
        await box.click();
        await box.fill('');
        await box.pressSequentially(String(code), { delay: 20 });
        await box.press('Enter');
      }
      await this.waitReady(120_000);
      await expect(this.page.locator('.o_searchview_facet').filter({ hasText: code })).toHaveCount(1, { timeout: 5_000 });
    }).toPass({ timeout: 240_000 });
    await this.expandGroups?.().catch(() => {});
    // Grouped by market: open the market's group.
    const group = this.page.locator('.o_group_header').filter({ hasText: market }).first();
    if (await appears(group, 3_000)) {
      if (!(await group.evaluate((e) => e.classList.contains('o_group_open')))) await group.click();
      await this.waitReady();
    }
    const row = this.page.locator('.o_list_view .o_data_row').filter({ hasText: code }).first();
    return (await appears(row, 5_000)) ? row : null;
  }

  /** Locations > New micro market (type Micromarket / Office) for a customer, with products added directly. Returns its url. */
  async createMarket({ name, customer, zip, street, products = [] }) {
    await this.open('Locations');
    await this.clickNew();
    await this.fill({ location_type: 'Micromarket' });
    await this.fill({ micro_market_type: 'Office' }).catch(() => {});
    await this.fill({ name, partner_id: customer });
    await this.fill({ zip });
    await this.fill({ street });
    // Creating a market sets up a whole warehouse (locations, operation types) and can take minutes: click Save once
    // and wait for the record id instead of re-clicking a Save button that stays disabled meanwhile.
    await this.page.locator('.o_form_button_save').filter({ visible: true }).first().click();
    await expect(this.page).not.toHaveURL(/\/new(\?|$)/, { timeout: 180_000 });
    await this.waitReady(180_000);
    await this.expectNoError();
    const url = this.currentUrl();
    if (products.length) await this.addMarketProducts(products);
    return url;
  }

  /**
   * Market form > "Active Market" smart button > Close Market dialog: reason + Transfer Stocks To -> Confirm.
   * Returns { closeDate } as shown in the dialog.
   */
  async closeMarket(url, { reason, transferTo }) {
    await this.goto(url);
    await this.page.locator('button[name="close_market_form"]').click();
    const dlg = this.dialogs().filter({ has: this.page.locator('.o_field_widget[name="reason_for_close"]') }).last();
    await dlg.waitFor();
    const closeDate = (await this.read('close_date', dlg)).trim();
    await this.fill({ reason_for_close: reason }, dlg);
    // "Select options" list without a search box: open it and click the warehouse.
    const wh = this.field('warehouse_id', dlg);
    await expect(async () => {
      if (!(await wh.locator('.o_av_cdd_panel').isVisible().catch(() => false))) await wh.locator('.o_av_cdd_trigger').click();
      await wh.locator('.o_av_cdd_panel .o_av_cdd_list li').filter({ hasText: transferTo }).first().click({ timeout: 5_000 });
      const save = wh.locator('.o_av_cdd_panel .o_av_cdd_save');
      if (await save.isVisible().catch(() => false)) await save.click();
      await expect(wh).toContainText(transferTo, { timeout: 3_000 });
    }).toPass({ timeout: 30_000 });
    await dlg.locator('button[name="action_close_market"]').click();
    // "Are you sure want to Close this Market ?" -> Ok.
    const sure = this.page.locator('.modal:visible').filter({ hasText: /Are you sure want to Close this Market/i }).last();
    await sure.waitFor({ timeout: 15_000 });
    await sure.locator('.modal-footer button').filter({ hasText: /^\s*Ok\s*$/i }).first().click();
    await this.waitReady();
    await this.expectNoError();
    await expect(dlg).toBeHidden();
    return { closeDate };
  }

  /**
   * Other Payment Methods: nick name, bill-to customer, deduction type, limit, markets, app user.
   * Per type extras (only where the type shows them): rollover (Company Credit), dateConfig: true (first option).
   * user: { firstName, lastName, email, limit, employeeId }. Disable / Allow Unlimited stay off (a limit is set).
   */
  async createPaymentMethod({ name }, { customer, market, deductionType = 'Payroll Deduction', limit = 100, user, rollover, dateConfig }) {
    await this.open('Payment Methods', 'Other Payment Methods');
    // Re-runs update the method created earlier (a user can hold each deduction type only once per market).
    const existing = await this.openExistingOrNew(name);
    // Only enter what differs (re-entering an unchanged value leaves the form dirty with nothing to save).
    const differs = async (f, v, contains) => {
      if (!existing) return true;
      const shown = (await this.read(f)).trim();
      return contains ? !shown.includes(String(v)) : shown.replace(/[^0-9.-]/g, '') !== String(v) && shown !== String(v);
    };
    if (await differs('nick_name', name)) await this.fill({ nick_name: name });
    if (await differs('partner_id', customer, true)) await this.fill({ partner_id: customer });
    if (await differs('deduction_type', deductionType)) await this.fill({ deduction_type: deductionType });
    await this.waitReady();
    if (!existing || Math.abs(parseFloat((await this.read('spending_limit')).replace(/[^0-9.-]/g, '')) - limit) > 0.001) await this.fill({ spending_limit: limit });
    if (!(await this.field('micro_market_ids').innerText()).includes(market)) await this.fill({ micro_market_ids: [market] });
    const picked = {};
    if (dateConfig && (await appears(this.field('date_configuration'), 1_500))) {
      const select = this.field('date_configuration').locator('select');
      const current = (await this.read('date_configuration')).trim();
      if (existing && current && current !== 'false') picked.dateConfig = current.replace(/^"|"$/g, '');
      else if (await select.count()) {
        picked.dateConfig = (await select.locator('option').allInnerTexts()).map((t) => t.trim()).filter(Boolean)[0];
        await select.selectOption({ label: picked.dateConfig });
      } else picked.dateConfig = await this.pickFirstOption('date_configuration');
    }
    if (rollover !== undefined && (await appears(this.field('rollover_payroll'), 1_500)) && (await this.field('rollover_payroll').locator('input').first().isChecked()) !== rollover) await this.setBoolean('rollover_payroll', rollover);
    if (user) {
      const line = { first_name: user.firstName, last_name: user.lastName, user_email: user.email };
      if (user.employeeId) line.employee_id = user.employeeId;
      const userRow = this.field('app_users').locator('.o_data_row').filter({ hasText: user.email }).first();
      if (!(await userRow.count())) await this.addLine('app_users', line);
      else if (user.employeeId && !(await userRow.locator('td[name="employee_id"]').innerText()).includes(user.employeeId)) {
        // Existing line without the Employee ID (added by an earlier run): fill it in.
        await userRow.locator('td[name="employee_id"]').click();
        const input = this.field('app_users').locator('.o_data_row.o_selected_row td[name="employee_id"] input').first();
        await input.fill(user.employeeId);
        await input.press('Tab');
        await this.waitReady();
      }
      // The user's Limit is editable only for some deduction types (read-only on Payroll Deduction).
      const existingLimit = existing ? parseFloat((await this.field('app_users').locator('.o_data_row').filter({ hasText: user.email }).first().locator('td[name="credit_limit"]').innerText().catch(() => '')).replace(/[^0-9.-]/g, '')) : NaN;
      if (existingLimit === user.limit) picked.userLimit = user.limit;
      else if (user.limit !== undefined) {
        const row = this.field('app_users').locator('.o_data_row').filter({ has: this.page.locator(`td[name="user_email"]:has-text("${user.email}"), td[name="user_email"] input`) }).last();
        await row.locator('td[name="credit_limit"]').click();
        const input = row.locator('td[name="credit_limit"] input').first();
        if (await input.isEditable({ timeout: 2_000 }).catch(() => false)) {
          await input.fill(String(user.limit));
          await input.press('Tab');
          await this.waitReady();
          picked.userLimit = user.limit;
        } else picked.userLimitReadOnly = true;
      }
    }
    const dirty = await this.page.locator('.o_form_view.o_form_dirty, .o_form_status_indicator .o_form_button_save:visible').count();
    const url = dirty || !existing ? await this.save() : this.currentUrl();
    // Every entered value saved.
    expect.soft(await this.read('nick_name'), 'nick name').toBe(name);
    expect.soft(await this.read('deduction_type'), 'deduction type').toBe(deductionType);
    expect.soft(parseFloat((await this.read('spending_limit')).replace(/[^0-9.-]/g, '')), 'spending limit').toBe(limit);
    await expect.soft(this.field('micro_market_ids'), 'micro market').toContainText(market);
    if (picked.dateConfig) expect.soft(await this.read('date_configuration'), 'date configuration').toContain(picked.dateConfig);
    if (rollover !== undefined && (await this.field('rollover_payroll').count())) expect.soft(await this.field('rollover_payroll').locator('input').first().isChecked(), 'rollover payroll').toBe(rollover);
    if (user) {
      // A row still in edit mode shows its values in inputs: read text or input value.
      const cell = async (row, f) => ((await row.locator(`td[name="${f}"]`).innerText()).trim() || (await row.locator(`td[name="${f}"] input`).first().inputValue().catch(() => '')));
      const rows = this.field('app_users').locator('.o_data_row');
      const idx = (await rows.evaluateAll((rs) => rs.map((r) => r.innerText + ' ' + [...r.querySelectorAll('input')].map((i) => i.value).join(' ')))).findIndex((t) => t.includes(user.email));
      expect.soft(idx, `app user ${user.email}`).toBeGreaterThanOrEqual(0);
      if (idx >= 0) {
        const row = rows.nth(idx);
        if (picked.userLimit !== undefined) expect.soft(await cell(row, 'credit_limit'), 'app user limit').toContain(String(picked.userLimit));
        if (user.employeeId) expect.soft(await cell(row, 'employee_id'), 'app user employee id').toContain(user.employeeId);
      }
    }
    return url;
  }

}

module.exports = { EmployeePage, EquipmentPage, ServicePage, CrmPage, SurveyPage, EventsPage, MicroMarketPage };
