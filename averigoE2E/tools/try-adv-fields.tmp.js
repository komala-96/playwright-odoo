// Lists every visible field on a new Customer Advance (customer = Customer 1), with widget, required/readonly, value, options.
const { chromium } = require('@playwright/test');
const env = require('../config/env');
const d = require('../data/testData');
const { AccountingPage } = require('../pages/AccountingPage');
(async () => {
  const b = await chromium.launch();
  const c = await b.newContext({ storageState: env.AUTH_FILE, baseURL: env.BASE_URL, viewport: { width: 1600, height: 1000 } });
  const p = await c.newPage();
  await p.addLocatorHandler(p.locator('.modal.o_technical_modal').filter({ hasText: 'Open Customer Activities' }), (m) => m.locator('.btn-close').first().click({ timeout: 5000 }).catch(() => m.page().keyboard.press('Escape')));
  const a = new AccountingPage(p);
  await a.openAR('Advance'); await a.clickNew();
  await a.fill({ partner_id: d.customer1.name });
  await p.waitForTimeout(1500);
  const dump = (label) => p.evaluate((lbl) => {
    const root = document.querySelector('.o_action_manager .o_form_view');
    const rows = [...root.querySelectorAll('.o_field_widget[name]')].filter((e) => e.offsetParent && !e.closest('.o_data_row')).map((e) => {
      const id = e.querySelector('input,select,textarea')?.id;
      const l = (id && root.querySelector(`label[for="${id}"]`)?.innerText.trim()) || '';
      const sel = e.querySelector('select');
      const cb = e.querySelector('input[type=checkbox]');
      const val = sel ? sel.options[sel.selectedIndex]?.text : cb ? String(cb.checked) : (e.querySelector('input,textarea')?.value ?? e.innerText.trim().slice(0, 30));
      const opts = sel ? ' {' + [...sel.options].map((o) => o.text.trim()).filter(Boolean).join('/') + '}' : '';
      const cls = (e.className.match(/o_field_\w+/g) || []).filter((x) => x !== 'o_field_widget').join(',');
      const cols = e.querySelector('table') ? ' cols:' + [...e.querySelectorAll('th[data-name]')].map((t) => t.dataset.name).join(',') : '';
      return `${e.getAttribute('name')} [${cls}]${e.classList.contains('o_required_modifier') ? '*' : ''}${e.classList.contains('o_readonly_modifier') ? ' RO' : ''} "${l}" = ${JSON.stringify(val)}${opts}${cols}`;
    });
    return `--- ${lbl}\n  ` + rows.join('\n  ');
  }, label);
  console.log(await dump('ADVANCE (after customer)'));
  console.log('TABS:', (await p.locator('.o_form_view .o_notebook .nav-link').allInnerTexts()).join(' | '));
  console.log('BUTTONS:', (await p.locator('.o_form_view button').filter({ visible: true }).allInnerTexts()).map((x) => x.trim()).filter(Boolean).join(' | '));
  for (const f of ['payment_mode_id', 'account_id', 'journal_id']) {
    const fld = a.field(f);
    if (!(await fld.isVisible().catch(() => false))) continue;
    if (await fld.locator('.o_av_cdd').count()) { await fld.locator('.o_av_cdd_trigger').click(); await p.waitForTimeout(1200); console.log(f, 'OPTIONS:', (await fld.locator('.o_av_cdd_list li').allInnerTexts()).map((t) => t.trim()).slice(0, 12).join(' | ')); await fld.locator('.o_av_cdd_trigger').click(); }
    else { await fld.locator('input').first().click(); await p.waitForTimeout(1200); console.log(f, 'OPTIONS:', (await p.locator('.o-autocomplete--dropdown-item').allInnerTexts()).map((t) => t.trim()).slice(0, 12).join(' | ')); await p.keyboard.press('Escape'); }
  }
  await a.discard().catch(() => {});
  await b.close();
})();
