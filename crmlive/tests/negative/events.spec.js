const { test } = require('../../fixtures/base');
const { readData } = require('../../utils/readExcelData');
const { Events } = require('../../pages/Events');

const data = readData('Events', 'negative');

data.forEach((row, rowIndex) => {
  const [user, pass, name, date, dur, location, desc] = row;

  test(`Verify Events - ${name} (#${rowIndex + 1})`, async ({ page }) => {
    const events = new Events(page);

    // await events.enterUsername(user, pass);
    await events.clickMenu();
    await events.clickSalesMenuBtn();
    await events.clickCreateBtn();
    await events.clickCreateEventBtnNegative(name, date, dur, location, desc);
    // await events.clickDelete();
  });
});
