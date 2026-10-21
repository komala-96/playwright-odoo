const { test } = require('../../fixtures/base');
const { readData } = require('../../utils/readExcelData');
const { SpecialsPage } = require('../../pages/SpecialsPage');

const data = readData('specialsPage');

data.forEach((row, rowIndex) => {
  const [user, pass, sDate, eDate, sTime, sStop, dis, nTitle, bText] = row;

  test(`Verify Specials - ${nTitle} (#${rowIndex + 1})`, async ({ page }) => {
    const specialsPage = new SpecialsPage(page);

    await specialsPage.loginIfNeeded(user, pass);
    await specialsPage.clickMeansButton();
    await specialsPage.specialsMenu();
    await specialsPage.creationSpecialsDetails(sDate, eDate, sTime, sStop, dis, nTitle, bText);
    await specialsPage.clickSpecialsCustomerDetails(bText);
    await specialsPage.clickSpecialsProductDetails(dis);
    // await specialsPage.clickSaveBtn();
    await specialsPage.clickImageADD();
  });
});
