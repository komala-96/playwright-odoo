const { expect } = require('../fixtures/base');
const { reportStep } = require('../utils/reportStep');

class EquipmentPart {
  constructor(page) {
    this.page = page;

    // Login Page
    this.userName = page.locator("xpath=//input[@name='login']");
    this.passWord = page.locator("xpath=//input[@name='password']");
    this.logIn = page.locator("xpath=//button[@type='submit']");

    // Menu
    this.menu = page.locator("xpath=//ul[@class='o_menu_apps']//i[@class='fa fa-bars']");
    this.serviceMenu = page.locator("xpath=//div[contains(text(),'Service Management')]");

    // save btn
    this.equipmentMenu = page.locator("xpath=(//ul[@class='o_menu_sections']//a[contains(text(),'Equipment Parts')])");

    this.equipmentParts = page.locator("xpath=//a[normalize-space()='Equipment Parts']");

    this.createBtn = page.locator("xpath=//button[normalize-space()='New']");

    this.partName = page.locator("xpath=//input[@id='name_0']");

    this.partType = page.locator("xpath=//select[@id='product_type_0']");

    this.category = page.locator("xpath=//input[@id='categ_id_0']");

    this.categorySelect = page.locator("xpath=//a[@id='categ_id_0_0_0']");

    this.uom = page.locator("xpath=//input[@id='uom_id_0']");

    this.uomSelect = page.locator("xpath=//a[@id='uom_id_0_0_0']");

    this.price = page.locator("xpath=//input[@id='list_price_0']");

    this.vendor = page.locator("xpath=//input[@id='res_partner_0']");

    this.vendorSelect = page.locator("xpath=//a[@id='res_partner_0_0_0']");

    this.updateCost = page.locator("xpath=//input[@id='standard_price_0']");

    this.newPrice = page.locator("xpath=//input[@name='new_price']");

    this.applyBtn = page.locator("xpath=(//span[normalize-space()='Apply'])[1]");

    this.saveBtn = page.locator("xpath=//button[normalize-space()='Save']");

    this.backEquip = page.locator("xpath=//a[@class='fw-bold text-truncate']");

    this.search = page.locator("xpath=//input[@placeholder='Search...']");

    this.equipClick = page.locator(
      "xpath=//table[@class='o_list_table table table-sm table-hover position-relative mb-0 o_list_table_ungrouped table-striped']//tbody//tr[1]//td[2]"
    );

    // NOTE: Java field "traceability" shared its name with method traceability();
    // renamed the locator field to avoid shadowing the prototype method in JS.
    this.traceabilityBtn = page.locator("xpath=//span[normalize-space()='Traceability']");

    this.checkBox1 = page.locator("xpath=//div[@class='o-checkbox form-check d-flex m-0']//input[@type='checkbox']");

    this.action1 = page.locator("xpath=//button[normalize-space()='Action']");

    this.export1 = page.locator("xpath=//span[@role='menuitem']");

    this.confirmexport1 = page.locator("xpath=//button[normalize-space()='Export']");

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

    this.newBtn2 = page.locator("xpath=//button[normalize-space()='New']");

    this.backButton2 = page.locator("xpath=//li[@class='breadcrumb-item d-inline-flex min-w-0 o_back_button']");

    this.saveButton2 = page.locator("xpath=//button[normalize-space()='Save']");

    this.backButton4 = page.locator("xpath=//li[@class='breadcrumb-item d-inline-flex min-w-0 o_back_button']");

    this.backButton5 = page.locator("xpath=//li[@class='breadcrumb-item d-inline-flex min-w-0 o_back_button']");

    this.action = page.locator("xpath=//button[normalize-space()='Action']");

    this.duplicate = page.locator("xpath=//span[normalize-space()='Duplicate']");

    this.actionDelete = page.locator("xpath=//button[normalize-space()='Action']");

    this.delete = page.locator("xpath=//span[normalize-space()='Delete']");

    this.confirmDelete = page.locator("xpath=//button[normalize-space()='Delete']");
  }

  async isErrorDisplayed() {
    return this.page
      .locator("xpath=//div[@class='me-auto o_notification_content']")
      .isVisible()
      .catch(() => false);
  }

  async enterUsername(user, pass) {
    try {
      await this.userName.fill(String(user));
      await this.passWord.fill(String(pass));
      await this.logIn.click();

      await reportStep(this.page, "login button is entered successfully", "pass");
    } catch (e) {
      await reportStep(this.page, "login button is not entered successfully..." + e, "fail");
    }
    return this;
  }

  async clickMenu() {
    try {
      await this.menu.click({ timeout: 30 * 1000 });

      await this.page.waitForTimeout(2000);
      await this.serviceMenu.click();

      await this.page.waitForTimeout(3000);

      await reportStep(this.page, "Menu clicked successfully", "pass");
    } catch (e) {
      await reportStep(this.page, "Menu clicked not successfully..." + e, "fail");
    }
    return this;
  }

  async clickServiceMenuBtn() {
    try {
      await this.page.waitForTimeout(2000);
      await this.serviceMenu.click();
      await this.page.waitForTimeout(2000);
      await this.equipmentParts.click();
      await this.page.waitForTimeout(3000);

      await reportStep(this.page, "Financial Accounting menu is clicked successfully", "pass");
    } catch (e) {
      await reportStep(this.page, "Financial Accounting menu is not clicked successfully..." + e, "fail");
    }
    return this;
  }

  async clickCreateBtn() {
    try {
      await this.createBtn.click({ timeout: 30 * 1000 });
      await this.page.waitForTimeout(10000);

      await reportStep(this.page, "Create Btn is clicked successfully", "pass");
    } catch (e) {
      await reportStep(this.page, "Create Btn is not clicked successfully..." + e, "fail");
    }
    return this;
  }

  async clickCreateEquipmentPartsBtn(name, price1, price2) {
    try {
      await this.partName.fill(String(name));
      await this.page.waitForTimeout(2000);
      await this.partType.selectOption({ label: 'Product' });
      await this.page.waitForTimeout(2000);
      await this.category.click();
      await this.categorySelect.click();
      await this.page.waitForTimeout(2000);
      await this.uom.click();
      await this.uomSelect.click();
      await this.page.waitForTimeout(2000);
      await this.price.clear();
      await this.price.fill(String(price1));
      await this.page.waitForTimeout(2000);
      await this.vendor.fill("komala");
      // await this.vendor.evaluate((node) => node.click());
      await this.page.waitForTimeout(2000);
      await this.vendorSelect.click();
      await this.page.waitForTimeout(2000);
      await this.updateCost.click();
      await this.page.waitForTimeout(2000);
      await this.updateCost.clear();
      await this.updateCost.fill(String(price2));
      await this.page.waitForTimeout(2000);
      //await this.applyBtn.click();
      //await this.page.waitForTimeout(4000);
      await this.saveBtn.click();
      await this.page.waitForTimeout(2000);

      await reportStep(this.page, "Create Btn is clicked successfully", "pass");
    } catch (e) {
      await reportStep(this.page, "Create Btn is not clicked successfully..." + e, "fail");
    }
    return this;
  }

  async clickCreateEquipmentPartsBtnNegative(name, price1, price2) {
    try {
      await this.partName.fill(String(name));
      await this.page.waitForTimeout(2000);
      await this.partType.selectOption({ label: 'Product' });
      await this.page.waitForTimeout(2000);
      await this.category.click();
      await this.categorySelect.click();
      await this.page.waitForTimeout(2000);
      await this.uom.click();
      await this.uomSelect.click();
      await this.page.waitForTimeout(2000);
      await this.price.clear();
      await this.price.fill(String(price1));
      await this.page.waitForTimeout(2000);
      try {
        const errorMsg = this.page.locator("xpath=//div[@class='o_dialog']//p");
        await errorMsg.waitFor({ state: 'visible', timeout: 30000 });
        const errorMessageText = await errorMsg.textContent();
        console.log("Validation Error Message: " + errorMessageText);

        // Dismiss the validation error
        const errorMsgOk = this.page.locator("xpath=//button[normalize-space()='Close']");
        await errorMsgOk.click();
        console.log("Validation error dismissed successfully for row ");
        await this.page.waitForTimeout(3000);
      } catch (e) {
        console.log("No validation error for row ");
      }
      await this.vendor.fill("komala");
      // await this.vendor.evaluate((node) => node.click());
      await this.page.waitForTimeout(2000);
      await this.vendorSelect.click();
      await this.page.waitForTimeout(2000);
      await this.updateCost.click();
      await this.page.waitForTimeout(2000);
      await this.updateCost.clear();
      await this.updateCost.fill(String(price2));
      await this.page.waitForTimeout(2000);
      try {
        const errorMsg = this.page.locator("xpath=//div[@class='o_dialog']//p");
        await errorMsg.waitFor({ state: 'visible', timeout: 30000 });
        const errorMessageText = await errorMsg.textContent();
        console.log("Validation Error Message: " + errorMessageText);

        // Dismiss the validation error
        const errorMsgOk = this.page.locator("xpath=//button[normalize-space()='Close']");
        await errorMsgOk.click();
        console.log("Validation error dismissed successfully for row ");
        await this.page.waitForTimeout(3000);
      } catch (e) {
        console.log("No validation error for row ");
      }
      //await this.applyBtn.click();
      //await this.page.waitForTimeout(4000);
      await this.saveBtn.click();
      await this.page.waitForTimeout(2000);
      try {
        const validationMessage = this.page.locator("xpath=//div[@class='o_notification_body mt-2']");
        await validationMessage.waitFor({ state: 'visible', timeout: 30000 });
        const messageText = await validationMessage.textContent();
        console.log('Validation Message:', messageText);

        expect(await this.isErrorDisplayed(), "Error message should be displayed for empty name field").toBeTruthy();
      } catch (e) {
        // No validation message found; proceed normally
        console.log('No validation message displayed.');
      }

      await reportStep(this.page, "Create Btn is clicked successfully", "pass");
    } catch (e) {
      await reportStep(this.page, "Create Btn is not clicked successfully..." + e, "fail");
    }
    return this;
  }

  async traceability() {
    try {
      await this.page.waitForTimeout(5000);
      await this.backEquip.click();
      await this.page.waitForTimeout(5000);
      await this.search.fill("equipment");
      await this.search.press('Enter');
      await this.page.waitForTimeout(5000);
      await this.equipClick.click();
      await this.page.waitForTimeout(3000);
      await this.page.waitForTimeout(3000);
      await this.traceabilityBtn.click();
      await this.page.waitForTimeout(3000);
      await this.checkBox1.click();
      await this.page.waitForTimeout(3000);
      //await this.action1.click();
      //await this.export1.click();
      //await this.confirmexport1.click();
      await this.page.waitForTimeout(6000);
      await this.backButton2.click();

      await reportStep(this.page, "Get the Product Details is clicked successfully", "pass");
    } catch (e) {
      await reportStep(this.page, "Get the Product Details is not clicked successfully..." + e, "fail");
    }
    return this;
  }

  async putawayRules() {
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
      await this.backButton4.click();

      await this.page.waitForTimeout(3000);
      await this.backButton5.click();
      await this.page.waitForTimeout(3000);
      await this.action.click();
      await this.duplicate.click();
      await this.page.waitForTimeout(3000);
      await this.actionDelete.click();
      await this.delete.click();
      await this.confirmDelete.click();
      await this.page.waitForTimeout(3000);

      await reportStep(this.page, "Get the stockOnHand Details is clicked successfully", "pass");
    } catch (e) {
      await reportStep(this.page, "Get the stockOnHand Details is not clicked successfully..." + e, "fail");
    }
    return this;
  }
}

module.exports = { EquipmentPart };
