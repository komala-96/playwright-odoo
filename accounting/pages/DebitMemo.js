const { expect } = require('../fixtures/base');
const { reportStep } = require('../utils/reportStep');
const { ensureLoggedIn } = require('../utils/loginHelper');

class DebitMemo {
  constructor(page) {
    this.page = page;

    // Login Page
    this.userName = page.locator("xpath=//input[@id='login']");
    this.passWord = page.locator("xpath=//input[@id='password']");
    this.logIn = page.locator("xpath=//button[contains(text(),'Log in')]");

    // Menu
    this.menu = page.locator("xpath=//ul[@class='o_menu_apps']//i[@class='fa fa-bars']");

    // FinancialAcct
    this.financialAcct = page.locator("xpath=//div[contains(text(),'Financial Accounting')]");

    this.accounts_PayableMenu = page.locator("xpath=//span[contains(text(),'Accounts Payable')]");

    this.debit_Memo = page.locator("xpath=//a[normalize-space()='Debit Memo']");

    // Invoice
    this.debitMemo_CreateBtn = page.locator("xpath=//button[normalize-space()='New']");

    this.vendor = page.locator("xpath=//div[@name='partner_id']//input[@type='text']");

    this.vendorSearchMore = page.locator("xpath=//a[@id='partner_id_0_0_8']");

    this.vendorSearchMoreBox = page.locator("xpath=//input[@placeholder='Search...']");

    // Selectlist
    this.vendorSelect = page.locator(
      "xpath=(//table[@class='o_list_table table table-sm table-hover position-relative mb-0 o_list_table_ungrouped table-striped']//tbody//tr[1]//td[1])[2]"
    );

    this.material_Issue = page.locator("xpath=//input[@id='material_issue_id_0']");

    this.material_Issue_Select = page.locator("xpath=//a[@id='material_issue_id_0_0_0']");

    this.shipping_handling = page.locator("xpath=//div[@name='shipping_handling']//input[@type='text']");

    this.tax_amount_view = page.locator("xpath=//div[@name='tax_amount_view']//input[@type='text']");

    this.insurance = page.locator("xpath=//div[@name='insurance']//input[@type='text']");

    this.total_discount_view = page.locator("xpath=//div[@name='total_discount']//input[@type='text']");

    this.postBtn = page.locator("xpath=//span[normalize-space()='Post']");

    this.actionBtn = page.locator("xpath=//button[normalize-space()='Action']");

    this.print = page.locator("xpath=//button[normalize-space()='Print']");

    this.creditMemo = page.locator("xpath=(//span[normalize-space()='Print Debit Memo'])");

    this.shipping_handling_Get = page.locator("xpath=//div[@name='shipping_handling']");

    this.tax_amount_view_Get = page.locator("xpath=//div[@name='tax_amount_view']");

    this.insurance_Get = page.locator("xpath=//div[@name='insurance']");

    this.total_discount_Get = page.locator("xpath=//div[@name='total_discount']");

    this.total_Get = page.locator("xpath=//div[@name='amount_total_view']");

    this.saveBtn = page.locator("xpath=//button[contains(text(),'Save')]");

    this.demoMemo_No = page.locator("xpath=//div[@name='name']");

    this.demoMemo_Type = page.locator("xpath=//div[@name='debit_memo_type']");

    this.demoMemo_Date = page.locator("xpath=//div[@name='debit_memo_date']");

    this.material_issue_Get = page.locator("xpath=//input[@id='material_issue_id_0']");

    this.purchaseDiscount = page.locator("xpath=//select[@id='debit_memo_type_0']");

    this.purchaseReceipt = page.locator("xpath=//input[@id='bill_id_0']");

    // li[@class='ui-menu-item']//a[contains(text(),'RTN/00004')]
    this.receiptSelect = page.locator("xpath=//a[@id='bill_id_0_0_2']");

    this.debitAmt = page.locator("xpath=//input[@id='debit_memo_amount_0']");

    this.createBtn = page.locator("xpath=//button[normalize-space()='New']");

    this.vendor1 = page.locator("xpath=//div[@name='partner_id']//input[@type='text']");

    this.vendorSearchMore1 = page.locator("xpath=//a[@id='partner_id_0_0_8']");

    this.vendorSearchMoreBox1 = page.locator("xpath=//input[@placeholder='Search...']");

    // Selectlist
    this.vendorSelect1 = page.locator(
      "xpath=(//table[@class='o_list_table table table-sm table-hover position-relative mb-0 o_list_table_ungrouped table-striped']//tbody//tr[1]//td[1])"
    );

    this.postBtn1 = page.locator("xpath=//span[normalize-space()='Post']");

    this.newBtn = page.locator("xpath=//button[normalize-space()='New']");

    this.others = page.locator("xpath=//select[@id='debit_memo_type_0']");

    this.vendor2 = page.locator("xpath=//div[@name='partner_id']//input[@type='text']");

    this.vendorSearchMore2 = page.locator("xpath=//a[@id='partner_id_0_0_8']");

    this.vendorSearchMoreBox2 = page.locator("xpath=//input[@placeholder='Search...']");

    // Selectlist
    this.vendorSelect2 = page.locator(
      "xpath=(//table[@class='o_list_table table table-sm table-hover position-relative mb-0 o_list_table_ungrouped table-striped']//tbody//tr[1]//td[1])[2]"
    );

    this.addaLine = page.locator("xpath=//a[normalize-space()='Add a line']");

    this.account = page.locator("xpath=//div[@name='account_id']//input[@type='text']");

    this.accountSelect = page.locator("xpath=//a[@id='autocomplete_0_0']");

    this.amount = page.locator(
      "xpath=//table[@class='o_list_table table table-sm table-hover position-relative mb-0 o_list_table_ungrouped table-striped']//tbody//tr[1]//td[@name='amount']//input"
    );

    this.save = page.locator("xpath=//button[normalize-space()='Save']");

    this.cancelEntry = page.locator("xpath=//button[normalize-space()='Cancel Entry']");

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

      await reportStep(this.page, "Username is entered successfully", "pass");
    } catch (e) {
      await reportStep(this.page, "Username is not entered successfully..." + e, "fail");
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
      await reportStep(this.page, "Login button is clicked successfully", "pass");
    } catch (e) {
      await reportStep(this.page, "Login button is not clicked successfully..." + e, "fail");
    }
    return this;
  }

  async clickMenuButton() {
    try {
      await this.menu.click({ timeout: 30 * 1000 });
      await this.page.waitForTimeout(5000);

      await reportStep(this.page, "Menu Button is clicked successfully", "pass");
    } catch (e) {
      await reportStep(this.page, "Menu Button is not clicked successfully..." + e, "fail");
    }
    return this;
  }

  async clickFinancialAcctMenu() {
    try {
      await this.financialAcct.click({ timeout: 50 * 1000 });
      await this.page.waitForTimeout(15000);

      await reportStep(this.page, "Financial Acct Menu is clicked successfully", "pass");
    } catch (e) {
      await reportStep(this.page, "Financial Acct Menu is not clicked successfully..." + e, "fail");
    }
    return this;
  }

  async clickDebitMemo() {
    try {
      await this.accounts_PayableMenu.click({ timeout: 50 * 1000 });
      await this.page.waitForTimeout(15000);

      await this.debit_Memo.click();
      await this.page.waitForTimeout(5000);

      await reportStep(this.page, "Debit Memo Menu is clicked successfully", "pass");
    } catch (e) {
      await reportStep(this.page, "Debit Memo Menu is not clicked successfully..." + e, "fail");
    }
    return this;
  }

  async clickVendorName(vendorName) {
    try {
      await this.debitMemo_CreateBtn.click();
      await this.page.waitForTimeout(10000);
      await this.vendor.click();
      await this.page.waitForTimeout(5000);

      await this.vendorSearchMore.click();
      await this.page.waitForTimeout(5000);

      await this.vendorSearchMoreBox.click();
      await this.page.waitForTimeout(5000);

      await this.vendorSearchMoreBox.fill(String(vendorName));
      await this.vendorSearchMoreBox.press('Enter');
      await this.page.waitForTimeout(8000);

      await this.vendorSelect.click();
      await this.page.waitForTimeout(5000);

      await reportStep(this.page, "Customer Name is clicked successfully", "pass");
    } catch (e) {
      await reportStep(this.page, "Customer Name is not clicked successfully..." + e, "fail");
    }
    return this;
  }

  async clickMaterial_Issue() {
    try {
      await this.material_Issue.click();
      await this.page.waitForTimeout(5000);

      await this.material_Issue_Select.click();
      await this.page.waitForTimeout(5000);

      await reportStep(this.page, "material_Issue is clicked successfully", "pass");
    } catch (e) {
      await reportStep(this.page, "material_Issue is not clicked successfully..." + e, "fail");
    }
    return this;
  }

  async clickTaxUpdate(shipping, tax, insuranceAmt, discount) {
    try {
      await this.page.waitForTimeout(5000);
      await this.shipping_handling.click();
      await this.page.waitForTimeout(5000);

      await this.shipping_handling.clear();
      await this.page.waitForTimeout(5000);

      await this.shipping_handling.fill(String(shipping));
      await this.shipping_handling.press('Enter');
      await this.page.waitForTimeout(5000);

      /*Thread.sleep(5000);
      tax_amount_view.click();
      Thread.sleep(5000);

      tax_amount_view.clear();
      Thread.sleep(5000);

      tax_amount_view.sendKeys(tax +Keys.ENTER);
      Thread.sleep(5000);*/

      await this.page.waitForTimeout(5000);
      await this.insurance.click();
      await this.page.waitForTimeout(5000);

      await this.insurance.clear();
      await this.page.waitForTimeout(5000);

      await this.insurance.fill(String(insuranceAmt));
      await this.insurance.press('Enter');
      await this.page.waitForTimeout(5000);

      await this.page.waitForTimeout(5000);
      await this.total_discount_view.click();
      await this.page.waitForTimeout(5000);

      await this.total_discount_view.clear();
      await this.page.waitForTimeout(5000);

      await this.total_discount_view.fill(String(discount));
      await this.total_discount_view.press('Enter');
      await this.page.waitForTimeout(5000);

      await reportStep(this.page, "Tax Update is clicked successfully", "pass");
    } catch (e) {
      await reportStep(this.page, "Tax Update is not clicked successfully " + e.message, "fail");
    }
    return this;
  }

  async clickTaxUpdateNegative(shipping, tax, insuranceAmt, discount) {
    try {
      await this.page.waitForTimeout(5000);
      await this.shipping_handling.click();
      await this.page.waitForTimeout(5000);

      await this.shipping_handling.clear();
      await this.page.waitForTimeout(5000);

      await this.shipping_handling.fill(String(shipping));
      await this.shipping_handling.press('Enter');
      await this.page.waitForTimeout(5000);
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

      await this.page.waitForTimeout(5000);
      /*tax_amount_view.click();
      Thread.sleep(5000);

      tax_amount_view.clear();
      Thread.sleep(5000);

      tax_amount_view.sendKeys(tax +Keys.ENTER);
      Thread.sleep(5000);
       try {

         WebDriverWait wait = new WebDriverWait(driver, Duration.ofSeconds(30));
                WebElement errorMsg = wait.until(ExpectedConditions.visibilityOfElementLocated(
                        By.xpath("//div[@class='o_dialog']//p")));
                String errorMessageText = errorMsg.getText();
                System.out.println("Validation Error Message: " + errorMessageText);

                // Dismiss the validation error
                WebElement errorMsgOk = driver.findElement(By.xpath("//button[normalize-space()='Close']"));
                errorMsgOk.click();
                System.out.println("Validation error dismissed successfully for row ");
                Thread.sleep(3000);
            } catch (TimeoutException e) {
                System.out.println("No validation error for row " );
            }*/

      await this.page.waitForTimeout(5000);
      await this.insurance.click();
      await this.page.waitForTimeout(5000);

      await this.insurance.clear();
      await this.page.waitForTimeout(5000);

      await this.insurance.fill(String(insuranceAmt));
      await this.insurance.press('Enter');
      await this.page.waitForTimeout(5000);
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

      await this.page.waitForTimeout(5000);
      await this.total_discount_view.click();
      await this.page.waitForTimeout(5000);

      await this.total_discount_view.clear();
      await this.page.waitForTimeout(5000);

      await this.total_discount_view.fill(String(discount));
      await this.total_discount_view.press('Enter');
      await this.page.waitForTimeout(5000);
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

      await reportStep(this.page, "Tax Update is clicked successfully", "pass");
    } catch (e) {
      await reportStep(this.page, "Tax Update is not clicked successfully " + e.message, "fail");
    }
    return this;
  }

  async clickPostbtn() {
    try {
      await this.postBtn.click({ timeout: 30 * 1000 });
      await this.page.waitForTimeout(15000);

      await reportStep(this.page, "Post button is clicked successfully", "pass");
    } catch (e) {
      await reportStep(this.page, "Post button is not clicked successfully..." + e, "fail");
    }
    return this;
  }

  async getTheTotal() {
    try {
      const shipping_handling_GetText = await this.shipping_handling_Get.textContent();
      console.log('Shipping_handling :', shipping_handling_GetText);
      console.log('=========================');
      await this.page.waitForTimeout(5000);

      const tax_amount_view_GetText = await this.tax_amount_view_Get.textContent();
      console.log('Tax_Amount :', tax_amount_view_GetText);
      console.log('=========================');
      await this.page.waitForTimeout(5000);

      const Insurance_GetText = await this.insurance_Get.textContent();
      console.log('Insurance :', Insurance_GetText);
      console.log('=========================');
      await this.page.waitForTimeout(5000);

      const total_discount_GetText = await this.total_discount_Get.textContent();
      console.log('Discount :', total_discount_GetText);
      console.log('=========================');
      await this.page.waitForTimeout(5000);

      const total_GetText = await this.total_Get.textContent();
      console.log('Total :', total_GetText);
      console.log('=========================');
      await this.page.waitForTimeout(5000);
      await this.actionBtn.click();
      //print.click();
      await this.page.waitForTimeout(3000);
      await this.creditMemo.click();
      await this.page.waitForTimeout(3000);

      await reportStep(this.page, "get The Total is clicked successfully", "pass");
    } catch (e) {
      await reportStep(this.page, "get The Total is not clicked successfully..." + e, "fail");
    }
    return this;
  }

  async clickSaveButton() {
    try {
      await this.saveBtn.click();
      await this.page.waitForTimeout(15000);
      await reportStep(this.page, "Save button is clicked successfully", "pass");
    } catch (e) {
      await reportStep(this.page, "Save button is not clicked successfully..." + e, "fail");
    }
    return this;
  }

  async clickDemoMemoDetails() {
    try {
      const demoMemo_NoText = await this.demoMemo_No.textContent();
      console.log('demoMemo_No :', demoMemo_NoText);
      console.log('=========================');
      await this.page.waitForTimeout(5000);

      const demoMemo_TypeText = await this.demoMemo_Type.textContent();
      console.log('demoMemo_Type :', demoMemo_TypeText);
      console.log('=========================');
      await this.page.waitForTimeout(5000);

      const demoMemo_DateText = await this.demoMemo_Date.textContent();
      console.log('demoMemo_Date :', demoMemo_DateText);
      console.log('=========================');
      await this.page.waitForTimeout(5000);

      const material_issue_GetText = await this.material_issue_Get.inputValue();
      console.log('material_issue_Get :', material_issue_GetText);
      console.log('=========================');
      await this.page.waitForTimeout(5000);

      await reportStep(this.page, "Demo Memo Details is Get successfully", "pass");
    } catch (e) {
      await reportStep(this.page, "Demo Memo Details is not Get successfully..." + e, "fail");
    }
    return this;
  }

  async click_PurchaseDiscount(vendorName, amt) {
    try {
      await this.createBtn.click();
      await this.page.waitForTimeout(5000);

      //saleDiscount.click();
      await this.purchaseDiscount.selectOption({ label: 'Purchase Discount' });
      await this.page.waitForTimeout(5000);
      await this.vendor1.click();
      await this.page.waitForTimeout(5000);

      await this.vendorSearchMore1.click();
      await this.page.waitForTimeout(5000);

      await this.vendorSearchMoreBox1.click();
      await this.page.waitForTimeout(5000);

      await this.vendorSearchMoreBox1.fill(String(vendorName));
      await this.vendorSearchMoreBox1.press('Enter');
      await this.page.waitForTimeout(8000);

      await this.vendorSelect1.click();
      await this.page.waitForTimeout(5000);

      await this.purchaseReceipt.click();
      await this.page.waitForTimeout(2000);
      await this.receiptSelect.click();
      await this.page.waitForTimeout(2000);
      await this.debitAmt.clear();
      await this.debitAmt.fill(String(amt));
      await this.postBtn1.click();

      await reportStep(this.page, "Purchase Discount Creation clicked successfully", "pass");
    } catch (e) {
      await reportStep(this.page, "Purchase Discount clicked not successfully..." + e, "fail");
    }
    return this;
  }

  async click_PurchaseDiscountNegative(vendorName, amt) {
    try {
      await this.createBtn.click();
      await this.page.waitForTimeout(5000);

      //saleDiscount.click();
      await this.purchaseDiscount.selectOption({ label: 'Purchase Discount' });
      await this.page.waitForTimeout(5000);
      await this.vendor1.click();
      await this.page.waitForTimeout(5000);

      await this.vendorSearchMore1.click();
      await this.page.waitForTimeout(5000);

      await this.vendorSearchMoreBox1.click();
      await this.page.waitForTimeout(5000);

      await this.vendorSearchMoreBox1.fill(String(vendorName));
      await this.vendorSearchMoreBox1.press('Enter');
      await this.page.waitForTimeout(8000);

      await this.vendorSelect1.click();
      await this.page.waitForTimeout(5000);

      await this.purchaseReceipt.click();
      await this.page.waitForTimeout(2000);
      await this.receiptSelect.click();
      await this.page.waitForTimeout(2000);
      await this.debitAmt.clear();
      await this.debitAmt.fill(String(amt));
      await this.page.waitForTimeout(2000);
      await this.postBtn1.click();
      await this.page.waitForTimeout(3000);
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

      await reportStep(this.page, "Purchase Discount Creation clicked successfully", "pass");
    } catch (e) {
      await reportStep(this.page, "Purchase Discount clicked not successfully..." + e, "fail");
    }
    return this;
  }

  async click_Others(vendorName, amt) {
    try {
      await this.page.waitForTimeout(5000);
      await this.newBtn.click();
      await this.page.waitForTimeout(3000);

      await this.others.selectOption({ label: 'Others' });
      await this.page.waitForTimeout(5000);
      await this.vendor2.click();
      await this.page.waitForTimeout(5000);

      await this.vendorSearchMore2.click();
      await this.page.waitForTimeout(5000);

      await this.vendorSearchMoreBox2.click();
      await this.page.waitForTimeout(5000);

      await this.vendorSearchMoreBox2.fill(String(vendorName));
      await this.vendorSearchMoreBox2.press('Enter');
      await this.page.waitForTimeout(8000);

      await this.vendorSelect2.click();
      await this.page.waitForTimeout(5000);

      await this.addaLine.click();
      await this.page.waitForTimeout(2000);
      await this.account.click();
      await this.page.waitForTimeout(2000);
      await this.accountSelect.click();
      await this.page.waitForTimeout(2000);
      await this.amount.clear();
      await this.amount.fill(String(amt));
      await this.page.waitForTimeout(2000);
      await this.save.click();
      await this.page.waitForTimeout(2000);
      //cancelEntry.click();
      await this.page.waitForTimeout(2000);
      await this.action1.click();
      await this.delete.click();
      await this.page.waitForTimeout(2000);
      await this.confirmDelete.click();

      await this.page.waitForTimeout(2000);
      await reportStep(this.page, "Other type Creation clicked successfully", "pass");
    } catch (e) {
      await reportStep(this.page, "Other type Creation clicked not successfully..." + e, "fail");
    }
    return this;
  }

  async click_OthersNegative(vendorName, amt) {
    try {
      await this.page.waitForTimeout(5000);
      await this.newBtn.click();
      await this.page.waitForTimeout(3000);

      await this.others.selectOption({ label: 'Others' });
      await this.page.waitForTimeout(5000);
      await this.vendor2.click();
      await this.page.waitForTimeout(5000);

      await this.vendorSearchMore2.click();
      await this.page.waitForTimeout(5000);

      await this.vendorSearchMoreBox2.click();
      await this.page.waitForTimeout(5000);

      await this.vendorSearchMoreBox2.fill(String(vendorName));
      await this.vendorSearchMoreBox2.press('Enter');
      await this.page.waitForTimeout(8000);

      await this.vendorSelect2.click();
      await this.page.waitForTimeout(5000);

      await this.addaLine.click();
      await this.page.waitForTimeout(2000);
      await this.account.click();
      await this.page.waitForTimeout(2000);
      await this.accountSelect.click();
      await this.page.waitForTimeout(2000);
      await this.amount.clear();
      await this.amount.fill(String(amt));

      await this.page.waitForTimeout(2000);
      await this.save.click();
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
      //cancelEntry.click();
      await this.page.waitForTimeout(2000);
      await this.action1.click();
      await this.delete.click();
      await this.page.waitForTimeout(2000);
      await this.confirmDelete.click();

      await this.page.waitForTimeout(2000);
      await reportStep(this.page, "Other type Creation clicked successfully", "pass");
    } catch (e) {
      await reportStep(this.page, "Other type Creation clicked not successfully..." + e, "fail");
    }
    return this;
  }
}

module.exports = { DebitMemo };
