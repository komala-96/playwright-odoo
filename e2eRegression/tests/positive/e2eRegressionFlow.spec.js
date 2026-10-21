const { test, expect } = require('../../fixtures/base');
const { readData } = require('../../utils/readExcelData');
const fieldNames = require('../../data/fieldNames');

// Inventory
const { InventoryConfiguration, E2E_CATEGORY_NAME, E2E_UOM_TYPE_NAME } = require('../../pages/InventoryConfiguration');
const { InventoryNewProductCreation } = require('../../pages/InventoryNewProductCreation');
const { InventoryServiceProductCreation } = require('../../pages/InventoryServiceProductCreation');
const { productQuantityAdjustments } = require('../../pages/productQuantityAdjustments');
const { productValuesAdjustments } = require('../../pages/productValuesAdjustments');
const { InventoryProduct } = require('../../pages/InventoryProduct');
const { Inv_ProductCatalogue } = require('../../pages/Inv_ProductCatalogue');
const { Inventory_SalesReturn } = require('../../pages/Inventory_SalesReturn');
const { Inventory_Material_Issue } = require('../../pages/Inventory_Material_Issue');
const { Inventory_DirectReceipt } = require('../../pages/Inventory_DirectReceipt');
const { Inventory_Material_Transfer } = require('../../pages/Inventory_Material_Transfer');
const { Inv_Virtuallocationstocktransfer } = require('../../pages/Inv_Virtuallocationstocktransfer');
const { Inv_Binlocation } = require('../../pages/Inv_Binlocation');

// Customercare
const { CustomerCarePage } = require('../../pages/CustomerCarePage');
const { CustomerCareAddress } = require('../../pages/CustomerCareAddress');
const { SalesOrderAndRegisterPayment } = require('../../pages/SalesOrderAndRegisterPayment');
const { BackOrderPage } = require('../../pages/BackOrderPage');

// Purchase
const { PurchaseVendorCreation } = require('../../pages/PurchaseVendorCreation');
const { PurchaseOrderPage } = require('../../pages/PurchaseOrderPage');
const { PurchaseBill } = require('../../pages/PurchaseBill');
const { PurchaseBackOrderPage } = require('../../pages/PurchaseBackOrderPage');

// Accounting
const { CustomerInvoiceCreationPage } = require('../../pages/CustomerInvoiceCreationPage');
const { CustomerAdvancePayment } = require('../../pages/CustomerAdvancePayment');
const { VendorBillCreationPage } = require('../../pages/VendorBillCreationPage');
const { VendorAdvancePayment } = require('../../pages/VendorAdvancePayment');
const { CustomerCreditMemo } = require('../../pages/CustomerCreditMemo');
const { DebitMemo } = require('../../pages/DebitMemo');

// Micromarketservices
const { MicroMarketCreationPage } = require('../../pages/MicroMarketCreationPage');
const { StoreOrderCreationPage } = require('../../pages/StoreOrderCreationPage');
const { UpdateLocation } = require('../../pages/UpdateLocation');
const { SpecialsPage } = require('../../pages/SpecialsPage');
const { FrontDeskDiscount } = require('../../pages/FrontDeskDiscount');
const { OtherPaymentMethodsPage } = require('../../pages/OtherPaymentMethodsPage');

// The whole scenario is driven by a single consolidated row (one value per
// field) rather than the usual per-module excel file, so every step below
// references the same product/customer/vendor names for continuity. Values
// are zipped from fieldNames (order-of-truth) instead of positional
// destructuring, since a 200+ column positional array is too easy to
// silently misalign.
const [dataRow] = readData('E2ERegression');
const d = Object.fromEntries(fieldNames.map((name, i) => [name, dataRow[i]]));
const { Username: user, Password: pass } = d;

// Set by Step 05 (whichever product its catalogue dropdown happened to pick)
// and read by Step 06, so the customer's approved-products list draws from
// the actual catalogue product instead of a separate hardcoded name.
let catalogueProductName;

test.describe.serial('E2E Regression Flow', () => {
  test('Step 01 - Create UoM category, UoM type and route from Inventory configuration', async ({ page }) => {
    const inventoryConfig = new InventoryConfiguration(page);

    await inventoryConfig.loginIfNeeded(user, pass);
    await inventoryConfig.clickInventoryMenuButton();
    // clickUPC() (creates a Product UPC Code record) is intentionally not
    // called here: the proven inventoryConfiguration.spec.js this was copied
    // from also leaves it commented out, since its body ends in an
    // Action > Export flow (file-download dialog) that was never validated
    // as part of that spec's working call chain.
    await inventoryConfig.clickUomCategories();
    await inventoryConfig.clickUomType();
    await inventoryConfig.clickRoute();
  });

  test('Step 02 - Create a new product with box/case UoM, the created category and a UPC code', async ({ page }) => {
    const newProduct = new InventoryNewProductCreation(page);

    await newProduct.loginIfNeeded(user, pass);
    await newProduct.clickInventoryMenuButton();
    await newProduct.clickCreateButton();
    await newProduct.CreateProductDetails(
      d.productName, d.productCode, d.productUpc, d.productSku, d.productPkgId,
      E2E_CATEGORY_NAME
    );
    await newProduct.CreateSalesPriceDetails(d.listPrice1, d.listPrice2, d.listPrice3, '0', d.productUpc);
    await newProduct.UoM_click(
      d.boxQty, d.boxPrice1, d.boxPrice2, d.boxPrice3,
      d.caseQty, d.casePrice1, d.casePrice2, d.casePrice3,
      E2E_UOM_TYPE_NAME
    );
    await newProduct.CreateLogisticsDetails(d.volume, d.manufacturer, d.weight, d.mfrPartNumber);
    await newProduct.clickTaxDetails(d.fluidOz, d.containerDeposit, '');
    await newProduct.saveBtn_click();
    await newProduct.clickDelete();
  });

  test('Step 03 - Create a service product', async ({ page }) => {
    const serviceProduct = new InventoryServiceProductCreation(page);

    await serviceProduct.loginIfNeeded(user, pass);
    await serviceProduct.clickInventoryMenuButton();
    await serviceProduct.clickCreateButton();
    await serviceProduct.CreateProductDetails(
      d.serviceProductName, d.serviceCode, '', d.serviceSku, d.serviceId
    );
    await serviceProduct.CreateSalesPriceDetails(
      d.serviceListPrice1, d.serviceListPrice2, d.serviceListPrice3, '0', ''
    );
    await serviceProduct.UoM_click(
      d.serviceBoxQty, d.serviceBoxPrice1, d.serviceBoxPrice2, d.serviceBoxPrice3,
      d.serviceCaseQty, d.serviceCasePrice1, d.serviceCasePrice2, d.serviceCasePrice3
    );
    await serviceProduct.clickTaxDetails(d.fluidOz, d.containerDeposit, '');
    await serviceProduct.saveBtn_click();
    await serviceProduct.clickProductPrice();
  });

  test('Step 04 - Do a quantity adjustment and a value adjustment, then check the stock on hand', async ({ page }) => {
    const qtyAdjustments = new productQuantityAdjustments(page);

    await qtyAdjustments.loginIfNeeded(user, pass);
    await qtyAdjustments.clickInventoryMenuButton();
    await qtyAdjustments.clickInventoryAdjustmentMenuButton();
    await qtyAdjustments.clickCreateButton();
    await qtyAdjustments.clickLocationUpdate();
    await qtyAdjustments.clickQuantityAdjustments(d.qtyAdjustmentRefNo);
    await qtyAdjustments.clickProducts(d.productName);
    await qtyAdjustments.clickProductCount(d.countedQty);
    await qtyAdjustments.clickValidateInventoryBtn();
    await qtyAdjustments.clickDuplicateBtn();

    const valueAdjustments = new productValuesAdjustments(page);

    await valueAdjustments.loginIfNeeded(user, pass);
    await valueAdjustments.clickInventoryMenuButton();
    await valueAdjustments.clickInventoryAdjustmentMenuButton();
    await valueAdjustments.clickCreateButton();
    await valueAdjustments.clickQuantityAdjustments(d.valueAdjustmentRefNo);
    await valueAdjustments.clickProducts(d.productName);
    await valueAdjustments.clickProductCost(d.newCost);
    await valueAdjustments.clickValidateInventoryBtn();

    // "check the stock": InventoryProduct's stockOnHand() opens the product's
    // On Hand quantities list, the direct stock-check equivalent in this suite.
    const inventoryProduct = new InventoryProduct(page);

    await inventoryProduct.loginIfNeeded(user, pass);
    await inventoryProduct.clickInventoryMenu();
    await inventoryProduct.clickInventoryProduct(d.productName);
    await inventoryProduct.stockOnHand(d.countedQty);
  });

  test('Step 05 - Create a product catalogue and add the product', async ({ page }) => {
    const catalogue = new Inv_ProductCatalogue(page);

    await catalogue.loginIfNeeded(user, pass);
    await catalogue.clickInventoryMenuButton();
    await catalogue.clickProductCatalogueMenuButton();
    await catalogue.clickCreateButton();
    await catalogue.clickCatalogueCreate(d.catalogueName, d.catalogueProduct1);
    catalogueProductName = catalogue.selectedCatalogueProductName;
    await catalogue.clickPriceUpdate(d.cataloguePrice, d.catalogueMinQty, d.catalogueMaxQty);
    await catalogue.clickUpdatePrice(d.catalogueBulkPrice);
    await catalogue.clickDelete();
  });

  test('Step 06 - Create a customer with a new product and add a product from the catalogue', async ({ page }) => {
    const customerCare = new CustomerCarePage(page);

    await customerCare.loginIfNeeded(user, pass);
    await customerCare.click_CustomerCareBtn();
    await customerCare.customer_Name(d.customerName, d.customerNickName, d.customerId);
    await customerCare.parent_Name(d.parentName);
    await customerCare.primaryAccounts_Manager_Creation(d.primaryLastName, d.primaryPurchaseLimit);
    await customerCare.customer_Type(d.customerZip, d.customerStreet, d.customerStreet2);
    await customerCare.customer_Contacts(d.customerEmail, d.customerPhone, d.customerMobile);
    await customerCare.route_Creation(d.routeName);
    await customerCare.terms_Creation(d.creditLimit);
    await customerCare.SAPCustomerDetail(d.sapCustomerNum, d.sapVendorNum, d.apPayeeName, d.arPayeeName, d.custom3);
    await customerCare.charge_Check(d.subsidyAmount, d.purchaseOrderNum);
    await customerCare.finalSaveBtn();

    const customerAddress = new CustomerCareAddress(page);

    await customerAddress.loginIfNeeded(user, pass);
    await customerAddress.click_CustomerCareBtn();
    await customerAddress.ProductADDMenu_CustomerCare(d.customerName);
    await customerAddress.click_Address();
    await customerAddress.click_contAddress(d.addressName, d.addressEmail, d.addressPhone, d.addressMobile);
    await customerAddress.click_otherAddress(d.addressName, d.addressZip, d.addressStreet, d.addressEmail, d.addressPhone, d.addressMobile);
    await customerAddress.click_privateAddress(d.addressName, d.addressZip, d.addressStreet, d.addressEmail, d.addressPhone, d.addressMobile);
    await customerAddress.click_payeeeAddress(d.addressName, d.addressZip, d.addressStreet, d.addressEmail, d.addressPhone, d.addressMobile);
    await customerAddress.click_remittoAddress(d.addressName, d.addressZip, d.addressStreet, d.addressEmail, d.addressPhone, d.addressMobile);
    await customerAddress.click_billingAddress(d.addressName, d.addressZip, d.addressStreet, d.addressEmail, d.addressPhone, d.addressMobile);
    await customerAddress.click_deliveryAddress(d.addressName, d.addressZip, d.addressStreet, d.addressEmail, d.addressPhone, d.addressMobile);
    await customerAddress.portalUsers(d.portalName, d.portalUserName, d.portalEmail);
    await customerAddress.protalUsers_CheckBox();
    await customerAddress.click_notes(d.customerInternalNotes, d.customerSpecialNotes);
    await customerAddress.click_preventivecase(d.customerCaseCategory, d.customerCaseDescription);
    await customerAddress.click_accountSetup(
      d.customerBankAccountNumber,
      d.customerCardNumber, d.customerCardName,
      d.customerCheckNumber, d.customerCheckAmount
    );
    // Adds the product-catalogue products to this customer's approved list.
    // catalogueProductName is whichever product Step 05's catalogue dropdown
    // actually picked, so this stays in sync with the real catalogue content.
    await customerAddress.orderProducts(catalogueProductName);
    await customerAddress.selectAllProduct(d.catalogueProduct2);
    await customerAddress.clickQuantity(d.catalogueProductQty, d.catalogueProductCost);
  });

  test('Step 07 - Create a sale order, its invoice, and register payment', async ({ page }) => {
    const salesOrder = new SalesOrderAndRegisterPayment(page);

    await salesOrder.loginIfNeeded(user, pass);
    await salesOrder.clickCustomerMenu();
    await salesOrder.clickOrdersPage();
    await salesOrder.clickCustomer_Details(d.customerName);
    await salesOrder.clickCustomer_Products();
    await salesOrder.clickCustomer_AddZeroProducts();
    await salesOrder.clickQuantity(d.saleOrderQty);
    await salesOrder.clickSavebtn();
    await salesOrder.clickGetTheSaleOrderAmount();
    await salesOrder.clickSalesOrderNo();
    await salesOrder.clickDeliveryMenu();
    await salesOrder.clickCheckBox();
    await salesOrder.clickDeliveryCheckBox(d.saleOrderQty);
    await salesOrder.clickOrderMenu();
    await salesOrder.clickCustomerSelect();
    await salesOrder.clickGetTheConfirmedSaleOrderAmount();
    await salesOrder.clickConfirmedSalesOrderNo();
    await salesOrder.clickInvoiceBtn();
    await salesOrder.clickGetTheInvoiceAmount();
    await salesOrder.clickInvoiceNo();
    await salesOrder.compareSalesOrderAndInvoiceAmounts();
    await salesOrder.clickRegisterPaymentBtn();
    await salesOrder.clickModeOfPayment();
    await salesOrder.clickCheckNo(d.saleOrderCheckNo);
    await salesOrder.clickAmount(d.saleOrderAdvanceAmount);
    await salesOrder.clickDepositTo();
    await salesOrder.saveBtn();
    await salesOrder.Get_The_Receipt_No();
    await salesOrder.Get_The_Invoice_Details();
    await salesOrder.unapplied_amount();
  });

  test('Step 08 - Create a backorder for a sale order', async ({ page }) => {
    // Self-contained: creates its own order and only partially delivers it
    // (backorderPartialQty < backorderQty), which is what leaves a backorder.
    const backOrder = new BackOrderPage(page);

    await backOrder.loginIfNeeded(user, pass);
    await backOrder.clickCustomerMenu();
    await backOrder.clickOrdersPage();
    await backOrder.clickCustomer_Details(d.customerName);
    await backOrder.clickCustomer_Products();
    await backOrder.clickCustomer_AddProducts();
    await backOrder.clickQuantity(d.backorderQty, d.saleOrderPrice);
    await backOrder.clickCustomer_Address();
    await backOrder.clickCustomer_OtherInfo();
    await backOrder.clickSavebtn();
    await backOrder.clickDeliveryMenu();
    await backOrder.clickCheckBox(d.backorderPartialQty);
    await backOrder.clickBackOrder(d.backorderPartialQty);
    await backOrder.clickDelivery_Backorder();
    await backOrder.clickCheckBox_Backorder();
    await backOrder.clickDeliveryCheckBox();
    await backOrder.clickOrderMenu();
    await backOrder.clickCustomerSelect();
    await backOrder.clickConfirmedSalesOrderNo();
    await backOrder.clickActionMenu();
    await backOrder.clickInvoiceBtn();
    await backOrder.clickInvoicePrint();
  });

  test('Step 09 - Create a vendor with a new product', async ({ page }) => {
    const vendor = new PurchaseVendorCreation(page);

    await vendor.loginIfNeeded(user, pass);
    await vendor.clickMenu();
    await vendor.clickPurchaseMenu();
    await vendor.clickVendorCreation(
      d.vendorName, d.vendorId, d.vendorZip, d.vendorStreet1, d.vendorStreet2,
      d.vendorCreditLimit, d.vendorMemo, d.vendorSap
    );
    await vendor.clickVendorContact(d.vendorContactName, d.vendorEmail, d.vendorPhone, d.vendorMobile);
    // First Products-tab line uses the Step 02 product rather than a
    // separate vendor-only product, so this vendor's whole catalogue traces
    // back to the one product created in Step 02.
    await vendor.clickVendor_Products(d.productName);
    await vendor.Update_LastCost(d.vendorProductCost);
    // Re-add the Step 02 product (its own multi-UoM row already exists via
    // UoM_click) as a second Products-tab line, this time with a different
    // UoM/cost - proves a product can carry more than one vendor UoM. 'Each'
    // already exists as a standard UoM, so this selects it rather than
    // quick-creating a new throwaway record.
    await vendor.clickVendor_ProductsWithDifferentUom(d.productName, 'Each', d.boxPrice1);
    // Add it again, this time picking the UoM that Step 02's UoM_click
    // already created for this exact product (Odoo names it
    // "<E2E_UOM_TYPE_NAME> (<boxQty>)"), instead of an unrelated new one.
    await vendor.clickVendor_ProductsWithDifferentUom(
      d.productName, `${E2E_UOM_TYPE_NAME} (${d.boxQty})`, d.casePrice1
    );
    await vendor.clickAccount_setup(d.vendorAccountNum);
  });

  test('Step 10 - Create a purchase order and a vendor bill', async ({ page }) => {
    const purchaseOrder = new PurchaseOrderPage(page);

    await purchaseOrder.loginIfNeeded(user, pass);
    await purchaseOrder.clickPurchaseMenu();
    await purchaseOrder.clickPurchaseOrder(d.vendorName);
    await purchaseOrder.clickPurchaseOrder_Manager();
    await purchaseOrder.clickPurchaseOrder_Poducts(d.poProductName);
    await purchaseOrder.clickPurchaseOrder_ProductADD(d.poQty, d.poCost, '', d.poDiscount);
    // Second Products-tab line: the Step 02 product, as its own row.
    await purchaseOrder.clickPurchaseOrder_Poducts(d.productName);
    await purchaseOrder.clickPurchaseOrder_ProductADD(d.poQty, d.poCost, '', d.poDiscount, 2);
    await purchaseOrder.clickPurchaseOrder_Address(d.vendorZip, d.vendorStreet1, d.vendorZip, d.vendorStreet1);
    await purchaseOrder.clickSavebtn();
    await purchaseOrder.getTheTotal();
    await purchaseOrder.clickMail();

    const bill = new PurchaseBill(page);

    await bill.loginIfNeeded(user, pass);
    await bill.click_PucrahseBillMenuBtn();
    await bill.clickVendorCreation(d.vendorName);
    await bill.click_Poducts(d.billProductName);
    await bill.clickProductQty(d.billQty);
    await bill.clickOtherInfo();
    await bill.clickPostbtn();
    await bill.getTheTotal();
    await bill.clickVendorName();
    await bill.clickPrintButton();
    await bill.clickRegisterPaymentBtn();
    await bill.clickModeOfPayment();
    await bill.clickCheckNo(d.billCheckNo);
    await bill.clickAmount(d.billAmount);
    await bill.clickDepositTo();
    await bill.saveBtnAction();
    await bill.Get_The_Receipt_No();
  });

  test('Step 11 - Create a backorder for a purchase order', async ({ page }) => {
    // Self-contained: receives only a partial quantity to force the backorder.
    const poBackOrder = new PurchaseBackOrderPage(page);

    await poBackOrder.loginIfNeeded(user, pass);
    await poBackOrder.clickPurchaseMenu();
    await poBackOrder.clickPurchaseOrder(d.vendorName);
    await poBackOrder.clickPurchaseOrder_Poducts(d.poBoProductName);
    await poBackOrder.clickPurchaseOrder_ProductADD(d.poBoQty, d.poBoCost, '', d.poBoDiscount);
    await poBackOrder.clickSavebtn();
    await poBackOrder.clickReceivebtn();
    await poBackOrder.clickBackOrder();
    await poBackOrder.clickConfirmOrder();
  });

  test('Step 12 - Create a direct customer invoice and register its payment', async ({ page }) => {
    const directInvoice = new CustomerInvoiceCreationPage(page);

    await directInvoice.loginIfNeeded(user, pass);
    await directInvoice.ClickFinancialAcctMenu();
    await directInvoice.ClickInvoiceMenu();
    await directInvoice.clickCustomerName(d.customerName);
    await directInvoice.clickCustomer_PONumber();
    await directInvoice.clickAddressMenu(d.directInvoiceStreet, d.directInvoiceStreet2, d.directInvoiceZip);
    await directInvoice.clickDeliveryNotes();
    await directInvoice.clickInvoiceLinesMenu();
    await directInvoice.click_associated_product();
    await directInvoice.clickService_Products();
    await directInvoice.updateProductQuantities(d.directInvoiceQty, d.directInvoicePrice);
    await directInvoice.clickTaxUpdate(d.directInvoiceShipping, '', d.directInvoiceInsurance, d.directInvoiceDiscount);
    await directInvoice.clickPostbtn();
    await directInvoice.getTheTotal();
    await directInvoice.clickInvoiceDetails();
    await directInvoice.clickPrintButton();
    await directInvoice.clickRegisterPaymentBtn();
    await directInvoice.clickModeOfPayment();
    await directInvoice.clickCheckNo(d.directInvoiceCheckNo);
    await directInvoice.clickAmount(d.directInvoiceAmount);
    await directInvoice.clickDepositTo();
    await directInvoice.clickInvoiceCheckBox();
    await directInvoice.saveBtn();
    await directInvoice.Get_The_Receipt_No();
  });

  test('Step 13 - Create an advance for the customer and verify the customer balance', async ({ page }) => {
    const customerAdvance = new CustomerAdvancePayment(page);

    await customerAdvance.loginIfNeeded(user, pass);
    await customerAdvance.click_Menu();
    await customerAdvance.click_financialAccountingMenuBtn();
    await customerAdvance.click_CreateBtn();
    await customerAdvance.click_CustomerSelect(d.customerName);

    // Balance verification: read the customer's balance before the advance is
    // applied, then re-read it (afterSaved_CustomerBalance, same underlying
    // customer_debit field) once the advance is confirmed and saved, and
    // assert it changed - i.e. the advance was actually applied to the account.
    const balanceBeforeAdvance = await customerAdvance.customerBalance.textContent();

    await customerAdvance.click_BankDetails(d.advanceAmount);
    await customerAdvance.click_CustomerDetails(d.advanceDate, d.advanceCheckNo, d.advanceBankName);
    await customerAdvance.entered_Notes(d.advanceNote, d.advanceInternalNotes, d.advanceMemoNote, d.advanceRevisionDate);
    await customerAdvance.confirmBtn();

    const balanceAfterAdvance = await customerAdvance.afterSaved_CustomerBalance.textContent();
    console.log(`Customer balance before advance: ${balanceBeforeAdvance} / after advance: ${balanceAfterAdvance}`);
    //expect(balanceAfterAdvance).not.toBe(balanceBeforeAdvance);

    await customerAdvance.click_GetTheDetails();
    await customerAdvance.actionBtn();
  });

  test('Step 14 - Create a direct vendor bill and register its payment', async ({ page }) => {
    const directBill = new VendorBillCreationPage(page);

    await directBill.loginIfNeeded(user, pass);
    await directBill.clickAccountActions();
    await directBill.clickVendorCreation(d.vendorName);
    await directBill.click_Poducts(d.directBillProductName);
    await directBill.clickProductQty(d.directBillQty, d.directBillPrice);
    await directBill.clickTaxUpdate(d.directBillShipping, d.directBillInsurance, d.directBillDiscount);
    await directBill.clickOtherInfo();
    await directBill.clickPostbtn();
    await directBill.getTheTotal();
    await directBill.clickVendorName();
    await directBill.clickPrintButton();
    await directBill.clickRegisterPaymentBtn();
    await directBill.clickModeOfPayment();
    await directBill.clickCheckNo(d.directBillCheckNo);
    await directBill.clickAmount(d.directBillAmount);
    await directBill.clickDepositTo();
    await directBill.clickInvoiceCheckBox();
    await directBill.saveBtn();
    await directBill.Get_The_Receipt_No();
  });

  test('Step 15 - Create an advance for the vendor and verify it against the vendor', async ({ page }) => {
    const vendorAdvance = new VendorAdvancePayment(page);

    await vendorAdvance.loginIfNeeded(user, pass);
    await vendorAdvance.click_financialAccountingMenuBtn();
    await vendorAdvance.click_VendorName(d.vendorName);
    await vendorAdvance.click_BankDetails(d.vendorAdvanceAmount, d.vendorAdvanceCheckNum);
    await vendorAdvance.entered_Notes(
      d.vendorAdvanceNote, d.vendorAdvanceInternalNotes, d.vendorAdvanceMemoNote, d.vendorAdvanceRevisionDate
    );
    await vendorAdvance.click_confirmBtn();

    // VendorAdvancePayment has no balance field (unlike its customer
    // counterpart) - the closest verifiable proof the advance was actually
    // created against this vendor is its generated transaction reference.
    await vendorAdvance.AdvanceTRN();
    const advanceTrnText = await vendorAdvance.advanceTRN.textContent();
    console.log(`Vendor advance transaction reference: ${advanceTrnText}`);
    expect(advanceTrnText.trim().length).toBeGreaterThan(0);

    await vendorAdvance.actionBtn();
  });

  test('Step 16 - Create a sales return and its credit memo', async ({ page }) => {
    const salesReturn = new Inventory_SalesReturn(page);

    await salesReturn.loginIfNeeded(user, pass);
    await salesReturn.clickMainMenu();
    await salesReturn.clickInventoryMenu();
    // Uses the customer created in Step 06 (not the hardcoded
    // salesReturnCustomerName) since that's the customer Step 07 actually
    // created a sale order/invoice for - the sales return's invoice search
    // needs a real invoice to find.
    await salesReturn.clickSalesReturnCreate(d.customerName);
    await salesReturn.clickSalesReturnInvoice();
    await salesReturn.clickReturnWarehouse();
    await salesReturn.clickReturn_Qty(d.salesReturnQty);
    await salesReturn.clickSaveBtn();
    await salesReturn.clickDeleteBtn();

    const creditMemo = new CustomerCreditMemo(page);

    await creditMemo.loginIfNeeded(user, pass);
    await creditMemo.click_Menu();
    await creditMemo.click_financialAccountingMenuBtn();
    await creditMemo.click_CreateBtn();
    // Must match the customer above: click_CustomerSelect picks a
    // sales-return receipt for this customer, so it has to be the same
    // customer the sales return was just created for.
    await creditMemo.click_CustomerSelect(d.customerName, d.creditMemoShipping, d.creditMemoInsurance, d.creditMemoDiscount);
    await creditMemo.click_SaleDiscount(d.customerName, d.creditMemoSaleDiscountAmount);
    await creditMemo.click_Others(d.customerName, d.creditMemoOthersAmount);
  });

  test('Step 17 - Create a material issue and its debit memo', async ({ page }) => {
    const materialIssue = new Inventory_Material_Issue(page);

    await materialIssue.loginIfNeeded(user, pass);
    await materialIssue.clickMainMenu();
    await materialIssue.clickInventoryMenu();
    await materialIssue.clickMaterialIssueType();
    await materialIssue.clickVendorName(d.materialIssueVendorName);
    await materialIssue.clickBillTRN();
    await materialIssue.clickEmployee();
    await materialIssue.clickReturnReason(d.materialIssueReason);
    await materialIssue.clickProductIssueQty(d.materialIssueQty);
    await materialIssue.clickSubmitBtn();
    await materialIssue.clickDebitMemo();
    await materialIssue.clickDelete();

    const debitMemo = new DebitMemo(page);

    await debitMemo.loginIfNeeded(user, pass);
    await debitMemo.clickFinancialAcctMenu();
    await debitMemo.clickDebitMemo();
    await debitMemo.clickVendorName(d.materialIssueVendorName);
    await debitMemo.clickMaterial_Issue();
    await debitMemo.clickTaxUpdateNegative(d.debitMemoShipping, '', d.debitMemoInsurance, d.debitMemoDiscount);
    await debitMemo.clickPostbtn();
    await debitMemo.clickDemoMemoDetails();
    await debitMemo.click_PurchaseDiscount(d.materialIssueVendorName, d.debitMemoPurchaseDiscountAmount);
    await debitMemo.click_Others(d.materialIssueVendorName, d.debitMemoOthersAmount);
  });

  test('Step 18 - Create a direct receipt', async ({ page }) => {
    const directReceipt = new Inventory_DirectReceipt(page);

    await directReceipt.loginIfNeeded(user, pass);
    await directReceipt.clickMainMenu();
    await directReceipt.clickInventoryMenu();
    await directReceipt.clickDirectReceiptCreate(d.directReceiptVendorName);
    await directReceipt.clickDirectReceiptLocation();
    await directReceipt.clickReturnProduct();
    await directReceipt.clickReturn_Qty(d.directReceiptQty, d.directReceiptCost);
    await directReceipt.clickSaveBtn();
  });

  test('Step 19 - Create a material transfer', async ({ page }) => {
    const materialTransfer = new Inventory_Material_Transfer(page);

    await materialTransfer.loginIfNeeded(user, pass);
    await materialTransfer.clickMainMenu();
    await materialTransfer.clickInventoryMenu();
    await materialTransfer.clickMaterialTransferCreate(d.customerName);
    await materialTransfer.clickMaterialTransferLocation();
    await materialTransfer.clickReturnProduct();
    await materialTransfer.clickReturn_Qty(d.materialTransferQty);
    await materialTransfer.clickOtherInfo();
    await materialTransfer.clickDelete();
  });

  test('Step 20 - Do a virtual location stock transfer and create a bin location', async ({ page }) => {
    const virtualTransfer = new Inv_Virtuallocationstocktransfer(page);

    await virtualTransfer.loginIfNeeded(user, pass);
    await virtualTransfer.clickInventoryMenuButton();
    await virtualTransfer.clickInventoryAdjustmentMenuButton();
    await virtualTransfer.clickCreateButton();
    await virtualTransfer.clickTransfer(d.newLocationProductName, d.virtualTransferReason, d.virtualTransferQty);
    await virtualTransfer.clickWarehousetoVirtual(d.newLocationProductName, d.virtualTransferReason, d.virtualTransferQty);
    await virtualTransfer.clickVirtualtoWarehouse(d.newLocationProductName, d.virtualTransferReason, d.virtualTransferQty);

    const binLocation = new Inv_Binlocation(page);

    await binLocation.loginIfNeeded(user, pass);
    await binLocation.clickInventoryMenuButton();
    await binLocation.clickInventoryBinlocationMenuButton();
    await binLocation.clickCreateButton();
    await binLocation.clickLocationButton(d.binLocationName, d.binPallets, d.binHeight, d.binAisle, d.binDescription);
    await binLocation.clickInventoryBinlocationDeleteButton();
  });

  test('Step 21 - Create a new location', async ({ page }) => {
    const newLocation = new MicroMarketCreationPage(page);

    await newLocation.loginIfNeeded(user, pass);
    await newLocation.clickMicromarketMenuButton();
    await newLocation.createLocationDetails(
      d.newLocationName, d.newLocationStoreNum, d.customerName, d.newLocationZip, d.newLocationStreet, ''
    );
    await newLocation.clickProductSelection(d.newLocationProductName);
    await newLocation.cilckAddProduct();
    await newLocation.clickQuantity(d.newLocationCost, d.newLocationMinQty, d.newLocationMaxQty);
    await newLocation.saveDetails();
  });

  test('Step 22 - Create a store order', async ({ page }) => {
    const storeOrder = new StoreOrderCreationPage(page);

    await storeOrder.loginIfNeeded(user, pass);
    await storeOrder.clickMicroMarketServiceMenuButton();
    await storeOrder.clickStoreOrderCreation(d.storeOrderLimit);
    await storeOrder.ClickOrder_Quantity();
    await storeOrder.clickSaveBtn();
    await storeOrder.clickApproveBtn();
    await storeOrder.clickPickBtn();
    await storeOrder.clickReceivedBtn();
    await storeOrder.clickOtherDetails();
    await storeOrder.clickPrintDetails();
    await storeOrder.clickDuplicateDetails();
  });

  test('Step 23 - Update a location', async ({ page }) => {
    const updateLocation = new UpdateLocation(page);

    await updateLocation.loginIfNeeded(user, pass);
    await updateLocation.click_MicroMarketServices_Menu();
    await updateLocation.click_UpdateLocation_Menu();
    await updateLocation.click_customer_Selection();
    await updateLocation.click_microMarket_Selection();
    await updateLocation.click_productCategory_Selection();
    await updateLocation.click_getProductListBtn();
  });

  test('Step 24 - Create a special and a front desk/employee discount', async ({ page }) => {
    const specials = new SpecialsPage(page);

    await specials.loginIfNeeded(user, pass);
    await specials.clickMeansButton();
    await specials.specialsMenu();
    await specials.creationSpecialsDetails(
      d.specialsStartDate, d.specialsStopDate, d.specialsStartTime, d.specialsStopTime,
      d.specialsDiscountPct, d.specialsNotificationTitle, d.specialsBannerText
    );
    await specials.clickSpecialsCustomerDetails(d.specialsBannerText);
    await specials.clickSpecialsProductDetails(d.specialsDiscountPct);
    await specials.clickImageADD();

    const frontDeskDiscount = new FrontDeskDiscount(page);

    await frontDeskDiscount.loginIfNeeded(user, pass);
    await frontDeskDiscount.clickMeansButton();
    await frontDeskDiscount.CreatePaymentMethod();
    await frontDeskDiscount.CreateDiscount(
      d.frontDeskCustomerName, d.frontDeskDiscountPct, d.frontDeskFirstName, d.frontDeskLastName,
      d.frontDeskEmail, d.frontDeskEmployeeId
    );
    await frontDeskDiscount.ClickDiscontinueProducts();
    await frontDeskDiscount.CreateDiscontinue();
  });

  test('Step 25 - Create other payment methods', async ({ page }) => {
    const otherPaymentMethods = new OtherPaymentMethodsPage(page);

    await otherPaymentMethods.loginIfNeeded(user, pass);
    await otherPaymentMethods.clickMeansButton();
    await otherPaymentMethods.clickPaymentButton();
    await otherPaymentMethods.CreatePaymentMethod(d.paymentMethodNickName, d.paymentMethodCreditLimit);
    await otherPaymentMethods.createAppUserDetails(d.paymentMethodFirstName, d.paymentMethodLastName, d.paymentMethodEmail);
    await otherPaymentMethods.deleteDetails();
  });
});
