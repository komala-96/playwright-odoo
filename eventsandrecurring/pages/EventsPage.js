const { reportStep } = require('../utils/reportStep');

class EventsPage {
  constructor(page) {
    this.page = page;

    // Login Page
    this.userName = page.locator("xpath=//input[@name='login']");
    this.passWord = page.locator("xpath=//input[@name='password']");
    this.logIn = page.locator("xpath=//button[@type='submit']");

    // Menu
    this.menu = page.locator("xpath=//ul[@class='o_menu_apps']//i[@class='fa fa-bars']");
    this.eventsMenu = page.locator("xpath=//div[contains(text(),'Events')]");

    this.createBtn = page.locator("xpath=//button[normalize-space()='New']");

    this.name = page.locator("xpath=//textarea[@id='name_0']");
    this.startDate = page.locator("xpath=//input[@id='date_begin_0']");
    this.endDate = page.locator("xpath=//input[@data-field='date_end']");
    this.language = page.locator("xpath=//select[@id='lang_0']");

    this.template = page.locator("xpath=//input[@id='event_type_id_0']");
    this.templateSelect = page.locator("xpath=//a[@id='event_type_id_0_0_0']");

    this.tagEvent = page.locator("xpath=//input[@id='tag_ids_0']");
    this.tagSelect = page.locator("xpath=//a[@id='tag_ids_0_0_0']");

    this.limitReg = page.locator("xpath=//div[@name='seats_limited']//input[@type='checkbox']");
    this.minSeats = page.locator("xpath=//input[@id='seats_max_0']");

    this.addLine = page.locator("xpath=//a[normalize-space()='Add a line']");

    this.name1 = page.locator("xpath=//div[@name='name']//input[@type='text']");
    this.saleDate = page.locator("xpath=//input[@data-field='start_sale_datetime']");
    this.salePrice = page.locator(
      "xpath=//td[@class='o_data_cell o_field_cell o_list_number']//input[@name='price']"
    );
    this.seats = page.locator("xpath=//div[@class='o_field_widget o_field_integer']//input[@type='text']");

    this.communication = page.locator("xpath=(//a[normalize-space()='Communication'])[1]");
    this.addLine1 = page.locator("xpath=//a[normalize-space()='Add a line']");

    this.emailTemplate = page.locator(
      "xpath=(//div[@class='o_field_many2one_selection']//input[@type='text'])[5]"
    );
    this.templateEmail = page.locator("xpath=(//a[normalize-space()='Event: Registration Badge'])[1]");

    this.confirmEvent = page.locator("xpath=//button[normalize-space()='Save']");
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

      await reportStep(this.page, "Events menu is clicked successfully", "pass");
    } catch (e) {
      await reportStep(this.page, "Events menu is not clicked successfully..." + e, "fail");
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

  async clickCreateEventBtn(nam, date, end, tag, seat, name_1, sale_date, price, seat1) {
    try {
      await this.name.fill(String(nam));
      await this.page.waitForTimeout(2000);

      await this.startDate.clear();
      await this.startDate.fill(String(date));
      await this.page.waitForTimeout(2000);

      await this.language.click();
      await this.language.selectOption({ label: 'English (US)' });

      await this.template.click();
      await this.page.waitForTimeout(2000);

      await this.templateSelect.click();
      await this.page.waitForTimeout(3000);

      await this.tagEvent.evaluate((node) => node.click());
      await this.page.waitForTimeout(2000);

      await this.tagSelect.evaluate((node) => node.click());
      await this.page.waitForTimeout(2000);

      await this.limitReg.evaluate((node) => node.click());

      await this.minSeats.clear();
      await this.minSeats.fill(String(seat));
      await this.page.waitForTimeout(4000);

      await this.addLine.click();
      await this.page.waitForTimeout(8000);

      await this.name1.fill(String(name_1));
      await this.page.waitForTimeout(3000);

      await this.saleDate.fill(String(sale_date));
      await this.page.waitForTimeout(3000);

      await this.page.waitForTimeout(3000);

      await this.seats.clear();
      await this.seats.fill(String(seat));
      await this.page.waitForTimeout(5000);

      await this.communication.click();
      await this.page.waitForTimeout(4000);

      await this.addLine1.click();
      await this.page.waitForTimeout(2000);

      await this.emailTemplate.click();
      await this.page.waitForTimeout(4000);

      await this.templateEmail.evaluate((node) => node.click());
      await this.page.waitForTimeout(4000);

      await this.confirmEvent.click();

      await reportStep(this.page, "Create Btn is clicked successfully", "pass");
    } catch (e) {
      await reportStep(this.page, "Create Btn is not clicked successfully..." + e, "fail");
    }
    return this;
  }
}

module.exports = { EventsPage };
