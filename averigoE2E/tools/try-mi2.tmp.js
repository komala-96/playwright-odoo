const { chromium } = require('@playwright/test');
const env = require('../config/env');
const d = require('../data/testData');
const state = require('../utils/state');
const { InventoryPage } = require('../pages/InventoryPage');
const { AccountingPage } = require('../pages/AccountingPage');
(async () => {
  const b = await chromium.launch();
  const c = await b.newContext({ storageState: env.AUTH_FILE, baseURL: env.BASE_URL, viewport: { width: 1600, height: 1000 } });
  const p = await c.newPage();
  await p.addLocatorHandler(p.locator('.modal.o_technical_modal').filter({ hasText: 'Open Customer Activities' }), (m) => m.locator('.btn-close').first().click({ timeout: 5000 }).catch(() => m.page().keyboard.press('Escape')));
  const i = new InventoryPage(p);
  await i.open(); await i.openMenu('Material Issue'); await i.clickNew();
  await i.fill({ vendor_id: d.vendor.name });
  await i.fill({ issue_type: 'Purchase Return' });
  await i.fill({ bill_id: state.get('p3Bill').billName });
  await p.waitForTimeout(2000);
  const dump = () => p.evaluate(() => {
    const root = document.querySelector('.o_action_manager .o_form_view');
    return [...root.querySelectorAll('.o_field_widget[name]')].filter((e) => e.offsetParent && !e.closest('.o_data_row')).map((e) => {
      const id = e.querySelector('input,select,textarea')?.id;
      const l = (id && root.querySelector(`label[for="${id}"]`)?.innerText.trim()) || '';
      const sel = e.querySelector('select');
      const val = sel ? sel.options[sel.selectedIndex]?.text : (e.querySelector('input,textarea')?.value ?? e.innerText.trim().slice(0, 30));
      const opts = sel ? ' {' + [...sel.options].map((o) => o.text.trim()).filter(Boolean).slice(0, 8).join('/') + '}' : '';
      const cls = (e.className.match(/o_field_\w+/g) || []).filter((x) => x !== 'o_field_widget').join(',');
      const cols = e.querySelector('table') ? ' cols:' + [...e.querySelectorAll('th[data-name]')].map((t) => t.dataset.name).join(',') : '';
      return `${e.getAttribute('name')} [${cls}]${e.classList.contains('o_required_modifier') ? '*' : ''}${e.classList.contains('o_readonly_modifier') ? ' RO' : ''} "${l}" = ${JSON.stringify(val)}${opts}${cols}`;
    });
  });
  console.log('--- MATERIAL ISSUE\n  ' + (await dump()).join('\n  '));
  const tabs = (await p.locator('.o_form_view .o_notebook .nav-link').allInnerTexts()).map((t) => t.trim()).filter(Boolean);
  console.log('TABS:', tabs.join(' | '));
  for (const t of tabs.slice(1)) { await i.openTab(t); console.log(`--- TAB ${t}\n  ` + (await dump()).join('\n  ')); }
  await i.discard().catch(() => {});
  // AP credit memo print options (posted DM84)
  const a = new AccountingPage(p);
  await a.openAP('Credit Memo'); await a.search('DM84');
  await a.rows('DM84').first().locator('td.o_data_cell').filter({ hasText: 'DM84' }).first().click();
  await p.locator('.o_form_view').first().waitFor(); await a.waitReady();
  await p.locator('.o_control_panel button, .o_cp_action_menus button').filter({ hasText: /^\s*Action\s*$/ }).first().click(); await p.waitForTimeout(800);
  const pr = p.locator('.o-dropdown--menu .dropdown-item').filter({ hasText: /^\s*Print\s*$/ }).first();
  if (await pr.isVisible().catch(() => false)) { await pr.hover(); await p.waitForTimeout(500); }
  console.log('MEMO ACTION/PRINT:', (await p.locator('.o-dropdown--menu .dropdown-item').filter({ visible: true }).allInnerTexts()).map((t) => t.trim()).join(' | '));
  console.log('MEMO MONETARY:', await p.evaluate(() => [...document.querySelectorAll('.o_action_manager .o_form_view .o_field_monetary[name], .o_action_manager .o_form_view .o_field_float[name]')].filter((e) => e.offsetParent && !e.closest('.o_data_row')).map((e) => e.getAttribute('name') + '=' + e.innerText.trim()).join(' | ')));
  await b.close();
})();
