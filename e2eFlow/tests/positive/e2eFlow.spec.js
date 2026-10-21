const { test, expect } = require('../../fixtures/base');
const { readData } = require('../../utils/readExcelData');
const fieldNames = require('../../data/fieldNames');

const { InventoryConfiguration } = require('../../pages/InventoryConfiguration');

const [dataRow] = readData('E2ERegression');
const d = Object.fromEntries(fieldNames.map((name, i) => [name, dataRow[i]]));
const { Username: user, Password: pass } = d;

test.describe.serial('E2E Flow', () => {
  test('Step 01 - Login', async ({ page }) => {
    const inventoryConfig = new InventoryConfiguration(page);
    await inventoryConfig.loginIfNeeded(user, pass);
  });
});
