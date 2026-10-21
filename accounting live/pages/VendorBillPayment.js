const { expect } = require('../fixtures/base');
const { reportStep } = require('../utils/reportStep');
const { ensureLoggedIn } = require('../utils/loginHelper');

class VendorBillPayment {
  constructor(page) {
    this.page = page;

    // Login Page
    this.userName = page.locator("xpath=//input[@name='login']");
    this.passWord = page.locator("xpath=//input[@name='password']");
    this.logIn = page.locator("xpath=//button[@type='submit']");

    // Menu
    this.menu = page.locator("xpath=//ul[@class='o_menu_apps']//i[@class='fa fa-bars']");

    // FinancialAcct
    this.financialAcct = page.locator("xpath=//div[contains(text(),'Financial Accounting')]");

    this.accountsPayableMenuBtn = page.locator("xpath=//span[contains(text(),'Accounts Payable')]");

    this.billPaymentMenuBtn = page.locator("xpath=//a[normalize-space()='Bill Payment']");

    this.createBtn = page.locator("xpath=//button[normalize-space()='New']");

    this.vendor = page.locator("xpath=//div[@name='partner_id']//input[@type='text']");

    this.vendorSearchMore = page.locator("xpath=(//a[normalize-space()='Search More...'])[1]");

    this.vendorSearchMoreBox = page.locator("xpath=//input[@placeholder='Search...']");

    // Selectlist
    this.VendorSelect = page.locator(
      "xpath=(//table[@class='o_list_table table table-sm table-hover position-relative mb-0 o_list_table_ungrouped table-striped']//tbody//tr[1]//td[1])[2]"
    );

    this.checkNo = page.locator("xpath=//input[@id='check_no_0']");

    this.creditCardNo = page.locator("xpath=//input[@id='card_number_0']");

    this.amount = page.locator("xpath=//input[@id='amount_0']");

    this.bankName = page.locator("xpath=//select[@id='account_id_0']");

    this.billSelect = page.locator(
      "xpath=//table[@class='o_list_table table table-sm table-hover position-relative mb-0 o_list_table_ungrouped table-striped']//tbody//tr[1]//td[1]"
    );

    this.billBox = page.locator(
      "xpath=//table[@class='o_list_table table table-sm table-hover position-relative mb-0 o_list_table_ungrouped table-striped']//tbody//tr[1]//td[1]//input[@type='checkbox']"
    );

    this.balanceAmt = page.locator(
      "xpath=//table[@class='o_list_table table table-sm table-hover position-relative mb-0 o_list_table_ungrouped table-striped']//tbody//tr[1]//td[7]"
    );

    this.amountPaid = page.locator(
      "xpath=//table[@class='o_list_table table table-sm table-hover position-relative mb-0 o_list_table_ungrouped table-striped']//tbody//tr[1]//td[8]"
    );

    this.unapplied_amount = page.locator("xpath=//div[@name='unapplied_amount']");

    // save btn
    // NOTE: the Java field `saveBtn` and the Java method `saveBtn()` share the
    // same name (allowed in Java since fields/methods live in separate
    // namespaces). JS instance properties would shadow a same-named
    // prototype method, so this locator is kept as `saveBtnEl` while the
    // method below stays named `saveBtn()` to match the Java API.
    this.saveBtnEl = page.locator("xpath=//span[normalize-space()='Confirm']");

    this.actionBtn = page.locator("xpath=//button[normalize-space()='Action']");

    this.clickReceipt = page.locator("xpath=//span[normalize-space()='Bill Payment']");

    this.actionBtn1 = page.locator("xpath=//button[normalize-space()='Action']");

    this.clickDuplicate = page.locator("xpath=//span[normalize-space()='Duplicate']");

    this.okBtn = page.locator("xpath=(//button[@class='btn btn-primary'])[1]");

    this.vendor1 = page.locator("xpath=//div[@name='partner_id']//input[@type='text']");

    this.vendorSearchMore1 = page.locator("xpath=(//a[normalize-space()='Search More...'])[1]");

    this.vendorSearchMoreBox1 = page.locator("xpath=//input[@placeholder='Search...']");

    // Selectlist
    this.VendorSelect1 = page.locator(
      "xpath=(//table[@class='o_list_table table table-sm table-hover position-relative mb-0 o_list_table_ungrouped table-striped']//tbody//tr[1]//td[1])[2]"
    );

    this.invoiceSelect1 = page.locator(
      "xpath=//table[@class='o_list_table table table-sm table-hover position-relative mb-0 o_list_table_ungrouped table-striped']//tbody//tr[1]//td[1]"
    );

    this.modeOfPayment1 = page.locator("xpath=//select[@id='payment_type_0']");

    this.modeOfPayment = page.locator("xpath=//select[@id='payment_type_0']");

    this.refNo = page.locator("xpath=//input[@id='reference_no_0']");

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

      await reportStep(this.page, "login button clicked successfully", "pass");
    } catch (e) {
      await reportStep(this.page, "login button clicked not successfully..." + e, "fail");
    }
    return this;
  }

  async click_Menu() {
    try {
      await this.menu.click({ timeout: 30 * 1000 });

      await reportStep(this.page, "Menu clicked successfully", "pass");
    } catch (e) {
      await reportStep(this.page, "Menu clicked not successfully..." + e, "fail");
    }
    return this;
  }

  async click_financialAccountingMenuBtn() {
    try {
      await this.financialAcct.click({ timeout: 30 * 1000 });
      await this.page.waitForTimeout(5000);

      await this.accountsPayableMenuBtn.click();
      await this.page.waitForTimeout(5000);

      await this.billPaymentMenuBtn.click();
      await this.page.waitForTimeout(5000);

      await reportStep(this.page, "Financial Accounting menu clicked successfully", "pass");
    } catch (e) {
      await reportStep(this.page, "Financial Accounting menu clicked not successfully..." + e, "fail");
    }
    return this;
  }

  async click_Creation(vendorName) {
    try {
      await this.createBtn.click({ timeout: 30 * 1000 });
      await this.page.waitForTimeout(5000);

      await this.vendor.click();
      await this.page.waitForTimeout(5000);

      await this.vendorSearchMore.click();
      await this.page.waitForTimeout(5000);

      await this.vendorSearchMoreBox.fill(String(vendorName));
      await this.vendorSearchMoreBox.press('Enter');
      await this.page.waitForTimeout(5000);

      await this.VendorSelect.click();
      await this.page.waitForTimeout(5000);

      await this.modeOfPayment.click();
      await this.modeOfPayment.selectOption({ index: 3 });
      await this.page.waitForTimeout(3000);

      await reportStep(this.page, "click_Creation clicked successfully", "pass");
    } catch (e) {
      await reportStep(this.page, "click_Creation clicked not successfully..." + e, "fail");
    }
    return this;
  }

  async click_BankDetails(cardNum, bankname, amt) {
    try {
      await this.creditCardNo.fill(String(cardNum));
      await this.page.waitForTimeout(5000);
      await this.billSelect.click();
      await this.page.waitForTimeout(5000);

      // await this.billBox.evaluate((node) => node.click());
      // await this.page.waitForTimeout(5000);

      await this.amount.clear();
      await this.page.waitForTimeout(5000);

      await this.amount.fill(String(amt));
      await this.page.waitForTimeout(5000);

      await this.bankName.click();
      // Selects the second option (index 1)
      await this.bankName.selectOption({ index: 1 });
      await this.page.waitForTimeout(3000);

      await reportStep(this.page, "click_BankDetailsclicked successfully", "pass");
    } catch (e) {
      await reportStep(this.page, "click_BankDetails clicked not successfully..." + e, "fail");
    }
    return this;
  }

  async click_BankDetailsNegative(cardNum, bankname, amt) {
    try {
      await this.creditCardNo.fill(String(cardNum));
      await this.creditCardNo.press('Enter');
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
      await this.billSelect.click();
      await this.page.waitForTimeout(5000);

      // await this.billBox.evaluate((node) => node.click());
      // await this.page.waitForTimeout(5000);

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

      await this.bankName.click();
      // Selects the second option (index 1)
      await this.bankName.selectOption({ index: 1 });
      await this.page.waitForTimeout(3000);

      await reportStep(this.page, "click_BankDetailsclicked successfully", "pass");
    } catch (e) {
      await reportStep(this.page, "click_BankDetails clicked not successfully..." + e, "fail");
    }
    return this;
  }

  async click_GetThePaidDetails() {
    try {
      const balancetext = await this.balanceAmt.textContent();
      console.log('Balance :', balancetext);
      await this.page.waitForTimeout(5000);

      const AmountText = await this.amountPaid.textContent();
      console.log('Amount :', AmountText);
      await this.page.waitForTimeout(5000);

      const unappliedAmountTxt = await this.unapplied_amount.textContent();
      console.log('Unapplied Amount :', unappliedAmountTxt);
      await this.page.waitForTimeout(5000);

      await reportStep(this.page, "click_BankDetailsclicked successfully", "pass");
    } catch (e) {
      await reportStep(this.page, "click_BankDetails clicked not successfully..." + e, "fail");
    }
    return this;
  }

  async saveBtn() {
    try {
      await this.saveBtnEl.click();
      await this.page.waitForTimeout(20000);

      await reportStep(this.page, "saveBtn is clicked successfully", "pass");
    } catch (e) {
      await reportStep(this.page, "saveBtn is clicked not successfully..." + e, "fail");
    }
    return this;
  }

  async saveBtnNegative() {
    try {
      await this.saveBtnEl.click();
      await this.page.waitForTimeout(20000);
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
      await reportStep(this.page, "saveBtn is clicked successfully", "pass");
    } catch (e) {
      await reportStep(this.page, "saveBtn is clicked not successfully..." + e, "fail");
    }
    return this;
  }

  async click_TheDetails() {
    try {
      const table = this.page.locator(
        "xpath=//table[@class='o_list_table table table-sm table-hover position-relative mb-0 o_list_table_ungrouped table-striped']"
      ); // Use appropriate locator for your table

      // Get all rows of the table
      const rows = table.locator(
        "xpath=//table[@class='o_list_table table table-sm table-hover position-relative mb-0 o_list_table_ungrouped table-striped']//tbody//tr"
      );
      const rowCount = await rows.count();

      // Loop through each row
      for (let r = 0; r < rowCount; r++) {
        const row = rows.nth(r);

        // Get all cells in the row
        const cells = row.locator('td');
        const cellCount = await cells.count();

        // Check if the row is empty (no cells or all cells are empty)
        let isEmptyRow = true;
        for (let c = 0; c < cellCount; c++) {
          const cellText = (await cells.nth(c).textContent()) || '';
          if (cellText.trim() !== '') {
            isEmptyRow = false;
            break;
          }
        }

        if (isEmptyRow) {
          console.log('Empty row found, exiting loop.');
          break;
        }

        // Print the data in the row
        let line = '';
        for (let c = 0; c < cellCount; c++) {
          line += (await cells.nth(c).textContent()) + '\t';
        }
        console.log(line); // Print a new line for each row
      }

      await reportStep(this.page, "click_BankDetailsclicked successfully", "pass");
    } catch (e) {
      await reportStep(this.page, "click_BankDetails clicked not successfully..." + e, "fail");
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
      await this.vendor1.click();
      await this.page.waitForTimeout(8000);

      await this.vendorSearchMore1.click();
      await this.page.waitForTimeout(5000);

      await this.vendorSearchMoreBox1.fill(String(cusname));
      await this.vendorSearchMoreBox1.press('Enter');
      await this.page.waitForTimeout(5000);

      await this.VendorSelect1.click();
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
      await this.page.waitForTimeout(3000);

      await reportStep(this.page, "Mode Of Payment is clicked successfully", "pass");
    } catch (e) {
      await reportStep(this.page, "Mode Of Payment is not clicked successfully..." + e, "fail");
    }
    return this;
  }

  async clickModeOfPayment1Negative(cusname, amt) {
    try {
      await this.page.waitForTimeout(3000);
      await this.vendor1.click();
      await this.page.waitForTimeout(8000);

      await this.vendorSearchMore1.click();
      await this.page.waitForTimeout(5000);

      await this.vendorSearchMoreBox1.fill(String(cusname));
      await this.vendorSearchMoreBox1.press('Enter');
      await this.page.waitForTimeout(5000);

      await this.VendorSelect1.click();
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
      await this.saveBtn1.click();
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

      await reportStep(this.page, "Mode Of Payment is clicked successfully", "pass");
    } catch (e) {
      await reportStep(this.page, "Mode Of Payment is not clicked successfully..." + e, "fail");
    }
    return this;
  }
}

module.exports = { VendorBillPayment };
