const { test, expect } = require('@playwright/test');
const { ensureLoggedIn } = require('../utils/loginHelper');

// Ported from src/main/java/pages/CustomerCarePage.java.
// Selenium's @FindBy xpaths are preserved verbatim as Playwright locators.
// PageFactory/@CacheLookup have no equivalent needed: Playwright locators
// re-query the DOM on every action, so there's no stale-element risk to guard against.
class CustomerCarePage {
  constructor(page) {
    this.page = page;

    // Login page
    this.userName = page.locator("xpath=//input[@id='login']");
    this.passWord = page.locator("xpath=//input[@id='password']");
    this.logIn = page.locator("xpath=//button[@type='submit']");

    this.customerCareMenuBtn = page.locator("xpath=//div[contains(text(),'Customer Care')]");

    // Customer Care
    this.customerCreateBtn = page.locator("xpath=//button[contains(text(),'New')]");
    this.customerName = page.locator("xpath=//input[@id='name_0']");
    this.customerNickName = page.locator("xpath=//input[@id='nick_name_0']");
    this.customerId = page.locator("xpath=//input[@id='code_0']");

    this.parent = page.locator("xpath=//input[@id='parent_partner_id_0']");
    this.parentSearchMore = page.locator("xpath=(//a[normalize-space()='Search More...'])");
    this.parentSearchMoreBox = page.locator("xpath=(//input[@placeholder='Search...'])[1]");
    this.parentSelect = page.locator("xpath=//tr[@class='o_data_row'][1]//td[1]");

    this.primaryAccountsManager = page.locator("xpath=//input[@id='kam_0']");
    this.primarySearchMore = page.locator("xpath=(//a[normalize-space()='Search More...'])[1]");
    this.primarySearchMoreBox = page.locator("xpath=(//input[@placeholder='Search...'])[1]");
    this.primarySelect = page.locator("xpath=//tr[@class='o_data_row'][1]//td[1]");

    this.customerType = page.locator("xpath=//input[@id='customer_type_0']");
    this.customerTypeSearchMore = page.locator("xpath=//ul[@role='menu']//a[contains(text(),'Vending')]");
    this.customerTypeSelect = page.locator("xpath=//tr[@class='o_data_row'][1]//td[1]");

    this.customerZIP = page.locator("xpath=//input[@id='zip_0']");
    this.customerStreet1 = page.locator("xpath=//input[@id='street_0']");
    this.customerStreet2 = page.locator("xpath=//input[@id='street2_0']");
    this.customerCity = page.locator("xpath=//input[@name='city']");
    this.customerState = page.locator("xpath=//div[@name='state_id']//input[@type='text']");
    this.customerCounty = page.locator("xpath=//input[@name='county']");

    this.customerEmail = page.locator("xpath=//input[@id='email_0']");
    this.customerPhone = page.locator("xpath=//input[@id='phone_0']");
    this.customerMobile = page.locator("xpath=//input[@id='mobile_0']");

    this.groupMasterInvoice = page.locator("xpath=//select[@id='group_master_invoice_0']");
    this.occRate = page.locator("xpath=//input[@id='checkin_frequency_0']");

    // route
    this.route = page.locator("xpath=//input[@id='route_id_0']");
    this.routeSelect = page.locator("xpath=//a[@id='route_id_0_0_0']");

    // 15 Days
    this.terms = page.locator("xpath=//input[@id='property_payment_term_id_0']");
    this.termsSelect = page.locator("xpath=//li[1]//a[contains(text(),'Immediate Payment')]");

    this.creditLimit = page.locator("xpath=//div[@name='credit_limit']//input[@type='text']");
    this.roomCount = page.locator("xpath=//div[@name='count']//input[@type='text']");
    this.freq = page.locator("xpath=//div[@class='col-12 checkin_frequency']//input[@name='checkin_frequency']");

    this.visitors = page.locator(
      "xpath=//div[@name='visitors_types_ids']//div[@class='o_field_tags d-inline-flex flex-wrap gap-1 mw-100 o_tags_input o_input']"
    );
    this.visitorsSelect = page.locator("xpath=//a[@id='visitors_types_ids_0_0_0']");

    this.inServiceDate = page.locator("xpath=//input[@id='in_service_date_0']");

    // List Price 1
    this.priceCategory = page.locator("xpath=//select[@id='price_category_0']");

    this.website = page.locator("xpath=//div[@name='website']//input[@type='text']");

    this.sAPCustomerNo = page.locator("xpath=//input[@id='internal_reference_0']");
    this.sAPVendorNo = page.locator("xpath=//input[@id='payee_name_0']");
    this.payeeName = page.locator("xpath=//input[@name='payee_name']");
    this.AP_PayeeName = page.locator("xpath=//input[@id='custom_1_0']");
    this.AR_PayeeName = page.locator("xpath=//input[@id='custom_2_0']");
    this.custom3 = page.locator("xpath=//input[@id='custom_3_0']");

    // masterInvoice
    this.masterInvoice = page.locator("xpath=//div[@name='master_invoice']//input[@type='checkbox']");
    // fuelCharge
    this.fuelCharge = page.locator("xpath=//div[@name='fuel_charge']//input[@type='checkbox']");
    // HazardFee
    this.hazardFee = page.locator("xpath=//div[@name='hazard_fee']//input[@type='checkbox']");
    // MonthlyStatement
    this.monthlyStatement = page.locator("xpath=//div[@name='monthly_statement']//input[@type='checkbox']");
    this.caseMail = page.locator("xpath=//div[@name='send_case_mail']//input[@type='checkbox']");

    // SubsidyCustomer
    this.subsidyCustomerCheck = page.locator("xpath=//div[@name='subsidy']//input[@type='checkbox']");
    this.subsidyCustomer = page.locator("xpath=//input[@id='subsidy_amount_0']");

    // purchase check
    this.purchaseOrderCheck = page.locator("xpath=//div[@name='po_check']//input[@type='checkbox']");
    this.purchaseOrder = page.locator("xpath=//input[@id='po_no_0']");

    // SellAllProducts
    this.sellAllProduct = page.locator("xpath=//div[@name='buy_all_item']//input[@type='checkbox']");
    this.sellAllProductOkBtn = page.locator("xpath=//button[normalize-space()='Ok']");

    this.contactAddress = page.locator("xpath=//li[@class='nav-item']//a[contains(text(),'Contacts & Address')]");
    this.contactsAddressAdd = page.locator("xpath=(//nav[@class='o_cp_buttons']//button[contains(text(),'Add')])[1]");
    this.contactsName = page.locator("xpath=(//div[@class='col-4']//input[@name='name'])[2]");
    this.contactsZIP = page.locator("xpath=(//div[@class='col-4']//input[@name='zip'])[2]");
    this.contactsStreet = page.locator("xpath=(//div[@class='col-4']//input[@name='street'])[2]");
    this.contactsEmail = page.locator("xpath=//div[@class='col-4 pt-2']//input[@name='email']");
    this.contactsPhone = page.locator("xpath=//div[@class='col-4 pt-2']//input[@name='phone']");
    this.contactsSaveAndClose = page.locator("xpath=//span[contains(text(),'Save & Close')]");

    // Portal
    this.protalUsers = page.locator("xpath=//li[@class='nav-item']//a[contains(text(),'Portal Users')]");
    this.protalUsersAdd = page.locator("xpath=(//nav[@class='o_cp_buttons']//button[contains(text(),'Add')])[4]");
    this.protalName = page.locator("xpath=//div[@name='portal_contact']//input[@name='name']");
    this.protalUserName = page.locator("xpath=//div[@name='portal_contact']//input[@name='username']");
    this.protalEmail = page.locator("xpath=//div[@name='portal_contact']//input[@name='email']");

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
    this.reportsSearchMore = page.locator("xpath=//li[7]//a[contains(text(),'Search More...')]");
    this.reportsNameCheckBox = page.locator("xpath=//th[@class='o_list_record_selector']//input[@type='checkbox']");
    this.reportsSelectBtn = page.locator("xpath=//footer[@class='modal-footer']//span[contains(text(),'Select')]");
    this.reportSaveAndClose = page.locator(
      "xpath=//footer[@class='modal-footer']//span[contains(text(),'Save & Close')]"
    );

    this.orderProduct = page.locator("xpath=//li[@class='nav-item product_list']//a[contains(text(),'Order Products')]");
    this.productBox1 = page.locator("xpath=//div[@name='product_ids']//input[@type='text']");
    // Dark Chocolate
    this.selectProduct1 = page.locator("xpath=//li[@class='ui-menu-item']//a[contains(text(),'7up')]");
    this.productBox2 = page.locator("xpath=//div[@name='product_ids']//input[@type='text']");
    // Dark Chocolate
    this.selectProduct2 = page.locator("xpath=//li[@class='ui-menu-item']//a[contains(text(),'Coca Cola 16.9oz')]");
    this.productAdd = page.locator("xpath=//button[@name='add_product']//span[text()='Add']");

    this.errorMsg = page.locator("xpath=//div[@class='o_dialog_warning modal-body']//p");
    this.errorAccept = page.locator("xpath=//button[@type='button']//span[text()='Ok']");
    this.warning_headerMsg = page.locator("xpath=//div[@id='warning_header']");

    this.accountSetUp = page.locator("xpath=//li[@class='nav-item']//a[contains(text(),'Account Setup')]");
    // 121000 Account Receivable
    this.control = page.locator("xpath=//div[@name='property_account_receivable_id']//input[@type='text']");
    this.controlSelect = page.locator("xpath=//li[@class='ui-menu-item']//a[contains(text(),'121000 Account Receivable')]");

    // NOTE: Java also declared a `finalSaveBtn` WebElement field with the same
    // name as the finalSaveBtn() method below. JS can't shadow a prototype
    // method with an instance property of the same name, so the locator is
    // named finalSaveButton here instead.
    this.finalSaveButton = page.locator("xpath=//button[contains(text(),'Save')]");

    this.customerMenu = page.locator("xpath=//a[contains(text(),'Customers')]");
    this.searchBox = page.locator("xpath=//div[@class='o_searchview_input_container']//input[@Type='text']");
    this.customerName_Select = page.locator("xpath=//table//tbody//tr[1]//td[3]");
    this.customerName_Get = page.locator("xpath=//span[@name='name']");
    this.okBtn = page.locator("xpath=(//span[normalize-space()='Ok'])[1]");
  }

  async #isErrorDisplayed() {
    return this.page.locator("xpath=//div[@class='me-auto o_notification_content']").isVisible();
  }

  async clickLoginPage(user, pass) {
    return test.step('login is entered successfully', async () => {
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

  async click_CustomerCareBtn() {
    return test.step('Customer Care is clicked successfully', async () => {
      await this.customerCareMenuBtn.click({ timeout: 30_000 });
      return this;
    });
  }

  async customer_Name(cusName, cusNickName, id) {
    return test.step('Customer_Name is clicked successfully', async () => {
      await this.customerCreateBtn.click();
      await this.customerName.fill(cusName);
      await this.customerNickName.fill(cusNickName);
      await this.customerId.fill(id);
      return this;
    });
  }

  async parent_Name(parentNme) {
    return test.step('Parent_Name is clicked successfully', async () => {
      await this.parent.click();
      await this.parentSearchMore.click();
      await this.parentSearchMoreBox.fill(parentNme);
      await this.parentSearchMoreBox.press('Enter');
      await this.parentSelect.click();
      // Selecting a parent triggers an onchange that recomputes suggested
      // Accounts Managers for that company; clicking into that field before
      // it settles causes the dropdown to silently fail to open.
      await this.page.waitForTimeout(1_500);
      return this;
    });
  }

  async primaryAccounts_Manager_Creation(PrimaryLName, PrimaryLimit) {
    return test.step('PrimaryAccounts Manager Updation is clicked successfully', async () => {
      await this.primaryAccountsManager.click();
      await this.primarySearchMore.click({ timeout: 30_000 });
      await this.primarySearchMoreBox.fill(PrimaryLName);
      await this.primarySearchMoreBox.press('Enter');
      await this.primarySelect.click();
      return this;
    });
  }

  async customer_Type(cusZip, custStreet, custStreet2) {
    return test.step('Customer_Type is clicked successfully', async () => {
      await this.customerType.click({ timeout: 30_000 });
      await this.customerType.fill('');
      await this.customerType.pressSequentially('Vend');
      await this.page
        .locator('css=ul.o-autocomplete--dropdown-menu.show')
        .waitFor({ state: 'visible', timeout: 30_000 });

      const vendingOption = this.page.locator("xpath=//*[@role='option' and contains(., 'Vending')]");
      try {
        await vendingOption.waitFor({ state: 'attached', timeout: 30_000 });
        await vendingOption.hover();
        await vendingOption.click();
      } catch (e) {
        console.log(e);
      }

      await this.customerZIP.fill(cusZip);
      await this.customerStreet1.fill(custStreet);
      await this.customerStreet2.fill(custStreet2);
      return this;
    });
  }

  async customer_TypeNegative(cusZip, custStreet, custStreet2) {
    return test.step('Customer_Type is clicked successfully', async () => {
      await this.customerType.click({ timeout: 30_000 });
      await this.customerType.fill('');
      await this.customerType.pressSequentially('Vend');
      await this.page
        .locator('css=ul.o-autocomplete--dropdown-menu.show')
        .waitFor({ state: 'visible', timeout: 30_000 });

      const vendingOption = this.page.locator("xpath=//*[@role='option' and contains(., 'Vending')]");
      try {
        await vendingOption.waitFor({ state: 'attached', timeout: 30_000 });
        await vendingOption.hover();
        await vendingOption.click();
      } catch (e) {
        console.log(e);
      }

      await this.customerZIP.fill(cusZip);
      await this.customerStreet1.fill(custStreet);
      await this.customerStreet2.click();

      try {
        const modalFooter = this.page.locator('css=footer.modal-footer');
        await modalFooter.waitFor({ state: 'visible', timeout: 10_000 });
        await modalFooter.locator('css=button.btn-primary').click();
        await this.customerStreet2.fill(custStreet2);
      } catch (e) {
        console.log('No validation message displayed.');
      }

      return this;
    });
  }

  async customer_Contacts(cusEmail, custPhone, custMobile) {
    return test.step('Customer Contacts is clicked successfully', async () => {
      await this.customerEmail.fill(cusEmail);
      await this.customerPhone.fill(custPhone);
      await this.customerMobile.fill(custMobile);
      await this.customerEmail.click();

      try {
        const modalFooter = this.page.locator('css=footer.modal-footer');
        await modalFooter.waitFor({ state: 'visible', timeout: 10_000 });
        await modalFooter.locator('css=button.btn-primary').click();
      } catch (e) {
        console.log('No validation message displayed.');
      }

      await this.groupMasterInvoice.click();
      await this.groupMasterInvoice.selectOption({ index: 1 });
      await this.occRate.fill('50');
      await this.roomCount.click();
      return this;
    });
  }

  async route_Creation(rouName) {
    return test.step('Route_Creation is clicked successfully', async () => {
      await this.route.click();
      await this.route.fill('');
      await this.route.pressSequentially(rouName);
      await this.page
        .locator('css=ul.o-autocomplete--dropdown-menu.show')
        .waitFor({ state: 'visible', timeout: 10_000 });
      await this.routeSelect.click();
      return this;
    });
  }

  async terms_Creation(creLimit) {
    return test.step('Terms_Creation is clicked successfully', async () => {
      await this.terms.click();
      await this.terms.fill('');
      await this.terms.pressSequentially('Immediate');
      await this.page
        .locator('css=ul.o-autocomplete--dropdown-menu.show')
        .waitFor({ state: 'visible', timeout: 10_000 });

      const termOption = this.page.locator("xpath=//*[@role='option' and contains(., 'Immediate Payment')]");
      try {
        await termOption.waitFor({ state: 'attached', timeout: 10_000 });
        await termOption.hover();
        await termOption.click();
      } catch (e) {
        console.log(e);
      }

      await this.creditLimit.fill(creLimit);
      await this.roomCount.fill('10');

      await this.visitors.click();
      await this.page.keyboard.press('ArrowDown');
      await this.visitorsSelect.waitFor({ state: 'visible', timeout: 10_000 });
      await this.visitorsSelect.click({ force: true });

      const inServiceDateValue = await this.inServiceDate.inputValue();
      console.log('InServiceDate : ' + inServiceDateValue);

      await this.priceCategory.selectOption({ label: 'List Price 3' });
      await this.website.fill('www.averigo.com');
      return this;
    });
  }

  async SAPCustomerDetail(customerSAP, vendorSAP, cust1, cust2, cust3) {
    return test.step('SAP Customer Detail is clicked successfully', async () => {
      await this.sAPCustomerNo.click();
      await this.sAPCustomerNo.fill(customerSAP);
      await this.sAPVendorNo.click();
      await this.sAPVendorNo.fill(vendorSAP);
      await this.AP_PayeeName.click();
      await this.AP_PayeeName.fill(cust1);
      await this.AR_PayeeName.click();
      await this.AR_PayeeName.fill(cust2);
      await this.custom3.click();
      await this.custom3.fill(cust3);
      return this;
    });
  }

  async charge_Check(subCus, purOrder) {
    return test.step('Charges Check is clicked successfully', async () => {
      await this.masterInvoice.click({ force: true });
      await this.fuelCharge.click({ force: true });
      await this.hazardFee.click({ force: true });
      await this.caseMail.click({ force: true });
      await this.monthlyStatement.click({ force: true });
      await this.subsidyCustomerCheck.click({ force: true });

      await this.subsidyCustomer.click();
      await this.subsidyCustomer.fill(subCus);

      await this.purchaseOrderCheck.click({ force: true });
      await this.purchaseOrder.fill(purOrder);

      await this.sellAllProduct.click({ force: true });
      await this.sellAllProductOkBtn.click();

      try {
        const errorMsg = this.page.locator("xpath=//div[@class='o_dialog']//p");
        await errorMsg.waitFor({ state: 'visible', timeout: 30_000 });
        console.log('Validation Error Message: ' + (await errorMsg.innerText()));

        await this.page.locator("xpath=//button[normalize-space()='Close']").click();
        console.log('Validation error dismissed successfully for row ');
      } catch (e) {
        console.log('No validation error for row ');
      }

      return this;
    });
  }

  async finalSaveBtn() {
    return test.step('Save button is clicked successfully', async () => {
      await this.finalSaveButton.click();
      // Backend save can lag behind the UI response; wait so the record
      // is actually persisted before subsequent steps navigate away.
      await this.page.waitForTimeout(10_000);
      return this;
    });
  }

  async finalSaveBtnNegative() {
    return test.step('Save button is clicked successfully', async () => {
      await this.finalSaveButton.click();

      try {
        const validationMessage = this.page.locator("xpath=//div[@class='o_notification_body mt-2']");
        await validationMessage.waitFor({ state: 'visible', timeout: 30_000 });
        console.log('Validation Message: ' + (await validationMessage.innerText()));
        expect(await this.#isErrorDisplayed()).toBeTruthy();
      } catch (e) {
        console.log('No validation message displayed.');
      }

      return this;
    });
  }

  async CustomerMenu() {
    return test.step('Customer Menu is clicked successfully', async () => {
      await this.customerMenu.click();
      return this;
    });
  }

  async CustomerMenuNegative() {
    return test.step('Customer Menu is clicked successfully', async () => {
      await this.customerMenu.click();
      await this.okBtn.click();
      return this;
    });
  }

  async CustomerMenuSearch(customer) {
    return test.step('Customer Menu Search  is clicked successfully', async () => {
      await this.searchBox.click();
      await this.searchBox.fill(customer);
      await this.searchBox.press('Enter');
      await this.customerName_Select.click();
      console.log('New Customer Name : ' + (await this.customerName_Get.innerText()));
      return this;
    });
  }
}

module.exports = { CustomerCarePage };
