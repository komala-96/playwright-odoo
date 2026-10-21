const { expect } = require('@playwright/test');
const { appears } = require('../utils/wait');
const { OdooPage } = require('./OdooPage');
const escapeRe = (t) => String(t).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

// Technical field names. Custom AveriGo fields taken from the existing
// e2eFlow page objects (tax_status, container_deposit_view, upc_code_id, ...).
const F = {
  name: 'name',
  code: 'default_code',
  category: 'categ_id',
  uom: 'uom_id',
  route: 'route_id',
  upc: 'upc_code_id',
  tax: 'tax_status',
  deposit: 'is_container_tax',
  bin: 'bin_location',
  type: 'type',
  cost: 'standard_price',
  price: 'list_price',
  onHand: 'qty_available',
  warehouse: 'warehouse_id',
  uomRatio: 'factor_inv',
  uomReference: 'uom_type',
};

// Product form: which notebook tab each optional field lives on (header fields are always visible).
const PRODUCT_FIELD_TABS = {
  list_price_2: 'Sales & Purchase', list_price_3: 'Sales & Purchase', sale_acc: 'Sales & Purchase', description_sale: 'Sales & Purchase',
  res_partner: 'Sales & Purchase', cogs_acc: 'Sales & Purchase', description_purchase: 'Sales & Purchase',
  is_sugar_tax: 'TAX', fluid_ounce: 'TAX', litre_type: 'TAX',
  volume: 'Logistics', manufacturer: 'Logistics', weight: 'Logistics', mnp_id: 'Logistics',
  inventory_acc: 'Warehouse Inventory', min_qty: 'Warehouse Inventory', max_qty: 'Warehouse Inventory', legacy: 'Warehouse Inventory',
  reorder_point: 'Micromarket Defaults', reorder_qty: 'Micromarket Defaults',
};

class InventoryPage extends OdooPage {
  async open() {
    await this.openApp('Inventory');
  }

  // ---------- TC-002..TC-007 configuration

  /** Product category with every non-toggle field; with only a name for e.g. the parent. */
  async createProductCategory(c) {
    await this.open();
    await this.openMenu('Configuration', 'Product Categories');
    await this.clickNew();
    await this.fill({ [F.name]: c.name });
    if (c.image) {
      await this.field('category_image_1920').locator('input[type="file"]').setInputFiles(c.image);
      await expect(this.field('category_image_1920').locator('img')).not.toHaveAttribute('src', /placeholder/);
    }
    await this.fill({ parent_id: c.parent, internal_reference: c.sapNo, category_desc: c.description });
    await this.fill({ property_cost_method: c.costMethod, property_valuation: c.valuation });
    await this.fill({ route_ids: c.route, removal_strategy_id: c.removalStrategy });
    if (c.accounts) for (const [f, code] of Object.entries(c.accounts)) await this.fill({ [f]: code });
    await this.fill({ property_stock_journal: c.journal });
    if (c.route) await expect(this.field('route_ids'), 'route chosen before save').toContainText(c.route);
    return this.save();
  }

  async expectProductCategory(url, c) {
    await this.goto(url);
    expect.soft(await this.read(F.name), 'name').toBe(c.name);
    await expect.soft(this.field('category_image_1920').locator('img'), 'image').not.toHaveAttribute('src', /placeholder/);
    expect.soft(await this.read('parent_id'), 'parent').toContain(c.parent);
    expect.soft(await this.read('internal_reference'), 'SAP Category No').toBe(c.sapNo);
    expect.soft(await this.read('category_desc'), 'description').toBe(c.description);
    expect.soft(await this.read('property_cost_method'), 'costing method').toBe(c.costMethod);
    expect.soft(await this.read('property_valuation'), 'valuation').toBe(c.valuation);
    await expect.soft(this.field('route_ids'), 'routes').toContainText(c.route);
    expect.soft(await this.read('removal_strategy_id'), 'removal strategy').toContain(c.removalStrategy);
    for (const [f, code] of Object.entries(c.accounts)) expect.soft(await this.read(f), f).toMatch(new RegExp(`^${code}\\b`));
    expect.soft(await this.read('property_stock_journal'), 'stock journal').toContain(c.journal);
    for (const t of ['exclude_from_sale', 'available_outside', 'enable_front_desk', 'beer_and_wine', 'customer_category']) {
      expect.soft(await this.field(t).locator('input[type="checkbox"]').isChecked(), `${t} toggle left off`).toBe(false);
    }
  }

  /** AveriGo UoM Types is an editable list of names (Case, Box, Each, ...); conversion is set per product/customer. */
  async createUomType({ name }) {
    await this.open();
    await this.openMenu('Configuration', 'UoM Types');
    // Re-run of the same data set: the name is unique, so reuse the type created earlier.
    await this.search(name);
    // waitFor (not isVisible, which doesn't wait): also lets the search reload finish, else it drops the new row.
    if (await this.rows(name).first().waitFor({ timeout: 5_000 }).then(() => true, () => false)) return null;
    await this.clickNew();
    await this.fill({ [F.name]: name });
    return this.save();
  }

  async createRoute({ name, description, truck }) {
    await this.open();
    await this.openMenu('Configuration', 'Route');
    await this.clickNew();
    await this.fill({ [F.name]: name, desc: description, truck_id: truck });
    return this.save();
  }

  /** Inventory > Locations is one form for Micromarket/Pantry/Truck/Warehouse/Branch, chosen by Location Type. */
  /**
   * Inventory > Locations is one form for Micromarket/Pantry/Truck/Warehouse/Branch, chosen by Location Type.
   * o.details: extra fields by name (text/date/dropdowns), o.image, o.route, o.driver.
   */
  async createLocation({ name, type, street, zip }, saveOptions, o = {}) {
    await this.open();
    await this.openMenu('Locations');
    // Resume: complete a location left by a failed attempt instead of duplicating it.
    const existing = await this.openExistingOrNew(name);
    if (!existing) {
      await this.fill({ location_type: type });
      await this.fill({ name });
    }
    await this.fill({ zip });
    await this.fill({ street });
    if (o.image) {
      await this.field('image').locator('input[type="file"]').setInputFiles(o.image);
      await expect(this.field('image').locator('img')).not.toHaveAttribute('src', /placeholder/);
    }
    // Dropdowns first (an open panel can cover the next one), each closed before moving on.
    if (o.route) await this.fill({ route: o.route });
    if (o.driver) await this.fill({ truck_driver: o.driver });
    const { internal_notes, special_notes, ...general } = o.details || {};
    for (const [f, v] of Object.entries(general)) {
      await this.fill({ [f]: v });
      await this.page.keyboard.press('Escape').catch(() => {});
    }
    // Next Scheduled Date is calculated from Frequency + Frequency Start Date.
    if (general.frequency) await expect.poll(() => this.read('frequency_date')).not.toBe('');
    if (internal_notes || special_notes) {
      await this.openTab('Notes');
      // Switching tab can start a (slow, for warehouses) save; typing during it is lost, so wait it out.
      await this.waitReady(saveOptions?.timeout);
      await this.fill({ internal_notes, special_notes });
      await expect(this.field('internal_notes').locator('textarea')).toHaveValue(internal_notes);
      await expect(this.field('special_notes').locator('textarea')).toHaveValue(special_notes);
    }
    return this.save(saveOptions);
  }

  /** Re-opens a location and checks every field entered by createLocation. */
  async expectLocation(url, { name, type, street, zip }, o = {}) {
    await this.goto(url);
    expect(await this.read('name')).toBe(name);
    expect(await this.read('location_type')).toBe(type);
    expect.soft(await this.read('zip'), 'zip').toBe(zip);
    expect.soft(await this.read('street'), 'street').toBe(street);
    expect.soft(await this.read('city'), 'city filled from zip').toBe('San Francisco');
    expect.soft(await this.read('state_id'), 'state filled from zip').toContain('California');
    if (o.image) await expect.soft(this.field('image').locator('img'), 'image').not.toHaveAttribute('src', /placeholder/);
    const { internal_notes, special_notes, ...general } = o.details || {};
    for (const [f, v] of Object.entries(general)) expect.soft(await this.read(f), f).toContain(String(v));
    if (o.route) expect.soft(await this.read('route'), 'route').toContain(o.route);
    if (o.driver) expect.soft(await this.read('truck_driver'), 'truck driver').toContain(o.driver);
    if (o.details?.frequency) expect.soft(await this.read('frequency_date'), 'next scheduled date (from frequency)').not.toBe('');
    for (const t of ['is_parts_warehouse', 'handled_externally', 'has_storage']) {
      expect.soft(await this.field(t).locator('input[type="checkbox"]').isChecked(), `${t} left off`).toBe(false);
    }
    if (internal_notes || special_notes) {
      await this.openTab('Notes');
      expect.soft(await this.read('internal_notes'), 'internal notes').toBe(internal_notes);
      expect.soft(await this.read('special_notes'), 'special notes').toBe(special_notes);
    }
  }

  async createWarehouse(w, o = {}) {
    // Saving a warehouse also creates its stock locations and routes: allow the server up to 5 minutes.
    return this.createLocation({ name: w.name, type: 'Warehouse', street: w.street, zip: w.zip }, { timeout: 5 * 60_000 }, { details: w.details, image: w.image, ...o });
  }

  /** A truck is a Location of type "Truck" (stock.warehouse, location_type = transit). */
  async createTruck(t, o = {}) {
    return this.createLocation({ name: t.name, type: 'Truck', street: t.street, zip: t.zip }, { timeout: 5 * 60_000 }, { details: t.details, image: t.image, ...o });
  }

  async createBin({ name, warehouse }) {
    await this.open();
    await this.openMenu('Bin Locations');
    await this.clickNew();
    await this.fill({ name, [F.warehouse]: warehouse });
    return this.save();
  }

  // ---------- TC-010..TC-014 products

  async openProductMaster() {
    await this.open();
    await this.openMenu('Product Master');
  }

  /**
   * Product Master form. AveriGo has no Route on the product (routes live on
   * customers/locations), Tax is a Yes/No radio on the TAX tab, UPCs and UoM
   * conversions are lines on their own tabs, Primary Location is the bin.
   */
  /**
   * Product Master > New. p.details / p.accounts / p.image / p.uomLine / p.extraImage are optional extras
   * (TC-010 fills every visible field); each detail field's tab comes from PRODUCT_FIELD_TABS.
   */
  async createProduct(p, { category, uom, bin, uomType, uomQty }) {
    await this.openProductMaster();
    // Resume: complete a product left by a failed attempt (the code is unique) instead of duplicating it.
    const existing = await this.openExistingOrNew(p.code);
    if (!existing) await this.fill({ [F.name]: p.name, [F.code]: p.code, product_type: p.type || 'Product' });
    await this.fill({ [F.category]: category });
    await this.fill({ [F.uom]: uom, uom_po_id: uom });
    await this.fill({ primary_location: bin, list_price_1: p.price });
    await this.trySet('standard_price', p.cost);
    if (p.image) {
      await this.field('image_1920').locator('input[type="file"]').setInputFiles(p.image);
      await expect(this.field('image_1920').locator('img')).not.toHaveAttribute('src', /placeholder/);
    }
    const picked = {};
    for (const [f, code] of Object.entries(p.accounts || {})) {
      await this.showField(f);
      picked[f] = await this.setOrFirst(f, code);
    }
    for (const [f, v] of Object.entries(p.details || {})) {
      await this.showField(f);
      await this.fill({ [f]: v });
    }
    await this.openTab('TAX');
    await this.fill({ [F.tax]: p.tax ? 'Yes' : 'No', [F.deposit]: Boolean(p.deposit) });
    // Container Deposit only charges when its per-unit amount is set (shown once the box is ticked).
    if (p.deposit) await this.fill({ container_deposit_amount: p.depositAmount });
    // Lines are only added when missing (a resumed product may already have them).
    if (p.upc) {
      await this.openTab('UPCs');
      if (!(await this.field('upc_ids').innerText()).includes(p.upc)) await this.addLine('upc_ids', { upc_code_id: p.upc });
    }
    if (uomType) {
      await this.openTab('UoM Specifications');
      if (!(await this.field('product_uom_ids').innerText()).includes(uomType)) {
        await this.addLine('product_uom_ids', { type: uomType, quantity: uomQty, ...(p.uomLine || {}) });
      } else if (p.uomLine) {
        // Line saved by an earlier attempt: fill its remaining cells.
        // Rows re-render while editing: locate by index, and fill inside the row being edited.
        const lines = this.field('product_uom_ids').locator('.o_data_row');
        const n = await lines.count();
        let idx = 0;
        for (let k = 0; k < n; k++) if ((await lines.nth(k).innerText()).includes(uomType)) idx = k;
        for (const [f, v] of Object.entries(p.uomLine)) {
          await lines.nth(idx).locator(`td[name="${f}"]`).click();
          const editing = this.field('product_uom_ids').locator('.o_data_row.o_selected_row');
          await this.fill({ [f]: v }, editing);
        }
      }
    }
    if (p.extraImage) {
      await this.openTab('Additional Images');
      if (!(await this.field('product_image_ids').innerText()).includes(p.extraImage.name)) await this.addProductImage(p.extraImage);
    }
    const url = await this.save();
    if (Object.keys(picked).length) this.lastPicked = picked;
    return url;
  }

  /** Opens the product-form tab holding a field (Odoo only renders the active tab, so this is a fixed map). */
  async showField(name) {
    if (await this.field(name).isVisible().catch(() => false)) return;
    const tab = PRODUCT_FIELD_TABS[name];
    if (tab) await this.openTab(tab);
  }

  /** many2one / "Select options": the value (e.g. an account code) when it is offered, else the first option. */
  async setOrFirst(name, value) {
    try {
      await this.fill({ [name]: value });
      return (await this.read(name)) || value;
    } catch {
      await this.page.keyboard.press('Escape').catch(() => {});
      return this.pickFirstOption(name);
    }
  }

  /** Additional Images tab > Add: image file + name. */
  async addProductImage({ name, file }) {
    await this.openTab('Additional Images');
    await this.field('product_image_ids').locator('button, a').filter({ hasText: /Add/ }).first().click();
    const dlg = this.dialogs().filter({ has: this.page.locator('.o_field_widget[name="image_1920"]') }).last();
    await dlg.waitFor();
    await this.fill({ name }, dlg);
    await dlg.locator('.o_field_widget[name="image_1920"] input[type="file"]').setInputFiles(file);
    await this.page.waitForTimeout(1000);
    await dlg.locator('.modal-footer button').filter({ hasText: /^Save & Close$/ }).click();
    await dlg.waitFor({ state: 'hidden' });
    await expect(this.field('product_image_ids').locator('.o_kanban_record:not(.o_kanban_ghost), .o_data_row')).toHaveCount(1);
  }

  /** Sets a field only when it is editable (e.g. cost is readonly once stock exists). */
  async trySet(name, value) {
    const input = this.field(name).locator('input').first();
    if (await input.isEditable().catch(() => false)) await this.fill({ [name]: value });
  }

  async expectProduct(url, p, { category, uom, bin, uomType }, picked = {}) {
    await this.goto(url);
    expect(await this.read(F.name)).toContain(p.name);
    expect(await this.read(F.code)).toBe(p.code);
    expect(await this.read(F.category)).toContain(category);
    expect(await this.read(F.uom)).toContain(uom);
    expect(await this.read('primary_location')).toContain(bin);
    if (p.type) expect(await this.read('product_type'), 'product type').toBe(p.type);
    await this.openTab('TAX');
    await expect(this.field(F.tax).locator('input:checked + label, input:checked ~ label').first()).toHaveText(p.tax ? 'Yes' : 'No');
    expect(await this.read(F.deposit), `Container Deposit ${p.deposit ? 'ON' : 'OFF'}`).toBe(Boolean(p.deposit));
    if (p.deposit) expect(parseFloat(await this.read('container_deposit_amount')), 'Container Deposit Amount').toBe(p.depositAmount);
    if (p.upc) {
      await this.openTab('UPCs');
      await expect(this.field('upc_ids')).toContainText(p.upc);
    }
    if (uomType) {
      await this.openTab('UoM Specifications');
      await expect(this.field('product_uom_ids')).toContainText(uomType);
    }
    await this.expectProductExtras(p, picked);
  }

  /** Checks p.image / p.details / p.accounts / p.uomLine / p.extraImage on the open product. */
  async expectProductExtras(p, picked = {}) {
    if (p.image) await expect.soft(this.field('image_1920').locator('img'), 'product image').not.toHaveAttribute('src', /placeholder/);
    const num = (v) => parseFloat(String(v).replace(/[^0-9.-]/g, ''));
    for (const [f, v] of Object.entries(p.details || {})) {
      await this.showField(f);
      const shown = await this.read(f);
      if (typeof v === 'number') expect.soft(num(shown), f).toBe(v);
      else expect.soft(shown, f).toBe(v);
    }
    for (const [f, code] of Object.entries(p.accounts || {})) {
      await this.showField(f);
      expect.soft(await this.read(f), f).toContain(picked[f] || code);
    }
    if (p.uomLine) {
      await this.openTab('UoM Specifications');
      const row = this.field('product_uom_ids').locator('.o_data_row').first();
      for (const [f, v] of Object.entries({ ...p.uomLine, ...(p.uomLineComputed || {}) })) {
        const cell = (await row.locator(`td[name="${f}"]`).innerText()).trim();
        if (typeof v === 'number') expect.soft(num(cell), `UoM line ${f}`).toBe(v);
        else expect.soft(cell, `UoM line ${f}`).toBe(v);
      }
    }
    if (p.extraImage) {
      await this.openTab('Additional Images');
      await expect.soft(this.field('product_image_ids'), 'additional image').toContainText(p.extraImage.name);
    }
    if (p.details && p.type !== 'Service') {
      await this.openTab('TAX');
      expect.soft(await this.field('is_sugar_tax').locator('input[type="checkbox"]').isChecked(), 'Sugar Tax left off').toBe(false);
    }
  }

  /** On Hand from the product form (`qty`, shown on the "On Hand" smart button). */
  async onHand(url) {
    await this.goto(url);
    return this.readMoney('qty');
  }

  async cost(url) {
    await this.goto(url);
    return this.readMoney('standard_price');
  }

  // ---------- TC-017 / TC-018 / TC-074 adjustments

  /**
   * Quantity Adjustment: Location + Products -> Add (loads one line per bin)
   * -> Counted = On Hand + delta -> Validate Inventory.
   * lines: [{ product: code, qty: delta }]
   */
  async quantityAdjustment({ warehouse, lines, ref = `QA-ADJ-${Date.now()}` }) {
    await this.open();
    await this.openMenu('Inventory Adjustment', 'Quantity Adjustments');
    await this.clickNew();
    await this.fill({ warehouse_id: warehouse });
    await this.fill({ name: ref, scan_type: 'Product' });
    await this.fill({ product_ids: lines.map((l) => l.product) });
    await this.click('action_start');
    for (const l of lines) {
      const row = this.field('adjustment_lines_ids').locator('.o_data_row').filter({ hasText: l.product }).first();
      await row.waitFor();
      const onHand = parseFloat((await row.locator('td[name="quantity"]').innerText()).replace(/[^0-9.-]/g, '')) || 0;
      await row.locator('td[name="inventory_quantity"]').click();
      await row.locator('td[name="inventory_quantity"] input').fill(String(onHand + l.qty));
    }
    await this.save();
    await this.click('action_apply_all');
    if (await appears(this.page.locator('.modal:visible .modal-footer'), 3_000)) await this.confirmDialog();
    await this.expectNoError();
    await expect(this.page.locator('.o_statusbar_status .o_arrow_button_current, .o_statusbar_status [aria-current]').first()).toContainText(/Validated/i);
    return this.currentUrl();
  }

  /** Value Adjustment: Products -> Add -> New Cost -> Validate. */
  /**
   * Inventory Adjustment > Value Adjustments: one document for one or more products.
   * Either { product, newCost } or { lines: [{ product, newCost }] } (product = code).
   */
  async valueAdjustment({ product, newCost, lines, ref = `QA-VAL-${Date.now()}` }) {
    lines = lines || [{ product, newCost }];
    await this.open();
    await this.openMenu('Inventory Adjustment', 'Value Adjustments');
    await this.clickNew();
    await this.fill({ name: ref });
    await this.fill({ product_ids: lines.map((l) => l.product) });
    await this.click('action_start');
    // Rows re-render while editing: find each product's row index first, then edit by index.
    const rows = this.field('line_ids').locator('.o_data_row');
    await expect(rows).toHaveCount(lines.length);
    const texts = await rows.allInnerTexts();
    for (const l of lines) {
      const idx = texts.findIndex((t) => t.includes(l.product));
      expect(idx, `value adjustment line for ${l.product}`).toBeGreaterThanOrEqual(0);
      await rows.nth(idx).locator('td[name="new_cost"]').click();
      await this.field('line_ids').locator('.o_data_row').nth(idx).locator('td[name="new_cost"] input').fill(String(l.newCost));
    }
    await this.save();
    await this.clickAny(['action_validate', 'action_apply_all', 'Validate', 'Validate Inventory', 'Apply']);
    if (await appears(this.page.locator('.modal:visible .modal-footer'), 3_000)) await this.confirmDialog();
    await this.expectNoError();
    return this.currentUrl();
  }

  /**
   * Inventory Adjustment > Update Warehouse (reconciliation): warehouse + product -> Get Product List
   * -> Spoilage / Shrinkage / Overage on the line -> Update & Reconcile.
   */
  async reconcileWarehouse({ warehouse, product, spoilage = 0, shrinkage = 0, overage = 0 }) {
    await this.open();
    await this.openMenu('Inventory Adjustment', 'Update Warehouse');
    await this.clickNew();
    await this.fill({ warehouse_id: warehouse });
    await this.fill({ product_ids: [product.name] });
    await this.click('action_get_product_lines');
    const rows = this.field('warehouse_product_ids').locator('.o_data_row');
    await rows.filter({ hasText: product.name }).first().waitFor();
    const row = rows.nth((await rows.allInnerTexts()).findIndex((t) => t.includes(product.name)));
    const onHand = parseFloat((await row.locator('td[name="on_hand_qty"]').innerText()).replace(/[^0-9.-]/g, '')) || 0;
    for (const [name, value] of Object.entries({ spoiled_qty: spoilage, theft_qty: shrinkage, overage_qty: overage })) {
      if (!value) continue;
      await row.locator(`td[name="${name}"]`).click();
      await row.locator(`td[name="${name}"] input`).fill(String(value));
      await row.locator(`td[name="${name}"] input`).press('Tab');
      await this.waitReady();
    }
    const actual = parseFloat((await row.locator('td[name="end_qty"]').innerText().catch(() => '')).replace(/[^0-9.-]/g, ''));
    await this.save();
    await this.click('action_confirm_reconcile');
    await this.expectNoError();
    await this.expectStatus(/Reconciled/);
    return { url: this.currentUrl(), name: await this.recordTitle(), onHand, actual };
  }

  /** Back-compat wrapper used by specs. */
  async inventoryAdjustment({ product, qty, value, warehouse }) {
    if (value !== undefined) return this.valueAdjustment({ product, newCost: value });
    return this.quantityAdjustment({ warehouse, lines: [{ product, qty }] });
  }

  /**
   * Inventory > Material Receipt > Sales Return: customer + return warehouse + invoice
   * -> lines load from the invoice -> Returning Qty -> Return.  qtyByName: { productName: qty }
   */
  async salesReturn({ customer, warehouse, invoice, qtyByName }) {
    await this.open();
    await this.openMenu('Material Receipt', 'Sales Return');
    await this.clickNew();
    await this.fill({ partner_id: customer });
    await this.fill({ warehouse_id: warehouse });
    await this.fill({ invoice_id: invoice });
    for (const [name, qty] of Object.entries(qtyByName)) {
      const row = this.field('sale_return_line_ids').locator('.o_data_row').filter({ hasText: name }).first();
      await row.waitFor();
      await row.locator('td[name="returning_qty"]').click();
      await row.locator('td[name="returning_qty"] input').fill(String(qty));
      await row.locator('td[name="returning_qty"] input').press('Tab');
    }
    await this.save();
    await this.click('action_return');
    await this.expectNoError();
    await this.expectStatus(/Done/);
    return { url: this.currentUrl(), name: await this.recordTitle() };
  }

  /** Open receipt: Action > Print > Receipt; the PDF shows the receipt number, vendor, product and quantity. */
  async expectReceiptPdf({ vendor, product, qty, receiver, note }) {
    const number = await this.recordTitle();
    const text = await this.printReport(/^\s*Receipt\s*$/, `receipt-${number.replace(/\W+/g, '_')}.pdf`);
    const pdf = text.replace(/\s+/g, '');
    expect.soft(pdf, `receipt PDF shows ${number}`).toContain(number.replace(/\s+/g, ''));
    expect.soft(pdf, `receipt PDF shows vendor ${vendor}`).toContain(vendor.replace(/\s+/g, ''));
    expect.soft(pdf, `receipt PDF shows ${product.name}`).toContain(product.name.split(' ').slice(0, 3).join(''));
    expect.soft(text, `receipt PDF shows quantity ${qty}`).toMatch(new RegExp(`\\b${qty}(\\.0+)?\\b`));
    if (receiver) expect.soft(text, `receipt PDF "Received By" shows ${receiver} (see FINDINGS.md TC-069)`).toMatch(new RegExp(`Received By:[^\\n]*${receiver}`));
    if (note) expect.soft(text, `receipt PDF "Notes" shows the receipt note (see FINDINGS.md TC-069)`).toContain(note);
    return text;
  }

  /** Product > Traceability: the latest n stock move rows as text (Date | User | Partner | Reference | Type | Product | From | To | Qty | Unit | Status). */
  /**
   * Product > Traceability (stock move lines). Instances without that button (e.g. ultraserv) use
   * Inventory's standard Moves History searched by the product code instead.
   */
  async openStockHistory(productUrl) {
    await this.goto(productUrl);
    await this.field('name').waitFor();
    const btn = this.page.locator('button[name="action_view_averigo_stock_move_lines"]');
    if (await btn.isVisible({ timeout: 5_000 }).catch(() => false)) { await this.click('action_view_averigo_stock_move_lines'); return null; }
    const code = (await this.read('default_code')).trim();
    await this.goto('/odoo/action-stock.stock_move_line_action');
    await this.page.locator('.o_list_view, .o_kanban_view').first().waitFor();
    // Filter on Product only: the default free-text search scans every move on the instance (too slow on ultraserv).
    // The default "Done" filter stays (done moves only).
    const box = this.page.locator('.o_searchview_input').first();
    await this.waitReady(180_000);
    await box.click();
    await box.pressSequentially(code, { delay: 20 }); // typed, so the search autocomplete opens
    await this.page.locator('.o_searchview_autocomplete li').filter({ hasText: /Search\s+Product\s+for/i }).first().locator('a:not(.o_expand)').click();
    await this.waitReady(180_000);
    await expect(this.page.locator('.o_list_view .o_data_row').filter({ hasText: code }).first()).toBeVisible();
    return code; // the search also matches other fields: callers keep only this product's rows
  }

  async stockHistoryRows(productUrl, n = 5) {
    const code = await this.openStockHistory(productUrl);
    const rows = code ? this.page.locator('.o_list_view .o_data_row').filter({ hasText: `[${code}]` }) : this.page.locator('.o_list_view .o_data_row');
    await rows.first().waitFor();
    return (await rows.allInnerTexts()).slice(0, n).map((t) => t.replace(/\s*\t\s*/g, ' | ').replace(/\n/g, ' ').trim());
  }

  /** Product > Traceability (stock move lines) contains a row matching text. */
  async stockHistoryContains(productUrl, text) {
    const code = await this.openStockHistory(productUrl);
    let rows = this.page.locator('.o_list_view .o_data_row, .o_kanban_record');
    if (code) rows = rows.filter({ hasText: `[${code}]` });
    await expect(rows.filter({ hasText: text }).first()).toBeVisible();
  }

  // ---------- TC-021 / TC-093 catalogues

  /** Catalog: pick products in the Products tag field, then "Add" turns them into catalogue lines. type: Customer | Micromarket */
  async createProductCatalogue({ name, type, products }) {
    await this.open();
    await this.openMenu('Product Catalog');
    await this.clickNew();
    await this.fill({ name, catalog_type: type });
    await this.fill({ product_ids: products });
    await this.click('add_products');
    for (const code of products) await expect(this.field('catalog_product_ids')).toContainText(code);
    return this.save();
  }


  // ---------- TC-065 / TC-069 / TC-077 / TC-078 movements

  /**
   * Inventory > Material Issue (purchase return to vendor) against a bill:
   * vendor + responsible user + type + bill -> lines load -> Issue Qty -> Submit.
   */
  /**
   * Inventory > Material Issue (Purchase Return). extras: every other editable field - vendor_ref,
   * vendor_packing_slip, way_bill, ship_via, issue_date, notes. PO / Receipt / PO date come from the bill.
   */
  async materialIssue({ vendor, bill, user, productName, qty, reason = 'QA purchase return', extras }) {
    await this.open();
    await this.openMenu('Material Issue');
    await this.clickNew();
    await this.fill({ vendor_id: vendor });
    await this.fill({ employee_id: user, issue_type: 'Purchase Return' });
    await this.fill({ bill_id: bill });
    await this.fill({ return_reason: reason });
    const { notes, ...header } = extras || {};
    for (const [f, v] of Object.entries(header)) await this.fill({ [f]: v });
    if (notes) {
      await this.openTab('Notes');
      await this.fill({ notes });
      await this.openTab('Material Issue Lines');
    }
    const row = this.field('material_issue_line_ids').locator('.o_data_row').filter({ hasText: productName }).first();
    await row.waitFor();
    await row.locator('td[name="issue_quantity"]').click();
    await row.locator('td[name="issue_quantity"] input').fill(String(qty));
    await row.locator('td[name="issue_quantity"] input').press('Tab');
    await this.save();
    if (extras) {
      // Every entered value saved.
      for (const [f, v] of Object.entries(header)) expect.soft(await this.read(f), `material issue ${f}`).toContain(String(v));
      if (notes) {
        await this.openTab('Notes');
        expect.soft(await this.read('notes'), 'material issue notes').toBe(notes);
        await this.openTab('Material Issue Lines');
      }
    }
    await this.click('action_submit');
    await this.expectNoError();
    return { url: this.currentUrl(), name: await this.recordTitle() };
  }


  /** Inventory > Material Receipt > Direct Receipt: vendor + location -> Products [Add] -> qty/cost -> Confirm -> validate. */
  /**
   * extras (optional): { toBePrinted, receiver, scheduledDate, vendorInvoice, note, bin } - every other editable
   * field; Location stays the default (a non-default one turns it into an internal transfer, see FINDINGS.md).
   */
  async directReceipt({ vendor, warehouse, product, qty, cost, extras }) {
    await this.open();
    await this.openMenu('Material Receipt', 'Direct Receipt');
    await this.clickNew();
    await this.fill({ partner_id: vendor });
    if (warehouse) await this.fill({ warehouse_id: warehouse });
    if (extras) {
      if (extras.toBePrinted !== undefined) await this.fill({ to_be_printed: extras.toBePrinted });
      if (extras.receiver) await this.fill({ receiver_id: extras.receiver });
      if (extras.vendorInvoice) await this.fill({ vendor_invoice: extras.vendorInvoice });
      if (extras.note) {
        await this.openTab('Note');
        await this.fill({ note: extras.note });
        await this.openTab('Products');
      }
    }
    await this.fill({ product_ids: [product.name] });
    await expect(this.field('product_ids')).toContainText(product.name);
    await this.click('add_products');
    const rows = this.field('move_ids_without_package').locator('.o_data_row');
    await rows.filter({ hasText: product.name }).first().waitFor();
    const row = rows.nth((await rows.allInnerTexts()).findIndex((t) => t.includes(product.name)));
    for (const [name, value] of Object.entries({ product_uom_qty: qty, cost_price: cost })) {
      if (value === undefined) continue;
      await row.locator(`td[name="${name}"]`).click();
      await row.locator(`td[name="${name}"] input`).fill(String(value));
      await row.locator(`td[name="${name}"] input`).press('Tab');
    }
    if (extras?.bin) {
      await row.locator('td[name="bin_location"]').click();
      await this.fill({ bin_location: extras.bin }, this.field('move_ids_without_package').locator('.o_data_row.o_selected_row'));
    }
    // Expected Date last: vendor / Add products onchanges reset it to now.
    if (extras?.scheduledDate) {
      await this.fill({ scheduled_date: extras.scheduledDate });
      await expect(this.field('scheduled_date').locator('input').first()).toHaveValue(new RegExp(extras.scheduledDate.slice(0, 10).replace(/\//g, '\\/')));
    }
    await this.save();
    if (extras) {
      // Every entered value saved.
      if (extras.toBePrinted !== undefined) expect.soft(await this.field('to_be_printed').locator('input').first().isChecked(), 'to be printed').toBe(extras.toBePrinted);
      if (extras.receiver) expect.soft(await this.read('receiver_id'), 'receiver').toContain(extras.receiver);
      if (extras.scheduledDate) expect.soft(await this.read('scheduled_date'), 'expected date').toContain(extras.scheduledDate.slice(0, 10));
      if (extras.vendorInvoice) expect.soft(await this.read('vendor_invoice'), 'vendor invoice #').toBe(extras.vendorInvoice);
      if (extras.bin) await expect.soft(row.locator('td[name="bin_location"]'), 'line bin').toContainText(extras.bin);
      if (extras.note) {
        await this.openTab('Note');
        expect.soft(await this.read('note'), 'receipt note').toBe(extras.note);
        await this.openTab('Products');
      }
    }
    await this.click('action_confirm');
    await this.expectNoError();
    // Confirm usually completes the receipt; validate only if it stops at Ready.
    await expect(this.currentStatus()).toHaveText(/Ready|Done/);
    if (/Ready/.test(await this.status())) await this.clickAny(['button_validate', 'Validate', 'Verify Quantities Against Bill']);
    await this.expectNoError();
    await this.expectStatus(/Done/);
    return { url: this.currentUrl(), name: await this.recordTitle() };
  }


  /**
   * Inventory > Material Transfer: one line source (location/bin) -> destination (location/bin), qty -> Confirm -> Validate.
   * Returns stock at source/destination read from the line before and after.
   */
  /**
   * extras (optional): { issuer, owner, scheduledDate, shippingPolicy, note, uom, cost } - every other editable field
   * (Responsible on Additional Info is the same field as Owner). Values are verified after save.
   */
  async materialTransfer({ product, from, fromBin, to, toBin, qty, receiver, extras }) {
    await this.open();
    await this.openMenu('Material Transfer');
    await this.clickNew();
    // The header Location drives which bins the lines can pick from.
    await this.fill({ warehouse_id: from });
    await this.fill({ transfer_receiver_id: receiver });
    const picked = {};
    const m2o = async (f, v) => {
      try { await this.fill({ [f]: v }); } catch { await this.page.keyboard.press('Escape').catch(() => {}); await this.pickFirstOption(f); }
      await this.waitReady();
      return this.read(f);
    };
    if (extras?.issuer) picked.issuer = await m2o('issuer_id', extras.issuer);
    if (extras?.owner) picked.owner = await m2o('user_id', extras.owner);
    if (extras?.shippingPolicy || extras?.note) {
      await this.openTab('Additional Info');
      if (extras.shippingPolicy) await this.fill({ move_type: extras.shippingPolicy });
      if (extras.note) { await this.openTab('Note'); await this.fill({ note: extras.note }); }
      await this.openTab('Operations');
    }
    await this.addLine('move_ids_without_package', { product_id: product.name });
    const row = this.field('move_ids_without_package').locator('.o_data_row').first();
    if (extras?.uom) {
      // UoM first: it re-prices the line. The list shows "<UoM> (12) (Unit)": clear and pick by name.
      await row.locator('td[name="product_uom"]').click();
      const input = row.locator('td[name="product_uom"] input').first();
      await expect(async () => {
        await input.click();
        await input.press('Control+a');
        await input.press('Backspace');
        let item = this.page.locator('.o-autocomplete--dropdown-item').filter({ hasText: extras.uom }).first();
        if (!(await appears(item, 3_000))) {
          await input.fill(String(extras.uom).split('-').slice(0, 2).join('-'));
          item = this.page.locator('.o-autocomplete--dropdown-item').filter({ hasText: extras.uom }).first();
        }
        await item.click({ timeout: 5_000 });
        await this.waitReady();
        await expect(input).toHaveValue(new RegExp(escapeRe(extras.uom)), { timeout: 5_000 });
      }).toPass({ timeout: 60_000 });
    }
    for (const [name, value] of Object.entries({ warehouse_id: from, bin_location: fromBin, warehouse_dest_id: to })) {
      if (value === undefined) continue;
      await row.locator(`td[name="${name}"]`).click();
      await this.fill({ [name]: value }, row);
    }
    // Without a Transfer Bin the move is posted back into the source bin (see FINDINGS.md): always set one.
    await row.locator('td[name="bin_dest_location"]').click();
    if (toBin) await this.fill({ bin_dest_location: toBin }, row);
    else toBin = await this.pickFirstOption('bin_dest_location', row);
    await row.locator('td[name="quantity"]').click();
    await this.fill({ quantity: qty }, row);
    if (extras?.cost !== undefined) {
      await row.locator('td[name="cost_price"]').click();
      const input = row.locator('td[name="cost_price"] input');
      if (await input.isEditable().catch(() => false)) { await input.fill(String(extras.cost)); await input.press('Tab'); await this.waitReady(); }
      else picked.costReadOnly = true;
    }
    // Scheduled Date last: earlier onchanges reset it.
    if (extras?.scheduledDate) await this.setDate('scheduled_date', extras.scheduledDate);
    const num = async (n) => parseFloat((await row.locator(`td[name="${n}"]`).innerText()).replace(/[^0-9.-]/g, '')) || 0;
    const before = { source: await num('inventory_loc_stock'), dest: await num('transfer_loc_stock') };
    await this.save();
    if (extras) await this.expectTransferExtras(extras, picked, product);
    // Saving usually confirms it (Ready); confirm only if still in Draft.
    if (await appears(this.button('action_confirm'), 3_000)) await this.click('action_confirm');
    await this.expectNoError();
    if (!/Done/.test(await this.status())) await this.clickAny(['button_validate', 'Validate']);
    await this.expectNoError();
    await this.expectStatus(/Done/);
    await this.page.reload();
    await this.waitReady();
    const doneRow = this.field('move_ids_without_package').locator('.o_data_row').first();
    const num2 = async (n) => parseFloat((await doneRow.locator(`td[name="${n}"]`).innerText()).replace(/[^0-9.-]/g, '')) || 0;
    const after = { source: await num2('inventory_loc_stock'), dest: await num2('transfer_loc_stock') };
    return { url: this.currentUrl(), name: await this.recordTitle(), before, after, toBin, picked };
  }

  async expectTransferExtras(x, picked, product) {
    if (x.issuer) expect.soft(await this.read('issuer_id'), 'issuer').toContain(picked.issuer || x.issuer);
    if (x.owner) expect.soft(await this.read('user_id'), 'owner').toContain(picked.owner || x.owner);
    if (x.scheduledDate) expect.soft(await this.read('scheduled_date'), 'scheduled date').toContain(x.scheduledDate.slice(0, 10));
    const row = this.field('move_ids_without_package').locator('.o_data_row').filter({ hasText: product.name }).first();
    if (x.uom) await expect.soft(row.locator('td[name="product_uom"]'), 'line UoM').toContainText(x.uom);
    if (x.cost !== undefined && !picked.costReadOnly) expect.soft(parseFloat((await row.locator('td[name="cost_price"]').innerText()).replace(/[^0-9.-]/g, '')), 'line cost').toBeCloseTo(x.cost, 2);
    if (x.shippingPolicy || x.note) {
      await this.openTab('Additional Info');
      if (x.shippingPolicy) expect.soft(await this.read('move_type'), 'shipping policy').toContain(x.shippingPolicy);
      if (x.note) { await this.openTab('Note'); expect.soft(await this.read('note'), 'note').toBe(x.note); }
      await this.openTab('Operations');
    }
  }

  /** Inventory > Virtual Location Stock Transfer (Warehouse to Virtual Location). Returns on-hand before/after and the virtual location. */
  async virtualLocationTransfer({ warehouse, product, qty, reason = 'QA virtual transfer' }) {
    return this.virtualTransfer({ type: 'Warehouse to Virtual Location', from: warehouse, product, qty, extras: { reason } });
  }

  /**
   * Inventory > Virtual Location Stock Transfer, any type:
   *  'Warehouse to Warehouse' (from, to = warehouses), 'Warehouse to Virtual Location' (from = warehouse, to = virtual),
   *  'Virtual Location to Warehouse' (from = virtual, to = warehouse), 'Truck to Warehouse' (to = warehouse).
   * A missing virtual location is the first offered. extras: { user, reason, category, uom, ratio }.
   * Returns { url, name, virtual, onHandBefore, units, picked } or { error } when Add fails.
   */
  async virtualTransfer({ type, from, to, product, qty, extras = {} }) {
    await this.open();
    await this.openMenu('Virtual Location Stock Transfer');
    await this.clickNew();
    await this.fill({ transfer_type: type });
    await this.waitReady();
    let virtual;
    const pickVirtual = async (name) => {
      if (name) { await this.fill({ virtual_location_id: name }); return name; }
      return this.pickFirstOption('virtual_location_id');
    };
    if (type === 'Warehouse to Warehouse') { await this.fill({ warehouse_id: from }); await this.fill({ warehouse_to_id: to }); }
    else if (type === 'Warehouse to Virtual Location') { await this.fill({ warehouse_id: from }); virtual = await pickVirtual(to); }
    else if (type === 'Virtual Location to Warehouse') { virtual = await pickVirtual(from); await this.fill({ warehouse_id: to }); }
    else if (type === 'Truck to Warehouse') await this.fill({ warehouse_to_id: to });
    const picked = {};
    if (extras.user) {
      try { await this.fill({ user_id: extras.user }); } catch { await this.page.keyboard.press('Escape').catch(() => {}); await this.pickFirstOption('user_id'); }
      picked.user = await this.read('user_id');
    }
    if (extras.reason) await this.fill({ transfer_reason: extras.reason });
    if (extras.category) {
      try { await this.fill({ categ_ids: [extras.category] }); picked.category = await this.read('categ_ids'); }
      catch { await this.page.keyboard.press('Escape').catch(() => {}); }
    }
    await this.fill({ product_ids: [product.name] });
    await expect(this.field('product_ids')).toContainText(product.name);
    await this.click('action_start');
    await this.waitReady();
    // Add can fail server-side (see FINDINGS.md TC-078): report the error instead of hanging.
    const errorDialog = this.page.locator('.modal:visible').filter({ hasText: /Something went wrong|Error|Warning/i }).last();
    const row = this.field('virtual_transfer_lines_ids').locator('.o_data_row').filter({ hasText: product.code }).first();
    await expect(row.or(errorDialog).first()).toBeVisible({ timeout: 20_000 }).catch(() => {});
    if (await errorDialog.isVisible().catch(() => false)) {
      const details = errorDialog.getByText('See technical details');
      if (await details.isVisible().catch(() => false)) await details.click().catch(() => {});
      const lines = (await errorDialog.innerText()).split('\n').map((l) => l.trim());
      const text = lines.find((l) => /^\w*Error: /.test(l) && !/^RPC_ERROR/.test(l)) || lines.filter((l) => /Error|error/.test(l)).slice(-2).join(' | ');
      await errorDialog.locator('.modal-footer button, .btn-close').first().click().catch(() => this.page.keyboard.press('Escape'));
      return { error: text || 'error dialog on Add' };
    }
    if (!(await row.isVisible().catch(() => false))) return { error: `Add loaded no line for ${product.code}` };
    const hasOnHand = await row.locator('td[name="on_hand_qty"]').count();
    const onHandBefore = hasOnHand ? parseFloat((await row.locator('td[name="on_hand_qty"]').innerText()).replace(/[^0-9.-]/g, '')) || 0 : undefined;
    let ratio = 1;
    if (extras.uom) {
      await row.locator('td[name="product_uom_id"]').click();
      const input = row.locator('td[name="product_uom_id"] input').first();
      if (await input.isEditable().catch(() => false)) {
        await expect(async () => {
          await input.click();
          await input.press('Control+a');
          await input.press('Backspace');
          let item = this.page.locator('.o-autocomplete--dropdown-item').filter({ hasText: extras.uom }).first();
          if (!(await appears(item, 3_000))) {
            await input.fill(String(extras.uom).split('-').slice(0, 2).join('-'));
            item = this.page.locator('.o-autocomplete--dropdown-item').filter({ hasText: extras.uom }).first();
          }
          await item.click({ timeout: 5_000 });
          await this.waitReady();
          await expect(input).toHaveValue(new RegExp(escapeRe(extras.uom)), { timeout: 5_000 });
        }).toPass({ timeout: 60_000 });
        ratio = extras.ratio ?? 1;
      } else picked.uomReadOnly = true;
    }
    await row.locator('td[name="product_qty"]').click();
    await row.locator('td[name="product_qty"] input').fill(String(qty));
    await row.locator('td[name="product_qty"] input').press('Tab');
    await this.save();
    // Every entered value saved.
    if (picked.user) expect.soft(await this.read('user_id'), 'user').toContain(picked.user);
    if (extras.reason) expect.soft(await this.read('transfer_reason'), 'transfer reason').toBe(extras.reason);
    if (picked.category) expect.soft(await this.read('categ_ids'), 'category').toContain(extras.category);
    const saved = this.field('virtual_transfer_lines_ids').locator('.o_data_row').filter({ hasText: product.code }).first();
    if (extras.uom && !picked.uomReadOnly) await expect.soft(saved.locator('td[name="product_uom_id"]'), 'line UoM').toContainText(extras.uom);
    await expect.soft(saved.locator('td[name="product_qty"]'), 'transfer quantity').toContainText(String(qty));
    await this.click('action_transfer');
    await this.expectNoError();
    await this.expectStatus(/Done/);
    return { url: this.currentUrl(), name: await this.recordTitle(), virtual, onHandBefore, units: qty * ratio, picked };
  }

  /** On-hand qty of a product at a bin/location, from Bin Locations stock list. */
  async qtyAtLocation(location, productCode) {
    await this.open();
    await this.openMenu('Bin Locations');
    await this.openRecord(location);
    const row = this.page.locator('.o_data_row').filter({ hasText: productCode }).first();
    if (!(await row.isVisible().catch(() => false))) return 0;
    const qtyCell = row.locator('td[name="quantity"], td[name="qty_available"], td[name="product_qty"]').first();
    return parseFloat((await qtyCell.innerText()).replace(/[^0-9.-]/g, '')) || 0;
  }
}

module.exports = { InventoryPage, F };
