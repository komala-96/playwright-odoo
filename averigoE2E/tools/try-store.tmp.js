const { chromium } = require('@playwright/test');
const env = require('../config/env');
const d = require('../data/testData');
const { MicroMarketPage } = require('../pages/OtherModulesPage');
(async () => {
  const b = await chromium.launch();
  const c = await b.newContext({ storageState: env.AUTH_FILE, baseURL: env.BASE_URL, viewport: { width: 1600, height: 1000 } });
  const p = await c.newPage();
  await p.addLocatorHandler(p.locator('.modal.o_technical_modal').filter({ hasText: 'Open Customer Activities' }), (m) => m.locator('.btn-close').first().click({ timeout: 5000 }).catch(() => m.page().keyboard.press('Escape')));
  const o = new MicroMarketPage(p);
  await o.open('Store Orders'); await o.clickNew();
  await o.fill({ warehouse_id: d.warehouse.name });
  await o.fill({ micro_market_id: d.microMarket.name }); await p.waitForTimeout(2500);
  console.log('FIELDS', await p.evaluate(() => [...document.querySelectorAll('.o_form_view .o_field_widget[name]')].filter((e) => e.offsetParent && !e.closest('.o_data_row')).map((e) => e.getAttribute('name')).join(' ')));
  const lines = p.locator('.o_form_view .o_data_row');
  console.log('ROWS', (await lines.allInnerTexts()).map((t) => t.replace(/\s+/g, ' ').slice(0, 120)));
  for (const [code, q] of [['PROD-QA-001', 4], ['PROD-QA-002', 4], ['PROD-QA-003', 0], ['PROD-QA-004', 0]]) {
    const idx = (await lines.allInnerTexts()).findIndex((t) => t.includes(code));
    const r = lines.nth(idx);
    await r.locator('td[name=product_uom_qty]').click();
    await r.locator('td[name=product_uom_qty] input').fill(String(q)); await r.locator('td[name=product_uom_qty] input').press('Tab'); await o.waitReady();
  }
  console.log('COLS', await p.locator('.o_form_view th[data-name]').evaluateAll((t) => t.map((x) => x.dataset.name).join(' ')));
  await o.save();
  console.log('SAVED', p.url(), 'STATUS', await o.status());
  console.log('BUTTONS', await p.evaluate(() => [...document.querySelectorAll('.o_form_view button')].filter((b) => b.offsetParent && b.innerText.trim()).map((b) => b.innerText.trim().replace(/\s+/g, ' ') + (b.name ? `{${b.name}}` : '')).join(' | ')));
  for (let i = 0; i < 4; i++) {
    const btns = await p.evaluate(() => [...document.querySelectorAll('.o_form_view .o_statusbar_buttons button')].filter((b) => b.offsetParent && b.innerText.trim()).map((b) => ({ t: b.innerText.trim(), n: b.name })));
    const next = btns.find((b) => b.n && b.n !== 'action_cancel');
    console.log('STATUS', await o.status(), 'BTNS', JSON.stringify(btns));
    if (!next) break;
    await p.locator(`.o_form_view button[name="${next.n}"]`).click(); await o.waitReady(); await p.waitForTimeout(2000);
    const m = p.locator('.modal:visible').filter({ hasNotText: 'Open Customer Activities' }).last();
    if (await m.isVisible().catch(() => false)) { console.log('MODAL', (await m.innerText()).replace(/\s+/g, ' ').slice(0, 300)); const ok = m.locator('.modal-footer button').first(); await ok.click().catch(() => {}); await o.waitReady(); }
  }
  console.log('FINAL', await o.status(), 'ROWS', (await p.locator('.o_form_view .o_data_row').allInnerTexts()).map((t) => t.replace(/\s+/g, ' ').slice(0, 100)));
  await b.close();
})();
