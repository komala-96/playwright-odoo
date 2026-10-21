const { test } = require('../../fixtures/base');
const { readData } = require('../../utils/readExcelData');
const { ScheduleTech } = require('../../pages/ScheduleTech');

const data = readData('ScheduleTech');

data.forEach((row, rowIndex) => {
  const [user, pass, date, fromTime, toTime] = row;

  test(`Verify ScheduleTech (#${rowIndex + 1})`, async ({ page }) => {
    const scheduleTech = new ScheduleTech(page);

    // await scheduleTech.enterUsername(user, pass);
    // await scheduleTech.clickMenu();
    await scheduleTech.clickServiceMenuBtn();
    await scheduleTech.clickCreateBtn();
    await scheduleTech.clickTechPersonBtn(date, fromTime, toTime);
  });
});
