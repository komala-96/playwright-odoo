const { test } = require('../../fixtures/base');
const { readData } = require('../../utils/readExcelData');
const { VendorAdvancePayment } = require('../../pages/VendorAdvancePayment');

const data = readData('VendorAdvancePayment', 'negative');

data.forEach((row, rowIndex) => {
  const [user, pass, vendorName, amt, checkNum, note, internalNotes, memoNote, revisionDate] = row;

  test(`Verify VendorAdvancePayment - ${vendorName} (#${rowIndex + 1})`, async ({ page }) => {
    const vendorAdvancePaymentPage = new VendorAdvancePayment(page);

    await vendorAdvancePaymentPage.loginIfNeeded(user, pass);
    // await vendorAdvancePaymentPage.click_Menu();
    await vendorAdvancePaymentPage.click_financialAccountingMenuBtn();
    await vendorAdvancePaymentPage.click_VendorName(vendorName);
    await vendorAdvancePaymentPage.click_BankDetailsNegative(amt, checkNum);
    await vendorAdvancePaymentPage.entered_Notes(note, internalNotes, memoNote, revisionDate);
    await vendorAdvancePaymentPage.click_confirmBtnNegative();
    // await vendorAdvancePaymentPage.saveBtn();
    // await vendorAdvancePaymentPage.AdvanceTRN();
    // await vendorAdvancePaymentPage.actionBtn();
  });
});
