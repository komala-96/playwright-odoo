const { test } = require('../../fixtures/base');
const { readData } = require('../../utils/readExcelData');
const { Equipment } = require('../../pages/Equipment');

const data = readData('Equipment', 'negative');

data.forEach((row, rowIndex) => {
  const [user, pass, srno, assno, man, dist, prValue, date, quan, text, recTxt] = row;

  test(`Verify Equipment (#${rowIndex + 1})`, async ({ page }) => {
    const equipment = new Equipment(page);

    // await equipment.enterUsername(user, pass);
    // await equipment.clickMenu();
    await equipment.clickSalesMenuBtn();
    await equipment.clickCreateBtn();
    await equipment.clickCreateCaseBtnNegative(srno, assno, man, dist, prValue, date, quan, text, recTxt);
    // await equipment.clickEditBtn(srno);
  });
});
