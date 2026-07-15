const { reportStep } = require('../utils/reportStep');

class SaleRecurringPage {
  constructor(page) {
    this.page = page;

    // Login Page
    this.userName = page.locator("xpath=//input[@name='login']");
    this.passWord = page.locator("xpath=//input[@name='password']");
    this.logIn = page.locator("xpath=//button[@type='submit']");

    // Menu
    this.menu = page.locator("xpath=//ul[@class='o_menu_apps']//i[@class='fa fa-bars']");
    this.recurringMenu = page.locator("xpath=//div[contains(text(),'Recurring')]");

    this.saleRecurring = page.locator("xpath=//a[normalize-space()='Sale Orders']");
    this.createBtn = page.locator("xpath=//button[normalize-space()='New']");

    this.name = page.locator("xpath=//input[@id='name_0']");
    this.sale = page.locator("xpath=//input[@id='sale_id_0']");
    this.saleSelect = page.locator("xpath=//a[@id='sale_id_0_0_0']");

    this.daySelect = page.locator("xpath=//input[@id='days_0']");

    this.alert = page.locator(
      "xpath=(//label[normalize-space()='Create transactions and give me alert message'])[1]"
    );
    this.timePicker = page.locator("xpath=//input[@name='time_picker']");

    this.saveBtn = page.locator("xpath=(//button[normalize-space()='Save'])[1]");

    this.action = page.locator("xpath=//button[normalize-space()='Action']");
    this.delete = page.locator("xpath=//span[normalize-space()='Delete']");
    this.confirmDelete = page.locator("xpath=//button[normalize-space()='Delete']");
  }

  async enterUsername(user, pass) {
    try {
      await this.userName.fill(String(user));
      await this.passWord.fill(String(pass));
      await this.logIn.click();
      await this.page.waitForTimeout(5000);

      await reportStep(this.page, "login button is entered successfully", "pass");
    } catch (e) {
      await reportStep(this.page, "login button is not entered successfully..." + e, "fail");
    }
    return this;
  }

  async clickMenu() {
    try {
      await this.page.waitForTimeout(2000);
      await this.recurringMenu.click();
      await this.page.waitForTimeout(3000);

      await reportStep(this.page, "Menu clicked successfully", "pass");
    } catch (e) {
      await reportStep(this.page, "Menu clicked not successfully..." + e, "fail");
    }
    return this;
  }

  async clickSalesMenuBtn() {
    try {
      await this.saleRecurring.click();
      await this.page.waitForTimeout(3000);

      await reportStep(this.page, "Sale Recurring menu is clicked successfully", "pass");
    } catch (e) {
      await reportStep(this.page, "Sale Recurring menu is not clicked successfully..." + e, "fail");
    }
    return this;
  }

  async clickCreateBtn() {
    try {
      await this.createBtn.click({ timeout: 30 * 1000 });
      await this.page.waitForTimeout(3000);

      await reportStep(this.page, "Create Btn is clicked successfully", "pass");
    } catch (e) {
      await reportStep(this.page, "Create Btn is not clicked successfully..." + e, "fail");
    }
    return this;
  }

  async clickCreateRecurringBtn(nam, days, time) {
    try {
      await this.name.fill(String(nam));
      await this.page.waitForTimeout(2000);

      await this.sale.click();
      await this.saleSelect.click();
      await this.page.waitForTimeout(2000);

      await this.daySelect.fill(String(days));
      await this.page.waitForTimeout(2000);

      await this.saveBtn.click();
      await this.page.waitForTimeout(2000);

      await this.action.click();
      await this.delete.click();
      await this.confirmDelete.click();
      await this.page.waitForTimeout(2000);

      await reportStep(this.page, "Sale Recurring Create Btn is clicked successfully", "pass");
    } catch (e) {
      await reportStep(this.page, "Sale Recurring Create Btn is not clicked successfully..." + e, "fail");
    }
    return this;
  }
}

module.exports = { SaleRecurringPage };
