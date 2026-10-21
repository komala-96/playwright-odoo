const base = require('@playwright/test');
const path = require('path');

// Mirrors BaseClass.java: a persistent Chrome profile (so login/session is
// reused across runs) that opens the Odoo app URL before every test.
const PROFILE_DIR = process.env.CHROME_PROFILE_DIR || path.join(__dirname, '..', 'chrome-profile');
const APP_URL = process.env.APP_URL || 'https://martiserv.averigo.com/';

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
    const context = await base.chromium.launchPersistentContext(PROFILE_DIR, {
      headless: false,
      viewport: null,
      args: ['--start-maximized', '--no-sandbox', '--disable-dev-shm-usage'],
    });
    await use(context);
    await context.close();
  },
  page: async ({ context }, use) => {
    const page = context.pages()[0] || (await context.newPage());
    await page.goto(APP_URL);
    await use(withAutoWaitLocators(page));
  },
});

module.exports = { test, expect: base.expect };
