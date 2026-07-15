const { reportStep } = require('../utils/reportStep');
const { ensureLoggedIn } = require('../utils/loginHelper');

class CustomerCreditMemo {
  constructor(page) {
    this.page = page;

    // Login Page
    this.userName = page.locator("xpath=//input[@id='login']");
    this.passWord = page.locator("xpath=//input[@id='password']");
    this.logIn = page.locator("xpath=//div//button[@type='submit']");

    this.menu = page.locator("xpath=//ul[@class='o_menu_apps']//i[@class='fa fa-bars']");

    this.financialAccountingMenuBtn = page.locator("xpath=//div[contains(text(),'Financial Accounting')]");

    this.accountsReceivableMenuBtn = page.locator("xpath=//span[contains(text(),'Accounts Receivable')]");

    this.creditMemoMenuBtn = page.locator("xpath=//a[normalize-space()='Credit Memo']");

    this.createBtn = page.locator("xpath=//button[normalize-space()='New']");

    this.customerName = page.locator("xpath=//div[@name='partner_id']//input[@type='text']");

    this.customerSearchMore = page.locator("xpath=//a[@id='partner_id_0_0_8']");

    this.customerSearchMoreBox = page.locator("xpath=//input[@placeholder='Search...']");

    // Selectlist
    this.customerSelect = page.locator(
      "xpath=(//table[@class='o_list_table table table-sm table-hover position-relative mb-0 o_list_table_ungrouped table-striped'])[2]//tbody//tr[1]//td[1]"
    );

    // xpath=//div[@name='sales_return_id']//input[@type='text']

    this.matReceipt = page.locator("xpath=//input[@id='sales_return_id_0']");

    // xpath=//li[@class='ui-menu-item']//a[contains(text(),'RTN/00004')]
    this.receiptSelect = page.locator("xpath=//a[@id='sales_return_id_0_0_0']");

    this.shipping_handling = page.locator("xpath=//div[@name='shipping_handling']//input[@type='text']");

    this.insurance = page.locator("xpath=//div[@name='insurance']//input[@type='text']");

    this.total_discount_view = page.locator("xpath=//div[@name='total_discount']//input[@type='text']");

    // xpath=//span[normalize-space()='Post']
    this.postBtn = page.locator("xpath=//span[normalize-space()='Post']");

    this.actionBtn = page.locator("xpath=//button[normalize-space()='Action']");

    this.print = page.locator("xpath=//button[normalize-space()='Print']");

    this.creditMemo = page.locator("xpath=(//span[normalize-space()='Print Credit Memo'])");

    this.saleDiscount = page.locator("xpath=//select[@id='credit_memo_type_0']");

    this.customerName1 = page.locator("xpath=//div[@name='partner_id']//input[@type='text']");

    this.customerSearchMore1 = page.locator("xpath=//a[@id='partner_id_0_0_8']");

    this.customerSearchMoreBox1 = page.locator("xpath=//input[@placeholder='Search...']");

    // Selectlist
    this.customerSelect1 = page.locator(
      "xpath=(//table[@class='o_list_table table table-sm table-hover position-relative mb-0 o_list_table_ungrouped table-striped'])//tbody//tr[1]//td[1]"
    );

    this.invReceipt = page.locator("xpath=//input[@id='invoice_id_0']");

    // xpath=//li[@class='ui-menu-item']//a[contains(text(),'RTN/00004')]
    this.invoiceSelect = page.locator("xpath=//a[@id='invoice_id_0_0_0']");

    this.creditAmt = page.locator("xpath=//input[@id='amount_0']");

    this.action = page.locator("xpath=//button[normalize-space()='Action']");

    this.duplicate = page.locator("xpath=//span[normalize-space()='Duplicate']");

    this.postBtn1 = page.locator("xpath=//span[normalize-space()='Post']");

    this.newBtn = page.locator("xpath=//button[normalize-space()='New']");

    this.others = page.locator("xpath=//select[@id='credit_memo_type_0']");

    this.customerName2 = page.locator("xpath=//div[@name='partner_id']//input[@type='text']");

    this.customerSearchMore2 = page.locator("xpath=//a[@id='partner_id_0_0_8']");

    this.customerSearchMoreBox2 = page.locator("xpath=//input[@placeholder='Search...']");

    // Selectlist
    this.customerSelect2 = page.locator(
      "xpath=(//table[@class='o_list_table table table-sm table-hover position-relative mb-0 o_list_table_ungrouped table-striped'])[2]//tbody//tr[1]//td[1]"
    );

    this.addaLine = page.locator("xpath=//a[normalize-space()='Add a line']");

    this.account = page.locator("xpath=//div[@name='account_id']//input[@type='text']");

    this.accountSelect = page.locator("xpath=//a[@id='autocomplete_0_0']");

    this.amount = page.locator("xpath=(//div[@name='amount']//input[@type='text'])[2]");

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

  async enter_Username(user) {
    try {
      await this.userName.fill(String(user));

      await reportStep(this.page, "username is entered successfully", "pass");
    } catch (e) {
      await reportStep(this.page, "username is not entered successfully..." + e, "fail");
    }
    return this;
  }

  async enter_Password(pass) {
    try {
      await this.passWord.fill(String(pass));

      await reportStep(this.page, "Password is entered successfully", "pass");
    } catch (e) {
      await reportStep(this.page, "Password is not entered successfully..." + e, "fail");
    }
    return this;
  }

  async click_Login_Button() {
    try {
      await this.logIn.click();

      await this.page.waitForTimeout(5000);

      await reportStep(this.page, "login button is clicked successfully", "pass");
    } catch (e) {
      await reportStep(this.page, "login button is not clicked successfully..." + e, "fail");
    }
    return this;
  }

  async click_Menu() {
    try {
      await this.page.waitForTimeout(5000);

      await this.financialAccountingMenuBtn.click({ timeout: 30 * 1000 });
      await this.page.waitForTimeout(5000);

      await reportStep(this.page, "Menu is clicked successfully", "pass");
    } catch (e) {
      await reportStep(this.page, "Menu is not clicked successfully..." + e, "fail");
    }
    return this;
  }

  async click_financialAccountingMenuBtn() {
    try {
      await this.accountsReceivableMenuBtn.click();
      await this.page.waitForTimeout(8000);

      await this.creditMemoMenuBtn.click();
      await this.page.waitForTimeout(2500);

      await reportStep(this.page, "Financial Accounting menu is clicked successfully", "pass");
    } catch (e) {
      await reportStep(this.page, "Financial Accounting menu is not clicked successfully..." + e, "fail");
    }
    return this;
  }

  async click_CreateBtn() {
    try {
      await this.createBtn.click({ timeout: 30 * 1000 });
      await this.page.waitForTimeout(5000);

      await reportStep(this.page, "Create Btn is clicked successfully", "pass");
    } catch (e) {
      await reportStep(this.page, "Create Btn is not clicked successfully..." + e, "fail");
    }
    return this;
  }

  async click_CustomerSelect(CustomerName, shipping, insuranceAmt, discount) {
    try {
      await this.customerName.click();
      await this.page.waitForTimeout(5000);

      await this.customerSearchMore.click();
      await this.page.waitForTimeout(8000);

      await this.customerSearchMoreBox.fill(String(CustomerName));
      await this.customerSearchMoreBox.press('Enter');
      await this.page.waitForTimeout(8000);

      //customerSelect.click();
      await this.customerSelect.evaluate((node) => node.click());
      await this.page.waitForTimeout(5000);

      await this.matReceipt.click();

      await this.page.waitForTimeout(5000);
      await this.receiptSelect.click();
      await this.page.waitForTimeout(2000);

      await this.page.waitForTimeout(2000);
      await this.shipping_handling.click();
      await this.page.waitForTimeout(2000);

      await this.shipping_handling.clear();
      await this.page.waitForTimeout(2000);

      await this.shipping_handling.fill(String(shipping));
      await this.shipping_handling.press('Enter');
      await this.page.waitForTimeout(2000);

      await this.insurance.click();
      await this.page.waitForTimeout(2000);

      await this.insurance.clear();
      await this.page.waitForTimeout(2000);

      await this.insurance.fill(String(insuranceAmt));
      await this.insurance.press('Enter');
      await this.page.waitForTimeout(2000);

      await this.page.waitForTimeout(2000);
      await this.total_discount_view.click();
      await this.page.waitForTimeout(2000);

      await this.total_discount_view.clear();
      await this.page.waitForTimeout(2000);

      await this.total_discount_view.fill(String(discount));
      await this.total_discount_view.press('Enter');
      await this.page.waitForTimeout(2000);

      await this.postBtn.click();
      await this.page.waitForTimeout(5000);
      try {
        const errorMsg = this.page.locator("xpath=//div[@class='o_dialog']//p");
        await errorMsg.waitFor({ state: 'visible', timeout: 5000 });
        const errorMessageText = await errorMsg.textContent();
        console.log('Validation Error Message:', errorMessageText);

        // Dismiss the validation error
        await this.page.locator("xpath=//button[normalize-space()='Close']").click();
        console.log('Validation error dismissed successfully for row ');
        await this.page.waitForTimeout(3000);
      } catch (e) {
        console.log('No validation error for row ');
      }
      await this.actionBtn.click();
      // await this.print.click();
      await this.page.waitForTimeout(3000);
      await this.creditMemo.click();
      await this.page.waitForTimeout(3000);
      await reportStep(this.page, "Payment Creation clicked successfully", "pass");
    } catch (e) {
      await reportStep(this.page, "Payment Creation clicked not successfully..." + e, "fail");
    }
    return this;
  }

  async click_CustomerSelectNegative(CustomerName, shipping, insuranceAmt, discount) {
    try {
      await this.customerName.click();
      await this.page.waitForTimeout(5000);

      await this.customerSearchMore.click();
      await this.page.waitForTimeout(8000);

      await this.customerSearchMoreBox.fill(String(CustomerName));
      await this.customerSearchMoreBox.press('Enter');
      await this.page.waitForTimeout(8000);

      //customerSelect.click();
      await this.customerSelect.evaluate((node) => node.click());
      await this.page.waitForTimeout(5000);

      await this.matReceipt.click();

      await this.page.waitForTimeout(5000);
      await this.receiptSelect.click();
      await this.page.waitForTimeout(2000);

      await this.page.waitForTimeout(2000);
      await this.shipping_handling.click();
      await this.page.waitForTimeout(2000);

      await this.shipping_handling.clear();
      await this.page.waitForTimeout(2000);

      await this.shipping_handling.fill(String(shipping));
      await this.shipping_handling.press('Enter');
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

      await this.insurance.click();
      await this.page.waitForTimeout(2000);

      await this.insurance.clear();
      await this.page.waitForTimeout(2000);

      await this.insurance.fill(String(insuranceAmt));
      await this.insurance.press('Enter');
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

      await this.page.waitForTimeout(2000);
      await this.total_discount_view.click();
      await this.page.waitForTimeout(2000);

      await this.total_discount_view.clear();
      await this.page.waitForTimeout(2000);

      await this.total_discount_view.fill(String(discount));
      await this.total_discount_view.press('Enter');
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

      await this.postBtn.click();
      await this.page.waitForTimeout(5000);
      await this.actionBtn.click();
      // await this.print.click();
      // await this.page.waitForTimeout(3000);
      await this.creditMemo.click();
      await this.page.waitForTimeout(3000);
      await reportStep(this.page, "Payment Creation clicked successfully", "pass");
    } catch (e) {
      await reportStep(this.page, "Payment Creation clicked not successfully..." + e, "fail");
    }
    return this;
  }

  async click_SaleDiscount(CustomerName, Amt) {
    try {
      await this.page.waitForTimeout(5000);
      await this.action.click();
      await this.page.waitForTimeout(3000);
      await this.duplicate.click();
      await this.page.waitForTimeout(3000);

      await this.saleDiscount.selectOption({ label: 'Sales Discount' });
      await this.page.waitForTimeout(5000);
      await this.customerName1.click();
      await this.page.waitForTimeout(5000);

      await this.customerSearchMore1.click();
      await this.page.waitForTimeout(5000);

      await this.customerSearchMoreBox1.fill(String(CustomerName));
      await this.customerSearchMoreBox1.press('Enter');
      await this.page.waitForTimeout(5000);

      //customerSelect1.click();
      await this.customerSelect1.evaluate((node) => node.click());
      await this.page.waitForTimeout(5000);

      await this.invReceipt.click();
      await this.page.waitForTimeout(2000);
      await this.invoiceSelect.click();
      await this.page.waitForTimeout(2000);
      await this.creditAmt.clear();
      await this.creditAmt.fill(String(Amt));
      await this.page.waitForTimeout(2000);
      await this.postBtn1.click();
      await this.page.waitForTimeout(2000);

      await reportStep(this.page, "SaleDiscount Creation clicked successfully", "pass");
    } catch (e) {
      await reportStep(this.page, "SaleDiscount Creation clicked not successfully..." + e, "fail");
    }
    return this;
  }

  async click_SaleDiscountNegative(CustomerName, Amt) {
    try {
      await this.page.waitForTimeout(5000);
      await this.action.click();
      await this.page.waitForTimeout(3000);
      await this.duplicate.click();
      await this.page.waitForTimeout(3000);

      await this.saleDiscount.selectOption({ label: 'Sales Discount' });
      await this.page.waitForTimeout(5000);
      await this.customerName1.click();
      await this.page.waitForTimeout(5000);

      await this.customerSearchMore1.click();
      await this.page.waitForTimeout(5000);

      await this.customerSearchMoreBox1.fill(String(CustomerName));
      await this.customerSearchMoreBox1.press('Enter');
      await this.page.waitForTimeout(5000);

      //customerSelect1.click();
      await this.customerSelect1.evaluate((node) => node.click());
      await this.page.waitForTimeout(5000);

      await this.invReceipt.click();
      await this.page.waitForTimeout(2000);
      await this.invoiceSelect.click();
      await this.page.waitForTimeout(2000);
      await this.creditAmt.clear();
      await this.creditAmt.fill(String(Amt));
      await this.page.waitForTimeout(2000);
      await this.postBtn1.click();
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

      await reportStep(this.page, "SaleDiscount Creation clicked successfully", "pass");
    } catch (e) {
      await reportStep(this.page, "SaleDiscount Creation clicked not successfully..." + e, "fail");
    }
    return this;
  }

  async click_Others(CustomerName, amt) {
    try {
      await this.page.waitForTimeout(5000);
      await this.newBtn.click();
      await this.page.waitForTimeout(3000);

      await this.others.selectOption({ label: 'Others' });
      await this.page.waitForTimeout(5000);
      await this.customerName2.click();
      await this.page.waitForTimeout(5000);

      await this.customerSearchMore2.click();
      await this.page.waitForTimeout(5000);

      await this.customerSearchMoreBox2.fill(String(CustomerName));
      await this.customerSearchMoreBox2.press('Enter');
      await this.page.waitForTimeout(5000);

      //customerSelect1.click();
      await this.customerSelect2.evaluate((node) => node.click());
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
      await this.cancelEntry.click();
      await this.page.waitForTimeout(2000);
      await this.action1.click();
      await this.delete.click();
      await this.page.waitForTimeout(2000);
      await this.confirmDelete.click();

      await this.page.waitForTimeout(2000);
      await reportStep(this.page, "Others Creation clicked successfully", "pass");
    } catch (e) {
      await reportStep(this.page, "Others Creation clicked not successfully..." + e, "fail");
    }
    return this;
  }

  async click_OthersNegative(CustomerName, amt) {
    try {
      await this.page.waitForTimeout(5000);
      await this.newBtn.click();
      await this.page.waitForTimeout(3000);

      await this.others.selectOption({ label: 'Others' });
      await this.page.waitForTimeout(5000);
      await this.customerName2.click();
      await this.page.waitForTimeout(5000);

      await this.customerSearchMore2.click();
      await this.page.waitForTimeout(5000);

      await this.customerSearchMoreBox2.fill(String(CustomerName));
      await this.customerSearchMoreBox2.press('Enter');
      await this.page.waitForTimeout(5000);

      //customerSelect1.click();
      await this.customerSelect2.evaluate((node) => node.click());
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
      await this.cancelEntry.click();
      await this.page.waitForTimeout(2000);
      await this.action1.click();
      await this.delete.click();
      await this.page.waitForTimeout(2000);
      await this.confirmDelete.click();

      await this.page.waitForTimeout(2000);
      await reportStep(this.page, "Others Creation clicked successfully", "pass");
    } catch (e) {
      await reportStep(this.page, "Others Creation clicked not successfully..." + e, "fail");
    }
    return this;
  }
}

module.exports = { CustomerCreditMemo };
