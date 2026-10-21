const { test } = require('../../fixtures/base');
const { readData } = require('../../utils/readExcelData');
const { Inv_ProductCatalogue } = require('../../pages/Inv_ProductCatalogue');

const data = readData('Inv_ProductCatalogue', 'negative');

data.forEach((row, rowIndex) => {
  const [user, pass, name, amt, qty, qty1, finalAmt] = row;

  test(`Verify Inv_ProductCatalogue - ${name} (#${rowIndex + 1})`, async ({ page }) => {
    const inv_ProductCatalogue = new Inv_ProductCatalogue(page);

    await inv_ProductCatalogue.loginIfNeeded(user, pass);
    // await inv_ProductCatalogue.clickMenuButton();
    await inv_ProductCatalogue.clickInventoryMenuButton();
    await inv_ProductCatalogue.clickProductCatalogueMenuButton();
    await inv_ProductCatalogue.clickCreateButton();
    await inv_ProductCatalogue.clickCatalogueCreateNegative(name);
    await inv_ProductCatalogue.clickPriceUpdateNegative(amt, qty, qty1);
    await inv_ProductCatalogue.clickUpdatePriceNegative(finalAmt);
    await inv_ProductCatalogue.clickDelete();
  });
});
