const { test, expect, tc } = require('../fixtures');
const d = require('../data/testData');
const state = require('../utils/state');
const { today } = require('../utils/dates');

const master = () => ({ category: d.category.name, uom: d.uom.reference, bin: d.bin.name, uomType: d.uom.name, uomQty: d.uom.ratio });
const productCodes = () => [...Object.values(d.products).map((p) => p.code), d.service.code];

test.describe.serial('Products (TC-010..TC-016)', () => {
  const productCases = { 'TC-010': 'p1', 'TC-011': 'p2', 'TC-012': 'p3', 'TC-013': 'p4' };

  for (const [id, key] of Object.entries(productCases)) {
    test(...tc(id), async ({ inventoryPage }) => {
      const p = d.products[key];
      const url = await test.step(`Create ${p.code} (tax ${p.tax ? 'ON' : 'OFF'}, deposit ${p.deposit ? 'ON' : 'OFF'})`, () =>
        inventoryPage.createProduct(p, master()));
      state.set(`${key}Url`, url);
      const picked = inventoryPage.lastPicked || {};
      await test.step('Reopen and verify saved configuration', () => inventoryPage.expectProduct(url, p, master(), picked));
    });
  }

  test(...tc('TC-014'), async ({ inventoryPage }) => {
    // Same create / resume / verify path as Products 1-4 (product_type Service, no UPC).
    const url = await test.step('Create service product (all fields)', () => inventoryPage.createProduct(d.service, master()));
    state.set('serviceUrl', url);
    const picked = inventoryPage.lastPicked || {};
    await test.step('Reopen and verify saved configuration', () => inventoryPage.expectProduct(url, d.service, master(), picked));
    await test.step('Service product is listed in Product Master (selectable on orders/invoices, used in TC-026)', async () => {
      await inventoryPage.openProductMaster();
      await inventoryPage.expectInList(d.service.code);
    });
  });

  test(...tc('TC-015'), async ({ reportsPage }) => {
    await reportsPage.run({
      category: 'Inventory',
      tile: 'Product Addition/Deletion Report',
      filters: { start: today(), end: today() },
      expectContains: productCodes(),
    });
  });

  test(...tc('TC-016'), async ({ reportsPage }) => {
    const text = await reportsPage.run({
      category: 'Inventory',
      tile: 'Product Master Report',
      filters: { 'Report Type': 'Product Master', category: d.category.name, Type: 'Detailed' },
      expectContains: [...productCodes(), d.category.name, d.products.p1.upc],
    });
    // Each product row carries its category and UoM.
    for (const p of Object.values(d.products)) {
      const line = text.split('\n').find((l) => l.includes(p.code)) || '';
      expect(line, `${p.code} row`).toContain(d.uom.reference);
    }
  });
});
