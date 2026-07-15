const { test } = require('../../fixtures/base');
const { readData } = require('../../utils/readExcelData');
const { BillRecurringPage } = require('../../pages/BillRecurringPage');

const data = readData('BillRecurring');

data.forEach((row, rowIndex) => {
  const [user, pass, name, days, time] = row;

  test(`Verify BillRecurring - ${name} (#${rowIndex + 1})`, async ({ page }) => {
    const billRecurringPage = new BillRecurringPage(page);

    // await billRecurringPage.enterUsername(user, pass);
    await billRecurringPage.clickMenu();
    await billRecurringPage.clickSalesMenuBtn();
    await billRecurringPage.clickCreateBtn();
    await billRecurringPage.clickCreateRecurringBtn(name, days, time);
  });
});
