const base = require('@playwright/test');
const { ensureAuthState } = require('../utils/auth');
const { meta } = require('../utils/testCases');
const { OdooPage } = require('../pages/OdooPage');
const { InventoryPage } = require('../pages/InventoryPage');
const { CustomerCarePage } = require('../pages/CustomerCarePage');
const { SalesPage } = require('../pages/SalesPage');
const { AccountingPage } = require('../pages/AccountingPage');
const { PurchasePage } = require('../pages/PurchasePage');
const { ReportsPage } = require('../pages/ReportsPage');
const {
  EmployeePage, EquipmentPage, ServicePage, CrmPage, SurveyPage, EventsPage, MicroMarketPage,
} = require('../pages/OtherModulesPage');

/**
 * Login fixture - skips OTP on every run after the first one.
 *
 *  - `authFile` (worker scope) logs in at most once per worker. It reuses
 *    .auth/user.json while that session is still valid; otherwise it logs in,
 *    completes OTP (auto via TOTP_SECRET, or manually in a headed window) and
 *    saves the new storage state.
 *  - Overriding Playwright's built-in `storageState` option makes EVERY test's
 *    context start already signed in - no login form, no OTP.
 *  - Odoo's "Don't ask again on this device" (trusted-device cookie) is ticked
 *    during login and kept in the storage state, so even when the session
 *    expires, re-login is password-only and fully automatic.
 */
const test = base.test.extend({
  authFile: [
    async ({ browser, playwright }, use) => {
      await use(await ensureAuthState(browser, playwright));
    },
    { scope: 'worker' },
  ],

  storageState: async ({ authFile }, use) => {
    await use(authFile);
  },

  page: async ({ page }, use) => {
    // AveriGo pops "Open Customer Activities" at random moments after load;
    // close it whenever it blocks an action. Scoped by title so real
    // business dialogs are never auto-dismissed.
    await page.addLocatorHandler(
      page.locator('.modal.o_technical_modal').filter({ hasText: 'Open Customer Activities' }),
      async (modal) => {
        // It animates in; try the X, then the footer Close, then Escape.
        await modal.locator('.btn-close').first().click({ timeout: 5_000 })
          .catch(() => modal.locator('.modal-footer button').filter({ hasText: /^\s*Close\s*$/ }).first().click({ timeout: 5_000 }))
          .catch(() => modal.page().keyboard.press('Escape'));
      },
      { times: 50 },
    );
    await page.goto('/web');
    await base.expect(page.locator('.o_main_navbar').first(), 'should open logged in (no login/OTP page)').toBeVisible({ timeout: 60_000 });
    await use(page);
  },

  odoo: async ({ page }, use) => use(new OdooPage(page)),
  employeePage: async ({ page }, use) => use(new EmployeePage(page)),
  inventoryPage: async ({ page }, use) => use(new InventoryPage(page)),
  customerCarePage: async ({ page }, use) => use(new CustomerCarePage(page)),
  salesPage: async ({ page }, use) => use(new SalesPage(page)),
  accountingPage: async ({ page }, use) => use(new AccountingPage(page)),
  purchasePage: async ({ page }, use) => use(new PurchasePage(page)),
  reportsPage: async ({ page }, use) => use(new ReportsPage(page)),
  equipmentPage: async ({ page }, use) => use(new EquipmentPage(page)),
  servicePage: async ({ page }, use) => use(new ServicePage(page)),
  crmPage: async ({ page }, use) => use(new CrmPage(page)),
  surveyPage: async ({ page }, use) => use(new SurveyPage(page)),
  eventsPage: async ({ page }, use) => use(new EventsPage(page)),
  microMarketPage: async ({ page }, use) => use(new MicroMarketPage(page)),
});

/** test(...tc('TC-001'), async ({ page }) => {...}) - title, tags and expected result come from the spreadsheet. */
function tc(id) {
  const { title, details } = meta(id);
  return [title, details];
}

module.exports = { test, expect: base.expect, tc };
