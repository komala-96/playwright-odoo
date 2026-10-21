/**
 * Performance run: the 14 business scenarios on the QA tenant (BASE_URL, default https://martiserv.averigoqa.com).
 *
 *   HEADLESS=1 npx playwright test -c perf/playwright.perf.config.js perf.spec.js
 *   node perf/report.js            # -> reports/Performance_Results.xlsx + .md (latest run, or RUN_ID=...)
 *
 * Every create scenario fills ALL fields available in the UI (the suite's full-field page objects and data, see
 * perf/perfData.js). Each step records:
 *   ms       - wall-clock time of the step as the user experiences it;
 *   serverMs - time the server spent on the save / create / confirm / delete calls made during the step.
 * Step kinds: app (user waits for the application), flow (filling + saving a full form: typing time included,
 * serverMs isolates the server part), ui (robot typing/selecting only), setup (not part of the measurement).
 *
 * Records are named PERF-...-<run>. Scenarios 1-3 create the customer / vendor / micromarket the 150-line orders use;
 * the delete scenarios delete records without transactions (the scenario 4 product, and a throwaway customer / vendor /
 * micromarket created in their own setup step).
 */
const { test, expect } = require('../fixtures');
const state = require('../utils/state');
const { usDate, addDays, today } = require('../utils/dates');
const { runScenario, clickAndSettle, pickManyViaSearchMore, setColumnOnAllRows, rpc, deleteOpenRecord } = require('./perfKit');
const P = require('./perfData');

const { ref, mine, SHORT } = P;
const LINES = Number(process.env.PERF_LINES || 150);
const WAREHOUSE = process.env.PERF_WAREHOUSE || 'Martiserv';
const ADDRESS = { zip: '94158', street: '1700 Owens St' };
const MONTHS_BACK = Number(process.env.PERF_REPORT_MONTHS || 3);

const names = {
  customer: P.customer.name,
  vendor: P.vendor.name,
  market: P.market.name,
  product: { code: P.product.code, name: P.product.name },
  equipmentSerial: `PERF-EQ-${SHORT}`,
  opportunity: `PERF-OPP-${SHORT}`,
  delCustomer: `PERF-DEL-CUST-${SHORT}`,
  delVendor: `PERF-DEL-VEND-${SHORT}`,
  delMarket: `PERF-DEL-MM-${SHORT}`,
};

/** LINES (+ spare) priced goods in the tenant's own "Each" UoM (products on the other "Each" UoM fail on Add). */
async function orderProducts(page) {
  const [uom] = await rpc(page, 'product.template', 'search_read', [[['default_code', '=', '10013']]], { fields: ['uom_id'] });
  // Priced products only: confirming an order with a 0-price line is refused ("Please set price for non-service products").
  const domain = [['type', '=', 'consu'], ['sale_ok', '=', true], ['purchase_ok', '=', true], ['default_code', '!=', false],
    ['list_price_1', '>', 0], ['list_price', '>', 0], ['standard_price', '>', 0]];
  if (uom?.uom_id) domain.push(['uom_id', '=', uom.uom_id[0]]);
  return rpc(page, 'product.product', 'search_read', [domain], { fields: ['default_code', 'name'], limit: LINES + 30, order: 'id' });
}

/** Minimal customer / vendor / market forms - only for the throwaway records the delete scenarios remove. */
async function fillNewCustomer(cc, name) {
  await cc.fill({ name });
  await cc.fill({ zip: ADDRESS.zip });
  await cc.fill({ street: ADDRESS.street });
  await cc.setAccounts();
}

async function fillNewVendor(pp, name) {
  await pp.fill({ name });
  await pp.fill({ zip: ADDRESS.zip });
  await pp.fill({ street: ADDRESS.street });
  await pp.openTab('Account Setup');
  await pp.fill({ property_account_payable_id: '211000' });
}

async function fillNewMarket(mm, name, customer) {
  await mm.fill({ location_type: 'Micromarket' });
  await mm.fill({ micro_market_type: 'Office' }).catch(() => {});
  await mm.fill({ name, partner_id: customer });
  await mm.fill({ zip: ADDRESS.zip });
  await mm.fill({ street: ADDRESS.street });
}

/** Market flags without Addl. Tax, whose onchange crashes on the server (FINDINGS.md TC-094). */
const knownGoodFlags = (flags) => Object.fromEntries(Object.entries(flags).filter(([f]) => f !== 'addl_tax'));

const saveButton = (odoo) => odoo.page.locator('.o_form_button_save').filter({ visible: true }).first();

/** Clicks Save and waits until the record has an id (creating some records, e.g. a market, takes minutes). */
async function timedSave(odoo) {
  await saveButton(odoo).click();
  await expect(odoo.page).not.toHaveURL(/\/new(\?|$)/, { timeout: 600_000 });
  await odoo.waitReady(600_000);
  await odoo.expectNoError();
  // Onchanges can leave the form dirty after the first click: finish with the regular save.
  await odoo.save({ timeout: 600_000 });
  return odoo.currentUrl();
}

// In order on one worker, but a failed scenario does not skip the next ones (each is measured on its own).
test.describe(`Performance - all fields, ${LINES}-line orders, delete, reports`, () => {
  test.describe.configure({ mode: 'default' });
  test.beforeAll(() => {
    console.log(`[perf] RUN_ID=${process.env.RUN_ID}  reference records from E2E run ${P.REF_RUN} (${ref.employee.name}, route ${ref.route.name})`);
  });

  test('01 Creation of customer', async ({ page, customerCarePage: cc }) => {
    await runScenario(1, 'Creation of customer (all fields)', async (s) => {
      const c = P.customer;
      const url = await s.step('Create customer: every field, 7 contacts/addresses, Order Products, catalogue, account setup, preventive case', () =>
        cc.createCustomer(c, {
          parent: ref.parentCustomer.name,
          accountManager: ref.employee.name,
          route: ref.route.name,
          assignee: ref.employee.name,
          product1: ref.products.p1.code,
          uoms: [ref.uom.reference],
          orderType: ref.orderType.name,
          catalogue: ref.customerCatalogue.name,
          catalogueCodes: [], // load whatever the catalogue holds now (its products changed since that run)
        }), { kind: 'flow' });
      state.set('perf.customerUrl', url);
      s.note(`${c.name} -> ${url}`);
      await s.step('Reopen saved customer (form load)', () => cc.goto(url));
    }, page);
  });

  test('02 Creation of vendor', async ({ page, purchasePage: pp }) => {
    await runScenario(2, 'Creation of vendor (all fields)', async (s) => {
      const v = P.vendor;
      const url = await s.step('Create vendor: every field, contact + remit-to address, account setup, Products line', () =>
        pp.createVendor(v, {
          product: ref.products.p1, uoms: [ref.uom.name, ref.uom.reference], purchaseManager: ref.employee.name, cost: ref.products.p1.cost,
        }), { kind: 'flow' });
      state.set('perf.vendorUrl', url);
      s.note(`${v.name} -> ${url}`);
      await s.step('Reopen saved vendor (form load)', () => pp.goto(url));
    }, page);
  });

  test('03 Creation of micromarket (Locations)', async ({ page, microMarketPage: mm }) => {
    await runScenario(3, 'Creation of micromarket in location screen (all fields)', async (s) => {
      const m = P.market;
      await s.step('Open Locations list', () => mm.open('Locations'));
      await s.step('Open new location form', () => mm.clickNew());
      await s.step('Fill type Micromarket, name, customer, address', () => fillNewMarket(mm, m.name, names.customer), { kind: 'ui' });
      const url = await s.step('Save micromarket (builds its warehouse)', () => timedSave(mm));
      state.set('perf.marketUrl', url);
      s.note(`${m.name} -> ${url}`);
      await s.step('Fill every other field (store #, image, division, route, frequency, flags, contact, notes, price list) + save', () =>
        mm.fillLocationExtras(url, { ...m.extras, flags: knownGoodFlags(m.extras.flags), route: ref.route.name, frequencyStart: usDate(), nextDate: usDate(addDays(7)) }), { kind: 'flow' });
      s.note('Addl. Tax checkbox not ticked: ticking it raises "ValueError: too many values to unpack" (app defect, FINDINGS.md TC-094)');
      await s.step('Micromarket fees (Setup > Micromarket Fees) + save', () => mm.setMarketFees(m.name, m.fees), { kind: 'flow' });
      await s.step('Reopen saved micromarket (form load)', () => mm.goto(url));
    }, page);
  });

  test('04 Creation of product (Product Master)', async ({ page, inventoryPage: inv }) => {
    await runScenario(4, 'Creation of product from product master (all fields)', async (s) => {
      const p = P.product;
      const url = await s.step('Create product: every field, accounts, tax/deposit, UPC, UoM specification, images', () =>
        inv.createProduct(p, { category: ref.category.name, uom: ref.uom.reference, bin: ref.bin.name, uomType: ref.uom.name, uomQty: ref.uom.ratio }), { kind: 'flow' });
      state.set('perf.productUrl', url);
      s.note(`${p.code} -> ${url}`);
      await s.step('Reopen saved product (form load)', () => inv.goto(url));
    }, page);
  });

  test(`05 Creation of sale order for ${LINES} products`, async ({ page, salesPage: so }) => {
    await runScenario(5, `Creation of Sale order for ${LINES} products (all fields)`, async (s) => {
      const products = await orderProducts(page);
      const c = P.customer;
      await s.step('Open Orders list', () => so.openOrders());
      await s.step('Open new order form', () => so.clickNew());
      await s.step('Customer + Show All Products', async () => {
        await so.fill({ partner_id: names.customer });
        await so.fill({ sell_all_item: true });
        await so.waitReady();
      }, { kind: 'ui' });
      const picked = await s.step(`Pick ${LINES} products (Search More)`, () =>
        pickManyViaSearchMore(so, 'cus_product_assoc_ids', products.map((p) => p.default_code), LINES), { kind: 'ui' });
      s.note(`${picked} products picked`);
      await s.step(`Add ${picked} products to the order`, () => clickAndSettle(so, so.field('add_button').locator('button')));
      const lines = await s.step('Set quantity 1 on every line', () => setColumnOnAllRows(so, 'order_line', 'product_uom_qty', 1), { kind: 'ui' });
      s.note(`${lines} order lines`);
      expect(lines).toBeGreaterThanOrEqual(LINES);
      await s.step('Every header field: contact, promise date, FOB, ship via, notes, S&H, insurance, discount, addresses, route, drop location', () =>
        so.fillOrderExtras({
          header: {
            contact: c.contacts[0].name, promise_date: usDate(addDays(3)), fob: 'Origin',
            note: 'PERF order note', message: 'PERF order message', notes: 'PERF order terms and conditions',
            shipping_handling: 5, insurance: 2, total_discount_view: 1,
          },
          shipVia: 'QA Ground',
          invoiceAddress: c.contacts.find((x) => x.type === 'Billing Address').name,
          deliveryAddress: c.contacts.find((x) => x.type === 'Delivery Address').name,
          route: ref.route.name,
          dropLocation: true,
        }), { kind: 'ui' });
      const url = await s.step(`Save order (${lines} lines)`, () => so.save({ timeout: 600_000 }));
      s.note(`${await so.recordTitle()} -> ${url}`);
      await s.step(`Confirm order (${lines} lines)`, async () => {
        await clickAndSettle(so, so.button('action_confirm'));
        await so.expectStatus(/Confirm/);
      });
      await s.step('Reopen confirmed order (form load)', () => so.goto(url));
    }, page);
  });

  test(`06 Creation of purchase order for ${LINES} products`, async ({ page, purchasePage: pp }) => {
    await runScenario(6, `Creation of purchase order for ${LINES} products (all fields)`, async (s) => {
      const products = await orderProducts(page);
      await s.step('Open Purchase Order list', () => pp.open('Purchase Order'));
      await s.step('Open new purchase order form', () => pp.clickNew());
      await s.step('Every header field: vendor, warehouse, to be printed, purchase manager, contact, terms, dates, ship via', async () => {
        await pp.fill({ partner_id: names.vendor });
        await pp.fill({ warehouse_id: WAREHOUSE }).catch(() => s.note(`warehouse_id: ${WAREHOUSE} not set (kept default)`));
        const header = {
          to_be_printed: true, purchase_manager: ref.employee.name, contact: P.vendor.contact.name, payment_term_id: '30 Days',
          date_order: `${today()} 09:00`, due_date: usDate(addDays(7)), ship_via: 'QA Ground',
        };
        for (const [f, v] of Object.entries(header)) await pp.fillPOField(f, v).catch((e) => s.note(`PO ${f}: ${String(e.message).split('\n')[0]}`));
        await pp.waitReady();
      }, { kind: 'ui' });
      const keys = [...products.map((p) => p.default_code), ...products.map((p) => p.name)];
      const picked = await s.step(`Pick ${LINES} products (Search More)`, () => pickManyViaSearchMore(pp, 'product_ids', keys, LINES), { kind: 'ui' });
      s.note(`${picked} products picked`);
      await s.step(`Add ${picked} products to the PO`, () => clickAndSettle(pp, pp.field('add_button').locator('button')));
      const lines = await s.step('Set order quantity 1 on every line', () => setColumnOnAllRows(pp, 'order_line', 'product_qty', 1), { kind: 'ui' });
      s.note(`${lines} PO lines`);
      expect(lines).toBeGreaterThanOrEqual(LINES);
      await s.step('Footer fields: S&H, insurance, discount, notes, internal comment', async () => {
        const footer = { shipping_handling: 5, insurance: 2, total_discount_view: 1, notes: 'PERF PO note', internal_commands: 'PERF internal comment' };
        for (const [f, v] of Object.entries(footer)) await pp.fillPOField(f, v).catch((e) => s.note(`PO ${f}: ${String(e.message).split('\n')[0]}`));
      }, { kind: 'ui' });
      const url = await s.step(`Save PO (${lines} lines)`, () => pp.save({ timeout: 600_000 }));
      s.note(`${await pp.recordTitle()} -> ${url}`);
      await s.step(`Confirm PO (${lines} lines)`, async () => {
        await clickAndSettle(pp, pp.button('button_confirm'));
        await pp.expectStatus(/Confirm/);
      });
      await s.step('Reopen confirmed PO (form load)', () => pp.goto(url));
    }, page);
  });

  test(`07 Creation of store order for ${LINES} products`, async ({ page, microMarketPage: mm }) => {
    await runScenario(7, `Creation of store order for ${LINES} products`, async (s) => {
      const products = await orderProducts(page);
      const keys = [...products.map((p) => p.default_code), ...products.map((p) => p.name)];
      // The store order lists the market's products: give the market LINES products first.
      await s.step('Open the micromarket (scenario 3)', () => mm.goto(state.get('perf.marketUrl')), { kind: 'setup' });
      await mm.openTab('Products');
      const picked = await s.step(`Pick ${LINES} products for the market`, () => pickManyViaSearchMore(mm, 'single_product_ids', keys, LINES), { kind: 'setup' });
      await s.step(`Add ${picked} products to the micromarket`, () => clickAndSettle(mm, mm.field('add').locator('button')));
      await s.step('Save micromarket products', () => mm.save({ timeout: 600_000 }));

      await s.step('Open Store Orders list', () => mm.open('Store Orders'));
      await s.step('Open new store order form', () => mm.clickNew());
      await s.step('Warehouse + micromarket', async () => {
        await mm.fill({ warehouse_id: WAREHOUSE });
        await mm.fill({ micro_market_id: names.market });
      }, { kind: 'ui' });
      await s.step('Show all market products (load lines)', async () => {
        await mm.fill({ show_all: true });
        await mm.waitReady(600_000);
        await mm.field('move_ids_without_package').locator('.o_data_row').first().waitFor({ timeout: 600_000 });
      });
      const lines = await s.step('Set ordered quantity 1 on every line', () => setColumnOnAllRows(mm, 'move_ids_without_package', 'product_uom_qty', 1), { kind: 'ui' });
      s.note(`${lines} store order lines`);
      expect(lines).toBeGreaterThanOrEqual(LINES);
      const url = await s.step(`Save store order (${lines} lines)`, () => mm.save({ timeout: 600_000 }));
      s.note(`${await mm.recordTitle()} -> ${url}`);
      await s.step(`Approve store order (${lines} lines)`, async () => {
        await clickAndSettle(mm, mm.button('action_to_confirm'));
        await mm.expectStatus(/Approved/);
      });
      await s.step('Reopen store order (form load)', () => mm.goto(url));
    }, page);
  });

  test('08 Creation of equipment', async ({ page, equipmentPage: eq }) => {
    await runScenario(8, 'Creation of Equipment (all fields)', async (s) => {
      const e1 = mine.equipment1;
      const extras = {
        warehouse: `${ref.warehouse.name}/Stock`, image: e1.image, assetNo: `PERF-AST-${SHORT}`, frontage: e1.frontage, finance: e1.finance,
        manufacture: e1.manufacture, distributor: e1.distributor, purchaseDate: today(), warrantyEnd: usDate(addDays(365)),
        flags: e1.flags, parts: [{ name: ref.part.name, qty: e1.partQty }], note: 'PERF equipment note',
      };
      const url = await s.step('Create equipment: every field, warehouse, image, flags, warranty, parts, note', () =>
        eq.createEquipment({ serial: names.equipmentSerial, value: e1.value }, ref.equipmentConfig, extras), { kind: 'flow' });
      s.note(`${names.equipmentSerial} -> ${url}`);
      await s.step('Reopen saved equipment (form load)', () => eq.goto(url));
    }, page);
  });

  test('09 Creation of opportunity', async ({ page, crmPage: crm }) => {
    await runScenario(9, 'Creation of opportunity (all fields)', async (s) => {
      const url = await s.step('Create opportunity: every field (contact, address, team, tags, priority, properties, campaign, notes ...)', () =>
        crm.createOpportunity({ name: names.opportunity, revenue: mine.opportunity.revenue }, names.customer, { ...mine.opportunity.extras, deadline: usDate(addDays(30)) }), { kind: 'flow' });
      s.note(`${names.opportunity} -> ${url}`);
      await s.step('Reopen saved opportunity (form load)', () => crm.goto(url));
    }, page);
  });

  test('10 Deleting a product', async ({ page, inventoryPage: inv }) => {
    await runScenario(10, 'Deleting a product', async (s) => {
      await s.step('Open the product (scenario 4)', () => inv.goto(state.get('perf.productUrl')));
      await s.step('Delete product', () => deleteOpenRecord(inv));
      await s.step('Product Master list after delete', async () => {
        await inv.openProductMaster();
        await inv.search(names.product.code);
        await expect(inv.rows(names.product.code)).toHaveCount(0);
      });
    }, page);
  });

  test('11 Deleting a customer', async ({ page, customerCarePage: cc }) => {
    await runScenario(11, 'Deleting a customer', async (s) => {
      // The scenario 1 customer has orders now (scenario 5); delete a customer without transactions.
      await s.step(`Create throwaway customer ${names.delCustomer}`, async () => {
        await cc.openNewCustomer();
        await fillNewCustomer(cc, names.delCustomer);
        await timedSave(cc);
      }, { kind: 'setup' });
      await s.step('Delete customer', () => deleteOpenRecord(cc));
    }, page);
  });

  test('12 Deleting a vendor', async ({ page, purchasePage: pp }) => {
    await runScenario(12, 'Deleting a vendor', async (s) => {
      await s.step(`Create throwaway vendor ${names.delVendor}`, async () => {
        await pp.open('Vendors');
        await pp.clickNew();
        await fillNewVendor(pp, names.delVendor);
        await timedSave(pp);
      }, { kind: 'setup' });
      await s.step('Delete vendor', () => deleteOpenRecord(pp));
    }, page);
  });

  test('13 Deleting a micromarket', async ({ page, microMarketPage: mm }) => {
    await runScenario(13, 'Deleting a micromarket', async (s) => {
      await s.step(`Create throwaway micromarket ${names.delMarket}`, async () => {
        await mm.open('Locations');
        await mm.clickNew();
        await fillNewMarket(mm, names.delMarket, names.customer);
        await timedSave(mm);
      }, { kind: 'setup' });
      await s.step('Delete micromarket', () => deleteOpenRecord(mm));
    }, page);
  });

  test(`14 Run all reports for ${MONTHS_BACK} months data`, async ({ page, reportsPage: rp }) => {
    test.setTimeout(4 * 60 * 60 * 1000);
    const catalog = require('fs').readFileSync(require('path').join(__dirname, '..', 'data', 'reportCatalog.txt'), 'utf8')
      .split('\n').filter(Boolean).flatMap((line) => {
        const [category, list] = line.split(/:\s(.+)/);
        return list.split(' | ').map((tile) => ({ category: category.trim(), tile: tile.trim() }));
      });
    const only = process.env.PERF_REPORTS ? new RegExp(process.env.PERF_REPORTS, 'i') : null;
    const end = new Date();
    const start = new Date(end);
    start.setMonth(start.getMonth() - MONTHS_BACK);
    await runScenario(14, `Run all the reports for ${MONTHS_BACK} months data (${usDate(start)} - ${usDate(end)})`, async (s) => {
      const failed = [];
      for (const { category, tile } of catalog) {
        if (only && !only.test(`${category} ${tile}`)) continue;
        try {
          await s.step(`${category} > ${tile}: open`, () => rp.openReport(category, tile));
          await s.step(`${category} > ${tile}: set dates`, () => rp.setFilters({ start: usDate(start), end: usDate(end), date: usDate(end) }), { kind: 'ui' });
          const result = await s.step(`${category} > ${tile}: generate`, () => generateAndWait(rp));
          s.note(`${category} > ${tile}: ${result}`);
        } catch (e) {
          failed.push(tile);
          s.note(`${category} > ${tile}: FAILED - ${String(e.message).split('\n')[0]}`);
          await rp.cleanup().catch(() => {});
        }
      }
      if (failed.length) s.note(`${failed.length} report(s) failed: ${failed.join(', ')}`);
    }, page);
  });
});

/** Generate -> waits for the result (rows, "No data", records count, or a validation message). Returns a short summary. */
async function generateAndWait(rp) {
  const { page } = rp;
  const box = rp.container();
  await page.keyboard.press('Escape').catch(() => {});
  await box.locator('button').filter({ hasText: /^\s*Generate\s*$/ }).first().click();
  await page.waitForTimeout(300);
  await rp.waitReady(1_200_000);
  const outcome = await expect.poll(async () => {
    const text = await box.innerText().catch(() => '');
    if (/Total records:\s*[\d,]+/i.test(text)) return `rows: ${text.match(/Total records:\s*([\d,]+)/i)[1]}`;
    if (/No data Found|No records|No data available/i.test(text)) return 'no data';
    const warn = page.locator('.o_notification, .modal:visible .modal-body').first();
    if (await warn.isVisible().catch(() => false)) return `message: ${(await warn.innerText()).trim().slice(0, 120)}`;
    const rows = await box.locator('table tbody tr').count();
    if (rows) return `rows shown: ${rows}`;
    if (await box.locator('iframe').count()) return 'document shown';
    return '';
  }, { timeout: 1_200_000, intervals: [250] }).not.toBe('').then(async () => '', () => 'timeout');
  if (outcome === 'timeout') throw new Error('No result after 20 minutes');
  // Read the final state once more for the note.
  const text = await box.innerText().catch(() => '');
  if (/Total records:\s*[\d,]+/i.test(text)) return `Total records ${text.match(/Total records:\s*([\d,]+)/i)[1]}`;
  if (/No data Found|No records|No data available/i.test(text)) return 'No data';
  const warn = page.locator('.o_notification, .modal:visible .modal-body').first();
  if (await warn.isVisible().catch(() => false)) {
    const msg = (await warn.innerText()).trim().replace(/\s+/g, ' ').slice(0, 150);
    await rp.cleanup().catch(() => {});
    return `Message: ${msg}`;
  }
  return `${await box.locator('table tbody tr').count()} rows on screen`;
}
