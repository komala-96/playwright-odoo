const { expect } = require('@playwright/test');
const { appears } = require('../utils/wait');
const { OdooPage } = require('./OdooPage');

const F = {
  name: 'name',
  code: 'code',
  parent: 'parent_partner_id',
  orderType: 'order_type_id',
  accountManager: 'kam',
  zip: 'zip',
  street: 'street',
  email: 'email',
  products: 'product_ids',
  fuel: 'fuel_charge',
  hazard: 'hazard_fee',
  subsidy: 'subsidy',
};

const ACCOUNTS = { receivable: '121000', payable: '211000' };

const TAX_FIELDS = { 'Fuel Charge': F.fuel, 'Hazard Fee': F.hazard, Subsidy: F.subsidy };

class CustomerCarePage extends OdooPage {
  async open() {
    await this.openApp('Customer Care');
  }

  /** Parent customer with every editable field (see testData.parentCustomer). Returns { url, picked }. */
  async createParentCustomer(c, { accountManager, route } = {}) {
    await this.open();
    await this.openMenu('Configuration', 'Parent');
    await this.clickNew();
    await this.fill({ [F.name]: c.name, [F.email]: c.email });
    await this.fill({ [F.zip]: c.zip });
    await this.fill({ [F.street]: c.street });
    const picked = {};
    if (c.image) {
      await this.field('image_1920').locator('input[type="file"]').setInputFiles(c.image);
      await expect(this.field('image_1920').locator('img')).not.toHaveAttribute('src', /placeholder/);
    }
    if (accountManager) await this.fill({ kam: accountManager });
    if (route) await this.fill({ route_id: route });
    for (const [f, v] of Object.entries(c.details || {})) {
      await this.fill({ [f]: v });
      await this.page.keyboard.press('Escape').catch(() => {});
    }
    if (c.contact) await this.addContact(c.contact);
    if (c.notes) {
      await this.openTab('Notes');
      await this.fill(c.notes);
    }
    await this.setAccounts();
    for (const [f, code] of Object.entries(c.accounts || {})) picked[f] = await this.pickAccount(f, code);
    const url = await this.save();
    return { url, picked };
  }

  /** Parent is listed under Customer Care > Configuration > Parent. */
  async expectParentListed(name) {
    await this.open();
    await this.openMenu('Configuration', 'Parent');
    await this.expectInList(name);
  }

  /** Order Products tab > Add Products: one product (by code), then save the customer. */
  async addOrderProduct({ code }) {
    await this.addProducts([code]);
    await expect(this.productLine(code)).toBeVisible();
    await this.save();
  }

  /**
   * Preventive Cases tab > Add: case dialog (customer defaults to this record). Returns the labels picked.
   * pc: field values; assignee (if offered) / route: names; Category, Type and Case Origin take the first option offered.
   */
  async addPreventiveCase(pc, { customer, assignee, route } = {}) {
    await this.openTab('Preventive Cases');
    const before = await this.caseCards().count();
    await this.field('case_ids').locator('button, a').filter({ hasText: /^\s*Add/ }).first().click();
    const dlg = this.caseDialog();
    await dlg.waitFor();
    const picked = {};
    if (customer && !(await this.read('partner_id', dlg)).includes(customer)) await this.fill({ partner_id: customer }, dlg);
    // Assigned To only lists technicians: our employee when offered, else the first technician.
    picked.employee_ids = await this.pickPreferredOption('employee_ids', assignee, dlg);
    for (const f of ['category_id', 'type_id', 'channel_id']) picked[f] = await this.pickFirstOption(f, dlg);
    if (route) await this.fill({ route_id: route }, dlg);
    await this.fill({ is_preventive: true }, dlg);
    await this.field('priority', dlg).locator('.o_priority_star').nth(1).click(); // two stars
    await this.fill(pc, dlg);
    await dlg.locator('.modal-footer button').filter({ hasText: /^Save & Close$/ }).click();
    await dlg.waitFor({ state: 'hidden' });
    await expect(this.caseCards()).toHaveCount(before + 1);
    await this.save();
    return picked;
  }

  /** Preventive Cases tab cards (kanban) / rows. */
  caseCards() {
    return this.field('case_ids').locator('.o_kanban_record:not(.o_kanban_ghost), .o_data_row');
  }

  caseDialog() {
    return this.dialogs().filter({ has: this.page.locator('.o_field_widget[name="case_description"]') }).last();
  }

  /** Opens the Preventive Cases card whose description matches; returns the dialog's values, then closes it. */
  async readPreventiveCase(description) {
    await this.openTab('Preventive Cases');
    const n = await this.caseCards().count();
    for (let k = 0; k < n; k++) {
      await this.caseCards().nth(k).click();
      const dlg = this.caseDialog();
      await dlg.waitFor();
      const values = {};
      for (const f of ['partner_id', 'employee_ids', 'category_id', 'type_id', 'channel_id', 'route_id', 'case_description', 'internal_comment', 'reported_by', 'reported_phone', 'reported_email']) {
        values[f] = await this.read(f, dlg).catch(async () => (await this.field(f, dlg).innerText()).trim());
      }
      values.is_preventive = await this.field('is_preventive', dlg).locator('input[type="checkbox"]').isChecked();
      await dlg.locator('.modal-footer button').filter({ hasText: /^(Close|Discard|Cancel)$/ }).first().click().catch(() => this.page.keyboard.press('Escape'));
      await dlg.waitFor({ state: 'hidden' });
      if (values.case_description === description) return values;
    }
    return null;
  }

  /** Account dropdown (AveriGo "Select options"): the preferred code if offered, else the first account listed. */
  async pickAccount(name, code) {
    const field = this.field(name);
    await field.locator('.o_av_cdd_trigger').click();
    const items = field.locator('.o_av_cdd_panel .o_av_cdd_list li');
    await items.first().waitFor();
    const preferred = code ? items.filter({ hasText: new RegExp(`^\\s*${code}\\b`) }).first() : null;
    const item = preferred && (await preferred.count()) ? preferred : items.first();
    const label = (await item.innerText()).trim();
    await item.click();
    if (await field.locator('.o_av_cdd_panel').isVisible().catch(() => false)) await field.locator('.o_av_cdd_trigger').click();
    await this.waitReady();
    await expect(field.locator('.o_av_cdd_tags')).toContainText(label);
    return label;
  }

  /** "Are you sure to change the Address Type?" -> Ok (shown when the contact's address type changes). */
  async confirmAddressType(wait = 3_000) {
    const confirm = this.page.locator('.modal:visible').filter({ hasText: /change the Address Type/i }).last();
    if (await appears(confirm, wait)) {
      await confirm.locator('.modal-footer button').filter({ hasText: /^Ok$/i }).click();
      await confirm.waitFor({ state: 'hidden' });
    }
  }

  /** Contacts & Addresses tab > Add: contact dialog (type, name, address, email, phones, note). */
  async addContact(contact) {
    await this.openTab('Contacts & Addresses');
    await this.field('child_ids_contacts').locator('button, a').filter({ hasText: /^\s*Add/ }).first().click();
    const dlg = this.dialogs().filter({ has: this.page.locator('.o_field_widget[name="type_address"]') }).last();
    await dlg.locator('.o_field_widget[name="name"]').waitFor();
    const { type, image, tickAll, ...values } = contact;
    if (type) {
      // Address type radio (Contact / Billing / Delivery / Other / Private / Payee / Remit To); the form re-renders.
      await dlg.locator('.o_field_widget[name="type_address"] .form-check').filter({ hasText: new RegExp(`^\\s*${type}\\s*$`) }).locator('input').check({ force: true });
      await this.confirmAddressType();
      await this.waitReady();
    }
    // Each type shows its own fields (e.g. "Contact" has no address): fill the ones this type shows,
    // ZIP before Street (City/State/County come from the ZIP).
    const order = ['name', 'zip', 'street', ...Object.keys(values).filter((k) => !['name', 'zip', 'street'].includes(k))];
    for (const f of order) {
      if (values[f] === undefined) continue;
      if (await dlg.locator(`.o_field_widget[name="${f}"]`).first().isVisible().catch(() => false)) await this.fill({ [f]: values[f] }, dlg);
    }
    if (image) {
      const file = dlg.locator('.o_field_widget[name="image_1920"] input[type="file"]');
      if (await file.count()) await file.setInputFiles(image);
      await this.waitReady();
    }
    if (tickAll) {
      // Tick every checkbox this type shows (e.g. Primary Contact).
      const names = await dlg.locator('.o_field_boolean[name], .o_field_check_box[name]').evaluateAll((els) => els.filter((e) => e.offsetParent).map((e) => e.getAttribute('name')));
      for (const n of names) await this.setBoolean(n, true, dlg);
    }
    await this.confirmAddressType(500); // in case it popped up late
    await dlg.locator('.modal-footer button').filter({ hasText: /^Save( & Close)?$/ }).first().click();
    await dlg.waitFor({ state: 'hidden' });
    await expect(this.field('child_ids_contacts')).toContainText(contact.name);
  }

  async expectParentCustomer(url, c, { accountManager, route } = {}, picked = {}) {
    await this.goto(url);
    expect(await this.read(F.name)).toBe(c.name);
    expect.soft(await this.read(F.email), 'email').toBe(c.email);
    expect.soft(await this.read(F.zip), 'zip').toBe(c.zip);
    expect.soft(await this.read(F.street), 'street').toBe(c.street);
    expect.soft(await this.read('city'), 'city from zip').toBe('San Francisco');
    await expect.soft(this.field('image_1920').locator('img'), 'image').not.toHaveAttribute('src', /placeholder/);
    if (accountManager) expect.soft(await this.read('kam'), 'accounts manager').toContain(accountManager);
    if (route) expect.soft(await this.read('route_id'), 'route').toContain(route);
    const money = (v) => parseFloat(String(v).replace(/[^0-9.-]/g, ''));
    for (const [f, v] of Object.entries(c.details || {})) {
      const shown = (await this.field(f).locator('.o_tag, .badge').count()) ? await this.field(f).innerText() : await this.read(f);
      if (typeof v === 'number') expect.soft(money(shown), f).toBe(v);
      else if (/phone|mobile/.test(f)) expect.soft(shown.replace(/\D/g, ''), f).toMatch(new RegExp(`${v}$`)); // shown as +1 415-555-0111
      else expect.soft(shown, f).toContain(v);
    }
    for (const f of ['fuel_charge', 'hazard_fee', 'subsidy', 'master_invoice', 'monthly_statement', 'po_check']) {
      expect.soft(await this.field(f).locator('input[type="checkbox"]').first().isChecked(), `${f} left off`).toBe(false);
    }
    if (c.contact) {
      await this.openTab('Contacts & Addresses');
      await expect.soft(this.field('child_ids_contacts'), 'contact').toContainText(c.contact.name);
    }
    if (c.notes) {
      await this.openTab('Notes');
      for (const [f, v] of Object.entries(c.notes)) expect.soft(await this.read(f), f).toBe(v);
    }
    await this.openTab('Account Setup');
    expect.soft(await this.read('property_account_receivable_id'), 'receivable').toMatch(/^121000/);
    for (const f of Object.keys(c.accounts || {})) {
      if (picked[f]) expect.soft(await this.read(f), f).toContain(picked[f]);
      else expect.soft(await this.read(f), f).toMatch(/^\d{6}/);
    }
  }

  /**
   * Account Setup tab: Receivable Account is required but has no default on
   * this instance, and AveriGo blocks Save silently when it is empty.
   */
  async setAccounts() {
    await this.openTab('Account Setup');
    await this.fill({ property_account_receivable_id: ACCOUNTS.receivable });
    if (await this.field('property_account_payable_id').isVisible().catch(() => false)) {
      await this.fill({ property_account_payable_id: ACCOUNTS.payable });
    }
  }

  async createOrderType({ name }) {
    await this.open();
    await this.openMenu('Configuration', 'Order Types');
    await this.clickNew();
    await this.fill({ [F.name]: name });
    return this.save();
  }

  async openNewCustomer() {
    await this.open();
    await this.openMenu('Customer');
    await this.clickNew();
  }

  /**
   * Customer form. Products/catalogues can only be added to a saved customer,
   * so the header (+ required Receivable Account) is saved first.
   * @param c customer data
   * @param o { parent, orderType, product1, uoms[], catalogue, accountManager }
   */
  /**
   * Customer Care > Customer > New. Optional extras on `c` (TC-022 fills every visible field):
   * image, details, contact, notes, preventiveCase. o: parent, accountManager, route, product1/uoms/orderType,
   * catalogue, assignee (preventive case). Resumes a customer left by a failed attempt instead of duplicating it.
   */
  async createCustomer(c, o = {}) {
    await this.open();
    await this.openMenu('Customer');
    const existing = await this.openExistingOrNew(c.name);
    if (!existing) await this.fill({ [F.name]: c.name });
    await this.fill({ [F.code]: c.code, [F.email]: c.email });
    if (o.parent) await this.fill({ [F.parent]: o.parent });
    if (o.accountManager) await this.fill({ [F.accountManager]: o.accountManager });
    await this.fill({ [F.zip]: c.zip });
    await this.fill({ [F.street]: c.street });
    await this.fill(Object.fromEntries(Object.entries(TAX_FIELDS).map(([label, field]) => [field, c.taxes.includes(label)])));
    if (c.image) {
      await this.field('image_1920').locator('input[type="file"]').setInputFiles(c.image);
      await expect(this.field('image_1920').locator('img')).not.toHaveAttribute('src', /placeholder/);
    }
    if (o.route) await this.fill({ route_id: o.route });
    for (const [f, v] of Object.entries(c.details || {})) {
      await this.fill({ [f]: v });
      await this.page.keyboard.press('Escape').catch(() => {});
    }
    for (const contact of [c.contact, ...(c.contacts || [])].filter(Boolean)) {
      await this.openTab('Contacts & Addresses');
      if (!(await this.field('child_ids_contacts').innerText()).includes(contact.name)) await this.addContact(contact);
    }
    if (c.notes) {
      await this.openTab('Notes');
      await this.fill(c.notes);
    }
    await this.setAccounts();
    const url = await this.save();

    if (o.product1) {
      // AveriGo keeps one line per product; its UoM list offers every UoM defined on the product.
      await this.openTab('Order Products');
      if (!(await this.productLine(o.product1).count())) await this.addProducts([o.product1]);
      await this.setProductLine(o.product1, 0, { uom_id: o.uoms?.[0], order_type: o.orderType });
    }
    if (o.catalogue) {
      await this.addCatalogue(o.catalogue, { ifOffered: true });
      // The catalogue only stages its products in the "Catalog" table: Add All + "Add Catalog Products"
      // moves them into the customer's Order Products.
      await this.moveCatalogProducts(o.catalogueCodes || []);
    }
    await this.save();
    if (c.preventiveCase && !(await this.readPreventiveCase(c.preventiveCase.case_description))) {
      this.lastCaseOptions = await this.addPreventiveCase(c.preventiveCase, { customer: c.name, assignee: o.assignee, route: o.route });
    }
    return url;
  }

  /**
   * Opens a saved customer and changes every field to the values in `e` (see testData.customer3.edit):
   * name, code, email, address, tax flags, image, parent, accounts manager, route, details, extra contacts, notes. Saves.
   */
  async editCustomer(url, e, o = {}) {
    try {
      return await this.editCustomerFields(url, e, o);
    } catch (err) {
      // Never leave a half-edited customer behind: Odoo autosaves a dirty form when the page closes.
      await this.page.keyboard.press('Escape').catch(() => {});
      await this.discard().catch(() => {});
      throw err;
    }
  }

  /** { fieldName: checked } for every checkbox field on the open customer form (main sheet and all tabs). */
  async checkboxStates() {
    const out = {};
    const read = async () => Object.assign(out, await this.page.evaluate(() => Object.fromEntries(
      [...document.querySelectorAll('.o_form_view .o_field_widget[name]')]
        .filter((e) => !e.closest('.o_data_row') && e.querySelector('input[type="checkbox"]'))
        .map((e) => [e.getAttribute('name'), e.querySelector('input[type="checkbox"]').checked]))));
    await read();
    for (const tab of await this.page.locator('.o_form_view .o_notebook .nav-link').all()) {
      await tab.click().catch(() => {});
      await this.page.waitForTimeout(300);
      await read();
    }
    return out;
  }

  /** Fills a field unless it is read-only on the saved record (returns false when skipped). */
  async fillIfEditable(name, value) {
    const f = this.field(name);
    if (!(await f.isVisible().catch(() => false))) return false;
    const ro = await f.evaluate((el) => el.classList.contains('o_readonly_modifier')).catch(() => false);
    if (ro) return false;
    await this.fill({ [name]: value });
    return true;
  }

  async editCustomerFields(url, e, o = {}) {
    this.skippedReadOnly = [];
    await this.goto(url);
    await this.field(F.name).waitFor();
    await this.fill({ [F.name]: e.name, [F.code]: e.code, [F.email]: e.email });
    if (o.parent) await this.fill({ [F.parent]: o.parent });
    if (o.accountManager) await this.fill({ [F.accountManager]: o.accountManager });
    await this.fill({ [F.zip]: e.zip });
    await this.fill({ [F.street]: e.street });
    // Checkboxes (incl. the Fuel Charge / Hazard Fee / Subsidy flags) are never changed while editing a customer.
    if (e.image) {
      await this.field('image_1920').locator('input[type="file"]').setInputFiles(e.image);
      await this.waitReady();
    }
    if (o.route) await this.fill({ route_id: o.route });
    for (const [f, v] of Object.entries(e.details || {})) {
      if (typeof v === 'boolean') continue;
      await this.fill({ [f]: v });
      await this.page.keyboard.press('Escape').catch(() => {});
    }
    for (const contact of e.contacts || []) {
      await this.openTab('Contacts & Addresses');
      if (!(await this.field('child_ids_contacts').innerText()).includes(contact.name)) await this.addContact(contact);
    }
    // Existing contacts edited in place: { contactName: { zip, street, ... } }.
    for (const [name, values] of Object.entries(o.editContacts || {})) await this.editContact(name, values);
    if (e.notes) {
      await this.openTab('Notes');
      for (const [f, v] of Object.entries(e.notes)) if (!(await this.fillIfEditable(f, v))) this.skippedReadOnly.push(f);
    }
    return this.save();
  }

  /** Contacts & Addresses: opens a contact by name, changes the given fields (ZIP before Street) and saves the dialog. */
  async editContact(name, values) {
    await this.openTab('Contacts & Addresses');
    await this.field('child_ids_contacts').locator('.o_kanban_record, .o_data_row').filter({ hasText: name }).first().click();
    const dlg = this.dialogs().filter({ has: this.page.locator('.o_field_widget[name="type_address"]') }).last();
    await dlg.locator('.o_field_widget[name="name"]').waitFor();
    const order = ['zip', 'street', ...Object.keys(values).filter((k) => !['zip', 'street'].includes(k))];
    for (const f of order) {
      if (values[f] === undefined) continue;
      if (await dlg.locator(`.o_field_widget[name="${f}"]`).first().isVisible().catch(() => false)) await this.fill({ [f]: values[f] }, dlg);
    }
    await this.confirmAddressType(500);
    await dlg.locator('.modal-footer button').filter({ hasText: /^Save( & Close)?$/ }).first().click();
    await dlg.waitFor({ state: 'hidden' });
  }

  /** Contacts & Addresses: opens a contact by name and returns its address fields (read from its dialog). */
  async readContact(name) {
    await this.openTab('Contacts & Addresses');
    await this.field('child_ids_contacts').locator('.o_kanban_record, .o_data_row').filter({ hasText: name }).first().click();
    const dlg = this.dialogs().filter({ has: this.page.locator('.o_field_widget[name="type_address"]') }).last();
    await dlg.locator('.o_field_widget[name="name"]').waitFor();
    const out = {};
    for (const f of ['name', 'zip', 'street', 'street2', 'city', 'state_id', 'email']) {
      if (await dlg.locator(`.o_field_widget[name="${f}"]`).first().isVisible().catch(() => false)) out[f] = (await this.read(f, dlg)).trim();
    }
    out.type = (await dlg.locator('.o_field_widget[name="type_address"] input:checked').first().evaluate((i) => i.closest('.form-check')?.innerText.trim()).catch(() => ''));
    await dlg.locator('.modal-footer button').filter({ hasText: /Discard|Close/ }).first().click().catch(() => this.page.keyboard.press('Escape'));
    await dlg.waitFor({ state: 'hidden' }).catch(() => {});
    return out;
  }

  /** Checks the optional extras createCustomer / createParentCustomer fill (on the open partner form). */
  async expectPartnerExtras(c, { route, caseOptions, checkboxesUnchanged } = {}) {
    if (c.image) await expect.soft(this.field('image_1920').locator('img'), 'image').not.toHaveAttribute('src', /placeholder/);
    if (route) expect.soft(await this.read('route_id'), 'route').toContain(route);
    expect.soft(await this.read('city'), 'city from zip').toBe('San Francisco');
    const money = (v) => parseFloat(String(v).replace(/[^0-9.-]/g, ''));
    for (const [f, v] of Object.entries(c.details || {})) {
      if (typeof v === 'boolean') {
        expect.soft(await this.field(f).locator('input[type="checkbox"]').first().isChecked(), `${f} ticked`).toBe(v);
        continue;
      }
      const shown = (await this.field(f).locator('.o_tag, .badge').count()) ? await this.field(f).innerText() : await this.read(f);
      if (typeof v === 'number') expect.soft(money(shown), f).toBe(v);
      else if (/phone|mobile/.test(f)) expect.soft(shown.replace(/\D/g, ''), f).toMatch(new RegExp(`${v}$`)); // shown as +1 415-555-0111
      else expect.soft(shown, f).toContain(v);
    }
    // (Skipped for an edit that leaves checkboxes as they were; the caller compares them before/after.)
    if (!checkboxesUnchanged) {
      for (const f of ['master_invoice', 'monthly_statement', 'po_check']) {
        if (!(f in (c.details || {}))) expect.soft(await this.field(f).locator('input[type="checkbox"]').first().isChecked(), `${f} left off`).toBe(false);
      }
    }
    const contacts = [c.contact, ...(c.contacts || [])].filter(Boolean);
    if (contacts.length) {
      await this.openTab('Contacts & Addresses');
      for (const ct of contacts) await expect.soft(this.field('child_ids_contacts'), `${ct.type || 'contact'} address`).toContainText(ct.name);
    }
    if (c.notes) {
      await this.openTab('Notes');
      for (const [f, v] of Object.entries(c.notes)) expect.soft(await this.read(f), f).toBe(v);
    }
    await this.openTab('Account Setup');
    expect.soft(await this.read('property_account_receivable_id'), 'receivable').toMatch(/^121000/);
    for (const f of c.defaultAccounts || []) expect.soft(await this.read(f), `${f} (instance default)`).toMatch(/^\d{6}/);
    if (c.preventiveCase) {
      const pc = await this.readPreventiveCase(c.preventiveCase.case_description);
      expect.soft(pc, 'preventive case saved').not.toBeNull();
      if (pc) {
        expect.soft(pc.partner_id, 'case customer').toContain(c.name);
        expect.soft(pc.is_preventive, 'case Preventive ticked').toBe(true);
        if (route) expect.soft(pc.route_id, 'case route').toContain(route);
        for (const [f, v] of Object.entries(caseOptions || {})) expect.soft(pc[f], `case ${f}`).toContain(v);
        for (const [f, v] of Object.entries(c.preventiveCase)) {
          if (f === 'reported_phone') expect.soft(pc[f].replace(/\D/g, ''), `case ${f}`).toMatch(new RegExp(`${v}$`));
          else expect.soft(pc[f], `case ${f}`).toBe(v);
        }
      }
    }
  }

  /** Adds products to the customer's Order Products when missing (invoice/order pickers only offer these). */
  async ensureCustomerProducts(customerName, products) {
    await this.openCustomer(customerName);
    await this.openTab('Order Products');
    const missing = [];
    for (const p of products) if (!(await this.productLine(p.code).isVisible().catch(() => false))) missing.push(p);
    if (!missing.length) return;
    await this.addProducts(missing.map((p) => p.code));
    for (const p of missing) await expect(this.productLine(p.code)).toBeVisible();
    await this.save();
  }

  /** Edits a customer's product line (Order Products tab) and saves. */
  async updateProductLine(customerName, code, values) {
    await this.openCustomer(customerName);
    await this.openTab('Order Products');
    await this.setProductLine(code, 0, values);
    return this.save();
  }

  async readProductLine(code, name) {
    return (await this.productLine(code).locator(`td[name="${name}"]`).innerText()).trim();
  }

  async setProductLine(code, nth, values) {
    const row = this.productLine(code, nth);
    await row.waitFor();
    for (const [name, value] of Object.entries(values)) {
      if (value === undefined) continue;
      await row.locator(`td[name="${name}"]`).click();
      await this.fill({ [name]: value }, row);
    }
  }

  /** Any row on the Order Products tab (Catalog table or Customer Products) for a product code. */
  orderProductRow(code) {
    return this.page.locator('.o_form_view .o_notebook .tab-pane.active .o_data_row').filter({ hasText: code }).first();
  }

  /** UoMs offered in a customer product line's UoM dropdown (current value + list). */
  async lineUomOptions(code) {
    const row = this.productLine(code);
    await row.locator('td[name="uom_id"]').click();
    const f = row.locator('.o_field_widget[name="uom_id"]');
    if (!(await f.locator('.o_av_cdd_panel').isVisible().catch(() => false))) await f.locator('.o_av_cdd_trigger').click();
    await f.locator('.o_av_cdd_list li').first().waitFor({ timeout: 10_000 }).catch(() => {});
    const options = [(await f.locator('.o_av_cdd_tags').innerText()).trim(), ...(await f.locator('.o_av_cdd_list li').allInnerTexts())];
    await f.locator('.o_av_cdd_trigger').click();
    return options;
  }

  async expectCustomer(url, c, { products = [], uoms = [], orderType, accountManager, parent, extras }) {
    await this.goto(url);
    expect(await this.read(F.name)).toContain(c.name);
    for (const [label, field] of Object.entries(TAX_FIELDS)) {
      expect(await this.read(field), `${label} on ${c.name}`).toBe(c.taxes.includes(label));
    }
    if (accountManager) expect(await this.read(F.accountManager)).toContain(accountManager);
    if (parent) expect.soft(await this.read(F.parent), 'parent').toContain(parent);
    if (products.length || uoms.length) await this.openTab('Order Products');
    // Every product (incl. catalogue products, once moved with "Add Catalog Products") is a customer product line.
    for (const p of products) await expect(this.productLine(p), `${p} in Order Products`).toBeVisible();
    const lines = this.field('customer_product_ids');
    if (uoms.length) {
      const options = await this.lineUomOptions(products[0]);
      for (const u of uoms) expect(options.join(' | '), `UoM ${u} available on ${products[0]}`).toContain(u);
    }
    if (orderType) await expect(this.productLine(products[0])).toContainText(orderType);
    if (extras) await this.expectPartnerExtras(c, extras);
  }

  /** Order Products tab: Catalog table -> Add All -> "Add Catalog Products" (button add_product_catalog). */
  async moveCatalogProducts(codes) {
    await this.openTab('Order Products');
    const missing = [];
    for (const c of codes) if (!(await this.productLine(c).count())) missing.push(c);
    if (codes.length && !missing.length) return;
    if (!(await this.field('catalog_product_ids').locator('.o_data_row').count())) return;
    await this.setBoolean('select_catalog_products', true);
    await this.click('add_product_catalog');
    await this.waitReady();
    for (const c of missing) await expect(this.productLine(c), `${c} added to Order Products`).toBeVisible();
    await this.save();
  }

  /** Order Products tab -> "Add Catalog Products" dialog -> tick catalogue -> Select. */
  async addCatalogue(catalogue, { ifOffered = false } = {}) {
    await this.openTab('Order Products');
    await this.field('catalog_ids').locator('button').click();
    if (!ifOffered) return this.selectInDialog([catalogue]);
    // A catalogue already on the customer is no longer offered ("No record found"): close and move on.
    try {
      await this.selectInDialog([catalogue]);
    } catch (e) {
      const dlg = this.dialogs().filter({ hasText: 'Add Catalog Products' }).last();
      if (!(await dlg.getByText('No record found').isVisible().catch(() => false))) throw e;
      await dlg.locator('.modal-footer button').filter({ hasText: /^Close$/ }).click();
      await dlg.waitFor({ state: 'hidden' });
    }
  }

  /** Order Products tab -> "Add Products" dialog -> tick products -> Select. */
  async addProducts(codes) {
    await this.openTab('Order Products');
    await this.field('product_ids').locator('button').click();
    await this.selectInDialog(codes);
  }

  /** Customer product line (Order Products tab) for a product code; nth when the product is listed more than once. */
  productLine(code, nth = 0) {
    return this.field('customer_product_ids').locator('.o_data_row').filter({ hasText: code }).nth(nth);
  }




  async openCustomer(name) {
    await this.open();
    await this.openMenu('Customer');
    await this.openRecord(name);
  }

  /** Customer balance shown on the customer form (AR balance). */
  async balance(name) {
    await this.openCustomer(name);
    for (const f of ['customer_balance', 'total_due', 'credit', 'invoice_balance']) {
      if (!(await this.field(f).isVisible().catch(() => false))) continue;
      // The balance renders a moment after the form: wait until it shows a value that has settled.
      let last = null;
      await expect.poll(async () => {
        const text = (await this.field(f).innerText().catch(() => '')).trim();
        const settled = text !== '' && text === last;
        last = text;
        return settled;
      }, { timeout: 20_000, intervals: [500, 1000] }).toBe(true);
      return this.readMoney(f);
    }
    throw new Error(`No balance field visible on customer ${name}`);
  }

  async advanceBalance(name) {
    await this.openCustomer(name);
    return this.readMoney('cust_advance_balance');
  }
}

module.exports = { CustomerCarePage, F };
