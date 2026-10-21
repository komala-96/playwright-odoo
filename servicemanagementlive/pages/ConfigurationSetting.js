const { reportStep } = require('../utils/reportStep');

class ConfigurationSetting {
  constructor(page) {
    this.page = page;

    // Login Page
    this.userName = page.locator("xpath=//input[@name='login']");
    this.passWord = page.locator("xpath=//input[@name='password']");
    this.logIn = page.locator("xpath=//button[@type='submit']");

    // Menu
    this.menu = page.locator("xpath=//ul[@class='o_menu_apps']//i[@class='fa fa-bars']");
    this.serviceMenu = page.locator("xpath=//div[contains(text(),'Service Management')]");

    // save btn
    this.configurationMenu = page.locator("xpath=//span[normalize-space()='Configuration']");

    this.configurationMenu1 = page.locator("xpath=//span[normalize-space()='Configuration']");
    this.caseOrigin = page.locator("xpath=//a[normalize-space()='Case Origins']");
    this.caseType = page.locator("xpath=//a[normalize-space()='Case Type']");

    this.createBtn = page.locator("xpath=//button[normalize-space()='New']");
    this.createBtn1 = page.locator("xpath=//button[normalize-space()='New']");

    this.name = page.locator("xpath=//div[@name='name']//input[@type='text']");

    this.saveBtn = page.locator("xpath=//button[normalize-space()='Save']");

    this.selectCategory = page.locator(
      "xpath=//table[@class='o_list_table table table-sm table-hover position-relative mb-0 o_list_table_ungrouped table-striped']//tbody//tr[7]//td[1]"
    );
    this.selectCategory1 = page.locator(
      "xpath=//table[@class='o_list_table table table-sm table-hover position-relative mb-0 o_list_table_ungrouped table-striped']//tbody//tr[7]//td[1]"
    );
    this.selectCategory2 = page.locator(
      "xpath=//table[@class='o_list_table table table-sm table-hover position-relative mb-0 o_list_table_ungrouped table-striped']//tbody//tr[7]//td[1]"
    );

    this.action = page.locator("xpath=//span[normalize-space()='Actions']");

    this.export = page.locator("xpath=//span[normalize-space()='Export']");
    this.confirmExport = page.locator("xpath=//button[normalize-space()='Export']");
    this.closeBtn = page.locator("xpath=//button[normalize-space()='Close']");

    this.action1 = page.locator("xpath=//span[normalize-space()='Actions']");
    this.duplicate = page.locator("xpath=//span[normalize-space()='Duplicate']");

    this.action2 = page.locator("xpath=//span[normalize-space()='Actions']");
    this.archive = page.locator("xpath=//span[normalize-space()='Archive']");
    this.confirmArchive = page.locator("xpath=//button[normalize-space()='Archive']");

    this.action3 = page.locator("xpath=//span[normalize-space()='Actions']");
    this.delete = page.locator("xpath=//span[normalize-space()='Delete']");
    this.confirmDelete = page.locator("xpath=//button[normalize-space()='Delete']");

    this.nameButton = page.locator("xpath=//div[@name='name']//input[@type='text']");

    this.saveButton = page.locator("xpath=//button[normalize-space()='Save']");

    this.selectCategoryButton = page.locator(
      "xpath=//table[@class='o_list_table table table-sm table-hover position-relative mb-0 o_list_table_ungrouped table-striped']//tbody//tr[51]//td[1]"
    );
    this.selectCategory1Button = page.locator(
      "xpath=//table[@class='o_list_table table table-sm table-hover position-relative mb-0 o_list_table_ungrouped table-striped']//tbody//tr[51]//td[1]"
    );
    this.selectCategory2Button = page.locator(
      "xpath=//table[@class='o_list_table table table-sm table-hover position-relative mb-0 o_list_table_ungrouped table-striped']//tbody//tr[51]//td[1]"
    );

    this.actionButton = page.locator("xpath=//span[normalize-space()='Actions']");

    this.exportButton = page.locator("xpath=//span[normalize-space()='Export']");
    this.confirmExportButton = page.locator("xpath=//button[normalize-space()='Export']");
    this.closeButton = page.locator("xpath=//button[normalize-space()='Close']");

    this.action1Button = page.locator("xpath=//span[normalize-space()='Actions']");
    this.duplicateButton = page.locator("xpath=//span[normalize-space()='Duplicate']");

    this.action2Button = page.locator("xpath=//span[normalize-space()='Actions']");
    this.archiveButton = page.locator("xpath=//span[normalize-space()='Archive']");
    this.confirmArchiveButton = page.locator("xpath=//button[normalize-space()='Archive']");

    this.action3Button = page.locator("xpath=//span[normalize-space()='Actions']");
    this.deleteButton = page.locator("xpath=//span[normalize-space()='Delete']");
    this.confirmDeleteButton = page.locator("xpath=//button[normalize-space()='Delete']");
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
      await this.serviceMenu.click();
      await this.page.waitForTimeout(3000);

      await reportStep(this.page, "Menu clicked successfully", "pass");
    } catch (e) {
      await reportStep(this.page, "Menu clicked not successfully..." + e, "fail");
    }
    return this;
  }

  async clickServiceMenuBtn() {
    try {
      await this.page.waitForTimeout(2000);
      await this.configurationMenu.click();
      await this.page.waitForTimeout(8000);
      await this.caseOrigin.click();
      await this.page.waitForTimeout(2000);

      await reportStep(this.page, "Services menu is clicked successfully", "pass");
    } catch (e) {
      await reportStep(this.page, "Services menu is not clicked successfully..." + e, "fail");
    }
    return this;
  }

  async clickCreateBtn() {
    try {
      await this.createBtn.click({ timeout: 30 * 1000 });
      await this.page.waitForTimeout(5000);
      await this.name.fill("laundry");
      await this.saveBtn.click();
      await this.page.waitForTimeout(3000);
      // await this.selectCategory.click();
      await this.selectCategory.evaluate((node) => node.click());
      await this.page.waitForTimeout(3000);
      await this.action.click();
      await this.page.waitForTimeout(3000);
      await this.export.click();
      await this.page.waitForTimeout(3000);
      await this.confirmExport.click();
      await this.closeBtn.click();
      await this.page.waitForTimeout(3000);
      await this.action1.click();
      await this.page.waitForTimeout(3000);
      await this.duplicate.click();
      await this.page.waitForTimeout(3000);
      await this.selectCategory1.evaluate((node) => node.click());
      await this.action2.click();
      await this.page.waitForTimeout(3000);
      await this.archive.click();
      await this.confirmArchive.click();
      await this.page.waitForTimeout(3000);
      await this.selectCategory2.evaluate((node) => node.click());
      await this.action3.click();
      await this.page.waitForTimeout(3000);
      await this.delete.click();
      await this.confirmDelete.click();
      await this.page.waitForTimeout(3000);

      await reportStep(this.page, "Create Btn is clicked successfully", "pass");
    } catch (e) {
      await reportStep(this.page, "Create Btn is not clicked successfully..." + e, "fail");
    }
    return this;
  }

  async clickCaseType() {
    try {
      await this.configurationMenu1.click();
      await this.page.waitForTimeout(8000);
      await this.caseType.click();
      await this.createBtn1.click({ timeout: 30 * 1000 });
      await this.page.waitForTimeout(5000);
      await this.nameButton.fill("laundry");
      await this.saveButton.click();
      await this.page.waitForTimeout(3000);
      // await this.selectCategory.click();
      await this.selectCategory.evaluate((node) => node.click());
      await this.page.waitForTimeout(3000);
      await this.actionButton.click();
      await this.page.waitForTimeout(3000);
      await this.exportButton.click();
      await this.page.waitForTimeout(3000);
      await this.confirmExportButton.click();
      await this.page.waitForTimeout(3000);
      await this.closeButton.click();
      await this.action1Button.click();
      await this.page.waitForTimeout(3000);
      await this.duplicateButton.click();
      await this.page.waitForTimeout(3000);
      await this.selectCategory1.evaluate((node) => node.click());
      await this.action2Button.click();
      await this.page.waitForTimeout(3000);
      await this.archiveButton.click();
      await this.confirmArchiveButton.click();
      await this.page.waitForTimeout(3000);
      await this.selectCategory2.evaluate((node) => node.click());
      await this.action3Button.click();
      await this.page.waitForTimeout(3000);
      await this.deleteButton.click();
      await this.confirmDeleteButton.click();
      await this.page.waitForTimeout(3000);

      await reportStep(this.page, "Create Btn is clicked successfully", "pass");
    } catch (e) {
      await reportStep(this.page, "Create Btn is not clicked successfully..." + e, "fail");
    }
    return this;
  }
}

module.exports = { ConfigurationSetting };
