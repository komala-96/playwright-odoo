const fs = require('fs');
const path = require('path');
const { expect } = require('@playwright/test');
const env = require('../config/env');

const RESULTS_DIR = path.join(__dirname, 'results');
const resultsFile = () => path.join(RESULTS_DIR, `perf-${process.env.RUN_ID}.json`);

function loadResults() {
  try {
    return JSON.parse(fs.readFileSync(resultsFile(), 'utf8'));
  } catch {
    return { runId: process.env.RUN_ID, baseUrl: env.BASE_URL, startedAt: new Date().toISOString(), scenarios: {} };
  }
}

function saveResults(all) {
  fs.mkdirSync(RESULTS_DIR, { recursive: true });
  fs.writeFileSync(resultsFile(), JSON.stringify(all, null, 2));
}

const WRITE_CALL = /^(web_save|create|write|unlink|action_|button_|add_|open_)/;

/**
 * One performance scenario. step() times an action; kind:
 *  - 'app'   : application response (click -> server done -> UI settled). These are the numbers to compare.
 *  - 'ui'    : automation typing/selecting (depends on the robot, not the server). Reported separately.
 * Results are flushed to perf/results/perf-<RUN_ID>.json after every step, so a failure keeps what was measured.
 */
class Scenario {
  constructor(no, title, page) {
    this.no = no;
    this.page = page;
    this.title = title;
    this.steps = [];
    this.notes = [];
    this.t0 = Date.now();
    this.flush('running');
  }

  async step(name, fn, { kind = 'app' } = {}) {
    const t = performance.now();
    let ok = false;
    // Server calls that write (save / create / confirm / delete / button actions) made during the step, with the
    // time the server took for each (request sent -> response received).
    const calls = [];
    const onDone = (req) => {
      const m = req.url().match(/\/web\/dataset\/call_(?:kw|button)\/([^/?]+)\/([^/?]+)/);
      if (!m || !WRITE_CALL.test(m[2])) return;
      const ms = Math.round(req.timing().responseEnd);
      if (ms >= 0) calls.push({ call: `${m[1]}.${m[2]}`, ms });
    };
    this.page?.on('requestfinished', onDone);
    try {
      const r = await fn();
      ok = true;
      return r;
    } finally {
      this.page?.off('requestfinished', onDone);
      const serverMs = calls.reduce((a, c) => a + c.ms, 0);
      this.steps.push({ name, kind, ms: Math.round(performance.now() - t), ok, serverMs, calls });
      this.flush('running');
    }
  }

  note(text) {
    this.notes.push(text);
    this.flush('running');
  }

  flush(status, error) {
    const all = loadResults();
    all.scenarios[this.no] = {
      no: this.no, title: this.title, status, totalMs: Date.now() - this.t0,
      steps: this.steps, notes: this.notes, error: error ? String(error.message || error).split('\n').slice(0, 6).join('\n') : undefined,
      at: new Date().toISOString(),
    };
    all.finishedAt = new Date().toISOString();
    saveResults(all);
  }
}

/** Wraps a test body: records pass / fail and the total time of the scenario. */
async function runScenario(no, title, body, page) {
  const s = new Scenario(no, title, page);
  try {
    await body(s);
    s.flush('passed');
  } catch (e) {
    s.flush('failed', e);
    throw e;
  }
}

/** Clicks and waits until the server answered and Odoo's UI is idle again (the user-perceived response time). */
async function clickAndSettle(odoo, locator, { timeout = 600_000 } = {}) {
  await locator.click();
  await odoo.page.waitForTimeout(200);
  await odoo.waitReady(timeout);
  await odoo.expectNoError();
}

/**
 * many2many tags field -> "Search More..." -> shows every row -> ticks the rows whose Product Code / name cell is one
 * of `keys` (stops after `count`) -> Select. Returns how many were ticked.
 */
async function pickManyViaSearchMore(odoo, fieldName, keys, count, scope) {
  const { page } = odoo;
  const field = odoo.field(fieldName, scope);
  if (await field.locator('.o_av_cdd').count()) return pickManyInSelectOptions(odoo, field, keys, count);
  const input = field.locator('input').first();
  await input.click();
  const more = page.locator('.o-autocomplete--dropdown-item').filter({ hasText: /Search More/i }).first();
  if (!(await more.isVisible({ timeout: 5_000 }).catch(() => false))) {
    // The dropdown only offers "Search More..." once something is typed on some pickers.
    await input.fill(' ');
  }
  await more.click();
  const dlg = page.locator('.modal:visible').filter({ has: page.locator('.o_list_view') }).last();
  await dlg.locator('.o_data_row').first().waitFor({ timeout: 120_000 });
  const pagerValue = dlg.locator('.o_pager_value').first();
  if (await pagerValue.isVisible().catch(() => false)) {
    const total = parseInt((await dlg.locator('.o_pager_limit').first().innerText()).replace(/\D/g, ''), 10) || 2000;
    await pagerValue.click();
    const pagerInput = dlg.locator('input.o_pager_value, .o_pager_value input').first();
    await pagerInput.fill(`1-${total}`);
    await pagerInput.press('Enter');
    await expect.poll(() => dlg.locator('.o_data_row').count(), { timeout: 180_000 }).toBeGreaterThanOrEqual(total);
    await odoo.waitReady();
  }
  const ticked = await dlg.locator('.o_data_row').evaluateAll((rows, { keys, count }) => {
    const want = new Set(keys.map(String));
    let k = 0;
    for (const r of rows) {
      if (k >= count) break;
      const cells = [...r.querySelectorAll('td.o_data_cell')].map((c) => c.innerText.trim());
      if (cells.some((c) => want.has(c))) {
        r.querySelector('.o_list_record_selector input').click();
        k++;
      }
    }
    return k;
  }, { keys, count });
  if (!ticked) throw new Error(`None of the wanted products is listed in the ${fieldName} Search More dialog`);
  await dlg.locator('.modal-footer button').filter({ hasText: /^\s*Select\s*$/ }).click();
  await dlg.waitFor({ state: 'hidden', timeout: 120_000 });
  await odoo.waitReady();
  return ticked;
}

/** AveriGo "Select options" dropdown (every option rendered): ticks the options "[code] name" / "name" in `keys`. */
async function pickManyInSelectOptions(odoo, field, keys, count) {
  await field.locator('.o_av_cdd_trigger').click();
  const panel = field.locator('.o_av_cdd_panel');
  await panel.locator('.o_av_cdd_list li').first().waitFor({ timeout: 120_000 });
  const ticked = await panel.locator('.o_av_cdd_list li').evaluateAll((lis, { keys, count }) => {
    const want = new Set(keys.map(String));
    let k = 0;
    for (const li of lis) {
      if (k >= count) break;
      const label = li.innerText.trim();
      const code = label.match(/^\[([^\]]+)\]/)?.[1];
      if (want.has(code) || want.has(label)) { li.click(); k++; }
    }
    return k;
  }, { keys, count });
  if (!ticked) throw new Error('None of the wanted products is offered in the Select options list');
  await expect(panel.locator('.o_av_cdd_count')).toContainText(`${ticked} selected`, { timeout: 60_000 });
  const save = panel.locator('.o_av_cdd_save');
  if (await save.isVisible().catch(() => false)) await save.click();
  else await field.locator('.o_av_cdd_trigger').click();
  await odoo.waitReady();
  return ticked;
}

/** Sets `column` to `value` on every row of an editable one2many list (rows located by index). */
async function setColumnOnAllRows(odoo, o2mName, column, value) {
  const { page } = odoo;
  const list = odoo.field(o2mName);
  const rows = list.locator('.o_data_row');
  const n = await rows.count();
  for (let i = 0; i < n; i++) {
    const cell = rows.nth(i).locator(`td[name="${column}"]`);
    const input = cell.locator('input').first();
    // The previous line's onchange can re-render the list and swallow the click: click again until the cell edits.
    await expect(async () => {
      // Wait out the previous line's onchange ("Loading"): a click made meanwhile is dropped.
      await odoo.waitReady(300_000);
      if (!(await input.isVisible().catch(() => false))) await cell.click({ timeout: 10_000 });
      await input.waitFor({ timeout: 5_000 });
    }).toPass({ timeout: 120_000 });
    await input.fill(String(value));
  }
  await page.keyboard.press('Escape').catch(() => {});
  await odoo.waitReady();
  return n;
}

/** JSON-RPC from the logged-in page (read-only lookups for test data). */
function rpc(page, model, method, args = [], kwargs = {}) {
  return page.evaluate(async ({ model, method, args, kwargs }) => {
    const res = await fetch('/web/dataset/call_kw', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ jsonrpc: '2.0', method: 'call', params: { model, method, args, kwargs } }),
    });
    const j = await res.json();
    if (j.error) throw new Error(`${model}.${method}: ${j.error.data?.message || j.error.message}`);
    return j.result;
  }, { model, method, args, kwargs });
}

/** Action menu > Delete > confirm; waits until the record is gone (form closed / next record shown). */
async function deleteOpenRecord(odoo) {
  const { page } = odoo;
  const url = page.url();
  await odoo.openActionMenu('Delete');
  const confirm = page.locator('.modal:visible .modal-footer button').filter({ hasText: /^\s*(Delete|Ok)\s*$/i }).first();
  await confirm.waitFor({ timeout: 15_000 });
  await confirm.click();
  await page.waitForTimeout(200);
  await odoo.waitReady(600_000);
  await odoo.expectNoError();
  await expect(page).not.toHaveURL(url, { timeout: 120_000 });
}

module.exports = { Scenario, runScenario, clickAndSettle, pickManyViaSearchMore, setColumnOnAllRows, rpc, deleteOpenRecord, loadResults, resultsFile };
