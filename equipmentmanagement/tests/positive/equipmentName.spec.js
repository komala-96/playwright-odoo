const { test } = require('../../fixtures/base');
const { readData } = require('../../utils/readExcelData');
const { EquipmentName } = require('../../pages/EquipmentName');

const data = readData('EquipmentName');

data.forEach((row, rowIndex) => {
  const [user, pass, date, fromTime, toTime] = row;

  test(`Verify EquipmentName (#${rowIndex + 1})`, async ({ page }) => {
    const equipmentName = new EquipmentName(page);

    await equipmentName.enterUsername(user, pass);
    await equipmentName.clickMenu();
    await equipmentName.clickServiceMenuBtn();
    await equipmentName.clickCreateBtn();
  });
});
