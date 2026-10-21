const { test } = require('../../fixtures/base');
const { readData } = require('../../utils/readExcelData');
const { EmailNotification } = require('../../pages/EmailNotification');

const data = readData('EmailNotification', 'Sheet1');

data.forEach((row, rowIndex) => {
  const [user, pass, nicName, creLimit, fName, lName, emailId] = row;

  test(`Verify EmailNotification - ${nicName} (#${rowIndex + 1})`, async ({ page }) => {
    const emailNotification = new EmailNotification(page);

    await emailNotification.loginIfNeeded(user, pass);
    await emailNotification.clickMeansButton();
    await emailNotification.clickEmailNotification();
    await emailNotification.deleteDetails();
  });
});
