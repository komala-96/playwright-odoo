const { test } = require('../../fixtures/base');
const { readData } = require('../../utils/readExcelData');
const { UpdateLocation } = require('../../pages/UpdateLocation');

const data = readData('UpdateLocation', 'negative');

data.forEach((row, rowIndex) => {
  const [user, pass] = row;

  test(`Verify UpdateLocation - ${user} (#${rowIndex + 1})`, async ({ page }) => {
    const updateLocation = new UpdateLocation(page);

    await updateLocation.loginIfNeeded(user, pass);
    // await updateLocation.click_Menu();
    await updateLocation.click_MicroMarketServices_Menu();
    await updateLocation.click_UpdateLocation_Menu();
    await updateLocation.click_customer_Selection();
    await updateLocation.click_microMarket_Selection();
    await updateLocation.click_productCategory_Selection();
    await updateLocation.click_getProductListBtn();
    // await updateLocation.getProductList_Details();
  });
});
