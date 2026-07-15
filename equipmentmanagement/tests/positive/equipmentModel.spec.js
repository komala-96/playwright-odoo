const { test } = require('../../fixtures/base');
const { readData } = require('../../utils/readExcelData');
const { EquipmentModel } = require('../../pages/EquipmentModel');

const data = readData('EquipmentModel');

data.forEach((row, rowIndex) => {
  const [user, pass, date, fromTime, toTime] = row;

  test(`Verify EquipmentModel (#${rowIndex + 1})`, async ({ page }) => {
    const equipmentModel = new EquipmentModel(page);

    await equipmentModel.enterUsername(user, pass);
    await equipmentModel.clickMenu();
    await equipmentModel.clickServiceMenuBtn();
    await equipmentModel.clickCreateBtn();
  });
});
