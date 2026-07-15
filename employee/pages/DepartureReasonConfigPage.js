const { reportStep } = require('../utils/reportStep');

class DepartureReasonConfigPage {
  constructor(page) {
    this.page = page;

    // Login Page
    this.userName = page.locator("xpath=//input[@name='login']");
    this.passWord = page.locator("xpath=//input[@name='password']");
    this.logIn = page.locator("xpath=//button[@type='submit']");

    // Menu
    this.menu = page.locator("xpath=//ul[@class='o_menu_apps']//i[@class='fa fa-bars']");
    this.employeeMenu = page.locator("xpath=//div[contains(text(),'Employees')]");

    this.clickConfigration = page.locator("xpath=//span[normalize-space()='Configuration']");
    this.clickDepartureReason = page.locator("xpath=//a[normalize-space()='Departure Reasons']");

    this.newBtn = page.locator("xpath=//button[normalize-space()='New']");

    this.reasonCode = page.locator("xpath=//input[@id='reason_code_0']");
    this.reason = page.locator("xpath=//input[@id='name_0']");

    this.action = page.locator("xpath=//button[normalize-space()='Action']");
    this.duplicate = page.locator("xpath=//span[normalize-space()='Duplicate']");
    this.action2 = page.locator("xpath=//button[normalize-space()='Action']");
    this.delete = page.locator("xpath=//span[normalize-space()='Delete']");
    this.confirmDelete = page.locator("xpath=//button[normalize-space()='Delete']");

    this.saveBtn = page.locator("xpath=//button[normalize-space()='Save']");
  }

  async enterUsername(user, pass) {
    try {
      await this.userName.fill(String(user));
      await this.passWord.fill(String(pass));
      await this.logIn.click();

      await reportStep(this.page, "login button is entered successfully", "pass");
    } catch (e) {
      await reportStep(this.page, "login button is not entered successfully..." + e, "fail");
    }
    return this;
  }

  async clickMenu() {
    try {
      await this.page.waitForTimeout(2000);
      await this.employeeMenu.click();
      await this.page.waitForTimeout(3000);

      await reportStep(this.page, "Menu clicked successfully", "pass");
    } catch (e) {
      await reportStep(this.page, "Menu clicked not successfully..." + e, "fail");
    }
    return this;
  }

  async clickSalesMenuBtn() {
    try {
      await this.clickConfigration.click();
      await this.page.waitForTimeout(2000);
      await this.clickDepartureReason.click();
      await this.page.waitForTimeout(2000);

      await reportStep(this.page, "Financial Accounting menu is clicked successfully", "pass");
    } catch (e) {
      await reportStep(this.page, "Financial Accounting menu is not clicked successfully..." + e, "fail");
    }
    return this;
  }

  async clickNew() {
    try {
      await this.newBtn.click({ timeout: 20 * 1000 });
      await reportStep(this.page, "New Sales Team button clicked", "pass");
    } catch (e) {
      await reportStep(this.page, "New Sales Team button NOT clicked..." + e, "fail");
    }
    return this;
  }

  async createSalesTeam(teamName) {
    try {
      await this.reason.fill(String(teamName));
      await this.reasonCode.fill("11");
      await this.page.waitForTimeout(3000);

      await this.saveBtn.click();
      await this.action.click();
      await this.page.waitForTimeout(3000);
      await this.duplicate.click();
      await this.page.waitForTimeout(3000);
      await this.action2.click();
      await this.page.waitForTimeout(3000);
      await this.delete.click();
      await this.page.waitForTimeout(3000);
      await this.confirmDelete.click();
      await this.page.waitForTimeout(3000);

      await reportStep(this.page, "Sales Team created successfully", "pass");
    } catch (e) {
      await reportStep(this.page, "Sales Team creation failed..." + e, "fail");
    }
    return this;
  }
}

module.exports = { DepartureReasonConfigPage };
