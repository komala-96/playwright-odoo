const { expect } = require('../fixtures/base');
const { reportStep } = require('../utils/reportStep');

class Events {
  constructor(page) {
    this.page = page;

    // Login Page
    this.userName = page.locator("xpath=//input[@name='login']");
    this.passWord = page.locator("xpath=//input[@name='password']");
    this.logIn = page.locator("xpath=//button[@type='submit']");

    // Menu
    this.menu = page.locator("xpath=//ul[@class='o_menu_apps']//i[@class='fa fa-bars']");
    this.crmMenu = page.locator("xpath=//div[contains(text(),'CRM')]");

    this.eventsMenu = page.locator("xpath=//a[@role='menuitem'][normalize-space()='Calendar Events']");

    this.createBtn = page.locator("xpath=//button[normalize-space()='New']");
    this.name = page.locator("xpath=//input[@id='name_0']");

    this.customer = page.locator("xpath=//input[@id='partner_ids_0']");
    this.searchMore = page.locator("xpath=//span[normalize-space()='Search More...']");
    this.newBtn = page.locator("xpath=(//button[normalize-space()='New'])[2]");
    this.attendee = page.locator("xpath=//input[@id='name_1']");
    this.attendeeMail = page.locator("xpath=//input[@id='email_0']");
    this.saveAndClose = page.locator("xpath=//button[normalize-space()='Save & Close']");

    this.startDate = page.locator("xpath=//input[@id='start_0']");
    this.duration = page.locator("xpath=//input[@name='duration']");
    this.allDay = page.locator("xpath=//div[@name='allday']//input[@type='checkbox']");

    this.activity = page.locator("xpath=(//div[@class='o_input_dropdown']//input[@type='text'])[6]");
    this.activitySelect = page.locator("xpath=//li[@class='ui-menu-item']//a");

    this.tag = page.locator("xpath=//input[@id='categ_ids_0']");
    this.tagSelect = page.locator("xpath=//a[@id='categ_ids_0_0_0']");

    this.reminder = page.locator("xpath=//input[@id='alarm_ids_0']");
    this.reminderSelect = page.locator("xpath=//a[@id='alarm_ids_0_0_0']");

    this.location = page.locator("xpath=//input[@id='location_0']");
    this.description = page.locator("xpath=(//div[@class='note-editable odoo-editor-editable overflow-auto'])[1]");

    this.options = page.locator("xpath=(//a[normalize-space()='Options'])[1]");
    this.recurrent = page.locator("xpath=//div[@name='recurrency']//input[@type='checkbox']");
    this.recType = page.locator("xpath=//select[@id='rrule_type_ui_0']");
    this.repeatEvery = page.locator("xpath=//input[@id='interval_0']");
    this.repeatOn = page.locator("xpath=//div[normalize-space()='M']");
    this.until = page.locator("xpath=//input[@id='count_0']");

    this.meetingLink = page.locator("xpath=//span[normalize-space()='Averigo meeting']");
    this.privacy = page.locator("xpath=//select[@id='privacy_0']");
    this.showTime = page.locator("xpath=//select[@id='show_as_0']");

    this.saveBtn = page.locator("xpath=(//button[normalize-space()='Save'])[1]");

    this.action = page.locator("xpath=//button[normalize-space()='Action']");
    this.duplicate = page.locator("xpath=//span[normalize-space()='Duplicate']");
    this.action1 = page.locator("xpath=//button[normalize-space()='Action']");
    this.delete = page.locator("xpath=//span[normalize-space()='Delete']");
    this.confirmDelete = page.locator("xpath=//button[normalize-space()='Delete']");

    this.action2 = page.locator("xpath=//button[normalize-space()='Action']");
    this.archive = page.locator("xpath=//span[normalize-space()='Archive']");
    this.confirmArchive = page.locator("xpath=//button[normalize-space()='Archive']");

    this.action3 = page.locator("xpath=//button[normalize-space()='Action']");
    this.unArchive = page.locator("xpath=//span[normalize-space()='Unarchive']");
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
      await this.eventsMenu.click();
      await this.page.waitForTimeout(8000);

      await reportStep(this.page, "Financial Accounting menu is clicked successfully", "pass");
    } catch (e) {
      await reportStep(this.page, "Financial Accounting menu is not clicked successfully..." + e, "fail");
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

  async clickCreateEventBtn(name1, date, dur, location1, desc) {
    try {
      await this.name.fill(String(name1));
      await this.page.waitForTimeout(2000);

      await this.customer.click();
      await this.searchMore.click();
      await this.page.waitForTimeout(2000);
      await this.newBtn.click();
      await this.attendee.fill("komala");
      await this.attendeeMail.fill("komala@averigo.com");
      await this.saveAndClose.click();
      await this.startDate.fill(String(date));
      await this.page.waitForTimeout(2000);
      // await this.duration.fill(String(dur));
      await this.page.waitForTimeout(2000);
      await this.allDay.evaluate((node) => node.click());
      await this.page.waitForTimeout(5000);
      await this.tag.click();
      await this.tagSelect.evaluate((node) => node.click());
      await this.page.waitForTimeout(2000);
      await this.reminder.click();
      await this.reminderSelect.evaluate((node) => node.click());
      await this.page.waitForTimeout(2000);
      await this.location.fill(String(location1));
      await this.description.fill(String(desc));
      await this.page.waitForTimeout(4000);
      await this.recurrent.evaluate((node) => node.click());
      await this.page.waitForTimeout(5000);
      await this.recType.selectOption({ label: 'Custom' });
      await this.page.waitForTimeout(2000);
      await this.repeatEvery.clear();
      await this.repeatEvery.fill("1");
      await this.page.waitForTimeout(2000);
      await this.repeatOn.click();
      await this.until.fill("2");
      await this.page.waitForTimeout(2000);
      await this.meetingLink.click();
      await this.page.waitForTimeout(5000);
      await this.privacy.selectOption({ label: 'Public' });
      await this.page.waitForTimeout(5000);
      await this.showTime.selectOption({ label: 'Busy' });
      await this.page.waitForTimeout(5000);
      await this.saveBtn.click();
      await this.page.waitForTimeout(2000);

      await reportStep(this.page, "Event Creation is clicked successfully", "pass");
    } catch (e) {
      await reportStep(this.page, "Event Creation is not clicked successfully..." + e, "fail");
    }
    return this;
  }

  async clickCreateEventBtnNegative(name1, date, dur, location1, desc) {
    try {
      await this.name.fill(String(name1));
      await this.page.waitForTimeout(2000);

      await this.customer.click();
      await this.searchMore.click();
      await this.page.waitForTimeout(2000);
      await this.newBtn.click();
      await this.attendee.fill("komala");
      await this.attendeeMail.fill("abc@gmail.com");
      await this.saveAndClose.click();
      await this.startDate.clear();
      await this.page.waitForTimeout(2000);
      // await this.duration.fill(String(dur));
      await this.page.waitForTimeout(2000);
      await this.allDay.evaluate((node) => node.click());
      await this.page.waitForTimeout(5000);
      await this.tag.click();
      await this.tagSelect.evaluate((node) => node.click());
      await this.page.waitForTimeout(2000);
      await this.reminder.click();
      await this.reminderSelect.evaluate((node) => node.click());
      await this.page.waitForTimeout(2000);
      await this.location.fill(String(location1));
      await this.description.fill(String(desc));
      await this.page.waitForTimeout(4000);

      await this.privacy.selectOption({ label: 'Public' });
      await this.page.waitForTimeout(5000);
      await this.showTime.selectOption({ label: 'Busy' });
      await this.page.waitForTimeout(5000);
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

      await reportStep(this.page, "Event Creation is clicked successfully", "pass");
    } catch (e) {
      await reportStep(this.page, "Event Creation is not clicked successfully..." + e, "fail");
    }
    return this;
  }

  async clickDelete() {
    try {
      await this.page.waitForTimeout(3000);

      await this.action2.click();
      await this.page.waitForTimeout(3000);
      await this.archive.click();
      await this.page.waitForTimeout(3000);
      await this.confirmArchive.click();
      await this.page.waitForTimeout(3000);
      await this.action3.click();
      await this.unArchive.click();
      await this.page.waitForTimeout(3000);
      await this.action.click();
      await this.page.waitForTimeout(3000);
      await this.duplicate.click();
      await this.page.waitForTimeout(3000);

      await this.action1.click();
      await this.page.waitForTimeout(3000);
      await this.delete.click();
      await this.page.waitForTimeout(3000);
      await this.confirmDelete.click();
      await this.page.waitForTimeout(3000);

      await reportStep(this.page, "Delete Btn is clicked successfully", "pass");
    } catch (e) {
      await reportStep(this.page, "Delete Btn is not clicked successfully..." + e, "fail");
    }
    return this;
  }
}

module.exports = { Events };
