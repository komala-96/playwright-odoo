const { test } = require('../../fixtures/testFixtures');
const { readExcelRows } = require('../../utils/excelReader');
const { SalesOrderAndRegisterPayment } = require('../../pages/SalesOrderAndRegisterPayment');

// Ported from src/main/java/positivetestcases/VerifySalesOrderAndRegisterPayment.java
// excelFileName: SalesOrderAndRegisterPayment (positive sheet)

const rows = readExcelRows('SalesOrderAndRegisterPayment');

for (const [i, row] of rows.entries()) {
  const [user, pass, cusName, qty, qty1, CheckNo, amt] = row;

  test(`VerifySalesOrderAndRegisterPayment - row ${i + 1}`, async ({ page }) => {
    const salesOrderAndRegisterPayment = new SalesOrderAndRegisterPayment(page);

    await salesOrderAndRegisterPayment.loginIfNeeded(user, pass);
    // await salesOrderAndRegisterPayment.clickMenu();
    await salesOrderAndRegisterPayment.clickCustomerMenu();
    await salesOrderAndRegisterPayment.clickOrdersPage();
    await salesOrderAndRegisterPayment.clickCustomer_Details(cusName);
    await salesOrderAndRegisterPayment.clickCustomer_Products();
    await salesOrderAndRegisterPayment.clickCustomer_AddZeroProducts();
    // await salesOrderAndRegisterPayment.clickSalesOrder_WithoutEnteringQty_SaveBtn();
    await salesOrderAndRegisterPayment.clickQuantity(qty);
    await salesOrderAndRegisterPayment.clickSavebtn();
    await salesOrderAndRegisterPayment.clickGetTheSaleOrderAmount();
    await salesOrderAndRegisterPayment.clickSalesOrderNo();
    await salesOrderAndRegisterPayment.clickDeliveryMenu();
    await salesOrderAndRegisterPayment.clickCheckBox();
    await salesOrderAndRegisterPayment.clickDeliveryCheckBox(qty1);
    await salesOrderAndRegisterPayment.clickOrderMenu();
    await salesOrderAndRegisterPayment.clickCustomerSelect();
    await salesOrderAndRegisterPayment.clickGetTheConfirmedSaleOrderAmount();
    await salesOrderAndRegisterPayment.clickConfirmedSalesOrderNo();
    await salesOrderAndRegisterPayment.clickInvoiceBtn();
    await salesOrderAndRegisterPayment.clickGetTheInvoiceAmount();
    await salesOrderAndRegisterPayment.clickInvoiceNo();
    await salesOrderAndRegisterPayment.compareSalesOrderAndInvoiceAmounts();
    await salesOrderAndRegisterPayment.clickRegisterPaymentBtn();
    await salesOrderAndRegisterPayment.clickModeOfPayment();
    await salesOrderAndRegisterPayment.clickCheckNo(CheckNo);
    await salesOrderAndRegisterPayment.clickAmount(amt);
    await salesOrderAndRegisterPayment.clickDepositTo();
    await salesOrderAndRegisterPayment.saveBtn();
    await salesOrderAndRegisterPayment.Get_The_Receipt_No();
    await salesOrderAndRegisterPayment.Get_The_Invoice_Details();
    await salesOrderAndRegisterPayment.unapplied_amount();
  });
}
