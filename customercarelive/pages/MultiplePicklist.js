const { test } = require('@playwright/test');
const { ensureLoggedIn } = require('../utils/loginHelper');

// Ported from src/main/java/pages/MultiplePicklist.java.
// Selenium's @FindBy xpaths are preserved verbatim as Playwright locators.
// PageFactory/@CacheLookup have no equivalent needed: Playwright locators
// re-query the DOM on every action, so there's no stale-element risk to guard against.
class MultiplePicklist {
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

    // save btn
    this.deliveryMenu = page.locator("xpath=(//span[normalize-space()='Delivery'])[1]");

    // financialacct
    this.clickPickListBtn = page.locator("xpath=//a[normalize-space()='Pick List']");

    this.selectPickList1 = page.locator(
      "xpath=(//div[@class='o-checkbox form-check']//input[@type='checkbox'])[1]"
    );
    this.selectPickList2 = page.locator(
      "xpath=(//div[@class='o-checkbox form-check']//input[@type='checkbox'])[2]"
    );
    this.selectPickList3 = page.locator(
      "xpath=(//div[@class='o-checkbox form-check']//input[@type='checkbox'])[3]"
    );
    this.selectPickList4 = page.locator(
      "xpath=(//div[@class='o-checkbox form-check']//input[@type='checkbox'])[1]"
    );
    this.selectPickList5 = page.locator(
      "xpath=(//div[@class='o-checkbox form-check']//input[@type='checkbox'])[1]"
    );

    this.clickPackingSlip = page.locator("xpath=//button[contains(text(),'Packing Slip')]");
    this.selectAllPackingSlip = page.locator("xpath=//div[@name='select_all_pick']//input[@type='checkbox']");
    this.clickConfirmPackingSlip = page.locator("xpath=//button[@name='confirm_pack_slip']");
    this.clickOkbtn = page.locator("xpath=(//button[@class='btn btn-primary'][normalize-space()='Ok'])[1]");
    this.printBtn = page.locator("xpath=//button[@name='print_packing_slip']");

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

    this.invoiceBtn = page.locator("xpath=//button[@name='action_view_invoice']");
    this.invoiceSubTotal = page.locator("xpath=//div[@name='amount_untaxed']");
    this.invoiceTaxAmt = page.locator("xpath=//div[@name='tax_amount_view']");
    this.invoiceContainerDepositAmt = page.locator("xpath=//div[@name='total_container_deposit']");
    this.invoiceTotal = page.locator("xpath=//div[@name='amount_total_view']");
    this.invoiceAmountDue = page.locator("xpath=//div[@name='amount_residual']");
    this.invoiceNo = page.locator("xpath=//div[@name='name']");
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
    return test.step('Menu clicked successfully', async () => {
      await this.menu.click({ timeout: 30_000 });
      return this;
    });
  }

  async clickCustomerMenu() {
    return test.step('Customer Menu clicked successfully', async () => {
      await this.customerMenu.click({ timeout: 30_000 });
      return this;
    });
  }

  async clickDeliveryMenu() {
    return test.step('Sales Order No clicked successfully', async () => {
      await this.deliveryMenu.click({ timeout: 30_000 });
      await this.clickPickListBtn.click();
      return this;
    });
  }

  async clickCheckBox() {
    return test.step('CheckBox clicked successfully', async () => {
      await this.selectPickList1.click({ force: true });
      await this.selectPickList2.click({ force: true });
      await this.selectPickList3.click({ force: true });

      await this.clickPackingSlip.click();
      await this.selectAllPackingSlip.click({ force: true });
      await this.clickConfirmPackingSlip.click();
     // await this.clickOkbtn.click();
      return this;
    });
  }

  async clickDeliveryCheckBox(qty) {
    return test.step('Delivery Check Box clicked successfully', async () => {
      await this.selectAllDeliveryBox.click({ force: true });
      await this.clickDeliveryBtn.click();

      await this.confirmDeliveryBtn.click();
      return this;
    });
  }

  async clickOrderMenu() {
    return test.step('Order Menu clicked successfully', async () => {
      await this.ordersMenuBtn.click({ timeout: 30_000 });
      return this;
    });
  }

  async clickCustomerSelect() {
    return test.step('Customer Select  clicked successfully', async () => {
      await this.saleOrderCustomerClick.click({ timeout: 30_000 });
      await this.invoiceBtn.click({ timeout: 30_000 });
      return this;
    });
  }

  async clickGetTheInvoiceAmount() {
    return test.step('Get the Invoice Amount clicked successfully', async () => {
      const invoiceSubTotalValue = await this.invoiceSubTotal.innerText();
      console.log('Invoice : SubTotal ' + invoiceSubTotalValue);

      const invoiceTaxAmtValue = await this.invoiceTaxAmt.innerText();
      console.log('Invoice : Tax Amount ' + invoiceTaxAmtValue);

      const invoiceContainerDepositAmtValue = await this.invoiceContainerDepositAmt.innerText();
      console.log('Invoice : Container Deposit Amount ' + invoiceContainerDepositAmtValue);

      const invoiceTotalValue = await this.invoiceTotal.innerText();
      console.log('Invoice : Total Amount ' + invoiceTotalValue);

      const invoiceAmountDueValue = await this.invoiceAmountDue.innerText();
      console.log('Invoice : Total Amount ' + invoiceAmountDueValue);
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
}

module.exports = { MultiplePicklist };
