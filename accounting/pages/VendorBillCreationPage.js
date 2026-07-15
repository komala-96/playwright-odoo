const { expect } = require('../fixtures/base');
const { reportStep } = require('../utils/reportStep');
const { ensureLoggedIn } = require('../utils/loginHelper');

class VendorBillCreationPage {
  constructor(page) {
    this.page = page;

    // Login Page
    this.userName = page.locator("xpath=//input[@name='login']");
    this.passWord = page.locator("xpath=//input[@name='password']");
    this.logIn = page.locator("xpath=//button[@type='submit']");

    // Menu
    this.menu = page.locator("xpath=//ul[@class='o_menu_apps']//i[@class='fa fa-bars']");

    // financialacct
    this.financialAcct = page.locator("xpath=//div[contains(text(),'Financial Accounting')]");

    // financialacct
    this.accountsPayableBtn = page.locator("xpath=//span[contains(text(),'Accounts Payable')]");

    // financialacct
    this.billsBtn = page.locator("xpath=//a[normalize-space()='Bills']");

    // Create btn
    this.createBtn = page.locator("xpath=//button[normalize-space()='New']");

    this.clickVendor = page.locator("xpath=//div[@name='partner_id']//input[@type='text']");

    this.vendorSearchMore = page.locator("xpath=//a[@id='partner_id_0_0_8']");

    this.vendorSearchMoreBox = page.locator("xpath=//input[@placeholder='Search...']");

    // Selectlist
    this.VendorSelect = page.locator(
      "xpath=(//table[@class='o_list_table table table-sm table-hover position-relative mb-0 o_list_table_ungrouped table-striped']//tbody//tr[1]//td[1])[2]"
    );

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
    this.postBtn = page.locator("xpath=//span[normalize-space()='Post']");

    this.billLine = page.locator("xpath=//a[normalize-space()='Bill Lines']");

    this.taxAmt = page.locator("xpath=//div[@name='tax_amount_view']");

    this.subTotal = page.locator("xpath=//div[@name='amount_untaxed']");

    this.total = page.locator("xpath=//div[@name='amount_total_view']");

    // save btn
    // NOTE: the Java source has both a `saveBtn` field and a `saveBtn()` method — legal
    // in Java (separate namespaces) but not in JS, since an instance property would shadow
    // a same-named prototype method. Also, this page separately has a genuine `saveButton`
    // field further below (action_post), so this locator is named `saveBtnEl` to avoid
    // colliding with either.
    this.saveBtnEl = page.locator("xpath=//span[normalize-space()='Confirm']");

    this.getVendorName = page.locator("xpath=(//div[@name='name'])[1]");

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

    this.checkBox = page.locator(
      "xpath=//table[@class='o_list_table table table-sm table-hover position-relative mb-0 o_list_table_ungrouped table-striped']//tbody//tr[2]//td[1]"
    );

    this.checkBoxClick = page.locator("xpath=(//td[@name='is_checked']//input[@type='checkbox'])[last()]");

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

    this.backtoInvoice = page.locator(
      "xpath=//li[@class='breadcrumb-item d-inline-flex min-w-0 o_back_button']//a[1]"
    );

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
      .locator("xpath=//div[@class='me-auto o_notification_content']")
      .isVisible()
      .catch(() => false);
  }

  async loginIfNeeded(user, pass) {
    await ensureLoggedIn(this, user, pass);
    return this;
  }

  async enterUsername(user) {
    try {
      await this.userName.fill(String(user));

      await reportStep(this.page, "username is entered successfully", "pass");
    } catch (e) {
      await reportStep(this.page, "username is not entered successfully..." + e, "fail");
    }
    return this;
  }

  async enterPassword(pass) {
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

      await reportStep(this.page, "Login button clicked successfully", "pass");
    } catch (e) {
      await reportStep(this.page, "Login button clicked not successfully..." + e, "fail");
    }
    return this;
  }

  async clickMenuButton() {
    try {
      await this.menu.click({ timeout: 30 * 1000 });

      await reportStep(this.page, "Menu Button clicked successfully", "pass");
    } catch (e) {
      await reportStep(this.page, "Menu Button clicked not successfully..." + e, "fail");
    }
    return this;
  }

  async clickAccountActions() {
    try {
      await this.financialAcct.click({ timeout: 50 * 1000 });

      await this.accountsPayableBtn.click({ timeout: 30 * 1000 });
      await this.page.waitForTimeout(5000);

      await this.billsBtn.click();
      await this.page.waitForTimeout(8000);

      await this.createBtn.click();
      await this.page.waitForTimeout(5000);

      await reportStep(this.page, "Account actions clicked successfully", "pass");
    } catch (e) {
      await reportStep(this.page, "Account actions clicked not successfully..." + e, "fail");
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
      await this.reference.fill("komala");
      await this.page.waitForTimeout(5000);

      await reportStep(this.page, "Vendor Creation clicked successfully", "pass");
    } catch (e) {
      await reportStep(this.page, "Vendor Creation clicked not successfully..." + e, "fail");
    }
    return this;
  }

  async click_Poducts(productName) {
    try {
      await this.product.click();
      await this.page.waitForTimeout(5000);

      // await this.productSearchMore.click();
      await this.productSearchMore.evaluate((node) => node.click());
      await this.page.waitForTimeout(5000);

      /* await this.productSearchBox.click();
      await this.page.waitForTimeout(5000);

      await this.productSearchBox.fill(String(productName));
      await this.productSearchBox.press('Enter');
      await this.page.waitForTimeout(5000);

      await this.productSelect.click();
      await this.page.waitForTimeout(5000); */

      await this.productAddBtn.click();
      await this.page.waitForTimeout(15000);

      await reportStep(this.page, "Purchase Order Add clicked successfully", "pass");
    } catch (e) {
      await reportStep(this.page, "Purchase Order Add clicked not successfully..." + e, "fail");
    }
    return this;
  }

  async clickProductQty(qty, price) {
    try {
      const totalRows = await this.page
        .locator(
          "xpath=//table[@class='o_list_table table table-sm table-hover position-relative mb-0 o_list_table_ungrouped table-striped']//tbody//tr"
        )
        .count();
      console.log('Total number of rows:', totalRows);

      for (let row = 1; row <= Math.min(1, totalRows); row++) {
        const productName = this.page.locator(
          `xpath=//table[@class='o_list_table table table-sm table-hover position-relative mb-0 o_list_table_ungrouped table-striped']//tbody//tr[${row}]//td[2]`
        );
        await productName.click({ timeout: 30 * 1000 });

        const productQty = this.page.locator(
          `xpath=//table[@class='o_list_table table table-sm table-hover position-relative mb-0 o_list_table_ungrouped table-striped']//tbody//tr[${row}]//td[3]//input`
        );
        await productQty.clear({ timeout: 30 * 1000 });
        await productQty.fill(String(qty));
        await this.page.waitForTimeout(3000);

        const costInput = this.page.locator(
          `xpath=//table[@class='o_list_table table table-sm table-hover position-relative mb-0 o_list_table_ungrouped table-striped']//tbody//tr[${row}]//td[5]//input`
        );
        const getCost = await costInput.inputValue({ timeout: 30 * 1000 });
        console.log('Cost:', getCost);
        console.log('=========================');
        await this.page.waitForTimeout(5000);
        await costInput.clear();
        await costInput.fill(String(price));
        await this.page.waitForTimeout(3000);

        /* const discount = this.page.locator(
          `xpath=//table[@class='o_list_table table table-sm table-hover position-relative mb-0 o_list_table_ungrouped table-striped']//tbody//tr[${row}]//td[7]//input`
        );
        await productQty.clear();
        await productQty.fill('1.00');
        await this.page.waitForTimeout(3000);

        const containerDeposit = this.page.locator(
          `xpath=//table[@class='o_list_table table table-sm table-hover position-relative mb-0 o_list_table_ungrouped table-striped']//tbody//tr[${row}]//td[8]//input`
        );
        await containerDeposit.clear();
        await containerDeposit.fill('1.00'); */
        await this.page.waitForTimeout(5000);
      }

      await reportStep(this.page, "Product Qty clicked successfully", "pass");
    } catch (e) {
      await reportStep(this.page, "Product Qty clicked not successfully..." + e, "fail");
    }
    return this;
  }

  async clickProductQtyNegative(qty, price) {
    try {
      const totalRows = await this.page
        .locator(
          "xpath=//table[@class='o_list_table table table-sm table-hover position-relative mb-0 o_list_table_ungrouped table-striped']//tbody//tr"
        )
        .count();
      console.log('Total number of rows:', totalRows);

      for (let row = 1; row <= Math.min(1, totalRows); row++) {
        const productName = this.page.locator(
          `xpath=//table[@class='o_list_table table table-sm table-hover position-relative mb-0 o_list_table_ungrouped table-striped']//tbody//tr[${row}]//td[1]`
        );
        await productName.click({ timeout: 30 * 1000 });

        const productQty = this.page.locator(
          `xpath=//table[@class='o_list_table table table-sm table-hover position-relative mb-0 o_list_table_ungrouped table-striped']//tbody//tr[${row}]//td[3]//input`
        );
        await productQty.clear({ timeout: 30 * 1000 });
        await productQty.fill(String(qty));
        await productQty.press('Enter');
        await this.page.waitForTimeout(3000);
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

        const costInput = this.page.locator(
          `xpath=//table[@class='o_list_table table table-sm table-hover position-relative mb-0 o_list_table_ungrouped table-striped']//tbody//tr[${row}]//td[5]//input`
        );
        const getCost = await costInput.inputValue({ timeout: 30 * 1000 });
        console.log('Cost:', getCost);
        console.log('=========================');
        await this.page.waitForTimeout(5000);
        await costInput.clear();
        await costInput.fill(String(price));
        await costInput.press('Enter');
        await this.page.waitForTimeout(3000);
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

        /* const discount = this.page.locator(
          `xpath=//table[@class='o_list_table table table-sm table-hover position-relative mb-0 o_list_table_ungrouped table-striped']//tbody//tr[${row}]//td[7]//input`
        );
        await productQty.clear();
        await productQty.fill('1.00');
        await this.page.waitForTimeout(3000);

        const containerDeposit = this.page.locator(
          `xpath=//table[@class='o_list_table table table-sm table-hover position-relative mb-0 o_list_table_ungrouped table-striped']//tbody//tr[${row}]//td[8]//input`
        );
        await containerDeposit.clear();
        await containerDeposit.fill('1.00'); */
        await this.page.waitForTimeout(5000);
      }

      await reportStep(this.page, "Product Qty clicked successfully", "pass");
    } catch (e) {
      await reportStep(this.page, "Product Qty clicked not successfully..." + e, "fail");
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

      await reportStep(this.page, "Tax Update is clicked successfully", "pass");
    } catch (e) {
      await reportStep(this.page, "Tax Update is not clicked successfully " + e.message, "fail");
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
        console.log('Validation Error Message:', errorMessageText);

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
        console.log('Validation Error Message:', errorMessageText);

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
        console.log('Validation Error Message:', errorMessageText);

        // Dismiss the validation error
        await this.page.locator("xpath=//button[normalize-space()='Close']").click();
        console.log('Validation error dismissed successfully for row ');
        await this.page.waitForTimeout(3000);
      } catch (e) {
        console.log('No validation error for row ');
      }

      await reportStep(this.page, "Tax Update is clicked successfully", "pass");
    } catch (e) {
      await reportStep(this.page, "Tax Update is not clicked successfully " + e.message, "fail");
    }
    return this;
  }

  async clickPostbtn() {
    try {
      await this.postBtn.click({ timeout: 30 * 1000 });
      await this.page.waitForTimeout(25000);

      await reportStep(this.page, "Post button clicked successfully", "pass");
    } catch (e) {
      await reportStep(this.page, "Post button clicked not successfully..." + e, "fail");
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
      await this.cashSelect.click();
      await this.page.waitForTimeout(2000);
      await this.paymentRef.fill("test");
      await this.page.waitForTimeout(2000);

      await reportStep(this.page, "otherinfo button clicked successfully", "pass");
    } catch (e) {
      await reportStep(this.page, "otherinfo button clicked not successfully..." + e, "fail");
    }

    return this;
  }

  async clickfinalBtn() {
    try {
      await this.saveBtnEl.click();
      await this.page.waitForTimeout(25000);

      await reportStep(this.page, "Save button clicked successfully", "pass");
    } catch (e) {
      await reportStep(this.page, "Save button clicked not successfully..." + e, "fail");
    }
    return this;
  }

  async getTheTotal() {
    try {
      await this.billLine.click();
      await this.page.waitForTimeout(2500);
      const getTaxAmt = await this.taxAmt.textContent();
      console.log('Bill Tax Amt :', getTaxAmt);
      console.log('=========================');
      await this.page.waitForTimeout(5000);

      const subtotaltext = await this.subTotal.textContent();
      console.log('Bill SubTotal :', subtotaltext);
      console.log('=========================');
      await this.page.waitForTimeout(5000);

      const totaltext = await this.total.textContent();
      console.log('Bill total :', totaltext);
      console.log('=========================');
      await this.page.waitForTimeout(5000);

      await reportStep(this.page, "Get The Total clicked successfully", "pass");
    } catch (e) {
      await reportStep(this.page, "Get The Total clicked not successfully..." + e, "fail");
    }
    return this;
  }

  async clickVendorName() {
    try {
      const name = await this.getVendorName.textContent();
      console.log('Vendor bill :-', name);
      console.log('=========================');
      await this.page.waitForTimeout(5000);

      await reportStep(this.page, "Vendor Name clicked successfully", "pass");
    } catch (e) {
      await reportStep(this.page, "Vendor Name clicked not successfully..." + e, "fail");
    }
    return this;
  }

  async clickPrintButton() {
    try {
      await this.printBtn.click();
      await this.page.waitForTimeout(1500);

      // await this.InvoiceSelect.click();
      // await this.page.waitForTimeout(5000);
      await this.pdfDownload.click();
      await this.page.waitForTimeout(5000);
      await reportStep(this.page, "Action button is clicked successfully", "pass");
    } catch (e) {
      await reportStep(this.page, "Action button is not clicked successfully..." + e, "fail");
    }
    return this;
  }

  async clickRegisterPaymentBtn() {
    try {
      await this.RegisterPayment.click({ timeout: 30 * 1000 });
      await this.page.waitForTimeout(20000);

      await this.vendorBalance.click();
      await this.page.waitForTimeout(5000);

      const customerBalanceText = await this.vendorBalance.textContent();
      console.log('Customer Balance :', customerBalanceText);
      await this.page.waitForTimeout(5000);

      await this.creditBalance.click();
      await this.page.waitForTimeout(5000);

      const advanceBalanceText = await this.creditBalance.textContent();
      console.log('Advance Balance :', advanceBalanceText);
      await this.page.waitForTimeout(5000);

      await reportStep(this.page, "Register Payment Btn is clicked successfully", "pass");
    } catch (e) {
      await reportStep(this.page, "Register Payment Btn is not clicked successfully..." + e, "fail");
    }
    return this;
  }

  async clickModeOfPayment() {
    try {
      await this.modeOfPayment.click();
      // Selects the second option (index 1)
      await this.modeOfPayment.selectOption({ index: 1 });
      await this.page.waitForTimeout(3000);

      await reportStep(this.page, "Mode Of Payment is clicked successfully", "pass");
    } catch (e) {
      await reportStep(this.page, "Mode Of Payment is not clicked successfully..." + e, "fail");
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
      /* await this.saveBtnEl.click();
      await this.page.waitForTimeout(2000);
      expect(await this.isErrorDisplayed()).toBeTruthy(); */

      await reportStep(this.page, "Check No is clicked successfully", "pass");
    } catch (e) {
      await reportStep(this.page, "Check No is not clicked successfully..." + e, "fail");
    }
    return this;
  }

  async clickCheckNoNegative(CheckNo) {
    try {
      await this.checkNo.click();
      await this.page.waitForTimeout(3000);
      // 123
      await this.checkNo.fill(String(CheckNo));
      await this.page.waitForTimeout(3000);
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
      /* await this.saveBtnEl.click();
      await this.page.waitForTimeout(2000);
      expect(await this.isErrorDisplayed()).toBeTruthy(); */

      await reportStep(this.page, "Check No is clicked successfully", "pass");
    } catch (e) {
      await reportStep(this.page, "Check No is not clicked successfully..." + e, "fail");
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

      await reportStep(this.page, "Amount is clicked successfully", "pass");
    } catch (e) {
      await reportStep(this.page, "Amount is not clicked successfully..." + e, "fail");
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

      await reportStep(this.page, "Amount is clicked successfully", "pass");
    } catch (e) {
      await reportStep(this.page, "Amount is not clicked successfully..." + e, "fail");
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

      await reportStep(this.page, "Deposit To is clicked successfully", "pass");
    } catch (e) {
      await reportStep(this.page, "Deposit To is not clicked successfully..." + e, "fail");
    }
    return this;
  }

  async clickInvoiceCheckBox() {
    try {
      // await this.checkBox.click();
      await this.page.waitForTimeout(3000);

      await this.checkBoxClick.evaluate((node) => node.click());
      await this.page.waitForTimeout(7000);

      await reportStep(this.page, "clickInvoiceCheckBox  is clicked successfully", "pass");
    } catch (e) {
      await reportStep(this.page, "clickInvoiceCheckBox is not clicked successfully..." + e, "fail");
    }
    return this;
  }

  async saveBtn() {
    try {
      await this.page.waitForTimeout(10000);
      await this.saveButton.click();
      await this.page.waitForTimeout(10000);
      try {
        const validationMessage = this.page.locator("xpath=//div[@class='o_notification_body mt-2']");
        await validationMessage.waitFor({ state: 'visible', timeout: 30000 });
        const messageText = await validationMessage.textContent();
        console.log('Validation Message:', messageText);

        expect(await this.isErrorDisplayed()).toBeTruthy();
      } catch (e) {
        // No validation message found; proceed normally
        console.log('No validation message displayed.');
      }

      await reportStep(this.page, "save Button is clicked successfully", "pass");
    } catch (e) {
      await reportStep(this.page, "save Button is not clicked successfully..." + e, "fail");
    }
    return this;
  }

  async Get_The_Receipt_No() {
    try {
      /* await this.page.waitForTimeout(5000);
      await this.receipt_No.click();
      await this.page.waitForTimeout(20000);

      const receipt_NoText = await this.receipt_No.textContent();
      console.log('receipt_No:', receipt_NoText);
      await this.page.waitForTimeout(5000);

      await this.receipt_Date.click();
      await this.page.waitForTimeout(5000);

      const receipt_DateText = await this.receipt_Date.textContent();
      console.log('receipt_Date:', receipt_DateText);
      await this.page.waitForTimeout(5000); */
      await this.action.click();
      // await this.print.click();
      await this.paymentReceipt.click();
      await this.page.waitForTimeout(5000);
      await this.backtoInvoice.click();
      await this.page.waitForTimeout(2000);
      /* await this.creditNote.click();
      await this.reverse.click();
      await this.page.waitForTimeout(2000);
      await this.cancelEntry.click();
      await this.page.waitForTimeout(2000);
      await this.action2.click();
      await this.delete.click();
      await this.page.waitForTimeout(2000);
      await this.confirmDelete.click(); */
      await this.page.waitForTimeout(5000);
      await this.action1.click();
      await this.page.waitForTimeout(2000);
      await this.duplicate.click();
      await this.page.waitForTimeout(2000);
      await this.post.click();
      await this.page.waitForTimeout(2000);
      // await this.resetToDraft.click();
      await this.page.waitForTimeout(2000);

      await reportStep(this.page, "Get_The_Receipt_No is clicked successfully", "pass");
    } catch (e) {
      await reportStep(this.page, "Get_The_Receipt_No is not clicked successfully..." + e, "fail");
    }
    return this;
  }
}

module.exports = { VendorBillCreationPage };
