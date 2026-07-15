const { reportStep } = require('../utils/reportStep');

class TagsConfigPage {
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
    this.clickTags = page.locator("xpath=//a[normalize-space()='Tags']");

    this.newBtn = page.locator("xpath=//button[normalize-space()='New']");

    this.name = page.locator("xpath=//input[@id='name_0']");
    this.addaLine = page.locator("xpath=//a[normalize-space()='Add a line']");

    this.searchBox = page.locator("xpath=//input[@placeholder='Search...']");
    this.checkBox = page.locator(
      "xpath=(//table[@class='o_list_table table table-sm table-hover position-relative mb-0 o_list_table_ungrouped table-striped'])[2]//tbody//tr[1]//td[2]"
    );

    this.action = page.locator("xpath=//button[normalize-space()='Action']");
    this.duplicate = page.locator("xpath=//span[normalize-space()='Duplicate']");

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
      await this.clickTags.click();
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
      await this.name.fill(String(teamName));
      await this.addaLine.click();

      await this.searchBox.fill("employee");
      await this.searchBox.press('Enter');
      await this.checkBox.click();

      await this.page.waitForTimeout(3000);

      await this.saveBtn.click();
      await this.action.click();
      await this.page.waitForTimeout(3000);
      await this.duplicate.click();
      await this.page.waitForTimeout(3000);

      await reportStep(this.page, "Sales Team created successfully", "pass");
    } catch (e) {
      await reportStep(this.page, "Sales Team creation failed..." + e, "fail");
    }
    return this;
  }
}

module.exports = { TagsConfigPage };
