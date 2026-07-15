const { test } = require('../../fixtures/base');
const { readData } = require('../../utils/readExcelData');
const { ActivityPlanConfigPage } = require('../../pages/ActivityPlanConfigPage');

const data = readData('ActivityPlanConfig');

data.forEach((row, rowIndex) => {
  const [user, pass, name] = row;

  test(`Verify ActivityPlanConfig - ${name} (#${rowIndex + 1})`, async ({ page }) => {
    const activityPlanConfigPage = new ActivityPlanConfigPage(page);

    // await activityPlanConfigPage.enterUsername(user, pass);
    await activityPlanConfigPage.clickMenu();
    await activityPlanConfigPage.clickSalesMenuBtn();
    await activityPlanConfigPage.clickNew();
    await activityPlanConfigPage.createSalesTeam(name);
  });
});
