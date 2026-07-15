const { reportStep } = require('../utils/reportStep');

class SurveysPage {
  constructor(page) {
    this.page = page;

    // Login Page
    this.userName = page.locator("xpath=//input[@name='login']");
    this.passWord = page.locator("xpath=//input[@name='password']");
    this.logIn = page.locator("xpath=//button[@type='submit']");

    // Menu
    this.menu = page.locator("xpath=//ul[@class='o_menu_apps']//i[@class='fa fa-bars']");
    this.surveyMenu = page.locator("xpath=//div[contains(text(),'Surveys')]");

    this.createBtn = page.locator("xpath=//button[normalize-space()='New']");

    this.surveyName = page.locator("xpath=//textarea[@id='title_0']");

    this.restrictTo = page.locator("xpath=//input[@id='restrict_user_ids_0']");
    this.restrictSelect = page.locator("xpath=//a[@id='restrict_user_ids_0_0_0']");

    this.section = page.locator("xpath=//a[normalize-space()='Add a section']");
    this.titleText = page.locator("xpath=(//div[@name='title'])[2]//input[@type='text']");

    this.sectionClick = page.locator(
      "xpath=//table[@class='o_list_table table table-sm table-hover position-relative mb-0 o_list_table_ungrouped table-striped o_section_list_view']//tbody//tr[1]//td[2]"
    );
    this.openSection = page.locator(
      "xpath=//button[@title='Open section']//i[@class='fa fa-fw o_button_icon fa-external-link']"
    );
    this.description = page.locator("xpath=//div[@name='description']");
    this.saveBtn = page.locator("xpath=//button[normalize-space()='Save']");

    this.addQuestion = page.locator("xpath=//a[normalize-space()='Add a question']");
    this.quesTitle = page.locator("xpath=//input[@id='title_0']");

    this.ansType = page.locator(
      "xpath=//div[@name='question_type']//input[@type='radio'  and @data-value='simple_choice']"
    );
    this.addLine = page.locator("xpath=//a[normalize-space()='Add a line']");
    this.choice = page.locator("xpath=//div[@name='value']//input[@type='text']");

    this.quesType = page.locator(
      "xpath=//div[@name='question_type']//input[@type='radio' and  @data-value='scale']"
    );

    this.minValue = page.locator("xpath=//input[@id='scale_min_0']");
    this.maxValue = page.locator("xpath=//input[@id='scale_max_0']");
    this.minLabel = page.locator("xpath=//input[@id='scale_min_label_0']");
    this.middleLabel = page.locator("xpath=//input[@id='scale_mid_label_0']");
    this.maxLabel = page.locator("xpath=//input[@id='scale_max_label_0']");

    this.surveyDescription = page.locator("xpath=//a[@name='survey_description']");
    this.descNotes = page.locator("xpath=//div[@class='note-editable odoo-editor-editable']");

    this.options = page.locator("xpath=(//a[@name='options'][normalize-space()='Options'])[2]");

    this.triggeringAns = page.locator("xpath=//input[@id='triggering_answer_ids_0']");
    this.ansSelect = page.locator("xpath=//a[@id='triggering_answer_ids_0_0_0']");

    this.manAns = page.locator("xpath=//input[@id='constr_mandatory_0']");
    this.width = page.locator("xpath=//select[@id='width_0']");
    this.saveAndClose = page.locator("xpath=//button[normalize-space()='Save & Close']");

    this.optionBtn = page.locator("xpath=//a[normalize-space()='Options']");

    this.pagination = page.locator("xpath=//div[@name='questions_layout']//input[@data-value='page_per_section']");
    this.percentLeft = page.locator(
      "xpath=//div[@name='progression_mode']//label[normalize-space()='Percentage left']"
    );
    this.allQuestion = page.locator("xpath=//div[@name='questions_selection']//label[normalize-space()='All questions']");
    this.allowRoaming = page.locator("xpath=//div[@name='users_can_go_back']//input[@type='checkbox']");
    this.accessMode = page.locator("xpath=//select[@id='access_mode_0']");
    this.requireLogin = page.locator("xpath=//div[@name='users_login_required']//input[@type='checkbox']");
    this.limitAttempt = page.locator("xpath=//div[@name='is_attempts_limited']//input[@type='checkbox']");

    this.description1 = page.locator("xpath=//a[normalize-space()='Description']");
    this.descNotes1 = page.locator("xpath=//div[@class='note-editable odoo-editor-editable']");

    this.endMessage = page.locator("xpath=//a[normalize-space()='End Message']");
    this.endMessageNotes = page.locator("xpath=//div[@class='note-editable odoo-editor-editable']");

    this.share = page.locator("xpath=//span[normalize-space()='Share']");
    this.sendByEmail = page.locator("xpath=//div[@name='send_email']//input[@type='checkbox']");
    this.recipients = page.locator("xpath=//input[@id='partner_ids_0']");
    this.send = page.locator("xpath=//span[normalize-space()='Send']");

    this.action = page.locator("xpath=//button[normalize-space()='Action']");
    this.archive = page.locator("xpath=//span[normalize-space()='Archive']");
    this.confirmArchive = page.locator("xpath=//button[normalize-space()='Archive']");
    this.action1 = page.locator("xpath=//button[normalize-space()='Action']");
    this.duplicate = page.locator("xpath=//span[normalize-space()='Duplicate']");
    this.action2 = page.locator("xpath=//button[normalize-space()='Action']");
    this.delete = page.locator("xpath=//span[normalize-space()='Delete']");
    this.confirmDelete = page.locator("xpath=//button[normalize-space()='Delete']");
    this.action3 = page.locator("xpath=//button[normalize-space()='Action']");
    this.printSurvey = page.locator("xpath=//span[normalize-space()='Print Survey']");
    this.close = page.locator("xpath=//span[normalize-space()='Close']");
    this.reopen = page.locator("xpath=//span[normalize-space()='Reopen']");
  }

  async enterUsername(user, pass) {
    try {
      await this.userName.fill(String(user));
      await this.passWord.fill(String(pass));
      await this.logIn.click();
      await this.page.waitForTimeout(5000);

      await reportStep(this.page, "login button is entered successfully", "pass");
    } catch (e) {
      await reportStep(this.page, "login button is not entered successfully..." + e, "fail");
    }
    return this;
  }

  async clickMenu() {
    try {
      await this.page.waitForTimeout(5000);
      await this.surveyMenu.click();
      await this.page.waitForTimeout(3000);

      await reportStep(this.page, "Menu clicked successfully", "pass");
    } catch (e) {
      await reportStep(this.page, "Menu clicked not successfully..." + e, "fail");
    }
    return this;
  }

  async enterSurveys(code, first, last, title, mbl, phn, pLimit, mail, ltn) {
    try {
      await this.createBtn.click({ timeout: 30 * 1000 });
      await this.page.waitForTimeout(5000);

      await this.surveyName.fill("test");
      await this.page.waitForTimeout(3000);

      await this.restrictTo.click();
      await this.restrictSelect.click();
      await this.page.waitForTimeout(3000);

      await this.section.click();
      await this.page.waitForTimeout(3000);

      await this.titleText.fill("test");
      await this.page.waitForTimeout(3000);

      await this.page.waitForTimeout(3000);

      await this.addQuestion.click();
      await this.page.waitForTimeout(3000);

      await this.quesTitle.fill("Question");
      await this.page.waitForTimeout(3000);

      await this.ansType.click();
      await this.page.waitForTimeout(3000);

      await this.addLine.click();
      await this.page.waitForTimeout(3000);

      await this.choice.fill("choice1");
      await this.page.waitForTimeout(3000);

      await this.quesType.click();
      await this.page.waitForTimeout(3000);

      await this.minValue.clear();
      await this.minValue.fill("1");
      await this.page.waitForTimeout(3000);

      await this.minLabel.fill("label");
      await this.middleLabel.fill("middleLabel");
      await this.maxLabel.fill("max label");
      await this.page.waitForTimeout(3000);

      await this.surveyDescription.click();
      await this.descNotes.fill("test");
      await this.page.waitForTimeout(3000);

      await this.options.click();
      await this.triggeringAns.click();
      await this.page.waitForTimeout(3000);

      await this.ansSelect.evaluate((node) => node.click());
      await this.page.waitForTimeout(3000);

      await this.manAns.click();
      await this.page.waitForTimeout(3000);

      await this.width.selectOption({ label: 'Full-Width' });
      await this.saveAndClose.click();
      await this.page.waitForTimeout(3000);

      await this.optionBtn.click();
      await this.page.waitForTimeout(3000);

      await this.pagination.click();
      await this.percentLeft.click();
      await this.allQuestion.click();
      await this.allowRoaming.click();
      await this.page.waitForTimeout(3000);

      await this.accessMode.selectOption({ label: 'Anyone with the link' });
      await this.page.waitForTimeout(3000);

      await this.requireLogin.click();
      await this.page.waitForTimeout(3000);

      await this.limitAttempt.click();
      await this.page.waitForTimeout(3000);

      await this.description1.click();
      await this.descNotes1.fill("test");
      await this.page.waitForTimeout(3000);

      await this.endMessage.click();
      await this.endMessage.fill("Thank You");
      await this.page.waitForTimeout(3000);

      await reportStep(this.page, "work info is entered successfully", "pass");
    } catch (e) {
      await reportStep(this.page, "work info is not entered successfully..." + e, "fail");
    }
    return this;
  }
}

module.exports = { SurveysPage };
