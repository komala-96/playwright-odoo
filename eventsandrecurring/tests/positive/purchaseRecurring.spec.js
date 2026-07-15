const { test } = require('../../fixtures/base');
const { readData } = require('../../utils/readExcelData');
const { PurchaseRecurringPage } = require('../../pages/PurchaseRecurringPage');

const data = readData('PurchaseRecurring');

data.forEach((row, rowIndex) => {
  const [user, pass, name, days, time] = row;

  test(`Verify PurchaseRecurring - ${name} (#${rowIndex + 1})`, async ({ page }) => {
    const purchaseRecurringPage = new PurchaseRecurringPage(page);

    // await purchaseRecurringPage.enterUsername(user, pass);
    await purchaseRecurringPage.clickMenu();
    await purchaseRecurringPage.clickSalesMenuBtn();
    await purchaseRecurringPage.clickCreateBtn();
    await purchaseRecurringPage.clickCreateRecurringBtn(name, days, time);
  });
});
