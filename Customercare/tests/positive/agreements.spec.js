const { test } = require('../../fixtures/testFixtures');
const { readExcelRows } = require('../../utils/excelReader');
const { Agreements } = require('../../pages/Agreements');

// Ported from src/main/java/positivetestcases/VerifyAgreements.java
// excelFileName: Agreements (positive sheet). testName: VerifyCustomerCareAgreements

const rows = readExcelRows('Agreements');

for (const [i, row] of rows.entries()) {
  const [user, pass, customer, date, date1] = row;

  test(`VerifyCustomerCareAgreements - row ${i + 1}`, async ({ page }) => {
    const agreements = new Agreements(page);

    await agreements.loginIfNeeded(user, pass);
    await agreements.click_CustomerCareBtn();
    await agreements.ProductADDMenu_CustomerCare(customer);
    await agreements.NewAgreement(date, date1);
    await agreements.RunningAgreement(date, date1);
  });
}
