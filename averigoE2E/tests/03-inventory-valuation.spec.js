const { test, expect, tc } = require('../fixtures');
const d = require('../data/testData');
const state = require('../utils/state');
const { expectMoney } = require('../utils/money');
const { today } = require('../utils/dates');
const { ReportsPage } = require('../pages/ReportsPage');

test.describe.serial('Inventory adjustments & valuation (TC-017..TC-021)', () => {
  test(...tc('TC-017'), async ({ inventoryPage }) => {
    const p1 = state.get('p1Url');
    const before = await inventoryPage.onHand(p1);
    await inventoryPage.inventoryAdjustment({ product: d.products.p1.code, qty: d.qty.adjustment, warehouse: d.warehouse.name });
    const after = await inventoryPage.onHand(p1);
    expect(after, 'on-hand increases by the adjustment').toBe(before + d.qty.adjustment);

    await test.step('Adjustment appears in stock history (Traceability)', () => inventoryPage.stockHistoryContains(p1, d.warehouse.name));

    // Seed stock for products 1-4 in one adjustment so later sales/transfers never run negative.
    await test.step('Seed stock for products 1-4', () => inventoryPage.quantityAdjustment({
      warehouse: d.warehouse.name,
      lines: ['p1', 'p2', 'p3', 'p4'].map((k) => ({ product: d.products[k].code, qty: d.qty.stockForSales })),
    }));
  });

  test(...tc('TC-018'), async ({ inventoryPage }) => {
    // Value adjustment for every stocked product (Products 1-4) in one document.
    const lines = [];
    for (const [k, newCost] of Object.entries(d.newCosts)) {
      const cost = await inventoryPage.cost(state.get(`${k}Url`));
      // The original cost is recorded once, so a re-run can't overwrite it (TC-020 compares old vs new).
      if (state.optional(`${k}OldCost`) === undefined) state.set(`${k}OldCost`, cost);
      if (Math.abs(cost - newCost) > 0.0001) lines.push({ product: d.products[k].code, newCost });
    }
    if (lines.length) {
      await test.step(`Value adjustment: ${lines.map((l) => `${l.product} -> ${l.newCost}`).join(', ')}`, () => inventoryPage.valueAdjustment({ lines }));
    }
    for (const [k, newCost] of Object.entries(d.newCosts)) {
      expectMoney(await inventoryPage.cost(state.get(`${k}Url`)), newCost, `${d.products[k].code} cost after value adjustment`);
    }
  });

  test(...tc('TC-019'), async ({ inventoryPage, reportsPage }) => {
    // Every product revalued in TC-018: on-hand and value (on-hand x new cost) in the warehouse report.
    const keys = Object.keys(d.newCosts);
    const onHand = {};
    for (const k of keys) onHand[k] = await inventoryPage.onHand(state.get(`${k}Url`));
    const text = await reportsPage.run({
      category: 'Inventory',
      tile: 'Stock Value Report (Warehouse)',
      filters: { warehouse: d.warehouse.name, date: today(), 'Report Type': 'Detail' },
      expectContains: keys.map((k) => d.products[k].code),
    });
    for (const k of keys) ReportsPage.expectRowNumbers(text, d.products[k].code, [onHand[k], onHand[k] * d.newCosts[k]]);
  });

  test(...tc('TC-020'), async ({ reportsPage }) => {
    // Old -> new cost for every product revalued in TC-018.
    const keys = Object.keys(d.newCosts);
    const text = await reportsPage.run({
      category: 'Inventory',
      tile: 'Product Cost Change Report',
      filters: { start: today(), end: today() },
      expectContains: [...keys.map((k) => d.products[k].code), today()],
    });
    for (const k of keys) ReportsPage.expectRowNumbers(text, d.products[k].code, [state.get(`${k}OldCost`), d.newCosts[k]]);
  });

  test(...tc('TC-021'), async ({ inventoryPage, customerCarePage }) => {
    const codes = d.customerCatalogue.products.map((k) => d.products[k].code);
    const url = await inventoryPage.createProductCatalogue({ name: d.customerCatalogue.name, type: 'Customer', products: codes });
    state.set('customerCatalogueUrl', url);
    for (const c of codes) await expect(inventoryPage.field('catalog_product_ids')).toContainText(c);
    await test.step('Catalogue is available on the customer form', async () => {
      await customerCarePage.openNewCustomer();
      await customerCarePage.addCatalogue(d.customerCatalogue.name);
      for (const c of codes) await expect(customerCarePage.orderProductRow(c)).toBeVisible();
      await customerCarePage.discard();
    });
  });
});
