const { test } = require('../../fixtures/testFixtures');
const { readExcelRows } = require('../../utils/excelReader');
const { CustomerCareAddress } = require('../../pages/CustomerCareAddress');

// Ported from src/main/java/negativetestcases/VerifyCustomerCareAddress.java
// excelFileName: customerCareAddress. NOTE: the Java ReadExcelData always read the
// "positive" sheet even from negative test classes; preserved here for parity.

const rows = readExcelRows('customerCareAddress');

for (const [i, row] of rows.entries()) {
  const [
    user,
    pass,
    customer,
    name,
    zip,
    street,
    mail,
    phone,
    mob,
    pname,
    pusername,
    pmail,
    pro1,
    pro2,
    qty,
    cost,
    phone1,
    mail1,
    desc,
    comment,
    accNum,
    cardnum,
    cardname,
    checkno,
    chqamt,
  ] = row;

  test(`VerifyCustomerCareAddress negative - row ${i + 1}`, async ({ page }) => {
    const customerCareAddress = new CustomerCareAddress(page);

    await customerCareAddress.loginIfNeeded(user, pass);
    // await customerCareAddress.click_Menu();
    await customerCareAddress.click_CustomerCareBtn();
    await customerCareAddress.ProductADDMenu_CustomerCare(customer);
    await customerCareAddress.click_Address();
    // await customerCareAddress.click_contAddress(name, mail, phone, mob);
    // await customerCareAddress.click_otherAddress(name, street, mail, phone, mob);
    await customerCareAddress.click_otherAddressNegative(name, zip, street, mail, phone, mob);
    /* await customerCareAddress.click_privateAddress(name, street, mail, phone, mob);
    await customerCareAddress.click_payeeeAddress(name, street, mail, phone, mob);
    await customerCareAddress.click_remittoAddress(name, street, mail, phone, mob);
    await customerCareAddress.click_billingAddress(name, street, mail, phone, mob);
    await customerCareAddress.click_deliveryAddress(name, street, mail, phone, mob); */
    // await customerCareAddress.portalUsers(pname, pusername, pmail);
    // await customerCareAddress.protalUsers_CheckBox();
    await customerCareAddress.portalUsersNegative(pname, pusername, pmail);
    await customerCareAddress.orderProducts(pro1);
    await customerCareAddress.selectAllProduct(pro2);
    await customerCareAddress.clickQuantityNegative(qty, cost);
    // await customerCareAddress.click_Delete();
    // await customerCareAddress.click_preventivecase(phone1, mail1, desc, comment);
    // await customerCareAddress.click_notes(desc, comment);
    // await customerCareAddress.click_accountSetup(accNum, cardnum, cardname, checkno, chqamt);
  });
}
