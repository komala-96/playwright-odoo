const { test, expect } = require('../fixtures');
const env = require('../config/env');

// Smoke test for the login fixture. Run `npm run login` once (headed) to
// complete the first OTP; afterwards every run reuses the saved session.
test.describe('Login fixture (OTP skipped after first login)', () => {
  test('opens Martiserv already signed in - no login form, no OTP', { tag: ['@smoke', '@auth'] }, async ({ page }) => {
    await expect(page).not.toHaveURL(/\/web\/login/);
    await expect(page.locator('input[name="totp_token"]')).toHaveCount(0);
    await expect(page.locator('.o_main_navbar')).toBeVisible();
  });

  test('a brand-new context reuses the saved session', { tag: ['@smoke', '@auth'] }, async ({ browser, authFile }) => {
    const context = await browser.newContext({ storageState: authFile, baseURL: env.BASE_URL });
    const page = await context.newPage();
    await page.goto('/web');
    await expect(page.locator('.o_main_navbar').first()).toBeVisible();
    const session = await page.evaluate(async () => {
      const res = await fetch('/web/session/get_session_info', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ jsonrpc: '2.0', method: 'call', params: {} }),
      });
      return (await res.json()).result;
    });
    expect(session.uid, 'session has a logged-in user').toBeTruthy();
    // Multi-tenant instance stores the login as "<email>@<tenant>".
    expect(String(session.username).toLowerCase().startsWith(env.USERNAME.toLowerCase())).toBe(true);
    await context.close();
  });
});
