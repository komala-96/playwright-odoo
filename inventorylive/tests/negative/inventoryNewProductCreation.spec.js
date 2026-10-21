const { test } = require('../../fixtures/base');
const { readData } = require('../../utils/readExcelData');
const { InventoryNewProductCreation } = require('../../pages/InventoryNewProductCreation');

const data = readData('InventoryNewProductCreation', 'negative');

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

  test(`Verify NewProductCreation - ${prodctName} (#${rowIndex + 1})`, async ({ page }) => {
    const inventoryNewProductCreation = new InventoryNewProductCreation(page);

    await inventoryNewProductCreation.loginIfNeeded(user, pass);
    // await inventoryNewProductCreation.clickMenuButton();
    await inventoryNewProductCreation.clickInventoryMenuButton();
    await inventoryNewProductCreation.clickCreateButton();
    await inventoryNewProductCreation.CreateProductDetailsNegative(prodctName, code, upc, sku, id);
    await inventoryNewProductCreation.CreateSalesPriceDetailsNegative(LstPrice1, LstPrice2, LstPrice3, updatecost, upc);
    await inventoryNewProductCreation.UoM_clickNegative(boxqty, boxprice1, boxprice2, boxprice3, caseqty, caseprice1, caseprice2, caseprice3);
    await inventoryNewProductCreation.CreateLogisticsDetails(vlme1, manftre, wght1, mpn);
    await inventoryNewProductCreation.clickTaxDetailsnegative(fluid, contAmount, provId);
    await inventoryNewProductCreation.saveBtn_clickNegative();
    // await inventoryNewProductCreation.clickDelete();
    // await inventoryNewProductCreation.UnitofMeasure_Negative();
    // await inventoryNewProductCreation.clickMenu1();
    // await inventoryNewProductCreation.clickPurchaseMenu();
    // await inventoryNewProductCreation.clickProduct_Each_Select(PurchaseSearch);
    // await inventoryNewProductCreation.clickProduct_Box_Select(PurchaseBoxSearch);
    // await inventoryNewProductCreation.clickProduct_Case_Select(PurchaseCaseSearch);
    // await inventoryNewProductCreation.clickProduct_CostAndQty_Entered();
    // await inventoryNewProductCreation.clickSavebtn();
    // await inventoryNewProductCreation.clickGetTheTotalAmtInBill();
    // await inventoryNewProductCreation.clickPostBtn();
    // await inventoryNewProductCreation.clickMenu2();
    // await inventoryNewProductCreation.clickReportMenu(productChangeSearch);
    // await inventoryNewProductCreation.EnterProductDateDetailsAndGenerate(reportDate);
    // await inventoryNewProductCreation.click_Generate();
    // await inventoryNewProductCreation.clickReportHomePageMenu(productMasterSearch);
  });
});
