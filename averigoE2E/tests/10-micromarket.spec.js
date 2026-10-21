const { test, expect, tc } = require('../fixtures');
const d = require('../data/testData');
const state = require('../utils/state');
const { expectMoney } = require('../utils/money');

const mmCodes = () => d.mmCatalogue.products.map((k) => d.products[k].code);

test.describe.serial('Micro Market (TC-093..TC-099)', () => {
  test(...tc('TC-093'), async ({ inventoryPage }) => {
    const url = await inventoryPage.createProductCatalogue({ name: d.mmCatalogue.name, type: 'Micromarket', products: mmCodes() });
    state.set('mmCatalogueUrl', url);
    for (const c of mmCodes()) await expect(inventoryPage.field('catalog_product_ids')).toContainText(c);
  });

  test(...tc('TC-094'), async ({ microMarketPage }) => {
    const url = await microMarketPage.createLocation(d.microMarket, {
      customer: d.customer1.name,
      product: d.products.p1,
      catalogue: d.mmCatalogue.name,
      onSaved: (u) => state.set('mmUrl', u),
    });
    state.set('mmUrl', url);
    await test.step('Every other field on the micro market (General Information, Notes, Others)', async () => {
      const { usDate, addDays } = require('../utils/dates');
      await microMarketPage.fillLocationExtras(url, {
        ...d.microMarket.extras, route: d.route.name, frequencyStart: usDate(), nextDate: usDate(addDays(7)),
      });
    });
    await test.step('Fees (Setup > Micromarket Fees), shown on the market\'s Fees tab', async () => {
      const fees = d.microMarket.fees;
      await microMarketPage.setMarketFees(d.microMarket.name, fees);
      await microMarketPage.goto(url);
      await microMarketPage.openTab('Fees');
      // Fees tab: Terminal CC % / App CC % / Stored Fund % / Platform / Cash Adj.
      for (const f of ['cc_fees', 'app_fees', 'stored_fund_fees', 'platform_fees', 'cash_adj']) {
        const shown = parseFloat((await microMarketPage.read(f)).replace(/[^0-9.-]/g, ''));
        expect.soft(shown, `Fees tab ${f}`).toBeCloseTo(fees[f], 2);
      }
    });
    await microMarketPage.goto(url);
    expect(await microMarketPage.read('partner_id')).toContain(d.customer1.name);
    await microMarketPage.openTab('Products');
    await expect(microMarketPage.marketProduct(d.products.p1.name), 'Product 1 added directly').toBeVisible();
    // Catalogue load doesn't add its products (FINDINGS.md): soft-check, then add them directly so later steps can run.
    for (const k of d.mmCatalogue.products) {
      await expect.soft(microMarketPage.marketProduct(d.products[k].name), `${d.products[k].code} loaded from catalogue ${d.mmCatalogue.name}`).toBeVisible({ timeout: 5_000 });
    }
    await microMarketPage.addMarketProducts(d.mmCatalogue.products.map((k) => d.products[k]));
    for (const k of d.mmCatalogue.products) await expect(microMarketPage.marketProduct(d.products[k].name)).toBeVisible();
  });

  test(...tc('TC-095'), async ({ microMarketPage }) => {
    const mmUrl = state.get('mmUrl');
    const before = await microMarketPage.marketStock(mmUrl, d.products.p1.name);
    const qty = d.qty.storeOrder;
    const order = await microMarketPage.createStoreOrder({
      warehouse: d.warehouse.name, location: d.microMarket.name,
      qtyByCode: { [d.products.p1.code]: qty, [d.products.p2.code]: qty },
    });
    state.set('storeOrderUrl', order.url);
    await microMarketPage.goto(order.url);
    // After receipt the "Picking Operations" tab lists picked/received quantities per product.
    const picked = microMarketPage.page.locator('.o_form_view .o_notebook .tab-pane.active .o_data_row');
    for (const p of [d.products.p1, d.products.p2]) await expect(picked.filter({ hasText: p.code }).first(), `${p.code} picked & received`).toContainText(String(qty));
    await expect(picked.filter({ hasText: d.products.p3.code }), 'no zero-quantity lines picked').toHaveCount(0);
    expect(await microMarketPage.marketStock(mmUrl, d.products.p1.name), 'market stock after receipt').toBe(before + qty);
    state.set('storeOrderUrl', order.url);
  });

  test(...tc('TC-096'), async ({ microMarketPage, inventoryPage }) => {
    const mmUrl = state.get('mmUrl');
    const p1 = d.products.p1;
    // Update Location rejects an update that changes nothing, so alternate between two Min/Max pairs across runs.
    const currentMax = await microMarketPage.marketValue(mmUrl, p1.name, 'max_qty');
    const [min, max] = currentMax === 10 ? [3, 12] : [2, 10];
    const [spoiled, theft, ret] = [1, 1, 1];
    const before = await microMarketPage.marketStock(mmUrl, p1.name);
    const rec = await microMarketPage.updateLocation({
      market: d.microMarket.name, product: p1, copyActual: true, warehouse: d.warehouse.name,
      values: { new_max: max, new_min: min, spoiled_qty: spoiled, theft_qty: theft, return_qty: ret },
    });
    state.set('mmUpdate', { ...rec, min, max });
    test.info().annotations.push({ type: 'Update Location', description: `${rec.name}: line Stock ${rec.stockBefore}, market stock before ${before}` });
    // The line's Stock (and so Actual) must be the market's real stock, or reconciling rewrites it (see FINDINGS.md TC-096).
    expect.soft(rec.stockBefore, `Update Location line Stock = market stock ${before}`).toBe(before);

    await test.step('Min / Max on the market', async () => {
      expect(await microMarketPage.marketValue(mmUrl, p1.name, 'min_qty'), 'Min persisted on the market').toBe(min);
      expect(await microMarketPage.marketValue(mmUrl, p1.name, 'max_qty'), 'Max persisted on the market').toBe(max);
    });
    await test.step(`Spoiled ${spoiled} / Theft ${theft} / Return ${ret}: market stock and stock moves`, async () => {
      const after = await microMarketPage.marketStock(mmUrl, p1.name);
      expect.soft(after, `market stock ${before} - spoiled ${spoiled} - theft ${theft} - return ${ret}`).toBe(before - spoiled - theft - ret);
      const rows = await inventoryPage.stockHistoryRows(state.get('p1Url'), 6);
      const fromMarket = rows.filter((r) => r.includes(`${d.microMarket.name}/`) && /\|\s*1\s*\|/.test(r));
      test.info().annotations.push({ type: 'Product 1 moves', description: rows.join('\n') });
      expect.soft(fromMarket.length, `3 moves of 1 out of ${d.microMarket.name} (spoiled, theft, return):\n${rows.join('\n')}`).toBeGreaterThanOrEqual(3);
      expect.soft(rows.some((r) => r.includes(`${d.microMarket.name}/`) && r.includes(`${d.warehouse.name}/`)), `return moved to ${d.warehouse.name}`).toBe(true);
    });
    await test.step('Dependent view: a new store order shows the new Min/Max', async () => {
      await microMarketPage.open('Store Orders');
      await microMarketPage.clickNew();
      await microMarketPage.fill({ warehouse_id: d.warehouse.name });
      await microMarketPage.fill({ micro_market_id: d.microMarket.name });
      await microMarketPage.fill({ show_all: true });
      const row = microMarketPage.field('move_ids_without_package').locator('.o_data_row').filter({ hasText: p1.code }).first();
      await expect(row.locator('td[name="min_qty"]')).toHaveText(new RegExp(`^\\s*${min}\\b`));
      await expect(row.locator('td[name="max_qty"]')).toHaveText(new RegExp(`^\\s*${max}\\b`));
      await microMarketPage.discard();
    });
  });

  test(...tc('TC-097'), async ({ microMarketPage }) => {
    const { usDate, addDays } = require('../utils/dates');
    const url = await microMarketPage.createSpecial(d.special, {
      customer: d.customer1.name, market: d.microMarket.name, products: [d.products.p2], start: usDate(), end: usDate(addDays(7)),
    });
    state.set('specialUrl', url);
    const line = microMarketPage.field('product_line').locator('.o_data_row').filter({ hasText: d.products.p2.name }).first();
    const discounted = (d.products.p2.price * (100 - d.special.discountPercent)) / 100;
    await expect(line.locator('td[name="sale_price"]'), `discounted price ${discounted}`).toContainText(discounted.toFixed(2));
  });

  test(...tc('TC-098'), async ({ microMarketPage }) => {
    const user = { firstName: d.employee.firstName, lastName: d.employee.lastName, email: d.employee.workEmail };
    const url = await microMarketPage.createFrontDeskDiscount({ percent: d.frontDeskDiscount.percent, customer: d.customer1.name, market: d.microMarket.name, user });
    await microMarketPage.goto(url);
    expectMoney(await microMarketPage.readMoney('discount'), d.frontDeskDiscount.percent, 'Discount %');
    await expect(microMarketPage.field('user_line')).toContainText(user.email);
    state.set('frontDeskDiscountUrl', url);

    await test.step('Front Desk desk type (Allow All instead of a Discount %)', async () => {
      const frontDeskUser = { firstName: 'QA', lastName: `Front Desk ${d.employee.firstName}`, email: `frontdesk.${d.employee.firstName.toLowerCase()}@example.com` };
      const fdUrl = await microMarketPage.createFrontDeskDiscount({ deskType: 'Front Desk', allowAll: true, customer: d.customer1.name, market: d.microMarket.name, user: frontDeskUser });
      await microMarketPage.goto(fdUrl);
      expect(await microMarketPage.read('desk_type')).toContain('Front Desk');
      await expect(microMarketPage.field('discount'), 'no Discount % on a Front Desk record').toBeHidden();
      expect(await microMarketPage.field('allow_all').locator('input').first().isChecked(), 'Allow All').toBe(true);
      expect(await microMarketPage.read('partner_id')).toContain(d.customer1.name);
      await expect(microMarketPage.field('micro_market_ids')).toContainText(d.microMarket.name);
      await expect(microMarketPage.field('user_line')).toContainText(frontDeskUser.email);
      await microMarketPage.expectStatus(/Confirmed/);
      state.set('frontDeskUrl', fdUrl);
    });
  });

  test(...tc('TC-099'), async ({ microMarketPage }) => {
    // One payment method per Deduction Type, each with its own app user (Limit + Employee ID) and the fields that type shows.
    const types = [
      { type: 'Payroll Deduction', suffix: 'PAY', limit: 100, dateConfig: true },
      { type: 'Credit', suffix: 'CR', limit: 150 },
      { type: 'Company Credit', suffix: 'CC', limit: 200, dateConfig: true, rollover: true },
    ];
    const urls = {};
    for (const t of types) {
      await test.step(`Deduction Type: ${t.type}`, async () => {
        const name = t.suffix === 'PAY' ? d.paymentMethod.name : `${d.paymentMethod.name}-${t.suffix}`;
        const user = {
          firstName: d.employee.firstName, lastName: `${d.employee.lastName} ${t.suffix}`,
          email: t.suffix === 'PAY' ? d.employee.workEmail : `pm.${t.suffix.toLowerCase()}.${d.employee.firstName.toLowerCase()}@example.com`,
          limit: t.limit / 2, employeeId: `${t.suffix}-${d.employee.firstName}`,
        };
        const url = await microMarketPage.createPaymentMethod({ name }, {
          customer: d.customer1.name, market: d.microMarket.name, deductionType: t.type, limit: t.limit, user, dateConfig: t.dateConfig, rollover: t.rollover,
        });
        urls[t.type] = url;
        await microMarketPage.goto(url);
        expect(await microMarketPage.read('nick_name')).toBe(name);
        expect(await microMarketPage.read('deduction_type')).toBe(t.type);
        await expect(microMarketPage.field('micro_market_ids')).toContainText(d.microMarket.name);
      });
    }
    state.set('paymentMethodUrl', urls['Payroll Deduction']);
    state.set('paymentMethodUrls', urls);
  });

  test(...tc('TC-099A'), async ({ microMarketPage }) => {
    const { usDate, addDays } = require('../utils/dates');
    const sg = d.surge;
    const day = usDate(addDays(1));
    // Surges for the same products can't overlap, and a confirmed one can't be edited: each run gets its own name and a
    // 10-minute window tomorrow evening.
    const pad = (n) => String(n).padStart(2, '0');
    // One 10-minute slot per run (run counter in the state file), 18:00-23:50, clear of the first run's 09:00-17:00 surge.
    const slot = (state.optional('surgeSlot') ?? 0) + 1;
    state.set('surgeSlot', slot);
    const startMin = 18 * 60 + ((slot * 15) % 350);
    const hhmm = (m) => `${pad(Math.floor(m / 60))}:${pad(m % 60)}`;
    const [startTime, endTime] = [hhmm(startMin), hhmm(startMin + 10)];
    const name = `${sg.name}-${String(Date.now()).slice(-5)}`;
    const products = sg.products.map((k) => d.products[k]);
    const base = { start: `${day} ${startTime}`, end: `${day} ${endTime}`, type: sg.type, value: sg.value,
      customers: [d.customer1.name], markets: [d.microMarket.name], categories: [d.category.name], products };
    const r = await microMarketPage.createSurgePricing({ name, ...base });
    state.set('surgeUrl', r.url);
    await test.step(`Lines: New Price = Current Price + ${sg.value}%`, async () => {
      for (const l of r.lines) {
        expect.soft(l.market, `${l.product} line market`).toContain(d.microMarket.name);
        expectMoney(l.next, Math.round(l.current * (100 + sg.value)) / 100, `${l.product} new price (current ${l.current})`);
      }
    });
    await test.step('Saved values', async () => {
      await microMarketPage.goto(r.url);
      expect.soft(await microMarketPage.read('name')).toBe(name);
      // Shown as "10/16/2026 18:15" (martiserv) or "10/16/2026 06:15:00 PM" (ultraserv): compare as 24h "MM/DD/YYYY HH:MM".
      const to24 = (v) => {
        const m = String(v).match(/(\d{2}\/\d{2}\/\d{4}) (\d{1,2}):(\d{2})(?::\d{2})?\s*([AP]M)?/i);
        if (!m) return String(v);
        let h = parseInt(m[2], 10);
        if (m[4]) h = (h % 12) + (/PM/i.test(m[4]) ? 12 : 0);
        return `${m[1]} ${String(h).padStart(2, '0')}:${m[3]}`;
      };
      expect.soft(to24(await microMarketPage.read('start_date')), 'start').toBe(`${day} ${startTime}`);
      expect.soft(to24(await microMarketPage.read('end_date')), 'end').toBe(`${day} ${endTime}`);
      expect.soft(await microMarketPage.read('price_update_type'), 'price type').toContain(sg.type);
      expect.soft(parseFloat(await microMarketPage.read('price_value')), 'price increase').toBe(sg.value);
      await expect.soft(microMarketPage.field('customer_ids')).toContainText(d.customer1.name);
      await expect.soft(microMarketPage.field('market_ids')).toContainText(d.microMarket.name);
      await expect.soft(microMarketPage.field('category_ids')).toContainText(d.category.name);
      expect(r.state, 'status after save').toMatch(/Confirmed|Active/);
    });
    await test.step('Negative: a second surge for the same products and period is refused', async () => {
      const dup = await microMarketPage.createSurgePricing({ name: `${name}-DUP`, ...base, expectRejected: true });
      expect(dup.rejected, 'overlap message').toMatch(/already have surge pricing during the selected time period/i);
      expect(dup.rejected, 'names the existing surge').toContain(name);
    });
  });

  test(...tc('TC-099B'), async ({ microMarketPage }) => {
    const { today } = require('../utils/dates');
    const p4 = d.products.p4;
    const mmUrl = state.get('mmUrl');
    await test.step('Product 4 is on the market before', async () => {
      await microMarketPage.goto(mmUrl);
      await microMarketPage.openTab('Products');
      if (!(await microMarketPage.marketProduct(p4.name).isVisible().catch(() => false))) await microMarketPage.addMarketProducts([p4]);
      await expect(microMarketPage.marketProduct(p4.name)).toBeVisible();
    });
    await test.step('Discontinue Products: Customer 1 > MM-QA-001 > Product 4', async () => {
      // Re-run: an earlier attempt already discontinued it (it's no longer offered): just verify below.
      if (await microMarketPage.discontinuedRow(d.microMarket.name, p4.code)) {
        test.info().annotations.push({ type: 'Resumed', description: `${p4.code} already discontinued for ${d.microMarket.name}` });
        return;
      }
      const totals = await microMarketPage.discontinueProducts({ customers: [d.customer1.name], markets: [d.microMarket.name], products: [p4] });
      expect.soft(totals, 'dialog totals').toEqual({ markets: 1, products: 1 });
    });
    await test.step('Listed under Discontinued Products (market, date, user)', async () => {
      const row = await microMarketPage.discontinuedRow(d.microMarket.name, p4.code);
      expect(row, `${p4.code} listed for ${d.microMarket.name}`).not.toBeNull();
      await expect.soft(row.locator('td[name="micro_market_id"]')).toContainText(d.microMarket.name);
      expect.soft(await row.locator('td[name="is_discontinued"] input').first().isChecked().catch(() => true), 'Discontinued ticked').toBe(true);
      await expect.soft(row.locator('td[name="discontinued_date"]'), 'discontinued today').toContainText(today());
      await expect.soft(row.locator('td[name="discontinued_user"]'), 'discontinued by').toContainText('Komala');
    });
    await test.step('Market: Discontinued Products button lists it', async () => {
      await microMarketPage.goto(mmUrl);
      await microMarketPage.page.locator('button[name="action_view_discontinue_products"]').click();
      await microMarketPage.waitReady();
      // Grouped by market (collapsed): open the market's group.
      const group = microMarketPage.page.locator('.o_group_header').filter({ hasText: d.microMarket.name }).first();
      await expect(group, 'market group').toContainText(/\(\d+\)/);
      await group.click();
      await microMarketPage.waitReady();
      await expect.soft(microMarketPage.page.locator('.o_list_view .o_data_row').filter({ hasText: p4.code }).first(), `${p4.code} under the market's Discontinued Products`).toBeVisible();
    });
    await test.step('Dependent view: a new store order no longer offers Product 4', async () => {
      await microMarketPage.open('Store Orders');
      await microMarketPage.clickNew();
      await microMarketPage.fill({ warehouse_id: d.warehouse.name });
      await microMarketPage.fill({ micro_market_id: d.microMarket.name });
      await microMarketPage.fill({ show_all: true });
      const lines = microMarketPage.field('move_ids_without_package').locator('.o_data_row');
      await lines.first().waitFor();
      await expect.soft(lines.filter({ hasText: p4.code }), `${p4.code} not offered`).toHaveCount(0);
      await expect(lines.filter({ hasText: d.products.p1.code }).first(), 'other products still offered').toBeVisible();
      await microMarketPage.discard();
    });
  });
});
