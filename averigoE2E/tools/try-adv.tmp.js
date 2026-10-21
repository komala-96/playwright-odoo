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
  await o.openAR('Advance'); await o.clickNew();
  await o.fill({ partner_id: d.customer1.name }); await p.waitForTimeout(1500);
  for (const f of ['customer_no', 'customer_debit']) console.log(f, '=', await o.read(f).catch((e) => 'ERR ' + e.message.slice(0, 60)));
  console.log('LABELS', await p.evaluate(() => [...document.querySelectorAll('.o_form_view .o_wrap_label, .o_form_view label')].map((l) => l.innerText.trim()).filter(Boolean).join(' | ')));
  await o.discard();
  await o.openAR('Advance');
  console.log('LIST COLS', await p.locator('.o_list_view th[data-name]').evaluateAll((t) => t.map((x) => x.dataset.name + ':' + x.innerText.trim()).join(' | ')));
  await b.close();
})();
