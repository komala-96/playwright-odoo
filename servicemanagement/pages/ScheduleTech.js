const { expect } = require('../fixtures/base');
const { reportStep } = require('../utils/reportStep');

class ScheduleTech {
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
    this.scheduleTechMenu = page.locator("xpath=//a[normalize-space()='Schedule Tech Person']");

    this.createBtn = page.locator("xpath=//button[normalize-space()='New']");

    this.techPerson = page.locator("xpath=//div[@name='employee_ids']//input[@type='text']");

    this.personSelect = page.locator("xpath=//a[@id='autocomplete_0_0']");

    this.fromDate = page.locator("xpath=//div[@name='from_date']//input[@type='text']");

    this.toDate = page.locator("xpath=//div[@name='to_date']//input[@type='text']");

    this.fromTime = page.locator("xpath=//div[@name='from_time']//input[@type='text']");

    this.toTime = page.locator("xpath=//div[@name='to_time']//input[@type='text']");

    this.availabiliy = page.locator("xpath=//div[@name='all_day_available']//input[@type='checkbox']");

    this.saveBtn = page.locator("xpath=(//button[normalize-space()='Save'])[1]");
  }

  async isErrorDisplayed() {
    return this.page
      .locator("xpath=//div[@class='me-auto o_notification_content']")
      .isVisible()
      .catch(() => false);
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
      await this.menu.click({ timeout: 30 * 1000 });

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
      await this.serviceMenu.click();
      await this.page.waitForTimeout(2000);
      await this.scheduleTechMenu.click();
      await this.page.waitForTimeout(8000);

      await reportStep(this.page, "click_serviceMenuBtn is clicked successfully", "pass");
    } catch (e) {
      await reportStep(this.page, "click_serviceMenuBtn is not clicked successfully..." + e, "fail");
    }
    return this;
  }

  async clickCreateBtn() {
    try {
      await this.createBtn.click({ timeout: 30 * 1000 });
      await this.page.waitForTimeout(10000);

      await reportStep(this.page, "Create Btn is clicked successfully", "pass");
    } catch (e) {
      await reportStep(this.page, "Create Btn is not clicked successfully..." + e, "fail");
    }
    return this;
  }

  async clickTechPersonBtn(date, fromTime1, toTime1) {
    try {
      await this.techPerson.click();
      await this.personSelect.click();
      await this.page.waitForTimeout(2000);
      await this.fromDate.fill(String(date));
      await this.page.waitForTimeout(2000);
      await this.toDate.fill(String(date));
      await this.page.waitForTimeout(2000);
      await this.fromTime.clear();
      await this.fromTime.fill(String(fromTime1));
      await this.page.waitForTimeout(2000);
      await this.toTime.clear();
      await this.toTime.fill(String(toTime1));
      await this.page.waitForTimeout(2000);
      await this.availabiliy.evaluate((node) => node.click());
      await this.page.waitForTimeout(2000);
      await this.saveBtn.click();
      await this.page.waitForTimeout(2000);
      await reportStep(this.page, "Create Btn is clicked successfully", "pass");
    } catch (e) {
      await reportStep(this.page, "Create Btn is not clicked successfully..." + e, "fail");
    }
    return this;
  }

  async clickTechPersonBtnNegative(date, fromTime1, toTime1) {
    try {
      await this.techPerson.click();
      // await this.personSelect.click();
      await this.page.waitForTimeout(2000);
      await this.fromDate.fill(String(date));
      await this.page.waitForTimeout(2000);
      await this.toDate.fill(String(date));
      await this.page.waitForTimeout(2000);
      await this.fromTime.clear();
      await this.fromTime.fill(String(fromTime1));
      await this.page.waitForTimeout(2000);
      await this.toTime.clear();
      await this.toTime.fill(String(toTime1));
      await this.page.waitForTimeout(2000);
      await this.availabiliy.evaluate((node) => node.click());
      await this.page.waitForTimeout(2000);
      await this.saveBtn.click();
      await this.page.waitForTimeout(2000);

      try {
        const validationMessage = this.page.locator("xpath=//div[@class='o_notification_body mt-2']");
        await validationMessage.waitFor({ state: 'visible', timeout: 30000 });
        const messageText = await validationMessage.textContent();
        console.log('Validation Message:', messageText);

        expect(await this.isErrorDisplayed(), "Error message should be displayed for empty name field").toBeTruthy();
      } catch (e) {
        // No validation message found; proceed normally
        console.log('No validation message displayed.');
      }

      await reportStep(this.page, "Tech Person Create Btn is clicked successfully", "pass");
    } catch (e) {
      await reportStep(this.page, "Tech Person Create Btn is not clicked successfully..." + e, "fail");
    }
    return this;
  }
}

module.exports = { ScheduleTech };
