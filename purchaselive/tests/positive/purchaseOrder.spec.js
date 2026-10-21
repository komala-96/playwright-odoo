const { test } = require('../../fixtures/base');
const { readData } = require('../../utils/readExcelData');
const { PurchaseOrderPage } = require('../../pages/PurchaseOrderPage');

const data = readData('PurchaseOrder');

data.forEach((row, rowIndex) => {
  const [
    user,
    pass,
    vendorName,
    productName,
    entQTY,
    cost,
    tax,
    discount,
    entZipcode,
    entStreet,
    entZipcode1,
    entStreet1,
    ReturnQTY,
    Reason,
  ] = row;

  test(`Verify PurchaseOrder - ${vendorName} (#${rowIndex + 1})`, async ({ page }) => {
    const purchaseOrderPage = new PurchaseOrderPage(page);

    await purchaseOrderPage.loginIfNeeded(user, pass);
    await purchaseOrderPage.clickPurchaseMenu();
    await purchaseOrderPage.clickPurchaseOrder(vendorName);
    await purchaseOrderPage.clickPurchaseOrder_Manager();
    await purchaseOrderPage.clickPurchaseOrder_Poducts(productName);
    await purchaseOrderPage.clickPurchaseOrder_ProductADD(entQTY, cost, tax, discount);
    await purchaseOrderPage.clickPurchaseOrder_Address(entZipcode, entStreet, entZipcode1, entStreet1);
    await purchaseOrderPage.clickSavebtn();
    // .CostNegativeValue_SaveBtn();
    await purchaseOrderPage.getTheTotal();
    await purchaseOrderPage.clickMail();
    // .clickReceivebtn();
    // .clickReturn(ReturnQTY, Reason);
  });
});
