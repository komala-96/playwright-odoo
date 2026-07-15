const { reportStep } = require('../utils/reportStep');
const { ensureLoggedIn } = require('../utils/loginHelper');

class MicroMarketServices_FeaturedProducts {
  constructor(page) {
    this.page = page;

    // Login Page
    this.userName = page.locator("xpath=//input[@id='login']");
    this.passWord = page.locator("xpath=//input[@id='password']");
    this.logIn = page.locator("xpath=//div//button[@type='submit']");

    this.menu = page.locator("xpath=//ul[@class='o_menu_apps']//i[@class='fa fa-bars']");

    this.microMarketServices = page.locator("xpath=//a[@role='menuitem']//img[@title='Micro Market Services']");

    this.FeaturedProducts = page.locator("xpath=//a[@role='menuitem']//span[contains(text(),'Featured Products')]");

    // NOTE: Java field was named "TableCheckBox", same as the TableCheckBox() method below.
    // That's legal in Java (separate field/method namespaces) but would shadow the
    // prototype method in JS, so the locator field is renamed to TableCheckBoxEl here.
    this.TableCheckBoxEl = page.locator(
      "xpath=//table[@class='o_list_table table table-sm table-hover table-striped o_list_table_ungrouped']//thead//tr//th[1]//div//input[@type='checkbox']"
    );

    this.actionBtn = page.locator("xpath=//div[@class='btn-group o_dropdown']//button[contains(text(),'Action')]");

    this.exportOption = page.locator("xpath=//div[@role='menu']//a[contains(text(),'Export')]");

    this.exportBtn = page.locator("xpath=//button[@type='button']//span[contains(text(),'Export')]");
  }

  async loginIfNeeded(user, pass) {
    await ensureLoggedIn(this, user, pass);
    return this;
  }

  async enter_Username(user) {
    try {
      await this.userName.fill(String(user));

      await reportStep(this.page, "username is entered successfully", "pass");
    } catch (e) {
      await reportStep(this.page, "username is not entered successfully..." + e, "fail");
    }
    return this;
  }

  async enter_Password(pass) {
    try {
      await this.passWord.fill(String(pass));

      await reportStep(this.page, "Password is entered successfully", "pass");
    } catch (e) {
      await reportStep(this.page, "Password is not entered successfully..." + e, "fail");
    }
    return this;
  }

  async click_Login_Button() {
    try {
      // driver.switchTo().alert().dismiss();
      await this.logIn.click();
      await this.page.waitForTimeout(4000);

      await reportStep(this.page, "Login button is clicked successfully", "pass");
    } catch (e) {
      await reportStep(this.page, "Login button is not clicked successfully..." + e, "fail");
    }

    return this;
  }

  async click_Menu() {
    try {
      await this.page.waitForTimeout(4000);
      await this.menu.click({ timeout: 30 * 1000 });
      await this.page.waitForTimeout(10000);

      await reportStep(this.page, "Menu clicked is successfully", "pass");
    } catch (e) {
      await reportStep(this.page, "Menu clicked is not successfully..." + e, "fail");
    }
    return this;
  }

  async microMarketServicesMenu() {
    try {
      await this.page.waitForTimeout(4000);
      await this.microMarketServices.click({ timeout: 30 * 1000 });
      await this.page.waitForTimeout(10000);

      await this.FeaturedProducts.click();
      await this.page.waitForTimeout(8000);

      await reportStep(this.page, "micro Market Services Menu is clicked successfully", "pass");
    } catch (e) {
      await reportStep(this.page, "micro Market Services Menu is not clicked successfully..." + e, "fail");
    }
    return this;
  }

  async TableCheckBox() {
    try {
      /*await this.page.waitForTimeout(4000);
      await this.TableCheckBoxEl.click({ timeout: 30 * 1000 });
      await this.page.waitForTimeout(10000);*/

      await this.TableCheckBoxEl.evaluate((node) => node.click());
      await this.page.waitForTimeout(5000);

      await this.actionBtn.click();
      await this.page.waitForTimeout(8000);

      await this.exportOption.click();
      await this.page.waitForTimeout(8000);

      await this.exportBtn.click();
      await this.page.waitForTimeout(10000);

      await reportStep(this.page, "action Btn is clicked successfully", "pass");
    } catch (e) {
      await reportStep(this.page, "action Btn is not clicked successfully..." + e, "fail");
    }
    return this;
  }
}

module.exports = { MicroMarketServices_FeaturedProducts };
