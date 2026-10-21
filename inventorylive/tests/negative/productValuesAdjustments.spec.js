const { test } = require('../../fixtures/base');
const { readData } = require('../../utils/readExcelData');
const { productValuesAdjustments } = require('../../pages/productValuesAdjustments');

const data = readData('ProductValuesAdjustments', 'negative');

data.forEach((row, rowIndex) => {
  const [user, pass, refNo, productName, cost] = row;

  test(`Verify ProductValuesAdjustments - ${productName} (#${rowIndex + 1})`, async ({ page }) => {
    const productValuesAdjustmentsPage = new productValuesAdjustments(page);

    await productValuesAdjustmentsPage.loginIfNeeded(user, pass);
    // await productValuesAdjustmentsPage.clickMenuButton();
    await productValuesAdjustmentsPage.clickInventoryMenuButton();
    await productValuesAdjustmentsPage.clickInventoryAdjustmentMenuButton();
    await productValuesAdjustmentsPage.clickCreateButton();
    await productValuesAdjustmentsPage.clickQuantityAdjustments(refNo);
    await productValuesAdjustmentsPage.clickProducts(productName);
    await productValuesAdjustmentsPage.clickProductCostNegative(cost);
    await productValuesAdjustmentsPage.clickValidateInventoryBtnNegative();
    // await productValuesAdjustmentsPage.clickSaveBtn();
  });
});
