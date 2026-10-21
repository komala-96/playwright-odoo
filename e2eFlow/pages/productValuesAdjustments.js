const { expect } = require('../fixtures/base');
const { reportStep } = require('../utils/reportStep');
const { ensureLoggedIn } = require('../utils/loginHelper');

class productValuesAdjustments {
  constructor(page) {
    this.page = page;

    // Login Page
    this.userName = page.locator("xpath=//input[@name='login']");
    this.passWord = page.locator("xpath=//input[@name='password']");
    this.logIn = page.locator("xpath=//button[contains(text(),'Log in')]");

    // Means
    this.menu = page.locator("xpath=//ul[@class='o_menu_apps']//i[@class='fa fa-bars']");

    this.inventory = page.locator("xpath=//div[contains(text(),'Inventory')]");

    this.inventoryAdjustmentMenu = page.locator("xpath=//span[normalize-space()='Inventory Adjustment']");

    this.valueAdjustment = page.locator("xpath=//a[@role='menuitem'][normalize-space()='Value Adjustments']");

    this.createBtn = page.locator("xpath=//button[normalize-space()='New']");

    this.referenceNo = page.locator("xpath=//input[@id='name_0']");

    this.product = page.locator("xpath=//input[@id='product_ids_0']");

    // Odoo assigns deterministic ids to the tags-field autocomplete dropdown:
    // <input id>_0_0 is the first real suggestion, <input id>_0_1 is the
    // "Search More..." option. Selecting the suggestion directly (rather than
    // always opening the full "Search More..." modal) is what actually works
    // for this field, since it's a many2many tags widget, not the plain
    // many2one used on the Quantity Adjustments page.
    this.productSuggestion = page.locator("xpath=//a[@id='product_ids_0_0_0']");

    // table[@class='o_list_table table table-sm table-hover table-striped o_list_table_ungrouped']//tbody//tr[1]//td[7]//input
    this.productAdd = page.locator("xpath=(//button[@name='action_start']//span[contains(text(),'Add')])[1]");

    this.validateInventoryBtn = page.locator(
      "xpath=(//button[@name='action_validate']//span[contains(text(),'Validate Inventory')])"
    );

    this.saveBtn = page.locator("xpath=//button[contains(text(),'Save')]");

    // NOTE: renamed from `productMasterMenu` (Java field) to `productMasterMenuBtn` to avoid
    // colliding with the `productMasterMenu()` method below (JS fields and methods share one namespace).
    this.productMasterMenuBtn = page.locator("xpath=//nav[@class='o_main_navbar']//span[(text()='Product Master')]");

    this.inventorySearchBox = page.locator("xpath=//div[@class='o_searchview_input_container']//input[@type='text']");

    this.inventoryProductClick = page.locator("xpath=//div[@class='oe_kanban_details']");

    this.editBtn = page.locator("xpath=//button[contains(text(),'Edit')]");

    this.averageCost = page.locator("xpath=//td//span[@name='standard_price']");

    this.current_cost = page.locator("xpath=//td//span[@name='current_cost']");

    this.action = page.locator("xpath=//button[normalize-space()='Action']");

    this.duplicate = page.locator("xpath=//span[normalize-space()='Duplicate']");

    this.action1 = page.locator("xpath=//button[normalize-space()='Action']");

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
      await this.page.waitForTimeout(5000);

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
      // this.inventory matches the "Inventory" app icon on Odoo's app switcher.
      // When a prior step already navigated into the Inventory app, that icon
      // is gone (replaced by the in-app navbar) and there's nothing to click.
      const onAppSwitcher = await this.inventory.isVisible({ timeout: 3000 }).catch(() => false);
      if (onAppSwitcher) {
        await this.inventory.click({ timeout: 30 * 1000 });
        await this.page.waitForTimeout(5000);
      }

      await reportStep(this.page, "Inventory Menu button is entered successfully", "pass");
    } catch (e) {
      await reportStep(this.page, "Inventory Menu button is not entered successfully..." + e, "fail");
    }

    return this;
  }

  async clickInventoryAdjustmentMenuButton() {
    try {
      await this.page.waitForTimeout(4000);
      await this.inventoryAdjustmentMenu.click({ timeout: 30 * 1000 });
      await this.page.waitForTimeout(8000);

      await this.valueAdjustment.click();
      await this.page.waitForTimeout(8000);

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

  async clickQuantityAdjustments(refNo) {
    try {
      await this.referenceNo.fill(String(refNo));
      await this.page.waitForTimeout(5000);

      await reportStep(this.page, "Quantity Adjustments is entered successfully", "pass");
    } catch (e) {
      await reportStep(this.page, "Quantity Adjustments is not entered successfully..." + e, "fail");
    }

    return this;
  }

  async clickProducts(productName) {
    try {
      // Value Adjustments starts in Draft with the Products tags field
      // disabled; clicking "Add" (action_start) transitions it to
      // "In Progress" and enables the field for editing.
      await this.productAdd.click();
      await this.page.waitForTimeout(8000);

      await this.product.click();
      await this.page.waitForTimeout(2000);

      await this.product.fill(String(productName));
      await this.page.waitForTimeout(3000);

      await this.productSuggestion.click();
      await this.page.waitForTimeout(3000);

      // Clicking "Add" again populates the stock-lines table below from the
      // product(s) just selected in the tags field.
      await this.productAdd.click();
      await this.page.waitForTimeout(8000);

      await reportStep(this.page, "Products is entered successfully", "pass");
    } catch (e) {
      await reportStep(this.page, "Products is not entered successfully..." + e, "fail");
    }

    return this;
  }

  async clickProductCost(cost) {
    try {
      const totalRows = await this.page
        .locator(
          "xpath=(//table[@class='o_list_table table table-sm table-hover position-relative mb-0 o_list_table_ungrouped table-striped'])//tbody//tr"
        )
        .count();
      console.log('Total number of rows:', totalRows);

      for (let row = 1; row <= Math.min(1, totalRows); row++) {
        const productRow = this.page.locator(
          `xpath=(//table[@class='o_list_table table table-sm table-hover position-relative mb-0 o_list_table_ungrouped table-striped'])//tbody//tr[${row}]//td[1]`
        );
        await productRow.click({ timeout: 30 * 1000 });

        const countQtyInput = this.page.locator(
          "xpath=(//table[@class='o_list_table table table-sm table-hover position-relative mb-0 o_list_table_ungrouped table-striped'])//tbody//tr[1]//td[6]//input"
        );
        await countQtyInput.clear({ timeout: 30 * 1000 });
        await countQtyInput.fill(String(cost));
        await this.page.waitForTimeout(5000);
      }

      await reportStep(this.page, "Product Count is clicked successfully", "pass");
    } catch (e) {
      await reportStep(this.page, "Product Count is clicked not successfully..." + e, "fail");
    }
    return this;
  }

  async clickProductCostNegative(cost) {
    try {
      const totalRows = await this.page
        .locator(
          "xpath=(//table[@class='o_list_table table table-sm table-hover position-relative mb-0 o_list_table_ungrouped table-striped'])//tbody//tr"
        )
        .count();
      console.log('Total number of rows:', totalRows);

      for (let row = 1; row <= Math.min(1, totalRows); row++) {
        const productRow = this.page.locator(
          `xpath=(//table[@class='o_list_table table table-sm table-hover position-relative mb-0 o_list_table_ungrouped table-striped'])//tbody//tr[${row}]//td[1]`
        );
        await productRow.click({ timeout: 30 * 1000 });

        const countQtyInput = this.page.locator(
          "xpath=(//table[@class='o_list_table table table-sm table-hover position-relative mb-0 o_list_table_ungrouped table-striped'])//tbody//tr[1]//td[6]//input"
        );
        await countQtyInput.clear({ timeout: 30 * 1000 });
        await countQtyInput.fill(String(cost));
        await countQtyInput.press('Enter');
        await this.page.waitForTimeout(5000);
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
      }

      await reportStep(this.page, "Product Count is clicked successfully", "pass");
    } catch (e) {
      await reportStep(this.page, "Product Count is clicked not successfully..." + e, "fail");
    }
    return this;
  }

  async clickValidateInventoryBtn() {
    try {
      await this.validateInventoryBtn.click({ timeout: 30 * 1000 });
      await this.page.waitForTimeout(10000);
      await this.action.click();
      await this.page.waitForTimeout(3000);
      await this.duplicate.click();
      await this.page.waitForTimeout(3000);
      await this.action1.click();
      await this.delete.click();
      await this.page.waitForTimeout(3000);
      await this.confirmDelete.click();
      await this.page.waitForTimeout(3000);
      await reportStep(this.page, "Validate Inventory button is entered successfully", "pass");
    } catch (e) {
      await reportStep(this.page, "Validate Inventory button is not entered successfully..." + e, "fail");
    }

    return this;
  }

  async clickValidateInventoryBtnNegative() {
    try {
      await this.validateInventoryBtn.click({ timeout: 30 * 1000 });
      await this.page.waitForTimeout(10000);
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

      await this.action.click();
      await this.page.waitForTimeout(3000);
      await this.duplicate.click();
      await this.page.waitForTimeout(3000);
      await this.action1.click();
      await this.delete.click();
      await this.page.waitForTimeout(3000);
      await this.confirmDelete.click();
      await this.page.waitForTimeout(3000);
      await reportStep(this.page, "Validate Inventory button is entered successfully", "pass");
    } catch (e) {
      await reportStep(this.page, "Validate Inventory button is not entered successfully..." + e, "fail");
    }

    return this;
  }

  async clickSaveBtn() {
    try {
      await this.saveBtn.click({ timeout: 30 * 1000 });
      await this.page.waitForTimeout(10000);

      await reportStep(this.page, "Save Button is entered successfully", "pass");
    } catch (e) {
      await reportStep(this.page, "Save Button is not entered successfully..." + e, "fail");
    }

    return this;
  }

  async productMasterMenu() {
    try {
      await this.productMasterMenuBtn.click({ timeout: 30 * 1000 });
      await this.page.waitForTimeout(5000);

      await reportStep(this.page, "productMaster Menu is clicked successfully", "pass");
    } catch (e) {
      await reportStep(this.page, "productMaster Menu is not clicked successfully..." + e, "fail");
    }
    return this;
  }

  async clickInventoryProduct(searchProduct) {
    try {
      await this.inventorySearchBox.fill(String(searchProduct));
      await this.inventorySearchBox.press('Enter');
      await this.page.waitForTimeout(10000);

      await this.inventoryProductClick.click();
      await this.page.waitForTimeout(8000);

      await reportStep(this.page, "Inventory Product is clicked successfully", "pass");
    } catch (e) {
      await reportStep(this.page, "Inventory Product is not clicked successfully..." + e, "fail");
    }
    return this;
  }

  async clickEditBtn(searchProduct) {
    try {
      await this.editBtn.click();
      await this.page.waitForTimeout(8000);

      await reportStep(this.page, "Edit Button is clicked successfully", "pass");
    } catch (e) {
      await reportStep(this.page, "Edit Button is not clicked successfully..." + e, "fail");
    }
    return this;
  }

  async GetCostDetails(searchProduct) {
    try {
      const averageCostText = await this.averageCost.textContent();
      console.log('Average Cost :', averageCostText);
      await this.page.waitForTimeout(8000);

      const current_costText = await this.current_cost.textContent();
      console.log('Current cost:', current_costText);
      await this.page.waitForTimeout(8000);

      await reportStep(this.page, "Get Cost Details is clicked successfully", "pass");
    } catch (e) {
      await reportStep(this.page, "Get Cost Details is not clicked successfully..." + e, "fail");
    }
    return this;
  }
}

module.exports = { productValuesAdjustments };
