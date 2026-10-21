// Lists every visible field on a new Direct Invoice (customer = Customer 1) + line columns + tabs + buttons.
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
  await a.openAR('Invoices'); await a.clickNew();
  await a.fill({ partner_id: d.customer1.name });
  await p.waitForTimeout(2000);
  const dump = () => p.evaluate(() => {
    const root = document.querySelector('.o_action_manager .o_form_view');
    return [...root.querySelectorAll('.o_field_widget[name]')].filter((e) => e.offsetParent && !e.closest('.o_data_row')).map((e) => {
      const id = e.querySelector('input,select,textarea')?.id;
      const l = (id && root.querySelector(`label[for="${id}"]`)?.innerText.trim()) || '';
      const sel = e.querySelector('select');
      const cb = e.querySelector('input[type=checkbox]');
      const val = sel ? sel.options[sel.selectedIndex]?.text : cb ? String(cb.checked) : (e.querySelector('input,textarea')?.value ?? e.innerText.trim().slice(0, 30));
      const opts = sel ? ' {' + [...sel.options].map((o) => o.text.trim()).filter(Boolean).slice(0, 8).join('/') + '}' : '';
      const cls = (e.className.match(/o_field_\w+/g) || []).filter((x) => x !== 'o_field_widget').join(',');
      const cols = e.querySelector('table') ? ' cols:' + [...e.querySelectorAll('th[data-name]')].map((t) => t.dataset.name).join(',') : '';
      return `${e.getAttribute('name')} [${cls}]${e.classList.contains('o_required_modifier') ? '*' : ''}${e.classList.contains('o_readonly_modifier') ? ' RO' : ''} "${l}" = ${JSON.stringify(val)}${opts}${cols}`;
    });
  });
  console.log('--- DIRECT INVOICE\n  ' + (await dump()).join('\n  '));
  const tabs = (await p.locator('.o_form_view .o_notebook .nav-link').allInnerTexts()).map((t) => t.trim()).filter(Boolean);
  console.log('TABS:', tabs.join(' | '));
  for (const t of tabs.slice(1)) { await a.openTab(t); console.log(`--- TAB ${t}\n  ` + (await dump()).filter((r) => !r.startsWith('partner_id')).join('\n  ')); }
  console.log('BUTTONS:', (await p.locator('.o_form_view button').filter({ visible: true }).allInnerTexts()).map((x) => x.trim()).filter(Boolean).join(' | '));
  await a.discard().catch(() => {});
  await b.close();
})();
