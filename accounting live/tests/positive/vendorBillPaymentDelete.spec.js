const { test } = require('../../fixtures/base');
const { readData } = require('../../utils/readExcelData');
const { VendorBillPaymentDelete } = require('../../pages/VendorBillPaymentDelete');

const data = readData('VendorBillPaymentDelete');

data.forEach((row, rowIndex) => {
  const [user, pass, vendorName, checkNum, bankname, amt] = row;

  test(`Verify VendorBillPaymentDelete - ${vendorName} (#${rowIndex + 1})`, async ({ page }) => {
    const vendorBillPaymentDelete = new VendorBillPaymentDelete(page);

    await vendorBillPaymentDelete.loginIfNeeded(user, pass);
    // await vendorBillPaymentDelete.click_Menu();
    await vendorBillPaymentDelete.click_financialAccountingMenuBtn();
    await vendorBillPaymentDelete.click_Creation(vendorName);
    await vendorBillPaymentDelete.click_BankDetails(checkNum, bankname, amt);
    await vendorBillPaymentDelete.click_GetThePaidDetails(checkNum, bankname, amt);
    // await vendorBillPaymentDelete.saveBtn();
    // await vendorBillPaymentDelete.click_TheDetails();
    await vendorBillPaymentDelete.click_Print();
    await vendorBillPaymentDelete.clickModeOfPayment1(vendorName);
  });
});
