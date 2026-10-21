const { test } = require('../../fixtures/testFixtures');
const { readExcelRows } = require('../../utils/excelReader');
const { CustomerDelivery } = require('../../pages/CustomerDelivery');

// Ported from src/main/java/positivetestcases/VerifyCustomerDelivery.java
// excelFileName: CustomerDelivery (positive sheet)

const rows = readExcelRows('CustomerDelivery');

for (const [i, row] of rows.entries()) {
  const [user, pass, customer, date, date1] = row;

  test(`VerifyCustomerDelivery - row ${i + 1}`, async ({ page }) => {
    const customerDelivery = new CustomerDelivery(page);

    await customerDelivery.loginIfNeeded(user, pass);
    // await customerDelivery.click_Menu();
    await customerDelivery.click_CustomerCareBtn();
    await customerDelivery.click_DeliveryBtn(date, date1);
    await customerDelivery.click_DeliveryStatusHistory();
  });
}
