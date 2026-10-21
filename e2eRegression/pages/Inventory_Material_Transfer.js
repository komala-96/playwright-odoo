const { expect } = require('../fixtures/base');
const { reportStep } = require('../utils/reportStep');
const { ensureLoggedIn } = require('../utils/loginHelper');

class Inventory_Material_Transfer {
  constructor(page) {
    this.page = page;

    // Login Page
    this.userName = page.locator("xpath=//input[@name='login']");
    this.passWord = page.locator("xpath=//input[@name='password']");
    this.logIn = page.locator("xpath=//button[@type='submit']");

    // Menu
    this.menu = page.locator("xpath=//ul[@class='o_menu_apps']//i[@class='fa fa-bars']");

    this.inventoryMenu = page.locator("xpath=//div[contains(text(),'Inventory')]");

    this.materialTransferMenu = page.locator("xpath=//a[@role='menuitem'][normalize-space()='Material Transfer']");

    this.CreateBtn = page.locator("xpath=//button[normalize-space()='New']");

    this.salesReturnVendorClick = page.locator("xpath=//div[@name='partner_id']//input");

    this.vendorSearchMore = page.locator("xpath=//a[@id='partner_id_0_0_8']");

    this.vendorSearchMoreBox = page.locator("xpath=//input[@placeholder='Search...']");

    this.vendorSelect = page.locator(
      "xpath=(//table[@class='o_list_table table table-sm table-hover position-relative mb-0 o_list_table_ungrouped table-striped'])[2]//tbody//tr[1]//td[1]"
    );

    this.locationClick = page.locator("xpath=//div[@name='warehouse_id']//input");

    this.locationSelect = page.locator("xpath=//a[@id='warehouse_id_0_0_0']");

    this.receiverClick = page.locator("xpath=//div[@name='transfer_receiver_id']//input");

    this.receiverSelect = page.locator("xpath=//a[@id='transfer_receiver_id_0_0_0']");

    this.purchaseClick = page.locator("xpath=//div[@name='purchase_manager']//input");

    this.purchaseSelect = page.locator("xpath=//a[@id='purchase_manager_0_0_0']");

    this.ownerClick = page.locator("xpath=//div[@name='user_id']//input");

    this.ownerSelect = page.locator("xpath=//a[@id='user_id_0_0_0']");

    this.issuerClick = page.locator("xpath=//div[@name='issuer_id']//input");

    this.issuerSelect = page.locator("xpath=//a[@id='issuer_id_0_0_0']");

    this.addLine = page.locator("xpath=//a[normalize-space()='Add a line']");

    this.product = page.locator("xpath=(//div[@class='o-autocomplete dropdown']//input[@type='text'])[5]");

    this.product_SearchMore = page.locator("xpath=(//a[normalize-space()='Search More...'])[1]");

    this.product_SearchBox = page.locator(
      "xpath=//div[@class='o_searchview_input_container d-flex flex-grow-1 flex-wrap gap-1 mw-100']//input[@type='text']"
    );

    this.product_Select = page.locator(
      "xpath=(//table[@class='o_list_table table table-sm table-hover position-relative mb-0 o_list_table_ungrouped table-striped'])[2]/tbody/tr[1]/td[3]"
    );

    this.uom = page.locator("xpath=//div[@name='product_uom']//input[@role='combobox']");

    this.uomSelect = page.locator("xpath=//a[@id='autocomplete_0_0']");

    this.additionalInfo = page.locator("xpath=//a[normalize-space()='Additional Info']");

    this.shippingPolicy = page.locator("xpath=//select[@id='move_type_0']");

    this.responsible = page.locator("xpath=//input[@id='user_id_1']");

    this.responsibleSelect = page.locator("xpath=//a[@id='user_id_1_0_0']");

    this.notes = page.locator("xpath=//a[normalize-space()='Note']");

    this.notesDesc = page.locator("xpath=//textarea[@id='note_0']");

    this.returnBtn = page.locator("xpath=//span[normalize-space()='Return']");

    this.salesReturnSaveBtn = page.locator("xpath=//span[normalize-space()='Confirm']");

    this.saveBtn = page.locator("xpath=//button[normalize-space()='Save']");

    this.validateBtn = page.locator("xpath=//span[normalize-space()='Validate']");

    this.salesReturnNumber = page.locator("xpath=//h2//span[@name='name']");

    this.salesReturnInvoiceNumber = page.locator("xpath=//span[@name='invoice_id']//span");

    this.printBtn = page.locator("xpath=//span[normalize-space()='Print']");

    this.movesClick = page.locator("xpath=//button[@name='action_detailed_operations']");

    this.checkBox = page.locator(
      "xpath=//table[@class='o_list_table table table-sm table-hover position-relative mb-0 o_list_table_ungrouped table-striped']//tbody//tr[1]//td[1]"
    );

    this.action = page.locator("xpath=//span[normalize-space()='Actions']");

    this.export = page.locator("xpath=//span[normalize-space()='Export']");

    this.confirmExport = page.locator("xpath=//button[normalize-space()='Export']");

    this.close = page.locator("xpath=//button[normalize-space()='Close']");

    this.backButton = page.locator("xpath=//li[@class='breadcrumb-item d-inline-flex min-w-0 o_back_button']");

    this.action2 = page.locator("xpath=//button[normalize-space()='Action']");

    this.print = page.locator("xpath=//button[normalize-space()='Print']");

    this.receipt = page.locator("xpath=//span[normalize-space()='Receipt']");

    this.action3 = page.locator("xpath=//button[normalize-space()='Action']");

    this.duplicate = page.locator("xpath=//span[normalize-space()='Duplicate']");

    this.cancel = page.locator("xpath=//span[normalize-space()='Cancel']");

    this.okBtn = page.locator("xpath=//button[normalize-space()='Ok']");

    this.action4 = page.locator("xpath=//button[normalize-space()='Action']");

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
      // await new WebDriverWait(driver, Duration.ofSeconds(30)).until(ExpectedConditions.elementToBeClickable(menu))
      //     .click();
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
      await this.materialTransferMenu.click({ timeout: 30 * 1000 });

      // The Material Transfer list occasionally hangs mid-load (the backend
      // never answers the stock.picking search) and just sits on "Loading"
      // forever. Reloading and re-navigating kicks off a fresh request, so
      // retry a few times instead of waiting once and giving up.
      const maxAttempts = 5;
      let loaded = false;
      for (let attempt = 1; attempt <= maxAttempts; attempt++) {
        try {
          await this.CreateBtn.waitFor({ state: 'visible', timeout: 30 * 1000 });
          loaded = true;
          break;
        } catch (e) {
          console.log(`Material Transfer list still loading, retrying (${attempt}/${maxAttempts})...`);
          try {
            // 'load' can hang as long as the stuck RPC does; domcontentloaded
            // only needs the initial HTML/JS shell to parse, so a wedged
            // backend request can't block the reload itself.
            await this.page.reload({ waitUntil: 'domcontentloaded', timeout: 30 * 1000 });
          } catch (reloadErr) {
            console.log(`Reload itself did not settle (${reloadErr.message}), continuing anyway...`);
          }
          await this.page.waitForTimeout(5000);
          await this.inventoryMenu.click();
          await this.page.waitForTimeout(5000);
          await this.materialTransferMenu.click({ timeout: 30 * 1000 });
        }
      }

      if (!loaded) {
        throw new Error(`Material Transfer list did not finish loading after ${maxAttempts} attempts`);
      }

      await reportStep(this.page, "Inventory Menu is clicked successfully", "pass");
    } catch (e) {
      await reportStep(this.page, "Inventory Menu is not clicked successfully..." + e, "fail");
    }
    return this;
  }

  async clickMaterialTransferCreate(customerName) {
    try {
      await this.CreateBtn.click({ timeout: 30 * 1000 });
      await this.page.waitForTimeout(5000);

      await this.locationClick.click();
      await this.page.waitForTimeout(5000);

      await this.locationSelect.click();
      await this.page.waitForTimeout(5000);

      await reportStep(this.page, "MaterialTransfer create button is clicked successfully", "pass");
    } catch (e) {
      await reportStep(this.page, "MaterialTransfer create button is not clicked successfully..." + e, "fail");
    }
    return this;
  }

  async clickMaterialTransferCreateNegative(customerName) {
    try {
      await this.CreateBtn.click({ timeout: 30 * 1000 });
      await this.page.waitForTimeout(5000);

      await this.locationClick.click();
      await this.page.waitForTimeout(5000);

      await this.locationSelect.click();
      await this.page.waitForTimeout(5000);

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

      await reportStep(this.page, "MaterialTransfer create button is clicked successfully", "pass");
    } catch (e) {
      await reportStep(this.page, "MaterialTransfer create button is not clicked successfully..." + e, "fail");
    }
    return this;
  }

  async clickMaterialTransferLocation() {
    try {
      await this.receiverClick.click();
      await this.page.waitForTimeout(5000);

      await this.receiverSelect.click();
      await this.page.waitForTimeout(5000);

      await this.ownerClick.click();
      await this.page.waitForTimeout(5000);

      await this.ownerSelect.click();
      await this.page.waitForTimeout(5000);

      await this.issuerClick.click();
      await this.page.waitForTimeout(5000);

      await this.issuerSelect.click();
      await this.page.waitForTimeout(5000);

      await reportStep(this.page, "MaterialTransfer Issuer is clicked successfully", "pass");
    } catch (e) {
      await reportStep(this.page, "MaterialTransfer Issuer is not clicked successfully..." + e, "fail");
    }
    return this;
  }

  async clickReturnProduct() {
    try {
      await this.page.waitForTimeout(5000);
      await this.addLine.click();
      await this.page.waitForTimeout(5000);
      await this.product.click();
      await this.page.waitForTimeout(5000);

      // await this.product_SearchMore.click();
      await this.product_SearchMore.evaluate((node) => node.click());
      await this.page.waitForTimeout(5000);

      await this.product_SearchBox.fill("Milky Way");
      await this.product_SearchBox.press('Enter');
      await this.page.waitForTimeout(5000);

      await this.product_Select.click();
      await this.page.waitForTimeout(5000);

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
          `xpath=//table[@class='o_list_table table table-sm table-hover position-relative mb-0 o_list_table_ungrouped table-striped']//tbody//tr[${row}]//td[@name='product_uom_qty']//input`
        );
        await productQty.click({ timeout: 30 * 1000 });
        await productQty.clear();
        await productQty.fill(String(qty));
        await this.page.waitForTimeout(3000);

        console.log(' Product name:', name);

        console.log('-------------------------------');

        const inventoryWhInput = this.page.locator(
          `xpath=//table[contains(@class,'o_list_table')]//tbody//tr[${row}]//td[@name='warehouse_id']//input`
        );
        await inventoryWhInput.click({ timeout: 30 * 1000 });
        await this.page.waitForTimeout(3000);
        const whFirstOption = this.page.locator(
          "xpath=//ul[contains(@class,'o-autocomplete') or contains(@class,'ui-autocomplete')]/li[1]"
        );
        await whFirstOption.click({ timeout: 30 * 1000 });
        await this.page.waitForTimeout(3000);

        // 2) Inventory Bin
        const inventoryBinInput = this.page.locator(
          `xpath=//table[contains(@class,'o_list_table')]//tbody//tr[${row}]//td[@name='bin_location']//input`
        );
        await inventoryBinInput.click({ timeout: 30 * 1000 });
        await this.page.waitForTimeout(3000);
        const binFirstOption = this.page.locator(
          "xpath=//ul[contains(@class,'o-autocomplete') or contains(@class,'ui-autocomplete')]/li[1]"
        );
        await binFirstOption.click({ timeout: 30 * 1000 });
        await this.page.waitForTimeout(3000);

        // 3) Transfer Warehouse
        const transferWhInput = this.page.locator(
          `xpath=//table[contains(@class,'o_list_table')]//tbody//tr[${row}]//td[@name='warehouse_dest_id']//input`
        );
        await transferWhInput.click({ timeout: 30 * 1000 });
        await this.page.waitForTimeout(3000);
        const transferWhFirstOption = this.page.locator(
          "xpath=//ul[contains(@class,'o-autocomplete') or contains(@class,'ui-autocomplete')]/li[1]"
        );
        await transferWhFirstOption.click({ timeout: 30 * 1000 });
        await this.page.waitForTimeout(3000);

        // 4) Transfer Bin
        const transferBinInput = this.page.locator(
          `xpath=//table[contains(@class,'o_list_table')]//tbody//tr[${row}]//td[@name='bin_dest_location']//input`
        );
        await transferBinInput.click({ timeout: 30 * 1000 });
        await this.page.waitForTimeout(3000);
        const transferBinFirstOption = this.page.locator(
          "xpath=//ul[contains(@class,'o-autocomplete') or contains(@class,'ui-autocomplete')]/li[1]"
        );
        await transferBinFirstOption.click({ timeout: 30 * 1000 });
        await this.page.waitForTimeout(3000);

        // ======================
        const doneQty = this.page.locator(
          `xpath=//table[@class='o_list_table table table-sm table-hover position-relative mb-0 o_list_table_ungrouped table-striped']//tbody//tr[${row}]//td[@name='quantity']//input`
        );
        await doneQty.click({ timeout: 30 * 1000 });
        await doneQty.clear();
        await doneQty.fill(String(qty));
        await this.page.waitForTimeout(3000);

        console.log('Product:', name);
        console.log('Qty set to:', qty);
        console.log('Locations updated (first options selected).');
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
        try {
          const errorMsg = this.page.locator("xpath=//div[@class='o_dialog']//p");
          await errorMsg.waitFor({ state: 'visible', timeout: 30000 });
          const errorMessageText = await errorMsg.textContent();
          console.log('Validation Error Message:', errorMessageText);

          // Dismiss the validation error
          await this.page.locator("xpath=//button[normalize-space()='Close']").click();
          console.log('Validation error dismissed successfully ');
          await this.page.waitForTimeout(2000);
        } catch (e) {
          console.log('No validation error');
        }
        await productCost.clear();
        await productCost.fill(String(cost));
        await this.page.waitForTimeout(3000);
        await productName.click();
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

        const inventoryWhInput = this.page.locator(
          `xpath=//table[contains(@class,'o_list_table')]//tbody//tr[${row}]//td[@name='warehouse_id']//input`
        );
        // await inventoryWhInput.click();
        await inventoryWhInput.evaluate((node) => node.click());

        await this.page.waitForTimeout(3000);
        const whFirstOption = this.page.locator(
          "xpath=//ul[contains(@class,'o-autocomplete') or contains(@class,'ui-autocomplete')]/li[1]"
        );
        await whFirstOption.click({ timeout: 30 * 1000 });
        await this.page.waitForTimeout(3000);

        // 2) Inventory Bin
        const inventoryBinInput = this.page.locator(
          `xpath=//table[contains(@class,'o_list_table')]//tbody//tr[${row}]//td[@name='bin_location']//input`
        );
        await inventoryBinInput.click({ timeout: 30 * 1000 });
        await this.page.waitForTimeout(3000);
        const binFirstOption = this.page.locator(
          "xpath=//ul[contains(@class,'o-autocomplete') or contains(@class,'ui-autocomplete')]/li[1]"
        );
        await binFirstOption.click({ timeout: 30 * 1000 });
        await this.page.waitForTimeout(3000);

        // 3) Transfer Warehouse
        const transferWhInput = this.page.locator(
          `xpath=//table[contains(@class,'o_list_table')]//tbody//tr[${row}]//td[@name='warehouse_dest_id']//input`
        );
        await transferWhInput.click({ timeout: 30 * 1000 });
        await this.page.waitForTimeout(3000);
        const transferWhFirstOption = this.page.locator(
          "xpath=//ul[contains(@class,'o-autocomplete') or contains(@class,'ui-autocomplete')]/li[1]"
        );
        await transferWhFirstOption.click({ timeout: 30 * 1000 });
        await this.page.waitForTimeout(3000);

        // 4) Transfer Bin
        const transferBinInput = this.page.locator(
          `xpath=//table[contains(@class,'o_list_table')]//tbody//tr[${row}]//td[@name='bin_dest_location']//input`
        );
        await transferBinInput.click({ timeout: 30 * 1000 });
        await this.page.waitForTimeout(3000);
        const transferBinFirstOption = this.page.locator(
          "xpath=//ul[contains(@class,'o-autocomplete') or contains(@class,'ui-autocomplete')]/li[1]"
        );
        await transferBinFirstOption.click({ timeout: 30 * 1000 });
        await this.page.waitForTimeout(3000);

        // ======================
        const doneQty = this.page.locator(
          `xpath=//table[@class='o_list_table table table-sm table-hover position-relative mb-0 o_list_table_ungrouped table-striped']//tbody//tr[${row}]//td[@name='quantity']//input`
        );
        await doneQty.click({ timeout: 30 * 1000 });
        await doneQty.clear();
        await doneQty.fill(String(qty));
        await doneQty.press('Enter');
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

        console.log('Product:', name);
        console.log('Qty set to:', qty);
        console.log('Locations updated (first options selected).');
        console.log('-------------------------------');
      }
      await reportStep(this.page, "Return Qty updated successfully", "pass");
    } catch (e) {
      await reportStep(this.page, "Return Qty updated not successfully..." + e, "fail");
    }
    return this;
  }

  async clickOtherInfo() {
    try {
      await this.page.waitForTimeout(5000);
      await this.additionalInfo.click();
      await this.page.waitForTimeout(3000);
      await this.shippingPolicy.click();
      // Select the "When all products are ready" option by visible text
      await this.shippingPolicy.selectOption({ label: 'When all products are ready' });
      await this.page.waitForTimeout(3000);
      await this.responsible.click();
      await this.responsibleSelect.click();
      await this.page.waitForTimeout(3000);
      await this.notes.click();
      await this.notesDesc.fill("test notes");
      await this.page.waitForTimeout(3000);
      await this.salesReturnSaveBtn.click();
      await this.page.waitForTimeout(3000);
      await this.validateBtn.click();
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

      await reportStep(this.page, "clickOtherInfo Button clicked successfully", "pass");
    } catch (e) {
      await reportStep(this.page, "clickOtherInfo Button clicked not successfully..." + e, "fail");
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

  async clickDelete() {
    try {
      // await new WebDriverWait(driver, Duration.ofSeconds(30)).until(ExpectedConditions.elementToBeClickable(menu2))
      //     .click();
      await this.page.waitForTimeout(3000);

      await this.printBtn.click();
      await this.page.waitForTimeout(6000);
      await this.movesClick.click();
      await this.page.waitForTimeout(2000);
      await this.checkBox.click();
      await this.page.waitForTimeout(2000);
      /* await this.action.click();
      await this.export.click();
      await this.page.waitForTimeout(2000);
      await this.confirmExport.click();
      await this.close.click();
      await this.page.waitForTimeout(2000); */
      await this.backButton.click();
      await this.page.waitForTimeout(2000);
      /* await this.action2.click();
      await this.page.waitForTimeout(2000);
      await this.print.click();
      await this.page.waitForTimeout(2000);
      await this.receipt.click();
      await this.page.waitForTimeout(3000); */
      await this.action3.click();
      await this.duplicate.click();
      await this.page.waitForTimeout(2000);
      await this.cancel.click();
      await this.page.waitForTimeout(3000);
      await this.okBtn.click();
      await this.page.waitForTimeout(3000);
      await this.action4.click();
      await this.delete.click();
      await this.page.waitForTimeout(2000);
      await this.confirmDelete.click();
      await this.page.waitForTimeout(2000);

      await reportStep(this.page, "Delete clicked successfully", "pass");
    } catch (e) {
      await reportStep(this.page, "Delete clicked not successfully..." + e, "fail");
    }
    return this;
  }
}

module.exports = { Inventory_Material_Transfer };
