const { reportStep } = require('../utils/reportStep');

class TypeOfVisitors {
  constructor(page) {
    this.page = page;

    // Login Page
    this.userName = page.locator("xpath=//input[@name='login']");
    this.passWord = page.locator("xpath=//input[@name='password']");
    this.logIn = page.locator("xpath=//button[@type='submit']");

    // Menu
    this.menu = page.locator("xpath=//ul[@class='o_menu_apps']//i[@class='fa fa-bars']");
    this.crmMenu = page.locator("xpath=//div[contains(text(),'CRM')]");

    // save btn
    this.clickConfigration = page.locator("xpath=//span[normalize-space()='Configuration']");
    this.clickVisitors = page.locator("xpath=//a[normalize-space()='Types of Visitors']");

    this.newBtn = page.locator("xpath=//button[normalize-space()='New']");
    this.statusName = page.locator("xpath=//input[@id='visitors_0']");

    this.action = page.locator("xpath=//button[normalize-space()='Action']");
    this.duplicate = page.locator("xpath=//span[normalize-space()='Duplicate']");
    this.action1 = page.locator("xpath=//button[normalize-space()='Action']");
    this.archive = page.locator("xpath=//span[normalize-space()='Archive']");
    this.confirmArchive = page.locator("xpath=//button[normalize-space()='Archive']");
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
      // new WebDriverWait(driver, Duration.ofSeconds(30))
      // .until(ExpectedConditions.elementToBeClickable(menu)).click();

      await this.page.waitForTimeout(2000);
      await this.crmMenu.click();

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
      // eventsMenu.click();
      await this.page.waitForTimeout(2000);
      await this.clickVisitors.click();
      await this.page.waitForTimeout(2000);

      await reportStep(this.page, "CRM menu is clicked successfully", "pass");
    } catch (e) {
      await reportStep(this.page, "CRM menu is not clicked successfully..." + e, "fail");
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

  async createLeadStatus(teamName) {
    try {
      await this.statusName.fill(String(teamName));

      await this.page.waitForTimeout(1000);

      await this.page.waitForTimeout(1000);
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

      await this.page.waitForTimeout(3000);
      await reportStep(this.page, "Type Of visitors created successfully", "pass");
    } catch (e) {
      await reportStep(this.page, "Type Of visitors creation failed..." + e, "fail");
    }
    return this;
  }
}

module.exports = { TypeOfVisitors };
