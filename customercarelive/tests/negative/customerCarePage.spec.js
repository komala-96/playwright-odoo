const { test } = require('../../fixtures/testFixtures');
const { readExcelRows } = require('../../utils/excelReader');
const { CustomerCarePage } = require('../../pages/CustomerCarePage');

// Ported from src/main/java/negativetestcases/VerifyCustomerCarePage.java
// excelFileName: customerCare. NOTE: the Java ReadExcelData always read the
// "positive" sheet even from negative test classes; preserved here for parity.

const rows = readExcelRows('customerCare');

for (const [i, row] of rows.entries()) {
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
  ] = row;

  test(`VerifyCustomerCarePage negative - row ${i + 1}`, async ({ page }) => {
    const customerCarePage = new CustomerCarePage(page);

    await customerCarePage.loginIfNeeded(user, pass);
    await customerCarePage.click_CustomerCareBtn();
    await customerCarePage.customer_Name(cusName, cusNickName, id);
    await customerCarePage.parent_Name(parentNme);
    await customerCarePage.primaryAccounts_Manager_Creation(primaryLName, primaryLimit);
    // await customerCarePage.customer_Type(cusZip, custStreet, custStreet2);
    await customerCarePage.customer_TypeNegative(cusZip, custStreet, custStreet2);
    await customerCarePage.customer_Contacts(cusEmail, custPhone, custMobile);
    // await customerCarePage.route_Creation(rouName);
    await customerCarePage.terms_Creation(creLimit);
    await customerCarePage.SAPCustomerDetail(customerSAP, vendorSAP, cust1, cust2, cust3);
    await customerCarePage.charge_Check(subCus, purOrder);
    // await customerCarePage.finalSaveBtn();
    // await customerCarePage.CustomerMenu();
    await customerCarePage.finalSaveBtnNegative();
    // await customerCarePage.CustomerMenuNegative();
    // await customerCarePage.CustomerMenuSearch(customer);
  });
}
