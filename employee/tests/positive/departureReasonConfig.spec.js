const { test } = require('../../fixtures/base');
const { readData } = require('../../utils/readExcelData');
const { DepartureReasonConfigPage } = require('../../pages/DepartureReasonConfigPage');

const data = readData('DepartureReasonConfig');

data.forEach((row, rowIndex) => {
  const [user, pass, name] = row;

  test(`Verify DepartureReasonConfig - ${name} (#${rowIndex + 1})`, async ({ page }) => {
    const departureReasonConfigPage = new DepartureReasonConfigPage(page);

    // await departureReasonConfigPage.enterUsername(user, pass);
    await departureReasonConfigPage.clickMenu();
    await departureReasonConfigPage.clickSalesMenuBtn();
    await departureReasonConfigPage.clickNew();
    await departureReasonConfigPage.createSalesTeam(name);
  });
});
