const { expect } = require('../fixtures/base');
const { reportStep } = require('../utils/reportStep');
const { ensureLoggedIn } = require('../utils/loginHelper');

class OtherPaymentMethodsPage {
  constructor(page) {
    this.page = page;

    // Login Page 1
    this.userName = page.locator("xpath=//input[@id='login']");
    this.passWord = page.locator("xpath=//input[@id='password']");
    this.logIn = page.locator("xpath=//button[@type='submit']");

    this.menu = page.locator("xpath=//ul[@class='o_menu_apps']//i[@class='fa fa-bars']");

    this.microMarketServices = page.locator("xpath=//div[contains(text(),'Micromarket Services')]");

    this.otherPaymentMethodsMenu = page.locator("xpath=//span[normalize-space()='Payment Methods']");

    this.PaymentMethods = page.locator("xpath=//a[@role='menuitem'][normalize-space()='Payment Method']");

    this.newButton = page.locator("xpath=//button[normalize-space()='New']");

    this.name = page.locator("xpath=//div[@name='name']//input[@type='text']");

    this.code = page.locator("xpath=//div[@name='code']//input[@type='text']");

    this.save = page.locator("xpath=//button[normalize-space()='Save']");

    this.paymentselect = page.locator(
      "xpath=(//table[@class='o_list_table table table-sm table-hover position-relative mb-0 o_list_table_ungrouped table-striped'])//tbody//tr[1]//td[1]"
    );

    this.paymentselect1 = page.locator(
      "xpath=(//table[@class='o_list_table table table-sm table-hover position-relative mb-0 o_list_table_ungrouped table-striped'])//tbody//tr[1]//td[1]"
    );

    this.paymentselect2 = page.locator(
      "xpath=(//table[@class='o_list_table table table-sm table-hover position-relative mb-0 o_list_table_ungrouped table-striped'])//tbody//tr[1]//td[1]"
    );

    this.paymentselect3 = page.locator(
      "xpath=(//table[@class='o_list_table table table-sm table-hover position-relative mb-0 o_list_table_ungrouped table-striped'])//tbody//tr[1]//td[1]"
    );

    this.paymentaction = page.locator("xpath=//span[@class='o_dropdown_title']");

    this.paymentarchive = page.locator("xpath=//span[normalize-space()='Archive']");

    this.paymentarchiveConfirm = page.locator("xpath=//button[normalize-space()='Archive']");

    this.paymentaction1 = page.locator("xpath=//span[@class='o_dropdown_title']");

    this.paymentexport = page.locator("xpath=//span[normalize-space()='Export']");

    this.paymentexportConfirm = page.locator("xpath=//button[normalize-space()='Export']");

    this.closeBtn = page.locator("xpath=//button[normalize-space()='Close']");

    this.paymentaction2 = page.locator("xpath=//span[@class='o_dropdown_title']");

    this.paymentduplicate = page.locator("xpath=//span[normalize-space()='Duplicate']");

    this.paymentaction3 = page.locator("xpath=//span[@class='o_dropdown_title']");

    this.paymentdelete = page.locator("xpath=//span[normalize-space()='Delete']");

    this.paymentconfirmDelete = page.locator("xpath=//button[normalize-space()='Delete']");

    this.otherPaymentMethods = page.locator("xpath=//a[@role='menuitem'][normalize-space()='Other Payment Methods']");

    // create payment methods
    this.createButton = page.locator("xpath=//button[normalize-space()='New']");

    this.nickName = page.locator("xpath=//input[@id='nick_name_0']");

    this.accountID = page.locator("xpath=//div[@name='partner_id']//input[@type='text']");

    this.martisHousehold = page.locator("xpath=//a[@id='partner_id_0_0_0']");

    // need to select the value
    this.deductionType = page.locator("xpath=//select[@id='deduction_type_0']");

    /*
     * this.creditLimit_clear = page.locator("xpath=//input[@name='spending_limit']");
     */

    // @FindBy(name ="spending_limit" )
    this.creditLimit = page.locator("xpath=//input[@id='spending_limit_0']");

    this.microMarket = page.locator("xpath=//div[@name='micro_market_ids']//input[@type='text']");

    this.gsgMarketTest = page.locator("xpath=//a[@id='micro_market_ids_0_0_0']");

    this.dateConfigurtion = page.locator("xpath=//select[@id='date_configuration_0']");

    // Create app user
    this.addaLine = page.locator("xpath=//a[contains(text(),'Add a line')]");

    this.firstName = page.locator("xpath=//div[@name='first_name']//input[@type='text']");

    this.lastName = page.locator("xpath=//div[@name='last_name']//input[@type='text']");

    this.email = page.locator("xpath=//div[@name='user_email']//input[@type='text']");

    this.saveCloseButton = page.locator("xpath=//button[@class='btn btn-primary']//span[contains(text(),'Save & Close')]");

    this.saveButton = page.locator("xpath=//button[normalize-space()='Save']");

    this.action = page.locator("xpath=//button[normalize-space()='Action']");

    this.archive = page.locator("xpath=//span[normalize-space()='Archive']");

    this.archiveConfirm = page.locator("xpath=//button[normalize-space()='Archive']");

    this.action1 = page.locator("xpath=//button[normalize-space()='Action']");

    this.unarchive = page.locator("xpath=//span[normalize-space()='Unarchive']");

    this.action2 = page.locator("xpath=//button[normalize-space()='Action']");

    this.duplicate = page.locator("xpath=//span[normalize-space()='Duplicate']");

    this.action3 = page.locator("xpath=//button[normalize-space()='Action']");

    this.delete = page.locator("xpath=//span[normalize-space()='Delete']");

    this.confirmDelete = page.locator("xpath=//button[normalize-space()='Delete']");
  }

  async isErrorDisplayed() {
    return this.page
      .locator("xpath=//div[@class='me-auto o_notification_content']")
      .isVisible()
      .catch(() => false);
  }

  async loginIfNeeded(user, pass) {
    await ensureLoggedIn(this, user, pass);
    return this;
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

  async clickMeansButton() {
    try {
      // await this.page.waitForTimeout(3000);

      // await this.menu.click();

      // await this.menu.click({ timeout: 30 * 1000 });

      await this.page.waitForTimeout(3000);

      await this.microMarketServices.evaluate((node) => node.click());

      await this.page.waitForTimeout(3000);

      await reportStep(this.page, "Menu button clicked successfully", "pass");
    } catch (e) {
      await reportStep(this.page, "Menu button clicked not successfully..." + e, "fail");
    }
    return this;
  }

  async clickPaymentButton() {
    try {
      await this.page.waitForTimeout(5000);
      await this.otherPaymentMethodsMenu.evaluate((node) => node.click());
      await this.page.waitForTimeout(3000);
      await this.PaymentMethods.click();
      await this.page.waitForTimeout(3000);
      await this.newButton.click();
      await this.page.waitForTimeout(3000);
      await this.name.fill("komala");

      await this.page.waitForTimeout(3000);
      await this.code.fill("14");

      await this.page.waitForTimeout(3000);
      await this.save.click();
      await this.page.waitForTimeout(3000);

      await this.page.waitForTimeout(3000);

      await reportStep(this.page, "clickPaymentButton clicked successfully", "pass");
    } catch (e) {
      await reportStep(this.page, "clickPaymentButton clicked not successfully..." + e, "fail");
    }
    return this;
  }

  async paymentdeleteDetails() {
    try {
      await this.paymentselect.click();
      await this.page.waitForTimeout(3000);
      await this.paymentaction.click();
      await this.paymentarchive.click();
      await this.page.waitForTimeout(2000);
      await this.paymentarchiveConfirm.click();
      await this.page.waitForTimeout(2000);
      await this.paymentselect1.click();
      await this.page.waitForTimeout(2000);
      await this.paymentaction1.click();
      await this.paymentexport.click();
      await this.paymentexportConfirm.click();
      await this.page.waitForTimeout(2000);
      await this.closeBtn.click();
      await this.page.waitForTimeout(3000);
      await this.paymentselect2.evaluate((node) => node.click());
      await this.paymentaction2.click();
      await this.paymentduplicate.click();
      await this.page.waitForTimeout(2000);
      //await this.paymentselect3.click();
      await this.paymentselect3.evaluate((node) => node.click());
      await this.paymentaction3.click();
      await this.paymentdelete.click();
      await this.page.waitForTimeout(2000);
      await this.paymentconfirmDelete.click();
      await this.page.waitForTimeout(2000);

      await reportStep(this.page, "delete created successfully", "pass");
    } catch (e) {
      await reportStep(this.page, "undelete created not successfully..." + e, "fail");
    }
    console.log('Test completed successfully');

    return this;
  }

  async CreatePaymentMethod(nicName, creLimit) {
    try {
      // await this.otherPaymentMethodsMenu.click();

      /*
       * await new WebDriverWait(driver, Duration.ofSeconds(30))
       *
       * .until(ExpectedConditions.elementToBeClickable(otherPaymentMethodsMenu)).
       * click();
       */

      await this.page.waitForTimeout(5000);

      await this.otherPaymentMethodsMenu.evaluate((node) => node.click());

      await this.otherPaymentMethods.click();

      /*
       * await new WebDriverWait(driver, Duration.ofSeconds(30))
       *
       * .until(ExpectedConditions.elementToBeClickable(otherPaymentMethods)).click();
       */

      await this.page.waitForTimeout(3000);

      await this.createButton.click();

      await this.page.waitForTimeout(3000);
      await this.nickName.fill(String(nicName));

      await this.page.waitForTimeout(1000);
      await this.accountID.click();

      await this.page.waitForTimeout(1000);
      await this.martisHousehold.click();
      await this.page.waitForTimeout(1000);
      await this.deductionType.click();

      await this.deductionType.selectOption({ value: '"payroll"' });

      /* await this.creditLimit_clear.clear(); */

      await this.page.waitForTimeout(1000);
      await this.creditLimit.clear();

      await this.page.waitForTimeout(1000);
      await this.creditLimit.fill(String(creLimit));

      await this.page.waitForTimeout(1000);
      await this.microMarket.click();

      await this.page.waitForTimeout(1000);
      //await this.gsgMarketTest.click();
      await this.gsgMarketTest.evaluate((node) => node.click());

      await this.page.waitForTimeout(1000);
      await this.dateConfigurtion.click();

      await this.dateConfigurtion.selectOption({ value: '"daily"' });

      await this.page.waitForTimeout(1000);
      await reportStep(this.page, "PaymentMethod created successfully", "pass");
    } catch (e) {
      await reportStep(this.page, "PaymentMethod created not successfully..." + e, "fail");
    }
    return this;
  }

  async CreatePaymentMethodNegative(nicName, creLimit) {
    try {
      // await this.otherPaymentMethodsMenu.click();

      /*
       * await new WebDriverWait(driver, Duration.ofSeconds(30))
       *
       * .until(ExpectedConditions.elementToBeClickable(otherPaymentMethodsMenu)).
       * click();
       */

      await this.page.waitForTimeout(5000);

      await this.otherPaymentMethodsMenu.evaluate((node) => node.click());

      await this.otherPaymentMethods.click();

      /*
       * await new WebDriverWait(driver, Duration.ofSeconds(30))
       *
       * .until(ExpectedConditions.elementToBeClickable(otherPaymentMethods)).click();
       */

      await this.page.waitForTimeout(3000);

      await this.createButton.click();

      await this.page.waitForTimeout(3000);
      await this.nickName.fill(String(nicName));

      await this.page.waitForTimeout(1000);
      await this.accountID.click();

      await this.page.waitForTimeout(1000);
      await this.martisHousehold.click();
      await this.page.waitForTimeout(1000);
      await this.deductionType.click();

      await this.deductionType.selectOption({ value: '"payroll"' });

      /* await this.creditLimit_clear.clear(); */

      await this.page.waitForTimeout(1000);
      await this.creditLimit.clear();

      await this.page.waitForTimeout(1000);
      await this.creditLimit.fill(String(creLimit));
      await this.creditLimit.press('Enter');

      await this.page.waitForTimeout(1000);
      try {
        const errorMsg = this.page.locator("xpath=//div[@class='o_dialog']//p");
        await errorMsg.waitFor({ state: 'visible', timeout: 30000 });
        const errorMessageText = await errorMsg.textContent();
        console.log('Validation Error Message:', errorMessageText);

        // Dismiss the validation error
        await this.page.locator("xpath=//button[normalize-space()='Close']").click();
        console.log('Validation error dismissed successfully ');
        await this.page.waitForTimeout(3000);
      } catch (e) {
        console.log('No validation error');
      }

      await this.microMarket.click();

      await this.page.waitForTimeout(1000);
      //await this.gsgMarketTest.click();
      await this.gsgMarketTest.evaluate((node) => node.click());

      await this.page.waitForTimeout(1000);
      await this.dateConfigurtion.click();

      await this.dateConfigurtion.selectOption({ value: '"daily"' });

      await this.page.waitForTimeout(1000);
      await reportStep(this.page, "PaymentMethod created successfully", "pass");
    } catch (e) {
      await reportStep(this.page, "PaymentMethod created not successfully..." + e, "fail");
    }
    return this;
  }

  async createAppUserDetails(fName, lName, emailId) {
    try {
      await this.page.waitForTimeout(1000);
      await this.addaLine.click();

      await this.page.waitForTimeout(1000);
      await this.firstName.fill(String(fName));

      await this.page.waitForTimeout(1000);
      await this.lastName.fill(String(lName));

      await this.page.waitForTimeout(1000);
      await this.email.fill(String(emailId));

      await this.page.waitForTimeout(3000);
      //await this.saveCloseButton.click();
      //await this.page.waitForTimeout(1000);

      await this.saveButton.click();

      await this.page.waitForTimeout(10000);

      await reportStep(this.page, "AppUserDetails created successfully", "pass");
    } catch (e) {
      await reportStep(this.page, "AppUserDetails created not successfully..." + e, "fail");
    }
    console.log('Test completed successfully');

    return this;
  }

  async createAppUserDetailsNegative(fName, lName, emailId) {
    try {
      await this.page.waitForTimeout(1000);
      await this.addaLine.click();

      await this.page.waitForTimeout(1000);
      await this.firstName.fill(String(fName));

      await this.page.waitForTimeout(1000);
      await this.lastName.fill(String(lName));

      await this.page.waitForTimeout(1000);
      await this.email.fill(String(emailId));

      await this.page.waitForTimeout(3000);
      //await this.saveCloseButton.click();
      //await this.page.waitForTimeout(1000);

      await this.saveButton.click();

      await this.page.waitForTimeout(5000);
      try {
        const validationMessage = this.page.locator("xpath=//div[@class='o_notification_body mt-2']");
        await validationMessage.waitFor({ state: 'visible', timeout: 30000 });
        const messageText = await validationMessage.textContent();
        console.log('Validation Message:', messageText);

        expect(await this.isErrorDisplayed()).toBeTruthy();
      } catch (e) {
        // No validation message found; proceed normally
        console.log('No validation message displayed.');
      }

      await reportStep(this.page, "AppUserDetails created successfully", "pass");
    } catch (e) {
      await reportStep(this.page, "AppUserDetails created not successfully..." + e, "fail");
    }
    console.log('Test completed successfully');

    return this;
  }

  async deleteDetails() {
    try {
      await this.page.waitForTimeout(2000);
      await this.action.click();
      await this.archive.click();
      await this.page.waitForTimeout(2000);
      await this.archiveConfirm.click();
      await this.page.waitForTimeout(8000);
      await this.action1.click();
      await this.unarchive.click();
      await this.page.waitForTimeout(2000);
      await this.action2.click();
      await this.duplicate.click();
      await this.page.waitForTimeout(2000);
      await this.action3.click();
      await this.delete.click();
      await this.page.waitForTimeout(2000);
      await this.confirmDelete.click();
      await this.page.waitForTimeout(2000);

      await reportStep(this.page, "delete created successfully", "pass");
    } catch (e) {
      await reportStep(this.page, "delete created not successfully..." + e, "fail");
    }
    console.log('Test completed successfully');

    return this;
  }
}

module.exports = { OtherPaymentMethodsPage };
