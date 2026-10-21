const { test } = require('../../fixtures/base');
const { readData } = require('../../utils/readExcelData');
const { Inv_Binlocation } = require('../../pages/Inv_Binlocation');

const data = readData('Inv_Binlocation');

data.forEach((row, rowIndex) => {
  const [user, pass, name, pallet, height, asile, descr] = row;

  test(`Verify ProductQuantityAdjustments - ${name} (#${rowIndex + 1})`, async ({ page }) => {
    const inv_Binlocation = new Inv_Binlocation(page);

    await inv_Binlocation.loginIfNeeded(user, pass);
    // await inv_Binlocation.clickMenuButton();
    await inv_Binlocation.clickInventoryMenuButton();
    await inv_Binlocation.clickInventoryBinlocationMenuButton();
    await inv_Binlocation.clickCreateButton();
    await inv_Binlocation.clickLocationButton(name, pallet, height, asile, descr);
    await inv_Binlocation.clickInventoryBinlocationDeleteButton();
  });
});
