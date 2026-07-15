const { test } = require('../../fixtures/base');
const { readData } = require('../../utils/readExcelData');
const { Leads } = require('../../pages/Leads');

const data = readData('Leads', 'negative');

data.forEach((row, rowIndex) => {
  const [user, pass, name, phone, date, ebidta, cmpName, zip, strt, strt2, website, room, occrate, pos, ref, desc, lname, mail] = row;

  test(`Verify Leads - ${name} (#${rowIndex + 1})`, async ({ page }) => {
    const leads = new Leads(page);

    // await leads.enterUsername(user, pass);
    await leads.clickMenu();
    await leads.clickSalesMenuBtn();
    await leads.clickCreateBtn();
    await leads.CreateBtnNegative(name, phone, date, ebidta, cmpName, zip, strt, strt2, website, room, occrate, pos, ref, desc, lname, mail);
    // await leads.clickDelete();
  });
});
