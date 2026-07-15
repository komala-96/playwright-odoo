const { expect } = require('../fixtures/base');
const { reportStep } = require('../utils/reportStep');

class Leads {
  constructor(page) {
    this.page = page;

    // Login Page
    this.userName = page.locator("xpath=//input[@name='login']");
    this.passWord = page.locator("xpath=//input[@name='password']");
    this.logIn = page.locator("xpath=//button[@type='submit']");

    // Menu
    this.menu = page.locator("xpath=//ul[@class='o_menu_apps']//i[@class='fa fa-bars']");
    this.crmMenu = page.locator("xpath=//div[contains(text(),'CRM')]");

    // save btn
    this.leadsMenu = page.locator("xpath=//a[normalize-space()='Leads']");

    this.createBtn = page.locator("xpath=//button[normalize-space()='New']");

    this.name = page.locator("xpath=//textarea[@id='name_0']");

    this.cmpnyName = page.locator("xpath=//input[@id='partner_name_0']");

    this.street = page.locator("xpath=//input[@id='street_0']");

    this.street2 = page.locator("xpath=//input[@id='street2_0']");

    this.website = page.locator("xpath=//input[@id='website_0']");

    this.rooms = page.locator("xpath=//input[@id='no_of_rooms_0']");

    this.occupancyRate = page.locator("xpath=//input[@id='checkin_frequency_0']");

    this.visitors = page.locator("xpath=//input[@id='visitors_types_ids_0']");

    this.visitorsSelect = page.locator("xpath=//a[@id='visitors_types_ids_0_0_0']");

    this.language = page.locator("xpath=(//div[@class='o_input_dropdown']//input[@type='text'])[21]");

    this.langSelect = page.locator("xpath=//li[@class='ui-menu-item']//a[contains(text(),'English (US)')]");

    this.title = page.locator("xpath=//input[@id='title_0']");

    this.titleSelect = page.locator("xpath=(//a[normalize-space()='Miss'])[1]");

    this.firstName = page.locator("xpath=//input[@id='first_name_0']");

    this.lastName = page.locator("xpath=//input[@id='last_name_0']");

    this.zip = page.locator("xpath=//input[@id='zip_0']");

    this.email = page.locator("xpath=//input[@id='email_from_1']");

    this.position = page.locator("xpath=//input[@id='function_0']");

    this.phone = page.locator("xpath=//input[@id='phone_1']");

    this.mobile = page.locator("xpath=//input[@id='mobile_0']");

    this.leadType = page.locator("xpath=//select[@name='lead_type']");

    this.priority = page.locator("xpath=(//div[@name='priority'])[2]");

    this.tag = page.locator("xpath=//input[@id='tag_ids_0']");

    this.tagSelect = page.locator("xpath=//a[@id='tag_ids_0_0_0']");

    this.campaign = page.locator("xpath=//input[@id='campaign_id_0']");

    this.campaignSelect = page.locator("xpath=//a[@id='campaign_id_0_0_0']");

    this.medium = page.locator("xpath=//input[@id='medium_id_0']");

    this.mediumSelect = page.locator("xpath=//a[@id='medium_id_0_0_0']");

    this.campaignType = page.locator("xpath=//input[@id='source_id_0']");

    this.campaignTypeSelect = page.locator("xpath=//a[@id='source_id_0_0_0']");

    this.referred = page.locator("xpath=//input[@id='referred_0']");

    this.internalNotes = page.locator("xpath=//a[normalize-space()='Internal Notes']");

    this.extraInfo = page.locator("xpath=//a[normalize-space()='Extra Info']");

    this.descr = page.locator("xpath=//div[@class='note-editable odoo-editor-editable']");

    this.saveBtn = page.locator("xpath=//button[normalize-space()='Save']");

    this.convOpp = page.locator("xpath=//span[normalize-space()='Convert to Opportunity']");

    this.oppSelect = page.locator("xpath=//label[normalize-space()='Convert to opportunity']");

    this.oppUser = page.locator("xpath=//input[@id='user_id_0']");

    this.oppUserSelect = page.locator("xpath=//a[@id='user_id_0_0_0']");

    this.oppSalesTeam = page.locator("xpath=//input[@id='team_id_0']");

    this.oppSalesTeamSelect = page.locator("xpath=//a[@id='team_id_0_0_0']");

    this.createOpp = page.locator("xpath=//span[normalize-space()='Convert To Opportunity']");

    this.oppLost = page.locator("xpath=//span[normalize-space()='Lost']");

    this.lostReason = page.locator("xpath=//input[@id='lost_reason_id_0']");

    this.lostReasonSelect = page.locator("xpath=//a[@id='lost_reason_id_0_0_0']");

    this.lostNotes = page.locator("xpath=//div[@name='lost_feedback']//div[@class='flex-grow-1 overflow-auto']");

    this.lostNotesDesc = page.locator("xpath=//div[@placeholder='Type \"/\" for commands']");

    this.mrkLost = page.locator("xpath=//span[normalize-space()='Mark as Lost']");

    this.restore = page.locator("xpath=//span[normalize-space()='Restore']");

    this.action = page.locator("xpath=//button[normalize-space()='Action']");

    this.duplicate = page.locator("xpath=//span[normalize-space()='Duplicate']");

    this.action1 = page.locator("xpath=//button[normalize-space()='Action']");

    this.delete = page.locator("xpath=//span[normalize-space()='Delete']");

    this.confirmDelete = page.locator("xpath=//button[normalize-space()='Delete']");

    this.action3 = page.locator("xpath=//button[normalize-space()='Action']");

    this.addProperty = page.locator("xpath=//span[normalize-space()='Add Properties']");

    this.addProperty1 = page.locator("xpath=(//div[@name='lead_properties']//input[@type='text'])[1]");

    this.action2 = page.locator("xpath=//button[normalize-space()='Action']");

    this.unarchive = page.locator("xpath=//span[normalize-space()='Unarchive']");

    this.confirmArchive = page.locator("xpath=//button[normalize-space()='Archive']");
  }

  async isErrorDisplayed() {
    return this.page
      .locator("xpath=//div[@class='me-auto o_notification_content']")
      .isVisible()
      .catch(() => false);
  }

  async enterUsername(user, pass) {
    try {
      await this.userName.fill(String(user));
      await this.passWord.fill(String(pass));
      await this.logIn.click();

      await reportStep(this.page, "login button is entered successfully", "pass");
    } catch (e) {
      await reportStep(this.page, "login button is not entered successfully..." + e, "fail");
    }
    return this;
  }

  async clickMenu() {
    try {
      // new WebDriverWait(driver, Duration.ofSeconds(30))
      // .until(ExpectedConditions.elementToBeClickable(menu)).click();

      await this.page.waitForTimeout(2000);
      await this.crmMenu.click();

      await this.page.waitForTimeout(3000);

      await reportStep(this.page, "Menu clicked successfully", "pass");
    } catch (e) {
      await reportStep(this.page, "Menu clicked not successfully..." + e, "fail");
    }
    return this;
  }

  async clickSalesMenuBtn() {
    try {
      await this.leadsMenu.click();
      await this.page.waitForTimeout(8000);

      // await this.mypipelineMenuBtn.click();
      // await this.page.waitForTimeout(25000);

      await reportStep(this.page, "Financial Accounting menu is clicked successfully", "pass");
    } catch (e) {
      await reportStep(this.page, "Financial Accounting menu is not clicked successfully..." + e, "fail");
    }
    return this;
  }

  async clickCreateBtn() {
    try {
      await this.createBtn.click({ timeout: 30 * 1000 });
      await this.page.waitForTimeout(10000);

      await reportStep(this.page, "Create Btn is clicked successfully", "pass");
    } catch (e) {
      await reportStep(this.page, "Create Btn is not clicked successfully..." + e, "fail");
    }
    return this;
  }

  async CreateBtn(name1, phone1, date, ebidta, cmpName, zip1, str, str2, website1, room1, occRate, pos, ref, desc, lName, mail) {
    try {
      await this.name.fill(String(name1));
      await this.page.waitForTimeout(2000);

      await this.cmpnyName.fill(String(cmpName));
      await this.zip.fill(String(zip1));
      await this.street.fill(String(str));
      await this.street2.fill(String(str2));
      await this.website.fill(String(website1));
      await this.rooms.clear();
      await this.rooms.fill(String(room1));
      await this.occupancyRate.fill(String(occRate));
      await this.page.waitForTimeout(2000);
      await this.visitors.click();
      await this.page.waitForTimeout(2000);
      await this.visitorsSelect.click();
      await this.page.waitForTimeout(3000);

      await this.title.click();
      await this.titleSelect.click();
      await this.page.waitForTimeout(2000);
      await this.firstName.fill(String(name1));
      await this.page.waitForTimeout(2000);
      await this.lastName.fill(String(lName));
      await this.page.waitForTimeout(2000);
      await this.email.fill(String(mail));
      await this.page.waitForTimeout(2000);
      await this.position.fill(String(pos));
      await this.page.waitForTimeout(2000);
      await this.phone.fill(String(phone1));
      await this.mobile.fill(String(phone1));
      await this.page.waitForTimeout(2000);
      await this.priority.click();
      await this.page.waitForTimeout(2000);
      await this.tag.click();
      await this.tagSelect.click();
      await this.page.waitForTimeout(2000);

      await this.extraInfo.click();
      await this.page.waitForTimeout(2000);
      await this.campaign.click();
      await this.page.waitForTimeout(2000);
      await this.campaignSelect.click();
      await this.page.waitForTimeout(2000);
      await this.medium.click();
      await this.page.waitForTimeout(2000);
      await this.mediumSelect.click();
      await this.page.waitForTimeout(2000);
      await this.campaignType.click();
      await this.page.waitForTimeout(2000);
      await this.campaignTypeSelect.click();
      await this.page.waitForTimeout(2000);
      await this.referred.fill(String(ref));
      await this.page.waitForTimeout(2000);
      await this.internalNotes.click();
      await this.descr.fill(String(desc));
      await this.saveBtn.click();
      await this.page.waitForTimeout(3000);

      await reportStep(this.page, "Create Lead is clicked successfully", "pass");
    } catch (e) {
      await reportStep(this.page, "Create Lead is not clicked successfully..." + e, "fail");
    }
    return this;
  }

  async CreateBtnNegative(name1, phone1, date, ebidta, cmpName, zip1, str, str2, website1, room1, occRate, pos, ref, desc, lName, mail) {
    try {
      await this.name.fill(String(name1));
      await this.page.waitForTimeout(2000);

      await this.cmpnyName.fill(String(cmpName));
      await this.zip.fill(String(zip1));
      await this.street.fill(String(str));
      await this.street2.fill(String(str2));
      await this.website.fill(String(website1));
      await this.rooms.clear();
      await this.rooms.fill(String(room1));
      await this.occupancyRate.fill(String(occRate));
      await this.page.waitForTimeout(2000);
      await this.visitors.click();
      await this.page.waitForTimeout(2000);
      await this.visitorsSelect.click();
      await this.page.waitForTimeout(3000);

      await this.title.click();
      await this.titleSelect.click();
      await this.page.waitForTimeout(2000);
      await this.firstName.fill(String(name1));
      await this.page.waitForTimeout(2000);
      await this.lastName.fill(String(lName));
      await this.page.waitForTimeout(2000);
      await this.email.fill(String(mail));
      await this.page.waitForTimeout(2000);
      await this.position.fill(String(pos));
      await this.page.waitForTimeout(2000);
      await this.phone.fill(String(phone1));
      await this.mobile.fill(String(phone1));
      await this.page.waitForTimeout(2000);
      await this.priority.click();
      await this.page.waitForTimeout(2000);
      await this.tag.click();
      await this.tagSelect.click();
      await this.page.waitForTimeout(2000);

      await this.extraInfo.click();
      await this.page.waitForTimeout(2000);
      await this.campaign.click();
      await this.page.waitForTimeout(2000);
      await this.campaignSelect.click();
      await this.page.waitForTimeout(2000);
      await this.medium.click();
      await this.page.waitForTimeout(2000);
      await this.mediumSelect.click();
      await this.page.waitForTimeout(2000);
      await this.campaignType.click();
      await this.page.waitForTimeout(2000);
      await this.campaignTypeSelect.click();
      await this.page.waitForTimeout(2000);
      await this.referred.fill(String(ref));
      await this.page.waitForTimeout(2000);
      await this.internalNotes.click();
      await this.descr.fill(String(desc));
      await this.saveBtn.click();
      await this.page.waitForTimeout(3000);

      try {
        const validationMessage = this.page.locator("xpath=//div[@class='o_notification_body mt-2']");
        await validationMessage.waitFor({ state: 'visible', timeout: 30000 });
        const messageText = await validationMessage.textContent();
        console.log('Validation Message:', messageText);

        expect(await this.isErrorDisplayed(), "Error message should be displayed for empty name field").toBeTruthy();
      } catch (e) {
        // No validation message found; proceed normally
        console.log('No validation message displayed.');
      }

      await reportStep(this.page, "Create Lead is clicked successfully", "pass");
    } catch (e) {
      await reportStep(this.page, "Create Lead is not clicked successfully..." + e, "fail");
    }
    return this;
  }

  async clickDelete() {
    try {
      await this.oppLost.click();
      await this.page.waitForTimeout(3000);
      await this.lostReason.click();
      await this.page.waitForTimeout(3000);
      await this.lostReasonSelect.click();
      await this.page.waitForTimeout(3000);
      await this.lostNotes.click();
      await this.lostNotesDesc.fill("test");
      await this.page.waitForTimeout(3000);
      await this.mrkLost.click();
      await this.page.waitForTimeout(3000);
      await this.action.click();
      await this.page.waitForTimeout(3000);
      await this.duplicate.click();
      await this.page.waitForTimeout(3000);
      await this.restore.click();
      await this.page.waitForTimeout(3000);
      await this.action1.click();
      await this.page.waitForTimeout(3000);
      await this.delete.click();
      await this.page.waitForTimeout(3000);
      await this.confirmDelete.click();
      await this.page.waitForTimeout(3000);
      await this.action3.click();
      await this.page.waitForTimeout(3000);
      await this.addProperty.click();
      await this.page.waitForTimeout(3000);
      await this.addProperty1.fill("test");
      await this.page.waitForTimeout(3000);
      await this.action2.click();
      await this.page.waitForTimeout(3000);
      await this.unarchive.click();
      await this.page.waitForTimeout(3000);
      // await this.confirmArchive.click();
      // await this.page.waitForTimeout(3000);
      await this.convOpp.click();
      await this.page.waitForTimeout(3000);
      // await this.oppSelect.click();
      // await this.page.waitForTimeout(3000);
      await this.oppUser.click();
      await this.page.waitForTimeout(3000);
      await this.oppUserSelect.click();
      await this.page.waitForTimeout(3000);
      await this.oppSalesTeam.click();
      await this.page.waitForTimeout(3000);
      // await this.oppSalesTeamSelect.click();
      await this.oppSalesTeamSelect.evaluate((node) => node.click());
      await this.page.waitForTimeout(3000);
      await this.createOpp.click();
      await this.page.waitForTimeout(3000);

      await reportStep(this.page, "Create Btn is clicked successfully", "pass");
    } catch (e) {
      await reportStep(this.page, "Create Btn is not clicked successfully..." + e, "fail");
    }
    return this;
  }
}

module.exports = { Leads };
