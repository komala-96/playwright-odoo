const { test } = require('../../fixtures/base');
const { readData } = require('../../utils/readExcelData');
const { EquipmentManagementPage } = require('../../pages/EquipmentManagementPage');

const data = readData('EquipmentManagementPage');

data.forEach((row, rowIndex) => {
  const [user, pass] = row;

  test(`Verify EquipmentManagementPage (#${rowIndex + 1})`, async ({ page }) => {
    const equipmentManagementPage = new EquipmentManagementPage(page);

    await equipmentManagementPage.enterUsername(user);
    await equipmentManagementPage.enterPassword(pass);
    await equipmentManagementPage.clickLoginButton();
    // await equipmentManagementPage.clickMenu();
    await equipmentManagementPage.equipmentMenu();
    await equipmentManagementPage.equipmentMonthly();
    await equipmentManagementPage.equipmentYearly();
    // await equipmentManagementPage.clickEditBtn();
  });
});
