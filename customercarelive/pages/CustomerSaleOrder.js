const { test } = require('@playwright/test');
const { ensureLoggedIn } = require('../utils/loginHelper');

// Ported from src/main/java/pages/CustomerSaleOrder.java.
// Selenium's @FindBy xpaths are preserved verbatim as Playwright locators.
// PageFactory/@CacheLookup have no equivalent needed: Playwright locators
// re-query the DOM on every action, so there's no stale-element risk to guard against.
class CustomerSaleOrder {
  constructor(page) {
    this.page = page;

    this.userName = page.locator("xpath=//input[@id='login']");
    this.passWord = page.locator("xpath=//input[@id='password']");
    this.logIn = page.locator("xpath=//button[@type='submit']");

    this.menu = page.locator("xpath=//ul[@class='o_menu_apps']//i[@class='fa fa-bars']");

    this.customerCareMenuBtn = page.locator("xpath=//div[contains(text(),'Customer Care')]");

    this.searchBox = page.locator(
      "xpath=//div[@class='o_searchview_input_container d-flex flex-grow-1 flex-wrap gap-1 mw-100']//input[@type='text']"
    );

    this.customerRows = page.locator(
      "xpath=//table[@class='o_list_table table table-sm table-hover position-relative mb-0 o_list_table_ungrouped table-striped']//tbody//tr"
    );

    this.moreMenubtn = page.locator("xpath=//span[normalize-space()='More']");

    this.salesMenubtn = page.locator("xpath=//span[normalize-space()='Sale Orders']");

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

    this.poNo = page.locator("xpath=//input[@id='po_no_0']");

    this.dropShipping = page.locator("xpath=//input[@id='drop_ship_0']");

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
      "xpath=//a[@id='service_product_ids_0_0_0']"
    );

    this.serviceProduct_Select = page.locator("xpath=//table//tbody//tr[1]//td[1]//div//input[@type='checkbox']");

    this.selectBtn = page.locator("xpath=//button[@type='button']//span[contains(text(),'Select')]");

    this.serviceProductAddBtn = page.locator("xpath=(//button[@class='btn btn-primary'][normalize-space()='Add'])[2]");

    this.clickAddress = page.locator("xpath=//a[normalize-space()='Address']");

    this.otherInfo = page.locator("xpath=//a[normalize-space()='Other Info']");

    this.addClick = page.locator("xpath=//input[@id='partner_invoice_id_0']");

    this.deliveryAddress = page.locator("xpath=(//a[normalize-space()='gkomala, sri'])");

    this.addClick1 = page.locator("xpath=//input[@id='partner_shipping_id_0']");

    this.billingAddress = page.locator("xpath=(//a[normalize-space()='gkomala, sri'])");

    // li[@class='nav-item product_lis']//a[contains(text(),'Order Lines')]
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

    this.total = page.locator("xpath=//div[@name='amount_total']");

    this.salesOrderNum = page.locator("xpath=//div[@name='name']");

    this.advPayment = page.locator("xpath=//span[normalize-space()='Advance Payment']");

    this.checkNum = page.locator("xpath=//input[@id='check_no_0']");

    this.custName = page.locator("xpath=//input[@id='partner_bank_name_0']");

    this.amt = page.locator("xpath=//input[@id='amount_1']");

    this.shipVia = page.locator("xpath=//input[@id='ship_via_0']");

    this.shipSelect = page.locator("xpath=//a[@id='ship_via_0_0_0']");

    this.holdReason = page.locator("xpath=//input[@id='hold_reason_0']");

    this.reasonSelect = page.locator("xpath=//a[@id='hold_reason_0_0_0']");

    this.closedReason = page.locator("xpath=//input[@id='closed_reason_0']");

    this.closedSelect = page.locator("xpath=//a[@id='closed_reason_0_0_0']");

    this.note = page.locator("xpath=//textarea[@id='notes_0']");

    this.internalNote = page.locator("xpath=//textarea[@id='internal_notes_0']");

    this.saveButton = page.locator("xpath=//span[normalize-space()='Save']");

    this.cancel = page.locator("xpath=//span[normalize-space()='Cancel']");

    this.ordersMenuBtn = page.locator("xpath=(//a[normalize-space()='Orders'])[1]");

    this.orderSelect = page.locator(
      "xpath=(//table[@class='o_list_table table table-sm table-hover position-relative mb-0 o_list_table_ungrouped table-striped']//tbody//tr[1]//td[1])"
    );

    this.actionBtn = page.locator("xpath=//span[normalize-space()='Actions']");

    this.deleteBtn = page.locator("xpath=//span[normalize-space()='Delete']");

    this.confirmDeleteBtn = page.locator("xpath=//button[normalize-space()='Delete']");

    this.okBtn = page.locator("xpath=//button[normalize-space()='Ok']");

    this.shipping_handling = page.locator("xpath=//div[@name='shipping_handling']//input[@type='text']");

    this.tax_amount_view = page.locator("xpath=//div[@name='tax_amount_view']");

    this.insurance = page.locator("xpath=//div[@name='insurance']//input[@type='text']");

    this.total_discount_view = page.locator("xpath=//div[@name='total_discount_view']//input[@type='text']");

    // Instance state populated by clickSalesOrderNo()/clickGetTheSaleOrderAmount(), mirroring
    // the private String fields Java declared on the class. invoice*/confirmed* were declared
    // in Java but never read or written by any method in this class; kept here for parity.
    this.salesOrderNo = null;
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

  // Java: getText() -> textContent attribute -> value attribute, first non-blank wins.
  async #extractText(el) {
    const text = await el.innerText();
    if (text && text.trim() !== '') return text.trim();

    const textContent = await el.textContent();
    if (textContent && textContent.trim() !== '') return textContent.trim();

    try {
      const val = await el.inputValue();
      if (val && val.trim() !== '') return val.trim();
    } catch (e) {
      // Not an input/textarea/select - no "value" attribute, mirrors Java's null getAttribute("value").
    }

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

  async clickOrdersPage(CustomerName) {
    return test.step('Orders Page is clicked successfully', async () => {
      await this.searchBox.fill(CustomerName);
      await this.searchBox.press('Enter');
      // Row 1 isn't reliably the searched-for customer (multiple rows can match,
      // and the list can still show the previous filter's rows right after Enter),
      // so match the row by its text instead of blindly clicking tr[1].
      const matchingRow = this.customerRows.filter({ hasText: CustomerName }).first();
      await matchingRow.waitFor({ state: 'visible', timeout: 30_000 });
      await matchingRow.locator('td').nth(2).click();
      //await this.moreMenubtn.click({ timeout: 30_000 });
      await this.salesMenubtn.click({ timeout: 30_000 });
      await this.createBtn.click({ timeout: 30_000 });
      return this;
    });
  }

  async clickCustomer_Details(cusName) {
    return test.step('Customer_Details is clicked successfully', async () => {
      await this.termsBox.click();
      await this.termsDD_Btn.waitFor({ state: 'attached', timeout: 30_000 });
      await this.termsDD_Btn.click();
      await this.contact.fill(cusName);
      await this.poNo.fill('P00123');
      await this.dropShipping.click({ force: true });
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
      await this.product.pressSequentially('Lays', { delay: 100 });

      // Let the catalog finish loading every matching suggestion before picking one.
      await this.page.waitForTimeout(5_000);

      const menuXpath = "//ul[contains(@class,'ui-autocomplete') and not(contains(@style,'none'))]";
      await this.page.locator('xpath=' + menuXpath).waitFor({ state: 'visible', timeout: 60_000 });

      const laysOption = this.page.locator(
        "xpath=" + menuXpath + "//li[contains(., 'Lays Original 2.25OZ')]"
      );
      await laysOption.waitFor({ state: 'visible', timeout: 60_000 });
      await laysOption.click();

      await this.productAddBtn.click({ timeout: 30_000 });
      return this;
    });
  }

  async clickService_Products() {
    return test.step('Service_Products is clicked successfully', async () => {
      await this.serviceProduct.click();
      await this.serviceProduct_SearchMore.waitFor({ state: 'attached', timeout: 30_000 });
      await this.serviceProduct_SearchMore.click({ force: true });
      await this.serviceProductAddBtn.click({ timeout: 30_000 });
      return this;
    });
  }

  async clickQuantity(qty, Cost) {
    // Cost/price is accepted but unused here - Java hardcoded "15.00" for every row too.
    return test.step('Quantity  updated successfully', async () => {
      const rowsLocator = this.page.locator(
        "xpath=(//table[contains(@class,'o_list_table')])[1]//tr[contains(@class,'o_data_row')]"
      );

      // Associated/service products can still be rendering into the table asynchronously
      // right after being added, so a count taken immediately can miss rows that appear
      // moments later (they'd then keep their default $0 price/qty and trip Odoo's
      // "set price for non-service products" validation). Wait for the row count to hold
      // steady across a few checks before treating it as final.
      let rowCount = await rowsLocator.count();
      for (let stableChecks = 0; stableChecks < 3; ) {
        await this.page.waitForTimeout(1_000);
        const nextCount = await rowsLocator.count();
        if (nextCount === rowCount) {
          stableChecks++;
        } else {
          stableChecks = 0;
          rowCount = nextCount;
        }
      }
      console.log('Total rows found: ' + rowCount);

      for (let i = 0; i < rowCount; i++) {
        const rowXpath =
          "(//table[contains(@class,'o_list_table')])[1]//tr[contains(@class,'o_data_row')][" + (i + 1) + ']';

        const qtyCell = this.page.locator('xpath=' + rowXpath + "//td[@name='product_uom_qty']");
        await qtyCell.click({ timeout: 30_000 });

        const qtyInput = this.page.locator('xpath=' + rowXpath + "//td[@name='product_uom_qty']//input");
        await qtyInput.fill(qty, { timeout: 30_000 });

        const priceInput = this.page.locator('xpath=' + rowXpath + "//td[@name='unit_price']//input");
        await priceInput.fill('15.00', { timeout: 30_000 });
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
          "(//table[contains(@class,'o_list_table')])[1]/tbody/tr[contains(@class,'o_data_row')][" + row + ']';

        const rowElement = this.page.locator('xpath=' + rowXpath);
        await rowElement.scrollIntoViewIfNeeded();
        await rowElement.click({ timeout: 30_000 });

        const uomInput = this.page.locator('xpath=' + rowXpath + "//td[@name='product_uom']//input");
        await uomInput.click({ timeout: 30_000 });

        const menuXpath = "//ul[contains(@class,'ui-autocomplete') and not(contains(@style,'none'))]";
        const optionXpath = menuXpath + '//li[1]//a';

        await this.page.locator('xpath=' + menuXpath).waitFor({ state: 'visible', timeout: 30_000 });

        const firstOption = this.page.locator('xpath=' + optionXpath);
        await firstOption.waitFor({ state: 'attached', timeout: 30_000 });
        await firstOption.scrollIntoViewIfNeeded();

        try {
          await firstOption.hover();
          await firstOption.click();
        } catch (e) {
          await firstOption.dispatchEvent('click');
        }

        await this.page.locator('xpath=' + menuXpath).waitFor({ state: 'hidden', timeout: 30_000 });

        const qtyInput = this.page.locator('xpath=' + rowXpath + "//td[@name='product_uom_qty']//input");
        await qtyInput.fill(qty, { timeout: 30_000 });

        const priceInput = this.page.locator('xpath=' + rowXpath + "//td[@name='unit_price']//input");
        await priceInput.clear({ timeout: 30_000 });

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

        const weight = this.page.locator('xpath=' + rowXpath + "//td[@name='weight']//input");
        await weight.click({ timeout: 30_000 });

        try {
          const errorMsg = this.page.locator("xpath=//div[@class='o_dialog']//p");
          await errorMsg.waitFor({ state: 'visible', timeout: 30_000 });
          console.log('Validation Error Message: ' + (await errorMsg.innerText()));
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
      await this.deliveryAddress.waitFor({ state: 'attached', timeout: 30_000 });
      await this.deliveryAddress.click();
      await this.addClick1.hover();
      await this.addClick1.click();
      await this.billingAddress.waitFor({ state: 'attached', timeout: 30_000 });
      await this.billingAddress.click();
      await this.otherInfo.click();
      return this;
    });
  }

  async clickCustomer_OtherInfo() {
    return test.step('Other Info is clicked successfully', async () => {
      await this.location.click();
      await this.locationSelect.waitFor({ state: 'attached', timeout: 30_000 });
      await this.locationSelect.click();
      await this.route.click();
      await this.routeSelect.waitFor({ state: 'attached', timeout: 30_000 });
      await this.routeSelect.click();
      await this.dropOff.click();
      await this.dropoffSelect.waitFor({ state: 'attached', timeout: 30_000 });
      await this.dropoffSelect.click();
      return this;
    });
  }

  async clickTaxUpdate(shipping, insuranceAmt, discount) {
    return test.step('Tax Update is clicked successfully', async () => {
      await this.page.waitForTimeout(5_000);
      await this.orderLines.click();
       await this.page.waitForTimeout(5_000);
     await this.shipping_handling.waitFor({ state: 'attached', timeout: 30_000 });
      await this.shipping_handling.click();
      await this.shipping_handling.fill(shipping);
      await this.shipping_handling.press('Enter');
      await this.insurance.waitFor({ state: 'attached', timeout: 30_000 });
      await this.insurance.click();
      await this.insurance.fill(insuranceAmt);
      await this.insurance.press('Enter');
      await this.total_discount_view.waitFor({ state: 'attached', timeout: 30_000 });
      await this.total_discount_view.click();
      await this.total_discount_view.fill(discount);
      await this.total_discount_view.press('Enter');
       await this.page.waitForTimeout(5_000);
     await this.shipVia.waitFor({ state: 'attached', timeout: 30_000 });
      await this.shipVia.click();
      await this.shipSelect.waitFor({ state: 'attached', timeout: 30_000 });
      await this.shipSelect.click();
       await this.holdReason.waitFor({ state: 'attached', timeout: 30_000 });
      await this.holdReason.click();
      await this.reasonSelect.waitFor({ state: 'attached', timeout: 30_000 });
      await this.reasonSelect.click();
      await this.closedReason.waitFor({ state: 'attached', timeout: 30_000 });
      await this.closedReason.click();
      await this.closedSelect.waitFor({ state: 'attached', timeout: 30_000 });
      await this.closedSelect.click();

      return this;
    });
  }

  async clickTaxUpdateNegative(shipping, insuranceAmt, discount) {
    // discount is accepted but unused here - Java commented out total_discount_view's
    // clear/sendKeys in the negative flow, only clicking the field.
    return test.step('Tax Update is clicked successfully', async () => {
      await this.orderLines.click();

      await this.shipping_handling.click();
      await this.shipping_handling.fill(shipping);
      await this.shipping_handling.press('Enter');

      try {
        const errorMsg = this.page.locator("xpath=//div[@class='o_dialog']//p");
        await errorMsg.waitFor({ state: 'visible', timeout: 30_000 });
        console.log('Validation Error Message: ' + (await errorMsg.innerText()));
        await this.page.locator("xpath=//button[normalize-space()='Close']").click();
        console.log('Validation error dismissed successfully for row ');
      } catch (e) {
        console.log('No validation error for row ');
      }

      await this.insurance.click();
      await this.insurance.fill(insuranceAmt);
      await this.insurance.press('Enter');

      try {
        const errorMsg = this.page.locator("xpath=//div[@class='o_dialog']//p");
        await errorMsg.waitFor({ state: 'visible', timeout: 30_000 });
        console.log('Validation Error Message: ' + (await errorMsg.innerText()));
        await this.page.locator("xpath=//button[normalize-space()='Close']").click();
        console.log('Validation error dismissed successfully for row ');
      } catch (e) {
        console.log('No validation error for row ');
      }

      await this.total_discount_view.click();
      await this.shipVia.waitFor({ state: 'attached', timeout: 30_000 });
      await this.shipVia.click();
      await this.shipSelect.waitFor({ state: 'attached', timeout: 30_000 });
      await this.shipSelect.click();
       await this.holdReason.waitFor({ state: 'attached', timeout: 30_000 });
      await this.holdReason.click();
      await this.reasonSelect.waitFor({ state: 'attached', timeout: 30_000 });
      await this.reasonSelect.click();
      await this.closedReason.waitFor({ state: 'attached', timeout: 30_000 });
      await this.closedReason.click();
      await this.closedSelect.waitFor({ state: 'attached', timeout: 30_000 });
      await this.closedSelect.click();

      return this;
    });
  }

  async clickSavebtnNegative() {
    return test.step('Save button is clicked successfully', async () => {
      await this.salesOrderSaveBtn.click();

      try {
        const errorMsg = this.page.locator("xpath=//div[@class='o_dialog']//p");
        await errorMsg.waitFor({ state: 'visible', timeout: 30_000 });
        console.log('Validation Error Message: ' + (await errorMsg.innerText()));
        await this.page.locator("xpath=//button[normalize-space()='Close']").click();
        console.log('Validation error dismissed successfully ');
      } catch (e) {
        console.log('No validation error ');
      }

      return this;
    });
  }

  async clickSavebtn() {
    return test.step('Save button is clicked successfully', async () => {
      await this.salesOrderSaveBtn.click();
      await this.confirmBtn.waitFor({ state: 'visible', timeout: 30_000 });
      await this.confirmBtn.click();
      return this;
    });
  }

  async clickGetTheSaleOrderAmount() {
    return test.step('Get the Sales Order Amount is clicked successfully', async () => {
      await this.subTotal.waitFor({ state: 'visible', timeout: 30_000 });
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
      this.salesOrderNo = await this.#extractText(this.salesOrderNum);
      await this.salesOrderNum.click({ timeout: 15_000 });
      console.log('Saler Order Number : ' + this.salesOrderNo);

      return this;
    });
  }

  async clickGetTheTableDataforLabelNameChecking() {
    // Java reused the same reportStep message from clickSalesOrderNo() here (copy/paste); preserved verbatim.
    return test.step('Sales Order No is clicked successfully', async () => {
      const headerLabels = this.page.locator(
        "xpath=//table[@class='o_list_table table table-sm table-hover table-striped o_list_table_ungrouped table striped']//thead//th"
      );
      await headerLabels.first().waitFor({ state: 'visible', timeout: 30_000 });
      const headerCount = await headerLabels.count();
      console.log('Table Headers:');
      const headers = [];
      for (let i = 0; i < headerCount; i++) {
        const headerText = await headerLabels.nth(i).innerText();
        headers.push(headerText);
        process.stdout.write(headerText + '\t');
      }
      console.log('\n----------------------------------------------');

      const rowsLocator = this.page.locator(
        "xpath=//table[@class='o_list_table table table-sm table-hover table-striped o_list_table_ungrouped table striped']//tbody//tr"
      );
      const rowCount = await rowsLocator.count();
      for (let rowIndex = 1; rowIndex <= rowCount; rowIndex++) {
        const cells = this.page.locator(
          `xpath=//table[@class='o_list_table table table-sm table-hover table-striped o_list_table_ungrouped table striped']//tbody//tr[${rowIndex}]//td`
        );
        const cellCount = await cells.count();
        process.stdout.write(`Row ${rowIndex}: `);
        for (let colIndex = 0; colIndex < cellCount; colIndex++) {
          const cellText = await cells.nth(colIndex).innerText();
          process.stdout.write(`${headers[colIndex]}: ${cellText}\t`);
        }
        console.log();
      }

      return this;
    });
  }

  async clickCancelAndDelete() {
    return test.step('Sale Order is deleted successfully', async () => {
      await this.cancel.click();
      await this.okBtn.click();
       await this.page.waitForTimeout(5_000);
      await this.ordersMenuBtn.click();
      //await this.orderSelect.waitFor({ state: 'visible', timeout: 30_000 });
      await this.page.waitForTimeout(5_000);
      await this.orderSelect.click();
       await this.page.waitForTimeout(5_000);
      await this.actionBtn.click();
      await this.deleteBtn.click();
      await this.confirmDeleteBtn.click();
      return this;
    });
  }
}

module.exports = { CustomerSaleOrder };
