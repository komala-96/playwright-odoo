const { expect, test } = require('@playwright/test');
const { appears } = require('../utils/wait');
const { OdooPage } = require('./OdooPage');
const { expectMoney, round2 } = require('../utils/money');

// Totals blocks. Same meaning on order and invoice, different field names.
const ORDER_TOTALS = {
  subtotal: 'amount_untaxed',
  shipping: 'shipping_handling',
  insurance: 'insurance',
  discount: 'total_discount_view',
  tax: 'tax_amount_view',
  deposit: 'container_deposit_view',
  total: 'amount_total',
};
const INVOICE_TOTALS = {
  subtotal: 'amount_untaxed',
  shipping: 'shipping_handling',
  insurance: 'insurance',
  discount: 'total_discount',
  tax: 'tax_amount_view',
  deposit: 'total_container_deposit',
  total: 'amount_total_view',
  residual: 'amount_residual',
};

/**
 * AveriGo order-to-cash (Customer Care):
 *   Orders > New -> customer -> "Show All Products" -> Products [Add] / Service Products [Add]
 *   -> quantities -> Save -> Confirm
 *   -> Delivery > Pick List -> select order -> Packing Slip -> Select All Pack Slip -> Confirm Packing Slip -> Ok
 *   -> Delivery > Packing Slip -> Select All Delivery -> Delivery -> Confirm Delivery
 *   -> invoice is created and posted automatically (order "Invoices" smart button).
 */
class SalesPage extends OdooPage {
  async openOrders() {
    await this.openApp('Customer Care');
    await this.openMenu('Orders');
  }

  /** lines: [{ product: {code, name}, qty, service? }] */
  /**
   * Customer Care > Orders > New. lines: [{ product, qty, price?, service?, uom?, desc?, internalMsg?, bin? }].
   * extras (optional, TC-026 fills every visible field): { header: {...}, invoiceAddress, deliveryAddress,
   * warehouse, route, dropLocation: true (first offered), shipVia: true (first offered) }.
   */
  async createOrder({ customer, lines, extras }) {
    await this.openOrders();
    await this.clickNew();
    await this.fill({ partner_id: customer });
    await this.fill({ sell_all_item: true });
    // "Add Associated Products" re-computes the lines when toggled: set it before adding products.
    const { associated_product: assoc, ...header } = extras?.header || {};
    if (assoc !== undefined) await this.fill({ associated_product: assoc });
    if (extras) extras = { ...extras, header };
    // Products already on the order (e.g. brought in by "Add Associated Products") can't be picked again:
    // only add the missing ones; quantity / price are set on every line below.
    await this.waitReady();
    const present = (await this.field('order_line').locator('.o_data_row td[name="product_code"]').allInnerTexts()).map((t) => t.trim());
    const goods = lines.filter((l) => !l.service && !present.includes(l.product.code));
    const services = lines.filter((l) => l.service && !present.includes(l.product.code));
    if (goods.length) {
      // Search by product code (shown as "[code] name"); some full names aren't matched by the picker search.
      await this.fill({ cus_product_assoc_ids: goods.map((l) => l.product.code) });
      await this.field('add_button').locator('button').click();
      await this.waitReady();
    }
    if (services.length) {
      await this.fill({ service_product_ids: services.map((l) => l.product.name) });
      await this.field('is_add_service_product_button').locator('button').click();
      await this.waitReady();
    }
    for (const l of lines) {
      // UoM first: changing it re-prices the line.
      if (l.uom) await this.setLineCell(l.product.code, 'product_uom', l.uom);
      await this.setLineQty(l.product.code, l.qty);
      if (l.price !== undefined) await this.setLineCell(l.product.code, 'unit_price', l.price);
      if (l.desc) await this.setLineCell(l.product.code, 'desc', l.desc);
      if (l.internalMsg) await this.setLineCell(l.product.code, 'internal_msg', l.internalMsg);
      if (l.bin) await this.setLineCell(l.product.code, 'bin_location_id', l.bin);
    }
    if (extras) await this.fillOrderExtras(extras);
    await this.save();
    return { url: this.currentUrl(), name: await this.recordTitle() };
  }

  /** Edits one cell of an order line (rows re-render while editing, so the row is re-located each time). */
  async setLineCell(code, name, value) {
    const row = this.orderLine(code);
    await row.waitFor();
    await row.locator(`td[name="${name}"]`).click();
    // Edit only this product's row (the previous row can still be the selected one right after the click).
    const editing = this.field('order_line').locator('.o_data_row.o_selected_row').filter({ hasText: code });
    await expect(async () => {
      if (!(await editing.count())) await this.orderLine(code).locator(`td[name="${name}"]`).click();
      await expect(editing).toHaveCount(1, { timeout: 3_000 });
    }).toPass({ timeout: 30_000 });
    if (name === 'product_uom') {
      // The line UoM list shows "<UoM> (12) (Unit)" and typing doesn't find it: open the list and pick by name.
      const input = editing.locator('.o_field_widget[name="product_uom"] input').first();
      await expect(async () => {
        await input.click();
        // Clear the current UoM completely (a leftover "(Unit)" filters the list), then show all options.
        await input.press('Control+a');
        await input.press('Backspace');
        let item = this.page.locator('.o-autocomplete--dropdown-item').filter({ hasText: value }).first();
        if (!(await appears(item, 3_000))) {
          await input.fill(String(value).split('-').slice(0, 2).join('-')); // e.g. "UOM-QA"
          item = this.page.locator('.o-autocomplete--dropdown-item').filter({ hasText: value }).first();
        }
        await item.click({ timeout: 5_000 });
        await this.waitReady();
        await expect(input).toHaveValue(new RegExp(String(value).replace(/[.*+?^${}()|[\]\\]/g, '\\$&')), { timeout: 5_000 });
      }).toPass({ timeout: 60_000 });
    } else {
      await this.fill({ [name]: value }, editing);
    }
    await this.page.keyboard.press('Escape').catch(() => {});
    await this.waitReady();
  }

  /** Header / Address / Other Info fields of a sales order (see createOrder). Returns the labels picked. */
  async fillOrderExtras(x) {
    const picked = {};
    for (const [f, v] of Object.entries(x.header || {})) await this.fill({ [f]: v });
    // No Ship Via records exist on this instance: x.shipVia is a name, created from the picker when missing.
    if (x.shipVia) {
      await this.fill({ ship_via: x.shipVia });
      const quick = this.dialogs().filter({ has: this.page.locator('.o_form_view') }).last();
      if (await appears(quick, 2_000)) await quick.locator('.modal-footer button').filter({ hasText: /^Save/ }).first().click();
      picked.ship_via = x.shipVia;
    }
    await this.openTab('Address');
    if (x.invoiceAddress) await this.fill({ partner_invoice_id: x.invoiceAddress });
    if (x.deliveryAddress) await this.fill({ partner_shipping_id: x.deliveryAddress });
    await this.openTab('Other Info');
    if (x.warehouse) await this.fill({ warehouse_id: x.warehouse });
    if (x.route) await this.fill({ route_id: x.route });
    if (x.dropLocation) picked.drop_location_id = await this.pickFirstOption('drop_location_id');
    await this.openTab('Order Lines');
    this.lastOrderPicked = picked;
    return picked;
  }

  /** Re-reads what fillOrderExtras / line extras set on the open order. */
  async expectOrderExtras(x, lines = [], picked = {}) {
    const num = (v) => parseFloat(String(v).replace(/[^0-9.-]/g, ''));
    for (const [f, v] of Object.entries(x.header || {})) {
      if (typeof v === 'boolean') {
        expect.soft(await this.field(f).locator('input[type="checkbox"]').first().isChecked(), f).toBe(v);
        continue;
      }
      const shown = await this.read(f);
      if (typeof v === 'number') expect.soft(num(shown), f).toBe(v);
      else expect.soft(shown, f).toContain(v);
    }
    if (picked.ship_via) expect.soft(await this.read('ship_via'), 'ship via').toContain(picked.ship_via);
    for (const l of lines) {
      const row = this.orderLine(l.product.code);
      expect.soft(num(await row.locator('td[name="product_uom_qty"]').innerText()), `${l.product.code} quantity`).toBe(l.qty);
      if (l.price !== undefined) expect.soft(num(await row.locator('td[name="unit_price"]').innerText()), `${l.product.code} price`).toBe(l.price);
      for (const [key, col] of [['uom', 'product_uom'], ['desc', 'desc'], ['internalMsg', 'internal_msg'], ['bin', 'bin_location_id']]) {
        if (l[key]) await expect.soft(row.locator(`td[name="${col}"]`), `${l.product.code} ${col}`).toContainText(l[key]);
      }
    }
    await this.openTab('Address');
    if (x.invoiceAddress) expect.soft(await this.read('partner_invoice_id'), 'invoice address').toContain(x.invoiceAddress);
    if (x.deliveryAddress) expect.soft(await this.read('partner_shipping_id'), 'delivery address').toContain(x.deliveryAddress);
    await this.openTab('Other Info');
    if (x.warehouse) expect.soft(await this.read('warehouse_id'), 'location').toContain(x.warehouse);
    if (x.route) expect.soft(await this.read('route_id'), 'route').toContain(x.route);
    if (picked.drop_location_id) expect.soft(await this.read('drop_location_id'), 'drop off location').toContain(picked.drop_location_id);
    await this.openTab('Order Lines');
  }

  /** Confirmed order -> Cancel (answers a confirmation / reason dialog if one appears) -> status Cancelled. */
  async cancelOrder() {
    await this.click('action_cancel_order');
    const dlg = this.dialogs().filter({ has: this.page.locator('.modal-footer button') }).last();
    if (await appears(dlg, 3_000)) {
      for (const f of ['reason', 'cancel_reason', 'cancel_reason_id', 'closed_reason']) {
        const fld = dlg.locator(`.o_field_widget[name="${f}"]`);
        if (await fld.isVisible().catch(() => false)) {
          if (await fld.locator('input').count()) await this.pickFirstOption(f, dlg).catch(() => this.fill({ [f]: 'QA cancel' }, dlg));
          else await this.fill({ [f]: 'QA cancel' }, dlg);
        }
      }
      await dlg.locator('.modal-footer button').filter({ hasText: /^(Ok|Confirm|Cancel Order|Yes|Discard Order)$/i }).first()
        .or(dlg.locator('.modal-footer .btn-primary').first()).first().click();
      await this.waitReady();
    }
    await this.expectNoError();
    await this.expectStatus(/Cancel/i);
  }

  /** Deletes the open order (Action > Delete > confirm) and checks it's gone from Orders. */
  async deleteOrder(name) {
    await this.openActionMenu('Delete');
    const confirm = this.dialogs().last().locator('.modal-footer button').filter({ hasText: /^(Delete|Ok)$/i }).first();
    if (await appears(confirm, 5_000)) await confirm.click();
    await this.waitReady();
    await this.expectNoError();
    await this.openOrders();
    await this.search(name);
    await expect(this.rows(name), `${name} no longer listed`).toHaveCount(0);
  }

  /** Opens a sales order from Orders by its number (S…). */
  async openOrder(name) {
    await this.openOrders();
    await this.openRecord(name);
  }

  orderLine(code) {
    return this.field('order_line').locator('.o_data_row').filter({ hasText: code }).first();
  }

  async setLineQty(code, qty) {
    const row = this.orderLine(code);
    await row.waitFor();
    await row.locator('td[name="product_uom_qty"]').click();
    const input = row.locator('td[name="product_uom_qty"] input');
    await input.fill(String(qty));
    await input.press('Tab');
    await this.waitReady();
  }

  async orderTotals() {
    await this.field(ORDER_TOTALS.total).waitFor();
    return this.readAmounts(ORDER_TOTALS);
  }

  async invoiceTotals() {
    await this.field(INVOICE_TOTALS.total).waitFor();
    return this.readAmounts(INVOICE_TOTALS);
  }

  async lineSubtotals(o2m = 'order_line') {
    const texts = await this.field(o2m).locator('.o_data_row td[name="price_subtotal"]').allInnerTexts();
    return texts.map((t) => parseFloat(t.replace(/[^0-9.-]/g, '')) || 0);
  }

  /** Per order line: code, Taxable (Yes/No), container deposit and subtotal. */
  async lineInfo() {
    const rows = this.field('order_line').locator('.o_data_row');
    const out = [];
    for (let i = 0; i < (await rows.count()); i++) {
      const r = rows.nth(i);
      const cell = async (n) => (await r.locator(`td[name="${n}"]`).innerText().catch(() => '')).trim();
      const num = (t) => parseFloat(t.replace(/[^0-9.-]/g, '')) || 0;
      out.push({
        code: await cell('product_code'),
        taxable: /^yes$/i.test(await cell('tax_status')),
        deposit: num(await cell('container_deposit_amount')),
        subtotal: num(await cell('price_subtotal')),
      });
    }
    return out;
  }

  /**
   * Tax is charged only on taxable lines, at one location rate:
   * no taxable lines -> tax 0; otherwise tax / taxable subtotal = the same rate on every order.
   */
  /**
   * Tax only on taxable lines, at the rate learned for this customer (first / largest taxable base seen).
   * One rate per customer: a customer's Subsidy changes its effective rate. The run-wide 'salesTaxRate' (used by the
   * tax report and direct-bill checks) is learned only from customers without a subsidy.
   */
  async expectTaxOnTaxableLinesOnly(totals, { nonTaxable = [], noDeposit = [], customer } = {}, state) {
    const lines = await this.lineInfo();
    for (const code of nonTaxable) expect(lines.find((l) => l.code === code)?.taxable, `${code} line is non-taxable`).toBe(false);
    for (const code of noDeposit) expectMoney(lines.find((l) => l.code === code)?.deposit ?? 0, 0, `${code} container deposit`);
    const taxable = lines.filter((l) => l.taxable).reduce((a, l) => a + l.subtotal, 0);
    if (taxable === 0) return expectMoney(totals.tax, 0, 'Tax with no taxable lines');
    const rate = totals.tax / taxable;
    expect(rate, 'sales tax rate').toBeGreaterThan(0);
    if (state) {
      // The rate is derived from a rounded tax amount, so it is only as precise as the base it came from:
      // allow that rounding error, and refine the rate from the largest taxable base seen.
      const key = customer ? `salesTaxRate:${customer}` : 'salesTaxRate';
      const known = state.optional(key);
      const base = state.optional(`${key}:base`) || taxable;
      if (known !== undefined) {
        const tolerance = 0.005 + (taxable * 0.005) / base;
        expect(Math.abs(totals.tax - taxable * known), `Tax ${totals.tax} = taxable subtotal ${taxable} x rate ${(known * 100).toFixed(3)}% for ${customer || 'the run'} (±${tolerance.toFixed(3)})`).toBeLessThanOrEqual(tolerance + 1e-9);
      }
      if (known === undefined || taxable > base) {
        state.set(key, rate);
        state.set(`${key}:base`, taxable);
      }
      // Run-wide rate (tax report / direct bill): only from customers without a subsidy.
      const d = require('../data/testData');
      const subsidised = [d.customer1, d.customer2].some((c) => c.name === customer && (c.taxes || []).includes('Subsidy'));
      if (customer && !subsidised) {
        const runBase = state.optional('salesTaxBase') || 0;
        if (state.optional('salesTaxRate') === undefined || taxable > runBase) {
          state.set('salesTaxRate', rate);
          state.set('salesTaxBase', taxable);
        }
      }
    }
  }

  /** Subtotal = sum(lines); Total = Subtotal + S&H + Insurance + Tax + Deposit - Discount. */
  async expectTotalsConsistent(totals, o2m = 'order_line') {
    const lines = await this.lineSubtotals(o2m);
    if (lines.length) expectMoney(totals.subtotal, lines.reduce((a, b) => a + b, 0), 'Subtotal = sum of line subtotals');
    const expected = totals.subtotal + totals.shipping + totals.insurance + totals.tax + totals.deposit - Math.abs(totals.discount);
    expectMoney(totals.total, round2(expected), 'Total = Subtotal + S&H + Insurance + Tax + Deposit - Discount');
  }

  /** Confirms the quotation; returns the sales order number (Q… becomes S…). */
  async confirmOrder() {
    await this.click('action_confirm');
    // Wait for the outcome: a validation error can pop up a moment after the click.
    const error = this.dialogs().filter({ hasText: /Error|Warning|Note:/ });
    await expect.poll(async () => (await error.count()) > 0 || !(await this.button('action_confirm').isVisible().catch(() => false)), { timeout: 30_000 }).toBe(true);
    await this.expectNoError();
    await expect(this.button('action_confirm')).toBeHidden();
    await expect(this.page.locator('.o_breadcrumb .active, .o_last_breadcrumb_item').first()).not.toHaveText(/^\s*Q\d+/);
    return this.recordTitle();
  }

  /**
   * Pick List -> Packing Slip -> Confirm Packing Slip -> Packing Slip -> Delivery -> Confirm Delivery.
   * pickQty: { productName: qty } to pick/deliver less than ordered (creates a backorder).
   */
  async deliver(orderName, { pickQty = {}, extraLines = [] } = {}) {
    await this.openApp('Customer Care');
    await this.openMenu('Delivery', 'Pick List');
    const pick = this.rows(orderName).first();
    await pick.waitFor();
    await pick.locator('td.o_list_record_selector').click();
    await this.page.locator('.o_control_panel button').filter({ hasText: /^\s*Packing Slip\s*$/ }).click();
    // Pin the dialog that holds the slip (other confirmation dialogs open on top of it).
    const slip = this.page.locator('.modal:visible').filter({ has: this.page.locator('.o_field_widget[name="select_all_pick"], .o_field_widget[name="select_all_delivery"]') }).last();
    await slip.locator('.o_field_widget[name="select_all_pick"]').waitFor();
    for (const [code, qty] of Object.entries(pickQty)) {
      const row = slip.locator('.o_field_widget[name="pick_list_ids"] .o_data_row').filter({ hasText: code }).first();
      await row.locator('td[name="sale_picking_qty"]').click();
      await row.locator('td[name="sale_picking_qty"] input').fill(String(qty));
      await row.locator('td[name="sale_picking_qty"] input').press('Tab');
    }
    await this.fill({ select_all_pick: true }, slip);
    // Confirm -> (partial pick: Backorder wizard -> Continue -> slip back in Draft, confirm again) -> optional Ok.
    for (let attempt = 0; attempt < 3; attempt++) {
      const host = (await slip.isVisible().catch(() => false)) ? slip : this.page.locator('.o_action_manager .o_form_view').first();
      const confirm = host.locator('button[name="confirm_pack_slip"]');
      if (!(await appears(confirm, 3_000))) break;
      // The button can vanish just as the slip finishes confirming: that means it's done.
      if (!(await confirm.click({ timeout: 5_000 }).then(() => true, () => false))) break;
      const backorder = this.page.locator('.modal:visible').filter({ hasText: /create backorder/i }).last();
      const okDialog = this.page.locator('.modal:visible').filter({ hasText: /mobile device|Confirmation/i }).last();
      // Wait for the outcome: backorder wizard, "mobile device" confirmation, or the slip leaving Draft.
      await expect.poll(async () =>
        (await backorder.isVisible().catch(() => false)) ||
        (await okDialog.isVisible().catch(() => false)) ||
        !(await confirm.isVisible().catch(() => false)),
      { timeout: 20_000 }).toBe(true);
      if (await backorder.isVisible().catch(() => false)) {
        // Tick the order's "Backorder" cell (clicking the cell toggles it; forced checks don't register).
        const rowCheck = backorder.locator('.o_data_row').filter({ hasText: orderName }).first().locator('input[type="checkbox"]').first();
        if (!(await rowCheck.isChecked())) await backorder.locator('.o_data_row').filter({ hasText: orderName }).first().locator('td[name]').last().click();
        await expect(rowCheck).toBeChecked();
        await backorder.locator('button').filter({ hasText: /^\s*Continue\s*$/ }).click();
        await this.waitReady();
        await this.expectNoError();
        // The wizard can linger after the backorder is created. Do NOT cancel/Escape it (that reverts the
        // slip to Draft); the slip is already In progress, so carry on from the Packing Slip menu.
        await this.page.waitForTimeout(2_000);
        break;
      }
      // "Move to the mobile device" confirmation appears on some slips.
      const ok = this.page.locator('.modal:visible').filter({ hasText: /mobile device|Confirmation/i }).last().locator('button').filter({ hasText: /^\s*Ok\s*$/ });
      if (await appears(ok, 5_000)) await ok.click();
      await this.waitReady();
      await this.expectNoError();
    }

    // The slip dialog usually switches to "In progress" with a Delivery button; otherwise open it from Delivery > Packing Slip.
    let scope = slip;
    const slipName = (await scope.locator('.o_field_widget[name="name"]').innerText({ timeout: 10_000 }).catch(() => '')).trim();
    if (!(await appears(scope.locator('button[name="deliver_pack_slip_wizard"]'), 5_000))) {
      await this.openApp('Customer Care');
      await this.openMenu('Delivery', 'Packing Slip');
      if (slipName) {
        await this.openRecord(slipName);
      } else {
        await this.openSlipContaining(orderName);
      }
      scope = this.page.locator('.o_action_manager .o_form_view').first();
    }
    // After a backorder the slip can still be in Draft: confirm it (again).
    if (await appears(scope.locator('button[name="confirm_pack_slip"]'), 2_000)) {
      await scope.locator('button[name="confirm_pack_slip"]').click();
      const ok = this.page.locator('.modal:visible').filter({ hasText: /mobile device|Confirmation/i }).last().locator('button').filter({ hasText: /^\s*Ok\s*$/ });
      if (await appears(ok, 5_000)) await ok.click();
      await this.waitReady();
      await this.expectNoError();
    }
    await scope.locator('button[name="deliver_pack_slip_wizard"]').waitFor();
    await expect(scope.locator('.o_data_row').filter({ hasText: orderName }).first()).toBeVisible();
    // The slip can still be refreshing after its confirmation and undo the tick: make sure the order's row is
    // selected right before Delivery ("Please select packslip or invoice to process" otherwise).
    // The row's delivery checkbox field (not the list's record selector, which is screen-only).
    const orderRowCheck = scope.locator('.o_field_widget[name="sale_detail_ids"] .o_data_row').filter({ hasText: orderName }).first()
      .locator('td:not(.o_list_record_selector) input[type="checkbox"]').first();
    await expect(async () => {
      await this.waitReady();
      if (!(await orderRowCheck.isChecked().catch(() => false))) {
        await this.fill({ select_all_delivery: false }, scope);
        await this.fill({ select_all_delivery: true }, scope);
      }
      // Still not ticked: tick the order row's own checkbox (it sits off-screen in the wide table).
      if (!(await orderRowCheck.isChecked().catch(() => false))) {
        await orderRowCheck.scrollIntoViewIfNeeded().catch(() => {});
        await orderRowCheck.click({ force: true }).catch(() => {});
        await this.waitReady();
      }
      await this.page.waitForTimeout(1_000);
      expect(await orderRowCheck.isChecked()).toBe(true);
    }).toPass({ timeout: 45_000 });
    // "Please select packslip or invoice to process": the tick didn't reach the server yet - close and retry.
    for (let attempt = 0; attempt < 3; attempt++) {
      await scope.locator('button[name="deliver_pack_slip_wizard"]').click();
      await this.waitReady();
      // Wait for the outcome: the Delivery Details wizard, or the "nothing selected" error (can come late).
      const notSelected = this.dialogs().filter({ hasText: /Please select packslip or invoice/i }).last();
      const deliveryWizard = this.dialogs().filter({ has: this.page.locator('.o_field_widget[name="delivery_move_line_ids"]') }).last();
      await expect.poll(async () => (await notSelected.isVisible().catch(() => false)) || (await deliveryWizard.isVisible().catch(() => false)), { timeout: 20_000 }).toBe(true);
      if (!(await notSelected.isVisible().catch(() => false))) break;
      await notSelected.locator('.modal-footer button').filter({ hasText: /^Close$/ }).click();
      await notSelected.waitFor({ state: 'hidden' });
      await this.fill({ select_all_delivery: false }, scope);
      await this.fill({ select_all_delivery: true }, scope);
      await this.page.waitForTimeout(1_500);
    }
    const wizard = this.page.locator('.modal:visible').last();
    for (const [code, qty] of Object.entries(pickQty)) {
      const row = wizard.locator('.o_data_row').filter({ hasText: code }).first();
      const cell = row.locator('td[name="quantity_done"], td[name="deliver_qty"], td[name="quantity"]').first();
      if (await cell.isVisible().catch(() => false)) {
        await cell.click();
        await cell.locator('input').fill(String(qty));
      }
    }
    // Delivery wizard "Add a line": deliver an extra product for the same order (Order No / Product / Qty).
    for (const x of extraLines) {
      const list = wizard.locator('.o_field_widget[name="delivery_move_line_ids"]');
      await list.locator('.o_data_row').first().waitFor();
      const before = await list.locator('.o_data_row').count();
      await list.locator('.o_field_x2many_list_row_add a').first().click();
      const row = list.locator('.o_data_row').nth(before);
      await row.waitFor();
      const editing = list.locator('.o_data_row.o_selected_row');
      // Pick from the dropdown with the keyboard (clicking the option can miss while the list re-renders).
      const pickByKeyboard = async (name, value, optionText) => {
        const input = editing.locator(`.o_field_widget[name="${name}"] input`).first();
        await expect(async () => {
          await input.click();
          await input.fill(String(value));
          const option = this.page.locator('.o-autocomplete--dropdown-item').filter({ hasText: optionText }).first();
          await option.waitFor({ timeout: 10_000 });
          // The first option is already highlighted: Enter picks it (ArrowDown would move to "Search More...").
          await input.press('Enter');
          await this.waitReady();
          // If "Search More..." opened anyway, pick the record from its list.
          const search = this.page.locator('.modal:visible').filter({ hasText: /^\s*Search:/ }).last();
          if (await search.isVisible().catch(() => false)) {
            await search.locator('.o_data_row').filter({ hasText: optionText }).first().locator('td.o_data_cell').first().click();
            await search.waitFor({ state: 'hidden' });
          }
          await expect(input).toHaveValue(new RegExp(String(optionText).replace(/[.*+?^${}()|[\]\\]/g, '\\$&')), { timeout: 5_000 });
        }).toPass({ timeout: 60_000 });
      };
      await pickByKeyboard('sale_id', orderName, orderName);
      await pickByKeyboard('product_id', x.product.code, x.product.name);
      await row.locator('td[name="deliver_qty"]').click().catch(() => {});
      await this.fill({ deliver_qty: x.qty }, list.locator('.o_data_row.o_selected_row'));
      await this.page.keyboard.press('Tab');
      await this.waitReady();
      // Leave edit mode (values in inputs aren't row text), then find the new line by product, not position.
      await wizard.locator('.modal-title, .modal-header').first().click().catch(() => {});
      await this.waitReady();
      const added = list.locator('.o_data_row').filter({ hasText: x.product.name });
      await expect(added, `extra delivery line ${x.product.name}`).toHaveCount(1);
      x.price = parseFloat((await added.locator('td[name="price"]').innerText()).replace(/[^0-9.-]/g, '')) || 0;
    }
    await wizard.locator('button[name="action_confirm_delivery"]').click();
    await this.waitReady();
    await this.expectNoError();
    // The slip dialog closes after delivery; when it stays open, its line must read Delivered.
    const line = scope.locator('.o_data_row').filter({ hasText: orderName }).first();
    if (await appears(line, 3_000)) await expect(line).toContainText(/Delivered/i);
  }
  /** Delivery > Packing Slip list: newest Draft/In-progress slip that contains the order. */
  async openSlipContaining(orderName) {
    // Sort by Packing No, newest first (verify on the data; header classes vary).
    const header = this.page.locator('.o_list_view th[data-name="name"]');
    const num = async (i) => parseInt(((await this.rows().nth(i).innerText().catch(() => '')).match(/PACK\/(\d+)/) || [])[1] || '0', 10);
    for (let i = 0; i < 2 && (await num(0)) < (await num(1)); i++) {
      await header.click();
      await this.waitReady();
    }
    const texts = await this.rows().filter({ hasText: /In progress|Draft/ }).allInnerTexts();
    const names = texts.map((t) => (t.match(/PACK\/\d+/) || [])[0]).filter(Boolean).slice(0, 8);
    for (const name of names) {
      await this.openMenu('Delivery', 'Packing Slip');
      await this.openRecord(name);
      if (await appears(this.page.locator('.o_form_view .o_data_row').filter({ hasText: orderName }).first(), 5_000)) return;
    }
    throw new Error(`No Draft/In-progress packing slip contains ${orderName}`);
  }

  /** Opens the order's invoice (single) and returns { url, name }. */
  async openInvoice(orderUrl, nth = 0) {
    await this.goto(orderUrl);
    await this.click('action_view_invoice');
    if (await appears(this.page.locator('.o_list_view .o_data_row').first(), 3_000)) {
      // Several invoices: open the nth from the list (retry - the list can re-render under the click).
      await expect(async () => {
        if (await this.field(INVOICE_TOTALS.total).isVisible().catch(() => false)) return;
        const cell = this.page.locator('.o_list_view .o_data_row').nth(nth).locator('td[name="name"], td.o_data_cell').first();
        await cell.click({ timeout: 5_000 });
        await this.waitReady();
        await expect(this.field(INVOICE_TOTALS.total)).toBeVisible({ timeout: 10_000 });
      }).toPass({ timeout: 60_000 });
    }
    await this.field(INVOICE_TOTALS.total).waitFor();
    return { url: this.currentUrl(), name: await this.recordTitle() };
  }

  /**
   * Confirmed order -> "Create Service Invoice" (action_service_invoice): invoices the service lines before
   * delivery. Posts it and returns { url, name, totals }.
   */
  async createServiceInvoice(orderUrl, serviceCode) {
    await this.goto(orderUrl);
    await this.click('action_service_invoice');
    await this.waitReady();
    // A wizard may ask first: take its primary action.
    const wiz = this.dialogs().filter({ has: this.page.locator('.modal-footer .btn-primary') }).last();
    if (await appears(wiz, 3_000)) {
      await wiz.locator('.modal-footer .btn-primary').first().click();
      await this.waitReady();
    }
    await this.expectNoError();
    if (!(await appears(this.field(INVOICE_TOTALS.total), 5_000))) {
      // Not opened directly: find it among the order's invoices.
      await this.goto(orderUrl);
      await this.click('action_view_invoice');
      const row = this.page.locator('.o_list_view .o_data_row').first();
      if (await appears(row, 3_000)) {
        await row.locator('td.o_data_cell').first().click();
        await this.waitReady();
      }
    }
    await this.field(INVOICE_TOTALS.total).waitFor();
    if (serviceCode) await expect(this.page.locator('.o_form_view')).toContainText(serviceCode);
    await this.postInvoice();
    await this.expectStatus(/Posted/);
    return { url: this.currentUrl(), name: await this.recordTitle(), totals: await this.invoiceTotals() };
  }

  /**
   * Prints the open record's PDF (invoice: Action > Invoices; order: Action > Print > Quotation / Order) and checks
   * the header values, every line (qty / price / amount + product) and the totals against the screen.
   * kind: 'invoice' | 'order'.
   */
  async expectPdfMatchesUi(kind) {
    const isInvoice = kind === 'invoice';
    const lineField = isInvoice ? 'invoice_line_ids' : 'order_line';
    const col = isInvoice
      ? { qty: 'quantity', price: 'price_unit', amount: 'price_subtotal', code: 'product_code', product: 'product_id' }
      : { qty: 'product_uom_qty', price: 'unit_price', amount: 'price_subtotal', code: 'product_code', product: 'product_id' };
    const headerFields = isInvoice ? ['name', 'po_no', 'invoice_payment_term_id', 'invoice_origin', 'route_id'] : ['po_no', 'payment_term_id', 'ship_via'];
    const totals = isInvoice ? INVOICE_TOTALS : ORDER_TOTALS;

    // --- screen values
    await this.field(totals.total).waitFor();
    const ui = { header: {}, lines: [], totals: {} };
    if (!isInvoice) ui.header.name = await this.recordTitle();
    for (const f of headerFields) {
      if (await this.field(f).isVisible().catch(() => false)) ui.header[f] = (await this.read(f)).trim();
    }
    if (!isInvoice) {
      await this.openTab('Order Lines').catch(() => {});
    }
    const rows = this.field(lineField).locator('.o_data_row');
    for (let i = 0; i < (await rows.count()); i++) {
      const cell = async (n) => (await rows.nth(i).locator(`td[name="${n}"]`).innerText().catch(() => '')).trim();
      ui.lines.push({ code: await cell(col.code), product: await cell(col.product), qty: await cell(col.qty), price: await cell(col.price), amount: await cell(col.amount) });
    }
    for (const [k, f] of Object.entries(totals)) {
      if (await this.field(f).isVisible().catch(() => false)) ui.totals[k] = (await this.field(f).innerText()).trim();
    }

    // --- PDF
    const text = await this.printReport(isInvoice ? /^\s*Invoices\s*$/ : /^\s*Quotation \/ Order\s*$/, `${kind}-${(ui.header.name || 'record').replace(/\W+/g, '_')}.pdf`);
    const squeeze = (t) => String(t).replace(/\s+/g, '');
    const pdf = squeeze(text);
    const num = (t) => parseFloat(String(t).replace(/[^0-9.-]/g, ''));
    const qtyText = (t) => { const n = num(t); return Number.isInteger(n) ? String(n) : String(n); };

    for (const [f, v] of Object.entries(ui.header)) {
      if (v) expect.soft(pdf, `${kind} PDF shows ${f} "${v}"`).toContain(squeeze(v));
    }
    for (const l of ui.lines) {
      const label = l.code || l.product;
      // qty, price and amount are printed in that order on one row ("2 250.00 $ 500.00").
      expect.soft(pdf, `${kind} PDF line ${label}: qty ${l.qty} x ${l.price} = ${l.amount}`).toContain(`${qtyText(l.qty)}${num(l.price).toFixed(2)}${squeeze(l.amount)}`);
      // Product: its code, or (charge lines without code) the first word of its name.
      const key = l.code || (l.product.split(/\s+/)[0] || '');
      if (key) expect.soft(text.toLowerCase(), `${kind} PDF names the line "${l.product}"`).toContain(key.toLowerCase());
    }
    for (const [k, v] of Object.entries(ui.totals)) {
      if (v && num(v) !== 0) expect.soft(pdf, `${kind} PDF ${k} ${v}`).toContain(squeeze(v.startsWith('$') ? v : `$ ${v}`));
    }
    // Unfilled template placeholders (e.g. "employee_discount = ...").
    expect.soft(text, `${kind} PDF has no unfilled template text`).not.toMatch(/\b[a-z]+_[a-z_]+\s*=/);
    return { ui, text };
  }

  /** Every invoice of an order (smart button), each posted; [{ url, name, totals }]. */
  async orderInvoices(orderUrl) {
    await this.goto(orderUrl);
    const n = await this.invoiceCount();
    const out = [];
    for (let i = 0; i < n; i++) {
      const inv = await this.openInvoice(orderUrl, i);
      await this.postInvoice();
      const lines = await this.page.locator('.o_form_view .o_field_one2many').first().innerText().catch(() => '');
      out.push({ ...inv, totals: await this.invoiceTotals(), lines });
    }
    return out;
  }

  async postInvoice() {
    const post = this.button('action_post');
    if (await post.isVisible().catch(() => false)) {
      await post.click();
      await this.waitReady();
      await this.expectNoError();
    }
  }

  /** TC-026 pattern: order -> check -> confirm -> deliver -> auto invoice -> compare. */
  async orderToInvoice({ customer, lines, expectations = {}, extras }) {
    const order = await this.createOrder({ customer, lines, extras });
    if (extras) await this.expectOrderExtras(extras, lines, this.lastOrderPicked);
    const ot = await this.orderTotals();
    await this.expectTotalsConsistent(ot);
    await this.expectTaxOnTaxableLinesOnly(ot, { ...expectations, customer }, expectations.state);
    if (expectations.taxPositive) expect(ot.tax, 'Tax should be applied').toBeGreaterThan(0);
    if (expectations.depositPositive) expect(ot.deposit, 'Container deposit should be applied').toBeGreaterThan(0);

    order.name = await this.confirmOrder();
    // Customer charges (Fuel Charge / Hazard Fee / Subsidy, from Setup > Default Setup) are added when the
    // order is confirmed: re-read the order totals and compare the invoice with those.
    const oc = await this.orderTotals();
    const charges = round2(oc.subtotal - ot.subtotal);
    if (expectations.charges) {
      expect(charges, 'Fuel / Hazard / Subsidy charges added on confirmation').toBeGreaterThan(0);
      test.info().annotations.push({ type: 'Customer charges', description: `+${charges.toFixed(2)} added to ${order.name} on confirmation` });
    } else {
      expectMoney(charges, 0, 'No customer charges added on confirmation');
    }
    let serviceInvoice = null;
    if (expectations.serviceInvoice) {
      serviceInvoice = await test.step('Create Service Invoice (confirmed order)', () => this.createServiceInvoice(order.url, expectations.serviceInvoice));
    }
    await this.deliver(order.name, { extraLines: expectations.deliveryExtraLines || [] });

    if (serviceInvoice || expectations.deliveryExtraLines?.length) {
      // Several invoices (service + delivery) and/or an extra product delivered: together the invoices must equal
      // the order plus the extra delivered product, and S&H / insurance / discount must be charged only once.
      const extras = expectations.deliveryExtraLines || [];
      const extraSubtotal = round2(extras.reduce((a, x) => a + x.price * x.qty, 0));
      await this.goto(order.url);
      const od = await this.orderTotals();
      const invoices = await this.orderInvoices(order.url);
      expect(invoices.length, 'service invoice + delivery invoice').toBeGreaterThanOrEqual(serviceInvoice ? 2 : 1);
      const sum = (k) => round2(invoices.reduce((a, i) => a + (i.totals[k] || 0), 0));
      test.info().annotations.push({ type: 'Invoices', description: `${order.name}: ${invoices.map((i) => `${i.name} ${i.totals.total}`).join(', ')}` });
      if (expectations.compareTotals !== false) {
        expect.soft(Math.abs(sum('subtotal') - (od.subtotal + extraSubtotal)), `Invoices subtotal ${sum('subtotal')} = order ${od.subtotal} + delivered extras ${extraSubtotal}`).toBeLessThan(0.005);
        for (const k of ['shipping', 'insurance', 'discount']) {
          expect.soft(Math.abs(sum(k) - Math.abs(od[k])), `${k} charged once across invoices: ${invoices.map((i) => i.totals[k]).join(' + ')} vs order ${od[k]}`).toBeLessThan(0.005);
        }
      }
      for (const x of extras) {
        const inv = invoices.find((i) => i.lines?.includes(x.product.code)) || null;
        expect.soft(inv, `${x.product.name} (added at Delivery) is invoiced`).not.toBeNull();
      }
      const main = invoices.find((i) => !serviceInvoice || i.name !== serviceInvoice.name) || invoices[0];
      expectMoney(main.totals.residual, main.totals.total, 'Amount due = invoice total (unpaid)');
      if (expectations.checkPdfs) {
        await test.step('Invoice PDF matches the invoice screen', async () => {
          await this.goto(main.url);
          await this.expectPdfMatchesUi('invoice');
        });
        await test.step('Order PDF matches the order screen', async () => {
          await this.goto(order.url);
          await this.expectPdfMatchesUi('order');
        });
      }
      return { orderUrl: order.url, orderName: order.name, invoiceUrl: main.url, invoiceName: main.name, order: od, invoice: main.totals, charges, serviceInvoice, invoices };
    }

    const invoice = await this.openInvoice(order.url);
    await this.postInvoice();
    await this.expectStatus(/Posted/);
    const it = await this.invoiceTotals();
    // Soft: a mismatch is reported (test fails) but the flow continues so later cases get the invoice.
    for (const k of Object.keys(ORDER_TOTALS)) expect.soft(Math.abs(it[k] - oc[k]), `Invoice ${k} ${it[k]} vs confirmed order ${k} ${oc[k]}`).toBeLessThan(0.005);
    for (const name of expectations.charges || []) {
      // Charge products are named per instance (martiserv "subsidy product", ultraserv "Subsidy - Other"): match the key word.
      const word = new RegExp(name.split(' ')[0].replace(/y$/, ''), 'i');
      await expect.soft(this.field('invoice_line_ids'), `${name} line on the invoice`).toContainText(word);
    }
    expectMoney(it.residual, it.total, 'Amount due = invoice total (unpaid)');
    return { orderUrl: order.url, orderName: order.name, invoiceUrl: invoice.url, invoiceName: invoice.name, order: oc, invoice: it, charges };
  }

  // ---------- returns (TC-042 / TC-043)

  async salesReturn({ invoiceUrl, qtyByProduct, reason = 'QA return' }) {
    await this.goto(invoiceUrl);
    await this.clickAny(['Return', 'Sales Return', 'Create Return']);
    const modal = this.page.locator('.modal:visible').last();
    for (const [code, qty] of Object.entries(qtyByProduct)) {
      const row = modal.locator('.o_data_row').filter({ hasText: code }).first();
      await row.locator('td[name="returning_qty"]').click();
      await row.locator('td[name="returning_qty"] input').fill(String(qty));
    }
    await modal.locator('[name="return_reason"] textarea, [name="return_reason"] input').first().fill(reason).catch(() => {});
    await this.clickAny(['create_returns', 'Return', 'Confirm']);
    await this.expectNoError();
    return this.currentUrl();
  }

  // ---------- backorder (TC-053)

  async smartButtonCount(label) {
    const btn = this.page.locator('.oe_button_box button, .o-form-buttonbox button').filter({ hasText: label }).first();
    if (!(await btn.isVisible().catch(() => false))) return 0;
    return parseInt((await btn.innerText()).replace(/[^0-9]/g, ''), 10) || 1;
  }

  async invoiceCount() {
    const btn = this.page.locator('button[name="action_view_invoice"]').filter({ visible: true }).first();
    if (!(await appears(btn, 5_000))) return 0;
    return parseInt((await btn.innerText()).replace(/[^0-9]/g, ''), 10) || 0;
  }
}

module.exports = { SalesPage, ORDER_TOTALS, INVOICE_TOTALS };
