const { test } = require('../../fixtures/base');
const { readData } = require('../../utils/readExcelData');
const { FrontDeskDiscount } = require('../../pages/FrontDeskDiscount');

const data = readData('frontDeskDiscount', 'negative');

data.forEach((row, rowIndex) => {
  const [user, pass, name, discount, fName, lName, emailId, employee] = row;

  test(`Verify OtherPaymentMethod - ${name} (#${rowIndex + 1})`, async ({ page }) => {
    const frontDeskDiscount = new FrontDeskDiscount(page);

    await frontDeskDiscount.loginIfNeeded(user, pass);

    await frontDeskDiscount.clickMeansButton();
    await frontDeskDiscount.CreatePaymentMethod();
    await frontDeskDiscount.CreateDiscountNegative(name, discount, fName, lName, emailId, employee);
    // await frontDeskDiscount.ClickDiscontinueProducts();
    // await frontDeskDiscount.CreateDiscontinue();
  });
});
