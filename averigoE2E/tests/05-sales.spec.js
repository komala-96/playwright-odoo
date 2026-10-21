const { test, expect, tc } = require('../fixtures');
const d = require('../data/testData');
const state = require('../utils/state');
const { today, usDate, addDays } = require('../utils/dates');
const { ReportsPage } = require('../pages/ReportsPage');

const P = (key) => ({ product: d.products[key], qty: d.qty.order });
const SERVICE = () => ({ product: d.service, qty: 1, service: true });

// TC-029..TC-038: every line in the TC-003 case UoM (12 x Each) with its own quantity and price
// (each product at its case price + 6.00, the service case at 310.00).
const CASE = (key, qty = d.qty.order) => ({ product: d.products[key], qty, uom: d.uom.name, price: d.products[key].price * 12 + 6 });
const SERVICE_CASE = () => ({ ...SERVICE(), uom: d.uom.name, price: 310 });
// Every visible order field (as in TC-026, without Add Associated Products - it would pull the customer's
// Order Products into each single-product order). Location and line Bin are skipped.
const fullOrder = (c) => ({
  header: {
    contact: c.contacts[0].name, promise_date: usDate(addDays(3)), fob: 'Origin',
    note: 'QA order note', message: 'QA order message', notes: 'QA order terms and conditions',
    shipping_handling: 5, insurance: 2, total_discount_view: 1,
  },
  shipVia: 'QA Ground',
  invoiceAddress: c.contacts.find((x) => x.type === 'Billing Address').name,
  deliveryAddress: c.contacts.find((x) => x.type === 'Delivery Address').name,
  route: d.route.name,
  dropLocation: true,
});

// What the Customer 2 matrix must show for each product's tax/deposit flags.
const flags = (key) => ({
  nonTaxable: d.products[key].tax ? [] : [d.products[key].code],
  noDeposit: d.products[key].deposit ? [] : [d.products[key].code],
  state,
});

test.describe.serial('Sales orders & invoices (TC-026, TC-029..TC-040, TC-053)', () => {
  test(...tc('TC-026'), async ({ salesPage }) => {
    // Every visible field: Product 1 sold in the TC-003 case UoM (12 x Each) with line description / internal
    // message (bin skipped for now); header contact, promise date, FOB, ship via, notes, S&H / insurance / discount; the
    // TC-022 billing + delivery addresses; route and drop-off location (Location skipped for now).
    // Not set: Hold Reason / Closed Reason (would hold or close the order); Recurring, Drop Shipping and
    // Add Associated Products stay off (they change how the order is fulfilled).
    const c1 = d.customer1;
    const r = await salesPage.orderToInvoice({
      customer: c1.name,
      lines: [
        // Bin Location skipped for now (it defaults to Product 1's primary bin).
        // Every product on the order gets an explicit quantity and price. "Add Associated Products" brings in
        // Customer 1's Order Products (Products 1-4) at qty 0; they are filled in rather than added again.
        { ...P('p1'), uom: d.uom.name, price: 250, desc: 'QA line description', internalMsg: 'QA internal line message' },
        { product: d.products.p2, qty: 2, price: 16 },
        { product: d.products.p3, qty: 2, price: 13 },
        { product: d.products.p4, qty: 2, price: 12 },
        // An already existing instance product, picked from the Products list once "Show All Products" is on.
        { product: d.existingProduct, qty: 3, price: 1.5 },
        { ...SERVICE(), price: 30 },
      ],
      // Customer 1 has Fuel Charge / Hazard Fee / Subsidy: their Default Setup products are added on confirmation.
      // After Confirm: "Create Service Invoice"; at Delivery: one more product (Dr Pepper) added to the same order.
      expectations: {
        ...flags('p1'), taxPositive: true, depositPositive: true, charges: ['subsidy product', 'fuel charge', 'hazard fee'],
        serviceInvoice: d.service.code,
        // A product not on the order (products already on it can't be added again).
        deliveryExtraLines: [{ product: d.existingProduct2, qty: 1 }],
        // Order-vs-invoice total comparison skipped for TC-026 (as requested); see FINDINGS.md for the differences.
        compareTotals: false,
        // Print the invoice (Action > Invoices) and the order (Action > Print > Quotation / Order); compare with the screen.
        checkPdfs: true,
      },
      extras: {
        header: {
          associated_product: true, // "Add Associated Products"
          contact: c1.contacts[0].name, promise_date: usDate(addDays(3)), fob: 'Origin',
          note: 'QA order note', message: 'QA order message', notes: 'QA order terms and conditions',
          shipping_handling: 5, insurance: 2, total_discount_view: 1,
        },
        shipVia: 'QA Ground', // created from the picker (no Ship Via records exist)
        invoiceAddress: c1.contacts.find((x) => x.type === 'Billing Address').name,
        deliveryAddress: c1.contacts.find((x) => x.type === 'Delivery Address').name,
        // Location (warehouse) skipped for now, as requested.
        route: d.route.name,
        dropLocation: true,
      },
    });
    state.set('c1Invoice', { url: r.invoiceUrl, name: r.invoiceName, total: r.invoice.total, orderUrl: r.orderUrl });
    if (r.serviceInvoice) state.set('c1ServiceInvoice', { url: r.serviceInvoice.url, name: r.serviceInvoice.name, total: r.serviceInvoice.totals.total });
    state.set('c1InvoiceName', r.invoiceName);
  });

  test(...tc('TC-029'), async ({ salesPage }) => {
    const r = await salesPage.orderToInvoice({
      customer: d.customer1.name,
      lines: [CASE('p1')],
      expectations: { ...flags('p1'), taxPositive: true, charges: ['subsidy product', 'fuel charge', 'hazard fee'] },
      extras: fullOrder(d.customer1),
    });
    state.set('c1InvoiceNoService', { url: r.invoiceUrl, name: r.invoiceName, total: r.invoice.total, orderUrl: r.orderUrl });
  });

  // TC-030..TC-037: Customer 2 x Products 1-4, with / without service product.
  const matrix = [
    ['TC-030', 'p1', true], ['TC-031', 'p1', false],
    ['TC-032', 'p2', true], ['TC-033', 'p2', false],
    ['TC-034', 'p3', true], ['TC-035', 'p3', false],
    ['TC-036', 'p4', true], ['TC-037', 'p4', false],
  ];
  for (const [id, key, withService] of matrix) {
    test(...tc(id), async ({ salesPage }) => {
      const r = await salesPage.orderToInvoice({
        customer: d.customer2.name,
        lines: withService ? [CASE(key), SERVICE_CASE()] : [CASE(key)],
        expectations: flags(key),
        extras: fullOrder(d.customer2),
      });
      // Customer 2 has no Fuel Charge / Hazard Fee / Subsidy configured.
      for (const label of ['Fuel Charge', 'Hazard Fee', 'Subsidy']) {
        await expect(salesPage.page.locator('.o_form_view')).not.toContainText(new RegExp(`${label}\\s*\\$?\\s*[1-9]`, 'i'));
      }
      state.set(`c2Invoice_${key}_${withService ? 'svc' : 'nosvc'}`, { url: r.invoiceUrl, name: r.invoiceName, total: r.invoice.total, subtotal: r.invoice.subtotal, orderUrl: r.orderUrl });
    });
  }

  test(...tc('TC-038'), async ({ salesPage, inventoryPage }) => {
    const before = await inventoryPage.onHand(state.get('p1Url'));
    const lines = [SERVICE_CASE()];
    const extras = fullOrder(d.customer2);
    const order = await salesPage.createOrder({ customer: d.customer2.name, lines, extras });
    await test.step('Every field saved on the order', () => salesPage.expectOrderExtras(extras, lines, salesPage.lastOrderPicked));
    order.name = await salesPage.confirmOrder();
    await salesPage.expectStatus(/Confirmed|Open/i);
    await test.step('Service-only order does not appear on the Pick List (no material movement)', async () => {
      await salesPage.openApp('Customer Care');
      await salesPage.openMenu('Delivery', 'Pick List');
      await expect(salesPage.rows(order.name)).toHaveCount(0);
    });
    expect(await inventoryPage.onHand(state.get('p1Url')), 'no stock movement for a service-only order').toBe(before);
    state.set('serviceOrderUrl', order.url);
  });

  // Added case: order lifecycle - create, confirm, cancel, delete.
  test(...tc('TC-038A'), async ({ salesPage }) => {
    const lines = [CASE('p1')];
    const extras = fullOrder(d.customer2);
    const order = await test.step('Create sales order', () => salesPage.createOrder({ customer: d.customer2.name, lines, extras }));
    await test.step('Every field saved on the order', () => salesPage.expectOrderExtras(extras, lines, salesPage.lastOrderPicked));
    order.name = await test.step('Confirm', () => salesPage.confirmOrder());
    await salesPage.expectStatus(/Confirmed/i);
    await test.step('Cancel the confirmed order', () => salesPage.cancelOrder());
    await test.step(`Delete ${order.name} and check it is gone`, () => salesPage.deleteOrder(order.name));
  });

  test(...tc('TC-053'), async ({ salesPage }) => {
    const { order: qty, deliver } = d.qty.backorder;
    const order = await salesPage.createOrder({ customer: d.customer2.name, lines: [{ product: d.products.p2, qty }] });
    order.name = await salesPage.confirmOrder();
    await test.step(`Pick/deliver ${deliver} of ${qty}`, () => salesPage.deliver(order.name, { pickQty: { [d.products.p2.name]: deliver } }));
    await test.step('Backorder holds the remaining quantity', async () => {
      await salesPage.openApp('Customer Care');
      await salesPage.openMenu('Delivery', 'Backorders');
      const row = salesPage.rows(order.name).first();
      await expect(row, `${order.name} listed under Backorders`).toBeVisible();
      await expect(row).toContainText(/Back\s*Order/i);
      // The Backorders list has no quantity column: read the order line (Quantity / Delivered / Invoiced).
      await salesPage.openOrder(order.name);
      const line = salesPage.orderLine(d.products.p2.code);
      const num = async (n) => parseFloat((await line.locator(`td[name="${n}"]`).innerText()).replace(/[^0-9.-]/g, ''));
      expect(await num('product_uom_qty'), 'ordered').toBe(qty);
      expect(await num('qty_delivered'), 'delivered so far').toBe(deliver);
      expect(await num('qty_invoiced'), 'invoiced so far').toBe(deliver);
      expect(qty - (await num('qty_delivered')), 'remaining on backorder').toBe(qty - deliver);
    });
    await test.step('Deliver the backorder', () => salesPage.deliver(order.name));
    await salesPage.openOrder(order.name);
    expect(await salesPage.invoiceCount(), 'two invoices for the split delivery').toBe(2);
    state.set('backorderSoUrl', order.url);
  });

  // Price / UoM change on Customer 1's Product 1 line (these reports track customer/micromarket product changes).
  test(...tc('TC-039'), async ({ customerCarePage, reportsPage }) => {
    await customerCarePage.openCustomer(d.customer1.name);
    await customerCarePage.openTab('Order Products');
    const oldPrice = parseFloat((await customerCarePage.readProductLine(d.products.p1.code, 'list_price')).replace(/[^0-9.]/g, ''));
    await customerCarePage.setProductLine(d.products.p1.code, 0, { list_price: d.newPrice });
    await customerCarePage.save();
    const text = await reportsPage.run({
      category: 'Inventory',
      tile: 'Product Price Change Report',
      filters: { Type: 'Customer Products', start: today(), end: today() },
      expectContains: [d.products.p1.code],
    });
    ReportsPage.expectRowNumbers(text, d.products.p1.code, [oldPrice, d.newPrice]);
  });

  test(...tc('TC-040'), async ({ customerCarePage, reportsPage }) => {
    // The report reads uom.change.history ("UoM change in Product Master"). Product UoM is read-only on the
    // product form and the instance has no history rows at all; see FINDINGS.md. The customer-line UoM change
    // below is the closest UI change available; the line is always restored to Each afterwards.
    try {
      await customerCarePage.updateProductLine(d.customer1.name, d.products.p1.code, { uom_id: d.uom.name });
      const text = await reportsPage.run({
        category: 'Inventory',
        tile: 'Product UoM Change Report',
        filters: { start: today(), end: today() },
        expectContains: [d.products.p1.code, d.uom.reference, d.uom.name],
      });
      expect(ReportsPage.rowFor(text, d.uom.name)).toContain(d.customer1.name);
    } finally {
      await customerCarePage.updateProductLine(d.customer1.name, d.products.p1.code, { uom_id: d.uom.reference });
    }
  });
});
