const { test } = require('../../fixtures/testFixtures');
const { readExcelRows } = require('../../utils/excelReader');
const { MultiplePicklist } = require('../../pages/MultiplePicklist');

// Ported from src/main/java/positivetestcases/VerifyMultiplePicklist.java
// excelFileName: MultiplePicklist (positive sheet)

const rows = readExcelRows('MultiplePicklist');

for (const [i, row] of rows.entries()) {
  const [user, pass, qty] = row;

  test(`VerifyMultiplePicklist - row ${i + 1}`, async ({ page }) => {
    const multiplePicklist = new MultiplePicklist(page);

    await multiplePicklist.loginIfNeeded(user, pass);
    // await multiplePicklist.clickMenu();
    await multiplePicklist.clickCustomerMenu();
    await multiplePicklist.clickDeliveryMenu();
    await multiplePicklist.clickCheckBox();
    await multiplePicklist.clickDeliveryCheckBox(qty);
    // await multiplePicklist.clickOrderMenu();
    // await multiplePicklist.clickCustomerSelect();
    // await multiplePicklist.clickGetTheInvoiceAmount();
    // await multiplePicklist.clickInvoiceNo();
  });
}
