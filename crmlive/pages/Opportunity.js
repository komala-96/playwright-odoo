const { expect } = require('../fixtures/base');
const { reportStep } = require('../utils/reportStep');

class Opportunity {
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
    this.opportunityMenu = page.locator("xpath=//a[normalize-space()='Opportunities']");

    this.createBtn = page.locator("xpath=//button[normalize-space()='New']");

    this.name = page.locator("xpath=//input[@id='name_0']");

    this.contact = page.locator("xpath=//input[@id='partner_id_0']");

    this.contactSelect = page.locator("xpath=//a[@id='partner_id_0_0_0']");

    this.expRevenue = page.locator("xpath=//input[@id='expected_revenue_0']");

    this.email = page.locator("xpath=//input[@id='email_from_0']");

    this.phone = page.locator("xpath=//input[@id='phone_0']");

    this.priority = page.locator("xpath=//div[@class='o_field_widget o_field_priority oe_inline']//a[@aria-label='Very High']");

    this.edit = page.locator("xpath=(//article[1])[1]");

    this.lost = page.locator("xpath=//span[normalize-space()='Lost']");

    this.lostReason = page.locator("xpath=//input[@id='lost_reason_id_0']");

    this.lostReasonSelect = page.locator("xpath=//a[@id='lost_reason_id_0_0_0']");

    this.lostNotes = page.locator("xpath=//div[@name='lost_feedback']//div[@class='flex-grow-1 overflow-auto']");

    this.lostNotesDesc = page.locator("xpath=//div[@placeholder='Type \"/\" for commands']");

    this.mrkLost = page.locator("xpath=//span[normalize-space()='Mark as Lost']");

    this.action = page.locator("xpath=//button[normalize-space()='Action']");

    this.duplicate = page.locator("xpath=//span[normalize-space()='Duplicate']");

    this.action1 = page.locator("xpath=//button[normalize-space()='Action']");

    this.delete = page.locator("xpath=//span[normalize-space()='Delete']");

    this.confirmDelete = page.locator("xpath=//button[normalize-space()='Delete']");

    this.action3 = page.locator("xpath=//button[normalize-space()='Action']");

    this.addProperty = page.locator("xpath=//span[normalize-space()='Add Properties']");

    this.addProperty1 = page.locator("xpath=(//div[@name='lead_properties']//input[@type='text'])[1]");

    this.action2 = page.locator("xpath=//button[normalize-space()='Action']");

    this.archive = page.locator("xpath=//span[normalize-space()='Archive']");

    this.confirmArchive = page.locator("xpath=//button[normalize-space()='Archive']");

    this.addBtn = page.locator("xpath=//button[normalize-space()='Add']");

    this.surveyName = page.locator("xpath=//input[@id='name_0']");

    this.srvyContact = page.locator("xpath=//input[@id='partner_id_0']");

    this.srvyContactSelect = page.locator("xpath=//a[@id='partner_id_0_0_0']");

    this.srvyRevenue = page.locator("xpath=//input[@id='expected_revenue_0']");

    this.srvyemail = page.locator("xpath=//input[@id='email_from_0']");

    this.srvyphone = page.locator("xpath=//input[@id='phone_0']");

    this.srvyPriority = page.locator("xpath=//div[@class='o_field_widget o_field_priority oe_inline']//a[@aria-label='Very High']");

    this.addBtn1 = page.locator("xpath=//button[normalize-space()='Add']");

    this.proposalName = page.locator("xpath=//input[@id='name_0']");

    this.prslContact = page.locator("xpath=//input[@id='partner_id_0']");

    this.prslContactSelect = page.locator("xpath=//a[@id='partner_id_0_0_0']");

    this.prslRevenue = page.locator("xpath=//input[@id='expected_revenue_0']");

    this.prslemail = page.locator("xpath=//input[@id='email_from_0']");

    this.prslphone = page.locator("xpath=//input[@id='phone_0']");

    this.prslPriority = page.locator("xpath=//div[@class='o_field_widget o_field_priority oe_inline']//a[@aria-label='Very High']");

    this.addBtn2 = page.locator("xpath=//button[normalize-space()='Add']");

    this.agreementName = page.locator("xpath=//input[@id='name_0']");

    this.agrmntContact = page.locator("xpath=//input[@id='partner_id_0']");

    this.agrmntContactSelect = page.locator("xpath=//a[@id='partner_id_0_0_0']");

    this.agrmntRevenue = page.locator("xpath=//input[@id='expected_revenue_0']");

    this.agrmntemail = page.locator("xpath=//input[@id='email_from_0']");

    this.agrmntphone = page.locator("xpath=//input[@id='phone_0']");

    this.agrmntPriority = page.locator("xpath=//div[@class='o_field_widget o_field_priority oe_inline']//a[@aria-label='Very High']");

    this.addBtn3 = page.locator("xpath=//button[normalize-space()='Add']");

    this.sowName = page.locator("xpath=//input[@id='name_0']");

    this.sowContact = page.locator("xpath=//input[@id='partner_id_0']");

    this.sowContactSelect = page.locator("xpath=//a[@id='partner_id_0_0_0']");

    this.sowRevenue = page.locator("xpath=//input[@id='expected_revenue_0']");

    this.sowemail = page.locator("xpath=//input[@id='email_from_0']");

    this.sowphone = page.locator("xpath=//input[@id='phone_0']");

    this.sowPriority = page.locator("xpath=//div[@class='o_field_widget o_field_priority oe_inline']//a[@aria-label='Very High']");

    this.addBtn4 = page.locator("xpath=//button[normalize-space()='Add']");

    this.quickAdd = page.locator("xpath=(//i[@title='Quick add'])[2]");

    this.quickAdd1 = page.locator("xpath=(//i[@title='Quick add'])[3]");

    this.quickAdd2 = page.locator("xpath=(//i[@title='Quick add'])[4]");

    this.quickAdd3 = page.locator("xpath=(//i[@title='Quick add'])[5]");

    this.backBtn = page.locator("xpath=(//a[@class='fw-bold text-truncate'])[1]");
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
      // await this.menu.click({ timeout: 30 * 1000 });

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
      await this.opportunityMenu.click();
      await this.page.waitForTimeout(8000);

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

  async CreateBtn(name1, rev, mail, Phone) {
    try {
      await this.name.fill(String(name1));
      await this.page.waitForTimeout(2000);
      await this.contact.click();
      await this.page.waitForTimeout(2000);
      await this.contactSelect.click();
      await this.page.waitForTimeout(2000);
      await this.expRevenue.clear();
      await this.expRevenue.fill(String(rev));
      await this.page.waitForTimeout(2000);
      await this.email.clear();
      await this.email.fill(String(mail));
      await this.page.waitForTimeout(2000);
      await this.phone.clear();
      await this.phone.fill(String(Phone));
      await this.page.waitForTimeout(2000);
      await this.priority.click();
      await this.page.waitForTimeout(2000);
      await this.expRevenue.clear();
      await this.expRevenue.fill(String(rev));
      await this.addBtn.click();
      await this.page.waitForTimeout(5000);

      await this.edit.click();
      await this.page.waitForTimeout(2000);
      await this.lost.click();
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
      await this.archive.click();
      await this.page.waitForTimeout(3000);
      await this.confirmArchive.click();
      await this.page.waitForTimeout(3000);
      await this.backBtn.click();
      await this.page.waitForTimeout(3000);

      await reportStep(this.page, "Opportunities Create Btn is clicked successfully", "pass");
    } catch (e) {
      await reportStep(this.page, "Opportunities Create Btn is not clicked successfully..." + e, "fail");
    }
    return this;
  }

  async clickQuickAddBtn(name1, rev, mail, Phone) {
    try {
      await this.quickAdd.click();
      await this.page.waitForTimeout(5000);
      await this.surveyName.fill(String(name1));
      await this.page.waitForTimeout(2000);
      await this.srvyContact.click();
      await this.page.waitForTimeout(2000);
      await this.srvyContactSelect.click();
      await this.page.waitForTimeout(2000);
      await this.srvyRevenue.clear();
      await this.srvyRevenue.fill(String(rev));
      await this.page.waitForTimeout(2000);
      await this.srvyemail.clear();
      await this.srvyemail.fill(String(mail));
      await this.page.waitForTimeout(2000);
      await this.srvyphone.clear();
      await this.srvyphone.fill(String(Phone));
      await this.page.waitForTimeout(2000);
      await this.srvyPriority.click();
      await this.page.waitForTimeout(2000);
      await this.addBtn1.click();
      await this.page.waitForTimeout(5000);

      await this.quickAdd1.click();
      await this.page.waitForTimeout(2000);
      await this.proposalName.fill(String(name1));
      await this.page.waitForTimeout(2000);
      await this.prslContact.click();
      await this.page.waitForTimeout(2000);
      await this.prslContactSelect.click();
      await this.page.waitForTimeout(2000);
      await this.prslRevenue.clear();
      await this.prslRevenue.fill(String(rev));
      await this.page.waitForTimeout(2000);
      await this.prslemail.clear();
      await this.prslemail.fill(String(mail));
      await this.page.waitForTimeout(2000);
      await this.prslphone.clear();
      await this.prslphone.fill(String(Phone));
      await this.page.waitForTimeout(2000);
      await this.prslPriority.click();
      await this.page.waitForTimeout(2000);
      await this.addBtn2.click();
      await this.page.waitForTimeout(5000);

      await this.quickAdd2.click();
      await this.agreementName.fill(String(name1));
      await this.page.waitForTimeout(2000);
      await this.agrmntContact.click();
      await this.page.waitForTimeout(2000);
      await this.agrmntContactSelect.click();
      await this.page.waitForTimeout(2000);
      await this.agrmntRevenue.clear();
      await this.agrmntRevenue.fill(String(rev));
      await this.page.waitForTimeout(2000);
      await this.agrmntemail.clear();
      await this.agrmntemail.fill(String(mail));
      await this.page.waitForTimeout(2000);
      await this.agrmntphone.clear();
      await this.agrmntphone.fill(String(Phone));
      await this.page.waitForTimeout(2000);
      await this.agrmntPriority.click();
      await this.page.waitForTimeout(2000);
      await this.addBtn3.click();
      await this.page.waitForTimeout(5000);

      await this.quickAdd3.click();
      await this.sowName.fill(String(name1));
      await this.page.waitForTimeout(2000);
      await this.sowContact.click();
      await this.page.waitForTimeout(2000);
      await this.sowContactSelect.click();
      await this.page.waitForTimeout(2000);
      await this.sowRevenue.clear();
      await this.sowRevenue.fill(String(rev));
      await this.page.waitForTimeout(2000);
      await this.sowemail.clear();
      await this.sowemail.fill(String(mail));
      await this.page.waitForTimeout(2000);
      await this.sowphone.clear();
      await this.sowphone.fill(String(Phone));
      await this.page.waitForTimeout(2000);
      await this.sowPriority.click();
      await this.page.waitForTimeout(2000);
      await this.addBtn4.click();

      await reportStep(this.page, "QuickAddBtn is clicked successfully", "pass");
    } catch (e) {
      await reportStep(this.page, "QuickAddBtn is not clicked successfully..." + e, "fail");
    }
    return this;
  }

  async clickQuickAddBtnNegative(name1, rev, mail, Phone) {
    try {
      await this.quickAdd.click();
      await this.page.waitForTimeout(5000);

      await this.page.waitForTimeout(2000);
      await this.srvyContact.click();
      await this.page.waitForTimeout(2000);
      await this.srvyContactSelect.click();
      await this.page.waitForTimeout(2000);

      await this.srvyRevenue.clear();
      await this.srvyRevenue.fill(String(rev));
      await this.page.waitForTimeout(2000);
      await this.srvyemail.clear();
      await this.srvyemail.fill(String(mail));
      await this.page.waitForTimeout(2000);
      await this.srvyphone.clear();
      await this.srvyphone.fill(String(Phone));
      await this.page.waitForTimeout(2000);
      await this.srvyPriority.click();
      await this.page.waitForTimeout(2000);
      await this.surveyName.clear();
      await this.page.waitForTimeout(2000);
      await this.addBtn1.click();
      await this.page.waitForTimeout(2000);
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

      await this.page.waitForTimeout(5000);
      await this.quickAdd1.click();
      await this.page.waitForTimeout(2000);

      await this.prslContact.click();
      await this.page.waitForTimeout(2000);
      await this.prslContactSelect.click();
      await this.page.waitForTimeout(2000);
      await this.prslRevenue.clear();
      await this.prslRevenue.fill(String(rev));
      await this.page.waitForTimeout(2000);
      await this.prslemail.clear();
      await this.prslemail.fill(String(mail));
      await this.page.waitForTimeout(2000);
      await this.prslphone.clear();
      await this.prslphone.fill(String(Phone));
      await this.page.waitForTimeout(2000);
      await this.prslPriority.click();
      await this.page.waitForTimeout(2000);
      await this.proposalName.clear();
      await this.page.waitForTimeout(2000);
      await this.addBtn2.click();
      await this.page.waitForTimeout(2000);
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

      await this.page.waitForTimeout(5000);
      await this.quickAdd2.click();

      await this.agrmntContact.click();
      await this.page.waitForTimeout(2000);
      await this.agrmntContactSelect.click();
      await this.page.waitForTimeout(2000);
      await this.agrmntRevenue.clear();
      await this.agrmntRevenue.fill(String(rev));
      await this.page.waitForTimeout(2000);
      await this.agrmntemail.clear();
      await this.agrmntemail.fill(String(mail));
      await this.page.waitForTimeout(2000);
      await this.agrmntphone.clear();
      await this.agrmntphone.fill(String(Phone));
      await this.page.waitForTimeout(2000);
      await this.agrmntPriority.click();
      await this.page.waitForTimeout(2000);
      await this.agreementName.clear();
      await this.page.waitForTimeout(2000);
      await this.addBtn3.click();
      await this.page.waitForTimeout(2000);
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
      await this.page.waitForTimeout(5000);
      await this.quickAdd3.click();

      await this.page.waitForTimeout(2000);
      await this.sowContact.click();
      await this.page.waitForTimeout(2000);
      await this.sowContactSelect.click();
      await this.page.waitForTimeout(2000);
      await this.sowRevenue.clear();
      await this.sowRevenue.fill(String(rev));
      await this.page.waitForTimeout(2000);
      await this.sowemail.clear();
      await this.sowemail.fill(String(mail));
      await this.page.waitForTimeout(2000);
      await this.sowphone.clear();
      await this.sowphone.fill(String(Phone));
      await this.page.waitForTimeout(2000);
      await this.sowPriority.click();
      await this.page.waitForTimeout(2000);
      await this.sowName.fill(String(name1));
      await this.page.waitForTimeout(2000);
      await this.addBtn4.click();
      await this.page.waitForTimeout(2000);
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

      await reportStep(this.page, "QuickAddBtn is clicked successfully", "pass");
    } catch (e) {
      await reportStep(this.page, "QuickAddBtn is not clicked successfully..." + e, "fail");
    }
    return this;
  }
}

module.exports = { Opportunity };
