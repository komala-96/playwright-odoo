const { test } = require('../../fixtures/base');
const { readData } = require('../../utils/readExcelData');
const { Inventory_Material_Issue } = require('../../pages/Inventory_Material_Issue');

const data = readData('Inventory_Material_Issue', 'negative');

data.forEach((row, rowIndex) => {
  const [user, pass, vendorName, reason, entQTY] = row;

  test(`Verify Inventory_Material_Issue - ${vendorName} (#${rowIndex + 1})`, async ({ page }) => {
    const inventoryMaterialIssuePage = new Inventory_Material_Issue(page);

    await inventoryMaterialIssuePage.loginIfNeeded(user, pass);
    await inventoryMaterialIssuePage.clickMainMenu();
    await inventoryMaterialIssuePage.clickInventoryMenu();
    await inventoryMaterialIssuePage.clickMaterialIssueType();
    await inventoryMaterialIssuePage.clickVendorName(vendorName);
    // await inventoryMaterialIssuePage.clickPoTRN();
    await inventoryMaterialIssuePage.clickBillTRN();
    await inventoryMaterialIssuePage.clickEmployeeNegative();
    await inventoryMaterialIssuePage.clickReturnReason(reason);
    await inventoryMaterialIssuePage.clickProductIssueQtyNegative(entQTY);
    await inventoryMaterialIssuePage.clickSubmitBtnNegative();
    // await inventoryMaterialIssuePage.clickSaveBtn();
    // await inventoryMaterialIssuePage.clickGetTheDetails();
    // await inventoryMaterialIssuePage.clickDebitMemo();
    // await inventoryMaterialIssuePage.clickDelete();
  });
});
