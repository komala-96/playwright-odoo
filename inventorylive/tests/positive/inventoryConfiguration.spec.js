const { test } = require('../../fixtures/base');
const { readData } = require('../../utils/readExcelData');
const { InventoryConfiguration } = require('../../pages/InventoryConfiguration');

const data = readData('InventoryConfiguration');

data.forEach((row, rowIndex) => {
  const [
    user,
    pass,
    prodctName,
    code,
    upc,
    sku,
    id,
    LstPrice1,
    LstPrice2,
    LstPrice3,
    updatecost,
    boxqty,
    boxprice1,
    boxprice2,
    boxprice3,
    caseqty,
    caseprice1,
    caseprice2,
    caseprice3,
    vlme1,
    manftre,
    wght1,
    mpn,
    fluid,
    contAmount,
    provId,
    PurchaseSearch,
    PurchaseBoxSearch,
    PurchaseCaseSearch,
    productChangeSearch,
    reportDate,
    productMasterSearch,
  ] = row;

  test(`Verify InventoryConfiguration - ${prodctName} (#${rowIndex + 1})`, async ({ page }) => {
    const inventoryConfigurationPage = new InventoryConfiguration(page);

    await inventoryConfigurationPage.loginIfNeeded(user, pass);
    // await inventoryConfigurationPage.clickMenuButton();
    await inventoryConfigurationPage.clickInventoryMenuButton();
   // await inventoryConfigurationPage.clickUPC();
    await inventoryConfigurationPage.clickUomCategories();
    await inventoryConfigurationPage.clickUomType();
    await inventoryConfigurationPage.clickRoute();
  });
});
