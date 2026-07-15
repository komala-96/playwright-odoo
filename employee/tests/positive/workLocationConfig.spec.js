const { test } = require('../../fixtures/base');
const { readData } = require('../../utils/readExcelData');
const { WorkLocationConfigPage } = require('../../pages/WorkLocationConfigPage');

const data = readData('WorkLocationConfig');

data.forEach((row, rowIndex) => {
  const [user, pass, name] = row;

  test(`Verify WorkLocationConfig - ${name} (#${rowIndex + 1})`, async ({ page }) => {
    const workLocationConfigPage = new WorkLocationConfigPage(page);

    // await workLocationConfigPage.enterUsername(user, pass);
    await workLocationConfigPage.clickMenu();
    await workLocationConfigPage.clickSalesMenuBtn();
    await workLocationConfigPage.clickNew();
    await workLocationConfigPage.createSalesTeam(name);
    await workLocationConfigPage.clickWorkSchedule();
  });
});
