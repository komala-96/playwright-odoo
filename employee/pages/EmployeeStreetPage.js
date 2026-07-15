const { reportStep } = require('../utils/reportStep');

class EmployeeStreetPage {
  constructor(page) {
    this.page = page;

    // Login Page
    this.userName = page.locator("xpath=//input[@name='login']");
    this.passWord = page.locator("xpath=//input[@name='password']");
    this.logIn = page.locator("xpath=//button[@type='submit']");

    // Menu
    this.menu = page.locator("xpath=//ul[@class='o_menu_apps']//i[@class='fa fa-bars']");
    this.hrMenu = page.locator("xpath=//div[contains(text(),'Employees')]");

    this.createBtn = page.locator("xpath=//button[normalize-space()='New']");

    this.employeeCode = page.locator("xpath=//input[@id='employee_code_0']");
    this.firstName = page.locator("xpath=//input[@id='first_name_0']");
    this.lastName = page.locator("xpath=//input[@id='last_name_0']");
    this.jobPosition = page.locator("xpath=//input[@id='job_id_0']");
    this.positionSelect = page.locator("xpath=//a[@id='job_id_0_0_0']");
    this.department = page.locator("xpath=//input[@id='department_id_0']");
    this.deptSelect = page.locator("xpath=//a[@id='department_id_0_0_0']");
    this.isManager = page.locator("xpath=//input[@id='is_manager_0']");
    this.workMobile = page.locator("xpath=//input[@id='mobile_phone_0']");
    this.workPhone = page.locator("xpath=//input[@id='work_phone_0']");
    this.reportingManager = page.locator("xpath=//input[@id='parent_id_0']");
    this.managerSelect = page.locator("xpath=//a[@id='parent_id_0_0_0']");
    this.purchaseLimit = page.locator("xpath=//input[@id='purchase_limit_0']");
    this.workMail = page.locator("xpath=//input[@id='work_email_0']");

    this.tag = page.locator("xpath=//input[@id='category_ids_0']");
    this.tagSelect = page.locator("xpath=//a[@id='category_ids_0_0_0']");

    this.workInfo = page.locator("xpath=//a[normalize-space()='Work Information']");

    this.workAddress = page.locator("xpath=//input[@id='address_id_0']");
    this.searchMore = page.locator("xpath=(//a[normalize-space()='Search More...'])[1]");
    this.create = page.locator("xpath=(//button[normalize-space()='New'])[2]");

    this.name = page.locator("xpath=//input[@id='name_1']");
    this.zip = page.locator("xpath=//input[@id='zip_0']");
    this.street = page.locator("xpath=//input[@id='street_0']");
    this.taxId = page.locator("xpath=//input[@id='vat_0']");
    this.Position = page.locator("xpath=//input[@id='function_0']");
    this.phone = page.locator("xpath=//input[@id='phone_0']");
    this.mobile = page.locator("xpath=//input[@id='mobile_0']");
    this.email = page.locator("xpath=//input[@id='email_0']");
    this.webSite = page.locator("xpath=//input[@id='website_0']");
    this.title = page.locator("xpath=//input[@id='title_0']");

    this.tags = page.locator("xpath=//input[@id='category_id_0']");
    this.tagsSelect1 = page.locator("xpath=//a[@id='category_id_0_0_0']");

    this.add = page.locator("xpath=//button[normalize-space()='Add']");

    this.nameAdd = page.locator("xpath=//input[@id='name_0']");
    this.zipAdd = page.locator("xpath=//input[@id='zip_0']");
    this.streetAdd = page.locator("xpath=//input[@id='street_0']");
    this.phoneAdd = page.locator("xpath=//input[@id='phone_0']");
    this.mobileAdd = page.locator("xpath=//input[@id='mobile_0']");
    this.emailAdd = page.locator("xpath=//input[@id='email_0']");
    this.internalNotes = page.locator("xpath=//textarea[@id='comment_0']");

    this.saveAndCloseBtn = page.locator("xpath=(//button[normalize-space()='Save & Close'])[2]");

    this.saleAndPurchase = page.locator("xpath=//a[normalize-space()='Sales & Purchase']");
    this.salesPerson = page.locator("xpath=//input[@id='user_id_0']");
    this.personSelect = page.locator("xpath=//a[@id='user_id_0_0_0']");

    this.paymentTerm = page.locator("xpath=//input[@id='property_payment_term_id_0']");
    this.termSelect = page.locator("xpath=//a[@id='property_payment_term_id_0_0_0']");

    this.paymentMethod = page.locator("xpath=//input[@id='property_inbound_payment_method_line_id_0']");
    this.methodSelect = page.locator("xpath=//a[@id='property_inbound_payment_method_line_id_0_0_0']");

    this.paymentTerm1 = page.locator("xpath=//input[@id='property_supplier_payment_term_id_0']");
    this.termSelect1 = page.locator("xpath=//a[@id='property_supplier_payment_term_id_0_0_0']");

    this.paymentMethod1 = page.locator("xpath=//input[@id='property_outbound_payment_method_line_id_0']");
    this.methodSelect1 = page.locator("xpath=//a[@id='property_outbound_payment_method_line_id_0_0_0']");

    this.fiscalPosition = page.locator("xpath=//input[@id='property_account_position_id_0']");
    this.fiscalSelect = page.locator("xpath=//a[@id='property_account_position_id_0_0_0']");

    this.cmpyId = page.locator("xpath=//input[@id='company_registry_0']");
    this.reference = page.locator("xpath=//input[@id='ref_0']");

    this.invoicing = page.locator("xpath=//a[normalize-space()='Invoicing']");
    this.invoiceSending = page.locator("xpath=//select[@id='invoice_sending_method_0']");
    this.format = page.locator("xpath=//select[@id='invoice_edi_format_0']");
    this.peppolId = page.locator("xpath=//input[@id='peppol_endpoint_0']");
    this.autoPostBill = page.locator("xpath=//select[@id='autopost_bills_0']");

    this.notes = page.locator("xpath=//a[normalize-space()='Internal Notes']");
    this.notesDesc = page.locator("xpath=//textarea[@id='comment_0']");
    this.saveAndClose = page.locator("xpath=//button[normalize-space()='Save & Close']");

    this.workLocation = page.locator("xpath=//input[@id='work_location_id_0']");
    this.locationSelect = page.locator("xpath=//a[@id='work_location_id_0_0_0']");

    this.privateInfo = page.locator("xpath=//a[normalize-space()='Private Information']");
    this.zipAddr = page.locator("xpath=//input[@id='private_zip_0']");
    this.streetAddr = page.locator("xpath=//input[@id='private_street_0']");
    this.privateMail = page.locator("xpath=//input[@id='private_email_0']");
    this.privatePhone = page.locator("xpath=//input[@id='private_phone_0']");
    this.homeWorkDistance = page.locator("xpath=//input[@id='distance_home_work_0']");
    this.privateCarPlate = page.locator("xpath=//input[@id='private_car_plate_0']");

    this.nationality = page.locator("xpath=//input[@id='country_id_0']");
    this.nationalitySelect = page.locator("xpath=//a[@id='country_id_0_0_1']");

    this.identNo = page.locator("xpath=//input[@id='identification_id_0']");
    this.ssnNo = page.locator("xpath=//input[@id='ssnid_0']");
    this.passPortNo = page.locator("xpath=//input[@id='passport_id_0']");

    this.gender = page.locator("xpath=//select[@id='gender_0']");
    this.dateOfBirth = page.locator("xpath=//input[@id='birthday_0']");
    this.placeOfBirth = page.locator("xpath=//input[@id='place_of_birth_0']");

    this.country = page.locator("xpath=//input[@id='country_of_birth_0']");
    this.countrySelect = page.locator("xpath=//a[@id='country_of_birth_0_0_0']");

    this.emerContact = page.locator("xpath=//input[@id='emergency_contact_0']");
    this.emerPhone = page.locator("xpath=//input[@id='emergency_phone_0']");

    this.certificate = page.locator("xpath=//select[@id='certificate_0']");
    this.study = page.locator("xpath=//input[@id='study_field_0']");
    this.school = page.locator("xpath=//input[@id='study_school_0']");

    this.maritalSelect = page.locator("xpath=//select[@id='marital_0']");
    this.depChildren = page.locator("xpath=//input[@id='children_0']");

    this.visaNo = page.locator("xpath=//input[@id='visa_no_0']");
    this.permitNo = page.locator("xpath=//input[@id='permit_no_0']");
    this.visaDate = page.locator("xpath=//input[@id='visa_expire_0']");
    this.permitDate = page.locator("xpath=//input[@id='work_permit_expiration_date_0']");

    this.hrSettings = page.locator("xpath=//a[normalize-space()='Settings']");
    this.user = page.locator("xpath=//input[@id='user_id_1']");
    this.userSelect = page.locator("xpath=//a[@id='user_id_1_0_0']");
    this.pincode = page.locator("xpath=//input[@id='pin_0']");
    this.generateBadge = page.locator("xpath=//input[@id='barcode_0']");
    this.printBadge = page.locator("xpath=//span[normalize-space()='Generate']");

    this.saveBtn = page.locator("xpath=(//button[normalize-space()='Save'])[1]");
  }

  async enterUsername(user, pass) {
    try {
      await this.userName.fill(String(user));
      await this.passWord.fill(String(pass));
      await this.logIn.click();
      await this.page.waitForTimeout(5000);

      await reportStep(this.page, "login button is entered successfully", "pass");
    } catch (e) {
      await reportStep(this.page, "login button is not entered successfully..." + e, "fail");
    }
    return this;
  }

  async clickMenu() {
    try {
      await this.page.waitForTimeout(2000);
      await this.hrMenu.click();
      await this.page.waitForTimeout(3000);

      await reportStep(this.page, "Menu clicked successfully", "pass");
    } catch (e) {
      await reportStep(this.page, "Menu clicked not successfully..." + e, "fail");
    }
    return this;
  }

  async enterWorkInfo(code, first, last, title, mbl, phn, pLimit, mail, ltn) {
    try {
      await this.createBtn.click({ timeout: 20 * 1000 });
      await this.page.waitForTimeout(5000);

      await this.employeeCode.fill(String(code));
      await this.page.waitForTimeout(2000);

      await this.firstName.fill(String(first));
      await this.lastName.fill(String(last));

      await this.jobPosition.click();
      await this.positionSelect.click();
      await this.page.waitForTimeout(2000);

      await this.department.click();
      await this.deptSelect.click();
      await this.page.waitForTimeout(2000);

      await this.isManager.evaluate((node) => node.click());
      await this.page.waitForTimeout(2000);

      await this.workMobile.fill(String(mbl));
      await this.workPhone.fill(String(phn));
      await this.page.waitForTimeout(2000);

      await this.reportingManager.click();
      await this.managerSelect.click();
      await this.page.waitForTimeout(2000);

      await this.purchaseLimit.clear();
      await this.purchaseLimit.fill(String(pLimit));
      await this.workMail.fill(String(mail));
      await this.page.waitForTimeout(2000);

      await this.tag.click();
      await this.page.waitForTimeout(3000);

      await this.tagSelect.evaluate((node) => node.click());
      await this.page.waitForTimeout(5000);

      await reportStep(this.page, "work info is entered successfully", "pass");
    } catch (e) {
      await reportStep(this.page, "work info is not entered successfully..." + e, "fail");
    }
    return this;
  }

  async enterWorkAddress(name1, zipcode, streetname) {
    try {
      await this.workInfo.click();
      await this.page.waitForTimeout(3000);

      await this.workAddress.click();
      await this.page.waitForTimeout(3000);

      await this.searchMore.click();
      await this.page.waitForTimeout(3000);

      await this.create.click();
      await this.page.waitForTimeout(3000);

      await this.name.fill(String(name1));
      await this.page.waitForTimeout(2000);

      await this.zip.fill(String(zipcode));
      await this.page.waitForTimeout(2000);

      await this.street.fill(String(streetname));
      await this.page.waitForTimeout(2000);

      await this.taxId.fill("98");
      await this.page.waitForTimeout(2000);

      await this.jobPosition.fill("manager");

      await this.phone.clear();
      await this.phone.fill("9874563210");
      await this.page.waitForTimeout(2000);

      await this.mobile.clear();
      await this.mobile.fill("9874563210");
      await this.page.waitForTimeout(2000);

      await this.email.clear();
      await this.email.fill("komala1@averigo.com");

      await this.webSite.fill("www.averigo.com");
      await this.page.waitForTimeout(2000);

      await this.title.fill("Miss");
      await this.page.waitForTimeout(2000);

      await this.tags.click();
      await this.tagsSelect1.evaluate((node) => node.click());
      await this.page.waitForTimeout(2000);

      await this.add.click();
      await this.page.waitForTimeout(2000);

      await this.nameAdd.fill(String(name1));
      await this.zipAdd.fill(String(zipcode));
      await this.page.waitForTimeout(2000);

      await this.streetAdd.clear();
      await this.streetAdd.fill(String(streetname));

      await this.phoneAdd.fill("9874561230");
      await this.mobileAdd.fill("9123456780");
      await this.emailAdd.fill("preethi.g.rsd@gmail.com");
      await this.internalNotes.fill("test");
      await this.page.waitForTimeout(2000);

      await this.saveAndCloseBtn.click();
      await this.page.waitForTimeout(2000);

      await this.saleAndPurchase.click();
      await this.page.waitForTimeout(2000);

      await this.salesPerson.click();
      await this.personSelect.click();
      await this.page.waitForTimeout(2000);

      await this.paymentTerm.click();
      await this.termSelect.click();
      await this.page.waitForTimeout(2000);

      await this.paymentMethod.click();
      await this.methodSelect.click();
      await this.page.waitForTimeout(2000);

      await this.paymentTerm1.click();
      await this.termSelect1.click();
      await this.page.waitForTimeout(2000);

      await this.paymentMethod1.click();
      await this.methodSelect1.click();
      await this.page.waitForTimeout(2000);

      await this.fiscalPosition.click();
      await this.fiscalSelect.evaluate((node) => node.click());
      await this.page.waitForTimeout(2000);

      await this.cmpyId.fill("11");
      await this.page.waitForTimeout(2000);

      await this.reference.fill("test");

      await this.invoicing.click();
      await this.page.waitForTimeout(2000);

      await this.invoiceSending.click();
      await this.page.waitForTimeout(2000);

      await this.format.click();
      await this.peppolId.fill("1");
      await this.autoPostBill.click();
      await this.page.waitForTimeout(2000);

      await this.notes.click();
      await this.notesDesc.fill("test");
      await this.page.waitForTimeout(2000);

      await this.saveAndClose.click();
      await this.page.waitForTimeout(2000);

      await reportStep(this.page, "work address is entered successfully", "pass");
    } catch (e) {
      await reportStep(this.page, "work address is not entered successfully..." + e, "fail");
    }
    return this;
  }

  async enterPrivateInfo(zipcode, streetname, phn1, date, cont, phone, stud, schl) {
    try {
      await this.page.waitForTimeout(5000);

      await this.privateInfo.click();
      await this.page.waitForTimeout(2000);

      await this.zipAddr.fill(String(zipcode));
      await this.page.waitForTimeout(2000);

      await this.streetAddr.fill(String(streetname));
      await this.page.waitForTimeout(2000);

      await this.privateMail.fill("abc@mail.com");
      await this.page.waitForTimeout(2000);

      await this.privatePhone.fill("9874561230");
      await this.page.waitForTimeout(2000);

      await this.homeWorkDistance.fill("20");
      await this.page.waitForTimeout(2000);

      await this.privateCarPlate.fill("25");
      await this.page.waitForTimeout(2000);

      await this.nationality.click();
      await this.page.waitForTimeout(2000);

      await this.nationalitySelect.click();
      await this.page.waitForTimeout(2000);

      await this.identNo.fill("123");
      await this.page.waitForTimeout(2000);

      await this.ssnNo.fill("555");
      await this.page.waitForTimeout(2000);

      await this.passPortNo.fill("555888");
      await this.page.waitForTimeout(2000);

      await this.gender.selectOption({ label: 'Male' });
      await this.page.waitForTimeout(2000);

      await this.dateOfBirth.fill("01/01/1996");
      await this.dateOfBirth.press('Enter');
      await this.page.waitForTimeout(2000);

      await this.placeOfBirth.fill("india");
      await this.page.waitForTimeout(2000);

      await this.country.click();
      await this.page.waitForTimeout(2000);

      await this.countrySelect.click();
      await this.page.waitForTimeout(2000);

      await this.emerContact.fill("9874561230");
      await this.page.waitForTimeout(2000);

      await this.emerPhone.fill("9569874130");
      await this.page.waitForTimeout(2000);

      await this.certificate.selectOption({ label: 'Bachelor' });
      await this.page.waitForTimeout(2000);
      await this.page.waitForTimeout(2000);

      await this.study.fill("computer");
      await this.page.waitForTimeout(2000);

      await this.school.fill("abc");
      await this.page.waitForTimeout(2000);

      await this.maritalSelect.selectOption({ label: 'Single' });
      await this.page.waitForTimeout(2000);

      await this.depChildren.fill("2");
      await this.page.waitForTimeout(2000);

      await this.visaNo.fill("456");
      await this.page.waitForTimeout(2000);

      await this.permitNo.fill("123");
      await this.page.waitForTimeout(2000);

      await this.visaDate.fill("01/01/1996");
      await this.visaDate.press('Enter');
      await this.page.waitForTimeout(2000);

      await this.permitDate.fill("01/01/1996");
      await this.permitDate.press('Enter');
      await this.page.waitForTimeout(2000);

      await reportStep(this.page, "private_info is entered successfully", "pass");
    } catch (e) {
      await reportStep(this.page, "private_info is not entered successfully..." + e, "fail");
    }
    return this;
  }

  async enterHrInfo(pin) {
    try {
      await this.page.waitForTimeout(5000);

      await this.hrSettings.click();
      await this.page.waitForTimeout(2000);

      await this.pincode.fill(String(pin));
      await this.page.waitForTimeout(5000);

      await this.generateBadge.click();
      await this.page.waitForTimeout(5000);

      await this.printBadge.click();
      await this.page.waitForTimeout(5000);

      await this.user.click();
      await this.page.waitForTimeout(3000);

      await this.userSelect.click();
      await this.page.waitForTimeout(2000);

      await this.saveBtn.click();
      await this.page.waitForTimeout(5000);

      await reportStep(this.page, "hr_info is entered successfully", "pass");
    } catch (e) {
      await reportStep(this.page, "hr_info is not entered successfully..." + e, "fail");
    }
    return this;
  }
}

module.exports = { EmployeeStreetPage };
