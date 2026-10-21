const { reportStep } = require('../utils/reportStep');
const { ensureLoggedIn } = require('../utils/loginHelper');

// The original page object hardcodes "test"/"555" as the UoM category/type/
// route name. Odoo enforces uniqueness on these, so re-running against a live
// instance that already has a "test"/"555" record from a previous run fails
// with "Name must be unique!". e2eRegression is its own copy (not the shared
// inventory/ module), so it suffixes a per-run value onto each name instead.
const RUN_SUFFIX = Date.now();

// Shared with InventoryNewProductCreation so the product created in Step 02
// can look up and select this exact Product Category / UoM Type record
// instead of whatever happens to be the dropdown's default suggestion.
const E2E_CATEGORY_NAME = `E2E-Cat-${RUN_SUFFIX}`;
const E2E_UOM_TYPE_NAME = `E2E-Type-${RUN_SUFFIX}`;

class InventoryConfiguration {
  constructor(page) {
    this.page = page;

    // Login Page
    this.userName = page.locator("xpath=//input[@name='login']");
    this.passWord = page.locator("xpath=//input[@name='password']");
    this.logIn = page.locator("xpath=//button[contains(text(),'Login')]");

    // Means
    this.menu = page.locator("xpath=//ul[@class='o_menu_apps']//i[@class='fa fa-bars']");

    this.inventory = page.locator("xpath=//div[contains(text(),'Inventory')]");

    this.configuration = page.locator("xpath=//span[normalize-space()='Configuration']");

    this.configuration1 = page.locator("xpath=//span[normalize-space()='Configuration']");

    this.configuration2 = page.locator("xpath=//span[normalize-space()='Configuration']");

    this.configuration3 = page.locator("xpath=//span[normalize-space()='Configuration']");

    // "Configuration" itself is just a section header inside the navbar's
    // overflow dropdown (its own top-level nav button is permanently
    // display:none once the app has too many menu items to fit) — opening
    // this "More Menu" toggle is what actually reveals Product UPC Code,
    // UoM Categories/Types, and Route, so click this instead of Configuration.
    this.moreMenuBtn = page.locator("xpath=//button[@title='More Menu']");

    this.productUPC = page.locator("xpath=//a[normalize-space()='Product UPC Code']");

    this.productUomCategories = page.locator("xpath=//a[normalize-space()='Product Categories']");

    this.productUomTypes = page.locator("xpath=//a[normalize-space()='UoM Types']");

    this.route = page.locator("xpath=//a[normalize-space()='Route']");

    this.searchBox = page.locator("xpath=//input[@placeholder='Search...']");

    this.checkBox = page.locator(
      "xpath=//table[@class='o_list_table table table-sm table-hover position-relative mb-0 o_list_table_ungrouped table-striped']//tbody//tr[3]//td[1]"
    );

    this.actionBtn = page.locator("xpath=//span[normalize-space()='Actions']");

    this.export = page.locator("xpath=//span[normalize-space()='Export']");

    this.confirmExport = page.locator("xpath=//span[normalize-space()='Export']");

    this.newBtn = page.locator("xpath=//button[normalize-space()='New']");

    this.categoryName = page.getByRole("textbox", { name: "Category Name" });

    this.addaLine = page.locator("xpath=//a[normalize-space()='Add a line']");

    this.uomCategory = page.locator("xpath=(//div[@name='name'])[1]");

    this.saveBtn = page.locator("xpath=//button[normalize-space()='Save']");

    this.action = page.locator("xpath=//button[normalize-space()='Action']");

    this.duplicate = page.locator("xpath=//span[normalize-space()='Duplicate']");

    this.action1 = page.locator("xpath=//button[normalize-space()='Action']");

    this.delete = page.locator("xpath=//span[normalize-space()='Delete']");

    this.confirmDelete = page.locator("xpath=//button[normalize-space()='Delete']");

    this.newBtn1 = page.locator("xpath=//button[normalize-space()='New']");

    this.name = page.locator("xpath=//div[@name='name']//input[@type='text']");

    this.saveButton = page.locator("xpath=//button[normalize-space()='Save']");

    this.selectCategory = page.locator(
      "xpath=//table[@class='o_list_table table table-sm table-hover position-relative mb-0 o_list_table_ungrouped table-striped']//tbody//tr[3]//td[1]"
    );

    this.selectCategory1 = page.locator(
      "xpath=//table[@class='o_list_table table table-sm table-hover position-relative mb-0 o_list_table_ungrouped table-striped']//tbody//tr[3]//td[1]"
    );

    this.selectCategory2 = page.locator(
      "xpath=//table[@class='o_list_table table table-sm table-hover position-relative mb-0 o_list_table_ungrouped table-striped']//tbody//tr[3]//td[1]"
    );

    this.actionButton = page.locator("xpath=//span[normalize-space()='Actions']");

    this.exportButton = page.locator("xpath=//span[normalize-space()='Export']");

    this.confirmExportButton = page.locator("xpath=//button[normalize-space()='Export']");

    this.action2Button = page.locator("xpath=//span[normalize-space()='Actions']");

    this.archiveButton = page.locator("xpath=//span[normalize-space()='Archive']");

    this.confirmArchiveButton = page.locator("xpath=//button[normalize-space()='Archive']");

    this.action3Button = page.locator("xpath=//span[normalize-space()='Actions']");

    this.deleteButton = page.locator("xpath=//span[normalize-space()='Delete']");

    this.confirmDeleteButton = page.locator("xpath=//button[normalize-space()='Delete']");

    this.newBtn2 = page.locator("xpath=//button[normalize-space()='New']");

    this.name1 = page.locator("xpath=//input[@id='name_0']");

    this.truck = page.locator("xpath=//input[@id='truck_id_0']");

    this.truckSelect = page.locator("xpath=//a[@id='truck_id_0_0_0']");

    this.description = page.locator("xpath=//input[@id='desc_0']");

    this.saveButton1 = page.locator("xpath=//button[normalize-space()='Save']");

    this.routeAction = page.locator("xpath=//button[normalize-space()='Action']");

    this.routeDuplicate = page.locator("xpath=//span[normalize-space()='Duplicate']");

    this.routeAction1 = page.locator("xpath=//button[normalize-space()='Action']");

    this.routeDelete = page.locator("xpath=//span[normalize-space()='Delete']");

    this.routeConfirmDelete = page.locator("xpath=//button[normalize-space()='Delete']");
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
      await this.page.waitForTimeout(10000);

      await reportStep(this.page, "Menu button is entered successfully", "pass");
    } catch (e) {
      await reportStep(this.page, "Menu button is not entered successfully..." + e, "fail");
    }

    return this;
  }

  async clickInventoryMenuButton() {
    try {
      await this.page.waitForTimeout(5000);
      await this.inventory.click({ timeout: 30 * 1000 });
      await this.page.waitForTimeout(5000);

      await reportStep(this.page, "Inventory Menu button is entered successfully", "pass");
    } catch (e) {
      await reportStep(this.page, "Inventory Menu button is not entered successfully..." + e, "fail");
    }

    return this;
  }

  // Whether "Configuration" sits directly on the navbar or behind the
  // "More Menu" overflow toggle depends on how many menu items currently
  // fit in the viewport, so open whichever of the two is actually present.
  async openConfigurationOverflow() {
    const moreMenuVisible = await this.moreMenuBtn.isVisible({ timeout: 3000 }).catch(() => false);
    if (moreMenuVisible) {
      await this.moreMenuBtn.click();
    } else {
      await this.configuration.click();
    }
  }

  async clickUPC() {
    try {
      await this.openConfigurationOverflow();
      await this.page.waitForTimeout(5000);
      await this.page.waitForTimeout(5000);
      await this.productUPC.click();
      /*await this.page.waitForTimeout(3000);
      await this.searchBox.fill("moisturizer");
      await this.searchBox.press('Enter');*/
      await this.page.waitForTimeout(5000);
      await this.checkBox.click();
      await this.page.waitForTimeout(5000);
      await this.actionBtn.click();
      await this.page.waitForTimeout(5000);
      await this.export.click();
      await this.confirmExport.click();
      await this.page.waitForTimeout(2000);

      await reportStep(this.page, "Create button is entered successfully", "pass");
    } catch (e) {
      await reportStep(this.page, "Create button is not entered successfully..." + e, "fail");
    }

    return this;
  }

  async clickUomCategories() {
    try {
      await this.openConfigurationOverflow();
      await this.page.waitForTimeout(5000);
      await this.productUomCategories.click();
      await this.page.waitForTimeout(3000);
      await this.newBtn.click();
      await this.page.waitForTimeout(3000);
      await this.categoryName.fill(E2E_CATEGORY_NAME);
      await this.page.waitForTimeout(3000);
      await this.saveBtn.click();
      /*await this.addaLine.click();
      await this.page.waitForTimeout(3000);
      await this.uomCategory.fill("testcategory");

      await this.page.waitForTimeout(3000);
      await this.action.click();
      await this.duplicate.click();
      await this.page.waitForTimeout(3000);
      await this.action1.click();
      await this.delete.click();
      await this.page.waitForTimeout(3000);
      await this.confirmDelete.click();
      await this.page.waitForTimeout(3000);*/

      await reportStep(this.page, "Create button is entered successfully", "pass");
    } catch (e) {
      await reportStep(this.page, "Create button is not entered successfully..." + e, "fail");
    }

    return this;
  }

  async clickUomType() {
    try {
      await this.page.waitForTimeout(5000);

      await this.openConfigurationOverflow();
      await this.page.waitForTimeout(5000);
      await this.productUomTypes.click();
      await this.page.waitForTimeout(3000);
      await this.newBtn1.click();
      await this.page.waitForTimeout(3000);

      await this.name.fill(E2E_UOM_TYPE_NAME);
      await this.saveButton.click();
      await this.page.waitForTimeout(3000);
      //  await this.selectCategory.click();
      //  await this.selectCategory.evaluate((node) => node.click());
      //    await this.page.waitForTimeout(3000);
      /*  await this.actionButton.click();
      await this.page.waitForTimeout(3000);
      await this.exportButton.click();
      await this.page.waitForTimeout(3000);
      await this.confirmExportButton.click();
      await this.page.waitForTimeout(3000);

      //await this.selectCategory1.evaluate((node) => node.click());

      //  await this.selectCategory2.evaluate((node) => node.click());
      await this.action3Button.click();
      await this.page.waitForTimeout(3000);
      await this.deleteButton.click();
      await this.confirmDeleteButton.click();
      await this.page.waitForTimeout(3000);*/

      await reportStep(this.page, "Inventory Menu button is entered successfully", "pass");
    } catch (e) {
      await reportStep(this.page, "Inventory Menu button is not entered successfully..." + e, "fail");
    }

    return this;
  }

  async clickRoute() {
    try {
      await this.openConfigurationOverflow();
      await this.page.waitForTimeout(5000);
      await this.route.click();
      await this.page.waitForTimeout(3000);
      await this.newBtn2.click();
      await this.page.waitForTimeout(3000);
      await this.name1.fill(String(RUN_SUFFIX));
      await this.page.waitForTimeout(3000);
      await this.truck.click();
      await this.truckSelect.click();
      await this.page.waitForTimeout(3000);
      await this.description.fill("testcatedory");
      await this.saveButton1.click();
      await this.page.waitForTimeout(3000);
      // The original page object then did Action > Duplicate > Action > Delete
      // as cleanup, but Route ID is a manually-set unique field, so the
      // duplicate copies the same ID before it can be renamed and Odoo
      // rejects it outright ("Another Route already exists with this ID!").
      // Not needed for the actual create-a-route step, so it's dropped here.

      await reportStep(this.page, "Create button is entered successfully", "pass");
    } catch (e) {
      await reportStep(this.page, "Create button is not entered successfully..." + e, "fail");
    }

    return this;
  }
}

module.exports = { InventoryConfiguration, E2E_CATEGORY_NAME, E2E_UOM_TYPE_NAME };
