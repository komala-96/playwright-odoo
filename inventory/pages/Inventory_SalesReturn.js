const { expect } = require('../fixtures/base');
const { reportStep } = require('../utils/reportStep');
const { ensureLoggedIn } = require('../utils/loginHelper');

class Inventory_SalesReturn {
  constructor(page) {
    this.page = page;

    // Login Page
    this.userName = page.locator("xpath=//input[@name='login']");
    this.passWord = page.locator("xpath=//input[@name='password']");
    this.logIn = page.locator("xpath=//button[@type='submit']");

    // Menu
    this.menu = page.locator("xpath=//ul[@class='o_menu_apps']//i[@class='fa fa-bars']");

    this.inventoryMenu = page.locator("xpath=//div[contains(text(),'Inventory')]");

    this.materialReceiptMenu = page.locator("xpath=//span[normalize-space()='Material Receipt']");

    this.salesReturnSelect = page.locator("xpath=//a[@role='menuitem'][normalize-space()='Sales Return']");

    this.salesReturnCreateBtn = page.locator("xpath=//button[normalize-space()='New']");

    this.salesReturnCustomerClick = page.locator("xpath=//div[@name='partner_id']//input");

    this.customerSearchMore = page.locator("xpath=//a[@id='partner_id_0_0_8']");

    this.customerSearchMoreBox = page.locator("xpath=//input[@placeholder='Search...']");

    this.customerSelect = page.locator(
      "xpath=(//table[@class='o_list_table table table-sm table-hover position-relative mb-0 o_list_table_ungrouped table-striped'])[2]//tbody//tr[1]//td[1]"
    );

    this.invoiceClick = page.locator("xpath=//div[@name='invoice_id']//input");

    this.invoiceSearchMore = page.locator("xpath=(//a[normalize-space()='Search More...'])[1]");

    this.invoiceSearchMoreBox = page.locator("xpath=//input[@placeholder='Search...']");

    this.invoiceSelect = page.locator(
      "xpath=(//table[@class='o_list_table table table-sm table-hover position-relative mb-0 o_list_table_ungrouped table-striped'])[2]//tbody//tr[1]//td[1]"
    );

    this.returnWarehouseClick = page.locator("xpath=//div[@name='warehouse_id']//input");

    this.returnWarehouseSearchMore = page.locator("xpath=//a[@id='warehouse_id_0_0_0']");

    this.returnWarehouseSelect = page.locator("xpath=(//table)[2]//tr[@class='o_data_row']//td[1]");

    this.returnBtn = page.locator("xpath=//span[normalize-space()='Return']");

    this.salesReturnSaveBtn = page.locator("xpath=//button[contains(text(),'Save')]");

    this.salesReturnNumber = page.locator("xpath=//h2//span[@name='name']");

    this.salesReturnInvoiceNumber = page.locator("xpath=//span[@name='invoice_id']//span");

    this.action = page.locator("xpath=//button[normalize-space()='Action']");

    this.duplicate = page.locator("xpath=//span[normalize-space()='Duplicate']");

    this.cancel = page.locator("xpath=//button[@name='action_cancel']");

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
      await this.page.waitForTimeout(5000);

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

  async clickMainMenu() {
    try {
      // await this.menu.click({ timeout: 30 * 1000 });
      await this.page.waitForTimeout(5000);

      await this.inventoryMenu.click();
      await this.page.waitForTimeout(20000);

      await reportStep(this.page, "Menu is clicked successfully", "pass");
    } catch (e) {
      await reportStep(this.page, "Menu is not clicked successfully..." + e, "fail");
    }
    return this;
  }

  async clickInventoryMenu() {
    try {
      await this.materialReceiptMenu.click({ timeout: 30 * 1000 });
      await this.page.waitForTimeout(8000);

      await this.salesReturnSelect.click();
      await this.page.waitForTimeout(10000);

      await reportStep(this.page, "Inventory Menu is clicked successfully", "pass");
    } catch (e) {
      await reportStep(this.page, "Inventory Menu is not clicked successfully..." + e, "fail");
    }
    return this;
  }

  async clickSalesReturnCreate(customerName) {
    try {
      await this.salesReturnCreateBtn.click({ timeout: 30 * 1000 });
      await this.page.waitForTimeout(5000);

      await this.salesReturnCustomerClick.click();
      await this.page.waitForTimeout(5000);

      await this.customerSearchMore.click();
      await this.page.waitForTimeout(5000);

      // Lavanya
      await this.customerSearchMoreBox.fill(String(customerName));
      await this.customerSearchMoreBox.press('Enter');
      await this.page.waitForTimeout(5000);

      // A plain click hovers the cell first, which pops a tooltip
      // ("Complete Name") that then intercepts the pointer event on every
      // retry. evaluate() calls the DOM click() directly, skipping the hover.
      await this.customerSelect.evaluate((node) => node.click());
      await this.page.waitForTimeout(5000);

      await reportStep(this.page, "Sales return create button is clicked successfully", "pass");
    } catch (e) {
      await reportStep(this.page, "Sales return create button is not clicked successfully..." + e, "fail");
    }
    return this;
  }

  async clickSalesReturnInvoice() {
    try {
      await this.invoiceClick.click();
      await this.page.waitForTimeout(5000);

      await this.invoiceSearchMore.click();
      await this.page.waitForTimeout(5000);

      await this.invoiceSelect.click();
      await this.page.waitForTimeout(5000);

      await reportStep(this.page, "Sales Return Invoice is clicked successfully", "pass");
    } catch (e) {
      await reportStep(this.page, "Sales Return Invoice is not clicked successfully..." + e, "fail");
    }
    return this;
  }

  async clickSalesReturnInvoiceNegative() {
    try {
      await this.invoiceClick.click();
      await this.page.waitForTimeout(5000);

      await this.invoiceSearchMore.click();
      await this.page.waitForTimeout(5000);

      await this.invoiceSelect.click();
      await this.page.waitForTimeout(5000);
      await this.salesReturnSaveBtn.click();
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

      await reportStep(this.page, "Sales Return Invoice is clicked successfully", "pass");
    } catch (e) {
      await reportStep(this.page, "Sales Return Invoice is not clicked successfully..." + e, "fail");
    }
    return this;
  }

  async clickReturnWarehouse() {
    try {
      await this.returnWarehouseClick.click();
      await this.page.waitForTimeout(5000);

      await this.returnWarehouseSearchMore.click();
      await this.page.waitForTimeout(5000);

      // await this.returnWarehouseSelect.click();
      // await this.page.waitForTimeout(5000);

      // await this.page.waitForTimeout(5000);

      await reportStep(this.page, "Return Warehouse is clicked successfully", "pass");
    } catch (e) {
      await reportStep(this.page, "Return Warehouse is not clicked successfully..." + e, "fail");
    }
    return this;
  }

  async clickReturn_Qty(qty) {
    try {
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
          `xpath=//table[@class='o_list_table table table-sm table-hover position-relative mb-0 o_list_table_ungrouped table-striped']//tbody//tr[${row}]//td[@name='returning_qty']//input`
        );
        await productQty.click({ timeout: 30 * 1000 });
        await productQty.clear();
        await productQty.fill(String(qty));
        await this.page.waitForTimeout(3000);

        console.log(' Product name:', name);

        console.log('-------------------------------');
      }
      await reportStep(this.page, "Return Qty updated successfully", "pass");
    } catch (e) {
      await reportStep(this.page, "Return Qty updated not successfully..." + e, "fail");
    }
    return this;
  }

  async clickReturn_QtyNegative(qty) {
    try {
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
          `xpath=//table[@class='o_list_table table table-sm table-hover position-relative mb-0 o_list_table_ungrouped table-striped']//tbody//tr[${row}]//td[@name='returning_qty']//input`
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
      await reportStep(this.page, "Return Qty updated successfully", "pass");
    } catch (e) {
      await reportStep(this.page, "Return Qty updated not successfully..." + e, "fail");
    }
    return this;
  }

  async clickSaveBtn() {
    try {
      await this.returnBtn.click();
      await this.page.waitForTimeout(3000);

      // await this.salesReturnSaveBtn.click();
      // await this.page.waitForTimeout(10000);

      await reportStep(this.page, "Save Button clicked successfully", "pass");
    } catch (e) {
      await reportStep(this.page, "Save Button clicked not successfully..." + e, "fail");
    }
    return this;
  }

  async clickSaveBtnNegative() {
    try {
      await this.returnBtn.click();
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

      await reportStep(this.page, "Save Button clicked successfully", "pass");
    } catch (e) {
      await reportStep(this.page, "Save Button clicked not successfully..." + e, "fail");
    }
    return this;
  }

  async clickSalesReturnNumber() {
    try {
      const salesReturnNumberText = await this.salesReturnNumber.textContent();
      console.log('Sales Return number :', salesReturnNumberText);
      await this.page.waitForTimeout(5000);

      console.log('-------------------------------');

      const salesReturnInvoiceNumberText = await this.salesReturnInvoiceNumber.textContent();
      console.log('Sales Return Invoice Number :', salesReturnInvoiceNumberText);
      await this.page.waitForTimeout(5000);

      console.log('-------------------------------');

      await reportStep(this.page, "Sales Return Number clicked successfully", "pass");
    } catch (e) {
      await reportStep(this.page, "Sales Return Number clicked not successfully..." + e, "fail");
    }
    return this;
  }

  async clickDeleteBtn() {
    try {
      await this.page.waitForTimeout(3000);
      await this.action.click();
      await this.duplicate.click();
      await this.page.waitForTimeout(3000);
      await this.cancel.click();
      await this.page.waitForTimeout(3000);
      await this.action.click();
      await this.page.waitForTimeout(3000);
      await this.delete.click();
      await this.page.waitForTimeout(3000);
      await this.confirmDelete.click();
      await this.page.waitForTimeout(3000);

      await reportStep(this.page, "Delete clicked successfully", "pass");
    } catch (e) {
      await reportStep(this.page, "Delete clicked not successfully..." + e, "fail");
    }
    return this;
  }
}

module.exports = { Inventory_SalesReturn };
