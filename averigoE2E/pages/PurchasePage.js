const { expect, test } = require('@playwright/test');
const { appears } = require('../utils/wait');
const { OdooPage } = require('./OdooPage');
const { expectMoney, parseMoney, round2 } = require('../utils/money');

const softMoney = (actual, expected, label) => expect.soft(round2(actual), `${label}: expected ${expected}, got ${actual}`).toBeCloseTo(round2(expected), 2);

class PurchasePage extends OdooPage {
  async open(menu) {
    await this.openApp('Purchase');
    if (menu) await this.openMenu(menu);
  }

  /**
   * Vendor: header + required Control Account (payable) -> save -> Products tab:
   * pick products -> Add -> line UoM / Cost. AveriGo keeps one line per product.
   */
  /**
   * Vendor with every editable field (v.details / v.contact / v.productLine optional). Resumes a vendor left by a
   * failed earlier attempt instead of duplicating it.
   */
  async createVendor(v, { product, uoms = [], purchaseManager, cost }) {
    await this.open('Vendors');
    const existing = await this.openExistingOrNew(v.name);
    if (!existing) await this.fill({ name: v.name });
    if (purchaseManager) await this.fill({ kam: purchaseManager });
    await this.fill({ zip: v.zip });
    await this.fill({ street: v.street });
    // Email becomes read-only (showing the primary contact's email) once the vendor has a primary contact.
    if (v.email && (await this.field('email').locator('input').isEditable().catch(() => false))) await this.fill({ email: v.email });
    for (const [f, val] of Object.entries(v.details || {})) {
      await this.fill({ [f]: val });
      await this.page.keyboard.press('Escape').catch(() => {});
    }
    await this.openTab('Account Setup');
    await this.fill({ property_account_payable_id: '211000' });
    const url = await this.save();
    // Contacts added on the saved vendor (on an unsaved form the Add click can be swallowed).
    for (const ct of [v.contact, v.remitContact].filter(Boolean)) {
      await this.openTab('Contacts & Addresses');
      if (!(await this.field('child_ids').innerText()).includes(ct.name)) {
        await this.addVendorContact(ct);
        await this.save();
      }
    }
    if (product) {
      await this.openTab('Products');
      if (!(await this.vendorLine(product.code).count())) {
        await this.fill({ single_product_ids: [product.name] });
        await this.click('add_vendor_products');
      }
      await this.vendorLine(product.code).waitFor();
      // UoM and the other line fields first; cost last (editing other cells can reset it to the product's cost).
      for (const [name, value] of Object.entries({ uom_id: uoms[0], ...(v.productLine || {}), cost_price: cost })) {
        if (value === undefined) continue;
        await this.vendorLine(product.code).locator(`td[name="${name}"]`).click();
        const editing = this.field('vendor_product_ids').locator('.o_data_row.o_selected_row').filter({ hasText: product.code });
        await this.fill({ [name]: value }, editing);
      }
      await this.save();
    }
    return url;
  }

  /** Contacts & Addresses > Add: name, primary, email, phones, photo, note. */
  async addVendorContact(ct) {
    const dlg = this.dialogs().filter({ has: this.page.locator('.o_field_widget[name="addr_type"]') }).last();
    await expect(async () => {
      if (!(await dlg.isVisible().catch(() => false))) await this.field('child_ids').locator('button, a').filter({ hasText: /^\s*Add/ }).first().click();
      await dlg.locator('.o_field_widget[name="name"]').waitFor({ timeout: 8_000 });
    }).toPass({ timeout: 45_000 });
    const { image, type, ...values } = ct;
    if (type) {
      // Address type radio (Contact / Remit to Address); changing it asks "Are you sure...?" -> Ok.
      await dlg.locator('.o_field_widget[name="addr_type"] .form-check').filter({ hasText: type }).locator('input').check({ force: true });
      const confirm = this.page.locator('.modal:visible').filter({ hasText: /Are you sure/i }).last();
      if (await appears(confirm, 3_000)) {
        await confirm.locator('.modal-footer button').filter({ hasText: /^Ok$/i }).click();
        await confirm.waitFor({ state: 'hidden' });
      }
      await this.waitReady();
    }
    await this.fill({ name: values.name }, dlg);
    // ZIP before Street (City / State / County are filled from the ZIP); only the fields this type shows.
    const order = ['zip', 'street', ...Object.keys(values).filter((k) => !['name', 'zip', 'street'].includes(k))];
    for (const f of order) {
      if (values[f] === undefined) continue;
      if (await dlg.locator(`.o_field_widget[name="${f}"]`).first().isVisible().catch(() => false)) await this.fill({ [f]: values[f] }, dlg);
    }
    if (image) await dlg.locator('.o_field_widget[name="image_1920"] input[type="file"]').setInputFiles(image).catch(() => {});
    await this.waitReady();
    await dlg.locator('.modal-footer button').filter({ hasText: /^Save( & Close)?$/ }).first().click();
    await dlg.waitFor({ state: 'hidden' });
    await expect(this.field('child_ids')).toContainText(ct.name);
  }

  /**
   * Opens a saved vendor and changes every editable field to `e` (see testData.vendorEdit): name, purchase manager,
   * address, details, and the existing contacts (o.editContacts: { contactName: values }). Saves.
   */
  async editVendor(url, e, o = {}) {
    await this.goto(url);
    await this.field('name').waitFor();
    await this.fill({ name: e.name });
    if (o.purchaseManager) await this.fill({ kam: o.purchaseManager });
    await this.fill({ zip: e.zip });
    await this.fill({ street: e.street });
    for (const [f, val] of Object.entries(e.details || {})) {
      await this.fill({ [f]: val });
      await this.page.keyboard.press('Escape').catch(() => {});
    }
    await this.save();
    for (const [name, values] of Object.entries(o.editContacts || {})) {
      await this.editVendorContact(name, values);
      await this.save();
    }
    return this.currentUrl();
  }

  /** Contacts & Addresses: opens a vendor contact by name, changes the given fields (ZIP before Street), saves the dialog. */
  async editVendorContact(name, values) {
    await this.openTab('Contacts & Addresses');
    await this.field('child_ids').locator('.o_kanban_record, .o_data_row').filter({ hasText: name }).first().click();
    const dlg = this.dialogs().filter({ has: this.page.locator('.o_field_widget[name="addr_type"]') }).last();
    await dlg.locator('.o_field_widget[name="name"]').waitFor();
    const order = ['zip', 'street', ...Object.keys(values).filter((k) => !['zip', 'street'].includes(k))];
    for (const f of order) {
      if (values[f] === undefined) continue;
      if (await dlg.locator(`.o_field_widget[name="${f}"]`).first().isVisible().catch(() => false)) await this.fill({ [f]: values[f] }, dlg);
    }
    await dlg.locator('.modal-footer button').filter({ hasText: /^Save( & Close)?$/ }).first().click();
    await dlg.waitFor({ state: 'hidden' });
  }

  /** Reads a vendor contact's fields from its dialog (then closes it). */
  async readVendorContact(name, fields) {
    await this.openTab('Contacts & Addresses');
    await this.field('child_ids').locator('.o_kanban_record, .o_data_row').filter({ hasText: name }).first().click();
    const dlg = this.dialogs().filter({ has: this.page.locator('.o_field_widget[name="addr_type"]') }).last();
    await dlg.locator('.o_field_widget[name="name"]').waitFor();
    const out = {};
    for (const f of fields) {
      if (await dlg.locator(`.o_field_widget[name="${f}"]`).first().isVisible().catch(() => false)) out[f] = (await this.read(f, dlg)).trim();
    }
    await dlg.locator('.modal-footer button').filter({ hasText: /Discard|Close/ }).first().click().catch(() => this.page.keyboard.press('Escape'));
    await dlg.waitFor({ state: 'hidden' }).catch(() => {});
    return out;
  }

  /** Adds products to the vendor's Products tab when missing (PO/bill pickers only offer these). */
  async ensureVendorProducts(vendorName, products) {
    await this.open('Vendors');
    await this.openRecord(vendorName);
    await this.openTab('Products');
    const missing = [];
    for (const p of products) if (!(await this.vendorLine(p.code).isVisible().catch(() => false))) missing.push(p);
    if (!missing.length) return;
    await this.fill({ single_product_ids: missing.map((p) => p.name) });
    await this.click('add_vendor_products');
    for (const p of missing) await expect(this.vendorLine(p.code)).toBeVisible();
    await this.save();
  }

  vendorLine(code) {
    return this.field('vendor_product_ids').locator('.o_data_row').filter({ hasText: code }).first();
  }

  async expectVendor(url, v, { product, uoms = [], purchaseManager, cost }) {
    await this.goto(url);
    expect(await this.read('name')).toContain(v.name);
    if (purchaseManager) expect(await this.read('kam')).toContain(purchaseManager);
    const num = (t) => parseFloat(String(t).replace(/[^0-9.-]/g, ''));
    for (const [f, val] of Object.entries(v.details || {})) {
      if (typeof val === 'boolean') {
        expect.soft(await this.field(f).locator('input[type="checkbox"]').first().isChecked(), `${f} ticked`).toBe(val);
        continue;
      }
      const shown = await this.read(f);
      if (typeof val === 'number') expect.soft(num(shown), f).toBe(val);
      else if (/phone/.test(f)) expect.soft(shown.replace(/\D/g, ''), f).toMatch(new RegExp(`${val}$`));
      else expect.soft(shown, f).toContain(val);
    }
    expect.soft(await this.field('vendor_approve').locator('input').first().isChecked(), 'Vendor Approved (default)').toBe(true);
    for (const ct of [v.contact, v.remitContact].filter(Boolean)) {
      await this.openTab('Contacts & Addresses');
      await expect.soft(this.field('child_ids'), `vendor ${ct.type || 'contact'}`).toContainText(ct.name);
    }
    await this.openTab('Account Setup');
    expect.soft(await this.read('property_account_payable_id'), 'control account').toMatch(/^211000/);
    // Default vendor accounts come from the company setup; instances without one (ultraserv) leave them empty.
    for (const f of v.defaultAccounts || []) {
      if (require('../data/testData').vendorDefaultAccounts) expect.soft(await this.read(f), `${f} (default)`).toMatch(/^\d{6}/);
      else await expect.soft(this.field(f), `${f} shown on Account Setup`).toBeVisible();
    }
    if (product && v.productLine) {
      await this.openTab('Products');
      const line = this.vendorLine(product.code);
      for (const [f, val] of Object.entries({ ...v.productLine, ...(cost !== undefined ? { cost_price: cost } : {}) })) {
        let cell = (await line.locator(`td[name="${f}"]`).innerText()).trim();
        if (!cell) {
          // Some cells (e.g. Long Description) only show their value in edit mode.
          await line.locator(`td[name="${f}"]`).click();
          const td = this.field('vendor_product_ids').locator(`td[name="${f}"]`).first();
          const box = td.locator('textarea, input').first();
          // Text box value, else the cell text without the "26 / 250 (224 remaining)" counter.
          const readCell = async () => ((await box.count()) ? await box.inputValue().catch(() => '')
            : (await td.innerText().catch(() => '')).replace(/\d+\s*\/\s*\d+\s*\(\d+ remaining\)/, '')).trim();
          // The edit widget can still be loading right after the click: re-read until it shows a value.
          await expect.poll(readCell, { timeout: 10_000 }).not.toBe('').catch(() => {});
          cell = await readCell();
          await this.page.keyboard.press('Escape').catch(() => {});
        }
        if (typeof val === 'number') expect.soft(num(cell), `Products line ${f}`).toBe(val);
        else expect.soft(cell, `Products line ${f}`).toContain(val);
      }
    }
    await this.openTab('Products');
    const row = this.vendorLine(product.code);
    await expect(row).toBeVisible();
    if (uoms.length) {
      await row.locator('td[name="uom_id"]').click();
      const f = row.locator('.o_field_widget[name="uom_id"]');
      let options;
      if (await f.locator('.o_av_cdd').count()) {
        if (!(await f.locator('.o_av_cdd_panel').isVisible().catch(() => false))) await f.locator('.o_av_cdd_trigger').click();
        await f.locator('.o_av_cdd_list li').first().waitFor({ timeout: 10_000 }).catch(() => {});
        options = [await f.locator('.o_av_cdd_tags').innerText(), ...(await f.locator('.o_av_cdd_list li').allInnerTexts())].join(' | ');
      } else {
        await f.locator('input').click();
        await expect.poll(async () => {
          const t = await this.page.locator('.o-autocomplete--dropdown-item').allInnerTexts();
          return t.length > 0 && !t.some((x) => /Loading/i.test(x));
        }, { timeout: 30_000 }).toBe(true);
        options = [await f.locator('input').inputValue(), ...(await this.page.locator('.o-autocomplete--dropdown-item').allInnerTexts())].join(' | ');
      }
      for (const u of uoms) expect(options, `UoM ${u} available for ${product.code}`).toContain(u);
      await this.page.keyboard.press('Escape');
    }
  }

  /** Purchase Order: vendor + location -> Products [Add] -> Order Qty / Cost -> Save. lines: [{ product: {code,name}, qty, cost }] */
  /**
   * Purchase Order > New. lines: [{ product, qty, cost, uom, vendorDesc, taxable, discount }].
   * extras (optional): { header: { field: value }, footer: { field: value } } - every editable header/footer field
   * (Recurring stays off: it would schedule repeat orders). Values are verified after save.
   */
  async createPO({ vendor, warehouse, lines, extras }) {
    await this.open('Purchase Order');
    await this.clickNew();
    await this.fill({ partner_id: vendor });
    if (warehouse) await this.fill({ warehouse_id: warehouse });
    const picked = {};
    for (const [f, v] of Object.entries(extras?.header || {})) picked[f] = await this.fillPOField(f, v);
    await this.fill({ product_ids: lines.map((l) => l.product.name) });
    // Clicking Add with nothing picked crashes the server (IndexError), so make sure the tags are set.
    for (const l of lines) await expect(this.field('product_ids')).toContainText(l.product.name);
    await this.field('add_button').locator('button').click();
    await this.waitReady();
    await this.expectNoError();
    for (const l of lines) {
      // UoM first: changing it re-prices the line, so qty and cost come after.
      const cells = [['product_uom', l.uom], ['product_qty', l.qty], ['price_unit', l.cost], ['vendor_part_desc', l.vendorDesc], ['tax_status', l.taxable], ['discount', l.discount]];
      for (const [name, value] of cells) if (value !== undefined) await this.setPOLineCell(l.product.name, name, value);
    }
    for (const [f, v] of Object.entries(extras?.footer || {})) await this.fillPOField(f, v);
    await this.save();
    if (extras || lines.some((l) => l.uom || l.vendorDesc || l.discount !== undefined)) await this.expectPOExtras({ lines, extras, picked });
    return { url: this.currentUrl(), name: await this.recordTitle(), picked };
  }

  /** One PO header/footer field; many2one values fall back to the first option. Returns the value shown. */
  async fillPOField(f, v) {
    if (typeof v === 'boolean') { await this.setBoolean(f, v); return v; }
    if (/date/.test(f)) { await this.setDate(f, v); await this.waitReady(); return this.read(f); }
    const isM2o = await this.field(f).evaluate((e) => e.classList.contains('o_field_many2one')).catch(() => false);
    if (isM2o) {
      try { await this.fill({ [f]: v }); } catch { await this.page.keyboard.press('Escape').catch(() => {}); await this.pickFirstOption(f); }
      await this.waitReady();
      return this.read(f);
    }
    await this.fill({ [f]: v });
    await this.waitReady();
    return v;
  }

  /** The order line of a product, by position (in edit mode its product name is an input, not text). */
  async poLineIndex(productName) {
    const rows = this.field('order_line').locator('.o_data_row');
    await expect(async () => {
      const texts = await rows.evaluateAll((es) => es.map((e) => e.innerText + ' ' + [...e.querySelectorAll('input')].map((i) => i.value).join(' ')));
      expect(texts.some((t) => t.includes(productName))).toBe(true);
    }).toPass({ timeout: 30_000 });
    const texts = await rows.evaluateAll((es) => es.map((e) => e.innerText + ' ' + [...e.querySelectorAll('input')].map((i) => i.value).join(' ')));
    return texts.findIndex((t) => t.includes(productName));
  }

  poLine(productName) {
    return this.field('order_line').locator('.o_data_row').filter({ hasText: productName }).first();
  }

  async setPOLineCell(productName, name, value) {
    const idx = await this.poLineIndex(productName);
    const editing = this.field('order_line').locator('.o_data_row').nth(idx);
    await expect(async () => {
      if (!(await editing.evaluate((e) => e.classList.contains('o_selected_row')))) await editing.locator(`td[name="${name}"]`).click();
      await expect(editing).toHaveClass(/o_selected_row/, { timeout: 3_000 });
    }).toPass({ timeout: 30_000 });
    const cell = editing.locator(`td[name="${name}"]`);
    if (name === 'product_uom') {
      // The UoM list shows "<UoM> (12) (Unit)": clear the input and pick by name.
      const input = cell.locator('input').first();
      await expect(async () => {
        await input.click();
        await input.press('Control+a');
        await input.press('Backspace');
        let item = this.page.locator('.o-autocomplete--dropdown-item').filter({ hasText: value }).first();
        if (!(await appears(item, 3_000))) {
          await input.fill(String(value).split('-').slice(0, 2).join('-'));
          item = this.page.locator('.o-autocomplete--dropdown-item').filter({ hasText: value }).first();
        }
        await item.click({ timeout: 5_000 });
        await this.waitReady();
        await expect(input).toHaveValue(new RegExp(String(value).replace(/[.*+?^${}()|[\]\\]/g, '\\$&')), { timeout: 5_000 });
      }).toPass({ timeout: 60_000 });
    } else if (typeof value === 'boolean') {
      const box = cell.locator('input[type="checkbox"]').first();
      if ((await box.isChecked()) !== value) await box.click({ force: true });
    } else {
      await cell.click();
      const input = cell.locator('input, textarea').first();
      await input.fill(String(value));
      await input.press('Tab');
    }
    await this.waitReady();
  }

  /** Saved PO shows every entered header/footer/line value, and the total adds up. */
  async expectPOExtras({ lines, extras, picked }) {
    for (const [f, v] of Object.entries(extras?.header || {})) {
      if (typeof v === 'boolean') expect.soft(await this.field(f).locator('input').first().isChecked(), f).toBe(v);
      else if (/date/.test(f)) expect.soft(await this.read(f), f).toContain(String(v).slice(0, 10));
      else expect.soft(await this.read(f), f).toContain(picked[f] || v);
    }
    for (const [f, v] of Object.entries(extras?.footer || {})) {
      if (typeof v === 'number') softMoney(await this.readMoney(f), v, f);
      else expect.soft(await this.read(f), f).toBe(v);
    }
    for (const l of lines) {
      const row = this.poLine(l.product.name);
      if (l.uom) await expect.soft(row.locator('td[name="product_uom"]'), `${l.product.name} UoM`).toContainText(l.uom);
      if (l.qty !== undefined) await expect.soft(row.locator('td[name="product_qty"]'), `${l.product.name} qty`).toContainText(String(l.qty));
      if (l.cost !== undefined) softMoney(parseMoney(await row.locator('td[name="price_unit"]').innerText()), l.cost, `${l.product.name} cost`);
      if (l.vendorDesc) await expect.soft(row.locator('td[name="vendor_part_desc"]'), `${l.product.name} vendor part # & description`).toContainText(l.vendorDesc);
      if (l.discount !== undefined) softMoney(parseMoney(await row.locator('td[name="discount"]').innerText()), l.discount, `${l.product.name} line discount`);
    }
    // Total = subtotal + S&H + tax + container deposit + insurance - discount.
    const [sub, tax, dep, total] = [await this.readMoney('amount_untaxed'), await this.readMoney('tax_amount_view'), await this.readMoney('container_deposit_view'), await this.readMoney('amount_total')];
    const f = extras?.footer || {};
    const sh = f.shipping_handling ?? 0, ins = f.insurance ?? 0, disc = f.total_discount_view ?? 0;
    softMoney(total, sub + sh + tax + dep + ins - disc, `PO total = ${sub} + S&H ${sh} + tax ${tax} + deposit ${dep} + insurance ${ins} - discount ${disc}`);
  }

  async confirmPO() {
    await this.click('button_confirm');
    await this.expectNoError();
    await this.expectStatus(/Confirmed/);
  }

  async poTotal() {
    return this.readMoney('amount_total');
  }

  /** Receive Products -> (Received Qty) -> Verify Quantities Against Bill. Partial receipt creates a backorder. */
  async receive({ receiveQty, bin, extras } = {}) {
    await this.page.locator('.o_form_view button[name="action_view_picking"]').filter({ hasText: /Receive Products/ }).click();
    await this.waitReady();
    const row = this.field('move_ids_without_package').locator('.o_data_row').first();
    await row.waitFor();
    if (extras) await this.fillReceiptExtras(extras);
    const qty = receiveQty ?? extras?.lineQty;
    if (qty !== undefined) {
      await row.locator('td[name="quantity"]').click();
      await row.locator('td[name="quantity"] input').fill(String(qty));
      await row.locator('td[name="quantity"] input').press('Tab');
    }
    if (extras?.lineCost !== undefined) {
      await row.locator('td[name="cost_price"]').click();
      const input = row.locator('td[name="cost_price"] input');
      if (await input.isEditable().catch(() => false)) { await input.fill(String(extras.lineCost)); await input.press('Tab'); }
    }
    if (bin) {
      await row.locator('td[name="bin_location"]').click();
      await this.fill({ bin_location: bin }, row);
    }
    await this.save();
    if (extras) await this.expectReceiptExtras(extras);
    await this.click('button_validate');
    // Partial receipt: Odoo's "Create Backorder?" confirmation.
    const backorder = this.dialogs().filter({ hasText: /backorder/i }).last();
    if (await appears(backorder, receiveQty !== undefined ? 15_000 : 3_000)) {
      await backorder.locator('button[name="process"], button').filter({ hasText: /Create Backorder|^\s*Yes|Continue/i }).first().click();
      await this.waitReady();
    }
    await this.expectNoError();
    await this.expectStatus(/Done/);
  }

  /** Receipt header / Note fields before "Verify Quantities Against Bill". Returns the receiver picked. */
  async fillReceiptExtras(x) {
    if (x.receiver) {
      try { await this.fill({ receiver_id: x.receiver }); } catch { await this.page.keyboard.press('Escape').catch(() => {}); await this.pickFirstOption('receiver_id'); }
      x.receiverPicked = await this.read('receiver_id');
      expect.soft(x.receiverPicked, 'receiver').toContain(x.receiver);
    }
    if (x.scheduledDate) await this.fill({ scheduled_date: x.scheduledDate });
    if (x.vendorInvoice) await this.fill({ vendor_invoice: x.vendorInvoice });
    if (x.note) {
      await this.openTab('Note');
      await this.fill({ note: x.note });
      await this.openTab('Products');
    }
  }

  async expectReceiptExtras(x) {
    if (x.receiverPicked) expect.soft(await this.read('receiver_id'), 'receiver').toContain(x.receiverPicked);
    if (x.scheduledDate) expect.soft(await this.read('scheduled_date'), 'expected date').toContain(x.scheduledDate.slice(0, 10));
    if (x.vendorInvoice) expect.soft(await this.read('vendor_invoice'), 'vendor invoice #').toBe(x.vendorInvoice);
    if (x.note) {
      await this.openTab('Note');
      expect.soft(await this.read('note'), 'receipt note').toBe(x.note);
      await this.openTab('Products');
    }
  }

  /** The bill is created on receipt: open it from the PO, set date + vendor invoice #, Post. */
  async postBillFromPO(poUrl) {
    await this.goto(poUrl);
    await this.page.locator('.o_form_view button[name="action_view_invoice"]').first().click();
    await this.waitReady();
    if (await appears(this.page.locator('.o_list_view .o_data_row').first(), 3_000)) {
      await this.page.locator('.o_list_view .o_data_row').first().locator('td.o_data_cell').first().click();
      await this.waitReady();
    }
    // Wait for the bill form itself (not the PO still on screen) before reading its state.
    await this.field('amount_total_view').waitFor();
    await expect(this.currentStatus()).toHaveText(/Draft|Posted/);
    if (/Draft/i.test(await this.status())) {
      const { today } = require('../utils/dates');
      const visible = async (f) => appears(this.field(f), 2_000);
      if ((await visible('invoice_date')) && !(await this.read('invoice_date'))) await this.fill({ invoice_date: today() });
      if ((await visible('vendor_invoice')) && !(await this.read('vendor_invoice'))) await this.fill({ vendor_invoice: `VB${String(Date.now()).slice(-8)}` });
      await this.save();
      await this.clickAny(['action_post', 'Post']);
      await this.expectNoError();
    }
    await this.expectStatus(/Posted/);
    return { url: this.currentUrl(), name: await this.recordTitle(), total: await this.readMoney('amount_total_view') };
  }

  /** TC-061..064: PO -> confirm -> receive -> bill (auto) -> post. Returns { poUrl, poName, billUrl, billName, total }. */
  async purchaseAndBill({ vendor, warehouse, product, qty, cost, bin, receiptExtras, checkPdfs }) {
    const num = (t) => parseFloat(String(t).replace(/[^0-9.-]/g, ''));
    const po = await this.createPO({ vendor, warehouse, lines: [{ product, qty, cost }] });
    await this.confirmPO();
    const poTotal = await this.poTotal();
    // Subtotal = qty x cost (the total also carries tax / container deposit when the vendor line is taxable).
    const poSubtotal = await this.readMoney('amount_untaxed');
    expectMoney(poSubtotal, qty * cost, 'PO subtotal = qty x cost');
    // The PO line takes the vendor's UoM for the product (e.g. the 12-unit case): stock moves in units.
    const uomText = await this.field('order_line').locator('.o_data_row').first().locator('td[name="product_uom"]').innerText().catch(() => '');
    const m = uomText.match(/\((\d+)\)/);
    const unitsPerQty = m ? parseInt(m[1], 10) : 1;
    await this.receive({ bin, extras: receiptExtras });
    const bill = await this.postBillFromPO(po.url);
    expectMoney(bill.total, poTotal, 'Bill total vs PO total');
    if (checkPdfs) {
      await test.step('Bill PDF (Action > Bill) matches the bill screen', async () => {
        await this.goto(bill.url);
        const b = await this.expectPurchasePdf('bill');
        expectMoney(num(b.totals.total), poTotal, 'Bill PDF total = PO total');
      });
      await test.step('PO PDF (Action > Print > Purchase Order) matches the PO screen', async () => {
        await this.goto(po.url);
        const o = await this.expectPurchasePdf('po');
        expectMoney(num(o.totals.total), poTotal, 'PO PDF total = PO total');
      });
    }
    return { poUrl: po.url, poName: po.name, billUrl: bill.url, billName: bill.name, total: bill.total, subtotal: poSubtotal, unitsPerQty };
  }

  /**
   * Purchase > Bill > New: vendor, location, products (picker + Add), qty / cost per line, header and Other Info
   * extras, Post. lines: [{ product, qty, cost }]. extras: { header: {...}, incoterm: true, paymentReference }.
   */
  async createBill({ vendor, warehouse, lines, extras = {} }) {
    await this.open('Bill');
    await this.clickNew();
    await this.fill({ partner_id: vendor });
    if (warehouse) await this.fill({ warehouse_id: warehouse });
    await this.fill({ product_ids: lines.map((l) => l.product.code) });
    await this.click('add_products');
    for (const l of lines) {
      for (const [name, value] of Object.entries({ quantity: l.qty ?? 1, cost_price_unit: l.cost })) {
        if (value === undefined) continue;
        const row = this.field('invoice_line_ids').locator('.o_data_row').filter({ hasText: l.product.name }).first();
        await row.waitFor();
        await row.locator(`td[name="${name}"]`).click();
        const editing = this.field('invoice_line_ids').locator('.o_data_row.o_selected_row').filter({ hasText: l.product.name });
        await expect(editing).toHaveCount(1);
        const input = editing.locator(`td[name="${name}"] input`);
        await input.fill(String(value));
        await input.press('Tab');
        await this.waitReady();
      }
    }
    for (const [f, v] of Object.entries(extras.header || {})) await this.fill({ [f]: v });
    const picked = {};
    if (extras.incoterm || extras.paymentReference) {
      await this.openTab('Other Info');
      if (extras.incoterm) picked.invoice_incoterm_id = await this.pickFirstOption('invoice_incoterm_id');
      if (extras.paymentReference) await this.fill({ payment_reference: extras.paymentReference });
      await this.openTab('Bill Lines');
    }
    const url = await this.save();
    await this.clickAny(['action_post', 'Post']);
    await this.expectNoError();
    await this.expectStatus(/Posted/);
    return { url, name: await this.recordTitle(), picked };
  }

  /** Re-checks a bill made by createBill: values, lines and total consistency. */
  async expectBill(url, { lines, extras = {}, picked = {} }) {
    await this.goto(url);
    await this.expectStatus(/Posted/);
    const num = (t) => parseFloat(String(t).replace(/[^0-9.-]/g, '')) || 0;
    for (const [f, v] of Object.entries(extras.header || {})) {
      if (typeof v === 'number') expect.soft(await this.readMoney(f), f).toBeCloseTo(v, 2);
      else expect.soft(await this.read(f), f).toContain(v);
    }
    let sum = 0;
    for (const l of lines) {
      const row = this.field('invoice_line_ids').locator('.o_data_row').filter({ hasText: l.product.name }).first();
      expect.soft(num(await row.locator('td[name="quantity"]').innerText()), `${l.product.code} qty`).toBe(l.qty);
      expect.soft(num(await row.locator('td[name="cost_price_unit"]').innerText()), `${l.product.code} cost`).toBe(l.cost);
      sum += num(await row.locator('td[name="price_subtotal"]').innerText());
    }
    const t = {};
    for (const [k, f] of Object.entries({ subtotal: 'amount_untaxed', shipping: 'shipping_handling', tax: 'tax_amount_view', deposit: 'total_container_deposit', insurance: 'insurance', discount: 'total_discount', total: 'amount_total_view' })) {
      t[k] = await this.readMoney(f);
    }
    expect.soft(Math.abs(t.subtotal - sum), `Subtotal ${t.subtotal} = sum of lines ${sum}`).toBeLessThan(0.005);
    const expected = t.subtotal + t.shipping + t.insurance + t.tax + t.deposit - Math.abs(t.discount);
    expect.soft(Math.abs(t.total - expected), `Total ${t.total} = subtotal + S&H + insurance + tax + deposit - discount (${expected.toFixed(2)})`).toBeLessThan(0.015);
    await this.openTab('Other Info');
    if (picked.invoice_incoterm_id) expect.soft(await this.read('invoice_incoterm_id'), 'incoterm').toContain(picked.invoice_incoterm_id);
    if (extras.paymentReference) expect.soft(await this.read('payment_reference'), 'payment reference').toBe(extras.paymentReference);
    return t;
  }

  /**
   * Prints the open PO (Action > Print > Purchase Order) or bill (Action > Bill) and checks the PDF against the
   * screen: number + vendor, each line's product / cost / amount, and every total (Total compared explicitly).
   */
  async expectPurchasePdf(kind) {
    const isPo = kind === 'po';
    const cfg = isPo
      ? { lineField: 'order_line', cost: 'price_unit', amount: 'price_subtotal', product: 'product_id', item: /^\s*Purchase Order\s*$/,
        totals: { subtotal: 'amount_untaxed', shipping: 'shipping_handling', tax: 'tax_amount_view', deposit: 'container_deposit_view', insurance: 'insurance', discount: 'total_discount_view', total: 'amount_total' } }
      : { lineField: 'invoice_line_ids', cost: 'cost_price_unit', amount: 'price_subtotal', product: 'product_id', item: /^\s*Bill\s*$/,
        totals: { subtotal: 'amount_untaxed', shipping: 'shipping_handling', tax: 'tax_amount_view', deposit: 'total_container_deposit', insurance: 'insurance', discount: 'total_discount', total: 'amount_total_view' } };
    await this.field(cfg.totals.total).waitFor();
    const number = (await this.recordTitle()).replace(/\s*\(.*\)\s*$/, '');
    const vendor = (await this.read('partner_id')).trim();
    const rows = this.field(cfg.lineField).locator('.o_data_row');
    const lines = [];
    for (let i = 0; i < (await rows.count()); i++) {
      const cell = async (n) => (await rows.nth(i).locator(`td[name="${n}"]`).innerText().catch(() => '')).trim();
      lines.push({ product: await cell(cfg.product), cost: await cell(cfg.cost), amount: await cell(cfg.amount) });
    }
    const totals = {};
    for (const [k, f] of Object.entries(cfg.totals)) {
      if (await this.field(f).isVisible().catch(() => false)) totals[k] = (await this.field(f).innerText()).trim();
    }
    const text = await this.printReport(cfg.item, `${kind}-${number.replace(/\W+/g, '_')}.pdf`);
    const squeeze = (t) => String(t).replace(/\s+/g, '');
    const pdf = squeeze(text);
    const num = (t) => parseFloat(String(t).replace(/[^0-9.-]/g, ''));
    const money = (t) => squeeze(String(t).startsWith('$') ? t : `$ ${t}`);
    expect.soft(pdf, `${kind} PDF shows number ${number}`).toContain(squeeze(number));
    expect.soft(pdf, `${kind} PDF shows vendor ${vendor}`).toContain(squeeze(vendor.split(' (')[0]));
    for (const l of lines) {
      const name = squeeze(l.product.replace(/^\[[^\]]*\]\s*/, '').split(/\s+/).slice(0, 3).join(' '));
      expect.soft(pdf, `${kind} PDF line "${l.product}"`).toContain(name);
      expect.soft(pdf, `${kind} PDF line cost ${l.cost}`).toContain(num(l.cost).toFixed(2));
      expect.soft(pdf, `${kind} PDF line amount ${l.amount}`).toContain(money(l.amount));
    }
    for (const [k, v] of Object.entries(totals)) {
      if (k === 'total' || num(v) !== 0) expect.soft(pdf, `${kind} PDF ${k} ${v} matches the screen`).toContain(money(v));
    }
    return { number, totals, text };
  }

  /**
   * Action > Delete on the open PO. Returns { deleted: true } or { deleted: false, message } when the app blocks it
   * (the blocking dialog is closed).
   */
  async tryDeletePO() {
    await this.openActionMenu('Delete');
    const confirm = this.dialogs().last().locator('.modal-footer button').filter({ hasText: /^(Delete|Ok)$/i }).first();
    if (await appears(confirm, 5_000)) await confirm.click();
    await this.waitReady();
    const blocked = this.dialogs().filter({ hasText: /Error|cannot|can't|not allowed|cancel/i }).last();
    if (await appears(blocked, 4_000)) {
      const message = (await blocked.locator('.modal-body').innerText().catch(() => '')).trim();
      await blocked.locator('.modal-footer button').first().click();
      await blocked.waitFor({ state: 'hidden' });
      return { deleted: false, message };
    }
    return { deleted: true };
  }

  async cancelPO() {
    await this.click('button_cancel');
    const confirm = this.dialogs().filter({ has: this.page.locator('.modal-footer button') }).last();
    if (await appears(confirm, 3_000)) await confirm.locator('.modal-footer button').filter({ hasText: /^(Ok|Confirm|Yes|Cancel Order)$/i }).first().click();
    await this.waitReady();
    await this.expectNoError();
    await this.expectStatus(/Cancel/i);
  }

  async expectPOGone(name) {
    await this.open('Purchase Order');
    await this.search(name);
    await expect(this.rows(name), `${name} no longer listed`).toHaveCount(0);
  }

  /** Open backorder of a PO (Purchase > Backorders): fill receipt fields -> Verify Quantities Against Bill -> Done. */
  async receiveBackorder(poName, { qty, extras } = {}) {
    await this.backorders();
    await this.search(poName);
    const row = this.rows(poName).filter({ hasText: /Ready|Waiting/ }).first();
    await expect(row, `open backorder of ${poName}`).toBeVisible();
    await row.locator('td.o_data_cell').first().click();
    await this.waitReady();
    const line = this.field('move_ids_without_package').locator('.o_data_row').first();
    await line.waitFor();
    if (extras) await this.fillReceiptExtras(extras);
    if (qty !== undefined) {
      await expect.soft(line.locator('td[name="product_uom_qty"]'), 'backorder ordered qty').toContainText(String(qty));
      await line.locator('td[name="quantity"]').click();
      await line.locator('td[name="quantity"] input').fill(String(qty));
      await line.locator('td[name="quantity"] input').press('Tab');
    }
    await this.save();
    if (extras) await this.expectReceiptExtras(extras);
    const name = await this.recordTitle();
    await this.click('button_validate');
    await this.expectNoError();
    await this.expectStatus(/Done/);
    return { url: this.currentUrl(), name };
  }

  /** PO > Bills smart button: post every draft bill (one per receipt). Returns [{ url, name, total }] of all bills. */
  async postBillsFromPO(poUrl, { expected } = {}) {
    const { today } = require('../utils/dates');
    const list = this.page.locator('.o_list_view .o_data_row');
    // Opens the PO's bills: a list when there are several, else the bill form. Returns the row count (0 = form).
    const openOnce = async () => {
      await this.goto(poUrl);
      await this.page.locator('.o_form_view button[name="action_view_invoice"]').first().click();
      await this.waitReady();
      if (!(await appears(list.first(), 3_000))) return 0;
      await this.page.waitForTimeout(1_000);
      return list.count();
    };
    // Bills are created per receipt, the latest one a little after the receipt is validated: wait for all of them.
    const openBills = async () => {
      let n = 0;
      await expect(async () => {
        n = await openOnce();
        if (expected > 1) expect(n, `bills on the PO (expecting ${expected})`).toBeGreaterThanOrEqual(expected);
      }).toPass({ timeout: 90_000 }).catch(() => {});
      return n;
    };
    const post = async () => {
      await this.field('amount_total_view').waitFor();
      await expect(this.currentStatus()).toHaveText(/Draft|Posted/);
      if (!/Draft/i.test(await this.status())) return;
      const visible = async (f) => appears(this.field(f), 2_000);
      if ((await visible('invoice_date')) && !(await this.read('invoice_date'))) await this.fill({ invoice_date: today() });
      if ((await visible('vendor_invoice')) && !(await this.read('vendor_invoice'))) await this.fill({ vendor_invoice: `VB${String(Date.now()).slice(-8)}` });
      await this.save();
      await this.clickAny(['action_post', 'Post']);
      await this.expectNoError();
      await this.expectStatus(/Posted/);
    };
    // Post draft bills one at a time (the list re-sorts after each post).
    for (let guard = 0; guard < 10; guard++) {
      const n = await openBills();
      if (!n) { await post(); break; }
      const draft = list.filter({ hasText: /Draft/ }).first();
      if (!(await draft.count())) break;
      await draft.locator('td.o_data_cell').first().click();
      await this.waitReady();
      await post();
    }
    const n = await openBills();
    const bills = [];
    if (!n) {
      await this.expectStatus(/Posted/);
      bills.push({ url: this.currentUrl(), name: await this.recordTitle(), total: await this.readMoney('amount_total_view') });
    }
    // Several bills: read them off the list (number, total, status).
    for (let i = 0; i < n; i++) {
      const row = list.nth(i);
      const cell = async (f) => (await row.locator(`td[name="${f}"]`).innerText().catch(() => '')).trim();
      await expect.soft(row, `bill ${await cell('name')} posted`).toContainText('Posted');
      bills.push({ name: await cell('name'), total: parseMoney(await cell('amount_total_view') || await cell('amount_total_signed') || await cell('amount_total')) });
    }
    return bills;
  }

  async backorders() {
    await this.open('Backorders');
  }
}

module.exports = { PurchasePage };
