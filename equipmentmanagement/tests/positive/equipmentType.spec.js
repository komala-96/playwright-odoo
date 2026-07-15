const { test } = require('../../fixtures/base');
const { readData } = require('../../utils/readExcelData');
const { EquipmentType } = require('../../pages/EquipmentType');

const data = readData('EquipmentType');

data.forEach((row, rowIndex) => {
  const [user, pass, date, fromTime, toTime] = row;

  test(`Verify EquipmentType (#${rowIndex + 1})`, async ({ page }) => {
    const equipmentType = new EquipmentType(page);

    await equipmentType.enterUsername(user, pass);
    await equipmentType.clickMenu();
    await equipmentType.clickServiceMenuBtn();
    await equipmentType.clickCreateBtn();
  });
});
