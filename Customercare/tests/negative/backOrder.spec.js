const { test } = require('../../fixtures/testFixtures');
const { readExcelRows } = require('../../utils/excelReader');
const { BackOrderPage } = require('../../pages/BackOrderPage');

// Ported from src/main/java/negativetestcases/VerifyBackOrder.java
// excelFileName: BackOrder. NOTE: the Java ReadExcelData always read the
// "positive" sheet even from negative test classes; preserved here for parity.

const rows = readExcelRows('BackOrder');

for (const [i, row] of rows.entries()) {
  const [user, pass, cusName, qty, price, qty1, qty2] = row;

  test(`VerifyBackOrder negative - row ${i + 1}`, async ({ page }) => {
    const backOrderPage = new BackOrderPage(page);

    await backOrderPage.loginIfNeeded(user, pass);
    // await backOrderPage.clickMenu();
    await backOrderPage.clickCustomerMenu();
    await backOrderPage.clickOrdersPage();
    await backOrderPage.clickCustomer_Details(cusName);
    await backOrderPage.clickCustomer_Products();
    await backOrderPage.clickCustomer_AddProducts();
    // await backOrderPage.clickService_Products();
    await backOrderPage.clickQuantity(qty, price);
    // await backOrderPage.clickQuantityNegative(qty);
    await backOrderPage.clickCustomer_Address();
    await backOrderPage.clickCustomer_OtherInfo();
    await backOrderPage.clickSavebtn();
    // await backOrderPage.clickGetTheSaleOrderAmount();
    // await backOrderPage.clickSalesOrderNo();
    // await backOrderPage.clickGetTheTableDataforLabelNameChecking();
    await backOrderPage.clickDeliveryMenu();
    // positive - unabled this clickCheckBox
    await backOrderPage.clickCheckBox(qty1);
    // Negative - Unabled this clickNegativeCheckBox
    // await backOrderPage.clickNegativeCheckBox();
    // await backOrderPage.clickBackOrder(qty2);
    // await backOrderPage.clickBackOrderNegative(qty2);
    // await backOrderPage.clickBackOrder_updatePro(qty2);
    await backOrderPage.clickDelivery_Backorder();
    await backOrderPage.clickCheckBox_Backorder();
    await backOrderPage.clickDeliveryCheckBox();
    await backOrderPage.clickOrderMenu();
    await backOrderPage.clickCustomerSelect();
    await backOrderPage.clickConfirmedSalesOrderNo();
    await backOrderPage.clickActionMenu();
    await backOrderPage.clickInvoiceBtn();
    await backOrderPage.clickInvoicePrint();
  });
}
