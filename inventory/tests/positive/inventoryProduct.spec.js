const { test } = require('../../fixtures/base');
const { readData } = require('../../utils/readExcelData');
const { InventoryProduct } = require('../../pages/InventoryProduct');

const data = readData('InventoryProduct');

data.forEach((row, rowIndex) => {
  const [user, pass, searchProduct, Qty] = row;

  test(`Verify InventoryProduct - ${searchProduct} (#${rowIndex + 1})`, async ({ page }) => {
    const inventoryProductPage = new InventoryProduct(page);

    await inventoryProductPage.loginIfNeeded(user, pass);
    await inventoryProductPage.clickInventoryMenu();
    await inventoryProductPage.clickInventoryProduct(searchProduct);
    await inventoryProductPage.stockOnHand(Qty);
    await inventoryProductPage.costHistory();
    await inventoryProductPage.traceability();
    await inventoryProductPage.truck();
    // await inventoryProductPage.reordering(Qty);
   // await inventoryProductPage.putawayRules(Qty);
  });
});
