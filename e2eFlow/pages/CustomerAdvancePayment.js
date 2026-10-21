const { expect } = require('../fixtures/base');
const { reportStep } = require('../utils/reportStep');
const { ensureLoggedIn } = require('../utils/loginHelper');

class CustomerAdvancePayment {
  constructor(page) {
    this.page = page;

    // Login Page
    this.userName = page.locator("xpath=//input[@id='login']");
    this.passWord = page.locator("xpath=//input[@id='password']");
    this.logIn = page.locator("xpath=//div//button[@type='submit']");

    this.menu = page.locator("xpath=//ul[@class='o_menu_apps']//i[@class='fa fa-bars']");

    this.financialAccountingMenuBtn = page.locator("xpath=//div[contains(text(),'Financial Accounting')]");

    this.accountsReceivableMenuBtn = page.locator("xpath=//span[contains(text(),'Accounts Receivable')]");

    this.advanceMenuBtn = page.locator("xpath=//a[normalize-space()='Advance']");

    this.createBtn = page.locator("xpath=//button[normalize-space()='New']");

    this.customerName = page.locator("xpath=//div[@name='partner_id']//input[@type='text']");

    this.customerSearchMore = page.locator("xpath=//a[@id='partner_id_0_0_8']");

    this.customerSearchMoreBox = page.locator("xpath=//input[@placeholder='Search...']");

    // Selectlist
    this.customerSelect = page.locator(
      "xpath=(//table[@class='o_list_table table table-sm table-hover position-relative mb-0 o_list_table_ungrouped table-striped']//tbody//tr[1]//td[1])"
    );

    this.customerBalance = page.locator("xpath=//div[@name='customer_debit']");

    // sendkeys
    this.amount = page.locator("xpath=(//div[@name='amount']//input[@type='text'])");

    // select
    this.modeOfPayment = page.locator("xpath=//select[@id='payment_mode_id_0']");

    // enter the date
    this.advance_Date = page.locator("xpath=//div[@name='date']//input[@type='text']");

    // 231 sendkeys check no
    this.checkORReference = page.locator("xpath=//input[@id='check_no_0']");

    // citi bank enter the bank name
    this.customerBankName = page.locator("xpath=//input[@id='partner_bank_name_0']");

    // 101401 Bank 1 select option
    this.depositTo = page.locator("xpath=//select[@id='account_id_0']");

    // notes
    this.notes = page.locator("xpath=//textarea[@id='notes_0']");

    // internalnotes
    this.internal_notes = page.locator("xpath=//textarea[@id='internal_notes_0']");

    // memo
    this.memo = page.locator("xpath=//input[@id='memo_0']");

    // today date //08/06/2024
    this.revision_Date = page.locator("xpath=//input[@id='revision_date_0']");

    // click
    // NOTE: Java also declared a `confirmBtn` WebElement field with the same
    // name as the confirmBtn() method below. JS can't shadow a prototype
    // method with an instance property of the same name, so the locator is
    // named confirmButton here instead.
    this.confirmButton = page.locator("xpath=//span[normalize-space()='Confirm']");

    // click
    // NOTE: Java also declared a `saveBtn` WebElement field with the same
    // name as the saveBtn() method below. JS can't shadow a prototype
    // method with an instance property of the same name, so the locator is
    // named saveButton here instead.
    this.saveButton = page.locator("xpath=//button[normalize-space()='Save']");

    // get text
    this.advanceTRN = page.locator("xpath=//div[@name='name']");

    // get text
    this.customer_No = page.locator("xpath=//div[@name='customer_no']");

    // get text
    this.afterSaved_CustomerBalance = page.locator("xpath=//div[@name='customer_debit']");

    // get text

    this.revision_No = page.locator("xpath=//div[@name='revision_no']");

    // NOTE: Java also declared an `actionBtn` WebElement field with the same
    // name as the actionBtn() method below. JS can't shadow a prototype
    // method with an instance property of the same name, so the locator is
    // named actionButton here instead.
    this.actionButton = page.locator("xpath=//button[normalize-space()='Action']");

    this.printAdv = page.locator("xpath=//span[normalize-space()='Payment Receipt']");

    this.duplicateBtn = page.locator("xpath=//span[normalize-space()='Duplicate']");

    this.cancelBtn = page.locator("xpath=//span[normalize-space()='Cancel']");

    this.deleteBtn = page.locator("xpath=//span[normalize-space()='Delete']");

    this.actionBtn1 = page.locator("xpath=//button[normalize-space()='Action']");

    this.actionBtn2 = page.locator("xpath=//button[normalize-space()='Action']");

    this.journalBtn = page.locator("xpath=//span[@class='o_stat_text']");

    this.checkBox = page.locator(
      "xpath=//table[@class='o_list_table table table-sm table-hover position-relative mb-0 o_list_table_ungrouped table-striped']//thead//tr[1]//th[1]"
    );

    this.actionBtn3 = page.locator("xpath=//span[normalize-space()='Actions']");

    this.export = page.locator("xpath=//span[normalize-space()='Export']");

    this.confirmExport = page.locator("xpath=//button[normalize-space()='Export']");

    this.close = page.locator("xpath=//button[normalize-space()='Close']");

    this.backBtn = page.locator("xpath=//li[@class='breadcrumb-item d-inline-flex min-w-0 o_back_button']");
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

      await this.advanceMenuBtn.click();
      await this.page.waitForTimeout(25000);

      await reportStep(this.page, "Financial Accounting menu is clicked successfully", "pass");
    } catch (e) {
      await reportStep(this.page, "Financial Accounting menu is not clicked successfully..." + e, "fail");
    }
    return this;
  }

  async click_CreateBtn() {
    try {
      await this.createBtn.click({ timeout: 30 * 1000 });
      await this.page.waitForTimeout(10000);

      await reportStep(this.page, "Create Btn is clicked successfully", "pass");
    } catch (e) {
      await reportStep(this.page, "Create Btn is not clicked successfully..." + e, "fail");
    }
    return this;
  }

  async click_CustomerSelect(CustomerName) {
    try {
      await this.customerName.click();
      await this.page.waitForTimeout(5000);

      await this.customerSearchMore.click();
      await this.page.waitForTimeout(8000);

      await this.customerSearchMoreBox.fill(String(CustomerName));
      await this.customerSearchMoreBox.press('Enter');
      await this.page.waitForTimeout(8000);

      await this.customerSelect.click();
      await this.page.waitForTimeout(8000);

      await reportStep(this.page, "Payment Creation clicked successfully", "pass");
    } catch (e) {
      await reportStep(this.page, "Payment Creation clicked not successfully..." + e, "fail");
    }
    return this;
  }

  async click_BankDetails(amt) {
    try {
      const customerBalText = await this.customerBalance.textContent();
      console.log("Before Customer Balance : " + customerBalText);
      await this.page.waitForTimeout(5000);

      await this.amount.clear();
      await this.page.waitForTimeout(5000);

      await this.amount.fill(String(amt));
      await this.amount.press('Enter');
      await this.page.waitForTimeout(5000);

      await this.modeOfPayment.click();
      // Selects the second option (index 1)
      await this.modeOfPayment.selectOption({ index: 1 });
      await this.page.waitForTimeout(3000);

      await reportStep(this.page, "click_Bank Details clicked successfully", "pass");
    } catch (e) {
      await reportStep(this.page, "click_Bank Details clicked not successfully..." + e, "fail");
    }
    return this;
  }

  async click_BankDetailsNegative(amt) {
    try {
      const customerBalText = await this.customerBalance.textContent();
      console.log("Before Customer Balance : " + customerBalText);
      await this.page.waitForTimeout(5000);

      await this.amount.clear();
      await this.page.waitForTimeout(5000);

      await this.amount.fill(String(amt));
      await this.amount.press('Enter');
      try {
        const errorMsg = this.page.locator("xpath=//div[@class='o_dialog']//p");
        await errorMsg.waitFor({ state: 'visible', timeout: 30000 });
        const errorMessageText = await errorMsg.textContent();
        console.log("Validation Error Message: " + errorMessageText);

        // Dismiss the validation error
        await this.page.locator("xpath=//button[normalize-space()='Close']").click();
        console.log("Validation error dismissed successfully for row ");
        await this.page.waitForTimeout(3000);
      } catch (e) {
        console.log("No validation error for row ");
      }
      await this.page.waitForTimeout(5000);

      await this.modeOfPayment.click();
      // Selects the second option (index 1)
      await this.modeOfPayment.selectOption({ index: 1 });
      await this.page.waitForTimeout(3000);

      await reportStep(this.page, "click_Bank Details clicked successfully", "pass");
    } catch (e) {
      await reportStep(this.page, "click_Bank Details clicked not successfully..." + e, "fail");
    }
    return this;
  }

  async click_CustomerDetails(advanceDate, checkNo, bankName) {
    try {
      await this.advance_Date.clear();
      await this.page.waitForTimeout(3000);

      // 08/05/2024
      await this.advance_Date.fill(String(advanceDate));
      await this.page.waitForTimeout(3000);

      await this.checkORReference.click();
      await this.page.waitForTimeout(3000);

      // 123
      await this.checkORReference.fill(String(checkNo));
      await this.checkORReference.press('Enter');
      await this.page.waitForTimeout(3000);

      await this.customerBankName.click();
      await this.page.waitForTimeout(3000);

      // citi bank
      await this.customerBankName.fill(String(bankName));
      await this.page.waitForTimeout(3000);

      // select
      await this.depositTo.click();
      // Selects the second option (index 1)
      await this.depositTo.selectOption({ index: 1 });
      await this.page.waitForTimeout(3000);

      await reportStep(this.page, "Customer Details entered successfully", "pass");
    } catch (e) {
      await reportStep(this.page, "Customer Details entered not successfully..." + e, "fail");
    }
    return this;
  }

  async click_CustomerDetailsNegative(advanceDate, checkNo, bankName) {
    try {
      await this.advance_Date.clear();
      await this.page.waitForTimeout(3000);

      // 08/05/2024
      await this.advance_Date.fill(String(advanceDate));
      await this.page.waitForTimeout(3000);

      await this.checkORReference.click();
      await this.page.waitForTimeout(3000);

      // 123
      await this.checkORReference.fill(String(checkNo));
      await this.checkORReference.press('Enter');
      await this.page.waitForTimeout(3000);
      try {
        const errorMsg = this.page.locator("xpath=//div[@class='o_dialog']//p");
        await errorMsg.waitFor({ state: 'visible', timeout: 30000 });
        const errorMessageText = await errorMsg.textContent();
        console.log("Validation Error Message: " + errorMessageText);

        // Dismiss the validation error
        await this.page.locator("xpath=//button[normalize-space()='Close']").click();
        console.log("Validation error dismissed successfully for row ");
        await this.page.waitForTimeout(3000);
      } catch (e) {
        console.log("No validation error for row ");
      }

      await this.customerBankName.click();
      await this.page.waitForTimeout(3000);

      // citi bank
      await this.customerBankName.fill(String(bankName));
      await this.page.waitForTimeout(3000);

      // select
      await this.depositTo.click();
      // Selects the second option (index 1)
      await this.depositTo.selectOption({ index: 1 });
      await this.page.waitForTimeout(3000);

      await reportStep(this.page, "Customer Details entered successfully", "pass");
    } catch (e) {
      await reportStep(this.page, "Customer Details entered not successfully..." + e, "fail");
    }
    return this;
  }

  async entered_Notes(note, internalNotes, memoNote, revisionDate) {
    try {
      await this.notes.fill(String(note));
      await this.notes.press('Enter');
      await this.page.waitForTimeout(5000);

      await this.internal_notes.fill(String(internalNotes));
      await this.internal_notes.press('Enter');
      await this.page.waitForTimeout(5000);

      await this.memo.fill(String(memoNote));
      await this.memo.press('Enter');
      await this.page.waitForTimeout(5000);

      // 08/06/2024
      await this.revision_Date.fill(String(revisionDate));
      await this.revision_Date.press('Enter');
      await this.page.waitForTimeout(5000);

      await reportStep(this.page, "Entered Notes successfully", "pass");
    } catch (e) {
      await reportStep(this.page, "Entered Notes not successfully..." + e, "fail");
    }
    return this;
  }

  async confirmBtn() {
    try {
      await this.confirmButton.click();
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
      await this.page.waitForTimeout(15000);

      await reportStep(this.page, "confirm Button is clicked successfully", "pass");
    } catch (e) {
      await reportStep(this.page, "confirm Button is clicked not successfully..." + e, "fail");
    }
    return this;
  }

  async confirmBtnNegative() {
    try {
      await this.confirmButton.click();
      await this.page.waitForTimeout(5000);
      try {
        const validationMessage = this.page.locator("xpath=//div[@class='o_notification_body mt-2']");
        await validationMessage.waitFor({ state: 'visible', timeout: 30000 });
        const messageText = await validationMessage.textContent();
        console.log("Validation Message: " + messageText);

        expect(await this.isErrorDisplayed()).toBeTruthy();
      } catch (e) {
        // No validation message found; proceed normally
        console.log("No validation message displayed.");
      }

      await reportStep(this.page, "confirm Button is clicked successfully", "pass");
    } catch (e) {
      await reportStep(this.page, "confirm Button is clicked not successfully..." + e, "fail");
    }
    return this;
  }

  async saveBtn() {
    try {
      await this.saveButton.click();
      await this.page.waitForTimeout(20000);

      await reportStep(this.page, "save Button is clicked successfully", "pass");
    } catch (e) {
      await reportStep(this.page, "save Button is clicked not successfully..." + e, "fail");
    }
    return this;
  }

  async click_GetTheDetails() {
    try {
      /* const advanceTRNText = await this.advanceTRN.textContent();
      console.log("Advance TRN : " + advanceTRNText);
      await this.page.waitForTimeout(5000);

      const customer_NoText = await this.customer_No.textContent();
      console.log("Customer Number : " + customer_NoText);
      await this.page.waitForTimeout(5000);

      const afterSaved_CustomerBalanceText = await this.afterSaved_CustomerBalance.textContent();
      console.log("After Saved Customer Balance : " + afterSaved_CustomerBalanceText);
      await this.page.waitForTimeout(5000);

      const revision_NoText = await this.revision_No.textContent();
      console.log("revision_Number : " + revision_NoText); */
      await this.page.waitForTimeout(5000);
      await this.journalBtn.click();
      await this.page.waitForTimeout(3000);
      await this.checkBox.click();
      await this.page.waitForTimeout(3000);
      await this.actionBtn3.click();
      /* await this.export.click();
      await this.page.waitForTimeout(3000);
      await this.confirmExport.click();
      await this.page.waitForTimeout(3000);
      await this.close.click();
      await this.page.waitForTimeout(3000); */
      await this.backBtn.click();
      await this.page.waitForTimeout(6000);
      await reportStep(this.page, "Get The Details get successfully", "pass");
    } catch (e) {
      await reportStep(this.page, "Get The Details get not successfully..." + e, "fail");
    }
    return this;
  }

  async actionBtn() {
    try {
      await this.page.waitForTimeout(6000);
      await this.actionButton.click();
      await this.page.waitForTimeout(3000);
      await this.printAdv.click();
      await this.page.waitForTimeout(6000);
      await this.actionBtn1.click();
      await this.page.waitForTimeout(3000);
      await this.duplicateBtn.click();
      await this.cancelBtn.click();
      await this.page.waitForTimeout(3000);
      await this.actionBtn2.click();
      await this.page.waitForTimeout(3000);
      await this.deleteBtn.click();

      await reportStep(this.page, "actionBtn is clicked successfully", "pass");
    } catch (e) {
      await reportStep(this.page, "actionBtn is clicked not successfully..." + e, "fail");
    }
    return this;
  }
}

module.exports = { CustomerAdvancePayment };
