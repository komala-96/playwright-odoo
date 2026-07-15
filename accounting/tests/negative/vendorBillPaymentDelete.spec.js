const { test } = require('../../fixtures/base');
const { readData } = require('../../utils/readExcelData');
const { VendorBillPaymentDelete } = require('../../pages/VendorBillPaymentDelete');

const data = readData('VendorBillPaymentDelete', 'negative');

data.forEach((row, rowIndex) => {
  const [user, pass, vendorName, checkNum, bankname, amt] = row;

  test(`Verify VendorBillPaymentDelete - ${vendorName} (#${rowIndex + 1})`, async ({ page }) => {
    const vendorBillPaymentDelete = new VendorBillPaymentDelete(page);

    await vendorBillPaymentDelete.loginIfNeeded(user, pass);
    // await vendorBillPaymentDelete.click_Menu();
    await vendorBillPaymentDelete.click_financialAccountingMenuBtn();
    await vendorBillPaymentDelete.click_Creation(vendorName);
    await vendorBillPaymentDelete.click_BankDetailsNegative(checkNum, bankname, amt);
    await vendorBillPaymentDelete.click_GetThePaidDetails(checkNum, bankname, amt);
    await vendorBillPaymentDelete.saveBtnNegative();
    // await vendorBillPaymentDelete.click_TheDetails();
    await vendorBillPaymentDelete.click_Print();
    await vendorBillPaymentDelete.clickModeOfPayment1Negative(vendorName, amt);
  });
});
