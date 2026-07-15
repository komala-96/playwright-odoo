const { test } = require('../../fixtures/base');
const { readData } = require('../../utils/readExcelData');
const { Configuration } = require('../../pages/Configuration');

const data = readData('Configuration');

data.forEach((row, rowIndex) => {
  const [user, pass, date, fromTime, toTime] = row;

  test(`Verify Configuration (#${rowIndex + 1})`, async ({ page }) => {
    const configuration = new Configuration(page);

    // await configuration.enterUsername(user, pass);
    await configuration.clickMenu();
    await configuration.clickServiceMenuBtn();
    await configuration.clickCreateBtn();
    await configuration.clickStagesMenuBtn();
  });
});
