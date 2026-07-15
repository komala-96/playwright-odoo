const { reportStep } = require('../utils/reportStep');
const { waitVisible } = require('../utils/waitVisible');

class ActivityPlanConfigPage {
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
    this.clickActivityPlan = page.locator("xpath=//a[normalize-space()='Activity Plan']");

    this.newBtn = page.locator("xpath=//button[normalize-space()='New']");

    this.name = page.locator("xpath=//textarea[@id='name_0']");

    this.addaLine = page.locator("xpath=//a[normalize-space()='Add a line']");

    this.plan = page.locator("xpath=//input[@id='plan_id_0']");
    this.planSelect = page.locator("xpath=//a[@id='plan_id_0_0_0']");

    this.type = page.locator("xpath=//input[@id='activity_type_id_0']");
    this.typeSelect = page.locator("xpath=//a[@id='activity_type_id_0_0_0']");

    this.delay = page.locator("xpath=//select[@id='delay_unit_0']");
    this.assignment = page.locator("xpath=//select[@id='responsible_type_0']");

    this.sequence = page.locator("xpath=//input[@id='sequence_0']");
    this.interval = page.locator("xpath=//input[@id='delay_count_0']");
    this.summary = page.locator("xpath=//input[@id='summary_0']");

    this.assignedTo = page.locator("xpath=//input[@id='responsible_id_0']");
    this.assignedToSelect = page.locator("xpath=//a[@id='responsible_id_0_0_0']");

    this.notes = page.locator("xpath=//div[@name='note']//div[@class='flex-grow-1 overflow-auto']");
    this.notesDesc = page.locator("xpath=//div[@placeholder='Type \"/\" for commands']");

    this.saveAndClose = page.locator("xpath=//button[normalize-space()='Save & Close']");

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
      await waitVisible(this.userName);
      await this.userName.fill(String(user));
      await waitVisible(this.passWord);
      await this.passWord.fill(String(pass));
      await waitVisible(this.logIn);
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
      await waitVisible(this.employeeMenu);
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
      await waitVisible(this.clickConfigration);
      await this.clickConfigration.click();
      await this.page.waitForTimeout(2000);
      await waitVisible(this.clickActivityPlan);
      await this.clickActivityPlan.click();
      await this.page.waitForTimeout(2000);

      await reportStep(this.page, "Financial Accounting menu is clicked successfully", "pass");
    } catch (e) {
      await reportStep(this.page, "Financial Accounting menu is not clicked successfully..." + e, "fail");
    }
    return this;
  }

  async clickNew() {
    try {
      await waitVisible(this.newBtn);
      await this.newBtn.click({ timeout: 20 * 1000 });
      await reportStep(this.page, "New Sales Team button clicked", "pass");
    } catch (e) {
      await reportStep(this.page, "New Sales Team button NOT clicked..." + e, "fail");
    }
    return this;
  }

  async createSalesTeam(teamName) {
    try {
      await waitVisible(this.name);
      await this.name.fill("test1");
      await waitVisible(this.addaLine);
      await this.addaLine.click();
      await waitVisible(this.plan);
      await this.plan.click();
      await waitVisible(this.planSelect);
      await this.planSelect.click();
      await waitVisible(this.type);
      await this.type.click();
      await waitVisible(this.typeSelect);
      await this.typeSelect.click();

      await waitVisible(this.delay);
      await this.delay.click();
      await waitVisible(this.delay);
      await this.delay.selectOption({ index: 1 });

      await waitVisible(this.assignment);
      await this.assignment.click();
      await waitVisible(this.assignment);
      await this.assignment.selectOption({ index: 1 });

      await waitVisible(this.sequence);
      await this.sequence.fill("2");
      await waitVisible(this.interval);
      await this.interval.fill("5");
      await waitVisible(this.summary);
      await this.summary.fill("test");
      await this.page.waitForTimeout(3000);

      await waitVisible(this.assignedTo);
      await this.assignedTo.click();
      await this.page.waitForTimeout(3000);

      await waitVisible(this.assignedToSelect);
      await this.assignedToSelect.evaluate((node) => node.click());
      await this.page.waitForTimeout(3000);

      await waitVisible(this.saveAndClose);
      await this.saveAndClose.click();
      await this.page.waitForTimeout(3000);

      await waitVisible(this.saveBtn);
      await this.saveBtn.click();
      await waitVisible(this.action);
      await this.action.click();
      await this.page.waitForTimeout(3000);
      await waitVisible(this.duplicate);
      await this.duplicate.click();
      await this.page.waitForTimeout(3000);
      await waitVisible(this.action2);
      await this.action2.click();
      await this.page.waitForTimeout(3000);
      await waitVisible(this.delete);
      await this.delete.click();
      await this.page.waitForTimeout(3000);
      await waitVisible(this.confirmDelete);
      await this.confirmDelete.click();
      await this.page.waitForTimeout(3000);
      await waitVisible(this.action1);
      await this.action1.click();
      await this.page.waitForTimeout(3000);
      await waitVisible(this.archive);
      await this.archive.click();
      await this.page.waitForTimeout(3000);
      await waitVisible(this.confirmArchive);
      await this.confirmArchive.click();
      await this.page.waitForTimeout(3000);

      await reportStep(this.page, "Sales Team created successfully", "pass");
    } catch (e) {
      await reportStep(this.page, "Sales Team creation failed..." + e, "fail");
    }
    return this;
  }
}

module.exports = { ActivityPlanConfigPage };
