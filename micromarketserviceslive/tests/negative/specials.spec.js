const { test } = require('../../fixtures/base');
const { readData } = require('../../utils/readExcelData');
const { SpecialsPage } = require('../../pages/SpecialsPage');

const data = readData('specialsPage', 'negative');

data.forEach((row, rowIndex) => {
  const [user, pass, sDate, eDate, sTime, sStop, dis, nTitle, bText, discount] = row;

  test(`Verify Specials - ${nTitle} (#${rowIndex + 1})`, async ({ page }) => {
    const specialsPage = new SpecialsPage(page);

    await specialsPage.loginIfNeeded(user, pass);
    await specialsPage.clickMeansButton();
    await specialsPage.specialsMenu();
    await specialsPage.creationSpecialsDetailsNegative(sDate, eDate, sTime, sStop, dis, nTitle, bText);
    await specialsPage.clickSpecialsCustomerDetails(bText);
    await specialsPage.clickSpecialsProductDetailsNegative(discount);
    await specialsPage.clickSaveBtn();
    // await specialsPage.clickImageADD();
  });
});
