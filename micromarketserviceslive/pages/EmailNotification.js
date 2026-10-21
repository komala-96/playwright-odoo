const { reportStep } = require('../utils/reportStep');
const { ensureLoggedIn } = require('../utils/loginHelper');

class EmailNotification {
  constructor(page) {
    this.page = page;

    // Login Page 1
    this.userName = page.locator("xpath=//input[@id='login']");

    this.passWord = page.locator("xpath=//input[@id='password']");

    this.logIn = page.locator("xpath=//button[@type='submit']");

    this.menu = page.locator("xpath=//ul[@class='o_menu_apps']//i[@class='fa fa-bars']");

    this.microMarketServices = page.locator("xpath=(//img[@class='o_app_icon rounded-3'])[9]");

    this.emailNotificationMenu = page.locator("xpath=//a[normalize-space()='Email Notification']");

    this.newButton = page.locator("xpath=//button[normalize-space()='New']");

    // Create app user
    this.addaLine = page.locator("xpath=//a[normalize-space()='Add a line']");

    this.userId = page.locator(
      "xpath=(//table[@class='o_list_table table table-sm table-hover position-relative mb-0 o_list_table_ungrouped table-striped'])/tbody/tr[1]/td[1]"
    );

    this.employeeId = page.locator(
      "xpath=(//table[@class='o_list_table table table-sm table-hover position-relative mb-0 o_list_table_ungrouped table-striped'])/tbody/tr[1]/td[2]"
    );

    this.employeeName = page.locator(
      "xpath=(//table[@class='o_list_table table table-sm table-hover position-relative mb-0 o_list_table_ungrouped table-striped'])/tbody/tr[1]/td[3]"
    );

    this.email = page.locator("xpath=//div[@name='email']//input[@type='text']");

    this.addaLine1 = page.locator("xpath=//a[normalize-space()='Add a line']");

    this.userId1 = page.locator(
      "xpath=(//table[@class='o_list_table table table-sm table-hover position-relative mb-0 o_list_table_ungrouped table-striped'])/tbody/tr[1]/td[1]"
    );

    this.employeeId1 = page.locator(
      "xpath=(//table[@class='o_list_table table table-sm table-hover position-relative mb-0 o_list_table_ungrouped table-striped'])/tbody/tr[1]/td[2]"
    );

    this.employeeName1 = page.locator(
      "xpath=(//table[@class='o_list_table table table-sm table-hover position-relative mb-0 o_list_table_ungrouped table-striped'])/tbody/tr[1]/td[3]"
    );

    this.email1 = page.locator("xpath=//div[@name='email']//input[@type='text']");

    this.saveButton = page.locator("xpath=//button[normalize-space()='Save']");

    this.action = page.locator("xpath=//button[normalize-space()='Action']");

    this.emailType = page.locator("xpath=//select[@id='notification_type_0']");

    this.microMarket = page.locator("xpath=//div[@name='micro_market_ids']//input[@type='text']");

    this.marketSelect = page.locator("xpath=//a[@id='micro_market_ids_0_0_0']");

    this.duplicate = page.locator("xpath=//span[normalize-space()='Duplicate']");

    this.action3 = page.locator("xpath=//button[normalize-space()='Action']");

    this.delete = page.locator("xpath=//span[normalize-space()='Delete']");

    this.confirmDelete = page.locator("xpath=//button[normalize-space()='Delete']");
  }

  async loginIfNeeded(user, pass) {
    await ensureLoggedIn(this, user, pass);
    return this;
  }

  async enterUsername(user) {
    try {
      await this.userName.fill(String(user));

      await reportStep(this.page, "username is entered successfully", "pass");
    } catch (e) {
      await reportStep(this.page, "username is not entered successfully..." + e, "fail");
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

      await reportStep(this.page, "login button clicked successfully", "pass");
    } catch (e) {
      await reportStep(this.page, "login button clicked not successfully..." + e, "fail");
    }
    return this;
  }

  async clickMeansButton() {
    try {
      // await this.page.waitForTimeout(3000);

      // await this.menu.click();

      // await this.menu.click({ timeout: 30 * 1000 });

      await this.page.waitForTimeout(3000);

      await this.microMarketServices.evaluate((node) => node.click());

      await this.page.waitForTimeout(3000);

      await reportStep(this.page, "Menu button clicked successfully", "pass");
    } catch (e) {
      await reportStep(this.page, "Menu button clicked not successfully..." + e, "fail");
    }
    return this;
  }

  async clickEmailNotification() {
    try {
      await this.page.waitForTimeout(5000);
      await this.emailNotificationMenu.evaluate((node) => node.click());
      await this.page.waitForTimeout(3000);

      await this.newButton.click();
      await this.page.waitForTimeout(3000);
      await this.addaLine.click();
      await this.page.waitForTimeout(3000);

      await this.userId.click();
      await this.employeeId.click();
      await this.employeeName.click();
      await this.email.fill("komala@averigo.com");

      await this.page.waitForTimeout(3000);
      //phone.sendKeys("14");

      await this.page.waitForTimeout(3000);
      await this.saveButton.click();
      await this.page.waitForTimeout(3000);

      await this.page.waitForTimeout(3000);

      await reportStep(this.page, "clickEmailNotification button clicked successfully", "pass");
    } catch (e) {
      await reportStep(this.page, "clickEmailNotification button clicked not successfully..." + e, "fail");
    }
    return this;
  }

  async deleteDetails() {
    try {
      await this.page.waitForTimeout(2000);
      await this.action.click();

      await this.duplicate.click();
      await this.page.waitForTimeout(2000);

      await this.emailType.selectOption({ index: 5 });
      await this.page.waitForTimeout(2000);

      await this.microMarket.click();
      //await this.marketSelect.click();
      await this.marketSelect.evaluate((node) => node.click());
      await this.page.waitForTimeout(2000);

      await this.addaLine1.click();
      await this.page.waitForTimeout(3000);

      await this.userId1.click();
      await this.employeeId1.click();
      await this.employeeName1.click();
      await this.email1.fill("komala@averigo.com");

      await this.page.waitForTimeout(3000);

      await this.action3.click();
      await this.delete.click();
      await this.page.waitForTimeout(2000);
      await this.confirmDelete.click();
      await this.page.waitForTimeout(2000);

      await reportStep(this.page, "delete created successfully", "pass");
    } catch (e) {
      await reportStep(this.page, "delete created not successfully..." + e, "fail");
    }
    console.log("Test completed successfully");

    return this;
  }
}

module.exports = { EmailNotification };
