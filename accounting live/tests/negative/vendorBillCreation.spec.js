const { test } = require('../../fixtures/base');
const { readData } = require('../../utils/readExcelData');
const { VendorBillCreationPage } = require('../../pages/VendorBillCreationPage');

const data = readData('VendorBillCreationPage', 'negative');

data.forEach((row, rowIndex) => {
  const [
    user,
    pass,
    vendorName,
    productName,
    qty,
    price,
    shipping,
    insurance,
    discount,
    checkNo,
    amount,
  ] = row;

  test(`Verify VendorBillCreationPage - ${vendorName} (#${rowIndex + 1})`, async ({ page }) => {
    const vendorBillCreationPage = new VendorBillCreationPage(page);

    await vendorBillCreationPage.loginIfNeeded(user, pass);
    // await vendorBillCreationPage.clickMenuButton();
    await vendorBillCreationPage.clickAccountActions();
    await vendorBillCreationPage.clickVendorCreation(vendorName);
    await vendorBillCreationPage.click_Poducts(productName);
    // await vendorBillCreationPage.clickProductQty(qty, price);
    await vendorBillCreationPage.clickProductQtyNegative(qty, price);
    // await vendorBillCreationPage.clickTaxUpdate(shipping, insurance, discount);
    await vendorBillCreationPage.clickTaxUpdateNegative(shipping, insurance, discount);
    await vendorBillCreationPage.clickOtherInfo();
    await vendorBillCreationPage.clickPostbtn();
    await vendorBillCreationPage.getTheTotal();
    // await vendorBillCreationPage.clickfinalBtn();
    await vendorBillCreationPage.clickVendorName();
    await vendorBillCreationPage.clickPrintButton();
    await vendorBillCreationPage.clickRegisterPaymentBtn();
    await vendorBillCreationPage.clickModeOfPayment();
    // await vendorBillCreationPage.clickCheckNo(checkNo);
    // await vendorBillCreationPage.clickAmount(amount);
    await vendorBillCreationPage.clickCheckNoNegative(checkNo);
    await vendorBillCreationPage.clickAmountNegative(amount);
    await vendorBillCreationPage.clickDepositTo();
    await vendorBillCreationPage.clickInvoiceCheckBox();
    await vendorBillCreationPage.saveBtn();
    // await vendorBillCreationPage.Get_The_Receipt_No();
  });
});
