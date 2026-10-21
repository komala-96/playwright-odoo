const { test } = require('../../fixtures/testFixtures');
const { readExcelRows } = require('../../utils/excelReader');
const { EditProducts } = require('../../pages/EditProducts');

// Ported from src/main/java/positivetestcases/VerifyEditProducts.java
// excelFileName: EditProducts (positive sheet), testName: VerifyEditProducts

const rows = readExcelRows('EditProducts');

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

  test(`VerifyEditProducts - row ${i + 1}`, async ({ page }) => {
    const editProducts = new EditProducts(page);

    await editProducts.loginIfNeeded(user, pass);
    await editProducts.click_CustomerCareBtn();
    await editProducts.ProductADDMenu_CustomerCare(customer);
    await editProducts.customer_Name(name, zip, street);
    await editProducts.click_Address();
    await editProducts.click_contAddress(name, mail1, phone1, mob);
    await editProducts.click_otherAddress(name, zip, street, mail1, phone1, mob);
    await editProducts.click_privateAddress(name, zip, street, mail1, phone1, mob);
    await editProducts.click_payeeeAddress(name, zip, street, mail1, phone1, mob);
    await editProducts.click_remittoAddress(name, zip, street, mail1, phone1, mob);
    await editProducts.click_billingAddress(name, zip, street, mail1, phone1, mob);
    await editProducts.click_deliveryAddress(name, zip, street, mail1, phone1, mob);
    await editProducts.portalUsers(pname, pusername, mail1);
    await editProducts.orderProducts(pro1);
    // await editProducts.selectAllProduct(pro2);
    await editProducts.clickQuantity(qty, cost);
    await editProducts.click_Delete();
  });
}
