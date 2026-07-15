const { test } = require('../../fixtures/base');
const { readData } = require('../../utils/readExcelData');
const { SurveysPage } = require('../../pages/SurveysPage');

const data = readData('Surveys');

data.forEach((row, rowIndex) => {
  const [user, pass, code, first, last, title, mbl, phn, pLimit, mail, ltn] = row;

  test(`Verify Surveys - ${first} ${last} (#${rowIndex + 1})`, async ({ page }) => {
    const surveysPage = new SurveysPage(page);

    // await surveysPage.enterUsername(user, pass);
    await surveysPage.clickMenu();
    await surveysPage.enterSurveys(code, first, last, title, mbl, phn, pLimit, mail, ltn);
  });
});
