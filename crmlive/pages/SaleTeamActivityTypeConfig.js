const { reportStep } = require('../utils/reportStep');

class SaleTeamActivityTypeConfig {
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
    this.clickActivityTypes = page.locator("xpath=//a[@role='menuitem'][normalize-space()='Activity Types']");

    this.newBtn1 = page.locator("xpath=//button[normalize-space()='New']");
    this.activityTypeName1 = page.locator("xpath=//textarea[@id='name_0']");
    this.actionSelect1 = page.locator("xpath=//select[@id='category_0']");
    this.userField1 = page.locator("xpath=//input[@id='default_user_id_0']");
    this.usersFieldSelect1 = page.locator("xpath=//a[@id='default_user_id_0_0_0']");

    this.summary1 = page.locator("xpath=//input[@id='summary_0']");

    this.trigger = page.locator("xpath=//input[@id='triggered_next_type_id_0']");
    this.triggerSelect = page.locator("xpath=//a[@id='triggered_next_type_id_0_0_0']");
    this.calendar1 = page.locator("xpath=//select[@id='delay_unit_0']");
    this.schedule1 = page.locator("xpath=//select[@id='delay_from_0']");
    this.doneCheckBox1 = page.locator("xpath=//input[@id='keep_done_0']");

    this.notes1 = page.locator("xpath=//div[@class='flex-grow-1 overflow-auto']");
    this.notes1Desc = page.locator("xpath=//div[@placeholder='Type \"/\" for commands']");

    this.saveBtn1 = page.locator("xpath=//button[normalize-space()='Save']");

    this.action3 = page.locator("xpath=//button[normalize-space()='Action']");
    this.duplicate1 = page.locator("xpath=//span[normalize-space()='Duplicate']");
    this.action4 = page.locator("xpath=//button[normalize-space()='Action']");
    this.archive1 = page.locator("xpath=//span[normalize-space()='Archive']");
    this.confirmArchive1 = page.locator("xpath=//button[normalize-space()='Archive']");
    this.action5 = page.locator("xpath=//button[normalize-space()='Action']");
    this.delete1 = page.locator("xpath=//span[normalize-space()='Delete']");
    this.confirmDelete1 = page.locator("xpath=//button[normalize-space()='Delete']");

    this.newBtn = page.locator("xpath=//button[normalize-space()='New']");
    this.activityTypeName = page.locator("xpath=//textarea[@id='name_0']");
    this.actionSelect = page.locator("xpath=//select[@id='category_0']");
    this.userField = page.locator("xpath=//input[@id='default_user_id_0']");
    this.usersFieldSelect = page.locator("xpath=//a[@id='default_user_id_0_0_0']");

    this.summary = page.locator("xpath=//input[@id='summary_0']");

    this.chainingType = page.locator("xpath=//select[@id='chaining_type_0']");
    this.suggest = page.locator("xpath=//input[@id='suggested_next_type_ids_0']");
    this.suggestSelect = page.locator("xpath=//a[@id='suggested_next_type_ids_0_0_0']");
    this.calendar = page.locator("xpath=//select[@id='delay_unit_0']");
    this.schedule = page.locator("xpath=//select[@id='delay_from_0']");
    this.doneCheckBox = page.locator("xpath=//input[@id='keep_done_0']");

    this.notes = page.locator("xpath=//div[@class='flex-grow-1 overflow-auto']");
    this.notesDesc = page.locator("xpath=//div[@placeholder='Type \"/\" for commands']");

    this.saveBtn = page.locator("xpath=//button[normalize-space()='Save']");

    this.action = page.locator("xpath=//button[normalize-space()='Action']");
    this.duplicate = page.locator("xpath=//span[normalize-space()='Duplicate']");
    this.action1 = page.locator("xpath=//button[normalize-space()='Action']");
    this.archive = page.locator("xpath=//span[normalize-space()='Archive']");
    this.confirmArchive = page.locator("xpath=//button[normalize-space()='Archive']");
    this.action2 = page.locator("xpath=//button[normalize-space()='Action']");
    this.delete = page.locator("xpath=//span[normalize-space()='Delete']");
    this.confirmDelete = page.locator("xpath=//button[normalize-space()='Delete']");
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
      await this.clickActivityTypes.click();
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
      await this.activityTypeName.waitFor({ state: 'visible', timeout: 20 * 1000 });
      await this.activityTypeName.fill(String(teamName));

      await this.actionSelect.selectOption({ index: 1 });

      await this.userField.click();
      await this.page.waitForTimeout(1000); // if dropdown suggestion pops, add Select logic later
      // usersFieldSelect.click();
      await this.usersFieldSelect.evaluate((node) => node.click());
      await this.page.waitForTimeout(1000);
      await this.summary.fill("test");
      await this.page.waitForTimeout(1000);

      await this.chainingType.selectOption({ index: 1 });
      await this.page.waitForTimeout(1000);
      await this.suggest.click();
      // suggestSelect.click();
      await this.suggestSelect.evaluate((node) => node.click());
      await this.page.waitForTimeout(1000);
      await this.calendar.selectOption({ index: 1 });
      await this.page.waitForTimeout(1000);
      await this.schedule.selectOption({ index: 1 });
      await this.page.waitForTimeout(1000);
      await this.doneCheckBox.evaluate((node) => node.click());
      await this.page.waitForTimeout(1000);
      await this.notes.click();
      await this.notesDesc.fill("test");
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

  async createSalesTeam1(teamName) {
    try {
      await this.page.waitForTimeout(2000);
      await this.newBtn1.click();
      await this.page.waitForTimeout(2000);
      await this.activityTypeName1.waitFor({ state: 'visible', timeout: 20 * 1000 });
      await this.activityTypeName1.fill(String(teamName));
      await this.page.waitForTimeout(2000);
      await this.actionSelect1.selectOption({ index: 2 });
      await this.page.waitForTimeout(2000);
      await this.userField1.click();
      await this.page.waitForTimeout(1000); // if dropdown suggestion pops, add Select logic later
      // usersFieldSelect.click();
      await this.usersFieldSelect1.evaluate((node) => node.click());
      await this.page.waitForTimeout(1000);
      await this.summary1.fill("test");
      await this.page.waitForTimeout(1000);

      await this.trigger.click();
      await this.page.waitForTimeout(1000);
      await this.triggerSelect.click();
      await this.page.waitForTimeout(1000);
      await this.calendar1.selectOption({ index: 1 });
      await this.page.waitForTimeout(1000);
      await this.schedule1.selectOption({ index: 1 });
      await this.page.waitForTimeout(1000);
      await this.doneCheckBox1.evaluate((node) => node.click());
      await this.notes1.click();
      await this.notes1Desc.fill("test");
      await this.page.waitForTimeout(1000);
      await this.saveBtn1.click();
      await this.action3.click();
      await this.page.waitForTimeout(3000);
      await this.duplicate1.click();
      await this.page.waitForTimeout(3000);
      await this.action4.click();
      await this.page.waitForTimeout(3000);
      await this.delete1.click();
      await this.page.waitForTimeout(3000);
      await this.confirmDelete1.click();
      await this.page.waitForTimeout(6000);
      await this.action5.click();
      await this.page.waitForTimeout(3000);
      await this.archive1.click();
      await this.page.waitForTimeout(3000);
      await this.confirmArchive1.click();
      await this.page.waitForTimeout(3000);

      await reportStep(this.page, "Sales Team created successfully", "pass");
    } catch (e) {
      await reportStep(this.page, "Sales Team creation failed..." + e, "fail");
    }
    return this;
  }
}

module.exports = { SaleTeamActivityTypeConfig };
