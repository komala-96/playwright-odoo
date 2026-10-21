const { test } = require('../../fixtures/testFixtures');
const { readExcelRows } = require('../../utils/excelReader');
const { CustomerCareAddress } = require('../../pages/CustomerCareAddress');

// Ported from src/main/java/positivetestcases/VerifyCustomerCareAddress.java
// excelFileName: customerCareAddress (positive sheet)

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

  test(`VerifyCustomerCareAddress - row ${i + 1}`, async ({ page }) => {
    const customerCareAddress = new CustomerCareAddress(page);

    await customerCareAddress.loginIfNeeded(user, pass);
    await customerCareAddress.click_CustomerCareBtn();
    await customerCareAddress.ProductADDMenu_CustomerCare(customer);
    await customerCareAddress.click_Address();
    await customerCareAddress.click_contAddress(name, mail, phone, mob);
    await customerCareAddress.click_otherAddress(name, zip, street, mail, phone, mob);
    // await customerCareAddress.click_otherAddressNegative(name, street, mail, phone, mob);
    await customerCareAddress.click_privateAddress(name, zip, street, mail, phone, mob);
    await customerCareAddress.click_payeeeAddress(name, zip, street, mail, phone, mob);
    await customerCareAddress.click_remittoAddress(name, zip, street, mail, phone, mob);
    await customerCareAddress.click_billingAddress(name, zip, street, mail, phone, mob);
    await customerCareAddress.click_deliveryAddress(name, zip, street, mail, phone, mob);
    await customerCareAddress.portalUsers(pname, pusername, pmail);
    await customerCareAddress.protalUsers_CheckBox();
    // await customerCareAddress.portalUsersNegative(pname, pusername, pmail);
    await customerCareAddress.orderProducts(pro1);
    await customerCareAddress.selectAllProduct(pro2);
    await customerCareAddress.clickQuantity(qty, cost);
    await customerCareAddress.click_notes(desc, comment);
    await customerCareAddress.click_preventivecase(phone1, mail1, desc, comment);
    await customerCareAddress.click_accountSetup(accNum, cardnum, cardname, checkno, chqamt);
  });
}
