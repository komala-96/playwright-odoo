const { test, expect, tc } = require('../fixtures');
const d = require('../data/testData');
const state = require('../utils/state');
const { usDate } = require('../utils/dates');
const { expectMoney, round2 } = require('../utils/money');

test.describe.serial('Accounts receivable & sales returns (TC-027, TC-028, TC-041..TC-047)', () => {
  test(...tc('TC-027'), async ({ accountingPage, customerCarePage }) => {
    const inv = state.get('c1Invoice');
    const half = round2(inv.total / 2);
    // Resume: if an earlier attempt already registered the 50% payment, don't pay again - just verify it.
    await accountingPage.goto(inv.url);
    const residualNow = await accountingPage.residual();
    if (Math.abs(residualNow - (inv.total - half)) < 0.005) {
      test.info().annotations.push({ type: 'Resumed', description: `50% payment on ${inv.name} was already registered; verifying only` });
      expectMoney(residualNow, inv.total - half, 'Amount due after 50% payment');
      expect(await customerCarePage.balance(d.customer1.name), 'Customer balance readable').toBeGreaterThan(0);
      state.set('c1InvoiceRemaining', residualNow);
      return;
    }
    const balanceBefore = await customerCarePage.balance(d.customer1.name);
    const due = await accountingPage.registerPayment(inv.url, half);
    expectMoney(due, inv.total - half, 'Amount due after 50% payment');
    expectMoney(await customerCarePage.balance(d.customer1.name), balanceBefore - half, 'Customer balance');
    state.set('c1InvoiceRemaining', due);
  });

  test(...tc('TC-028'), async ({ accountingPage, customerCarePage }) => {
    const inv = state.get('c1Invoice');
    const remaining = state.get('c1InvoiceRemaining');
    const balanceBefore = await customerCarePage.balance(d.customer1.name);
    await accountingPage.arPaymentReceipt({ customer: d.customer1.name, invoice: state.get('c1InvoiceName'), amount: remaining });
    await accountingPage.expectFullyPaid(inv.url);
    expectMoney(await customerCarePage.balance(d.customer1.name), balanceBefore - remaining, 'Customer balance after settlement');
  });

  test(...tc('TC-041'), async ({ accountingPage, customerCarePage }) => {
    const before = await customerCarePage.balance(d.customer1.name);
    // Every editable field: date, mode (Check) + check no, bank name, amount, Deposit To 101402, notes, memo,
    // internal notes, revision no / date.
    const extras = { date: usDate(new Date()), revision_date: usDate(new Date()), ...d.customerAdvanceExtras };
    const url = await accountingPage.customerAdvance({ customer: d.customer1.name, amount: d.customerAdvance, extras });
    await accountingPage.goto(url);
    await accountingPage.expectStatus(/Paid|In Process|Posted/i);
    expectMoney(await accountingPage.readMoney('amount'), d.customerAdvance, 'Advance amount');
    await test.step('Every field saved on the advance', async () => {
      expect.soft(await accountingPage.read('payment_mode_id'), 'mode of payment').toBe('Check');
      expect.soft(await accountingPage.read('check_no'), 'check no').not.toBe('');
      expect.soft(await accountingPage.read('account_id'), 'deposit to').toContain('101402');
      for (const [f, v] of Object.entries(extras)) {
        if (!(await accountingPage.field(f).isVisible().catch(() => false))) await accountingPage.openTab('Other Information').catch(() => {});
        const shown = await accountingPage.read(f);
        // Revision No is bumped by the app when the advance is confirmed (entered 1 -> shows 2).
        if (f === 'revision_no') expect.soft(parseFloat(shown), 'revision no (entered, then +1 on confirm)').toBeGreaterThanOrEqual(v);
        else if (typeof v === 'number') expect.soft(parseFloat(shown), f).toBe(v);
        else expect.soft(shown, f).toBe(v);
      }
    });
    // An advance is a customer credit: the customer's balance goes down by the advance.
    expectMoney(await customerCarePage.balance(d.customer1.name), before - d.customerAdvance, 'Customer 1 balance after advance');
  });

  // Return flow on this instance: Inventory > Material Receipt > Sales Return (stock back in),
  // then AR > Credit Memo of type "Sales Return" against it (credit to the customer).
  async function returnAndCredit({ inventoryPage, accountingPage }, inv, qty) {
    const ret = await inventoryPage.salesReturn({ customer: d.customer1.name, warehouse: d.warehouse.name, invoice: inv.name, qtyByName: { [d.products.p1.name]: qty } });
    const memo = await accountingPage.creditMemo({ customer: d.customer1.name, type: 'Sales Return', salesReturn: ret.name });
    await accountingPage.goto(memo.url);
    await accountingPage.expectStatus(/Posted/);
    return { ret, memo };
  }

  test(...tc('TC-042'), async ({ inventoryPage, customerCarePage, accountingPage }) => {
    const inv = state.get('c1InvoiceNoService');
    const half = Math.floor(d.qty.order / 2); // cases (TC-029 sells Product 1 in the case UoM)
    const stockBefore = await inventoryPage.onHand(state.get('p1Url'));
    const balanceBefore = await customerCarePage.balance(d.customer1.name);

    const { memo } = await returnAndCredit({ inventoryPage, accountingPage }, inv, half);
    state.set('firstReturn', { memoUrl: memo.url, qty: half, credit: memo.total, untaxed: memo.untaxed });

    expect(await inventoryPage.onHand(state.get('p1Url')), `returned ${half} case(s) = ${half * d.uom.ratio} units added back`).toBe(stockBefore + half * d.uom.ratio);
    expectMoney(await customerCarePage.balance(d.customer1.name), balanceBefore - memo.total, 'Customer balance after credit memo');
  });

  test(...tc('TC-043'), async ({ inventoryPage, customerCarePage, accountingPage }) => {
    const inv = state.get('c1InvoiceNoService');
    const first = state.get('firstReturn');
    const remaining = d.qty.order - first.qty;
    const stockBefore = await inventoryPage.onHand(state.get('p1Url'));
    const balanceBefore = await customerCarePage.balance(d.customer1.name);

    const { memo } = await returnAndCredit({ inventoryPage, accountingPage }, inv, remaining);

    expect(await inventoryPage.onHand(state.get('p1Url')), `returned ${remaining} case(s) = ${remaining * d.uom.ratio} units added back`).toBe(stockBefore + remaining * d.uom.ratio);
    expectMoney(await customerCarePage.balance(d.customer1.name), balanceBefore - memo.total, 'Customer balance after 2nd credit memo');
    // The invoice also carries S&H / insurance / discount / Fuel-Hazard-Subsidy charges, so the memos are compared
    // with what was returned: both product amounts together = Product 1's amount on the invoice (2 cases x price).
    const p1Invoiced = d.qty.order * (d.products.p1.price * 12 + 6);
    expectMoney(first.untaxed + memo.untaxed, p1Invoiced, 'Both credit memos together refund Product 1\'s invoiced amount');
  });

  test(...tc('TC-044'), async ({ accountingPage, customerCarePage, inventoryPage }) => {
    const types = await accountingPage.memoTypeOptions(() => accountingPage.openAR('Credit Memo'), 'credit_memo_type');
    expect(types, 'three credit memo types configured').toEqual(expect.arrayContaining(['Sales Discount', 'Sales Return', 'Others']));
    const discountInvoice = state.get('c2Invoice_p1_nosvc').name;
    const returnInvoice = state.get('c2Invoice_p3_nosvc').name;
    const cases = {
      'Sales Discount': async () => ({ invoice: discountInvoice, amount: 5 }),
      'Sales Return': async () => {
        const ret = await inventoryPage.salesReturn({ customer: d.customer2.name, warehouse: d.warehouse.name, invoice: returnInvoice, qtyByName: { [d.products.p3.name]: 1 } });
        return { salesReturn: ret.name };
      },
      Others: async () => ({ amount: 5 }),
    };
    for (const [type, prepare] of Object.entries(cases)) {
      await test.step(`Credit memo type "${type}"`, async () => {
        const args = await prepare();
        const before = await customerCarePage.balance(d.customer2.name);
        const memo = await accountingPage.creditMemo({ customer: d.customer2.name, type, ...args });
        await accountingPage.goto(memo.url);
        await accountingPage.expectStatus(/Posted/);
        expect(memo.total, `${type} amount`).toBeGreaterThan(0);
        expectMoney(await customerCarePage.balance(d.customer2.name), before - memo.total, `${type} reduces Customer 2's balance by the memo amount`);
      });
    }
  });

  test(...tc('TC-045'), async ({ accountingPage, salesPage }) => {
    // Every editable field of the direct invoice; Location skipped (as on orders); Signature not adopted
    // (it is a legally binding e-signature of the logged-in user).
    const c1 = d.customer1;
    // "Select Associated Products" brings in Customer 1's products (1-4 + service): every line gets qty and price.
    const lines = [
      { product: d.products.p1, qty: 1, price: d.directInvoiceAmount, uom: d.uom.name, desc: 'QA direct invoice line' },
      { product: d.products.p2, qty: 1, price: 16 },
      { product: d.products.p3, qty: 1, price: 13 },
      { product: d.products.p4, qty: 1, price: 12 },
      { product: d.service, qty: 1, price: 30, uom: d.uom.name, service: true },
    ];
    const extras = {
      associated: true,
      header: {
        invoice_date: usDate(new Date()), ref: 'QAREF045', narration: 'QA direct invoice note',
        shipping_handling: 5, insurance: 2, total_discount: 1,
      },
      route: d.route.name,
      invoiceAddress: c1.contacts.find((x) => x.type === 'Billing Address').name,
      deliveryAddress: c1.contacts.find((x) => x.type === 'Delivery Address').name,
      remitAddress: c1.contacts.find((x) => x.type === 'Remit To Address').name,
      receiver: 'QA Receiver',
      deliveryNotes: 'QA delivery notes',
    };
    const inv = await test.step('Create and post the direct invoice (all fields)', () => accountingPage.directInvoice({ customer: c1.name, lines, extras }));
    await accountingPage.expectPosted(inv.url);
    expect(inv.total).toBeGreaterThanOrEqual(d.directInvoiceAmount);
    await test.step('Every field saved on the invoice', async () => {
      await accountingPage.goto(inv.url);
      await accountingPage.expectInvoiceExtras(extras, lines);
    });
    await test.step('Invoice PDF matches the invoice screen', async () => {
      await salesPage.goto(inv.url);
      await salesPage.expectPdfMatchesUi('invoice');
    });
    expectMoney(await accountingPage.registerPayment(inv.url, inv.total), 0, 'Amount due after payment');
  });

  test(...tc('TC-046'), async ({ accountingPage, customerCarePage }) => {
    // Invoice product pickers only offer the customer's Order Products.
    await customerCarePage.ensureCustomerProducts(d.customer2.name, [d.products.p1]);
    const before = await customerCarePage.balance(d.customer2.name);
    const inv = await accountingPage.directInvoice({ customer: d.customer2.name, lines: [{ product: d.products.p1, qty: 1 }] });
    await accountingPage.expectPosted(inv.url);
    expectMoney(await customerCarePage.balance(d.customer2.name), before + inv.total, 'Customer 2 balance after invoice');
    expectMoney(await accountingPage.registerPayment(inv.url, inv.total), 0, 'Amount due after payment');
    expectMoney(await customerCarePage.balance(d.customer2.name), before, 'Customer 2 balance after payment');
  });

  test(...tc('TC-047'), async ({ accountingPage }) => {
    const inv = await accountingPage.directInvoice({ customer: d.customer2.name, lines: [{ product: d.service, qty: 1, service: true }] });
    await accountingPage.expectPosted(inv.url);
    expect(inv.total).toBeGreaterThan(0);
    expectMoney(await accountingPage.registerPayment(inv.url, inv.total), 0, 'Service invoice fully paid');
  });
});
