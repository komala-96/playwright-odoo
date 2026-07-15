const { reportStep } = require('../utils/reportStep');

class WorkLocationConfigPage {
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
    this.clickWorkLocation = page.locator("xpath=//a[normalize-space()='Work Locations']");

    this.newBtn = page.locator("xpath=//button[normalize-space()='New']");

    this.workAddress = page.locator("xpath=//input[@id='address_id_0']");
    this.addressSelect = page.locator("xpath=//a[@id='address_id_0_0_0']");

    this.location = page.locator("xpath=//input[@id='name_0']");
    this.coverImage = page.locator("xpath=//select[@id='location_type_0']");
    this.locationNum = page.locator("xpath=//input[@id='location_number_0']");

    this.action = page.locator("xpath=//button[normalize-space()='Action']");
    this.duplicate = page.locator("xpath=//span[normalize-space()='Duplicate']");
    this.action1 = page.locator("xpath=//button[normalize-space()='Action']");
    this.archive = page.locator("xpath=//span[normalize-space()='Archive']");
    this.confirmArchive = page.locator("xpath=//button[normalize-space()='Archive']");
    this.action2 = page.locator("xpath=//button[normalize-space()='Action']");
    this.delete = page.locator("xpath=//span[normalize-space()='Delete']");
    this.confirmDelete = page.locator("xpath=//button[normalize-space()='Delete']");

    this.saveBtn = page.locator("xpath=//button[normalize-space()='Save']");

    this.clickConfigration1 = page.locator("xpath=//span[normalize-space()='Configuration']");
    this.clickWorkScheduleLink = page.locator("xpath=//a[normalize-space()='Working Schedules']");

    this.checkBox = page.locator(
      "xpath=//table[@class='o_list_table table table-sm table-hover position-relative mb-0 o_list_table_ungrouped table-striped']//thead//tr[1]//th[1]"
    );

    this.actionBtn = page.locator("xpath=//span[normalize-space()='Actions']");
    this.export = page.locator("xpath=//span[normalize-space()='Export']");
    this.confirmExport = page.locator("xpath=//button[normalize-space()='Export']");
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
      await this.clickWorkLocation.click();
      await this.page.waitForTimeout(2000);

      await reportStep(this.page, "WorkLocationConfig menu is clicked successfully", "pass");
    } catch (e) {
      await reportStep(this.page, "WorkLocationConfig menu is not clicked successfully..." + e, "fail");
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
      await this.page.waitForTimeout(3000);

      await this.workAddress.fill("employee");
      await this.workAddress.press('Enter');
      await this.page.waitForTimeout(3000);

      await this.location.fill(String(teamName));
      await this.page.waitForTimeout(3000);

      await this.coverImage.selectOption({ label: 'Office' });
      await this.page.waitForTimeout(3000);

      await this.locationNum.fill("10");
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

  async clickWorkSchedule() {
    try {
      await this.page.waitForTimeout(3000);
      await this.clickConfigration1.click();
      await this.clickWorkScheduleLink.click();
      await this.page.waitForTimeout(3000);

      await this.checkBox.click();
      await this.page.waitForTimeout(3000);

      await this.actionBtn.click();
      await this.export.click();
      await this.page.waitForTimeout(3000);

      await this.confirmExport.click();
      await this.page.waitForTimeout(3000);

      await reportStep(this.page, "Menu clicked successfully", "pass");
    } catch (e) {
      await reportStep(this.page, "Menu clicked not successfully..." + e, "fail");
    }
    return this;
  }
}

module.exports = { WorkLocationConfigPage };
