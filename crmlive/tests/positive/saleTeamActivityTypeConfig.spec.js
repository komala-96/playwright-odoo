const { test } = require('../../fixtures/base');
const { readData } = require('../../utils/readExcelData');
const { SaleTeamActivityTypeConfig } = require('../../pages/SaleTeamActivityTypeConfig');

const data = readData('SaleTeamActivityTypeConfig');

data.forEach((row, rowIndex) => {
  const [user, pass, name] = row;

  test(`Verify SaleTeamActivityTypeConfig - ${name} (#${rowIndex + 1})`, async ({ page }) => {
    const saleTeamActivityTypeConfig = new SaleTeamActivityTypeConfig(page);

    // await saleTeamActivityTypeConfig.enterUsername(user, pass);
    await saleTeamActivityTypeConfig.clickMenu();
    await saleTeamActivityTypeConfig.clickSalesMenuBtn();
    await saleTeamActivityTypeConfig.clickNew();
    await saleTeamActivityTypeConfig.createSalesTeam(name);
    await saleTeamActivityTypeConfig.createSalesTeam1(name);
  });
});
