const { test, expect, tc } = require('../fixtures');
const d = require('../data/testData');
const state = require('../utils/state');
const { today, firstOfMonth, usDate, addDays } = require('../utils/dates');
const { ReportsPage } = require('../pages/ReportsPage');

const range = () => ({ start: firstOfMonth(), end: today() });
const codes = () => Object.values(d.products).map((p) => p.code);

test.describe.serial('Inventory movements (TC-077, TC-078)', () => {
  // TC-073..TC-076 (inventory reports) use Micro Market data and run in 11-micromarket-reports.spec.js,
  // after the Micro Market cases (Excel: TC-104..TC-107).

  test(...tc('TC-077'), async ({ inventoryPage }) => {
    // Second bin in the same warehouse as the transfer destination.
    if (!state.optional('bin2Url')) state.set('bin2Url', await inventoryPage.createBin({ name: d.bin2.name, warehouse: d.warehouse.name }));
    // Every editable field; the line is in the TC-003 case UoM, so stock moves qty x 12 units.
    const extras = {
      issuer: 'Komala', ...(d.transferOwner ? { owner: d.transferOwner } : {}), scheduledDate: `${usDate(addDays(1))} 11:00`, shippingPolicy: 'When all products are ready',
      note: 'QA material transfer note', uom: d.uom.name, cost: d.products.p1.cost,
    };
    const r = await inventoryPage.materialTransfer({
      product: d.products.p1, from: d.warehouse.name, fromBin: d.bin.name, to: d.warehouse.name, toBin: d.bin2.name, qty: d.qty.transfer, receiver: d.manager, extras,
    });
    const units = d.qty.transfer * d.uom.ratio;
    expect.soft(r.after.source, `${r.name}: source ${d.warehouse.name}/${d.bin.name} decreases by ${units} (see FINDINGS.md TC-077)`).toBe(r.before.source - units);
    expect.soft(r.after.dest, `${r.name}: destination ${d.bin2.name} increases by ${units}`).toBe(r.before.dest + units);
  });

  test(...tc('TC-078'), async ({ inventoryPage }) => {
    // Every type of Virtual Location Stock Transfer with every field (User, Transfer Reason, Category, Products, line UoM + qty).
    // Lines use the TC-003 case UoM: 1 case = 12 units.
    const p1Url = state.get('p1Url');
    const extras = (type) => ({ user: 'Komala', reason: `QA ${type} transfer`, category: d.category.name, uom: d.uom.name, ratio: d.uom.ratio });
    const qty = 1;
    let virtual;

    await test.step('Warehouse to Warehouse: WH-QA-001 -> main warehouse (total on-hand unchanged)', async () => {
      const before = await inventoryPage.onHand(p1Url);
      const r = await inventoryPage.virtualTransfer({ type: 'Warehouse to Warehouse', from: d.warehouse.name, to: d.mainWarehouse, product: d.products.p1, qty, extras: extras('warehouse') });
      expect(r.error, 'Add loads the product line').toBeUndefined();
      expect.soft(r.onHandBefore, 'source warehouse stock shown before the transfer').toBeGreaterThanOrEqual(r.units);
      expect.soft(await inventoryPage.onHand(p1Url), `${r.name}: internal move keeps total on-hand`).toBe(before);
      const rows = await inventoryPage.stockHistoryRows(p1Url, 3);
      expect.soft(rows.some((t) => t.includes(d.warehouse.name) && t.includes(`${d.mainWarehouseLoc}/`) && t.includes(String(qty))), `${r.name}: history has ${d.warehouse.name} -> ${d.mainWarehouseLoc} move\n${rows.join('\n')}`).toBe(true);
    });

    await test.step('Warehouse to Virtual Location: WH-QA-001 -> virtual (total on-hand decreases)', async () => {
      const before = await inventoryPage.onHand(p1Url);
      const r = await inventoryPage.virtualTransfer({ type: 'Warehouse to Virtual Location', from: d.warehouse.name, product: d.products.p1, qty, extras: extras('to virtual') });
      expect(r.error, 'Add loads the product line').toBeUndefined();
      virtual = r.virtual;
      expect.soft(r.onHandBefore, 'warehouse stock shown before the transfer').toBeGreaterThanOrEqual(r.units);
      expect.soft(await inventoryPage.onHand(p1Url), `${r.name}: on-hand -${r.units}`).toBe(before - r.units);
      await inventoryPage.stockHistoryContains(p1Url, r.virtual.split('/').pop().trim());
    });

    await test.step('Virtual Location to Warehouse: virtual -> WH-QA-001 (total on-hand increases)', async () => {
      const before = await inventoryPage.onHand(p1Url);
      const r = await inventoryPage.virtualTransfer({ type: 'Virtual Location to Warehouse', from: virtual, to: d.warehouse.name, product: d.products.p1, qty, extras: extras('from virtual') });
      expect(r.error, 'Add loads the product line').toBeUndefined();
      expect.soft(await inventoryPage.onHand(p1Url), `${r.name}: on-hand +${r.units}`).toBe(before + r.units);
      const rows = await inventoryPage.stockHistoryRows(p1Url, 3);
      expect.soft(rows.some((t) => t.includes(virtual.split('/').pop().trim()) && t.includes(d.warehouse.name)), `${r.name}: history has ${virtual} -> ${d.warehouse.name}\n${rows.join('\n')}`).toBe(true);
    });

    await test.step('Truck to Warehouse: TRUCK-QA-001 stock -> main warehouse', async () => {
      // The truck was loaded from Martiserv (TC-026..038). See FINDINGS.md TC-078: Add crashes for Martiserv.
      const r = await inventoryPage.virtualTransfer({ type: 'Truck to Warehouse', to: d.mainWarehouse, product: d.products.p4, qty, extras: extras('truck') });
      expect.soft(r.error, 'Truck to Warehouse: Add loads the truck stock (see FINDINGS.md TC-078)').toBeUndefined();
    });
  });
});
