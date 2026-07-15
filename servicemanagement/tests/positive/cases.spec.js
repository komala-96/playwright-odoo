const { test } = require('../../fixtures/base');
const { readData } = require('../../utils/readExcelData');
const { Cases } = require('../../pages/Cases');

const data = readData('Cases');

data.forEach((row, rowIndex) => {
  const [user, pass, phn, mail, descr, comm, quan] = row;

  test(`Verify Cases (#${rowIndex + 1})`, async ({ page }) => {
    const cases = new Cases(page);

    // await cases.enterUsername(user, pass);
    // await cases.clickMenu();
    await cases.clickSalesMenuBtn();
    await cases.clickCreateBtn();
    await cases.clickCreateCaseBtn(phn, mail, descr, comm, quan);
    await cases.clickOtherCaseBtn(phn, mail, descr, comm, quan);
  });
});
