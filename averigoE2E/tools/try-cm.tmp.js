const { chromium } = require('@playwright/test');
const env = require('../config/env');
const d = require('../data/testData');
const { AccountingPage } = require('../pages/AccountingPage');
(async () => {
  const b = await chromium.launch();
  const c = await b.newContext({ storageState: env.AUTH_FILE, baseURL: env.BASE_URL, viewport: { width: 1600, height: 1000 } });
  const p = await c.newPage();
  await p.addLocatorHandler(p.locator('.modal.o_technical_modal').filter({ hasText: 'Open Customer Activities' }), (m) => m.locator('.btn-close').first().click({ timeout: 5000 }).catch(() => m.page().keyboard.press('Escape')));
  const o = new AccountingPage(p);
  await o.openAR('Credit Memo'); await o.clickNew();
  await o.fill({ credit_memo_type: 'Others' }); await o.fill({ partner_id: d.customer2.name }); await o.fill({ amount: 5 });
  const l = o.field('debit_distribution_lines');
  console.log('COLS', await l.locator('th[data-name]').evaluateAll((t) => t.map((x) => x.dataset.name + ':' + x.innerText.trim()).join(' | ')));
  console.log('ROWS', await l.locator('.o_data_row').allInnerTexts());
  await o.discard();
  await b.close();
})();
