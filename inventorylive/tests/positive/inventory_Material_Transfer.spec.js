const { test } = require('../../fixtures/base');
const { readData } = require('../../utils/readExcelData');
const { Inventory_Material_Transfer } = require('../../pages/Inventory_Material_Transfer');

const data = readData('Inventory_MaterialTransfer');

data.forEach((row, rowIndex) => {
  const [user, pass, customerName, price, cost, qty, CcustomerName] = row;

  test(`Verify Inventory_Material_Transfer - ${customerName} (#${rowIndex + 1})`, async ({ page }) => {
    const inventoryMaterialTransferPage = new Inventory_Material_Transfer(page);

    await inventoryMaterialTransferPage.loginIfNeeded(user, pass);
    await inventoryMaterialTransferPage.clickMainMenu();
    await inventoryMaterialTransferPage.clickInventoryMenu();
    await inventoryMaterialTransferPage.clickMaterialTransferCreate(customerName);
    await inventoryMaterialTransferPage.clickMaterialTransferLocation();
    await inventoryMaterialTransferPage.clickReturnProduct();
    await inventoryMaterialTransferPage.clickReturn_Qty(qty);
    // Negative -Scenario
    // await inventoryMaterialTransferPage.clickReturn_Qty_Negative(price, cost, qty);
    await inventoryMaterialTransferPage.clickOtherInfo();
    await inventoryMaterialTransferPage.clickDelete();
  });
});
