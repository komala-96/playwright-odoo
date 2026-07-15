const { test } = require('../../fixtures/base');
const { readData } = require('../../utils/readExcelData');
const { EquipmentManagementPage } = require('../../pages/EquipmentManagementPage');

// EquipmentManagementPage.xlsx only has a 'positive' sheet (matching the
// Java ReadExcelData, which always hardcoded reading "positive" regardless
// of test class), so the negative suite reads the same sheet.
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
    await equipmentManagementPage.clickEditBtn();
  });
});
