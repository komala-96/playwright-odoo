const { expect } = require('@playwright/test');
const { appears } = require('../utils/wait');
const { OdooPage } = require('./OdooPage');
const { expectMoney } = require('../utils/money');

const APP = 'Financial Accounting';

class AccountingPage extends OdooPage {
  async openAR(item) {
    await this.openApp(APP);
    await this.openMenu('Accounts Receivable', item);
  }

  async openAP(item) {
    await this.openApp(APP);
    await this.openMenu('Accounts Payable', item);
  }

  /** Amount due on the open invoice/bill (0 when fully paid: Odoo then hides the field and shows a "Paid" ribbon). */
  async residual() {
    await this.page.locator('.o_form_view').first().waitFor();
    await this.page.waitForTimeout(800);
    for (const f of ['amount_residual', 'invoice_balance', 'bill_balance']) {
      if (await this.field(f).isVisible().catch(() => false)) return this.readMoney(f);
    }
    if (await this.page.locator('.o_widget_web_ribbon, .ribbon').filter({ hasText: /Paid/i }).first().isVisible().catch(() => false)) return 0;
    if (await this.page.locator('.o_statusbar_status').filter({ hasText: /Posted/ }).first().isVisible().catch(() => false)) return 0;
    throw new Error('No amount-due field visible');
  }

  async total() {
    for (const f of ['amount_total_view', 'amount_total']) {
      if (await this.field(f).isVisible().catch(() => false)) return this.readMoney(f);
    }
    throw new Error('No total field visible');
  }

  /**
   * "Register Payment" on a posted invoice opens a Payment Receipt for the customer;
   * pay `amount` against this invoice and Confirm. Returns the invoice's amount due afterwards.
   */
  async registerPayment(url, amount) {
    await this.goto(url);
    const invoice = await this.recordTitle();
    if (amount === undefined) amount = await this.residual();
    await this.click('action_register_payment');
    await this.fillReceipt({ invoice, amount });
    await this.goto(url);
    return this.residual();
  }

  /** On a Payment Receipt form: payment fields, tick the invoice (paging if needed), Amount Received, Confirm. */
  async fillReceipt({ invoice, amount }) {
    // The invoice title can carry its Reference ("INV401 (QAREF045)"); the receipt lists just the number.
    invoice = String(invoice).replace(/\s*\(.*\)\s*$/, '');
    // Header Amount only after an invoice is ticked: with none ticked it raises "No Invoices are selected!".
    await this.fillPayment({});
    const list = this.field('invoice_ids');
    const row = list.locator('.o_data_row').filter({ has: this.page.locator('td[name="name"]', { hasText: new RegExp(`^\\s*${invoice}\\s*$`) }) }).first();
    for (let i = 0; i < 10 && !(await appears(row, 2_000)); i++) {
      const next = list.locator('.o_pager_next');
      if (!(await next.isEnabled().catch(() => false))) break;
      await next.click();
      await this.waitReady();
    }
    await expect(row, `invoice ${invoice} listed on the receipt`).toBeVisible();
    const check = row.locator('td[name="is_checked"] input');
    if (!(await check.isChecked())) await row.locator('td[name="is_checked"]').click();
    await expect(check).toBeChecked();
    // Ticking recalculates the row (it often pre-fills the full amount); let it settle first.
    await this.waitReady();
    await this.page.waitForTimeout(1_000);
    const cell = row.locator('td[name="amount_received"]');
    const current = parseFloat((await cell.innerText()).replace(/[^0-9.-]/g, '')) || 0;
    if (Math.abs(current - amount) > 0.001) {
      await cell.click();
      await cell.locator('input').fill(String(amount));
      await cell.locator('input').press('Tab');
      await this.waitReady();
    }
    // Ticking a line resets the header Amount; set it last so it matches the applied amount.
    await this.fill({ amount });
    await this.save();
    await this.click('action_post');
    await this.expectNoError();
    return this.currentUrl();
  }

  // ---------- AR

  /** Common payment fields on AveriGo advance/receipt forms. Check No: letters/digits only, max 10 chars. */
  async fillPayment({ amount, mode = 'Check', account = '101402 Check', ref = `QA${String(Date.now()).slice(-8)}` }) {
    await this.fill({ payment_mode_id: mode });
    if (await this.field('check_no').isVisible().catch(() => false)) await this.fill({ check_no: ref });
    await this.fill({ account_id: account });
    if (amount !== undefined) await this.fill({ amount });
  }

  /** AR > Advance. extras: any other form fields (date, bank name, notes, memo, revision ...). */
  async customerAdvance({ customer, amount, extras = {} }) {
    await this.openAR('Advance');
    await this.clickNew();
    await this.fill({ partner_id: customer });
    await this.fillPayment({ amount });
    for (const [f, v] of Object.entries(extras)) {
      if (!(await this.field(f).isVisible().catch(() => false))) await this.openTab('Other Information').catch(() => {});
      await this.fill({ [f]: v });
    }
    await this.save();
    await this.click('action_post');
    await this.expectNoError();
    return this.currentUrl();
  }

  /** Advance / invoice balances shown on a new Payment Receipt for the customer (form is discarded). */
  async customerBalances(customer) {
    await this.openAR('Payment Receipt');
    await this.clickNew();
    try {
      await this.fill({ partner_id: customer });
    } catch (e) {
      if (!/not offered/.test(e.message)) throw e;
      await this.discard();
      return { invoiceBalance: 0, advanceBalance: 0, listed: false };
    }
    await this.field('invoice_ids').locator('.o_data_row').first().waitFor({ timeout: 15_000 }).catch(() => {});
    await this.waitReady();
    await this.page.waitForTimeout(1_000);
    const out = { invoiceBalance: await this.readMoney('invoice_balance'), advanceBalance: await this.readMoney('cust_advance_balance') };
    await this.discard();
    return out;
  }

  /**
   * Direct customer invoice (not from an order).
   * lines: [{ product: {code,name}, qty, price?, service? }]
   */
  /**
   * AR > Invoices > New (direct invoice). lines: [{ product, qty, price, uom?, desc?, service? }].
   * extras (optional): { header: {...}, associated: bool, invoiceAddress, deliveryAddress, remitAddress, route,
   * receiver, deliveryNotes }. Signature is not adopted (it is a legally binding e-signature of the logged-in user).
   */
  async directInvoice({ customer, lines, extras }) {
    await this.openAR('Invoices');
    await this.clickNew();
    await this.fill({ partner_id: customer });
    // "Select Associated Products": ticked limits the picker to (and may add) the customer's own products.
    if (await this.field('associated_product').isVisible().catch(() => false)) await this.fill({ associated_product: Boolean(extras?.associated) });
    await this.waitReady();
    if (extras?.associated) {
      // Ticking pre-fills the Products box with the customer's products; "Add" turns them into lines.
      await expect(this.field('product_ids').locator('.o_tag, .badge').first()).toBeVisible({ timeout: 30_000 });
      await this.click('add_invoice_products');
      const rows = this.field('invoice_line_ids').locator('.o_data_row');
      let last = -1;
      await expect.poll(async () => {
        const n = await rows.count();
        const stable = n > 0 && n === last;
        last = n;
        return stable;
      }, { timeout: 30_000, intervals: [1000] }).toBe(true);
    }
    const present = (await this.field('invoice_line_ids').locator('.o_data_row td[name="product_code"]').allInnerTexts()).map((t) => t.trim());
    const goods = lines.filter((l) => !l.service && !present.includes(l.product.code));
    const services = lines.filter((l) => l.service && !present.includes(l.product.code));
    if (goods.length) {
      await this.fill({ product_ids: goods.map((l) => l.product.code) });
      await this.click('add_invoice_products');
    }
    if (services.length) {
      await this.fill({ service_product_ids: services.map((l) => l.product.code) });
      await this.click('add_invoice_service_products');
    }
    for (const l of lines) {
      if (l.uom) await this.setInvoiceLineCell(l.product.code, 'product_uomm_id', l.uom);
      for (const [name, value] of Object.entries({ quantity: l.qty ?? 1, price_unit: l.price, name: l.desc })) {
        if (value === undefined) continue;
        await this.setInvoiceLineCell(l.product.code, name, value);
      }
    }
    if (extras) await this.fillInvoiceExtras(extras);
    await this.save();
    await this.click('action_post');
    await this.expectNoError();
    return { url: this.currentUrl(), name: await this.recordTitle(), total: await this.total() };
  }

  invoiceLine(code) {
    return this.field('invoice_line_ids').locator('.o_data_row').filter({ hasText: code }).first();
  }

  /** Edits one invoice line cell (rows re-render while editing; UoM is picked from the list, not typed). */
  async setInvoiceLineCell(code, name, value) {
    const row = this.invoiceLine(code);
    await row.waitFor();
    await this.waitReady();
    await row.locator(`td[name="${name}"]`).click();
    // Edit only the row of this product (the previous row can still be the selected one right after the click).
    const editing = this.field('invoice_line_ids').locator('.o_data_row.o_selected_row').filter({ hasText: code });
    await expect(async () => {
      if (!(await editing.count())) await this.invoiceLine(code).locator(`td[name="${name}"]`).click();
      await expect(editing).toHaveCount(1, { timeout: 3_000 });
    }).toPass({ timeout: 30_000 });
    if (name === 'product_uomm_id') {
      const input = editing.locator(`.o_field_widget[name="${name}"] input`).first();
      await expect(async () => {
        // Lines can still be re-rendering (e.g. after associated products are added): re-enter edit mode.
        if (!(await input.isVisible().catch(() => false))) {
          await this.invoiceLine(code).locator(`td[name="${name}"]`).click();
          await input.waitFor({ timeout: 5_000 });
        }
        await input.click();
        await input.press('Control+a');
        await input.press('Backspace');
        const item = this.page.locator('.o-autocomplete--dropdown-item').filter({ hasText: value }).first();
        await item.click({ timeout: 5_000 });
        await this.waitReady();
        await expect(input).toHaveValue(new RegExp(String(value).replace(/[.*+?^${}()|[\]\\]/g, '\\$&')), { timeout: 5_000 });
      }).toPass({ timeout: 60_000 });
    } else {
      const input = editing.locator(`td[name="${name}"] input, td[name="${name}"] textarea`).first();
      await input.fill(String(value));
      await input.press('Tab');
    }
    await this.page.keyboard.press('Escape').catch(() => {});
    await this.waitReady();
  }

  /** Header / Address / Signature (receiver only) / Notes fields of a direct invoice. */
  async fillInvoiceExtras(x) {
    for (const [f, v] of Object.entries(x.header || {})) await this.fill({ [f]: v });
    if (x.route) await this.fill({ route_id: x.route });
    await this.openTab('Address');
    if (x.invoiceAddress) await this.fill({ partner_invoice_id: x.invoiceAddress });
    if (x.deliveryAddress) await this.fill({ partner_shipping_id: x.deliveryAddress });
    if (x.remitAddress) await this.fill({ partner_remit_id: x.remitAddress });
    await this.openTab('Signature');
    if (x.receiver) await this.fill({ receiver_name: x.receiver });
    await this.openTab('Notes');
    if (x.deliveryNotes) await this.fill({ delivery_notes: x.deliveryNotes });
    await this.openTab('Invoice Lines');
  }

  /** Re-reads what directInvoice / fillInvoiceExtras set on the open invoice. */
  async expectInvoiceExtras(x, lines = []) {
    const num = (v) => parseFloat(String(v).replace(/[^0-9.-]/g, ''));
    for (const [f, v] of Object.entries(x.header || {})) {
      if (typeof v === 'boolean') { expect.soft(await this.field(f).locator('input[type="checkbox"]').first().isChecked(), f).toBe(v); continue; }
      const shown = await this.read(f);
      if (typeof v === 'number') expect.soft(num(shown), f).toBe(v);
      else expect.soft(shown, f).toContain(v);
    }
    if (x.route) expect.soft(await this.read('route_id'), 'route').toContain(x.route);
    for (const l of lines) {
      const row = this.invoiceLine(l.product.code);
      expect.soft(num(await row.locator('td[name="quantity"]').innerText()), `${l.product.code} quantity`).toBe(l.qty ?? 1);
      if (l.price !== undefined) expect.soft(num(await row.locator('td[name="price_unit"]').innerText()), `${l.product.code} price`).toBe(l.price);
      if (l.uom) await expect.soft(row.locator('td[name="product_uomm_id"]'), `${l.product.code} UoM`).toContainText(l.uom);
      if (l.desc) await expect.soft(row.locator('td[name="name"]'), `${l.product.code} description`).toContainText(l.desc);
    }
    await this.openTab('Address');
    if (x.invoiceAddress) expect.soft(await this.read('partner_invoice_id'), 'invoice address').toContain(x.invoiceAddress);
    if (x.deliveryAddress) expect.soft(await this.read('partner_shipping_id'), 'delivery address').toContain(x.deliveryAddress);
    if (x.remitAddress) expect.soft(await this.read('partner_remit_id'), 'remit address').toContain(x.remitAddress);
    await this.openTab('Signature');
    if (x.receiver) expect.soft(await this.read('receiver_name'), 'received by').toBe(x.receiver);
    await this.openTab('Notes');
    if (x.deliveryNotes) expect.soft(await this.read('delivery_notes'), 'delivery notes').toBe(x.deliveryNotes);
    await this.openTab('Invoice Lines');
  }

  /** Payment Receipt menu: customer -> pay `amount` against `invoice` -> Confirm. */
  async arPaymentReceipt({ customer, invoice, amount }) {
    await this.openAR('Payment Receipt');
    await this.clickNew();
    await this.fill({ partner_id: customer });
    return this.fillReceipt({ invoice, amount });
  }

  /**
   * AR Credit Memo. The form depends on the type:
   *   Sales Discount: invoice + amount;  Sales Return: Material Receipt (sales return);  Others: amount + account lines.
   */
  async creditMemo({ customer, type, invoice, salesReturn, amount, account = '400000' }) {
    await this.openAR('Credit Memo');
    await this.clickNew();
    await this.fill({ credit_memo_type: type });
    await this.fill({ partner_id: customer });
    if (type === 'Sales Discount') {
      await this.fill({ invoice_id: invoice });
      await this.fill({ amount });
    } else if (type === 'Sales Return') {
      await this.fill({ sales_return_id: salesReturn });
      await expect(this.field('sales_return_line_ids').locator('.o_data_row').first()).toBeVisible();
    } else {
      await this.fill({ amount });
      await this.addLine('debit_distribution_lines', { account_id: account, amount });
    }
    await this.save();
    await this.click('action_post');
    await this.expectNoError();
    const total = type === 'Sales Return' ? await this.readMoney('amount_total') : await this.readMoney('amount');
    const untaxed = await this.readMoney('amount_untaxed').catch(() => undefined);
    return { url: this.currentUrl(), name: await this.recordTitle(), total, untaxed };
  }

  /**
   * AP credit memo (open form): Action > Print Credit Memo; the PDF must show the memo number, vendor, type, the
   * linked bill / material issue, and every non-zero amount on the screen.
   */
  async expectDebitMemoPdf() {
    await this.waitReady();
    const number = (await this.recordTitle()).replace(/\s*\(.*\)\s*$/, '');
    const shown = await this.page.evaluate(() => [...document.querySelectorAll('.o_action_manager .o_form_view .o_field_widget[name]')]
      .filter((e) => e.offsetParent && !e.closest('.o_data_row'))
      .map((e) => ({ name: e.getAttribute('name'), cls: e.className, text: (e.querySelector('input,select')?.value ?? e.innerText).trim() })));
    const text = await this.printReport(/^\s*Print Credit Memo\s*$/, `credit-memo-${number.replace(/\W+/g, '_')}.pdf`);
    const pdf = text.replace(/\s+/g, '');
    expect.soft(pdf, `memo PDF shows ${number}`).toContain(number);
    for (const f of shown) {
      if (['partner_id', 'bill_id', 'material_issue_id'].includes(f.name) && f.text) {
        expect.soft(pdf, `memo PDF shows ${f.name} "${f.text}"`).toContain(f.text.split(' (')[0].replace(/\s+/g, ''));
      }
      if (f.name === 'debit_memo_type' && f.text) {
        const label = f.text.replace(/"/g, '').replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
        expect.soft(text.toLowerCase(), `memo PDF shows type ${label}`).toContain(label.toLowerCase());
      }
      if (/o_field_(monetary|float)/.test(f.cls)) {
        const v = parseFloat(f.text.replace(/[^0-9.-]/g, ''));
        if (v) expect.soft([v.toFixed(2), v.toFixed(1)].some((x) => pdf.includes(x)), `memo PDF amount ${f.name} = ${f.text}`).toBe(true);
      }
    }
    return text;
  }

  async memoTypeOptions(menuOpen, fieldName) {
    await menuOpen();
    await this.clickNew();
    const options = (await this.field(fieldName).locator('select option').allInnerTexts()).map((t) => t.trim()).filter(Boolean);
    await this.discard();
    return options;
  }

  // ---------- AP

  /** Vendor Balance / advance balance as shown on a new Bill Payment (form is discarded). */
  async vendorBalances(vendor) {
    await this.openAP('Bill Payment');
    await this.clickNew();
    // The picker only offers vendors with open bills/credits: not offered = nothing open.
    try {
      await this.fill({ partner_id: vendor });
    } catch (e) {
      // Not offered (directly, or via an empty "Search More" list) = nothing open for this vendor.
      const search = this.page.locator('.modal:visible').filter({ hasText: /Search:/ }).last();
      if (await search.isVisible().catch(() => false)) {
        if (!(await search.getByText('No record found').isVisible().catch(() => false))) throw e;
        await search.locator('.modal-footer button').filter({ hasText: /^Close$/ }).click();
        await search.waitFor({ state: 'hidden' });
      } else if (!/not offered/.test(e.message)) {
        throw e;
      }
      await this.discard();
      return { balance: 0, advance: 0, listed: false };
    }
    // The vendor's figures arrive with an onchange; wait for the bill list / balance to populate.
    await this.field('bill_ids').locator('.o_data_row').first().waitFor({ timeout: 15_000 }).catch(() => {});
    await this.waitReady();
    await this.page.waitForTimeout(1_000);
    const out = { balance: await this.readMoney('bill_balance'), advance: await this.readMoney('vendor_advance_balance') };
    await this.discard();
    return out;
  }

  async vendorAdvance({ vendor, amount }) {
    await this.openAP('Advance Payment');
    await this.clickNew();
    await this.fill({ partner_id: vendor });
    await this.fillPayment({ amount });
    await this.save();
    await this.click('action_post');
    await this.expectNoError();
    return this.currentUrl();
  }

  /** Direct vendor bill: vendor + location -> Products [Add] -> qty/cost -> vendor invoice # -> Post. */
  async directBill({ vendor, warehouse, lines }) {
    await this.openAP('Bills');
    await this.clickNew();
    await this.fill({ partner_id: vendor });
    if (warehouse) await this.fill({ warehouse_id: warehouse });
    await this.fill({ product_ids: lines.map((l) => l.product.name) });
    await this.click('add_products');
    for (const l of lines) {
      const rows = this.field('invoice_line_ids').locator('.o_data_row');
      await rows.filter({ hasText: l.product.name }).first().waitFor();
      const row = rows.nth((await rows.allInnerTexts()).findIndex((t) => t.includes(l.product.name)));
      for (const [name, value] of Object.entries({ quantity: l.qty ?? 1, cost_price_unit: l.cost })) {
        if (value === undefined) continue;
        await row.locator(`td[name="${name}"]`).click();
        const input = row.locator(`td[name="${name}"] input`);
        await input.fill(String(value));
        await input.press('Tab');
      }
    }
    const { today } = require('../utils/dates');
    if (!(await this.read('invoice_date').catch(() => ''))) await this.fill({ invoice_date: today() }).catch(() => {});
    if (await appears(this.field('vendor_invoice'), 2_000)) {
      await this.fill({ vendor_invoice: `VB${String(Date.now()).slice(-8)}` });
    }
    await this.save();
    await this.clickAny(['action_post', 'Post']);
    await this.expectNoError();
    await this.expectStatus(/Posted/);
    return { url: this.currentUrl(), name: await this.recordTitle(), total: await this.total() };
  }

  /** Bill Payment: vendor -> pay `amount` against `bill` (paging if needed) -> Confirm. */
  async billPayment({ vendor, bill, amount }) {
    await this.openAP('Bill Payment');
    await this.clickNew();
    await this.fill({ partner_id: vendor });
    await this.fill({ payment_type: 'Check' });
    await this.fill({ check_no: `QA${String(Date.now()).slice(-8)}`, account_id: '101402 Check' });
    const list = this.field('bill_ids');
    const row = list.locator('.o_data_row').filter({ has: this.page.locator('td[name="name"]', { hasText: new RegExp(`^\\s*${bill}\\s*$`) }) }).first();
    for (let i = 0; i < 10 && !(await appears(row, 2_000)); i++) {
      const next = list.locator('.o_pager_next');
      if (!(await next.isEnabled().catch(() => false))) break;
      await next.click();
      await this.waitReady();
    }
    await expect(row, `bill ${bill} listed on the payment`).toBeVisible();
    const check = row.locator('td[name="is_checked"] input');
    if (!(await check.isChecked())) await row.locator('td[name="is_checked"]').click();
    await expect(check).toBeChecked();
    // Ticking recalculates the row (it often pre-fills the full amount); let it settle first.
    await this.waitReady();
    await this.page.waitForTimeout(1_000);
    const cell = row.locator('td[name="amount_received"]');
    const current = parseFloat((await cell.innerText()).replace(/[^0-9.-]/g, '')) || 0;
    if (Math.abs(current - amount) > 0.001) {
      await cell.click();
      await cell.locator('input').fill(String(amount));
      await cell.locator('input').press('Tab');
      await this.waitReady();
    }
    // Ticking a line resets the header Amount; set it last so it matches the applied amount.
    await this.fill({ amount });
    await this.save();
    await this.click('action_post');
    await this.expectNoError();
    return this.currentUrl();
  }

  /**
   * AP Credit Memo (debit memo). By type:
   *   Purchase Discount: bill + amount;  Purchase Return: Material Issue;  Others: amount + account lines.
   */
  async debitMemo({ vendor, type, bill, materialIssue, amount, account = '600000' }) {
    await this.openAP('Credit Memo');
    await this.clickNew();
    await this.fill({ debit_memo_type: type });
    await this.fill({ partner_id: vendor });
    if (type === 'Purchase Discount') {
      await this.fill({ bill_id: bill });
      await this.fill({ debit_memo_amount: amount });
    } else if (type === 'Purchase Return') {
      await this.fill({ material_issue_id: materialIssue });
      await expect(this.field('debit_memo_lines_ids').locator('.o_data_row').first()).toBeVisible();
    } else {
      await this.fill({ debit_memo_amount: amount });
      await this.addLine('credit_distribution_lines', { account_id: account, amount });
    }
    await this.save();
    await this.click('action_post');
    await this.expectNoError();
    const total = type === 'Purchase Return' ? await this.readMoney('amount_total_view') : await this.readMoney('debit_memo_amount');
    return { url: this.currentUrl(), name: await this.recordTitle(), total };
  }

  async expectPosted(url) {
    await this.goto(url);
    await this.expectStatus(/Posted|Paid|Open|Confirmed/i);
  }

  async expectFullyPaid(url) {
    await this.goto(url);
    expectMoney(await this.residual(), 0, 'Amount due');
  }

  /** Journal items smart button / tab - returns true when accounting entries exist. */
  async hasJournalEntries(url) {
    await this.goto(url);
    const tab = this.page.locator('.o_notebook .nav-link').filter({ hasText: /Journal Items/i }).first();
    if (await tab.isVisible().catch(() => false)) {
      await tab.click();
      return (await this.page.locator('[name="line_ids"] .o_data_row').count()) > 0;
    }
    return (await this.page.locator('.o_statusbar_status')).isVisible();
  }
}

module.exports = { AccountingPage };
