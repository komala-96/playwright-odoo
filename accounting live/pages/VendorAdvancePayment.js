const { expect } = require('../fixtures/base');
const { reportStep } = require('../utils/reportStep');
const { ensureLoggedIn } = require('../utils/loginHelper');

class VendorAdvancePayment {
  constructor(page) {
    this.page = page;

    // Login Page
    this.userName = page.locator("xpath=//input[@id='login']");
    this.passWord = page.locator("xpath=//input[@id='password']");
    this.logIn = page.locator("xpath=//div//button[@type='submit']");

    this.menu = page.locator("xpath=//ul[@class='o_menu_apps']//i[@class='fa fa-bars']");

    this.financialAccountingMenuBtn = page.locator("xpath=//div[contains(text(),'Financial Accounting')]");

    this.accountsPayableMenuBtn = page.locator("xpath=//span[contains(text(),'Accounts Payable')]");

    this.advancePaymentsMenuBtn = page.locator("xpath=//a[normalize-space()='Advance Payment']");

    this.createBtn = page.locator("xpath=//button[normalize-space()='New']");

    this.vendorNames = page.locator("xpath=//div[@name='partner_id']//input[@type='text']");

    this.vendorSearchMore = page.locator("xpath=//a[@id='partner_id_0_0_8']");

    this.vendorSearchMoreBox = page.locator("xpath=//input[@placeholder='Search...']");

    // Selectlist
    this.vendorSelect = page.locator(
      "xpath=(//table[@class='o_list_table table table-sm table-hover position-relative mb-0 o_list_table_ungrouped table-striped']//tbody//tr[1]//td[1])"
    );

    this.amount = page.locator("xpath=(//div[@name='amount']//input[@type='text'])");

    this.checkNo = page.locator("xpath=//div[@name='check_no']//input[@type='text']");

    this.checkSelect = page.locator("xpath=//li[@class='ui-menu-item']//a[contains(text(),'CHK/006')]");

    // notes
    this.notes = page.locator("xpath=//textarea[@id='notes_0']");

    // internalnotes
    this.internal_notes = page.locator("xpath=//textarea[@id='internal_notes_0']");

    // memo
    this.memo = page.locator("xpath=//input[@id='memo_0']");

    // today date //08/06/2024
    this.revision_Date = page.locator("xpath=//input[@id='revision_date_0']");

    this.confirmBtn = page.locator("xpath=//span[normalize-space()='Confirm']");

    // click
    // NOTE: Java also declared a `saveBtn` WebElement field with the same
    // name as the saveBtn() method below. JS can't shadow a prototype
    // method with an instance property of the same name, so the locator is
    // named saveButton here instead.
    this.saveButton = page.locator("xpath=//button[normalize-space()='Save']");

    // get text
    this.advanceTRN = page.locator("xpath=//div[@name='name']");

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
      await reportStep(this.page, "username is entered not successfully..." + e, "fail");
    }
    return this;
  }

  async enter_Password(pass) {
    try {
      await this.passWord.fill(String(pass));

      await reportStep(this.page, "Password is entered successfully", "pass");
    } catch (e) {
      await reportStep(this.page, "Password is  entered not successfully..." + e, "fail");
    }
    return this;
  }

  async click_Login_Button() {
    try {
      await this.logIn.click();

      await this.page.waitForTimeout(5000);

      await reportStep(this.page, "login button is clicked successfully", "pass");
    } catch (e) {
      await reportStep(this.page, "login button is clicked not successfully..." + e, "fail");
    }
    return this;
  }

  async click_Menu() {
    try {
      await this.menu.click({ timeout: 30 * 1000 });

      await reportStep(this.page, "Menu is clicked successfully", "pass");
    } catch (e) {
      await reportStep(this.page, "Menu is clicked not successfully..." + e, "fail");
    }
    return this;
  }

  async click_financialAccountingMenuBtn() {
    try {
      await this.financialAccountingMenuBtn.click({ timeout: 30 * 1000 });
      await this.page.waitForTimeout(5000);

      await this.accountsPayableMenuBtn.click();
      await this.page.waitForTimeout(5000);

      await this.advancePaymentsMenuBtn.click();
      await this.page.waitForTimeout(5000);

      await reportStep(this.page, "Financial Accounting menu is clicked successfully", "pass");
    } catch (e) {
      await reportStep(this.page, "Financial Accounting menu is clicked not successfully..." + e, "fail");
    }
    return this;
  }

  async click_VendorName(vendorName) {
    try {
      await this.createBtn.click({ timeout: 30 * 1000 });
      await this.page.waitForTimeout(5000);

      await this.vendorNames.click();
      await this.page.waitForTimeout(5000);

      await this.vendorSearchMore.click();
      await this.page.waitForTimeout(5000);

      await this.vendorSearchMoreBox.click();
      await this.page.waitForTimeout(5000);

      await this.vendorSearchMoreBox.fill(String(vendorName));
      await this.vendorSearchMoreBox.press('Enter');
      await this.page.waitForTimeout(5000);

      await this.vendorSelect.click();
      await this.page.waitForTimeout(5000);

      await reportStep(this.page, "Vendor Name is clicked successfully", "pass");
    } catch (e) {
      await reportStep(this.page, "Vendor Name is clicked not successfully..." + e, "fail");
    }
    return this;
  }

  async click_BankDetails(amt, checkNum) {
    try {
      await this.amount.clear();
      await this.page.waitForTimeout(5000);

      await this.amount.fill(String(amt));
      await this.page.waitForTimeout(5000);

      await this.checkNo.fill(String(checkNum));
      await this.page.waitForTimeout(5000);

      //await this.checkSelect.click();
      //await this.page.waitForTimeout(5000);

      await reportStep(this.page, "Bank Details is clicked successfully", "pass");
    } catch (e) {
      await reportStep(this.page, "Bank Details is clicked not successfully..." + e, "fail");
    }
    return this;
  }

  async click_BankDetailsNegative(amt, checkNum) {
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

      await this.checkNo.fill(String(checkNum));
      await this.checkNo.press('Enter');
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

      //await this.checkSelect.click();
      //await this.page.waitForTimeout(5000);

      await reportStep(this.page, "Bank Details is clicked successfully", "pass");
    } catch (e) {
      await reportStep(this.page, "Bank Details is clicked not successfully..." + e, "fail");
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

  async click_confirmBtn() {
    try {
      await this.confirmBtn.click();
      await this.page.waitForTimeout(5000);

      await reportStep(this.page, "Confirm Btn is cliked successfully", "pass");
    } catch (e) {
      await reportStep(this.page, "Confirm Btn is clicked not successfully..." + e, "fail");
    }
    return this;
  }

  async click_confirmBtnNegative() {
    try {
      await this.confirmBtn.click();
      await this.page.waitForTimeout(5000);
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

      await reportStep(this.page, "Confirm Btn is cliked successfully", "pass");
    } catch (e) {
      await reportStep(this.page, "Confirm Btn is clicked not successfully..." + e, "fail");
    }
    return this;
  }

  async saveBtn() {
    try {
      await this.saveButton.click();
      await this.page.waitForTimeout(20000);

      await reportStep(this.page, "Save Btn is clicked successfully", "pass");
    } catch (e) {
      await reportStep(this.page, "Save Btn is clicked not successfully..." + e, "fail");
    }
    return this;
  }

  async AdvanceTRN() {
    try {
      const advanceText = await this.advanceTRN.textContent();
      console.log('Advance TRN :', advanceText);
      await this.page.waitForTimeout(5000);
      await this.journalBtn.click();
      await this.page.waitForTimeout(3000);
      await this.checkBox.click();
      await this.page.waitForTimeout(3000);
      /*await this.actionBtn3.click();
      await this.export.click();
      await this.page.waitForTimeout(3000);
      await this.confirmExport.click();
      await this.page.waitForTimeout(3000);
      await this.close.click();*/
      await this.backBtn.click();
      await this.page.waitForTimeout(3000);

      await reportStep(this.page, "Advance TRN is clicked successfully", "pass");
    } catch (e) {
      await reportStep(this.page, "Advance TRN is clicked not successfully..." + e, "fail");
    }
    return this;
  }

  async actionBtn() {
    try {
      /*await this.actionButton.click();
      await this.page.waitForTimeout(3000);
      await this.printAdv.click();
      await this.page.waitForTimeout(3000);*/
      await this.actionBtn1.click();
      await this.page.waitForTimeout(3000);
      await this.duplicateBtn.click();
      //await this.cancelBtn.click();
      await this.page.waitForTimeout(3000);
      await this.actionBtn2.click();
      await this.page.waitForTimeout(3000);
      await this.deleteBtn.click();
      await reportStep(this.page, "save Button is clicked successfully", "pass");
    } catch (e) {
      await reportStep(this.page, "save Button is clicked not successfully..." + e, "fail");
    }
    return this;
  }
}

module.exports = { VendorAdvancePayment };
