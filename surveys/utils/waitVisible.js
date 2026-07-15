/**
 * Explicit autowait: Odoo's UI frequently renders a locator only after an
 * async backend call resolves, which can outlast the moment Playwright's
 * own actionability check begins. Waiting for "visible" up front before
 * every interaction gives slow-loading locators extra headroom beyond
 * Playwright's built-in auto-wait.
 */
async function waitVisible(locator, timeout = 30 * 1000) {
  await locator.waitFor({ state: 'visible', timeout });
  return locator;
}

module.exports = { waitVisible };
