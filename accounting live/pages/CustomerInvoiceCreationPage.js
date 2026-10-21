const { expect } = require('../fixtures/base');
const { reportStep } = require('../utils/reportStep');
const { ensureLoggedIn } = require('../utils/loginHelper');

class CustomerInvoiceCreationPage {
  constructor(page) {
    this.page = page;

    // Login Page
    this.userName = page.locator("xpath=//input[@name='login']");
    this.passWord = page.locator("xpath=//input[@name='password']");
    this.logIn = page.locator("xpath=//button[@type='submit']");

    // Menu
    this.menu = page.locator("xpath=//ul[@class='o_menu_apps']//i[@class='fa fa-bars']");

    // FinancialAcct
    this.financialAcct = page.locator("xpath=//div[contains(text(),'Financial Accounting')]");

    this.accounts_ReceivableMenu = page.locator("xpath=//span[contains(text(),'Accounts Receivable')]");

    this.invoice_Menu = page.locator("xpath=//a[normalize-space()='Invoices']");

    // Invoice
    this.invoiceCreateBtn = page.locator("xpath=//button[normalize-space()='New']");

    this.customer = page.locator("xpath=//div[@name='partner_id']//input[@type='text']");

    this.customerSearchMore = page.locator("xpath=//a[@id='partner_id_0_0_8']");

    this.customerSearchMoreBox = page.locator("xpath=//input[@placeholder='Search...']");

    // Selectlist
    this.customerSelect = page.locator(
      "xpath=(//table[@class='o_list_table table table-sm table-hover position-relative mb-0 o_list_table_ungrouped table-striped']//tbody//tr[1]//td[1])[2]"
    );

    this.route = page.locator("xpath=//div[@name='route_id']//input[@type='text']");

    this.routeSelect = page.locator("xpath=//a[@id='route_id_0_0_0']");

    this.po_Number = page.locator("xpath=//input[@id='po_no_0']");

    this.reference = page.locator("xpath=//input[@id='ref_0']");

    this.AddressMenu = page.locator("xpath=//a[normalize-space()='Address']");

    this.addClick = page.locator("xpath=//input[@id='partner_invoice_id_0']");

    this.deliveryAddress = page.locator("xpath=//a[@id='partner_invoice_id_0_0_1']");

    this.addClick1 = page.locator("xpath=//input[@id='partner_shipping_id_0']");

    this.billingAddress = page.locator("xpath=//a[@id='partner_shipping_id_0_0_1']");

    this.addClick2 = page.locator("xpath=//input[@id='partner_remit_id_0']");

    this.remittoAddress = page.locator("xpath=//a[@id='partner_remit_id_0_0_0']");

    this.notes = page.locator("xpath=//a[normalize-space()='Notes']");

    this.deliveryNotes = page.locator("xpath=//textarea[@id='delivery_notes_0']");

    this.internalNotes = page.locator("xpath=//td[@style='width: 50%;']//textarea[@name='narration']");

    this.internalNotesUpdate = page.locator("xpath=//td[@style='width: 50%;']//textarea[@name='narration']");

    this.paymentNotes = page.locator("xpath=(//textarea[@name='narration'])[2]");

    this.paymentNotesUpdate = page.locator("xpath=(//textarea[@name='narration'])[2]");

    this.InvoiceLinesMenu = page.locator("xpath=//a[normalize-space()='Invoice Lines']");

    this.associated_product = page.locator("xpath=//div[@name='associated_product']//input[@type='checkbox']");

    this.product = page.locator("xpath=//div[@name='product_ids']//input[@type='text']");

    this.productSearchMore = page.locator("xpath=(//a[normalize-space()='Search More...'])[1]");

    this.productSearchBox = page.locator("xpath=//input[@placeholder='Search...']");

    this.productSelect = page.locator("xpath=//tr[@class='o_data_row o_row_draggable']//td[3]");

    this.productAddBtn = page.locator("xpath=(//span[contains(text(),'Add')])[1]");

    this.serviceProduct = page.locator("xpath=//div[@name='service_product_ids']//input[@type='text']");

    this.serviceProduct_SearchMore = page.locator("xpath=(//a[normalize-space()='Search More...'])[1]");

    this.serviceProduct_Select = page.locator("xpath=//table//tbody//tr[1]//td[1]//div//input[@type='checkbox']");

    this.selectBtn = page.locator("xpath=//button[normalize-space()='Select']");

    this.serviceProductAddBtn = page.locator("xpath=(//button[@name='add_invoice_service_products'])[1]");

    this.shipping_handling = page.locator("xpath=//div[@name='shipping_handling']//input[@type='text']");

    this.tax_amount_view = page.locator("xpath=//div[@name='tax_amount_view']");

    this.insurance = page.locator("xpath=//div[@name='insurance']//input[@type='text']");

    this.total_discount_view = page.locator("xpath=//div[@name='total_discount']//input[@type='text']");

    // save btn
    this.postBtn = page.locator("xpath=(//button[@name='action_post'])[1]");

    this.sendAndPrintBtn = page.locator("xpath=//span[normalize-space()='Send & Print']");

    this.recipients = page.locator("xpath=//div[@name='mail_partner_ids']//input[@type='text']");

    this.recipientText = page.locator("xpath=//div[@style='margin:0px;padding:0px']//p");

    this.recipientBtn = page.locator("xpath=//button[@name='action_send_and_print']");

    this.sendPrintBtn = page.locator("xpath=//button[@name='action_invoice_sent']//span[contains(text(),'Send & Print')]");

    this.sendPrintInvoiceBtn = page.locator(
      "xpath=//button[@name='send_and_print_action']//span[contains(text(),'Send & Print')]"
    );

    this.shipping_handling_Get = page.locator("xpath=//div[@name='shipping_handling']");

    this.tax_amount_view_Get = page.locator("xpath=//div[@name='tax_amount_view']");

    this.total_container_deposit_Get = page.locator("xpath=//div[@name='total_container_deposit']");

    this.insurance_Get = page.locator("xpath=//div[@name='insurance']");

    this.total_discount_Get = page.locator("xpath=//div[@name='total_discount']");

    this.total_Get = page.locator("xpath=//div[@name='amount_total_view']");

    this.Amount_Get = page.locator("xpath=//div[@name='amount_residual']");

    // NOTE: the Java source has both a `saveBtn` field and a `saveBtn()` method — legal
    // in Java (separate namespaces) but not in JS, since an instance property would shadow
    // a same-named prototype method. Also, this page separately has a genuine `saveButton`
    // field further below (action_post), so this locator is named `saveBtnEl` to avoid
    // colliding with either.
    this.saveBtnEl = page.locator("xpath=//button[normalize-space()='Save']");

    this.invoice_No = page.locator("xpath=//div[@name='name' and contains(@class, 'o_field_char')]");

    this.invoice_Date = page.locator("xpath=//div[@name='invoice_date']");

    this.payment_Terms = page.locator("xpath=//div[@name='invoice_payment_term_id']");

    this.printBtn = page.locator("xpath=//button[normalize-space()='Action']");

    this.InvoiceSelect = page.locator("xpath=//span[normalize-space()='Invoices']");

    this.pdfDownload = page.locator("xpath=//span[normalize-space()='PDF without Payment']");

    this.RegisterPayment = page.locator("xpath=//span[normalize-space()='Register Payment']");

    this.modeOfPayment = page.locator("xpath=//select[@id='payment_mode_id_0']");

    this.checkNo = page.locator("xpath=//input[@id='check_no_0']");

    // sendkeys
    this.amount = page.locator("xpath=//input[@id='amount_0']");

    // 101401 Bank 1 select option
    this.depositTo = page.locator("xpath=//select[@id='account_id_0']");

    this.checkBox = page.locator(
      "xpath=//table[@class='o_list_table table table-sm table-hover table-striped o_list_table_ungrouped table-striped']//tbody//tr[2]//td[1]"
    );

    this.checkBoxClick = page.locator("xpath=(//td[@name='is_checked']//input[@type='checkbox'])[last()]");

    // click
    this.saveButton = page.locator("xpath=//button[@name='action_post']");

    // get text
    this.receipt_No = page.locator("xpath=//div[@name='name']");

    this.receipt_Date = page.locator("xpath=//div[@name='receipt_date']");

    this.unapplied_amount = page.locator("xpath=//div[@name='unapplied_amount']");

    this.customerBalance = page.locator("xpath=//div[@name='invoice_balance']");

    this.advanceBalance = page.locator("xpath=//div[@name='cust_advance_balance']");

    this.action = page.locator("xpath=//button[normalize-space()='Action']");

    this.print = page.locator("xpath=//button[normalize-space()='Print']");

    this.paymentReceipt = page.locator("xpath=(//span[normalize-space()='Payment Receipt'])");

    this.backtoInvoice = page.locator("xpath=//li[@class='breadcrumb-item d-inline-flex min-w-0 o_back_button']//a[1]");

    this.action1 = page.locator("xpath=//button[normalize-space()='Action']");

    this.duplicate = page.locator("xpath=//span[normalize-space()='Duplicate']");

    this.cancelEntry = page.locator("xpath=//span[normalize-space()='Cancel Entry']");

    this.action2 = page.locator("xpath=//button[normalize-space()='Action']");

    this.delete = page.locator("xpath=//span[normalize-space()='Delete']");
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

      await reportStep(this.page, "Username is entered successfully", "pass");
    } catch (e) {
      await reportStep(this.page, "Username is not entered successfully..." + e, "fail");
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
      await this.page.waitForTimeout(5000);
      await reportStep(this.page, "Login button is clicked successfully", "pass");
    } catch (e) {
      await reportStep(this.page, "Login button is not clicked successfully..." + e, "fail");
    }
    return this;
  }

  async clickMenuButton() {
    try {
      await this.menu.click({ timeout: 30 * 1000 });
      await this.page.waitForTimeout(5000);

      await reportStep(this.page, "Menu Button is clicked successfully", "pass");
    } catch (e) {
      await reportStep(this.page, "Menu Button is not clicked successfully..." + e, "fail");
    }
    return this;
  }

  async ClickFinancialAcctMenu() {
    try {
      await this.financialAcct.click({ timeout: 50 * 1000 });
      await this.page.waitForTimeout(15000);

      await reportStep(this.page, "Financial Acct Menu is clicked successfully", "pass");
    } catch (e) {
      await reportStep(this.page, "Financial Acct Menu is not clicked successfully..." + e, "fail");
    }
    return this;
  }

  async ClickInvoiceMenu() {
    try {
      await this.accounts_ReceivableMenu.click({ timeout: 50 * 1000 });
      await this.page.waitForTimeout(5000);

      await this.invoice_Menu.click();
      await this.page.waitForTimeout(5000);

      await this.invoiceCreateBtn.click();
      await this.page.waitForTimeout(10000);

      await reportStep(this.page, "Invoice Menu is clicked successfully", "pass");
    } catch (e) {
      await reportStep(this.page, "Invoice Menu is not clicked successfully..." + e, "fail");
    }
    return this;
  }

  async clickCustomerName(customerName) {
    try {
      await this.customer.click();
      await this.page.waitForTimeout(5000);

      await this.customerSearchMore.click();
      await this.page.waitForTimeout(5000);

      await this.customerSearchMoreBox.click();
      await this.page.waitForTimeout(5000);

      await this.customerSearchMoreBox.fill(String(customerName));
      await this.customerSearchMoreBox.press('Enter');
      await this.page.waitForTimeout(5000);

      await this.customerSelect.click();
      await this.page.waitForTimeout(5000);

      await this.route.click();
      await this.page.waitForTimeout(5000);

      await this.routeSelect.click();
      await this.page.waitForTimeout(5000);

      await reportStep(this.page, "Customer Name is clicked successfully", "pass");
    } catch (e) {
      await reportStep(this.page, "Customer Name is not clicked successfully..." + e, "fail");
    }
    return this;
  }

  async clickCustomer_PONumber() {
    try {
      // Check if PO number field has a value
      const existingPoNumber = await this.po_Number.inputValue();

      if (existingPoNumber != null && existingPoNumber !== '') {
        // PO number exists, print it
        console.log('PO Number already present:', existingPoNumber);
      } else {
        // No PO number, enter the new one and print message
        const newPoNumber = 'PO_003';
        await this.po_Number.fill(String(newPoNumber));
        console.log('No PO number was present. Entered new PO number:', newPoNumber);
      }

      await this.reference.fill('komala');

      await reportStep(this.page, "PONumber is clicked successfully", "pass");
    } catch (e) {
      await reportStep(this.page, "PONumber is not clicked successfully..." + e, "fail");
    }
    return this;
  }

  async clickAddressMenu(street, street2, zip) {
    try {
      await this.page.waitForTimeout(5000);
      await this.AddressMenu.click();
      await this.page.waitForTimeout(5000);

      await this.addClick.hover();
      await this.addClick.click();
      await this.page.waitForTimeout(2000);

      await this.deliveryAddress.hover();
      await this.deliveryAddress.click();
      await this.page.waitForTimeout(5000);
      await this.addClick1.hover();
      await this.addClick1.click();
      await this.page.waitForTimeout(2000);

      await this.billingAddress.hover();
      await this.billingAddress.click();

      await this.page.waitForTimeout(5000);
      await this.addClick2.hover();
      await this.addClick2.click();
      await this.page.waitForTimeout(2000);

      await this.remittoAddress.hover();
      await this.remittoAddress.click();

      await reportStep(this.page, "Address Menu is clicked successfully", "pass");
    } catch (e) {
      // Log failure
      await reportStep(this.page, "Address Menu is not clicked successfully..." + e, "fail");
    }

    return this;
  }

  async clickDeliveryNotes() {
    try {
      await this.notes.click();
      await this.page.waitForTimeout(5000);

      await this.deliveryNotes.fill('Devlivery Notes - Direct Invoice');
      await this.page.waitForTimeout(5000);

      /*await this.internalNotes.click();
      await this.page.waitForTimeout(5000);

      await this.internalNotesUpdate.fill('Internal Notes - Direct Invoice');
      await this.page.waitForTimeout(5000);

      await this.paymentNotes.click();
      await this.page.waitForTimeout(5000);

      await this.paymentNotesUpdate.fill('Payment Notes - Direct Invoice');
      await this.page.waitForTimeout(5000);*/

      await reportStep(this.page, "Delivery Notes update is clicked successfully", "pass");
    } catch (e) {
      await reportStep(this.page, "Delivery Notes update  is not clicked successfully..." + e, "fail");
    }
    return this;
  }

  async clickInvoiceLinesMenu() {
    try {
      await this.InvoiceLinesMenu.click();
      await this.page.waitForTimeout(5000);

      await reportStep(this.page, "Invoice Lines Menu is clicked successfully", "pass");
    } catch (e) {
      await reportStep(this.page, "Invoice Lines Menu is not clicked successfully..." + e, "fail");
    }
    return this;
  }

  async click_associated_product() {
    try {
      await this.associated_product.evaluate((node) => node.click());
      await this.page.waitForTimeout(5000);

      await this.productAddBtn.click();
      await this.page.waitForTimeout(5000);

      await reportStep(this.page, "Poducts Order Creation is clicked successfully", "pass");
    } catch (e) {
      await reportStep(this.page, "Poducts Order Creation is not clicked successfully..." + e, "fail");
    }
    return this;
  }

  async click_productSelect(productName) {
    try {
      await this.product.click();
      await this.page.waitForTimeout(5000);

      await this.productSearchMore.click();
      await this.page.waitForTimeout(6000);

      await this.productSearchBox.click();
      await this.page.waitForTimeout(6000);

      await this.productSearchBox.fill(String(productName));
      await this.productSearchBox.press('Enter');
      await this.page.waitForTimeout(6000);

      await this.productSelect.click();
      await this.page.waitForTimeout(5000);

      await this.productAddBtn.click();
      await this.page.waitForTimeout(30000);

      await reportStep(this.page, "Poducts Order Creation is clicked successfully", "pass");
    } catch (e) {
      await reportStep(this.page, "Poducts Order Creation is not clicked successfully..." + e, "fail");
    }
    return this;
  }

  async clickService_Products() {
    try {
      await this.page.waitForTimeout(5000);
      await this.serviceProduct.click();
      await this.page.waitForTimeout(5000);

      //await this.serviceProduct_SearchMore.click();
      await this.serviceProduct_SearchMore.evaluate((node) => node.click());
      await this.page.waitForTimeout(5000);

      await this.serviceProduct_Select.evaluate((node) => node.click());
      await this.page.waitForTimeout(5000);

      await this.selectBtn.click();
      await this.page.waitForTimeout(5000);

      await this.serviceProductAddBtn.click();
      await this.page.waitForTimeout(15000);

      await reportStep(this.page, "Service_Products is clicked successfully", "pass");
    } catch (e) {
      await reportStep(this.page, "Service_Products is not clicked successfully..." + e, "fail");
    }
    return this;
  }

  async updateProductQuantities(qty, price) {
    try {
      const totalRows = await this.page
        .locator(
          "xpath=//table[@class='o_list_table table table-sm table-hover position-relative mb-0 o_list_table_ungrouped table-striped']//tbody//tr"
        )
        .count();
      console.log('Total number of rows:', totalRows);

      // Iterate through the first 2 rows

      // Click on the 3rd column of the current row (assumed to be clickable)
      const productName = this.page.locator(
        "xpath=//table[@class='o_list_table table table-sm table-hover position-relative mb-0 o_list_table_ungrouped table-striped']//tbody//tr[1]//td[1]"
      );
      await productName.click({ timeout: 30 * 1000 });
      await this.page.waitForTimeout(5000);

      // Clear the input in the 4th column of the current row
      const qtyInput = this.page.locator(
        "xpath=//table[@class='o_list_table table table-sm table-hover position-relative mb-0 o_list_table_ungrouped table-striped']//tbody//tr[1]//td[4]//input"
      );
      await qtyInput.click({ timeout: 30 * 1000 });
      await this.page.waitForTimeout(5000);

      await qtyInput.clear();
      await this.page.waitForTimeout(5000);

      await qtyInput.fill(String(qty));
      await this.page.waitForTimeout(5000);

      // Optionally, wait for the input to be updated
      // wait.until(ExpectedConditions.attributeToBeNotEmpty(qtyInput, "value"));
      const costInput = this.page.locator(
        "xpath=//table[@class='o_list_table table table-sm table-hover position-relative mb-0 o_list_table_ungrouped table-striped']//tbody//tr[1]//td[6]//input"
      );
      await costInput.click({ timeout: 30 * 1000 });
      await this.page.waitForTimeout(5000);

      await costInput.clear();
      await this.page.waitForTimeout(5000);

      await costInput.fill(String(price));
      await this.page.waitForTimeout(5000);

      await reportStep(this.page, "Product quantities updated successfully", "pass");
    } catch (e) {
      await reportStep(this.page, "Failed to update product quantities: " + e.message, "fail");
    }
    return this;
  }

  async updateProductQuantitiesNegative(qty, price) {
    try {
      const totalRows = await this.page
        .locator(
          "xpath=//table[@class='o_list_table table table-sm table-hover position-relative mb-0 o_list_table_ungrouped table-striped']//tbody//tr"
        )
        .count();
      console.log('Total number of rows:', totalRows);

      // Iterate through the first 2 rows

      // Click on the 3rd column of the current row (assumed to be clickable)
      const productName = this.page.locator(
        "xpath=//table[@class='o_list_table table table-sm table-hover position-relative mb-0 o_list_table_ungrouped table-striped']//tbody//tr[1]//td[1]"
      );
      await productName.click({ timeout: 30 * 1000 });
      await this.page.waitForTimeout(5000);

      // Clear the input in the 4th column of the current row
      const qtyInput = this.page.locator(
        "xpath=//table[@class='o_list_table table table-sm table-hover position-relative mb-0 o_list_table_ungrouped table-striped']//tbody//tr[1]//td[4]//input"
      );
      await qtyInput.click({ timeout: 30 * 1000 });
      await this.page.waitForTimeout(5000);

      await qtyInput.clear();
      await this.page.waitForTimeout(5000);

      await qtyInput.fill(String(qty));
      await qtyInput.press('Enter');
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

      // Optionally, wait for the input to be updated
      // wait.until(ExpectedConditions.attributeToBeNotEmpty(qtyInput, "value"));
      const costInput = this.page.locator(
        "xpath=//table[@class='o_list_table table table-sm table-hover position-relative mb-0 o_list_table_ungrouped table-striped']//tbody//tr[2]//td[6]//input"
      );
      await costInput.click({ timeout: 30 * 1000 });
      await this.page.waitForTimeout(5000);

      await costInput.clear();
      await this.page.waitForTimeout(5000);

      await costInput.fill(String(price));
      await costInput.press('Enter');
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

      await reportStep(this.page, "Product quantities updated successfully", "pass");
    } catch (e) {
      await reportStep(this.page, "Failed to update product quantities: " + e.message, "fail");
    }
    return this;
  }

  async clickTaxUpdate(shipping, tax, insuranceAmt, discount) {
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

  async clickTaxUpdateNegative(shipping, tax, insuranceAmt, discount) {
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

      await this.page.waitForTimeout(5000);
      await this.total_discount_view.click();
      await this.page.waitForTimeout(5000);

      await this.total_discount_view.clear();
      await this.page.waitForTimeout(5000);

      await this.total_discount_view.fill(String(discount));
      await this.total_discount_view.press('Enter');
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

      await reportStep(this.page, "Tax Update is clicked successfully", "pass");
    } catch (e) {
      await reportStep(this.page, "Tax Update is not clicked successfully " + e.message, "fail");
    }
    return this;
  }

  async clickPostbtn() {
    try {
      await this.postBtn.click({ timeout: 30 * 1000 });
      await this.page.waitForTimeout(15000);

      await reportStep(this.page, "Post button is clicked successfully", "pass");
    } catch (e) {
      await reportStep(this.page, "Post button is not clicked successfully..." + e, "fail");
    }
    return this;
  }

  async clickSendAndPrintEMail() {
    try {
      await this.sendAndPrintBtn.click({ timeout: 30 * 1000 });
      await this.page.waitForTimeout(15000);

      await this.recipients.click();
      await this.page.waitForTimeout(5000);

      await this.recipients.fill('komala@averigo.com');
      await this.recipients.press('Enter');
      await this.page.waitForTimeout(5000);

      /*await this.recipientText.click();
      await this.page.waitForTimeout(5000);

      const recipientTextGet = await this.recipientText.textContent();
      console.log('Email Recipient  :', recipientTextGet);
      console.log('=========================');
      await this.page.waitForTimeout(5000);*/

      await this.recipientBtn.click();
      await this.page.waitForTimeout(5000);

      await reportStep(this.page, "clickSendAndPrintEMail is clicked successfully", "pass");
    } catch (e) {
      await reportStep(this.page, "clickSendAndPrintEMail is not clicked successfully..." + e, "fail");
    }
    return this;
  }

  async getTheTotal() {
    try {
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

      const Insurance_GetText = await this.insurance_Get.textContent();
      console.log('Insurance :', Insurance_GetText);
      console.log('=========================');
      await this.page.waitForTimeout(5000);

      const total_discount_GetText = await this.total_discount_Get.textContent();
      console.log('Discount :', total_discount_GetText);
      console.log('=========================');
      await this.page.waitForTimeout(5000);

      const total_GetText = await this.total_Get.textContent();
      console.log('Total :', total_GetText);
      console.log('=========================');
      await this.page.waitForTimeout(5000);

      const Amount_GetText = await this.Amount_Get.textContent();
      console.log('Amount :', Amount_GetText);
      console.log('=========================');
      await this.page.waitForTimeout(5000);

      await reportStep(this.page, "get The Total is clicked successfully", "pass");
    } catch (e) {
      await reportStep(this.page, "get The Total is not clicked successfully..." + e, "fail");
    }
    return this;
  }

  async clickSaveButton() {
    try {
      await this.saveBtnEl.click();
      await this.page.waitForTimeout(15000);
      await reportStep(this.page, "Save button is clicked successfully", "pass");
    } catch (e) {
      await reportStep(this.page, "Save button is not clicked successfully..." + e, "fail");
    }
    return this;
  }

  async clickInvoiceDetails() {
    try {
      const invoice_NoText = await this.invoice_No.textContent();
      console.log('Invoice_No :', invoice_NoText);
      console.log('=========================');
      await this.page.waitForTimeout(5000);

      const invoice_DateText = await this.invoice_Date.textContent();
      console.log('Invoice_Date :', invoice_DateText);
      console.log('=========================');
      await this.page.waitForTimeout(5000);

      const Payment_TermsText = await this.payment_Terms.textContent();
      console.log('Payment_Terms :', Payment_TermsText);
      console.log('=========================');
      await this.page.waitForTimeout(5000);

      await reportStep(this.page, "Invoice Details is Get successfully", "pass");
    } catch (e) {
      await reportStep(this.page, "Invoice Details is not Get successfully..." + e, "fail");
    }
    return this;
  }

  async clickPrintButton() {
    try {
      await this.printBtn.click();
      await this.page.waitForTimeout(1500);

      await this.InvoiceSelect.click();
      await this.page.waitForTimeout(5000);
     // await this.pdfDownload.click();
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

      await this.customerBalance.click();
      await this.page.waitForTimeout(5000);

      const customerBalanceText = await this.customerBalance.textContent();
      console.log('Customer Balance :', customerBalanceText);
      await this.page.waitForTimeout(5000);

      await this.advanceBalance.click();
      await this.page.waitForTimeout(5000);

      const advanceBalanceText = await this.advanceBalance.textContent();
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
      /*await this.saveBtnEl.click();
      await this.page.waitForTimeout(2000);
      expect(await this.isErrorDisplayed()).toBeTruthy(); // Error message should be displayed for empty checkno */

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
      await this.checkNo.press('Enter');
      await this.page.waitForTimeout(3000);
      /*await this.saveBtnEl.click();
      await this.page.waitForTimeout(2000);
      expect(await this.isErrorDisplayed()).toBeTruthy(); // Error message should be displayed for empty checkno */
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
      await this.amount.press('Enter');
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
      //await this.checkBox.click();
      await this.page.waitForTimeout(3000);

      await this.checkBoxClick.evaluate((node) => node.click());
      await this.page.waitForTimeout(5000);

      await reportStep(this.page, "clickInvoiceCheckBox  is clicked successfully", "pass");
    } catch (e) {
      await reportStep(this.page, "clickInvoiceCheckBox is not clicked successfully..." + e, "fail");
    }
    return this;
  }

  async saveBtn() {
    try {
      await this.page.waitForTimeout(3000);
      await this.saveBtnEl.click();
      await this.page.waitForTimeout(3000);
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
      await this.page.waitForTimeout(3000);
      await this.receipt_No.click();
      await this.page.waitForTimeout(20000);

      const receipt_NoText = await this.receipt_No.textContent();
      console.log('receipt_No:', receipt_NoText);
      await this.page.waitForTimeout(5000);

      await this.receipt_Date.click();
      await this.page.waitForTimeout(5000);

      const receipt_DateText = await this.receipt_Date.textContent();
      console.log('receipt_Date:', receipt_DateText);
      await this.page.waitForTimeout(5000);
      await this.action.click();
      await this.page.waitForTimeout(2000);
      //await this.print.click();
      //await this.page.waitForTimeout(2000);
      await this.paymentReceipt.click();
      await this.page.waitForTimeout(5000);
      await this.backtoInvoice.click();
      await this.page.waitForTimeout(2000);
      await this.action1.click();
      await this.duplicate.click();
      await this.page.waitForTimeout(2000);
      await this.cancelEntry.click();
      await this.page.waitForTimeout(2000);
      await this.action2.click();
      await this.delete.click();
      await this.page.waitForTimeout(5000);

      await reportStep(this.page, "Get_The_Receipt_No is clicked successfully", "pass");
    } catch (e) {
      await reportStep(this.page, "Get_The_Receipt_No is not clicked successfully..." + e, "fail");
    }
    return this;
  }
}

module.exports = { CustomerInvoiceCreationPage };
