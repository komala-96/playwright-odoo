const { test } = require('../../fixtures/testFixtures');
const { readExcelRows } = require('../../utils/excelReader');
const { CustomerDelivery } = require('../../pages/CustomerDelivery');

// Ported from src/main/java/negativetestcases/VerifyCustomerDelivery.java
// excelFileName: CustomerDelivery. NOTE: the Java ReadExcelData always read the
// "positive" sheet even from negative test classes; preserved here for parity.
// Also note: the Java testName field for this class was actually
// "VerifyCustomerCareAddress" (a copy-paste typo that only affected an
// ExtentReports label), so a sensible title is used here instead.

const rows = readExcelRows('CustomerDelivery');

for (const [i, row] of rows.entries()) {
  const [user, pass, customer, date, date1] = row;

  test(`VerifyCustomerDelivery negative - row ${i + 1}`, async ({ page }) => {
    const customerDelivery = new CustomerDelivery(page);

    await customerDelivery.loginIfNeeded(user, pass);
    await customerDelivery.click_Menu();
    await customerDelivery.click_CustomerCareBtn();
    await customerDelivery.click_DeliveryBtn(date, date1);
    await customerDelivery.click_DeliveryStatusHistory();
  });
}
