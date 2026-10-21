const { test } = require('../../fixtures/base');
const { readData } = require('../../utils/readExcelData');
const { MicroMarketServices_FeaturedProducts } = require('../../pages/MicroMarketServices_FeaturedProducts');

const data = readData('MicroMarketServices_FeaturedProducts', 'Sheet1');

data.forEach((row, rowIndex) => {
  const [user, pass] = row;

  test(`Verify MicroMarketServices_FeaturedProducts - ${user} (#${rowIndex + 1})`, async ({ page }) => {
    const microMarketServices_FeaturedProductsPage = new MicroMarketServices_FeaturedProducts(page);

    await microMarketServices_FeaturedProductsPage.loginIfNeeded(user, pass);
    await microMarketServices_FeaturedProductsPage.click_Menu();
    await microMarketServices_FeaturedProductsPage.microMarketServicesMenu();
    await microMarketServices_FeaturedProductsPage.TableCheckBox();
  });
});
