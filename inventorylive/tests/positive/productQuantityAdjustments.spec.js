const { test } = require('../../fixtures/base');
const { readData } = require('../../utils/readExcelData');
const { productQuantityAdjustments } = require('../../pages/productQuantityAdjustments');

const data = readData('productQuantityAdjustments');

data.forEach((row, rowIndex) => {
  const [user, pass, refNo, productName, entQTY] = row;

  test(`Verify ProductQuantityAdjustments - ${refNo} (#${rowIndex + 1})`, async ({ page }) => {
    const productQuantityAdjustmentsPage = new productQuantityAdjustments(page);

    await productQuantityAdjustmentsPage.loginIfNeeded(user, pass);
    // await productQuantityAdjustmentsPage.clickMenuButton();
    await productQuantityAdjustmentsPage.clickInventoryMenuButton();
    await productQuantityAdjustmentsPage.clickInventoryAdjustmentMenuButton();
    await productQuantityAdjustmentsPage.clickCreateButton();
    await productQuantityAdjustmentsPage.clickLocationUpdate();
    await productQuantityAdjustmentsPage.clickQuantityAdjustments(refNo);
    await productQuantityAdjustmentsPage.clickProducts(productName);
    await productQuantityAdjustmentsPage.clickProductCount(entQTY);
    await productQuantityAdjustmentsPage.clickValidateInventoryBtn();
    // await productQuantityAdjustmentsPage.clickSaveBtn();
    await productQuantityAdjustmentsPage.clickDuplicateBtn();
  });
});
