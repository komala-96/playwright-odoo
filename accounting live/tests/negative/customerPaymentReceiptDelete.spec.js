const { test } = require('../../fixtures/base');
const { readData } = require('../../utils/readExcelData');
const { CustomerPaymentReceiptDelete } = require('../../pages/CustomerPaymentReceiptDelete');

const data = readData('CustomerPaymentReceiptDelete', 'negative');

data.forEach((row, rowIndex) => {
  const [user, pass, cusName, amt] = row;

  test(`Verify FinancialAccountingPaymentReceiptDelete - ${cusName} (#${rowIndex + 1})`, async ({ page }) => {
    const customerPaymentReceiptDelete = new CustomerPaymentReceiptDelete(page);

    await customerPaymentReceiptDelete.loginIfNeeded(user, pass);
    // await customerPaymentReceiptDelete.click_Menu();
    await customerPaymentReceiptDelete.click_FinancialAccountingMenuBtn();

    await customerPaymentReceiptDelete.click_CustomerName(cusName);
    await customerPaymentReceiptDelete.clickModeOfPayment();
    await customerPaymentReceiptDelete.click_Invoice();
    // await customerPaymentReceiptDelete.click_Amount(amt);
    // await customerPaymentReceiptDelete.click_Deposit_To();
    await customerPaymentReceiptDelete.click_AmountNegative(amt);
    await customerPaymentReceiptDelete.click_Deposit_ToNegative();
    await customerPaymentReceiptDelete.click_CustomerBalance();
    await customerPaymentReceiptDelete.click_Advance_balance();
    // await customerPaymentReceiptDelete.saveBtn();
    await customerPaymentReceiptDelete.saveBtnNegative();
    // await customerPaymentReceiptDelete.Get_Invoice_Details();
    // await customerPaymentReceiptDelete.click_UnappliedAmount();
    await customerPaymentReceiptDelete.click_Print();
    await customerPaymentReceiptDelete.clickModeOfPayment1Negative(cusName, amt);
  });
});
