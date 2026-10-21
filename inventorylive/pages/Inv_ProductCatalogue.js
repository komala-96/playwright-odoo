const { reportStep } = require('../utils/reportStep');
const { ensureLoggedIn } = require('../utils/loginHelper');

class Inv_ProductCatalogue {
  constructor(page) {
    this.page = page;

    // Login Page
    this.userName = page.locator("xpath=//input[@name='login']");
    this.passWord = page.locator("xpath=//input[@name='password']");
    this.logIn = page.locator("xpath=//button[contains(text(),'Log in')]");

    // Means
    this.menu = page.locator("xpath=//ul[@class='o_menu_apps']//i[@class='fa fa-bars']");

    this.inventory = page.locator("xpath=//div[contains(text(),'Inventory')]");

    this.productCatalogueMenu = page.locator("xpath=//a[normalize-space()='Product Catalog']");

    this.createBtn = page.locator("xpath=//button[normalize-space()='New']");

    this.name = page.locator("xpath=//textarea[@id='name_0']");

    this.category = page.locator("xpath=(//div[@class='o_input_dropdown']//input[@type='text'])[1]");

    this.categorySelect = page.locator("xpath=(//a[normalize-space()='Amenity'])[1]");

    this.product = page.locator("xpath=(//div[@class='o_input_dropdown']//input[@type='text'])[2]");

    this.product_Search = page.locator("xpath=//a[@id='product_ids_0_0_3']");

    this.pro_Select = page.locator(
      "xpath=//table[@class='o_list_table table table-sm table-hover position-relative mb-0 o_list_table_ungrouped table-striped']//tbody//tr[1]//td[2]"
    );

    this.addBtn = page.locator("xpath=//button[@name='add_products']//span[contains(text(),'Add')]");

    // button[normalize-space()='Save']
    this.saveBtn = page.locator("xpath=//button[normalize-space()='Save']");

    // button[normalize-space()='Edit']
    this.editBtn = page.locator("xpath=//button[normalize-space()='Edit']");

    // div[@class='o_input_dropdown']//input[@type='text'])[5]
    this.updatePrice = page.locator("xpath=(//div[@class='o_input_dropdown']//input[@type='text'])[3]");

    this.catSelect = page.locator("xpath=//a[@id='category_selection_ids_0_0_0']");

    // button[@id='o_update_price']
    this.updateBtn = page.locator("xpath=//span[normalize-space()='Update Price']");

    // input[@id='update_type_New']
    this.newPrice = page.locator("xpath=//input[@id='update_type_New']");

    // input[@id='price_value']
    this.priceValue = page.locator("xpath=//div[@name='value']//input[@type='text']");

    // span[normalize-space()='Update']
    this.updateBtn1 = page.locator("xpath=//span[normalize-space()='Apply']");

    // button[@name='cancel_list_change'][1]
    this.noBtn = page.locator("xpath=//button[@name='cancel_list_change'][1]");

    this.okBtn = page.locator("xpath=//button[@class='btn btn-primary'][normalize-space()='Ok']");

    this.actionBtn = page.locator("xpath=//button[normalize-space()='Action']");

    this.duplicate = page.locator("xpath=//span[normalize-space()='Duplicate']");

    this.actionBtn1 = page.locator("xpath=//button[normalize-space()='Action']");

    this.delete = page.locator("xpath=//span[normalize-space()='Delete']");

    this.close = page.locator("xpath=//button[normalize-space()='Close']");
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

  async clickMenuButton() {
    try {
      await this.menu.click({ timeout: 30 * 1000 });
      await this.page.waitForTimeout(5000);

      await reportStep(this.page, "Menu button is entered successfully", "pass");
    } catch (e) {
      await reportStep(this.page, "Menu button is not entered successfully..." + e, "fail");
    }

    return this;
  }

  async clickInventoryMenuButton() {
    try {
      await this.inventory.click({ timeout: 30 * 1000 });
      await this.page.waitForTimeout(5000);

      await reportStep(this.page, "Inventory Menu button is entered successfully", "pass");
    } catch (e) {
      await reportStep(this.page, "Inventory Menu button is not entered successfully..." + e, "fail");
    }

    return this;
  }

  async clickProductCatalogueMenuButton() {
    try {
      await this.page.waitForTimeout(5000);
      await this.productCatalogueMenu.click();
      await this.page.waitForTimeout(6000);

      await reportStep(this.page, "Inventory Adjustment Menu is entered successfully", "pass");
    } catch (e) {
      await reportStep(this.page, "Inventory Adjustment Menuis not entered successfully..." + e, "fail");
    }

    return this;
  }

  async clickCreateButton() {
    try {
      await this.createBtn.click({ timeout: 30 * 1000 });
      await this.page.waitForTimeout(10000);

      await reportStep(this.page, "Create button is entered successfully", "pass");
    } catch (e) {
      await reportStep(this.page, "Create button is not entered successfully..." + e, "fail");
    }

    return this;
  }

  async clickCatalogueCreate(name1) {
    try {
      await this.name.fill(String(name1));
      await this.page.waitForTimeout(3000);
      await this.category.click();
      await this.page.waitForTimeout(3000);
      // await this.categorySelect.click();
      await this.categorySelect.evaluate((node) => node.click());
      await this.page.waitForTimeout(3000);
      await this.product.click();
      await this.page.waitForTimeout(3000);
      // await this.product_Search.click();
      await this.product_Search.evaluate((node) => node.click());
      await this.page.waitForTimeout(3000);
      // await this.pro_Select.click();
      await this.addBtn.click();

      await reportStep(this.page, "clickCatalogueCreate button is entered successfully", "pass");
    } catch (e) {
      await reportStep(this.page, "clickCatalogueCreate button is not entered successfully..." + e, "fail");
    }

    return this;
  }

  async clickCatalogueCreateNegative(name1) {
    try {
      await this.name.fill(String(name1));
      await this.page.waitForTimeout(3000);
      await this.category.click();
      await this.page.waitForTimeout(3000);
      // await this.categorySelect.click();
      await this.categorySelect.evaluate((node) => node.click());
      await this.page.waitForTimeout(3000);
      await this.product.click();
      await this.page.waitForTimeout(3000);
      // await this.product_Search.click();
      await this.product_Search.evaluate((node) => node.click());
      await this.page.waitForTimeout(3000);
      // await this.pro_Select.click();
      await this.addBtn.click();

      await reportStep(this.page, "clickCatalogueCreate button is entered successfully", "pass");
    } catch (e) {
      await reportStep(this.page, "clickCatalogueCreate button is not entered successfully..." + e, "fail");
    }

    return this;
  }

  async clickPriceUpdate(price1, qty, qty1) {
    try {
      const totalRows = await this.page
        .locator(
          "xpath=(//table[@class='o_list_table table table-sm table-hover position-relative mb-0 o_list_table_ungrouped table-striped'])[1]//tbody//tr"
        )
        .count();
      console.log('Total number of rows:', totalRows);
      await this.page.waitForTimeout(6000);

      for (let row = 1; row <= Math.min(1, totalRows); row++) {
        const productName = this.page.locator(
          `xpath=(//table[@class='o_list_table table table-sm table-hover position-relative mb-0 o_list_table_ungrouped table-striped'])[1]//tbody//tr[${row}]//td[2]`
        );
        await productName.click({ timeout: 30 * 1000 });
        await this.page.waitForTimeout(6000);

        const sellingPriceInput = this.page.locator(
          `xpath=(//table[@class='o_list_table table table-sm table-hover position-relative mb-0 o_list_table_ungrouped table-striped'])[1]//tbody//tr[${row}]//td[7]//input`
        );
        await this.page.waitForTimeout(6000);

        const currentPrice = await sellingPriceInput.inputValue({ timeout: 30 * 1000 });
        console.log('Row:', row, ', Current Selling Price:', currentPrice);
        await this.page.waitForTimeout(6000);

        await sellingPriceInput.clear();
        await sellingPriceInput.fill(String(price1));
        // Adding a small wait to ensure input is processed before proceeding
        await this.page.waitForTimeout(5000);

        const minInput = this.page.locator(
          `xpath=(//table[@class='o_list_table table table-sm table-hover position-relative mb-0 o_list_table_ungrouped table-striped'])[1]//tbody//tr[${row}]//td[9]//input`
        );
        await this.page.waitForTimeout(3000);
        await minInput.clear({ timeout: 30 * 1000 });
        await minInput.fill(String(qty));
        // Adding a small wait to ensure input is processed before proceeding
        await this.page.waitForTimeout(500);

        const maxInput = this.page.locator(
          `xpath=(//table[@class='o_list_table table table-sm table-hover position-relative mb-0 o_list_table_ungrouped table-striped'])[1]//tbody//tr[${row}]//td[11]//input`
        );
        await this.page.waitForTimeout(3000);

        await maxInput.clear({ timeout: 30 * 1000 });
        await this.close.click();
        await maxInput.fill(String(qty1));
        // Adding a small wait to ensure input is processed before proceeding
        await this.page.waitForTimeout(5000);
        //await this.saveBtn.click();
        //await this.page.waitForTimeout(10000);
        //await this.noBtn.click();
        //await this.page.waitForTimeout(5000);
        //await this.saveBtn.click();
        //await this.page.waitForTimeout(5000);
        //await this.editBtn.click();

        await reportStep(this.page, "priceupdate button is entered successfully", "pass");
      }
    } catch (e) {
      await reportStep(this.page, "priceupdate button is not entered successfully..." + e, "fail");
    }

    return this;
  }

  async clickPriceUpdateNegative(price1, qty, qty1) {
    try {
      const totalRows = await this.page
        .locator(
          "xpath=(//table[@class='o_list_table table table-sm table-hover position-relative mb-0 o_list_table_ungrouped table-striped'])[1]//tbody//tr"
        )
        .count();
      console.log('Total number of rows:', totalRows);
      await this.page.waitForTimeout(6000);

      for (let row = 1; row <= Math.min(1, totalRows); row++) {
        const productName = this.page.locator(
          `xpath=(//table[@class='o_list_table table table-sm table-hover position-relative mb-0 o_list_table_ungrouped table-striped'])[1]//tbody//tr[${row}]//td[2]`
        );
        await productName.click({ timeout: 30 * 1000 });
        await this.page.waitForTimeout(6000);

        const sellingPriceInput = this.page.locator(
          `xpath=(//table[@class='o_list_table table table-sm table-hover position-relative mb-0 o_list_table_ungrouped table-striped'])[1]//tbody//tr[${row}]//td[7]//input`
        );
        await this.page.waitForTimeout(6000);

        const currentPrice = await sellingPriceInput.inputValue({ timeout: 30 * 1000 });
        console.log('Row:', row, ', Current Selling Price:', currentPrice);
        await this.page.waitForTimeout(6000);

        await sellingPriceInput.clear();
        await sellingPriceInput.fill(String(price1));
        await sellingPriceInput.press('Enter');
        try {
          // const wait = new WebDriverWait(driver, Duration.ofSeconds(30));
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

        // Adding a small wait to ensure input is processed before proceeding
        await this.page.waitForTimeout(5000);

        const minInput = this.page.locator(
          `xpath=(//table[@class='o_list_table table table-sm table-hover position-relative mb-0 o_list_table_ungrouped table-striped'])[1]//tbody//tr[${row}]//td[9]//input`
        );
        await this.page.waitForTimeout(3000);
        await minInput.clear({ timeout: 30 * 1000 });
        await minInput.fill(String(qty));
        await minInput.press('Enter');
        // Adding a small wait to ensure input is processed before proceeding
        await this.page.waitForTimeout(500);
        try {
          // const wait = new WebDriverWait(driver, Duration.ofSeconds(30));
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

        const maxInput = this.page.locator(
          `xpath=(//table[@class='o_list_table table table-sm table-hover position-relative mb-0 o_list_table_ungrouped table-striped'])[1]//tbody//tr[${row}]//td[11]//input`
        );
        await this.page.waitForTimeout(3000);

        await maxInput.clear({ timeout: 30 * 1000 });
        //  await this.close.click();
        await maxInput.fill(String(qty1));
        await maxInput.press('Enter');
        try {
          // const wait = new WebDriverWait(driver, Duration.ofSeconds(30));
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

        // Adding a small wait to ensure input is processed before proceeding
        await this.page.waitForTimeout(5000);
        //await this.saveBtn.click();
        //await this.page.waitForTimeout(10000);
        //await this.noBtn.click();
        //await this.page.waitForTimeout(5000);
        //await this.saveBtn.click();
        //await this.page.waitForTimeout(5000);
        //await this.editBtn.click();

        await reportStep(this.page, "priceupdate button is entered successfully", "pass");
      }
    } catch (e) {
      await reportStep(this.page, "priceupdate button is not entered successfully..." + e, "fail");
    }

    return this;
  }

  async clickUpdatePrice(amt) {
    try {
      await this.page.waitForTimeout(2000);
      await this.updatePrice.click();
      // Clicking alone doesn't open the autocomplete; it only opens once the
      // input receives a keystroke, so type then clear to trigger the search.
      await this.updatePrice.pressSequentially('a', { delay: 100 });
      await this.updatePrice.press('Backspace');
      await this.page.waitForTimeout(2000);
      // await this.catSelect.click();
      await this.catSelect.evaluate((node) => node.click());
      await this.page.waitForTimeout(2000);
      await this.updateBtn.click();
      await this.page.waitForTimeout(2000);
      // await this.newPrice.click();
      await this.priceValue.fill(String(amt));
      await this.page.waitForTimeout(2000);
      await this.updateBtn1.click();
      await this.page.waitForTimeout(5000);
      await this.okBtn.click();
      await this.page.waitForTimeout(2000);
      await this.noBtn.click();

      await reportStep(this.page, "clickUpdatePrice button is entered successfully", "pass");
    } catch (e) {
      await reportStep(this.page, "clickUpdatePrice button is not entered successfully..." + e, "fail");
    }

    return this;
  }

  async clickUpdatePriceNegative(amt) {
    try {
      await this.page.waitForTimeout(2000);
      await this.updatePrice.click();
      // Clicking alone doesn't open the autocomplete; it only opens once the
      // input receives a keystroke, so type then clear to trigger the search.
      await this.updatePrice.pressSequentially('a', { delay: 100 });
      await this.updatePrice.press('Backspace');
      await this.page.waitForTimeout(2000);
      // await this.catSelect.click();
      await this.catSelect.evaluate((node) => node.click());
      await this.page.waitForTimeout(2000);
      await this.updateBtn.click();
      await this.page.waitForTimeout(2000);
      // await this.newPrice.click();
      await this.priceValue.fill(String(amt));
      await this.priceValue.press('Enter');
      await this.page.waitForTimeout(2000);
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

      await this.updateBtn1.click();
      await this.page.waitForTimeout(5000);
      await this.okBtn.click();
      await this.page.waitForTimeout(2000);
      await this.noBtn.click();

      await reportStep(this.page, "clickUpdatePrice button is entered successfully", "pass");
    } catch (e) {
      await reportStep(this.page, "clickUpdatePrice button is not entered successfully..." + e, "fail");
    }

    return this;
  }

  async clickDelete() {
    try {
      await this.page.waitForTimeout(2000);
      await this.actionBtn.click();
      await this.duplicate.click();
      await this.page.waitForTimeout(2000);
      await this.actionBtn1.click();
      await this.delete.click();
 await this.page.waitForTimeout(5000);
      await reportStep(this.page, "ProductDetails is entered successfully", "pass");
    } catch (e) {
      await reportStep(this.page, "ProductDetails is not entered successfully..." + e, "fail");
    }
    return this;
  }
}

module.exports = { Inv_ProductCatalogue };
