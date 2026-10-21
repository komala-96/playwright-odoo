const { chromium } = require('@playwright/test');
const env = require('../config/env');
const d = require('../data/testData');
const { InventoryPage } = require('../pages/InventoryPage');
(async () => {
  const b = await chromium.launch();
  const c = await b.newContext({ storageState: env.AUTH_FILE, baseURL: env.BASE_URL, viewport: { width: 1600, height: 1000 } });
  const p = await c.newPage();
  await p.addLocatorHandler(p.locator('.modal.o_technical_modal').filter({ hasText: 'Open Customer Activities' }), (m) => m.locator('.btn-close').first().click({ timeout: 5000 }).catch(() => m.page().keyboard.press('Escape')));
  const i = new InventoryPage(p);
  await i.open(); await i.openMenu('Material Receipt', 'Direct Receipt'); await i.clickNew();
  await i.fill({ partner_id: d.vendor.name });
  await i.fill({ product_ids: [d.products.p1.name] }); await i.click('add_products'); await p.waitForTimeout(2000);
  const dump = () => p.evaluate(() => {
    const root = document.querySelector('.o_action_manager .o_form_view');
    return [...root.querySelectorAll('.o_field_widget[name]')].filter((e) => e.offsetParent && !e.closest('.o_data_row')).map((e) => {
      const id = e.querySelector('input,select,textarea')?.id;
      const l = (id && root.querySelector(`label[for="${id}"]`)?.innerText.trim()) || '';
      const sel = e.querySelector('select'); const cb = e.querySelector('input[type=checkbox]');
      const val = sel ? sel.options[sel.selectedIndex]?.text : cb ? String(cb.checked) : (e.querySelector('input,textarea')?.value ?? e.innerText.trim().slice(0, 30));
      const cls = (e.className.match(/o_field_\w+/g) || []).filter((x) => x !== 'o_field_widget').join(',');
      const cols = e.querySelector('table') ? ' cols:' + [...e.querySelectorAll('th[data-name]')].map((t) => t.dataset.name).join(',') : '';
      return `${e.getAttribute('name')} [${cls}]${e.classList.contains('o_required_modifier') ? '*' : ''}${e.classList.contains('o_readonly_modifier') ? ' RO' : ''} "${l}" = ${JSON.stringify(val)}${cols}`;
    });
  });
  console.log('--- DIRECT RECEIPT\n  ' + (await dump()).join('\n  '));
  const tabs = (await p.locator('.o_form_view .o_notebook .nav-link').allInnerTexts()).map((t) => t.trim()).filter(Boolean);
  console.log('TABS:', tabs.join(' | '));
  for (const t of tabs.slice(1)) { await i.openTab(t); console.log(`--- TAB ${t}\n  ` + (await dump()).filter((r) => /notes?|note/i.test(r) || !/^(state|partner_id|name)\b/.test(r)).slice(-6).join('\n  ')); }
  console.log('BUTTONS:', (await p.locator('.o_form_view button').filter({ visible: true }).evaluateAll((bs) => bs.map((x) => `${x.innerText.trim()}{${x.getAttribute('name') || ''}}`).filter((t) => !t.startsWith('{')))).join(' | '));
  await p.locator('.o_control_panel button, .o_cp_action_menus button').filter({ hasText: /^\s*Action\s*$/ }).first().click(); await p.waitForTimeout(800);
  const pr = p.locator('.o-dropdown--menu .dropdown-item').filter({ hasText: /^\s*Print\s*$/ }).first();
  if (await pr.isVisible().catch(() => false)) { await pr.hover(); await p.waitForTimeout(500); }
  console.log('ACTION/PRINT:', (await p.locator('.o-dropdown--menu .dropdown-item').filter({ visible: true }).allInnerTexts()).map((t) => t.trim()).join(' | '));
  await p.keyboard.press('Escape');
  await i.discard().catch(() => {});
  await b.close();
})();
