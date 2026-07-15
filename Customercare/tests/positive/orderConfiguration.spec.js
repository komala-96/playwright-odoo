const { test } = require('../../fixtures/testFixtures');
const { readExcelRows } = require('../../utils/excelReader');
const { OrderConfiguration } = require('../../pages/OrderConfiguration');

// Ported from src/main/java/positivetestcases/VerifyOrderConfiguration.java
// excelFileName: OrderConfiguration (positive sheet)

for (const [i, row] of readExcelRows('OrderConfiguration').entries()) {
  const [
    user,
    pass,
    cusName,
    cusNickName,
    id,
    parentNme,
    primaryLName,
    primaryLimit,
    cusZip,
    custStreet,
    custStreet2,
    cusEmail,
    custPhone,
    custMobile,
    rouName,
    creLimit,
    customerSAP,
    vendorSAP,
    cust1,
    cust2,
    cust3,
    subCus,
    purOrder,
    contName,
    contZip,
    contStreet,
    contEmail,
    contPhone,
    proName,
    proUserName,
    proEmail,
    product1,
    product2,
    Price,
    customer,
  ] = row;

  test(`VerifyOrderConfiguration - row ${i + 1}`, async ({ page }) => {
    const orderConfiguration = new OrderConfiguration(page);

    await orderConfiguration.loginIfNeeded(user, pass);
    await orderConfiguration.click_CustomerCareBtn();
    await orderConfiguration.CreateOrderConfiguration();
    await orderConfiguration.click_ParentTypeBtn();
    await orderConfiguration.customer_Name(cusName, cusNickName, id);
    // await orderConfiguration.parent_Name(parentNme);
    await orderConfiguration.primaryAccounts_Manager_Creation(primaryLName, primaryLimit);
    await orderConfiguration.customer_Type(cusZip, custStreet, custStreet2);
    // await orderConfiguration.customer_TypeNegative(cusZip, custStreet, custStreet2);
    await orderConfiguration.customer_Contacts(cusEmail, custPhone, custMobile);
    // await orderConfiguration.route_Creation(rouName);
    await orderConfiguration.terms_Creation(creLimit);
    await orderConfiguration.SAPCustomerDetail(customerSAP, vendorSAP, cust1, cust2, cust3);
    await orderConfiguration.charge_Check(subCus, purOrder);
    await orderConfiguration.finalSaveBtn();
    // await orderConfiguration.CustomerMenu();
    // await orderConfiguration.finalSaveBtnNegative();
    // await orderConfiguration.CustomerMenuNegative();
    // await orderConfiguration.CustomerMenuSearch(customer);
  });
}
