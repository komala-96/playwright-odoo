const { expect } = require('../fixtures/base');
const { reportStep } = require('../utils/reportStep');
const { ensureLoggedIn } = require('../utils/loginHelper');

class FrontDeskDiscount {
  constructor(page) {
    this.page = page;

    // Login Page 1
    this.userName = page.locator("xpath=//input[@id='login']");
    this.passWord = page.locator("xpath=//input[@id='password']");
    this.logIn = page.locator("xpath=//button[@type='submit']");

    this.menu = page.locator("xpath=//ul[@class='o_menu_apps']//i[@class='fa fa-bars']");

    this.microMarketServices = page.locator("xpath=//div[contains(text(),'Micromarket Services')]");

    this.frontdeskDiscountMenu = page.locator("xpath=//a[normalize-space()='Front Desk/Employee Discount']");

    this.createButton = page.locator("xpath=//button[normalize-space()='New']");

    this.customer = page.locator("xpath=(//div[@class='o_input_dropdown']//input[@type='text'])[1]");

    this.customerSearch = page.locator("xpath=(//a[normalize-space()='Search More...'])[1]");

    this.searchMore = page.locator("xpath=(//input[@placeholder='Search...'])[1]");

    this.customerSelect = page.locator(
      "xpath=(//table[@class='o_list_table table table-sm table-hover position-relative mb-0 o_list_table_ungrouped table-striped'])[2]//tbody//tr[1]//td[1]"
    );

    this.microMarket = page.locator("xpath=(//div[@class='o_input_dropdown']//input[@type='text'])[2]");

    this.mmSelect = page.locator("xpath=//a[@id='micro_market_ids_0_0_0']");

    this.discount = page.locator("xpath=//input[@id='discount_0']");

    this.addLine = page.locator("xpath=(//a[normalize-space()='Add a line'])[1]");

    this.firstName = page.locator("xpath=//div[@name='first_name']//input[@type='text']");

    this.lastName = page.locator("xpath=//div[@name='last_name']//input[@type='text']");

    this.email = page.locator("xpath=//div[@name='email']//input[@type='text']");

    this.employee = page.locator("xpath=//div[@name='employee_id']//input[@type='text']");

    this.save = page.locator("xpath=//button[normalize-space()='Save']");

    this.confirm = page.locator("xpath=//span[normalize-space()='Confirm']");

    this.saveBtn = page.locator("xpath=(//button[normalize-space()='Save'])[1]");

    this.action = page.locator("xpath=//button[normalize-space()='Action']");

    this.duplicate = page.locator("xpath=//span[normalize-space()='Duplicate']");

    this.action2 = page.locator("xpath=//button[normalize-space()='Action']");

    this.archive = page.locator("xpath=//span[normalize-space()='Archive']");

    this.confirmArchive = page.locator("xpath=//button[normalize-space()='Archive']");

    this.action3 = page.locator("xpath=//button[normalize-space()='Action']");

    this.unArchive = page.locator("xpath=//span[normalize-space()='Unarchive']");

    this.action1 = page.locator("xpath=//button[normalize-space()='Action']");

    this.deleteBtn = page.locator("xpath=//span[normalize-space()='Delete']");

    this.confirmDelete = page.locator("xpath=//button[normalize-space()='Delete']");

    this.discontinueProducts = page.locator("xpath=//a[normalize-space()='Discontinue Products']");

    //div[@class='o_input_dropdown']//input[@type='text'])[4]

    this.customer1 = page.locator("xpath=//input[@id='partner_ids_0']");

    this.microMarket1 = page.locator("xpath=//input[@id='micro_market_ids_0']");

    this.product = page.locator("xpath=//input[@id='product_ids_0']");

    this.customer1Select = page.locator("xpath=//a[@id='partner_ids_0_0_0']");

    this.micromarket1Select = page.locator("xpath=//a[@id='micro_market_ids_0_0_0']");

    this.productSelect = page.locator("xpath=//a[@id='product_ids_0_0_0']");

    //button[@name='process']//span[contains(text(),'Discontinue Products')]

    this.discontinueBtn = page.locator("xpath=//button[@name='process']//span[contains(text(),'Discontinue Products')]");
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

  async CreatePaymentMethod() {
    try {
      await this.page.waitForTimeout(5000);

      await this.frontdeskDiscountMenu.evaluate((node) => node.click());

      await this.page.waitForTimeout(3000);

      await this.createButton.click();

      await reportStep(this.page, "FrontDesk Menu clicked successfully", "pass");
    } catch (e) {
      await reportStep(this.page, "FrontDesk Menu  not clicked  successfully..." + e, "fail");
    }
    return this;
  }

  async CreateDiscount(name, discount1, fName, lName, mail, employee1) {
    try {
      await this.customer.click();
      await this.page.waitForTimeout(3000);
      await this.customerSearch.click();
      await this.page.waitForTimeout(3000);
      await this.searchMore.fill(String(name));
      await this.searchMore.press('Enter');
      await this.page.waitForTimeout(3000);
      await this.customerSelect.click();
      await this.page.waitForTimeout(8000);
      await this.microMarket.click();
      await this.page.waitForTimeout(3000);
      //await this.mmSelect.click();
      await this.mmSelect.evaluate((node) => node.click());
      await this.page.waitForTimeout(3000);
      await this.discount.clear();
      await this.discount.fill(String(discount1));
      await this.page.waitForTimeout(3000);
      await this.addLine.click();
      await this.page.waitForTimeout(3000);
      await this.firstName.fill(String(fName));
      await this.lastName.fill(String(lName));
      await this.email.fill(String(mail));
      await this.employee.fill(String(employee1));
      await this.page.waitForTimeout(3000);
      await this.save.click();
      await this.page.waitForTimeout(6000);
      await this.confirm.click();
      await this.page.waitForTimeout(6000);
      await this.action.click();
      await this.duplicate.click();
      await this.page.waitForTimeout(3000);
      await this.action2.click();
      await this.archive.click();
      await this.confirmArchive.click();
      await this.page.waitForTimeout(6000);
      await this.action3.click();
      await this.unArchive.click();
      await this.page.waitForTimeout(3000);
      await this.action1.click();
      await this.deleteBtn.click();
      await this.confirmDelete.click();
      await this.page.waitForTimeout(3000);

      await reportStep(this.page, "Discount created successfully", "pass");
    } catch (e) {
      await reportStep(this.page, "Discount created not successfully..." + e, "fail");
    }
    return this;
  }

  async CreateDiscountNegative(name, discount1, fName, lName, mail, employee1) {
    try {
      await this.customer.click();
      await this.page.waitForTimeout(3000);
      await this.customerSearch.click();
      await this.page.waitForTimeout(3000);
      await this.searchMore.fill(String(name));
      await this.searchMore.press('Enter');
      await this.page.waitForTimeout(3000);
      await this.customerSelect.click();
      await this.page.waitForTimeout(3000);
      await this.saveBtn.click();
      try {
        const validationMessage = this.page.locator("xpath=//div[@class='o_notification_body mt-2']");
        await validationMessage.waitFor({ state: 'visible', timeout: 30000 });
        const messageText = await validationMessage.textContent();
        console.log("Validation Message: " + messageText);

        expect(await this.isErrorDisplayed()).toBeTruthy();
      } catch (e) {
        // No validation message found; proceed normally
        console.log("No validation message displayed.");
      }
      await this.page.waitForTimeout(3000);
      await this.microMarket.click();
      await this.page.waitForTimeout(3000);
      //await this.mmSelect.click();
      await this.mmSelect.evaluate((node) => node.click());
      await this.page.waitForTimeout(3000);
      await this.saveBtn.click();
      try {
        const errorMsg = this.page.locator("xpath=//div[@class='o_dialog']//p");
        await errorMsg.waitFor({ state: 'visible', timeout: 30000 });
        const errorMessageText = await errorMsg.textContent();
        console.log("Validation Error Message: " + errorMessageText);

        // Dismiss the validation error
        await this.page.locator("xpath=//button[normalize-space()='Stay here']").click();
        console.log("Validation error dismissed successfully ");
        await this.page.waitForTimeout(3000);
      } catch (e) {
        console.log("No validation error");
      }
      await this.discount.clear();
      await this.discount.fill(String(discount1));
      await this.discount.press('Enter');
      await this.page.waitForTimeout(3000);

      try {
        const errorMsg = this.page.locator("xpath=//div[@class='o_dialog']//p");
        await errorMsg.waitFor({ state: 'visible', timeout: 30000 });
        const errorMessageText = await errorMsg.textContent();
        console.log("Validation Error Message: " + errorMessageText);

        // Dismiss the validation error
        await this.page.locator("xpath=//button[normalize-space()='Close']").click();
        console.log("Validation error dismissed successfully ");
        await this.page.waitForTimeout(3000);
      } catch (e) {
        console.log("No validation error");
      }
      await this.addLine.click();
      await this.firstName.fill(String(fName));
      await this.lastName.fill(String(lName));
      await this.email.fill(String(mail));
      await this.employee.fill(String(employee1));
      await this.page.waitForTimeout(5000);
      //await this.save.click();
      //await this.page.waitForTimeout(3000);
      await this.confirm.click();
      await this.page.waitForTimeout(6000);
      try {
        const errorMsg = this.page.locator("xpath=//div[@class='o_dialog']//p");
        await errorMsg.waitFor({ state: 'visible', timeout: 30000 });
        const errorMessageText = await errorMsg.textContent();
        console.log("Validation Error Message: " + errorMessageText);

        // Dismiss the validation error
        await this.page.locator("xpath=//button[normalize-space()='Close']").click();
        console.log("Validation error dismissed successfully ");
        await this.page.waitForTimeout(3000);
      } catch (e) {
        console.log("No validation error");
      }

      await reportStep(this.page, "Discount created successfully", "pass");
    } catch (e) {
      await reportStep(this.page, "Discount created not successfully..." + e, "fail");
    }
    return this;
  }

  async ClickDiscontinueProducts() {
    try {
      await this.page.waitForTimeout(5000);

      await this.discontinueProducts.evaluate((node) => node.click());

      await this.page.waitForTimeout(3000);

      await reportStep(this.page, "Discontinue Products Menu clicked successfully", "pass");
    } catch (e) {
      await reportStep(this.page, "Discontinue Products Menu not clicked successfully..." + e, "fail");
    }
    return this;
  }

  async CreateDiscontinue() {
    try {
      await this.page.waitForTimeout(3000);
      await this.customer1.click();
      await this.page.waitForTimeout(3000);
      await this.customer1.fill("komala");
      //await this.customer1Select.click();
      await this.customer1Select.evaluate((node) => node.click());
      await this.page.waitForTimeout(3000);
      await this.microMarket1.click();
      //await this.micromarket1Select.click();
      await this.micromarket1Select.evaluate((node) => node.click());
      await this.page.waitForTimeout(3000);
      await this.product.click();
      //await this.productSelect.click();
      await this.productSelect.evaluate((node) => node.click());
      await this.page.waitForTimeout(3000);

      await this.discontinueBtn.click();

      await reportStep(this.page, "Discontinue created successfully", "pass");
    } catch (e) {
      await reportStep(this.page, "Discontinue created not successfully..." + e, "fail");
    }
    return this;
  }
}

module.exports = { FrontDeskDiscount };
