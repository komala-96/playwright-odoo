const { test } = require('@playwright/test');
const { ensureLoggedIn } = require('../utils/loginHelper');

// Ported from src/main/java/pages/PackingSlipPage.java.
// Selenium's @FindBy xpaths are preserved verbatim as Playwright locators.
// PageFactory/@CacheLookup have no equivalent needed: Playwright locators
// re-query the DOM on every action, so there's no stale-element risk to guard against.
class PackingSlipPage {
  constructor(page) {
    this.page = page;

    // Login Page
    this.userName = page.locator("xpath=//input[@name='login']");
    this.passWord = page.locator("xpath=//input[@name='password']");
    this.logIn = page.locator("xpath=//button[@type='submit']");

    // Menu
    this.menu = page.locator("xpath=//ul[@class='o_menu_apps']//i[@class='fa fa-bars']");

    // financialacct
    this.customerMenu = page.locator("xpath=//div[contains(text(),'Customer Care')]");

    this.deliveryMenu = page.locator("xpath=(//span[normalize-space()='Delivery'])[1]");

    // financialacct
    this.packingSlip = page.locator("xpath=//a[normalize-space()='Packing Slip']");

    // Create btn
    this.createBtn = page.locator("xpath=//button[contains(text(),'New')]");

    this.copies = page.locator("xpath=//div[@name='no_of_copies']//input[@type='text']");

    this.order = page.locator("xpath=//input[@id='sale_ids_0']");

    this.orderSelect = page.locator("xpath=//a[@id='sale_ids_0_0_0']");

    this.selectAllInvoice = page.locator("xpath=//div[@name='select_all_invoice']//input[@type='checkbox']");

    this.quantity = page.locator("xpath=(//td[@name='sale_picking_qty'])[1]");

    this.clickConfirmPackingSlip = page.locator("xpath=//button[@name='confirm_pack_slip']");

    this.clickConfirmPackingSlip1 = page.locator("xpath=//button[@name='confirm_pack_slip']");

    this.checkbox = page.locator("xpath=//div[@name='select_all']//input[@type='checkbox']");

    this.contBtn = page.locator("xpath=(//span[normalize-space()='Continue'])[1]");

    this.saveBtn = page.locator("xpath=(//button[normalize-space()='Save'])[1]");

    this.okBtn = page.locator("xpath=//button[normalize-space()='Close']");

    this.okBtn2 = page.locator("xpath=//span[contains(text(),'Ok')]");

    this.okBtn1 = page.locator("xpath=(//span[normalize-space()='Ok'])[1]");

    this.closeBtn = page.locator("xpath=(//button[normalize-space()='×'])[1]");

    this.print = page.locator("xpath=//span[normalize-space()='Print']");

    this.actionBtn = page.locator("xpath=//button[normalize-space()='Action']");

    this.printBtn = page.locator("xpath=//span[normalize-space()='Packing Slip']");

    this.actionBtn1 = page.locator("xpath=//button[normalize-space()='Action']");

    this.duplicateBtn = page.locator("xpath=//span[normalize-space()='Duplicate']");

    this.actionBtn2 = page.locator("xpath=//button[normalize-space()='Action']");

    this.deleteBtn = page.locator("xpath=//span[normalize-space()='Delete']");

    this.confirmDelete = page.locator("xpath=//button[normalize-space()='Delete']");
  }

  async enterUsername(user) {
    return test.step('username is entered successfully', async () => {
      await this.userName.fill(user);
      return this;
    });
  }

  async enterPassword(pass) {
    return test.step('Password is entered successfully', async () => {
      await this.passWord.fill(pass);
      return this;
    });
  }

  async clickLoginButton() {
    return test.step('Login button is clicked successfully', async () => {
      await this.logIn.click();
      return this;
    });
  }

  async loginIfNeeded(user, pass) {
    await ensureLoggedIn(this, user, pass);
    return this;
  }

  async clickMenu() {
    return test.step('Menu is clicked successfully', async () => {
      await this.menu.click({ timeout: 30_000 });
      return this;
    });
  }

  async clickCustomerMenu() {
    return test.step('Customer Menu is clicked successfully', async () => {
      await this.customerMenu.click({ timeout: 30_000 });
      return this;
    });
  }

  async clickPackingSlipPage() {
    return test.step('Orders Page is clicked successfully', async () => {
      await this.deliveryMenu.click({ timeout: 30_000 });
      await this.packingSlip.click();
      await this.createBtn.click();
      return this;
    });
  }

  async clickCheckBox() {
    return test.step('Check Box is clicked successfully', async () => {
      await this.copies.fill('2');

      await this.order.click();

      // orderSelect.click();
      await this.orderSelect.click({ force: true });

      await this.selectAllInvoice.click({ force: true });

      const sourceDocument = this.page.locator(
        "xpath=(//table[@class='o_list_table table table-sm table-hover position-relative mb-0 o_list_table_ungrouped table-striped'])[3]//tbody//tr[1]//td[1]"
      );
      await sourceDocument.click({ timeout: 30_000 });

      // The cell renders as plain text until clicked into edit mode, same as the
      // order-line quantity cells elsewhere in this suite - the nested input isn't
      // present in the DOM until then.
      const pickingQuantityCell = this.page.locator(
        "xpath=(//table[@class='o_list_table table table-sm table-hover position-relative mb-0 o_list_table_ungrouped table-striped'])[3]//tbody//tr[1]//td[5]"
      );
      await pickingQuantityCell.click({ timeout: 30_000 });

      // Re-fetch the Picking Quantity input before interacting
      const pickingQuantityInput = this.page.locator(
        "xpath=(//table[@class='o_list_table table table-sm table-hover position-relative mb-0 o_list_table_ungrouped table-striped'])[3]//tbody//tr[1]//td[5]//input"
      );
      await pickingQuantityInput.fill('1');

      // clickConfirmPackingSlip.click();
      await this.clickConfirmPackingSlip.click({ force: true });

      // okBtn.click();

      await this.checkbox.click({ force: true });

      await this.contBtn.click();
      // print.click();
      await this.actionBtn.click();
      await this.printBtn.click();
      await this.actionBtn1.click();
      await this.duplicateBtn.click();
      await this.actionBtn2.click();
      await this.deleteBtn.click();
      await this.confirmDelete.click();

      return this;
    });
  }

  async clickCheckBoxNegative(quantity) {
    return test.step('Check Box is clicked successfully', async () => {
      await this.copies.fill('2');

      await this.order.click();

      // orderSelect.click();
      await this.orderSelect.click({ force: true });

      // clickConfirmPackingSlip.click();
      await this.clickConfirmPackingSlip.click({ force: true });

      await this.okBtn.click();

      // okBtn1.click();

      await this.selectAllInvoice.click({ force: true });

      const sourceDocument = this.page.locator(
        "xpath=(//table[@class='o_list_table table table-sm table-hover position-relative mb-0 o_list_table_ungrouped table-striped'])[3]//tbody//tr[1]//td[1]"
      );
      await sourceDocument.click({ timeout: 30_000 });

      // Re-fetch the Picking Quantity input before interacting
      const pickingQuantityInput = this.page.locator(
        "xpath=(//table[@class='o_list_table table table-sm table-hover position-relative mb-0 o_list_table_ungrouped table-striped'])[3]//tbody//tr[1]//td[5]//input"
      );
      await pickingQuantityInput.fill(quantity);

      await this.clickConfirmPackingSlip1.click({ force: true });

      try {
        const errorMsg = this.page.locator("xpath=//div[@class='o_dialog']//p");
        await errorMsg.waitFor({ state: 'visible', timeout: 30_000 });
        const errorMessageText = await errorMsg.innerText();
        console.log('Validation Error Message: ' + errorMessageText);

        const errorMsgOk = this.page.locator("xpath=//button[normalize-space()='Close']");
        await errorMsgOk.click();
        console.log('Validation error dismissed successfully for row ');
      } catch (e) {
        console.log('No validation error for row ');
      }

      // okBtn2.click();

      /*
      await this.checkbox.click({ force: true });
      await this.contBtn.click();
      await this.closeBtn.click();
      await this.saveBtn.click();
      */

      return this;
    });
  }
}

module.exports = { PackingSlipPage };
