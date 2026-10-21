const { test } = require('@playwright/test');
const { ensureLoggedIn } = require('../utils/loginHelper');

// Ported from src/main/java/pages/Agreements.java.
// Selenium's @FindBy xpaths are preserved verbatim as Playwright locators.
// PageFactory/@CacheLookup have no equivalent needed: Playwright locators
// re-query the DOM on every action, so there's no stale-element risk to guard against.
class Agreements {
  constructor(page) {
    this.page = page;

    // Login Page
    this.userName = page.locator("xpath=//input[@id='login']");
    this.passWord = page.locator("xpath=//input[@id='password']");
    this.logIn = page.locator("xpath=//button[@type='submit']");

    this.menu = page.locator("xpath=//ul[@class='o_menu_apps']//i[@class='fa fa-bars']");
    this.customerCareMenuBtn = page.locator("xpath=//div[contains(text(),'Customer Care')]");

    this.searchBox = page.locator(
      "xpath=//div[@class='o_searchview_input_container d-flex flex-grow-1 flex-wrap gap-1 mw-100']//input[@type='text']"
    );
    this.customerSelect = page.locator(
      "xpath=//table[@class='o_list_table table table-sm table-hover position-relative mb-0 o_list_table_ungrouped table-striped']//tbody//tr[1]//td[2]"
    );

    this.edit = page.locator("xpath=//button[contains(text(),'Edit')]");

    this.agreementSelect = page.locator(
      "xpath=//div[@name='contracts_count']//span[@class='o_stat_text'][normalize-space()='Agreements']"
    );
    this.newBtn = page.locator("xpath=//button[normalize-space()='New']");

    // Dark Chocolate
    this.reference = page.locator("xpath=//input[@placeholder='Contract Reference']");

    this.startDate = page.locator("xpath=//input[@id='date_start_0']");
    this.endDate = page.locator("xpath=//input[@id='date_end_0']");
    this.notes = page.locator("xpath=//textarea[@id='notes_0']");

    // Dark Chocolate
    this.saveBtn = page.locator("xpath=//button[normalize-space()='Save']");

    this.backBtn = page.locator("xpath=//a[normalize-space()='Customer Agreements']");

    this.addRunning = page.locator("xpath=(//i[@title='Quick add'])[2]");
    this.addTitle = page.locator("xpath=//input[@id='display_name_0']");
    this.editBtn = page.locator("xpath=//button[normalize-space()='Edit']");
    this.endDate1 = page.locator("xpath=//input[@id='date_end_0']");
    this.notes1 = page.locator("xpath=//textarea[@id='notes_0']");
    this.saveAndCloseBtn = page.locator("xpath=//button[normalize-space()='Save & Close']");

    this.clickRunning = page.locator(
      "xpath=//div[@class='o_content']//div[2]//article[1]//div[1]//div[2]//div[1]//strong[1]//span[1]"
    );

    this.expiredBtn = page.locator("xpath=//button[normalize-space()='Expired']");
    this.cancelledBtn = page.locator("xpath=//button[normalize-space()='Cancelled']");
    this.actionBtn = page.locator("xpath=//button[normalize-space()='Action']");
    this.deleteBtn = page.locator("xpath=//span[normalize-space()='Delete']");
    this.confirmDelete = page.locator("xpath=//button[normalize-space()='Delete']");
  }

  async #isErrorDisplayed() {
    return this.page.locator("xpath=//div[@class='o_notification_content']").isVisible();
  }

  async clickLoginPage(user, pass) {
    return test.step('login is entered successfully', async () => {
      await this.userName.fill(user);
      await this.passWord.fill(pass);
      await this.logIn.click();
      return this;
    });
  }

  async loginIfNeeded(user, pass) {
    await ensureLoggedIn(this, user, pass);
    return this;
  }

  async click_CustomerCareBtn() {
    return test.step('Customer Care is clicked successfully', async () => {
      await this.customerCareMenuBtn.click({ timeout: 30_000 });
      return this;
    });
  }

  async ProductADDMenu_CustomerCare(CustomerName) {
    return test.step('customerSelect is clicked successfully', async () => {
      await this.searchBox.fill(CustomerName);
      await this.searchBox.press('Enter');
      await this.customerSelect.click();
      // this.edit.click();
      return this;
    });
  }

  async NewAgreement(date, date1) {
    return test.step('NewAgreement is clicked successfully', async () => {
      await this.agreementSelect.click();
      await this.newBtn.click();
      await this.reference.fill('Customer agreement');
      await this.startDate.fill(date);
      await this.endDate.fill(date1);
      await this.notes.fill('test notes');
      await this.saveBtn.click();
      await this.actionBtn.click();
      await this.deleteBtn.click();
      await this.confirmDelete.click();
      return this;
    });
  }

  async RunningAgreement(date, date1) {
    return test.step('NewAgreement is clicked successfully', async () => {
      // await this.backBtn.click();
      await this.addRunning.click();
      await this.addTitle.fill('Running agreement');
      await this.editBtn.click();
      await this.endDate1.fill(date1);
      await this.notes1.fill('test notes');
      // await this.saveAndCloseBtn.click();
      // await this.clickRunning.click();
      await this.expiredBtn.click();
      await this.cancelledBtn.click();
      return this;
    });
  }
}

module.exports = { Agreements };
