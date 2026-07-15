const { test } = require('../../fixtures/base');
const { readData } = require('../../utils/readExcelData');
const { EmploymentTypeConfigPage } = require('../../pages/EmploymentTypeConfigPage');

const data = readData('EmploymentTypeConfig');

data.forEach((row, rowIndex) => {
  const [user, pass, name] = row;

  test(`Verify EmploymentTypeConfig - ${name} (#${rowIndex + 1})`, async ({ page }) => {
    const employmentTypeConfigPage = new EmploymentTypeConfigPage(page);

    // await employmentTypeConfigPage.enterUsername(user, pass);
    await employmentTypeConfigPage.clickMenu();
    await employmentTypeConfigPage.clickSalesMenuBtn();
    await employmentTypeConfigPage.clickNew();
    await employmentTypeConfigPage.createSalesTeam(name);
  });
});
