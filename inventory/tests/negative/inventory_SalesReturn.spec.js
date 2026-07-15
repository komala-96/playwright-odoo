const { test } = require('../../fixtures/base');
const { readData } = require('../../utils/readExcelData');
const { Inventory_SalesReturn } = require('../../pages/Inventory_SalesReturn');

const data = readData('Inventory_SalesReturn', 'negative');

data.forEach((row, rowIndex) => {
  const [user, pass, customerName, price, cost, qty, CcustomerName] = row;

  test(`Verify Inventory_SalesReturn - ${customerName} (#${rowIndex + 1})`, async ({ page }) => {
    const inventory_SalesReturn = new Inventory_SalesReturn(page);

    await inventory_SalesReturn.loginIfNeeded(user, pass);
    await inventory_SalesReturn.clickMainMenu();
    await inventory_SalesReturn.clickInventoryMenu();
    await inventory_SalesReturn.clickSalesReturnCreate(customerName);
    await inventory_SalesReturn.clickSalesReturnInvoiceNegative();
    await inventory_SalesReturn.clickReturnWarehouse();
    await inventory_SalesReturn.clickReturn_QtyNegative(qty);
    // Negative -Scenario
    // await inventory_SalesReturn.clickReturn_Qty_Negative(price, cost, qty);
    await inventory_SalesReturn.clickSaveBtn();
    // await inventory_SalesReturn.clickDeleteBtn();
  });
});
