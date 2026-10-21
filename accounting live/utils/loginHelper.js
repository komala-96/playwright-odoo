const { test } = require('@playwright/test');

// The persistent Chrome profile (see fixtures/base.js) keeps the
// session alive across runs, so once logged in the login form never
// reappears and OTP is never re-prompted. This only submits the login form
// when it's actually shown (first run, or an expired session), then waits
// generously for it to disappear so there's time to enter the OTP by hand.
async function ensureLoggedIn({ userName, passWord, logIn }, user, pass) {
  return test.step('login only if not already signed in', async () => {
    const needsLogin = await userName.isVisible({ timeout: 5_000 }).catch(() => false);
    if (needsLogin) {
      await userName.fill(user);
      await passWord.fill(pass);
      await logIn.click();
      await userName.waitFor({ state: 'hidden', timeout: 120_000 });
    }
  });
}

module.exports = { ensureLoggedIn };
