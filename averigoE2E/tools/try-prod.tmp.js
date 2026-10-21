// Lists every visible field per tab on a NEW product form (type Product), with widget, editability, value, required, and options.
const { chromium } = require('@playwright/test');
const env = require('../config/env');
const { InventoryPage } = require('../pages/InventoryPage');
(async () => {
  const b = await chromium.launch();
  const c = await b.newContext({ storageState: env.AUTH_FILE, baseURL: env.BASE_URL, viewport: { width: 1600, height: 1000 } });
  const p = await c.newPage();
  await p.addLocatorHandler(p.locator('.modal.o_technical_modal').filter({ hasText: 'Open Customer Activities' }), (m) => m.locator('.btn-close').first().click({ timeout: 5000 }).catch(() => m.page().keyboard.press('Escape')));
  const i = new InventoryPage(p);
  await i.openProductMaster(); await i.clickNew();
  await i.fill({ product_type: process.argv[2] || 'Product' });
  await p.waitForTimeout(1500);
  const dump = async (label) => {
    const rows = await p.evaluate(() => {
      const root = document.querySelector('.o_action_manager .o_form_view');
      return [...root.querySelectorAll('.o_field_widget[name]')].filter((e) => e.offsetParent && !e.closest('.o_data_row, .o_list_renderer')).map((e) => {
        const name = e.getAttribute('name');
        const cls = (e.className.match(/o_field_\w+/g) || []).filter((x) => x !== 'o_field_widget').join(',');
        const ro = e.classList.contains('o_readonly_modifier');
        const req = e.classList.contains('o_required_modifier');
        const id = e.querySelector('input,select,textarea')?.id;
        const lbl = (id && root.querySelector(`label[for="${id}"]`)?.innerText.trim()) || '';
        const sel = e.querySelector('select');
        const val = sel ? sel.options[sel.selectedIndex]?.text : (e.querySelector('input:not([type=checkbox]),textarea')?.value ?? (e.querySelector('input[type=checkbox]') ? String(e.querySelector('input[type=checkbox]').checked) : e.innerText.trim().slice(0, 40)));
        const opts = sel ? [...sel.options].map((o) => o.text.trim()).filter(Boolean).join('/') : '';
        return `${name} [${cls}]${req ? '*' : ''}${ro ? ' RO' : ''} "${lbl}" = ${JSON.stringify(val)}${opts ? ' {' + opts + '}' : ''}`;
      });
    });
    console.log(`--- ${label}\n  ` + rows.join('\n  '));
  };
  await dump('header + default tab');
  const tabs = (await p.locator('.o_form_view .o_notebook .nav-link').allInnerTexts()).map((t) => t.trim());
  console.log('TABS:', tabs.join(' | '));
  for (const t of tabs) {
    await i.openTab(t); await p.waitForTimeout(800);
    const pane = await p.evaluate(() => {
      const pane = document.querySelector('.o_form_view .o_notebook .tab-pane.active');
      return [...pane.querySelectorAll('.o_field_widget[name]')].filter((e) => e.offsetParent && !e.closest('.o_data_row')).map((e) => {
        const cls = (e.className.match(/o_field_\w+/g) || []).filter((x) => x !== 'o_field_widget').join(',');
        const id = e.querySelector('input,select,textarea')?.id;
        const lbl = (id && document.querySelector(`label[for="${id}"]`)?.innerText.trim()) || '';
        const sel = e.querySelector('select');
        const val = sel ? sel.options[sel.selectedIndex]?.text : (e.querySelector('input:not([type=checkbox]),textarea')?.value ?? (e.querySelector('input[type=checkbox]') ? String(e.querySelector('input[type=checkbox]').checked) : ''));
        const opts = sel ? [...sel.options].map((o) => o.text.trim()).filter(Boolean).join('/') : '';
        const cols = e.classList.contains('o_field_one2many') || e.classList.contains('o_field_x2many') ? ' cols:' + [...e.querySelectorAll('th[data-name]')].map((th) => th.dataset.name).join(',') : '';
        return `${e.getAttribute('name')} [${cls}]${e.classList.contains('o_required_modifier') ? '*' : ''}${e.classList.contains('o_readonly_modifier') ? ' RO' : ''} "${lbl}" = ${JSON.stringify(val)}${opts ? ' {' + opts + '}' : ''}${cols}`;
      });
    });
    console.log(`--- TAB ${t}\n  ` + pane.join('\n  '));
  }
  console.log('BUTTONS:', (await p.locator('.o_form_view button').filter({ visible: true }).allInnerTexts()).map((x) => x.trim()).filter(Boolean).join(' | '));
  await b.close();
})();
