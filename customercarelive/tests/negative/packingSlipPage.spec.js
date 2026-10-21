const { test } = require('../../fixtures/testFixtures');
const { readExcelRows } = require('../../utils/excelReader');
const { PackingSlipPage } = require('../../pages/PackingSlipPage');

// Ported from src/main/java/negativetestcases/VerifyPackingSlipPage.java
// excelFileName: PackingSlipPage. NOTE: the Java ReadExcelData always read the
// "positive" sheet even from negative test classes; preserved here for parity.

const rows = readExcelRows('PackingSlipPage');

for (const [i, row] of rows.entries()) {
  const [user, pass, cusName, qty] = row;

  test(`VerifyPackingSlipPage negative - row ${i + 1}`, async ({ page }) => {
    const packingSlipPage = new PackingSlipPage(page);

    await packingSlipPage.loginIfNeeded(user, pass);
    // await packingSlipPage.clickMenu();
    await packingSlipPage.clickCustomerMenu();
    await packingSlipPage.clickPackingSlipPage();
    // await packingSlipPage.clickCheckBox();
    await packingSlipPage.clickCheckBoxNegative(qty);
  });
}
