const { expect, test } = require('@playwright/test');
const { appears } = require('../utils/wait');
const XLSX = require('xlsx');
const { OdooPage, exact, escapeRe } = require('./OdooPage');

/**
 * Averigo Reports app (custom client action):
 *   left `.category-btn` -> `.report-card` tile -> labelled filters
 *   (chip-box multi-selects, MM/DD/YYYY date inputs, <select>s) -> Generate
 *   -> results table (+ "Total records") / Export download.
 *
 * Filters are passed by meaning and matched to whatever label the report uses:
 *   { start, end, date, customers, products, category, warehouse, microMarket, vendor, employee }
 * plus any exact label, e.g. { 'Report Type': 'Product Master' }.
 */
const LABELS = {
  start: /^\s*(Start Date|From Date|Date From|From)\s*\*?\s*$/i,
  end: /^\s*(End Date|To Date|Date To|To)\s*\*?\s*$/i,
  date: /^\s*(Date|As of Date|As On Date|Aging Date|Report Date)\s*\*?\s*$/i,
  customers: /^\s*(Customers?|Customer Name|Parent Customers?)\s*\*?\s*$/i,
  products: /^\s*Products?\s*\*?\s*$/i,
  category: /^\s*(Product )?Categor(y|ies)\s*\*?\s*$/i,
  warehouse: /^\s*(Warehouses?|Locations?|Warehouse Locations?)\s*\*?\s*$/i,
  microMarket: /^\s*(Micro ?markets?|Markets?|Micro ?Market Locations?|Locations?)\s*\*?\s*$/i,
  vendor: /^\s*Vendors?\s*\*?\s*$/i,
  employee: /^\s*Employees?\s*\*?\s*$/i,
};

class ReportsPage extends OdooPage {
  container() {
    return this.page.locator('.o_action_manager').first();
  }

  async open() {
    await this.openApp('Averigo Reports');
    // The reports home can take a while on large instances (ultraserv).
    await this.page.locator('.category-btn').first().waitFor({ timeout: 120_000 });
  }

  async openReport(category, tile) {
    await this.open();
    await this.page.locator('.category-btn').filter({ hasText: category }).first().click();
    await this.page.locator('.report-card').filter({ has: this.page.locator('.report-name', { hasText: exact(tile) }) }).first().click();
    // Some report screens take a while to open on large instances (ultraserv).
    await this.container().locator('button').filter({ hasText: /^\s*Generate\s*$/ }).first().waitFor({ timeout: 120_000 });
    await this.waitReady(180_000);
  }

  /** The filter column whose <label> matches. */
  filterBox(label) {
    // Required filters render "Label *". The control lives next to its <label> in the same parent.
    const re = label instanceof RegExp ? label : new RegExp(`^\\s*${escapeRe(label)}\\s*\\*?\\s*$`, 'i');
    return this.container().locator('label.form-label').filter({ hasText: re }).first().locator('xpath=..');
  }


  async setFilter(label, value) {
    const box = this.filterBox(label);
    if (!(await box.isVisible().catch(() => false))) return false;
    const select = box.locator('select').first();
    const date = box.locator('input.o_datetime_input, input[placeholder="MM/DD/YYYY"]');
    const chip = box.locator('.mm-chipbox, .filter-dropdown-container > .form-control').first();
    if (await select.count()) {
      await select.selectOption({ label: String(value) });
    } else if (await date.count()) {
      await date.first().fill(String(value));
      await date.first().press('Enter');
      await this.page.keyboard.press('Escape').catch(() => {});
    } else if (await chip.count()) {
      for (const v of [].concat(value)) {
        const search = box.locator('input:not([type="checkbox"])').filter({ visible: true }).first();
        if (!(await search.isVisible().catch(() => false))) await chip.click();
        await search.waitFor();
        await search.fill(String(v));
        // Exact label first; products are listed as "[CODE] Name", so fall back to contains.
        const exactItem = () => box.locator('.dropdown-items-container *, li, label').getByText(String(v), { exact: true }).first();
        let item = exactItem();
        if (!(await appears(item, 3_000))) {
          item = box.getByText(String(v)).filter({ visible: true }).first();
        }
        if (!(await appears(item, 2_000))) {
          // Some report pickers' search returns "No matching ..." for entries that ARE in the
          // preloaded list (see FINDINGS.md). Clear the search and pick from the full list.
          await search.fill('');
          await this.page.waitForTimeout(500);
          item = exactItem();
          if (!(await item.count())) item = box.getByText(String(v)).first();
          await item.scrollIntoViewIfNeeded();
        }
        await item.waitFor();
        const checkbox = item.locator('xpath=ancestor-or-self::label[1]//input[@type="checkbox"]');
        if (await checkbox.count()) await checkbox.first().check({ force: true });
        else await item.click();
        await this.page.waitForTimeout(300);
      }
      await this.page.keyboard.press('Escape').catch(() => {});
      await box.locator('label.form-label').click().catch(() => {});
    } else {
      await box.locator('input').first().fill(String(value));
    }
    return true;
  }

  async setFilters(filters = {}) {
    const skipped = [];
    for (const [key, value] of Object.entries(filters)) {
      if (value === undefined || value === null) continue;
      if (!(await this.setFilter(LABELS[key] || key, value))) skipped.push(key);
    }
    if (skipped.length) test.info().annotations.push({ type: 'Report filter not on this report', description: skipped.join(', ') });
  }

  async generate() {
    // Show every row on one page; must be set before Generate (changing it afterwards clears the results).
    // "Records per page" is the select offering 10/20/... and All (layout differs per report).
    const perPage = this.container().locator('select').filter({ has: this.page.locator('option[value="10"]') }).first();
    if (await perPage.isVisible().catch(() => false)) {
      const values = await perPage.locator('option').evaluateAll((o) => o.map((x) => x.value));
      const all = values.find((v) => /^all$/i.test(v)) ?? values.find((v) => /^(-1|0|1000|5000)$/.test(v));
      if (all !== undefined) await perPage.selectOption(all).catch(() => {});
    }
    await this.page.keyboard.press('Escape').catch(() => {});
    const generate = this.container().locator('button').filter({ hasText: /^\s*Generate\s*$/ }).first();
    const responded = this.page.waitForResponse((r) => /call_kw|\/report|\/averigo/i.test(r.url()) && r.request().method() === 'POST', { timeout: 60_000 }).catch(() => null);
    await generate.click();
    await responded;
    await this.waitReady();
    await this.page.waitForTimeout(1000);
  }

  async totalRecords() {
    const t = await this.container().innerText().catch(() => '');
    const m = t.match(/Total records:\s*([\d,]+)/i);
    return m ? parseInt(m[1].replace(/,/g, ''), 10) : null;
  }

  /** Expands grouped rows (e.g. per customer) so their detail lines are readable. */
  async expandGroups() {
    const toggles = this.container().locator('table tbody tr .fa-chevron-right, table tbody tr .fa-angle-right, table tbody tr .fa-caret-right');
    for (let i = 0, n = await toggles.count(); i < n && i < 50; i++) {
      const t = toggles.first();
      if (!(await t.isVisible().catch(() => false))) break;
      await t.click();
      await this.page.waitForTimeout(400);
    }
  }

  /** Pager "Next" control (text button or arrow), outside the table body. */
  nextPage() {
    return this.container()
      .locator('button, a')
      .filter({ hasText: /^\s*Next\s*$/ })
      .or(this.container().locator('button:has(.fa-chevron-right), button:has(.fa-angle-right), button:has(.fa-arrow-right), .o_pager_next, .pagination-controls button.ms-2').filter({ hasNot: this.page.locator('xpath=ancestor::tbody') }))
      .filter({ visible: true })
      .last();
  }

  /** Visible text of the generated report, all pages: one line per table row. */
  async output() {
    // "Records Per Page" (default 10): show everything on one page when the report offers it.
    const size = this.container().locator('input.page-size-input').first();
    if (await size.isVisible().catch(() => false)) {
      await size.fill('1000');
      await size.press('Enter');
      await size.dispatchEvent('change').catch(() => {});
      await this.waitReady();
      await expect.poll(async () => this.container().locator('table tbody tr').count(), { timeout: 10_000 }).toBeGreaterThan(0).catch(() => {});
    }
    const lines = [];
    for (let page = 0; page < 50; page++) {
      await this.expandGroups();
      const rows = this.container().locator('table tbody tr');
      if (!(await rows.count())) break;
      lines.push(...(await rows.allInnerTexts()));
      const next = this.nextPage();
      if (!(await next.isVisible().catch(() => false)) || !(await next.isEnabled().catch(() => false))) break;
      if (await next.evaluate((e) => e.classList.contains('disabled') || e.getAttribute('aria-disabled') === 'true')) break;
      const first = await rows.first().innerText();
      await next.click();
      await this.waitReady();
      // Stop when the page did not change (last page without a disabled state).
      const changed = await expect.poll(async () => (await rows.first().innerText().catch(() => first)) !== first, { timeout: 5_000 }).toBe(true).then(() => true, () => false);
      if (!changed) break;
    }
    if (lines.length) return lines.join('\n');
    const iframe = this.page.frameLocator('iframe').first();
    return iframe.locator('body').innerText().catch(() => this.container().innerText());
  }

  /** Runs a report and asserts every expected value appears in its rows. */
  async run({ category, tile, filters, expectContains = [] }) {
    let text = '';
    // Slow instances (ultraserv) can drop a filter set while the screen is still loading, giving an empty or
    // unfiltered result: re-open, re-apply the filters and generate once more before judging the result.
    for (let attempt = 0; attempt < 2; attempt++) {
      await this.openReport(category, tile);
      await this.setFilters(filters);
      await this.generate();
      text = await this.output();
      if (!/No data Found/i.test(text) && expectContains.every((v) => text.includes(String(v)))) break;
      if (attempt === 0) test.info().annotations.push({ type: 'Report retried', description: `${tile}: first result empty or incomplete, generated again` });
    }
    expect(text, `${tile} returned "No data Found"`).not.toMatch(/No data Found/i);
    for (const value of expectContains) {
      expect(text, `${tile} should contain "${value}"`).toContain(String(value));
    }
    return text;
  }

  /** The report line(s) that mention `key` (e.g. a product code or customer). */
  static rowFor(text, key) {
    const line = text.split('\n').filter((l) => l.includes(key)).join(' ');
    expect(line, `report has a row for ${key}`).not.toBe('');
    return line;
  }

  /** Asserts each expected number appears in the row, whatever its formatting ($, commas, decimals). */
  static expectRowNumbers(text, key, numbers) {
    const line = ReportsPage.rowFor(text, key);
    const found = (line.match(/-?\(?[\d,]+(?:\.\d+)?\)?/g) || []).map((n) => parseFloat(n.replace(/[(),]/g, '')));
    for (const n of numbers) {
      expect(found.some((f) => Math.abs(f - n) < 0.01), `${key}: expected ${n} in "${line}"`).toBe(true);
    }
  }

  /** Generates, clicks Export and returns the downloaded sheet rows as text. */
  async exportRows({ category, tile, filters }) {
    await this.openReport(category, tile);
    await this.setFilters(filters);
    await this.generate();
    await this.container().locator('button.export-btn, button').filter({ hasText: /Export/ }).first().click();
    // "Export Report" chooser: PDF / XLSX.
    const xlsx = this.page.getByRole('button', { name: /^\s*XLSX\s*$/i }).or(this.page.locator('button').filter({ hasText: /^\s*(Excel|XLSX)\s*$/i })).first();
    const download = this.page.waitForEvent('download', { timeout: 60_000 });
    if (await appears(xlsx, 5_000)) await xlsx.click();
    const file = await (await download).path();
    const wb = XLSX.readFile(file);
    return wb.SheetNames.flatMap((s) => XLSX.utils.sheet_to_json(wb.Sheets[s], { header: 1 })).map((r) => r.join(' | '));
  }
}

module.exports = { ReportsPage };
