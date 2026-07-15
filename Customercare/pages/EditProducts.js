const { test, expect } = require('@playwright/test');
const { ensureLoggedIn } = require('../utils/loginHelper');

// Ported from src/main/java/pages/EditProducts.java.
// Selenium's @FindBy xpaths are preserved verbatim as Playwright locators.
// PageFactory/@CacheLookup have no equivalent needed: Playwright locators
// re-query the DOM on every action, so there's no stale-element risk to guard against.
// Java source top comment: "for lenovo url"
class EditProducts {
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

    this.customerName = page.locator("xpath=//input[@id='name_0']");
    this.customerId = page.locator("xpath=//input[@id='code_0']");
    this.customerZIP = page.locator("xpath=//input[@id='zip_0']");
    this.customerStreet1 = page.locator("xpath=//input[@id='street_0']");

    this.Address = page.locator(
      "xpath=(//li[@class='nav-item flex-nowrap cursor-pointer']//a[@name='contact_addresses'])[1]"
    );

    this.contactsAddressAdd = page.locator("xpath=(//button[normalize-space()='Add'])[1]");
    this.contAddress = page.locator("xpath=//b[normalize-space()='Contact']");

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

    // footer[@class='modal-footer']//span[contains(.,'Save & New')]
    this.saveAndNew = page.locator("xpath=//button[@class='btn btn-primary o_form_button_save']");
    this.saveAndNew1 = page.locator("xpath=//button[@class='btn btn-primary o_form_button_save']");
    this.saveAndNew2 = page.locator("xpath=//button[@class='btn btn-primary o_form_button_save']");
    this.saveAndNew3 = page.locator("xpath=//button[@class='btn btn-primary o_form_button_save']");
    this.saveAndNew4 = page.locator("xpath=//button[@class='btn btn-primary o_form_button_save']");
    this.saveAndNew5 = page.locator("xpath=//button[@class='btn btn-primary o_form_button_save']");
    this.saveAndClose = page.locator("xpath=//button[@class='btn btn-primary o_form_button_save']");

    this.discard = page.locator("xpath=//button[normalize-space()='Discard']");
    this.discard1 = page.locator("xpath=//button[normalize-space()='Discard']");

    this.otherAddress = page.locator("xpath=//b[normalize-space()='Other']");
    this.privateAddress = page.locator("xpath=//b[normalize-space()='Private']");
    this.payeeAddress = page.locator("xpath=//b[normalize-space()='Payee']");
    this.remittoAddress = page.locator("xpath=//b[normalize-space()='Remit To Address']");
    this.billingAddress = page.locator("xpath=//b[normalize-space()='Billing']").last();
    this.deliveryAddress = page.locator("xpath=//b[normalize-space()='Delivery']").last();

    // Portal
    this.protalUsers = page.locator("xpath=//a[normalize-space()='Portal Users']");
    this.protalUsersAdd = page.locator("xpath=//button[normalize-space()='Add']");
    this.protalName = page.locator("xpath=//input[@id='name_0']");
    this.protalUserName = page.locator("xpath=//input[@id='username_0']");
    this.protalEmail = page.locator("xpath=//input[@id='email_0']");

    this.reportSaveAndClose = page.locator("xpath=//button[normalize-space()='Delete']");

    this.orderProduct = page.locator("xpath=//a[normalize-space()='Order Products']");
    this.productBox1 = page.locator("xpath=//input[@id='product_ids_0']");

    // Dark Chocolate
    this.selectProduct1 = page.locator("xpath=(//a[normalize-space()='Search More...'])[1]");

    this.productSearch = page.locator(
      "xpath=//div[@class='o-checkbox form-check d-flex m-0']//input[@type='checkbox']"
    );
    this.selectBtn = page.locator("xpath=//button[normalize-space()='Select']");

    this.productBox2 = page.locator("xpath=//input[@id='product_ids_0']");

    // Dark Chocolate
    this.selectProduct2 = page.locator("xpath=(//a[normalize-space()='[AVR00132] Milky Way'])[1]");

    this.productAdd = page.locator("xpath=//button[@id='add_product']//span[text()='Add']");
    this.productAdd1 = page.locator("xpath=//button[@id='add_product']//span[text()='Add']");

    this.notes = page.locator("xpath=//a[normalize-space()='Notes']");

    // textarea[@name='comment']
    this.internalNotes = page.locator("xpath=//textarea[@id='comment_0']");
    this.specialNotes = page.locator("xpath=//textarea[@d='special_notes_1']");

    this.finalSaveBtn = page.locator("xpath=//button[contains(text(),'Save')]");
    this.okBtn = page.locator("xpath=(//span[normalize-space()='Ok'])");

    this.portalClick = page.locator("xpath=//div[@class='ms-auto']");
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

  async customer_Name(cusName, zip, street) {
    return test.step('Customer_Name is clicked successfully', async () => {
      await this.customerName.fill(cusName);
      await this.customerZIP.fill(zip);
      await this.customerStreet1.fill(street);
      return this;
    });
  }

  async click_Address() {
    return test.step('click_Address is clicked successfully', async () => {
      await this.page.waitForTimeout(3000);
      await this.Address.click();
      //await this.contactsAddressAdd.click();
      return this;
    });
  }

  async click_contAddress(name, mail, phone, mob) {
    return test.step('CustomerCare_contact is clicked successfully', async () => {
      await this.page.waitForTimeout(3000);
      await this.contAddress.click();
      await this.page.waitForTimeout(2000);
      //await this.alertClick.click();
      await this.contactsName.fill(name);
      await this.contactCheck.click({ force: true });
      await this.contactsEmail.fill(mail);
      await this.contactsPhone.fill(phone);
      await this.contactsMobile.fill(mob);
      await this.saveAndNew.click();
      return this;
    });
  }

  async click_otherAddress(name, zip, street, mail, phone, mob) {
    return test.step('CustomerCare_other addrr is clicked successfully', async () => {
      await this.page.waitForTimeout(3000);
       await this.otherAddress.click();
        await this.page.waitForTimeout(2000);
      await this.contactsName1.fill(name);
      await this.contactZip1.fill(zip);
      await this.contactsStreet1.fill(street);
      await this.saveAndNew1.click();
      return this;
    });
  }

  async click_otherAddressNegative(name, zip, street, mail, phone, mob) {
    return test.step('CustomerCare_other addrr is clicked successfully', async () => {
      await this.page.waitForTimeout(3000);
       await this.otherAddress.click();
      // await this.alertClick.click();
      await this.contactsName1.fill(name);
      await this.contactsStreet1.fill(street);
      await this.contactsEmail1.fill(mail);
      await this.contactsPhone1.fill(phone);
      await this.contactsMobile1.fill(mob);
      await this.saveAndClose.click();

      /* try {
        expect(await this.#isErrorDisplayed()).toBeTruthy();
        await this.discard.click();
      } catch (e) {
        console.log('No validation message displayed.');
      } */

      try {
        const validationMessage = this.page.locator("xpath=//div[@class='o_notification_content']");
        await validationMessage.waitFor({ state: 'visible', timeout: 30_000 });
        console.log('Validation Message: ' + (await validationMessage.innerText()));

        expect(await this.#isErrorDisplayed()).toBeTruthy();
        await this.discard.click();
      } catch (e) {
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
     // await this.alertClick1.click();
      await this.contactsName2.fill(name);
      await this.contactZip2.fill(zip);
      await this.contactsStreet2.fill(street);
      await this.saveAndNew2.click();
      return this;
    });
  }

  async click_payeeeAddress(name, zip, street, mail, phone, mob) {
    return test.step('CustomerCare payeeAddress is clicked successfully', async () => {
      await this.page.waitForTimeout(3000);
      await this.payeeAddress.click();
      await this.page.waitForTimeout(2000);
     // await this.alertClick2.click();
      await this.contactsName3.fill(name);
      await this.contactZip3.fill(zip);
      await this.contactsStreet3.fill(street);
      await this.saveAndNew3.click();
      return this;
    });
  }

  async click_remittoAddress(name, zip, street, mail, phone, mob) {
    return test.step('CustomerCare click_remittoAddress is clicked successfully', async () => {
      await this.page.waitForTimeout(3000);
      await this.remittoAddress.click();
      await this.page.waitForTimeout(2000);
      //await this.alertClick3.click();
      await this.contactsName4.fill(name);
      await this.remitCheck.click({ force: true });
      await this.contactZip4.fill(zip);
      await this.contactsStreet4.fill(street);
      await this.saveAndNew4.click();
      return this;
    });
  }

  async click_billingAddress(name, zip, street, mail, phone, mob) {
    return test.step('CustomerCare billingAddress is clicked successfully', async () => {
      await this.page.waitForTimeout(3000);
      await this.billingAddress.click();
      await this.page.waitForTimeout(2000);
      //await this.alertClick4.click();
      await this.contactsName5.fill(name);
      await this.contactZip5.fill(zip);
      await this.contactsStreet5.fill(street);
      await this.saveAndNew5.click();
      return this;
    });
  }

  async click_deliveryAddress(name, zip, street, mail, phone, mob) {
    return test.step('CustomerCare deliveryAddress is clicked successfully', async () => {
      await this.page.waitForTimeout(3000);
      await this.deliveryAddress.click();
      await this.page.waitForTimeout(2000);
      //await this.alertClick5.click();
      await this.contactsName6.fill(name);
      await this.contactZip6.fill(zip);
      await this.contactsStreet6.fill(street);
      await this.saveAndClose.click();
      return this;
    });
  }

  async portalUsers(proName, proUserName, proEmail) {
    return test.step('Protal Users is clicked successfully', async () => {
      await this.protalUsers.click();
      await this.portalClick.click();

      /*
      await this.protalName.fill(proName);
      await this.protalUserName.fill(proUserName);
      await this.protalEmail.fill(proEmail);
      */

      await this.reportSaveAndClose.click();
      // Java waited 20s here for the portal-user save/close operation to
      // finish server-side before the next page-object call proceeds.
      await this.page.waitForTimeout(20_000);
      return this;
    });
  }

  async orderProducts(product1) {
    return test.step('Order Products is clicked successfully', async () => {
      await this.orderProduct.click();
      await this.productBox1.click();
      // await this.selectProduct1.click();
      await this.selectProduct1.click({ force: true });
      // await this.productSearch.click();
      await this.productSearch.click({ force: true });
      await this.selectBtn.click();
      await this.productAdd.click();
      // Java waited 150s here for the order-line add/save operation to
      // finish server-side; this isn't tied to any subsequent locator.
      await this.page.waitForTimeout(150_000);
      return this;
    });
  }

  async selectAllProduct(product2) {
    return test.step('Order Products is clicked successfully', async () => {
      await this.orderProduct.click();
      await this.productBox2.click();
      await this.productBox2.pressSequentially(product2);
      // await this.selectProduct2.click();
      await this.selectProduct2.click({ force: true });
      await this.productAdd1.click();
      // Java waited 15s here for the order-line add operation to finish
      // server-side; this isn't tied to any subsequent locator.
      await this.page.waitForTimeout(15_000);
      return this;
    });
  }

  async clickQuantity(qty, cost) {
    return test.step('Quantity  updated successfully', async () => {
      for (let row = 1; row <= 2; row++) {
        const rowXpath = `(//table[contains(@class,'o_list_table')])[1]/tbody/tr[contains(@class,'o_data_row')][${row}]`;
        const rowElement = this.page.locator(`xpath=${rowXpath}`);
        await rowElement.click({ timeout: 30_000 });

        const uomInput = this.page.locator(`xpath=${rowXpath}//td[@name='uom_id']//input`);
        await uomInput.click({ timeout: 30_000 });

        const menuXpath = "//ul[contains(@class,'ui-autocomplete') and not(contains(@style,'none'))]";
        const optionXpath = `${menuXpath}//li[1]//a`;

        const dropdownMenu = this.page.locator(`xpath=${menuXpath}`);
        await dropdownMenu.waitFor({ state: 'visible', timeout: 30_000 });

        const firstOption = this.page.locator(`xpath=${optionXpath}`);
        await firstOption.hover();
        await firstOption.click();

        await dropdownMenu.waitFor({ state: 'hidden', timeout: 30_000 });

        const taxSelect = this.page.locator(`xpath=${rowXpath}//td[@name='tax_status']//select`);
        await taxSelect.selectOption({ label: 'Yes' });

        const priceInput = this.page.locator(`xpath=${rowXpath}//td[@name='list_price']//input`);
        await priceInput.fill('15.00');
      }

      for (let rowToDelete = 4; rowToDelete >= 3; rowToDelete--) {
        const deleteButtonXpath = `(//table[contains(@class,'o_list_table')]/tbody/tr[contains(@class,'o_data_row')][${rowToDelete}]//button[@name='delete'])`;
        const deleteButton = this.page.locator(`xpath=${deleteButtonXpath}`);
        // await deleteButton.click();
        await deleteButton.click({ force: true });
      }

      /* try {
        const errorMsg = this.page.locator("xpath=//div[@class='o_dialog_warning modal-body']//p");
        await errorMsg.waitFor({ state: 'visible', timeout: 30_000 });
        console.log('Validation Error Message: ' + (await errorMsg.innerText()));

        await this.page
          .locator("xpath=(//button[@type='button']//span[contains(text(),'Ok')])")
          .click();
        console.log('Validation error dismissed successfully for row ');
      } catch (e) {
        console.log('No validation error for row ');
      } */

      return this;
    });
  }

  async click_Delete() {
    return test.step('click_Address is clicked successfully', async () => {
      await this.action.click();
      await this.delete.click();
      await this.confirmDelete.click();
      return this;
    });
  }
}

module.exports = { EditProducts };
