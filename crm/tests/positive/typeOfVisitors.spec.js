const { test } = require('../../fixtures/base');
const { readData } = require('../../utils/readExcelData');
const { TypeOfVisitors } = require('../../pages/TypeOfVisitors');

const data = readData('TypeOfVisitors');

data.forEach((row, rowIndex) => {
  const [user, pass, name] = row;

  test(`Verify TypeOfVisitors - ${name} (#${rowIndex + 1})`, async ({ page }) => {
    const typeOfVisitors = new TypeOfVisitors(page);

    // await typeOfVisitors.enterUsername(user, pass);
    await typeOfVisitors.clickMenu();
    await typeOfVisitors.clickSalesMenuBtn();
    await typeOfVisitors.clickNew();
    await typeOfVisitors.createLeadStatus(name);
  });
});
