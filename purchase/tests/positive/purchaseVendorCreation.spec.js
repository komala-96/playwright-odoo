const { test } = require('../../fixtures/base');
const { readData } = require('../../utils/readExcelData');
const { PurchaseVendorCreation } = require('../../pages/PurchaseVendorCreation');

const data = readData('PurchaseVendorCreation');

data.forEach((row, rowIndex) => {
  const [user, pass, vendr, id, zip, Strt1, Strt2, cLimit, cName, productName, cost, memo, sap, email, phone, mob, acc] =
    row;

  test(`Verify PurchaseVendorCreation - ${vendr} (#${rowIndex + 1})`, async ({ page }) => {
    const purchaseVendorCreation = new PurchaseVendorCreation(page);

    await purchaseVendorCreation.loginIfNeeded(user, pass);
    await purchaseVendorCreation.clickMenu();
    await purchaseVendorCreation.clickPurchaseMenu();
    await purchaseVendorCreation.clickVendorCreation(vendr, id, zip, Strt1, Strt2, cLimit, memo, sap);
    await purchaseVendorCreation.clickVendorContact(cName, email, phone, mob);
    await purchaseVendorCreation.clickVendor_Products(productName);
    // await purchaseVendorCreation.clickVendor_ProductsNegative();
    await purchaseVendorCreation.Update_LastCost(cost);
    // await purchaseVendorCreation.SaveBtn();
    // await purchaseVendorCreation.CostNegativeValue_SaveBtn();
    await purchaseVendorCreation.clickAccount_setup(acc);
  });
});
