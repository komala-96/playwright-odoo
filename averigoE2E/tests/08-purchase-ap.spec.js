const { test, expect, tc } = require('../fixtures');
const d = require('../data/testData');
const state = require('../utils/state');
const { expectMoney, round2 } = require('../utils/money');
const { today, firstOfMonth, usDate, addDays } = require('../utils/dates');

// Material Issue: every editable field (TC-065 / TC-067).
const materialIssueExtras = () => ({
  vendor_ref: `VR${String(Date.now()).slice(-6)}`, vendor_packing_slip: `VPS${String(Date.now()).slice(-6)}`,
  way_bill: `WB${String(Date.now()).slice(-6)}`, ship_via: 'QA Ground', issue_date: usDate(new Date()),
  notes: 'QA material issue notes',
});

test.describe.serial('Purchase & accounts payable (TC-060..TC-072)', () => {
  test(...tc('TC-060'), async ({ purchasePage }) => {
    // Product 1's vendor line uses the TC-003 case UoM (first entry); both UoMs must be offered.
    const opts = { product: d.products.p1, uoms: [d.uom.name, d.uom.reference], purchaseManager: d.employee.name /* the TC-001 employee */, cost: d.products.p1.cost };
    // Resume support: reuse the vendor already created for this RUN_ID (re-verifies it instead of duplicating).
    const url = state.optional('vendorUrl') || await purchasePage.createVendor(d.vendor, opts);
    state.set('vendorUrl', url);
    await purchasePage.expectVendor(url, d.vendor, opts);
  });

  test(...tc('TC-060A'), async ({ purchasePage }) => {
    // Edit every editable field of the TC-060 vendor and save. Name / purchase manager are edited, verified, then
    // restored (later cases find the vendor by name and use the TC-001 employee as purchase manager).
    const v = d.vendor;
    const e = d.vendorEdit;
    const url = state.get('vendorUrl');
    const editManager = 'Komala'; // a different purchase manager than the TC-001 employee
    await test.step('Edit every field of the vendor and save', () => purchasePage.editVendor(url, e, {
      purchaseManager: editManager,
      editContacts: { [v.contact.name]: e.contact, [v.remitContact.name]: e.remitContact },
    }));
    await test.step('Every edited value saved', async () => {
      await purchasePage.goto(url);
      expect.soft(await purchasePage.read('name'), 'name').toContain(e.name);
      expect.soft(await purchasePage.read('kam'), 'purchase manager').toContain(editManager);
      expect.soft(await purchasePage.read('zip'), 'zip').toBe(e.zip);
      expect.soft(await purchasePage.read('street'), 'street').toBe(e.street);
      const num = (t) => parseFloat(String(t).replace(/[^0-9.-]/g, ''));
      for (const [f, val] of Object.entries(e.details)) {
        const shown = await purchasePage.read(f);
        if (typeof val === 'number') expect.soft(num(shown), f).toBe(val);
        else if (/phone/.test(f)) expect.soft(shown.replace(/\D/g, ''), f).toMatch(new RegExp(`${val}$`));
        else expect.soft(shown, f).toContain(val);
      }
      // Unchanged on purpose (later cases rely on them).
      expect.soft(await purchasePage.read('property_supplier_payment_term_id'), 'payment terms kept').toContain(v.details.property_supplier_payment_term_id);
      expect.soft(await purchasePage.field('buy_all').locator('input').first().isChecked(), 'Buy All Products kept').toBe(true);
    });
    await test.step('Contact and remit-to address edited', async () => {
      const ct = await purchasePage.readVendorContact(v.contact.name, ['email', 'phone', 'mobile', 'comment']);
      expect.soft(ct.email, 'contact email').toBe(e.contact.email);
      expect.soft(ct.phone.replace(/\D/g, ''), 'contact phone').toMatch(new RegExp(`${e.contact.phone}$`));
      expect.soft(ct.mobile.replace(/\D/g, ''), 'contact mobile').toMatch(new RegExp(`${e.contact.mobile}$`));
      expect.soft(ct.comment, 'contact note').toBe(e.contact.comment);
      const rt = await purchasePage.readVendorContact(v.remitContact.name, ['zip', 'street', 'street2', 'phone', 'comment']);
      expect.soft(rt.zip, 'remit-to zip').toBe(e.remitContact.zip);
      expect.soft(rt.street, 'remit-to street').toBe(e.remitContact.street);
      expect.soft(rt.street2, 'remit-to street2').toBe(e.remitContact.street2);
      expect.soft(rt.comment, 'remit-to note').toBe(e.remitContact.comment);
    });
    if (e.restoreIdentity) {
      await test.step('Restore name and purchase manager (later cases depend on them)', async () => {
        await purchasePage.goto(url);
        await purchasePage.fill({ name: v.name });
        await purchasePage.fill({ kam: d.employee.name });
        await purchasePage.save();
        expect(await purchasePage.read('name')).toContain(v.name);
        expect(await purchasePage.read('kam')).toContain(d.employee.name);
      });
    }
  });

  test(...tc('TC-061'), async ({ purchasePage, inventoryPage, accountingPage }) => {
    const stockBefore = await inventoryPage.onHand(state.get('p1Url'));
    // Receipt fields entered before "Verify Quantities Against Bill".
    const receiptExtras = {
      receiver: 'Komala', scheduledDate: `${usDate(addDays(1))} 10:00`, vendorInvoice: `VI${String(Date.now()).slice(-8)}`,
      note: 'QA receipt note', lineQty: d.qty.purchase, lineCost: d.products.p1.cost,
    };
    const r = await purchasePage.purchaseAndBill({ vendor: d.vendor.name, warehouse: d.warehouse.name, product: d.products.p1, qty: d.qty.purchase, cost: d.products.p1.cost, bin: d.bin.name, receiptExtras, checkPdfs: true });
    await test.step('Stock of Product 1 after the bill is posted', async () => {
      // Purchased in the vendor's case UoM (TC-060): stock rises by qty x units per case.
      expect(await inventoryPage.onHand(state.get('p1Url')), `on hand +${d.qty.purchase} x ${r.unitsPerQty} units`).toBe(stockBefore + d.qty.purchase * r.unitsPerQty);
    });
    state.set('p1Bill', r);

    await accountingPage.billPayment({ vendor: d.vendor.name, bill: r.billName, amount: r.total });
    await accountingPage.goto(r.billUrl);
    // Paid in full: nothing due on the bill. (The vendor-balance check via a new Bill Payment form is skipped for now.)
    expectMoney(await accountingPage.residual(), 0, 'Bill amount due');
  });

  for (const [id, key] of [['TC-062', 'p2'], ['TC-063', 'p3'], ['TC-064', 'p4']]) {
    test(...tc(id), async ({ purchasePage, inventoryPage }) => {
      const p = d.products[key];
      // PO product pickers only offer the vendor's products.
      await purchasePage.ensureVendorProducts(d.vendor.name, [p]);
      const before = await inventoryPage.onHand(state.get(`${key}Url`));
      const r = await purchasePage.purchaseAndBill({ vendor: d.vendor.name, warehouse: d.warehouse.name, product: p, qty: d.qty.purchase, cost: p.cost, checkPdfs: true });
      expect(await inventoryPage.onHand(state.get(`${key}Url`)), `${p.code} stock increased by received qty`).toBe(before + d.qty.purchase);
      state.set(`${key}Bill`, r);
    });
  }

  // Added case: bill created directly from Purchase > Bill and posted.
  test(...tc('TC-064A'), async ({ purchasePage }) => {
    const lines = [
      { product: d.products.p2, qty: 5, cost: d.products.p2.cost },
      { product: d.products.p4, qty: 3, cost: d.products.p4.cost },
    ];
    const extras = {
      header: { ref: 'QABILLREF064A', narration: 'QA purchase bill note', shipping_handling: 5, insurance: 2, total_discount: 1 },
      incoterm: true,
      paymentReference: 'QAPAYREF064A',
    };
    const bill = await test.step('Create and post the bill (Purchase > Bill)', () => purchasePage.createBill({ vendor: d.vendor.name, warehouse: d.warehouse.name, lines, extras }));
    const totals = await test.step('Bill posted with every value and consistent totals', () => purchasePage.expectBill(bill.url, { lines, extras, picked: bill.picked }));
    await test.step('Bill PDF (Action > Bill) matches the bill screen', async () => {
      await purchasePage.goto(bill.url);
      const pdf = await purchasePage.expectPurchasePdf('bill');
      expectMoney(parseFloat(pdf.totals.total.replace(/[^0-9.-]/g, '')), totals.total, 'Bill PDF total = bill total');
    });
    state.set('purchaseBill064A', { url: bill.url, name: bill.name, total: totals.total });
  });

  // Added case: purchase order lifecycle - create, confirm, delete (cancel first when the app requires it).
  test(...tc('TC-064B'), async ({ purchasePage }) => {
    const po = await test.step('Create the purchase order', () => purchasePage.createPO({ vendor: d.vendor.name, warehouse: d.warehouse.name, lines: [{ product: d.products.p1, qty: 2, cost: d.products.p1.cost }] }));
    await test.step('Confirm it', () => purchasePage.confirmPO());
    po.name = (await purchasePage.recordTitle()).replace(/\s*\(.*\)\s*$/, '');
    await purchasePage.expectStatus(/Confirmed/i);
    const first = await test.step('Delete the confirmed PO', () => purchasePage.tryDeletePO());
    if (!first.deleted) {
      test.info().annotations.push({ type: 'Delete blocked while confirmed', description: first.message });
      await test.step('Cancel the PO, then delete it', async () => {
        await purchasePage.cancelPO();
        const second = await purchasePage.tryDeletePO();
        expect(second.deleted, `cancelled PO deleted (${second.message || ''})`).toBe(true);
      });
    }
    await test.step(`${po.name} is gone from Purchase Orders`, () => purchasePage.expectPOGone(po.name));
  });

  test(...tc('TC-065'), async ({ inventoryPage, accountingPage }) => {
    const bill = state.get('p1Bill');
    const qty = 2;
    const stockBefore = await inventoryPage.onHand(state.get('p1Url'));
    const balancesBefore = await accountingPage.vendorBalances(d.vendor.name);

    const issue = await inventoryPage.materialIssue({ vendor: d.vendor.name, bill: bill.billName, user: d.issueEmployee || d.employee.name, productName: d.products.p1.name, qty, extras: materialIssueExtras() });
    // Material Issue goes Draft -> Approved -> Credit Memo: stock is checked once the Purchase Return memo exists.
    const memo = await accountingPage.debitMemo({ vendor: d.vendor.name, type: 'Purchase Return', materialIssue: issue.name });
    // Product 1 was billed in the vendor's case UoM: issuing `qty` cases returns qty x ratio units.
    expect.soft(await inventoryPage.onHand(state.get('p1Url')), `returned ${qty} case(s) = ${qty * d.uom.ratio} units leave stock (issue + credit memo)`).toBe(stockBefore - qty * d.uom.ratio);
    expectMoney(memo.total, qty * d.products.p1.cost, 'Credit memo = issued qty x cost');
    // Posted vendor credit memos lower the open balance and/or add to the Credit Balance.
    const after = await accountingPage.vendorBalances(d.vendor.name);
    expectMoney((balancesBefore.balance - after.balance) + (after.advance - balancesBefore.advance), memo.total, 'Credit memo effect on vendor balances');
    state.set('p1MaterialIssue', issue);
  });

  test(...tc('TC-066'), async ({ accountingPage }) => {
    const before = (await accountingPage.vendorBalances(d.vendor.name)).advance;
    const url = await accountingPage.vendorAdvance({ vendor: d.vendor.name, amount: d.vendorAdvance });
    await accountingPage.goto(url);
    await accountingPage.expectStatus(/Paid|In Process|Posted/i);
    expectMoney((await accountingPage.vendorBalances(d.vendor.name)).advance, before + d.vendorAdvance, 'Vendor advance balance');
  });

  test(...tc('TC-067'), async ({ accountingPage, inventoryPage }) => {
    const types = await accountingPage.memoTypeOptions(() => accountingPage.openAP('Credit Memo'), 'debit_memo_type');
    expect(types).toEqual(expect.arrayContaining(['Purchase Discount', 'Purchase Return', 'Others']));
    // The AP credit memo Vendor picker only offers vendors with an open Material Issue
    // (vendor_with_material_issue_ids, see FINDINGS.md), so create the issue first.
    const issue = await inventoryPage.materialIssue({ vendor: d.vendor.name, bill: state.get('p3Bill').billName, user: d.issueEmployee || d.employee.name, productName: d.products.p3.name, qty: 1, extras: materialIssueExtras() });
    const cases = [
      ['Purchase Discount', { bill: state.get('p2Bill').billName, amount: 3 }],
      ['Others', { amount: 3 }],
      ['Purchase Return', { materialIssue: issue.name }],
    ];
    for (const [type, args] of cases) {
      await test.step(`Credit memo type "${type}"`, async () => {
        const before = await accountingPage.vendorBalances(d.vendor.name);
        const memo = await accountingPage.debitMemo({ vendor: d.vendor.name, type, ...args });
        await accountingPage.goto(memo.url);
        await accountingPage.expectStatus(/Posted/);
        expect(memo.total).toBeGreaterThan(0);
        await test.step(`Print ${type} credit memo and compare with the screen`, () => accountingPage.expectDebitMemoPdf());
        await accountingPage.goto(memo.url);
        // Purchase Discount is applied to its bill (open balance goes down); Return/Others become credit balance.
        const after = await accountingPage.vendorBalances(d.vendor.name);
        expectMoney((before.balance - after.balance) + (after.advance - before.advance), memo.total, `${type} effect on vendor balances`);
      });
    }
  });

  test(...tc('TC-068'), async ({ accountingPage }) => {
    const bill = await accountingPage.directBill({ vendor: d.vendor.name, warehouse: d.warehouse.name, lines: [{ product: d.products.p1, qty: d.qty.purchase, cost: d.products.p1.cost }] });
    // Subtotal = qty x cost; tax should be the order tax rate on that subtotal (see FINDINGS.md TC-068).
    await accountingPage.goto(bill.url);
    const subtotal = await accountingPage.readMoney('amount_untaxed');
    expectMoney(subtotal, d.qty.purchase * d.products.p1.cost, 'Direct bill subtotal = qty x cost');
    const tax = await accountingPage.readMoney('tax_amount_view');
    expect.soft(Math.abs(tax - round2(subtotal * state.get('salesTaxRate'))), `Direct bill tax ${tax} = ${(state.get('salesTaxRate') * 100).toFixed(3)}% of ${subtotal}`).toBeLessThan(0.02);
    const half = round2(bill.total / 2);

    await accountingPage.billPayment({ vendor: d.vendor.name, bill: bill.name, amount: half });
    await accountingPage.goto(bill.url);
    expectMoney(await accountingPage.residual(), bill.total - half, 'Bill balance after first payment');

    await accountingPage.billPayment({ vendor: d.vendor.name, bill: bill.name, amount: bill.total - half });
    await accountingPage.goto(bill.url);
    expectMoney(await accountingPage.residual(), 0, 'Bill balance after second payment');
  });

  test(...tc('TC-069'), async ({ inventoryPage }) => {
    const before = await inventoryPage.onHand(state.get('p1Url'));
    // Default Location (see FINDINGS.md: choosing another Location turns it into an internal transfer).
    // Every editable field (Location stays the default - a different one triggers the logged defect).
    const extras = {
      toBePrinted: true, receiver: 'Komala', scheduledDate: `${usDate(addDays(1))} 10:00`,
      vendorInvoice: `DR${String(Date.now()).slice(-8)}`, note: 'QA direct receipt note', bin: d.bin.name,
    };
    const receipt = await inventoryPage.directReceipt({ vendor: d.vendor.name, product: d.products.p1, qty: d.qty.directReceipt, cost: d.products.p1.cost, extras });
    await test.step('Print the receipt (Action > Print > Receipt) and compare', async () => {
      await inventoryPage.goto(receipt.url);
      await inventoryPage.expectReceiptPdf({ vendor: d.vendor.name, product: d.products.p1, qty: d.qty.directReceipt, receiver: extras.receiver, note: extras.note });
    });
    // Received in the vendor's case UoM (TC-060): stock rises by qty x units per case.
    expect(await inventoryPage.onHand(state.get('p1Url')), `on hand +${d.qty.directReceipt} x ${d.uom.ratio} units`).toBe(before + d.qty.directReceipt * d.uom.ratio);
  });

  test(...tc('TC-070'), async ({ purchasePage }) => {
    const { order, receive } = d.qty.poBackorder;
    // Every editable PO field (Recurring stays off - it schedules repeat orders; Address tab is read-only).
    const extras = {
      header: {
        to_be_printed: true, purchase_manager: d.employee.name, contact: d.vendor.contact.name, payment_term_id: '30 Days',
        date_order: `${today()} 09:00`, due_date: usDate(addDays(7)), ship_via: 'QA Ground',
      },
      footer: { shipping_handling: 5, insurance: 2, total_discount_view: 1, notes: 'QA backorder PO note', internal_commands: 'QA internal comment' },
    };
    const line = { product: d.products.p2, uom: d.uom.name, qty: order, cost: d.products.p2.cost, vendorDesc: `QA vendor part ${d.products.p2.code}`, discount: 1 };
    const po = await purchasePage.createPO({ vendor: d.vendor.name, warehouse: d.warehouse.name, lines: [line], extras });
    await purchasePage.confirmPO();
    const poName = await purchasePage.recordTitle();
    const receiptExtras = { receiver: 'Komala', scheduledDate: `${usDate(addDays(1))} 10:00`, vendorInvoice: `VB${String(Date.now()).slice(-8)}`, note: 'QA partial receipt note' };
    await purchasePage.receive({ receiveQty: receive, extras: receiptExtras });
    await purchasePage.backorders();
    await purchasePage.search(poName);
    const row = purchasePage.rows(poName).first();
    await expect(row, 'backorder exists for the PO').toBeVisible();
    await row.locator('td.o_data_cell').first().click();
    await purchasePage.waitReady();
    await expect(purchasePage.page.locator('.o_form_view .o_data_row').filter({ hasText: d.products.p2.name }).first()).toContainText(String(order - receive));
    state.set('poBackorderUrl', po.url);

    await test.step(`Receive the backorder of ${poName} (remaining ${order - receive}) with all receipt fields`, async () => {
      const boExtras = { receiver: 'Komala', scheduledDate: `${usDate(addDays(2))} 10:00`, vendorInvoice: `VB${String(Date.now()).slice(-8)}`, note: 'QA backorder receipt note' };
      const bo = await purchasePage.receiveBackorder(poName, { qty: order - receive, extras: boExtras });
      state.set('poBackorderReceipt', bo);
    });
    await test.step(`Post the bills of ${poName}`, async () => {
      const bills = await purchasePage.postBillsFromPO(po.url, { expected: 2 });
      const billed = bills.reduce((a, b) => a + b.total, 0);
      await purchasePage.goto(po.url);
      // Fully received: one bill per receipt, together adding up to the PO total (see FINDINGS.md TC-070).
      expect.soft(bills.length, `one bill per receipt (${bills.map((b) => b.name).join(', ')})`).toBe(2);
      expect.soft(Math.round(billed * 100) / 100, `bills ${bills.map((b) => `${b.name} ${b.total}`).join(' + ')} = PO total`).toBeCloseTo(await purchasePage.poTotal(), 2);
      state.set('poBackorderBills', bills);
    });
    await test.step(`Print ${poName} (Action > Print > Purchase Order) and compare with the screen`, async () => {
      await purchasePage.goto(po.url);
      await purchasePage.expectPurchasePdf('po');
    });
  });

  test(...tc('TC-072'), async ({ reportsPage, inventoryPage }) => {
    const { ReportsPage } = require('../pages/ReportsPage');
    const bills = ['p1Bill', 'p2Bill', 'p3Bill', 'p4Bill'].map((k) => state.get(k));
    const day = today();
    // TC-061..064 may have run on an earlier day: report ranges start two weeks back (rows are matched by PO / product).
    const since = usDate(addDays(-14));

    await test.step('Vendor Invoice Report', async () => {
      const text = await reportsPage.run({
        category: 'Accounts Payable', tile: 'Vendor Invoice Report',
        filters: { vendor: [d.vendor.name], 'Bill Status': 'Open', start: since, end: day, 'Report Type': 'Detail' },
        expectContains: [d.vendor.name],
      });
      // Products 3 and 4 bills are unpaid: their totals show on open rows.
      for (const b of bills.slice(2)) expect(text, `open bill total ${b.total}`).toContain(b.total.toFixed(2));
    });

    await test.step('Purchase Order Report', async () => {
      const text = await reportsPage.run({
        category: 'Purchase', tile: 'Purchase Order Report',
        filters: { vendor: [d.vendor.name], start: since, end: day, Status: 'All', Type: 'Summary' },
        expectContains: bills.map((b) => b.poName),
      });
      for (const i of [0, 1, 2, 3]) {
        // Columns: Vendor | PO # | Date | Ordered | Received | Total (incl. tax + deposit = the PO's bill total) | Bills.
        ReportsPage.expectRowNumbers(text, bills[i].poName, [d.qty.purchase, bills[i].total]);
      }
    });

    await test.step('Vendor List Report', () => reportsPage.run({
      category: 'Purchase', tile: 'Vendor List Report', filters: { 'Activity Status': 'Active' }, expectContains: [d.vendor.name],
    }));

    await test.step('Inventory Receipt Report', async () => {
      const text = await reportsPage.run({
        category: 'Inventory', tile: 'Inventory Receipt Report',
        filters: { Type: 'Transaction', vendor: [d.vendor.name], start: since, end: day },
        expectContains: Object.values(d.products).map((p) => p.name),
      });
      ReportsPage.expectRowNumbers(text, d.products.p4.name, [d.qty.purchase, d.qty.purchase * d.products.p4.cost]);
    });

    await test.step('Product Order Report', async () => {
      const stock = await inventoryPage.onHand(state.get('p4Url'));
      const text = await reportsPage.run({
        category: 'Inventory', tile: 'Product Order Report',
        filters: { products: [d.products.p4.name], date: day },
        expectContains: [d.products.p4.code],
      });
      // Columns: ... | Last Purchase Date | Avg Weekly Moves | Current Stock | Truck Stock.
      // Current Stock only counts the main warehouse here (see FINDINGS.md), so it can't exceed total on-hand.
      const cells = ReportsPage.rowFor(text, d.products.p4.code).split('\t').map((c) => c.trim());
      const current = parseFloat(cells[cells.length - 2]);
      // Main warehouse went negative from truck loads (see FINDINGS.md TC-072): reported, not a blocker for the other reports.
      expect.soft(current, 'Current Stock (main warehouse) is not negative').toBeGreaterThanOrEqual(0);
      expect(current, `Current Stock ${current} <= on-hand ${stock}`).toBeLessThanOrEqual(stock);
    });

    await test.step('Product Transaction Report (Inventory)', async () => {
      const text = await reportsPage.run({
        category: 'Inventory', tile: 'Product Transaction Report (Inventory)',
        filters: { products: [d.products.p4.name], start: since, end: day, 'Transaction Type': 'Purchase' },
        expectContains: [d.products.p4.code, bills[3].poName],
      });
      ReportsPage.expectRowNumbers(text, bills[3].poName, [d.qty.purchase, d.qty.purchase * d.products.p4.cost]);
    });
  });
});
