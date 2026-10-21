const { test, expect, tc } = require('../fixtures');
const d = require('../data/testData');
const state = require('../utils/state');
const { ReportsPage } = require('../pages/ReportsPage');

const catalogueCodes = () => d.customerCatalogue.products.map((k) => d.products[k].code);

test.describe.serial('Customers (TC-022..TC-025)', () => {
  test(...tc('TC-022'), async ({ customerCarePage }) => {
    // Every visible field (see testData.customer1): parent, account manager, route, contact, notes, preventive case,
    // Product 1 (UoM + order type) and the TC-021 catalogue on Order Products.
    const url = await customerCarePage.createCustomer(d.customer1, {
      parent: d.parentCustomer.name,
      orderType: d.orderType.name,
      product1: d.products.p1.code,
      uoms: [d.uom.reference, d.uom.name],
      catalogue: d.customerCatalogue.name,
      catalogueCodes: catalogueCodes(),
      accountManager: d.employee.name, // the TC-001 employee
      route: d.route.name, // the TC-004 route
      assignee: d.employee.name,
    });
    state.set('customer1Url', url);
    if (customerCarePage.lastCaseOptions) state.set('customer1CaseOptions', customerCarePage.lastCaseOptions);
    await customerCarePage.expectCustomer(url, d.customer1, {
      products: [d.products.p1.code, ...catalogueCodes()],
      uoms: [d.uom.reference, d.uom.name],
      orderType: d.orderType.name,
      accountManager: d.employee.name,
      parent: d.parentCustomer.name,
      extras: { route: d.route.name, caseOptions: state.optional('customer1CaseOptions') },
    });
  });

  test(...tc('TC-022A'), async ({ customerCarePage }) => {
    // Edit every field of Customer 1 (created in TC-022) and save; its Billing and Delivery addresses move to two
    // different locations. Name / Code are verified edited, then restored (later cases find Customer 1 by name).
    const c1 = d.customer1;
    const e = d.customer1Edit;
    const url = state.get('customer1Url');
    // Customer 1's own Billing / Delivery address contacts (TC-022 created one per address type).
    const contactName = (type) => c1.contacts.find((ct) => ct.type === type).name;
    const editContacts = Object.fromEntries(Object.entries(e.addresses).map(([type, v]) => [contactName(type), v]));
    // Checkboxes are not changed by the edit: record them first, compare after saving.
    await customerCarePage.goto(url);
    const checkboxesBefore = await customerCarePage.checkboxStates();
    try {
    await test.step('Edit every field of Customer 1 and save (checkboxes untouched)', () => customerCarePage.editCustomer(url, e, {
      parent: d.parentCustomer.name, accountManager: d.employee.name, route: d.route.name, editContacts,
    }));
    const skipped = customerCarePage.skippedReadOnly || [];
    if (skipped.length) test.info().annotations.push({ type: 'Read-only on a saved customer (not edited)', description: skipped.join(', ') });
    const notes = Object.fromEntries(Object.entries(e.notes).filter(([f]) => !skipped.includes(f)));
    await test.step('Every edited value saved', async () => {
      await customerCarePage.goto(url);
      expect.soft(await customerCarePage.read('name'), 'name').toBe(e.name);
      expect.soft(await customerCarePage.read('code'), 'code').toBe(e.code);
      expect.soft(await customerCarePage.read('email'), 'email').toBe(e.email);
      expect.soft(await customerCarePage.read('zip'), 'zip').toBe(e.zip);
      expect.soft(await customerCarePage.read('street'), 'street').toBe(e.street);
      expect.soft(await customerCarePage.read('parent_partner_id'), 'parent').toContain(d.parentCustomer.name);
      expect.soft(await customerCarePage.read('kam'), 'accounts manager').toContain(d.employee.name);
      await customerCarePage.expectPartnerExtras({ details: e.details, notes, image: e.image }, { route: d.route.name, checkboxesUnchanged: true });
    });
    await test.step('Every checkbox unchanged by the edit', async () => {
      await customerCarePage.goto(url);
      const after = await customerCarePage.checkboxStates();
      for (const [f, v] of Object.entries(checkboxesBefore)) expect.soft(after[f], `${f} unchanged (${v ? 'ticked' : 'unticked'})`).toBe(v);
    });
    await test.step('Billing and Delivery addresses: two different locations', async () => {
      const billing = await customerCarePage.readContact(contactName('Billing Address'));
      const delivery = await customerCarePage.readContact(contactName('Delivery Address'));
      test.info().annotations.push({ type: 'Addresses', description: `Billing: ${JSON.stringify(billing)}\nDelivery: ${JSON.stringify(delivery)}` });
      expect.soft(billing.type, 'billing type').toMatch(/Billing/i);
      expect.soft(delivery.type, 'delivery type').toMatch(/Delivery/i);
      for (const [label, got, want] of [['billing', billing, e.addresses['Billing Address']], ['delivery', delivery, e.addresses['Delivery Address']]]) {
        expect.soft(got.zip, `${label} zip`).toBe(want.zip);
        expect.soft(got.street, `${label} street`).toBe(want.street);
        expect.soft(got.street2, `${label} street2`).toBe(want.street2);
      }
      expect(`${billing.street} ${billing.zip}`, 'billing and delivery addresses differ').not.toBe(`${delivery.street} ${delivery.zip}`);
    });
    } finally {
      // Always put Name / Code back (even after a failure): later cases find Customer 1 by name.
      if (e.restoreIdentity) {
        await test.step('Restore Name and Code (later cases find Customer 1 by name)', async () => {
          await customerCarePage.goto(url);
          if ((await customerCarePage.read('name')) !== c1.name || (await customerCarePage.read('code')) !== c1.code) {
            await customerCarePage.fill({ name: c1.name, code: c1.code });
            await customerCarePage.save();
          }
          expect(await customerCarePage.read('name')).toBe(c1.name);
          expect(await customerCarePage.read('code')).toBe(c1.code);
        });
      }
    }
  });

  test(...tc('TC-023'), async ({ customerCarePage }) => {
    // Every visible field (see testData.customer2); every checkbox except Fuel Charge / Hazard Fee / Subsidy.
    const url = await customerCarePage.createCustomer(d.customer2, {
      parent: d.parentCustomer.name, accountManager: d.employee.name, route: d.route.name, assignee: d.employee.name,
    });
    state.set('customer2Url', url);
    if (customerCarePage.lastCaseOptions) state.set('customer2CaseOptions', customerCarePage.lastCaseOptions);
    // Fuel / Hazard / Subsidy are all OFF; every other field as entered.
    await customerCarePage.expectCustomer(url, d.customer2, {
      accountManager: d.employee.name, parent: d.parentCustomer.name,
      extras: { route: d.route.name, caseOptions: state.optional('customer2CaseOptions') },
    });
  });

  test(...tc('TC-024'), async ({ reportsPage }) => {
    // The report filters by Accounts Manager/City/State (no customer filter) and has no tax columns;
    // taxes are verified on the customer records in TC-022/TC-023.
    // Both customers' Accounts Manager is the TC-001 employee. Customer 1 shows its TC-022A address (ZIP / street edited;
    // only Name and Code are restored after that edit).
    const c1 = { ...d.customer1, zip: d.customer1Edit.zip, street: d.customer1Edit.street };
    for (const [c, manager] of [[c1, d.employee.name], [d.customer2, d.employee.name]]) {
      const text = await reportsPage.run({
        category: 'Customer Care',
        tile: 'Customer Details Report',
        filters: { 'Accounts Manager': manager, 'Customer Status': 'Active' },
        expectContains: [c.name],
      });
      const row = ReportsPage.rowFor(text, c.name);
      expect(row, `${c.name} row`).toContain(manager);
      expect(row, `${c.name} ZIP`).toContain(c.zip);
      expect(row, `${c.name} street`).toContain(c.street);
    }
  });

  test(...tc('TC-025'), async ({ reportsPage }) => {
    const text = await reportsPage.run({
      category: 'Customer Care',
      tile: 'Customer Product List Report',
      filters: { customers: [d.customer1.name, d.customer2.name], 'Location Type': 'Order Products' },
      // Lists the customer's Order Products: Product 1 plus the catalogue products moved in by TC-022.
      expectContains: [d.customer1.name, d.products.p1.code, ...catalogueCodes()],
    });
    expect(ReportsPage.rowFor(text, d.products.p1.code)).toContain(d.uom.reference);
    // Rows are grouped under a customer heading: Products 1-4 must sit in Customer 1's group.
    const lines = text.split('\n');
    const start = lines.findIndex((l) => l.includes(d.customer1.name));
    const next = lines.findIndex((l, i) => i > start && l.includes(d.customer2.name));
    const group = lines.slice(start, next > start ? next : undefined).join('\n');
    for (const code of [d.products.p1.code, ...catalogueCodes()]) expect(group, `${code} under ${d.customer1.name}`).toContain(code);
  });
});
