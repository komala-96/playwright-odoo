const { test } = require('../../fixtures/testFixtures');
const { CustomerCreationPage } = require('../../pages/CustomerCreationPage');

// Customer Care > Customer > New with every editable field filled.
// Run against martiserv:
//   BASE_URL=https://martiserv.averigoqa.com ODOO_USER=<user> ODOO_PASS=<pass> npx playwright test customerCreation

const suffix = Date.now().toString().slice(-6);

const customer = {
  // Basic Information
  name: `QA Test Customer ${suffix}`,
  nickName: 'QA Test',
  customerNo: `QA${suffix}`,
  parent: 'parent customer',
  accountsManager: 'G Komala',
  customerTypes: ['Micromarket'],
  email: `qa.test${suffix}@example.com`,
  phone: '2125550101',
  mobile: '2125550102',

  // Address (city / state / county auto-fill from ZIP)
  zip: '10001',
  street: '123 Test Street',
  street2: 'Suite 100',

  // Other Info
  groupMasterInvoice: 'Monthly',
  route: 'Martis LLC',
  occupancyRate: '85',
  creditLimit: '5000',
  roomCount: '25',
  terms: '30 Days',
  visitorTypes: ['Businessman'],
  website: 'https://example.com',
  inServiceDate: '10/01/2026',
  priceCategory: 'List Price 1',
  sapCustomerNo: '2001',
  sapVendorNo: '1001',
  apPayeeName: 'QA AP Payee',
  arPayeeName: 'QA-PAYEE',
  custom3: 'Custom3 Test',

  // Preferences & Billing Flags
  subsidyAmount: '50',
  poNumber: 'PO1001',
};

test('Create customer from Customer Care with all fields', async ({ page }) => {
  const customerPage = new CustomerCreationPage(page);

  await customerPage.loginIfNeeded(process.env.ODOO_USER, process.env.ODOO_PASS);
  await customerPage.openNewCustomer();
  await customerPage.fillBasicInformation(customer);
  await customerPage.fillAddress(customer);
  await customerPage.fillOtherInfo(customer);
  await customerPage.fillBillingFlags(customer);
  await customerPage.saveCustomer();
  await customerPage.verifySaved(customer);
});
