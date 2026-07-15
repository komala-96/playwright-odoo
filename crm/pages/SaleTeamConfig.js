const { reportStep } = require('../utils/reportStep');

class SaleTeamConfig {
  constructor(page) {
    this.page = page;

    // Login Page
    this.userName = page.locator("xpath=//input[@name='login']");
    this.passWord = page.locator("xpath=//input[@name='password']");
    this.logIn = page.locator("xpath=//button[@type='submit']");

    // Menu
    this.menu = page.locator("xpath=//ul[@class='o_menu_apps']//i[@class='fa fa-bars']");
    this.crmMenu = page.locator("xpath=//div[contains(text(),'CRM')]");

    // Sales Team config
    this.clickConfigration = page.locator("xpath=//span[normalize-space()='Configuration']");
    this.clickSalesTeam = page.locator("xpath=//a[normalize-space()='Sales Team']");

    this.newBtn = page.locator("xpath=//button[normalize-space()='New']");
    this.salesTeamName = page.locator("xpath=//input[@id='name_0']");
    this.usersField = page.locator("xpath=//input[@id='user_ids_0']");
    this.usersFieldSelect = page.locator("xpath=//a[@id='user_ids_0_0_0']");
    this.teamLeaderField = page.locator("xpath=//input[@id='user_id_0']");
    this.teamLeaderFieldSelect = page.locator("xpath=//a[@id='user_id_0_0_0']");
    this.addBtn = page.locator("xpath=//button[normalize-space()='Add']");

    this.SearchBox = page.locator(
      "xpath=//div[@class='o_searchview_input_container d-flex flex-grow-1 flex-wrap gap-1 mw-100']//input[@type='text']"
    );
    this.Select = page.locator(
      "xpath=(//table[@class='o_list_table table table-sm table-hover position-relative mb-0 o_list_table_ungrouped table-striped'])//tbody/tr[1]/td[3]"
    );

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
      await this.page.waitForTimeout(2000);
      await this.clickSalesTeam.click();
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
      await this.salesTeamName.waitFor({ state: 'visible', timeout: 20 * 1000 });
      await this.salesTeamName.fill(String(teamName));

      // usersField.click();
      await this.page.waitForTimeout(1000); // if dropdown suggestion pops, add Select logic later
      // usersFieldSelect.click();
      await this.page.waitForTimeout(1000);
      await this.teamLeaderField.click();
      await this.page.waitForTimeout(1000);
      await this.teamLeaderFieldSelect.evaluate((node) => node.click());
      await this.page.waitForTimeout(1000);
      await this.addBtn.click();
      await this.SearchBox.fill('Komala');
      await this.SearchBox.press('Enter');

      await this.Select.click();
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
      await this.page.waitForTimeout(6000);
      await this.action1.click();
      await this.page.waitForTimeout(3000);
      await this.archive.click();
      await this.page.waitForTimeout(3000);
      await this.confirmArchive.click();
      await this.page.waitForTimeout(3000);

      await reportStep(this.page, "Sales Team created successfully", "pass");
    } catch (e) {
      await reportStep(this.page, "Sales Team creation failed..." + e, "fail");
    }
    return this;
  }
}

module.exports = { SaleTeamConfig };
