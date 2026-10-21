const path = require('path');
// Addresses must be real (AveriGo validates street against zip); values from e2eFlow data.
// Test data from the "Test Data" column of End_to_End_QA_Test_Cases.xlsx.
// Odoo enforces unique names/codes, so every code gets the RUN_ID suffix;
// the spreadsheet code stays as the prefix so records are easy to find.
const { TENANT } = require('../config/env');
// Values that point at records which already exist on the tenant (warehouse, division, users, ...).
const TENANTS = {
  martiserv: {
    mainWarehouse: 'Martiserv', mainWarehouseLoc: 'Marti', division: 'Martiserv Default', frequency: 'Test1', manager: 'G Komala',
    customerType: 'Office Coffee', eachUomType: true, vendorDefaultAccounts: true, issueEmployee: 'G Komala', transferOwner: 'Komala', existingProduct: { code: '10013', name: 'Snickers 1.86oz' }, existingProduct2: { code: '100052', name: 'Dr Pepper 16.9oz' },
  },
  ultraserv: {
    mainWarehouse: 'Ultraserv Main Warehouse Cerritos', mainWarehouseLoc: 'Ultraserv Main Warehouse Cerritos', division: 'Ultraserv Automated Services, LLC', frequency: 'OAW-Mo',
    manager: 'Komala G', customerType: 'Coffee', eachUomType: false, vendorDefaultAccounts: false, issueEmployee: null, transferOwner: null, existingProduct: { code: 'PC00889', name: 'Snickers' }, existingProduct2: { code: 'AVR14655', name: 'Dr Pepper Zero 20oz' },
  },
};
const T = TENANTS[TENANT] || TENANTS.martiserv;
const RUN = process.env.RUN_ID || String(Date.now());
const SHORT = RUN.slice(-5);
const u = (code) => `${code}-${SHORT}`;
// Optional extra suffix for records re-created when re-running a single failed test with the same RUN_ID.
const R = process.env.RETRY_TAG ? `-${process.env.RETRY_TAG}` : '';
const RV = process.env.VENDOR_TAG ? `-${process.env.VENDOR_TAG}` : '';

// "All visible fields" extras for Products 1-4 (TC-010..TC-013), derived from each product's price/cost.
// Sugar Tax stays off (it adds a tax to orders); Preferred Vendor stays empty (the vendor is created in TC-060).
// Accounts: the code when offered, else the first account. The UoM line cost is read-only (cost x 12) and checked.
const productExtras = (n, { price, cost }) => ({
  image: path.join(__dirname, 'files', 'product-image.png'),
  details: {
    sku_number: `SKU${SHORT}${n}`, package_id: `PKG${SHORT}${n}`,
    list_price_2: price + 1, list_price_3: price + 2,
    description_sale: `QA Product ${n} sales description`, description_purchase: `QA Product ${n} purchase description`,
    fluid_ounce: 12, litre_type: 'Less than 710 ml',
    volume: 0.5, manufacturer: 'QA Manufacturer', weight: 0.4, mnp_id: `MPN${SHORT}${n}`,
    min_qty: 2, max_qty: 50, legacy: `LEG${SHORT}${n}`,
    reorder_point: 2, reorder_qty: 10, // Micromarket Min/Max (TC-096/TC-100 expect 2 / 10)
  },
  accounts: { sale_acc: '400000', cogs_acc: '500000', inventory_acc: '110100' },
  uomLine: { sale_price_1: price * 12, sale_price_2: (price + 1) * 12, sale_price_3: (price + 2) * 12, package_id: `CASE${SHORT}${n}` },
  uomLineComputed: { standard_price: cost * 12 },
  extraImage: { name: `QA Product ${n} image ${SHORT}`, file: path.join(__dirname, 'files', 'product-image-2.png') },
});

const products = {
  p1: { code: u('PROD-QA-001'), name: `QA Product 1 ${SHORT}`, upc: `9${RUN.slice(-11)}1`, tax: true, deposit: true, depositAmount: 0.1, cost: 10, price: 20 },
  p2: { code: u('PROD-QA-002'), name: `QA Product 2 ${SHORT}`, upc: `9${RUN.slice(-11)}2`, tax: false, deposit: false, cost: 8, price: 15 },
  p3: { code: u('PROD-QA-003'), name: `QA Product 3 ${SHORT}`, upc: `9${RUN.slice(-11)}3`, tax: false, deposit: true, depositAmount: 0.1, cost: 6, price: 12 },
  p4: { code: u('PROD-QA-004'), name: `QA Product 4 ${SHORT}`, upc: `9${RUN.slice(-11)}4`, tax: true, deposit: false, cost: 5, price: 11 },
};
for (const [k, p] of Object.entries(products)) Object.assign(p, productExtras(k.slice(1), p));

module.exports = {
  tenant: TENANT,
  mainWarehouse: T.mainWarehouse,
  mainWarehouseLoc: T.mainWarehouseLoc, // location prefix in stock history ("Marti/Stock")
  eachUomType: T.eachUomType,
  // Material Transfer Owner: null keeps the default (the logged-in user); ultraserv only shows Validate to the owner.
  transferOwner: T.transferOwner,
  issueEmployee: T.issueEmployee, // Material Issue employee; null = the TC-001 employee (no Komala employee on ultraserv)
  vendorDefaultAccounts: T.vendorDefaultAccounts, // company default vendor accounts configured (not on ultraserv) // "Each" exists as a UoM Type (ultraserv only has Box / Case)
  RUN,
  employee: {
    code: u('EMP-QA-001'),
    firstName: `QA${SHORT}`,
    lastName: 'Employee',
    // Display name AveriGo builds from first + last name; used as account/purchase manager later.
    name: `QA${SHORT} Employee`,
    jobTitle: 'QA Engineer',
    department: 'Administration',
    workEmail: `emp.qa.${SHORT}@example.com`,
    workPhone: '5550100001',
    // Every other field on the form (Work Information / Private Information / Settings tabs).
    // Government IDs, bank account, related user and PIN are intentionally not filled.
    work: { mobile_phone: '5550100002', category_ids: `QA Tag ${SHORT}`, purchase_limit: 5000, workLocation: 'QA Work Location', tz: 'America/Los_Angeles' },
    private: {
      private_street: '1700 Owens St', private_street2: 'Suite 100', private_city: 'San Francisco', private_zip: '94158',
      private_country_id: 'United States', private_state_id: 'California (US)',
      private_email: `emp.private.${SHORT}@example.com`, private_phone: '5550100003',
      distance_home_work: 12, distance_home_work_unit: 'mi', private_car_plate: `QA${SHORT.slice(-4)}`,
      country_id: 'United States', gender: 'Female', birthday: '01/15/1990', place_of_birth: 'San Francisco', country_of_birth: 'United States',
      emergency_contact: 'QA Emergency Contact', emergency_phone: '5550100004',
      marital: 'Single', children: 0, certificate: 'Bachelor', study_field: 'Computer Science', study_school: 'QA University',
      visa_expire: '12/31/2030', work_permit_expiration_date: '12/31/2030',
    },
    settings: { employee_type: 'Employee', hourly_cost: 25 },
    // Dummy uploads (data/files): avatar photo and a work permit PDF marked "DUMMY".
    files: { photo: path.join(__dirname, 'files', 'employee-photo.png'), workPermit: path.join(__dirname, 'files', 'work-permit-dummy.pdf') },
  },

  // Accounts/Purchase Manager fields list system users, not employees.
  manager: process.env.MANAGER_USER || T.manager,
  accounts: { receivable: '121000', payable: '211000' },
  category: {
    name: u('CAT-QA-001'),
    // Our own parent, so the category isn't filed under a shared one.
    parent: u('CAT-QA-PARENT'),
    sapNo: `SAP${SHORT}`,
    description: 'QA automation product category',
    image: path.join(__dirname, 'files', 'category-image.png'),
    // Valuation settings the later inventory/valuation cases rely on (AVCO, automated) - same as the instance default.
    costMethod: 'Average Cost (AVCO)',
    valuation: 'Automated',
    // Only routes flagged for categories are kept (Buy/MTO are offered but dropped on save, see FINDINGS.md TC-002).
    route: 'MM: Receive in 1 step (stock)',
    removalStrategy: 'First In First Out (FIFO)',
    accounts: {
      property_account_creditor_price_difference_categ: '500000',
      property_account_income_categ_id: '400000',
      property_account_expense_categ_id: '600000',
      property_stock_account_input_categ_id: '110200',
      property_stock_account_output_categ_id: '110300',
      property_stock_valuation_account_id: '110100',
    },
    journal: 'Inventory Valuation',
    // Toggles (Exclude From VMS Sales, Available Outside Market Area, Enable Front Desk, Beer & Wine,
    // Customer Owned Category) are intentionally left at their defaults.
  },
  uom: { name: u('UOM-QA-001'), reference: 'Each', ratio: 12 },
  // AveriGo Route ID must be an integer; the spreadsheet code goes in Description.
  route: { name: String(Number(RUN.slice(-6)) + 100000), description: u('ROUTE-QA-001') },
  // Odoo warehouse short code is max 5 characters.
  warehouse: {
    name: u('WH-QA-001'), code: `W${SHORT.slice(-4)}`, zip: '94158', street: '1700 Owens St',
    // Every other visible field. Checkboxes/toggles (Parts Warehouse, Handled Externally, Has Storage,
    // Customer Owned ..., Subsidy Includes Tax, Show Price List), archive fields and Equipments stay default.
    details: {
      store_no: `S${SHORT}W`, warehouse_id: `7${SHORT}` /* must be an integer */, street2: 'Suite 200', branch: 101, po_no: `PO-WH-${SHORT}`,
      contact_person: 'QA Warehouse Contact', email: `wh.${SHORT}@example.com`, vms_id: `VMS-WH-${SHORT}`,
      division_id: T.division, frequency: T.frequency,
      internal_notes: 'QA internal note for the warehouse', special_notes: 'QA special note for the warehouse',
    },
    image: path.join(__dirname, 'files', 'warehouse-image.png'),
  },
  truck: {
    name: u('TRUCK-QA-001'), plate: `QA${SHORT}`, zip: '94158', street: '1700 Owens St',
    // Same field set as the warehouse plus Truck Driver (our TC-001 employee). Route is left empty here:
    // the route is created after the truck (TC-004) and references it.
    details: {
      store_no: `S${SHORT}T`, street2: 'Dock 3', branch: 102, po_no: `PO-TR-${SHORT}`,
      contact_person: 'QA Truck Contact', email: `truck.${SHORT}@example.com`, vms_id: `VMS-TR-${SHORT}`,
      division_id: T.division, frequency: T.frequency,
      internal_notes: 'QA internal note for the truck', special_notes: 'QA special note for the truck',
    },
    image: path.join(__dirname, 'files', 'truck-image.png'),
  },
  bin: { name: u('BIN-QA-001') },
  bin2: { name: u('BIN-QA-002') }, // transfer destination (TC-077)
  parentCustomer: {
    name: u('PCUST-QA-001'), zip: '94158', street: '1700 Owens St', email: `parent.${SHORT}@example.com`,
    image: path.join(__dirname, 'files', 'parent-customer-image.png'),
    // Every other visible, editable field. Checkboxes stay default (Is Parent / Default Delivery Address on;
    // Fuel Charge, Hazard Fee, Subsidy, Master Invoice, Monthly Statement, PO Check, Buy All Item off).
    // Not filled: Remit To and Out Service Date (read-only), Portal Users (creates logins), bank/card/check details,
    // Order Products / Equipments / Preventive Cases (none exist yet at TC-008).
    details: {
      nick_name: `QA Parent ${SHORT}`, code: `PC${SHORT}`, phone: '4155550111', mobile: '4155550112',
      checkin_frequency: '75', in_service_date: '10/01/2026', /* Out Service Date is read-only */
      custom_2: 'QA AR Payee', credit_limit: 10000, internal_reference: `8${SHORT}`, custom_3: 'QA Custom 3',
      count: 25, website: 'https://example.com/qa-parent', payee_name: `9${SHORT}` /* SAP numbers: digits only */, custom_1: 'QA AP Payee',
      street2: 'Floor 2',
      group_master_invoice: 'Monthly', price_category: 'List Price 1', property_payment_term_id: '30 Days',
      customer_type: T.customerType, visitors_types_ids: 'Businessman',
    },
    contact: {
      name: `QA Parent Contact ${SHORT}`, zip: '94158', street: '1700 Owens St', street2: 'Floor 2',
      email: `parent.contact.${SHORT}@example.com`, phone: '4155550113', mobile: '4155550114', comment: 'QA contact note',
    },
    notes: { comment: 'QA internal note for the parent customer', special_notes: 'QA special note for the parent customer' },
    // Order Products: an existing instance product (the QA products are only created in TC-010).
    orderProduct: T.existingProduct,
    // Preventive Cases tab. Category / Type / Case Origin take the first option offered; Equipment fields stay empty.
    preventiveCase: {
      case_description: `QA preventive case for parent ${SHORT}`, internal_comment: 'QA preventive case internal comment',
      reported_by: 'QA Reporter', reported_phone: '4155550115', reported_email: `case.reporter.${SHORT}@example.com`,
    },
    // Account Setup (Receivable is set by setAccounts). Accounts without an obvious match take the first offered.
    accounts: {
      advance_account_id: '101406', sales_tax_liability_account_id: '251000',
      sales_discount_account_id: null, insurance_account_id: null, terms_discount_account_id: null, shipping_handling_account_id: null,
    },
  },
  orderType: { name: u('ORDTYPE-QA-001') },
  products,
  // TC-014: service product with every visible field (no UPCs / Logistics / Warehouse / Micromarket tabs for services).
  // Taxable stays Yes (the instance default the order tests were built on); no container deposit.
  // An already existing product on the instance (not created by the suite), used on TC-026's order.
  existingProduct: T.existingProduct,
  // Another existing product, added at Delivery (it must not already be on the order).
  existingProduct2: T.existingProduct2,
  service: {
    code: u('SERV-QA-001'), name: `QA Service ${SHORT}`, price: 25, type: 'Service', tax: true, deposit: false,
    image: path.join(__dirname, 'files', 'product-image.png'),
    details: {
      sku_number: `SKU${SHORT}S`, package_id: `PKG${SHORT}S`, list_price_2: 26, list_price_3: 27,
      description_sale: 'QA Service sales description', description_purchase: 'QA Service purchase description',
      litre_type: 'Less than 710 ml',
    },
    accounts: { sale_acc: '400000', cogs_acc: '500000' },
    uomLine: { sale_price_1: 300, sale_price_2: 312, sale_price_3: 324, package_id: `CASE${SHORT}S` },
    extraImage: { name: `QA Service image ${SHORT}`, file: path.join(__dirname, 'files', 'product-image-2.png') },
  },
  customerCatalogue: { name: u('PCAT-CUST-QA-001'), products: ['p2', 'p3', 'p4'] },
  mmCatalogue: { name: u('PCAT-MM-QA-001'), products: ['p2', 'p3', 'p4'] },
  customer1: {
    name: u('CUST-QA-001') + R, code: u('C1') + R, zip: '94158', street: '1700 Owens St', email: `cust1.${SHORT}@example.com`,
    // TC-022: every checkbox ticked (as requested). NOTE: Fuel Charge / Hazard Fee / Subsidy need the products in
    // Setup > Default Setup > Sales, which are empty on this instance, so Customer 1 orders can't be confirmed
    // (TC-026..029, 042, 043) until those are configured - set taxes: [] to skip them again.
    taxes: ['Fuel Charge', 'Hazard Fee', 'Subsidy'],
    // TC-022: every other visible, editable field. Price Category stays List Price 1 (orders expect list price 1).
    // Account Setup keeps the instance defaults except Receivable (121000), since those accounts decide where later
    // orders / advances / discounts post. Not filled: Remit To / Out Service Date (read-only), Portal Users (adding
    // one creates a login - add it manually), bank/card/check details, Equipments (none yet).
    image: path.join(__dirname, 'files', 'customer-image.png'),
    details: {
      nick_name: `QA Customer 1 ${SHORT}`, phone: '4155550121', mobile: '4155550122',
      checkin_frequency: '80', in_service_date: '10/01/2026',
      custom_2: 'QA C1 AR Payee', credit_limit: 10000, internal_reference: `81${SHORT}`, custom_3: 'QA C1 Custom 3',
      count: 40, website: 'https://example.com/qa-customer-1', payee_name: `91${SHORT}` /* SAP numbers: digits only */, custom_1: 'QA C1 AP Payee',
      street2: 'Floor 3',
      group_master_invoice: 'Monthly', price_category: 'List Price 1', property_payment_term_id: '30 Days',
      customer_type: T.customerType, visitors_types_ids: 'Businessman',
      // the other checkboxes (Default Delivery Address is already on)
      master_invoice: true, monthly_statement: true, buy_all_item: true, po_check: true, send_case_mail: true,
      po_no: `POC1${SHORT}`, // PO # field shown once PO # is ticked; letters/digits only (no special characters)
      // shown once Subsidy is ticked (Amount or %, not both)
      subsidy_amount: 2, // Subsidy % left empty: only one subsidy method is allowed
    },
    // Contacts & Addresses: one entry per address type the dialog offers.
    contacts: ['Contact', 'Billing Address', 'Delivery Address', 'Other Address', 'Private Address', 'Payee Address', 'Remit To Address'].map((type, n) => ({
      type, name: `QA C1 ${type} ${SHORT}`, zip: '94158', street: '1700 Owens St', street2: `Unit ${n + 1}`,
      email: `cust1.addr${n + 1}.${SHORT}@example.com`, phone: `41555502${n}1`, mobile: `41555502${n}2`, comment: `QA ${type} note`,
      // Fields a type doesn't show are skipped; every checkbox it shows (e.g. Primary Contact) is ticked.
      image: path.join(__dirname, 'files', 'customer-image.png'), tickAll: true,
    })),
    notes: { comment: 'QA internal note for Customer 1', special_notes: 'QA special note for Customer 1' },
    defaultAccounts: ['sales_discount_account_id', 'advance_account_id', 'insurance_account_id', 'sales_tax_liability_account_id', 'terms_discount_account_id', 'shipping_handling_account_id'],
    preventiveCase: {
      case_description: `QA preventive case for Customer 1 ${SHORT}`, internal_comment: 'QA Customer 1 preventive case comment',
      reported_by: 'QA C1 Reporter', reported_phone: '4155550125', reported_email: `case.c1.${SHORT}@example.com`,
    },
  },
  customer2: {
    name: u('CUST-QA-002') + R, code: u('C2') + R, zip: '94158', street: '1700 Owens St', email: `cust2.${SHORT}@example.com`,
    taxes: [], // TC-023: the customer WITHOUT Fuel Charge / Hazard Fee / Subsidy
    // TC-023: every other visible, editable field, and every checkbox except Fuel Charge / Hazard Fee / Subsidy.
    // NOTE: Customer 2 carries the order/invoice matrix (TC-030..037); Master Invoice may group its invoices and
    // PO # may require a PO on its orders. Order Products is left to the later cases.
    image: path.join(__dirname, 'files', 'customer-image.png'),
    details: {
      nick_name: `QA Customer 2 ${SHORT}`, phone: '4155550131', mobile: '4155550132',
      checkin_frequency: '70', in_service_date: '10/01/2026',
      custom_2: 'QA C2 AR Payee', credit_limit: 10000, internal_reference: `82${SHORT}`, custom_3: 'QA C2 Custom 3',
      count: 30, website: 'https://example.com/qa-customer-2', payee_name: `92${SHORT}` /* SAP numbers: digits only */, custom_1: 'QA C2 AP Payee',
      street2: 'Floor 4',
      group_master_invoice: 'Monthly', price_category: 'List Price 1', property_payment_term_id: '30 Days',
      customer_type: T.customerType, visitors_types_ids: 'Businessman',
      master_invoice: true, monthly_statement: true, buy_all_item: true, po_check: true, send_case_mail: true,
      po_no: `POC2${SHORT}`, // PO # field shown once PO # is ticked; letters/digits only
    },
    contacts: ['Contact', 'Billing Address', 'Delivery Address', 'Other Address', 'Private Address', 'Payee Address', 'Remit To Address'].map((type, n) => ({
      type, name: `QA C2 ${type} ${SHORT}`, zip: '94158', street: '1700 Owens St', street2: `Suite ${n + 1}`,
      email: `cust2.addr${n + 1}.${SHORT}@example.com`, phone: `41555503${n}1`, mobile: `41555503${n}2`, comment: `QA C2 ${type} note`,
      image: path.join(__dirname, 'files', 'customer-image.png'), tickAll: true,
    })),
    notes: { comment: 'QA internal note for Customer 2', special_notes: 'QA special note for Customer 2' },
    defaultAccounts: ['sales_discount_account_id', 'advance_account_id', 'insurance_account_id', 'sales_tax_liability_account_id', 'terms_discount_account_id', 'shipping_handling_account_id'],
    preventiveCase: {
      case_description: `QA preventive case for Customer 2 ${SHORT}`, internal_comment: 'QA Customer 2 preventive case comment',
      reported_by: 'QA C2 Reporter', reported_phone: '4155550135', reported_email: `case.c2.${SHORT}@example.com`,
    },
  },
  // TC-022A: every field of Customer 1 (TC-022) edited. Name and Code are edited, verified, then restored
  // (restoreIdentity) because later cases find Customer 1 by name. Checkboxes are NOT changed; Price Category / Payment
  // Terms keep the values later orders rely on. Billing and Delivery addresses move to two different locations.
  customer1Edit: {
    name: u('CUST-QA-001') + R + ' Edited', code: u('C1E') + R, restoreIdentity: true,
    email: `cust1.edited.${SHORT}@example.com`, zip: '94116', street: '1947 10th Ave',
    image: path.join(__dirname, 'files', 'parent-customer-image.png'),
    details: {
      nick_name: `QA Customer 1 Edited ${SHORT}`, phone: '4155550161', mobile: '4155550162',
      checkin_frequency: '65', in_service_date: '10/05/2026',
      custom_2: 'QA C1 AR Payee (edited)', credit_limit: 12500, internal_reference: `84${SHORT}`, custom_3: 'QA C1 Custom 3 (edited)',
      count: 45, website: 'https://example.com/qa-customer-1-edited', payee_name: `94${SHORT}`, custom_1: 'QA C1 AP Payee (edited)',
      street2: 'Floor 5', customer_type: T.customerType, visitors_types_ids: 'Businessman',
      po_no: `POC1E${SHORT}`, // checkboxes (and the subsidy amount tied to Subsidy) are left as they are
    },
    addresses: {
      'Billing Address': { zip: '85224', street: '2181 W Shannon St', street2: 'Accounts Payable', email: `cust1.billing.${SHORT}@example.com`, phone: '4155550163' },
      'Delivery Address': { zip: '57717', street: '19242 Iron Horse Circle', street2: 'Dock 2', email: `cust1.delivery.${SHORT}@example.com`, phone: '4155550164' },
    },
    notes: { comment: 'QA internal note for Customer 1 (edited)', special_notes: 'QA special note for Customer 1 (edited)' },
  },
  // TC-060A: every editable field of the TC-060 vendor changed. Name is edited, verified, then restored (restoreIdentity)
  // because later cases find the vendor by name; Payment Terms / Ship Via / Buy All Products keep what later cases use.
  // Email stays read-only (it shows the primary contact's email).
  vendorEdit: {
    name: u('VEND-QA-001') + RV + ' Edited', restoreIdentity: true,
    zip: '94158', street: '1700 Owens St',
    details: {
      print_name: `QA Vendor Edited ${SHORT}`, vendor_code: `95${SHORT}`, internal_reference: `96${SHORT}`,
      street2: 'Building B', contact_fname: 'QA Edited', contact_lname: 'Vendor Person', phone: '4155550171',
      credit_limit: 25000, return_period: 45, check_memo: 'QA check memo (edited)',
      custom_1: 'QA Vendor Custom 1 (edited)', custom_2: 'QA Vendor Custom 2 (edited)', custom_3: 'QA Vendor Custom 3 (edited)',
    },
    contact: { email: `vendor.contact.edited.${SHORT}@example.com`, phone: '4155550172', mobile: '4155550173', comment: 'QA vendor contact note (edited)' },
    remitContact: { zip: '94158', street: '1700 Owens St', street2: 'Remit Dept (edited)', phone: '4155550174', mobile: '4155550175', comment: 'QA vendor remit-to note (edited)' },
  },
  vendor: {
    name: u('VEND-QA-001') + RV, zip: '94116', street: '1947 10th Ave', email: `vendor.${SHORT}@example.com`,
    // TC-060: every other visible, editable field. Buy All Products ticked (as requested); Vendor Approved stays on,
    // 1099 off. Account Setup keeps its defaults except Control Account 211000. Bank accounts are not entered.
    details: {
      print_name: `QA Vendor ${SHORT}`, vendor_code: `94${SHORT}` /* numeric only */, internal_reference: `93${SHORT}` /* digits only */,
      street2: 'Suite 300', contact_fname: 'QA', contact_lname: 'Vendor Contact', phone: '4155550141',
      property_supplier_payment_term_id: '30 Days', ship_via_id: 'QA Ground',
      credit_limit: 20000, return_period: 30, check_memo: 'QA check memo',
      custom_1: 'QA Vendor Custom 1', custom_2: 'QA Vendor Custom 2', custom_3: 'QA Vendor Custom 3',
      buy_all: true, // "Buy All Products"
    },
    contact: {
      name: `QA Vendor Contact ${SHORT}`, email: `vendor.contact.${SHORT}@example.com`, phone: '4155550142',
      mobile: '4155550143', comment: 'QA vendor contact note', is_primary: true,
      image: path.join(__dirname, 'files', 'customer-image.png'),
    },
    // Contacts & Addresses: a Remit to Address as well (ZIP first; City/State/County come from it).
    remitContact: {
      type: 'Remit to Address', name: `QA Vendor Remit To ${SHORT}`, zip: '94116', street: '1947 10th Ave', street2: 'Remit Dept',
      email: `vendor.remit.${SHORT}@example.com`, phone: '4155550144', mobile: '4155550145', comment: 'QA vendor remit-to note',
      image: path.join(__dirname, 'files', 'customer-image.png'),
    },
    defaultAccounts: ['vendor_terms_discount_account_id', 'vendor_advance_account_id', 'vendor_tax_account_id', 'purchase_discount_account_id', 'vendor_insurance_account_id', 'vendor_ship_handling_account_id'],
    // Products tab line for Product 1 (UoM / cost are set from TC-060's options).
    productLine: { vendor_part_code: `VP${SHORT}1`, vendor_part_name: 'QA vendor part 1', tax_status: 'Yes', min_qty: 5, lead_time: 3, lead_unit: 'Days', product_long_desc: 'QA vendor long description' },
  },
  equipmentConfig: {
    type: u('EQTYPE-QA'), name: u('EQNAME-QA'), model: u('EQMODEL-QA'), modelNumber: u('EQMN-QA'), area: u('EQAREA-QA'),
    caseCategory: u('CASECAT-QA'), caseStage: u('CASESTAGE-QA'), caseOrigin: u('CASEORIGIN-QA'), caseType: u('CASETYPE-QA'),
  },
  part: {
    name: u('PART-QA-001'), type: 'Product', taxable: true, price: 25, cost: 12.5,
    image: path.join(__dirname, 'files', 'product-image-2.png'), // uom / vendor are set from the TC-003 UoM and TC-060 vendor in the test
  },
  equipment1: {
    serial: u('EQ1-SN'), value: 1500, assetNo: `AST-${SHORT}`, frontage: 'Glass Front', finance: 'Lease',
    manufacture: 'QA Manufacturer', distributor: 'QA Distributor', image: path.join(__dirname, 'files', 'product-image.png'),
    flags: { is_inventory: true, is_telemetry: true, is_credit_Card_reader: true, is_energy_star: true, is_health_wellness: true },
    recurring: true, note: 'QA equipment 1 note', partQty: 2,
  },
  equipment2: {
    serial: u('EQ2-SN'), recurringAmount: 50, value: 2500, assetNo: `AST2-${SHORT}`, frontage: 'Stack', finance: 'Loan',
    manufacture: 'QA Manufacturer 2', distributor: 'QA Distributor 2', image: path.join(__dirname, 'files', 'product-image-2.png'),
    flags: { is_inventory: true, is_telemetry: true, is_credit_Card_reader: true, is_energy_star: true, is_health_wellness: true },
    recurring: true, note: 'QA equipment 2 note', partQty: 1,
  },
  lead: {
    name: u('Lead-QA-001'),
    extras: {
      revenue: 5000, probability: 40, street2: 'Floor 3', city: 'San Francisco', state: 'California', rooms: 120, occupancy: '75',
      visitorTypes: true, team: true, middleName: 'Lead', jobPosition: 'Facilities Manager', mobile: '4155550102',
      website: 'https://qa-lead.example.com', tags: true, priority: 2, properties: true, notes: 'QA lead internal note',
      campaign: true, medium: true, source: true, referred: 'QA Referrer',
    },
  },
  opportunity: {
    name: u('Opportunity-QA-001'), revenue: 1000,
    extras: {
      probability: 60, email: 'opportunity.qa@example.com', phone: '4155550103', team: true, tags: true, priority: 3, properties: true,
      company: 'QA Opportunity Company', street: '1700 Owens St', street2: 'Floor 4', city: 'San Francisco', state: 'California', zip: '94158',
      rooms: 80, occupancy: '65', visitorTypes: true, title: true, contactName: 'QA Opportunity Contact', jobPosition: 'Operations Manager',
      mobile: '4155550104', website: 'https://qa-opportunity.example.com', campaign: true, medium: true, source: true,
      referred: 'QA Opportunity Referrer', notes: 'QA opportunity internal note',
    },
  },
  crmEvent: {
    name: u('Event-QA-CRM-001'),
    extras: {
      employees: true, duration: '01:30', location: 'QA Customer 1 site', videocall: true, tags: true,
      showAs: 'Available', privacy: 'Public', reminders: true, description: 'QA CRM meeting with Customer 1',
    },
  },
  survey: {
    title: u('SURVEY-QA-001'), question: 'How satisfied are you with the service?',
    extras: {
      image: path.join(__dirname, 'files', 'product-image.png'), restrictTo: true,
      layout: 'One page per section', progression: 'Number', selection: 'All questions', roaming: true,
      accessMode: 'Anyone with the link', loginRequired: false, timeLimit: 10, scoring: 'Scoring with answers at the end', passPercent: 70,
      description: 'QA customer satisfaction survey', endMessage: 'Thank you for completing the QA survey',
      question: {
        type: 'Multiple choice: only one answer', choices: ['Very satisfied', 'Satisfied', 'Not satisfied'],
        description: 'Rate the service you received', comments: true, commentMessage: 'Anything else to add?', mandatory: true, width: true,
      },
    },
  },
  event: {
    name: u('EVENT-QA-001'),
    extras: {
      timezone: 'US/Pacific', language: 'English (US)', tags: 'QA Event', venue: true, seatsMax: 50, badgeFormat: '4 per sheet',
      badgeImage: path.join(__dirname, 'files', 'product-image.png'),
      ticket: { name: 'QA Standard Ticket', price: 25, seats: 40 },
      question: { title: 'Meal preference', type: 'Selection', answers: ['Vegetarian', 'Non-vegetarian'], mandatory: true, oncePerOrder: false },
      note: 'QA event internal note', ticketInstructions: 'Bring this ticket to the QA event desk',
    },
  },
  microMarket: {
    name: u('MM-QA-001'), zip: '94158', street: '1700 Owens St',
    // TC-094: every other field (Handled Externally / archive fields left alone).
    extras: {
      storeNo: `ST-${SHORT}`, image: path.join(__dirname, 'files', 'warehouse-image.png'), type: 'Office', street2: 'Floor 2 Break Room',
      county: 'San Francisco County', division: true, frequency: true, branch: 7, poNo: `MMPO-${SHORT}`,
      contact: 'QA Market Contact', email: 'mm.contact.qa@example.com', providerId: `VMS-MM-${SHORT}`,
      flags: { customer_own_alcohol: true, operator_own: true, customer_own_category: true, has_storage: true, addl_tax: true, subsidy_includes_tax: true },
      internalNotes: 'QA micro market internal note', specialNotes: 'QA micro market special note', showPriceList: true,
    },
    // Setup > Micromarket Fees row for the market (shown read-only on the market's Fees tab).
    fees: {
      cc_fees: 2.5, app_fees: 3, stored_fund_fees: 1.5, brand_fees: 1, management_fees: 2,
      platform_fees: 25, platform_fees_per_day: 1, group_fees_percentage: 4, cash_adj: 0.5,
    },
  },
  special: { name: u('Special-QA-001'), discountPercent: 10 },
  frontDeskDiscount: { percent: 15 },
  paymentMethod: { name: u('PM-QA-001') },
  // TC-099A: +10% on Products 2 and 3 at the QA market, tomorrow 09:00-17:00 (doesn't touch today's prices).
  surge: { name: u('SURGE-QA-001'), type: 'Add Percentage', value: 10, products: ['p2', 'p3'] },
  qty: {
    adjustment: 10,
    stockForSales: 500, // seeded via adjustment so sales/transfers never go negative
    order: 2,
    backorder: { order: 100, deliver: 50 },
    purchase: 20,
    poBackorder: { order: 20, receive: 10 },
    directReceipt: 5,
    transfer: 3,
    storeOrder: 4,
  },
  newCost: 12, // Product 1's cost after TC-018 (used by TC-019/TC-020)
  // TC-018 value adjustment for every stocked product (the service has no stock).
  newCosts: { p1: 12, p2: 9, p3: 7, p4: 6 },
  newPrice: 22,
  directInvoiceAmount: 100,
  customerAdvance: 50,
  // TC-041: every other editable field on the Customer Advance form (Customer No / balance are read-only).
  customerAdvanceExtras: {
    partner_bank_name: 'QA Customer Bank',
    notes: 'QA advance notes', memo: `QA advance memo ${SHORT}`, internal_notes: 'QA advance internal notes',
    revision_no: 1,
  },
  vendorAdvance: 40,
  directBillAmount: 200,
};
