const { reportStep } = require('../utils/reportStep');

class EquipmentConfiguration {
  constructor(page) {
    this.page = page;

    // Login Page
    this.userName = page.locator("xpath=//input[@name='login']");

    this.passWord = page.locator("xpath=//input[@name='password']");

    this.logIn = page.locator("xpath=//div//button[@type='submit']");

    // Menu
    this.menu = page.locator("xpath=//ul[@class='o_menu_apps']//i[@class='fa fa-bars']");

    this.equipmentManagement = page.locator("xpath=//a[@role='menuitem']//img[@title='Equipment Management']");

    this.configurationMenu = page.locator("xpath=//nav[@class='o_main_navbar']//a[contains(text(),'Configuration')]");

    // equipmentType
    // NOTE: Java also declared an `equipmentTypeOption` WebElement field with the
    // same name as the equipmentTypeOption() method below. JS can't shadow a
    // prototype method with an instance property of the same name, so the
    // locator is named equipmentTypeOptionLink here instead.
    this.equipmentTypeOptionLink = page.locator("xpath=//a[@role='menuitem']//span[contains(text(),'Equipment Type')]");

    this.equipmentTypeCreateBtn = page.locator("xpath=//div[@class='o_list_buttons']//button[contains(text(),'Create')]");

    this.equipmentTypeName = page.locator("xpath=//input[@name='name']");

    this.equipmentTypeSaveBtn = page.locator("xpath=//div[@class='o_cp_buttons']//button[contains(text(),'Save')]");

    // equipmentName
    // NOTE: Java also declared an `equipmentNameOption` WebElement field with the
    // same name as the equipmentNameOption() method below. JS can't shadow a
    // prototype method with an instance property of the same name, so the
    // locator is named equipmentNameOptionLink here instead.
    this.equipmentNameOptionLink = page.locator("xpath=//a[@role='menuitem']//span[contains(text(),'Equipment Name')]");

    this.equipmentNameCreateBtn = page.locator("xpath=//div[@class='o_list_buttons']//button[contains(text(),'Create')]");

    this.equipmentName_Name = page.locator("xpath=//input[@name='name']");

    this.equipmentNameSaveBtn = page.locator("xpath=//div[@class='o_cp_buttons']//button[contains(text(),'Save')]");

    // Equipment Model
    // NOTE: Java also declared an `equipmentModelOption` WebElement field with the
    // same name as the equipmentModelOption() method below. JS can't shadow a
    // prototype method with an instance property of the same name, so the
    // locator is named equipmentModelOptionLink here instead.
    this.equipmentModelOptionLink = page.locator("xpath=//a[@role='menuitem']//span[contains(text(),'Equipment Model')]");

    this.equipmentModelCreateBtn = page.locator("xpath=//div[@class='o_list_buttons']//button[contains(text(),'Create')]");

    this.equipmentModel_Name = page.locator("xpath=//input[@name='name']");

    this.equipmentModelSaveBtn = page.locator("xpath=//div[@class='o_cp_buttons']//button[contains(text(),'Save')]");

    // Equipment Model Number
    // NOTE: Java also declared an `equipmentModelNumberOption` WebElement field
    // with the same name as the equipmentModelNumberOption() method below. JS
    // can't shadow a prototype method with an instance property of the same
    // name, so the locator is named equipmentModelNumberOptionLink here instead.
    this.equipmentModelNumberOptionLink = page.locator(
      "xpath=//a[@role='menuitem']//span[contains(text(),'Equipment Model Number')]"
    );

    this.equipmentModelNumberCreateBtn = page.locator("xpath=//div[@class='o_list_buttons']//button[contains(text(),'Create')]");

    this.equipmentModelNumber_Name = page.locator("xpath=//input[@name='name']");

    this.equipmentModelNumberSaveBtn = page.locator("xpath=//div[@class='o_cp_buttons']//button[contains(text(),'Save')]");
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
      await this.page.waitForTimeout(8000);

      // Use explicit wait instead of Thread.sleep()
      await this.configurationMenu.click({ timeout: 10 * 1000 });
      await this.page.waitForTimeout(5000);

      await reportStep(this.page, "Equipment_Menu is clicked successfully", "pass");
    } catch (e) {
      await reportStep(this.page, "Equipment_Menu is not clicked successfully..." + e, "fail");
    }
    return this;
  }

  async equipmentTypeOption(TypeName) {
    try {
      await this.equipmentTypeOptionLink.click({ timeout: 30 * 1000 });
      await this.page.waitForTimeout(5000);

      await this.equipmentTypeCreateBtn.click();
      await this.page.waitForTimeout(5000);

      // "GDM-26"
      await this.equipmentTypeName.fill(String(TypeName));
      await this.page.waitForTimeout(5000);

      await this.equipmentTypeSaveBtn.click();
      await this.page.waitForTimeout(5000);

      await reportStep(this.page, "equipment Type Option  is clicked successfully", "pass");
    } catch (e) {
      await reportStep(this.page, "equipment Type Option is not clicked successfully..." + e, "fail");
    }
    return this;
  }

  async equipmentNameOption(equipmentName) {
    try {
      await this.equipmentNameOptionLink.click({ timeout: 30 * 1000 });
      await this.page.waitForTimeout(5000);

      await this.equipmentNameCreateBtn.click();
      await this.page.waitForTimeout(5000);

      // "Chiller"
      await this.equipmentName_Name.fill(String(equipmentName));
      await this.page.waitForTimeout(5000);

      await this.equipmentNameSaveBtn.click();
      await this.page.waitForTimeout(5000);

      await reportStep(this.page, "equipment Name Option  is clicked successfully", "pass");
    } catch (e) {
      await reportStep(this.page, "equipment Name Option is not clicked successfully..." + e, "fail");
    }
    return this;
  }

  async equipmentModelOption(modelName_Name) {
    try {
      await this.equipmentModelOptionLink.click({ timeout: 30 * 1000 });
      await this.page.waitForTimeout(5000);

      await this.equipmentModelCreateBtn.click();
      await this.page.waitForTimeout(5000);

      // "ADA"
      await this.equipmentModel_Name.fill(String(modelName_Name));
      await this.page.waitForTimeout(5000);

      await this.equipmentModelSaveBtn.click();
      await this.page.waitForTimeout(5000);

      await reportStep(this.page, "equipment Model Option is clicked successfully", "pass");
    } catch (e) {
      await reportStep(this.page, "equipment Model Option is not clicked successfully..." + e, "fail");
    }
    return this;
  }

  async equipmentModelNumberOption(modelNoName) {
    try {
      await this.equipmentModelNumberOptionLink.click({ timeout: 30 * 1000 });
      await this.page.waitForTimeout(5000);

      await this.equipmentModelNumberCreateBtn.click();
      await this.page.waitForTimeout(5000);

      // "ADA"
      await this.equipmentModelNumber_Name.fill(String(modelNoName));
      await this.page.waitForTimeout(5000);

      await this.equipmentModelNumberSaveBtn.click();
      await this.page.waitForTimeout(5000);

      await reportStep(this.page, "equipment Model Number Option is clicked successfully", "pass");
    } catch (e) {
      await reportStep(this.page, "equipment Model Number Option is not clicked successfully..." + e, "fail");
    }
    return this;
  }
}

module.exports = { EquipmentConfiguration };
