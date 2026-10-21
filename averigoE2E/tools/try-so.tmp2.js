// Dump all visible fields on a new Sales Order (customer = Customer 1), header + every tab, with line columns.
const { chromium } = require('@playwright/test');
const env = require('../config/env');
const d = require('../data/testData');
const { SalesPage } = require('../pages/SalesPage');
(async () => {
  const b = await chromium.launch();
  const c = await b.newContext({ storageState: env.AUTH_FILE, baseURL: env.BASE_URL, viewport: { width: 1600, height: 1000 } });
  const p = await c.newPage();
  await p.addLocatorHandler(p.locator('.modal.o_technical_modal').filter({ hasText: 'Open Customer Activities' }), (m) => m.locator('.btn-close').first().click({ timeout: 5000 }).catch(() => m.page().keyboard.press('Escape')));
  const s = new SalesPage(p);
  await s.openOrders(); await s.clickNew();
  await s.fill({ partner_id: d.customer1.name });
  await p.waitForTimeout(2000);
  const dump = () => p.evaluate(() => {
    const root = document.querySelector('.o_action_manager .o_form_view');
    return [...root.querySelectorAll('.o_field_widget[name]')].filter((e) => e.offsetParent && !e.closest('.o_data_row')).map((e) => {
      const id = e.querySelector('input,select,textarea')?.id;
      const lbl = (id && root.querySelector(`label[for="${id}"]`)?.innerText.trim()) || '';
      const sel = e.querySelector('select');
      const cb = e.querySelector('input[type=checkbox]');
      const val = sel ? sel.options[sel.selectedIndex]?.text : cb ? String(cb.checked) : (e.querySelector('input,textarea')?.value ?? e.innerText.trim().slice(0, 30));
      const opts = sel ? ' {' + [...sel.options].map((o) => o.text.trim()).filter(Boolean).join('/') + '}' : '';
      const cols = e.querySelector('table') ? ' cols:' + [...e.querySelectorAll('th[data-name]')].map((t) => t.dataset.name).join(',') : '';
      const cls = (e.className.match(/o_field_\w+/g) || []).filter((x) => x !== 'o_field_widget').join(',');
      return `${e.getAttribute('name')} [${cls}]${e.classList.contains('o_required_modifier') ? '*' : ''}${e.classList.contains('o_readonly_modifier') ? ' RO' : ''} "${lbl}" = ${JSON.stringify(val)}${opts}${cols}`;
    });
  });
  console.log('--- HEADER/DEFAULT\n  ' + (await dump()).join('\n  '));
  const tabs = (await p.locator('.o_form_view .o_notebook .nav-link').allInnerTexts()).map((t) => t.trim()).filter(Boolean);
  console.log('TABS:', tabs.join(' | '));
  for (const t of tabs.slice(1)) {
    await s.openTab(t);
    const rows = await p.evaluate(() => [...document.querySelectorAll('.o_form_view .o_notebook .tab-pane.active .o_field_widget[name]')].filter((e) => e.offsetParent && !e.closest('.o_data_row')).map((e) => {
      const id = e.querySelector('input,select,textarea')?.id;
      const lbl = (id && document.querySelector(`label[for="${id}"]`)?.innerText.trim()) || '';
      const sel = e.querySelector('select');
      const cls = (e.className.match(/o_field_\w+/g) || []).filter((x) => x !== 'o_field_widget').join(',');
      return `${e.getAttribute('name')} [${cls}]${e.classList.contains('o_readonly_modifier') ? ' RO' : ''} "${lbl}"${sel ? ' {' + [...sel.options].map((o) => o.text.trim()).filter(Boolean).join('/') + '}' : ''}`;
    }));
    console.log(`--- TAB ${t}\n  ` + rows.join('\n  '));
  }
  console.log('BUTTONS:', (await p.locator('.o_form_view button').filter({ visible: true }).allInnerTexts()).map((x) => x.trim()).filter(Boolean).join(' | '));
  await s.discard().catch(() => {});
  await b.close();
})();
