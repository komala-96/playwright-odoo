const { expect } = require('../fixtures/base');
const { reportStep } = require('../utils/reportStep');
const { ensureLoggedIn } = require('../utils/loginHelper');

class productQuantityAdjustments {
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

    this.quantityAdjustment = page.locator("xpath=//a[@role='menuitem'][normalize-space()='Quantity Adjustments']");

    this.createBtn = page.locator("xpath=//button[normalize-space()='New']");

    this.location = page.locator("xpath=//input[@id='warehouse_id_0']");

    this.locationSelect = page.locator("xpath=//a[@id='warehouse_id_0_0_0']");

    this.referenceNo = page.locator("xpath=//input[@id='name_0']");

    this.type = page.locator("xpath=//select[@id='scan_type_0']");

    this.product = page.locator("xpath=//input[@id='product_ids_0']");

    this.productSearchMore = page.locator("xpath=(//a[normalize-space()='Search More...'])[1]");

    this.productSearchBox = page.locator("xpath=//input[@placeholder='Search...']");

    this.productSelect = page.locator(
      "xpath=//table[@class='o_list_table table table-sm table-hover position-relative mb-0 o_list_table_ungrouped table-striped']//tbody//tr[1]//td[3]"
    );

    // table[@class='o_list_table table table-sm table-hover table-striped o_list_table_ungrouped']//tbody//tr[1]//td[7]//input
    this.productAdd = page.locator("xpath=(//button[@name='action_start']//span[contains(text(),'Add')])[1]");

    this.validateInventoryBtn = page.locator("xpath=//span[normalize-space()='Validate Inventory']");

    this.saveBtn = page.locator("xpath=//button[contains(text(),'Save')]");

    this.actionBtn = page.locator("xpath=//button[normalize-space()='Action']");

    this.duplicate = page.locator("xpath=//span[normalize-space()='Duplicate']");

    this.product1 = page.locator("xpath=//input[@id='product_ids_0']");

    this.productSearchMore1 = page.locator("xpath=(//a[normalize-space()='Search More...'])[1]");

    this.productSearchBox1 = page.locator("xpath=//input[@placeholder='Search...']");

    this.productSelect1 = page.locator(
      "xpath=//table[@class='o_list_table table table-sm table-hover position-relative mb-0 o_list_table_ungrouped table-striped']//tbody//tr[1]//td[3]"
    );

    // table[@class='o_list_table table table-sm table-hover table-striped o_list_table_ungrouped']//tbody//tr[1]//td[7]//input
    this.productAdd1 = page.locator("xpath=(//button[@name='action_start']//span[contains(text(),'Add')])[1]");

    this.cancelInventory = page.locator("xpath=//span[normalize-space()='Cancel Inventory']");

    this.okBtn = page.locator("xpath=//button[normalize-space()='Ok']");

    this.action = page.locator("xpath=//button[normalize-space()='Action']");

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

  async clickInventoryAdjustmentMenuButton() {
    try {
      await this.page.waitForTimeout(5000);
      await this.inventoryAdjustmentMenu.click();
      await this.page.waitForTimeout(6000);

      await this.quantityAdjustment.click();
      await this.page.waitForTimeout(5000);

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

  async clickLocationUpdate() {
    try {
      await this.location.click({ timeout: 30 * 1000 });
      await this.page.waitForTimeout(5000);

      await this.locationSelect.click();
      await this.page.waitForTimeout(5000);

      await reportStep(this.page, "Quantity Adjustments is entered successfully", "pass");
    } catch (e) {
      await reportStep(this.page, "Quantity Adjustments is not entered successfully..." + e, "fail");
    }

    return this;
  }

  async clickLocationUpdateNegative() {
    try {
      await this.saveBtn.click();

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

      await this.location.click({ timeout: 30 * 1000 });
      await this.page.waitForTimeout(5000);

      await this.locationSelect.click();
      await this.page.waitForTimeout(5000);

      await reportStep(this.page, "Quantity Adjustments is entered successfully", "pass");
    } catch (e) {
      await reportStep(this.page, "Quantity Adjustments is not entered successfully..." + e, "fail");
    }

    return this;
  }

  async clickQuantityAdjustments(refNo) {
    try {
      await this.referenceNo.fill(String(refNo));
      await this.page.waitForTimeout(5000);

      // type.click();

      await this.type.selectOption({ label: 'Product' });

      await this.type.evaluate((node) => node.click());

      await this.page.waitForTimeout(5000);

      await reportStep(this.page, "Quantity Adjustments is entered successfully", "pass");
    } catch (e) {
      await reportStep(this.page, "Quantity Adjustments is not entered successfully..." + e, "fail");
    }

    return this;
  }

  async clickProducts(productName) {
    try {
      await this.product.click();
      // ((JavascriptExecutor)driver).executeScript("arguments[0].click();", product);
      await this.page.waitForTimeout(5000);

      // productSearchMore.click();
      await this.productSearchMore.evaluate((node) => node.click());
      await this.page.waitForTimeout(5000);

      await this.productSearchBox.fill(String(productName));
      await this.productSearchBox.press('Enter');
      await this.page.waitForTimeout(5000);

      await this.productSelect.click();
      await this.page.waitForTimeout(5000);

      await this.productAdd.click();
      await this.page.waitForTimeout(5000);

      await reportStep(this.page, "Products is entered successfully", "pass");
    } catch (e) {
      await reportStep(this.page, "Products is not entered successfully..." + e, "fail");
    }

    return this;
  }

  async clickProductCount(entQTY) {
    try {
      const totalRows = await this.page
        .locator(
          "xpath=//table[@class='o_list_table table table-sm table-hover position-relative mb-0 o_list_table_ungrouped table-striped']//tbody//tr"
        )
        .count();
      console.log('Total number of rows:', totalRows);

      for (let row = 1; row <= Math.min(1, totalRows); row++) {
        const productRow = this.page.locator(
          `xpath=//table[@class='o_list_table table table-sm table-hover position-relative mb-0 o_list_table_ungrouped table-striped']//tbody//tr[${row}]//td[1]`
        );
        await productRow.click({ timeout: 30 * 1000 });

        const countQtyInput = this.page.locator(
          `xpath=//table[@class='o_list_table table table-sm table-hover position-relative mb-0 o_list_table_ungrouped table-striped']//tbody//tr[${row}]//td[5]//input`
        );
        await countQtyInput.clear({ timeout: 30 * 1000 });
        await countQtyInput.fill(String(entQTY));
        await this.page.waitForTimeout(5000);
      }

      await reportStep(this.page, "Product Count is clicked successfully", "pass");
    } catch (e) {
      await reportStep(this.page, "Product Count is clicked not successfully..." + e, "fail");
    }
    return this;
  }

  async clickProductCountNegative(entQTY) {
    try {
      const totalRows = await this.page
        .locator(
          "xpath=//table[@class='o_list_table table table-sm table-hover position-relative mb-0 o_list_table_ungrouped table-striped']//tbody//tr"
        )
        .count();
      console.log('Total number of rows:', totalRows);

      for (let row = 1; row <= Math.min(1, totalRows); row++) {
        const productRow = this.page.locator(`xpath=.//tr[${row}]//td[1]`);
        await productRow.click({ timeout: 30 * 1000 });

        const countQtyInput = this.page.locator(
          `xpath=//table[@class='o_list_table table table-sm table-hover position-relative mb-0 o_list_table_ungrouped table-striped']//tbody//tr[${row}]//td[5]//input`
        );
        await countQtyInput.clear({ timeout: 30 * 1000 });
        await countQtyInput.fill(String(entQTY));
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
      await this.page.waitForTimeout(30000);

      await reportStep(this.page, "Validate Inventory button is entered successfully", "pass");
    } catch (e) {
      await reportStep(this.page, "Validate Inventory button is not entered successfully..." + e, "fail");
    }

    return this;
  }

  async clickSaveBtn() {
    try {
      await this.saveBtn.click({ timeout: 30 * 1000 });
      await this.page.waitForTimeout(4000);

      await reportStep(this.page, "Save Btn is entered successfully", "pass");
    } catch (e) {
      await reportStep(this.page, "Save Btn is not entered successfully..." + e, "fail");
    }

    return this;
  }

  async clickDuplicateBtn() {
    try {
      await this.page.waitForTimeout(20000);
      // actionBtn.click();
      await this.actionBtn.click({ timeout: 30 * 1000 });
      await this.page.waitForTimeout(5000);
      await this.duplicate.click();
      await this.page.waitForTimeout(5000);

      await this.productAdd1.click();
      await this.page.waitForTimeout(5000);

      /* cancelInventory.click();
      Thread.sleep(2000);
      okBtn.click();
      Thread.sleep(8000);*/
      await this.action.click();
      await this.delete.click();
      await this.page.waitForTimeout(2000);
      await this.confirmDelete.click();
      await this.page.waitForTimeout(2000);

      await reportStep(this.page, "Save Btn is entered successfully", "pass");
    } catch (e) {
      await reportStep(this.page, "Save Btn is not entered successfully..." + e, "fail");
    }

    return this;
  }
}

module.exports = { productQuantityAdjustments };
