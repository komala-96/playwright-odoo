const { chromium } = require('@playwright/test');
const env = require('../config/env');
const { PurchasePage } = require('../pages/PurchasePage');
(async () => {
  const b = await chromium.launch();
  const c = await b.newContext({ storageState: env.AUTH_FILE, baseURL: env.BASE_URL, viewport: { width: 1600, height: 1000 } });
  const p = await c.newPage();
  await p.addLocatorHandler(p.locator('.modal.o_technical_modal').filter({ hasText: 'Open Customer Activities' }), (m) => m.locator('.btn-close').first().click({ timeout: 5000 }).catch(() => m.page().keyboard.press('Escape')));
  const pp = new PurchasePage(p);
  await pp.open('Purchase Order'); await pp.search('P00784'); await pp.rows('P00784').first().locator('td.o_data_cell').filter({ hasText: 'P00784' }).first().click(); await p.locator('.o_form_view').first().waitFor();
  await p.locator('.o_form_view button[name="action_view_picking"]').filter({ hasText: /Receive Products/ }).click();
  await pp.waitReady(); await p.waitForTimeout(1500);
  const dump = () => p.evaluate(() => {
    const root = document.querySelector('.o_action_manager .o_form_view');
    return [...root.querySelectorAll('.o_field_widget[name]')].filter((e) => e.offsetParent && !e.closest('.o_data_row')).map((e) => {
      const id = e.querySelector('input,select,textarea')?.id;
      const l = (id && root.querySelector(`label[for="${id}"]`)?.innerText.trim()) || '';
      const sel = e.querySelector('select');
      const val = sel ? sel.options[sel.selectedIndex]?.text : (e.querySelector('input,textarea')?.value ?? e.innerText.trim().slice(0, 30));
      const cls = (e.className.match(/o_field_\w+/g) || []).filter((x) => x !== 'o_field_widget').join(',');
      const cols = e.querySelector('table') ? ' cols:' + [...e.querySelectorAll('th[data-name]')].map((t) => t.dataset.name).join(',') : '';
      return `${e.getAttribute('name')} [${cls}]${e.classList.contains('o_required_modifier') ? '*' : ''}${e.classList.contains('o_readonly_modifier') ? ' RO' : ''} "${l}" = ${JSON.stringify(val)}${cols}`;
    });
  });
  console.log('URL', p.url());
  console.log('--- RECEIPT\n  ' + (await dump()).join('\n  '));
  const tabs = (await p.locator('.o_form_view .o_notebook .nav-link').allInnerTexts()).map((t) => t.trim()).filter(Boolean);
  console.log('TABS:', tabs.join(' | '));
  for (const t of tabs.slice(1)) { await pp.openTab(t); console.log(`--- TAB ${t}\n  ` + (await dump()).join('\n  ')); }
  console.log('BUTTONS:', (await p.locator('.o_form_view button').filter({ visible: true }).evaluateAll((bs) => bs.map((x) => `${x.innerText.trim()}{${x.getAttribute('name') || ''}}`).filter((t) => !t.startsWith('{')))).join(' | '));
  await pp.discard().catch(() => {});
  await b.close();
})();
