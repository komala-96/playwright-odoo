const { test, expect } = require('../../fixtures');
test('probe SO 150', async ({ page, salesPage }) => {
  test.setTimeout(1800_000);
  const t = Date.now(); const lap = (m) => console.log(`LAP ${((Date.now() - t) / 1000).toFixed(1)}s ${m}`);
  await salesPage.openOrders();
  await salesPage.clickNew();
  const prods = await page.evaluate(async () => {
    const r = await fetch('/web/dataset/call_kw', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ jsonrpc: '2.0', method: 'call', params: { model: 'product.product', method: 'search_read', args: [[['type', '=', 'consu'], ['sale_ok', '=', true], ['uom_id', '=', 191], ['default_code', '!=', false]]], kwargs: { fields: ['default_code', 'name'], limit: 150, order: 'id' } } }) });
    return (await r.json()).result;
  });
  console.log('LAP got', prods.length);
  await salesPage.fill({ partner_id: 'CUST-QA-002-54386' });
  await salesPage.fill({ sell_all_item: true });
  await salesPage.waitReady(); lap('header');
  const f = salesPage.field('cus_product_assoc_ids');
  await f.locator('input').first().click();
  await page.locator('.o-autocomplete--dropdown-item').filter({ hasText: /Search More/i }).first().click();
  const dlg = page.locator('.modal:visible').last();
  await dlg.locator('.o_data_row').first().waitFor();
  console.log('LAP cols', await dlg.locator('thead th').allInnerTexts());
  console.log('LAP row0', await dlg.locator('.o_data_row').first().innerText());
  await dlg.locator('.o_pager_value').click();
  await dlg.locator('input.o_pager_value, .o_pager_value input').fill('1-1000');
  await dlg.locator('input.o_pager_value, .o_pager_value input').press('Enter');
  await expect.poll(() => dlg.locator('.o_data_row').count(), { timeout: 60_000 }).toBeGreaterThan(700); lap('all rows');
  const codes = prods.map((p) => p.default_code);
  const n = await dlg.locator('.o_data_row').evaluateAll((rows, codes) => {
    let k = 0; const want = new Set(codes);
    for (const r of rows) {
      const cells = [...r.querySelectorAll('td.o_data_cell')].map((c) => c.innerText.trim());
      if (cells.some((c) => want.has(c))) { r.querySelector('.o_list_record_selector input').click(); k++; }
    }
    return k;
  }, codes);
  console.log('LAP checked', n);
  await dlg.locator('.modal-footer button').filter({ hasText: /^\s*Select\s*$/ }).click();
  await dlg.waitFor({ state: 'hidden' }); lap('selected');
  console.log('LAP tags', await f.locator('.o_tag').count());
  await salesPage.field('add_button').locator('button').click();
  await salesPage.waitReady(600_000); lap('added');
  await salesPage.expectNoError();
  const rows = salesPage.field('order_line').locator('.o_data_row');
  console.log('LAP lines', await rows.count(), await salesPage.field('order_line').locator('.o_pager_value, .o_pager_limit').allInnerTexts());
  console.log('LAP first line', await rows.first().locator('td[name]').evaluateAll((es) => es.map((e) => `${e.getAttribute('name')}=${e.innerText.trim()}`).join(' | ')));
  await salesPage.save({ timeout: 600_000 }); lap('saved ' + page.url());
  console.log('LAP buttons', await page.locator('.o_statusbar_buttons button').evaluateAll((es) => es.filter((e) => e.offsetParent).map((e) => `${e.getAttribute('name')}:${e.innerText.trim()}`).join(', ')));
  console.log('LAP total', await salesPage.read('amount_total'));
});
