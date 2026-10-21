const { expect } = require('../fixtures/base');
const { reportStep } = require('../utils/reportStep');
const { ensureLoggedIn } = require('../utils/loginHelper');

class CustomerPaymentReceipt {
  constructor(page) {
    this.page = page;

    // Login Page
    this.userName = page.locator("xpath=//input[@id='login']");
    this.passWord = page.locator("xpath=//input[@id='password']");
    this.logIn = page.locator("xpath=//div//button[@type='submit']");

    this.menu = page.locator("xpath=//ul[@class='o_menu_apps']//i[@class='fa fa-bars']");

    this.financialAccountingMenuBtn = page.locator("xpath=//div[contains(text(),'Financial Accounting')]");

    this.accountsReceivableMenuBtn = page.locator("xpath=//span[contains(text(),'Accounts Receivable')]");

    this.paymentReceiptMenuBtn = page.locator("xpath=//a[normalize-space()='Payment Receipt']");

    this.createBtn = page.locator("xpath=//button[normalize-space()='New']");

    this.customerName = page.locator("xpath=//div[@name='partner_id']//input[@type='text']");

    this.customerSearchMore = page.locator("xpath=//a[@id='partner_id_0_0_8']");

    this.customerSearchMoreBox = page.locator("xpath=//input[@placeholder='Search...']");

    // Selectlist
    this.customerSelect = page.locator(
      "xpath=(//table[@class='o_list_table table table-sm table-hover position-relative mb-0 o_list_table_ungrouped table-striped']//tbody//tr[1]//td[1])[2]"
    );

    this.customerSearchMore1 = page.locator("xpath=//a[@id='partner_id_0_0_8']");

    this.customerSearchMoreBox1 = page.locator("xpath=//input[@placeholder='Search...']");

    // Selectlist
    this.customerSelect1 = page.locator(
      "xpath=(//table[@class='o_list_table table table-sm table-hover position-relative mb-0 o_list_table_ungrouped table-striped']//tbody//tr[1]//td[1])[2]"
    );

    this.modeOfPayment = page.locator("xpath=//select[@id='payment_mode_id_0']");

    this.modeOfPayment1 = page.locator("xpath=//select[@id='payment_mode_id_0']");

    this.checkNo = page.locator("xpath=//input[@name='check_no']");

    this.creditCardNo = page.locator("xpath=//input[@id='card_number_0']");

    this.refNo = page.locator("xpath=//input[@id='reference_no_0']");

    this.invoiceSelect = page.locator(
      "xpath=//table[@class='o_list_table table table-sm table-hover position-relative mb-0 o_list_table_ungrouped table-striped']//tbody//tr[1]//td[1]"
    );

    this.invoiceBox = page.locator(
      "xpath=//table[@class='o_list_table table table-sm table-hover position-relative mb-0 o_list_table_ungrouped table-striped']//tbody//tr[1]//td[1]//input[@type='checkbox']"
    );

    this.selectALLBox1 = page.locator("xpath=//div[@name='add_select_all']//input[@type='checkbox']");

    this.amount = page.locator("xpath=//input[@id='amount_0']");

    // 101401 Bank 1 select option
    this.depositTo = page.locator("xpath=//select[@id='account_id_0']");

    this.customerBalance = page.locator("xpath=//div[@name='invoice_balance']");

    this.advanceBalance = page.locator("xpath=//div[@name='cust_advance_balance']");

    // NOTE: the Java source has both a `saveBtn` field and a `saveBtn()` method — legal
    // in Java (separate namespaces) but not in JS, since an instance property would shadow
    // a same-named prototype method. The locator is named `saveButton` here instead.
    this.saveButton = page.locator("xpath=//span[normalize-space()='Confirm']");

    this.unapplied_amount = page.locator("xpath=//div[@name='unapplied_amount']");

    // //div[@role='menu']//a[contains(text(),'Payment Receipt')]

    this.actionBtn = page.locator("xpath=//button[normalize-space()='Action']");

    this.clickReceipt = page.locator("xpath=//span[normalize-space()='Payment Receipt']");

    this.actionBtn1 = page.locator("xpath=//button[normalize-space()='Action']");

    this.clickDuplicate = page.locator("xpath=//span[normalize-space()='Duplicate']");

    this.okBtn = page.locator("xpath=(//button[@class='btn btn-primary'])[1]");

    this.customerName1 = page.locator("xpath=//div[@name='partner_id']//input[@type='text']");

    this.invoiceSelect1 = page.locator(
      "xpath=//table[@class='o_list_table table table-sm table-hover position-relative mb-0 o_list_table_ungrouped table-striped']//tbody//tr[1]//td[1]"
    );

    this.amount1 = page.locator("xpath=//input[@id='amount_0']");

    this.saveBtn1 = page.locator("xpath=//span[normalize-space()='Confirm']");
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
      await this.menu.click({ timeout: 30 * 1000 });
      await this.page.waitForTimeout(5000);

      await reportStep(this.page, "Menu is clicked successfully", "pass");
    } catch (e) {
      await reportStep(this.page, "Menu is not clicked successfully..." + e, "fail");
    }
    return this;
  }

  async click_FinancialAccountingMenuBtn() {
    try {
      await this.financialAccountingMenuBtn.click({ timeout: 30 * 1000 });
      await this.page.waitForTimeout(5000);

      await this.accountsReceivableMenuBtn.click();
      await this.page.waitForTimeout(5000);

      await this.paymentReceiptMenuBtn.click();
      await this.page.waitForTimeout(5000);

      await reportStep(this.page, "Financial Accounting menu is clicked successfully", "pass");
    } catch (e) {
      await reportStep(this.page, "Financial Accounting menu is not clicked successfully..." + e, "fail");
    }
    return this;
  }

  async click_CustomerName(cusName) {
    try {
      await this.createBtn.click({ timeout: 30 * 1000 });
      await this.page.waitForTimeout(8000);

      await this.customerName.click();
      await this.page.waitForTimeout(8000);

      await this.customerSearchMore.click();
      await this.page.waitForTimeout(5000);

      await this.customerSearchMoreBox.fill(String(cusName));
      await this.customerSearchMoreBox.press('Enter');
      await this.page.waitForTimeout(5000);

      await this.customerSelect.evaluate((node) => node.click());
      await this.page.waitForTimeout(5000);

      await reportStep(this.page, "click Creation is clicked successfully", "pass");
    } catch (e) {
      await reportStep(this.page, "click Creation is not clicked successfully..." + e, "fail");
    }
    return this;
  }

  async clickModeOfPayment() {
    try {
      await this.modeOfPayment.click();
      // Selects the second option (index 1)
      await this.modeOfPayment.selectOption({ index: 3 });
      await this.page.waitForTimeout(3000);

      await reportStep(this.page, "Mode Of Payment is clicked successfully", "pass");
    } catch (e) {
      await reportStep(this.page, "Mode Of Payment is not clicked successfully..." + e, "fail");
    }
    return this;
  }

  async click_CardNo(cardNum) {
    try {
      await this.creditCardNo.fill(String(cardNum));
      //await this.page.waitForTimeout(5000);

      await this.invoiceSelect.click();
      await this.page.waitForTimeout(5000);

      //await this.invoiceBox.evaluate((node) => node.click());
      //await this.page.waitForTimeout(5000);

      //await this.selectALLBox.evaluate((node) => node.click());
      //await this.page.waitForTimeout(3000);

      await reportStep(this.page, "Check No is clicked successfully", "pass");
    } catch (e) {
      await reportStep(this.page, "Check No is not clicked not successfully..." + e, "fail");
    }
    return this;
  }

  async click_CardNoNegative(cardNum) {
    try {
      await this.creditCardNo.fill(String(cardNum));
      await this.creditCardNo.press('Enter');
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
      //await this.page.waitForTimeout(5000);

      await this.invoiceSelect.click();
      await this.page.waitForTimeout(5000);

      //await this.invoiceBox.evaluate((node) => node.click());
      //await this.page.waitForTimeout(5000);

      //await this.selectALLBox.evaluate((node) => node.click());
      //await this.page.waitForTimeout(3000);

      await reportStep(this.page, "Check No is clicked successfully", "pass");
    } catch (e) {
      await reportStep(this.page, "Check No is not clicked not successfully..." + e, "fail");
    }
    return this;
  }

  async click_Amount(amt) {
    try {
      await this.amount.clear();
      await this.page.waitForTimeout(5000);

      await this.amount.fill(String(amt));
      await this.page.waitForTimeout(5000);

      await reportStep(this.page, "Amount is clicked successfully", "pass");
    } catch (e) {
      await reportStep(this.page, "Amount is not clicked successfully..." + e, "fail");
    }
    return this;
  }

  async click_AmountNegative(amt) {
    try {
      await this.amount.clear();
      await this.page.waitForTimeout(5000);

      await this.amount.fill(String(amt));
      await this.amount.press('Enter');
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

      await reportStep(this.page, "Amount is clicked successfully", "pass");
    } catch (e) {
      await reportStep(this.page, "Amount is not clicked successfully..." + e, "fail");
    }
    return this;
  }

  async click_Deposit_To() {
    try {
      await this.depositTo.click();
      await this.page.waitForTimeout(5000);
      // Selects the second option (index 1)
      await this.depositTo.selectOption({ index: 1 });
      await this.page.waitForTimeout(5000);
      /*try {

      // Dismiss the validation error
      const errorMsgOk = this.page.locator("xpath=//button[normalize-space()='OK']");
      await errorMsgOk.click();
      console.log('Validation error dismissed successfully for row ');
      await this.page.waitForTimeout(3000);
      } catch (e) {


      await reportStep(this.page, "save Button is clicked successfully", "pass");

      }*/

      await reportStep(this.page, "Deposit_To is clicked successfully", "pass");
    } catch (e) {
      await reportStep(this.page, "Deposit_To is not clicked successfully..." + e, "fail");
    }
    return this;
  }

  async click_CustomerBalance() {
    try {
      const customerBalanceText = await this.customerBalance.textContent();
      console.log('customer Balance :', customerBalanceText);
      await this.page.waitForTimeout(5000);

      await reportStep(this.page, "Customer Balance is clicked successfully", "pass");
    } catch (e) {
      await reportStep(this.page, "Customer Balance is not clicked successfully..." + e, "fail");
    }
    return this;
  }

  async click_Advance_balance() {
    try {
      const advance_balanceText = await this.advanceBalance.textContent();
      console.log('Advance Balance :', advance_balanceText);
      await this.page.waitForTimeout(5000);

      await reportStep(this.page, "Advance Balance is clicked successfully", "pass");
    } catch (e) {
      await reportStep(this.page, "Advance Balance is not clicked successfully..." + e, "fail");
    }
    return this;
  }

  async saveBtn() {
    try {
      await this.saveButton.click();
      await this.page.waitForTimeout(30000);
    } catch (e) {
      await reportStep(this.page, "save Button is not clicked successfully..." + e, "fail");
    }
    return this;
  }

  async saveBtnNegative() {
    try {
      await this.saveButton.click();
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

      await reportStep(this.page, "save Button is clicked successfully", "pass");
    } catch (e) {
      await reportStep(this.page, "save Button is not clicked successfully..." + e, "fail");
    }
    return this;
  }

  async Get_Invoice_Details() {
    try {
      // Get the table headers (th elements) to determine the number of columns
      const headers = this.page.locator(
        "xpath=//table[@class='o_list_table table table-sm table-hover table-striped o_list_table_ungrouped']//thead//tr"
      );
      const headersCount = await headers.count();

      // Get the number of rows in the table body
      const totalRows = await this.page
        .locator(
          "xpath=//table[@class='o_list_table table table-sm table-hover table-striped o_list_table_ungrouped']//tbody//tr"
        )
        .count();
      console.log(totalRows);

      // Retrieve and print row data with headers
      for (let row = 1; row <= Math.min(1, totalRows); row++) {
        let rowData = '';
        for (let column = 1; column <= headersCount; column++) {
          const headerName = (await headers.nth(column - 1).textContent()).trim();
          const cellText = await this.getColumnText(row, column);
          rowData += `${headerName}: ${cellText}\n`;
        }
        console.log(rowData.trim());
        console.log('-------------------------------------------------'); // Separator between rows
      }

      await reportStep(this.page, "Invoice details retrieved successfully", "pass");
    } catch (e) {
      await reportStep(this.page, "Failed to retrieve invoice details: " + e.message, "fail");
      console.error(e); // Additional logging for debugging
    }

    return this;
  }

  async getColumnText(row, column) {
    try {
      // Ensure the element is visible before checking clickability
      const element = this.page.locator(`xpath=.//tr[${row}]//td[${column}]`);
      await element.waitFor({ state: 'visible', timeout: 30000 });

      const text = await element.textContent();
      return text;
    } catch (e) {
      console.error(`Error retrieving text from row ${row}, column ${column}: ${e.message}`);
      return 'N/A';
    }
  }

  async click_UnappliedAmount() {
    try {
      const unappliedAmountTxt = await this.unapplied_amount.textContent();
      console.log('Unapplied Amount :', unappliedAmountTxt);
      await this.page.waitForTimeout(5000);

      await reportStep(this.page, "Unapplied Amount is clicked successfully", "pass");
    } catch (e) {
      await reportStep(this.page, "Unapplied Amount is not clicked successfully..." + e, "fail");
    }
    return this;
  }

  async click_Print() {
    try {
      await this.actionBtn.click();
      await this.page.waitForTimeout(5000);
      await this.clickReceipt.click();
      await this.page.waitForTimeout(10000);
      await this.actionBtn1.click();
      await this.clickDuplicate.click();
      await this.page.waitForTimeout(5000);

      await reportStep(this.page, "Unapplied Amount is clicked successfully", "pass");
    } catch (e) {
      await reportStep(this.page, "Unapplied Amount is not clicked successfully..." + e, "fail");
    }
    return this;
  }

  async clickModeOfPayment1(cusname, amt) {
    try {
      await this.page.waitForTimeout(3000);
      await this.customerName1.click();
      await this.page.waitForTimeout(8000);

      await this.customerSearchMore1.click();
      await this.page.waitForTimeout(5000);

      await this.customerSearchMoreBox1.fill(String(cusname));
      await this.customerSearchMoreBox1.press('Enter');
      await this.page.waitForTimeout(5000);

      await this.customerSelect1.evaluate((node) => node.click());
      await this.page.waitForTimeout(5000);

      await this.page.waitForTimeout(5000);
      await this.modeOfPayment1.click();
      // Selects the second option (index 1)
      await this.modeOfPayment1.selectOption({ index: 4 });
      await this.page.waitForTimeout(3000);
      await this.refNo.fill("123");
      await this.page.waitForTimeout(3000);
      await this.invoiceSelect1.click();
      await this.amount1.clear();
      await this.amount1.fill(String(amt));
      await this.page.waitForTimeout(3000);
      await this.saveBtn1.click();
    } catch (e) {
      await reportStep(this.page, "Mode Of Payment is not clicked successfully..." + e, "fail");
    }
    return this;
  }

  async clickModeOfPayment1Negative(cusname, amt) {
    try {
      await this.page.waitForTimeout(3000);
      await this.customerName1.click();
      await this.page.waitForTimeout(8000);

      await this.customerSearchMore1.click();
      await this.page.waitForTimeout(5000);

      await this.customerSearchMoreBox1.fill(String(cusname));
      await this.customerSearchMoreBox1.press('Enter');
      await this.page.waitForTimeout(5000);

      await this.customerSelect1.evaluate((node) => node.click());
      await this.page.waitForTimeout(5000);

      await this.page.waitForTimeout(5000);
      await this.modeOfPayment1.click();
      // Selects the second option (index 1)
      await this.modeOfPayment1.selectOption({ index: 4 });
      await this.page.waitForTimeout(3000);
      await this.refNo.fill("123");
      await this.page.waitForTimeout(3000);
      await this.invoiceSelect1.click();
      await this.amount1.clear();
      await this.amount1.fill(String(amt));
      await this.amount1.press('Enter');
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

      await this.page.waitForTimeout(3000);
      await this.saveBtn1.click();

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

      await reportStep(this.page, "Mode Of Payment is clicked successfully", "pass");
    } catch (e) {
      await reportStep(this.page, "Mode Of Payment is not clicked successfully..." + e, "fail");
    }
    return this;
  }
}

module.exports = { CustomerPaymentReceipt };
