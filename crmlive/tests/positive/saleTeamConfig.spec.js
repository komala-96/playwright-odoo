const { test } = require('../../fixtures/base');
const { readData } = require('../../utils/readExcelData');
const { SaleTeamConfig } = require('../../pages/SaleTeamConfig');

const data = readData('SaleTeamConfig');

data.forEach((row, rowIndex) => {
  const [user, pass, name] = row;

  test(`Verify SaleTeamConfig - ${name} (#${rowIndex + 1})`, async ({ page }) => {
    const saleTeamConfig = new SaleTeamConfig(page);

    // await saleTeamConfig.enterUsername(user, pass);
    await saleTeamConfig.clickMenu();
    await saleTeamConfig.clickSalesMenuBtn();
    await saleTeamConfig.clickNew();
    await saleTeamConfig.createSalesTeam(name);
  });
});
