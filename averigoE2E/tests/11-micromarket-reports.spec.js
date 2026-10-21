const { test, expect, tc } = require('../fixtures');
const d = require('../data/testData');
const state = require('../utils/state');
const { today, firstOfMonth, usDate, addDays } = require('../utils/dates');
const { ReportsPage } = require('../pages/ReportsPage');

const mm = () => [d.microMarket.name];
const range = () => ({ start: firstOfMonth(), end: today() });

/**
 * Sales-based Micro Market reports need kiosk/terminal sales, which can't be created from the back office.
 * Passes when the report generates without an error (results table or "no records" shown). When our market has sales
 * rows, the expected values are checked too; with none, a "No sales data" note is added to the result.
 */
async function salesReport(reportsPage, { tile, filters, expectContains = [] }) {
  await reportsPage.openReport('MicroMarket', tile);
  await reportsPage.setFilters(filters);
  await reportsPage.generate();
  // Generated without an error: no error dialog / notification, and a result (table or "no records") is shown.
  await reportsPage.expectNoError();
  await expect(reportsPage.page.locator('.o_notification.border-danger, .o_notification_bar.bg-danger'), `${tile}: no error notification`).toHaveCount(0);
  await expect(reportsPage.container().locator('table').or(reportsPage.container().getByText(/No (Records|data) Found|No products found/i)).first(), `${tile}: results shown`).toBeVisible();
  const text = await reportsPage.output();
  const hasOurMarket = text.includes(d.microMarket.name) || expectContains.some((v) => text.includes(v));
  if (!hasOurMarket) {
    test.info().annotations.push({ type: 'No sales data', description: `${tile}: generated without errors; no kiosk/terminal sales for ${d.microMarket.name} (sales can't be created from the back office), so values weren't checked` });
    return text;
  }
  for (const v of expectContains) expect(text).toContain(v);
  return text;
}

test.describe.serial('Micro Market & inventory reports (TC-099C, TC-073..TC-076, TC-100..TC-109)', () => {
  test(...tc('TC-099C'), async ({ microMarketPage, inventoryPage }) => {
    // A dedicated market per run (a closed market can't be reused; the main QA market stays open for the reports).
    const slot = (state.optional('closeMarketSlot') ?? 0) + 1;
    state.set('closeMarketSlot', slot);
    const name = `${d.microMarket.name}-CLOSE${slot}`;
    const p1 = d.products.p1;
    const url = await test.step(`Create ${name} with Product 1`, () => microMarketPage.createMarket({
      name, customer: d.customer1.name, zip: d.microMarket.zip, street: d.microMarket.street, products: [p1],
    }));
    state.set('closedMarketUrl', url);
    const stock = await test.step('Stock it: store order of 2 x Product 1', async () => {
      await microMarketPage.createStoreOrder({ warehouse: d.warehouse.name, location: name, qtyByCode: { [p1.code]: 2 } });
      // (Receipt books the quantity twice, see FINDINGS.md TC-095: read what the market actually holds.)
      return microMarketPage.marketStock(url, p1.name);
    });
    expect(stock, 'market holds stock before closing').toBeGreaterThan(0);
    const reason = `QA close market test ${slot}`;
    const { closeDate } = await test.step('Active Market > Close Market: reason + transfer stock to WH-QA-001 > Confirm', () =>
      microMarketPage.closeMarket(url, { reason, transferTo: d.warehouse.name }));
    expect.soft(closeDate, 'closed date defaults to today').toBe(today());

    await test.step('Market shows as closed (smart button "Closed Market"; it is not archived)', async () => {
      await microMarketPage.goto(url);
      await expect(microMarketPage.page.locator('button[name="close_market_form"]'), 'smart button').toContainText(/Closed Market/);
    });
    await test.step(`Stock transferred: market 0, ${stock} moved to ${d.warehouse.name}`, async () => {
      expect.soft(await microMarketPage.marketStock(url, p1.name).catch(() => 0), 'market stock after close').toBe(0);
      const rows = await inventoryPage.stockHistoryRows(state.get('p1Url'), 4);
      test.info().annotations.push({ type: 'Product 1 moves', description: rows.join('\n') });
      expect.soft(rows.some((r) => r.includes(`${name}/`) && r.includes(`${d.warehouse.name}/`) && r.includes(`| ${stock} |`)), `move of ${stock} from ${name} to ${d.warehouse.name}:\n${rows.join('\n')}`).toBe(true);
    });
    await test.step('A new store order no longer offers the closed market', async () => {
      await microMarketPage.open('Store Orders');
      await microMarketPage.clickNew();
      await microMarketPage.fill({ warehouse_id: d.warehouse.name });
      const input = microMarketPage.field('micro_market_id').locator('input').first();
      await input.click();
      await input.fill(name);
      await expect.soft(microMarketPage.page.locator('.o-autocomplete--dropdown-item').filter({ hasText: name }), `${name} not offered`).toHaveCount(0);
      await microMarketPage.page.keyboard.press('Escape');
      await microMarketPage.discard();
    });
  });

  test(...tc('TC-073'), async ({ reportsPage }) => {
    // Product 1 has purchases, bills, pack slips and adjustments from the earlier specs, which may have run on earlier
    // days: the report window starts two weeks back (rows are matched by product / bill number).
    const since = usDate(addDays(-14));
    const text = await reportsPage.run({
      category: 'Inventory', tile: 'Product Transaction Report (Inventory)',
      filters: { products: [d.products.p1.name], start: since, end: today(), 'Transaction Type': 'All Types' },
      expectContains: [d.products.p1.code],
    });
    for (const type of ['Purchase', 'Bill', 'Pack Slip', 'Quantity Adjustment']) expect(text, `${type} transactions listed`).toContain(type);
    await test.step('Vendor Invoice Report (disbursements)', () => reportsPage.run({
      category: 'Accounts Payable', tile: 'Vendor Invoice Report',
      filters: { vendor: [d.vendor.name], start: since, end: today(), 'Report Type': 'Detail' },
      expectContains: [state.get('p4Bill').billName],
    }));
    await test.step('Sales By Product Report (Micro Market sales)', () => salesReport(reportsPage, {
      tile: 'Sales By Product Report', filters: { microMarket: mm(), ...range() },
    }));
  });

  test(...tc('TC-074'), async ({ microMarketPage, reportsPage }) => {
    // Overage / spoilage / shrinkage on the market via Update Location (Actual above stock = overage).
    await microMarketPage.updateLocation({ market: d.microMarket.name, product: d.products.p2, values: { spoiled_qty: 1, theft_qty: 1 } });
    const text = await reportsPage.run({
      category: 'Inventory', tile: 'Overage Spoilage Shrinkage Report',
      filters: { microMarket: mm(), start: today(), end: today(), 'Report Type': 'Detail' },
      expectContains: [d.products.p2.name],
    });
    const rows = text.split('\n').filter((l) => l.includes(d.products.p2.name));
    for (const type of ['Spoil', 'Shrink']) expect.soft(rows.some((r) => new RegExp(type, 'i').test(r)), `${type} row for ${d.products.p2.code}`).toBe(true);
  });

  test(...tc('TC-075'), async ({ inventoryPage, reportsPage }) => {
    const p3 = d.products.p3;
    const before = await inventoryPage.onHand(state.get('p3Url'));
    const rec = await inventoryPage.reconcileWarehouse({ warehouse: d.warehouse.name, product: p3, overage: 2, spoilage: 1, shrinkage: 1 });
    state.set('warehouseReconciliation', rec);
    // Net effect on stock: +2 overage - 1 spoilage - 1 shrinkage = 0.
    // Soft check: records the stock defect (FINDINGS.md) but still validates the report below.
    expect.soft(await inventoryPage.onHand(state.get('p3Url')), 'net stock change 0 (+2 overage -1 spoilage -1 shrinkage)').toBe(before);
    const text = await reportsPage.run({
      category: 'Inventory',
      tile: 'Overage Shrinkage Spoilage (Warehouse) Report',
      filters: { warehouse: [d.warehouse.name], start: today(), end: today(), 'Report Type': 'Detail' },
      expectContains: [p3.code],
    });
    // One row per adjustment type: Warehouse | User | Date | Product | Code | Category | Type | Cost | Qty | Total
    const rows = text.split('\n').filter((l) => l.includes(p3.code));
    for (const [type, qty] of [['Overage', 2], ['Spoilage', 1], ['Shrinkage', 1]]) {
      expect.soft(rows.some((r) => new RegExp(`\\t${type}\\t`, 'i').test(r) && r.split('\t').map((c) => c.trim()).includes(String(qty))), `${type} ${qty} reported for ${p3.code}`).toBe(true);
    }
  });

  test(...tc('TC-076'), async ({ reportsPage }) => {
    await test.step('Inventory Change Report (Micro Market)', () => reportsPage.run({
      category: 'Inventory', tile: 'Inventory Change Report',
      filters: { start: today(), end: today() },
      expectContains: [d.products.p2.code],
    }));
    await test.step('Inventory Change Report (Warehouse)', async () => {
      const rec = state.get('warehouseReconciliation');
      await reportsPage.run({
        category: 'Inventory', tile: 'Inventory Change Report (Warehouse)',
        filters: { start: today(), end: today() },
        expectContains: [rec.name, d.products.p3.code],
      });
    });
  });

  test(...tc('TC-100'), async ({ reportsPage, microMarketPage }) => {
    const mmUrl = state.get('mmUrl');
    const p1Stock = await microMarketPage.marketValue(mmUrl, d.products.p1.name, 'quantity');
    const p1MinMax = { min: await microMarketPage.marketValue(mmUrl, d.products.p1.name, 'min_qty'), max: await microMarketPage.marketValue(mmUrl, d.products.p1.name, 'max_qty') };
    await microMarketPage.goto(state.get('storeOrderUrl'));
    const storeOrder = await microMarketPage.recordTitle();

    await test.step('Stock Value Report', async () => {
      const text = await reportsPage.run({ category: 'MicroMarket', tile: 'Stock Value Report', filters: { microMarket: mm(), date: today(), 'Report Type': 'Detail' }, expectContains: [d.products.p1.code] });
      ReportsPage.expectRowNumbers(text, d.products.p1.code, [p1Stock]);
    });
    await test.step('Stock Analysis Report', () => reportsPage.run({ category: 'MicroMarket', tile: 'Stock Analysis Report', filters: { microMarket: mm(), 'Report Type': 'Summary' }, expectContains: [d.customer1.name] }));
    await test.step('Store Order List Report', async () => {
      const text = await reportsPage.run({ category: 'MicroMarket', tile: 'Store Order List Report', filters: { microMarket: mm(), start: today(), end: today(), Status: 'Received' }, expectContains: [storeOrder] });
      ReportsPage.expectRowNumbers(text, storeOrder, [2 * d.qty.storeOrder]);
    });
    await test.step('Unpicked Product List Report: fully picked order is not listed', async () => {
      await reportsPage.openReport('MicroMarket', 'Unpicked Product List Report');
      await reportsPage.setFilters({ microMarket: mm(), start: today(), end: today() });
      await reportsPage.generate();
      expect(await reportsPage.output()).not.toContain(storeOrder);
    });
    await test.step('Products with Min/Max Report', async () => {
      const text = await reportsPage.run({ category: 'MicroMarket', tile: 'Products with Min/Max Report', filters: { microMarket: mm() }, expectContains: [d.products.p1.code] });
      // TC-096 alternates between Min/Max 2/10 and 3/12 across runs: compare with what the market holds now.
      ReportsPage.expectRowNumbers(text, d.products.p1.code, [p1MinMax.min, p1MinMax.max]);
    });
    for (const tile of ['Product Move Report', 'Subsidy Report', 'Where Sold Report']) {
      await test.step(`${tile} (sales based)`, async () => {
        await reportsPage.openReport('MicroMarket', tile);
        await reportsPage.setFilters({ microMarket: mm(), ...range() });
        await reportsPage.generate();
        await expect(reportsPage.page.locator('.o_action_manager table')).toBeVisible();
      });
    }
  });

  const salesCases = [
    ['TC-101', 'Customer Commission Report', () => ({ 'Micromarket Type': 'All Types', microMarket: mm(), ...range() })],
    ['TC-102', 'Employee Discount Report', () => ({ microMarket: mm(), ...range(), 'Report Type': 'Detail' }), () => [d.employee.name]],
    ['TC-103', 'Payroll Deduction Report', () => ({ customers: [d.customer1.name], microMarket: mm(), ...range() })],
    ['TC-104', 'Micromarket Sales Analysis Report', () => ({ customers: [d.customer1.name], microMarket: mm(), ...range() })],
    ['TC-106', 'Product Rank Report', () => ({ microMarket: mm(), ...range(), 'Report Type': 'Detail' }), () => [d.products.p1.name]],
    ['TC-107', 'Terminal Report', () => ({ microMarket: mm(), ...range() })],
    ['TC-108', 'Daily Net Sales By Customer Report', () => ({ ...range() })],
    ['TC-109', 'Monthly Net Sales By Customer', () => ({ ...range() })],
  ];
  for (const [id, tile, filters, contains] of salesCases) {
    test(...tc(id), async ({ reportsPage }) => {
      await salesReport(reportsPage, { tile, filters: filters(), expectContains: contains ? contains() : [] });
    });
  }

  test(...tc('TC-105'), async ({ reportsPage }) => {
    await salesReport(reportsPage, { tile: 'Periodic Sales Report', filters: { Type: 'Monthly', Year: String(new Date().getFullYear()) } });
    await salesReport(reportsPage, { tile: 'Weekly Sales Report', filters: { customers: [d.customer1.name], microMarket: mm() } });
  });
});
