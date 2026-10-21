const { chromium } = require('@playwright/test');
const env = require('../config/env');
const d = require('../data/testData');
const { AccountingPage } = require('../pages/AccountingPage');
(async () => {
  const b = await chromium.launch();
  const c = await b.newContext({ storageState: env.AUTH_FILE, baseURL: env.BASE_URL, viewport: { width: 1600, height: 1000 } });
  const p = await c.newPage();
  await p.addLocatorHandler(p.locator('.modal.o_technical_modal').filter({ hasText: 'Open Customer Activities' }), (m) => m.locator('.btn-close').first().click({ timeout: 5000 }).catch(() => m.page().keyboard.press('Escape')));
  p.on('request', (rq) => { if (rq.url().includes('name_search') || rq.url().includes('web_name_search')) console.log('REQ', JSON.stringify(rq.postDataJSON()?.params).slice(0, 600)); });
  const o = new AccountingPage(p);
  await o.openAP('Credit Memo'); await o.clickNew();
  await o.fill({ debit_memo_type: 'Purchase Discount' });
  await o.field('partner_id').locator('input').fill('VEND-QA'); await p.waitForTimeout(4000);
  console.log('OPTIONS', await p.locator('.o-autocomplete--dropdown-item').allInnerTexts());
  await b.close();
})();
