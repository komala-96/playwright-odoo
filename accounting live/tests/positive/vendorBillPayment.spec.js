const { test } = require('../../fixtures/base');
const { readData } = require('../../utils/readExcelData');
const { VendorBillPayment } = require('../../pages/VendorBillPayment');

const data = readData('VendorBillPayment');

data.forEach((row, rowIndex) => {
  const [user, pass, vendorName, checkNum, bankname, amt] = row;

  test(`Verify VendorBillPayment - ${vendorName} (#${rowIndex + 1})`, async ({ page }) => {
    const vendorBillPaymentPage = new VendorBillPayment(page);

    await vendorBillPaymentPage.loginIfNeeded(user, pass);
    // await vendorBillPaymentPage.click_Menu();
    await vendorBillPaymentPage.click_financialAccountingMenuBtn();
    await vendorBillPaymentPage.click_Creation(vendorName);
    await vendorBillPaymentPage.click_BankDetails(checkNum, bankname, amt);
    await vendorBillPaymentPage.click_GetThePaidDetails();
    await vendorBillPaymentPage.saveBtn();
    // await vendorBillPaymentPage.click_TheDetails();
    await vendorBillPaymentPage.click_Print();
    await vendorBillPaymentPage.clickModeOfPayment1(vendorName, amt);
  });
});
