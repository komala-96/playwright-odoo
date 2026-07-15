const { test } = require('../../fixtures/base');
const { readData } = require('../../utils/readExcelData');
const { PurchaseBill } = require('../../pages/PurchaseBill');

const data = readData('PurchaseBill');

data.forEach((row, rowIndex) => {
  const [user, pass, vendorName, productName, qty, shipping, insurance, discount, checkNo, amount] = row;

  test(`Verify PurchaseBill - ${vendorName} (#${rowIndex + 1})`, async ({ page }) => {
    const purchaseBill = new PurchaseBill(page);

    console.log(page);

    await purchaseBill.loginIfNeeded(user, pass);
    // .click_Menu()
    await purchaseBill.click_PucrahseBillMenuBtn();
    await purchaseBill.clickVendorCreation(vendorName);
    await purchaseBill.click_Poducts(productName);
    await purchaseBill.clickProductQty(qty);
    // .clickTaxUpdate(shipping, insurance, discount)
    await purchaseBill.clickOtherInfo();
    await purchaseBill.clickPostbtn();
    await purchaseBill.getTheTotal();
    // .clickfinalBtn()
    await purchaseBill.clickVendorName();
    await purchaseBill.clickPrintButton();
    await purchaseBill.clickRegisterPaymentBtn();
    await purchaseBill.clickModeOfPayment();
    await purchaseBill.clickCheckNo(checkNo);
    await purchaseBill.clickAmount(amount);
    await purchaseBill.clickDepositTo();
   // await purchaseBill.clickInvoiceCheckBox();
    await purchaseBill.saveBtnAction();
    await purchaseBill.Get_The_Receipt_No();
  });
});
