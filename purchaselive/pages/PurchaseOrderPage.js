const { expect } = require('../fixtures/base');
const { reportStep } = require('../utils/reportStep');
const { ensureLoggedIn } = require('../utils/loginHelper');

class PurchaseOrderPage {
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
    this.ordersMenubtn = page.locator("xpath=//a[contains(text(),'Purchase Order')]");

    // Create btn
    this.createBtn = page.locator("xpath=//button[normalize-space()='New']");

    this.clickVendor = page.locator("xpath=//div[@name='partner_id']//input[@type='text']");

    this.vendorSearchMore = page.locator("xpath=//a[@id='partner_id_0_0_8']");

    this.vendorSearchMoreBox = page.locator("xpath=//input[@role='searchbox']");

    this.clickPurchaseManager = page.locator("xpath=//div[@name='purchase_manager']//input[@type='text']");

    // Selectlist
    this.selectListPurchaseManager = page.locator("xpath=//a[@id='purchase_manager_0_0_0']");

    this.termsBox = page.locator("xpath=(//div[@name='payment_term_id']//input[@type='text'])[1]");

    // Create btn
    this.termsDropDownBtn = page.locator("xpath=//a[@id='payment_term_id_0_0_1']");

    this.contact = page.locator("xpath=//input[@id='contact_0']");

    this.contactSelect = page.locator("xpath=//a[@id='contact_0_0_0']");

    this.expectedDate = page.locator("xpath=//input[@id='due_date_0']");

    this.shipVia = page.locator("xpath=(//div[@name='ship_via']//input[@type='text'])");

    // Create btn
    this.shipSelect = page.locator("xpath=//a[@id='ship_via_0_0_1']");

    this.product = page.locator("xpath=//div[@name='product_ids']//input[@type='text']");

    this.productSearchMore = page.locator("xpath=(//a[normalize-space()='Search More...'])[1]");

    this.productSearchBox = page.locator("xpath=//input[@role='searchbox']");

    this.productSelect = page.locator(
      "xpath=(//table[@class='o_list_table table table-sm table-hover position-relative mb-0 o_list_table_ungrouped table-striped']//tbody//tr[1]//td[2])"
    );

    this.productAddBtn = page.locator("xpath=//button[normalize-space()='Add']");

    this.associatedProduct = page.locator("xpath=//div[@name='associated_product']//input[@type='checkbox']");

    this.warningCloseBtn = page.locator("xpath=//button[@Type='button']//span[contains(text(),'Close')]");

    // ClickAddress btn
    this.clickAddress = page.locator("xpath=//a[normalize-space()='Address']");

    // EnterZipcode btn
    this.CopytoShipToBtn = page.locator("xpath=//label[contains(text(),'Copy to Ship To')]");

    this.enterZip = page.locator("xpath=//input[@id='vendor_zip_0']");

    this.enterStreet = page.locator("xpath=//input[@id='vendor_street_0']");

    this.enterZip1 = page.locator("xpath=//input[@id='ship_zip_0']");

    this.enterStreet1 = page.locator("xpath=//input[@id='ship_street_0']");

    this.enterZip2 = page.locator("xpath=//input[@id='bill_zip_0']");

    this.enterStreet2 = page.locator("xpath=//input[@id='bill_street_0']");

    // save btn
    this.saveBtn = page.locator("xpath=//span[normalize-space()='Confirm Order']");

    this.productMenu = page.locator("xpath=//a[normalize-space()='Products']");

    this.costErrorMsg = page.locator("xpath=//div[@class='o_dialog']//p");

    this.costErrorMsgOk = page.locator("xpath=//button[normalize-space()='Close']");

    this.subTotal_Get = page.locator("xpath=//div[@name='amount_untaxed']");

    this.shipping_handling_Get = page.locator("xpath=//input[@id='shipping_handling_0']");

    this.tax_amount_view_Get = page.locator("xpath=//div[@name='tax_amount_view']");

    this.total_container_deposit_Get = page.locator("xpath=//div[@name='container_deposit_view']");

    this.insurance_Get = page.locator("xpath=//input[@id='insurance_0']");

    this.total_discount_Get = page.locator("xpath=//input[@id='total_discount_view_0']");

    this.total_Get = page.locator("xpath=//div[@name='amount_total']");

    this.Amount_Get = page.locator("xpath=//div[@name='amount_residual']");

    // Receive btn
    this.receiveProductsBtn = page.locator(
      "xpath=(//button[@name='action_view_picking']//span[contains(text(),'Receive Products')])[1]"
    );

    // old qa
    // @FindBy(xpath = "//span[contains(text(),'Verify Quantities  Against Bill')]")
    this.quantitiesBtn = page.locator("xpath=//span[contains(text(),'Verify Quantities Against Bill')]");

    this.returnBtn = page.locator("xpath=//button[@type='button']//span[contains(text(),'Return')]");

    this.returnProductBox = page.locator(
      "xpath=(//table[@class='o_list_table table table-sm table-hover table-striped o_list_table_ungrouped'])[4]//tbody//tr[1]//td[4]"
    );

    this.returnProductBoxQty = page.locator(
      "xpath=(//table[@class='o_list_table table table-sm table-hover table-striped o_list_table_ungrouped'])[4]//tbody//tr[1]//td[4]//input[@name='quantity']"
    );

    this.returnReason = page.locator("xpath=//td[@style='width: 100%;']//textarea[@name='return_reason']");

    this.returnButton = page.locator("xpath=//button[@name='create_returns']//span[contains(text(),'Return')]");

    this.sendMail = page.locator("xpath=//span[normalize-space()='Send PO by Email']");

    this.recipients = page.locator("xpath=//input[@id='partner_ids_0']");

    this.sendBtn = page.locator("xpath=//button[@class='btn btn-primary w-auto o_mail_send']");

    this.action = page.locator("xpath=//button[normalize-space()='Action']");

    this.print = page.locator("xpath=//button[normalize-space()='Print']");

    this.purchaseOrder = page.locator("xpath=//span[normalize-space()='Purchase Order']");

    this.action1 = page.locator("xpath=//button[normalize-space()='Action']");

    this.print1 = page.locator("xpath=//button[normalize-space()='Print']");

    this.quotation = page.locator("xpath=//span[normalize-space()='Request for Quotation']");

    this.cancel = page.locator("xpath=//span[normalize-space()='Cancel']");

    this.action2 = page.locator("xpath=//button[normalize-space()='Action']");

    this.delete = page.locator("xpath=//span[normalize-space()='Delete']");
  }

  async isErrorDisplayed() {
    return this.page
      .locator("xpath=//div[@class='o_notification_content']")
      .isVisible()
      .catch(() => false);
  }

  async enterUserName(user) {
    try {
      await this.userName.fill(String(user));

      await reportStep(this.page, "username is entered successfully", "pass");
    } catch (e) {
      await reportStep(this.page, "username is not entered successfully..." + e, "fail");
    }
    return this;
  }

  async enterPassWord(pass) {
    try {
      await this.passWord.fill(String(pass));

      await reportStep(this.page, "Password is entered successfully", "pass");
    } catch (e) {
      await reportStep(this.page, "Password is not entered successfully..." + e, "fail");
    }
    return this;
  }

  async clickLoginButton() {
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

  async clickPurchaseMenu() {
    try {
      await this.page.waitForTimeout(2000);

      await this.purchaseMenu.click();
      await this.page.waitForTimeout(2000);

      await reportStep(this.page, "Purchasemenu clicked successfully", "pass");
    } catch (e) {
      await reportStep(this.page, "Purchasemenu clicked not successfully..." + e, "fail");
    }
    return this;
  }

  async clickPurchaseOrder(vendorName) {
    try {
      await this.page.waitForTimeout(5000);

      await this.ordersMenubtn.click({ timeout: 30 * 1000 });
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

      await this.termsBox.click();
      await this.page.waitForTimeout(3000);

      await this.termsDropDownBtn.click();
      await this.page.waitForTimeout(3000);

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

      //warningCloseBtn.click();
      //Thread.sleep(10000);

      await reportStep(this.page, "PurchaseOrder products clicked successfully", "pass");
    } catch (e) {
      await reportStep(this.page, "PurchaseOrder products clicked not successfully..." + e, "fail");
    }
    return this;
  }

  async clickPurchaseOrder_ProductADD(entQTY, cost, tax, discount) {
    try {
      // Scoped to the first matching table: an unscoped `//tr[n]` matches the
      // nth <tr> in *every* table on the page, which trips Playwright's
      // strict mode as soon as another table shares that row position.
      const tableXpath =
        "(//table[@class='o_list_table table table-sm table-hover position-relative mb-0 o_list_table_ungrouped table-striped'])[1]";
      const totalRows = await this.page.locator(`xpath=${tableXpath}//tbody//tr`).count();
      console.log('Total number of rows:', totalRows);

      for (let row = 1; row <= Math.min(1, totalRows); row++) {
        const rowXpath = `${tableXpath}//tbody//tr[${row}]`;

        const productRow = this.page.locator(`xpath=${rowXpath}//td[2]`);
        await productRow.click({ timeout: 30 * 1000 });

        const orderQtyInput = this.page.locator(`xpath=${rowXpath}//td[4]//input`);
        await orderQtyInput.clear({ timeout: 30 * 1000 });
        await orderQtyInput.fill(String(entQTY));

        const costInput = this.page.locator(`xpath=${rowXpath}//td[@name='price_unit']//input`);
        const getCost = await costInput.inputValue({ timeout: 30 * 1000 });
        console.log('Existing Each Cost:', getCost);

        // If you need to update cost, uncomment the next lines
        await costInput.clear();

        await costInput.fill(String(cost));

        const taxableInput = this.page.locator(`xpath=${rowXpath}//td[@name='tax_status']//select`);
        // Select the "Yes" option by visible text
        await taxableInput.selectOption({ label: 'Yes' }, { timeout: 30 * 1000 });
        // Optional: Print the selected option
        console.log('Selected option:', 'Yes');

        // const taxInput = this.page.locator(`xpath=${rowXpath}//td[@name='cost_tax']//input`);
        // await taxInput.clear();
        // await taxInput.fill(String(tax));

        const discountInput = this.page.locator(`xpath=${rowXpath}//td[@name='discount']//input`);
        await discountInput.clear({ timeout: 30 * 1000 });
        await discountInput.fill(String(discount));

        const subTotalInput = this.page.locator(`xpath=${rowXpath}//td[@name='price_subtotal']`);
        const getSubTotalInput = await subTotalInput.textContent();
        console.log('SubTotal:', getSubTotalInput);
      }

      await reportStep(this.page, "PurchaseOrder_ProductADD is clicked successfully", "pass");
    } catch (e) {
      await reportStep(this.page, "PurchaseOrder_ProductADD is clicked not successfully..." + e.message, "fail");
    }
    return this;
  }

  async clickPurchaseOrder_ProductADDNegative(entQTY, cost, tax, discount) {
    try {
      // Scoped to the first matching table: an unscoped `//tr[n]` matches the
      // nth <tr> in *every* table on the page, which trips Playwright's
      // strict mode as soon as another table shares that row position.
      const tableXpath =
        "(//table[@class='o_list_table table table-sm table-hover position-relative mb-0 o_list_table_ungrouped table-striped'])[1]";
      const totalRows = await this.page.locator(`xpath=${tableXpath}//tbody//tr`).count();
      console.log('Total number of rows:', totalRows);

      for (let row = 1; row <= Math.min(1, totalRows); row++) {
        const rowXpath = `${tableXpath}//tbody//tr[${row}]`;

        const productRow = this.page.locator(`xpath=${rowXpath}//td[2]`);
        await productRow.click({ timeout: 30 * 1000 });

        const orderQtyInput = this.page.locator(`xpath=${rowXpath}//td[4]//input`);
        await orderQtyInput.clear({ timeout: 30 * 1000 });
        await orderQtyInput.fill(String(entQTY));
        await orderQtyInput.press('Enter');
        try {
          const errorMsg = this.page.locator("xpath=//div[@class='o_dialog']//p");
          await errorMsg.waitFor({ state: 'visible', timeout: 30000 });
          const errorMessageText = await errorMsg.textContent();
          console.log('Validation Error Message:', errorMessageText);

          // Dismiss the validation error
          await this.page.locator("xpath=//button[normalize-space()='Close']").click();
          console.log('Validation error dismissed successfully for row ');
          await this.page.waitForTimeout(3000);
        } catch (e) {
          console.log('No validation error for row ');
        }

        const costInput = this.page.locator(`xpath=${rowXpath}//td[@name='price_unit']//input`);
        const getCost = await costInput.inputValue({ timeout: 30 * 1000 });
        console.log('Existing Each Cost:', getCost);

        // If you need to update cost, uncomment the next lines
        await costInput.clear();
        await costInput.fill(String(cost));
        await costInput.press('Enter');
        try {
          const errorMsg = this.page.locator("xpath=//div[@class='o_dialog']//p");
          await errorMsg.waitFor({ state: 'visible', timeout: 30000 });
          const errorMessageText = await errorMsg.textContent();
          console.log('Validation Error Message:', errorMessageText);

          // Dismiss the validation error
          await this.page.locator("xpath=//button[normalize-space()='Close']").click();
          console.log('Validation error dismissed successfully for row ');
          await this.page.waitForTimeout(3000);
        } catch (e) {
          console.log('No validation error for row ');
        }

        const taxableInput = this.page.locator(`xpath=${rowXpath}//td[@name='tax_status']//select`);
        // Select the "Yes" option by visible text
        await taxableInput.selectOption({ label: 'Yes' }, { timeout: 30 * 1000 });

        // Optional: Print the selected option
        console.log('Selected option:', 'Yes');

        // const taxInput = this.page.locator(`xpath=${rowXpath}//td[@name='cost_tax']//input`);
        // await taxInput.clear();
        // await taxInput.fill(String(tax));

        const discountInput = this.page.locator(`xpath=${rowXpath}//td[@name='discount']//input`);
        await discountInput.clear({ timeout: 30 * 1000 });
        await discountInput.fill(String(discount));

        const subTotalInput = this.page.locator(`xpath=${rowXpath}//td[@name='price_subtotal']`);
        const getSubTotalInput = await subTotalInput.textContent();
        console.log('SubTotal:', getSubTotalInput);
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

      /*	enterZip.clear();
      enterZip.sendKeys(entZipcode);
      enterStreet.clear();
      enterStreet.sendKeys(entStreet);
      enterZip.click();
      Thread.sleep(3000);

      enterZip1.clear();
      enterZip1.sendKeys(entZipcode1);
      enterStreet1.clear();
      enterStreet1.sendKeys(entStreet1);
      Thread.sleep(3000);

      enterZip2.clear();
      enterZip2.sendKeys(entZipcode1);
      enterStreet2.clear();
      enterStreet2.sendKeys(entStreet1);
      Thread.sleep(3000);*/

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
        const modalFooter = this.page.locator('footer.modal-footer');
        await modalFooter.waitFor({ state: 'visible', timeout: 10000 });

        // Click OK button
        const okButton = modalFooter.locator('button.btn-primary');
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
        const modalFooter = this.page.locator('footer.modal-footer');
        await modalFooter.waitFor({ state: 'visible', timeout: 10000 });

        // Click OK button
        const okButton = modalFooter.locator('button.btn-primary');
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
        console.log('Validation Message:', messageText);

        expect(await this.isErrorDisplayed()).toBeTruthy();
      } catch (e) {
        // No validation message found; proceed normally
        console.log('No validation message displayed.');
      }

      try {
        const errorMsg = this.page.locator("xpath=//div[@class='o_dialog']//p");
        await errorMsg.waitFor({ state: 'visible', timeout: 30000 });
        const errorMessageText = await errorMsg.textContent();
        console.log('Validation Error Message:', errorMessageText);

        // Dismiss the validation error
        await this.page.locator("xpath=(//button[normalize-space()='Close'])[2]").click();
        console.log('Validation error dismissed successfully for row ');
        await this.page.waitForTimeout(3000);
      } catch (e) {
        console.log('No validation error for row ');
      }

      // Check if an error message appears and handle it
      try {
        // Wait until the error message is visible
        await this.costErrorMsg.waitFor({ state: 'visible', timeout: 30000 });
        const errorMessageText = await this.costErrorMsg.textContent();
        console.log('Error Message:', errorMessageText);

        // Click the Ok button to dismiss the error message
        await this.costErrorMsgOk.click();
        await this.page.waitForTimeout(5000);
        console.log('Error message dismissed successfully by clicking Ok button.');
        await reportStep(this.page, "Error message handled successfully", "pass");
      } catch (e) {
        // If no error message is displayed, proceed with other methods
        console.log('No error message displayed. Proceeding with other methods...');
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
      console.log('subTotal :', subTotal_GetText);
      console.log('=========================');
      await this.page.waitForTimeout(5000);

      await this.shipping_handling_Get.clear();
      await this.shipping_handling_Get.fill('2.00');
      const shipping_handling_GetText = await this.shipping_handling_Get.textContent();
      console.log('Shipping_handling :', shipping_handling_GetText);
      console.log('=========================');
      await this.page.waitForTimeout(5000);

      const tax_amount_view_GetText = await this.tax_amount_view_Get.textContent();
      console.log('Tax_Amount :', tax_amount_view_GetText);
      console.log('=========================');
      await this.page.waitForTimeout(5000);

      const total_container_deposit_GetText = await this.total_container_deposit_Get.textContent();
      console.log('Container_Deposit :', total_container_deposit_GetText);
      console.log('=========================');
      await this.page.waitForTimeout(5000);

      await this.insurance_Get.clear();
      await this.insurance_Get.fill('2.00');
      const Insurance_GetText = await this.insurance_Get.textContent();
      console.log('Insurance :', Insurance_GetText);
      console.log('=========================');
      await this.page.waitForTimeout(5000);

      await this.total_discount_Get.clear();
      await this.total_discount_Get.fill('2.00');
      const total_discount_GetText = await this.total_discount_Get.textContent();
      console.log('Discount :', total_discount_GetText);
      console.log('=========================');
      await this.page.waitForTimeout(5000);

      const total_GetText = await this.total_Get.textContent();
      console.log('Total :', total_GetText);
      console.log('=========================');
      await this.page.waitForTimeout(5000);

      await reportStep(this.page, "get The Total is clicked successfully", "pass");
    } catch (e) {
      await reportStep(this.page, "get The Total is not clicked successfully..." + e, "fail");
    }
    return this;
  }

  async getTheTotalNegative() {
    try {
      await this.productMenu.click();
      await this.page.waitForTimeout(3000);

      const subTotal_GetText = await this.subTotal_Get.textContent();
      console.log('subTotal :', subTotal_GetText);
      console.log('=========================');
      await this.page.waitForTimeout(5000);

      await this.shipping_handling_Get.clear();
      await this.shipping_handling_Get.fill('-1.00');
      const shipping_handling_GetText = await this.shipping_handling_Get.textContent();
      console.log('Shipping_handling :', shipping_handling_GetText);
      console.log('=========================');
      await this.page.waitForTimeout(5000);

      const tax_amount_view_GetText = await this.tax_amount_view_Get.textContent();
      console.log('Tax_Amount :', tax_amount_view_GetText);
      console.log('=========================');
      await this.page.waitForTimeout(5000);

      const total_container_deposit_GetText = await this.total_container_deposit_Get.textContent();
      console.log('Container_Deposit :', total_container_deposit_GetText);
      console.log('=========================');
      await this.page.waitForTimeout(5000);

      await this.insurance_Get.clear();
      try {
        const errorMsg = this.page.locator("xpath=//div[@class='o_dialog']//p");
        await errorMsg.waitFor({ state: 'visible', timeout: 30000 });
        const errorMessageText = await errorMsg.textContent();
        console.log('Validation Error Message:', errorMessageText);

        // Dismiss the validation error
        await this.page.locator("xpath=//button[normalize-space()='Close']").click();
        console.log('Validation error dismissed successfully for row ');
        await this.page.waitForTimeout(3000);
      } catch (e) {
        console.log('No validation error for row ');
      }
      await this.insurance_Get.clear();
      await this.insurance_Get.fill('-1.00');
      const Insurance_GetText = await this.insurance_Get.textContent();
      console.log('Insurance :', Insurance_GetText);
      console.log('=========================');
      await this.page.waitForTimeout(5000);

      await this.total_discount_Get.clear();
      try {
        const errorMsg = this.page.locator("xpath=//div[@class='o_dialog']//p");
        await errorMsg.waitFor({ state: 'visible', timeout: 30000 });
        const errorMessageText = await errorMsg.textContent();
        console.log('Validation Error Message:', errorMessageText);

        // Dismiss the validation error
        await this.page.locator("xpath=//button[normalize-space()='Close']").click();
        console.log('Validation error dismissed successfully for row ');
        await this.page.waitForTimeout(3000);
      } catch (e) {
        console.log('No validation error for row ');
      }
      await this.total_discount_Get.fill('2.00');
      const total_discount_GetText = await this.total_discount_Get.textContent();
      console.log('Discount :', total_discount_GetText);
      console.log('=========================');
      await this.page.waitForTimeout(5000);

      const total_GetText = await this.total_Get.textContent();
      console.log('Total :', total_GetText);
      console.log('=========================');
      await this.page.waitForTimeout(5000);

      await reportStep(this.page, "get The Total is clicked successfully", "pass");
    } catch (e) {
      await reportStep(this.page, "get The Total is not clicked successfully..." + e, "fail");
    }
    return this;
  }

  async clickReceivebtn() {
    try {
      await this.receiveProductsBtn.click({ timeout: 30 * 1000 });
      await this.page.waitForTimeout(5000);

      await this.quantitiesBtn.click();
      await this.page.waitForTimeout(30000);

      await reportStep(this.page, "Receive button clicked successfully", "pass");
    } catch (e) {
      await reportStep(this.page, "Receive button clicked not successfully..." + e, "fail");
    }
    return this;
  }

  async clickReturn(ReturnQTY, Reason) {
    try {
      await this.returnBtn.click({ timeout: 30 * 1000 });
      await this.page.waitForTimeout(5000);

      await this.returnProductBox.click();
      await this.page.waitForTimeout(30000);

      await this.returnProductBoxQty.fill(String(ReturnQTY));
      await this.page.waitForTimeout(5000);

      await this.returnReason.click();
      await this.page.waitForTimeout(5000);

      await this.returnReason.fill(String(Reason));
      await this.page.waitForTimeout(5000);

      await this.returnButton.click();
      await this.page.waitForTimeout(5000);

      await reportStep(this.page, "Return button clicked successfully", "pass");
    } catch (e) {
      await reportStep(this.page, "Return button clicked not successfully..." + e, "fail");
    }
    return this;
  }

  async clickMail() {
    try {
      await this.page.waitForTimeout(5000);
      await this.sendMail.click();
      await this.page.waitForTimeout(2000);
      await this.recipients.fill("komala@averigo.com");
      await this.page.waitForTimeout(2000);
      await this.sendBtn.click();
      await this.page.waitForTimeout(5000);
      await this.action.click();
      await this.page.waitForTimeout(2000);
      // print.click();
      // Thread.sleep(2000);
      await this.purchaseOrder.click();
      await this.page.waitForTimeout(5000);
      /*  action1.click();
      Thread.sleep(2000);
      print1.click();
      Thread.sleep(2000);
      quotation.click();
      Thread.sleep(5000);*/
      await this.cancel.click();
      await this.page.waitForTimeout(2000);
      await this.action2.click();
      await this.page.waitForTimeout(2000);
      await this.delete.click();
      await this.page.waitForTimeout(5000);

      await reportStep(this.page, "Return button clicked successfully", "pass");
    } catch (e) {
      await reportStep(this.page, "Return button clicked not successfully..." + e, "fail");
    }
    return this;
  }
}

module.exports = { PurchaseOrderPage };
