const { expect } = require('../fixtures/base');
const { reportStep } = require('../utils/reportStep');
const { ensureLoggedIn } = require('../utils/loginHelper');

class MicroMarketCreationPage {
  constructor(page) {
    this.page = page;

    // Login Page
    this.userName = page.locator("xpath=//input[@id='login']");
    this.passWord = page.locator("xpath=//input[@id='password']");
    this.login = page.locator("xpath=//button[@type='submit']");

    // Menu
    this.menu = page.locator("xpath=//ul[@class='o_menu_apps']//i[@class='fa fa-bars']");

    this.microMarket = page.locator("xpath=//div[contains(text(),'Micromarket Services')]");

    this.location = page.locator("xpath=//a[normalize-space()='Locations']");

    this.createBtn = page.locator("xpath=//button[normalize-space()='New']");

    // Location Details
    this.locationName = page.locator("xpath=//input[@id='name_0']");

    this.locationStore = page.locator("xpath=//input[@id='store_no_0']");

    // select[@name='micro_market_type']
    this.type = page.locator("xpath=//select[@id='location_type_0']");

    this.microMarketType = page.locator("xpath=//select[@id='micro_market_type_0']");

    this.salesTax = page.locator("xpath=//i[@class='o_button_icon fa fa-fw fa-edit me-1']");

    this.taxUpdate = page.locator("xpath=//input[@id='tax_amount_0']");

    this.updateBtn = page.locator("xpath=//button[@name='process']");

    this.zip = page.locator("xpath=//input[@id='zip_0']");

    this.customerDetail = page.locator("xpath=//div[@name='partner_id']//input[@type='text']");

    this.customerSearchMore = page.locator("xpath=//a[@id='partner_id_0_0_8']");

    this.customerSearchMoreBox = page.locator("xpath=//input[@placeholder='Search...']");

    this.customerAdderss = page.locator(
      "xpath=//table[@class='o_list_table table table-sm table-hover position-relative mb-0 o_list_table_ungrouped table-striped']//tbody//tr[1]"
    );

    this.street = page.locator("xpath=//input[@id='street_0']");

    this.street1 = page.locator("xpath=//input[@id='street2_0']");

    /*
     * @CacheLookup
     *
     * @FindBy(xpath = "//input[@name='city']") WebElement city;
     *
     * // State send key plus enter
     *
     * @CacheLookup
     *
     * @FindBy(xpath = "(//div[@class='o_input_dropdown']//child::input)[1]")
     * WebElement state;
     */

    // Products Selection
    this.product = page.locator("xpath=//a[@name='micro_market_products']");

    this.productBox = page.locator("xpath=(//div[@name='single_product_ids']//input[@type='text'])[1]");

    this.productSelect = page.locator("xpath=//a[@id='single_product_ids_1_0_0']");

    /*
     * @CacheLookup
     *
     * @FindBy(xpath =
     * "//li[@class='o_m2o_dropdown_option ui-menu-item']//a[contains(text(),'Search More...')]"
     * ) WebElement searchMore;
     */

    /*
     * @CacheLookup
     *
     * @FindBy(xpath =
     * "//div[@class='o_searchview_input_container']//input[@role='searchbox']")
     * WebElement searchBox;
     */

    /*
     * // Add product
     * @CacheLookup
     * @FindBy(xpath = "//td[contains(text(),'7up')]") WebElement sevenUp;
     */

    this.addproducts = page.locator("xpath=//button[normalize-space()='Add']");

    // NOTE: Java field was named `generalInfo`, colliding with the `generalInfo()`
    // method below (legal in Java's separate field/method namespaces, but in JS
    // this.generalInfo would shadow the prototype method). Renamed to generalInfoTab.
    this.generalInfoTab = page.locator("xpath=//a[normalize-space()='General Information']");

    this.div = page.locator("xpath=(//div[@class='o_input_dropdown']//input[@type='text'])[4]");

    this.divSelect = page.locator("xpath=//a[@id='division_id_0_0_0']");

    this.operator = page.locator("xpath=//div[@name='operator_own']//input[@type='checkbox']");

    this.storage = page.locator("xpath=//div[@name='has_storage']//input[@type='checkbox']");

    this.addlTax = page.locator("xpath=//div[@name='addl_tax']//input[@type='checkbox']");

    this.branchId = page.locator("xpath=//input[@id='branch_0']");

    this.handledExternaly = page.locator("xpath=//div[@name='handled_externally']//input[@type='checkbox']");

    this.ownsCategory = page.locator("xpath=//div[@name='customer_own_category']//input[@type='checkbox']");

    this.beerAndWine = page.locator("xpath=//div[@name='customer_own_alcohol']//input[@type='checkbox']");

    this.route = page.locator("xpath=(//div[@class='o_input_dropdown']//input[@type='text'])[5]");

    this.routeSelect = page.locator("xpath=//a[@id='route_0_0_0']");

    this.freq = page.locator("xpath=(//div[@class='o_input_dropdown']//input[@type='text'])[6]");

    this.freqSelect = page.locator("xpath=//a[@id='frequency_0_0_0']");

    this.freq_Start = page.locator("xpath=//input[@id='frequency_start_date_0']");

    this.contactName = page.locator("xpath=//input[@id='contact_person_0']");

    this.contactMail = page.locator("xpath=//input[@id='email_0']");

    this.partsWare = page.locator("xpath=//div[@name='is_parts_warehouse']//input[@type='checkbox']");

    this.provMarketId = page.locator("xpath=//input[@id='vms_id_0']");

    this.taxRate1 = page.locator("xpath=//input[@id='tax_rate_1_0']");

    this.taxRate2 = page.locator("xpath=//input[@id='tax_rate_2_0']");

    this.taxRate3 = page.locator("xpath=//input[@id='tax_rate_3_0']");

    // NewOperators positive and Negative scenario need enable this
    this.newLocationName = page.locator("xpath=//div[@class='oe_title']//span[@name='name']");

    // negative scenario

    // negative scenario
    this.acceptOK = page.locator("xpath=//button[@type='button']//span[contains(text(),'Ok')]");

    this.clickOk = page.locator("xpath=(//span[contains(text(),'Ok')])");

    this.notes = page.locator("xpath=//a[normalize-space()='Notes']");

    this.internalNotes = page.locator("xpath=//textarea[@id='internal_notes_0']");

    this.specialNotes = page.locator("xpath=//textarea[@id='special_notes_1']");

    this.others = page.locator("xpath=//a[normalize-space()='Others']");

    this.showPriceList = page.locator("xpath=//div[@name='show_price_list']//input[@type='checkbox']");

    this.stockAnalysis = page.locator("xpath=//button[@name='action_view_current_stock']");

    this.cancel = page.locator("xpath=//span[normalize-space()='Cancel']");

    // NOTE: Java field was named `receiveOrder`, colliding with the `receiveOrder()`
    // method below (legal in Java's separate field/method namespaces, but in JS
    // this.receiveOrder would shadow the prototype method). Renamed to receiveOrderBtn.
    this.receiveOrderBtn = page.locator("xpath=//span[normalize-space()='Receive Order Photos']");

    this.selectAll = page.locator("xpath=//div[@class='o-checkbox form-check d-flex m-0']//input[@type='checkbox']");

    this.action = page.locator("xpath=//button[normalize-space()='Action']");

    this.export = page.locator("xpath=//span[@role='menuitem']");

    this.backBtn = page.locator("xpath=//li[@class='breadcrumb-item d-inline-flex min-w-0 o_back_button']");

    this.discontinuedProducts = page.locator(
      "xpath=//button[@name='action_view_discontinue_products']//span[contains(text(),'Discontinued Products')]"
    );

    this.selectAll1 = page.locator(
      "xpath=//div[@class='o-checkbox form-check d-flex m-0']//input[@type='checkbox']"
    );

    this.action1 = page.locator("xpath=//span[normalize-space()='Actions']");

    this.delete = page.locator("xpath=//span[normalize-space()='Delete']");

    this.confirmDelete = page.locator("xpath=//button[normalize-space()='Delete']");

    this.backBtn1 = page.locator("xpath=//li[@class='breadcrumb-item d-inline-flex min-w-0 o_back_button']");

    this.activeMarket = page.locator("xpath=//b[normalize-space()='Active Market']");

    this.reason = page.locator("xpath=//input[@id='reason_for_close_0']");

    this.transfer = page.locator("xpath=//input[@id='warehouse_id_0']");

    this.transferSelect = page.locator("xpath=//a[@id='warehouse_id_0_0_0']");

    this.confirm = page.locator("xpath=//button[@name='action_close_market']");

    this.saveBtn = page.locator("xpath=//button[normalize-space()='Save']");

    this.okBtn = page.locator("xpath=(//button[normalize-space()='Ok'])[2]");
  }

  async isErrorDisplayed() {
    return this.page
      .locator("xpath=//div[@class='me-auto o_notification_content']")
      .isVisible()
      .catch(() => false);
  }

  async loginIfNeeded(user, pass) {
    await ensureLoggedIn({ userName: this.userName, passWord: this.passWord, logIn: this.login }, user, pass);
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
      await this.login.click();
      await this.page.waitForTimeout(5000);

      await reportStep(this.page, "login button clicked successfully", "pass");
    } catch (e) {
      await reportStep(this.page, "login button clicked not successfully..." + e, "fail");
    }
    return this;
  }

  async clickMeansButton() {
    try {
      // await this.page.waitForTimeout(3000);

      await this.menu.click({ timeout: 50 * 1000 });

      await reportStep(this.page, "Menu button is entered successfully", "pass");
    } catch (e) {
      await reportStep(this.page, "Menu button is not entered successfully..." + e, "fail");
    }

    return this;
  }

  async clickMicromarketMenuButton() {
    try {
      await this.page.waitForTimeout(3000);

      await this.microMarket.click({ timeout: 30 * 1000 });
      await this.page.waitForTimeout(5000);
      // await this.inventory.click();

      // await this.location.click();

      await this.location.click({ timeout: 30 * 1000 });
      await this.page.waitForTimeout(5000);

      await this.createBtn.click();
      await this.page.waitForTimeout(5000);

      await reportStep(this.page, "MicromarketMenu Button is entered successfully", "pass");
    } catch (e) {
      await reportStep(this.page, "MicromarketMenu Button is not entered successfully..." + e, "fail");
    }

    return this;
  }

  async createLocationDetails(locationname, locationstore, customerName, zipAdd, strt, tax) {
    try {
      // await this.page.waitForTimeout(5000);

      await this.locationName.fill(String(locationname));
      await this.page.waitForTimeout(5000);

      await this.locationStore.fill(String(locationstore));
      await this.page.waitForTimeout(1000);

      await this.type.selectOption({ index: 1 });
      await this.page.waitForTimeout(1000);

      await this.microMarketType.selectOption({ index: 1 });
      await this.page.waitForTimeout(1000);

      await this.zip.fill(String(zipAdd));
      await this.page.waitForTimeout(5000);

      await this.street.fill(String(strt));
      await this.page.waitForTimeout(5000);

      await this.customerDetail.click();
      await this.page.waitForTimeout(5000);

      await this.customerSearchMore.click();
      await this.page.waitForTimeout(5000);

      await this.customerSearchMoreBox.fill(String(customerName));
      await this.customerSearchMoreBox.press('Enter');
      await this.page.waitForTimeout(5000);

      await this.customerAdderss.click();
      await this.page.waitForTimeout(5000);

      /* await this.salesTax.click();
      await this.page.waitForTimeout(10000);
      await this.taxUpdate.fill(String(tax));
      await this.page.waitForTimeout(3000);
      await this.updateBtn.click();
      await this.page.waitForTimeout(5000);



       * await this.page.waitForTimeout(1000);
       *
       * await this.city.fill(String(cty));
       *
       * await this.page.waitForTimeout(1000);
       *
       * await this.state.click();
       *
       * await this.state.clear();
       *
       * await this.state.fill(String(stateAdd));
       * await this.state.press('Enter');
       */

      await reportStep(this.page, "Location Details is enters successfully", "pass");
    } catch (e) {
      await reportStep(this.page, "Location Details is not enters successfully..." + e, "fail");
    }
    return this;
  }

  async createLocationDetailsNegative(locationname, locationstore, customerName, zipAdd, strt, tax) {
    try {
      // await this.page.waitForTimeout(5000);

      await this.locationName.fill(String(locationname));
      await this.page.waitForTimeout(5000);

      await this.locationStore.fill(String(locationstore));
      await this.page.waitForTimeout(1000);

      await this.type.selectOption({ index: 1 });
      await this.page.waitForTimeout(1000);

      await this.microMarketType.selectOption({ index: 1 });
      await this.page.waitForTimeout(1000);

      await this.zip.fill(String(zipAdd));
      await this.page.waitForTimeout(5000);

      await this.street.fill(String(strt));
      await this.page.waitForTimeout(5000);

      await this.street1.click();
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
      await this.customerDetail.click();
      await this.page.waitForTimeout(5000);
      await this.customerSearchMore.click();
      await this.page.waitForTimeout(5000);

      await this.customerSearchMoreBox.fill(String(customerName));
      await this.customerSearchMoreBox.press('Enter');
      await this.page.waitForTimeout(5000);

      await this.customerAdderss.click();
      await this.page.waitForTimeout(5000);

      await reportStep(this.page, "Location Details is enters successfully", "pass");
    } catch (e) {
      await reportStep(this.page, "Location Details is not enters successfully..." + e, "fail");
    }
    return this;
  }

  async clickProductSelection(productName) {
    try {
      await this.page.waitForTimeout(3000);
      // await this.products.click();

      await this.product.click({ timeout: 30 * 1000 });

      await this.page.waitForTimeout(5000);

      await this.productBox.click();
      await this.page.waitForTimeout(5000);

      await this.productBox.fill(String(productName));
      await this.productBox.press('Enter');
      await this.page.waitForTimeout(5000);

      // await this.productSelect.click();
      await this.page.waitForTimeout(5000);

      // await this.searchMore.click();

      // await this.page.waitForTimeout(1000);

      // await this.searchBox.click();

      /*
       * Actions a = new Actions(driver);
       *
       * a.sendKeys("7up", Keys.ENTER).build().perform();
       */
      await reportStep(this.page, "Product Selection is Selected successfully", "pass");
    } catch (e) {
      await reportStep(this.page, "Product Selection is not Selected successfully..." + e, "fail");
    }
    return this;
  }

  async cilckAddProduct() {
    try {
      await this.page.waitForTimeout(3000);
      // await this.sevenUp.click();
      // await this.page.waitForTimeout(1000);

      await this.addproducts.click();
      await this.page.waitForTimeout(5000);

      // negative scenario
      // await this.acceptOK.click();
      // await this.page.waitForTimeout(10000);

      // negative scenario - save comment
      // await this.saveBtn.click();
      // await this.page.waitForTimeout(50000);

      await reportStep(this.page, "Add Product is entered successfully", "pass");
    } catch (e) {
      await reportStep(this.page, "Add Product is not entered successfully..." + e, "fail");
    }

    console.log('Test completed successfully');

    return this;
  }

  async clickQuantity(cost, min, max) {
    try {
      const totalRows = await this.page
        .locator(
          "xpath=//table[@class='o_list_table table table-sm table-hover position-relative mb-0 o_list_table_ungrouped table-striped']//tbody//tr"
        )
        .count();

      console.log('Total number of rows:', totalRows);

      // Iterate through the first 2 rows
      for (let row = 1; row <= Math.min(1, totalRows); row++) {
        // Click on the 3rd column of the current row
        const productName = this.page.locator(
          "xpath=//table[@class='o_list_table table table-sm table-hover position-relative mb-0 o_list_table_ungrouped table-striped']//tbody//tr[1]//td[3]"
        );
        await productName.click({ timeout: 30 * 1000 });

        // Clear the input in the 4th column of the current row
        const sellingPrice = this.page.locator(
          "xpath=//table[@class='o_list_table table table-sm table-hover position-relative mb-0 o_list_table_ungrouped table-striped']//tbody//tr[1]//td[7]//input"
        );
        await sellingPrice.clear({ timeout: 30 * 1000 });
        await sellingPrice.fill(String(cost));
        await this.page.waitForTimeout(2000);

        /* const fAndBTaX = this.page.locator(
          "xpath=//table[@class='o_list_table table table-sm table-hover position-relative mb-0 o_list_table_ungrouped table-striped']//tbody//tr[1]//td[7]//select"
        );
        await fAndBTaX.selectOption({ label: 'Yes' });
        await this.page.waitForTimeout(2000);

        const healthTaX = this.page.locator(
          "xpath=//table[@class='o_list_table table table-sm table-hover position-relative mb-0 o_list_table_ungrouped table-striped']//tbody//tr[1]//td[8]//select"
        );
        await healthTaX.selectOption({ label: 'Yes' });
        await this.page.waitForTimeout(2000);

        const sAndLTaX = this.page.locator(
          "xpath=//table[@class='o_list_table table table-sm table-hover position-relative mb-0 o_list_table_ungrouped table-striped']//tbody//tr[1]//td[9]//select"
        );
        await sAndLTaX.selectOption({ label: 'Yes' });
        await this.page.waitForTimeout(2000); */

        const subsidy = this.page.locator(
          "xpath=//table[@class='o_list_table table table-sm table-hover position-relative mb-0 o_list_table_ungrouped table-striped']//tbody//tr[1]//td[9]//input"
        );
        await subsidy.clear({ timeout: 30 * 1000 });
        await subsidy.fill(String(cost));
        await this.page.waitForTimeout(2000);

        const minQty = this.page.locator(
          "xpath=//table[@class='o_list_table table table-sm table-hover position-relative mb-0 o_list_table_ungrouped table-striped']//tbody//tr[1]//td[11]//input"
        );
        await minQty.clear({ timeout: 30 * 1000 });
        await minQty.fill(String(min));

        await this.page.waitForTimeout(2000);

        const maxQty = this.page.locator(
          "xpath=//table[@class='o_list_table table table-sm table-hover position-relative mb-0 o_list_table_ungrouped table-striped']//tbody//tr[1]//td[13]//input"
        );
        await maxQty.clear({ timeout: 30 * 1000 });
        await maxQty.fill(String(max));
        await this.page.waitForTimeout(2000);
      }
      await reportStep(this.page, "Quantity button is clicked successfully", "pass");
    } catch (e) {
      await reportStep(this.page, "Quantity button is not clicked successfully " + e.message, "fail");
    }
    return this;
  }

  async clickQuantityNegative(cost, min, max) {
    try {
      const totalRows = await this.page
        .locator(
          "xpath=//table[@class='o_list_table table table-sm table-hover position-relative mb-0 o_list_table_ungrouped table-striped']//tbody//tr"
        )
        .count();

      console.log('Total number of rows:', totalRows);

      // Iterate through the first 2 rows
      for (let row = 1; row <= Math.min(1, totalRows); row++) {
        // Click on the 3rd column of the current row
        const productName = this.page.locator(
          "xpath=//table[@class='o_list_table table table-sm table-hover position-relative mb-0 o_list_table_ungrouped table-striped']//tbody//tr[1]//td[3]"
        );
        await productName.click({ timeout: 30 * 1000 });

        // Clear the input in the 4th column of the current row
        const sellingPrice = this.page.locator(
          "xpath=//table[@class='o_list_table table table-sm table-hover position-relative mb-0 o_list_table_ungrouped table-striped']//tbody//tr[1]//td[10]//input"
        );
        await sellingPrice.clear({ timeout: 30 * 1000 });
        await sellingPrice.fill(String(cost));
        await sellingPrice.press('Enter');
        await this.page.waitForTimeout(2000);
        try {
          const errorMsg = this.page.locator("xpath=//div[@class='o_dialog']//p");
          await errorMsg.waitFor({ state: 'visible', timeout: 30000 });
          const errorMessageText = await errorMsg.textContent();
          console.log('Validation Error Message:', errorMessageText);

          // Dismiss the validation error
          await this.page.locator("xpath=//button[normalize-space()='Close']").click();
          console.log('Validation error dismissed successfully for row ');
          await this.page.waitForTimeout(3000);
        } catch (e) {
          console.log('No validation error for row ');
        }

        const fAndBTaX = this.page.locator(
          "xpath=//table[@class='o_list_table table table-sm table-hover position-relative mb-0 o_list_table_ungrouped table-striped']//tbody//tr[1]//td[7]//select"
        );
        await fAndBTaX.selectOption({ label: 'Yes' });
        await this.page.waitForTimeout(2000);

        const healthTaX = this.page.locator(
          "xpath=//table[@class='o_list_table table table-sm table-hover position-relative mb-0 o_list_table_ungrouped table-striped']//tbody//tr[1]//td[8]//select"
        );
        await healthTaX.selectOption({ label: 'Yes' });
        await this.page.waitForTimeout(2000);

        const sAndLTaX = this.page.locator(
          "xpath=//table[@class='o_list_table table table-sm table-hover position-relative mb-0 o_list_table_ungrouped table-striped']//tbody//tr[1]//td[9]//select"
        );
        await sAndLTaX.selectOption({ label: 'Yes' });
        await this.page.waitForTimeout(2000);

        const subsidy = this.page.locator(
          "xpath=//table[@class='o_list_table table table-sm table-hover position-relative mb-0 o_list_table_ungrouped table-striped']//tbody//tr[1]//td[12]//input"
        );
        await subsidy.clear({ timeout: 30 * 1000 });
        await subsidy.fill(String(cost));
        await subsidy.press('Enter');
        await this.page.waitForTimeout(2000);
        try {
          const errorMsg = this.page.locator("xpath=//div[@class='o_dialog']//p");
          await errorMsg.waitFor({ state: 'visible', timeout: 30000 });
          const errorMessageText = await errorMsg.textContent();
          console.log('Validation Error Message:', errorMessageText);

          // Dismiss the validation error
          await this.page.locator("xpath=//button[normalize-space()='Stay here']").click();
          console.log('Validation error dismissed successfully for row ');
          await this.page.waitForTimeout(3000);
        } catch (e) {
          console.log('No validation error for row ');
        }

        const minQty = this.page.locator(
          "xpath=//table[@class='o_list_table table table-sm table-hover position-relative mb-0 o_list_table_ungrouped table-striped']//tbody//tr[1]//td[14]//input"
        );
        await minQty.clear({ timeout: 30 * 1000 });
        await minQty.fill(String(min));
        await minQty.press('Enter');
        await this.page.waitForTimeout(2000);
        try {
          const errorMsg = this.page.locator("xpath=//div[@class='o_dialog']//p");
          await errorMsg.waitFor({ state: 'visible', timeout: 30000 });
          const errorMessageText = await errorMsg.textContent();
          console.log('Validation Error Message:', errorMessageText);

          // Dismiss the validation error
          await this.page.locator("xpath=//button[normalize-space()='Close']").click();
          console.log('Validation error dismissed successfully for row ');
          await this.page.waitForTimeout(3000);
        } catch (e) {
          console.log('No validation error for row ');
        }

        const maxQty = this.page.locator(
          "xpath=//table[@class='o_list_table table table-sm table-hover position-relative mb-0 o_list_table_ungrouped table-striped']//tbody//tr[1]//td[16]//input"
        );
        await maxQty.clear({ timeout: 30 * 1000 });
        await maxQty.fill(String(max));
        await maxQty.press('Enter');
        await this.page.waitForTimeout(2000);
        try {
          const errorMsg = this.page.locator("xpath=//div[@class='o_dialog']//p");
          await errorMsg.waitFor({ state: 'visible', timeout: 30000 });
          const errorMessageText = await errorMsg.textContent();
          console.log('Validation Error Message:', errorMessageText);

          // Dismiss the validation error
          await this.page.locator("xpath=//button[normalize-space()='Close']").click();
          console.log('Validation error dismissed successfully for row ');
          await this.page.waitForTimeout(3000);
        } catch (e) {
          console.log('No validation error for row ');
        }
      }
      await reportStep(this.page, "Quantity button is clicked successfully", "pass");
    } catch (e) {
      await reportStep(this.page, "Quantity button is not clicked successfully " + e.message, "fail");
    }
    return this;
  }

  async generalInfo(id, date, name, mail) {
    try {
      await this.page.waitForTimeout(3000);
      await this.generalInfoTab.click();
      await this.page.waitForTimeout(2000);
      await this.div.click();
      await this.page.waitForTimeout(2000);
      // await this.divSelect.click();
      await this.divSelect.evaluate((node) => node.click());
      await this.page.waitForTimeout(2000);
      await this.operator.evaluate((node) => node.click());
      await this.page.waitForTimeout(2000);
      await this.storage.evaluate((node) => node.click());
      await this.page.waitForTimeout(2000);
      await this.addlTax.evaluate((node) => node.click());
      await this.page.waitForTimeout(2000);
      await this.branchId.clear();
      await this.branchId.fill(String(id));
      await this.taxRate1.clear();
      await this.taxRate1.fill("2.00");
      /* await this.taxRate2.clear();
      await this.taxRate2.fill("3.00");
      await this.taxRate3.clear();
      await this.taxRate3.fill("4.00"); */
      await this.page.waitForTimeout(2000);
      await this.handledExternaly.evaluate((node) => node.click());
      await this.page.waitForTimeout(2000);
      await this.ownsCategory.evaluate((node) => node.click());
      await this.page.waitForTimeout(2000);
      await this.beerAndWine.evaluate((node) => node.click());
      await this.page.waitForTimeout(2000);

      await this.route.click();
      await this.page.waitForTimeout(2000);
      await this.routeSelect.click();
      await this.page.waitForTimeout(2000);
      await this.freq.click();
      await this.page.waitForTimeout(2000);
      // await this.freqSelect.click();
      await this.freqSelect.evaluate((node) => node.click());
      await this.page.waitForTimeout(2000);
      await this.freq_Start.fill(String(date));
      await this.page.waitForTimeout(2000);
      await this.contactName.fill(String(name));
      await this.page.waitForTimeout(2000);
      await this.contactMail.fill(String(mail));
      await this.page.waitForTimeout(4000);
      await this.partsWare.evaluate((node) => node.click());
      await this.page.waitForTimeout(2000);
      await this.provMarketId.fill(String(id));
      await this.page.waitForTimeout(2000);

      await reportStep(this.page, "General Info clicked  successfully", "pass");
    } catch (e) {
      await reportStep(this.page, "General Info clicked not entered successfully..." + e, "fail");
    }

    console.log('Test completed successfully');

    return this;
  }

  async otherDetails() {
    try {
      await this.page.waitForTimeout(2000);
      await this.notes.click();
      await this.page.waitForTimeout(2000);
      await this.internalNotes.fill("test");
      await this.specialNotes.fill("testnotes");
      await this.page.waitForTimeout(2000);
      await this.others.click();
      await this.page.waitForTimeout(2000);
      await this.showPriceList.evaluate((node) => node.click());
      await this.page.waitForTimeout(2000);

      await reportStep(this.page, "Other Details clicked  successfully", "pass");
    } catch (e) {
      await reportStep(this.page, "Other Details clicked not entered successfully..." + e, "fail");
    }

    console.log('Test completed successfully');

    return this;
  }

  async saveDetails() {
    try {
      await this.page.waitForTimeout(2000);
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

      try {
        const errorMsg = this.page.locator("xpath=//div[@class='o_dialog']//p");
        await errorMsg.waitFor({ state: 'visible', timeout: 30000 });
        const errorMessageText = await errorMsg.textContent();
        console.log('Validation Error Message:', errorMessageText);

        // Dismiss the validation error
        await this.page.locator("xpath=//button[normalize-space()='Stay here']").click();
        console.log('Validation error dismissed successfully for row ');
        await this.page.waitForTimeout(3000);
      } catch (e) {
        console.log('No validation error for row ');
      }

      await reportStep(this.page, "Save Details clicked  successfully", "pass");
    } catch (e) {
      await reportStep(this.page, "Save Details clicked not entered successfully..." + e, "fail");
    }

    console.log('Test completed successfully');

    return this;
  }

  async receiveOrder() {
    try {
      await this.page.waitForTimeout(2000);
      await this.stockAnalysis.click();
      await this.page.waitForTimeout(2000);
      await this.cancel.click();
      await this.page.waitForTimeout(2000);
      /* await this.receiveOrderBtn.click();
      await this.page.waitForTimeout(2000);
      await this.selectAll.click();
      await this.page.waitForTimeout(2000);
      await this.action.click();
      await this.export.click();
      await this.page.waitForTimeout(2000);
      await this.backBtn.click(); */
      await this.page.waitForTimeout(2000);
      await this.discontinuedProducts.click();
      await this.page.waitForTimeout(2000);
      await this.selectAll1.click();
      await this.page.waitForTimeout(2000);
      await this.action1.click();
      await this.delete.click();
      await this.confirmDelete.click();
      await this.page.waitForTimeout(2000);
      await this.backBtn1.click();
      await this.page.waitForTimeout(2000);
      await this.activeMarket.click();
      await this.page.waitForTimeout(2000);
      await this.reason.fill("test");
      await this.page.waitForTimeout(2000);
      await this.transfer.click();
      await this.transferSelect.click();
      await this.page.waitForTimeout(2000);
      await this.confirm.click();
      await this.page.waitForTimeout(5000);
      await this.okBtn.click();
      await this.page.waitForTimeout(5000);

      await reportStep(this.page, "smart buttons clicked  successfully", "pass");
    } catch (e) {
      await reportStep(this.page, "smart buttons clicked not entered successfully..." + e, "fail");
    }

    console.log('Test completed successfully');

    return this;
  }
}

module.exports = { MicroMarketCreationPage };
