const { test } = require('../../fixtures/base');
const { readData } = require('../../utils/readExcelData');
const { ReportRecurringPage } = require('../../pages/ReportRecurringPage');

const data = readData('ReportRecurring');

data.forEach((row, rowIndex) => {
  const [user, pass, name, days, time] = row;

  test(`Verify ReportRecurring - ${name} (#${rowIndex + 1})`, async ({ page }) => {
    const reportRecurringPage = new ReportRecurringPage(page);

    // await reportRecurringPage.enterUsername(user, pass);
    await reportRecurringPage.clickMenu();
    await reportRecurringPage.clickSalesMenuBtn();
    await reportRecurringPage.clickCreateBtn();
    await reportRecurringPage.clickCreateRecurringBtn(name, days, time);
  });
});
