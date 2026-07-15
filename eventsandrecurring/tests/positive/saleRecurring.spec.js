const { test } = require('../../fixtures/base');
const { readData } = require('../../utils/readExcelData');
const { SaleRecurringPage } = require('../../pages/SaleRecurringPage');

const data = readData('SaleRecurring');

data.forEach((row, rowIndex) => {
  const [user, pass, name, days, time] = row;

  test(`Verify SaleRecurring - ${name} (#${rowIndex + 1})`, async ({ page }) => {
    const saleRecurringPage = new SaleRecurringPage(page);

    // await saleRecurringPage.enterUsername(user, pass);
    await saleRecurringPage.clickMenu();
    await saleRecurringPage.clickSalesMenuBtn();
    await saleRecurringPage.clickCreateBtn();
    await saleRecurringPage.clickCreateRecurringBtn(name, days, time);
  });
});
