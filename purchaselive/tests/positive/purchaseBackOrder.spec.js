const { test } = require('../../fixtures/base');
const { readData } = require('../../utils/readExcelData');
const { PurchaseBackOrderPage } = require('../../pages/PurchaseBackOrderPage');

const data = readData('PurchaseBackOrder');

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

  test(`Verify PurchaseBackOrder - ${vendorName} (#${rowIndex + 1})`, async ({ page }) => {
    const purchaseBackOrderPage = new PurchaseBackOrderPage(page);

    await purchaseBackOrderPage.loginIfNeeded(user, pass);
    await purchaseBackOrderPage.clickPurchaseMenu();
    await purchaseBackOrderPage.clickPurchaseOrder(vendorName);
    // await purchaseBackOrderPage.clickPurchaseOrder_Manager();
    await purchaseBackOrderPage.clickPurchaseOrder_Poducts(productName);
    await purchaseBackOrderPage.clickPurchaseOrder_ProductADD(entQTY, cost, tax, discount);
    // await purchaseBackOrderPage.clickPurchaseOrder_Address(entZipcode, entStreet, entZipcode1, entStreet1);
    await purchaseBackOrderPage.clickSavebtn();
    // await purchaseBackOrderPage.CostNegativeValue_SaveBtn();
    // await purchaseBackOrderPage.getTheTotal();
    await purchaseBackOrderPage.clickReceivebtn();
    // await purchaseBackOrderPage.clickReturn(ReturnQTY, Reason);
    await purchaseBackOrderPage.clickBackOrder();
    await purchaseBackOrderPage.clickConfirmOrder();
  });
});
