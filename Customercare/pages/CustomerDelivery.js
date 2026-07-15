const { test } = require('@playwright/test');
const { ensureLoggedIn } = require('../utils/loginHelper');

// Ported from src/main/java/pages/CustomerDelivery.java.
// Selenium's @FindBy xpaths are preserved verbatim as Playwright locators.
// PageFactory/@CacheLookup have no equivalent needed: Playwright locators
// re-query the DOM on every action, so there's no stale-element risk to guard against.
class CustomerDelivery {
  constructor(page) {
    this.page = page;

    // Login Page
    this.userName = page.locator("xpath=//input[@id='login']");
    this.passWord = page.locator("xpath=//input[@id='password']");
    this.logIn = page.locator("xpath=//button[@type='submit']");

    this.menu = page.locator("xpath=//ul[@class='o_menu_apps']//i[@class='fa fa-bars']");

    this.customerCareMenuBtn = page.locator("xpath=//div[contains(text(),'Customer Care')]");

    this.deliveryMenu = page.locator("xpath=//span[normalize-space()='Delivery']");

    // financialacct
    this.deliveryStatus = page.locator("xpath=//a[normalize-space()='Delivery Status']");

    this.deliveryHistory = page.locator("xpath=//a[normalize-space()='Delivery Status']");

    this.newButton = page.locator("xpath=//button[normalize-space()='New']");

    // div[@name='warehouse_id']//a[@role='button']
    this.customer = page.locator("xpath=//input[@id='partner_id_0']");

    // li[@class='ui-menu-item']//a[contains(text(),'GSG Warehouse')]
    this.customerSelect = page.locator("xpath=//a[@id='partner_id_0_0_0']");

    this.warehouse = page.locator("xpath=//input[@id='warehouse_id_0']");
    this.warehouseSelect = page.locator("xpath=//a[@id='warehouse_id_0_0_0']");

    this.startDate = page.locator("xpath=//input[@id='start_date_0']");
    this.endDate = page.locator("xpath=//input[@id='end_date_0']");

    this.loadList = page.locator("xpath=//span[normalize-space()='Load List']");

    // div[@class='custom-control custom-checkbox']//input[@type='checkbox'])[1]
    this.checkBox = page.locator(
      "xpath=(//div[@class='o-checkbox form-check d-flex m-0']//input[@type='checkbox'])[1]"
    );

    // button[normalize-space()='Action']
    // a[normalize-space()='Export']
    this.action = page.locator("xpath=//span[normalize-space()='Actions']");

    this.export = page.locator("xpath=//a[normalize-space()='Export']");

    // span[normalize-space()='Export'])[1]
    this.exportBtn = page.locator("xpath=(//span[normalize-space()='Export'])[1]");
  }

  async clickLoginPage(user, pass) {
    return test.step('login is entered successfully', async () => {
      await this.userName.fill(user);
      await this.passWord.fill(pass);
      await this.logIn.click();
      return this;
    });
  }

  async loginIfNeeded(user, pass) {
    await ensureLoggedIn(this, user, pass);
    return this;
  }

  async click_Menu() {
    return test.step('Menu clicked is successfully', async () => {
      await this.menu.click({ timeout: 30_000 });
      return this;
    });
  }

  async click_CustomerCareBtn() {
    return test.step('Customer Care is clicked successfully', async () => {
      await this.customerCareMenuBtn.click({ timeout: 30_000 });
      return this;
    });
  }

  async click_DeliveryBtn(date, date1) {
    return test.step('Delivery button is clicked successfully', async () => {
      await this.deliveryMenu.click();
      await this.deliveryStatus.click();
      await this.newButton.click();
      await this.customer.click();
      // Typed as keystrokes so the Odoo many2one autocomplete dropdown filters
      // before customerSelect is clicked, matching the Java sendKeys sequence.
      await this.customer.pressSequentially('komala');
      await this.customerSelect.click();
      await this.warehouse.click();
      await this.warehouseSelect.click();
      // Typed as keystrokes so the Odoo date widget parses/validates the value,
      // matching the Java sendKeys sequence for this date-range filter.
      await this.startDate.pressSequentially(date);
      await this.endDate.pressSequentially(date1);
      await this.loadList.click();
      return this;
    });
  }

  async click_DeliveryStatusHistory() {
    return test.step('Delivery button is clicked successfully', async () => {
      // await this.deliveryMenu.click();
      await this.deliveryHistory.click();
      await this.checkBox.click();
      await this.action.click();
      return this;
    });
  }
}

module.exports = { CustomerDelivery };
