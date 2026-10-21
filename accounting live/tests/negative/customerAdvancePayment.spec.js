const { test } = require('../../fixtures/base');
const { readData } = require('../../utils/readExcelData');
const { CustomerAdvancePayment } = require('../../pages/CustomerAdvancePayment');

const data = readData('CustomerAdvancePayment', 'negative');

data.forEach((row, rowIndex) => {
  const [
    user,
    pass,
    CustomerName,
    amt,
    advanceDate,
    checkNo,
    bankName,
    note,
    internalNotes,
    memoNote,
    revisionDate,
  ] = row;

  test(`Verify CustomerAdvancePayment - ${CustomerName} (#${rowIndex + 1})`, async ({ page }) => {
    const customerAdvancePaymentPage = new CustomerAdvancePayment(page);

    await customerAdvancePaymentPage.loginIfNeeded(user, pass);
    await customerAdvancePaymentPage.click_Menu();
    await customerAdvancePaymentPage.click_financialAccountingMenuBtn();
    await customerAdvancePaymentPage.click_CreateBtn();
    await customerAdvancePaymentPage.click_CustomerSelect(CustomerName);
    // await customerAdvancePaymentPage.click_BankDetails(amt);
    await customerAdvancePaymentPage.click_BankDetailsNegative(amt);
    // await customerAdvancePaymentPage.click_CustomerDetails(advanceDate, checkNo, bankName);
    await customerAdvancePaymentPage.click_CustomerDetailsNegative(advanceDate, checkNo, bankName);
    await customerAdvancePaymentPage.entered_Notes(note, internalNotes, memoNote, revisionDate);
    // await customerAdvancePaymentPage.confirmBtn();
    await customerAdvancePaymentPage.confirmBtnNegative();
    // await customerAdvancePaymentPage.saveBtn();
    // await customerAdvancePaymentPage.click_GetTheDetails();
    // await customerAdvancePaymentPage.actionBtn();
  });
});
