const { test } = require('../../fixtures/base');
const { readData } = require('../../utils/readExcelData');
const { EquipmentModelNo } = require('../../pages/EquipmentModelNo');

const data = readData('EquipmentModelNo');

data.forEach((row, rowIndex) => {
  const [user, pass, date, fromTime, toTime] = row;

  test(`Verify EquipmentModelNo (#${rowIndex + 1})`, async ({ page }) => {
    const equipmentModelNo = new EquipmentModelNo(page);

    await equipmentModelNo.enterUsername(user, pass);
    await equipmentModelNo.clickMenu();
    await equipmentModelNo.clickServiceMenuBtn();
    await equipmentModelNo.clickCreateBtn();
  });
});
