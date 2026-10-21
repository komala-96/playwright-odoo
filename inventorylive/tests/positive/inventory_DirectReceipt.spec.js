const { test } = require('../../fixtures/base');
const { readData } = require('../../utils/readExcelData');
const { Inventory_DirectReceipt } = require('../../pages/Inventory_DirectReceipt');

const data = readData('Inventory_DirectReceipt');

data.forEach((row, rowIndex) => {
  const [user, pass, customerName, qty, cost] = row;

  test(`Verify Inventory_DirectReceipt - ${customerName} (#${rowIndex + 1})`, async ({ page }) => {
    const inventory_DirectReceipt = new Inventory_DirectReceipt(page);

    await inventory_DirectReceipt.loginIfNeeded(user, pass);
    await inventory_DirectReceipt.clickMainMenu();
    await inventory_DirectReceipt.clickInventoryMenu();
    await inventory_DirectReceipt.clickDirectReceiptCreate(customerName);
    await inventory_DirectReceipt.clickDirectReceiptLocation();
    await inventory_DirectReceipt.clickReturnProduct();
    await inventory_DirectReceipt.clickReturn_Qty(qty, cost);
    // Negative -Scenario
    // await inventory_DirectReceipt.clickReturn_Qty_Negative(price, cost, qty);
    await inventory_DirectReceipt.clickSaveBtn();
    // await inventory_DirectReceipt.clickSalesReturnNumber();
    // await inventory_DirectReceipt.clickMainMenu2();
    // await inventory_DirectReceipt.clickFinancialAccountMenu();
    // await inventory_DirectReceipt.clickCreditMemo_CreateBtn();
    // await inventory_DirectReceipt.clickCreditMemo_CustomerSelect(CcustomerName);
    // await inventory_DirectReceipt.clickCreditMemoPostBtn();
    // await inventory_DirectReceipt.clickCreditMemoSaveBtn();
    // await inventory_DirectReceipt.clickCreditMemo_MaterialReceiptText();
    // await inventory_DirectReceipt.clickCreditMemoGetTheText();
  });
});
