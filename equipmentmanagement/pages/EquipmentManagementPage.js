const { reportStep } = require('../utils/reportStep');

class EquipmentManagementPage {
  constructor(page) {
    this.page = page;

    // Login Page
    this.userName = page.locator("xpath=//input[@name='login']");
    this.passWord = page.locator("xpath=//input[@name='password']");
    this.logIn = page.locator("xpath=//div//button[@type='submit']");

    // Menu
    this.menu = page.locator("xpath=//ul[@class='o_menu_apps']//i[@class='fa fa-bars']");
    this.equipmentManagement = page.locator("xpath=//div[contains(text(),'Equipment Management')]");

    this.equipment = page.locator("xpath=//a[normalize-space()='Equipment']");

    this.remove = page.locator("xpath=//button[@title='Remove']");

    // Ware house action click
    this.searchBox = page.locator("xpath=//input[@placeholder='Search...']");

    this.equipClick = page.locator("xpath=//article[1]");

    // equipmentType
    this.recurringDetails = page.locator("xpath=//a[normalize-space()='Recurring Details']");

    // Equipment Name
    this.recurringName = page.locator("xpath=//input[@id='recurring_name_0']");

    // Equipment Name
    this.nameSelect = page.locator("xpath=//a[@id='recurring_name_0_0_0']");

    this.configuration = page.locator("xpath=//button[@name='create_recurring_frequency']");

    this.weekly = page.locator("xpath=//label[normalize-space()='Weekly']");

    this.days = page.locator("xpath=//select[@id='days1_0']");

    this.daySelect = page.locator("xpath=(//input[@name='radio_field_1'])[2]");

    this.save = page.locator("xpath=(//button[normalize-space()='Save'])[2]");

    this.configuration1 = page.locator("xpath=//button[@name='create_recurring_frequency']");

    this.monthly = page.locator("xpath=//label[normalize-space()='Monthly']");

    this.month = page.locator("xpath=//select[@id='month_day_ints_0']");

    this.daysOfMonth = page.locator("xpath=//input[@id='month_day_0']");

    this.daysOfMonthSelect = page.locator("xpath=//a[@id='month_day_0_0_0']");

    this.save1 = page.locator("xpath=(//button[normalize-space()='Save'])[2]");

    this.configuration2 = page.locator("xpath=//button[@name='create_recurring_frequency']");

    this.yearly = page.locator("xpath=//label[normalize-space()='Yearly']");

    this.daysOfYear = page.locator("xpath=//input[@id='month_day_1']");

    this.daysOfYearSelect = page.locator("xpath=//a[@id='month_day_1_0_0']");

    this.save2 = page.locator("xpath=(//button[normalize-space()='Save'])[2]");

    //
    this.deleteRecurring = page.locator("xpath=//span[normalize-space()='Delete Recurring']");

    this.okBtn = page.locator("xpath=//button[normalize-space()='Ok']");

    // select
    this.action = page.locator("xpath=//button[normalize-space()='Action']");

    // select
    this.delete = page.locator("xpath=//span[normalize-space()='Delete']");

    // sendkeys
    this.confirmDelete = page.locator("xpath=//button[normalize-space()='Delete']");

    this.notes = page.locator("xpath=//span[normalize-space()='Notes']");

    this.addaLine = page.locator("xpath=//a[normalize-space()='Add a line']");

    this.message = page.locator("xpath=//div[@name='message']//input[@type='text']");

    this.saveandClose = page.locator("xpath=//button[normalize-space()='Save & Close']");

    this.saveNotes = page.locator("xpath=//button[normalize-space()='Save Note']");

    this.equipmentActivity = page.locator("xpath=//span[normalize-space()='Activity History']");

    this.discard = page.locator("xpath=//span[normalize-space()='Close']");

    this.activity = page.locator("xpath=//span[normalize-space()='Equipment Activity']");

    this.customer = page.locator("xpath=//input[@id='transfer_location_partner_id_0']");

    this.customerSelect = page.locator("xpath=//a[@id='transfer_location_partner_id_0_0_0']");

    this.microMarket = page.locator("xpath=//input[@id='transfer_micro_market_id_0']");

    this.microMarketSelect = page.locator("xpath=//a[@id='transfer_micro_market_id_0_0_0']");

    this.submit = page.locator("xpath=//span[normalize-space()='Submit']");

    this.action1 = page.locator("xpath=//button[normalize-space()='Action']");

    // select
    this.delete1 = page.locator("xpath=//span[normalize-space()='Delete']");

    // sendkeys
    this.confirmDelete1 = page.locator("xpath=//button[normalize-space()='Delete']");

    this.activityHistory = page.locator("xpath=//span[normalize-space()='Activity History']");

    this.close = page.locator("xpath=//span[normalize-space()='Close']");
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
      // Thread.sleep(10000);
      await this.logIn.click();

      await reportStep(this.page, "login button clicked successfully", "pass");
    } catch (e) {
      await reportStep(this.page, "login button clicked not successfully..." + e, "fail");
    }
    return this;
  }

  async clickMenu() {
    try {
      await this.menu.click({ timeout: 30 * 1000 });

      await reportStep(this.page, "Menu_Button is clicked successfully", "pass");
    } catch (e) {
      await reportStep(this.page, "Menu_Button is clicked not successfully..." + e, "fail");
    }
    return this;
  }

  async equipmentMenu() {
    try {
      await this.equipmentManagement.click({ timeout: 30 * 1000 });

      await this.equipment.click({ timeout: 10 * 1000 });

      await this.remove.click();
      await this.searchBox.fill("44568");
      await this.equipClick.click();
      await this.recurringDetails.click();
      await this.recurringName.click();
      // await this.recurringName.fill("test");
      await this.nameSelect.click();
      await this.configuration.click();
      await this.weekly.click();

      await this.days.selectOption({ label: '1' });
      // await this.daySelect.click();
      await this.save.click();
      await this.page.waitForTimeout(5000);

      await reportStep(this.page, "Equipment_Menu is clicked successfully", "pass");
    } catch (e) {
      await reportStep(this.page, "Equipment_Menu is not clicked successfully..." + e, "fail");
    }
    return this;
  }

  async equipmentMonthly() {
    try {
      await this.page.waitForTimeout(2000);
      await this.configuration1.click();
      await this.page.waitForTimeout(2000);
      await this.monthly.click();
      await this.daysOfMonth.click();
      await this.daysOfMonthSelect.click();
      await this.page.waitForTimeout(2000);
      await this.month.fill("1");
      await this.month.selectOption({ label: '1' });
      await this.save1.click();
      await this.page.waitForTimeout(2000);

      await reportStep(this.page, "Equipment_Menu is clicked successfully", "pass");
    } catch (e) {
      await reportStep(this.page, "Equipment_Menu is not clicked successfully..." + e, "fail");
    }
    return this;
  }

  async equipmentYearly() {
    try {
      await this.page.waitForTimeout(2000);
      await this.configuration2.click();
      await this.yearly.click();
      await this.daysOfYear.click();
      await this.daysOfYearSelect.click();
      await this.page.waitForTimeout(2000);
      await this.save2.click();
      await this.page.waitForTimeout(2000);
      await this.deleteRecurring.click();
      await this.okBtn.click();
      await this.page.waitForTimeout(2000);
      await this.action1.click();
      await this.delete1.click();
      await this.page.waitForTimeout(2000);
      await this.confirmDelete1.click();
      await this.page.waitForTimeout(2000);

      await reportStep(this.page, "Equipment_Menu is clicked successfully", "pass");
    } catch (e) {
      await reportStep(this.page, "Equipment_Menu is not clicked successfully..." + e, "fail");
    }
    return this;
  }

  async clickEditBtn() {
    try {
      await this.notes.click();
      await this.page.waitForTimeout(2000);
      await this.addaLine.click();
      await this.message.fill("test");
      await this.saveandClose.click();
      await this.page.waitForTimeout(2000);
      await this.saveNotes.click();
      await this.page.waitForTimeout(2000);
      await this.equipmentActivity.click();
      await this.discard.click();
      await this.page.waitForTimeout(2000);
      await this.activity.click();
      await this.page.waitForTimeout(2000);
      await this.customer.click();
      await this.customer.fill("komala");
      await this.page.waitForTimeout(2000);
      await this.customerSelect.click();
      await this.page.waitForTimeout(2000);
      await this.microMarket.click();
      await this.microMarketSelect.click();
      await this.page.waitForTimeout(2000);
      await this.submit.click();
      await this.page.waitForTimeout(2000);
      await this.activityHistory.click();
      await this.close.click();
      await this.page.waitForTimeout(2000);

      await reportStep(this.page, "Edit Btn is clicked successfully", "pass");
    } catch (e) {
      await reportStep(this.page, "Edit Btn is not clicked successfully..." + e, "fail");
    }
    return this;
  }
}

module.exports = { EquipmentManagementPage };
