const { test, expect } = require('@playwright/test');
const { ensureLoggedIn } = require('../utils/loginHelper');

// Ported from src/main/java/pages/CustomerCareAddress.java.
// Selenium's @FindBy xpaths are preserved verbatim as Playwright locators.
// PageFactory/@CacheLookup have no equivalent needed: Playwright locators
// re-query the DOM on every action, so there's no stale-element risk to guard against.
class CustomerCareAddress {
  constructor(page) {
    this.page = page;

    // Login Page
    this.userName = page.locator("xpath=//input[@id='login']");
    this.passWord = page.locator("xpath=//input[@id='password']");
    this.logIn = page.locator("xpath=//button[@type='submit']");

    this.menu = page.locator("xpath=//ul[@class='o_menu_apps']//i[@class='fa fa-bars']");

    this.customerCareMenuBtn = page.locator("xpath=//div[contains(text(),'Customer Care')]");

    this.searchBox = page.locator(
      "xpath=//div[@class='o_searchview_input_container d-flex flex-grow-1 flex-wrap gap-1 mw-100']//input[@type='text']"
    );

    this.customerSelect = page.locator(
      "xpath=//table[@class='o_list_table table table-sm table-hover position-relative mb-0 o_list_table_ungrouped table-striped']//tbody//tr[1]//td[3]"
    );

    this.customerRows = page.locator(
      "xpath=//table[@class='o_list_table table table-sm table-hover position-relative mb-0 o_list_table_ungrouped table-striped']//tbody//tr"
    );

    this.edit = page.locator("xpath=//button[contains(text(),'Edit')]");

    this.Address = page.locator(
      "xpath=(//li[@class='nav-item flex-nowrap cursor-pointer']//a[@name='contact_addresses'])[1]"
    );

    this.contactsAddressAdd = page.locator("xpath=(//button[normalize-space()='Add'])[1]");

    this.contAddress = page.locator("xpath=(//div[@name='type_address']//div[1])[2]");

    this.alertClick = page.locator("xpath=//button[normalize-space()='Ok']");
    this.alertClick1 = page.locator("xpath=//button[normalize-space()='Ok']");
    this.alertClick2 = page.locator("xpath=//button[normalize-space()='Ok']");
    this.alertClick3 = page.locator("xpath=//button[normalize-space()='Ok']");
    this.alertClick4 = page.locator("xpath=//button[normalize-space()='Ok']");
    this.alertClick5 = page.locator("xpath=//button[normalize-space()='Ok']");

    this.contactsName = page.locator("xpath=(//div[@name='name']//input[@id='name_0'])");
    this.contactsName1 = page.locator("xpath=(//div[@name='name']//input[@type='text'])[2]");
    this.contactsName2 = page.locator("xpath=(//div[@name='name']//input[@type='text'])[2]");
    this.contactsName3 = page.locator("xpath=(//div[@name='name']//input[@type='text'])[2]");
    this.contactsName4 = page.locator("xpath=(//div[@name='name']//input[@type='text'])[2]");
    this.contactsName5 = page.locator("xpath=(//div[@name='name']//input[@type='text'])[2]");
    this.contactsName6 = page.locator("xpath=(//div[@name='name']//input[@type='text'])[2]");

    this.remitCheck = page.locator("xpath=//input[@id='set_default_remit_0']");
    this.contactCheck = page.locator("xpath=//input[@id='is_primary_0']");

    this.contactsEmail = page.locator("xpath=//input[@id='email_0']");
    this.contactsEmail1 = page.locator("xpath=//input[@id='email_0']");
    this.contactsEmail2 = page.locator("xpath=//input[@id='email_0']");
    this.contactsEmail3 = page.locator("xpath=//input[@id='email_0']");
    this.contactsEmail4 = page.locator("xpath=//input[@id='email_0']");
    this.contactsEmail5 = page.locator("xpath=//input[@id='email_0']");
    this.contactsEmail6 = page.locator("xpath=//input[@id='email_0']");

    this.contactsPhone = page.locator("xpath=//input[@id='phone_0']");
    this.contactsPhone1 = page.locator("xpath=//input[@id='phone_0']");
    this.contactsPhone2 = page.locator("xpath=//input[@id='phone_0']");
    this.contactsPhone3 = page.locator("xpath=//input[@id='phone_0']");
    this.contactsPhone4 = page.locator("xpath=//input[@id='phone_0']");
    this.contactsPhone5 = page.locator("xpath=//input[@id='phone_0']");
    this.contactsPhone6 = page.locator("xpath=//input[@id='phone_0']");

    this.contactsMobile = page.locator("xpath=//input[@id='mobile_0']");
    this.contactsMobile1 = page.locator("xpath=//input[@id='mobile_0']");
    this.contactsMobile2 = page.locator("xpath=//input[@id='mobile_0']");
    this.contactsMobile3 = page.locator("xpath=//input[@id='mobile_0']");
    this.contactsMobile4 = page.locator("xpath=//input[@id='mobile_0']");
    this.contactsMobile5 = page.locator("xpath=//input[@id='mobile_0']");
    this.contactsMobile6 = page.locator("xpath=//input[@id='mobile_0']");

    this.contactsStreet = page.locator("xpath=//div[@name='street']//input[@id='street_0']");
    this.contactsStreet1 = page.locator("xpath=//div[@name='street']//input[@id='street_0']");
    this.contactsStreet2 = page.locator("xpath=//div[@name='street']//input[@id='street_0']");
    this.contactsStreet3 = page.locator("xpath=//div[@name='street']//input[@id='street_0']");
    this.contactsStreet4 = page.locator("xpath=//div[@name='street']//input[@id='street_0']");
    this.contactsStreet5 = page.locator("xpath=//div[@name='street']//input[@id='street_0']");
    this.contactsStreet6 = page.locator("xpath=//div[@name='street']//input[@id='street_0']");

    this.contactZip = page.locator("xpath=//div[@name='zip']//input[@id='zip_0']");
    this.contactZip1 = page.locator("xpath=//div[@name='zip']//input[@id='zip_0']");
    this.contactZip2 = page.locator("xpath=//div[@name='zip']//input[@id='zip_0']");
    this.contactZip3 = page.locator("xpath=//div[@name='zip']//input[@id='zip_0']");
    this.contactZip4 = page.locator("xpath=//div[@name='zip']//input[@id='zip_0']");
    this.contactZip5 = page.locator("xpath=//div[@name='zip']//input[@id='zip_0']");
    this.contactZip6 = page.locator("xpath=//div[@name='zip']//input[@id='zip_0']");

    this.saveAndNew = page.locator("xpath=//button[text()='Save & New']");
    this.saveAndNew1 = page.locator("xpath=//button[text()='Save & New']");
    this.saveAndNew2 = page.locator("xpath=//button[text()='Save & New']");
    this.saveAndNew3 = page.locator("xpath=//button[text()='Save & New']");
    this.saveAndNew4 = page.locator("xpath=//button[text()='Save & New']");
    this.saveAndNew5 = page.locator("xpath=//button[text()='Save & New']");

    this.saveAndClose = page.locator("xpath=//button[normalize-space()='Save & Close']");

    this.discard = page.locator("xpath=(//button[normalize-space()='Discard'])[2]");
    this.discard1 = page.locator("xpath=(//button[normalize-space()='Discard'])[2]");

    this.otherAddress = page.locator("xpath=//label[normalize-space()='Other Address']");
    this.privateAddress = page.locator("xpath=//label[normalize-space()='Private Address']");
    this.payeeAddress = page.locator("xpath=//label[normalize-space()='Payee Address']");
    this.remittoAddress = page.locator("xpath=//label[normalize-space()='Remit To Address']");
    this.billingAddress = page.locator("xpath=//label[normalize-space()='Billing Address']");
    this.deliveryAddress = page.locator("xpath=//label[normalize-space()='Delivery Address']");

    // Portal
    this.protalUsers = page.locator("xpath=//a[normalize-space()='Portal Users']");
    this.protalUsersAdd = page.locator("xpath=//button[normalize-space()='Add']");
    this.protalName = page.locator("xpath=//div[@role='dialog']//div[@name='name']//input[@type='text']");
    this.protalUserName = page.locator("xpath=//div[@role='dialog']//input[@id='username_0']");
    this.protalEmail = page.locator("xpath=//div[@role='dialog']//input[@id='email_0']");

    this.createOrder = page.locator("xpath=//div[@name='create_order']");
    this.createCase = page.locator("xpath=//div[@name='create_case']");
    this.orderForm = page.locator("xpath=//div[@name='order_form']");
    this.reOrder = page.locator("xpath=//div[@name='re_order']");
    this.showPrice = page.locator("xpath=//div[@name='show_price']");
    this.showInvoice = page.locator("xpath=//div[@name='show_invoice']");
    this.sellAllProductPortal = page.locator("xpath=//div[@class='buy_all_item']//div[@name='buy_all_item']");
    this.showImage = page.locator("xpath=//div[@name='show_image']");
    this.productReportsMenu = page.locator("xpath=//div[@name='report_menu']");
    this.reportsDDBox = page.locator("xpath=//div[@name='portal_report_ids']");
    this.reportsSearchMore = page.locator("xpath=//li[8]//a[contains(text(),'Search More...')]");
    this.reportsNameCheckBox = page.locator("xpath=//th[@class='o_list_record_selector']//input[@type='checkbox']");
    this.reportsSelectBtn = page.locator("xpath=//footer[@class='modal-footer']//span[contains(text(),'Select')]");
    this.reportSaveAndClose = page.locator("xpath=//button[normalize-space()='Save & Close']");

    this.orderProduct = page.locator("xpath=//a[normalize-space()='Order Products']");
    this.productBox1 = page.locator("xpath=//input[@id='product_ids_0']");
    // Dark Chocolate
    this.selectProduct1 = page.locator("xpath=(//a[normalize-space()='[AVR09658] Mountain Diet Dew 20oz'])[1]");
    this.productBox2 = page.locator("xpath=//input[@id='product_ids_0']");
    // Dark Chocolate
    this.selectProduct2 = page.locator("xpath=(//a[normalize-space()='[AVR00132] Milky Way'])[1]");
    this.productAdd = page.locator("xpath=//button[@id='add_product']//span[text()='Add']");
    this.productAdd1 = page.locator("xpath=//button[@id='add_product']//span[text()='Add']");

    this.preventiveCases = page.locator("xpath=//a[normalize-space()='Preventive Cases']");
    this.preventivecasesAdd = page.locator("xpath=(//button[contains(text(),'Add')])");

    this.caseOrigin = page.locator("xpath=//div[@name='channel_id']//input[@type='text']");
    this.originSelect = page.locator("xpath=//li[@class='ui-menu-item']//a[contains(text(),'Phone')]");

    this.reportedPhone = page.locator("xpath=//div[@class='col-3 mb-3']//input[@name='reported_phone']");
    this.reportedEmail = page.locator("xpath=//div[@class='col-3 mb-3']//input[@name='reported_email']");

    this.assignedTo = page.locator("xpath=//div[@name='employee_ids']//input[@type='text']");
    this.toSelect = page.locator("xpath=//li[@class='ui-menu-item']//a[contains(text(),'Alex M')]");

    this.caseCategory = page.locator("xpath=//input[@id='category_id_0']");
    this.caseSelect = page.locator("xpath=//a[@id='category_id_0_0_0']");

    this.type = page.locator("xpath=//input[@id='type_id_0']");
    this.typeSelect = page.locator("xpath=//a[@id='type_id_0_0_0']");

    this.route = page.locator("xpath=(//div[@name='route_id']//input[@type='text'])[2]");
    this.routeSelect = page.locator("xpath=//ul[28]//li[1]//a[contains(text(),'Martis LLC')]");

    this.billable = page.locator("xpath=(//div[@name='is_billable']//input[@type='checkbox'])");
    this.equipment = page.locator("xpath=//div[@name='machine_ids']//input[@type='text']");
    this.equipSelect = page.locator(
      "xpath=//li[@class='ui-menu-item']//a[contains(text(),'04367 - NesCafe Coffee maker (12345611334441)')]"
    );

    this.description = page.locator("xpath=//textarea[@id='case_description_0']");
    this.comment = page.locator("xpath=//div[@class='html_field_div']//textarea[@name='internal_comment']");

    this.damagedPro = page.locator("xpath=(//div[@class='o_notebook_headers']//li[3])[2]");
    this.addLine = page.locator("xpath= (//table[contains(@class,'o_list_table')]//a[text()='Add a line'])[6]");
    this.product = page.locator("xpath=  //div[@name='product_id']//input[@type='text']");
    this.machineSelect = page.locator("xpath=//ul//li[3]//a[contains(text(),'machine')]");
    this.quantSelect = page.locator(
      "xpath=//td[@class='o_data_cell o_field_cell o_list_number o_required_modifier']//input[@name='quantity']"
    );

    this.saveBtn = page.locator("xpath=//button[normalize-space()='Save & Close']");

    this.notes = page.locator("xpath=//a[normalize-space()='Notes']");
    this.internalNotes = page.locator("xpath=//textarea[@id='comment_0']");
    this.specialNotes = page.locator("xpath=//textarea[@id='special_notes_1']");
    this.equipments = page.locator("xpath=//a[normalize-space()='Equipments']");

    this.accountSetUp = page.locator("xpath=//a[normalize-space()='Account Setup']");
    // 121000 Account Receivable
    this.control = page.locator("xpath=//input[@id='property_account_receivable_id_0']");
    this.controlSelect = page.locator("xpath=//a[@id='property_account_receivable_id_0_0_0']");

    // The Bank/Card/Check tables all share the same classes, and once a customer
    // already has a saved row (e.g. from a prior test run against this same
    // persistent profile/DB) "Add a line" is no longer in tr[1] - it's pushed
    // down by the existing data row. Scope by each section's own heading instead
    // of table position, so this keeps working however many rows already exist.
    this.addBank = page.locator(
      "xpath=//div[contains(@class,'o_group') and .//div[contains(@class,'o_horizontal_separator') and normalize-space()='Bank Accounts']]//a[contains(text(),'Add a line')]"
    );
    this.bank = page.locator("xpath=//div[@name='bank_id']//input[@type='text']");
    this.bankSelect = page.locator("xpath=//a[@id='autocomplete_0_1']");
    this.accNum = page.locator("xpath=//div[@name='acc_number']//input[@type='text']");

    this.addCard = page.locator(
      "xpath=//div[contains(@class,'o_group') and .//div[contains(@class,'o_horizontal_separator') and normalize-space()='Card Details']]//a[contains(text(),'Add a line')]"
    );
    this.bank1 = page.locator("xpath=(//div[@name='bank_id']//input[@type='text'])[2]");
    this.bankSelect1 = page.locator("xpath=//a[@id='autocomplete_0_1']");
    this.cardNum = page.locator("xpath=//div[@name='card_number']//input[@type='text']");
    this.cardName = page.locator("xpath=//div[@name='card_name']//input[@type='text']");

    this.addCheck = page.locator(
      "xpath=//div[contains(@class,'o_group') and .//div[contains(@class,'o_horizontal_separator') and normalize-space()='Check Details']]//a[contains(text(),'Add a line')]"
    );
    this.checkNum = page.locator("xpath=//div[@name='check_number']//input[@type='text']");
    this.checkAmt = page.locator("xpath=//div[@name='check_amount']//input[@type='text']");
    this.checkBank = page.locator("xpath=//div[@name='check_bank_id']//input[@type='text']");
    this.bankSelect3 = page.locator("xpath=//a[@id='autocomplete_0_1']");

    this.finalSaveBtn = page.locator("xpath=//button[contains(text(),'Save')]");
    this.okBtn = page.locator("xpath=(//span[normalize-space()='Ok'])");

    this.action = page.locator("xpath=//button[normalize-space()='Action']");
    this.delete = page.locator("xpath=//span[normalize-space()='Delete']");
    this.confirmDelete = page.locator("xpath=//button[normalize-space()='Delete']");
  }

  async #isErrorDisplayed() {
    return this.page.locator("xpath=//div[@class='o_notification_content']").isVisible();
  }

  async clickLoginPage(user, pass) {
    return test.step('login is entered successfully', async () => {
      await this.page.waitForTimeout(3000);
      await this.userName.fill(user);
      await this.passWord.fill(pass);
      await this.logIn.click();
      return this;
    });
  }

  async loginIfNeeded(user, pass) {
    await ensureLoggedIn(this, user, pass);
    return this;
  }

  async click_Menu() {
    return test.step('Menu clicked is successfully', async () => {
      await this.page.waitForTimeout(3000);
      await this.menu.click({ timeout: 30_000 });
      return this;
    });
  }

  async click_CustomerCareBtn() {
    return test.step('Customer Care is clicked successfully', async () => {
      await this.page.waitForTimeout(3000);
      await this.customerCareMenuBtn.click({ timeout: 30_000 });
      return this;
    });
  }

  async ProductADDMenu_CustomerCare(CustomerName) {
    return test.step('ProductADDMenu_CustomerCare is clicked successfully', async () => {
      await this.page.waitForTimeout(3000);
      await this.searchBox.fill(CustomerName);
      await this.searchBox.press('Enter');
      // Row 1 isn't reliably the searched-for customer (multiple rows can match,
      // and the list can still show the previous filter's rows right after Enter),
      // so match the row by its text instead of blindly clicking tr[1].
      const matchingRow = this.customerRows.filter({ hasText: CustomerName }).first();
      await matchingRow.waitFor({ state: 'visible', timeout: 30_000 });
      await matchingRow.locator('td').nth(2).click();
      // await this.edit.click();
      return this;
    });
  }

  async click_Address() {
    return test.step('click_Address is clicked successfully', async () => {
      await this.page.waitForTimeout(3000);
      await this.Address.click();
      await this.contactsAddressAdd.click();
      return this;
    });
  }

  async click_contAddress(name, mail, phone, mob) {
    return test.step('CustomerCare_contact is clicked successfully', async () => {
      await this.page.waitForTimeout(3000);
      await this.contAddress.click();
      await this.page.waitForTimeout(2000);
      await this.alertClick.click();
      await this.contactsName.fill(name);
      // Java: driver.executeScript("arguments[0].click();", contactCheck);
      await this.contactCheck.click({ force: true });
      await this.contactsEmail.fill(mail);
      await this.contactsPhone.fill(phone);
      await this.contactsMobile.fill(mob);
      await this.saveAndNew.click();
      await this.page.waitForTimeout(2000);
      return this;
    });
  }

  async click_otherAddress(name, zip, street, mail, phone, mob) {
    return test.step('CustomerCare_other addrr is clicked successfully', async () => {
      await this.page.waitForTimeout(3000);
      // await this.otherAddress.click();
      // await this.alertClick.click();
      await this.contactsName1.fill(name);
      await this.contactZip1.fill(zip);
      await this.contactsStreet1.fill(street);
      await this.contactsEmail1.fill(mail);
      await this.contactsPhone1.fill(phone);
      await this.contactsMobile1.fill(mob);
      await this.saveAndNew1.click();
      await this.page.waitForTimeout(2000);
      return this;
    });
  }

  async click_otherAddressNegative(name, zip, street, mail, phone, mob) {
    return test.step('CustomerCare_other addrr is clicked successfully', async () => {
      await this.page.waitForTimeout(3000);
      // await this.otherAddress.click();
      // await this.alertClick.click();
      await this.contactsName1.fill(name);
      await this.contactZip1.fill(zip);
      await this.contactsStreet1.fill(street);
      await this.contactsEmail1.fill(mail);
      await this.contactsPhone1.fill(phone);
      await this.contactsMobile1.fill(mob);

      await this.saveAndClose.click();
      await this.page.waitForTimeout(2000);

      /* try {
        expect(await this.#isErrorDisplayed()).toBeTruthy();
        await this.discard.click();
      } catch (e) {
        console.log('No validation message displayed.');
      } */

      try {
        const validationMessage = this.page.locator("xpath=//div[@class='o_notification_body mt-2']");
        await validationMessage.waitFor({ state: 'visible', timeout: 30_000 });
        console.log('Validation Message: ' + (await validationMessage.innerText()));

        // expect(await this.#isErrorDisplayed()).toBeTruthy();
        await this.discard1.click();
      } catch (e) {
        // No validation message found; proceed normally
        console.log('No validation message displayed.');
      }

      return this;
    });
  }

  async click_privateAddress(name, zip, street, mail, phone, mob) {
    return test.step('CustomerCare_privateaddr is clicked successfully', async () => {
      await this.page.waitForTimeout(3000);
      await this.privateAddress.click();
      await this.page.waitForTimeout(2000);
      await this.alertClick1.click();
      await this.contactsName2.fill(name);
      await this.contactZip2.fill(zip);
      await this.contactsStreet2.fill(street);
      await this.contactsEmail2.fill(mail);
      await this.contactsPhone2.fill(phone);
      await this.contactsMobile2.fill(mob);
      await this.saveAndNew2.click();
      await this.page.waitForTimeout(2000);
      return this;
    });
  }

  async click_payeeeAddress(name, zip, street, mail, phone, mob) {
    return test.step('CustomerCare payeeAddress is clicked successfully', async () => {
      await this.page.waitForTimeout(3000);
      await this.payeeAddress.click();
      await this.page.waitForTimeout(2000);
      await this.alertClick2.click();
      await this.contactsName3.fill(name);
      await this.contactZip3.fill(zip);
      await this.contactsStreet3.fill(street);
      await this.contactsEmail3.fill(mail);
      await this.contactsPhone3.fill(phone);
      await this.contactsMobile3.fill(mob);
      await this.saveAndNew3.click();
      await this.page.waitForTimeout(2000);
      return this;
    });
  }

  async click_remittoAddress(name, zip, street, mail, phone, mob) {
    return test.step('CustomerCare click_remittoAddress is clicked successfully', async () => {
      await this.page.waitForTimeout(3000);
      await this.remittoAddress.click();
      await this.page.waitForTimeout(2000);
      await this.alertClick3.click();
      await this.contactsName4.fill(name);
      // await this.remitCheck.click({ force: true });
      await this.contactZip4.fill(zip);
      await this.contactsStreet4.fill(street);
      await this.contactsEmail4.fill(mail);
      await this.contactsPhone4.fill(phone);
      await this.contactsMobile4.fill(mob);
      await this.saveAndNew4.click();
      await this.page.waitForTimeout(2000);
      return this;
    });
  }

  async click_billingAddress(name, zip, street, mail, phone, mob) {
    return test.step('CustomerCare billingAddress is clicked successfully', async () => {
      await this.page.waitForTimeout(3000);
      await this.billingAddress.click();
      await this.page.waitForTimeout(2000);
      await this.alertClick4.click();
      await this.contactsName5.fill(name);
      await this.contactZip5.fill(zip);
      await this.contactsStreet5.fill(street);
      await this.contactsEmail5.fill(mail);
      await this.contactsPhone5.fill(phone);
      await this.contactsMobile5.fill(mob);
      await this.saveAndNew5.click();
      await this.page.waitForTimeout(2000);
      return this;
    });
  }

  async click_deliveryAddress(name, zip, street, mail, phone, mob) {
    return test.step('CustomerCare deliveryAddress is clicked successfully', async () => {
      await this.page.waitForTimeout(3000);
      await this.deliveryAddress.click();
      await this.page.waitForTimeout(2000);
      await this.alertClick5.click();
      await this.contactsName6.fill(name);
      await this.contactZip6.fill(zip);
      await this.contactsStreet6.fill(street);
      await this.contactsEmail6.fill(mail);
      await this.contactsPhone6.fill(phone);
      await this.contactsMobile6.fill(mob);
      await this.saveAndClose.click();
      await this.page.waitForTimeout(2000);
      return this;
    });
  }

  async portalUsers(proName, proUserName, proEmail) {
    return test.step('Protal Users is clicked successfully', async () => {
      await this.page.waitForTimeout(3000);
      await this.protalUsers.click();
      await this.protalUsersAdd.click();
      await this.protalName.waitFor({ state: 'visible', timeout: 30_000 });
      await this.protalName.fill(proName);
      await this.protalUserName.fill(proUserName);
      await this.protalEmail.fill(proEmail);
      return this;
    });
  }

  async portalUsersNegative(proName, proUserName, proEmail) {
    return test.step('Protal Users is clicked successfully', async () => {
      await this.page.waitForTimeout(3000);
      await this.protalUsers.click();
      await this.protalUsersAdd.click();
      await this.protalName.waitFor({ state: 'visible', timeout: 30_000 });
      await this.protalName.fill(proName);
      await this.protalUserName.fill(proUserName);
      await this.protalEmail.fill(proEmail);
      await this.reportSaveAndClose.click();

      try {
        const errorMsg = this.page.locator("xpath=//div[@class='o_dialog']//p");
        await errorMsg.waitFor({ state: 'visible', timeout: 30_000 });
        console.log('Validation Error Message: ' + (await errorMsg.innerText()));

        // Dismiss the validation error
        await this.page.locator("xpath=//button[normalize-space()='Close']").click();
        console.log('Validation error dismissed successfully for row ');
        await this.discard.click();
      } catch (e) {
        console.log('No validation error for row ');
      }

      return this;
    });
  }

  async protalUsers_CheckBox() {
    return test.step('Protal Users_CheckBox is clicked successfully', async () => {
      await this.page.waitForTimeout(3000);
      await this.createOrder.click();
      await this.createCase.click();
      await this.orderForm.click();
      await this.reOrder.click();
      await this.showPrice.click();
      await this.showInvoice.click();

      // await this.sellAllProductPortal.click();

      await this.showImage.click();
      await this.productReportsMenu.click();

      /* await this.reportsDDBox.click();
      await this.reportsSearchMore.click({ timeout: 30_000 });
      await this.reportsNameCheckBox.click({ force: true });
      await this.reportsSelectBtn.click(); */

      await this.reportSaveAndClose.click();
      await this.page.waitForTimeout(2000);
      return this;
    });
  }

  async orderProducts(product1) {
    return test.step('Order Products is clicked successfully', async () => {
      await this.page.waitForTimeout(3000);
      await this.orderProduct.click();
      await this.productBox1.click();
      // pressSequentially to trigger the live product autocomplete
      await this.productBox1.pressSequentially(product1);

      // await this.selectProduct1.click();

      // Clicking the field opens the dropdown with its default/unfiltered
      // suggestions immediately; waiting for "the dropdown is visible" resolves
      // against that stale list before the autocomplete has re-filtered on the
      // typed text, so a plain .first() ends up clicking whatever was already
      // there instead of product1. Match on the product text itself so this
      // waits for the *filtered* option to appear.
      const dropdown = this.page.locator('css=ul.o-autocomplete--dropdown-menu');
      const productItem = dropdown.locator('a', { hasText: product1 }).first();
      await productItem.waitFor({ state: 'visible', timeout: 10_000 });

      await productItem.click({ force: true });

      await this.productAdd.click();
      // Let the search box reset before the next product search starts, otherwise
      // its stale dropdown/value can still be around when selectAllProduct runs.
      await this.page.waitForTimeout(10000);
      return this;
    });
  }

  async selectAllProduct(product2) {
    return test.step('Order Products is clicked successfully', async () => {
      await this.page.waitForTimeout(3000);
      await this.orderProduct.click();
      await this.productBox2.click();
      await this.productBox2.fill('');
      await this.productBox2.pressSequentially(product2);

      // await this.selectProduct2.click();
      // Same fix as orderProducts(): match on product2's own text instead of
      // taking the first (possibly still-unfiltered) dropdown option.
      const dropdown1 = this.page.locator('css=ul.o-autocomplete--dropdown-menu');
      const productItem1 = dropdown1.locator('a', { hasText: product2 }).first();
      await productItem1.waitFor({ state: 'visible', timeout: 10_000 });
      await productItem1.scrollIntoViewIfNeeded();

      await productItem1.click({ force: true });

      await this.productAdd1.click();
      return this;
    });
  }

  async clickQuantity(qty, Cost) {
    return test.step('Quantity  updated successfully', async () => {
      await this.page.waitForTimeout(3000);
      await this.orderProduct.click();

      for (let row = 1; row <= 2; row++) {
        // Scope to the table that actually has a tax_status column (the Customer
        // Products list), not just "the first o_list_table on the page" - once
        // products are added, Odoo can show an extra "associated products" suggestion
        // table above it that shares the same o_list_table class.
        const rowXpath = `(//table[contains(@class,'o_list_table') and .//td[@name='tax_status']])[1]/tbody/tr[contains(@class,'o_data_row')][${row}]`;
        const rowElement = this.page.locator(`xpath=${rowXpath}`);
        await rowElement.scrollIntoViewIfNeeded();
        await rowElement.click({ timeout: 30_000 });

        // 2. Update UOM
        const uomInput = this.page.locator(`xpath=${rowXpath}//td[@name='uom_id']//input`);
        await uomInput.click({ timeout: 30_000 });

        const menuXpath = "//ul[contains(@class,'ui-autocomplete') and not(contains(@style,'none'))]";

        // Wait for menu to be fully visible
        const dropdownMenu = this.page.locator(`xpath=${menuXpath}`);
        await dropdownMenu.waitFor({ state: 'visible', timeout: 30_000 });

        // Select the first option via keyboard: clicking the <li><a> races with the
        // widget's own blur handling and can leave the dropdown open indefinitely.
        await uomInput.press('ArrowDown');
        await uomInput.press('Enter');

        // Enter commits the value and the row exits edit mode, removing the input the
        // dropdown was anchored to - but the visual ui-autocomplete overlay can outlive
        // it and never close itself. Dismiss it at the page level (the input may already
        // be gone) and re-enter the row so the tax/price fields below are editable again.
        await this.page.keyboard.press('Escape');
        await rowElement.click({ timeout: 30_000 });

        // 3. Update Tax Status
        const taxSelect = this.page.locator(`xpath=${rowXpath}//td[@name='tax_status']//select`);
        await taxSelect.selectOption({ label: 'Yes' });

        // 4. Update Price
        const priceInput = this.page.locator(`xpath=${rowXpath}//td[@name='list_price']//input`);
        await priceInput.fill(Cost);
      }

      return this;
    });
  }

  async clickQuantityNegative(qty, Cost) {
    return test.step('Quantity  updated successfully', async () => {
      await this.page.waitForTimeout(3000);
      await this.orderProduct.click();

      for (let row = 1; row <= 1; row++) {
        // Scope to the table that actually has a tax_status column (the Customer
        // Products list), not just "the first o_list_table on the page" - once
        // products are added, Odoo can show an extra "associated products" suggestion
        // table above it that shares the same o_list_table class.
        const rowXpath = `(//table[contains(@class,'o_list_table') and .//td[@name='tax_status']])[1]/tbody/tr[contains(@class,'o_data_row')][${row}]`;
        const rowElement = this.page.locator(`xpath=${rowXpath}`);
        await rowElement.scrollIntoViewIfNeeded();
        await rowElement.click({ timeout: 30_000 });

        // 2. Update UOM
        const uomInput = this.page.locator(`xpath=${rowXpath}//td[@name='uom_id']//input`);
        await uomInput.click({ timeout: 30_000 });

        const menuXpath = "//ul[contains(@class,'ui-autocomplete') and not(contains(@style,'none'))]";

        // Wait for menu to be fully visible
        const dropdownMenu = this.page.locator(`xpath=${menuXpath}`);
        await dropdownMenu.waitFor({ state: 'visible', timeout: 30_000 });

        // Select the first option via keyboard: clicking the <li><a> races with the
        // widget's own blur handling and can leave the dropdown open indefinitely.
        await uomInput.press('ArrowDown');
        await uomInput.press('Enter');

        // Enter commits the value and the row exits edit mode, removing the input the
        // dropdown was anchored to - but the visual ui-autocomplete overlay can outlive
        // it and never close itself. Dismiss it at the page level (the input may already
        // be gone) and re-enter the row so the tax/price fields below are editable again.
        await this.page.keyboard.press('Escape');
        await rowElement.click({ timeout: 30_000 });

        // 3. Update Tax Status
        const taxSelect = this.page.locator(`xpath=${rowXpath}//td[@name='tax_status']//select`);
        await taxSelect.selectOption({ label: 'Yes' });

        // 4. Update Price
        const priceInput = this.page.locator(`xpath=${rowXpath}//td[@name='list_price']//input`);
        await priceInput.fill(Cost);

        await this.preventiveCases.click();
      }

      try {
        const errorMsg = this.page.locator("xpath=//div[@class='o_dialog']//p");
        await errorMsg.waitFor({ state: 'visible', timeout: 30_000 });
        console.log('Validation Error Message: ' + (await errorMsg.innerText()));

        // Dismiss the validation error
        await this.page.locator("xpath=//button[normalize-space()='Close']").click();
        console.log('Validation error dismissed successfully for row ');
        // await this.discard.click();
      } catch (e) {
        console.log('No validation error for row ');
      }

      return this;
    });
  }

  async click_Delete() {
    return test.step('click_Address is clicked successfully', async () => {
      await this.page.waitForTimeout(3000);
      await this.action.click();
      await this.delete.click();
      await this.confirmDelete.click();
      return this;
    });
  }

  async click_preventivecase(phone, mail, desc, comm) {
    return test.step('Preventive cases  is clicked successfully', async () => {
      await this.page.waitForTimeout(3000);
      await this.preventiveCases.click();
      await this.preventivecasesAdd.click();

      // await this.caseOrigin.click();
      /* await this.caseOrigin.click({ force: true });
      await this.originSelect.click();
      await this.reportedPhone.fill(phone);
      await this.reportedEmail.fill(mail);
      // await this.assignedTo.click();
      await this.assignedTo.click({ force: true });
      await this.toSelect.click(); */

      await this.caseCategory.click();
      await this.caseSelect.click();
      await this.type.click();
      await this.typeSelect.click();

      /* await this.route.click();
      await this.routeSelect.click();
      await this.billable.click({ force: true });
      await this.equipment.click();
      await this.equipSelect.click(); */

      await this.description.fill(desc);

      /* await this.comment.fill(comm);
      await this.damagedPro.click();
      await this.addLine.click();
      await this.product.click();
      await this.machineSelect.click();
      await this.quantSelect.fill('2'); */

      await this.saveBtn.click();
      return this;
    });
  }

  async click_notes(internal, special) {
    return test.step('CustomerCare click_notes is clicked successfully', async () => {
      await this.page.waitForTimeout(3000);
      await this.notes.click();
      await this.internalNotes.fill(internal);
      await this.specialNotes.fill(special);
      await this.equipments.click();
      return this;
    });
  }

  async click_accountSetup(acc, cardnum, cardname, checkno, chqamt) {
    return test.step('CustomerCare accountSetup  is clicked successfully', async () => {
      await this.page.waitForTimeout(3000);
      await this.accountSetUp.click();
      await this.control.click();
      await this.controlSelect.click();

      await this.addBank.click();
      await this.bank.waitFor({ state: 'visible', timeout: 30_000 });
      await this.bank.click();
      await this.bankSelect.waitFor({ state: 'visible', timeout: 30_000 });
      await this.bankSelect.click();
      await this.page.waitForTimeout(2000);
      await this.accNum.fill(acc);

      await this.addCard.click();
      await this.bank1.waitFor({ state: 'visible', timeout: 30_000 });
      await this.bank1.click();
      await this.bankSelect1.waitFor({ state: 'visible', timeout: 30_000 });
      await this.bankSelect1.click();
      await this.page.waitForTimeout(2000);
      await this.cardNum.fill(cardnum);
      await this.cardName.fill(cardname);

      await this.addCheck.click();
      await this.checkNum.waitFor({ state: 'visible', timeout: 30_000 });
      await this.checkNum.fill(checkno);
      await this.checkAmt.fill(chqamt);
      await this.checkBank.click();
      await this.bankSelect3.waitFor({ state: 'visible', timeout: 30_000 });
      await this.bankSelect3.click();
      await this.page.waitForTimeout(2000);

      await this.finalSaveBtn.click();
      return this;
    });
  }
}

module.exports = { CustomerCareAddress };
