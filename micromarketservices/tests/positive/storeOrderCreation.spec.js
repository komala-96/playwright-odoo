const { test } = require('../../fixtures/base');
const { readData } = require('../../utils/readExcelData');
const { StoreOrderCreationPage } = require('../../pages/StoreOrderCreationPage');

const data = readData('StoreOrderCreation');

data.forEach((row, rowIndex) => {
  const [user, pass, ordLimit] = row;

  test(`Verify StoreOrderCreation - ${ordLimit} (#${rowIndex + 1})`, async ({ page }) => {
    const storeOrderCreationPage = new StoreOrderCreationPage(page);

    await storeOrderCreationPage.loginIfNeeded(user, pass);
    // await storeOrderCreationPage.clickMenuButton();
    await storeOrderCreationPage.clickMicroMarketServiceMenuButton();
    await storeOrderCreationPage.clickStoreOrderCreation(ordLimit);
    await storeOrderCreationPage.ClickOrder_Quantity();
    // await storeOrderCreationPage.ClickOrder_QuantityNextPage();
    // await storeOrderCreationPage.ClickOrder_QuantityNextThirdPage();
    await storeOrderCreationPage.clickSaveBtn();
    await storeOrderCreationPage.clickApproveBtn();
    await storeOrderCreationPage.clickPickBtn();
    await storeOrderCreationPage.clickReceivedBtn();
    await storeOrderCreationPage.clickOtherDetails();
    await storeOrderCreationPage.clickPrintDetails();
    await storeOrderCreationPage.clickDuplicateDetails();
  });
});
