const { test } = require('../../fixtures/base');
const { readData } = require('../../utils/readExcelData');
const { Sales } = require('../../pages/Sales');

const data = readData('Sales');

data.forEach((row, rowIndex) => {
  const [user, pass, name, phone, date, ebidta, cmpName, strt, strt2, website, room, occrate, pos, ref, desc, qty] = row;

  test(`Verify Sales - ${name} (#${rowIndex + 1})`, async ({ page }) => {
    const sales = new Sales(page);

    // await sales.enterUsername(user, pass);
    await sales.clickMenu();
    await sales.clickSalesMenuBtn();
    await sales.clickCreateBtn();
    await sales.ClickSalesDetailsBtn(name, phone, date, ebidta, cmpName, strt, strt2, website, room, occrate, pos, ref, desc);
    await sales.clickCreateSurvey();
    await sales.clickCreateQuotation(qty);
    // await sales.clickQuotationBtn();
    await sales.clickDelete();
  });
});
