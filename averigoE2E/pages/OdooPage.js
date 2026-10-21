const { expect, test } = require('@playwright/test');

/** Fields that point at users / employees / owners: never quick-created from the picker. */
const NO_QUICK_CREATE = /(^|_)(user|users|issuer|owner|employee|employees|receiver|manager|kam|technician|tech|driver)(_id|_ids)?$|^(user_id|user_ids|kam|employee_id|issuer_id|transfer_receiver_id|parent_id|coach_id)$/;
const { execFileSync } = require('child_process');
const { appears } = require('../utils/wait');
const { parseMoney } = require('../utils/money');

const escapeRe = (s) => String(s).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
const exact = (s) => (s instanceof RegExp ? s : new RegExp(`^\\s*${escapeRe(s)}\\s*$`, 'i'));

/**
 * Generic Odoo 17/18 web-client helpers shared by every module page object.
 * Fields are addressed by their technical name (`.o_field_widget[name=...]`),
 * which is stable across UI label changes; the widget type (many2one,
 * selection, boolean, date, text) is detected from its CSS class so callers
 * only pass `{ field_name: value }`.
 */
class OdooPage {
  constructor(page) {
    this.page = page;
  }

  /** Visible dialogs, excluding AveriGo's "Open Customer Activities" popup. */
  dialogs() {
    return this.page.locator('.modal:visible').filter({ hasNotText: 'Open Customer Activities' });
  }

  // ---------------------------------------------------------------- navigation

  async waitReady(timeout = 90_000) {
    await this.page.locator('.o_main_navbar').first().waitFor();
    await expect(this.page.locator('.o_blockUI, .o_loading_indicator:visible, .o_loading:visible')).toHaveCount(0, { timeout });
  }

  /** Closes AveriGo's home-screen popups (e.g. "Open Customer Activities"). */
  async dismissPopups() {
    const modal = this.page.locator('.modal:visible').filter({ hasText: 'Open Customer Activities' }).last();
    for (let i = 0; i < 3 && (await appears(modal, 1_500)); i++) {
      // The fixture's locator handler may close it at the same moment: short, tolerant clicks.
      await modal.locator('.btn-close').first().click({ timeout: 3_000 })
        .catch(() => modal.locator('.modal-footer button').filter({ hasText: /^\s*Close\s*$/i }).first().click({ timeout: 3_000 }))
        .catch(() => {});
      await this.page.waitForTimeout(300);
    }
  }

  async openApp(name) {
    await this.page.goto('/odoo');
    await this.waitReady();
    await this.dismissPopups();
    // AveriGo home dashboard: <a class="o_app_card"><div class="o_app_card_name">Employees</div>...
    const card = this.page.locator('.o_app_card').filter({ has: this.page.locator('.o_app_card_name', { hasText: exact(name) }) });
    const standard = this.page.locator('.o_app').filter({ hasText: exact(name) });
    if (!(await appears(card.or(standard).first(), 5_000))) {
      await this.page.locator('.o_navbar_apps_menu button, .o_menu_toggle:not(.o_hidden)').first().click();
    }
    await card.or(standard).first().click();
    await this.waitReady();
    await this.dismissPopups();
  }

  /**
   * Opens a top-menu path, e.g. openMenu('Configuration', 'Product Categories').
   * Falls back to the navbar overflow ("+"/More Menu) when a section is hidden.
   */
  async openMenu(...path) {
    for (let i = 0; i < path.length; i++) {
      const label = path[i];
      let item;
      if (i === 0) {
        item = await this.findTopMenuItem(label);
      } else {
        item = this.page.locator('.o-dropdown--menu .dropdown-item, .dropdown-menu .dropdown-item')
          .filter({ hasText: exact(label) }).filter({ visible: true }).first();
      }
      await item.waitFor();
      // Section headers inside the overflow menu are not clickable.
      if (await item.evaluate((el) => el.classList.contains('dropdown-header'))) continue;
      const before = this.page.url();
      await item.click();
      if (i === path.length - 1) {
        // Leaf menu: wait until the new action has replaced the previous one.
        await this.page.waitForURL((u) => u.toString() !== before, { timeout: 15_000 }).catch(() => {});
        await expect(this.page.locator('.o_breadcrumb, .o_control_panel').first()).toBeVisible();
      }
    }
    // Large lists (ultraserv: every warehouse's receipts / payments) can take minutes to load.
    await this.waitReady(240_000);
  }

  /**
   * Top-level menu item, visible in the navbar or in the "+" overflow menu.
   * The navbar recomputes its overflow after load, so poll both places.
   */
  async findTopMenuItem(label) {
    const top = this.page.locator('.o_menu_sections > button, .o_menu_sections > a, .o_menu_sections > div > button')
      .filter({ hasText: exact(label) }).filter({ visible: true }).first();
    const more = this.page.locator('.o_menu_sections_more button, .o_menu_sections button:has(.fa-plus)').filter({ visible: true }).first();
    const inMore = this.page.locator('.o-dropdown--menu .dropdown-item, .o-dropdown--menu .dropdown-header')
      .filter({ hasText: exact(label) }).filter({ visible: true }).first();
    const deadline = Date.now() + 20_000;
    while (Date.now() < deadline) {
      await this.page.waitForTimeout(500);
      if (await top.isVisible().catch(() => false)) return top;
      if (await more.isVisible().catch(() => false)) {
        if (!(await inMore.isVisible().catch(() => false))) await more.click().catch(() => {});
        if (await appears(inMore, 2_000)) return inMore;
        await this.page.keyboard.press('Escape');
      }
    }
    throw new Error(`Menu "${label}" not found in the navbar or its overflow menu`);
  }

  async goto(url) {
    await this.page.goto(url);
    await this.waitReady();
    await this.dismissPopups();
  }

  currentUrl() {
    return this.page.url();
  }

  // ---------------------------------------------------------------- list views

  async clickNew() {
    // Large lists (e.g. ultraserv's 5,000+ payment receipts) keep New disabled while they load.
    await this.waitReady(180_000);
    const btn = this.page.locator('.o_control_panel button.o_list_button_add, .o_control_panel button.o-kanban-button-new, .o_control_panel button.o_form_button_create')
      .filter({ visible: true }).first();
    await expect(btn).toBeEnabled({ timeout: 120_000 });
    await btn.click();
    // Some AveriGo configuration menus are editable lists: "New" adds an inline row instead of opening a form.
    await this.page.locator('.o_action_manager .o_form_view, .o_action_manager .o_view_controller.o_list_view .o_selected_row').first().waitFor({ timeout: 120_000 });
  }

  async search(text) {
    const box = this.page.locator('.o_searchview_input').first();
    await this.page.locator('.o_searchview .o_facet_remove').first().click().catch(() => {});
    await box.fill(String(text));
    await box.press('Enter');
    await this.waitReady();
  }

  rows(text) {
    const rows = this.page.locator('.o_list_view .o_data_row, .o_kanban_view .o_kanban_record:not(.o_kanban_ghost)');
    return text ? rows.filter({ hasText: text }) : rows;
  }

  async openRecord(text) {
    await this.search(text);
    const row = this.rows(text).first();
    await row.waitFor();
    await row.locator('td.o_data_cell').first().click().catch(() => row.click());
    await this.page.locator('.o_form_view').first().waitFor();
    await this.waitReady();
  }

  /**
   * Resume support: opens the record matching `text` in the current list when it exists (e.g. auto-saved
   * by a failed earlier attempt - Odoo saves a dirty form when the page closes), else clicks New.
   * Returns true when an existing record was opened.
   */
  async openExistingOrNew(text) {
    await this.search(text);
    const row = this.rows(text).first();
    if (await appears(row, 3_000)) {
      // Click the cell holding the text (the first cell can be a drag handle that doesn't open the record).
      const cell = row.locator('td.o_data_cell').filter({ hasText: text }).first();
      await ((await cell.count()) ? cell : row).click();
      await this.page.locator('.o_form_view').first().waitFor();
      await this.waitReady();
      return true;
    }
    await this.page.locator('.o_searchview .o_facet_remove').first().click().catch(() => {});
    await this.waitReady();
    await this.clickNew();
    return false;
  }

  async expectInList(text) {
    await this.search(text);
    await expect(this.rows(text).first()).toBeVisible();
  }

  // ---------------------------------------------------------------- form fields

  scope(scope) {
    return scope || this.dialogs().locator('.o_form_view').or(this.page.locator('.o_action_manager .o_form_view, .o_action_manager .o_view_controller.o_list_view .o_selected_row')).last();
  }

  field(name, scope) {
    return this.scope(scope).locator(`.o_field_widget[name="${name}"]`).filter({ visible: true }).first();
  }

  async widgetType(fieldLocator) {
    // AveriGo custom dropdown ("Select options") used for many2one/many2many.
    if (await fieldLocator.locator('.o_av_cdd').count()) return 'cdd';
    const cls = (await fieldLocator.getAttribute('class')) || '';
    if (/o_field_\w*many2many_tags|o_field_many2many\b/.test(cls)) return 'many2many';
    // Covers o_field_many2one, o_field_res_partner_many2one, o_field_many2one_avatar_user, ...
    if (/o_field_\w*many2one/.test(cls)) return 'many2one';
    if (/o_field_selection|o_field_radio|o_field_badge|o_field_selection_badge/.test(cls)) return 'selection';
    if (/o_field_boolean|o_field_check_box/.test(cls)) return 'boolean';
    if (/o_field_date|o_field_datetime|o_field_daterange/.test(cls)) return 'date';
    return 'text';
  }

  async pickAutocomplete(input, value, { allowCreate = true } = {}) {
    const items = this.page.locator('.o-autocomplete--dropdown-item, .ui-autocomplete .ui-menu-item');
    const option = items.filter({ hasText: value }).filter({ hasNotText: /(Search More|Create and edit|^\s*Create\b)/i }).first();
    const create = items.filter({ hasText: new RegExp(`^\\s*Create\\s+"?${escapeRe(value)}`, 'i') }).first();
    // Some pickers search slowly ("Loading..."); wait for results.
    const settle = () => expect.poll(async () => (await items.allInnerTexts().catch(() => [])).some((t) => /Loading/i.test(t)), { timeout: 45_000 }).toBe(false).catch(() => {});

    let found = false;
    for (let attempt = 0; attempt < 3 && !found; attempt++) {
      // The activities popup can appear mid-typing and close the dropdown.
      await this.dismissPopups();
      await input.click();
      await input.fill('');
      // Some AveriGo domains are only re-evaluated on real key presses.
      if (attempt === 0) await input.fill(String(value));
      else await input.pressSequentially(String(value), { delay: 30 });
      await settle();
      found = (await appears(option.or(create).first(), 15_000));
    }
    if (!found) {
      // Last resort: the "Search More..." dialog.
      await input.fill('');
      await input.click();
      await settle();
      const more = items.filter({ hasText: /Search More/i }).first();
      if (await appears(more, 20_000)) {
        await more.click();
        await this.selectInDialog([value]);
        await this.waitReady();
        return;
      }
      throw new Error(`"${value}" not offered in dropdown (shown: ${await items.allInnerTexts().catch(() => [])})`);
    }
    if (await option.isVisible().catch(() => false)) {
      // The dropdown can re-render under the pointer (slow instances): fall back to Enter on the highlighted match.
      await option.click({ timeout: 10_000 }).catch(async () => {
        if (await option.isVisible().catch(() => false)) await input.press('Enter');
      });
    } else if (allowCreate) await create.click();
    else throw new Error(`"${value}" not found in dropdown`);
    // Wait for the dropdown to close so the value (and its onchange) is committed.
    await expect(this.page.locator('.o-autocomplete--dropdown-menu:visible, .ui-autocomplete:visible')).toHaveCount(0, { timeout: 10_000 }).catch(() => {});
    await this.waitReady();
  }


  /** AveriGo "Select options" dropdown: trigger -> search -> click item(s). */
  async setCustomDropdown(name, values, scope) {
    const field = this.field(name, scope);
    for (const value of [].concat(values)) {
      // Already selected values are not offered again in the list.
      if ((await field.locator('.o_av_cdd_tags').innerText().catch(() => '')).includes(String(value))) continue;
      const panel = field.locator('.o_av_cdd_panel');
      if (!(await panel.isVisible().catch(() => false))) await field.locator('.o_av_cdd_trigger').click();
      const item = panel.locator('.o_av_cdd_list li').filter({ hasText: value }).first();
      // Short lists show every option; only use the search box when the item isn't listed.
      if (!(await appears(item, 1_500))) {
        await panel.locator('.o_av_cdd_search input').fill(String(value));
      }
      await item.waitFor();
      await item.click();
      await this.page.waitForTimeout(300);
    }
    // Multi-select panels confirm with "Select"; others stay open when nothing was picked.
    const save = field.locator('.o_av_cdd_panel .o_av_cdd_save');
    if (await save.isVisible().catch(() => false)) await save.click();
    else if (await field.locator('.o_av_cdd_panel').isVisible().catch(() => false)) await field.locator('.o_av_cdd_trigger').click();
    await this.waitReady();
    await expect(field.locator('.o_av_cdd_tags')).toContainText(String([].concat(values)[0]));
  }

  /** Sets `preferred` when the dropdown offers it, otherwise the first option. Returns the label set. */
  async pickPreferredOption(name, preferred, scope) {
    const field = this.field(name, scope);
    if (preferred && (await field.locator('.o_av_cdd').count())) {
      await field.locator('.o_av_cdd_trigger').click();
      const lis = field.locator('.o_av_cdd_panel .o_av_cdd_list li');
      await lis.first().waitFor({ timeout: 30_000 });
      const offered = (await lis.allInnerTexts()).map((t) => t.trim());
      await field.locator('.o_av_cdd_trigger').click(); // close; set below
      if (offered.includes(preferred)) {
        await this.setCustomDropdown(name, preferred, scope);
        return preferred;
      }
    }
    return this.pickFirstOption(name, scope);
  }

  /** Picks the first option a many2one offers (for pickers whose values we don't control). Returns its label. */
  async pickFirstOption(name, scope) {
    const field = this.field(name, scope);
    // AveriGo "Select options" dropdown.
    if (await field.locator('.o_av_cdd').count()) {
      await field.locator('.o_av_cdd_trigger').click();
      const li = field.locator('.o_av_cdd_panel .o_av_cdd_list li').first();
      await li.waitFor({ timeout: 30_000 });
      const text = (await li.innerText()).trim();
      await li.click();
      const save = field.locator('.o_av_cdd_panel .o_av_cdd_save');
      if (await save.isVisible().catch(() => false)) await save.click();
      else if (await field.locator('.o_av_cdd_panel').isVisible().catch(() => false)) await field.locator('.o_av_cdd_trigger').click();
      await this.waitReady();
      return text;
    }
    const input = field.locator('input').first();
    await input.click();
    const item = this.page.locator('.o-autocomplete--dropdown-item').filter({ hasNotText: /Search More|Create|Loading|No records/i }).first();
    await item.waitFor({ timeout: 30_000 });
    const label = (await item.innerText()).trim();
    await item.click();
    await this.waitReady();
    return label;
  }

  async setMany2one(name, value, scope) {
    const field = this.field(name, scope);
    // Some fields render as an autocomplete and then switch to AveriGo's "Select options" dropdown.
    await this.page.waitForTimeout(300);
    if (await field.locator('.o_av_cdd').count()) return this.setCustomDropdown(name, value, scope);
    // Never quick-create people from a picker: users / employees / owners must already exist
    // (a "Create \"Komala\"" click once added an internal user on ultraserv).
    const allowCreate = !NO_QUICK_CREATE.test(name);
    await this.pickAutocomplete(field.locator('input').first(), value, { allowCreate });
  }

  async setMany2many(name, values, scope) {
    for (const v of [].concat(values)) await this.pickAutocomplete(this.field(name, scope).locator('input').first(), v, { allowCreate: !NO_QUICK_CREATE.test(name) });
  }

  async setSelection(name, value, scope) {
    const field = this.field(name, scope);
    const select = field.locator('select');
    // Dialog selects can render a moment after the field; give them a chance before trying radio/badge.
    if ((await select.count()) || (await appears(select, 3_000))) {
      if (typeof value === 'boolean') {
        const labels = await select.locator('option').allInnerTexts();
        const want = value ? /^(yes|true|on|taxable|enabled?)$/i : /^(no|false|off|non[- ]?taxable|disabled?)$/i;
        const match = labels.find((l) => want.test(l.trim()));
        if (!match) throw new Error(`No ${value ? 'ON' : 'OFF'} option in ${name}: ${labels.join(', ')}`);
        await select.selectOption({ label: match });
      } else {
        await select.selectOption({ label: String(value) });
      }
      return;
    }
    // radio / badge selection
    await field.locator('label, span, button').filter({ hasText: exact(value) }).first().click();
  }

  async setBoolean(name, value, scope) {
    const box = this.field(name, scope).locator('input[type="checkbox"]').first();
    // A previous checkbox's onchange can re-render the form and swallow the click: wait, click, re-check.
    await expect(async () => {
      await this.waitReady();
      if ((await box.isChecked()) !== Boolean(value)) await box.click({ force: true, timeout: 5_000 });
      await this.page.waitForTimeout(300);
      expect(await box.isChecked()).toBe(Boolean(value));
    }).toPass({ timeout: 30_000 });
    // Some flags ask first, e.g. "Are You Sure To Enable/Disable Sell All Products?" -> Ok (otherwise dropped).
    const confirm = this.dialogs().filter({ hasText: /Are you sure/i }).filter({ has: this.page.locator('.modal-footer button', { hasText: /^Ok$/i }) }).last();
    if (await appears(confirm, 1_500)) {
      await confirm.locator('.modal-footer button').filter({ hasText: /^Ok$/i }).click();
      await confirm.waitFor({ state: 'hidden' });
    }
    await this.waitReady();
  }

  async setDate(name, value, scope) {
    const input = this.field(name, scope).locator('input').first();
    await input.fill(String(value));
    // Enter commits the typed value (date-time pickers drop it on Escape alone), then close the picker.
    await input.press('Enter').catch(() => {});
    await input.press('Escape').catch(() => {});
  }

  async setText(name, value, scope) {
    const input = this.field(name, scope).locator('input:not([type="checkbox"]), textarea, .note-editable, .odoo-editor-editable').first();
    await input.fill(String(value));
  }

  /** fill({ name: 'X', categ_id: 'Cat', tax_status: true }) - auto-detects each widget type. */
  async fill(values, scope) {
    for (const [name, value] of Object.entries(values)) {
      if (value === undefined || value === null) continue;
      const field = this.field(name, scope);
      await field.waitFor();
      const type = await this.widgetType(field);
      if (['many2one', 'text', 'date'].includes(type) && !(await field.locator('input, textarea, .note-editable, .odoo-editor-editable').count())) {
        // Read-only on this form (e.g. defaulted UoM): accept it when it already holds the value.
        const shown = (await field.innerText()).trim();
        if (shown.includes(String(value))) continue;
        throw new Error(`Field "${name}" is read-only and shows "${shown}", expected "${value}"`);
      }
      if (type === 'cdd') await this.setCustomDropdown(name, value, scope);
      else if (type === 'many2one') await this.setMany2one(name, value, scope);
      else if (type === 'many2many') await this.setMany2many(name, value, scope);
      else if (type === 'selection') await this.setSelection(name, value, scope);
      else if (type === 'boolean') await this.setBoolean(name, value, scope);
      else if (type === 'date') await this.setDate(name, value, scope);
      else await this.setText(name, value, scope);
    }
  }

  async read(name, scope) {
    const field = this.field(name, scope);
    await field.waitFor();
    if (await field.locator('.o_av_cdd').count()) return (await field.locator('.o_av_cdd_tags').innerText()).trim();
    const input = field.locator('input:not([type="checkbox"]), select, textarea').first();
    if (await input.count()) {
      if (await input.evaluate((el) => el.tagName === 'SELECT')) return (await input.locator('option:checked').innerText()).trim();
      return (await input.inputValue()).trim();
    }
    const checkbox = field.locator('input[type="checkbox"]');
    if (await checkbox.count()) return checkbox.isChecked();
    return (await field.innerText()).trim();
  }

  async readMoney(name, scope) {
    return parseMoney(await this.read(name, scope));
  }

  /** Reads several monetary fields; missing fields are reported as 0. */
  async readAmounts(names, scope) {
    const out = {};
    for (const [key, name] of Object.entries(names)) {
      const visible = await this.field(name, scope).isVisible().catch(() => false);
      out[key] = visible ? await this.readMoney(name, scope) : 0;
    }
    return out;
  }

  /** Opens a notebook tab by label (fields on hidden tabs cannot be filled). */
  async openTab(label) {
    const tab = this.page.locator('.o_form_view .o_notebook .nav-link').filter({ hasText: exact(label) }).filter({ visible: true }).first();
    await this.waitReady();
    // The tab bar can sit under the sticky header after scrolling: centre it, retry, then click directly.
    await tab.evaluate((el) => el.scrollIntoView({ block: 'center' })).catch(() => {});
    await tab.click({ timeout: 10_000 }).catch(() => tab.evaluate((el) => el.click()));
    await expect(tab).toHaveClass(/active/, { timeout: 10_000 });
    await this.page.waitForTimeout(300);
  }

  // ---------------------------------------------------------------- one2many lines

  /**
   * Adds a line to a one2many/many2many list (editable inline or via dialog)
   * and fills its columns.
   */
  async addLine(o2mName, values, { linkText } = {}) {
    const o2m = this.field(o2mName);
    const add = linkText
      ? o2m.locator('a, button').filter({ hasText: exact(linkText) }).first()
      : o2m.locator('.o_field_x2many_list_row_add a, .o-kanban-button-new, button.o-kanban-button-new').first();
    const rowsBefore = await o2m.locator('.o_data_row').count();
    await add.click();

    const dialog = this.page.locator('.modal:visible .o_form_view').last();
    const selected = o2m.locator('.o_selected_row').first();
    // Some AveriGo lists keep every row editable and never flag the new one as selected.
    await expect.poll(async () =>
      (await dialog.isVisible().catch(() => false)) ||
      (await selected.isVisible().catch(() => false)) ||
      (await o2m.locator('.o_data_row').count()) > rowsBefore,
    ).toBe(true);

    if (await dialog.isVisible().catch(() => false)) {
      await this.fill(values, dialog);
      await this.page.locator('.modal:visible .modal-footer button').filter({ hasText: /^(Save & Close|Save|Add|Select)$/i }).first().click();
      return;
    }
    const row = (await selected.isVisible().catch(() => false)) ? selected : o2m.locator('.o_data_row').last();
    for (const [name, value] of Object.entries(values)) {
      if (value === undefined || value === null) continue;
      // Inline list cells only render their editor once the cell is clicked.
      const cell = row.locator(`td[name="${name}"]`).first();
      if ((await cell.count()) && !(await row.locator(`.o_field_widget[name="${name}"] input`).first().isVisible().catch(() => false))) {
        await cell.click();
      }
      await this.fill({ [name]: value }, row);
    }
  }

  /** Many2many "Add" dialog that opens a searchable list: select records by text. */
  async selectInDialog(texts) {
    const modal = this.page.locator('.modal:visible').last();
    for (const text of [].concat(texts)) {
      const box = modal.locator('.o_searchview_input');
      await box.fill(text);
      await box.press('Enter');
      await this.waitReady();
      // Wait until the list shows only matching rows (search reload finished).
      await expect.poll(async () => modal.locator('.o_data_row').filter({ hasText: text }).count(), { timeout: 30_000 }).toBeGreaterThan(0);
      await this.page.waitForTimeout(500); // let the search reload settle before clicking
      const row = modal.locator('.o_data_row').filter({ hasText: text }).first();
      const checkbox = row.locator('.o_list_record_selector input').first();
      if (!(await checkbox.count())) {
        // Single-select (many2one) dialog: clicking the row picks it and closes the dialog.
        await row.locator('td.o_data_cell').first().click();
        await expect(modal).toBeHidden();
        await this.waitReady();
        return;
      }
      await expect(async () => {
        if (!(await checkbox.isChecked())) await row.locator('td.o_list_record_selector').first().click();
        await expect(checkbox).toBeChecked({ timeout: 2_000 });
      }).toPass({ timeout: 15_000 });
    }
    const select = modal.locator('.modal-footer button, footer button').filter({ hasText: /^\s*(Select|Add|Confirm)\s*$/i }).first();
    await expect(select).toBeEnabled();
    await select.click();
    await this.waitReady();
  }


  lineRows(o2mName) {
    return this.field(o2mName).locator('.o_data_row');
  }

  // ---------------------------------------------------------------- buttons, save, dialogs

  button(label) {
    const scope = this.dialogs().or(this.page.locator('.o_action_manager')).last();
    const byName = scope.locator(`button[name="${label}"]`).filter({ visible: true }).first();
    const byText = scope.locator('button, a.btn').filter({ hasText: exact(label) }).filter({ visible: true }).first();
    return byName.or(byText).first();
  }

  async click(label) {
    await this.button(label).click();
    await this.waitReady();
  }

  /** Clicks the first visible button whose label/name matches any of the candidates (waits up to `timeout`). */
  async clickAny(labels, { timeout = 15_000 } = {}) {
    const deadline = Date.now() + timeout;
    do {
      for (const label of labels) {
        const btn = this.button(label);
        if (await btn.isVisible().catch(() => false)) {
          await btn.click();
          await this.waitReady();
          return label;
        }
      }
      await this.page.waitForTimeout(500);
    } while (Date.now() < deadline);
    throw new Error(`None of the buttons [${labels.join(', ')}] is visible`);
  }

  /** { timeout }: how long the server may take (e.g. a warehouse save also builds its locations/routes). */
  async save({ timeout } = {}) {
    const saveBtn = this.page.locator('.o_form_button_save, .o_list_button_save').filter({ visible: true }).first();
    const isList = await this.page.locator('.o_action_manager .o_view_controller.o_list_view .o_selected_row').first().isVisible().catch(() => false);
    // A slow save may already be running (e.g. started by a tab switch): let it finish first.
    await this.waitReady(timeout);
    if ((await saveBtn.isVisible().catch(() => false)) && (await saveBtn.isEnabled().catch(() => false))) await saveBtn.click();
    await this.page.waitForTimeout(500);
    await this.waitReady(timeout);
    await this.expectNoError();
    await expect(this.page.locator('.o_form_view .o_field_invalid, .o_selected_row .o_field_invalid')).toHaveCount(0);
    if (isList) {
      await expect(this.page.locator('.o_action_manager .o_selected_row')).toHaveCount(0);
    } else {
      // A saved record has an id in the URL (…/model/42), a new one ends in /new.
      // Onchanges (e.g. zip lookup) can swallow the first click, so retry a few times.
      for (let attempt = 0; attempt < 3 && /\/new(\?|$)/.test(this.page.url()); attempt++) {
        await this.page.waitForURL((u) => !/\/new(\?|$)/.test(u.toString()), { timeout: 10_000 }).catch(() => {});
        if (/\/new(\?|$)/.test(this.page.url()) && (await saveBtn.isVisible().catch(() => false))) {
          await this.page.locator('body').press('Tab').catch(() => {});
          await saveBtn.click();
          await this.waitReady();
          await this.expectNoError();
        }
      }
      await expect(this.page).not.toHaveURL(/\/new(\?|$)/, { timeout: 60_000 });
      // A click that only closed an open autocomplete leaves the record dirty: click Save again.
      const dirty = this.page.locator('.o_form_view.o_form_dirty, .o_form_status_indicator .o_form_button_save:visible');
      for (let attempt = 0; attempt < 3; attempt++) {
        if (await expect(dirty).toHaveCount(0, { timeout: 5_000 }).then(() => true, () => false)) break;
        if (await saveBtn.isVisible().catch(() => false)) {
          await this.page.locator('body').press('Escape').catch(() => {});
          await saveBtn.click().catch(() => {});
          await this.waitReady(timeout);
          await this.expectNoError();
        }
      }
      await expect(dirty).toHaveCount(0, { timeout: 30_000 });
    }
    return this.currentUrl();
  }

  async discard() {
    const btn = this.page.locator('.o_form_button_cancel').filter({ visible: true }).first();
    if (await btn.isVisible().catch(() => false)) await btn.click();
    await this.waitReady();
  }

  async confirmDialog(label) {
    const footer = this.page.locator('.modal:visible .modal-footer').last();
    const btn = label ? footer.locator('button').filter({ hasText: exact(label) }).first() : footer.locator('button.btn-primary').first();
    await btn.click();
    await this.waitReady();
  }

  errorDialog() {
    return this.page.locator('.o_error_dialog, .modal:visible:has(.o_dialog_warning), .modal:visible .modal-title:text-matches("(Error|Warning|Validation|Invalid|Note)", "i"), .modal:visible .modal-header:text-matches("^\\s*Note:", "i")').first();
  }

  async expectNoError() {
    await this.page.waitForTimeout(300);
    const dialog = this.errorDialog();
    if (await dialog.isVisible().catch(() => false)) {
      const text = await this.page.locator('.modal:visible').last().innerText();
      throw new Error(`Unexpected Odoo error dialog:\n${text}`);
    }
  }

  // ---------------------------------------------------------------- negative-test helpers

  /**
   * Runs an action that the app should refuse and reports how it was refused:
   * { blocked, kind: 'dialog' | 'notification' | 'invalid-field', message }. Always cleans up afterwards
   * (closes dialogs, cancels edited rows, discards the unsaved form) so no invalid data is left behind.
   */
  async attempt(action, { timeout = 10_000, confirm = false } = {}) {
    let thrown;
    try { await action(); } catch (e) { thrown = e; }
    if (confirm) {
      // "Are you sure ... delete?" style prompt: confirm it so the app's real answer (refusal or not) shows.
      const sure = this.page.locator('.modal:visible').filter({ hasText: /are you sure|delete|confirm/i }).last();
      if (await sure.isVisible({ timeout: 3_000 }).catch(() => false)) {
        await sure.locator('.modal-footer button').filter({ hasText: /^\s*(Delete|Ok|Confirm|Yes)\s*$/i }).first().click().catch(() => {});
        await this.waitReady().catch(() => {});
      }
    }
    const dialog = this.page.locator('.modal:visible').filter({ hasNotText: 'Open Customer Activities' })
      .filter({ hasText: /error|warning|invalid|not allowed|cannot|can't|must|required|already|exceed|greater|less than|duplicate|unique|please|not possible|validation/i }).last();
    const note = this.page.locator('.o_notification.border-danger, .o_notification:has(.text-danger), .o_notification_bar.bg-danger, .o_notification.bg-danger').first();
    const invalid = this.page.locator('.o_field_invalid, .o_invalid_cell').filter({ visible: true }).first();
    const banner = this.page.locator('.o_form_view .alert, .o_form_view [role="alert"]').filter({ visible: true })
      .filter({ hasText: /could not|cannot|can't|exceed|not allowed|insufficient|not enough|must/i }).first();
    let result = { blocked: false, kind: '', message: '' };
    const deadline = Date.now() + timeout;
    while (Date.now() < deadline) {
      if (await dialog.isVisible().catch(() => false)) {
        result = { blocked: true, kind: 'dialog', message: (await dialog.innerText().catch(() => '')).replace(/\s+/g, ' ').trim().slice(0, 300) };
        break;
      }
      if (await note.isVisible().catch(() => false)) {
        result = { blocked: true, kind: 'notification', message: (await note.innerText().catch(() => '')).replace(/\s+/g, ' ').trim().slice(0, 300) };
        break;
      }
      if (await banner.isVisible().catch(() => false)) {
        result = { blocked: true, kind: 'banner', message: (await banner.innerText().catch(() => '')).replace(/\s+/g, ' ').trim().slice(0, 300) };
        break;
      }
      if (await invalid.isVisible().catch(() => false)) {
        const names = await this.page.locator('.o_field_invalid, .o_invalid_cell').evaluateAll((es) => es.filter((e) => e.offsetParent).map((e) => e.getAttribute('name') || e.closest('[name]')?.getAttribute('name') || '?'));
        result = { blocked: true, kind: 'invalid-field', message: `invalid: ${[...new Set(names)].join(', ')}` };
        break;
      }
      await this.page.waitForTimeout(300);
    }
    if (thrown && !result.blocked) result.message = `action failed: ${String(thrown.message).split('\n')[0]}`;
    if (!result.blocked && !thrown) {
      // Nothing shown: did it actually save? (still dirty / still a new record = refused silently)
      const dirty = await this.page.locator('.o_form_view.o_form_dirty, .o_form_status_indicator .o_form_button_save:visible, .o_list_button_save:visible').count().catch(() => 0);
      const isNew = /\/new(\?|$)/.test(this.page.url());
      if (dirty || isNew) result = { blocked: true, kind: 'silent', message: 'not saved, but no message was shown' };
      else result.message = 'saved';
    }
    await this.cleanup();
    return result;
  }

  /** Closes open dialogs, cancels edited list rows and discards unsaved changes (used after negative attempts). */
  async cleanup() {
    for (let i = 0; i < 4; i++) {
      const m = this.page.locator('.modal:visible').filter({ hasNotText: 'Open Customer Activities' }).last();
      if (!(await m.isVisible().catch(() => false))) break;
      const safe = m.locator('.modal-footer button').filter({ hasText: /^\s*(Discard changes|Discard|Cancel|Close)\s*$/i }).first();
      const btn = (await safe.isVisible().catch(() => false)) ? safe : m.locator('.modal-footer button').filter({ hasText: /^\s*Ok\s*$/i }).first();
      if (await btn.isVisible().catch(() => false)) await btn.click().catch(() => {});
      else await m.locator('.btn-close').first().click().catch(() => this.page.keyboard.press('Escape'));
      await this.page.waitForTimeout(400);
    }
    await this.page.keyboard.press('Escape').catch(() => {});
    const discard = this.page.locator('.o_form_button_cancel, .o_list_button_discard').filter({ visible: true }).first();
    if (await discard.isVisible().catch(() => false)) {
      await discard.click().catch(() => {});
      const confirm = this.page.locator('.modal:visible .modal-footer button').filter({ hasText: /^\s*(Discard|Ok)\s*$/i }).first();
      if (await confirm.isVisible({ timeout: 1_500 }).catch(() => false)) await confirm.click().catch(() => {});
    }
    await this.waitReady().catch(() => {});
  }

  /** True when `text` is NOT offered by a many2one/many2many picker after typing it. */
  async notOffered(name, text, scope) {
    const field = this.field(name, scope);
    if (await field.locator('.o_av_cdd').count()) {
      await field.locator('.o_av_cdd_trigger').click();
      const search = field.locator('.o_av_cdd_panel .o_av_cdd_search input');
      if (await search.isVisible().catch(() => false)) await search.fill(text);
      await this.page.waitForTimeout(1_500);
      const items = await field.locator('.o_av_cdd_panel .o_av_cdd_list li').allInnerTexts();
      await field.locator('.o_av_cdd_trigger').click().catch(() => {});
      return { offered: items.some((t) => t.includes(text)), items };
    }
    const input = field.locator('input').first();
    await input.click();
    await input.fill(text);
    await this.page.waitForTimeout(2_000);
    const items = (await this.page.locator('.o-autocomplete--dropdown-item').filter({ visible: true }).allInnerTexts()).map((t) => t.trim());
    await input.fill('').catch(() => {});
    await this.page.keyboard.press('Escape').catch(() => {});
    return { offered: items.some((t) => t.includes(text) && !/^(Create|Search More)/.test(t)), items };
  }

  /** Waits for an error/warning dialog (or notification) and returns its text. */
  async expectBlockingAlert(pattern = /.+/) {
    const alert = this.page.locator('.modal:visible .modal-body, .o_notification.border-danger, .o_notification_content').first();
    await expect(alert).toBeVisible();
    const text = await alert.innerText();
    expect(text).toMatch(pattern);
    await this.page.locator('.modal:visible .modal-footer button').first().click().catch(() => {});
    return text;
  }

  async openActionMenu(item) {
    await this.page.locator('.o_cp_action_menus button, .o_control_panel .o-dropdown button:has(.fa-cog)').filter({ visible: true }).first().click();
    await this.page.locator('.o-dropdown--menu .dropdown-item').filter({ hasText: exact(item) }).first().click();
  }

  /**
   * Action menu -> (Print ->) report item: downloads the PDF, attaches it to the test report and returns its
   * text (pdftotext -layout). `item` is the report's menu label (RegExp or string).
   */
  async printReport(item, fileName = 'report.pdf') {
    await this.waitReady();
    const print = this.page.locator('.o-dropdown--menu .dropdown-item, .o-dropdown--menu button').filter({ hasText: /^[^A-Za-z0-9]*Print[^A-Za-z0-9]*$/ }).filter({ visible: true }).first();
    const label = item instanceof RegExp ? item : new RegExp(`^\\s*${escapeRe(item)}\\s*$`);
    const entry = this.page.locator('.o-dropdown--menu .dropdown-item').filter({ hasText: label }).filter({ visible: true }).first();
    const action = this.page.locator('.o_control_panel button, .o_cp_action_menus button').filter({ hasText: /^\s*Action\s*$/ }).first();
    const download = this.page.waitForEvent('download', { timeout: 120_000 });
    // Report entries sit in the Print submenu (opens on hover, click or ArrowRight); retry the whole path until clicked.
    for (let attempt = 0; ; attempt++) {
      if (!(await print.isVisible().catch(() => false)) && !(await entry.isVisible().catch(() => false))) {
        await this.page.keyboard.press('Escape').catch(() => {});
        await action.click();
        await print.waitFor({ timeout: 5_000 }).catch(() => {});
      }
      if (!(await entry.isVisible().catch(() => false)) && (await print.isVisible().catch(() => false))) {
        await print.hover();
        if (!(await appears(entry, 1_500))) await print.click();
        if (!(await appears(entry, 1_500))) { await print.focus().catch(() => {}); await this.page.keyboard.press('ArrowRight'); }
      }
      if (await appears(entry, 2_000)) {
        await entry.click();
        break;
      }
      if (attempt >= 4) throw new Error(`Print > ${label} not found in the Action menu`);
    }
    const file = test.info().outputPath(fileName);
    await (await download).saveAs(file);
    await test.info().attach(fileName, { path: file, contentType: 'application/pdf' });
    return execFileSync('pdftotext', ['-layout', file, '-']).toString();
  }

  /** Attempts to delete the open record; returns the blocking alert text. */
  async attemptDeleteExpectBlocked() {
    const url = this.currentUrl();
    await this.openActionMenu('Delete');
    const confirm = this.page.locator('.modal:visible .modal-footer button').filter({ hasText: /^(Delete|Ok)$/i }).first();
    if (await appears(confirm, 5_000)) await confirm.click();
    const text = await this.expectBlockingAlert(/(cannot|can't|not allowed|referenced|linked|exist|constraint|delete|archive)/i);
    // Record must still exist.
    await this.goto(url);
    await expect(this.page.locator('.o_form_view')).toBeVisible();
    return text;
  }

  /** The highlighted (current) statusbar state; the bar itself lists every state. */
  currentStatus() {
    return this.page.locator('.o_statusbar_status .o_arrow_button_current, .o_statusbar_status [aria-checked="true"]').first();
  }

  async status() {
    return (await this.currentStatus().innerText()).trim();
  }

  async expectStatus(pattern) {
    await expect(this.currentStatus()).toHaveText(pattern);
  }

  async recordTitle() {
    return (await this.page.locator('.o_breadcrumb .active, .o_last_breadcrumb_item').first().innerText()).trim();
  }

  /** Clicks a smart button (stat button) such as "Invoices" / "Delivery". */
  async openSmartButton(label) {
    await this.page.locator('.oe_button_box button, .o-form-buttonbox button').filter({ hasText: label }).first().click();
    await this.waitReady();
  }

  async back() {
    await this.page.locator('.o_breadcrumb a, .o_back_button').last().click();
    await this.waitReady();
  }
}

module.exports = { OdooPage, exact, escapeRe };
