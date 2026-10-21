const { test } = require('../../fixtures/base');
const { readData } = require('../../utils/readExcelData');
const { PurchaseBillAndRegisterPayment } = require('../../pages/PurchaseBillAndRegisterPayment');

const data = readData('PurchaseBillAndRegisterPayment');

data.forEach((row, rowIndex) => {
  const [user, pass, vendorName, productName, entQTY, cost, tax, discount, entZipcode, entStreet, entZipcode1, entStreet1, checkno, Amt] = row;

  test(`Verify PurchaseBillAndRegisterPayment - ${vendorName} (#${rowIndex + 1})`, async ({ page }) => {
    const purchaseBillAndRegisterPayment = new PurchaseBillAndRegisterPayment(page);

    await purchaseBillAndRegisterPayment.loginIfNeeded(user, pass);
    // purchaseBillAndRegisterPayment.click_Menu()
    await purchaseBillAndRegisterPayment.click_PucrahseBillMenuBtn();
    await purchaseBillAndRegisterPayment.clickPurchaseOrder(vendorName);
    await purchaseBillAndRegisterPayment.clickPurchaseOrder_Manager();
    await purchaseBillAndRegisterPayment.clickPurchaseOrder_Poducts(productName);
    await purchaseBillAndRegisterPayment.clickPurchaseOrder_ProductADD(entQTY, cost, tax, discount);
    await purchaseBillAndRegisterPayment.clickPurchaseOrder_Address(entZipcode, entStreet, entZipcode1, entStreet1);
    await purchaseBillAndRegisterPayment.clickSavebtn();
    // purchaseBillAndRegisterPayment.CostNegativeValue_SaveBtn();
    await purchaseBillAndRegisterPayment.getTheTotal();
    await purchaseBillAndRegisterPayment.clickReceivebtn();
    await purchaseBillAndRegisterPayment.registerPaymentBtn();
    await purchaseBillAndRegisterPayment.entered_checkNo(checkno);
    await purchaseBillAndRegisterPayment.entered_amount(Amt);
    // purchaseBillAndRegisterPayment.selectALLCheckBox()
    // purchaseBillAndRegisterPayment.get_unappliedAmount()
    await purchaseBillAndRegisterPayment.handleUnappliedMessageAndSave();
  });
});
