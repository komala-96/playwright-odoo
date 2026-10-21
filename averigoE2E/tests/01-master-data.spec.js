const { test, expect, tc } = require('../fixtures');
const d = require('../data/testData');
const state = require('../utils/state');

test.describe.serial('User setup & master data (TC-001..TC-009)', () => {
  test(...tc('TC-001'), async ({ employeePage }) => {
    const { url, picked } = await test.step('Create employee (all fields)', () => employeePage.createEmployee(d.employee));
    await test.step('Verify every field saved', () => employeePage.expectEmployee(url, d.employee, picked));
    state.set('employeeUrl', url);
  });

  test(...tc('TC-002'), async ({ inventoryPage }) => {
    await test.step('Create parent category', () => inventoryPage.createProductCategory({ name: d.category.parent }));
    const url = await test.step('Create category (all fields)', () => inventoryPage.createProductCategory(d.category));
    state.set('categoryUrl', url);
    await test.step('Verify every field saved', () => inventoryPage.expectProductCategory(url, d.category));
    await test.step('Category listed (selectable in Product Master)', async () => {
      await inventoryPage.open();
      await inventoryPage.openMenu('Configuration', 'Product Categories');
      await inventoryPage.expectInList(d.category.name);
    });
  });

  test(...tc('TC-003'), async ({ inventoryPage }) => {
    await inventoryPage.createUomType(d.uom);
    await test.step('UoM type listed (selectable for products/customers/vendors)', async () => {
      await inventoryPage.expectInList(d.uom.name);
      if (d.eachUomType) await inventoryPage.expectInList(d.uom.reference);
    });
  });

  // TC-006 runs before TC-004 so its truck can be assigned to the route.
  test(...tc('TC-006'), async ({ inventoryPage }) => {
    // All visible fields; Truck Driver = the TC-001 employee.
    const extra = { driver: d.employee.name };
    const url = await test.step('Create truck (all fields)', () => inventoryPage.createTruck(d.truck, extra));
    state.set('truckUrl', url);
    await test.step('Verify every field saved', () => inventoryPage.expectLocation(url, { ...d.truck, type: 'Truck' }, { details: d.truck.details, image: d.truck.image, ...extra }));
  });

  test(...tc('TC-004'), async ({ inventoryPage }) => {
    // The truck from TC-006 (run just before) is assigned to the route.
    state.set('routeUrl', await inventoryPage.createRoute({ ...d.route, truck: d.truck.name }));
    expect(await inventoryPage.read('name')).toBe(d.route.name);
    expect(await inventoryPage.read('desc')).toBe(d.route.description);
    expect(await inventoryPage.read('truck_id')).toContain(d.truck.name);
  });

  test(...tc('TC-005'), async ({ inventoryPage }) => {
    // All visible fields; Route = the TC-004 route.
    const extra = { route: d.route.name };
    // createWarehouse completes a warehouse left (auto-saved) by a failed attempt instead of duplicating its ID.
    const url = await test.step('Create warehouse (all fields)', () => inventoryPage.createWarehouse(d.warehouse, extra));
    state.set('warehouseUrl', url);
    await test.step('Verify every field saved', () => inventoryPage.expectLocation(url, { ...d.warehouse, type: 'Warehouse' }, { details: d.warehouse.details, image: d.warehouse.image, ...extra }));
  });

  test(...tc('TC-007'), async ({ inventoryPage }) => {
    const url = await inventoryPage.createBin({ name: d.bin.name, warehouse: d.warehouse.name });
    state.set('binUrl', url);
    expect(await inventoryPage.read('warehouse_id')).toContain(d.warehouse.name);
  });

  test(...tc('TC-008'), async ({ customerCarePage }) => {
    // All editable fields; Accounts Manager (an employee list) = the TC-001 employee, Route = the TC-004 route.
    const links = { accountManager: d.employee.name, route: d.route.name };
    // Resume support: reuse the parent already created for this RUN_ID (re-verifies it instead of duplicating).
    const saved = state.optional('parentCustomerUrl');
    const { url, picked } = saved
      ? { url: saved, picked: state.optional('parentCustomerAccounts') || {} }
      : await test.step('Create parent customer (all fields)', () => customerCarePage.createParentCustomer(d.parentCustomer, links));
    state.set('parentCustomerUrl', url);
    state.set('parentCustomerAccounts', picked);
    await test.step('Verify every field saved', () => customerCarePage.expectParentCustomer(url, d.parentCustomer, links, picked));
    await test.step('Parent listed in Configuration > Parent', () => customerCarePage.expectParentListed(d.parentCustomer.name));

    const pc = d.parentCustomer;
    await test.step(`Order Products: add ${pc.orderProduct.name}`, async () => {
      await customerCarePage.goto(url);
      if (!(await customerCarePage.openTab('Order Products').then(() => customerCarePage.productLine(pc.orderProduct.code).count()))) {
        await customerCarePage.addOrderProduct(pc.orderProduct);
      }
    });
    await test.step('Preventive Cases: create one case', async () => {
      if (state.optional('parentCaseOptions')) return; // already created for this RUN_ID
      await customerCarePage.goto(url);
      // "Save & Close" in the case dialog saves the case at once, even if the parent save later fails:
      // reuse a case left by an earlier attempt instead of adding a duplicate.
      const existing = await customerCarePage.readPreventiveCase(pc.preventiveCase.case_description);
      if (existing) {
        state.set('parentCaseOptions', { employee_ids: existing.employee_ids, category_id: existing.category_id, type_id: existing.type_id, channel_id: existing.channel_id });
        return;
      }
      state.set('parentCaseOptions', await customerCarePage.addPreventiveCase(pc.preventiveCase, { customer: pc.name, assignee: d.employee.name, route: d.route.name }));
    });
    await test.step('Order product and preventive case saved on the parent', async () => {
      await customerCarePage.goto(url);
      await customerCarePage.openTab('Order Products');
      await expect(customerCarePage.productLine(pc.orderProduct.code)).toContainText(pc.orderProduct.name);
      const c = await customerCarePage.readPreventiveCase(pc.preventiveCase.case_description);
      expect(c, 'preventive case saved on the parent').not.toBeNull();
      const picked = state.get('parentCaseOptions');
      expect.soft(c.partner_id, 'customer').toContain(pc.name);
      expect.soft(c.is_preventive, 'Preventive ticked').toBe(true);
      expect.soft(c.route_id, 'route').toContain(d.route.name);
      for (const f of ['employee_ids', 'category_id', 'type_id', 'channel_id']) expect.soft(c[f], f).toContain(picked[f]);
      for (const [f, v] of Object.entries(pc.preventiveCase)) {
        if (f === 'reported_phone') expect.soft(c[f].replace(/\D/g, ''), f).toMatch(new RegExp(`${v}$`));
        else expect.soft(c[f], f).toBe(v);
      }
    });
  });

  test(...tc('TC-009'), async ({ customerCarePage }) => {
    state.set('orderTypeUrl', await customerCarePage.createOrderType(d.orderType));
    // Order types are chosen per product line on the customer (Order Products tab)
    // and on sales order lines; TC-022 assigns this type on Customer 1's product line.
    await test.step('Order type is listed and available for customers/orders', async () => {
      await customerCarePage.open();
      await customerCarePage.openMenu('Configuration', 'Order Types');
      await customerCarePage.expectInList(d.orderType.name);
    });
  });
});
