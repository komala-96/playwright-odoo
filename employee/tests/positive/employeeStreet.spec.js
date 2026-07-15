const { test } = require('../../fixtures/base');
const { readData } = require('../../utils/readExcelData');
const { EmployeeStreetPage } = require('../../pages/EmployeeStreetPage');

const data = readData('EmployeeStreet');

data.forEach((row, rowIndex) => {
  const [
    user,
    pass,
    code,
    first,
    last,
    title,
    mbl,
    phn,
    pLimit,
    mail,
    ltn,
    name,
    zipcode,
    streetname,
    zipcode1,
    streetname1,
    phn1,
    date,
    cont,
    phone,
    stud,
    schl,
    pin,
  ] = row;

  test(`Verify EmployeeStreet - ${first} ${last} (#${rowIndex + 1})`, async ({ page }) => {
    const employeeStreetPage = new EmployeeStreetPage(page);

    // await employeeStreetPage.enterUsername(user, pass);
    await employeeStreetPage.clickMenu();
    await employeeStreetPage.enterWorkInfo(code, first, last, title, mbl, phn, pLimit, mail, ltn);
    await employeeStreetPage.enterWorkAddress(name, zipcode, streetname);
    await employeeStreetPage.enterPrivateInfo(zipcode1, streetname1, phn1, date, cont, phone, stud, schl);
    await employeeStreetPage.enterHrInfo(pin);
  });
});
