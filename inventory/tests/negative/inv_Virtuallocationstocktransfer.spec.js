const { test } = require('../../fixtures/base');
const { readData } = require('../../utils/readExcelData');
const { Inv_Virtuallocationstocktransfer } = require('../../pages/Inv_Virtuallocationstocktransfer');

const data = readData('Inv_Virtuallocationstocktransfer', 'negative');

data.forEach((row, rowIndex) => {
  const [user, pass, product, reason, qty] = row;

  test(`Verify Inv_Virtuallocationstocktransfer - ${product} (#${rowIndex + 1})`, async ({ page }) => {
    const inv_Virtuallocationstocktransfer = new Inv_Virtuallocationstocktransfer(page);

    await inv_Virtuallocationstocktransfer.loginIfNeeded(user, pass);
    // await inv_Virtuallocationstocktransfer.clickMenuButton();
    await inv_Virtuallocationstocktransfer.clickInventoryMenuButton();
    await inv_Virtuallocationstocktransfer.clickInventoryAdjustmentMenuButton();
    await inv_Virtuallocationstocktransfer.clickCreateButton();
    await inv_Virtuallocationstocktransfer.clickTransferNegative(product, reason, qty);
    await inv_Virtuallocationstocktransfer.clickWarehousetoVirtualNegative(product, reason, qty);
    await inv_Virtuallocationstocktransfer.clickVirtualtoWarehouseNegative(product, reason, qty);
  });
});
