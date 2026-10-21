const { reportStep } = require('../utils/reportStep');
const { expect } = require('../fixtures/base');
const { ensureLoggedIn } = require('../utils/loginHelper');

class PurchaseBill {
  constructor(page) {
    this.page = page;

    // Login Page
    this.userName = page.locator('xpath=//input[@name=\'login\']');
    this.passWord = page.locator('xpath=//input[@name=\'password\']');
    this.logIn = page.locator('xpath=//button[@type=\'submit\']');

    // Menu
    this.menu = page.locator("xpath=//ul[@class='o_menu_apps']//i[@class='fa fa-bars']");

    // financialacct
    this.purchase = page.locator("xpath=//div[contains(text(),'Purchase')]");

    // financialacct
    this.billMenu = page.locator("xpath=//a[contains(text(),'Bill')]");

    // Create btn
    this.createBtn = page.locator("xpath=//button[normalize-space()='New']");

    this.clickVendor = page.locator("xpath=//div[@name='partner_id']//input[@type='text']");

    this.vendorSearchMore = page.locator("xpath=//a[@id='partner_id_0_0_8']");

    this.vendorSearchMoreBox = page.locator("xpath=//input[@placeholder='Search...']");

    // Selectlist
    this.VendorSelect = page.locator("xpath=(//table[@class='o_list_table table table-sm table-hover position-relative mb-0 o_list_table_ungrouped table-striped']//tbody//tr[1]//td[1])[2]");

    this.purchaseManager = page.locator("xpath=//input[@id='purchase_manager_0']");

    this.purchaseManagerSelect = page.locator("xpath=//a[@id='purchase_manager_0_0_1']");

    this.owner = page.locator("xpath=//input[@id='invoice_user_id_0']");

    this.ownerSelect = page.locator("xpath=//a[@id='invoice_user_id_0_0_0']");

    this.reference = page.locator("xpath=//input[@id='ref_0']");

    this.product = page.locator("xpath=//div[@name='product_ids']//input[@type='text']");

    this.productSearchMore = page.locator("xpath=//a[@id='product_ids_0_0_1']");

    this.productSearchBox = page.locator("xpath=//input[@placeholder='Search...']");

    this.productSelect = page.locator("xpath=//tr[@class='o_data_row o_row_draggable']//td[3]");

    this.productAddBtn = page.locator("xpath=(//span[contains(text(),'Add')])[1]");

    this.otherInfo = page.locator("xpath=//a[normalize-space()='Other Info']");

    this.incoterm = page.locator("xpath=//input[@id='invoice_incoterm_id_0']");

    this.incotermSelect = page.locator("xpath=//a[@id='invoice_incoterm_id_0_0_0']");

    this.fiscal = page.locator("xpath=//input[@id='fiscal_position_id_0']");

    this.fiscalSelect = page.locator("xpath=//a[@id='fiscal_position_id_0_0_0']");

    this.cash = page.locator("xpath=//input[@id='invoice_cash_rounding_id_0']");

    this.cashSelect = page.locator("xpath=//a[@id='invoice_cash_rounding_id_0_0_0']");

    this.paymentRef = page.locator("xpath=//input[@id='payment_reference_0']");

    this.shipping_handling = page.locator("xpath=//div[@name='shipping_handling']//input[@type='text']");

    this.insurance = page.locator("xpath=//div[@name='insurance']//input[@type='text']");

    this.total_discount_view = page.locator("xpath=//div[@name='total_discount']//input[@type='text']");

    // save btn
    this.postBtn = page.locator("xpath=(//button[@name='action_post'])[1]");

    this.billLine = page.locator("xpath=//a[normalize-space()='Bill Lines']");

    this.taxAmt = page.locator("xpath=//div[@name='tax_amount_view']");

    this.subTotal = page.locator("xpath=//div[@name='amount_untaxed']");

    this.total = page.locator("xpath=//div[@name='amount_total_view']");

    // save btn
    this.saveBtn = page.locator("xpath=//span[normalize-space()='Confirm']");

    this.getVendorName = page.locator("xpath=(//div[@name='partner_id'])[1]");

    this.printBtn = page.locator("xpath=//button[normalize-space()='Action']");

    this.InvoiceSelect = page.locator("xpath=//button[normalize-space()='Print']");

    this.pdfDownload = page.locator("xpath=//span[normalize-space()='Bill']");

    this.RegisterPayment = page.locator("xpath=//span[normalize-space()='Register Payment']");

    this.modeOfPayment = page.locator("xpath=//select[@id='payment_type_0']");

    this.checkNo = page.locator("xpath=//input[@id='check_no_0']");

    // sendkeys
    this.amount = page.locator("xpath=//input[@id='amount_0']");

    // 101401 Bank 1 select option
    this.depositTo = page.locator("xpath=//select[@id='account_id_0']");

    this.checkBox = page.locator("xpath=//table[@class='o_list_table table table-sm table-hover position-relative mb-0 o_list_table_ungrouped table-striped']//tbody//tr[2]//td[1]");

    this.checkBoxClick = page.locator("xpath=//td[@name='is_checked']//input[@type='checkbox']");

    // click
    this.saveButton = page.locator("xpath=//button[@name='action_post']");

    // get text
    this.receipt_No = page.locator("xpath=//div[@name='name']");

    this.receipt_Date = page.locator("xpath=//div[@name='receipt_date']");

    this.unapplied_amount = page.locator("xpath=//div[@name='unapplied_amount']");

    this.vendorBalance = page.locator("xpath=//div[@name='bill_balance']");

    this.creditBalance = page.locator("xpath=//div[@name='vendor_advance_balance']");

    this.action = page.locator("xpath=//button[normalize-space()='Action']");

    this.print = page.locator("xpath=//button[normalize-space()='Print']");

    this.paymentReceipt = page.locator("xpath=(//span[normalize-space()='Bill Payment'])");

    this.backtoInvoice = page.locator("xpath=//li[@class='breadcrumb-item d-inline-flex min-w-0 o_back_button']//a[1]");

    this.action1 = page.locator("xpath=//button[normalize-space()='Action']");

    this.duplicate = page.locator("xpath=//span[normalize-space()='Duplicate']");

    this.cancelEntry = page.locator("xpath=//span[normalize-space()='Cancel Entry']");

    this.action2 = page.locator("xpath=//button[normalize-space()='Action']");

    this.delete = page.locator("xpath=//span[normalize-space()='Delete']");

    this.confirmDelete = page.locator("xpath=//Button[normalize-space()='Delete']");

    this.creditNote = page.locator("xpath=//span[normalize-space()='Add Credit Note']");

    this.reverse = page.locator("xpath=//span[normalize-space()='Reverse']");

    this.post = page.locator("xpath=(//button[@name='action_post'])[1]");

    this.resetToDraft = page.locator("xpath=//span[normalize-space()='Reset to Draft']");
  }

  async isErrorDisplayed() {
    return this.page
      .locator("xpath=//div[@class='o_notification_content']")
      .isVisible()
      .catch(() => false);
  }

  async enter_Username(user) {
    try {
      await this.userName.fill(String(user));

      await reportStep(this.page, 'username is entered successfully', 'pass');
    } catch (e) {
      await reportStep(this.page, 'username is not entered successfully...' + e, 'fail');
    }
    return this;
  }

  async enter_Password(pass) {
    try {
      await this.passWord.fill(String(pass));

      await reportStep(this.page, 'Password is entered successfully', 'pass');
    } catch (e) {
      await reportStep(this.page, 'Password is not entered successfully...' + e, 'fail');
    }
    return this;
  }

  async click_Login_Button() {
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

  async click_Menu() {
    try {
      await this.menu.click({ timeout: 30 * 1000 });
      await this.page.waitForTimeout(5000);

      await reportStep(this.page, 'Menu clicked successfully', 'pass');
    } catch (e) {
      await reportStep(this.page, 'Menu clicked not successfully...' + e, 'fail');
    }
    return this;
  }

  async click_PucrahseBillMenuBtn() {
    try {
      // This locator targets the home-dashboard "Purchase" app tile. When
      // this method runs right after PurchaseOrderPage in the same session
      // (as in the e2e flow), we're already inside the Purchase app and
      // that tile isn't on screen at all - only click it when it's actually
      // present, instead of waiting out its full timeout for nothing.
      if (await this.purchase.isVisible({ timeout: 5000 }).catch(() => false)) {
        await this.purchase.click();
        await this.page.waitForTimeout(8000);
      }

      await this.billMenu.click({ timeout: 30 * 1000 });
      await this.page.waitForTimeout(8000);

      await this.createBtn.click();
      await this.page.waitForTimeout(5000);

      await reportStep(this.page, 'Pucrahse Bill Menu clicked successfully', 'pass');
    } catch (e) {
      await reportStep(this.page, 'Pucrahse Bill Menu clicked not successfully...' + e, 'fail');
    }
    return this;
  }

  async clickVendorCreation(vendorName) {
    try {
      await this.clickVendor.click();
      await this.page.waitForTimeout(5000);

      await this.vendorSearchMore.click();
      await this.page.waitForTimeout(5000);

      await this.vendorSearchMoreBox.click();
      await this.page.waitForTimeout(5000);

      await this.vendorSearchMoreBox.fill(String(vendorName));
      await this.vendorSearchMoreBox.press('Enter');
      await this.page.waitForTimeout(5000);

      await this.VendorSelect.click();
      await this.page.waitForTimeout(5000);
      await this.purchaseManager.click();
      await this.page.waitForTimeout(5000);
      await this.purchaseManagerSelect.click();
      await this.page.waitForTimeout(5000);
      await this.owner.click();
      await this.ownerSelect.click();
      await this.page.waitForTimeout(5000);
      await this.reference.fill('komala');
      await this.page.waitForTimeout(5000);

      await reportStep(this.page, 'Vendor Creation clicked successfully', 'pass');
    } catch (e) {
      await reportStep(this.page, 'Vendor Creation clicked not successfully...' + e, 'fail');
    }
    return this;
  }

  async click_Poducts(productName) {
    try {
      await this.product.click();
      await this.page.waitForTimeout(5000);

      // productSearchMore.click();
      await this.productSearchMore.evaluate((node) => node.click());
      await this.page.waitForTimeout(5000);

      /*productSearchBox.click();
      Thread.sleep(5000);

      productSearchBox.sendKeys(productName + Keys.ENTER);
      Thread.sleep(5000);

      productSelect.click();
      Thread.sleep(5000);*/

      await this.productAddBtn.click();
      await this.page.waitForTimeout(15000);

      await reportStep(this.page, 'Purchase Order Add clicked successfully', 'pass');
    } catch (e) {
      await reportStep(this.page, 'Purchase Order Add clicked not successfully...' + e, 'fail');
    }
    return this;
  }

  async clickProductQty(qty) {
    try {
      const rowsXpath =
        "//table[@class='o_list_table table table-sm table-hover position-relative mb-0 o_list_table_ungrouped table-striped']//tbody//tr";
      const totalRows = await this.page.locator('xpath=' + rowsXpath).count();
      console.log('Total number of rows: ' + totalRows);

      // This list has an extra unlabeled column (a favorites-star cell)
      // before Product, shifting every column one to the right of what a
      // plain header count would suggest: 1=checkbox, 2=(favorite star,
      // empty), 3=Product, 4=Quantity, 5=UoM, 6=Cost.
      for (let row = 1; row <= Math.min(1, totalRows); row++) {
        const productNameEl = this.page.locator(
          `xpath=//table[@class='o_list_table table table-sm table-hover position-relative mb-0 o_list_table_ungrouped table-striped']//tbody//tr[${row}]//td[3]`
        );
        await productNameEl.click({ timeout: 30 * 1000 });

        const productQty = this.page.locator(
          `xpath=//table[@class='o_list_table table table-sm table-hover position-relative mb-0 o_list_table_ungrouped table-striped']//tbody//tr[${row}]//td[4]//input`
        );
        await productQty.click({ timeout: 30 * 1000 });
        await productQty.clear();
        await productQty.fill(String(qty));
        await this.page.waitForTimeout(3000);

        const costInput = this.page.locator(
          `xpath=//table[@class='o_list_table table table-sm table-hover position-relative mb-0 o_list_table_ungrouped table-striped']//tbody//tr[${row}]//td[6]//input`
        );
        await costInput.click({ timeout: 30 * 1000 });
        const getCost = await costInput.inputValue();
        console.log('Cost: ' + getCost);
        console.log('=========================');
        await this.page.waitForTimeout(5000);
        await costInput.clear();
        await costInput.fill(String(qty));
        await this.page.waitForTimeout(3000);
      }

      await reportStep(this.page, 'Product Qty clicked successfully', 'pass');
    } catch (e) {
      await reportStep(this.page, 'Product Qty clicked not successfully...' + e, 'fail');
    }
    return this;
  }

  async clickProductQtyNegative(qty) {
    try {
      const rowsXpath =
        "//table[@class='o_list_table table table-sm table-hover position-relative mb-0 o_list_table_ungrouped table-striped']//tbody//tr";
      const totalRows = await this.page.locator('xpath=' + rowsXpath).count();
      console.log('Total number of rows: ' + totalRows);

      for (let row = 1; row <= Math.min(1, totalRows); row++) {
        const productNameEl = this.page.locator(
          `xpath=//table[@class='o_list_table table table-sm table-hover position-relative mb-0 o_list_table_ungrouped table-striped']//tbody//tr[${row}]//td[2]`
        );
        await productNameEl.click({ timeout: 30 * 1000 });

        const productQty = this.page.locator(
          `xpath=//table[@class='o_list_table table table-sm table-hover position-relative mb-0 o_list_table_ungrouped table-striped']//tbody//tr[${row}]//td[3]//input`
        );
        await productQty.click({ timeout: 30 * 1000 });
        await productQty.clear();
        await productQty.fill(String(qty));
        await this.page.waitForTimeout(3000);

        const costInput = this.page.locator(
          `xpath=//table[@class='o_list_table table table-sm table-hover position-relative mb-0 o_list_table_ungrouped table-striped']//tbody//tr[${row}]//td[5]//input`
        );
        await costInput.click({ timeout: 30 * 1000 });
        const getCost = await costInput.inputValue();
        console.log('Cost: ' + getCost);
        console.log('=========================');
        await this.page.waitForTimeout(5000);
        await costInput.clear();
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
        await costInput.fill(String(qty));
        await costInput.press('Enter');
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
      }

      await reportStep(this.page, 'Product Qty clicked successfully', 'pass');
    } catch (e) {
      await reportStep(this.page, 'Product Qty clicked not successfully...' + e, 'fail');
    }
    return this;
  }

  async clickTaxUpdate(shipping, insuranceAmt, discount) {
    try {
      await this.page.waitForTimeout(5000);
      await this.shipping_handling.click();

      await this.page.waitForTimeout(5000);

      await this.shipping_handling.clear();
      await this.page.waitForTimeout(5000);

      await this.shipping_handling.fill(String(shipping));
      await this.shipping_handling.press('Enter');
      await this.page.waitForTimeout(5000);

      await this.page.waitForTimeout(5000);
      await this.insurance.click();
      await this.page.waitForTimeout(5000);

      await this.insurance.clear();
      await this.page.waitForTimeout(5000);

      await this.insurance.fill(String(insuranceAmt));
      await this.insurance.press('Enter');
      await this.page.waitForTimeout(5000);

      await this.page.waitForTimeout(5000);
      await this.total_discount_view.click();
      await this.page.waitForTimeout(5000);

      await this.total_discount_view.clear();
      await this.page.waitForTimeout(5000);

      await this.total_discount_view.fill(String(discount));
      await this.total_discount_view.press('Enter');
      await this.page.waitForTimeout(5000);

      await reportStep(this.page, 'Tax Update is clicked successfully', 'pass');
    } catch (e) {
      await reportStep(this.page, 'Tax Update is not clicked successfully ' + e.message, 'fail');
    }
    return this;
  }

  async clickTaxUpdateNegative(shipping, insuranceAmt, discount) {
    try {
      await this.page.waitForTimeout(5000);
      await this.shipping_handling.click();

      await this.page.waitForTimeout(5000);

      await this.shipping_handling.clear();
      await this.page.waitForTimeout(5000);

      await this.shipping_handling.fill(String(shipping));
      await this.shipping_handling.press('Enter');
      await this.page.waitForTimeout(5000);
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

      await this.page.waitForTimeout(5000);
      await this.insurance.click();

      await this.page.waitForTimeout(5000);

      await this.insurance.clear();
      await this.page.waitForTimeout(5000);

      await this.insurance.fill(String(insuranceAmt));
      await this.insurance.press('Enter');
      await this.page.waitForTimeout(5000);
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

      await this.page.waitForTimeout(5000);
      await this.total_discount_view.click();
      await this.page.waitForTimeout(5000);

      await this.total_discount_view.clear();
      await this.page.waitForTimeout(5000);

      await this.total_discount_view.fill(String(discount));
      await this.total_discount_view.press('Enter');
      await this.page.waitForTimeout(5000);
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

      await reportStep(this.page, 'Tax Update is clicked successfully', 'pass');
    } catch (e) {
      await reportStep(this.page, 'Tax Update is not clicked successfully ' + e.message, 'fail');
    }
    return this;
  }

  async clickPostbtn() {
    try {
      await this.postBtn.click({ timeout: 30 * 1000 });
      await this.page.waitForTimeout(25000);

      await reportStep(this.page, 'Post button clicked successfully', 'pass');
    } catch (e) {
      await reportStep(this.page, 'Post button clicked not successfully...' + e, 'fail');
    }

    return this;
  }

  async clickOtherInfo() {
    try {
      await this.page.waitForTimeout(2000);
      await this.otherInfo.click();
      await this.page.waitForTimeout(2000);
      await this.incoterm.click();
      await this.page.waitForTimeout(2000);
      await this.incotermSelect.click();
      await this.page.waitForTimeout(2000);
      await this.fiscal.click();
      await this.page.waitForTimeout(2000);
      await this.fiscalSelect.click();
      await this.page.waitForTimeout(2000);
      await this.cash.click();
      await this.page.waitForTimeout(2000);
      // cashSelect.click();
      await this.cashSelect.evaluate((node) => node.click());
      await this.page.waitForTimeout(2000);
      await this.paymentRef.fill('test');
      await this.page.waitForTimeout(2000);

      await reportStep(this.page, 'otherinfo button clicked successfully', 'pass');
    } catch (e) {
      await reportStep(this.page, 'otherinfo button clicked not successfully...' + e, 'fail');
    }

    return this;
  }

  async clickfinalBtn() {
    try {
      await this.saveBtn.click();
      await this.page.waitForTimeout(25000);

      await reportStep(this.page, 'Save button clicked successfully', 'pass');
    } catch (e) {
      await reportStep(this.page, 'Save button clicked not successfully...' + e, 'fail');
    }
    return this;
  }

  async getTheTotal() {
    try {
      await this.billLine.click();
      await this.page.waitForTimeout(2500);
      const getTaxAmt = await this.taxAmt.textContent();
      console.log('Bill Tax Amt : ' + getTaxAmt);
      console.log('=========================');
      await this.page.waitForTimeout(5000);

      const subtotaltext = await this.subTotal.textContent();
      console.log('Bill SubTotal : ' + subtotaltext);
      console.log('=========================');
      await this.page.waitForTimeout(5000);

      const totaltext = await this.total.textContent();
      console.log('Bill total : ' + totaltext);
      console.log('=========================');
      await this.page.waitForTimeout(5000);

      await reportStep(this.page, 'Get The Total clicked successfully', 'pass');
    } catch (e) {
      await reportStep(this.page, 'Get The Total clicked not successfully...' + e, 'fail');
    }
    return this;
  }

  async clickVendorName() {
    try {
      const name = await this.getVendorName.textContent();
      console.log('Vendor bill :- ' + name);
      console.log('=========================');
      await this.page.waitForTimeout(5000);

      await reportStep(this.page, 'Vendor Name clicked successfully', 'pass');
    } catch (e) {
      await reportStep(this.page, 'Vendor Name clicked not successfully...' + e, 'fail');
    }
    return this;
  }

  async clickPrintButton() {
    try {
      await this.printBtn.click();
      await this.page.waitForTimeout(4000);

      // InvoiceSelect.click();
      // Thread.sleep(5000);
      await this.pdfDownload.click();
      await this.page.waitForTimeout(5000);
      await reportStep(this.page, 'Action button is clicked successfully', 'pass');
    } catch (e) {
      await reportStep(this.page, 'Action button is not clicked successfully...' + e, 'fail');
    }
    return this;
  }

  async clickRegisterPaymentBtn() {
    try {
      await this.page.waitForTimeout(5000);

      await this.RegisterPayment.click({ timeout: 30 * 1000 });
      await this.page.waitForTimeout(20000);

      await this.vendorBalance.click();
      await this.page.waitForTimeout(5000);

      const customerBalanceText = await this.vendorBalance.textContent();
      console.log('Customer Balance : ' + customerBalanceText);
      await this.page.waitForTimeout(5000);

      await this.creditBalance.click();
      await this.page.waitForTimeout(5000);

      const advanceBalanceText = await this.creditBalance.textContent();
      console.log('Advance Balance : ' + advanceBalanceText);
      await this.page.waitForTimeout(5000);

      await reportStep(this.page, 'Register Payment Btn is clicked successfully', 'pass');
    } catch (e) {
      await reportStep(this.page, 'Register Payment Btn is not clicked successfully...' + e, 'fail');
    }
    return this;
  }

  async clickModeOfPayment() {
    try {
      await this.modeOfPayment.click();
      // Selects the second option (index 1)
      await this.modeOfPayment.selectOption({ index: 1 });
      await this.page.waitForTimeout(3000);

      await reportStep(this.page, 'Mode Of Payment is clicked successfully', 'pass');
    } catch (e) {
      await reportStep(this.page, 'Mode Of Payment is not clicked successfully...' + e, 'fail');
    }
    return this;
  }

  async clickCheckNo(CheckNo) {
    try {
      await this.checkNo.click();
      await this.page.waitForTimeout(3000);
      // 123
      await this.checkNo.fill(String(CheckNo));
      await this.page.waitForTimeout(3000);
      /*saveBtn.click();
      Thread.sleep(2000);
      assertTrue(isErrorDisplayed(), "Error message should be displayed for empty checkno ");*/

      await reportStep(this.page, 'Check No is clicked successfully', 'pass');
    } catch (e) {
      await reportStep(this.page, 'Check No is not clicked successfully...' + e, 'fail');
    }
    return this;
  }

  async clickAmount(amt) {
    try {
      await this.amount.click();
      await this.page.waitForTimeout(3000);

      await this.amount.clear();
      await this.page.waitForTimeout(3000);

      // 123
      await this.amount.fill(String(amt));
      await this.page.waitForTimeout(3000);

      await reportStep(this.page, 'Amount is clicked successfully', 'pass');
    } catch (e) {
      await reportStep(this.page, 'Amount is not clicked successfully...' + e, 'fail');
    }
    return this;
  }

  async clickAmountNegative(amt) {
    try {
      await this.amount.click();
      await this.page.waitForTimeout(3000);

      await this.amount.clear();
      await this.page.waitForTimeout(3000);

      // 123
      await this.amount.fill(String(amt));
      await this.page.waitForTimeout(3000);

      await reportStep(this.page, 'Amount is clicked successfully', 'pass');
    } catch (e) {
      await reportStep(this.page, 'Amount is not clicked successfully...' + e, 'fail');
    }
    return this;
  }

  async clickDepositTo() {
    try {
      // select
      await this.depositTo.click();
      // Selects the second option (index 1)
      await this.depositTo.selectOption({ index: 1 });
      await this.page.waitForTimeout(5000);

      await reportStep(this.page, 'Deposit To is clicked successfully', 'pass');
    } catch (e) {
      await reportStep(this.page, 'Deposit To is not clicked successfully...' + e, 'fail');
    }
    return this;
  }

  async clickInvoiceCheckBox() {
    try {
      // checkBox.click();
      await this.page.waitForTimeout(3000);

      await this.checkBoxClick.evaluate((node) => node.click());
      await this.page.waitForTimeout(7000);

      await reportStep(this.page, 'clickInvoiceCheckBox  is clicked successfully', 'pass');
    } catch (e) {
      await reportStep(this.page, 'clickInvoiceCheckBox is not clicked successfully...' + e, 'fail');
    }
    return this;
  }

  async saveBtnAction() {
    try {
      await this.page.waitForTimeout(10000);
      await this.saveButton.click();
      await this.page.waitForTimeout(10000);
      try {
        const errorMsg = this.page.locator("xpath=//div[@class='o_notification_content']");
        await errorMsg.waitFor({ state: 'visible', timeout: 30000 });
        const errorMessageText = await errorMsg.textContent();
        console.log('Validation Error Message: ' + errorMessageText);

        // Dismiss the validation error
        expect(await this.isErrorDisplayed()).toBeTruthy();
        console.log('Validation error dismissed successfully for row ');
        await this.page.waitForTimeout(3000);
      } catch (e) {
        console.log('No validation error for row ');
      }

      try {
        const errorMsg = this.page.locator("xpath=//div[@class='o_dialog_warning modal-body']//p");
        await errorMsg.waitFor({ state: 'visible', timeout: 30000 });
        const errorMessageText = await errorMsg.textContent();
        console.log('Validation Error Message: ' + errorMessageText);

        // Dismiss the validation error
        await this.page.locator("xpath=(//button[@type='button']//span[contains(text(),'Ok')])").click();
        console.log('Validation error dismissed successfully for row ');
        await this.page.waitForTimeout(3000);
      } catch (e) {
        console.log('No validation error for row ');
      }

      await reportStep(this.page, 'save Button is clicked successfully', 'pass');
    } catch (e) {
      await reportStep(this.page, 'save Button is not clicked successfully...' + e, 'fail');
    }
    return this;
  }

  async Get_The_Receipt_No() {
    try {
      /*Thread.sleep(5000);
      receipt_No.click();
      Thread.sleep(20000);

      String receipt_NoText = receipt_No.getText();
      System.out.println("receipt_No: " + receipt_NoText);
      Thread.sleep(5000);

      receipt_Date.click();
      Thread.sleep(5000);

      String receipt_DateText = receipt_Date.getText();
      System.out.println("receipt_Date: " + receipt_DateText);
      Thread.sleep(5000);*/
      await this.action.click();
      // print.click();
      await this.paymentReceipt.click();
      await this.page.waitForTimeout(5000);
      await this.backtoInvoice.click();
      await this.page.waitForTimeout(2000);
      // creditNote.click();
      // reverse.click();
      // Thread.sleep(2000);
      // cancelEntry.click();
      // Thread.sleep(2000);
      // action2.click();
      // delete.click();
      // Thread.sleep(2000);
      // confirmDelete.click();
      await this.page.waitForTimeout(5000);
      await this.action1.click();
      await this.page.waitForTimeout(2000);
      await this.duplicate.click();
      await this.page.waitForTimeout(2000);
      await this.post.click();
      await this.page.waitForTimeout(2000);
      // resetToDraft.click();
      // Thread.sleep(2000);

      await reportStep(this.page, 'Get_The_Receipt_No is clicked successfully', 'pass');
    } catch (e) {
      await reportStep(this.page, 'Get_The_Receipt_No is not clicked successfully...' + e, 'fail');
    }
    return this;
  }
}

module.exports = { PurchaseBill };
