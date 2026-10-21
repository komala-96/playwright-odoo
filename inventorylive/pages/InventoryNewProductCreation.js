const { expect } = require('../fixtures/base');
const { reportStep } = require('../utils/reportStep');
const { ensureLoggedIn } = require('../utils/loginHelper');

class InventoryNewProductCreation {
  constructor(page) {
    this.page = page;

    // Login Page
    this.userName = page.locator("xpath=//input[@name='login']");
    this.passWord = page.locator("xpath=//input[@name='password']");
    this.logIn = page.locator("xpath=//button[@type='submit']");

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

    // Means
    this.menu1 = page.locator("xpath=//ul[@class='o_menu_apps']//i[@class='fa fa-bars']");

    this.purchaseMenu = page.locator("xpath=//a[@role='menuitem']//img[@title='Purchase']");

    this.billMenu = page.locator("xpath=//li//a[@role='menuitem']//span[contains(text(),'Bill')]");

    this.billCreateBtn = page.locator("xpath=//div[@class='o_list_buttons']//button[contains(text(),'Create')]");

    this.vendor = page.locator("xpath=//div[@name='partner_id']//input[@type='text']");

    this.vendorSearchMore = page.locator("xpath=//li[8]//a[contains(text(),'Search More...')]");

    this.vendorName = page.locator(
      "xpath=//table[@class='o_list_table table table-sm table-hover table-striped o_list_table_ungrouped']//tbody//tr[2]//td[1]"
    );

    // enter -
    this.productDropDown_Each_Box = page.locator("xpath=//div[@name='product_ids']//input[@type='text']");

    this.product_Each_SearchMore = page.locator(
      "xpath=//li[@class='o_m2o_dropdown_option ui-menu-item']//a[contains(text(),'Search More...')]"
    );

    this.product_Each_SearchMoreBox = page.locator(
      "xpath=//div[@class='o_searchview_input_container']//input[@type='text']"
    );

    this.product_Each_Select = page.locator("xpath=//table//tbody//tr[1]//td[3]");

    this.product_Each_Add = page.locator("xpath=//button[@name='add_products']//span[contains(text(),'Add')]");

    this.product_Box_DropDownBox = page.locator("xpath=//div[@name='product_ids']//input[@type='text']");

    this.product_Box_SearchMore = page.locator(
      "xpath=//li[@class='o_m2o_dropdown_option ui-menu-item']//a[contains(text(),'Search More...')]"
    );

    this.product_Box_SearchMoreBox = page.locator(
      "xpath=//div[@class='o_searchview_input_container']//input[@type='text']"
    );

    this.product_Box_Select = page.locator(
      "xpath=(//table[@class='o_list_table table table-sm table-hover table-striped o_list_table_ungrouped'])[3]//tbody//tr//td[3]"
    );

    this.product_Box_Add = page.locator("xpath=//button[@name='add_products']//span[contains(text(),'Add')]");

    this.product_Case_DropDownBox = page.locator("xpath=//div[@name='product_ids']//input[@type='text']");

    this.product_Case_SearchMore = page.locator(
      "xpath=//li[@class='o_m2o_dropdown_option ui-menu-item']//a[contains(text(),'Search More...')]"
    );

    this.product_Case_SearchMoreBox = page.locator(
      "xpath=//div[@class='o_searchview_input_container']//input[@type='text']"
    );

    this.product_Case_Select = page.locator(
      "xpath=(//table[@class='o_list_table table table-sm table-hover table-striped o_list_table_ungrouped'])[3]//tbody//tr//td[3]"
    );

    this.product_Case_Add = page.locator("xpath=//button[@name='add_products']//span[contains(text(),'Add')]");

    this.billSaveBtn = page.locator("xpath=//button[contains(text(),'Save')]");

    this.subTotal = page.locator("xpath=//tr//td//span[@name='amount_untaxed']");

    this.amtTotal = page.locator("xpath=//tr//td//span[@name='amount_total_view']");

    this.billPostBtn = page.locator("xpath=//button[@name='action_post']//span");

    // Means
    this.menu2 = page.locator("xpath=//ul[@class='o_menu_apps']//i[@class='fa fa-bars']");

    this.reportMenu = page.locator("xpath=//a[@role='menuitem']//img[@title='Reports']");

    this.productChangeMenu = page.locator(
      "xpath=//button[@name='report_action']//span[contains(text(),'Product Cost Change Report')]"
    );

    this.productChangeDropDownBox = page.locator("xpath=//div[@name='product_ids']//input[@type='text']");

    this.productChangeSearchMore = page.locator("xpath=//ul[3]//li//a[contains(text(),'Search More...')]");

    this.productChangeSearchMoreBox = page.locator(
      "xpath=//div[@class='o_searchview_input_container']//input[@type='text']"
    );

    this.productChangeSelect = page.locator("xpath=//table//tbody//tr[1]//td[3]");

    this.productChangeStartDate = page.locator("xpath=//div[@name='start_date']//input[@name='start_date']");

    this.productChangeReportType = page.locator("xpath=//select[@name='type_report']");

    this.ProductChangeGenerateBtn = page.locator(
      "xpath=//button[@name='get_values']//span[contains(text(),'Generate')]"
    );

    this.reportHomePageMenu = page.locator("xpath=//nav//ul[2]//li[1]//a//span[contains(text(),'Home')]");

    this.productMasterMenu = page.locator(
      "xpath=//button[@name='report_action']//span[contains(text(),'Product Master Report')]"
    );

    this.productMasterDropDown = page.locator("xpath=//div[@name='product_ids']//input[@type='text']");

    this.productMasterSearchMore = page.locator("xpath=//li[8]//a[contains(text(),'Search More...')]");

    this.productMasterSearchMoreBox = page.locator(
      "xpath=//div[@class='o_searchview_input_container']//input[@type='text']"
    );

    this.productMasterSelect = page.locator("xpath=//table//tbody//tr[1]//td[3]");

    this.productType = page.locator("xpath=//select[@name='report_types']");

    this.productMasterGenerateBtn = page.locator("xpath=//button[@name='action_generate_report']");

    // span[contains(text(),'Ok')])[2]
    this.clickOk = page.locator("xpath=(//span[contains(text(),'Ok')])");

    this.clickOk1 = page.locator("xpath=(//span[contains(text(),'Ok')])");

    this.actionBtn = page.locator("xpath=//button[normalize-space()='Action']");

    this.duplicate = page.locator("xpath=//span[normalize-space()='Duplicate']");

    this.actionBtn1 = page.locator("xpath=//button[normalize-space()='Action']");

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
      await this.page.waitForTimeout(10000);

      await reportStep(this.page, "Inventory Menu button is entered successfully", "pass");
    } catch (e) {
      await reportStep(this.page, "Inventory Menu button is not entered successfully..." + e, "fail");
    }

    return this;
  }

  async clickCreateButton() {
    try {
      await this.page.waitForTimeout(30000);
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

      await this.proType.selectOption({ index: 1 });
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

      await this.proType.selectOption({ index: 1 });
      await this.page.waitForTimeout(3000);
      await this.productCategory.click();
      await this.page.waitForTimeout(3000);
      await this.categorySelect.click();
      await this.page.waitForTimeout(3000);

      await this.skuNumber.fill(String(sku));
      await this.packageId.fill(String(id));
      await this.page.waitForTimeout(3000);

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
      await this.page.waitForTimeout(3000);*/
      await this.page.waitForTimeout(3000);
      await this.UPC.click();
      await this.upcaddaLine.click();
      await this.upcCode.fill(String(upc));
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

      /*await this.updateCostBtn.click();
      await this.page.waitForTimeout(8000);

      await this.updateCost.clear();
      await this.page.waitForTimeout(5000);

      await this.updateCost.fill(String(updatecost));
      await this.page.waitForTimeout(8000);

      await this.updateCostApply.click();
      await this.page.waitForTimeout(3000);*/
      await this.page.waitForTimeout(3000);
      await this.UPC.click();
      await this.upcaddaLine.click();
      await this.upcCode.fill(String(upc));
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
      // await this.clickOk.click();
      // await this.page.waitForTimeout(3000);

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
      // await this.clickOk.click();

      await reportStep(this.page, "UOM details Entered successfully", "pass");
    } catch (e) {
      await reportStep(this.page, "UOM details Entered not successfully..." + e, "fail");
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
      // await this.clickOk.click();
      // await this.page.waitForTimeout(3000);

      await this.uOM_CaseName.click();
      await this.page.waitForTimeout(3000);
      await this.uOM_CaseNameSelect.click();
      await this.page.waitForTimeout(3000);

      await this.uOM_CaseQuantity.clear();
      await this.uOM_CaseQuantity.fill(String(caseqty));
      await this.uOM_CaseQuantity.press('Enter');
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

      await this.uOM_CaseSalesPrice1.clear();
      await this.uOM_CaseSalesPrice1.fill(String(caseprice1));
      await this.uOM_CaseSalesPrice1.press('Enter');
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

      await this.uOM_CaseSalesPrice2.clear();
      await this.uOM_CaseSalesPrice2.fill(String(caseprice2));
      await this.uOM_CaseSalesPrice2.press('Enter');
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

      await this.uOM_CaseSalesPrice3.clear();
      await this.uOM_CaseSalesPrice3.fill(String(caseprice3));
      await this.uOM_CaseSalesPrice3.press('Enter');
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
      // await this.clickOk.click();

      await reportStep(this.page, "UOM details entered successfully", "pass");
    } catch (e) {
      await reportStep(this.page, "UOM details entered not successfully..." + e, "fail");
    }
    return this;
  }

  async clickTaxDetails(fluid1, conAmount1, provId) {
    try {
      await this.page.waitForTimeout(3000);
      await this.tax.click();
      await this.page.waitForTimeout(3000);
      await this.sugarTax.evaluate((node) => node.click());
      await this.page.waitForTimeout(3000);
      await this.fluid.clear();
      await this.fluid.fill(String(fluid1));
      await this.page.waitForTimeout(3000);
      await this.litreType.selectOption({ index: 1 });
      await this.page.waitForTimeout(3000);
      await this.containerTax.evaluate((node) => node.click());
      await this.page.waitForTimeout(3000);
      await this.conAmount.clear();
      await this.conAmount.fill(String(conAmount1));
      // await this.providerId.fill(String(provId));

      await this.page.waitForTimeout(3000);

      await reportStep(this.page, "Tax details  is entered successfully", "pass");
    } catch (e) {
      await reportStep(this.page, "Tax details not entered successfully..." + e, "fail");
    }

    return this;
  }

  async clickTaxDetailsnegative(fluid1, conAmount1, provId) {
    try {
      await this.page.waitForTimeout(3000);
      await this.tax.click();
      await this.page.waitForTimeout(3000);
      await this.sugarTax.evaluate((node) => node.click());
      await this.page.waitForTimeout(3000);
      await this.fluid.clear();
      await this.fluid.fill(String(fluid1));
      await this.page.waitForTimeout(3000);
      await this.litreType.selectOption({ index: 1 });
      await this.page.waitForTimeout(3000);
      await this.containerTax.evaluate((node) => node.click());
      await this.page.waitForTimeout(3000);
      await this.conAmount.clear();
      await this.conAmount.fill(String(conAmount1));
      await this.conAmount.press('Enter');
      // await this.providerId.fill(String(provId));
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

      await this.page.waitForTimeout(3000);

      await reportStep(this.page, "Tax details  is entered successfully", "pass");
    } catch (e) {
      await reportStep(this.page, "Tax details is not entered successfully..." + e, "fail");
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
      // await this.invAcc.click();
      await this.page.waitForTimeout(3000);
      // await this.clickOk1.click();
      // await this.page.waitForTimeout(3000);
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

  async saveBtn_clickNegative() {
    try {
      // Wait for the save button to be clickable
      // const wait = new WebDriverWait(driver, Duration.ofSeconds(10));

      // Click the save button
      await this.saveBtn.click();

      await this.page.waitForTimeout(2000);
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
    } catch (e) {
      console.log('An error occurred: ' + e.message);
      console.error(e); // Log full stack trace for debugging
      await reportStep(this.page, "Save button click failed: " + e.message, "fail");
    }

    return this; // Return the current instance for method chaining
  }

  async saveBtn_click() {
    try {
      // Wait for the save button to be clickable
      // const wait = new WebDriverWait(driver, Duration.ofSeconds(10));

      // Click the save button
      await this.saveBtn.click();

      await this.page.waitForTimeout(10000);
    } catch (e) {
      console.log('An error occurred: ' + e.message);
      console.error(e); // Log full stack trace for debugging
      await reportStep(this.page, "Save button click failed: " + e.message, "fail");
    }

    return this; // Return the current instance for method chaining
  }

  async clickDelete() {
    try {
      await this.page.waitForTimeout(2000);
      await this.actionBtn.click();
      await this.duplicate.click();
      await this.page.waitForTimeout(2000);
      await this.actionBtn1.click();
      await this.delete.click();
      await this.confirmDelete.click();
      await this.page.waitForTimeout(25000);

      await reportStep(this.page, "ProductDetails is entered successfully", "pass");
    } catch (e) {
      await reportStep(this.page, "ProductDetails is not entered successfully..." + e, "fail");
    }
    return this;
  }

  async clickMenu1() {
    try {
      await this.menu1.click({ timeout: 30 * 1000 });

      await this.page.waitForTimeout(10000);

      await reportStep(this.page, "Menu1 clicked successfully", "pass");
    } catch (e) {
      await reportStep(this.page, "Menu1 clicked not successfully..." + e, "fail");
    }
    return this;
  }

  async clickPurchaseMenu() {
    try {
      await this.purchaseMenu.click({ timeout: 30 * 1000 });
      await this.page.waitForTimeout(8000);

      await this.billMenu.click({ timeout: 30 * 1000 });
      await this.page.waitForTimeout(3000);

      await reportStep(this.page, "Prchase Menu clicked successfully", "pass");
    } catch (e) {
      await reportStep(this.page, "Purchase Menu clicked not successfully..." + e, "fail");
    }
    return this;
  }

  async clickProduct_Each_Select(PurchaseSearch) {
    try {
      await this.page.waitForTimeout(6000);
      await this.billCreateBtn.click();
      await this.page.waitForTimeout(10000);

      await this.vendor.click();
      await this.page.waitForTimeout(5000);

      await this.vendorSearchMore.click({ timeout: 30 * 1000 });
      await this.page.waitForTimeout(5000);

      await this.vendorName.click();
      await this.page.waitForTimeout(5000);

      await this.productDropDown_Each_Box.click();
      await this.page.waitForTimeout(5000);

      await this.product_Each_SearchMore.click({ timeout: 30 * 1000 });
      await this.page.waitForTimeout(5000);

      await this.product_Each_SearchMoreBox.click();
      await this.page.waitForTimeout(5000);

      await this.product_Each_SearchMoreBox.fill(String(PurchaseSearch));
      await this.product_Each_SearchMoreBox.press('Enter');
      await this.page.waitForTimeout(5000);

      await this.product_Each_Select.click();
      await this.page.waitForTimeout(5000);

      await this.product_Each_Add.click();
      await this.page.waitForTimeout(10000);

      await reportStep(this.page, "clickProduct_Each_Select clicked successfully", "pass");
    } catch (e) {
      await reportStep(this.page, "clickProduct_Each_Select clicked not successfully..." + e, "fail");
    }
    return this;
  }

  async clickProduct_Box_Select(PurchaseBoxSearch) {
    try {
      await this.page.waitForTimeout(5000);
      await this.product_Box_DropDownBox.click();
      await this.page.waitForTimeout(5000);

      await this.product_Box_SearchMore.click({ timeout: 30 * 1000 });
      await this.page.waitForTimeout(5000);

      await this.product_Box_SearchMoreBox.click();
      await this.page.waitForTimeout(5000);

      await this.product_Box_SearchMoreBox.fill(String(PurchaseBoxSearch));
      await this.product_Box_SearchMoreBox.press('Enter');
      await this.page.waitForTimeout(5000);

      await this.product_Box_Select.click();
      await this.page.waitForTimeout(5000);

      await this.product_Box_Add.click();
      await this.page.waitForTimeout(10000);

      await reportStep(this.page, "clickProduct_Box_Select clicked successfully", "pass");
    } catch (e) {
      await reportStep(this.page, "clickProduct_Box_Select clicked not successfully..." + e, "fail");
    }
    return this;
  }

  async clickProduct_Case_Select(PurchaseCaseSearch) {
    try {
      await this.page.waitForTimeout(5000);
      await this.product_Case_DropDownBox.click();
      await this.page.waitForTimeout(5000);

      await this.product_Case_SearchMore.click({ timeout: 30 * 1000 });
      await this.page.waitForTimeout(5000);

      await this.product_Case_SearchMoreBox.click();
      await this.page.waitForTimeout(5000);

      await this.product_Case_SearchMoreBox.fill(String(PurchaseCaseSearch));
      await this.product_Case_SearchMoreBox.press('Enter');
      await this.page.waitForTimeout(5000);

      await this.product_Case_Select.click();
      await this.page.waitForTimeout(5000);

      await this.product_Case_Add.click();
      await this.page.waitForTimeout(10000);

      await reportStep(this.page, "clickProduct_case_Select clicked successfully", "pass");
    } catch (e) {
      await reportStep(this.page, "clickProduct_Case_Select clicked not successfully..." + e, "fail");
    }
    return this;
  }

  async clickProduct_CostAndQty_Entered() {
    try {
      const ProductRow = this.page.locator(
        "xpath=(//table[@class='o_list_table table table-sm table-hover table-striped o_list_table_ungrouped'])[1]//tbody//tr[1]//td[1]"
      );
      await ProductRow.click({ timeout: 30 * 1000 });

      const QtyInput = this.page.locator(
        "xpath=(//table[@class='o_list_table table table-sm table-hover table-striped o_list_table_ungrouped'])[1]//tbody//tr[1]//td[3]//input"
      );
      await QtyInput.clear({ timeout: 30 * 1000 });
      await QtyInput.fill("5");
      await this.page.waitForTimeout(5000);

      const CostInput = this.page.locator(
        "xpath=(//table[@class='o_list_table table table-sm table-hover table-striped o_list_table_ungrouped'])[1]//tbody//tr[1]//td[5]//input"
      );
      await CostInput.clear({ timeout: 30 * 1000 });
      await CostInput.fill("260");
      await this.page.waitForTimeout(5000);

      const ProductRow2 = this.page.locator(
        "xpath=(//table[@class='o_list_table table table-sm table-hover table-striped o_list_table_ungrouped'])[1]//tbody//tr[2]//td[1]"
      );
      await ProductRow2.click({ timeout: 30 * 1000 });

      const QtyInput2 = this.page.locator(
        "xpath=(//table[@class='o_list_table table table-sm table-hover table-striped o_list_table_ungrouped'])[1]//tbody//tr[2]//td[3]//input"
      );
      await QtyInput2.clear({ timeout: 30 * 1000 });
      await QtyInput2.fill("10");
      await this.page.waitForTimeout(5000);

      const UoMInput2 = this.page.locator(
        "xpath=(//table[@class='o_list_table table table-sm table-hover table-striped o_list_table_ungrouped'])[1]//tbody//tr[2]//td[4]//input"
      );
      await UoMInput2.click({ timeout: 30 * 1000 });

      const UoMInput2Select = this.page.locator("xpath=//li[@class='ui-menu-item']//a[contains(text(),'Box')]");
      await UoMInput2Select.click();
      await this.page.waitForTimeout(5000);

      const ProductRow3 = this.page.locator(
        "xpath=(//table[@class='o_list_table table table-sm table-hover table-striped o_list_table_ungrouped'])[1]//tbody//tr[3]//td[1]"
      );
      await ProductRow3.click({ timeout: 30 * 1000 });
      await this.page.waitForTimeout(5000);

      const QtyInput3 = this.page.locator(
        "xpath=(//table[@class='o_list_table table table-sm table-hover table-striped o_list_table_ungrouped'])[1]//tbody//tr[3]//td[3]//input"
      );
      await QtyInput3.clear({ timeout: 30 * 1000 });
      await QtyInput3.fill("15");
      await this.page.waitForTimeout(5000);

      const UoMInput3 = this.page.locator(
        "xpath=(//table[@class='o_list_table table table-sm table-hover table-striped o_list_table_ungrouped'])[1]//tbody//tr[3]//td[4]//input"
      );
      await UoMInput3.click({ timeout: 30 * 1000 });
      const UoMInput3Select = this.page.locator("xpath=//li[@class='ui-menu-item']//a[contains(text(),'Case')]");
      await UoMInput3Select.click();
      await this.page.waitForTimeout(5000);

      await reportStep(this.page, "clickProduct_case_Select clicked successfully", "pass");
    } catch (e) {
      await reportStep(this.page, "clickProduct_Case_Select clicked not successfully..." + e, "fail");
    }
    return this;
  }

  async clickSavebtn() {
    try {
      await this.billSaveBtn.click();
      await this.page.waitForTimeout(20000);

      await reportStep(this.page, "Save button clicked successfully", "pass");
    } catch (e) {
      await reportStep(this.page, "Save button clicked not successfully " + e.message, "fail");
    }
    return this;
  }

  async clickGetTheTotalAmtInBill() {
    try {
      await this.page.waitForTimeout(5000);
      const subTotalText = await this.subTotal.textContent();
      console.log('Bill Sub Total:', subTotalText);

      await this.page.waitForTimeout(5000);

      const amtTotalText = await this.amtTotal.textContent();
      console.log('Bill Amount Total:', amtTotalText);
      console.log('=============================================');
      await this.page.waitForTimeout(5000);

      await reportStep(this.page, "Get The Total Amt In Bill clicked successfully", "pass");
    } catch (e) {
      await reportStep(this.page, "Get The Total Amt In Bill clicked not successfully " + e.message, "fail");
    }
    return this;
  }

  async clickPostBtn() {
    try {
      await this.billPostBtn.click({ timeout: 30 * 1000 });
      await this.page.waitForTimeout(8000);

      await reportStep(this.page, "Save button clicked successfully", "pass");
    } catch (e) {
      await reportStep(this.page, "Save button clicked not successfully " + e.message, "fail");
    }
    return this;
  }

  async clickMenu2() {
    try {
      await this.menu2.click({ timeout: 30 * 1000 });
      await this.page.waitForTimeout(10000);

      await reportStep(this.page, "Menu2 clicked successfully", "pass");
    } catch (e) {
      await reportStep(this.page, "Menu2 clicked not successfully..." + e, "fail");
    }
    return this;
  }

  async clickReportMenu(productChangeSearch) {
    try {
      await this.reportMenu.click({ timeout: 30 * 1000 });
      await this.page.waitForTimeout(3000);

      await this.productChangeMenu.click({ timeout: 30 * 1000 });
      await this.page.waitForTimeout(3000);

      await this.productChangeDropDownBox.click();
      await this.page.waitForTimeout(5000);

      await this.productChangeSearchMore.click();
      await this.page.waitForTimeout(5000);

      await this.productChangeSearchMoreBox.fill(String(productChangeSearch));
      await this.productChangeSearchMoreBox.press('Enter');
      await this.page.waitForTimeout(5000);

      await this.productChangeSelect.click();
      await this.page.waitForTimeout(5000);

      await reportStep(this.page, "Report Menu clicked successfully", "pass");
    } catch (e) {
      await reportStep(this.page, "Report Menu clicked not successfully..." + e, "fail");
    }
    return this;
  }

  async EnterProductDateDetailsAndGenerate(reportDate) {
    try {
      await this.page.waitForTimeout(3000);
      await this.productChangeStartDate.click();
      await this.page.waitForTimeout(3000);

      await this.productChangeStartDate.fill(String(reportDate));
      await this.page.waitForTimeout(3000);

      await this.productChangeReportType.click();
      // Select options by index
      await this.productChangeReportType.selectOption({ index: 4 });
      await this.page.waitForTimeout(5000);

      await reportStep(this.page, "Product Cost Change DateDetails  entered successfully", "pass");
    } catch (e) {
      await reportStep(this.page, "Product Cost Change DateDetails  entered not successfully..." + e, "fail");
    }
    return this;
  }

  async click_Generate() {
    try {
      await this.page.waitForTimeout(5000);
      await this.ProductChangeGenerateBtn.click({ timeout: 30 * 1000 });
      await this.page.waitForTimeout(8000);

      // Assuming you have already identified the table
      const rows = this.page.locator(
        "xpath=//table[@class='o_list_table table table-sm table-hover table-striped o_list_table_ungrouped']//tbody//tr"
      );

      const rowsCount = await rows.count();
      const totalRows = Math.min(rowsCount, 3);
      console.log('Total number of rows:', totalRows);

      for (let row = 1; row <= totalRows; row++) {
        // Get the text from the 6th column of the current row
        const secondColumn = this.page.locator(`xpath=.//tr[${row}]//td[6]`);
        const previousCostGet = await secondColumn.textContent({ timeout: 30 * 1000 });
        console.log(
          `Product Cost Change Report - Previous Cost for Row ${row} :  Previous Cost : ${previousCostGet}`
        );

        // Get the text from the 7th column of the current row
        const thirdColumnInput = this.page.locator(`xpath=.//tr[${row}]//td[7]`);
        const currentCostGet = await thirdColumnInput.textContent({ timeout: 30 * 1000 });
        console.log(`Product Cost Change Report - Current Cost for Row ${row}:  Current Cost :${currentCostGet}`);

        console.log('========================');

        await this.page.waitForTimeout(5000);
      }
      await reportStep(this.page, "Product Cost Report generate click entered successfully", "pass");
    } catch (e) {
      await reportStep(this.page, "Product Cost Report generate click entered not successfully..." + e, "fail");
    }
    return this;
  }

  async clickReportHomePageMenu(productMasterSearch) {
    try {
      await this.reportHomePageMenu.click({ timeout: 30 * 1000 });
      await this.page.waitForTimeout(3000);

      await this.productMasterMenu.click({ timeout: 30 * 1000 });
      await this.page.waitForTimeout(3000);

      await this.productMasterDropDown.click();
      await this.page.waitForTimeout(5000);

      await this.productMasterSearchMore.click();
      await this.page.waitForTimeout(5000);

      await this.productMasterSearchMoreBox.fill(String(productMasterSearch));
      await this.productMasterSearchMoreBox.press('Enter');
      await this.page.waitForTimeout(5000);

      await this.productMasterSelect.click();
      await this.page.waitForTimeout(5000);

      await this.productType.click();
      // Select options by index
      await this.productType.selectOption({ index: 2 });
      await this.page.waitForTimeout(5000);

      await this.productMasterGenerateBtn.click();
      await this.page.waitForTimeout(5000);

      // Check if there is at least one row
      // Wait for the entire row to be clickable
      const rowElement = this.page.locator(
        "xpath=//table[@class='o_list_table table table-sm table-hover table-striped o_list_table_ungrouped']//tbody//tr"
      );
      await rowElement.waitFor({ state: 'visible', timeout: 30000 });

      // Get the text from the 6th column of the current row
      const ProductName = this.page.locator(
        "xpath=//table[@class='o_list_table table table-sm table-hover table-striped o_list_table_ungrouped']//tbody//tr//td[3]"
      );
      const ProductNameGet = await ProductName.textContent();

      // Get the text from the 7th column of the current row
      const UoMText = this.page.locator(
        "xpath=//table[@class='o_list_table table table-sm table-hover table-striped o_list_table_ungrouped']//tbody//tr//td[10]"
      );
      const UoMTextGet = await UoMText.textContent();

      const LastCostText = this.page.locator(
        "xpath=//table[@class='o_list_table table table-sm table-hover table-striped o_list_table_ungrouped']//tbody//tr//td[11]"
      );
      const LastCostTextGet = await LastCostText.textContent();

      console.log(`ProductName: ${ProductNameGet} UoM Specifications: ${UoMTextGet} Last Cost: ${LastCostTextGet}`);

      await reportStep(this.page, "Product Master Report clicked successfully", "pass");
    } catch (e) {
      await reportStep(this.page, "Product Master Report clicked not successfully..." + e, "fail");
    }
    return this;
  }
}

module.exports = { InventoryNewProductCreation };
