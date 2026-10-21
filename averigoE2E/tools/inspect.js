// Dev helper: node tools/inspect.js --app "Inventory" [--menu "Configuration>Product Categories"] [--new] [--url /odoo/...] [--click "Label"]
// Prints top menu, visible fields (technical name, widget, label, required) and buttons of the resulting screen.
const { chromium } = require('@playwright/test');
const env = require('../config/env');
const { OdooPage } = require('../pages/OdooPage');

const arg = (k) => { const i = process.argv.indexOf(`--${k}`); return i > 0 ? process.argv[i + 1] : undefined; };
const flag = (k) => process.argv.includes(`--${k}`);

(async () => {
  const browser = await chromium.launch();
  const ctx = await browser.newContext({ storageState: env.AUTH_FILE, baseURL: env.BASE_URL, viewport: { width: 1600, height: 900 } });
  const page = await ctx.newPage();
  await page.addLocatorHandler(page.locator('.modal.o_technical_modal').filter({ hasText: 'Open Customer Activities' }), (m) => m.locator('.btn-close').first().click({ timeout: 5000 }).catch(() => m.page().keyboard.press('Escape')));
  const o = new OdooPage(page);
  try {
    if (arg('url')) await o.goto(arg('url'));
    if (arg('app')) await o.openApp(arg('app'));
    await page.locator('.o_menu_sections a, .o_menu_sections button').first().waitFor({ timeout: 15000 }).catch(() => {});
    await page.waitForTimeout(1500);
    if (flag('more')) {
      await page.locator('.o_menu_sections_more button, .o_menu_sections button:has(.fa-plus)').first().click();
      await page.waitForTimeout(800);
      console.log('MORE MENU:', (await page.locator('.o-dropdown--menu .dropdown-item, .o-dropdown--menu .dropdown-header, .o-dropdown--menu .o_menu_header_lvl_1').allInnerTexts()).map((t) => t.trim()).join(' | '));
      await page.keyboard.press('Escape');
    }
    if (flag('menus') || !arg('menu')) {
      console.log('TOP MENU:', (await page.locator('.o_menu_sections > *').allInnerTexts()).map((t) => t.replace(/\s+/g, ' ').trim()).join(' | '));
    }
    if (arg('dropdown')) {
      await page.locator('.o_menu_sections button, .o_menu_sections a').filter({ hasText: arg('dropdown') }).first().click();
      await page.waitForTimeout(800);
      console.log('DROPDOWN:', (await page.locator('.o-dropdown--menu .dropdown-item, .o-dropdown--menu .dropdown-header').allInnerTexts()).map((t) => t.trim()).join(' | '));
    }
    if (arg('menu')) await o.openMenu(...arg('menu').split('>'));
    if (flag('new')) await o.clickNew();
    if (arg('set')) for (const kv of arg('set').split(';')) { const [k, v] = kv.split('='); await o.fill({ [k]: v }); await page.waitForTimeout(800); }
    if (arg('tab')) await o.openTab(arg('tab'));
    if (arg('click')) await o.click(arg('click'));
    await page.waitForTimeout(1500);
    console.log('URL:', page.url());
    const dump = await page.evaluate(() => {
      const root = document.querySelector('.modal:not(.o_technical_modal) .o_form_view') || document.querySelector('.o_action_manager');
      const fields = [...root.querySelectorAll('.o_field_widget[name]')].filter((e) => e.offsetParent).map((e) => {
        const id = e.querySelector('input,select,textarea')?.id;
        const lab = (id && document.querySelector(`label[for="${id}"]`)?.textContent.trim()) || '';
        const t = (e.className.match(/o_field_(?!widget)\w+/g) || []).join(',');
        const inList = e.closest('td') ? ' (list cell)' : '';
        return `  ${e.getAttribute('name')} [${t}] ${lab}${e.classList.contains('o_required_modifier') ? ' *' : ''}${inList}`;
      });
      const btns = [...root.querySelectorAll('button')].filter((b) => b.offsetParent && b.innerText.trim()).map((b) => `${b.innerText.trim()}${b.name ? `{${b.name}}` : ''}`);
      const tabs = [...root.querySelectorAll('.o_notebook .nav-link')].map((t) => t.innerText.trim());
      const cols = [...root.querySelectorAll('.o_list_view th[data-name]')].map((t) => `${t.dataset.name}:${t.innerText.trim()}`);
      return { fields: [...new Set(fields)], btns: [...new Set(btns)], tabs, cols };
    });
    console.log('FIELDS:\n' + dump.fields.join('\n'));
    console.log('BUTTONS:', dump.btns.join(' | '));
    if (dump.tabs.length) console.log('TABS:', dump.tabs.join(' | '));
    if (dump.cols.length) console.log('LIST COLUMNS:', dump.cols.join(' | '));
    if (flag('shot')) await page.screenshot({ path: 'tools/last.png' });
  } catch (e) {
    console.log('ERROR', e.message.split('\n')[0]);
    await page.screenshot({ path: 'tools/last.png' });
  } finally {
    await browser.close();
  }
})();
