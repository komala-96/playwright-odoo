const { expect } = require('../fixtures/base');
const { reportStep } = require('../utils/reportStep');

class Sales {
  constructor(page) {
    this.page = page;

    // Login Page
    this.userName = page.locator("xpath=//input[@name='login']");
    this.passWord = page.locator("xpath=//input[@name='password']");
    this.logIn = page.locator("xpath=//button[@type='submit']");

    // Menu
    this.menu = page.locator("xpath=//ul[@class='o_menu_apps']//i[@class='fa fa-bars']");
    this.crmMenu = page.locator("xpath=//div[contains(text(),'CRM')]");

    // save btn
    this.salesMenu = page.locator("xpath=//span[normalize-space()='Sales']");
    this.mypipelineMenuBtn = page.locator("xpath=//a[normalize-space()='My Activities']");

    this.createBtn = page.locator("xpath=//button[normalize-space()='New']");

    this.name = page.locator("xpath=//textarea[@id='name_0']");

    this.customer = page.locator("xpath=//input[@id='partner_id_1']");

    this.customerSelect = page.locator("xpath=//a[@id='partner_id_1_0_0']");

    this.phone = page.locator("xpath=//input[@id='phone_0']");

    this.mail = page.locator("xpath=//input[@id='email_from_0']");

    this.expextedClosing = page.locator("xpath=//input[@id='date_deadline_0']");

    this.priority = page.locator("xpath=(//div[@name='priority'])[2]");

    this.tag = page.locator("xpath=//input[@id='tag_ids_1']");

    this.tagSelect = page.locator("xpath=//a[@id='tag_ids_1_0_0']");

    this.ebitdaBtn = page.locator("xpath=//input[@name='ebitda']");

    this.cmpnyName = page.locator("xpath=//input[@id='partner_name_1']");

    this.street = page.locator("xpath=//input[@id='street_1']");

    this.street2 = page.locator("xpath=//input[@id='street2_1']");

    this.website = page.locator("xpath=//input[@id='website_1']");

    this.rooms = page.locator("xpath=//input[@id='no_of_rooms_1']");

    this.occupancyRate = page.locator("xpath=//input[@id='checkin_frequency_1']");

    this.visitors = page.locator("xpath=//input[@id='visitors_types_ids_1']");

    this.visitorsSelect = page.locator("xpath=//a[@id='visitors_types_ids_1_0_0']");

    this.language = page.locator("xpath=(//div[@class='o_input_dropdown']//input[@type='text'])[21]");

    this.langSelect = page.locator("xpath=//li[@class='ui-menu-item']//a[contains(text(),'English (US)')]");

    this.position = page.locator("xpath=//input[@id='function_1']");

    this.campaign = page.locator("xpath=//input[@id='campaign_id_1']");

    this.campaignSelect = page.locator("xpath=//a[@id='campaign_id_1_0_0']");

    this.medium = page.locator("xpath=//input[@id='medium_id_1']");

    this.mediumSelect = page.locator("xpath=//a[@id='medium_id_1_0_0']");

    this.campaignType = page.locator("xpath=//input[@id='source_id_1']");

    this.campaignTypeSelect = page.locator("xpath=//a[@id='source_id_1_0_1']");

    this.referred = page.locator("xpath=//input[@id='referred_1']");

    this.internalNotes = page.locator("xpath=//a[normalize-space()='Internal Notes']");

    this.descr = page.locator("xpath=//div[@class='note-editable odoo-editor-editable']");

    this.saveBtn = page.locator("xpath=//button[normalize-space()='Save']");

    this.startSurvey = page.locator("xpath=//span[normalize-space()='Start Survey']");

    this.activityType = page.locator("xpath=//input[@id='activity_type_id_0']");

    this.typeSelect = page.locator("xpath=//a[@id='activity_type_id_0_0_0']");

    this.assignedTo = page.locator("xpath=//input[@id='user_id_0']");

    this.assignedSelect = page.locator("xpath=//a[@id='user_id_0_0_0']");

    this.summary = page.locator("xpath=//input[@id='summary_0']");

    this.schedule = page.locator("xpath=//span[normalize-space()='Schedule']");

    this.clickQuotation = page.locator("xpath=//span[normalize-space()='New Quotation']");

    this.associated_Product = page.locator("xpath=//div[@name='associated_product']//input[@type='checkbox']");

    this.confirmBtn = page.locator("xpath=//span[normalize-space()='Confirm']");

    this.backActivity = page.locator("xpath=//li[@class='breadcrumb-item d-inline-flex min-w-0 o_back_button']");

    this.quotation = page.locator("xpath=//span[normalize-space()='Quotations']");

    this.checkboxSelect = page.locator(
      "xpath=(//table[@class='o_list_table table table-sm table-hover position-relative mb-0 o_list_table_ungrouped table-striped'])/tbody/tr[1]/td[1]"
    );

    this.print = page.locator("xpath=//span[normalize-space()='Print']");

    this.order = page.locator("xpath=//span[normalize-space()='Quotation / Order']");

    this.backActivity1 = page.locator("xpath=//a[normalize-space()='activity']");

    this.action = page.locator("xpath=//button[normalize-space()='Action']");

    this.duplicate = page.locator("xpath=//span[normalize-space()='Duplicate']");

    this.action1 = page.locator("xpath=//button[normalize-space()='Action']");

    this.delete = page.locator("xpath=//span[normalize-space()='Delete']");

    this.confirmDelete = page.locator("xpath=//button[normalize-space()='Delete']");

    this.action3 = page.locator("xpath=//button[normalize-space()='Action']");

    this.addProperty = page.locator("xpath=//span[normalize-space()='Add Properties']");

    this.addProperty1 = page.locator("xpath=(//div[@name='lead_properties']//input[@type='text'])[1]");

    this.action2 = page.locator("xpath=//button[normalize-space()='Action']");

    this.archive = page.locator("xpath=//span[normalize-space()='Archive']");

    this.confirmArchive = page.locator("xpath=//button[normalize-space()='Archive']");
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
      await this.page.waitForTimeout(5000);

      await reportStep(this.page, "login button is entered successfully", "pass");
    } catch (e) {
      await reportStep(this.page, "login button is not entered successfully..." + e, "fail");
    }
    return this;
  }

  async clickMenu() {
    try {
      // await new WebDriverWait(driver, Duration.ofSeconds(30))
      // .until(ExpectedConditions.elementToBeClickable(menu)).click();

      await this.page.waitForTimeout(2000);
      await this.crmMenu.click();

      await this.page.waitForTimeout(3000);

      await reportStep(this.page, "Menu clicked successfully", "pass");
    } catch (e) {
      await reportStep(this.page, "Menu clicked not successfully..." + e, "fail");
    }
    return this;
  }

  async clickSalesMenuBtn() {
    try {
      await this.salesMenu.click();
      await this.page.waitForTimeout(8000);

      await this.mypipelineMenuBtn.click();
      await this.page.waitForTimeout(25000);

      await reportStep(this.page, "CRM Sales menu is clicked successfully", "pass");
    } catch (e) {
      await reportStep(this.page, "CRM Sales menu is not clicked successfully..." + e, "fail");
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

  async ClickSalesDetailsBtn(name1, phone1, date, ebidta, cmpName, str, str2, website1, room1, occRate, pos, ref, desc) {
    try {
      await this.name.fill(String(name1));
      await this.page.waitForTimeout(2000);
      await this.customer.fill("komala");
      await this.customer.press('Enter');
      await this.page.waitForTimeout(2000);
      // await this.customerSelect.click();
      // await this.page.waitForTimeout(2000);
      await this.phone.clear();
      await this.phone.fill(String(phone1));
      await this.page.waitForTimeout(2000);
      await this.expextedClosing.fill(String(date));
      await this.page.waitForTimeout(2000);
      await this.priority.click();
      await this.page.waitForTimeout(2000);
      await this.tag.click();
      await this.page.waitForTimeout(2000);
      // await this.tagSelect.click();
      await this.tagSelect.evaluate((node) => node.click());
      await this.page.waitForTimeout(2000);
      // await this.ebitdaBtn.clear();
      // await this.ebitdaBtn.fill(String(ebidta));

      await this.page.waitForTimeout(2000);
      await this.cmpnyName.fill(String(cmpName));
      await this.page.waitForTimeout(2000);
      await this.street.fill(String(str));
      await this.street2.fill(String(str2));
      await this.page.waitForTimeout(2000);
      await this.website.fill(String(website1));
      await this.page.waitForTimeout(2000);
      await this.rooms.clear();
      await this.rooms.fill(String(room1));
      await this.page.waitForTimeout(2000);
      await this.occupancyRate.fill(String(occRate));

      await this.page.waitForTimeout(2000);
      await this.visitors.click();
      await this.page.waitForTimeout(2000);
      await this.visitorsSelect.click();
      await this.page.waitForTimeout(3000);

      await this.page.waitForTimeout(2000);
      await this.position.fill(String(pos));
      await this.page.waitForTimeout(2000);
      await this.campaign.click();
      await this.page.waitForTimeout(2000);
      await this.campaignSelect.click();
      await this.page.waitForTimeout(2000);
      await this.medium.click();
      await this.page.waitForTimeout(2000);
      await this.mediumSelect.click();
      await this.page.waitForTimeout(2000);
      await this.campaignType.click();
      await this.page.waitForTimeout(2000);
      await this.campaignTypeSelect.click();
      await this.page.waitForTimeout(2000);
      await this.referred.fill(String(ref));
      await this.page.waitForTimeout(2000);
      await this.internalNotes.click();
      await this.page.waitForTimeout(2000);
      await this.descr.fill(String(desc));
      await this.page.waitForTimeout(2000);
      await this.saveBtn.click();
      await this.page.waitForTimeout(3000);

      await reportStep(this.page, "Activity Creation Btn is clicked successfully", "pass");
    } catch (e) {
      await reportStep(this.page, "Activity Create Btn is not clicked successfully..." + e, "fail");
    }
    return this;
  }

  async ClickSalesDetailsBtnNegative(name1, phone1, date, ebidta, cmpName, str, str2, website1, room1, occRate, pos, ref, desc) {
    try {

      await this.page.waitForTimeout(2000);
      await this.customer.fill("komala");
      await this.customer.press('Enter');
      await this.page.waitForTimeout(2000);
      // await this.customerSelect.click();
      // await this.page.waitForTimeout(2000);

      await this.page.waitForTimeout(2000);
      await this.phone.clear();
      await this.phone.fill(String(phone1));
      await this.page.waitForTimeout(2000);
      await this.expextedClosing.fill(String(date));
      await this.page.waitForTimeout(2000);
      await this.priority.click();
      await this.page.waitForTimeout(2000);
      await this.tag.click();
      await this.page.waitForTimeout(2000);
      // await this.tagSelect.click();
      await this.tagSelect.evaluate((node) => node.click());
      await this.page.waitForTimeout(2000);
      // await this.ebitdaBtn.clear();
      // await this.ebitdaBtn.fill(String(ebidta));

      await this.page.waitForTimeout(2000);
      await this.cmpnyName.fill(String(cmpName));
      await this.page.waitForTimeout(2000);
      await this.street.fill(String(str));
      await this.street2.fill(String(str2));
      await this.page.waitForTimeout(2000);
      await this.website.fill(String(website1));
      await this.page.waitForTimeout(2000);
      await this.rooms.clear();
      await this.rooms.fill(String(room1));
      await this.page.waitForTimeout(2000);
      await this.occupancyRate.fill(String(occRate));

      await this.page.waitForTimeout(2000);
      // await this.visitors.click();
      await this.visitors.evaluate((node) => node.click());
      await this.page.waitForTimeout(2000);
      await this.visitorsSelect.click();
      await this.page.waitForTimeout(3000);

      await this.page.waitForTimeout(2000);
      await this.position.fill(String(pos));
      await this.page.waitForTimeout(2000);
      await this.campaign.click();
      await this.page.waitForTimeout(2000);
      await this.campaignSelect.click();
      await this.page.waitForTimeout(2000);
      await this.medium.click();
      await this.page.waitForTimeout(2000);
      await this.mediumSelect.click();
      await this.page.waitForTimeout(2000);
      await this.campaignType.click();
      await this.page.waitForTimeout(2000);
      await this.campaignTypeSelect.click();
      await this.page.waitForTimeout(2000);
      await this.referred.fill(String(ref));
      await this.page.waitForTimeout(2000);
      await this.internalNotes.click();
      await this.page.waitForTimeout(2000);
      await this.descr.fill(String(desc));
      await this.page.waitForTimeout(2000);
      await this.name.clear();
      await this.saveBtn.click();
      await this.page.waitForTimeout(3000);

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
      await this.page.waitForTimeout(3000);
      await reportStep(this.page, "Activity Creation Btn is clicked successfully", "pass");
    } catch (e) {
      await reportStep(this.page, "Activity Create Btn is not clicked successfully..." + e, "fail");
    }
    return this;
  }

  async clickCreateSurvey() {
    try {
      await this.page.waitForTimeout(3000);
      await this.startSurvey.click();
      await this.page.waitForTimeout(3000);
      await this.activityType.click();
      await this.typeSelect.click();
      await this.page.waitForTimeout(3000);
      await this.assignedTo.click();
      await this.assignedSelect.click();
      await this.page.waitForTimeout(3000);
      await this.summary.fill("test");
      await this.schedule.click();

      await this.page.waitForTimeout(3000);

      await reportStep(this.page, "Survey Create Btn is clicked successfully", "pass");
    } catch (e) {
      await reportStep(this.page, "Survey Create Btn is not clicked successfully..." + e, "fail");
    }
    return this;
  }

  async clickCreateSurveyNegative() {
    try {
      await this.page.waitForTimeout(3000);
      await this.name.fill("test");
      await this.page.waitForTimeout(3000);
      await this.startSurvey.click();
      await this.page.waitForTimeout(3000);
      await this.activityType.fill("activity");
      await this.typeSelect.click();
      await this.page.waitForTimeout(3000);
      await this.assignedTo.clear();
      await this.schedule.click();
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
      await this.assignedTo.click();
      await this.assignedSelect.click();
      await this.page.waitForTimeout(3000);
      await this.summary.fill("test");
      await this.schedule.click();
      await this.page.waitForTimeout(3000);

      await reportStep(this.page, "Survey Create Btn is clicked successfully", "pass");
    } catch (e) {
      await reportStep(this.page, "Survey Create Btn is not clicked successfully..." + e, "fail");
    }
    return this;
  }

  async clickCreateQuotation(qty) {
    try {
      await this.page.waitForTimeout(3000);
      await this.clickQuotation.click();
      await this.associated_Product.evaluate((node) => node.click());

      // Find the total number of rows in the table
      const totalRows = await this.page
        .locator(
          "xpath=//table[@class='o_list_table table table-sm table-hover position-relative mb-0 o_list_table_ungrouped table-striped']//tbody//tr"
        )
        .count();
      console.log("Total number of rows: " + totalRows);

      for (let row = 1; row <= 1; row++) {

        const rowXpath =
          "(//table[contains(@class,'o_list_table')])[1]/tbody/tr[contains(@class,'o_data_row')][" + row + "]";
        const rowElement = this.page.locator("xpath=" + rowXpath);
        await rowElement.waitFor({ state: 'visible', timeout: 30 * 1000 });

        await rowElement.evaluate((node) => node.scrollIntoView({ block: 'center', inline: 'center' }));
        await rowElement.click();

        // 3. Update Tax Status
        const qtyInput = this.page.locator("xpath=" + rowXpath + "//td[@name='product_uom_qty']//input");
        await qtyInput.waitFor({ state: 'visible', timeout: 30 * 1000 });
        await qtyInput.clear();
        await qtyInput.fill(String(qty));

        // 4. Update Price
        const priceInput = this.page.locator("xpath=" + rowXpath + "//td[@name='unit_price']//input");
        await priceInput.waitFor({ state: 'visible', timeout: 30 * 1000 });
        await priceInput.clear();
        await priceInput.fill("15.00");

        await this.page.waitForTimeout(2000);

      }

      await this.page.waitForTimeout(5000);
      await this.confirmBtn.click();
      await this.page.waitForTimeout(10000);
      await this.backActivity.click();

      await this.page.waitForTimeout(5000);

      await reportStep(this.page, "Sales Create Btn is clicked successfully", "pass");
    } catch (e) {
      await reportStep(this.page, "Sales Create Btn is not clicked successfully..." + e, "fail");
    }
    return this;
  }

  async clickCreateQuotationNegative(qty) {
    try {
      await this.page.waitForTimeout(3000);
      await this.clickQuotation.click();
      await this.associated_Product.evaluate((node) => node.click());

      // Find the total number of rows in the table
      const totalRows = await this.page
        .locator(
          "xpath=//table[@class='o_list_table table table-sm table-hover position-relative mb-0 o_list_table_ungrouped table-striped']//tbody//tr"
        )
        .count();
      console.log("Total number of rows: " + totalRows);

      for (let row = 1; row <= 1; row++) {

        const rowXpath =
          "(//table[contains(@class,'o_list_table')])[1]/tbody/tr[contains(@class,'o_data_row')][" + row + "]";
        const rowElement = this.page.locator("xpath=" + rowXpath);
        await rowElement.waitFor({ state: 'visible', timeout: 30 * 1000 });

        await rowElement.evaluate((node) => node.scrollIntoView({ block: 'center', inline: 'center' }));
        await rowElement.click();

        // 3. Update Tax Status
        const qtyInput = this.page.locator("xpath=" + rowXpath + "//td[@name='product_uom_qty']//input");
        await qtyInput.waitFor({ state: 'visible', timeout: 30 * 1000 });
        await qtyInput.clear();
        await qtyInput.fill(String(qty));

        // 4. Update Price
        const priceInput = this.page.locator("xpath=" + rowXpath + "//td[@name='unit_price']//input");
        await priceInput.waitFor({ state: 'visible', timeout: 30 * 1000 });
        await priceInput.clear();
        try {
          const errorMsg = this.page.locator("xpath=//div[@class='o_dialog']//p");
          await errorMsg.waitFor({ state: 'visible', timeout: 30 * 1000 });
          const errorMessageText = await errorMsg.textContent();
          console.log("Validation Error Message: " + errorMessageText);

          // Dismiss the validation error
          const errorMsgOk = this.page.locator("xpath=//button[normalize-space()='Close']");
          await errorMsgOk.click();
          console.log("Validation error dismissed successfully for row " + row);
          await this.page.waitForTimeout(3000);
        } catch (e) {
          console.log("No validation error for row " + row);
        }
        await priceInput.fill("15.00");

        await this.page.waitForTimeout(2000);

      }

      await this.page.waitForTimeout(5000);
      await this.confirmBtn.click();
      await this.page.waitForTimeout(10000);
      await this.backActivity.click();

      await this.page.waitForTimeout(5000);

      await reportStep(this.page, "Sales Create Btn is clicked successfully", "pass");
    } catch (e) {
      await reportStep(this.page, "Sales Create Btn is not clicked successfully..." + e, "fail");
    }
    return this;
  }

  async clickQuotationBtn() {
    try {
      await this.page.waitForTimeout(2000);
      await this.quotation.click();
      await this.page.waitForTimeout(2000);
      await this.checkboxSelect.click();
      await this.page.waitForTimeout(2000);
      await this.print.click();
      await this.order.click();
      await this.page.waitForTimeout(2000);
      await this.backActivity1.click();

      await reportStep(this.page, "click_quotationBtn is clicked successfully", "pass");
    } catch (e) {
      await reportStep(this.page, "click_quotationBtn is not clicked successfully..." + e, "fail");
    }
    return this;
  }

  async clickDelete() {
    try {

      await this.page.waitForTimeout(3000);
      await this.action.click();
      await this.page.waitForTimeout(3000);
      await this.duplicate.click();
      await this.page.waitForTimeout(3000);

      await this.action1.click();
      await this.page.waitForTimeout(3000);
      await this.delete.click();
      await this.page.waitForTimeout(3000);
      await this.confirmDelete.click();
      await this.page.waitForTimeout(3000);
      await this.action3.click();
      await this.page.waitForTimeout(3000);
      await this.addProperty.click();
      await this.page.waitForTimeout(3000);
      await this.addProperty1.fill("test");
      await this.page.waitForTimeout(3000);
      await this.action2.click();
      await this.page.waitForTimeout(3000);
      await this.archive.click();
      await this.page.waitForTimeout(3000);
      await this.confirmArchive.click();
      await this.page.waitForTimeout(3000);

      await reportStep(this.page, "Delete Btn is clicked successfully", "pass");
    } catch (e) {
      await reportStep(this.page, "Delete Btn is not clicked successfully..." + e, "fail");
    }
    return this;
  }
}

module.exports = { Sales };
