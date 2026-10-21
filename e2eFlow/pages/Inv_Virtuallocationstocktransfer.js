const { reportStep } = require('../utils/reportStep');
const { ensureLoggedIn } = require('../utils/loginHelper');

class Inv_Virtuallocationstocktransfer {
  constructor(page) {
    this.page = page;

    // Login Page
    this.userName = page.locator("xpath=//input[@name='login']");
    this.passWord = page.locator("xpath=//input[@name='password']");
    this.logIn = page.locator("xpath=//button[contains(text(),'Log in')]");

    // Means
    this.menu = page.locator("xpath=//ul[@class='o_menu_apps']//i[@class='fa fa-bars']");

    this.inventory = page.locator("xpath=//div[contains(text(),'Inventory')]");

    this.virtualLocationMenu = page.locator("xpath=//a[normalize-space()='Virtual Location Stock Transfer']");

    this.createBtn = page.locator("xpath=//button[normalize-space()='New']");

    this.transferType = page.locator("xpath=//select[@id='transfer_type_0']");

    this.fromWareHouse = page.locator("xpath=//div[@name='warehouse_id']//input[@type='text']");

    this.fromSelect = page.locator("xpath=//a[@id='warehouse_id_0_0_2']");

    this.fromWareHouse1 = page.locator("xpath=//div[@name='warehouse_id']//input[@type='text']");

    this.fromSelect1 = page.locator("xpath=//a[@id='warehouse_id_1_0_0']");

    this.toWareHouse = page.locator("xpath=//div[@name='warehouse_to_id']//input[@type='text']");

    this.toSelect = page.locator("xpath=//a[@id='warehouse_to_id_0_0_0']");

    this.fromVirtualLocation = page.locator("xpath=//input[@id='virtual_location_id_1']");

    this.fromVirtual = page.locator("xpath=//a[@id='virtual_location_id_1_0_0']");

    this.toWareHouse1 = page.locator("xpath=//input[@id='warehouse_id_2']");

    this.toSelect1 = page.locator("xpath=//a[@id='warehouse_id_2_0_0']");

    this.toVirtualLocation = page.locator("xpath=//input[@id='virtual_location_id_0']");

    this.toVirtual = page.locator("xpath=//a[@id='virtual_location_id_0_0_0']");

    this.categoryId = page.locator("xpath=//div[@name='categ_ids']//input[@type='text']");

    this.categorySelect = page.locator("xpath=//a[@id='categ_ids_0_0_0']");

    this.product = page.locator("xpath=//div[@name='product_ids']//input[@type='text']");

    this.productSearch = page.locator("xpath=//a[@id='product_ids_0_0_8']");

    this.proSearchMore = page.locator("xpath=(//input[@placeholder='Search...'])[1]");

    this.proSelect = page.locator(
      "xpath=(//table[@class='o_list_table table table-sm table-hover position-relative mb-0 o_list_table_ungrouped table-striped'])[2]//tbody//tr[1]//td[2]"
    );

    this.transferReason = page.locator("xpath=//textarea[@id='transfer_reason_0']");

    // span[normalize-space()='Add']
    this.addBtn = page.locator("xpath=//span[normalize-space()='Add']");

    this.transferBtn = page.locator("xpath=//span[normalize-space()='Transfer']");

    // input[@name='product_qty']

    this.product_qty = page.locator("xpath=//div[@name='product_qty']//input[@type='text']");

    this.categoryId1 = page.locator("xpath=//div[@name='categ_ids']//input[@type='text']");

    this.categorySelect1 = page.locator("xpath=//a[@id='categ_ids_0_0_0']");

    this.product1 = page.locator("xpath=//div[@name='product_ids']//input[@type='text']");

    this.productSearch1 = page.locator("xpath=//a[@id='product_ids_0_0_8']");

    this.proSearchMore1 = page.locator("xpath=(//input[@placeholder='Search...'])[1]");

    this.proSelect1 = page.locator(
      "xpath=(//table[@class='o_list_table table table-sm table-hover position-relative mb-0 o_list_table_ungrouped table-striped'])[2]//tbody//tr[1]//td[2]"
    );

    this.transferReason1 = page.locator("xpath=//textarea[@id='transfer_reason_0']");

    // span[normalize-space()='Add']
    this.addBtn1 = page.locator("xpath=//span[normalize-space()='Add']");

    this.transferBtn1 = page.locator("xpath=//span[normalize-space()='Transfer']");

    // input[@name='product_qty']

    this.product_qty1 = page.locator("xpath=//div[@name='product_qty']//input[@type='text']");

    this.categoryId2 = page.locator("xpath=//div[@name='categ_ids']//input[@type='text']");

    this.categorySelect2 = page.locator("xpath=//a[@id='categ_ids_0_0_0']");

    this.product2 = page.locator("xpath=//div[@name='product_ids']//input[@type='text']");

    this.productSearch2 = page.locator("xpath=//a[@id='product_ids_0_0_8']");

    this.proSearchMore2 = page.locator("xpath=(//input[@placeholder='Search...'])[1]");

    this.proSelect2 = page.locator(
      "xpath=(//table[@class='o_list_table table table-sm table-hover position-relative mb-0 o_list_table_ungrouped table-striped'])[2]//tbody//tr[1]//td[2]"
    );

    this.transferReason2 = page.locator("xpath=//textarea[@id='transfer_reason_0']");

    // span[normalize-space()='Add']
    this.addBtn2 = page.locator("xpath=//span[normalize-space()='Add']");

    this.transferBtn2 = page.locator("xpath=//span[normalize-space()='Transfer']");

    // input[@name='product_qty']

    this.product_qty2 = page.locator("xpath=//div[@name='product_qty']//input[@type='text']");
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
      await this.virtualLocationMenu.click();
      await this.page.waitForTimeout(6000);

      await reportStep(this.page, "Virtual location Stock transfer Menu is entered successfully", "pass");
    } catch (e) {
      await reportStep(this.page, "Virtual location Stock transfer Menu  is not entered successfully..." + e, "fail");
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

  async clickTransfer(pro, reason, qty) {
    try {
      await this.transferType.selectOption({ index: 1 });
      await this.page.waitForTimeout(2000);
      await this.fromWareHouse.click();
      await this.fromSelect.click();
      await this.page.waitForTimeout(2000);
      await this.toWareHouse.click();
      await this.toSelect.click();
      await this.page.waitForTimeout(2000);
      await this.categoryId.click();
      // await this.categorySelect.click();
      await this.categorySelect.evaluate((node) => node.click());
      await this.page.waitForTimeout(2000);
      await this.product.click();
      // await this.productSearch.click();
      await this.productSearch.evaluate((node) => node.click());
      await this.page.waitForTimeout(2000);
      await this.proSearchMore.click();
      await this.proSearchMore.fill("Coke");
      await this.proSearchMore.press('Enter');
      await this.page.waitForTimeout(2000);
      // await this.proSelect.click();
      await this.proSelect.evaluate((node) => node.click());
      await this.page.waitForTimeout(6000);
      await this.addBtn.click();
      // await this.page.locator('.o_loading').waitFor({ state: 'hidden' });
      // await this.proSearchMore.click();
      // await this.proSelect.fill(String(pro));
      await this.page.waitForTimeout(10000);
      // await this.product_qty.fill("1");

      const totalRows = await this.page
        .locator(
          "xpath=//table[@class='o_list_table table table-sm table-hover position-relative mb-0 o_list_table_ungrouped table-striped']//tbody//tr"
        )
        .count();
      console.log('Total number of rows:', totalRows);

      const rowsToProcess = Math.min(totalRows, 1);
      for (let row = 1; row <= rowsToProcess; row++) {
        const productName = this.page.locator(
          `xpath=//table[@class='o_list_table table table-sm table-hover position-relative mb-0 o_list_table_ungrouped table-striped']//tbody//tr[${row}]//td[2]`
        );
        await productName.click({ timeout: 30 * 1000 });
        const name = await productName.textContent();
        await this.page.waitForTimeout(3000);

        const productQty = this.page.locator(
          `xpath=//table[@class='o_list_table table table-sm table-hover position-relative mb-0 o_list_table_ungrouped table-striped']//tbody//tr[${row}]//td[@name='product_qty']//input`
        );
        await productQty.click({ timeout: 30 * 1000 });
        await productQty.clear();
        await productQty.fill(String(qty));
        await this.page.waitForTimeout(3000);

        console.log(' Product name:', name);

        console.log('-------------------------------');
      }
      await this.transferReason.fill(String(reason));
      await this.page.waitForTimeout(2000);
      await this.transferBtn.click();
      await this.page.waitForTimeout(5000);

      await reportStep(this.page, "Transfer is entered successfully", "pass");
    } catch (e) {
      await reportStep(this.page, "Transfer Adjustment Menuis not entered successfully..." + e, "fail");
    }

    return this;
  }

  async clickTransferNegative(pro, reason, qty) {
    try {
      await this.transferType.selectOption({ index: 1 });
      await this.page.waitForTimeout(2000);
      await this.fromWareHouse.click();
      await this.fromSelect.click();
      await this.page.waitForTimeout(2000);
      await this.toWareHouse.click();
      await this.toSelect.click();
      await this.page.waitForTimeout(2000);
      await this.categoryId.click();
      // await this.categorySelect.click();
      await this.categorySelect.evaluate((node) => node.click());
      await this.page.waitForTimeout(2000);
      await this.product.click();
      // await this.productSearch.click();
      await this.productSearch.evaluate((node) => node.click());
      await this.page.waitForTimeout(2000);
      await this.proSearchMore.click();
      await this.proSearchMore.fill("Coke");
      await this.proSearchMore.press('Enter');
      await this.page.waitForTimeout(2000);
      await this.proSelect.click();
      await this.page.waitForTimeout(6000);
      await this.addBtn.click();
      // await this.page.locator('.o_loading').waitFor({ state: 'hidden' });
      // await this.proSearchMore.click();
      // await this.proSelect.fill(String(pro));
      await this.page.waitForTimeout(10000);
      // await this.product_qty.fill("1");

      const totalRows = await this.page
        .locator(
          "xpath=//table[@class='o_list_table table table-sm table-hover position-relative mb-0 o_list_table_ungrouped table-striped']//tbody//tr"
        )
        .count();
      console.log('Total number of rows:', totalRows);

      const rowsToProcess = Math.min(totalRows, 1);
      for (let row = 1; row <= rowsToProcess; row++) {
        const productName = this.page.locator(
          `xpath=//table[@class='o_list_table table table-sm table-hover position-relative mb-0 o_list_table_ungrouped table-striped']//tbody//tr[${row}]//td[2]`
        );
        await productName.click({ timeout: 30 * 1000 });
        const name = await productName.textContent();
        await this.page.waitForTimeout(3000);

        const productQty = this.page.locator(
          `xpath=//table[@class='o_list_table table table-sm table-hover position-relative mb-0 o_list_table_ungrouped table-striped']//tbody//tr[${row}]//td[@name='product_qty']//input`
        );
        await productQty.click({ timeout: 30 * 1000 });
        await productQty.clear();
        await productQty.fill(String(qty));
        await productQty.press('Enter');
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

        console.log(' Product name:', name);

        console.log('-------------------------------');
      }
      await this.transferReason.fill(String(reason));
      await this.page.waitForTimeout(2000);
      await this.transferBtn.click();
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

      await reportStep(this.page, "Transfer is entered successfully", "pass");
    } catch (e) {
      await reportStep(this.page, "Transfer Adjustment Menuis not entered successfully..." + e, "fail");
    }

    return this;
  }

  async clickWarehousetoVirtual(pro, reason, qty) {
    try {
      await this.transferType.selectOption({ index: 2 });
      await this.page.waitForTimeout(2000);
      await this.fromWareHouse1.click();
      await this.fromSelect1.click();
      await this.page.waitForTimeout(2000);
      await this.toVirtualLocation.click();
      await this.toVirtual.click();
      await this.page.waitForTimeout(2000);
      await this.categoryId1.click();
      // await this.categorySelect.click();
      await this.categorySelect1.evaluate((node) => node.click());
      await this.page.waitForTimeout(2000);
      await this.product1.click();
      // await this.productSearch.click();
      await this.productSearch1.evaluate((node) => node.click());
      await this.page.waitForTimeout(2000);
      await this.proSearchMore1.click();
      await this.proSearchMore1.fill("Takis Chips");
      await this.proSearchMore1.press('Enter');
      await this.page.waitForTimeout(2000);
      await this.proSelect1.click();
      await this.page.waitForTimeout(6000);
      await this.addBtn1.click();
      // await this.page.locator('.o_loading').waitFor({ state: 'hidden' });
      // await this.proSearchMore.click();
      // await this.proSelect.fill(String(pro));
      await this.page.waitForTimeout(10000);

      const totalRows = await this.page
        .locator(
          "xpath=//table[@class='o_list_table table table-sm table-hover position-relative mb-0 o_list_table_ungrouped table-striped']//tbody//tr"
        )
        .count();
      console.log('Total number of rows:', totalRows);

      const rowsToProcess = Math.min(totalRows, 1);
      for (let row = 1; row <= rowsToProcess; row++) {
        const productName = this.page.locator(
          `xpath=//table[@class='o_list_table table table-sm table-hover position-relative mb-0 o_list_table_ungrouped table-striped']//tbody//tr[${row}]//td[2]`
        );
        await productName.click({ timeout: 30 * 1000 });
        const name = await productName.textContent();
        await this.page.waitForTimeout(3000);

        const productQty = this.page.locator(
          `xpath=//table[@class='o_list_table table table-sm table-hover position-relative mb-0 o_list_table_ungrouped table-striped']//tbody//tr[${row}]//td[@name='product_qty']//input`
        );
        await productQty.click({ timeout: 30 * 1000 });
        await productQty.clear();
        await productQty.fill(String(qty));
        await this.page.waitForTimeout(3000);

        console.log(' Product name:', name);

        console.log('-------------------------------');
      }
      await this.transferReason1.fill(String(reason));
      await this.page.waitForTimeout(2000);
      await this.transferBtn1.click();
      await this.page.waitForTimeout(5000);

      await reportStep(this.page, "Warehouse to Virtual Transfer is entered successfully", "pass");
    } catch (e) {
      await reportStep(this.page, "Warehouse to Virtual Transfer is not entered successfully..." + e, "fail");
    }

    return this;
  }

  async clickWarehousetoVirtualNegative(pro, reason, qty) {
    try {
      await this.transferType.selectOption({ index: 2 });
      await this.page.waitForTimeout(2000);
      await this.fromWareHouse1.click();
      await this.fromSelect1.click();
      await this.page.waitForTimeout(2000);
      await this.toVirtualLocation.click();
      await this.toVirtual.click();
      await this.page.waitForTimeout(2000);
      await this.categoryId1.click();
      // await this.categorySelect.click();
      await this.categorySelect1.evaluate((node) => node.click());
      await this.page.waitForTimeout(2000);
      await this.product1.click();
      // await this.productSearch.click();
      await this.productSearch1.evaluate((node) => node.click());
      await this.page.waitForTimeout(2000);
      await this.proSearchMore1.click();
      await this.proSearchMore1.fill("Takis Chips");
      await this.proSearchMore1.press('Enter');
      await this.page.waitForTimeout(2000);
      await this.proSelect1.click();
      await this.page.waitForTimeout(6000);
      await this.addBtn1.click();
      // await this.page.locator('.o_loading').waitFor({ state: 'hidden' });
      // await this.proSearchMore.click();
      // await this.proSelect.fill(String(pro));
      await this.page.waitForTimeout(10000);

      const totalRows = await this.page
        .locator(
          "xpath=//table[@class='o_list_table table table-sm table-hover position-relative mb-0 o_list_table_ungrouped table-striped']//tbody//tr"
        )
        .count();
      console.log('Total number of rows:', totalRows);

      const rowsToProcess = Math.min(totalRows, 1);
      for (let row = 1; row <= rowsToProcess; row++) {
        const productName = this.page.locator(
          `xpath=//table[@class='o_list_table table table-sm table-hover position-relative mb-0 o_list_table_ungrouped table-striped']//tbody//tr[${row}]//td[2]`
        );
        await productName.click({ timeout: 30 * 1000 });
        const name = await productName.textContent();
        await this.page.waitForTimeout(3000);

        const productQty = this.page.locator(
          `xpath=//table[@class='o_list_table table table-sm table-hover position-relative mb-0 o_list_table_ungrouped table-striped']//tbody//tr[${row}]//td[@name='product_qty']//input`
        );
        await productQty.click({ timeout: 30 * 1000 });
        await productQty.clear();
        await productQty.fill(String(qty));
        await productQty.press('Enter');
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

        console.log(' Product name:', name);

        console.log('-------------------------------');
      }
      await this.transferReason1.fill(String(reason));
      await this.page.waitForTimeout(2000);
      await this.transferBtn1.click();
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

      await reportStep(this.page, "Warehouse to Virtual Transfer is entered successfully", "pass");
    } catch (e) {
      await reportStep(this.page, "Warehouse to Virtual Transfer is not entered successfully..." + e, "fail");
    }

    return this;
  }

  async clickVirtualtoWarehouse(pro, reason, qty) {
    try {
      await this.transferType.selectOption({ index: 3 });
      await this.page.waitForTimeout(2000);
      await this.fromVirtualLocation.click();
      await this.fromVirtual.click();
      await this.page.waitForTimeout(2000);
      await this.toWareHouse1.click();
      await this.toSelect1.click();
      await this.page.waitForTimeout(2000);
      await this.categoryId2.click();
      // await this.categorySelect.click();
      await this.categorySelect2.evaluate((node) => node.click());
      await this.page.waitForTimeout(2000);
      await this.product2.click();
      // await this.productSearch.click();
      await this.productSearch2.evaluate((node) => node.click());
      await this.page.waitForTimeout(2000);
      await this.proSearchMore2.click();
      await this.proSearchMore2.fill("Maggi");
      await this.proSearchMore2.press('Enter');
      await this.page.waitForTimeout(2000);
      await this.proSelect2.click();
      await this.page.waitForTimeout(6000);
      await this.addBtn2.click();
      // await this.page.locator('.o_loading').waitFor({ state: 'hidden' });
      // await this.proSearchMore.click();
      // await this.proSelect.fill(String(pro));
      await this.page.waitForTimeout(10000);

      const totalRows = await this.page
        .locator(
          "xpath=//table[@class='o_list_table table table-sm table-hover position-relative mb-0 o_list_table_ungrouped table-striped']//tbody//tr"
        )
        .count();
      console.log('Total number of rows:', totalRows);

      const rowsToProcess = Math.min(totalRows, 1);
      for (let row = 1; row <= rowsToProcess; row++) {
        const productName = this.page.locator(
          `xpath=//table[@class='o_list_table table table-sm table-hover position-relative mb-0 o_list_table_ungrouped table-striped']//tbody//tr[${row}]//td[2]`
        );
        await productName.click({ timeout: 30 * 1000 });
        const name = await productName.textContent();
        await this.page.waitForTimeout(3000);

        const productQty = this.page.locator(
          `xpath=//table[@class='o_list_table table table-sm table-hover position-relative mb-0 o_list_table_ungrouped table-striped']//tbody//tr[${row}]//td[@name='product_qty']//input`
        );
        await productQty.click({ timeout: 30 * 1000 });
        await productQty.clear();
        await productQty.fill(String(qty));
        await this.page.waitForTimeout(3000);

        console.log(' Product name:', name);

        console.log('-------------------------------');
      }
      await this.transferReason2.fill(String(reason));
      await this.page.waitForTimeout(2000);
      await this.transferBtn2.click();
      await this.page.waitForTimeout(5000);

      await reportStep(this.page, "Virtual to Warehouse transfer is entered successfully", "pass");
    } catch (e) {
      await reportStep(this.page, "Virtual to Warehouse transfer is not entered successfully..." + e, "fail");
    }

    return this;
  }

  async clickVirtualtoWarehouseNegative(pro, reason, qty) {
    try {
      await this.transferType.selectOption({ index: 3 });
      await this.page.waitForTimeout(2000);
      await this.fromVirtualLocation.click();
      await this.fromVirtual.click();
      await this.page.waitForTimeout(2000);
      await this.toWareHouse1.click();
      await this.toSelect1.click();
      await this.page.waitForTimeout(2000);
      await this.categoryId2.click();
      // await this.categorySelect.click();
      await this.categorySelect2.evaluate((node) => node.click());
      await this.page.waitForTimeout(2000);
      await this.product2.click();
      // await this.productSearch.click();
      await this.productSearch2.evaluate((node) => node.click());
      await this.page.waitForTimeout(2000);
      await this.proSearchMore2.click();
      await this.proSearchMore2.fill("Takis Chips");
      await this.proSearchMore2.press('Enter');
      await this.page.waitForTimeout(2000);
      await this.proSelect2.click();
      await this.page.waitForTimeout(6000);
      await this.addBtn2.click();
      // await this.page.locator('.o_loading').waitFor({ state: 'hidden' });
      // await this.proSearchMore.click();
      // await this.proSelect.fill(String(pro));
      await this.page.waitForTimeout(10000);

      const totalRows = await this.page
        .locator(
          "xpath=//table[@class='o_list_table table table-sm table-hover position-relative mb-0 o_list_table_ungrouped table-striped']//tbody//tr"
        )
        .count();
      console.log('Total number of rows:', totalRows);

      const rowsToProcess = Math.min(totalRows, 1);
      for (let row = 1; row <= rowsToProcess; row++) {
        const productName = this.page.locator(
          `xpath=//table[@class='o_list_table table table-sm table-hover position-relative mb-0 o_list_table_ungrouped table-striped']//tbody//tr[${row}]//td[2]`
        );
        await productName.click({ timeout: 30 * 1000 });
        const name = await productName.textContent();
        await this.page.waitForTimeout(3000);

        const productQty = this.page.locator(
          `xpath=//table[@class='o_list_table table table-sm table-hover position-relative mb-0 o_list_table_ungrouped table-striped']//tbody//tr[${row}]//td[@name='product_qty']//input`
        );
        await productQty.click({ timeout: 30 * 1000 });
        await productQty.clear();
        await productQty.fill(String(qty));
        await productQty.press('Enter');
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

        console.log(' Product name:', name);

        console.log('-------------------------------');
      }
      await this.transferReason2.fill(String(reason));
      await this.page.waitForTimeout(2000);
      await this.transferBtn2.click();
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

      await reportStep(this.page, "Virtual to Warehouse transfer is entered successfully", "pass");
    } catch (e) {
      await reportStep(this.page, "Virtual to Warehouse transfer is not entered successfully..." + e, "fail");
    }

    return this;
  }
}

module.exports = { Inv_Virtuallocationstocktransfer };
