const { test } = require('../../fixtures/testFixtures');
const { readExcelRows } = require('../../utils/excelReader');
const { CustomerSaleOrder } = require('../../pages/CustomerSaleOrder');

// Ported from src/main/java/negativetestcases/VerifyCustomerSaleOrder.java
// excelFileName: CustomerSaleOrder. NOTE: the Java ReadExcelData always read the
// "positive" sheet even from negative test classes; preserved here for parity.

const rows = readExcelRows('CustomerSaleOrder');

for (const [i, row] of rows.entries()) {
  const [user, pass, cusName, qty, price, ship, ins, dis] = row;

  test(`VerifyCustomerSaleOrder negative - row ${i + 1}`, async ({ page }) => {
    const customerSaleOrder = new CustomerSaleOrder(page);

    await customerSaleOrder.loginIfNeeded(user, pass);
    // await customerSaleOrder.clickMenu();
    await customerSaleOrder.clickCustomerMenu();
    await customerSaleOrder.clickOrdersPage(cusName);
    await customerSaleOrder.clickCustomer_Details(cusName);
    await customerSaleOrder.clickCustomer_Products();
    await customerSaleOrder.clickCustomer_AddProducts();
    await customerSaleOrder.clickService_Products();
    // await customerSaleOrder.clickQuantity(qty,price);
    await customerSaleOrder.clickQuantityNegative(qty, price);
    await customerSaleOrder.clickCustomer_Address();
    await customerSaleOrder.clickCustomer_OtherInfo();
    // await customerSaleOrder.clickTaxUpdate(ship, ins, dis);
    await customerSaleOrder.clickTaxUpdateNegative(ship, ins, dis);
    // await customerSaleOrder.clickSavebtn();
    await customerSaleOrder.clickSavebtnNegative();
    // await customerSaleOrder.clickGetTheSaleOrderAmount();
    // await customerSaleOrder.clickSalesOrderNo();
    // await customerSaleOrder.clickCancelAndDelete();
  });
}
