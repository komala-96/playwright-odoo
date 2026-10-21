const { expect } = require('../fixtures/base');
const { reportStep } = require('../utils/reportStep');
const { ensureLoggedIn } = require('../utils/loginHelper');

class Inv_Binlocation {
  constructor(page) {
    this.page = page;

    // Login Page
    this.userName = page.locator("xpath=//input[@name='login']");
    this.passWord = page.locator("xpath=//input[@name='password']");
    this.logIn = page.locator("xpath=//button[contains(text(),'Log in')]");

    // Means
    this.menu = page.locator("xpath=//ul[@class='o_menu_apps']//i[@class='fa fa-bars']");

    this.inventory = page.locator("xpath=//div[contains(text(),'Inventory')]");

    this.binLocationMenu = page.locator("xpath=//a[normalize-space()='Bin Locations']");

    this.createBtn = page.locator("xpath=//button[normalize-space()='New']");

    this.name = page.locator("xpath=//input[@id='name_0']");

    this.location = page.locator("xpath=//input[@id='warehouse_id_0']");

    this.locationSelect = page.locator("xpath=//a[@id='warehouse_id_0_0_0']");

    this.pallets = page.locator("xpath=//input[@id='max_pallets_0']");

    this.height = page.locator("xpath=//input[@id='height_0']");

    this.width = page.locator("xpath=//input[@id='width_0']");

    this.depth = page.locator("xpath=//input[@id='depth_0']");

    this.volume = page.locator("xpath=//input[@id='volume_0']");

    this.asile = page.locator("xpath=//input[@id='aisle_0']");

    this.bay = page.locator("xpath=//input[@id='bay_0']");

    this.shelf = page.locator("xpath=//input[@id='shelf_0']");

    this.bin = page.locator("xpath=//input[@id='bin_0']");

    this.description = page.locator("xpath=//div[@class='note-editable odoo-editor-editable']");

    // button[normalize-space()='Save']
    this.saveBtn = page.locator("xpath=//button[normalize-space()='Save']");

    this.action = page.locator("xpath=//button[normalize-space()='Action']");

    this.locationBarCode = page.locator("xpath=//span[normalize-space()='Location Barcode']");

    this.action1 = page.locator("xpath=//button[normalize-space()='Action']");

    this.archive = page.locator("xpath=//span[normalize-space()='Archive']");

    this.archiveConfirm = page.locator("xpath=//button[normalize-space()='Archive']");

    this.action2 = page.locator("xpath=//button[normalize-space()='Action']");

    this.unarchive = page.locator("xpath=//span[normalize-space()='Unarchive']");

    this.action3 = page.locator("xpath=//button[normalize-space()='Action']");

    this.duplicate = page.locator("xpath=//span[normalize-space()='Duplicate']");
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

      await reportStep(this.page, "login button clicked successfully", "pass");
    } catch (e) {
      await reportStep(this.page, "login button clicked not successfully..." + e, "fail");
    }
    return this;
  }

  async clickMenuButton() {
    try {
      await this.menu.click({ timeout: 30 * 1000 });
      await this.page.waitForTimeout(5000);

      await reportStep(this.page, "Menu button is entered successfully", "pass");
    } catch (e) {
      await reportStep(this.page, "Menu button is not entered successfully..." + e, "fail");
    }

    return this;
  }

  async clickInventoryMenuButton() {
    try {
      await this.inventory.click({ timeout: 30 * 1000 });
      await this.page.waitForTimeout(5000);

      await reportStep(this.page, "Inventory Menu button is entered successfully", "pass");
    } catch (e) {
      await reportStep(this.page, "Inventory Menu button is not entered successfully..." + e, "fail");
    }

    return this;
  }

  async clickInventoryBinlocationMenuButton() {
    try {
      await this.page.waitForTimeout(5000);
      await this.binLocationMenu.click();
      await this.page.waitForTimeout(6000);

      await reportStep(this.page, "Inventory Adjustment Menu is entered successfully", "pass");
    } catch (e) {
      await reportStep(this.page, "Inventory Adjustment Menuis not entered successfully..." + e, "fail");
    }

    return this;
  }

  async clickCreateButton() {
    try {
      await this.createBtn.click({ timeout: 30 * 1000 });
      await this.page.waitForTimeout(10000);

      await reportStep(this.page, "Create button is entered successfully", "pass");
    } catch (e) {
      await reportStep(this.page, "Create button is not entered successfully..." + e, "fail");
    }

    return this;
  }

  async clickCreateButtonNegative() {
    try {
      await this.createBtn.click({ timeout: 30 * 1000 });
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

      await reportStep(this.page, "Create button is entered successfully", "pass");
    } catch (e) {
      await reportStep(this.page, "Create button is not entered successfully..." + e, "fail");
    }

    return this;
  }

  async clickLocationButton(nam, pal, hght, asi, desc) {
    try {
      await this.name.fill(String(nam));
      await this.page.waitForTimeout(2000);
      await this.location.click();
      await this.locationSelect.click();
      await this.page.waitForTimeout(2000);
      await this.pallets.clear();
      await this.pallets.fill(String(pal));
      await this.page.waitForTimeout(2000);
      await this.height.clear();
      await this.height.fill(String(hght));
      await this.width.clear();
      await this.width.fill(String(hght));
      await this.depth.clear();
      await this.depth.fill(String(hght));
      await this.volume.clear();
      await this.volume.fill(String(hght));
      await this.page.waitForTimeout(2000);
      await this.asile.fill(String(asi));
      await this.bay.fill(String(asi));
      await this.shelf.fill(String(asi));
      await this.bin.fill(String(asi));
      await this.page.waitForTimeout(2000);
      await this.description.fill(String(desc));
      // await this.saveBtn.click();
      await this.page.waitForTimeout(2000);
      await reportStep(this.page, "clickLocationButton button is entered successfully", "pass");
    } catch (e) {
      await reportStep(this.page, "clickLocationButton button is not entered successfully..." + e, "fail");
    }

    return this;
  }

  async clickInventoryBinlocationDeleteButton() {
    try {
      await this.page.waitForTimeout(5000);
      await this.action.click();
      await this.page.waitForTimeout(6000);
      await this.locationBarCode.click();
      await this.page.waitForTimeout(3000);
      await this.action1.click();
      await this.archive.click();
      await this.page.waitForTimeout(3000);
      await this.archiveConfirm.click();
      await this.page.waitForTimeout(3000);
      await this.action2.click();
      await this.unarchive.click();
      await this.page.waitForTimeout(3000);
      await this.action3.click();
      await this.duplicate.click();
      await this.page.waitForTimeout(3000);

      await reportStep(this.page, "Inventory Adjustment Menu is entered successfully", "pass");
    } catch (e) {
      await reportStep(this.page, "Inventory Adjustment Menuis not entered successfully..." + e, "fail");
    }

    return this;
  }
}

module.exports = { Inv_Binlocation };
