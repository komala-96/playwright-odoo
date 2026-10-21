const { test } = require('../../fixtures/base');
const { readData } = require('../../utils/readExcelData');
const { MicroMarketCreationPage } = require('../../pages/MicroMarketCreationPage');

const data = readData('MicroMarketCreationPage');

data.forEach((row, rowIndex) => {
  const [
    user,
    pass,
    locationname,
    locationstore,
    customerName,
    zipAdd,
    strt,
    tax,
    id,
    date,
    name,
    mail,
    productName,
    cost,
    minQty,
    maxQty,
  ] = row;

  test(`Verify MicroMarketCreationPage - ${locationname} (#${rowIndex + 1})`, async ({ page }) => {
    const microMarketCreationPage = new MicroMarketCreationPage(page);

    await microMarketCreationPage.loginIfNeeded(user, pass);
    // await microMarketCreationPage.clickMeansButton();
    await microMarketCreationPage.clickMicromarketMenuButton();
    await microMarketCreationPage.createLocationDetails(locationname, locationstore, customerName, zipAdd, strt, tax);
    // await microMarketCreationPage.generalInfo(id, date, name, mail);
    await microMarketCreationPage.clickProductSelection(productName);
    await microMarketCreationPage.cilckAddProduct();
    await microMarketCreationPage.clickQuantity(cost, minQty, maxQty);
    await microMarketCreationPage.saveDetails();
    // await microMarketCreationPage.otherDetails();
    // await microMarketCreationPage.receiveOrder();
  });
});
