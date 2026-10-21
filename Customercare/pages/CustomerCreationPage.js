const { test, expect } = require('@playwright/test');
const { ensureLoggedIn } = require('../utils/loginHelper');

// Customer Care > Customer > New, for the current Averigo UI where many2one /
// many2many fields are custom "o_av_cdd" dropdowns (trigger button + panel
// with a search box and <li> options) instead of Odoo's stock autocomplete
// inputs that CustomerCarePage.js was written against.
class CustomerCreationPage {
  constructor(page) {
    this.page = page;

    // Login page
    this.userName = page.locator("xpath=//input[@id='login']");
    this.passWord = page.locator("xpath=//input[@id='password']");
    this.logIn = page.locator("xpath=//button[@type='submit']");

    this.customerCareMenuBtn = page.locator("xpath=//div[contains(text(),'Customer Care')]");
    this.customerCreateBtn = page.locator("xpath=//button[contains(text(),'New')]");
    this.saveBtn = page.locator('css=button.o_form_button_save');

    // Dropdown panel shared by every o_av_cdd field (only one is open at a time)
    this.cddPanel = page.locator('css=.o_av_cdd_panel');
    this.cddSelectBtn = this.cddPanel.locator("xpath=.//button[normalize-space()='Select']");

    // Dialogs
    this.okBtn = page.locator("xpath=//button[normalize-space()='Ok']");
    this.averigoError = page.locator("xpath=//*[contains(text(),'Averigo Error')]/ancestor::div[contains(@class,'modal-content')]");
  }

  // Text/char/date inputs are all wrapped in <div name="field_name">.
  #input(name) {
    return this.page.locator(`css=.o_field_widget[name="${name}"] input`);
  }

  #select(name) {
    return this.page.locator(`css=.o_field_widget[name="${name}"] select`);
  }

  async #fill(name, value) {
    if (!value) return;
    const input = this.#input(name);
    await input.fill(value);
    // Blur so Odoo commits the value and runs its onchange (ZIP -> city/state, etc.)
    await input.press('Tab');
  }

  async #check(name) {
    const box = this.#input(name);
    if (!(await box.isChecked())) await box.check();
  }

  async #pickDropdown(name, options) {
    if (!options) return;
    const values = Array.isArray(options) ? options : [options];
    await this.page.locator(`css=.o_field_widget[name="${name}"] button.o_av_cdd_trigger`).click();
    await this.cddPanel.waitFor({ state: 'visible' });

    for (const value of values) {
      await this.cddPanel.locator('css=.o_av_cdd_search input').fill(value);
      await this.cddPanel
        .locator('css=ul.o_av_cdd_list li')
        .filter({ has: this.page.locator(`xpath=./span[normalize-space()='${value}']`) })
        .first()
        .click();
    }
    // Multi-select panels need an explicit "Select"; single-select ones close on click.
    if (await this.cddSelectBtn.isVisible().catch(() => false)) {
      await this.cddSelectBtn.click();
    }
    await this.cddPanel.waitFor({ state: 'hidden' });
  }

  async loginIfNeeded(user, pass) {
    await ensureLoggedIn(this, user, pass);
    return this;
  }

  async openNewCustomer() {
    return test.step('Customer Care > New customer form is opened', async () => {
      // Home screen may greet with an "Open Customer Activities" popup
      const closePopup = this.page.locator("xpath=//div[contains(@class,'modal')]//button[normalize-space()='Close']");
      if (await closePopup.isVisible({ timeout: 3_000 }).catch(() => false)) await closePopup.click();

      await this.customerCareMenuBtn.click({ timeout: 30_000 });
      await this.customerCreateBtn.click();
      await expect(this.page).toHaveURL(/\/customer\/new/);
      return this;
    });
  }

  async fillBasicInformation(d) {
    return test.step('Basic Information is entered', async () => {
      await this.#fill('name', d.name);
      await this.#fill('nick_name', d.nickName);
      await this.#fill('code', d.customerNo);
      await this.#pickDropdown('parent_partner_id', d.parent);
      // Parent onchange recomputes Accounts Manager options; let it settle.
      await this.page.waitForTimeout(1_000);
      await this.#pickDropdown('kam', d.accountsManager);
      await this.#pickDropdown('customer_type', d.customerTypes);
      await this.#fill('email', d.email);
      await this.#fill('phone', d.phone);
      await this.#fill('mobile', d.mobile);
      return this;
    });
  }

  async fillAddress(d) {
    return test.step('Address is entered', async () => {
      await this.#fill('zip', d.zip);
      await this.#fill('street', d.street);
      await this.#fill('street2', d.street2);
      // City / State / County are auto-filled from ZIP; only override if given.
      await this.#fill('city', d.city);
      await this.#fill('county', d.county);
      return this;
    });
  }

  async fillOtherInfo(d) {
    return test.step('Other Info is entered', async () => {
      if (d.groupMasterInvoice) await this.#select('group_master_invoice').selectOption({ label: d.groupMasterInvoice });
      await this.#pickDropdown('route_id', d.route);
      await this.#fill('checkin_frequency', d.occupancyRate);
      await this.#fill('credit_limit', d.creditLimit);
      await this.#fill('count', d.roomCount);
      await this.#pickDropdown('property_payment_term_id', d.terms);
      await this.#pickDropdown('visitors_types_ids', d.visitorTypes);
      await this.#fill('website', d.website);
      if (d.inServiceDate) {
        await this.#input('in_service_date').fill(d.inServiceDate);
        await this.#input('in_service_date').press('Enter');
      }
      if (d.priceCategory) await this.#select('price_category').selectOption({ label: d.priceCategory });
      await this.#fill('internal_reference', d.sapCustomerNo); // SAP Customer # (digits only)
      await this.#fill('payee_name', d.sapVendorNo); // SAP Vendor # (digits only)
      await this.#fill('custom_1', d.apPayeeName);
      await this.#fill('custom_2', d.arPayeeName);
      await this.#fill('custom_3', d.custom3);
      return this;
    });
  }

  async fillBillingFlags(d) {
    return test.step('Preferences & Billing Flags are set', async () => {
      for (const flag of ['master_invoice', 'fuel_charge', 'hazard_fee', 'monthly_statement', 'send_case_mail']) {
        await this.#check(flag);
      }

      if (d.subsidyAmount) {
        await this.#check('subsidy');
        // Only one subsidy method is allowed: amount OR percentage, not both.
        await this.#fill('subsidy_amount', d.subsidyAmount);
      }

      if (d.poNumber) {
        await this.#check('po_check');
        await this.#fill('po_no', d.poNumber); // no special characters allowed
      }

      // "Sell All Products" asks "Are You Sure To Enable/Disable Sell All Products?"
      if (!(await this.#input('buy_all_item').isChecked())) {
        await this.#input('buy_all_item').check();
        await this.okBtn.click();
      }
      return this;
    });
  }

  async saveCustomer() {
    return test.step('Customer is saved successfully', async () => {
      await this.saveBtn.click();
      await expect(this.averigoError, 'Save raised an Averigo validation error').toBeHidden({ timeout: 3_000 });
      await expect(this.page).toHaveURL(/\/customer\/\d+/, { timeout: 30_000 });
      return this;
    });
  }

  async verifySaved(d) {
    return test.step('Saved customer values are verified', async () => {
      await expect(this.#input('name')).toHaveValue(d.name);
      await expect(this.#input('zip')).toHaveValue(d.zip);
      await expect(this.#input('street')).toHaveValue(d.street);
      if (d.accountsManager) {
        await expect(this.page.locator('css=.o_field_widget[name="kam"]')).toContainText(d.accountsManager);
      }
      if (d.route) {
        await expect(this.page.locator('css=.o_field_widget[name="route_id"]')).toContainText(d.route);
      }
      return this;
    });
  }
}

module.exports = { CustomerCreationPage };
