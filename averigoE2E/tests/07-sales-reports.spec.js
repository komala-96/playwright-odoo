const { test, expect, tc } = require('../fixtures');
const d = require('../data/testData');
const state = require('../utils/state');
const { today, firstOfMonth } = require('../utils/dates');
const { ReportsPage } = require('../pages/ReportsPage');

// Sales/AR reports. Customer 2 carries the order/invoice matrix (TC-030..037), returns and payments;
// Customer 1 rows are asserted once its orders exist (needs Setup > Default Setup, see FINDINGS.md).
const c2Invoices = () => ['p1', 'p2', 'p3', 'p4'].flatMap((k) => ['svc', 'nosvc'].map((s) => state.optional(`c2Invoice_${k}_${s}`))).filter(Boolean);

test.describe.serial('Sales / AR reports (TC-048..TC-052, TC-054..TC-057)', () => {
  test(...tc('TC-048'), async ({ reportsPage, customerCarePage }) => {
    const balance = await customerCarePage.balance(d.customer2.name);
    const text = await reportsPage.run({
      category: 'Accounts Receivable',
      tile: 'Aging By Customer Report',
      filters: { customers: [d.customer2.name], date: today(), 'Report Type': 'Summary' },
      expectContains: [d.customer2.name],
    });
    // Everything was invoiced today: the whole open balance is "Current" and equals the Total column.
    ReportsPage.expectRowNumbers(text, d.customer2.name, [balance]);
  });

  test(...tc('TC-049'), async ({ reportsPage, accountingPage }) => {
    const open = [];
    for (const inv of c2Invoices().slice(0, 4)) {
      await accountingPage.goto(inv.url);
      const due = await accountingPage.residual();
      if (due > 0) open.push({ name: inv.name, due });
    }
    expect(open.length, 'Customer 2 has open invoices to state').toBeGreaterThan(0);
    const text = await reportsPage.run({
      category: 'Accounts Receivable',
      tile: 'Open Invoice Customer Statement',
      filters: { customers: [d.customer2.name], 'As of Date': today() },
      expectContains: open.map((o) => o.name),
    });
    for (const o of open) ReportsPage.expectRowNumbers(text, o.name, [o.due]);
  });

  test(...tc('TC-050'), async ({ reportsPage }) => {
    const invoices = c2Invoices().slice(0, 3);
    const text = await reportsPage.run({
      category: 'Accounts Receivable',
      tile: 'Invoice List Report',
      filters: { customers: [d.customer2.name], start: firstOfMonth(), end: today(), 'Invoice Type': 'Sale Order Invoice', Status: 'All' },
      expectContains: invoices.map((i) => i.name),
    });
    for (const i of invoices) ReportsPage.expectRowNumbers(text, i.name, [i.total]);
    const rows = await reportsPage.exportRows({
      category: 'Accounts Receivable',
      tile: 'Invoice Export Report',
      filters: { customers: [d.customer2.name], start: firstOfMonth(), end: today() },
    });
    for (const i of invoices) expect(rows.some((r) => r.includes(i.name)), `export contains ${i.name}`).toBe(true);
  });

  test(...tc('TC-051'), async ({ reportsPage }) => {
    // TC-046/TC-047 paid Customer 2 invoices by Check into 101402.
    const text = await reportsPage.run({
      category: 'Accounts Receivable',
      tile: 'Receipt List Report',
      filters: { customers: [d.customer2.name], start: firstOfMonth(), end: today() },
      expectContains: [d.customer2.name, 'Check'],
    });
    expect(text).toMatch(/101402/);
  });

  test(...tc('TC-052'), async ({ reportsPage }) => {
    const subtotal = c2Invoices().reduce((a, i) => a + (i.subtotal || 0), 0);
    await test.step('Revenue By Customer - Delivery', async () => {
      const text = await reportsPage.run({
        category: 'Accounts Receivable',
        tile: 'Revenue By Customer - Delivery',
        filters: { customers: [d.customer2.name], start: firstOfMonth(), end: today() },
        expectContains: [d.customer2.name],
      });
      const amounts = (ReportsPage.rowFor(text, d.customer2.name).match(/[\d,]+\.\d{2}/g) || []).map((n) => parseFloat(n.replace(/,/g, '')));
      expect(Math.max(0, ...amounts), `delivered revenue >= order matrix subtotal ${subtotal}`).toBeGreaterThanOrEqual(subtotal - 0.01);
    });
    await test.step('Revenue By Customer Report (Micro Market revenue)', async () => {
      // Micro Market revenue; Customer 1's market sales are created in the Micro Market spec.
      await reportsPage.openReport('Accounts Receivable', 'Revenue By Customer Report');
      await reportsPage.setFilters({ start: firstOfMonth(), end: today() });
      await reportsPage.generate();
      await expect(reportsPage.page.locator('.o_action_manager table')).toBeVisible();
    });
  });

  test(...tc('TC-054'), async ({ reportsPage }) => {
    const text = await reportsPage.run({
      category: 'Inventory',
      tile: 'Where Sold Report (Warehouse)',
      filters: { customers: [d.customer2.name], start: firstOfMonth(), end: today(), Type: 'Sales Order' },
      expectContains: [d.products.p1.code, d.customer2.name],
    });
    // One row per sale: Sales Amount = Quantity Sold x Sold Price; Customer 2 bought >= 2 x qty 2 (TC-030, TC-031).
    let qty = 0;
    for (const row of text.split('\n').filter((l) => l.includes(d.products.p1.code))) {
      const cells = row.split('\t').map((c) => c.trim());
      const [q, price, amount] = cells.slice(-3).map((c) => parseFloat(c.replace(/[^0-9.-]/g, '')));
      expect(Math.abs(q * price - amount), `amount = qty x price in: ${row}`).toBeLessThan(0.01);
      qty += q;
    }
    expect(qty).toBeGreaterThanOrEqual(2 * d.qty.order);
  });

  test(...tc('TC-055'), async ({ reportsPage }) => {
    // The row names the order's billing contact (see FINDINGS.md), so Customer 2 is matched by its customer no.
    const text = await reportsPage.run({
      category: 'Customer Care',
      tile: 'Customer Order Activity Report',
      filters: { customers: [d.customer2.name] },
      expectContains: [d.customer2.code, today()],
    });
    expect(ReportsPage.rowFor(text, d.customer2.code), 'last order activity today').toContain(today());
    expect.soft(text, 'report names the customer').toContain(d.customer2.name);
  });

  test(...tc('TC-056'), async ({ reportsPage }) => {
    const list = await reportsPage.run({
      category: 'Customer Care',
      tile: 'Order List Report',
      filters: { customers: [d.customer2.name], 'Order Type': 'Sales Order', start: firstOfMonth(), end: today(), Status: 'All' },
      expectContains: [d.customer2.name],
    });
    expect(list.split('\n').filter((l) => l.includes(d.customer2.name)).length, 'Customer 2 orders listed').toBeGreaterThanOrEqual(8);
    const margin = await reportsPage.run({
      category: 'Customer Care',
      tile: 'Order Margin Report',
      filters: { customers: [d.customer2.name], start: firstOfMonth(), end: today(), 'Report Type': 'Summary' },
      expectContains: [d.customer2.name],
    });
    // Summary columns: ... | Order Amount | Subtotal | Total Cost | Margin | Margin %
    for (const row of margin.split('\n').filter((l) => l.includes(d.customer2.name))) {
      const money = (row.match(/-?\$\s?[\d,]+\.\d{2}/g) || []).map((x) => parseFloat(x.replace(/[$,\s]/g, '')));
      const pct = parseFloat((row.match(/(-?[\d.]+)\s*%/) || [])[1]);
      const [subtotal, cost, marginValue] = money.slice(-3);
      expect(Math.abs(subtotal - cost - marginValue), `Margin = Subtotal - Total Cost: ${row}`).toBeLessThan(0.02);
      if (subtotal) expect(Math.abs((marginValue / subtotal) * 100 - pct), `Margin % in: ${row}`).toBeLessThan(0.02);
    }
  });

  test(...tc('TC-057'), async ({ reportsPage, accountingPage }) => {
    const rate = state.get('salesTaxRate') * 100; // observed on the sales orders (8.625% in San Francisco)
    const text = await reportsPage.run({
      category: 'Accounts Payable',
      tile: 'Sales Tax Report',
      filters: { State: 'CA - California', customers: [d.customer2.name], start: firstOfMonth(), end: today(), 'Report Type': 'Summary' },
      expectContains: ['San Francisco'],
    });
    // State | Customer | County | Gross Sales | Total Sales | Non-Taxable | Taxable | Tax Rate (%) | Tax Amount
    const cells = ReportsPage.rowFor(text, 'San Francisco').split('\t').map((c) => parseFloat(c.replace(/[^0-9.-]/g, '')));
    const [gross, totalSales, nonTaxable, taxable, rateShown, taxAmount] = cells.slice(-6);
    expect(Math.abs(rateShown - rate), `Tax Rate ${rateShown}% vs order rate ${rate}%`).toBeLessThan(0.01);
    // Total Sales = Non-Taxable + Taxable; Gross also includes S&H / insurance charged on the orders.
    expect(Math.abs(totalSales - nonTaxable - taxable), 'Total Sales = Non-Taxable + Taxable').toBeLessThan(0.02);
    expect(gross, 'Gross Sales >= Total Sales (adds S&H / insurance)').toBeGreaterThanOrEqual(totalSales - 0.01);
    // Tax on the tracked Customer 2 order invoices (TC-030..037) is included in the report total.
    // Read each invoice's Tax Amount (total - subtotal would also count S&H / insurance / deposit / discount).
    let tracked = 0;
    for (const i of c2Invoices()) {
      await accountingPage.goto(i.url);
      tracked += await accountingPage.readMoney('tax_amount_view');
    }
    expect(taxAmount, `report tax ${taxAmount} >= tracked invoice tax ${tracked.toFixed(2)}`).toBeGreaterThanOrEqual(tracked - 0.01);
  });
});
