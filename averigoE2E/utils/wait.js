/**
 * True if the locator becomes visible within `timeout` ms, false otherwise.
 * (Playwright's locator.isVisible() ignores its timeout option and returns immediately.)
 */
async function appears(locator, timeout = 5_000) {
  return locator.first().waitFor({ state: 'visible', timeout }).then(() => true, () => false);
}

module.exports = { appears };
