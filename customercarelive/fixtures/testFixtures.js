const base = require('@playwright/test');
const path = require('path');

// The Java suite pointed ChromeOptions at a fixed Windows path
// (C:/selenium/profiles/averigo) so the browser reuses a signed-in session
// across runs. That path isn't portable, so it's kept as a local, git-ignored
// folder here and can be overridden with CHROME_USER_DATA_DIR.
const USER_DATA_DIR =
  process.env.CHROME_USER_DATA_DIR || path.join(__dirname, '..', '.chrome-profile', 'averigo');

// Java: driver.get("https://ultraserv.averigoqa.com");
const BASE_URL = process.env.BASE_URL || 'https://martiserv.averigo.com';
// Alternate env used by the Java suite: https://martiserv.averigolab.com/

// Odoo's UI frequently renders a locator only after an async backend call
// resolves, which can outlast the moment Playwright's own actionability
// check begins. Wrapping every locator returned by page.locator() so it
// explicitly waits for visible (or attached, for evaluate()) state before
// acting gives slow-loading locators extra headroom beyond Playwright's
// built-in auto-wait, without touching every call site in every page object.
const AUTO_WAIT_TIMEOUT = 30 * 1000;
const ACTION_METHODS = [
  'click', 'dblclick', 'fill', 'press', 'pressSequentially', 'check', 'uncheck',
  'selectOption', 'hover', 'tap', 'selectText', 'dragTo', 'setInputFiles', 'clear',
];
const CHAIN_METHODS = ['locator', 'first', 'last', 'nth', 'filter'];

function withAutoWait(locator) {
  return new Proxy(locator, {
    get(target, prop) {
      const value = target[prop];
      if (typeof value !== 'function') return value;

      if (ACTION_METHODS.includes(prop)) {
        return async (...args) => {
          await target.waitFor({ state: 'visible', timeout: AUTO_WAIT_TIMEOUT });
          return value.apply(target, args);
        };
      }
      if (prop === 'evaluate') {
        // evaluate() is used to bypass Playwright's own actionability check
        // (e.g. dropdown items Playwright won't call "visible"), so only
        // wait for the element to exist rather than requiring visibility.
        return async (...args) => {
          await target.waitFor({ state: 'attached', timeout: AUTO_WAIT_TIMEOUT });
          return value.apply(target, args);
        };
      }
      if (CHAIN_METHODS.includes(prop)) {
        return (...args) => withAutoWait(value.apply(target, args));
      }
      return value.bind(target);
    },
  });
}

function withAutoWaitLocators(page) {
  const origLocator = page.locator.bind(page);
  page.locator = (selector, options) => withAutoWait(origLocator(selector, options));
  return page;
}

const test = base.test.extend({
  context: async ({}, use) => {
    const context = await base.chromium.launchPersistentContext(USER_DATA_DIR, {
      headless: false,
      viewport: null,
      args: ['--start-maximized', '--no-sandbox', '--disable-dev-shm-usage'],
    });
    await use(context);
    await context.close();
  },
  page: async ({ context }, use) => {
    const page = context.pages()[0] ?? (await context.newPage());
    await page.goto(BASE_URL);
    await use(withAutoWaitLocators(page));
  },
});

const expect = base.expect;

module.exports = { test, expect, BASE_URL, USER_DATA_DIR };
