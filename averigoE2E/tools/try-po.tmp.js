const { chromium } = require('@playwright/test');
const env = require('../config/env');
const state = require('../utils/state');
const { CustomerCarePage } = require('../pages/CustomerCarePage');
(async () => {
  const b = await chromium.launch();
  const c = await b.newContext({ storageState: env.AUTH_FILE, baseURL: env.BASE_URL, viewport: { width: 1600, height: 1000 } });
  const p = await c.newPage();
  await p.addLocatorHandler(p.locator('.modal.o_technical_modal').filter({ hasText: 'Open Customer Activities' }), (m) => m.locator('.btn-close').first().click({ timeout: 5000 }).catch(() => m.page().keyboard.press('Escape')));
  const i = new CustomerCarePage(p);
  await i.goto(state.get('customer1Url'));
  const info = await p.evaluate(() => {
    const el = document.querySelector('.o_action_manager .o_form_view [name="po_no"]');
    if (!el) return 'po_no not in DOM';
    return { cls: el.className, visible: !!el.offsetParent, html: el.outerHTML.slice(0, 300), parent: el.parentElement?.outerHTML.slice(0, 400) };
  });
  console.log('PO_NO:', JSON.stringify(info, null, 1));
  // untick/retick PO# to see if a field or dialog appears
  const box = i.field('po_check').locator('input[type=checkbox]').first();
  await box.click({ force: true }); await p.waitForTimeout(1500);
  await box.click({ force: true }); await p.waitForTimeout(2000);
  console.log('after retick po_no visible:', await i.field('po_no').isVisible().catch(() => false));
  console.log('DIALOGS:', (await p.locator('.modal:visible').filter({ hasNotText: 'Open Customer Activities' }).allInnerTexts()).map((t) => t.slice(0, 300).replace(/\n+/g, ' | ')).join(' || '));
  const near = await i.field('po_check').evaluate((e) => e.closest('.row, .o_group, div.col, .o_wrap_field')?.innerText.slice(0, 200));
  console.log('NEAR:', near);
  await p.screenshot({ path: 'tools/last.png' });
  await i.discard().catch(() => {});
  await b.close();
})();
