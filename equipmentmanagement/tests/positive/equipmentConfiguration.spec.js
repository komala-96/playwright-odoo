const { test } = require('../../fixtures/base');
const { readData } = require('../../utils/readExcelData');
const { EquipmentConfiguration } = require('../../pages/EquipmentConfiguration');

const data = readData('EquipmentConfiguration');

data.forEach((row, rowIndex) => {
  const [user, pass, TypeName, equipmentName, modelName_Name, modelNoName] = row;

  test(`Verify EquipmentConfiguration (#${rowIndex + 1})`, async ({ page }) => {
    const equipmentConfiguration = new EquipmentConfiguration(page);

    await equipmentConfiguration.enterUsername(user);
    await equipmentConfiguration.enterPassword(pass);
    await equipmentConfiguration.clickLoginButton();
    await equipmentConfiguration.clickMenu();
    await equipmentConfiguration.equipmentMenu();
    // await equipmentConfiguration.equipmentTypeOption(TypeName);
    // await equipmentConfiguration.equipmentNameOption(equipmentName);
    // await equipmentConfiguration.equipmentModelOption(modelName_Name);
    await equipmentConfiguration.equipmentModelNumberOption(modelNoName);
  });
});
