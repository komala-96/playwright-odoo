const { test } = require('../../fixtures/base');
const { readData } = require('../../utils/readExcelData');
const { LostReasonConfig } = require('../../pages/LostReasonConfig');

const data = readData('LostReasonConfig');

data.forEach((row, rowIndex) => {
  const [user, pass, name] = row;

  test(`Verify LostReasonConfig - ${name} (#${rowIndex + 1})`, async ({ page }) => {
    const lostReasonConfig = new LostReasonConfig(page);

    // await lostReasonConfig.enterUsername(user, pass);
    await lostReasonConfig.clickMenu();
    await lostReasonConfig.clickSalesMenuBtn();
    await lostReasonConfig.clickNew();
    await lostReasonConfig.createLostReason(name);
  });
});
