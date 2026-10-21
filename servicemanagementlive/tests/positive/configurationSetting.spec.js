const { test } = require('../../fixtures/base');
const { readData } = require('../../utils/readExcelData');
const { ConfigurationSetting } = require('../../pages/ConfigurationSetting');

const data = readData('ConfigurationSetting');

data.forEach((row, rowIndex) => {
  const [user, pass, date, fromTime, toTime] = row;

  test(`Verify ConfigurationSetting (#${rowIndex + 1})`, async ({ page }) => {
    const configurationSetting = new ConfigurationSetting(page);

    // await configurationSetting.enterUsername(user, pass);
    await configurationSetting.clickMenu();
    await configurationSetting.clickServiceMenuBtn();
    await configurationSetting.clickCreateBtn();
    await configurationSetting.clickCaseType();
  });
});
