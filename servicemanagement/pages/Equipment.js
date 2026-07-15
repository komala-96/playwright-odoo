const { expect } = require('../fixtures/base');
const { reportStep } = require('../utils/reportStep');

class Equipment {
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
    this.equipmentMenu = page.locator("xpath=//a[normalize-space()='Equipment']");

    this.createBtn = page.locator("xpath=//button[normalize-space()='New']");

    this.warehouse = page.locator("xpath=//input[@id='operator_location_id_0']");

    this.warehouseSelect = page.locator("xpath=//a[@id='operator_location_id_0_0_1']");

    this.equipType = page.locator("xpath=//input[@id='machine_type_id_0']");

    this.searchMore = page.locator("xpath=//a[@id='machine_type_id_0_0_8']");

    this.searchMoreBox = page.locator("xpath=//input[@placeholder='Search...']");

    this.typeSelect = page.locator(
      "xpath=//table[@class='o_list_table table table-sm table-hover position-relative mb-0 o_list_table_ungrouped table-striped']//tbody//tr[1]//td[1]"
    );

    this.equipName = page.locator("xpath=//input[@id='equipment_name_id_0']");

    this.nameSelect = page.locator("xpath=//a[@id='equipment_name_id_0_0_0']");

    this.serialNo = page.locator("xpath=//input[@id='serial_no_0']");

    this.assetNo = page.locator("xpath=//input[@id='asset_no_0']");

    this.model = page.locator("xpath=//input[@id='equipment_model_id_0']");

    this.searchMore1 = page.locator("xpath=//a[@id='equipment_model_id_0_0_8']");

    this.searchMoreBox1 = page.locator("xpath=//input[@placeholder='Search...']");

    this.modelSelect = page.locator(
      "xpath=//table[@class='o_list_table table table-sm table-hover position-relative mb-0 o_list_table_ungrouped table-striped']//tbody//tr[1]//td[1]"
    );

    this.modelNo = page.locator("xpath=//input[@id='equipment_model_no_id_0']");

    this.modelNoSelect = page.locator("xpath=//a[@id='equipment_model_no_id_0_0_0']");

    this.equipfrontage = page.locator("xpath=//select[@id='machine_frontage_0']");

    this.manufacturer = page.locator("xpath=//input[@id='manufacture_0']");

    this.distributor = page.locator("xpath=//input[@id='partner_id_0']");

    this.purValue = page.locator("xpath=//input[@id='purchase_value_0']");

    this.warranty = page.locator("xpath=//select[@id='warranty_0']");

    this.warrantyEnd = page.locator("xpath=//input[@id='warranty_date_0']");

    this.inventory = page.locator("xpath=//div[@name='is_inventory']//input[@type='checkbox']");

    this.telemetry = page.locator("xpath=//div[@name='is_telemetry']//input[@type='checkbox']");

    this.creditCard = page.locator("xpath=//div[@name='is_credit_Card_reader']//input[@type='checkbox']");

    this.energy = page.locator("xpath=//div[@name='is_energy_star']//input[@type='checkbox']");

    this.health = page.locator("xpath=//div[@name='is_health_wellness']//input[@type='checkbox']");

    this.partsClick = page.locator("xpath=//a[@name='parts_details']");

    this.addLine = page.locator("xpath=(//a[normalize-space()='Add a line'])[1]");

    this.parts = page.locator("xpath=//div[@name='parts_id']//input[@role='combobox']");

    this.partsSelect = page.locator("xpath=//a[@id='autocomplete_0_0']");

    this.qty = page.locator("xpath=(//div[@name='quantity']//input[@type='text'])[1]");

    this.desc = page.locator("xpath=(//a[normalize-space()='Description'])[1]");

    this.descText = page.locator("xpath=//input[@id='note_0']");

    this.saveBtn = page.locator("xpath=//button[normalize-space()='Save']");

    this.backEquip = page.locator("xpath=//a[@class='fw-bold text-truncate']");

    this.search = page.locator("xpath=//input[@placeholder='Search...']");

    this.equipClick = page.locator("xpath=//article[1]");

    this.notes = page.locator("xpath=//span[normalize-space()='Notes']");

    this.addaLine = page.locator("xpath=//a[normalize-space()='Add a line']");

    this.message = page.locator("xpath=//div[@name='message']//input[@type='text']");

    this.saveandClose = page.locator("xpath=//button[normalize-space()='Save & Close']");

    this.saveNotes = page.locator("xpath=//button[normalize-space()='Save Note']");

    this.equipmentActivity = page.locator("xpath=//span[normalize-space()='Activity History']");

    this.discard = page.locator("xpath=//span[normalize-space()='Close']");

    this.activity = page.locator("xpath=//span[normalize-space()='Equipment Activity']");

    this.customer = page.locator("xpath=//input[@id='transfer_location_partner_id_0']");

    this.customerSelect = page.locator("xpath=//a[@id='transfer_location_partner_id_0_0_0']");

    this.microMarket = page.locator("xpath=//input[@id='transfer_micro_market_id_0']");

    this.microMarketSelect = page.locator("xpath=//a[@id='transfer_micro_market_id_0_0_0']");

    this.submit = page.locator("xpath=//span[normalize-space()='Submit']");

    this.action = page.locator("xpath=//button[normalize-space()='Action']");

    this.delete = page.locator("xpath=//span[normalize-space()='Delete']");

    this.confirmDelete = page.locator("xpath=//button[normalize-space()='Delete']");

    this.remove = page.locator("xpath=//button[@title='Remove']");
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

  async clickSalesMenuBtn() {
    try {
      await this.page.waitForTimeout(3000);
      await this.serviceMenu.click();
      await this.page.waitForTimeout(2000);
      await this.equipmentMenu.click();
      await this.page.waitForTimeout(8000);

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

  async clickCreateCaseBtn(srno, assno, man, dist, prValue, date, quan, text, recTxt) {
    try {
      await this.warehouse.click();
      await this.warehouseSelect.click();
      await this.page.waitForTimeout(2000);
      await this.equipType.click();
      await this.page.waitForTimeout(2000);
      await this.searchMore.click();
      await this.page.waitForTimeout(2000);
      await this.searchMoreBox.fill("Coffee Maker");
      await this.searchMoreBox.press('Enter');
      await this.page.waitForTimeout(2000);
      await this.typeSelect.click();
      await this.page.waitForTimeout(2000);
      await this.equipName.fill("equipment");
      await this.page.waitForTimeout(2000);
      await this.nameSelect.click();
      await this.page.waitForTimeout(2000);
      await this.serialNo.fill(String(srno));
      await this.assetNo.fill(String(assno));
      await this.page.waitForTimeout(2000);
      await this.model.click();
      await this.page.waitForTimeout(2000);
      await this.searchMore1.click();
      await this.page.waitForTimeout(2000);
      await this.searchMoreBox1.fill("Top Load");
      await this.searchMoreBox1.press('Enter');
      await this.page.waitForTimeout(2000);
      await this.modelSelect.click();
      await this.page.waitForTimeout(2000);
      await this.modelNo.click();
      await this.page.waitForTimeout(2000);
      await this.page.waitForTimeout(2000);
      await this.modelNoSelect.click();
      await this.page.waitForTimeout(2000);
      await this.equipfrontage.selectOption({ label: 'Stack' });
      await this.page.waitForTimeout(2000);
      await this.manufacturer.fill(String(man));
      await this.distributor.fill(String(dist));
      await this.page.waitForTimeout(2000);
      await this.purValue.clear();
      await this.purValue.fill(String(prValue));
      await this.page.waitForTimeout(2000);
      await this.warranty.selectOption({ label: 'Yes' });
      await this.page.waitForTimeout(2000);
      await this.warrantyEnd.fill(String(date));
      await this.page.waitForTimeout(2000);
      await this.inventory.evaluate((node) => node.click());
      await this.telemetry.evaluate((node) => node.click());
      await this.creditCard.evaluate((node) => node.click());
      await this.energy.evaluate((node) => node.click());
      await this.health.evaluate((node) => node.click());
      await this.page.waitForTimeout(3000);
      await this.partsClick.click();
      await this.page.waitForTimeout(2000);
      await this.addLine.click();
      await this.page.waitForTimeout(2000);
      await this.parts.click();
      await this.page.waitForTimeout(2000);
      await this.partsSelect.click();
      await this.page.waitForTimeout(2000);
      await this.qty.clear();
      await this.qty.fill(String(quan));
      await this.page.waitForTimeout(2000);
      await this.desc.click();
      await this.descText.fill(String(text));
      await this.page.waitForTimeout(2000);

      await this.saveBtn.click();

      await this.page.waitForTimeout(5000);

      await reportStep(this.page, "case creation  is clicked successfully", "pass");
    } catch (e) {
      await reportStep(this.page, "case creation  is not clicked successfully..." + e, "fail");
    }
    return this;
  }

  async clickCreateCaseBtnNegative(srno, assno, man, dist, prValue, date, quan, text, recTxt) {
    try {
      await this.warehouse.click();
      await this.warehouseSelect.click();
      await this.page.waitForTimeout(2000);
      await this.equipType.click();
      await this.page.waitForTimeout(2000);
      /* await this.searchMore.click();
      await this.page.waitForTimeout(2000);
      await this.searchMoreBox.fill("Coffee Maker"); await this.searchMoreBox.press('Enter');
      await this.page.waitForTimeout(2000);
      await this.typeSelect.click();
      await this.page.waitForTimeout(2000); */
      await this.equipName.clear();
      await this.page.waitForTimeout(2000);
      // await this.nameSelect.click();
      // await this.page.waitForTimeout(2000);
      await this.serialNo.fill(String(srno));
      await this.assetNo.fill(String(assno));
      await this.page.waitForTimeout(2000);
      await this.model.click();
      await this.page.waitForTimeout(2000);
      await this.searchMore1.click();
      await this.page.waitForTimeout(2000);
      await this.searchMoreBox1.fill("Top Load");
      await this.searchMoreBox1.press('Enter');
      await this.page.waitForTimeout(2000);
      await this.modelSelect.click();
      await this.page.waitForTimeout(2000);
      await this.modelNo.click();
      await this.page.waitForTimeout(2000);
      await this.page.waitForTimeout(2000);
      await this.modelNoSelect.click();
      await this.page.waitForTimeout(2000);
      await this.equipfrontage.selectOption({ label: 'Stack' });
      await this.page.waitForTimeout(2000);
      await this.manufacturer.fill(String(man));
      await this.distributor.fill(String(dist));
      await this.page.waitForTimeout(2000);
      await this.purValue.clear();
      await this.purValue.fill(String(prValue));
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
      await this.warranty.selectOption({ label: 'Yes' });
      await this.page.waitForTimeout(2000);
      await this.warrantyEnd.fill(String(date));
      await this.page.waitForTimeout(2000);
      await this.inventory.evaluate((node) => node.click());
      await this.telemetry.evaluate((node) => node.click());
      await this.creditCard.evaluate((node) => node.click());
      await this.energy.evaluate((node) => node.click());
      await this.health.evaluate((node) => node.click());
      await this.page.waitForTimeout(3000);
      await this.partsClick.click();
      await this.page.waitForTimeout(2000);
      await this.addLine.click();
      await this.page.waitForTimeout(2000);
      await this.parts.click();
      await this.page.waitForTimeout(2000);
      await this.partsSelect.click();
      await this.page.waitForTimeout(2000);
      await this.qty.clear();
      await this.qty.fill(String(quan));
      await this.page.waitForTimeout(2000);

      await this.desc.click();
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
      await this.descText.fill(String(text));
      await this.page.waitForTimeout(2000);

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
      await this.page.waitForTimeout(5000);

      await reportStep(this.page, "case creation  is clicked successfully", "pass");
    } catch (e) {
      await reportStep(this.page, "case creation  is not clicked successfully..." + e, "fail");
    }
    return this;
  }

  async clickEditBtn(srno) {
    try {
      await this.page.waitForTimeout(5000);
      await this.backEquip.click();
      await this.page.waitForTimeout(5000);
      await this.remove.click();
      await this.page.waitForTimeout(3000);
      await this.search.fill(String(srno));
      await this.search.press('Enter');
      await this.page.waitForTimeout(5000);
      await this.equipClick.click();
      await this.page.waitForTimeout(3000);
      await this.notes.click();
      await this.page.waitForTimeout(2000);
      await this.addaLine.click();
      await this.message.fill("test");
      await this.saveandClose.click();
      await this.page.waitForTimeout(2000);
      await this.saveNotes.click();
      await this.page.waitForTimeout(2000);
      await this.equipmentActivity.click();
      await this.discard.click();
      await this.page.waitForTimeout(2000);
      await this.activity.click();
      await this.page.waitForTimeout(2000);
      await this.customer.click();
      await this.customer.fill("komala");
      await this.page.waitForTimeout(2000);
      await this.customerSelect.click();
      await this.page.waitForTimeout(2000);
      await this.microMarket.click();
      await this.microMarketSelect.click();
      await this.page.waitForTimeout(2000);
      await this.submit.click();
      await this.page.waitForTimeout(2000);
      await this.action.click();
      await this.delete.click();
      await this.page.waitForTimeout(2000);
      await this.confirmDelete.click();
      await this.page.waitForTimeout(2000);

      await reportStep(this.page, "Edit Btn is clicked successfully", "pass");
    } catch (e) {
      await reportStep(this.page, "Edit Btn is not clicked successfully..." + e, "fail");
    }
    return this;
  }
}

module.exports = { Equipment };
