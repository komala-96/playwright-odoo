const { test } = require('../../fixtures/testFixtures');
const { readExcelRows } = require('../../utils/excelReader');
const { SalesOrderPage } = require('../../pages/SalesOrderPage');

// Ported from src/main/java/negativetestcases/VerifySalesOrder.java
// excelFileName: SalesOrder. NOTE: the Java ReadExcelData always read the
// "positive" sheet even from negative test classes; preserved here for parity.

const rows = readExcelRows('SalesOrder');

for (const [i, row] of rows.entries()) {
  const [user, pass, cusName, qty, price, qty1, checkno, amt] = row;

  test(`VerifySalesOrder negative - row ${i + 1}`, async ({ page }) => {
    const salesOrderPage = new SalesOrderPage(page);

    await salesOrderPage.loginIfNeeded(user, pass);
    // await salesOrderPage.clickMenu();
    await salesOrderPage.clickCustomerMenu();
    await salesOrderPage.clickOrdersPage();
    await salesOrderPage.clickCustomer_Details(cusName);
    await salesOrderPage.clickCustomer_Products();
    await salesOrderPage.clickCustomer_AddProducts();
    // await salesOrderPage.clickService_Products();
    // await salesOrderPage.clickQuantity(qty,price);
    await salesOrderPage.clickQuantityNegative(qty, price);
    // await salesOrderPage.clickCustomer_Address();
    // await salesOrderPage.clickCustomer_OtherInfo();
    // await salesOrderPage.clickSavebtn();
    // await salesOrderPage.clickGetTheSaleOrderAmount();
    // await salesOrderPage.clickSalesOrderNo();
    // await salesOrderPage.clickGetTheTableDataforLabelNameChecking();
    // await salesOrderPage.clickDeliveryMenu();
    // positive - unabled this clickCheckBox
    // await salesOrderPage.clickCheckBox();
    // Negative - Unabled this clickNegativeCheckBox
    // await salesOrderPage.clickNegativeCheckBox();
    // await salesOrderPage.clickDeliveryCheckBox(qty1);
    // await salesOrderPage.clickOrderMenu();
    // await salesOrderPage.clickCustomerSelect();
    // await salesOrderPage.clickGetTheConfirmedSaleOrderAmount();
    // await salesOrderPage.clickConfirmedSalesOrderNo();
    // await salesOrderPage.clickActionMenu();
    // await salesOrderPage.clickInvoiceBtn();
    // await salesOrderPage.clickGetTheInvoiceAmount();
    // await salesOrderPage.clickInvoiceNo();
    // await salesOrderPage.compareSalesOrderAndInvoiceAmounts();
  });
}
