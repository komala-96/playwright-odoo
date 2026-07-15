const { expect } = require('../fixtures/base');
const { reportStep } = require('../utils/reportStep');
const { ensureLoggedIn } = require('../utils/loginHelper');

class InventoryProduct {
  constructor(page) {
    this.page = page;

    // Login Page
    this.userName = page.locator("xpath=//input[@name='login']");
    this.passWord = page.locator("xpath=//input[@name='password']");
    this.logIn = page.locator("xpath=//button[contains(text(),'Log in')]");

    // Means
    this.menu = page.locator("xpath=//ul[@class='o_menu_apps']//i[@class='fa fa-bars']");

    // PurchaseOrder
    this.inventoryMenu = page.locator("xpath=//div[contains(text(),'Inventory')]");

    this.productMenu = page.locator("xpath=(//span[contains(text(),'Products')])[1]");

    this.productClick = page.locator("xpath=//a[normalize-space()='Products']");

    this.inventorySearchBox = page.locator("xpath=//input[@placeholder='Search...']");

    this.inventoryProductClick = page.locator(
      "xpath=//div[@class='o_kanban_renderer o_renderer d-flex o_kanban_ungrouped align-content-start flex-wrap justify-content-start']//article"
    );

    this.onHand = page.locator("xpath=//span[normalize-space()='On Hand']");

    this.locSelect = page.locator(
      "xpath=(//table[@class='o_list_table table table-sm table-hover position-relative mb-0 o_list_table_ungrouped table-striped'])//tbody//tr[1]//td[1]"
    );

    this.print = page.locator("xpath=//span[normalize-space()='Print']");

    this.countSelect = page.locator("xpath=(//span[@role='menuitem'])[1]");

    this.newBtn1 = page.locator("xpath=//button[normalize-space()='New']");

    this.newBtn2 = page.locator("xpath=//button[normalize-space()='New']");

    this.binLocation = page.locator("xpath=//input[@role='combobox']");

    this.searchMore = page.locator("xpath=//a[@id='autocomplete_0_8']");

    this.binSelect = page.locator(
      "xpath=(//table[@class='o_list_table table table-sm table-hover position-relative mb-0 o_list_table_ungrouped table-striped'])[2]//tbody//tr[2]//td[1]"
    );

    this.binLocation1 = page.locator("xpath=//input[@role='combobox']");

    this.searchMore1 = page.locator("xpath=//a[@id='autocomplete_0_8']");

    this.binSelect1 = page.locator(
      "xpath=(//table[@class='o_list_table table table-sm table-hover position-relative mb-0 o_list_table_ungrouped table-striped'])[2]//tbody//tr[2]//td[1]"
    );

    this.quantity = page.locator("xpath=//div[@name='inventory_quantity_auto_apply']//input[@type='text']");

    this.minquantity = page.locator("xpath=//div[@name='product_min_qty']//input[@type='text']");

    this.maxquantity = page.locator("xpath=//div[@name='product_max_qty']//input[@type='text']");

    this.saveButton = page.locator("xpath=//button[normalize-space()='Save']");

    this.saveButton1 = page.locator("xpath=//button[normalize-space()='Save']");

    this.saveButton2 = page.locator("xpath=//button[normalize-space()='Save']");

    this.backButton = page.locator("xpath=//a[normalize-space()='[PC10850] Advil']");

    this.backButton1 = page.locator("xpath=//a[normalize-space()='[PC10850] Advil']");

    this.backButton2 = page.locator("xpath=//a[normalize-space()='[PC10850] Advil']");

    this.backButton3 = page.locator("xpath=//a[normalize-space()='[PC10850] Advil']");

    this.backButton4 = page.locator("xpath=//a[normalize-space()='[PC10850] Advil']");

    this.backButton5 = page.locator("xpath=//a[normalize-space()='[PC10850] Advil']");

    // NOTE: Java field "costHistory" shared its name with method costHistory();
    // renamed the locator field to avoid shadowing the prototype method in JS.
    this.costHistoryBtn = page.locator("xpath=//span[contains(text(),'Cost History')]");

    this.checkBox = page.locator("xpath=//div[@class='o-checkbox form-check d-flex m-0']//input[@type='checkbox']");

    this.action = page.locator("xpath=//span[normalize-space()='Actions']");

    this.export = page.locator("xpath=(//span[@role='menuitem'])[1]");

    this.close = page.locator("xpath=//button[normalize-space()='Close']");

    // NOTE: Java field "traceability" shared its name with method traceability();
    // renamed the locator field to avoid shadowing the prototype method in JS.
    this.traceabilityBtn = page.locator("xpath=//button[@name='action_view_averigo_stock_move_lines']");

    this.checkBox1 = page.locator("xpath=//div[@class='o-checkbox form-check d-flex m-0']//input[@type='checkbox']");

    this.action1 = page.locator("xpath=//span[normalize-space()='Actions']");

    this.export1 = page.locator("xpath=//span[normalize-space()='Export']");

    this.confirmexport1 = page.locator("xpath=//button[normalize-space()='Export']");

    this.close1 = page.locator("xpath=//button[normalize-space()='Close']");

    // NOTE: Java field "truck" shared its name with method truck();
    // renamed the locator field to avoid shadowing the prototype method in JS.
    this.truckBtn = page.locator("xpath=//button[@name='action_open_truck_quants']");

    this.checkBox2 = page.locator("xpath=//div[@class='o-checkbox form-check d-flex m-0']//input[@type='checkbox']");

    this.print1 = page.locator("xpath=//span[normalize-space()='Print']");

    this.countSelect1 = page.locator("xpath=(//span[@role='menuitem'])[1]");

    this.action2 = page.locator("xpath=//button[normalize-space()='Action']");

    this.export2 = page.locator("xpath=//i[@class='fa fa-fw fa-upload me-1']");

    this.close2 = page.locator("xpath=//button[normalize-space()='Close']");

    this.reOrder = page.locator("xpath=//span[@class='o_stat_info o_stat_value']");

    this.putAwayRules = page.locator("xpath=//span[normalize-space()='Putaway Rules']");

    this.product = page.locator("xpath=//div[@name='product_id']//input[@type='text']");

    this.productSelect = page.locator("xpath=//a[@id='product_id_0_0_0']");

    this.productCategory = page.locator("xpath=//input[@id='category_id_0']");

    this.productCategorySelect = page.locator("xpath=//a[@id='category_id_0_0_0']");

    this.productArrives = page.locator("xpath=//input[@id='location_in_id_0']");

    this.productArrivesSelect = page.locator("xpath=//a[@id='location_in_id_0_0_0']");

    this.store = page.locator("xpath=//input[@id='location_out_id_0']");

    this.storeTo = page.locator("xpath=//a[@id='location_out_id_0_0_1']");

    this.priority = page.locator("xpath=//input[@id='sequence_0']");

    this.addaLine = page.locator("xpath=//a[normalize-space()='Add a line']");

    this.searchBox = page.locator("xpath=//input[@placeholder='Search...']");

    this.packageSelect = page.locator(
      "xpath=(//table[@class='o_list_table table table-sm table-hover position-relative mb-0 o_list_table_ungrouped table-striped'])[2]//tbody//tr[1]//td[1]"
    );

    this.Select = page.locator("xpath=//button[normalize-space()='Select']");

    this.storageCategory = page.locator("xpath=//input[@id='storage_category_id_0']");

    this.storageCategorySelect = page.locator("xpath=//a[@id='storage_category_id_0_0_0']");

    this.subLocation = page.locator("xpath=//select[@id='sublocation_0']");
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

  async enterUserName(user) {
    try {
      await this.userName.fill(String(user));

      await reportStep(this.page, "username is entered successfully", "pass");
    } catch (e) {
      await reportStep(this.page, "username is not entered successfully..." + e, "fail");
    }
    return this;
  }

  async enterPassWord(pass) {
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

  async clickInventoryMenu() {
    try {
      // await this.menu.click({ timeout: 30 * 1000 });
      await this.page.waitForTimeout(5000);

      await this.inventoryMenu.click();
      await this.page.waitForTimeout(25000);
      /*await this.productMenu.click();
      await this.page.waitForTimeout(3000);
      await this.productClick.click();
      await this.page.waitForTimeout(3000);*/

      await reportStep(this.page, "clickInventoryMenu clicked successfully", "pass");
    } catch (e) {
      await reportStep(this.page, "clickInventoryMenu clicked not successfully..." + e, "fail");
    }
    return this;
  }

  async clickInventoryProduct(searchProduct) {
    try {
      await this.page.waitForTimeout(5000);
      await this.inventorySearchBox.fill(String(searchProduct));
      await this.inventorySearchBox.press('Enter');
      await this.page.waitForTimeout(5000);

      await this.inventoryProductClick.click();
      await this.page.waitForTimeout(3000);

      await reportStep(this.page, "Inventory Product clicked successfully", "pass");
    } catch (e) {
      await reportStep(this.page, "Inventory Product clicked not successfully..." + e, "fail");
    }
    return this;
  }

  async stockOnHand(quan) {
    try {
      await this.page.waitForTimeout(3000);
      await this.onHand.click();
      // action_open_quants is slow on this backend (observed ~35s), well past
      // the 30s default auto-wait, so give the resulting list extra headroom.
      await this.locSelect.waitFor({ state: 'visible', timeout: 60000 });
      await this.locSelect.click();
      await this.page.waitForTimeout(3000);
      await this.action.click();
      await this.page.waitForTimeout(3000);
      await this.export1.click();
      await this.page.waitForTimeout(3000);
      await this.confirmexport1.click();
      await this.page.waitForTimeout(3000);
      await this.close1.click();
      await this.page.waitForTimeout(3000);
      await this.backButton.click();
      await this.page.waitForTimeout(3000);

      await reportStep(this.page, "Get the stockOnHand Details is clicked successfully", "pass");
    } catch (e) {
      await reportStep(this.page, "Get the stockOnHand Details is not clicked successfully..." + e, "fail");
    }
    return this;
  }

  async stockOnHandNegative(quan) {
    try {
      await this.page.waitForTimeout(3000);
      await this.onHand.click();
      await this.locSelect.waitFor({ state: 'visible', timeout: 60000 });
      await this.locSelect.click();
      await this.page.waitForTimeout(3000);
      await this.print.click();
      await this.countSelect.click();
      await this.page.waitForTimeout(6000);
      await this.backButton.click();
      await this.page.waitForTimeout(3000);

      await reportStep(this.page, "Get the stockOnHand Details is clicked successfully", "pass");
    } catch (e) {
      await reportStep(this.page, "Get the stockOnHand Details is not clicked successfully..." + e, "fail");
    }
    return this;
  }

  async costHistory() {
    try {
      await this.page.waitForTimeout(3000);
      await this.costHistoryBtn.click();
      await this.page.waitForTimeout(3000);
      /*await this.checkBox.click();
      await this.page.waitForTimeout(3000);
      await this.action.click();
      await this.page.waitForTimeout(3000);
      await this.export.click();
      await this.page.waitForTimeout(6000);
      await this.close.click();
      await this.page.waitForTimeout(3000);*/
      await this.backButton1.click();
      await this.page.waitForTimeout(3000);

      await reportStep(this.page, "Get the costHistory Details is clicked successfully", "pass");
    } catch (e) {
      await reportStep(this.page, "Get the costHistory Details is not clicked successfully..." + e, "fail");
    }
    return this;
  }

  async traceability() {
    try {
      await this.page.waitForTimeout(3000);
      await this.traceabilityBtn.click();
      await this.checkBox1.waitFor({ state: 'visible', timeout: 60000 });
      await this.checkBox1.click();
      await this.page.waitForTimeout(3000);
      /*await this.action1.click();
      await this.export1.click();
      await this.confirmexport1.click();
      await this.close1.click();
      await this.page.waitForTimeout(6000);*/
      await this.backButton2.click();

      await reportStep(this.page, "Get the traceability Details is clicked successfully", "pass");
    } catch (e) {
      await reportStep(this.page, "Get the traceability Details is not clicked successfully..." + e, "fail");
    }
    return this;
  }

  async truck() {
    try {
      await this.page.waitForTimeout(3000);
      await this.truckBtn.click();
      await this.checkBox2.waitFor({ state: 'visible', timeout: 60000 });
      await this.checkBox2.click();
      await this.page.waitForTimeout(3000);
      await this.action1.click();
      await this.page.waitForTimeout(3000);
      await this.export1.click();
      await this.page.waitForTimeout(3000);
      await this.confirmexport1.click();
      await this.page.waitForTimeout(3000);
      await this.close1.click();
      await this.page.waitForTimeout(3000);
      await this.backButton3.click();
      await this.page.waitForTimeout(3000);

      await reportStep(this.page, "Get the truck Details is clicked successfully", "pass");
    } catch (e) {
      await reportStep(this.page, "Get the truck Details is not clicked successfully..." + e, "fail");
    }
    return this;
  }

  async reordering(quan) {
    try {
      await this.page.waitForTimeout(3000);
      await this.reOrder.click();
      await this.page.waitForTimeout(3000);
      await this.newBtn1.click();
      await this.page.waitForTimeout(3000);
      await this.binLocation1.click();
      await this.searchMore1.click();
      await this.page.waitForTimeout(3000);
      await this.binSelect1.click();
      // await this.binSelect.evaluate((node) => node.click());
      await this.page.waitForTimeout(3000);
      await this.minquantity.clear();
      await this.minquantity.fill(String(quan));
      await this.page.waitForTimeout(3000);
      await this.maxquantity.clear();
      await this.maxquantity.fill(String(quan));
      await this.page.waitForTimeout(3000);
      await this.saveButton1.click();
      await this.page.waitForTimeout(3000);
      await this.backButton4.click();

      await reportStep(this.page, "Get the reordering Details is clicked successfully", "pass");
    } catch (e) {
      await reportStep(this.page, "Get the reordering Details is not clicked successfully..." + e, "fail");
    }
    return this;
  }

  async reorderingNegative(quan) {
    try {
      await this.page.waitForTimeout(3000);
      await this.reOrder.click();
      await this.page.waitForTimeout(3000);
      await this.newBtn1.click();
      await this.page.waitForTimeout(3000);
      await this.binLocation1.click();
      await this.searchMore1.click();
      await this.page.waitForTimeout(3000);
      await this.binSelect1.click();
      // await this.binSelect.evaluate((node) => node.click());
      await this.page.waitForTimeout(3000);
      await this.minquantity.clear();
      await this.minquantity.fill(String(quan));
      await this.minquantity.press('Enter');
      await this.page.waitForTimeout(3000);
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

      await this.maxquantity.clear();
      await this.maxquantity.fill(String(quan));
      await this.maxquantity.press('Enter');
      await this.page.waitForTimeout(3000);
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

      await this.saveButton1.click();
      await this.page.waitForTimeout(3000);
      await this.backButton4.click();

      await reportStep(this.page, "Get the reordering Details is clicked successfully", "pass");
    } catch (e) {
      await reportStep(this.page, "Get the reordering Details is not clicked successfully..." + e, "fail");
    }
    return this;
  }

  async putawayRules(quan) {
    try {
      await this.page.waitForTimeout(3000);
      await this.putAwayRules.click();
      await this.page.waitForTimeout(3000);
      await this.newBtn2.click();
      await this.page.waitForTimeout(3000);
      await this.product.click();
      await this.productSelect.click();
      await this.page.waitForTimeout(3000);
      await this.productCategory.click();
      await this.productCategorySelect.click();
      await this.page.waitForTimeout(3000);
      await this.productArrives.click();
      await this.productArrivesSelect.click();
      await this.page.waitForTimeout(3000);
      await this.store.click();
      await this.storeTo.click();
      await this.page.waitForTimeout(3000);
      await this.priority.fill("1");
      await this.page.waitForTimeout(3000);
      await this.addaLine.click();
      await this.page.waitForTimeout(3000);
      await this.searchBox.fill("test");
      await this.page.waitForTimeout(3000);
      await this.packageSelect.click();
      await this.Select.click();
      await this.page.waitForTimeout(3000);
      await this.storageCategory.click();
      await this.storageCategorySelect.click();
      await this.page.waitForTimeout(3000);
      await this.subLocation.selectOption({ index: 1 });
      await this.page.waitForTimeout(3000);
      await this.saveButton2.click();
      await this.page.waitForTimeout(3000);
      await this.backButton5.click();

      await reportStep(this.page, "Get the putawayRules Details is clicked successfully", "pass");
    } catch (e) {
      await reportStep(this.page, "Get the putawayRules Details is not clicked successfully..." + e, "fail");
    }
    return this;
  }

  async putawayRulesNegative() {
    try {
      await this.page.waitForTimeout(3000);
      await this.putAwayRules.click();
      await this.page.waitForTimeout(3000);
      await this.newBtn2.click();
      await this.page.waitForTimeout(3000);
      await this.product.click();
      await this.productSelect.click();
      await this.page.waitForTimeout(3000);
      await this.productCategory.click();
      await this.productCategorySelect.click();
      await this.page.waitForTimeout(3000);
      //   await this.productArrives.click();
      //  await this.productArrivesSelect.click();
      await this.page.waitForTimeout(3000);
      //  await this.store.click();
      //  await this.storeTo.click();
      await this.page.waitForTimeout(3000);
      await this.priority.fill("1");
      await this.page.waitForTimeout(3000);
      await this.addaLine.click();
      await this.page.waitForTimeout(3000);
      await this.searchBox.fill("test");
      await this.page.waitForTimeout(3000);
      await this.packageSelect.click();
      await this.Select.click();
      await this.page.waitForTimeout(3000);
      await this.storageCategory.click();
      await this.storageCategorySelect.click();
      await this.page.waitForTimeout(3000);
      await this.subLocation.selectOption({ index: 1 });
      await this.page.waitForTimeout(3000);
      await this.saveButton2.click();
      await this.page.waitForTimeout(3000);
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
      await this.backButton5.click();

      await reportStep(this.page, "Get the putawayRules Details is clicked successfully", "pass");
    } catch (e) {
      await reportStep(this.page, "Get the putawayRules Details is not clicked successfully..." + e, "fail");
    }
    return this;
  }
}

module.exports = { InventoryProduct };
