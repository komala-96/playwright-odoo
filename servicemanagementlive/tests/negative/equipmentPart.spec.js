const { test } = require('../../fixtures/base');
const { readData } = require('../../utils/readExcelData');
const { EquipmentPart } = require('../../pages/EquipmentPart');

const data = readData('EquipmentPart', 'negative');

data.forEach((row, rowIndex) => {
  const [user, pass, name, price, price1] = row;

  test(`Verify EquipmentPart (#${rowIndex + 1})`, async ({ page }) => {
    const equipmentPart = new EquipmentPart(page);

    // await equipmentPart.enterUsername(user, pass);
    // await equipmentPart.clickMenu();
    await equipmentPart.clickServiceMenuBtn();
    await equipmentPart.clickCreateBtn();
    await equipmentPart.clickCreateEquipmentPartsBtnNegative(name, price1, price1);
    // await equipmentPart.traceability();
    // await equipmentPart.putawayRules();
  });
});
