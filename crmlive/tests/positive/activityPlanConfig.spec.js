const { test } = require('../../fixtures/base');
const { readData } = require('../../utils/readExcelData');
const { ActivityPlanConfig } = require('../../pages/ActivityPlanConfig');

const data = readData('ActivityPlanConfig');

data.forEach((row, rowIndex) => {
  const [user, pass, name] = row;

  test(`Verify ActivityPlanConfig - ${name} (#${rowIndex + 1})`, async ({ page }) => {
    const activityPlanConfig = new ActivityPlanConfig(page);

    // await activityPlanConfig.enterUsername(user, pass);
    await activityPlanConfig.clickMenu();
    await activityPlanConfig.clickSalesMenuBtn();
    await activityPlanConfig.clickNew();
    await activityPlanConfig.createSalesTeam(name);
  });
});
