const { test } = require('@playwright/test');
const { ensureLoggedIn } = require('../utils/loginHelper');

// The S&H/Insurance/Discount fields stay as editable monetary widgets even after
// save, which (unlike the read-only subtotal/tax/total divs) render a duplicate
// currency symbol (e.g. "$ 0.00 $"). Extracting just the "$ 0.00" portion keeps
// the sales-order and invoice sides comparable regardless of which one has it.
function extractMonetaryValue(text) {
  const match = text.match(/\$\s*[\d,]+\.\d{2}/);
  return match ? match[0].replace(/\s+/g, ' ').trim() : text.replace(/\s+/g, ' ').trim();
}

// Ported from src/main/java/pages/SalesOrderPage.java.
// Selenium's @FindBy xpaths are preserved verbatim as Playwright locators.
// PageFactory/@CacheLookup have no equivalent needed: Playwright locators
// re-query the DOM on every action, so there's no stale-element risk to guard against
// (the Java class's StaleElementReferenceException retry in clickNegativeCheckBox is
// dropped for the same reason).
class SalesOrderPage {
  constructor(page) {
    this.page = page;

    // Cross-method state the Java class kept as private instance fields.
    this.salesOrderNo = null;
    this.salesOrderSubTotal = null;
    this.salesOrderTaxAmt = null;
    this.salesOrderContainerDepositAmt = null;
    this.salesOrderShippingHandlingAmt = null;
    this.salesOrderInsuranceAmt = null;
    this.salesOrderDiscountAmt = null;
    this.salesOrderTotal = null;

    this.invoiceSubTotalValue = null;
    this.invoiceTaxAmtValue = null;
    this.invoiceContainerDepositAmtValue = null;
    this.invoiceShippingHandlingAmtValue = null;
    this.invoiceInsuranceAmtValue = null;
    this.invoiceDiscountAmtValue = null;
    this.invoiceTotalValue = null;
    this.invoiceAmountDueValue = null;

    this.confirmedSalesOrderSubTotal = null;
    this.confirmedSalesOrderTaxAmt = null;
    this.confirmedSalesOrderContainerDepositAmt = null;
    this.confirmedSalesOrderTotal = null;

    this.userName = page.locator("xpath=//input[@id='login']");
    this.passWord = page.locator("xpath=//input[@id='password']");
    this.logIn = page.locator("xpath=//button[@type='submit']");

    this.menu = page.locator("xpath=//ul[@class='o_menu_apps']//i[@class='fa fa-bars']");

    this.customerCareMenuBtn = page.locator("xpath=//div[contains(text(),'Customer Care')]");

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

    this.termsBox = page.locator("xpath=//input[@id='payment_term_id_0']");

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

    this.serviceProduct = page.locator("xpath=(//div[@class='o-autocomplete dropdown']//input[@type='text'])[5]");

    this.serviceProduct_SearchMore = page.locator(
      "xpath=(//a[normalize-space()='[AVR00516] Changer Fund'])[1]"
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

    // //li[@class='nav-item product_lis']//a[contains(text(),'Order Lines')]
    this.orderLines = page.locator("xpath=//a[normalize-space()='Order Lines']");

    this.location = page.locator("xpath=//input[@id='warehouse_id_0']");

    this.locationSelect = page.locator("xpath=(//a[normalize-space()='UltraServ Equipment Warehouse'])[1]");

    this.route = page.locator("xpath=//input[@id='route_id_0']");

    this.routeSelect = page.locator("xpath=(//a[normalize-space()='100'])[1]");

    this.dropOff = page.locator("xpath=//input[@id='drop_location_id_0']");

    this.dropoffSelect = page.locator("xpath=(//a[normalize-space()='Warehouse'])[1]");

    // save btn
    this.salesOrderSaveBtn = page.locator("xpath=//button[contains(text(),'Save')]");

    this.confirmBtn = page.locator("xpath=//span[normalize-space()='Confirm']");

    this.subTotal = page.locator("xpath=//div[@name='amount_untaxed']");

    this.taxAmt = page.locator("xpath=//div[@name='tax_amount_view']");

    this.containerDepositAmt = page.locator("xpath=//div[@name='container_deposit_view']");

    this.shippingHandlingAmt = page.locator("xpath=//div[@name='shipping_handling']");

    this.insuranceAmt = page.locator("xpath=//div[@name='insurance']");

    this.discountAmt = page.locator("xpath=//div[@name='total_discount_view']");

    this.total = page.locator("xpath=//div[@name='amount_total']");

    this.salesOrderNum = page.locator("xpath=//div[@name='name']");

    this.advPayment = page.locator("xpath=//span[normalize-space()='Advance Payment']");

    this.modeOfPay = page.locator("xpath=//select[@id='payment_mode_id_0']");

    this.checkNum = page.locator("xpath=//input[@id='check_no_0']");

    this.custName = page.locator("xpath=//input[@id='partner_bank_name_0']");

    this.amt = page.locator("xpath=//input[@id='amount_1']");

    this.note = page.locator("xpath=//textarea[@id='notes_0']");

    this.internalNote = page.locator("xpath=//textarea[@id='internal_notes_0']");

    this.saveButton = page.locator("xpath=//span[normalize-space()='Save']");

    // save btn
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

    this.actionBtn = page.locator("xpath=(//button[normalize-space()='Action'])[1]");

    this.printBtn = page.locator("xpath=//button[normalize-space()='Print']");

    this.selectQuotation = page.locator("xpath=//span[normalize-space()='Quotation / Order']");

    this.selectInvoice = page.locator("xpath=//a[contains(text(),'Invoice')]");

    this.invoiceBtn = page.locator("xpath=//button[@name='action_view_invoice']");

    this.invoiceSubTotal = page.locator("xpath=//div[@name='amount_untaxed']");

    this.invoiceTaxAmt = page.locator("xpath=//div[@name='tax_amount_view']");

    this.invoiceContainerDepositAmt = page.locator("xpath=//div[@name='total_container_deposit']");

    this.invoiceShippingHandlingAmt = page.locator("xpath=//div[@name='shipping_handling']");

    this.invoiceInsuranceAmt = page.locator("xpath=//div[@name='insurance']");

    this.invoiceDiscountAmt = page.locator("xpath=//div[@name='total_discount_view']");

    this.invoiceTotal = page.locator("xpath=//div[@name='amount_total_view']");

    this.invoiceAmountDue = page.locator("xpath=//div[@name='amount_residual']");

    this.invoiceNo = page.locator("xpath=(//div[@name='name'])[1]");

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
  }

  // Java: extractText(WebElement) — tries visible text, then raw textContent,
  // then the "value" attribute, in that order, returning the first non-blank hit.
  async #extractText(locator) {
    const text = ((await locator.innerText()) || '').trim();
    if (text) return text;

    const textContent = ((await locator.evaluate((node) => node.textContent)) || '').trim();
    if (textContent) return textContent;

    const value = ((await locator.inputValue().catch(() => '')) || '').trim();
    if (value) return value;

    return null;
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
      await this.customerCareMenuBtn.click({ timeout: 30_000 });
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
      await this.termsBox.click();
      await this.termsDD_Btn.waitFor({ state: 'attached', timeout: 30_000 });
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
      await this.product.pressSequentially('Emery Boards', { delay: 100 });

      // Let the catalog finish loading every matching suggestion before picking one.
      await this.page.waitForTimeout(5_000);

      const menuXpath = "//ul[contains(@class,'ui-autocomplete') and not(contains(@style,'none'))]";
      await this.page.locator('xpath=' + menuXpath).waitFor({ state: 'visible', timeout: 60_000 });

      const productOption = this.page.locator(
        "xpath=" + menuXpath + "//li[contains(., 'Emery Boards')]"
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
      await this.serviceProduct_SearchMore.click({ force: true });
      await this.serviceProductAddBtn.click();
      return this;
    });
  }

  async clickQuantity(qty, price) {
    return test.step('Quantity  updated successfully', async () => {
      const rows = this.page.locator(
        "xpath=(//table[contains(@class,'o_list_table')])[1]//tr[contains(@class,'o_data_row')]"
      );
      const rowCount = await rows.count();
      console.log('Total rows found: ' + rowCount);

      for (let i = 0; i < rowCount; i++) {
        const rowXpath =
          "(//table[contains(@class,'o_list_table')])[1]" + `//tr[contains(@class,'o_data_row')][${i + 1}]`;

        const qtyCell = this.page.locator(`xpath=${rowXpath}//td[@name='product_uom_qty']`);
        await qtyCell.click();

        const qtyInput = this.page.locator(`xpath=${rowXpath}//td[@name='product_uom_qty']//input`);
        await qtyInput.fill(qty);

        const priceInput = this.page.locator(`xpath=${rowXpath}//td[@name='unit_price']//input`);
        await priceInput.fill('15.00');
        await priceInput.press('Tab');
      }
      return this;
    });
  }

  async clickQuantityNegative(qty, price) {
    return test.step('Quantity  updated successfully', async () => {
      const totalRows = await this.page
        .locator(
          "xpath=//table[@class='o_list_table table table-sm table-hover position-relative mb-0 o_list_table_ungrouped table-striped']//tbody//tr"
        )
        .count();
      console.log('Total number of rows: ' + totalRows);

      for (let row = 1; row <= 2; row++) {
        const rowXpath =
          "(//table[contains(@class,'o_list_table')])[1]/tbody/tr[contains(@class,'o_data_row')]" + `[${row}]`;

        const rowElement = this.page.locator(`xpath=${rowXpath}`);
        await rowElement.click();

        const uomInput = this.page.locator(`xpath=${rowXpath}//td[@name='product_uom']//input`);
        await uomInput.click();

        const menuXpath = "//ul[contains(@class,'ui-autocomplete') and not(contains(@style,'none'))]";
        const optionXpath = menuXpath + '//li[1]//a';

        const dropdownMenu = this.page.locator(`xpath=${menuXpath}`);
        await dropdownMenu.waitFor({ state: 'visible', timeout: 30_000 });

        const firstOption = this.page.locator(`xpath=${optionXpath}`);
        await firstOption.hover();
        await firstOption.click();

        await dropdownMenu.waitFor({ state: 'hidden', timeout: 30_000 });

        const qtyInput = this.page.locator(`xpath=${rowXpath}//td[@name='product_uom_qty']//input`);
        await qtyInput.fill(qty);

        const priceInput = this.page.locator(`xpath=${rowXpath}//td[@name='unit_price']//input`);
        try {
          const errorMsg = this.page.locator("xpath=//div[@class='o_dialog']//p");
          await errorMsg.waitFor({ state: 'visible', timeout: 30_000 });
          console.log('Validation Error Message: ' + (await errorMsg.innerText()));
          await this.page.locator("xpath=//button[normalize-space()='Close']").click();
          console.log('Validation error dismissed successfully for row ' + row);
        } catch (e) {
          console.log('No validation error for row ' + row);
        }
        await priceInput.fill(price);

        const weight = this.page.locator(`xpath=${rowXpath}//td[@name='weight']//input`);
        await weight.click();
        try {
          const errorMsg2 = this.page.locator("xpath=//div[@class='o_dialog']//p");
          await errorMsg2.waitFor({ state: 'visible', timeout: 30_000 });
          console.log('Validation Error Message: ' + (await errorMsg2.innerText()));
          await this.page.locator("xpath=//button[normalize-space()='Close']").click();
          console.log('Validation error dismissed successfully for row ' + row);
        } catch (e) {
          console.log('No validation error for row ' + row);
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
    return test.step('CustomerOrder_Address is clicked successfully', async () => {
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
  // block.
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

    // Re-count fresh: however many associated products just got pulled in,
    // the row count now reflects all of them, not just the ones added
    // earlier by clickCustomer_AddProducts()/clickService_Products().
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
      await this.confirmBtn.click();
      await this.#fixZeroPricedAssociatedProducts(15_000);
      return this;
    });
  }

  async clickGetTheSaleOrderAmount() {
    return test.step('Get the Sales Order Amount is clicked successfully', async () => {
      await this.orderLines.click();

      this.salesOrderSubTotal = await this.subTotal.innerText();
      console.log('Sales Order : SubTotal :' + this.salesOrderSubTotal);

      this.salesOrderTaxAmt = await this.taxAmt.innerText();
      console.log('Sales Order : Tax Amount :' + this.salesOrderTaxAmt);

      this.salesOrderContainerDepositAmt = await this.containerDepositAmt.innerText();
      console.log('Sales Order : Container Deposit Amount :' + this.salesOrderContainerDepositAmt);

      this.salesOrderShippingHandlingAmt = extractMonetaryValue(await this.shippingHandlingAmt.innerText());
      console.log('Sales Order : S&H Amount :' + this.salesOrderShippingHandlingAmt);

      this.salesOrderInsuranceAmt = extractMonetaryValue(await this.insuranceAmt.innerText());
      console.log('Sales Order : Insurance Amount :' + this.salesOrderInsuranceAmt);

      this.salesOrderDiscountAmt = extractMonetaryValue(await this.discountAmt.innerText());
      console.log('Sales Order : Discount Amount :' + this.salesOrderDiscountAmt);

      this.salesOrderTotal = await this.total.innerText();
      console.log('Sales Order : Total : ' + this.salesOrderTotal);

      console.log('----------------------------------------------');
      return this;
    });
  }

  async clickSalesOrderNo() {
    return test.step('Sales Order No is clicked successfully', async () => {
      // The zero-price/associated-products error from clickSavebtn() can take
      // longer than that method's own wait to surface - catch it here too,
      // right before the click it would otherwise block, with more headroom.
      await this.#fixZeroPricedAssociatedProducts(45_000);

      await this.salesOrderNum.waitFor({ state: 'visible', timeout: 15_000 });
      this.salesOrderNo = await this.#extractText(this.salesOrderNum);
      await this.salesOrderNum.click({ timeout: 15_000 });
      console.log('Saler Order Number : ' + this.salesOrderNo);
      return this;
    });
  }

  async clickGetTheTableDataforLabelNameChecking() {
    return test.step('Sales Order No is clicked successfully', async () => {
      const tableXpath =
        "xpath=//table[@class='o_list_table table table-sm table-hover table-striped o_list_table_ungrouped']";

      const headerLabels = this.page.locator(`${tableXpath}//thead//th`);
      const headerCount = await headerLabels.count();

      console.log('Table Headers:');
      const headers = [];
      let headerLine = '';
      for (let i = 0; i < headerCount; i++) {
        const headerText = await headerLabels.nth(i).innerText();
        headers.push(headerText);
        headerLine += headerText + '\t';
      }
      console.log(headerLine);
      console.log('----------------------------------------------');

      const rows = this.page.locator(`${tableXpath}//tbody//tr`);
      const rowCount = await rows.count();

      for (let rowIndex = 1; rowIndex <= rowCount; rowIndex++) {
        const cells = this.page.locator(`${tableXpath}//tbody//tr[${rowIndex}]//td`);
        const cellCount = await cells.count();
        let rowLine = `Row ${rowIndex}: `;
        for (let colIndex = 0; colIndex < cellCount; colIndex++) {
          const cellText = await cells.nth(colIndex).innerText();
          rowLine += `${headers[colIndex]}: ${cellText}\t`;
        }
        console.log(rowLine);
      }
      return this;
    });
  }

  async clickAdvancePayment(checkno, amount) {
    return test.step('Advance Payment is clicked successfully', async () => {
      await this.advPayment.click();
      await this.modeOfPay.click();
      await this.modeOfPay.selectOption({ label: 'Check' });
      await this.checkNum.fill(checkno);
      await this.custName.fill('komala');
      await this.amt.fill(amount);
      await this.note.fill('notes');
      await this.internalNote.fill('internal notes');
      await this.saveButton.click();
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
     // await this.clickOkbtn.click();
      return this;
    });
  }

  async clickNegativeCheckBox() {
    return test.step('Negative Check Box is clicked successfully', async () => {
      await this.selectPickList.click({ force: true });
      await this.clickPackingSlip.click();
      await this.selectAllPackingSlip.click({ force: true });

      const tableXpath = "(//table[@class='o_list_table table table-sm table-hover table-striped o_list_table_ungrouped'])[4]";
      const totalRows = await this.page.locator(`xpath=${tableXpath}//tbody//tr`).count();
      console.log('Total number of rows: ' + totalRows);

      for (let row = 1; row <= Math.min(1, totalRows); row++) {
        const sourceDocument = this.page.locator(`xpath=${tableXpath}//tbody//tr[${row}]//td[1]`);
        await sourceDocument.click({ timeout: 30_000 });

        const pickingQuantityInput = this.page.locator(`xpath=${tableXpath}//tbody//tr[${row}]//td[5]//input`);
        await pickingQuantityInput.fill('0', { timeout: 30_000 });

        try {
          const validationMessage = this.page.locator("xpath=//div[@class='o_dialog_warning modal-body']//p");
          await validationMessage.waitFor({ state: 'visible', timeout: 30_000 });
          console.log('Validation Message: ' + (await validationMessage.innerText()));

          const okBtn = this.page.locator("xpath=//button[@class='btn btn-primary']//span[text()='Ok']");
          await okBtn.click({ timeout: 30_000 });
        } catch (e) {
          console.log('No validation message displayed.');
        }

        const confirmPackingSlip = this.page.locator(
          "xpath=//div[@class='o_statusbar_buttons']//button[@name='confirm_pack_slip']"
        );
        await confirmPackingSlip.click();
        await this.page.waitForTimeout(5_000);
        const okBtn2 = this.page.locator("xpath=(//span[normalize-space()='Ok'])[1]");
        //await okBtn2.click({ timeout: 30_000 });
      }
      return this;
    });
  }

  async clickDeliveryCheckBox(qty1) {
    return test.step('Delivery Check Box is clicked successfully', async () => {
      await this.selectAllDeliveryBox.click({ force: true });
      await this.clickDeliveryBtn.click();
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
      await this.orderSearch.fill(this.salesOrderNo);
      await this.orderSearch.press('Enter');
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

      this.invoiceShippingHandlingAmtValue = extractMonetaryValue(await this.invoiceShippingHandlingAmt.innerText());
      console.log('Invoice : S&H Amount :' + this.invoiceShippingHandlingAmtValue);

      this.invoiceInsuranceAmtValue = extractMonetaryValue(await this.invoiceInsuranceAmt.innerText());
      console.log('Invoice : Insurance Amount :' + this.invoiceInsuranceAmtValue);

      // Odoo hides the discount line on the invoice's totals table when the
      // discount is zero, unlike S&H/Insurance which always render, so treat a
      // missing row as "$ 0.00" instead of failing the whole comparison.
      if (await this.invoiceDiscountAmt.count()) {
        this.invoiceDiscountAmtValue = extractMonetaryValue(await this.invoiceDiscountAmt.innerText());
      } else {
        this.invoiceDiscountAmtValue = '$ 0.00';
      }
      console.log('Invoice : Discount Amount :' + this.invoiceDiscountAmtValue);

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

  // Java: no try/catch/reportStep wrapper on this method — it just logs
  // comparisons, so no test.step wrapper is added here either.
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

    if (this.salesOrderShippingHandlingAmt === this.invoiceShippingHandlingAmtValue) {
      console.log('S&H Amount matches: ' + this.salesOrderShippingHandlingAmt);
    } else {
      console.log(
        'S&H Amount does not match! Sales Order: ' +
          this.salesOrderShippingHandlingAmt +
          ', Invoice: ' +
          this.invoiceShippingHandlingAmtValue
      );
    }

    if (this.salesOrderInsuranceAmt === this.invoiceInsuranceAmtValue) {
      console.log('Insurance Amount matches: ' + this.salesOrderInsuranceAmt);
    } else {
      console.log(
        'Insurance Amount does not match! Sales Order: ' +
          this.salesOrderInsuranceAmt +
          ', Invoice: ' +
          this.invoiceInsuranceAmtValue
      );
    }

    if (this.salesOrderDiscountAmt === this.invoiceDiscountAmtValue) {
      console.log('Discount Amount matches: ' + this.salesOrderDiscountAmt);
    } else {
      console.log(
        'Discount Amount does not match! Sales Order: ' +
          this.salesOrderDiscountAmt +
          ', Invoice: ' +
          this.invoiceDiscountAmtValue
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
}

module.exports = { SalesOrderPage };
