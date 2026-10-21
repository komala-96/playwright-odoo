// node tools/try-run-report.tmp.js "<Category>" "<Tile>" '<filters json>' "<text to look for>"
const { chromium } = require('@playwright/test');
const env = require('../config/env');
const { ReportsPage } = require('../pages/ReportsPage');
(async () => {
  const [cat, tile, filters, needle] = process.argv.slice(2);
  const b = await chromium.launch();
  const c = await b.newContext({ storageState: env.AUTH_FILE, baseURL: env.BASE_URL, viewport: { width: 1600, height: 1000 } });
  const p = await c.newPage();
  await p.addLocatorHandler(p.locator('.modal.o_technical_modal').filter({ hasText: 'Open Customer Activities' }), (m) => m.locator('.btn-close').first().click({ timeout: 5000 }).catch(() => m.page().keyboard.press('Escape')));
  const r = new ReportsPage(p);
  r.setFiltersQuiet = true;
  await r.openReport(cat, tile);
  for (const [k, v] of Object.entries(JSON.parse(filters || '{}'))) console.log(k, 'set?', await r.setFilter(k, v));
  await r.generate();
  const t = await r.output();
  console.log('TOTAL', await r.totalRecords());
  console.log('MATCH', t.split('\n').filter((l) => needle && l.includes(needle)).join('\n') || 'none');
  console.log('SAMPLE', t.split('\n').slice(0, 2).join('\n'));
  await p.screenshot({ path: 'tools/last.png', fullPage: true });
  await b.close();
})();
