const { test } = require('../../fixtures/base');
const { readData } = require('../../utils/readExcelData');
const { DebitMemo } = require('../../pages/DebitMemo');

const data = readData('DebitMemo', 'negative');

data.forEach((row, rowIndex) => {
  const [user, pass, vendorName, shipping, tax, insuranceAmt, discount, amount] = row;

  test(`Verify DebitMemo - ${vendorName} (#${rowIndex + 1})`, async ({ page }) => {
    const debitMemoPage = new DebitMemo(page);

    await debitMemoPage.loginIfNeeded(user, pass);
    // await debitMemoPage.clickMenuButton();
    await debitMemoPage.clickFinancialAcctMenu();
    await debitMemoPage.clickDebitMemo();
    await debitMemoPage.clickVendorName(vendorName);
    await debitMemoPage.clickMaterial_Issue();
    // await debitMemoPage.clickTaxUpdate(shipping, tax, insuranceAmt, discount);
    await debitMemoPage.clickTaxUpdateNegative(shipping, tax, insuranceAmt, discount);
    await debitMemoPage.clickPostbtn();
    // await debitMemoPage.getTheTotal();
    // await debitMemoPage.clickSaveButton();
    await debitMemoPage.clickDemoMemoDetails();
    await debitMemoPage.click_PurchaseDiscountNegative(vendorName, amount);
    await debitMemoPage.click_OthersNegative(vendorName, amount);
  });
});
