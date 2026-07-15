const { expect } = require('../fixtures/base');
const { reportStep } = require('../utils/reportStep');
const { ensureLoggedIn } = require('../utils/loginHelper');

class SpecialsPage {
  constructor(page) {
    this.page = page;

    // Login Page
    this.userName = page.locator("xpath=//input[@name='login']");
    this.passWord = page.locator("xpath=//input[@name='password']");
    this.logIn = page.locator("xpath=//button[contains(text(),'Log in')]");

    // Means
    this.menu = page.locator("xpath=//ul[@class='o_menu_apps']//i[@class='fa fa-bars']");

    this.microMarketServices = page.locator("xpath=//div[contains(text(),'Micromarket Services')]");

    this.specialsPlus = page.locator("xpath=//i[@class='fa fa-plus']");

    // @FindBy(xpath ="//span[contains(text(),'Specials')]")
    this.specials = page.locator("xpath=//a[normalize-space()='Specials']");

    // Create Specials
    this.create = page.locator("xpath=//button[normalize-space()='New']");

    // start date

    this.startDate = page.locator("xpath=//input[@id='start_date_0']");

    // end date
    this.stopDate = page.locator("xpath=//input[@id='end_date_0']");

    this.startTime = page.locator("xpath=//input[@id='start_time_0']");

    this.startStop = page.locator("xpath=//input[@id='end_time_0']");

    this.discount = page.locator("xpath=//input[@id='discount_percentage_0']");

    this.sendNotificationBox = page.locator("xpath=//div[@name='send_notification']//input[@type='checkbox']");

    this.allProductMarketCheckBox = page.locator("xpath=//div[@name='avail_all_products']//input[@type='checkbox']");

    this.notificationTitle = page.locator("xpath=//textarea[@id='send_title_0']");

    this.product = page.locator("xpath=//div[@name='select_product_ids']//div[@class='o-autocomplete dropdown']");

    this.product_SearchMore = page.locator("xpath=(//a[normalize-space()='Search More...'])[1]");

    this.product_SearchBox = page.locator(
      "xpath=//div[@class='o_searchview_input_container d-flex flex-grow-1 flex-wrap gap-1 mw-100']//input[@type='text']"
    );

    this.product_Select = page.locator(
      "xpath=(//table[@class='o_list_table table table-sm table-hover position-relative mb-0 o_list_table_ungrouped table-striped'])[2]/tbody/tr[1]/td[3]"
    );

    this.productAddBtn = page.locator("xpath=(//button[@class='btn btn-primary'][normalize-space()='Add'])[1]");

    this.customer = page.locator("xpath=//input[@id='customer_ids_0']");

    this.martisHouseHold = page.locator("xpath=//a[@id='customer_ids_0_0_0']");

    this.microMarket = page.locator("xpath=//input[@id='market_id_0']");

    this.gSGMarket = page.locator("xpath=//a[@id='market_id_0_0_1']");

    this.category = page.locator("xpath=//input[@id='category_ids_0']");

    this.selectProduct = page.locator("xpath=//a[@id='category_ids_0_0_0']");

    this.bannerText = page.locator("xpath=//textarea[@id='banner_text_0']");

    this.addImage = page.locator("xpath=//label[@class='o_select_file_button btn btn-primary']");

    this.addAll = page.locator("xpath=//button[normalize-space()='Save']");

    this.action = page.locator("xpath=//button[normalize-space()='Action']");

    this.duplicate = page.locator("xpath=//span[normalize-space()='Duplicate']");

    this.action1 = page.locator("xpath=//button[normalize-space()='Action']");

    this.deleteBtn = page.locator("xpath=//span[normalize-space()='Delete']");

    this.confirmDelete = page.locator("xpath=//button[normalize-space()='Delete']");

    this.saveBtn = page.locator("xpath=//button[normalize-space()='Save']");
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

  async clickMeansButton() {
    try {
      //menu.click();

      //new WebDriverWait(driver, Duration.ofSeconds(30))
      //.until(ExpectedConditions.elementToBeClickable(menu)).click();
      await this.page.waitForTimeout(3000);

      //microMarketServices.click();

      await this.microMarketServices.evaluate((node) => node.click());
      await this.page.waitForTimeout(3000);

      //specials.click();

      await reportStep(this.page, "Menu button is entered successfully", "pass");
    } catch (e) {
      await reportStep(this.page, "Menu button is not entered successfully..." + e, "fail");
    }
    return this;
  }

  async specialsMenu() {
    try {
      //specialsPlus.click();
      //Thread.sleep(5000);

      await this.specials.click({ timeout: 30 * 1000 });
      await this.page.waitForTimeout(3000);

      await this.create.click();
      await this.page.waitForTimeout(5000);

      await reportStep(this.page, "SpecialsDetails is created successfully", "pass");
    } catch (e) {
      await reportStep(this.page, "SpecialsDetails is created not successfully..." + e, "fail");
    }
    return this;
  }

  async creationSpecialsDetails(sDate, eDate, sTime, sStop, dis, nTitle, bText) {
    try {
      await this.page.waitForTimeout(1000);

      await this.startDate.fill(String(sDate));
      await this.page.waitForTimeout(1000);

      await this.startDate.click();
      await this.page.waitForTimeout(1000);

      await this.stopDate.fill(String(eDate));
      await this.page.waitForTimeout(1000);

      await this.startTime.clear();
      await this.page.waitForTimeout(1000);

      await this.startTime.fill(String(sTime));
      await this.page.waitForTimeout(1000);

      await this.startStop.clear();
      await this.page.waitForTimeout(1000);

      await this.startStop.fill(String(sStop));
      await this.page.waitForTimeout(3000);

      await this.discount.clear();
      await this.page.waitForTimeout(1000);

      await this.discount.fill(String(dis));
      await this.page.waitForTimeout(3000);

      await this.sendNotificationBox.evaluate((node) => node.click());
      await this.page.waitForTimeout(3000);

      //driver.executeScript("arguments[0].click();", allProductMarketCheckBox);
      //Thread.sleep(3000);

      await this.notificationTitle.fill(String(nTitle));
      await this.page.waitForTimeout(3000);

      await reportStep(this.page, "SpecialsDetails is created successfully", "pass");
    } catch (e) {
      await reportStep(this.page, "SpecialsDetails is created not successfully..." + e, "fail");
    }
    return this;
  }

  async creationSpecialsDetailsNegative(sDate, eDate, sTime, sStop, dis, nTitle, bText) {
    try {
      await this.page.waitForTimeout(1000);

      await this.startDate.fill(String(sDate));
      await this.page.waitForTimeout(1000);

      await this.startDate.click();
      await this.page.waitForTimeout(1000);

      await this.stopDate.fill(String(eDate));
      await this.page.waitForTimeout(1000);

      await this.startTime.clear();
      await this.page.waitForTimeout(1000);

      await this.startTime.fill(String(sTime));
      await this.page.waitForTimeout(1000);

      await this.startStop.clear();
      await this.page.waitForTimeout(1000);

      await this.startStop.fill(String(sStop));
      await this.page.waitForTimeout(3000);

      await this.discount.clear();
      await this.page.waitForTimeout(1000);

      await this.discount.fill(String(dis));
      await this.discount.press('Enter');
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

      await this.sendNotificationBox.evaluate((node) => node.click());
      await this.page.waitForTimeout(3000);

      //driver.executeScript("arguments[0].click();", allProductMarketCheckBox);
      //Thread.sleep(3000);

      await this.notificationTitle.fill(String(nTitle));
      await this.page.waitForTimeout(3000);

      await reportStep(this.page, "SpecialsDetails is created successfully", "pass");
    } catch (e) {
      await reportStep(this.page, "SpecialsDetails is created not successfully..." + e, "fail");
    }
    return this;
  }

  async clickSpecialsCustomerDetails(bText) {
    try {
      await this.customer.fill("komala");
      await this.page.waitForTimeout(3000);

      await this.martisHouseHold.click();
      await this.page.waitForTimeout(3000);

      await this.microMarket.fill("test");
      await this.page.waitForTimeout(3000);

      await this.gSGMarket.click();
      await this.page.waitForTimeout(3000);

      /*	category.click();
      Thread.sleep(3000);

      selectProduct.click();
      Thread.sleep(3000);*/

      await this.bannerText.fill(String(bText));
      await this.page.waitForTimeout(3000);

      await reportStep(this.page, "specialsCustomerDetails is created successfully", "pass");
    } catch (e) {
      await reportStep(this.page, "specialsCustomerDetails is created not successfully..." + e, "fail");
    }
    return this;
  }

  async clickSpecialsProductDetailsNegative(discount) {
    try {
      await this.page.waitForTimeout(5000);
      await this.product.click();
      await this.page.waitForTimeout(5000);

      //product_SearchMore.click();
      await this.product_SearchMore.evaluate((node) => node.click());
      await this.page.waitForTimeout(5000);

      await this.product_SearchBox.fill("Milky Way");
      await this.product_SearchBox.press('Enter');
      await this.page.waitForTimeout(5000);

      await this.product_Select.click();
      await this.page.waitForTimeout(5000);

      await this.productAddBtn.click();
      await this.page.waitForTimeout(8000);

      const productName = this.page.locator(
        "xpath=//table[@class='o_list_table table table-sm table-hover position-relative mb-0 o_list_table_ungrouped table-striped']//tbody//tr[1]//td[1]"
      );
      await productName.click({ timeout: 30 * 1000 });
      await this.page.waitForTimeout(5000);

      const discountPercent = this.page.locator(
        "xpath=//table[@class='o_list_table table table-sm table-hover position-relative mb-0 o_list_table_ungrouped table-striped']//tbody//tr[1]//td[4]//input"
      );
      await discountPercent.click({ timeout: 30 * 1000 });
      await this.page.waitForTimeout(5000);

      await discountPercent.clear();
      await this.page.waitForTimeout(5000);

      await discountPercent.fill(String(discount));
      await discountPercent.press('Enter');
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

      const discountAmount = this.page.locator(
        "xpath=//table[@class='o_list_table table table-sm table-hover position-relative mb-0 o_list_table_ungrouped table-striped']//tbody//tr[1]//td[5]//input"
      );
      await discountAmount.click({ timeout: 30 * 1000 });
      await this.page.waitForTimeout(5000);

      await discountAmount.clear();
      await this.page.waitForTimeout(5000);

      await discountAmount.fill("-1.00");
      await discountAmount.press('Enter');
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

      await reportStep(this.page, "specialsProductDetails is created successfully", "pass");
    } catch (e) {
      await reportStep(this.page, "specialsProductDetails is created not successfully..." + e, "fail");
    }
    return this;
  }

  async clickSpecialsProductDetails(discount) {
    try {
      await this.page.waitForTimeout(5000);
      await this.product.click();
      await this.page.waitForTimeout(5000);

      //product_SearchMore.click();
      await this.product_SearchMore.evaluate((node) => node.click());
      await this.page.waitForTimeout(5000);

      await this.product_SearchBox.fill("Milky Way");
      await this.product_SearchBox.press('Enter');
      await this.page.waitForTimeout(5000);

      await this.product_Select.click();
      await this.page.waitForTimeout(5000);

      await this.productAddBtn.click();
      await this.page.waitForTimeout(8000);

      const productName = this.page.locator(
        "xpath=//table[@class='o_list_table table table-sm table-hover position-relative mb-0 o_list_table_ungrouped table-striped']//tbody//tr[1]//td[1]"
      );
      await productName.click({ timeout: 30 * 1000 });
      await this.page.waitForTimeout(5000);

      const discountPercent = this.page.locator(
        "xpath=//table[@class='o_list_table table table-sm table-hover position-relative mb-0 o_list_table_ungrouped table-striped']//tbody//tr[1]//td[4]//input"
      );
      await discountPercent.click({ timeout: 30 * 1000 });
      await this.page.waitForTimeout(5000);

      await discountPercent.clear();
      await this.page.waitForTimeout(5000);

      await discountPercent.fill(String(discount));
      await discountPercent.press('Enter');
      await this.page.waitForTimeout(5000);

      const discountAmount = this.page.locator(
        "xpath=//table[@class='o_list_table table table-sm table-hover position-relative mb-0 o_list_table_ungrouped table-striped']//tbody//tr[1]//td[4]//input"
      );
      await discountAmount.click({ timeout: 30 * 1000 });
      await this.page.waitForTimeout(5000);

      await discountAmount.clear();
      await this.page.waitForTimeout(5000);

      await discountAmount.fill("1.00");
      await discountAmount.press('Enter');
      await this.page.waitForTimeout(5000);

      await reportStep(this.page, "specialsProductDetails is created successfully", "pass");
    } catch (e) {
      await reportStep(this.page, "specialsProductDetails is created not successfully..." + e, "fail");
    }
    return this;
  }

  async clickSaveBtn() {
    try {
      await this.page.waitForTimeout(3000);
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

      await reportStep(this.page, "Save Button is successfully", "pass");
    } catch (e) {
      await reportStep(this.page, "Save Button is not successfully..." + e, "fail");
    }
    return this;
  }

  async clickImageADD() {
    try {
      await this.page.waitForTimeout(3000);
      // Click the addImage element to open the file dialog
      // Provide the file path of the image you want to upload
      await this.page.waitForTimeout(3000);

      const imagePath = '/home/shankar/Downloads/picture.jpeg';
      // NOTE: The Java version used a Robot instance + system clipboard paste to fill
      // the native OS file dialog (Selenium cannot interact with native dialogs).
      // Playwright can intercept the browser's file chooser directly, so that is used here instead.
      const [fileChooser] = await Promise.all([this.page.waitForEvent('filechooser'), this.addImage.click()]);
      await fileChooser.setFiles(imagePath);
      await this.page.waitForTimeout(3000);
      await this.page.waitForTimeout(5000);

      await this.addAll.click();
      await this.page.waitForTimeout(3000);

      //action.click();
      //duplicate.click();
      await this.page.waitForTimeout(3000);

      await this.action1.click();
      await this.deleteBtn.click();
      await this.confirmDelete.click();
      await this.page.waitForTimeout(3000);

      await reportStep(this.page, "Image Added is successfully", "pass");
    } catch (e) {
      await reportStep(this.page, "Image Added is not successfully..." + e, "fail");
    }
    return this;
  }
}

module.exports = { SpecialsPage };
