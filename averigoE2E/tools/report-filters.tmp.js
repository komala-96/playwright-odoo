// node tools/report-filters.tmp.js "Category|Tile" ...  -> prints labels + select options + columns per report
const { chromium } = require('@playwright/test');
const env = require('../config/env');
const { ReportsPage } = require('../pages/ReportsPage');
(async () => {
  const b = await chromium.launch();
  const c = await b.newContext({ storageState: env.AUTH_FILE, baseURL: env.BASE_URL, viewport: { width: 1600, height: 1000 } });
  const p = await c.newPage();
  await p.addLocatorHandler(p.locator('.modal.o_technical_modal').filter({ hasText: 'Open Customer Activities' }), (m) => m.locator('.btn-close').first().click({ timeout: 5000 }).catch(() => m.page().keyboard.press('Escape')));
  const r = new ReportsPage(p);
  for (const spec of process.argv.slice(2)) {
    const [cat, tile] = spec.split('|');
    try {
      await r.openReport(cat, tile);
      const info = await p.evaluate(() => {
        const root = document.querySelector('.o_action_manager');
        const labels = [...root.querySelectorAll('label.form-label')].map((l) => {
          const box = l.parentElement; const sel = box.querySelector('select');
          const kind = sel ? `select[${[...sel.options].map((o) => o.text.trim()).filter(Boolean).join('/')}]` : box.querySelector('input.o_datetime_input, input[placeholder="MM/DD/YYYY"]') ? 'date' : box.querySelector('.mm-chipbox, .filter-dropdown-container') ? 'chips' : 'input';
          return `${l.innerText.trim().replace(/\s*\*$/, '*')}=${kind}`;
        });
        const cols = [...root.querySelectorAll('table thead th')].map((t) => t.innerText.trim()).filter(Boolean);
        return { labels, cols };
      });
      console.log(`## ${tile}\n  filters: ${info.labels.join(' | ')}\n  columns: ${info.cols.join(' | ')}`);
    } catch (e) { console.log(`## ${tile}: ERROR ${e.message.split('\n')[0]}`); }
  }
  await b.close();
})();
