const { test } = require('../../fixtures/base');
const { readData } = require('../../utils/readExcelData');
const { InventoryServiceProductCreation } = require('../../pages/InventoryServiceProductCreation');

const data = readData('InventoryServiceProductCreation', 'negative');

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

  test(`Verify InventoryServiceProductCreation - ${prodctName} (#${rowIndex + 1})`, async ({ page }) => {
    const inventoryServiceProductCreation = new InventoryServiceProductCreation(page);

    await inventoryServiceProductCreation.loginIfNeeded(user, pass);
    // await inventoryServiceProductCreation.clickMenuButton();
    await inventoryServiceProductCreation.clickInventoryMenuButton();
    await inventoryServiceProductCreation.clickCreateButton();
    await inventoryServiceProductCreation.CreateProductDetailsNegative(prodctName, code, upc, sku, id);
    await inventoryServiceProductCreation.CreateSalesPriceDetailsNegative(
      LstPrice1,
      LstPrice2,
      LstPrice3,
      updatecost,
      upc
    );
    await inventoryServiceProductCreation.UoM_clickNegative(
      boxqty,
      boxprice1,
      boxprice2,
      boxprice3,
      caseqty,
      caseprice1,
      caseprice2,
      caseprice3
    );
    // await inventoryServiceProductCreation.CreateLogisticsDetails(vlme1, manftre, wght1, mpn);
    await inventoryServiceProductCreation.clickTaxDetailsNegative(fluid, contAmount, provId);
    await inventoryServiceProductCreation.saveBtn_clickNegative();
    // await inventoryServiceProductCreation.clickPriceList();
    // await inventoryServiceProductCreation.clickProductPrice();
  });
});
