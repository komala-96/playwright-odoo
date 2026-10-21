const { test } = require('../../fixtures/base');
const { readData } = require('../../utils/readExcelData');
const { Opportunity } = require('../../pages/Opportunity');

const data = readData('Opportunity');

data.forEach((row, rowIndex) => {
  const [user, pass, name, rev, mail, phone] = row;

  test(`Verify Opportunity - ${name} (#${rowIndex + 1})`, async ({ page }) => {
    const opportunity = new Opportunity(page);

    // await opportunity.enterUsername(user, pass);
    await opportunity.clickMenu();
    await opportunity.clickSalesMenuBtn();
    await opportunity.clickCreateBtn();
    await opportunity.CreateBtn(name, rev, mail, phone);
    await opportunity.clickQuickAddBtn(name, rev, mail, phone);
  });
});
