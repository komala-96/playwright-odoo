const { test, expect } = require('@playwright/test');
const { ensureLoggedIn } = require('../utils/loginHelper');

// Ported from src/main/java/pages/BackOrderPage.java.
// Selenium's @FindBy xpaths are preserved verbatim as Playwright locators.
// PageFactory/@CacheLookup have no equivalent needed: Playwright locators
// re-query the DOM on every action, so there's no stale-element risk to guard against.
class BackOrderPage {
  constructor(page) {
    this.page = page;

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

    this.product = page.locator("xpath=//input[@id='cus_product_assoc_ids_0']");

    this.product_SearchMore = page.locator("xpath=(//a[normalize-space()='Search More...'])[1]");

    this.product_SearchBox = page.locator(
      "xpath=//div[@class='o_searchview_input_container d-flex flex-grow-1 flex-wrap gap-1 mw-100']//input[@type='text']"
    );

    this.product_Select = page.locator(
      "xpath=(//table[@class='o_list_table table table-sm table-hover position-relative mb-0 o_list_table_ungrouped table-striped'])[2]/tbody/tr[1]/td[3]"
    );

    this.productAddBtn = page.locator("xpath=(//button[@class='btn btn-primary'][normalize-space()='Add'])[1]");

    this.serviceProduct = page.locator("xpath=(//div[@class='o-autocomplete dropdown']//input[@type='text'])[5]");

    this.serviceProduct_SearchMore = page.locator(
      "xpath=(//a[normalize-space()='[AVR22462] Subsidy - Candy'])[1]"
    );

    this.serviceProduct_Select = page.locator("xpath=//table//tbody//tr[1]//td[1]//div//input[@type='checkbox']");

    this.selectBtn = page.locator("xpath=//button[@type='button']//span[contains(text(),'Select')]");

    this.serviceProductAddBtn = page.locator("xpath=(//button[@class='btn btn-primary'][normalize-space()='Add'])[2]");

    this.clickAddress = page.locator("xpath=//a[normalize-space()='Address']");

    this.otherInfo = page.locator("xpath=//a[normalize-space()='Other Info']");

    this.addClick = page.locator("xpath=//input[@id='partner_invoice_id_0']");

    this.deliveryAddress = page.locator("xpath=(//a[contains(normalize-space(),', komala')])");

    this.addClick1 = page.locator("xpath=//input[@id='partner_shipping_id_0']");

    this.billingAddress = page.locator("xpath=(//a[contains(normalize-space(),', komala')])");

    // li[@class='nav-item product_lis']//a[contains(text(),'Order Lines')]
    this.orderLines = page.locator("xpath=//a[normalize-space()='Order Lines']");

    this.location = page.locator("xpath=//input[@id='warehouse_id_0']");

    this.locationSelect = page.locator("xpath=(//a[normalize-space()='UltraServ Equipment Warehouse'])[1]");

    this.route = page.locator("xpath=//input[@id='route_id_0']");

    this.routeSelect = page.locator("xpath=//a[@id='route_id_0_0_0']");

    this.dropOff = page.locator("xpath=//input[@id='drop_location_id_0']");

    this.dropoffSelect = page.locator("xpath=(//a[normalize-space()='Warehouse'])[1]");

    // save btn
    this.salesOrderSaveBtn = page.locator("xpath=//span[normalize-space()='Confirm']");

    this.confirmBtn = page.locator("xpath=//span[normalize-space()='Confirm']");

    this.subTotal = page.locator("xpath=//div[@name='amount_untaxed']");

    this.taxAmt = page.locator("xpath=//div[@name='tax_amount_view']");

    this.containerDepositAmt = page.locator("xpath=//div[@name='container_deposit_view']");

    this.total = page.locator("xpath=//div[@name='amount_total']");

    this.salesOrderNum = page.locator("xpath=//div[@name='name']");

    // save btn
    this.deliveryMenu = page.locator("xpath=(//span[normalize-space()='Delivery'])[1]");

    // financialacct
    this.clickPickListBtn = page.locator("xpath=//a[normalize-space()='Pick List']");

    this.selectPickList = page.locator("xpath=(//div[@class='o-checkbox form-check']//input[@type='checkbox'])[1]");

    this.clickPackingSlip = page.locator("xpath=//button[contains(text(),'Packing Slip')]");

    this.selectAllPackingSlip = page.locator("xpath=//div[@name='select_all_pick']//input[@type='checkbox']");

    this.clickConfirmPackingSlip = page.locator("xpath=//button[@name='confirm_pack_slip']");

    this.clickOkbtn = page.locator("xpath=(//button[@class='btn btn-primary'][normalize-space()='Ok'])[1]");

    // save btn
    this.deliveryMenu1 = page.locator("xpath=(//span[normalize-space()='Delivery'])[1]");

    // financialacct
    this.clickPickListBtn1 = page.locator("xpath=//a[normalize-space()='Pick List']");

    this.selectPickList1 = page.locator("xpath=(//div[@class='o-checkbox form-check']//input[@type='checkbox'])[1]");

    this.clickPackingSlip1 = page.locator("xpath=//button[contains(text(),'Packing Slip')]");

    this.selectAllPackingSlip1 = page.locator("xpath=//div[@name='select_all_pick']//input[@type='checkbox']");

    this.clickConfirmPackingSlip1 = page.locator("xpath=//button[@name='confirm_pack_slip']");

    this.clickOkbtn1 = page.locator("xpath=(//button[@class='btn btn-primary'][normalize-space()='Ok'])[1]");

    this.print_packing_slip1 = page.locator("xpath=//button[@name='print_packing_slip']");

    this.selectAllDeliveryBox = page.locator("xpath=//div[@name='select_all_delivery']//input[@type='checkbox']");

    this.clickDeliveryBtn = page.locator(
      "xpath=//button[@name='deliver_pack_slip_wizard']//span[contains(text(),'Delivery')]"
    );

    this.deliveryADDaLine = page.locator("xpath=//tr//td//a[contains(text(),'Add a line')]");

    this.orderNoBox = page.locator("xpath=//div[@name='sale_id']//input[@type='text']");

    this.orderNoSelect = page.locator("xpath=//li[@class='ui-menu-item']//a[1]");

    this.productBox = page.locator("xpath=//div[@name='product_id']//input[@type='text']");

    this.productSelect = page.locator("xpath=(//li[@class='ui-menu-item']//a)[2]");

    this.productQty = page.locator("xpath=//input[@name='deliver_qty']");

    this.productUoM = page.locator("xpath=//div[@name='sale_uom']");

    this.productUoMSelect = page.locator("xpath=//li[@class='ui-menu-item']//a[contains(text(),'Case(1)')]");

    this.confirmDeliveryBtn = page.locator(
      "xpath=//button[@name='action_confirm_delivery']//span[contains(text(),'Confirm Delivery')]"
    );

    // OrderCreation
    this.ordersMenuBtn = page.locator("xpath=//a[contains(text(),'Orders')]");

    this.orderSearch = page.locator("xpath=//input[@placeholder='Search...']");

    this.saleOrderCustomerClick = page.locator("xpath=//table//tbody//tr[1]//td[7]");

    this.confirmedSubTotal = page.locator("xpath=//div[@name='amount_untaxed']");

    this.confirmedTaxAmt = page.locator("xpath=//div[@name='tax_amount_view']");

    this.confirmedContainerDepositAmt = page.locator("xpath=//div[@name='container_deposit_view']");

    this.confirmedTotal = page.locator("xpath=//div[@name='amount_total']");

    this.confirmedSalesOrderNum = page.locator("xpath=//div[@name='name']");

    this.actionBtn = page.locator("xpath=//button[normalize-space()='Action']");

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

    this.registerPaymentBtn = page.locator(
      "xpath=//button[@id='action_register_payment_btn']//span[contains(text(),'Register Payment')]"
    );

    // citi bank enter the bank name
    this.customerBalance = page.locator("xpath=//span[@name='invoice_balance']");

    this.advanceBalance = page.locator("xpath=//span[@name='invoice_balance']");

    // select
    this.modeOfPayment = page.locator("xpath=//select[@name='payment_mode_id']");

    this.checkNo = page.locator("xpath=//input[@name='check_no']");

    // sendkeys
    this.amount = page.locator("xpath=//input[@name='amount']");

    // 101401 Bank 1 select option
    this.depositTo = page.locator("xpath=//select[@name='account_id']");

    // click
    this.saveBtn = page.locator("xpath=//button[contains(text(),'Save')]");

    // get text
    this.receipt_No = page.locator("xpath=//span[@name='name']");

    this.receipt_Date = page.locator("xpath=//span[@name='receipt_date']");

    this.unapplied_amount = page.locator("xpath=//span[@name='unapplied_amount']");

    this.checkbox = page.locator("xpath=//input[@id='select_all_0']");

    this.contBtn = page.locator("xpath=//span[normalize-space()='Continue']");

    this.closeBtn = page.locator("xpath=(//button[normalize-space()='×'])[1]");

    this.closeBtn1 = page.locator("xpath=(//button[normalize-space()='×'])[1]");

    this.delivery = page.locator("xpath=//span[normalize-space()='Delivery']");

    this.backOrder = page.locator("xpath=//a[normalize-space()='Backorders']");

    this.orderSelect = page.locator(
      "xpath=//table[@class='o_list_table table table-sm table-hover position-relative mb-0 o_list_table_ungrouped table-striped']//tbody//tr[1]//td[2]"
    );

    this.orderSelectCheckbox = page.locator(
      "xpath=(//table[@class='o_list_table table table-sm table-hover position-relative mb-0 o_list_table_ungrouped table-striped']//tbody//tr[1]//td[1]//input[@type='checkbox'])"
    );

    this.editBtn = page.locator("xpath=//button[normalize-space()='Edit']");

    this.updateQuan = page.locator(
      "xpath=(//table[@class='o_list_table table table-sm table-hover position-relative mb-0 o_list_table_ungrouped table-striped']//tr[1]//td[2])[1]"
    );

    this.quantity = page.locator("xpath=//input[@id='backorder_qty_0']");

    this.addLine = page.locator(
      "xpath=//table[@class='o_list_table table table-sm table-hover position-relative mb-0 o_list_table_ungrouped table-striped']//tr[1]//td[1]//a[contains(text(),'Add a line')]"
    );

    this.salePick = page.locator("xpath=//div[@name='sale_pick_id']//input[@type='text']");

    this.orderSearchMore = page.locator("xpath=(//a[normalize-space()='Search More...'])[1]");

    this.ordSelect = page.locator(
      "xpath=(//table[@class='o_list_table table table-sm table-hover position-relative mb-0 o_list_table_ungrouped table-striped'])[2]//tr[2]//td[1]"
    );

    this.saleLine = page.locator("xpath=//div[@name='sale_line_id']//input[@type='text']");

    this.proSelect = page.locator("xpath=//a[@id='sale_line_id_0_0_1']");

    this.quantity1 = page.locator("xpath=//input[@id='backorder_qty_0']");

    this.saveAndClose = page.locator("xpath=//button[normalize-space()='Close']");

    this.saveAndClose1 = page.locator("xpath=//button[@class='btn btn-primary o_form_button_save']");

    this.save = page.locator("xpath=//i[@class='fa fa-cloud-upload fa-fw']");

    this.action = page.locator("xpath=//button[normalize-space()='Action']");

    this.duplicate = page.locator("xpath=//span[normalize-space()='Duplicate']");

    this.invoiceSelect = page.locator(
      "xpath=(//table[@class='o_list_table table table-sm table-hover position-relative mb-0 o_list_table_ungrouped table-striped'])//tbody/tr[1]/td[2]"
    );

    this.invoiceSelectCheckbox = page.locator(
      "xpath=(//table[@class='o_list_table table table-sm table-hover position-relative mb-0 o_list_table_ungrouped table-striped'])//tbody/tr[1]/td[1]//input[@type='checkbox']"
    );

    this.actionButton = page.locator("xpath=//button[normalize-space()='Actions']");

    this.download = page.locator("xpath=//button[normalize-space()='Download']");

    this.invoicesBtn = page.locator("xpath=//span[normalize-space()='Invoices']");

    // Sales/Confirmed/Invoice amount snapshots (plain Java String fields, not
    // @FindBy locators) - kept as instance state since methods below persist
    // values across the method chain the same way the Java class did.
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

      // orderClickBtn.click();

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
      await this.termsBox.click();
      await this.termsDD_Btn.click();
      await this.contact.fill(cusName);
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

  async clickCustomer_AddProducts() {
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
      return this;
    });
  }

  async clickService_Products() {
    return test.step('Service_Products is clicked successfully', async () => {
      await this.serviceProduct.click();
      await this.serviceProduct_SearchMore.click();

      /* await this.serviceProduct_Select.click({ force: true });
         await this.selectBtn.click(); */

      await this.serviceProductAddBtn.click();
      return this;
    });
  }

  async clickQuantity(qty, cost) {
    return test.step('Quantity  updated successfully', async () => {
      const rows = this.page.locator(
        "xpath=(//table[contains(@class,'o_list_table')])[1]//tr[contains(@class,'o_data_row')]"
      );
      const rowCount = await rows.count();
      console.log('Total rows found: ' + rowCount);

      for (let i = 0; i < rowCount; i++) {
        const rowXpath =
          "(//table[contains(@class,'o_list_table')])[1]" +
          `//tr[contains(@class,'o_data_row')][${i + 1}]`;

        const row = this.page.locator(`xpath=${rowXpath}`);
        await row.waitFor({ state: 'attached', timeout: 30_000 });

        const qtyCell = this.page.locator(`xpath=${rowXpath}//td[@name='product_uom_qty']`);
        await qtyCell.click({ timeout: 30_000 });

        const qtyInput = this.page.locator(`xpath=${rowXpath}//td[@name='product_uom_qty']//input`);
        await qtyInput.waitFor({ state: 'visible', timeout: 30_000 });
        await qtyInput.fill(qty);

        const priceInput = this.page.locator(`xpath=${rowXpath}//td[@name='unit_price']//input`);
        await priceInput.waitFor({ state: 'visible', timeout: 30_000 });
        await priceInput.fill('15.00');
        await priceInput.press('Tab');
      }

      return this;
    });
  }

  async clickQuantityNegative(qty, price) {
    return test.step('Quantity updated successfully', async () => {
      const totalRows = await this.page
        .locator(
          "xpath=//table[@class='o_list_table table table-sm table-hover table-striped o_list_table_ungrouped']//tbody//tr"
        )
        .count();
      console.log('Total number of rows: ' + totalRows);

      const headerLabels = this.page.locator(
        "xpath=//table[@class='o_list_table table table-sm table-hover table-striped o_list_table_ungrouped']//thead//th"
      );
      const headerCount = await headerLabels.count();
      console.log('Header Labels:');
      for (let h = 0; h < headerCount; h++) {
        console.log(await headerLabels.nth(h).innerText());
      }

      for (let row = 1; row <= Math.min(1, totalRows); row++) {
        const productName = this.page.locator(`xpath=.//tr[${row}]//td[3]`);
        await productName.click({ timeout: 30_000 });

        const qtyInput = this.page.locator(`xpath=.//tr[${row}]//td[4]//input`);
        await qtyInput.fill(qty);
        console.log('Quantity set to ' + qty + ' for row ' + row);

        if (row === 1) {
          const uomInput = this.page.locator(
            `xpath=//table[@class='o_list_table table table-sm table-hover table-striped o_list_table_ungrouped']//tbody//tr[${row}]//td[5]//input`
          );
          await uomInput.click({ timeout: 30_000 });

          const uomOption = this.page.locator("xpath=//li[@class='ui-menu-item']//a[contains(text(),'Each')]");
          await uomOption.click({ timeout: 30_000 });
          console.log("UoM 'Case' selected for row " + row);

          const priceInput = this.page.locator(
            `xpath=//table[@class='o_list_table table table-sm table-hover table-striped o_list_table_ungrouped']//tbody//tr[${row}]//td[9]//input`
          );
          await priceInput.fill(price);

          try {
            const errorMsg = this.page.locator("xpath=//div[@class='o_dialog_warning modal-body']//p");
            await errorMsg.waitFor({ state: 'visible', timeout: 30_000 });
            console.log('Validation Error Message: ' + (await errorMsg.innerText()));

            await this.page.locator("xpath=(//button[@type='button']//span[contains(text(),'Ok')])[2]").click();
            console.log('Validation error dismissed successfully for row ' + row);
          } catch (e) {
            console.log('No validation error for row ' + row);
          }

          await this.saveBtn.click();

          try {
            const errorMsg = this.page.locator("xpath=//div[@class='o_dialog_warning modal-body']//p");
            await errorMsg.waitFor({ state: 'visible', timeout: 30_000 });
            console.log('Validation Error Message: ' + (await errorMsg.innerText()));

            await this.page.locator("xpath=(//button[@type='button']//span[contains(text(),'Ok')])[2]").click();
            console.log('Validation error dismissed successfully for row ' + row);
          } catch (e) {
            console.log('No validation error for row ' + row);
          }
        } else if (row === 2) {
          console.log('Only quantity updated for row ' + row);
        }
      }

      return this;
    });
  }

  async clickCustomer_Address() {
    return test.step('CustomerOrder_Address is clicked successfully', async () => {
      await this.clickAddress.click();
      await this.addClick.hover();
      await this.addClick.click();
      await this.deliveryAddress.click();
      await this.addClick1.hover();
      await this.addClick1.click();
      await this.billingAddress.click();
      await this.otherInfo.click();
      return this;
    });
  }

  async clickCustomer_OtherInfo() {
    return test.step('other_info is clicked successfully', async () => {
      await this.location.click();
      await this.locationSelect.click();
      await this.route.click();
      await this.routeSelect.click();
      await this.dropOff.click();
      await this.dropoffSelect.click();
      return this;
    });
  }

  // "Add Associated Products" (enabled in clickCustomer_Products) pulls in
  // extra non-service products at $0, which fails Confirm with "Please set
  // price for non-service products." This is a custom "Averigo Error" dialog
  // (class "modal d-block o_technical_modal"), not Odoo's usual o_dialog -
  // match on the message text itself instead of guessing the wrapper class.
  // It doesn't necessarily show right after Confirm - it can surface however
  // long the server takes to add those products - so this is called again,
  // with a longer wait, right before the next click that it would otherwise
  // block (see clickCheckBox()).
  async #fixZeroPricedAssociatedProducts(timeout) {
    const zeroPriceError = this.page.locator(
      "xpath=//p[contains(text(),'set price for non-service products')]"
    );
    const hasZeroPriceError = await zeroPriceError
      .waitFor({ state: 'visible', timeout })
      .then(() => true)
      .catch(() => false);

    if (!hasZeroPriceError) return false;

    await this.page.locator("xpath=//button[normalize-space()='Close']").click();
    // Closing the dialog can leave the order lines table mid re-render (the
    // associated products just got added), so give it a moment to settle
    // before locating rows - otherwise a row click can land on the wrong
    // element (e.g. a column header) instead of the actual price cell.
    await this.page.waitForTimeout(2000);

    const rows = this.page.locator(
      "xpath=(//table[contains(@class,'o_list_table')])[1]//tr[contains(@class,'o_data_row')]"
    );
    const rowCount = await rows.count();

    for (let i = 0; i < rowCount; i++) {
      const rowXpath =
        "(//table[contains(@class,'o_list_table')])[1]" + `//tr[contains(@class,'o_data_row')][${i + 1}]`;

      const priceCell = this.page.locator(`xpath=${rowXpath}//td[@name='unit_price']`);
      await priceCell.click();
      const priceInput = this.page.locator(`xpath=${rowXpath}//td[@name='unit_price']//input`);
      await priceInput.fill('15.00');
      await priceInput.press('Tab');
    }

    await this.confirmBtn.click();
    return true;
  }

  async clickSavebtn() {
    return test.step('Save button is clicked successfully', async () => {
      await this.salesOrderSaveBtn.click();

      // Associated products get added asynchronously, so the zero-price error
      // may not exist yet right after Confirm. Clicking into Order Lines
      // forces a re-render that reveals it if it's there (mirrors the
      // successful fix in SalesOrderPage.js, where visiting Order Lines is
      // what surfaced the same error before a later click would otherwise be
      // silently blocked by it) - fixing it here, before ever navigating to
      // Delivery, avoids having to repeat the fix from that unrelated page
      // (whose first o_list_table isn't the order lines table at all).
      await this.orderLines.click();
      await this.#fixZeroPricedAssociatedProducts(45_000);
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

  async clickGetTheTableDataforLabelNameChecking() {
    return test.step('Sales Order No is clicked successfully', async () => {
      const headerLabels = this.page.locator(
        "xpath=//table[@class='o_list_table table table-sm table-hover table-striped o_list_table_ungrouped']//thead//th"
      );
      const headerCount = await headerLabels.count();
      console.log('Table Headers:');
      const headers = [];
      let headerLine = '';
      for (let h = 0; h < headerCount; h++) {
        const headerText = await headerLabels.nth(h).innerText();
        headers.push(headerText);
        headerLine += headerText + '\t';
      }
      console.log(headerLine);
      console.log('\n----------------------------------------------');

      const rows = this.page.locator(
        "xpath=//table[@class='o_list_table table table-sm table-hover table-striped o_list_table_ungrouped']//tbody//tr"
      );
      const rowCount = await rows.count();

      for (let rowIndex = 1; rowIndex <= rowCount; rowIndex++) {
        const cells = this.page.locator(
          `xpath=//table[@class='o_list_table table table-sm table-hover table-striped o_list_table_ungrouped']//tbody//tr[${rowIndex}]//td`
        );
        const cellCount = await cells.count();
        let line = `Row ${rowIndex}: `;
        for (let colIndex = 0; colIndex < cellCount; colIndex++) {
          const cellText = await cells.nth(colIndex).innerText();
          line += `${headers[colIndex]}: ${cellText}\t`;
        }
        console.log(line);
      }

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

  async clickCheckBox(qty1) {
    return test.step('Check Box is clicked successfully', async () => {
      await this.selectPickList.click({ force: true });
      await this.clickPackingSlip.click();
      await this.selectAllPackingSlip.click({ force: true });

      const sourceDocument = this.page.locator(
        "xpath=(//table[@class='o_list_table table table-sm table-hover position-relative mb-0 o_list_table_ungrouped table-striped'])[4]//tbody//tr[1]//td[1]"
      );
      await sourceDocument.scrollIntoViewIfNeeded();
      await sourceDocument.click({ timeout: 30_000 });

      const pickingQuantityInput = this.page.locator(
        "xpath=(//table[@class='o_list_table table table-sm table-hover position-relative mb-0 o_list_table_ungrouped table-striped'])[4]//tbody//tr[1]//td[5]//input"
      );
      await pickingQuantityInput.waitFor({ state: 'visible', timeout: 30_000 });
      await pickingQuantityInput.fill(qty1);

      await this.clickConfirmPackingSlip.click();
      await this.clickOkbtn.click();
      await this.checkbox.click({ force: true });
      await this.contBtn.click();

      // await this.closeBtn.click();

      // print_packing_slip.click();

      return this;
    });
  }

  async clickNegativeCheckBox() {
    return test.step('Negative Check Box is clicked successfully', async () => {
      await this.selectPickList.click({ force: true });
      await this.clickPackingSlip.click();
      await this.selectAllPackingSlip.click({ force: true });

      const rowsLocator = this.page.locator(
        "xpath=(//table[@class='o_list_table table table-sm table-hover table-striped o_list_table_ungrouped'])[4]//tbody//tr"
      );
      const totalRows = await rowsLocator.count();
      console.log('Total number of rows: ' + totalRows);

      for (let row = 1; row <= Math.min(1, totalRows); row++) {
        const sourceDocument = this.page.locator(
          `xpath=(//table[@class='o_list_table table table-sm table-hover table-striped o_list_table_ungrouped'])[4]//tbody//tr[${row}]//td[1]`
        );
        await sourceDocument.scrollIntoViewIfNeeded();
        await sourceDocument.click({ timeout: 30_000 });

        const pickingQuantityInput = this.page.locator(
          `xpath=(//table[@class='o_list_table table table-sm table-hover table-striped o_list_table_ungrouped'])[4]//tbody//tr[${row}]//td[5]//input`
        );
        await pickingQuantityInput.waitFor({ state: 'visible', timeout: 30_000 });
        await pickingQuantityInput.fill('0');

        try {
          const validationMessage = this.page.locator("xpath=//div[@class='o_dialog_warning modal-body']//p");
          await validationMessage.waitFor({ state: 'visible', timeout: 30_000 });
          console.log('Validation Message: ' + (await validationMessage.innerText()));

          const validationOkBtn = this.page.locator("xpath=//button[@class='btn btn-primary']//span[text()='Ok']");
          await validationOkBtn.click({ timeout: 30_000 });
        } catch (e) {
          console.log('No validation message displayed.');
        }

        const confirmPackingSlip = this.page.locator(
          "xpath=//div[@class='o_statusbar_buttons']//button[@name='confirm_pack_slip']"
        );
        await confirmPackingSlip.click();

        const confirmOkBtn = this.page.locator("xpath=(//span[normalize-space()='Ok'])[1]");
        await confirmOkBtn.click({ timeout: 30_000 });
      }

      return this;
    });
  }

  async clickBackOrder(quantity1) {
    return test.step('Backorder button is clicked successfully', async () => {
      await this.delivery.click();
      await this.backOrder.click();
      // Select the first order's row checkbox rather than clicking the cell text.
      await this.orderSelect.click();

      // await this.editBtn.click();

     /* await this.updateQuan.click();

      await this.quantity.fill(quantity1);

      await this.saveAndClose.click();*/

      // await this.save.click();

      return this;
    });
  }

  async clickBackOrderNegative(quantity1) {
    return test.step('Backorder button is clicked successfully', async () => {
      await this.delivery.click();
      await this.backOrder.click();
      await this.orderSelect.click();

      // await this.editBtn.click();

      await this.updateQuan.click();
      await this.quantity.fill(quantity1);
      await this.saveAndClose.click();

      try {
        const errorMsg = this.page.locator("xpath=//div[@class='o_dialog']//p");
        await errorMsg.waitFor({ state: 'visible', timeout: 30_000 });
        console.log('Validation Error Message: ' + (await errorMsg.innerText()));

        await this.page.locator("xpath=//button[normalize-space()='Close']").click();
        console.log('Validation error dismissed successfully for row ');
      } catch (e) {
        console.log('No validation error for row ');
      }

      await this.save.click();
      return this;
    });
  }

  async clickBackOrder_updatePro(quan1) {
    return test.step('BackOrderDuplicate button is clicked successfully', async () => {
      await this.action.click();
      await this.duplicate.click();
      await this.addLine.click();
      await this.salePick.click();
      await this.orderSearchMore.click();
      await this.ordSelect.click();
      await this.saleLine.click();
      await this.proSelect.click();
      await this.quantity1.fill(quan1);
      await this.saveAndClose1.click();
      await this.save.click();
      return this;
    });
  }

  async clickDelivery_Backorder() {
    return test.step('Delivery Menu is clicked successfully', async () => {
      await this.deliveryMenu1.click({ timeout: 30_000 });
      await this.clickPickListBtn1.click();
      return this;
    });
  }

  async clickCheckBox_Backorder() {
    return test.step('BackOrder_Check Box is clicked successfully', async () => {
      await this.selectPickList1.click({ force: true });
      await this.clickPackingSlip1.click();
      await this.selectAllPackingSlip1.click({ force: true });
      await this.clickConfirmPackingSlip1.click();
      //await this.clickOkbtn1.click();

      // await this.closeBtn1.click();

      // print_packing_slip.click();

      return this;
    });
  }

  async clickDeliveryCheckBox() {
    return test.step('Delivery Check Box is clicked successfully', async () => {
      await this.selectAllDeliveryBox.click({ force: true });
      await this.clickDeliveryBtn.click();

      // await this.deliveryADDaLine.click();

      // await this.orderNoBox.click();
      // await this.orderNoSelect.click();

      // await this.productBox.click();
      // await this.productSelect.click();

      // await this.productQty.fill(qty1);

      // await this.productUoM.click();

      // await this.productUoMSelect.click();

      await this.confirmDeliveryBtn.click();
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

  async clickActionMenu() {
    return test.step('Action Menu is clicked successfully', async () => {
      await this.actionBtn.click();
      await this.printBtn.click();
      await this.selectQuotation.click();

      // await this.selectInvoice.click();

      return this;
    });
  }

  async clickInvoiceBtn() {
    return test.step('Invoice Btn is clicked successfully', async () => {
      await this.invoiceBtn.click({ timeout: 30_000 });

      // The order's own Order Lines table shares the same generic
      // o_list_table classes as the invoice list this navigates to, so
      // counting rows immediately after click() can still see the old page -
      // wait for the actual navigation (URL gains an /invoice segment) before
      // counting, not just for "a" matching table to be visible.
      await this.page.waitForURL(/\/invoice(\/|\?|$)/, { timeout: 30_000 });

      // The two deliveries (partial + backorder) each generate their own
      // invoice, so this smart button lands on a 2-row list rather than a
      // single invoice - confirm both actually got created.
      const invoiceRows = this.page.locator(
        "xpath=(//table[@class='o_list_table table table-sm table-hover position-relative mb-0 o_list_table_ungrouped table-striped'])//tbody//tr[contains(@class,'o_data_row')]"
      );
      await invoiceRows.first().waitFor({ state: 'visible', timeout: 30_000 });
      const invoiceCount = await invoiceRows.count();
      console.log('Invoices created: ' + invoiceCount);
      expect(invoiceCount).toBe(2);

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

  async clickInvoicePrint() {
    return test.step('Invoice No is clicked successfully', async () => {
      // Select the invoice's row checkbox rather than clicking the cell text -
      // that's what puts the row into a selected state and makes the
      // contextual "Action" menu (with Download) available, instead of
      // whatever unrelated "Action" button happens to be on the page.
      await this.invoiceSelectCheckbox.check({ force: true });
      //await this.actionButton.click();
      await this.download.click();
      await this.invoicesBtn.click();
      return this;
    });
  }
}

module.exports = { BackOrderPage };
