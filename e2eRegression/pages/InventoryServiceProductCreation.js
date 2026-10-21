const { expect } = require('../fixtures/base');
const { reportStep } = require('../utils/reportStep');
const { ensureLoggedIn } = require('../utils/loginHelper');

class InventoryServiceProductCreation {
  constructor(page) {
    this.page = page;

    // Login Page
    this.userName = page.locator("xpath=//input[@name='login']");

    this.passWord = page.locator("xpath=//input[@name='password']");

    this.logIn = page.locator("xpath=//button[contains(text(),'Log in')]");

    // Means
    this.menu = page.locator("xpath=//ul[@class='o_menu_apps']//i[@class='fa fa-bars']");

    this.inventory = page.locator("xpath=//div[contains(text(),'Inventory')]");

    this.createBtn = page.locator("xpath=//button[normalize-space()='New']");

    // product name
    this.productName = page.locator("xpath=//textarea[@id='name_0']");

    this.proType = page.locator("xpath=//select[@id='product_type_0']");

    this.productCode = page.locator("xpath=//div[@name='default_code']//input[@type='text']");

    this.productCategory = page.locator("xpath=(//div[@name='categ_id']//div[@class='o_input_dropdown'])[1]");

    this.categorySelect = page.locator("xpath=//a[@id='categ_id_0_0_0']");

    this.UPC = page.locator("xpath=//a[normalize-space()='UPCs']");

    this.upcaddaLine = page.locator("xpath=(//a[contains(text(),'Add a line')])[1]");

    this.upcCode = page.locator("xpath=//div[@name='upc_code_id']//input[@type='text']");

    this.skuNumber = page.locator("xpath=//input[@id='sku_number_0']");

    this.packageId = page.locator("xpath=//input[@id='package_id_0']");

    this.unitOfMeasureClick = page.locator("xpath=//div[@name='uom_id']//input[@type='text']");

    this.unitOfMeasureSearchMore = page.locator("xpath=//a[@id='uom_id_0_0_8']");

    this.unitOfMeasureCreateBtn = page.locator("xpath=(//button[contains(text(),'New')])[2]");

    this.unitOfMeasureName = page.locator("xpath=//input[@id='name_0']");

    this.unitOfMeasureCategory = page.locator("xpath=//input[@id='category_id_0']");

    this.unitOfMeasureCatSelect = page.locator("xpath=//a[@id='category_id_0_0_0']");

    this.unitOfMeasureSaveBtn = page.locator("xpath=//button[normalize-space()='Save & Close']");

    this.category_idClick = page.locator("xpath=//div[@name='category_id']//input[@type='text']");

    this.category_idSearchMore = page.locator(
      "xpath=(//li[@class='o_m2o_dropdown_option ui-menu-item']//a[contains(text(),'Search More...')])[2]"
    );

    this.addaLine = page.locator("xpath=(//a[contains(text(),'Add a line')])[1]");

    this.textUPC = page.locator("xpath=//input[@name='upc_code_id']");

    this.listPrice1 = page.locator("xpath=//div[@name='list_price_1']//input[@type='text']");

    this.listPrice2 = page.locator("xpath=//div[@name='list_price_2']//input[@type='text']");

    this.listPrice3 = page.locator("xpath=//div[@name='list_price_3']//input[@type='text']");

    this.saleAcc = page.locator("xpath=(//div[@class='o_input_dropdown']//input[@type='text'])[4]");

    this.accSelect = page.locator("xpath=//a[@id='sale_acc_0_0_0']");

    this.saleDesc = page.locator("xpath=//div[@name='description_sale']//textarea[@id='description_sale_0']");

    this.prefVendor = page.locator("xpath=(//div[@class='o_input_dropdown']//input[@type='text'])[5]");

    this.vendorSelect = page.locator("xpath=//a[@id='res_partner_0_0_0']");

    this.cogsAcc = page.locator("xpath=(//div[@class='o_input_dropdown']//input[@type='text'])[6]");

    this.accSelect1 = page.locator("xpath=//a[@id='cogs_acc_0_0_0']");

    this.purDesc = page.locator("xpath=//textarea[@id='description_purchase_0']");

    this.updateCostBtn = page.locator("xpath=(//span[contains(text(),'Update Cost')])[2]");

    this.updateCost = page.locator("xpath=//td//input[@name='new_price']");

    this.updateCostApply = page.locator("xpath=//button[@name='change_price']//span[contains(text(),'Apply')]");

    this.multipleUOMCheckBox = page.locator("xpath=//a[normalize-space()='UoM Specifications']");

    this.boxADDALine = page.locator("xpath=//tr[1]//td//a[contains(text(),'Add a line')]");

    this.uOM_BoxName = page.locator("xpath=//div[@name='type']//input[@type='text']");

    this.uOM_BoxNameSelect = page.locator("xpath=//a[@id='autocomplete_0_0']");

    this.uOM_BoxQuantity = page.locator("xpath=//div[@name='quantity']//input[@type='text']");

    this.uOM_BoxSalesPrice1 = page.locator("xpath=//div[@name='sale_price_1']//input[@type='text']");

    this.uOM_BoxSalesPrice2 = page.locator("xpath=//div[@name='sale_price_2']//input[@type='text']");

    this.uOM_BoxSalesPrice3 = page.locator("xpath=//div[@name='sale_price_3']//input[@type='text']");

    this.caseADDALine = page.locator("xpath=//a[normalize-space()='Add a line']");

    this.uOM_CaseName = page.locator("xpath=//div[@name='type']//input[@type='text']");

    this.uOM_CaseNameSelect = page.locator("xpath=//a[@id='autocomplete_0_1']");

    this.uOM_CaseQuantity = page.locator("xpath=//div[@name='quantity']//input[@type='text']");

    this.uOM_CaseSalesPrice1 = page.locator("xpath=//div[@name='sale_price_1']//input[@type='text']");

    this.uOM_CaseSalesPrice2 = page.locator("xpath=//div[@name='sale_price_2']//input[@type='text']");

    this.uOM_CaseSalesPrice3 = page.locator("xpath=//div[@name='sale_price_3']//input[@type='text']");

    // Create Logistics

    this.logistics = page.locator("xpath=//a[normalize-space()='Logistics']");

    this.volume1 = page.locator("xpath=//input[@id='volume_0']");

    this.manufacturer = page.locator("xpath=//textarea[@id='manufacturer_0']");

    this.weight1 = page.locator("xpath=//input[@id='weight_0']");

    this.mPN = page.locator("xpath=//input[@id='mnp_id_0']");

    this.warehouseInv = page.locator("xpath=//a[normalize-space()='Warehouse Inventory']");

    this.invAcc = page.locator("xpath=(//div[@class='o_input_dropdown']//input[@type='text'])[4]");

    this.invSelect = page.locator("xpath=//a[@id='inventory_acc_0_0_0']");

    this.legacy = page.locator("xpath=//input[@id='legacy_0']");

    this.warehouseMin = page.locator("xpath=//input[@id='min_qty_0']");

    this.warehouseMax = page.locator("xpath=//input[@id='max_qty_0']");

    this.micromarketDefault = page.locator("xpath=//a[normalize-space()='Micromarket Defaults']");

    this.microMarketMin = page.locator("xpath=//input[@id='reorder_point_0']");

    this.microMarketMax = page.locator("xpath=//input[@id='reorder_qty_0']");

    this.tax = page.locator("xpath=//a[normalize-space()='TAX']");

    // div[@name='is_sugar_tax']//input[@type='checkbox']
    this.sugarTax = page.locator("xpath=//div[@name='is_sugar_tax']//input[@type='checkbox']");

    // input[@name='fluid_ounce']
    this.fluid = page.locator("xpath=//div[@name='fluid_ounce']//input[@type='text']");

    this.litreType = page.locator("xpath=//select[@id='litre_type_0']");

    this.containerTax = page.locator("xpath=//div[@name='is_container_tax']//input[@type='checkbox']");

    this.conAmount = page.locator("xpath=//input[@id='container_deposit_amount_0']");

    this.providerId = page.locator("xpath=//input[@name='vms_id']");

    this.saveBtn = page.locator("xpath=//button[contains(text(),'Save')]");

    // NewOperators positive and Negative scenario need enable this
    this.newProductName = page.locator("xpath=//div[@class='oe_title']//span[@name='name']");

    this.actionBtn = page.locator("xpath=//button[normalize-space()='Action']");

    this.pricelistReport = page.locator("xpath=//span[normalize-space()='Pricelist Report']");

    this.actionBtn1 = page.locator("xpath=//button[normalize-space()='Action']");

    this.updateProductPrice = page.locator("xpath=//span[normalize-space()='Update Product Price']");

    this.addProduct = page.locator("xpath=//button[normalize-space()='Add Products']");

    this.productSelect = page.locator(
      "xpath=(//table[@class='o_list_table table table-sm table-hover position-relative mb-0 o_list_table_ungrouped table-striped'])//tbody//tr[2]//td[2]"
    );

    this.pricelist = page.locator("xpath=//select[@id='pricelists']");

    this.pdf = page.locator("xpath=//select[@id='formats']");

    this.print = page.locator("xpath=//button[normalize-space()='Print']");

    this.back = page.locator("xpath=//li[@class='breadcrumb-item d-inline-flex min-w-0 o_back_button']");

    this.back1 = page.locator("xpath=//li[@class='breadcrumb-item d-inline-flex min-w-0 o_back_button']");

    this.location = page.locator("xpath=//div[@name='micro_market_ids']//input[@type='text']");

    this.locationSelect = page.locator("xpath=//a[@id='micro_market_ids_0_0_0']");

    this.price = page.locator("xpath=//div[@name='apply_on']//label[normalize-space()='New Price']");

    this.value = page.locator("xpath=//input[@id='value_0']");

    this.update = page.locator("xpath=//button[normalize-space()='Update']");

    this.confirm = page.locator("xpath=//span[normalize-space()='Confirm']");

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
      await this.page.waitForTimeout(5000);

      await reportStep(this.page, "login button clicked successfully", "pass");
    } catch (e) {
      await reportStep(this.page, "login button clicked not successfully..." + e, "fail");
    }
    return this;
  }

  async clickMenuButton() {
    try {
      await this.menu.click({ timeout: 30 * 1000 });
      await this.page.waitForTimeout(10000);

      await reportStep(this.page, "Menu button is entered successfully", "pass");
    } catch (e) {
      await reportStep(this.page, "Menu button is not entered successfully..." + e, "fail");
    }

    return this;
  }

  async clickInventoryMenuButton() {
    try {
      await this.page.waitForTimeout(5000);
      await this.inventory.click({ timeout: 30 * 1000 });
      await this.page.waitForTimeout(80000);

      await reportStep(this.page, "Inventory Menu button is entered successfully", "pass");
    } catch (e) {
      await reportStep(this.page, "Inventory Menu button is not entered successfully..." + e, "fail");
    }

    return this;
  }

  async clickCreateButton() {
    try {
      await this.page.waitForTimeout(50000);
      await this.createBtn.click({ timeout: 30 * 1000 });
      await this.page.waitForTimeout(10000);

      await reportStep(this.page, "Create button is entered successfully", "pass");
    } catch (e) {
      await reportStep(this.page, "Create button is not entered successfully..." + e, "fail");
    }

    return this;
  }

  async CreateProductDetails(prodctName, code, upc, sku, id) {
    try {
      await this.productName.fill(String(prodctName));
      await this.page.waitForTimeout(3000);

      await this.productCode.fill(String(code));
      await this.page.waitForTimeout(3000);

      await this.proType.selectOption({ index: 2 });
      await this.page.waitForTimeout(3000);
      await this.productCategory.click();
      await this.page.waitForTimeout(3000);
      await this.categorySelect.click();
      await this.page.waitForTimeout(3000);

      /*await this.unitOfMeasureClick.click();
      await this.page.waitForTimeout(3000);
      await this.unitOfMeasureSearchMore.click();
      await this.page.waitForTimeout(3000);
      await this.unitOfMeasureCreateBtn.click();
      await this.page.waitForTimeout(3000);
      await this.unitOfMeasureName.fill("Test");
      await this.unitOfMeasureCategory.click();
      await this.unitOfMeasureCatSelect.click();
      await this.page.waitForTimeout(3000);
      await this.unitOfMeasureSaveBtn.click();
      await this.page.waitForTimeout(3000);*/

      await this.skuNumber.fill(String(sku));
      await this.packageId.fill(String(id));
      await this.page.waitForTimeout(3000);
      /*await this.addaLine.click();
      await this.page.waitForTimeout(3000);
      await this.textUPC.fill(String(upc));
      await this.page.waitForTimeout(3000);
      await this.saleAcc.click();
      await this.accSelect.click();
      await this.saleDesc.fill("test");
      await this.page.waitForTimeout(3000);
      await this.prefVendor.click();
      await this.vendorSelect.click();
      await this.page.waitForTimeout(3000);
      await this.cogsAcc.click();
      await this.accSelect1.click();
      await this.purDesc.fill("test");*/

      await reportStep(this.page, "ProductDetails is entered successfully", "pass");
    } catch (e) {
      await reportStep(this.page, "ProductDetails is not entered successfully..." + e, "fail");
    }
    return this;
  }

  async CreateProductDetailsNegative(prodctName, code, upc, sku, id) {
    try {
      await this.productName.fill(String(prodctName));
      await this.page.waitForTimeout(3000);

      await this.productCode.fill(String(code));
      await this.page.waitForTimeout(3000);

      await this.proType.selectOption({ index: 2 });
      await this.page.waitForTimeout(3000);
      await this.productCategory.click();
      await this.page.waitForTimeout(3000);
      await this.categorySelect.click();
      await this.page.waitForTimeout(3000);

      /*await this.unitOfMeasureClick.click();
      await this.page.waitForTimeout(3000);
      await this.unitOfMeasureSearchMore.click();
      await this.page.waitForTimeout(3000);
      await this.unitOfMeasureCreateBtn.click();
      await this.page.waitForTimeout(3000);
      await this.unitOfMeasureName.fill("Test");
      await this.unitOfMeasureCategory.click();
      await this.unitOfMeasureCatSelect.click();
      await this.page.waitForTimeout(3000);
      await this.unitOfMeasureSaveBtn.click();
      await this.page.waitForTimeout(3000);*/

      await this.skuNumber.fill(String(sku));
      await this.packageId.fill(String(id));
      await this.page.waitForTimeout(3000);
      /*await this.addaLine.click();
      await this.page.waitForTimeout(3000);
      await this.textUPC.fill(String(upc));
      await this.page.waitForTimeout(3000);
      await this.saleAcc.click();
      await this.accSelect.click();
      await this.saleDesc.fill("test");
      await this.page.waitForTimeout(3000);
      await this.prefVendor.click();
      await this.vendorSelect.click();
      await this.page.waitForTimeout(3000);
      await this.cogsAcc.click();
      await this.accSelect1.click();
      await this.purDesc.fill("test");*/

      await reportStep(this.page, "ProductDetails is entered successfully", "pass");
    } catch (e) {
      await reportStep(this.page, "ProductDetails is not entered successfully..." + e, "fail");
    }
    return this;
  }

  async UnitofMeasure_Negative() {
    try {
      await this.unitOfMeasureClick.click();
      await this.page.waitForTimeout(3000);

      await this.unitOfMeasureSearchMore.click();
      await this.page.waitForTimeout(3000);

      await this.unitOfMeasureCreateBtn.click();
      await this.page.waitForTimeout(3000);

      await this.unitOfMeasureSaveBtn.click();
      await this.page.waitForTimeout(3000);

      await this.category_idClick.click();
      await this.page.waitForTimeout(3000);

      await this.category_idSearchMore.click();
      await this.page.waitForTimeout(3000);

      await reportStep(this.page, "ProductDetails is entered successfully", "pass");
    } catch (e) {
      await reportStep(this.page, "ProductDetails is not entered successfully..." + e, "fail");
    }
    return this;
  }

  async CreateSalesPriceDetails(LstPrice1, LstPrice2, LstPrice3, updatecost, upc) {
    try {
      await this.page.waitForTimeout(3000);
      await this.listPrice1.clear();
      await this.listPrice1.fill(String(LstPrice1));
      await this.page.waitForTimeout(3000);

      await this.listPrice2.clear();

      await this.listPrice2.fill(String(LstPrice2));
      await this.page.waitForTimeout(3000);

      await this.listPrice3.clear();

      await this.listPrice3.fill(String(LstPrice3));
      await this.page.waitForTimeout(8000);

      await this.saleAcc.click();
      await this.accSelect.click();
      await this.saleDesc.fill("test");
      await this.page.waitForTimeout(3000);
      await this.prefVendor.click();
      await this.vendorSelect.click();
      await this.page.waitForTimeout(3000);
      await this.cogsAcc.click();
      await this.accSelect1.click();
      await this.purDesc.fill("test");

      /*await this.updateCostBtn.click();
      await this.page.waitForTimeout(8000);

      await this.updateCost.clear();
      await this.page.waitForTimeout(5000);

      await this.updateCost.fill(String(updatecost));
      await this.page.waitForTimeout(8000);

      await this.updateCostApply.click();
      await this.page.waitForTimeout(3000);
      await this.page.waitForTimeout(3000);
      await this.UPC.click();
      await this.upcaddaLine.click();
      await this.upcCode.fill(String(upc));*/
      await this.page.waitForTimeout(3000);

      await reportStep(this.page, "Sales Price Details is entered successfully", "pass");
    } catch (e) {
      await reportStep(this.page, "Sales Price Details is not entered successfully..." + e, "fail");
    }
    return this;
  }

  async CreateSalesPriceDetailsNegative(LstPrice1, LstPrice2, LstPrice3, updatecost, upc) {
    try {
      await this.page.waitForTimeout(3000);
      await this.listPrice1.clear();
      await this.listPrice1.fill(String(LstPrice1));
      await this.listPrice1.press('Enter');
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

      await this.listPrice2.clear();

      await this.listPrice2.fill(String(LstPrice2));
      await this.listPrice2.press('Enter');
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

      await this.listPrice3.clear();

      await this.listPrice3.fill(String(LstPrice3));
      await this.listPrice3.press('Enter');
      await this.page.waitForTimeout(8000);
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

      await this.saleAcc.click();
      await this.accSelect.click();
      await this.saleDesc.fill("test");
      await this.page.waitForTimeout(3000);
      await this.prefVendor.click();
      await this.vendorSelect.click();
      await this.page.waitForTimeout(3000);
      await this.cogsAcc.click();
      await this.accSelect1.click();
      await this.purDesc.fill("test");

      await this.page.waitForTimeout(3000);

      await reportStep(this.page, "Sales Price Details is entered successfully", "pass");
    } catch (e) {
      await reportStep(this.page, "Sales Price Details is not entered successfully..." + e, "fail");
    }
    return this;
  }

  async UoM_click(boxqty, boxprice1, boxprice2, boxprice3, caseqty, caseprice1, caseprice2, caseprice3) {
    try {
      await this.page.waitForTimeout(1000);
      await this.multipleUOMCheckBox.evaluate((node) => node.click());
      await this.page.waitForTimeout(1000);

      await this.boxADDALine.click();
      await this.page.waitForTimeout(3000);

      await this.uOM_BoxName.click();
      await this.page.waitForTimeout(3000);

      await this.uOM_BoxNameSelect.click();
      await this.page.waitForTimeout(3000);

      await this.uOM_BoxQuantity.clear();
      await this.uOM_BoxQuantity.fill(String(boxqty));
      await this.page.waitForTimeout(3000);

      await this.uOM_BoxSalesPrice1.clear();
      await this.uOM_BoxSalesPrice1.fill(String(boxprice1));
      await this.page.waitForTimeout(3000);

      await this.uOM_BoxSalesPrice2.clear();
      await this.uOM_BoxSalesPrice2.fill(String(boxprice2));
      await this.page.waitForTimeout(3000);

      await this.uOM_BoxSalesPrice3.clear();
      await this.uOM_BoxSalesPrice3.fill(String(boxprice3));
      await this.page.waitForTimeout(3000);

      await this.caseADDALine.click();
      await this.page.waitForTimeout(3000);
      //await this.clickOk.click();
      //await this.page.waitForTimeout(3000);

      await this.uOM_CaseName.click();
      await this.page.waitForTimeout(3000);
      await this.uOM_CaseNameSelect.click();
      await this.page.waitForTimeout(3000);

      await this.uOM_CaseQuantity.clear();
      await this.uOM_CaseQuantity.fill(String(caseqty));
      await this.page.waitForTimeout(3000);

      await this.uOM_CaseSalesPrice1.clear();
      await this.uOM_CaseSalesPrice1.fill(String(caseprice1));
      await this.page.waitForTimeout(3000);

      await this.uOM_CaseSalesPrice2.clear();
      await this.uOM_CaseSalesPrice2.fill(String(caseprice2));
      await this.page.waitForTimeout(3000);

      await this.uOM_CaseSalesPrice3.clear();
      await this.uOM_CaseSalesPrice3.fill(String(caseprice3));
      await this.page.waitForTimeout(5000);
      //await this.clickOk.click();

      await reportStep(this.page, "new Product Name click clicked successfully", "pass");
    } catch (e) {
      await reportStep(this.page, "new Product Name clicked not successfully..." + e, "fail");
    }
    return this;
  }

  async UoM_clickNegative(boxqty, boxprice1, boxprice2, boxprice3, caseqty, caseprice1, caseprice2, caseprice3) {
    try {
      await this.page.waitForTimeout(1000);
      await this.multipleUOMCheckBox.evaluate((node) => node.click());
      await this.page.waitForTimeout(1000);

      await this.boxADDALine.click();
      await this.page.waitForTimeout(3000);

      await this.uOM_BoxName.click();
      await this.page.waitForTimeout(3000);

      await this.uOM_BoxNameSelect.click();
      await this.page.waitForTimeout(3000);

      await this.uOM_BoxQuantity.clear();
      await this.uOM_BoxQuantity.fill(String(boxqty));
      await this.uOM_BoxQuantity.press('Enter');
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

      await this.uOM_BoxSalesPrice1.clear();
      await this.uOM_BoxSalesPrice1.fill(String(boxprice1));
      await this.uOM_BoxSalesPrice1.press('Enter');
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

      await this.uOM_BoxSalesPrice2.clear();
      await this.uOM_BoxSalesPrice2.fill(String(boxprice2));
      await this.uOM_BoxSalesPrice2.press('Enter');
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

      await this.uOM_BoxSalesPrice3.clear();
      await this.uOM_BoxSalesPrice3.fill(String(boxprice3));
      await this.uOM_BoxSalesPrice3.press('Enter');
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

      await this.caseADDALine.click();
      await this.page.waitForTimeout(3000);
      //await this.clickOk.click();
      //await this.page.waitForTimeout(3000);

      await this.uOM_CaseName.click();
      await this.page.waitForTimeout(3000);
      await this.uOM_CaseNameSelect.click();
      await this.page.waitForTimeout(3000);

      await this.uOM_CaseQuantity.clear();
      await this.uOM_CaseQuantity.fill(String(caseqty));
      await this.page.waitForTimeout(3000);

      await this.uOM_CaseSalesPrice1.clear();
      await this.uOM_CaseSalesPrice1.fill(String(caseprice1));
      await this.page.waitForTimeout(3000);

      await this.uOM_CaseSalesPrice2.clear();
      await this.uOM_CaseSalesPrice2.fill(String(caseprice2));
      await this.page.waitForTimeout(3000);

      await this.uOM_CaseSalesPrice3.clear();
      await this.uOM_CaseSalesPrice3.fill(String(caseprice3));
      await this.page.waitForTimeout(5000);
      //await this.clickOk.click();

      await reportStep(this.page, "new Product Name click clicked successfully", "pass");
    } catch (e) {
      await reportStep(this.page, "new Product Name clicked not successfully..." + e, "fail");
    }
    return this;
  }

  async clickTaxDetails(fluid1, conAmount1, provId) {
    try {
      await this.page.waitForTimeout(3000);
      await this.tax.click();
      await this.page.waitForTimeout(3000);

      await this.litreType.selectOption({ index: 1 });
      await this.page.waitForTimeout(3000);
      await this.containerTax.evaluate((node) => node.click());
      await this.page.waitForTimeout(3000);
      await this.conAmount.clear();
      await this.conAmount.fill(String(conAmount1));
      //	await this.providerId.fill(String(provId));

      await this.page.waitForTimeout(3000);

      await reportStep(this.page, "Menu button is entered successfully", "pass");
    } catch (e) {
      await reportStep(this.page, "Menu button is not entered successfully..." + e, "fail");
    }

    return this;
  }

  async clickTaxDetailsNegative(fluid1, conAmount1, provId) {
    try {
      await this.page.waitForTimeout(3000);
      await this.tax.click();
      await this.page.waitForTimeout(3000);

      await this.litreType.selectOption({ index: 1 });
      await this.page.waitForTimeout(3000);
      await this.containerTax.evaluate((node) => node.click());
      await this.page.waitForTimeout(3000);
      await this.conAmount.clear();
      await this.conAmount.fill(String(conAmount1));
      await this.conAmount.press('Enter');
      //	await this.providerId.fill(String(provId));

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

      await reportStep(this.page, "Menu button is entered successfully", "pass");
    } catch (e) {
      await reportStep(this.page, "Menu button is not entered successfully..." + e, "fail");
    }

    return this;
  }

  async CreateLogisticsDetails(vlme1, manftre, wght1, mpn) {
    try {
      await this.page.waitForTimeout(3000);
      await this.logistics.click();
      await this.page.waitForTimeout(3000);
      await this.volume1.clear();
      await this.page.waitForTimeout(3000);

      await this.volume1.fill(String(vlme1));
      await this.page.waitForTimeout(3000);

      await this.manufacturer.fill(String(manftre));
      await this.page.waitForTimeout(3000);

      await this.weight1.clear();
      await this.page.waitForTimeout(3000);

      await this.weight1.fill(String(wght1));
      await this.page.waitForTimeout(3000);

      await this.mPN.fill(String(mpn));
      await this.page.waitForTimeout(5000);

      await this.warehouseInv.click();
      //await this.invAcc.click();
      await this.page.waitForTimeout(3000);
      //await this.clickOk1.click();
      //await this.page.waitForTimeout(3000);
      await this.invAcc.click();
      await this.page.waitForTimeout(3000);
      await this.invSelect.click();
      await this.page.waitForTimeout(3000);
      await this.legacy.fill("PDT123");
      await this.page.waitForTimeout(3000);
      await this.warehouseMin.fill("1");
      await this.warehouseMax.fill("1");
      await this.page.waitForTimeout(3000);
      await this.micromarketDefault.click();
      await this.page.waitForTimeout(3000);
      await this.microMarketMin.click();
      await this.microMarketMax.click();
      await this.page.waitForTimeout(3000);

      await reportStep(this.page, "LogisticsDetails is entered successfully", "pass");
    } catch (e) {
      await reportStep(this.page, "LogisticsDetails is not entered successfully..." + e, "fail");
    }
    return this;
  }

  async saveBtn_click() {
    try {
      // Wait for the save button to be clickable
      // await this.saveBtn.waitFor({ state: 'visible', timeout: 10000 });

      // Click the save button
      await this.saveBtn.click();

      await this.page.waitForTimeout(10000);

      // Wait for potential error message
      const errorMessage = this.page.locator("xpath=//div[contains(text(),'The following fields are invalid:')]");
      const isDisplayed = await errorMessage.isVisible().catch(() => false);

      if (isDisplayed) {
        const errorMessageText = await errorMessage.textContent();
        console.log('Error Message:', errorMessageText);
        await reportStep(this.page, "Error Message: " + errorMessageText, "fail");
      } else {
        console.log('Error message not displayed.');
        await reportStep(this.page, "Save button clicked successfully, no errors found.", "pass");
      }
    } catch (e) {
      console.log('An error occurred:', e.message);
      console.error(e); // Log full stack trace for debugging
      await reportStep(this.page, "Save button click failed: " + e.message, "fail");
    }

    return this; // Return the current instance for method chaining
  }

  async saveBtn_clickNegative() {
    try {
      // Wait for the save button to be clickable

      // Click the save button
      await this.saveBtn.click();

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

      // Wait for potential error message
    } catch (e) {
      console.log('An error occurred:', e.message);
      console.error(e); // Log full stack trace for debugging
      await reportStep(this.page, "Save button click failed: " + e.message, "fail");
    }

    return this; // Return the current instance for method chaining
  }

  async clickPriceList() {
    try {
      await this.page.waitForTimeout(2000);
      await this.actionBtn.click();
      await this.pricelistReport.click();
      await this.page.waitForTimeout(2000);
      await this.addProduct.click();
      await this.productSelect.click();
      await this.page.waitForTimeout(2000);
      await this.pricelist.selectOption({ index: 1 });
      await this.page.waitForTimeout(2000);
      await this.pdf.selectOption({ index: 1 });
      await this.page.waitForTimeout(2000);
      await this.print.click();
      await this.back.click();
      await this.page.waitForTimeout(2000);

      await reportStep(this.page, "ProductDetails is entered successfully", "pass");
    } catch (e) {
      await reportStep(this.page, "ProductDetails is not entered successfully..." + e, "fail");
    }
    return this;
  }

  async clickProductPrice() {
    try {
      await this.page.waitForTimeout(2000);
      await this.actionBtn1.click();
      await this.updateProductPrice.click();
      await this.page.waitForTimeout(3000);
      await this.location.click();
      await this.page.waitForTimeout(3000);
      //  await this.locationSelect.click();
      await this.locationSelect.evaluate((node) => node.click());
      await this.page.waitForTimeout(3000);
      await this.price.click();
      await this.page.waitForTimeout(3000);
      await this.value.clear();
      await this.value.fill("15.00");
      await this.update.click();
      await this.confirm.click();

      await this.page.waitForTimeout(5000);
      // await this.back1.click();
      // await this.page.waitForTimeout(2000);
      await this.action.click();
      await this.delete.click();
      await this.confirmDelete.click();
      await this.page.waitForTimeout(25000);

      await reportStep(this.page, "ProductDetails is entered successfully", "pass");
    } catch (e) {
      await reportStep(this.page, "ProductDetails is not entered successfully..." + e, "fail");
    }
    return this;
  }
}

module.exports = { InventoryServiceProductCreation };
