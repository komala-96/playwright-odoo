const { test } = require('../../fixtures/base');
const { readData } = require('../../utils/readExcelData');
const { OtherPaymentMethodsPage } = require('../../pages/OtherPaymentMethodsPage');

const data = readData('otherPaymentMethods');

data.forEach((row, rowIndex) => {
  const [user, pass, nicName, creLimit, fName, lName, emailId] = row;

  test(`Verify OtherPaymentMethod - ${nicName} (#${rowIndex + 1})`, async ({ page }) => {
    const otherPaymentMethodsPage = new OtherPaymentMethodsPage(page);

    await otherPaymentMethodsPage.loginIfNeeded(user, pass);
    await otherPaymentMethodsPage.clickMeansButton();
    await otherPaymentMethodsPage.clickPaymentButton();
    // await otherPaymentMethodsPage.paymentdeleteDetails();
    await otherPaymentMethodsPage.CreatePaymentMethod(nicName, creLimit);
    await otherPaymentMethodsPage.createAppUserDetails(fName, lName, emailId);
    await otherPaymentMethodsPage.deleteDetails();
  });
});
