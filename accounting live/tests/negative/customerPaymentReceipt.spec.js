const { test } = require('../../fixtures/base');
const { readData } = require('../../utils/readExcelData');
const { CustomerPaymentReceipt } = require('../../pages/CustomerPaymentReceipt');

const data = readData('CustomerPaymentReceipt', 'negative');

data.forEach((row, rowIndex) => {
  const [user, pass, cusName, cardNum, amt] = row;

  test(`Verify FinancialAccountingPaymentReceipt - ${cusName} (#${rowIndex + 1})`, async ({ page }) => {
    const customerPaymentReceipt = new CustomerPaymentReceipt(page);

    await customerPaymentReceipt.loginIfNeeded(user, pass);
    // await customerPaymentReceipt.click_Menu();
    await customerPaymentReceipt.click_FinancialAccountingMenuBtn();

    await customerPaymentReceipt.click_CustomerName(cusName);
    await customerPaymentReceipt.clickModeOfPayment();
    await customerPaymentReceipt.click_CardNoNegative(cardNum);
    // await customerPaymentReceipt.clickCardNo(cardNum);
    // await customerPaymentReceipt.click_Amount(amt);
    await customerPaymentReceipt.click_AmountNegative(amt);
    await customerPaymentReceipt.click_Deposit_To();
    await customerPaymentReceipt.click_CustomerBalance();
    await customerPaymentReceipt.click_Advance_balance();
    // await customerPaymentReceipt.saveBtn();
    await customerPaymentReceipt.saveBtnNegative();
    // await customerPaymentReceipt.Get_Invoice_Details();
    // await customerPaymentReceipt.click_UnappliedAmount();
    await customerPaymentReceipt.click_Print();
    // await customerPaymentReceipt.clickModeOfPayment1(cusName, amt);
    await customerPaymentReceipt.clickModeOfPayment1Negative(cusName, amt);
  });
});
