const { test } = require('../../fixtures/base');
const { readData } = require('../../utils/readExcelData');
const { PurchaseVendorEdit } = require('../../pages/PurchaseVendorEdit');

const data = readData('PurchaseVendorEdit', 'negative');

data.forEach((row, rowIndex) => {
  const [user, pass, vendr, id, zip, Strt1, Strt2, cLimit, cName, productName, cost, memo, sap, email, phone, mob, acc] = row;

  test(`Verify PurchaseVendorEdit - ${vendr} (#${rowIndex + 1})`, async ({ page }) => {
    const purchaseVendorEdit = new PurchaseVendorEdit(page);

    await purchaseVendorEdit.loginIfNeeded(user, pass);
    await purchaseVendorEdit.clickMenu();
    await purchaseVendorEdit.clickPurchaseMenu(id);
    await purchaseVendorEdit.clickVendorCreation(vendr, id, zip, Strt1, Strt2, cLimit, memo, sap);
    // await purchaseVendorEdit.clickVendorContact(cName, email, phone, mob);
    await purchaseVendorEdit.clickVendor_Products(productName);
    await purchaseVendorEdit.clickVendor_Products1(productName);
    // await purchaseVendorEdit.clickVendor_ProductsNegative();
    await purchaseVendorEdit.Update_LastCostNegative(cost);
    // await purchaseVendorEdit.SaveBtn();
    // await purchaseVendorEdit.CostNegativeValue_SaveBtn();
    // await purchaseVendorEdit.clickAccount_setup(acc);
  });
});
