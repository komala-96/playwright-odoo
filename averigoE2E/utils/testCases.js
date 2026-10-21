const path = require('path');
const XLSX = require('xlsx');

// Reads TC metadata (scenario, priority, type, expected result) from the
// source spreadsheet so test titles/tags always match the test plan.
const FILE = path.join(__dirname, '..', 'data', 'End_to_End_QA_Test_Cases.xlsx');

let cache;
function cases() {
  if (cache) return cache;
  const wb = XLSX.readFile(FILE);
  const rows = XLSX.utils.sheet_to_json(wb.Sheets['Test Cases'], { defval: '' });
  cache = Object.fromEntries(
    rows.filter((r) => r['TC ID']).map((r) => [
      String(r['TC ID']).trim(),
      {
        id: String(r['TC ID']).trim(),
        module: String(r.Module).trim(),
        scenario: String(r['Test Scenario']).trim(),
        precondition: String(r.Preconditions).trim(),
        testData: String(r['Test Data']).trim(),
        expected: String(r['Expected Result']).trim(),
        priority: String(r.Priority).trim(),
        type: String(r.Type).trim(),
      },
    ]),
  );
  return cache;
}

const slug = (s) => `@${s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')}`;

// Cases added to the suite that are not (yet) in the spreadsheet.
const EXTRA = {
  'TC-060A': {
    id: 'TC-060A', module: 'Purchase', scenario: 'Edit every field of the created vendor and save',
    precondition: 'Vendor VEND-QA-001 created in TC-060 (primary contact and remit-to address)', testData: 'Vendor VEND-QA-001, testData.vendorEdit',
    expected: 'Every edited value (address, details, contact, remit-to address) is saved on the vendor.',
    priority: 'High', type: 'Functional',
  },
  'TC-022A': {
    id: 'TC-022A', module: 'Customer Care', scenario: 'Edit every field of the created customer (separate billing and delivery addresses)',
    precondition: 'Customer 1 created in TC-022 (with Billing and Delivery addresses)', testData: 'Customer 1, testData.customer1Edit',
    expected: 'Every edited value is saved; the customer\'s Billing Address and Delivery Address are at two different locations.',
    priority: 'High', type: 'Functional',
  },
  'TC-099C': {
    id: 'TC-099C', module: 'Micro Market', scenario: 'Close a micro market (Active Market button)',
    precondition: 'A micro market for Customer 1 holding stock of Product 1', testData: 'Customer 1, a dedicated QA market, Product 1, WH-QA-001',
    expected: 'The market is closed with its date and reason; its stock is transferred to the chosen warehouse; it is no longer offered on new store orders.',
    priority: 'High', type: 'Functional',
  },
  'TC-099B': {
    id: 'TC-099B', module: 'Micro Market', scenario: 'Discontinue a product in a micro market',
    precondition: 'Micro market MM-QA-001 for Customer 1 carries Product 4 (TC-094)', testData: 'Customer 1, MM-QA-001, Product 4',
    expected: 'Product 4 is discontinued for the market: listed under Discontinued Products (date, user) and no longer offered on a new store order.',
    priority: 'Medium', type: 'Functional',
  },
  'TC-099A': {
    id: 'TC-099A', module: 'Micro Market', scenario: 'Create surge pricing',
    precondition: 'Micro market MM-QA-001 for Customer 1 with Products 2 and 3 (TC-094)', testData: 'Customer 1, MM-QA-001, CAT-QA-001, Products 2 and 3, +10%',
    expected: 'The surge saves with every entered value; each product line shows New Price = Current Price + 10%; the surge can be confirmed.',
    priority: 'Medium', type: 'Functional',
  },
  'TC-064B': {
    id: 'TC-064B', module: 'Purchase', scenario: 'Create, confirm and delete a purchase order',
    precondition: 'Vendor VEND-QA-001 with Product 1', testData: 'Vendor, Product 1',
    expected: 'A confirmed PO cannot be deleted directly; once cancelled it can be deleted and is no longer listed.',
    priority: 'Medium', type: 'Functional',
  },
  'TC-064A': {
    id: 'TC-064A', module: 'Purchase', scenario: 'Create and post a bill from Purchase > Bill',
    precondition: 'Vendor VEND-QA-001 with Products 2 and 4 available', testData: 'Vendor, Products 2 and 4',
    expected: 'The bill is created with all entered values, posted, and its totals are consistent.',
    priority: 'High', type: 'Functional',
  },
  'TC-038A': {
    id: 'TC-038A', module: 'Sales', scenario: 'Create, confirm, cancel and delete a sales order',
    precondition: 'Customer 2 and Product 1 exist', testData: 'Customer 2, Product 1',
    expected: 'A confirmed order can be cancelled; the cancelled order can be deleted and is no longer listed.',
    priority: 'Medium', type: 'Functional',
  },
};

function meta(id) {
  const c = cases()[id] || EXTRA[id];
  if (!c) throw new Error(`${id} not found in ${path.basename(FILE)}`);
  return {
    title: `${c.id} | ${c.module} | ${c.scenario}`,
    details: {
      tag: [slug(c.id), slug(c.priority), slug(c.type), slug(c.module)],
      annotation: [
        { type: 'Precondition', description: c.precondition },
        { type: 'Test Data', description: c.testData },
        { type: 'Expected Result', description: c.expected },
      ],
    },
  };
}

module.exports = { cases, meta };
