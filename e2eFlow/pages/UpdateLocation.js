const { expect } = require('../fixtures/base');
const { reportStep } = require('../utils/reportStep');
const { ensureLoggedIn } = require('../utils/loginHelper');

class UpdateLocation {
  constructor(page) {
    this.page = page;

    // Login Page
    this.userName = page.locator("xpath=//input[@id='login']");
    this.passWord = page.locator("xpath=//input[@id='password']");
    this.logIn = page.locator("xpath=//button[@type='submit']");

    this.menu = page.locator("xpath=//ul[@class='o_menu_apps']//i[@class='fa fa-bars']");

    this.microMarketServicesMenu = page.locator("xpath=//div[contains(text(),'Micromarket Services')]");

    // Customer Care
    this.updateLocationMenu = page.locator("xpath=//span[normalize-space()='Update Location']");

    this.dropdownOptionMenu = page.locator("xpath=//a[@role='menuitem'][normalize-space()='Update Location']");

    this.createBtn = page.locator("xpath=//button[normalize-space()='New']");

    this.customer = page.locator("xpath=//div[@name='partner_id']//input[@type='text']");

    this.customerSelect = page.locator("xpath=//a[@id='partner_id_0_0_0']");

    this.customerSearchMoreBox = page.locator("xpath=//input[@placeholder='Search...']");

    this.customerAdderss = page.locator(
      "xpath=//table[@class='o_list_table table table-sm table-hover position-relative mb-0 o_list_table_ungrouped table-striped']//tbody//tr[1]"
    );

    this.microMarket = page.locator("xpath=//div[@name='micro_market_id']//input[@type='text']");

    this.microMarketSelect = page.locator("xpath=//a[@id='micro_market_id_0_0_0']");

    this.microMarketSearchMoreBox = page.locator("xpath=//input[@placeholder='Search...']");

    this.microMarketAdderss = page.locator(
      "xpath=//table[@class='o_list_table table table-sm table-hover position-relative mb-0 o_list_table_ungrouped table-striped']//tbody//tr[1]"
    );

    this.productCategory = page.locator("xpath=//div[@name='categ_id']//input[@type='text']");

    this.productCategorySelect = page.locator("xpath=//a[@id='categ_id_0_0_0']");

    this.getProductListBtn = page.locator("xpath=//span[normalize-space()='Get Product List']");

    this.updateReconcile = page.locator("xpath=//span[normalize-space()='Update & Reconcile']");

    this.action = page.locator("xpath=//button[normalize-space()='Action']");

    this.duplicate = page.locator("xpath=(//span[@role='menuitem'])[1]");
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
      await this.logIn.click();
      await this.page.waitForTimeout(5000);

      await reportStep(this.page, "login button clicked successfully", "pass");
    } catch (e) {
      await reportStep(this.page, "login button clicked not successfully..." + e, "fail");
    }
    return this;
  }

  async click_Menu() {
    try {
      await this.menu.click({ timeout: 30 * 1000 });
      await this.page.waitForTimeout(5000);

      await reportStep(this.page, "Menu clicked successfully", "pass");
    } catch (e) {
      await reportStep(this.page, "Menu clicked not successfully..." + e, "fail");
    }
    return this;
  }

  async click_MicroMarketServices_Menu() {
    try {
      await this.microMarketServicesMenu.click({ timeout: 30 * 1000 });
      await this.page.waitForTimeout(10000);

      await reportStep(this.page, "Micro Market Services menu is clicked successfully", "pass");
    } catch (e) {
      await reportStep(this.page, "Micro Market Services menu is  not clicked successfully..." + e, "fail");
    }
    return this;
  }

  async click_UpdateLocation_Menu() {
    try {
      await this.updateLocationMenu.click({ timeout: 30 * 1000 });
      await this.page.waitForTimeout(10000);

      await this.dropdownOptionMenu.click();
      await this.page.waitForTimeout(15000);

      await reportStep(this.page, "Update Location menu is clicked successfully", "pass");
    } catch (e) {
      await reportStep(this.page, "Update Location menu is  not clicked successfully..." + e, "fail");
    }
    return this;
  }

  async click_customer_Selection() {
    try {
      await this.createBtn.click();
      await this.customer.click({ timeout: 30 * 1000 });
      await this.page.waitForTimeout(10000);

      await this.customer.fill("Altura Credit Union HOC");
      await this.page.waitForTimeout(5000);

      await this.customerSelect.click();
      await this.page.waitForTimeout(10000);

      await reportStep(this.page, "Customer Selected is clicked successfully", "pass");
    } catch (e) {
      await reportStep(this.page, "Customer Selected is  not clicked successfully..." + e, "fail");
    }
    return this;
  }

  async click_microMarket_Selection() {
    try {
      await this.microMarket.click({ timeout: 30 * 1000 });
      await this.page.waitForTimeout(10000);

      // Ramya testing market
      await this.microMarket.fill("Altura HOC 1st Floor Market");
      await this.page.waitForTimeout(5000);

      await this.microMarketSelect.click();
      // await this.page.waitForTimeout(10000);

      await reportStep(this.page, "Micro Market selected is clicked successfully", "pass");
    } catch (e) {
      await reportStep(this.page, "Micro Market selected is  not clicked successfully..." + e, "fail");
    }
    return this;
  }

  async click_productCategory_Selection() {
    try {
      await this.productCategory.click({ timeout: 30 * 1000 });
      await this.page.waitForTimeout(10000);

      await this.productCategory.fill("Amenity");
      await this.page.waitForTimeout(5000);

      await this.productCategorySelect.click();
      await this.page.waitForTimeout(10000);

      await reportStep(this.page, "Product Category Selected is clicked successfully", "pass");
    } catch (e) {
      await reportStep(this.page, "Product Category Selected is  not clicked successfully..." + e, "fail");
    }
    return this;
  }

  async click_getProductListBtn() {
    try {
      await this.getProductListBtn.click();
      await this.page.waitForTimeout(20000);

      await reportStep(this.page, "Get Product List Button is clicked successfully", "pass");
    } catch (e) {
      await reportStep(this.page, "Get Product List Button is  not clicked successfully..." + e, "fail");
    }
    return this;
  }

  async getProductList_Details() {
    try {
      // Get the table headers (th elements) to determine the number of columns
      const headers = this.page.locator(
        "xpath=//table[@class='o_list_table table table-sm table-hover table-striped o_list_table_ungrouped table-striped']//thead//th"
      );
      const headersCount = await headers.count();

      // Get the number of rows in the table body
      const totalRows = await this.page
        .locator(
          "xpath=//table[@class='o_list_table table table-sm table-hover table-striped o_list_table_ungrouped table-striped']//tbody//tr"
        )
        .count();

      // Retrieve and print row data with headers
      for (let row = 1; row <= Math.min(5, totalRows); row++) {
        let rowData = '';
        for (let column = 1; column <= headersCount; column++) {
          const headerName = (await headers.nth(column - 1).textContent()).trim();
          const cellText = await this.getColumnText(row, column);
          rowData += `${headerName}: ${cellText}\n`;
        }
        console.log(rowData.trim());
        console.log('-------------------------------------------------'); // Separator between rows
      }

      await reportStep(this.page, "Invoice details retrieved successfully", "pass");
    } catch (e) {
      await reportStep(this.page, "Failed to retrieve invoice details: " + e.message, "fail");
      console.error(e); // Additional logging for debugging
    }

    return this;
  }

  async getColumnText(row, column) {
    try {
      // Ensure the element is visible before checking clickability
      const element = this.page.locator(`xpath=.//tr[${row}]//td[${column}]`);
      await element.waitFor({ state: 'visible', timeout: 30000 });

      const text = await element.textContent();
      return text;
    } catch (e) {
      console.error(`Error retrieving text from row ${row}, column ${column}: ${e.message}`);
      return 'N/A';
    }
  }
}

module.exports = { UpdateLocation };
