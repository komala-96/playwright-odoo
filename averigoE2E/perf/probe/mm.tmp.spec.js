const { test } = require('../../fixtures');
const state = require('../../utils/state');
test('probe market product picker', async ({ page, microMarketPage: mm }) => {
  test.setTimeout(600_000);
  await mm.goto(state.get('perf.marketUrl'));
  await mm.openTab('Products');
  const f = mm.field('single_product_ids');
  console.log('P classes', await f.getAttribute('class'));
  await f.locator('.o_av_cdd_trigger').click();
  const panel = f.locator('.o_av_cdd_panel');
  await panel.waitFor();
  await page.waitForTimeout(3000);
  console.log('P lis', await panel.locator('.o_av_cdd_list li').count());
  console.log('P html', (await panel.evaluate((e) => e.outerHTML)).slice(0, 2500));
});
