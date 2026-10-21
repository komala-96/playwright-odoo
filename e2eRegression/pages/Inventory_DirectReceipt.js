const { expect } = require('../fixtures/base');
const { reportStep } = require('../utils/reportStep');
const { ensureLoggedIn } = require('../utils/loginHelper');

class Inventory_DirectReceipt {
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

    this.directReceiptSelect = page.locator("xpath=//a[normalize-space()='Direct Receipt']");

    this.directReceiptCreateBtn = page.locator("xpath=//button[normalize-space()='New']");

    this.salesReturnVendorClick = page.locator("xpath=//div[@name='partner_id']//input");

    this.vendorSearchMore = page.locator("xpath=//a[@id='partner_id_0_0_8']");

    this.vendorSearchMoreBox = page.locator("xpath=//input[@placeholder='Search...']");

    this.vendorSelect = page.locator(
      "xpath=(//table[@class='o_list_table table table-sm table-hover position-relative mb-0 o_list_table_ungrouped table-striped'])[2]//tbody//tr[1]//td[1]"
    );

    this.locationClick = page.locator("xpath=//div[@name='warehouse_id']//input");

    this.locationSelect = page.locator("xpath=//a[@id='warehouse_id_0_0_0']");

    this.receiverClick = page.locator("xpath=//div[@name='receiver_id']//input");

    this.receiverSelect = page.locator("xpath=//a[@id='receiver_id_0_0_0']");

    this.purchaseClick = page.locator("xpath=//div[@name='purchase_manager']//input");

    this.purchaseSelect = page.locator("xpath=//a[@id='purchase_manager_0_0_0']");

    this.ownerClick = page.locator("xpath=//div[@name='user_id']//input");

    this.ownerSelect = page.locator("xpath=//a[@id='user_id_0_0_0']");

    this.product = page.locator("xpath=//div[@name='product_ids']//input[@type='text']");

    this.product_SearchMore = page.locator("xpath=(//a[normalize-space()='Search More...'])[1]");

    this.product_SearchBox = page.locator(
      "xpath=//div[@class='o_searchview_input_container d-flex flex-grow-1 flex-wrap gap-1 mw-100']//input[@type='text']"
    );

    this.product_Select = page.locator(
      "xpath=(//table[@class='o_list_table table table-sm table-hover position-relative mb-0 o_list_table_ungrouped table-striped'])[2]/tbody/tr[1]/td[3]"
    );

    this.productAddBtn = page.locator("xpath=//span[normalize-space()='Add']");

    this.returnBtn = page.locator("xpath=//span[normalize-space()='Confirm']");

    this.salesReturnSaveBtn = page.locator("xpath=//button[contains(text(),'Save')]");

    this.printBtn = page.locator("xpath=//span[normalize-space()='Print']");

    this.salesReturnNumber = page.locator("xpath=//h2//span[@name='name']");

    this.salesReturnInvoiceNumber = page.locator("xpath=//span[@name='invoice_id']//span");

    this.menu2 = page.locator("xpath=//ul[@class='o_menu_apps']//i[@class='fa fa-bars']");

    this.financialAccountMenu = page.locator("xpath=//a[@role='menuitem']//img[@title='Financial Accounting']");

    this.accountsReceivableMenu = page.locator(
      "xpath=//ul[@class='o_menu_sections']//a[contains(text(),'Accounts Receivable')]"
    );

    this.creditMemoMenu = page.locator("xpath=//a[@role='menuitem']//span[contains(text(),'Credit Memo')]");

    this.creditMemoCreateBtn = page.locator("xpath=//button[contains(text(),'Create')]");

    this.creditMemoCustomer = page.locator("xpath=//div[@name='partner_id']//input");

    this.creditMemoCustomerSearchMore = page.locator("xpath=//li[8]//a[contains(text(),'Search More...')]");

    this.creditMemoCustomerSearchMoreBox = page.locator(
      "xpath=//div[@class='o_searchview_input_container']//input[@type='text']"
    );

    this.creditMemoCustomerSelect = page.locator(
      "xpath=//table[@class='o_list_table table table-sm table-hover table-striped o_list_table_ungrouped']//tbody//tr[1]//td[1]"
    );

    this.materialReceipt = page.locator("xpath=//div[@name='sales_return_id']//input");

    this.materialReceiptSelect = page.locator("xpath=(//li[@class='ui-menu-item'])[2]//a");

    this.postBtn = page.locator("xpath=//span[contains(text(),'Post')]");

    this.creditMemoSaveBtn = page.locator("xpath=//button[contains(text(),'Save')]");

    this.materialReceiptText = page.locator("xpath=//span[@name='sales_return_id']//span");

    this.getSubTotal = page.locator("xpath=//span[@name='amount_untaxed']");

    this.getTaxAmt = page.locator("xpath=//span[@name='tax_amount_view']");

    this.getContainerDesposit = page.locator("xpath=//span[@name='total_container_deposit']");

    this.getTotal = page.locator("xpath=//span[@name='amount_total']");

    this.action = page.locator("xpath=//button[normalize-space()='Action']");

    this.duplicate = page.locator("xpath=//span[normalize-space()='Duplicate']");

    this.cancel = page.locator("xpath=//button[@name='action_cancel']");

    this.action1 = page.locator("xpath=//button[normalize-space()='Action']");

    this.delete = page.locator("xpath=//span[normalize-space()='Delete']");

    this.confirmDelete = page.locator("xpath=//button[normalize-space()='Delete']");
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

      await this.directReceiptSelect.click();
      await this.page.waitForTimeout(80000);

      await reportStep(this.page, "Inventory Menu is clicked successfully", "pass");
    } catch (e) {
      await reportStep(this.page, "Inventory Menu is not clicked successfully..." + e, "fail");
    }
    return this;
  }

  async clickDirectReceiptCreate(customerName) {
    try {
       await this.page.waitForTimeout(5000);
       
      await this.directReceiptCreateBtn.click({ timeout: 30 * 1000 });
      await this.page.waitForTimeout(5000);

      await this.salesReturnVendorClick.click();
      await this.page.waitForTimeout(5000);

      await this.vendorSearchMore.click();
      await this.page.waitForTimeout(5000);

      // Lavanya
      await this.vendorSearchMoreBox.fill(String(customerName));
      await this.vendorSearchMoreBox.press('Enter');
      await this.page.waitForTimeout(5000);

      await this.vendorSelect.click();
      await this.page.waitForTimeout(5000);

      await reportStep(this.page, "Direct Receipt create button is clicked successfully", "pass");
    } catch (e) {
      await reportStep(this.page, "Direct Receipt create button is not clicked successfully..." + e, "fail");
    }
    return this;
  }

  async clickDirectReceiptLocation() {
    try {
      await this.locationClick.click();
      await this.page.waitForTimeout(5000);

      await this.locationSelect.click();
      await this.page.waitForTimeout(5000);

      await this.receiverClick.click();
      await this.page.waitForTimeout(5000);

      await this.receiverSelect.click();
      await this.page.waitForTimeout(5000);

      await this.purchaseClick.click();
      await this.page.waitForTimeout(5000);

      await this.purchaseSelect.click();
      await this.page.waitForTimeout(5000);

      await this.ownerClick.click();
      await this.page.waitForTimeout(5000);

      await this.ownerSelect.click();
      await this.page.waitForTimeout(5000);

      await reportStep(this.page, "Direct Receipt Location is clicked successfully", "pass");
    } catch (e) {
      await reportStep(this.page, "Direct Receipt Location is not clicked successfully..." + e, "fail");
    }
    return this;
  }

  async clickReturnProduct() {
    try {
      await this.page.waitForTimeout(5000);
      await this.product.click();
      await this.page.waitForTimeout(5000);

      // await this.product_SearchMore.click();
      await this.product_SearchMore.evaluate((node) => node.click());
      await this.page.waitForTimeout(5000);

      await this.product_SearchBox.fill("Lays Original 2.25oz");
      await this.product_SearchBox.press('Enter');
      await this.page.waitForTimeout(5000);

      await this.product_Select.click();
      await this.page.waitForTimeout(5000);

      await this.productAddBtn.click();
      await this.page.waitForTimeout(8000);

      await reportStep(this.page, "Product is clicked successfully", "pass");
    } catch (e) {
      await reportStep(this.page, "Product is not clicked successfully..." + e, "fail");
    }
    return this;
  }

  async clickReturn_Qty(qty, cost) {
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
          `xpath=//table[@class='o_list_table table table-sm table-hover position-relative mb-0 o_list_table_ungrouped table-striped']//tbody//tr[${row}]//td[@name='product_uom_qty']//input`
        );
        await productQty.click({ timeout: 30 * 1000 });
        await productQty.clear();
        await productQty.fill(String(qty));
        await this.page.waitForTimeout(3000);

        const productCost = this.page.locator(
          `xpath=//table[@class='o_list_table table table-sm table-hover position-relative mb-0 o_list_table_ungrouped table-striped']//tbody//tr[${row}]//td[@name='cost_price']//input`
        );
        await productCost.click({ timeout: 30 * 1000 });
        await productCost.clear();
        await productCost.fill(String(cost));
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

  async clickReturn_QtyNegative(qty, cost) {
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
          `xpath=//table[@class='o_list_table table table-sm table-hover position-relative mb-0 o_list_table_ungrouped table-striped']//tbody//tr[${row}]//td[@name='product_uom_qty']//input`
        );
        await productQty.click({ timeout: 30 * 1000 });
        await productQty.clear();
        await productQty.fill(String(qty));
        await this.page.waitForTimeout(3000);

        const productCost = this.page.locator(
          `xpath=//table[@class='o_list_table table table-sm table-hover position-relative mb-0 o_list_table_ungrouped table-striped']//tbody//tr[${row}]//td[@name='cost_price']//input`
        );
        await productCost.click({ timeout: 30 * 1000 });
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
        await this.page.waitForTimeout(5000);
        await productCost.clear();
        await productCost.fill(String(cost));
        await productCost.press('Enter');
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

      // await this.salesReturnSaveBtn.click();
      // await this.page.waitForTimeout(10000);

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
      await this.printBtn.click();
      await this.page.waitForTimeout(5000);
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

  async clickMainMenu2() {
    try {
      // await this.menu2.click({ timeout: 30 * 1000 });
      await this.page.waitForTimeout(3000);

      await this.financialAccountMenu.click();
      await this.page.waitForTimeout(3000);

      await reportStep(this.page, "Menu 2 clicked successfully", "pass");
    } catch (e) {
      await reportStep(this.page, "Menu 2 clicked not successfully..." + e, "fail");
    }
    return this;
  }

  async clickFinancialAccountMenu() {
    try {
      await this.accountsReceivableMenu.click({ timeout: 30 * 1000 });
      await this.page.waitForTimeout(3000);

      await this.creditMemoMenu.click();
      await this.page.waitForTimeout(5000);

      await reportStep(this.page, "Financial Account Menu clicked successfully", "pass");
    } catch (e) {
      await reportStep(this.page, "Financial Account Menu clicked not successfully..." + e, "fail");
    }
    return this;
  }

  async clickCreditMemo_CreateBtn() {
    try {
      await this.creditMemoCreateBtn.click();
      await this.page.waitForTimeout(10000);

      await reportStep(this.page, "CreditMemo_Create button is clicked successfully", "pass");
    } catch (e) {
      await reportStep(this.page, "CreditMemo_Create button is not clicked successfully..." + e, "fail");
    }
    return this;
  }

  async clickCreditMemo_CustomerSelect(CcustomerName) {
    try {
      await this.creditMemoCustomer.click();
      await this.page.waitForTimeout(5000);

      await this.creditMemoCustomerSearchMore.click();
      await this.page.waitForTimeout(5000);

      await this.creditMemoCustomerSearchMoreBox.fill(String(CcustomerName));
      await this.creditMemoCustomerSearchMoreBox.press('Enter');
      await this.page.waitForTimeout(5000);

      await this.creditMemoCustomerSelect.click();
      await this.page.waitForTimeout(5000);

      await this.materialReceipt.click();
      await this.page.waitForTimeout(8000);

      await this.materialReceiptSelect.click();
      await this.page.waitForTimeout(8000);

      await reportStep(this.page, "CreditMemo_Customer select clicked successfully", "pass");
    } catch (e) {
      await reportStep(this.page, "CreditMemo_Customer select clicked not successfully..." + e, "fail");
    }
    return this;
  }

  async clickCreditMemoPostBtn() {
    try {
      await this.postBtn.click();
      await this.page.waitForTimeout(15000);

      await reportStep(this.page, "CreditMemo Post Btn clicked successfully", "pass");
    } catch (e) {
      await reportStep(this.page, "CreditMemo Post Btn clicked not successfully..." + e, "fail");
    }
    return this;
  }

  async clickCreditMemoSaveBtn() {
    try {
      await this.creditMemoSaveBtn.click();
      await this.page.waitForTimeout(30000);

      await reportStep(this.page, "CreditMemo Save Btn  clicked successfully", "pass");
    } catch (e) {
      await reportStep(this.page, "CreditMemo Save Btn  clicked not successfully..." + e, "fail");
    }
    return this;
  }

  async clickCreditMemo_MaterialReceiptText() {
    try {
      const materialReceiptTextText = await this.materialReceiptText.textContent();
      console.log('Material Receipt Select Number :', materialReceiptTextText);
      await this.page.waitForTimeout(5000);

      console.log('-------------------------------');

      await reportStep(this.page, "Credit Memo_Material Receipt Text clicked successfully", "pass");
    } catch (e) {
      await reportStep(this.page, "CreditMemo_Material Receipt Text clicked not successfully..." + e, "fail");
    }
    return this;
  }

  async clickCreditMemoGetTheText() {
    try {
      console.log('-------------------------------');

      await this.page.waitForTimeout(10000);
      await this.getSubTotal.click();
      const subTotalText = await this.getSubTotal.textContent();
      console.log('Credit Memo - SubTotal Value :', subTotalText);
      await this.page.waitForTimeout(5000);

      console.log('-------------------------------');

      await this.getTaxAmt.click();
      const taxAmtText = await this.getTaxAmt.textContent();
      console.log('Credit Memo - Tax Amount Value :', taxAmtText);
      await this.page.waitForTimeout(5000);

      console.log('-------------------------------');

      await this.getContainerDesposit.click();
      const containerDespositText = await this.getContainerDesposit.textContent();
      console.log('Credit Memo - containerDesposit Value :', containerDespositText);
      await this.page.waitForTimeout(5000);

      console.log('-------------------------------');

      await this.getTotal.click();
      const getTotalText = await this.getTotal.textContent();
      console.log('Credit Memo - TotalText Value :', getTotalText);
      await this.page.waitForTimeout(5000);

      console.log('-------------------------------');

      await reportStep(this.page, "CreditMemo Get the Text successfully", "pass");
    } catch (e) {
      await reportStep(this.page, "CreditMemo Get the Text not successfully..." + e, "fail");
    }
    return this;
  }
}

module.exports = { Inventory_DirectReceipt };
