const { test, expect, tc } = require('../fixtures');
const state = require('../utils/state');

// Run last: each record below already has transactions from earlier specs.
test.describe('Deletion of referenced records is blocked (TC-058, TC-059, TC-071, TC-085)', () => {
  const cases = [
    ['TC-058', 'p1Url', 'Product 1'],
    ['TC-059', 'customer1Url', 'Customer 1'],
    ['TC-071', 'vendorUrl', 'Vendor VEND-QA-001'],
    ['TC-085', 'equipment1Url', 'Equipment 1'],
  ];
  for (const [id, key, label] of cases) {
    test(...tc(id), async ({ odoo }) => {
      await odoo.goto(state.get(key));
      const alert = await test.step(`Attempt to delete ${label}`, () => odoo.attemptDeleteExpectBlocked());
      expect(alert, 'dependency alert is shown').toBeTruthy();
    });
  }
});
