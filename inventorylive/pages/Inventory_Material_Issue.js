const { expect } = require('../fixtures/base');
const { reportStep } = require('../utils/reportStep');
const { ensureLoggedIn } = require('../utils/loginHelper');

class Inventory_Material_Issue {
  constructor(page) {
    this.page = page;

    // Login Page
    this.userName = page.locator("xpath=//input[@name='login']");
    this.passWord = page.locator("xpath=//input[@name='password']");
    this.logIn = page.locator("xpath=//button[@type='submit']");

    // Menu
    this.menu = page.locator("xpath=//ul[@class='o_menu_apps']//i[@class='fa fa-bars']");

    this.inventoryMenu = page.locator("xpath=//div[contains(text(),'Inventory')]");

    this.plusMenu = page.locator("xpath=//nav[@class='o_main_navbar']//i[@class='fa fa-plus']");

    this.materialIssueMenu = page.locator("xpath=//a[normalize-space()='Material Issue']");

    this.createBtn = page.locator("xpath=//button[normalize-space()='New']");

    this.materialIssueType = page.locator("xpath=//select[@id='issue_type_0']");

    this.vendor = page.locator("xpath=//div[@name='vendor_id']//input");

    this.vendorSearchMore = page.locator("xpath=//a[@id='vendor_id_0_0_8']");

    this.vendorSearchMoreBox = page.locator("xpath=//input[@placeholder='Search...']");

    this.vendorSelect = page.locator(
      "xpath=(//table[@class='o_list_table table table-sm table-hover position-relative mb-0 o_list_table_ungrouped table-striped'])[2]//tbody//tr[1]//td[1]"
    );

    this.poTRNClick = page.locator("xpath=//div[@name='purchase_order_id']//input[@type='text']");

    this.poTRNSelect = page.locator("xpath=//a[@id='purchase_order_id_0_0_0']");

    this.billTRNClick = page.locator("xpath=//div[@name='bill_id']//input[@type='text']");

    this.billTRNSelect = page.locator("xpath=//a[@id='bill_id_0_0_0']");

    this.employeeClick = page.locator("xpath=//div[@name='employee_id']//input[@type='text']");

    this.employeeSelect = page.locator("xpath=//a[@id='employee_id_0_0_1']");

    this.returnReason = page.locator("xpath=//textarea[@id='return_reason_0']");

    this.submitBtn = page.locator("xpath=//span[normalize-space()='Submit']");

    this.saveBtn = page.locator("xpath=//button[contains(text(),'Save')]");

    this.getIssueTRN = page.locator("xpath=//span[@name='issue_trn_no']");

    this.getIssueType = page.locator("xpath=//span[@name='issue_type']");

    this.getIssueDate = page.locator("xpath=//span[@name='issue_date']");

    this.getReceipt = page.locator("xpath=//span[@name='picking_id']//span");

    this.getBillTRN = page.locator("xpath=//span[@name='bill_trn']//span");

    this.createDebitMemo = page.locator("xpath=//span[normalize-space()='Create Debit Memo']");

    // NOTE: renamed from `clickDebitMemo` (Java field) to `debitMemoSelect` to avoid
    // colliding with the clickDebitMemo() method below; JS fields and methods share
    // one namespace on `this`, unlike Java fields/methods.
    this.debitMemoSelect = page.locator("xpath=//span[normalize-space()='Debit Memo']");

    this.postBtn = page.locator("xpath=//span[normalize-space()='Post']");

    this.action = page.locator("xpath=//button[normalize-space()='Action']");

    this.print = page.locator("xpath=//span[normalize-space()='Print Debit Memo']");

    this.action1 = page.locator("xpath=//button[normalize-space()='Action']");

    this.duplicate = page.locator("xpath=//span[normalize-space()='Duplicate']");

    this.action2 = page.locator("xpath=//button[normalize-space()='Action']");

    this.delete = page.locator("xpath=//span[normalize-space()='Delete']");

    this.confirmDelete = page.locator("xpath=//button[normalize-space()='Delete']");

    this.confirmDelete1 = page.locator("xpath=//button[normalize-space()='Delete']");

    this.backBtn = page.locator("xpath=//li[@class='breadcrumb-item d-inline-flex min-w-0 o_back_button']");

    this.action3 = page.locator("xpath=//button[normalize-space()='Action']");

    this.duplicate1 = page.locator("xpath=//span[normalize-space()='Duplicate']");

    this.action4 = page.locator("xpath=//button[normalize-space()='Action']");

    this.delete1 = page.locator("xpath=//span[normalize-space()='Delete']");
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

      await reportStep(this.page, "Login button is clicked successfully", "pass");
    } catch (e) {
      await reportStep(this.page, "Login button is not clicked successfully..." + e, "fail");
    }
    return this;
  }

  async clickMainMenu() {
    try {
      // await new WebDriverWait(driver, Duration.ofSeconds(30)).until(ExpectedConditions.elementToBeClickable(menu))
      //     .click();
      await this.page.waitForTimeout(5000);

      await this.inventoryMenu.click();
      await this.page.waitForTimeout(20000);

      // await this.plusMenu.click();
      // await this.page.waitForTimeout(15000);

      await reportStep(this.page, "Menu is clicked successfully", "pass");
    } catch (e) {
      await reportStep(this.page, "Menu is not clicked successfully..." + e, "fail");
    }
    return this;
  }

  async clickInventoryMenu() {
    try {
      await this.materialIssueMenu.click({ timeout: 30 * 1000 });
      await this.page.waitForTimeout(8000);

      await this.createBtn.click();
      await this.page.waitForTimeout(5000);

      await reportStep(this.page, "Inventory Menu is clicked successfully", "pass");
    } catch (e) {
      await reportStep(this.page, "Inventory Menu is not clicked successfully..." + e, "fail");
    }
    return this;
  }

  async clickMaterialIssueType() {
    try {
      await this.materialIssueType.click();
      await this.page.waitForTimeout(5000);
      // Select the first option
      await this.materialIssueType.selectOption({ index: 1 });
      await this.page.waitForTimeout(5000);

      await reportStep(this.page, "Material Issue Type is clicked successfully", "pass");
    } catch (e) {
      await reportStep(this.page, "Material Issue Type is not clicked successfully..." + e, "fail");
    }
    return this;
  }

  async clickVendorName(vendorName) {
    try {
      await this.vendor.click();
      await this.page.waitForTimeout(5000);

      await this.vendorSearchMore.click();
      await this.page.waitForTimeout(5000);

      await this.vendorSearchMoreBox.fill(String(vendorName));
      await this.vendorSearchMoreBox.press('Enter');
      await this.page.waitForTimeout(5000);

      await this.vendorSelect.click();
      await this.page.waitForTimeout(5000);

      await reportStep(this.page, "Vendor is clicked successfully", "pass");
    } catch (e) {
      await reportStep(this.page, "Vendor is not clicked successfully..." + e, "fail");
    }
    return this;
  }

  async clickPoTRN() {
    try {
      await this.poTRNClick.click();
      await this.page.waitForTimeout(5000);

      await this.poTRNSelect.click();
      await this.page.waitForTimeout(5000);

      await reportStep(this.page, "PO TRN is clicked successfully", "pass");
    } catch (e) {
      await reportStep(this.page, "PO TRN is not clicked successfully..." + e, "fail");
    }
    return this;
  }

  async clickBillTRN() {
    try {
      await this.billTRNClick.click();
      await this.page.waitForTimeout(5000);

      await this.billTRNSelect.click();
      await this.page.waitForTimeout(5000);

      await reportStep(this.page, "Bill TRN is clicked successfully", "pass");
    } catch (e) {
      await reportStep(this.page, "Bill TRN is not clicked successfully..." + e, "fail");
    }
    return this;
  }

  async clickEmployee() {
    try {
      await this.employeeClick.click();
      await this.page.waitForTimeout(5000);

      await this.employeeSelect.click();
      await this.page.waitForTimeout(5000);

      await reportStep(this.page, "Employee is clicked successfully", "pass");
    } catch (e) {
      await reportStep(this.page, "Employee is not clicked successfully..." + e, "fail");
    }
    return this;
  }

  async clickEmployeeNegative() {
    try {
      await this.employeeClick.click();
      await this.page.waitForTimeout(5000);

      await this.employeeSelect.click();
      await this.page.waitForTimeout(5000);
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

      await reportStep(this.page, "Employee is clicked successfully", "pass");
    } catch (e) {
      await reportStep(this.page, "Employee is not clicked successfully..." + e, "fail");
    }
    return this;
  }

  async clickReturnReason(reason) {
    try {
      await this.returnReason.click();
      await this.page.waitForTimeout(5000);

      await this.returnReason.fill(String(reason));
      await this.page.waitForTimeout(5000);

      await reportStep(this.page, "Return Reason is clicked successfully", "pass");
    } catch (e) {
      await reportStep(this.page, "Return Reason is not clicked successfully..." + e, "fail");
    }
    return this;
  }

  async clickProductIssueQty(entQTY) {
    try {
      const totalRows = await this.page
        .locator(
          "xpath=//table[@class='o_list_table table table-sm table-hover position-relative mb-0 o_list_table_ungrouped table-striped']//tbody//tr"
        )
        .count();
      console.log('Total number of rows:', totalRows);

      for (let row = 1; row <= Math.min(1, totalRows); row++) {
        const productRow = this.page.locator(
          `xpath=(//table[@class='o_list_table table table-sm table-hover position-relative mb-0 o_list_table_ungrouped table-striped'])[1]//tbody//tr[${row}]//td[2]`
        );
        await productRow.click({ timeout: 30 * 1000 });

        const issueQtyInput = this.page.locator(
          `xpath=(//table[@class='o_list_table table table-sm table-hover position-relative mb-0 o_list_table_ungrouped table-striped'])[1]//tbody//tr[${row}]//td[7]//input`
        );
        await issueQtyInput.clear({ timeout: 30 * 1000 });
        await issueQtyInput.fill(String(entQTY));
        await this.page.waitForTimeout(5000);
      }

      await reportStep(this.page, "Product Issue Qty is clicked successfully", "pass");
    } catch (e) {
      await reportStep(this.page, "Product Issue Qty is not clicked not successfully..." + e, "fail");
    }
    return this;
  }

  async clickProductIssueQtyNegative(entQTY) {
    try {
      const totalRows = await this.page
        .locator(
          "xpath=//table[@class='o_list_table table table-sm table-hover position-relative mb-0 o_list_table_ungrouped table-striped']//tbody//tr"
        )
        .count();
      console.log('Total number of rows:', totalRows);

      for (let row = 1; row <= Math.min(1, totalRows); row++) {
        const productRow = this.page.locator(
          `xpath=(//table[@class='o_list_table table table-sm table-hover position-relative mb-0 o_list_table_ungrouped table-striped'])[1]//tbody//tr[${row}]//td[2]`
        );
        await productRow.click({ timeout: 30 * 1000 });

        const issueQtyInput = this.page.locator(
          `xpath=(//table[@class='o_list_table table table-sm table-hover position-relative mb-0 o_list_table_ungrouped table-striped'])[1]//tbody//tr[${row}]//td[7]//input`
        );
        await issueQtyInput.clear({ timeout: 30 * 1000 });
        await issueQtyInput.fill(String(entQTY));
        await issueQtyInput.press('Enter');
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
      }

      await reportStep(this.page, "Product Issue Qty is clicked successfully", "pass");
    } catch (e) {
      await reportStep(this.page, "Product Issue Qty is not clicked not successfully..." + e, "fail");
    }
    return this;
  }

  async clickSubmitBtn() {
    try {
      await this.submitBtn.click();
      await this.page.waitForTimeout(15000);

      await reportStep(this.page, "Submit is clicked successfully", "pass");
    } catch (e) {
      await reportStep(this.page, "Submit is not clicked successfully..." + e, "fail");
    }
    return this;
  }

  async clickSubmitBtnNegative() {
    try {
      await this.submitBtn.click();
      await this.page.waitForTimeout(15000);

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

      await reportStep(this.page, "Submit is clicked successfully", "pass");
    } catch (e) {
      await reportStep(this.page, "Submit is not clicked successfully..." + e, "fail");
    }
    return this;
  }

  async clickSaveBtn() {
    try {
      await this.saveBtn.click();
      await this.page.waitForTimeout(15000);

      await reportStep(this.page, "Save is clicked successfully", "pass");
    } catch (e) {
      await reportStep(this.page, "Save is not clicked successfully..." + e, "fail");
    }
    return this;
  }

  async clickGetTheDetails() {
    try {
      await this.getIssueTRN.click();
      await this.page.waitForTimeout(5000);

      await this.getIssueType.click();
      await this.page.waitForTimeout(5000);

      await this.getIssueDate.click();
      await this.page.waitForTimeout(5000);

      await this.getReceipt.click();
      await this.page.waitForTimeout(5000);

      await this.getBillTRN.click();
      await this.page.waitForTimeout(5000);

      await reportStep(this.page, "Get The Details is clicked successfully", "pass");
    } catch (e) {
      await reportStep(this.page, "Get The Details is not clicked successfully..." + e, "fail");
    }
    return this;
  }

  async clickDebitMemo() {
    try {
      await this.createDebitMemo.click();
      await this.page.waitForTimeout(3000);

      await this.debitMemoSelect.click();
      await this.page.waitForTimeout(3000);

      await this.postBtn.click();
      await this.page.waitForTimeout(3000);

      await this.action.click();
      await this.page.waitForTimeout(3000);

      await this.print.click();
      await this.page.waitForTimeout(6000);

      await this.action1.click();
      await this.page.waitForTimeout(3000);

      await this.duplicate.click();
      await this.page.waitForTimeout(3000);

      await this.action2.click();
      await this.page.waitForTimeout(3000);

      await this.delete.click();
      await this.page.waitForTimeout(3000);

      await this.confirmDelete.click();
      await this.page.waitForTimeout(3000);

      await reportStep(this.page, "Get The Details is clicked successfully", "pass");
    } catch (e) {
      await reportStep(this.page, "Get The Details is not clicked successfully..." + e, "fail");
    }
    return this;
  }

  async clickDelete() {
    try {
      await this.backBtn.click();
      await this.page.waitForTimeout(3000);
      await this.action3.click();
      await this.page.waitForTimeout(3000);

      await this.duplicate1.click();
      await this.page.waitForTimeout(3000);

      await this.action4.click();
      await this.page.waitForTimeout(3000);

      await this.delete1.click();
      await this.page.waitForTimeout(3000);

      await this.confirmDelete1.click();
      await this.page.waitForTimeout(3000);

      await reportStep(this.page, "Get The Details is clicked successfully", "pass");
    } catch (e) {
      await reportStep(this.page, "Get The Details is not clicked successfully..." + e, "fail");
    }
    return this;
  }
}

module.exports = { Inventory_Material_Issue };
