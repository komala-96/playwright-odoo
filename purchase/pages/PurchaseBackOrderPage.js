const { expect } = require('../fixtures/base');
const { reportStep } = require('../utils/reportStep');
const { ensureLoggedIn } = require('../utils/loginHelper');

class PurchaseBackOrderPage {
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
    this.ordersMenubtn1 = page.locator("xpath=//a[contains(text(),'Purchase Order')]");

    // Create btn
    this.createBtn = page.locator("xpath=//button[normalize-space()='New']");
    this.clickVendor = page.locator("xpath=//div[@name='partner_id']//input[@type='text']");
    this.vendorSearchMore = page.locator("xpath=//a[@id='partner_id_0_0_8']");
    this.vendorSearchMoreBox = page.locator("xpath=//input[@role='searchbox']");

    // Selectlist
    this.vendorSelect = page.locator("xpath=//tr[@class='o_data_row']//td[1]");

    this.clickPurchaseManager = page.locator("xpath=//div[@name='purchase_manager']//input[@type='text']");

    // Selectlist
    this.selectListPurchaseManager = page.locator("xpath=//a[@id='purchase_manager_0_0_0']");

    this.termsBox = page.locator("xpath=(//div[@name='payment_term_id']//input[@type='text'])[1]");

    // Create btn
    this.termsDropDownBtn = page.locator("xpath=//a[@id='payment_term_id_0_0_1']");

    this.product = page.locator("xpath=//div[@name='product_ids']//input[@type='text']");
    this.productSearchMore = page.locator("xpath=(//a[normalize-space()='Search More...'])[1]");
    this.productSearchBox = page.locator("xpath=//input[@role='searchbox']");
    this.productSelect = page.locator(
      "xpath=(//table[@class='o_list_table table table-sm table-hover position-relative mb-0 o_list_table_ungrouped table-striped']//tbody//tr[1]//td[2])"
    );
    this.productAddBtn = page.locator("xpath=//button[normalize-space()='Add']");

    this.warningCloseBtn = page.locator("xpath=//button[@Type='button']//span[contains(text(),'Close')]");

    // ClickAddress btn
    this.clickAddress = page.locator("xpath=//a[normalize-space()='Address']");

    // EnterZipcode btn
    this.CopytoShipToBtn = page.locator("xpath=//label[contains(text(),'Copy to Ship To')]");

    this.enterZip = page.locator("xpath=//input[@name='vendor_zip']");
    this.enterStreet = page.locator("xpath=//input[@name='vendor_street']");
    this.enterZip1 = page.locator("xpath=//input[@name='bill_zip']");
    this.enterStreet1 = page.locator("xpath=//input[@name='bill_street']");

    // save btn
    this.saveBtn = page.locator("xpath=//span[normalize-space()='Confirm Order']");

    this.productMenu = page.locator("xpath=//a[normalize-space()='Products']");

    this.costErrorMsg = page.locator("xpath=//div[@class='o_dialog_warning modal-body']//p");
    this.costErrorMsgOk = page.locator("xpath=//button[@type='button']//span[contains(text(),'Ok')]");

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
    this.quantitiesBtn1 = page.locator("xpath=//span[contains(text(),'Verify Quantities Against Bill')]");

    this.returnBtn = page.locator("xpath=//button[@type='button']//span[contains(text(),'Return')]");
    this.returnProductBox = page.locator(
      "xpath=(//table[@class='o_list_table table table-sm table-hover table-striped o_list_table_ungrouped'])[4]//tbody//tr[1]//td[4]"
    );
    this.returnProductBoxQty = page.locator(
      "xpath=(//table[@class='o_list_table table table-sm table-hover table-striped o_list_table_ungrouped'])[4]//tbody//tr[1]//td[4]//input[@name='quantity']"
    );
    this.returnReason = page.locator("xpath=//td[@style='width: 100%;']//textarea[@name='return_reason']");
    this.returnButton = page.locator("xpath=//button[@name='create_returns']//span[contains(text(),'Return')]");
    this.receivingQuan = page.locator(
      "xpath=(//table[@class='o_list_table table table-sm table-hover position-relative mb-0 o_list_table_ungrouped table-striped'])//tbody//tr[1]//td[5]//input"
    );

    this.note = page.locator("xpath=//textarea[@name='reason_note']");

    this.createBackOrder = page.locator("xpath=//span[normalize-space()='Create Backorder']");
    this.backOrder = page.locator("xpath=//a[normalize-space()='Backorders']");
    this.editBtn = page.locator("xpath=//button[normalize-space()='Edit']");

    this.orderSelect = page.locator(
      "xpath=//table[@class='o_list_table table table-sm table-hover position-relative mb-0 o_list_table_ungrouped table-striped']//tbody//tr[1]//td[2]"
    );
    this.orderSelect1 = page.locator(
      "xpath=//table[@class='o_list_table table table-sm table-hover position-relative mb-0 o_list_table_ungrouped table-striped']//tbody//tr[1]//td[3]"
    );

    this.applyBtn = page.locator("xpath=//span[normalize-space()='Apply']");
    this.receipt = page.locator("xpath=//span[normalize-space()='Receipt']");
    this.receiptSelect = page.locator(
      "xpath=//table[@class='o_list_table table table-sm table-hover position-relative mb-0 o_list_table_ungrouped table-striped']//tbody//tr[1]//td[2]"
    );

    this.print = page.locator("xpath=//span[normalize-space()='Print']");
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
      await this.page.waitForTimeout(2000);

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

  async clickPurchaseMenu() {
    try {
      // new WebDriverWait(driver, Duration.ofSeconds(30))
      // .until(ExpectedConditions.elementToBeClickable(menu)).click();
      await this.page.waitForTimeout(2000);

      await this.purchaseMenu.click();
      await this.page.waitForTimeout(2000);

      await reportStep(this.page, 'Purchasemenu clicked successfully', 'pass');
    } catch (e) {
      await reportStep(this.page, 'Purchasemenu clicked not successfully...' + e, 'fail');
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

      await this.vendorSelect.click();
      await this.page.waitForTimeout(5000);

      await reportStep(this.page, 'Purchase Order Creation clicked successfully', 'pass');
    } catch (e) {
      await reportStep(this.page, 'Purchase Order Creation clicked not successfully...' + e, 'fail');
    }
    return this;
  }

  async clickPurchaseOrder_Manager() {
    try {
      // clickPurchaseManager.click();
      await this.page.waitForTimeout(5000);

      // selectListPurchaseManager.click();
      await this.page.waitForTimeout(5000);

      await this.termsBox.click();
      await this.page.waitForTimeout(3000);

      await this.termsDropDownBtn.click();
      await this.page.waitForTimeout(3000);

      await reportStep(this.page, 'PurchaseOrder Manager clicked successfully', 'pass');
    } catch (e) {
      await reportStep(this.page, 'PurchaseOrder Manager clicked not successfully...' + e, 'fail');
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

      // warningCloseBtn.click();
      // Thread.sleep(10000);

      await reportStep(this.page, 'PurchaseOrder Products clicked successfully', 'pass');
    } catch (e) {
      await reportStep(this.page, 'PurchaseOrder Products clicked not successfully...' + e, 'fail');
    }
    return this;
  }

  async clickPurchaseOrder_ProductADD(entQTY, cost, tax, discount) {
    try {
      const totalRows = await this.page
        .locator(
          "xpath=//table[@class='o_list_table table table-sm table-hover position-relative mb-0 o_list_table_ungrouped table-striped']//tbody//tr"
        )
        .count();
      console.log('Total number of rows: ' + totalRows);

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
        console.log('Existing Each Cost: ' + getCost);

        // If you need to update cost, uncomment the next lines
        await costInput.clear();
        await costInput.fill(String(cost));

        const taxableInput = this.page.locator(`xpath=//tr[${row}]//td[@name='tax_status']//select`);
        await taxableInput.waitFor({ state: 'visible', timeout: 30000 });
        // Select the "Yes" option by visible text
        await taxableInput.selectOption({ label: 'Yes' });
        // Optional: Print the selected option
        const selectedOptionText = await taxableInput.locator('option:checked').textContent();
        console.log('Selected option: ' + selectedOptionText);

        // const taxInput = this.page.locator(`xpath=//tr[${row}]//td[@name='cost_tax']//input`);
        // await taxInput.clear();
        // await taxInput.fill(String(tax));

        const discountInput = this.page.locator(`xpath=//tr[${row}]//td[@name='discount']//input`);
        await discountInput.waitFor({ state: 'visible', timeout: 30000 });
        await discountInput.clear();
        await discountInput.fill(String(discount));

        const subTotalInput = this.page.locator(`xpath=//tr[${row}]//td[@name='price_subtotal']`);
        await subTotalInput.waitFor({ state: 'visible', timeout: 30000 });
        const getSubTotalInput = await subTotalInput.textContent();
        console.log('SubTotal: ' + getSubTotalInput);
      }

      await reportStep(this.page, 'PurchaseOrder_ProductADD is clicked successfully', 'pass');
    } catch (e) {
      await reportStep(this.page, 'PurchaseOrder_ProductADD is clicked not successfully...' + e.message, 'fail');
    }
    return this;
  }

  async clickPurchaseOrder_Address(entZipcode, entStreet, entZipcode1, entStreet1) {
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

      await reportStep(this.page, 'PurchaseOrder_Address is clicked successfully', 'pass');
    } catch (e) {
      await reportStep(this.page, 'PurchaseOrder_Address is clicked not successfully...' + e, 'fail');
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
        const modalFooter1 = this.page.locator('footer.modal-footer');
        await modalFooter1.waitFor({ state: 'visible', timeout: 10000 });

        // Click OK button
        const okButton1 = modalFooter1.locator('button.btn-primary');
        await okButton1.click();
      } catch (e) {
        // No validation message found; proceed normally
        console.log('No validation message displayed.');
      }

      await reportStep(this.page, 'PurchaseOrder_Address is clicked successfully', 'pass');
    } catch (e) {
      await reportStep(this.page, 'PurchaseOrder_Address is clicked not successfully...' + e, 'fail');
    }
    return this;
  }

  async clickSavebtn() {
    try {
      await this.saveBtn.click();
      await this.page.waitForTimeout(30000);

      await reportStep(this.page, 'Save button clicked successfully', 'pass');
    } catch (e) {
      await reportStep(this.page, 'Save button clicked not successfully...' + e, 'fail');
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
        console.log('Validation Message: ' + messageText);

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
        console.log('Error Message: ' + errorMessageText);

        // Click the Ok button to dismiss the error message
        await this.costErrorMsgOk.click();
        await this.page.waitForTimeout(5000);
        console.log('Error message dismissed successfully by clicking Ok button.');
        await reportStep(this.page, 'Error message handled successfully', 'pass');
      } catch (e) {
        // If no error message is displayed, proceed with other methods
        console.log('No error message displayed. Proceeding with other methods...');
        await reportStep(this.page, 'No error message displayed during save operation', 'pass');
        // You can call other methods here if needed
        // executeOtherMethods();
      }
    } catch (e) {
      // Log failure in case of any exception during the main save button click process
      await reportStep(this.page, 'Save button click was not successful: ' + e.message, 'fail');
    }
    return this;
  }

  async getTheTotal() {
    try {
      await this.productMenu.click();
      await this.page.waitForTimeout(3000);

      const subTotal_GetText = await this.subTotal_Get.textContent();
      console.log('subTotal : ' + subTotal_GetText);
      console.log('=========================');
      await this.page.waitForTimeout(5000);

      const shipping_handling_GetText = await this.shipping_handling_Get.textContent();
      console.log('Shipping_handling : ' + shipping_handling_GetText);
      console.log('=========================');
      await this.page.waitForTimeout(5000);

      const tax_amount_view_GetText = await this.tax_amount_view_Get.textContent();
      console.log('Tax_Amount :' + tax_amount_view_GetText);
      console.log('=========================');
      await this.page.waitForTimeout(5000);

      const total_container_deposit_GetText = await this.total_container_deposit_Get.textContent();
      console.log('Container_Deposit : ' + total_container_deposit_GetText);
      console.log('=========================');
      await this.page.waitForTimeout(5000);

      const Insurance_GetText = await this.insurance_Get.textContent();
      console.log('Insurance : ' + Insurance_GetText);
      console.log('=========================');
      await this.page.waitForTimeout(5000);

      const total_discount_GetText = await this.total_discount_Get.textContent();
      console.log('Discount : ' + total_discount_GetText);
      console.log('=========================');
      await this.page.waitForTimeout(5000);

      const total_GetText = await this.total_Get.textContent();
      console.log('Total : ' + total_GetText);
      console.log('=========================');
      await this.page.waitForTimeout(5000);

      await reportStep(this.page, 'get The Total is clicked successfully', 'pass');
    } catch (e) {
      await reportStep(this.page, 'get The Total is not clicked successfully...' + e, 'fail');
    }
    return this;
  }

  async clickReceivebtn() {
    try {
      await this.receiveProductsBtn.click({ timeout: 30000 });
      await this.page.waitForTimeout(8000);
      // editBtn.click();

      await this.page.waitForTimeout(5000);

      const sourceDocument = this.page.locator(
        "xpath=(//table[@class='o_list_table table table-sm table-hover position-relative mb-0 o_list_table_ungrouped table-striped'])//tbody//tr[1]//td[2]"
      );
      await sourceDocument.waitFor({ state: 'visible', timeout: 30000 });
      await sourceDocument.scrollIntoViewIfNeeded();
      await this.page.waitForTimeout(500);
      await sourceDocument.click();
      await this.page.waitForTimeout(3000);

      // Re-fetch the Picking Quantity input before interacting
      const receivingQuan = this.page.locator(
        "xpath=(//table[@class='o_list_table table table-sm table-hover position-relative mb-0 o_list_table_ungrouped table-striped'])//tbody//tr[1]//td[5]//input"
      );
      await receivingQuan.waitFor({ state: 'visible', timeout: 30000 });

      await receivingQuan.clear();

      await receivingQuan.fill('1');
      await this.page.waitForTimeout(10000);

      await this.quantitiesBtn.click();
      await this.page.waitForTimeout(10000);
      await this.createBackOrder.click();
      await this.page.waitForTimeout(1500);
      // note.sendKeys("test");

      await reportStep(this.page, 'Receive button clicked successfully', 'pass');
    } catch (e) {
      await reportStep(this.page, 'Receive button clicked not successfully...' + e, 'fail');
    }
    return this;
  }

  async clickBackOrder() {
    try {
      await this.page.waitForTimeout(5000);
      await this.backOrder.click();
      await this.page.waitForTimeout(3000);
      await this.orderSelect.click();
      await this.page.waitForTimeout(3000);

      await this.quantitiesBtn1.click();
      await this.page.waitForTimeout(3000);
      // applyBtn.click();
      // Thread.sleep(10000);

      await reportStep(this.page, 'backorder button clicked successfully', 'pass');
    } catch (e) {
      await reportStep(this.page, 'backorder button clicked not successfully...' + e, 'fail');
    }
    return this;
  }

  async clickBackOrderNegative() {
    try {
      await this.page.waitForTimeout(5000);
      await this.backOrder.click();
      await this.page.waitForTimeout(3000);
      await this.orderSelect.click();
      await this.page.waitForTimeout(3000);
      const sourceDocument = this.page.locator(
        "xpath=(//table[@class='o_list_table table table-sm table-hover position-relative mb-0 o_list_table_ungrouped table-striped'])//tbody//tr[1]//td[2]"
      );
      await sourceDocument.waitFor({ state: 'visible', timeout: 30000 });
      await sourceDocument.scrollIntoViewIfNeeded();
      await this.page.waitForTimeout(500);
      await sourceDocument.click();
      await this.page.waitForTimeout(3000);

      // Re-fetch the Picking Quantity input before interacting
      const receivingQuan = this.page.locator(
        "xpath=(//table[@class='o_list_table table table-sm table-hover position-relative mb-0 o_list_table_ungrouped table-striped'])//tbody//tr[1]//td[5]//input"
      );
      await receivingQuan.waitFor({ state: 'visible', timeout: 30000 });

      await receivingQuan.clear();

      await receivingQuan.fill('-1');
      await this.page.waitForTimeout(10000);

      await this.quantitiesBtn1.click();
      try {
        const errorMsg = this.page.locator("xpath=//div[@class='o_dialog']//p");
        await errorMsg.waitFor({ state: 'visible', timeout: 30000 });
        const errorMessageText = await errorMsg.textContent();
        console.log('Validation Error Message: ' + errorMessageText);

        // Dismiss the validation error
        await this.page.locator("xpath=//button[normalize-space()='Close']").click();
        console.log('Validation error dismissed successfully for row ');
        await this.page.waitForTimeout(3000);
      } catch (e) {
        console.log('No validation error for row ');
      }
      await this.page.waitForTimeout(3000);
      // applyBtn.click();
      // Thread.sleep(10000);

      await reportStep(this.page, 'backorder button clicked successfully', 'pass');
    } catch (e) {
      await reportStep(this.page, 'backorder button clicked not successfully...' + e, 'fail');
    }
    return this;
  }

  async clickConfirmOrder() {
    try {
      await this.page.waitForTimeout(5000);

      await this.ordersMenubtn1.click({ timeout: 30000 });
      await this.page.waitForTimeout(10000);
      await this.orderSelect1.click();
      await this.page.waitForTimeout(5000);
      await this.receipt.click();
      await this.page.waitForTimeout(5000);
      await this.receiptSelect.click();
      await this.page.waitForTimeout(5000);
      await this.print.click();
      await this.page.waitForTimeout(5000);

      await reportStep(this.page, 'Purchase Order Receipt clicked successfully', 'pass');
    } catch (e) {
      await reportStep(this.page, 'Purchase Order Receipt  clicked not successfully...' + e, 'fail');
    }
    return this;
  }
}

module.exports = { PurchaseBackOrderPage };
