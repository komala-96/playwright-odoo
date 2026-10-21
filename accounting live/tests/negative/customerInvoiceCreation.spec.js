const { test } = require('../../fixtures/base');
const { readData } = require('../../utils/readExcelData');
const { CustomerInvoiceCreationPage } = require('../../pages/CustomerInvoiceCreationPage');

const data = readData('CustomerInvoiceCreationPage', 'negative');

data.forEach((row, rowIndex) => {
  const [
    user,
    pass,
    customerName,
    street,
    street2,
    zip,
    productName,
    qty,
    price,
    shipping,
    tax,
    insuranceAmt,
    discount,
    checkNo,
    amount,
  ] = row;

  test(`Verify CustomerInvoiceCreationPage - ${customerName} (#${rowIndex + 1})`, async ({ page }) => {
    const customerInvoiceCreationPage = new CustomerInvoiceCreationPage(page);

    await customerInvoiceCreationPage.loginIfNeeded(user, pass);
    // await customerInvoiceCreationPage.clickMenuButton();
    await customerInvoiceCreationPage.ClickFinancialAcctMenu();
    await customerInvoiceCreationPage.ClickInvoiceMenu();
    await customerInvoiceCreationPage.clickCustomerName(customerName);
    await customerInvoiceCreationPage.clickCustomer_PONumber();
    await customerInvoiceCreationPage.clickAddressMenu(street, street2, zip);
    await customerInvoiceCreationPage.clickDeliveryNotes();
    await customerInvoiceCreationPage.clickInvoiceLinesMenu();
    await customerInvoiceCreationPage.click_associated_product();
    // await customerInvoiceCreationPage.click_productSelect(productName);
    await customerInvoiceCreationPage.clickService_Products();
    // await customerInvoiceCreationPage.updateProductQuantities(qty, price);
    await customerInvoiceCreationPage.updateProductQuantitiesNegative(qty, price);
    // await customerInvoiceCreationPage.clickTaxUpdate(shipping, tax, insuranceAmt, discount);
    await customerInvoiceCreationPage.clickTaxUpdateNegative(shipping, tax, insuranceAmt, discount);
    await customerInvoiceCreationPage.clickPostbtn();
    // await customerInvoiceCreationPage.clickSendAndPrintEMail();
    await customerInvoiceCreationPage.getTheTotal();
    // await customerInvoiceCreationPage.clickSaveButton();
    await customerInvoiceCreationPage.clickInvoiceDetails();
    await customerInvoiceCreationPage.clickPrintButton();
    await customerInvoiceCreationPage.clickRegisterPaymentBtn();
    await customerInvoiceCreationPage.clickModeOfPayment();
    // await customerInvoiceCreationPage.clickCheckNo(checkNo);
    await customerInvoiceCreationPage.clickCheckNoNegative(checkNo);
    // await customerInvoiceCreationPage.clickAmount(amount);
    await customerInvoiceCreationPage.clickAmountNegative(amount);
    await customerInvoiceCreationPage.clickDepositTo();
    await customerInvoiceCreationPage.clickInvoiceCheckBox();
    await customerInvoiceCreationPage.saveBtn();
    // await customerInvoiceCreationPage.Get_The_Receipt_No();
  });
});
