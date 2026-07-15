const { test } = require('../../fixtures/base');
const { readData } = require('../../utils/readExcelData');
const { EventsPage } = require('../../pages/EventsPage');

const data = readData('Events');

data.forEach((row, rowIndex) => {
  const [user, pass, nam, date, end, tag, seat, name_1, sale_date, price, seat1] = row;

  test(`Verify Events - ${nam} (#${rowIndex + 1})`, async ({ page }) => {
    const eventsPage = new EventsPage(page);

    // await eventsPage.enterUsername(user, pass);
    // await eventsPage.clickMenu();
    await eventsPage.clickSalesMenuBtn();
    await eventsPage.clickCreateBtn();
    await eventsPage.clickCreateEventBtn(nam, date, end, tag, seat, name_1, sale_date, price, seat1);
  });
});
