const { test } = require('../../fixtures/base');
const { readData } = require('../../utils/readExcelData');
const { CustomerCreditMemo } = require('../../pages/CustomerCreditMemo');

const data = readData('CustomerCreditMemo', 'negative');

data.forEach((row, rowIndex) => {
  const [user, pass, CustomerName, shipping, insuranceAmt, discount, Amount] = row;

  test(`Verify CustomerCreditMemo - ${CustomerName} (#${rowIndex + 1})`, async ({ page }) => {
    const customerCreditMemo = new CustomerCreditMemo(page);

    await customerCreditMemo.loginIfNeeded(user, pass);
    await customerCreditMemo.click_Menu();
    await customerCreditMemo.click_financialAccountingMenuBtn();
    await customerCreditMemo.click_CreateBtn();
    // await customerCreditMemo.click_CustomerSelect(CustomerName, shipping, insuranceAmt, discount);
    await customerCreditMemo.click_CustomerSelectNegative(CustomerName, shipping, insuranceAmt, discount);
    // await customerCreditMemo.click_SaleDiscount(CustomerName, Amount);
    // await customerCreditMemo.click_SaleDiscountNegative(CustomerName, Amount);
    // await customerCreditMemo.click_Others(CustomerName, Amount);
    await customerCreditMemo.click_OthersNegative(CustomerName, Amount);
  });
});
