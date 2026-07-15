const { test } = require('../../fixtures/base');
const { readData } = require('../../utils/readExcelData');
const { TagsConfigPage } = require('../../pages/TagsConfigPage');

const data = readData('TagsConfig');

data.forEach((row, rowIndex) => {
  const [user, pass, name] = row;

  test(`Verify TagsConfig - ${name} (#${rowIndex + 1})`, async ({ page }) => {
    const tagsConfigPage = new TagsConfigPage(page);

    // await tagsConfigPage.enterUsername(user, pass);
    await tagsConfigPage.clickMenu();
    await tagsConfigPage.clickSalesMenuBtn();
    await tagsConfigPage.clickNew();
    await tagsConfigPage.createSalesTeam(name);
  });
});
