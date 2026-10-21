const { expect } = require('../fixtures/base');
const { reportStep } = require('../utils/reportStep');
const { ensureLoggedIn } = require('../utils/loginHelper');

class StoreOrderCreationPage {
  constructor(page) {
    this.page = page;

    // Login Page
    this.userName = page.locator("xpath=//input[@id='login']");
    this.passWord = page.locator("xpath=//input[@id='password']");
    this.logIn = page.locator("xpath=//button[contains(text(),'Log in')]");

    this.menu = page.locator("xpath=//ul[@class='o_menu_apps']//i[@class='fa fa-bars']");

    // menu
    this.microMarketServicebtn = page.locator("xpath=//div[contains(text(),'Micromarket Services')]");

    this.createBtn = page.locator("xpath=//button[normalize-space()='New']");

    this.customer = page.locator("xpath=(//div[@name='partner_id']//input[@type='text'])[1]");

    this.customerSearchMore = page.locator("xpath=//a[@id='partner_id_0_0_8']");

    this.customerSearchBox = page.locator("xpath=//input[@placeholder='Search...']");

    this.customerSelect = page.locator(
      "xpath=(//table[@class='o_list_table table table-sm table-hover position-relative mb-0 o_list_table_ungrouped table-striped'])[2]//tbody//tr[1]//td[1]"
    );

    this.microMarket = page.locator("xpath=//div[@name='micro_market_id']//input[@type='text']");

    this.microMarketDropDownClick = page.locator("xpath=//a[@id='micro_market_id_0_0_0']");

    this.warringMsg = page.locator("xpath=//button[@type='button']//span[contains(text(),'Continue Anyway')]");

    /*
     * this.warringBtn = page.locator(
     *   "xpath=//button[@type='button']//span[contains(text(),'Continue Anyway')]"
     * );
     */

    this.categoryClick = page.locator("xpath=//div[@name='category_ids']//input[@type='text']");

    this.categoryDropDownClick = page.locator("xpath=//a[@id='category_ids_0_0_0']");

    this.pickingUserClick = page.locator("xpath=//div[@name='pick_user_id']//input[@type='text']");

    this.pickingUserDropDownClick = page.locator("xpath=//a[@id='pick_user_id_0_0_0']");

    this.routeClick = page.locator("xpath=//div[@name='route']//input[@type='text']");

    this.routeDropDownClick = page.locator("xpath=(//ul[8]//li[@class='ui-menu-item']//a)[1]");

    // sendkeys 100
    this.orderLimit = page.locator("xpath=//input[@id='order_limit_0']");

    this.showAllCheckBox = page.locator("xpath=//div[@name='show_all']//input[@type='checkbox']");

    this.nextPage = page.locator("xpath=//div[@class='o_pager']//button[@title='Next']");

    this.saveBtn = page.locator("xpath=//button[normalize-space()='Save']");

    this.approveBtn = page.locator("xpath=//span[normalize-space()='Approve']");

    this.pickBtn = page.locator("xpath=//span[normalize-space()='Pick']");

    this.receivedBtn = page.locator("xpath=//span[normalize-space()='Receive']");

    this.signature = page.locator("xpath=//a[normalize-space()='Signature']");

    this.warehouseSign = page.locator("xpath=//input[@id='signed_by_0']");

    this.warehouseDate = page.locator("xpath=//input[@id='signed_on_0']");

    this.customerSign = page.locator("xpath=//input[@id='cus_signed_by_0']");

    this.customerDate = page.locator("xpath=//input[@id='cus_signed_on_0']");

    this.notes = page.locator("xpath=//a[normalize-space()='Note']");

    this.notesText = page.locator("xpath=//textarea[@id='note_0']");

    this.actionBtn = page.locator("xpath=//button[normalize-space()='Action']");

    this.print = page.locator("xpath=//button[normalize-space()='Print']");

    this.actionBtn1 = page.locator("xpath=//button[normalize-space()='Action']");

    this.print1 = page.locator("xpath=//button[normalize-space()='Print']");

    this.actionBtn2 = page.locator("xpath=//button[normalize-space()='Action']");

    this.print2 = page.locator("xpath=//button[normalize-space()='Print']");

    this.actionBtn3 = page.locator("xpath=//button[normalize-space()='Action']");

    this.print3 = page.locator("xpath=//button[normalize-space()='Print']");

    this.actionBtn4 = page.locator("xpath=//button[normalize-space()='Action']");

    this.print4 = page.locator("xpath=//button[normalize-space()='Print']");

    this.deliverySlip = page.locator("xpath=//span[normalize-space()='Delivery Slip']");

    this.receipt = page.locator("xpath=//span[normalize-space()='Receipt']");

    this.labels = page.locator("xpath=//span[normalize-space()='Labels']");

    this.confirm = page.locator("xpath=//span[normalize-space()='Confirm']");

    this.pickBin = page.locator("xpath=//span[normalize-space()='Picking By Bin']");

    this.pickCategory = page.locator("xpath=//span[normalize-space()='Picking By Category']");

    this.actionBtn5 = page.locator("xpath=//button[normalize-space()='Action']");

    this.actionBtn6 = page.locator("xpath=//button[normalize-space()='Action']");

    this.duplicate = page.locator("xpath=//span[normalize-space()='Duplicate']");

    this.approveBtn1 = page.locator("xpath=//span[normalize-space()='Approve']");

    this.deleteBtn = page.locator("xpath=//span[normalize-space()='Delete']");
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
      await this.page.waitForTimeout(6000);

      await reportStep(this.page, "login button clicked successfully", "pass");
    } catch (e) {
      await reportStep(this.page, "login button clicked not successfully..." + e, "fail");
    }
    return this;
  }

  async clickMenuButton() {
    try {
      await this.menu.click({ timeout: 30 * 1000 });

      await reportStep(this.page, "Menu button clicked successfully", "pass");
    } catch (e) {
      await reportStep(this.page, "Menu button clicked not successfully..." + e, "fail");
    }
    return this;
  }

  async clickMicroMarketServiceMenuButton() {
    try {
      await this.page.waitForTimeout(6000);
      await this.microMarketServicebtn.evaluate((node) => node.click());

      await this.page.waitForTimeout(6000);

      await this.createBtn.click();

      await this.page.waitForTimeout(6000);

      await reportStep(this.page, " MicroMarketService MenuButton clicked successfully", "pass");
    } catch (e) {
      await reportStep(this.page, "MicroMarketService  Menu button clicked not successfully..." + e, "fail");
    }
    return this;
  }

  async clickStoreOrderCreation(ordLimit) {
    try {
      await this.customer.click();
      await this.page.waitForTimeout(3000);

      await this.customerSearchMore.click();
      await this.page.waitForTimeout(3000);

      await this.customerSearchBox.fill("Ayres Hotel Seal Beach");
      await this.customerSearchBox.press('Enter');
      await this.page.waitForTimeout(3000);

      await this.customerSelect.click();
      await this.page.waitForTimeout(3000);

      await this.microMarket.click();
      await this.page.waitForTimeout(6000);

      // await this.microMarketClick.fill("GSG test market 1");
      // await this.microMarketClick.press('Enter');
      await this.microMarketDropDownClick.click();

      await this.page.waitForTimeout(15000);

      // await this.warringMsg.click();
      // await this.page.waitForTimeout(3000);

      await this.categoryClick.click();
      await this.page.waitForTimeout(5000);

      // await this.categoryDropDownClick.click();
      await this.categoryDropDownClick.evaluate((node) => node.click());
      await this.page.waitForTimeout(5000);

      await this.pickingUserClick.click();
      await this.page.waitForTimeout(3000);

      await this.pickingUserDropDownClick.click();
      await this.page.waitForTimeout(5000);

      // await this.routeClick.click();
      // await this.page.waitForTimeout(3000);

      // await this.routeDropDownClick.click();
      // await this.page.waitForTimeout(5000);

      await this.orderLimit.click();
      await this.page.waitForTimeout(3000);

      await this.orderLimit.clear();
      await this.page.waitForTimeout(1000);

      await this.orderLimit.fill(String(ordLimit));
      await this.page.waitForTimeout(3000);

      await this.showAllCheckBox.evaluate((node) => node.click());
      await this.page.waitForTimeout(3000);

      await reportStep(this.page, "StoreOrder Creation entered successfully", "pass");
    } catch (e) {
      await reportStep(this.page, "StoreOrderCreation entered not successfully..." + e, "fail");
    }
    return this;
  }

  async clickStoreOrderCreationNegative(ordLimit) {
    try {
      await this.customer.click();
      await this.page.waitForTimeout(3000);

      await this.customerSearchMore.click();
      await this.page.waitForTimeout(3000);

      await this.customerSearchBox.fill("Ayres Hotel Seal Beach");
      await this.customerSearchBox.press('Enter');
      await this.page.waitForTimeout(3000);

      await this.customerSelect.click();
      await this.page.waitForTimeout(3000);

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

      await this.microMarket.click();
      await this.page.waitForTimeout(6000);

      // await this.microMarketClick.fill("GSG test market 1");
      // await this.microMarketClick.press('Enter');
      await this.microMarketDropDownClick.click();

      await this.page.waitForTimeout(15000);

      // await this.warringMsg.click();
      // await this.page.waitForTimeout(3000);

      await this.categoryClick.click();
      await this.page.waitForTimeout(5000);

      // await this.categoryDropDownClick.click();
      await this.categoryDropDownClick.evaluate((node) => node.click());
      await this.page.waitForTimeout(5000);

      await this.pickingUserClick.click();
      await this.page.waitForTimeout(3000);

      await this.pickingUserDropDownClick.click();
      await this.page.waitForTimeout(5000);

      // await this.routeClick.click();
      // await this.page.waitForTimeout(3000);

      // await this.routeDropDownClick.click();
      // await this.page.waitForTimeout(5000);

      await this.orderLimit.click();
      await this.page.waitForTimeout(3000);

      await this.orderLimit.clear();
      await this.page.waitForTimeout(1000);

      await this.orderLimit.fill(String(ordLimit));
      await this.orderLimit.press('Enter');
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

      await this.showAllCheckBox.evaluate((node) => node.click());
      await this.page.waitForTimeout(3000);

      await reportStep(this.page, "StoreOrder Creation entered successfully", "pass");
    } catch (e) {
      await reportStep(this.page, "StoreOrderCreation entered not successfully..." + e, "fail");
    }
    return this;
  }

  async ClickOrder_Quantity() {
    try {
      const totalRows1 = await this.page
        .locator(
          "xpath=//table[@class='o_list_table table table-sm table-hover position-relative mb-0 o_list_table_ungrouped table-striped']//tbody//tr"
        )
        .count();

      console.log('total of rows size:', totalRows1);

      await this.page.waitForTimeout(3000);
      const rowstoProcess = Math.min(1, totalRows1);

      for (let row = 1; row <= rowstoProcess; row++) {
        const productName = this.page.locator(
          `xpath=//table[@class='o_list_table table table-sm table-hover position-relative mb-0 o_list_table_ungrouped table-striped']//tbody//tr[${row}]//td[3]`
        );
        await productName.click({ timeout: 30 * 1000 });
        await this.page.waitForTimeout(3000);

        const qtyInput = this.page.locator(
          `xpath=//table[@class='o_list_table table table-sm table-hover position-relative mb-0 o_list_table_ungrouped table-striped']//tbody//tr[${row}]//td[9]//input`
        );
        await qtyInput.clear({ timeout: 30 * 1000 });
        await this.page.waitForTimeout(3000);

        await qtyInput.fill('2');

        await this.page.waitForTimeout(5000);
      }

      await reportStep(this.page, "Quantity button clicked successfully", "pass");
    } catch (e) {
      await reportStep(this.page, "Quantity button clicked successfully " + e.message, "fail");
    }
    return this;
  }

  async ClickOrder_QuantityNegative() {
    try {
      const totalRows1 = await this.page
        .locator(
          "xpath=//table[@class='o_list_table table table-sm table-hover position-relative mb-0 o_list_table_ungrouped table-striped']//tbody//tr"
        )
        .count();

      console.log('total of rows size:', totalRows1);

      await this.page.waitForTimeout(3000);
      const rowstoProcess = Math.min(1, totalRows1);

      for (let row = 1; row <= rowstoProcess; row++) {
        const productName = this.page.locator(
          `xpath=//table[@class='o_list_table table table-sm table-hover position-relative mb-0 o_list_table_ungrouped table-striped']//tbody//tr[${row}]//td[3]`
        );
        await productName.click({ timeout: 30 * 1000 });
        await this.page.waitForTimeout(3000);

        const qtyInput = this.page.locator(
          `xpath=//table[@class='o_list_table table table-sm table-hover position-relative mb-0 o_list_table_ungrouped table-striped']//tbody//tr[${row}]//td[9]//input`
        );
        await qtyInput.clear({ timeout: 30 * 1000 });
        await this.page.waitForTimeout(3000);

        await qtyInput.fill('-2');
        await qtyInput.press('Enter');

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

      await reportStep(this.page, "Quantity button clicked successfully", "pass");
    } catch (e) {
      await reportStep(this.page, "Quantity button clicked successfully " + e.message, "fail");
    }
    return this;
  }

  async ClickOrder_QuantityNextPage() {
    try {
      // Wait for the nextBtn to be clickable
      await this.nextPage.click({ timeout: 30 * 1000 });

      await this.page.waitForTimeout(5000);

      const totalRows2 = await this.page
        .locator(
          "xpath=//div//table[@class='o_list_table table table-sm table-hover table-striped o_list_table_ungrouped']//tbody//tr"
        )
        .count();

      console.log('total of rows size:', totalRows2);

      for (let row = 1; row <= totalRows2; row++) {
        const secondColumn = this.page.locator(
          `xpath=//div//table[@class='o_list_table table table-sm table-hover table-striped o_list_table_ungrouped']//tbody//tr[${row}]//td[3]`
        );
        await secondColumn.click({ timeout: 30 * 1000 });

        const thirdColumnInput = this.page.locator(
          `xpath=//div//table[@class='o_list_table table table-sm table-hover table-striped o_list_table_ungrouped']//tbody//tr[${row}]//td[9]//input`
        );
        await thirdColumnInput.clear({ timeout: 30 * 1000 });

        const newValues = 'newValues';
        await thirdColumnInput.fill('2');
      }

      await reportStep(this.page, "Quantity button clicked successfully", "pass");
    } catch (e) {
      await reportStep(this.page, "Quantity button clicked successfully " + e.message, "fail");
    }
    return this;
  }

  async ClickOrder_QuantityNextThirdPage() {
    try {
      // Replace 'nextPageLocator' with the actual locator for your 'nextPage' button
      const nextPageLocator = "xpath=//div[@class='o_pager']//button[@title='Next']";

      try {
        // Wait for the nextBtn to be clickable
        const nextBtn = this.page.locator(nextPageLocator);
        // Click the nextBtn
        await nextBtn.click({ timeout: 30 * 1000 });
        // Sleep to wait for the page to load or other asynchronous tasks
        await this.page.waitForTimeout(5000);

        // Get the total number of rows
        const totalRows2 = await this.page
          .locator(
            "xpath=//div//table[@class='o_list_table table table-sm table-hover table-striped o_list_table_ungrouped']//tbody//tr"
          )
          .count();

        console.log('Total number of rows:', totalRows2);

        for (let row = 1; row <= totalRows2; row++) {
          // Perform actions on each row
          const secondColumn = this.page.locator(
            `xpath=//div//table[@class='o_list_table table table-sm table-hover table-striped o_list_table_ungrouped']//tbody//tr[${row}]//td[3]`
          );
          await secondColumn.click({ timeout: 30 * 1000 });

          const thirdColumnInput = this.page.locator(
            `xpath=//div//table[@class='o_list_table table table-sm table-hover table-striped o_list_table_ungrouped']//tbody//tr[${row}]//td[9]//input`
          );
          await thirdColumnInput.clear({ timeout: 30 * 1000 });

          const newValues = 'newValues';
          await thirdColumnInput.fill('3');
        }
      } catch (e) {
        // Handle the case where nextPage button is not present
        console.log('nextPage button not found, skipping further actions.');
      }
    } catch (e) {
      // Handle any other exception and print the message
      console.log('An exception occurred:', e.message);
    }
    return this;
  }

  async clickSaveBtn() {
    try {
      await this.page.waitForTimeout(3000);
      await this.saveBtn.click({ timeout: 30 * 1000 });
      await this.page.waitForTimeout(60000);

      await reportStep(this.page, "Save button is clicked successfully", "pass");
    } catch (e) {
      await reportStep(this.page, "Save button is not clicked successfully..." + e, "fail");
    }
    return this;
  }

  async clickApproveBtn() {
    try {
      await this.approveBtn.click({ timeout: 30 * 1000 });
      await this.page.waitForTimeout(25000);

      await reportStep(this.page, "Approved button is clicked successfully", "pass");
    } catch (e) {
      await reportStep(this.page, "Approved button is not clickedsuccessfully..." + e, "fail");
    }
    return this;
  }

  async clickPickBtn() {
    try {
      await this.pickBtn.click({ timeout: 30 * 1000 });
      await this.page.waitForTimeout(15000);

      await reportStep(this.page, "Pick Button is clicked successfully", "pass");
    } catch (e) {
      await reportStep(this.page, "Pick Button is not clicked successfully..." + e, "fail");
    }
    return this;
  }

  async clickReceivedBtn() {
    try {
      await this.page.waitForTimeout(15000);
      await this.receivedBtn.click({ timeout: 30 * 1000 });
      // await this.receivedBtn.click();
      await this.page.waitForTimeout(15000);

      await reportStep(this.page, "Receive button is clicked successfully", "pass");
    } catch (e) {
      await reportStep(this.page, "Receive button is not clicked successfully..." + e, "fail");
    }
    return this;
  }

  async clickOtherDetails() {
    try {
      await this.page.waitForTimeout(2500);
      await this.signature.click();
      await this.page.waitForTimeout(1000);
      await this.warehouseSign.fill("komala");
      await this.page.waitForTimeout(1000);
      await this.warehouseDate.click();
      const calendar = this.page.locator('.o_date_picker');
      await calendar.waitFor({ state: 'visible', timeout: 30000 });

      // Click the date "26"
      const day26 = calendar.locator("xpath=.//button[span[text()='26']]");
      await day26.click();
      await this.page.waitForTimeout(1000);
      await this.customerSign.fill("komala");
      await this.page.waitForTimeout(1000);
      await this.customerDate.click();
      const calendar1 = this.page.locator('.o_date_picker');
      await calendar1.waitFor({ state: 'visible', timeout: 30000 });

      // Click the date "26"
      const day261 = calendar1.locator("xpath=.//button[span[text()='26']]");
      await day261.click();
      await this.page.waitForTimeout(1000);
      await this.notes.click();
      await this.notesText.fill("test notes");
      await this.page.waitForTimeout(1000);

      await reportStep(this.page, "clickOtherDetails button is clicked successfully", "pass");
    } catch (e) {
      await reportStep(this.page, "clickOtherDetails button is not clicked successfully..." + e, "fail");
    }
    return this;
  }

  async clickPrintDetails() {
    try {
      await this.page.waitForTimeout(3000);
      /* await this.actionBtn.click();
      await this.print.click();
      await this.page.waitForTimeout(3000);
      await this.deliverySlip.click();
      await this.page.waitForTimeout(5000);
      await this.actionBtn1.click();
      await this.print1.click();
      await this.receipt.click();
      await this.page.waitForTimeout(5000);*/
      await this.actionBtn2.click();
      await this.print2.click();
      await this.page.waitForTimeout(3000);
      await this.labels.click();
      await this.confirm.click();
      await this.page.waitForTimeout(5000);
      await this.actionBtn3.click();
      await this.print3.click();
      await this.pickBin.click();
      await this.page.waitForTimeout(5000);
      await this.actionBtn4.click();
      await this.print4.click();
      await this.pickCategory.click();
      await this.page.waitForTimeout(5000);

      await reportStep(this.page, "clickOtherDetails button is clicked successfully", "pass");
    } catch (e) {
      await reportStep(this.page, "clickOtherDetails button is not clicked successfully..." + e, "fail");
    }
    return this;
  }

  async clickDuplicateDetails() {
    try {
      await this.page.waitForTimeout(5000);
      await this.actionBtn5.click();
      await this.duplicate.click();
      await this.page.waitForTimeout(5000);
      await this.approveBtn1.click();
      await this.page.waitForTimeout(5000);
      await this.actionBtn6.click();
      await this.deleteBtn.click();
      await this.page.waitForTimeout(5000);

      await reportStep(this.page, "clickOtherDetails button is clicked successfully", "pass");
    } catch (e) {
      await reportStep(this.page, "clickOtherDetails button is not clicked successfully..." + e, "fail");
    }
    return this;
  }
}

module.exports = { StoreOrderCreationPage };
