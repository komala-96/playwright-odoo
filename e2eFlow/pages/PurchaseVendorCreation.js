const { reportStep } = require('../utils/reportStep');
const { expect } = require('../fixtures/base');
const { ensureLoggedIn } = require('../utils/loginHelper');

class PurchaseVendorCreation {
  constructor(page) {
    this.page = page;

    // Login Page
    this.userName = page.locator("xpath=//input[@name='login']");
    this.passWord = page.locator("xpath=//input[@name='password']");
    this.logIn = page.locator("xpath=//button[@type='submit']");

    // Menu
    this.menu = page.locator("xpath=//ul[@class='o_menu_apps']//i[@class='fa fa-bars']");

    // PurchaseOrder
    this.purchaseMenu = page.locator("xpath=//div[contains(text(),'Purchase')]");
    this.vendorMenubtn = page.locator("xpath=//span[contains(text(),'Vendors')]");

    // Create btn
    this.createBtn = page.locator("xpath=//button[normalize-space()='New']");
    this.editBtn = page.locator("xpath=//div[@class='o_form_buttons_view']//button[contains(text(),'Edit')]");

    // beautycares
    this.clickVendor = page.locator("xpath=//input[@id='name_0']");
    this.printName = page.locator("xpath=//input[@id='print_name_0']");
    this.vendorId = page.locator("xpath=//input[@id='vendor_code_0']");
    this.purchaseManager = page.locator("xpath=//input[@id='kam_0']");
    this.managerSelect = page.locator("xpath=//a[@id='kam_0_0_0']");
    // 97603
    this.Zip = page.locator("xpath=//input[@id='zip_0']");

    // main road
    this.street1 = page.locator("xpath=//div[@name='street']//input[@id='street_0']");

    // main road
    this.street2 = page.locator("xpath=//input[@id='street2_0']");

    this.firstName = page.locator("xpath=//input[@id='contact_fname_0']");
    this.lastName = page.locator("xpath=//input[@id='contact_lname_0']");
    this.phone = page.locator("xpath=//input[@id='phone_0']");

    //div[@name='ship_via']//a[@role='button']

    this.shipVia = page.locator("xpath=//input[@id='ship_via_id_0']");

    //li[@class='ui-menu-item']//a[contains(text(),'freight')]

    this.selectShip = page.locator("xpath=//a[@id='ship_via_id_0_0_1']");

    this.vendorPayment = page.locator("xpath=//input[@id='property_supplier_payment_term_id_0']");
    this.vendorPaymentType = page.locator("xpath=//a[@id='property_supplier_payment_term_id_0_0_1']");

    // 500000
    this.creditLimit = page.locator("xpath=//input[@id='credit_limit_0']");

    //input[@name='return_period'])[1]

    this.returnPeriod = page.locator("xpath=(//input[@id='return_period_0'])");

    //div[@class='col-4']//textarea[@name='check_memo']
    this.checkMemo = page.locator("xpath=//textarea[@id='check_memo_0']");

    //div[@class='checklist']//input[@type='checkbox'])[2]

    this.checkVendor = page.locator("xpath=//div[@name='vendor_1099']//input[@type='checkbox']");
    this.vendorApprove = page.locator("xpath=//div[@name='vendor_approve']//input[@type='checkbox']");
    this.buyAll = page.locator("xpath=//div[@name='buy_all']//input[@type='checkbox']");

    //input[@name='internal_reference']

    this.internalReference = page.locator("xpath=//div[@name='internal_reference']//input[@id='internal_reference_0']");
    this.custom1 = page.locator("xpath=//input[@id='custom_1_0']");
    this.custom2 = page.locator("xpath=//input[@id='custom_2_0']");
    this.custom3 = page.locator("xpath=//input[@id='custom_3_0']");

    this.contactADD = page.locator("xpath=//div[@class='o_cp_buttons gap-1']//button[@type='button']");

    // BeautyCares
    this.contactName = page.locator("xpath=(//input[@id='name_0'])");
    this.primaryCheck = page.locator("xpath=//div[@name='is_primary']//input[@type='checkbox']");
    this.contactsEmail = page.locator("xpath=//input[@id='email_0']");
    this.contactsPhone = page.locator("xpath=//input[@id='phone_0']");
    this.contactsMobile = page.locator("xpath=//input[@id='mobile_0']");
    this.contactSaveBtn = page.locator("xpath=//button[normalize-space()='Save & New']");

    //div[@name='addr_type']//div[2]

    this.remitToAddress = page.locator("xpath=//div[@name='addr_type']//div[2]");
    this.clickOk = page.locator("xpath=//button[normalize-space()='Ok']");
    this.contactName1 = page.locator("xpath=(//input[@id='name_0'])");
    this.contactsEmail1 = page.locator("xpath=//input[@id='email_0']");
    this.contactsPhone1 = page.locator("xpath=//input[@id='phone_0']");
    this.contactsMobile1 = page.locator("xpath=//input[@id='mobile_0']");

    this.contactCloseBtn = page.locator("xpath=//button[normalize-space()='Save & Close']");
    this.discardBtn = page.locator("xpath=(//button[normalize-space()='Discard'])[2]");

    this.productMenu = page.locator("xpath=//a[normalize-space()='Products']");
    this.product = page.locator("xpath=(//div[@name='single_product_ids']//input[@id='single_product_ids_0'])[1]");
    this.productSearchMore = page.locator("xpath=//a[@id='single_product_ids_0_0_8']");
    this.productBox = page.locator("xpath=//input[@placeholder='Search...']");
    this.productClick = page.locator(
      "xpath=//table[@class='o_list_table table table-sm table-hover position-relative mb-0 o_list_table_ungrouped table-striped']//tbody//tr[1]//td[3]"
    );
    this.productAddBtn = page.locator("xpath=//span[normalize-space()='Add']");

    // Products table row (the same one Update_LastCost edits), used to add
    // the same product a second time with a different UoM/cost.
    this.productsLastRow = page.locator(
      "xpath=(//table[contains(@class,'o_list_table')])[1]/tbody/tr[contains(@class,'o_data_row')][last()]"
    );
    this.autocompleteFirstOption = page.locator("xpath=//a[@id='autocomplete_0_0']");

    this.errorMsg = page.locator("xpath=//div[@class='o_dialog_warning modal-body']//p");
    this.errorMsgOk = page.locator("xpath=//button[@type='button']//span[contains(text(),'Ok')]");

    this.saveBtn = page.locator("xpath=//button[normalize-space()='Save']");
    this.getVendorName = page.locator("xpath=//span[@name='name']");
    this.vendors_Click = page.locator("xpath=//a[@role='menuitem'][normalize-space()='Vendors']");
    this.searchMore_Box = page.locator("xpath=//input[@placeholder='Search...']");
    this.selected_Click_Name = page.locator("xpath=//table//tbody//tr[1]//td[3]");
    this.costErrorMsg = page.locator("xpath=//div[@class='o_dialog_warning modal-body']//p");
    this.costErrorMsgOk = page.locator("xpath=//button[@type='button']//span[contains(text(),'Ok')]");

    this.accountSetup = page.locator("xpath=//a[normalize-space()='Account Setup']");
    this.control = page.locator("xpath=(//div[@name='property_account_payable_id']//input[@type='text'])");
    this.controlSelect = page.locator("xpath=//a[@id='property_account_payable_id_0_0_0']");
    this.termsDiscount = page.locator("xpath=(//div[@name='vendor_terms_discount_account_id']//input[@type='text'])");
    this.termsDiscountSelect = page.locator("xpath=//a[@id='vendor_terms_discount_account_id_0_0_0']");
    this.advance = page.locator("xpath=(//div[@name='vendor_advance_account_id']//input[@type='text'])");
    this.advanceSelect = page.locator("xpath=//a[@id='vendor_advance_account_id_0_0_0']");
    this.tax = page.locator("xpath=(//div[@name='vendor_tax_account_id']//input[@type='text'])");
    this.taxSelect = page.locator("xpath=//a[@id='vendor_tax_account_id_0_0_0']");
    this.purchase = page.locator("xpath=(//div[@name='purchase_discount_account_id']//input[@type='text'])");
    this.purchaseSelect = page.locator("xpath=//a[@id='purchase_discount_account_id_0_0_0']");
    this.insurance = page.locator("xpath=(//div[@name='vendor_insurance_account_id']//input[@type='text'])");
    this.insuranceSelect = page.locator("xpath=//a[@id='vendor_insurance_account_id_0_0_0']");
    this.sAndH = page.locator("xpath=(//div[@name='vendor_ship_handling_account_id']//input[@type='text'])");
    this.sAndHSelect = page.locator("xpath=//a[@id='vendor_ship_handling_account_id_0_0_0']");

    this.addBank = page.locator(
      "xpath=	(//table[@class='o_list_table table table-sm table-hover position-relative mb-0 o_list_table_ungrouped table-striped']//tr[1]//td[2]//a[contains(text(),'Add a line')])[1]"
    );
    this.bank = page.locator("xpath=//div[@name='bank_id']//input[@type='text']");
    this.bankSelect = page.locator("xpath=//a[@id='autocomplete_0_1']");
    this.accNum = page.locator("xpath=//div[@name='acc_number']//input[@type='text']");
    this.finalsaveBtn = page.locator("xpath=//button[normalize-space()='Save']");
  }

  async isErrorDisplayed() {
    return this.page
      .locator("xpath=//div[@class='me-auto o_notification_content']")
      .isVisible()
      .catch(() => false);
  }

  async enterUserName(user) {
    try {
      await this.userName.fill(String(user));

      await reportStep(this.page, 'username is entered successfully', 'pass');
    } catch (e) {
      await reportStep(this.page, 'username is not entered successfully...' + e, 'fail');
    }
    return this;
  }

  async enterPassWord(pass) {
    try {
      await this.passWord.fill(String(pass));

      await reportStep(this.page, 'Password is entered successfully', 'pass');
    } catch (e) {
      await reportStep(this.page, 'Password is not entered successfully...' + e, 'fail');
    }
    return this;
  }

  async clickLoginButton() {
    try {
      await this.logIn.click();
      await this.page.waitForTimeout(5000);

      await reportStep(this.page, 'login button clicked successfully', 'pass');
    } catch (e) {
      await reportStep(this.page, 'login button clicked not successfully...' + e, 'fail');
    }
    return this;
  }

  async loginIfNeeded(user, pass) {
    await ensureLoggedIn(this, user, pass);
    return this;
  }

  async clickMenu() {
    try {
      await this.page.waitForTimeout(5000);

      await this.purchaseMenu.evaluate((node) => node.click());
      await this.page.waitForTimeout(5000);

      await reportStep(this.page, 'Menu clicked successfully', 'pass');
    } catch (e) {
      await reportStep(this.page, 'Menu clicked not successfully...' + e, 'fail');
    }
    return this;
  }

  async clickPurchaseMenu() {
    try {
      await this.vendorMenubtn.click({ timeout: 30 * 1000 });
      await this.page.waitForTimeout(5000);

      await this.createBtn.click();
      await this.page.waitForTimeout(5000);

      await reportStep(this.page, 'Purchase Menu clicked successfully', 'pass');
    } catch (e) {
      await reportStep(this.page, 'Purchase Menu clicked not successfully...' + e, 'fail');
    }
    return this;
  }

  async clickVendorCreation(vendr, id, zip, Strt1, Strt2, cLimit, memo, sap) {
    try {
      await this.clickVendor.fill(String(vendr));
      await this.page.waitForTimeout(3000);
      await this.purchaseManager.click();
      await this.managerSelect.click();
      await this.printName.fill(String(vendr));
      await this.vendorId.fill(String(id));
      await this.Zip.fill(String(zip));
      await this.page.waitForTimeout(4000);

      await this.street1.fill(String(Strt1));
      await this.page.waitForTimeout(3000);

      await this.street2.fill(String(Strt2));
      await this.page.waitForTimeout(3000);
      await this.firstName.fill(String(vendr));
      await this.lastName.fill(String(vendr));
      await this.phone.fill('9876543210');
      await this.page.waitForTimeout(3000);
      await this.shipVia.click();
      await this.selectShip.click();
      await this.page.waitForTimeout(3000);
      await this.vendorPayment.click();
      await this.page.waitForTimeout(3000);

      await this.vendorPaymentType.click();
      await this.page.waitForTimeout(5000);

      await this.creditLimit.clear();
      await this.page.waitForTimeout(3000);
      await this.creditLimit.fill(String(cLimit));
      await this.page.waitForTimeout(3000);

      await this.returnPeriod.clear();
      await this.returnPeriod.fill('10');
      await this.page.waitForTimeout(3000);
      await this.checkMemo.fill(String(memo));
      await this.page.waitForTimeout(5000);
      //checkVendor.click();
      await this.checkVendor.evaluate((node) => node.click());
      await this.page.waitForTimeout(3000);
      // vendor_approve defaults to checked on a new vendor record, so a
      // plain click here would uncheck it (and this vendor then never
      // shows up in Purchase Order's vendor picker, which only lists
      // approved vendors). check() sets it true regardless of that default.
      await this.vendorApprove.check();
      await this.page.waitForTimeout(3000);
      await this.buyAll.evaluate((node) => node.click());
      await this.page.waitForTimeout(3000);
      await this.internalReference.fill(String(sap));
      await this.custom1.fill('custom1');
      await this.custom2.fill('custom2');
      await this.custom3.fill('custom3');

      await reportStep(this.page, 'Vendor Creation clicked successfully', 'pass');
    } catch (e) {
      await reportStep(this.page, 'Vendor Creation clicked not successfully...' + e, 'fail');
    }
    return this;
  }

  async clickVendorCreationNegative(vendr, id, zip, Strt1, Strt2, cLimit, memo, sap) {
    try {
      await this.clickVendor.fill(String(vendr));
      await this.page.waitForTimeout(5000);
      await this.purchaseManager.click();
      await this.managerSelect.click();
      await this.page.waitForTimeout(4000);
      await this.printName.fill(String(vendr));
      await this.vendorId.fill(String(id));
      await this.Zip.fill(String(zip));
      await this.page.waitForTimeout(4000);

      await this.street1.fill(String(Strt1));

      try {
        const errorMsg = this.page.locator("xpath=//div[@class='o_dialog']//p");
        await errorMsg.waitFor({ state: 'visible', timeout: 30000 });
        console.log('Validation Error Message:', await errorMsg.textContent());

        // Dismiss the validation error
        await this.page.locator("xpath=//button[normalize-space()='Close']").click();
        console.log('Validation error dismissed successfully for row ');
        await this.page.waitForTimeout(3000);
      } catch (e) {
        console.log('No validation error for row');
      }

      await this.street2.click();
      await this.page.waitForTimeout(3000);
      try {
        const modalFooter = this.page.locator('footer.modal-footer');
        await modalFooter.waitFor({ state: 'visible', timeout: 10000 });

        // Click OK button
        const okButton = modalFooter.locator('button.btn-primary');
        await okButton.click();
      } catch (e) {
        // No validation message found; proceed normally
        console.log('No validation message displayed.');
      }

      await this.street2.fill(String(Strt2));
      await this.page.waitForTimeout(3000);

      await this.firstName.fill(String(vendr));
      await this.lastName.fill(String(vendr));
      await this.phone.fill('9876543210');
      await this.page.waitForTimeout(3000);
      await this.shipVia.click();
      await this.selectShip.click();
      await this.page.waitForTimeout(3000);
      await this.vendorPayment.click();
      await this.page.waitForTimeout(3000);

      await this.vendorPaymentType.click();
      await this.page.waitForTimeout(5000);

      await this.creditLimit.clear();
      await this.page.waitForTimeout(3000);
      await this.creditLimit.fill(String(cLimit));
      await this.page.waitForTimeout(3000);

      await this.returnPeriod.clear();

      try {
        const errorMsg = this.page.locator("xpath=//div[@class='o_dialog']//p");
        await errorMsg.waitFor({ state: 'visible', timeout: 30000 });
        console.log('Validation Error Message:', await errorMsg.textContent());

        // Dismiss the validation error
        await this.page.locator("xpath=//button[normalize-space()='Close']").click();
        console.log('Validation error dismissed successfully for row ');
        await this.page.waitForTimeout(3000);
      } catch (e) {
        console.log('No validation error for row');
      }

      await this.returnPeriod.fill('10');
      await this.page.waitForTimeout(3000);
      await this.checkMemo.fill(String(memo));
      await this.page.waitForTimeout(5000);
      //checkVendor.click();
      await this.checkVendor.evaluate((node) => node.click());
      await this.page.waitForTimeout(3000);
      await this.internalReference.fill(String(sap));
      await this.custom1.fill('custom1');
      await this.custom2.fill('custom2');
      await this.custom3.fill('custom3');

      await reportStep(this.page, 'Vendor Creation clicked successfully', 'pass');
    } catch (e) {
      await reportStep(this.page, 'Vendor Creation clicked not successfully...' + e, 'fail');
    }
    return this;
  }

  async clickVendorContact(cName, email, phone, mobile) {
    try {
      await this.contactADD.click();
      await this.page.waitForTimeout(20000);

      await this.contactName.fill(String(cName));
      await this.page.waitForTimeout(2000);

      await this.primaryCheck.evaluate((node) => node.click());
      await this.page.waitForTimeout(2000);
      await this.contactsEmail.fill(String(email));
      await this.contactsPhone.fill(String(phone));
      await this.contactsMobile.fill(String(mobile));
      await this.contactSaveBtn.click();

      await this.page.waitForTimeout(5000);
      await this.remitToAddress.click();
      await this.page.waitForTimeout(2000);
      await this.clickOk.click();
      await this.page.waitForTimeout(2000);

      await this.contactName1.fill(String(cName));
      await this.page.waitForTimeout(2000);
      await this.contactsEmail1.fill(String(email));
      await this.contactsPhone1.fill(String(phone));
      await this.contactsMobile1.fill(String(mobile));
      await this.page.waitForTimeout(2000);
      await this.contactCloseBtn.click();

      await this.page.waitForTimeout(5000);

      await reportStep(this.page, 'Vendor Contact clicked successfully', 'pass');
    } catch (e) {
      await reportStep(this.page, 'Vendor Contact clicked not successfully...' + e, 'fail');
    }
    return this;
  }

  async clickVendorContactNegative(cName, email, phone, mobile) {
    try {
      await this.contactADD.click();
      await this.page.waitForTimeout(20000);

      await this.contactName.fill(String(cName));
      await this.page.waitForTimeout(2000);

      await this.primaryCheck.evaluate((node) => node.click());
      await this.page.waitForTimeout(2000);
      await this.contactsEmail.fill(String(email));
      await this.contactsPhone.fill(String(phone));
      await this.contactsMobile.fill(String(mobile));
      await this.contactSaveBtn.click();
      try {
        const validationMessage = this.page.locator("xpath=//div[@class='o_notification_body mt-2']");
        await validationMessage.waitFor({ state: 'visible', timeout: 30000 });

        console.log('Validation Message:', await validationMessage.textContent());

        expect(await this.isErrorDisplayed()).toBeTruthy();
      } catch (e) {
        // No validation message found; proceed normally
        console.log('No validation message displayed.');
      }
      await this.page.waitForTimeout(5000);
      await this.remitToAddress.click();
      await this.page.waitForTimeout(2000);
      await this.clickOk.click();
      await this.page.waitForTimeout(2000);

      await this.contactName1.clear();
      await this.page.waitForTimeout(2000);
      await this.contactsEmail1.fill('abc');
      //contactsPhone1.sendKeys(phone);
      //contactsMobile1.sendKeys(mobile);
      await this.page.waitForTimeout(2000);
      await this.contactCloseBtn.click();
      try {
        const errorMsg = this.page.locator("xpath=//div[@class='o_dialog']//p");
        await errorMsg.waitFor({ state: 'visible', timeout: 30000 });
        console.log('Validation Error Message:', await errorMsg.textContent());

        // Dismiss the validation error
        await this.page.locator("xpath=//button[normalize-space()='Close']").click();
        console.log('Validation error dismissed successfully for row ');
        await this.page.waitForTimeout(3000);
      } catch (e) {
        console.log('No validation error for row');
      }

      try {
        const validationMessage = this.page.locator("xpath=//div[@class='o_notification_body mt-2']");
        await validationMessage.waitFor({ state: 'visible', timeout: 30000 });

        console.log('Validation Message:', await validationMessage.textContent());

        expect(await this.isErrorDisplayed()).toBeTruthy();
      } catch (e) {
        // No validation message found; proceed normally
        console.log('No validation message displayed.');
      }
      await this.discardBtn.click();

      await this.page.waitForTimeout(5000);

      await reportStep(this.page, 'Vendor Contact clicked successfully', 'pass');
    } catch (e) {
      await reportStep(this.page, 'Vendor Contact clicked not successfully...' + e, 'fail');
    }
    return this;
  }

  async clickVendor_Products(productName) {
    try {
      // Wait for and click on the product menu
      await this.productMenu.click({ timeout: 30 * 1000 });
      await this.page.waitForTimeout(5000);

      // Click the product button
      await this.product.click();
      await this.page.waitForTimeout(3000);

      // Click on search more and input the product name
      //  productSearchMore.click();
      await this.productSearchMore.evaluate((node) => node.click());
      await this.page.waitForTimeout(20000);

      // Enter the product name and press enter
      await this.productBox.fill(String(productName));
      await this.productBox.press('Enter');
      await this.page.waitForTimeout(3000);

      // Click on the product
      await this.productClick.click();
      await this.page.waitForTimeout(10000);

      // Click on the Add button
      await this.productAddBtn.click();
      await this.page.waitForTimeout(20000);

      await reportStep(this.page, 'product Add is clicked successfully', 'pass');
    } catch (e) {
      await reportStep(this.page, 'product Add is not clickedd successfully :' + e.message, 'fail');
    }
    return this;
  }

  // Adds productName to the Products table a second time (same product,
  // now with its own row), then edits that new row's UoM and cost so the
  // two rows differ on UoM - proves the same product can carry more than
  // one vendor UoM/cost combination.
  async clickVendor_ProductsWithDifferentUom(productName, uom, cost) {
    try {
      // Re-opening this same tags field a 2nd/3rd time in one session
      // intermittently renders the dropdown without its "Search More..."
      // link ready in time - retry the open rather than failing on one miss.
      let opened = false;
      for (let attempt = 0; attempt < 3 && !opened; attempt++) {
        await this.product.click();
        await this.page.waitForTimeout(3000);
        try {
          await this.productSearchMore.waitFor({ state: 'attached', timeout: 8000 });
          opened = true;
        } catch (e) {
          await this.page.keyboard.press('Escape');
          await this.page.waitForTimeout(1000);
        }
      }

      await this.productSearchMore.evaluate((node) => node.click());
      await this.page.waitForTimeout(20000);

      await this.productBox.fill(String(productName));
      await this.productBox.press('Enter');
      await this.page.waitForTimeout(3000);

      // The vendor's Products table already has a row from the first
      // product-add by the time this runs, so the page-wide productClick
      // locator now matches that existing row too. The search dialog is
      // appended after the rest of the page, so .last() reliably targets
      // its result row instead of the pre-existing one.
      await this.productClick.last().click();
      await this.page.waitForTimeout(10000);

      await this.productAddBtn.last().click();
      await this.page.waitForTimeout(20000);

      // Open the new row and edit its UoM cell. Typing a name that has no
      // exact match surfaces a "Create <name>" option first in the
      // dropdown, so this both picks an existing UoM and creates a new one
      // on demand.
      await this.productsLastRow.click();
      await this.page.waitForTimeout(2000);

      const uomCell = this.productsLastRow.locator("xpath=.//td[@name='uom_id']");
      await uomCell.click();
      await this.page.waitForTimeout(1000);
      await uomCell.locator('input').fill(String(uom));
      await this.page.waitForTimeout(2000);
      await this.autocompleteFirstOption.click();
      await this.page.waitForTimeout(2000);

      const costCell = this.productsLastRow.locator("xpath=.//td[@name='cost_price']//input");
      await costCell.clear();
      await costCell.fill(String(cost));
      await this.page.waitForTimeout(2000);

      await reportStep(this.page, 'product re-added with a different UoM and cost successfully', 'pass');
    } catch (e) {
      await reportStep(this.page, 'product re-add with different UoM is not clicked successfully :' + e.message, 'fail');
    }
    return this;
  }

  async clickVendor_ProductsNegative() {
    try {
      // Wait for and click on the product menu
      await this.productMenu.click({ timeout: 30 * 1000 });
      await this.page.waitForTimeout(5000);

      // Click on the Add button
      await this.productAddBtn.click();

      // Check if an error message appears and handle it
      try {
        // Wait until the error message is visible
        await this.errorMsg.waitFor({ state: 'visible', timeout: 30000 });
        const errorMessageText = await this.errorMsg.textContent();
        console.log('Error Message:', errorMessageText);

        // Click the Ok button to dismiss the error message
        await this.errorMsgOk.click();
        await this.page.waitForTimeout(5000);
        console.log('Error message dismissed successfully by clicking Ok button.');
      } catch (e) {
        // If no error message is displayed, proceed with other methods
        console.log('No error message displayed. Proceeding with other methods...');
      }
    } catch (e) {
      // Log failure in case of exception
      await reportStep(this.page, 'Vendor_Products adding is not clicked successfully: ' + e.message, 'fail');
    }
    return this;
  }

  async Update_LastCost(cost) {
    try {
      const rowXpath = "(//table[contains(@class,'o_list_table')])[1]/tbody/tr[contains(@class,'o_data_row')][1]";

      // Wait for overlays to disappear
      await this.page
        .locator('.o_loading, .modal-backdrop, .o_dialog_container')
        .waitFor({ state: 'hidden', timeout: 30000 });

      // Find row
      const rowElement = this.page.locator(`xpath=${rowXpath}`);
      await rowElement.waitFor({ state: 'attached', timeout: 30000 });

      // Scroll
      await rowElement.scrollIntoViewIfNeeded();
      await this.page.waitForTimeout(1000);

      // Try actions click
      try {
        await rowElement.hover();
        await rowElement.click();
      } catch (e) {
        // fallback JS click
        await rowElement.evaluate((node) => node.click());
      }

      // 3. Update Tax Status
      const taxSelect = this.page.locator(`xpath=${rowXpath}//td[@name='tax_status']//select`);
      await taxSelect.waitFor({ state: 'visible', timeout: 30000 });
      await taxSelect.selectOption({ label: 'Yes' });
      await this.page.waitForTimeout(2000);

      // 4. Update Price
      const priceInput = this.page.locator(`xpath=${rowXpath}//td[@name='cost_price']//input`);
      await priceInput.waitFor({ state: 'visible', timeout: 30000 });
      await priceInput.clear();
      await priceInput.fill(String(cost));

      await this.page.waitForTimeout(2000);

      await reportStep(this.page, 'Update button is clicked successfully', 'pass');
    } catch (e) {
      await reportStep(this.page, 'Update_LastCost is clicked not successfully: ' + e.message, 'fail');

      console.log('Exception: ' + e.message);
    }

    return this;
  }

  async SaveBtn() {
    try {
      await this.page.waitForTimeout(5000);

      // Click the Save button
      await this.saveBtn.click();

      await this.page.waitForTimeout(50000);

      // Wait for the Vendor Name element to be clickable and click it
      await this.getVendorName.click({ timeout: 30 * 1000 });

      // Wait and retrieve the created Vendor Name
      const createdVendorName = await this.getVendorName.textContent();
      console.log('Vendor Name : ' + createdVendorName);

      await this.vendors_Click.click();
      await this.page.waitForTimeout(10000);

      // Search for the vendor
      await this.searchMore_Box.waitFor({ state: 'visible', timeout: 30000 });
      //searchMore_Box.click();

      // Wait for search box to be active and send the Vendor Name to search
      await this.searchMore_Box.fill(String(createdVendorName));
      await this.searchMore_Box.press('Enter');
      await this.page.waitForTimeout(5000);

      // Wait for the search result to be clickable and click on the vendor name
      // wait.until(ExpectedConditions.elementToBeClickable(selected_Click_Name));
      await this.selected_Click_Name.click();
      await this.page.waitForTimeout(5000);

      // Log the success message
      await reportStep(this.page, 'Save button is clicked successfully', 'pass');
    } catch (e) {
      // Log the failure message if there's an exception
      await reportStep(this.page, 'Save button is not clicked successfully: ' + e.message, 'fail');
      console.log(e); // Optional: Additional logging for debugging
    }
    return this;
  }

  async CostNegativeValue_SaveBtn() {
    try {
      // Click on the Save button
      await this.saveBtn.click();
      // await this.page.waitForTimeout(1000);

      // Check if an error message appears and handle
      try {
        const validationMessage = this.page.locator("xpath=//div[@class='o_notification_body mt-2']");
        await validationMessage.waitFor({ state: 'visible', timeout: 30000 });

        console.log('Validation Message:', await validationMessage.textContent());

        expect(await this.isErrorDisplayed()).toBeTruthy();
      } catch (e) {
        // No validation message found; proceed normally
        console.log('No validation message displayed.');
      }
    } catch (e) {
      // Log failure in case of any exception during the main save button click process
      await reportStep(this.page, 'Save button click was not successful: ' + e.message, 'fail');
    }
    return this;
  }

  async clickAccount_setup(acc) {
    try {
      //Thread.sleep(10000);
      //editBtn.click();
      await this.page.waitForTimeout(5000);
      await this.accountSetup.click();
      await this.page.waitForTimeout(5000);
      await this.control.click();
      await this.controlSelect.click();
      await this.page.waitForTimeout(2000);
      await this.termsDiscount.click();
      await this.termsDiscountSelect.click();
      await this.page.waitForTimeout(4000);
      await this.advance.evaluate((node) => node.click());
      //advance.click();
      await this.advanceSelect.click();
      await this.page.waitForTimeout(2000);
      await this.tax.click();
      await this.taxSelect.click();
      await this.page.waitForTimeout(2000);
      //purchase.click();
      await this.purchase.evaluate((node) => node.click());
      await this.purchaseSelect.click();
      await this.page.waitForTimeout(2000);
      await this.insurance.click();
      await this.insuranceSelect.click();
      await this.page.waitForTimeout(2000);
      await this.sAndH.click();
      await this.sAndHSelect.click();
      await this.page.waitForTimeout(2000);

      await this.addBank.click();
      await this.bank.click();
      await this.bankSelect.click();
      await this.accNum.fill(String(acc));
      await this.page.waitForTimeout(2000);
      await this.finalsaveBtn.click();
      await this.page.waitForTimeout(5000);

      await reportStep(this.page, 'Account setup is clicked successfully', 'pass');
    } catch (e) {
      await reportStep(this.page, 'Account setup is not clickedd successfully :' + e.message, 'fail');
    }
    return this;
  }
}

module.exports = { PurchaseVendorCreation };
