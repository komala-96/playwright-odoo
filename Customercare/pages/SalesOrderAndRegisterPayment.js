const { test, expect } = require('@playwright/test');
const { ensureLoggedIn } = require('../utils/loginHelper');

// Ported from src/main/java/pages/SalesOrderAndRegisterPayment.java.
// Selenium's @FindBy xpaths are preserved verbatim as Playwright locators.
// PageFactory/@CacheLookup have no equivalent needed: Playwright locators
// re-query the DOM on every action, so there's no stale-element risk to guard against.
class SalesOrderAndRegisterPayment {
  constructor(page) {
    this.page = page;

    // values captured across steps for later comparison, mirroring the
    // private String fields on the Java page object
    this.salesOrderSubTotal = null;
    this.salesOrderTaxAmt = null;
    this.salesOrderContainerDepositAmt = null;
    this.salesOrderTotal = null;

    this.invoiceSubTotalValue = null;
    this.invoiceTaxAmtValue = null;
    this.invoiceContainerDepositAmtValue = null;
    this.invoiceTotalValue = null;
    this.invoiceAmountDueValue = null;

    this.confirmedSalesOrderSubTotal = null;
    this.confirmedSalesOrderTaxAmt = null;
    this.confirmedSalesOrderContainerDepositAmt = null;
    this.confirmedSalesOrderTotal = null;

    // Login Page
    this.userName = page.locator("xpath=//input[@name='login']");
    this.passWord = page.locator("xpath=//input[@name='password']");
    this.logIn = page.locator("xpath=//button[@type='submit']");

    // Menu
    this.menu = page.locator("xpath=//ul[@class='o_menu_apps']//i[@class='fa fa-bars']");

    // financialacct
    this.customerMenu = page.locator("xpath=//div[contains(text(),'Customer Care')]");

    this.ordersMenubtn = page.locator("xpath=(//a[normalize-space()='Orders'])[1]");

    // Create btn
    this.createBtn = page.locator("xpath=//button[contains(text(),'New')]");

    // Dropdown btn
    this.customer = page.locator("xpath=(//div[@class='o-autocomplete dropdown']//input[@type='text'])[1]");

    // Create btn
    this.customerSearchMore = page.locator("xpath=(//a[normalize-space()='Search More...'])[1]");

    // Rani Builder's (Rani Builder's)
    this.customerSearchMoreBox = page.locator(
      "xpath=//div[@class='o_searchview_input_container d-flex flex-grow-1 flex-wrap gap-1 mw-100']//input[@type='text']"
    );

    this.customerName = page.locator(
      "xpath=(//table[@class='o_list_table table table-sm table-hover position-relative mb-0 o_list_table_ungrouped table-striped']//tbody//tr[1]//td[1])[2]"
    );

    this.termsBox = page.locator("xpath=(//div[@class='o-autocomplete dropdown']//input[@type='text'])[3]");

    // Create btn
    this.termsDD_Btn = page.locator("xpath=(//a[normalize-space()='15 Days'])[1]");

    this.contact = page.locator("xpath=//input[@placeholder='Contact Name']");

    // save btn
    this.associated_Product = page.locator("xpath=//div[@name='associated_product']//input[@type='checkbox']");

    this.showAll_Products = page.locator("xpath=//div[@name='sell_all_item']//input[@type='checkbox']");

    this.addBtn = page.locator("xpath=(//label[contains(text(),'Add')])[1]");

    this.product = page.locator("xpath=(//div[@class='o-autocomplete dropdown']//input[@type='text'])[4]");

    this.product_SearchMore = page.locator("xpath=(//a[normalize-space()='Search More...'])[1]");

    this.product_SearchBox = page.locator(
      "xpath=//div[@class='o_searchview_input_container d-flex flex-grow-1 flex-wrap gap-1 mw-100']//input[@type='text']"
    );

    this.product_Select = page.locator(
      "xpath=(//table[@class='o_list_table table table-sm table-hover position-relative mb-0 o_list_table_ungrouped table-striped'])[2]/tbody/tr[1]/td[3]"
    );

    this.productAddBtn = page.locator("xpath=(//button[@class='btn btn-primary'][normalize-space()='Add'])[1]");
    this.warningMsg = page.locator("xpath=//div[@id='price_zero_warning']");

    // save btn
    this.salesOrderSaveBtn = page.locator("xpath=//button[contains(text(),'Save')]");

    this.confirmBtn = page.locator("xpath=//span[normalize-space()='Confirm']");

    this.subTotal = page.locator("xpath=//div[@name='amount_untaxed']");

    this.taxAmt = page.locator("xpath=//div[@name='tax_amount_view']");

    this.containerDepositAmt = page.locator("xpath=//div[@name='container_deposit_view']");

    this.total = page.locator("xpath=//div[@name='amount_total']");

    this.salesOrderNum = page.locator("xpath=//div[@name='name']");

    this.deliveryMenu = page.locator("xpath=(//span[normalize-space()='Delivery'])[1]");

    // financialacct
    this.clickPickListBtn = page.locator("xpath=//a[normalize-space()='Pick List']");

    this.selectPickList = page.locator("xpath=(//div[@class='o-checkbox form-check']//input[@type='checkbox'])[1]");

    this.clickPackingSlip = page.locator("xpath=//button[contains(text(),'Packing Slip')]");

    this.selectAllPackingSlip = page.locator("xpath=//div[@name='select_all_pick']//input[@type='checkbox']");

    this.clickConfirmPackingSlip = page.locator("xpath=//button[@name='confirm_pack_slip']");

    this.clickOkbtn = page.locator("xpath=(//button[@class='btn btn-primary'][normalize-space()='Ok'])[1]");

    this.print_packing_slip1 = page.locator("xpath=//button[@name='print_packing_slip']");

    this.selectAllDeliveryBox = page.locator("xpath=//div[@name='select_all_delivery']//input[@type='checkbox']");

    this.clickDeliveryBtn = page.locator(
      "xpath=//button[@name='deliver_pack_slip_wizard']//span[contains(text(),'Delivery')]"
    );
    this.deliveryADDaLine = page.locator("xpath=//tr//td//a[contains(text(),'Add a line')]");

    this.orderNoBox = page.locator("xpath=//div[@name='sale_id']//input[@type='text']");

    this.orderNoSelect = page.locator("xpath=//a[@id='autocomplete_0_0']");

    this.productBox = page.locator("xpath=//div[@name='product_id']//input[@type='text']");

    this.productSelect = page.locator("xpath=//a[@id='autocomplete_0_2']");

    this.productQty = page.locator(
      "xpath=(//table[@class='o_list_table table table-sm table-hover position-relative mb-0 o_list_table_ungrouped table-striped'])[2]//tbody//tr[2]//td[3]//input"
    );

    this.productUoM = page.locator("xpath=//div[@name='sale_uom']");

    this.productUoMSelect = page.locator("xpath=//a[@id='autocomplete_0_0']");

    this.confirmDeliveryBtn = page.locator(
      "xpath=//button[@name='action_confirm_delivery']//span[contains(text(),'Confirm Delivery')]"
    );

    this.ordersMenuBtn = page.locator("xpath=//a[contains(text(),'Orders')]");

    this.orderSearch = page.locator("xpath=//input[@placeholder='Search...']");

    this.saleOrderCustomerClick = page.locator("xpath=//table//tbody//tr[1]//td[7]");

    this.confirmedSubTotal = page.locator("xpath=//div[@name='amount_untaxed']");

    this.confirmedTaxAmt = page.locator("xpath=//div[@name='tax_amount_view']");

    this.confirmedContainerDepositAmt = page.locator("xpath=//div[@name='container_deposit_view']");

    this.confirmedTotal = page.locator("xpath=//div[@name='amount_total']");

    this.confirmedSalesOrderNum = page.locator("xpath=//div[@name='name']");

    this.printBtn = page.locator("xpath=//button[normalize-space()='Print']");

    this.selectQuotation = page.locator("xpath=//span[normalize-space()='Quotation / Order']");

    this.selectInvoice = page.locator("xpath=//a[contains(text(),'Invoice')]");

    this.invoiceBtn = page.locator("xpath=//button[@name='action_view_invoice']");

    this.invoiceSubTotal = page.locator("xpath=//div[@name='amount_untaxed']");

    this.invoiceTaxAmt = page.locator("xpath=//div[@name='tax_amount_view']");

    this.invoiceContainerDepositAmt = page.locator("xpath=//div[@name='total_container_deposit']");

    this.invoiceTotal = page.locator("xpath=//div[@name='amount_total_view']");

    this.invoiceAmountDue = page.locator("xpath=//div[@name='amount_residual']");

    this.invoiceNo = page.locator("xpath=//div[@name='name']");

    this.registerPaymentBtn = page.locator("xpath=//span[normalize-space()='Register Payment']");

    // citi bank enter the bank name
    this.customerBalance = page.locator("xpath=//div[@name='invoice_balance']");

    this.advanceBalance = page.locator("xpath=//div[@name='cust_advance_balance']");

    // select
    this.modeOfPayment = page.locator("xpath=//select[@id='payment_mode_id_0']");

    this.checkNo = page.locator("xpath=//input[@id='check_no_0']");

    // sendkeys
    this.amount = page.locator("xpath=//input[@id='amount_0']");

    // 101401 Bank 1 select option
    this.depositTo = page.locator("xpath=//select[@id='account_id_0']");

    this.checkBox = page.locator(
      "xpath=//table[@class='o_list_table table table-sm table-hover table-striped o_list_table_ungrouped table-striped']//tbody//tr[2]//td[1]"
    );

    this.checkBoxClick = page.locator("xpath=//td[@name='is_checked']//input[@type='checkbox']");

    // NOTE: Java also declared a `saveBtn` WebElement field with the same
    // name as the saveBtn() method below. JS can't shadow a prototype
    // method with an instance property of the same name, so the locator is
    // named saveButton here instead.
    this.saveButton = page.locator("xpath=//span[normalize-space()='Confirm']");

    // get text
    this.receipt_No = page.locator("xpath=//div[@name='name']");

    this.receipt_Date = page.locator("xpath=//div[@name='receipt_date']");

    // NOTE: Java also declared an `unapplied_amount` WebElement field with the
    // same name as the unapplied_amount() method below. JS can't shadow a
    // prototype method with an instance property of the same name, so the
    // locator is named unappliedAmount here instead.
    this.unappliedAmount = page.locator("xpath=//div[@name='unapplied_amount']");
  }

  async #isErrorDisplayed() {
    return this.page.locator("xpath=//div[@class='o_notification_content']").isVisible();
  }

  async #getColumnText(row, column) {
    try {
      const element = this.page.locator(`xpath=.//tr[${row}]//td[${column}]`);
      await element.waitFor({ state: 'visible', timeout: 30_000 });
      return await element.innerText();
    } catch (e) {
      console.error(`Error retrieving text from row ${row}, column ${column}: ${e.message}`);
      return 'N/A';
    }
  }

  async enterUsername(user) {
    return test.step('username is entered successfully', async () => {
      await this.userName.fill(user);
      return this;
    });
  }

  async enterPassword(pass) {
    return test.step('Password is entered successfully', async () => {
      await this.passWord.fill(pass);
      return this;
    });
  }

  async clickLoginButton() {
    return test.step('Login button is clicked successfully', async () => {
      await this.logIn.click();
      return this;
    });
  }

  async loginIfNeeded(user, pass) {
    await ensureLoggedIn(this, user, pass);
    return this;
  }

  async clickMenu() {
    return test.step('Menu is clicked successfully', async () => {
      await this.menu.click({ timeout: 30_000 });
      return this;
    });
  }

  async clickCustomerMenu() {
    return test.step('Customer Menu is clicked successfully', async () => {
      await this.customerMenu.click({ timeout: 30_000 });
      return this;
    });
  }

  async clickOrdersPage() {
    return test.step('Orders Page is clicked successfully', async () => {
      await this.ordersMenubtn.click({ timeout: 30_000 });
      await this.createBtn.click();
      return this;
    });
  }

  async clickCustomer_Details(cusName) {
    return test.step('Customer_Details is clicked successfully', async () => {
      await this.customer.click();
      await this.customerSearchMore.click();
      await this.customerSearchMoreBox.click();
      await this.customerSearchMoreBox.fill(cusName);
      await this.customerSearchMoreBox.press('Enter');
      await this.page.waitForTimeout(5_000);
      await this.customerName.click();
      await this.page.waitForTimeout(5_000);

      // await this.termsBox.click();
      // await this.termsDD_Btn.click();

      return this;
    });
  }

  async clickCustomer_Products() {
    return test.step('Customer_Products is clicked successfully', async () => {
      await this.associated_Product.waitFor({ state: 'attached', timeout: 60_000 });
      await this.associated_Product.check({ force: true });

      await this.showAll_Products.waitFor({ state: 'attached', timeout: 60_000 });
      await this.showAll_Products.check({ force: true });
      await this.page.waitForTimeout(50_000);
      return this;
    });
  }

  async clickCustomer_AddZeroProducts() {
    return test.step('Customer_AddZeroProducts is clicked successfully', async () => {
      await this.product.waitFor({ state: 'attached', timeout: 120_000 });
      await this.product.click();
      // Clicking "Search More..." opens the dialog with the domain computed when the
      // field first rendered (before the Associated/Show-All checkboxes were toggled),
      // which is why it came back empty. Typing directly into the field re-evaluates
      // the domain against the current (checked) state, so the inline dropdown that
      // opens reflects the correct, unrestricted product list.
      await this.product.pressSequentially('Lays Original 2.25oz', { delay: 100 });

      // Let the catalog finish loading every matching suggestion before picking one.
      await this.page.waitForTimeout(5_000);

      const menuXpath = "//ul[contains(@class,'ui-autocomplete') and not(contains(@style,'none'))]";
      await this.page.locator('xpath=' + menuXpath).waitFor({ state: 'visible', timeout: 60_000 });

      const productOption = this.page.locator(
        "xpath=" + menuXpath + "//li[contains(., 'Lays Original 2.25oz')]"
      );
      await productOption.waitFor({ state: 'visible', timeout: 60_000 });
      await productOption.click();

      await this.productAddBtn.click({ timeout: 30_000 });

      // Check if the warning message is displayed
      /* if (await this.warningMsg.isVisible()) {
        console.log('Warning Message: ' + (await this.warningMsg.innerText()));
      } else {
        console.log('No warning message found.');
        console.log('------------------------');
      } */

      return this;
    });
  }

  // Negative Scenarios
  async clickSalesOrder_WithoutEnteringQty_SaveBtn() {
    return test.step('Customer_AddZeroProducts is clicked successfully', async () => {
      await this.salesOrderSaveBtn.click();

      /* Check if the alert message is displayed
      if (salesOrderAlertMsg.isDisplayed()) {
        console.log('Alert Message: ' + salesOrderAlertMsg.getText());
        salesOrderAlertOkBtn.click();
      } else {
        console.log('No alert message found.');
        console.log('------------------------');
      } */

      return this;
    });
  }

  async clickQuantity(qty) {
    return test.step('Quantity button is clicked successfully', async () => {
      const rowsLocator = this.page.locator(
        "xpath=(//table[contains(@class,'o_list_table')])[1]//tr[contains(@class,'o_data_row')]"
      );
      const rowCount = await rowsLocator.count();
      console.log('Total rows found: ' + rowCount);

      for (let i = 0; i < rowCount; i++) {
        // Always re-locate row by index (1-based XPath)
        const rowXpathBase =
          "(//table[contains(@class,'o_list_table')])[1]" + "//tr[contains(@class,'o_data_row')][" + (i + 1) + ']';

        const row = this.page.locator('xpath=' + rowXpathBase);
        await row.waitFor({ state: 'attached', timeout: 30_000 });

        const qtyCell = this.page.locator('xpath=' + rowXpathBase + "//td[@name='product_uom_qty']");
        await qtyCell.click({ timeout: 30_000 });

        // Quantity input (do NOT wait for row to be clickable)
        const qtyInput = this.page.locator('xpath=' + rowXpathBase + "//td[@name='product_uom_qty']//input");
        await qtyInput.waitFor({ state: 'visible', timeout: 30_000 });
        await qtyInput.fill(qty);

        // Price input
        const priceInput = this.page.locator('xpath=' + rowXpathBase + "//td[@name='unit_price']//input");
        await priceInput.waitFor({ state: 'visible', timeout: 30_000 });
        await priceInput.fill('15.00');

        // Commit row (VERY IMPORTANT in Odoo)
        await priceInput.press('Tab');
      }

      return this;
    });
  }

  async clickSavebtn() {
    return test.step('Save button is clicked successfully', async () => {
      // await this.salesOrderSaveBtn.click();
      await this.confirmBtn.click();
      return this;
    });
  }

  async clickGetTheSaleOrderAmount() {
    return test.step('Get the Sales Order Amount is clicked successfully', async () => {
      this.salesOrderSubTotal = await this.subTotal.innerText();
      console.log('Sales Order : SubTotal :' + this.salesOrderSubTotal);

      this.salesOrderTaxAmt = await this.taxAmt.innerText();
      console.log('Sales Order : Tax Amount :' + this.salesOrderTaxAmt);

      this.salesOrderContainerDepositAmt = await this.containerDepositAmt.innerText();
      console.log('Sales Order : Container Deposit Amount :' + this.salesOrderContainerDepositAmt);

      this.salesOrderTotal = await this.total.innerText();
      console.log('Sales Order : Total : ' + this.salesOrderTotal);

      console.log('----------------------------------------------');

      return this;
    });
  }

  async clickSalesOrderNo() {
    return test.step('Sales Order No is clicked successfully', async () => {
      await this.salesOrderNum.click();

      const salesOrderNo = await this.salesOrderNum.innerText();
      console.log('Saler Order Number : ' + salesOrderNo);
      console.log('----------------------------------------------');

      return this;
    });
  }

  async clickDeliveryMenu() {
    return test.step('Delivery Menu is clicked successfully', async () => {
      await this.deliveryMenu.click({ timeout: 30_000 });
      await this.clickPickListBtn.click();
      return this;
    });
  }

  async clickCheckBox() {
    return test.step('Check Box is clicked successfully', async () => {
      await this.selectPickList.click({ force: true });
      await this.clickPackingSlip.click();
      await this.selectAllPackingSlip.click({ force: true });
      await this.clickConfirmPackingSlip.click();
      await this.clickOkbtn.click();
      return this;
    });
  }

  async clickNegativeCheckBox() {
    return test.step('Negative Check Box is clicked successfully', async () => {
      await this.selectPickList.click({ force: true });
      await this.clickPackingSlip.click();
      // Click on the "Select All" Packing Slip checkbox
      await this.selectAllPackingSlip.click({ force: true });

      const tableXpath =
        "(//table[@class='o_list_table table table-sm table-hover position-relative mb-0 o_list_table_ungrouped table-striped'])[4]//tbody//tr";
      const totalRows = await this.page.locator('xpath=' + tableXpath).count();
      console.log('Total number of rows: ' + totalRows);

      // Iterate through the first row.
      // Playwright locators are re-queried on every action, so the recursive
      // StaleElementReferenceException retry from the Java version isn't
      // needed here.
      for (let row = 1; row <= Math.min(1, totalRows); row++) {
        const sourceDocument = this.page.locator(
          "xpath=(//table[@class='o_list_table table table-sm table-hover position-relative mb-0 o_list_table_ungrouped table-striped'])[4]//tbody//tr[" +
            row +
            ']//td[1]'
        );
        await sourceDocument.scrollIntoViewIfNeeded();
        await sourceDocument.click({ timeout: 30_000 });

        // Re-fetch the Picking Quantity input before interacting
        const pickingQuantityInput = this.page.locator(
          "xpath=(//table[@class='o_list_table table table-sm table-hover position-relative mb-0 o_list_table_ungrouped table-striped'])[4]//tbody//tr[" +
            row +
            "]//td[5]//input"
        );
        await pickingQuantityInput.fill('-2', { timeout: 30_000 });

        const nextElement = this.page.locator(
          "xpath=(//table[@class='o_list_table table table-sm table-hover position-relative mb-0 o_list_table_ungrouped table-striped'])[4]//tbody//tr[2]//td[1]"
        );
        await nextElement.click({ timeout: 30_000 });

        // Check for a validation message
        try {
          const validationMessage = this.page.locator("xpath=//div[@class='modal-content o_error_dialog']//p");
          await validationMessage.waitFor({ state: 'visible', timeout: 30_000 });
          console.log('Validation Message: ' + (await validationMessage.innerText()));

          // Click OK button on the validation dialog
          await this.page.locator("xpath=//button[normalize-space()='Close']").click();
          console.log('Validation error dismissed successfully for row ');
        } catch (e) {
          // No validation message found; proceed normally
          console.log('No validation message displayed.');
        }

        // Re-fetch the Confirm Packing Slip button before interacting
        await this.page.locator("xpath=//button[@name='confirm_pack_slip']").click();

        // Re-fetch the Ok button before interacting
        await this.page.locator("xpath=(//button[normalize-space()='Ok'])[2]").click({ timeout: 30_000 });
      }

      return this;
    });
  }

  async clickDeliveryCheckBox(qty1) {
    return test.step('Delivery Check Box is clicked successfully', async () => {
      await this.selectAllDeliveryBox.click({ force: true });

      await this.clickDeliveryBtn.click();

      await this.deliveryADDaLine.click();

      await this.orderNoBox.click();
      await this.orderNoSelect.click();

      await this.productBox.click();
      await this.productSelect.click();

      /* await this.productQty.fill(qty1);
      await this.productUoM.click();

      try {
        const validationMessage = this.page.locator("xpath=//div[@class='modal-content o_error_dialog']//p");
        await validationMessage.waitFor({ state: 'visible', timeout: 30_000 });
        console.log('Validation Message: ' + (await validationMessage.innerText()));

        await this.page.locator("xpath=//button[normalize-space()='Close']").click();
        console.log('Validation error dismissed successfully for row ');
      } catch (e) {
        console.log('No validation message displayed.');
      }
      // await this.productUoMSelect.click(); */

      await this.confirmDeliveryBtn.click();
      // Java slept 50s here for the delivery confirmation to finish
      // processing server-side before the next step's element becomes
      // available; this exceeds Playwright's default actionability timeout
      // so it's kept as an explicit wait rather than dropped.
      await this.page.waitForTimeout(50_000);

      return this;
    });
  }

  async clickOrderMenu() {
    return test.step('Order Menu is clicked successfully', async () => {
      await this.ordersMenuBtn.click({ timeout: 30_000 });
      return this;
    });
  }

  async clickCustomerSelect() {
    return test.step('Customer Select is clicked successfully', async () => {
      await this.saleOrderCustomerClick.click({ timeout: 30_000 });
      return this;
    });
  }

  async clickGetTheConfirmedSaleOrderAmount() {
    return test.step('Get the Confirmed Sales Order Amount is clicked successfully', async () => {
      this.confirmedSalesOrderSubTotal = await this.confirmedSubTotal.innerText();
      console.log('Confirmed Sales Order : SubTotal :' + this.confirmedSalesOrderSubTotal);

      this.confirmedSalesOrderTaxAmt = await this.confirmedTaxAmt.innerText();
      console.log('Confirmed Sales Order : Tax Amount :' + this.confirmedSalesOrderTaxAmt);

      this.confirmedSalesOrderContainerDepositAmt = await this.confirmedContainerDepositAmt.innerText();
      console.log(
        'Confirmed Sales Order : Container Deposit Amount :' + this.confirmedSalesOrderContainerDepositAmt
      );

      this.confirmedSalesOrderTotal = await this.confirmedTotal.innerText();
      console.log('Confirmed Sales Order : Total : ' + this.confirmedSalesOrderTotal);

      console.log('----------------------------------------------');

      return this;
    });
  }

  async clickConfirmedSalesOrderNo() {
    return test.step('Confirmed Sales Order No is clicked successfully', async () => {
      await this.confirmedSalesOrderNum.click();

      const salesOrderNo = await this.confirmedSalesOrderNum.innerText();
      console.log('Saler Order Number : ' + salesOrderNo);
      console.log('----------------------------------------------');

      return this;
    });
  }

  async clickInvoiceBtn() {
    return test.step('Invoice Btn is clicked successfully', async () => {
      await this.invoiceBtn.click({ timeout: 30_000 });
      return this;
    });
  }

  async clickGetTheInvoiceAmount() {
    return test.step('Get the Invoice Amount is clicked successfully', async () => {
      this.invoiceSubTotalValue = await this.invoiceSubTotal.innerText();
      console.log('Invoice : SubTotal :' + this.invoiceSubTotalValue);

      this.invoiceTaxAmtValue = await this.invoiceTaxAmt.innerText();
      console.log('Invoice : Tax Amount :' + this.invoiceTaxAmtValue);

      this.invoiceContainerDepositAmtValue = await this.invoiceContainerDepositAmt.innerText();
      console.log('Invoice : Container Deposit Amount :' + this.invoiceContainerDepositAmtValue);

      this.invoiceTotalValue = await this.invoiceTotal.innerText();
      console.log('Invoice : Total :' + this.invoiceTotalValue);

      this.invoiceAmountDueValue = await this.invoiceAmountDue.innerText();
      console.log('Invoice : Amount Due :' + this.invoiceAmountDueValue);
      console.log('---------------------------------------------------');

      return this;
    });
  }

  async clickInvoiceNo() {
    return test.step('Invoice No is clicked successfully', async () => {
      await this.invoiceNo.click();

      const invoiceNoText = await this.invoiceNo.innerText();
      console.log('Invoice Number : ' + invoiceNoText);

      return this;
    });
  }

  async compareSalesOrderAndInvoiceAmounts() {
    console.log('------------------------------------------');
    console.log('Comparing Sales Order and Invoice Amounts:');

    if (this.salesOrderSubTotal === this.invoiceSubTotalValue) {
      console.log('SubTotal matches: ' + this.salesOrderSubTotal);
    } else {
      console.log(
        'SubTotal does not match! Sales Order: ' + this.salesOrderSubTotal + ', Invoice: ' + this.invoiceSubTotalValue
      );
    }

    if (this.salesOrderTaxAmt === this.invoiceTaxAmtValue) {
      console.log('Tax Amount matches: ' + this.salesOrderTaxAmt);
    } else {
      console.log(
        'Tax Amount does not match! Sales Order: ' + this.salesOrderTaxAmt + ', Invoice: ' + this.invoiceTaxAmtValue
      );
    }

    if (this.salesOrderContainerDepositAmt === this.invoiceContainerDepositAmtValue) {
      console.log('Container Deposit Amount matches: ' + this.salesOrderContainerDepositAmt);
    } else {
      console.log(
        'Container Deposit Amount does not match! Sales Order: ' +
          this.salesOrderContainerDepositAmt +
          ', Invoice: ' +
          this.invoiceContainerDepositAmtValue
      );
    }

    if (this.salesOrderTotal === this.invoiceTotalValue) {
      console.log('Total Amount matches: ' + this.salesOrderTotal);
    } else {
      console.log(
        'Total Amount does not match! Sales Order: ' + this.salesOrderTotal + ', Invoice: ' + this.invoiceTotalValue
      );
    }

    return this;
  }

  async clickRegisterPaymentBtn() {
    return test.step('Register Payment Btn is clicked successfully', async () => {
      await this.registerPaymentBtn.click({ timeout: 30_000 });

      await this.customerBalance.click();
      const customerBalanceText = await this.customerBalance.innerText();
      console.log('Customer Balance : ' + customerBalanceText);

      await this.advanceBalance.click();
      const advanceBalanceText = await this.advanceBalance.innerText();
      console.log('Advance Balance : ' + advanceBalanceText);

      return this;
    });
  }

  async clickModeOfPayment() {
    return test.step('Mode Of Payment is clicked successfully', async () => {
      await this.modeOfPayment.click();
      // Selects the second option (index 1)
      await this.modeOfPayment.selectOption({ index: 1 });
      return this;
    });
  }

  async clickCheckNo(CheckNo) {
    return test.step('Check No is clicked successfully', async () => {
      await this.checkNo.click();
      // 123
      await this.checkNo.fill(CheckNo);

      /* await this.saveButton.click();
      expect(await this.#isErrorDisplayed()).toBeTruthy(); */

      return this;
    });
  }

  async clickCheckNoNegative(CheckNo) {
    return test.step('Check No is clicked successfully', async () => {
      await this.checkNo.click();
      // 123
      await this.checkNo.fill(CheckNo);

      await this.amount.click();

      try {
        const validationMessage = this.page.locator("xpath=//div[@class='modal-content o_error_dialog']//p");
        await validationMessage.waitFor({ state: 'visible', timeout: 30_000 });
        console.log('Validation Message: ' + (await validationMessage.innerText()));

        // Click OK button on the validation dialog
        await this.page.locator("xpath=//button[normalize-space()='Close']").click();
        console.log('Validation error dismissed successfully for row ');
      } catch (e) {
        // No validation message found; proceed normally
        console.log('No validation message displayed.');
      }

      return this;
    });
  }

  async clickAmount(amt) {
    return test.step('Amount is clicked successfully', async () => {
      await this.amount.click();
      // 123
      await this.amount.fill(amt);
      return this;
    });
  }

  async clickAmountNegative(amt) {
    return test.step('Amount is clicked successfully', async () => {
      // 123
      await this.amount.fill(amt);

      await this.depositTo.click();

      try {
        const validationMessage = this.page.locator("xpath=//div[@class='modal-content o_error_dialog']//p");
        await validationMessage.waitFor({ state: 'visible', timeout: 30_000 });
        console.log('Validation Message: ' + (await validationMessage.innerText()));

        // Click OK button on the validation dialog
        await this.page.locator("xpath=//button[normalize-space()='Close']").click();
        console.log('Validation error dismissed successfully for row ');
      } catch (e) {
        // No validation message found; proceed normally
        console.log('No validation message displayed.');
      }

      return this;
    });
  }

  async clickDepositTo() {
    return test.step('Deposit To is clicked successfully', async () => {
      // Selects the second option (index 1)
      await this.depositTo.selectOption({ index: 1 });
      return this;
    });
  }

  async clickInvoiceCheckBox() {
    return test.step('Deposit To is clicked successfully', async () => {
      await this.checkBox.click();
      await this.checkBoxClick.click({ force: true });
      return this;
    });
  }

  async saveBtn() {
    return test.step('save Button is clicked successfully', async () => {
      await this.saveButton.click();

      try {
        const errorMsg = this.page.locator("xpath=//div[@class='o_notification_content']");
        await errorMsg.waitFor({ state: 'visible', timeout: 30_000 });
        console.log('Validation Error Message: ' + (await errorMsg.innerText()));

        // Dismiss the validation error
        expect(await this.#isErrorDisplayed()).toBeTruthy();
        console.log('Validation error dismissed successfully for row ');
      } catch (e) {
        console.log('No validation error for row ');
      }

      try {
        const errorMsg = this.page.locator("xpath=//div[@class='o_dialog_warning modal-body']//p");
        await errorMsg.waitFor({ state: 'visible', timeout: 30_000 });
        console.log('Validation Error Message: ' + (await errorMsg.innerText()));

        // Dismiss the validation error
        await this.page.locator("xpath=(//button[@type='button']//span[contains(text(),'Ok')])").click();
        console.log('Validation error dismissed successfully for row ');
      } catch (e) {
        console.log('No validation error for row ');
      }

      return this;
    });
  }

  async Get_The_Receipt_No() {
    return test.step('Get_The_Receipt_No is clicked successfully', async () => {
      await this.receipt_No.click();
      const receiptNoText = await this.receipt_No.innerText();
      console.log('receipt_No: ' + receiptNoText);

      await this.receipt_Date.click();
      const receiptDateText = await this.receipt_Date.innerText();
      console.log('receipt_Date: ' + receiptDateText);

      return this;
    });
  }

  async Get_The_Invoice_Details() {
    return test.step('Invoice details retrieved successfully', async () => {
      // Get the table headers (th elements) to determine the number of columns
      const headers = this.page.locator(
        "xpath=//table[@class='o_list_table table table-sm table-hover table-striped o_list_table_ungrouped']//thead//th"
      );
      const headerCount = await headers.count();

      // Get the number of rows in the table body
      const totalRows = await this.page
        .locator(
          "xpath=//table[@class='o_list_table table table-sm table-hover table-striped o_list_table_ungrouped']//tbody//tr"
        )
        .count();

      // Retrieve and print row data with headers
      for (let row = 1; row <= Math.min(1, totalRows); row++) {
        const rowDataLines = [];
        for (let column = 1; column <= headerCount; column++) {
          const headerName = (await headers.nth(column - 1).innerText()).trim();
          const cellText = await this.#getColumnText(row, column);
          rowDataLines.push(`${headerName}: ${cellText}`);
        }
        console.log(rowDataLines.join('\n'));
        console.log('-------------------------------------------------'); // Separator between rows
      }

      return this;
    });
  }

  async unapplied_amount() {
    return test.step('Unapplied_amount is clicked successfully', async () => {
      await this.unappliedAmount.click();
      await this.unappliedAmount.waitFor({ state: 'visible', timeout: 20_000 });
      const unappliedAmountText = await this.unappliedAmount.innerText();
      console.log('Unapplied Amount: ' + unappliedAmountText);

      return this;
    });
  }
}

module.exports = { SalesOrderAndRegisterPayment };
