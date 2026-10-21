const { expect } = require('../fixtures/base');
const { reportStep } = require('../utils/reportStep');
const { ensureLoggedIn } = require('../utils/loginHelper');

class PurchaseBillAndRegisterPayment {
  constructor(page) {
    this.page = page;

    // Login Page
    this.userName = page.locator('xpath=//input[@name=\'login\']');
    this.passWord = page.locator('xpath=//input[@name=\'password\']');
    this.logIn = page.locator('xpath=//button[@type=\'submit\']');

    // Menu
    this.menu = page.locator('xpath=//ul[@class=\'o_menu_apps\']//i[@class=\'fa fa-bars\']');

    // financialacct
    this.purchase = page.locator('xpath=//div[contains(text(),\'Purchase\')]');

    this.ordersMenubtn = page.locator('xpath=//a[contains(text(),\'Purchase Order\')]');

    // Create btn
    this.createBtn = page.locator('xpath=//button[normalize-space()=\'New\']');

    this.clickVendor = page.locator('xpath=//div[@name=\'partner_id\']//input[@type=\'text\']');

    this.vendorSearchMore = page.locator('xpath=//a[@id=\'partner_id_0_0_8\']');

    this.vendorSearchMoreBox = page.locator('xpath=//input[@role=\'searchbox\']');

    this.clickPurchaseManager = page.locator('xpath=//div[@name=\'purchase_manager\']//input[@type=\'text\']');

    // Selectlist
    this.selectListPurchaseManager = page.locator('xpath=//a[@id=\'purchase_manager_0_0_0\']');

    this.clickLocation = page.locator('xpath=//input[@id=\'warehouse_id_0\']');

    // Selectlist
    this.selectLocation = page.locator('xpath=//a[@id=\'warehouse_id_0_0_2\']');

    this.termsBox = page.locator('xpath=(//div[@name=\'payment_term_id\']//input[@type=\'text\'])[1]');

    // Create btn
    this.termsDropDownBtn = page.locator('xpath=//a[@id=\'payment_term_id_0_0_1\']');

    this.contact = page.locator('xpath=//input[@id=\'contact_0\']');

    this.contactSelect = page.locator('xpath=//a[@id=\'contact_0_0_0\']');

    this.expectedDate = page.locator('xpath=//input[@id=\'due_date_0\']');

    this.shipVia = page.locator('xpath=(//div[@name=\'ship_via\']//input[@type=\'text\'])');

    // Create btn
    this.shipSelect = page.locator('xpath=//a[@id=\'ship_via_0_0_1\']');

    this.product = page.locator('xpath=//div[@name=\'product_ids\']//input[@type=\'text\']');

    this.productSearchMore = page.locator('xpath=(//a[normalize-space()=\'Search More...\'])[1]');

    this.productSearchBox = page.locator('xpath=//input[@role=\'searchbox\']');

    this.productSelect = page.locator('xpath=(//table[@class=\'o_list_table table table-sm table-hover position-relative mb-0 o_list_table_ungrouped table-striped\']//tbody//tr[1]//td[2])');

    this.productAddBtn = page.locator('xpath=//button[normalize-space()=\'Add\']');

    this.associatedProduct = page.locator('xpath=//div[@name=\'associated_product\']//input[@type=\'checkbox\']');

    this.warningCloseBtn = page.locator('xpath=//button[@Type=\'button\']//span[contains(text(),\'Close\')]');

    // ClickAddress btn
    this.clickAddress = page.locator('xpath=//a[normalize-space()=\'Address\']');

    // EnterZipcode btn
    this.CopytoShipToBtn = page.locator('xpath=//label[contains(text(),\'Copy to Ship To\')]');

    this.enterZip = page.locator('xpath=//input[@id=\'vendor_zip_0\']');

    this.enterStreet = page.locator('xpath=//input[@id=\'vendor_street_0\']');

    this.enterZip1 = page.locator('xpath=//input[@id=\'ship_zip_0\']');

    this.enterStreet1 = page.locator('xpath=//input[@id=\'ship_street_0\']');

    this.enterZip2 = page.locator('xpath=//input[@id=\'bill_zip_0\']');

    this.enterStreet2 = page.locator('xpath=//input[@id=\'bill_street_0\']');

    // save btn
    this.saveBtn = page.locator('xpath=//span[normalize-space()=\'Confirm Order\']');

    this.productMenu = page.locator('xpath=//a[normalize-space()=\'Products\']');

    this.costErrorMsg = page.locator('xpath=//div[@class=\'o_dialog_warning modal-body\']//p');

    this.costErrorMsgOk = page.locator('xpath=//button[@type=\'button\']//span[contains(text(),\'Ok\')]');

    this.subTotal_Get = page.locator('xpath=//div[@name=\'amount_untaxed\']');

    this.shipping_handling_Get = page.locator('xpath=//input[@id=\'shipping_handling_0\']');

    this.tax_amount_view_Get = page.locator('xpath=//div[@name=\'tax_amount_view\']');

    this.total_container_deposit_Get = page.locator('xpath=//div[@name=\'container_deposit_view\']');

    this.insurance_Get = page.locator('xpath=//input[@id=\'insurance_0\']');

    this.total_discount_Get = page.locator('xpath=//input[@id=\'total_discount_view_0\']');

    this.total_Get = page.locator('xpath=//div[@name=\'amount_total\']');

    this.Amount_Get = page.locator('xpath=//div[@name=\'amount_residual\']');

    this.receiveProductsBtn = page.locator('xpath=//span[normalize-space()=\'Receive Products\']');

    // old qa
    // @FindBy(xpath = "//span[contains(text(),'Verify Quantities  Against Bill')]")
    this.quantitiesBtn = page.locator('xpath=//span[normalize-space()=\'Verify Quantities Against Bill\']');

    this.printBtn = page.locator('xpath=(//button[normalize-space()=\'Print\'])[2]');

    this.actionBtn = page.locator('xpath=//button[normalize-space()=\'Action\']');

    this.receiptBtn = page.locator('xpath=//span[normalize-space()=\'Picking Operations\']');

    // financialacct
    this.billMenu = page.locator('xpath=//a[normalize-space()=\'Bill\']');

    this.billSelect = page.locator('xpath=//table[@class=\'o_list_table table table-sm table-hover position-relative mb-0 o_list_table_ungrouped table-striped\']//tbody//tr[1]//td[3]');

    this.post = page.locator('xpath=//span[normalize-space()=\'Post\']');

    this.getVendorName = page.locator('xpath=(//span[@name=\'name\'])[1]');

    // NOTE: Java field `registerPaymentBtn` (WebElement) shares its name with the
    // page-object method `registerPaymentBtn()`. In Java that's fine (separate
    // namespaces); in JS an instance property would shadow the prototype method,
    // so this locator field is renamed to `registerPaymentBtnLocator` to avoid
    // breaking `registerPaymentBtn()` calls. xpath copied verbatim from Java.
    this.registerPaymentBtnLocator = page.locator('xpath=//span[normalize-space()=\'Register Payment\']');

    this.checkNo = page.locator('xpath=//input[@id=\'check_no_0\']');

    this.amount = page.locator('xpath=//input[@id=\'amount_0\']');

    // NOTE: same naming-collision issue as above (field `selectALLCheckBox` vs
    // method `selectALLCheckBox()`); renamed to `selectALLCheckBoxLocator`.
    this.selectALLCheckBoxLocator = page.locator('xpath=//div[@name=\'add_select_all\']//input[@type=\'checkbox\']');

    this.unappliedAmount = page.locator('xpath=//td//span[@name=\'unapplied_amount\']');

    this.unappliedMsg = page.locator('xpath=(//div[@class=\'alert alert-info\'])[1]');

    this.unappliedOK = page.locator('xpath=//label[text()=\'OK\']');

    // save btn
    this.saveBtn2 = page.locator('xpath=//span[normalize-space()=\'Confirm\']');
  }

  async isErrorDisplayed() {
    return this.page.locator("xpath=//div[@class='me-auto o_notification_content']").isVisible().catch(() => false);
  }

  async enter_Username(user) {
    try {
      await this.userName.fill(String(user));

      await reportStep(this.page, "username is entered successfully", "pass");
    } catch (e) {
      await reportStep(this.page, "username is not entered successfully..." + e, "fail");
    }
    return this;
  }

  async enter_Password(pass) {
    try {
      await this.passWord.fill(String(pass));

      await reportStep(this.page, "Password is entered successfully", "pass");
    } catch (e) {
      await reportStep(this.page, "Password is not entered successfully..." + e, "fail");
    }
    return this;
  }

  async click_Login_Button() {
    try {
      await this.logIn.click();
      await this.page.waitForTimeout(5000);

      await reportStep(this.page, "login button clicked successfully", "pass");
    } catch (e) {
      await reportStep(this.page, "login button clicked not successfully..." + e, "fail");
    }
    return this;
  }

  async loginIfNeeded(user, pass) {
    await ensureLoggedIn(this, user, pass);
    return this;
  }

  async click_Menu() {
    try {
      await this.menu.click({ timeout: 30000 });
      await this.page.waitForTimeout(5000);

      await reportStep(this.page, "Menu clicked successfully", "pass");
    } catch (e) {
      await reportStep(this.page, "Menu clicked not successfully..." + e, "fail");
    }
    return this;
  }

  async click_PucrahseBillMenuBtn() {
    try {
      await this.purchase.click({ timeout: 30000 });
      await this.page.waitForTimeout(8000);

      await reportStep(this.page, "Pucrahse Bill Menu clicked successfully", "pass");
    } catch (e) {
      await reportStep(this.page, "Pucrahse Bill Menu clicked not successfully..." + e, "fail");
    }
    return this;
  }

  async clickPurchaseOrder(vendorName) {
    try {
      await this.page.waitForTimeout(5000);

      await this.ordersMenubtn.click({ timeout: 30000 });
      await this.page.waitForTimeout(10000);

      await this.createBtn.click();
      await this.page.waitForTimeout(5000);

      await this.clickVendor.click();
      await this.page.waitForTimeout(6000);

      await this.vendorSearchMore.click();
      await this.page.waitForTimeout(5000);

      await this.vendorSearchMoreBox.click();
      await this.page.waitForTimeout(5000);

      await this.vendorSearchMoreBox.fill(String(vendorName));
      await this.vendorSearchMoreBox.press('Enter');
      await this.page.waitForTimeout(5000);

      const upper = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
      const lower = 'abcdefghijklmnopqrstuvwxyz';
      const exactVendorRow = this.page.locator(
        `xpath=//tr[@class='o_data_row']//td[translate(normalize-space(text()), '${upper}', '${lower}')=translate('${String(vendorName).trim()}', '${upper}', '${lower}')]`
      );
      await exactVendorRow.first().click();
      await this.page.waitForTimeout(5000);

      await reportStep(this.page, "Purchase Order Creation clicked successfully", "pass");
    } catch (e) {
      await reportStep(this.page, "Purchase Order Creation clicked not successfully..." + e, "fail");
    }
    return this;
  }

  async clickPurchaseOrder_Manager() {
    try {
      await this.clickPurchaseManager.click();
      await this.page.waitForTimeout(5000);

      await this.selectListPurchaseManager.click();
      await this.page.waitForTimeout(5000);

      // await this.termsBox.click();
      // await this.page.waitForTimeout(3000);

      // await this.termsDropDownBtn.click();
      // await this.page.waitForTimeout(3000);

      await this.contact.fill("komala");
      await this.page.waitForTimeout(3000);
      await this.contactSelect.click();
      await this.page.waitForTimeout(3000);

      await this.expectedDate.fill("12/01/2026");
      await this.page.waitForTimeout(3000);

      await this.shipVia.click();
      await this.page.waitForTimeout(3000);

      await this.shipSelect.click();
      await this.page.waitForTimeout(3000);

      await this.clickLocation.click();
      await this.page.waitForTimeout(3000);
      await this.selectLocation.click();
      await this.page.waitForTimeout(3000);

      await reportStep(this.page, "PurchaseOrder Manager clicked successfully", "pass");
    } catch (e) {
      await reportStep(this.page, "PurchaseOrder Manager clicked not successfully..." + e, "fail");
    }
    return this;
  }

  async clickPurchaseOrder_Poducts(productName) {
    try {
      await this.page.waitForTimeout(5000);
      await this.product.click();
      await this.page.waitForTimeout(5000);

      await this.productSearchMore.evaluate((node) => node.click());
      await this.page.waitForTimeout(5000);

      await this.productSearchBox.click();
      await this.page.waitForTimeout(2000);

      await this.productSearchBox.fill(String(productName));
      await this.productSearchBox.press('Enter');
      await this.page.waitForTimeout(5000);

      await this.productSelect.click();
      await this.page.waitForTimeout(5000);

      await this.productAddBtn.click();
      await this.page.waitForTimeout(10000);

      // await this.warningCloseBtn.click();
      // await this.page.waitForTimeout(10000);

      await reportStep(this.page, "PurchaseOrder Products clicked successfully", "pass");
    } catch (e) {
      await reportStep(this.page, "PurchaseOrder Products clicked not successfully..." + e, "fail");
    }
    return this;
  }

  async clickPurchaseOrder_ProductADD(entQTY, cost, tax, discount) {
    try {
      const totalRowsXpath = "xpath=//table[@class='o_list_table table table-sm table-hover position-relative mb-0 o_list_table_ungrouped table-striped']//tbody//tr";
      const totalRows = await this.page.locator(totalRowsXpath).count();
      console.log("Total number of rows: " + totalRows);

      for (let row = 1; row <= Math.min(1, totalRows); row++) {
        const productRow = this.page.locator(`xpath=(//table[@class='o_list_table table table-sm table-hover position-relative mb-0 o_list_table_ungrouped table-striped']//tbody//tr[${row}]//td[2])`);
        await productRow.click({ timeout: 30000 });

        const orderQtyInput = this.page.locator(`xpath=//tr[${row}]//td[4]//input`);
        await orderQtyInput.waitFor({ state: 'visible', timeout: 30000 });
        await orderQtyInput.clear();
        await orderQtyInput.fill(String(entQTY));

        const costInput = this.page.locator(`xpath=//tr[${row}]//td[@name='price_unit']//input`);
        await costInput.waitFor({ state: 'visible', timeout: 30000 });
        const getCost = await costInput.inputValue();
        console.log("Existing Each Cost: " + getCost);

        // If you need to update cost, uncomment the next lines
        await costInput.clear();
        await costInput.fill(String(cost));

        const taxableInput = this.page.locator(`xpath=//tr[${row}]//td[@name='tax_status']//select`);
        await taxableInput.waitFor({ state: 'visible', timeout: 30000 });
        // Select the "Yes" option by visible text
        await taxableInput.selectOption({ label: 'Yes' });
        // Optional: Print the selected option
        console.log("Selected option: Yes");

        // const taxInput = this.page.locator(`xpath=//tr[${row}]//td[@name='cost_tax']//input`);
        // await taxInput.clear();
        // await taxInput.fill(String(tax));

        // const discountInput = this.page.locator(`xpath=//tr[${row}]//td[@name='discount']//input`);
        // await discountInput.clear();
        // await discountInput.fill(String(discount));

        const subTotalInput = this.page.locator(`xpath=//tr[${row}]//td[@name='price_subtotal']`);
        await subTotalInput.waitFor({ state: 'visible', timeout: 30000 });
        const getSubTotalInput = await subTotalInput.textContent();
        console.log("SubTotal: " + getSubTotalInput);
      }

      await reportStep(this.page, "PurchaseOrder_ProductADD is clicked successfully", "pass");
    } catch (e) {
      await reportStep(this.page, "PurchaseOrder_ProductADD is clicked not successfully..." + e.message, "fail");
    }
    return this;
  }

  async clickPurchaseOrder_Address(entZipcode, entStreet, entZipcode1, entStreet1) {
    try {
      await this.page.waitForTimeout(3000);
      await this.clickAddress.click();
      await this.page.waitForTimeout(2000);

      /*
      await this.enterZip.clear();
      await this.enterZip.fill(String(entZipcode));
      await this.enterStreet.clear();
      await this.enterStreet.fill(String(entStreet));
      await this.enterZip.click();
      await this.page.waitForTimeout(3000);

      await this.enterZip1.clear();
      await this.enterZip1.fill(String(entZipcode1));
      await this.enterStreet1.clear();
      await this.enterStreet1.fill(String(entStreet1));
      await this.page.waitForTimeout(3000);

      await this.enterZip2.clear();
      await this.enterZip2.fill(String(entZipcode1));
      await this.enterStreet2.clear();
      await this.enterStreet2.fill(String(entStreet1));
      await this.page.waitForTimeout(3000);
      */

      try {
        const modalFooter = this.page.locator('css=footer.modal-footer');
        await modalFooter.waitFor({ state: 'visible', timeout: 10000 });

        // Click OK button
        const okButton = modalFooter.locator('css=button.btn-primary');
        await okButton.click();
      } catch (e) {
        // No validation message found; proceed normally
        console.log('No validation message displayed.');
      }

      await reportStep(this.page, "PurchaseOrder_Address is clicked successfully", "pass");
    } catch (e) {
      await reportStep(this.page, "PurchaseOrder_Address is clicked not successfully..." + e, "fail");
    }
    return this;
  }

  async clickPurchaseOrder_AddressNegative(entZipcode, entStreet, entZipcode1, entStreet1) {
    try {
      await this.page.waitForTimeout(3000);
      await this.clickAddress.click();
      await this.page.waitForTimeout(2000);

      await this.enterZip.clear();
      await this.enterZip.fill(String(entZipcode));
      await this.enterStreet.clear();
      await this.enterStreet.fill(String(entStreet));
      await this.enterZip.click();
      await this.page.waitForTimeout(3000);

      try {
        const modalFooter = this.page.locator('css=footer.modal-footer');
        await modalFooter.waitFor({ state: 'visible', timeout: 10000 });

        // Click OK button
        const okButton = modalFooter.locator('css=button.btn-primary');
        await okButton.click();
      } catch (e) {
        // No validation message found; proceed normally
        console.log('No validation message displayed.');
      }

      await this.enterZip1.clear();
      await this.enterZip1.fill(String(entZipcode1));
      await this.enterStreet1.clear();
      await this.enterStreet1.fill(String(entStreet1));
      await this.page.waitForTimeout(3000);

      try {
        const modalFooter = this.page.locator('css=footer.modal-footer');
        await modalFooter.waitFor({ state: 'visible', timeout: 10000 });

        // Click OK button
        const okButton = modalFooter.locator('css=button.btn-primary');
        await okButton.click();
      } catch (e) {
        // No validation message found; proceed normally
        console.log('No validation message displayed.');
      }

      await reportStep(this.page, "PurchaseOrder_Address is clicked successfully", "pass");
    } catch (e) {
      await reportStep(this.page, "PurchaseOrder_Address is clicked not successfully..." + e, "fail");
    }
    return this;
  }

  async clickSavebtn() {
    try {
      await this.saveBtn.click();
      await this.page.waitForTimeout(5000);

      await reportStep(this.page, "Save button clicked successfully", "pass");
    } catch (e) {
      await reportStep(this.page, "Save button clicked not successfully..." + e, "fail");
    }
    return this;
  }

  async CostNegativeValue_SaveBtn() {
    try {
      // Click on the Save button
      await this.saveBtn.click();
      await this.page.waitForTimeout(5000);

      try {
        const validationMessage = this.page.locator("xpath=//div[@class='o_notification_content']");
        await validationMessage.waitFor({ state: 'visible', timeout: 30000 });

        const messageText = await validationMessage.textContent();
        console.log("Validation Message: " + messageText);

        expect(await this.isErrorDisplayed()).toBeTruthy();
      } catch (e) {
        // No validation message found; proceed normally
        console.log('No validation message displayed.');
      }

      // Check if an error message appears and handle it
      try {
        // Wait until the error message is visible
        await this.costErrorMsg.waitFor({ state: 'visible', timeout: 30000 });
        const errorMessageText = await this.costErrorMsg.textContent();
        console.log("Error Message: " + errorMessageText);

        // Click the Ok button to dismiss the error message
        await this.costErrorMsgOk.click();
        await this.page.waitForTimeout(5000);
        console.log("Error message dismissed successfully by clicking Ok button.");
        await reportStep(this.page, "Error message handled successfully", "pass");
      } catch (e) {
        // If no error message is displayed, proceed with other methods
        console.log("No error message displayed. Proceeding with other methods...");
        await reportStep(this.page, "No error message displayed during save operation", "pass");
        // You can call other methods here if needed
        // executeOtherMethods();
      }
    } catch (e) {
      // Log failure in case of any exception during the main save button click process
      await reportStep(this.page, "Save button click was not successful: " + e.message, "fail");
    }
    return this;
  }

  async getTheTotal() {
    try {
      await this.productMenu.click();
      await this.page.waitForTimeout(3000);

      const subTotal_GetText = await this.subTotal_Get.textContent();
      console.log("subTotal : " + subTotal_GetText);
      console.log("=========================");
      await this.page.waitForTimeout(5000);

      await this.shipping_handling_Get.clear();
      await this.shipping_handling_Get.fill("2.00");
      const shipping_handling_GetText = await this.shipping_handling_Get.textContent();
      console.log("Shipping_handling : " + shipping_handling_GetText);
      console.log("=========================");
      await this.page.waitForTimeout(5000);

      const tax_amount_view_GetText = await this.tax_amount_view_Get.textContent();
      console.log("Tax_Amount :" + tax_amount_view_GetText);
      console.log("=========================");
      await this.page.waitForTimeout(5000);

      const total_container_deposit_GetText = await this.total_container_deposit_Get.textContent();
      console.log("Container_Deposit : " + total_container_deposit_GetText);
      console.log("=========================");
      await this.page.waitForTimeout(5000);

      await this.insurance_Get.clear();
      await this.insurance_Get.fill("2.00");
      const Insurance_GetText = await this.insurance_Get.textContent();
      console.log("Insurance : " + Insurance_GetText);
      console.log("=========================");
      await this.page.waitForTimeout(5000);

      // await this.total_discount_Get.clear();
      // await this.total_discount_Get.fill("2.00");
      const total_discount_GetText = await this.total_discount_Get.textContent();
      console.log("Discount : " + total_discount_GetText);
      console.log("=========================");
      await this.page.waitForTimeout(5000);

      const total_GetText = await this.total_Get.textContent();
      console.log("Total : " + total_GetText);
      console.log("=========================");
      await this.page.waitForTimeout(5000);

      await reportStep(this.page, "get The Total is clicked successfully", "pass");
    } catch (e) {
      await reportStep(this.page, "get The Total is not clicked successfully..." + e, "fail");
    }
    return this;
  }

  async clickReceivebtn() {
    try {
      await this.receiveProductsBtn.click({ timeout: 30000 });
      await this.page.waitForTimeout(10000);

      await this.quantitiesBtn.click();
      await this.page.waitForTimeout(15000);

      await this.actionBtn.click();
      await this.page.waitForTimeout(3000);

      await this.printBtn.click();
      await this.page.waitForTimeout(3000);

      await this.receiptBtn.click();
      await this.page.waitForTimeout(3000);

      await reportStep(this.page, "Receive button clicked successfully", "pass");
    } catch (e) {
      await reportStep(this.page, "Receive button clicked not successfully..." + e, "fail");
    }
    return this;
  }

  async registerPaymentBtn() {
    try {
      await this.page.waitForTimeout(3000);
      await this.billMenu.click();
      await this.page.waitForTimeout(3000);
      await this.billSelect.click();
      await this.post.click();
      await this.page.waitForTimeout(3000);
      await this.registerPaymentBtnLocator.click({ timeout: 30000 });
      await this.page.waitForTimeout(5000);

      await reportStep(this.page, "Register Payment Button is clicked successfully", "pass");
    } catch (e) {
      await reportStep(this.page, "Register Payment Button is not clicked successfully..." + e, "fail");
    }
    return this;
  }

  async entered_checkNo(checkno) {
    try {
      await this.checkNo.click();
      await this.page.waitForTimeout(5000);

      await this.checkNo.fill(String(checkno));
      await this.checkNo.press('Enter');
      await this.page.waitForTimeout(5000);

      await reportStep(this.page, "Check no is entered successfully", "pass");
    } catch (e) {
      await reportStep(this.page, "Check no is not entered successfully..." + e, "fail");
    }
    return this;
  }

  async entered_checkNoNegative(checkno) {
    try {
      await this.checkNo.click();
      await this.page.waitForTimeout(5000);

      await this.checkNo.fill(String(checkno));
      await this.checkNo.press('Enter');
      await this.page.waitForTimeout(5000);

      try {
        const errorMsg = this.page.locator("xpath=//div[@class='o_dialog']//p");
        await errorMsg.waitFor({ state: 'visible', timeout: 30000 });
        const errorMessageText = await errorMsg.textContent();
        console.log("Validation Error Message: " + errorMessageText);

        // Dismiss the validation error
        const errorMsgOk = this.page.locator("xpath=//button[normalize-space()='Close']");
        await errorMsgOk.click();
        console.log("Validation error dismissed successfully for row ");
        await this.page.waitForTimeout(3000);
      } catch (e) {
        console.log("No validation error for row ");
      }

      await reportStep(this.page, "Check no is entered successfully", "pass");
    } catch (e) {
      await reportStep(this.page, "Check no is not entered successfully..." + e, "fail");
    }
    return this;
  }

  async entered_amount(Amt) {
    try {
      await this.amount.click();
      await this.page.waitForTimeout(5000);

      await this.amount.clear();
      await this.page.waitForTimeout(5000);

      await this.amount.fill(String(Amt));
      await this.amount.press('Enter');

      await this.page.waitForTimeout(5000);

      await reportStep(this.page, "Amount is entered successfully", "pass");
    } catch (e) {
      await reportStep(this.page, "Amount is not entered successfully..." + e, "fail");
    }
    return this;
  }

  async entered_amountNegative(Amt) {
    try {
      await this.amount.click();
      await this.page.waitForTimeout(5000);

      await this.amount.clear();
      await this.page.waitForTimeout(5000);

      await this.amount.fill(String(Amt));
      await this.amount.press('Enter');

      try {
        const errorMsg = this.page.locator("xpath=//div[@class='o_dialog']//p");
        await errorMsg.waitFor({ state: 'visible', timeout: 30000 });
        const errorMessageText = await errorMsg.textContent();
        console.log("Validation Error Message: " + errorMessageText);

        // Dismiss the validation error
        const errorMsgOk = this.page.locator("xpath=//button[normalize-space()='Close']");
        await errorMsgOk.click();
        console.log("Validation error dismissed successfully for row ");
        await this.page.waitForTimeout(3000);
      } catch (e) {
        console.log("No validation error for row ");
      }
      await this.page.waitForTimeout(5000);

      await reportStep(this.page, "Amount is entered successfully", "pass");
    } catch (e) {
      await reportStep(this.page, "Amount is not entered successfully..." + e, "fail");
    }
    return this;
  }

  async selectALLCheckBox() {
    try {
      await this.selectALLCheckBoxLocator.evaluate((node) => node.click());
      await this.page.waitForTimeout(5000);

      await reportStep(this.page, "Amount is entered successfully", "pass");
    } catch (e) {
      await reportStep(this.page, "Amount is not entered successfully..." + e, "fail");
    }
    return this;
  }

  async get_unappliedAmount() {
    try {
      await this.unappliedAmount.click();
      await this.page.waitForTimeout(5000);

      const unappliedAmountText = await this.unappliedAmount.textContent();
      console.log("Unapplied Amount : " + unappliedAmountText);
      await this.page.waitForTimeout(5000);

      await reportStep(this.page, "Unapplied Amount is get successfully", "pass");
    } catch (e) {
      await reportStep(this.page, "Unapplied Amount is not get successfully..." + e, "fail");
    }
    return this;
  }

  async handleUnappliedMessageAndSave() {
    try {
      // Define the WebDriverWait with a timeout of 30 seconds
      // (Playwright locators auto-wait; explicit waits below pass an explicit timeout.)

      /*
      try {
        // Wait for the unapplied message to be visible (if it's present)
        await this.page.locator("xpath=(//div[@class='alert alert-info'])[1]").waitFor({ state: 'visible', timeout: 30000 });
        await this.page.waitForTimeout(5000);

        // If the message is found, get the message text and print it
        const unappliedMsgText = (await this.unappliedMsg.textContent()).trim();
        console.log("Unapplied Message: " + unappliedMsgText);
        await this.page.waitForTimeout(5000);
        const unappliedOK = this.page.locator("xpath=//label[text()='OK']");

        // Click the OK button to dismiss the unapplied message
        await unappliedOK.click();
        await this.page.waitForTimeout(5000);
        console.log("Clicked OK button for unapplied message.");

      } catch (e) {
        // If unapplied message is not found within the timeout period, handle the Save
        // button click
        console.log("No unapplied message found, proceeding to save.");

        // Click the Save button
        await this.saveBtn2.click();
        console.log("Clicked Save button.");
        await this.page.waitForTimeout(10000);
      }
      */

      await this.saveBtn2.click();

      try {
        const validationMessage = this.page.locator("xpath=//div[@class='o_notification_body mt-2']");
        await validationMessage.waitFor({ state: 'visible', timeout: 30000 });

        const messageText = await validationMessage.textContent();
        console.log("Validation Message: " + messageText);

        expect(await this.isErrorDisplayed()).toBeTruthy();
      } catch (e) {
        // No validation message found; proceed normally
        console.log('No validation message displayed.');
      }
      try {
        const errorMsg = this.page.locator("xpath=//div[@class='o_dialog']//p");
        await errorMsg.waitFor({ state: 'visible', timeout: 30000 });
        const errorMessageText = await errorMsg.textContent();
        console.log("Validation Error Message: " + errorMessageText);

        // Dismiss the validation error
        const errorMsgOk = this.page.locator("xpath=//button[normalize-space()='Close']");
        await errorMsgOk.click();
        console.log("Validation error dismissed successfully for row ");
        await this.page.waitForTimeout(3000);
      } catch (e) {
        console.log("No validation error for row ");
      }

      await reportStep(this.page, "Handled unapplied message and performed save action successfully", "pass");
    } catch (e) {
      await reportStep(this.page, "Failed to handle unapplied message or save action: " + e.message, "fail");
      console.error(e);
    }
    return this;
  }
}

module.exports = { PurchaseBillAndRegisterPayment };
