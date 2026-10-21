const fs = require('fs');
const path = require('path');
const env = require('../config/env');
const { generateTOTP, secondsLeft } = require('./totp');

const SEL = {
  login: 'input[name="login"]',
  password: 'input[name="password"]',
  submit: 'button[type="submit"]',
  otp: 'input[name="totp_token"], input[autocomplete="one-time-code"], input[name*="otp" i], input[id*="otp" i], input[name*="code" i][inputmode="numeric"]',
  // Odoo: "Don't ask again on this device" -> sets the trusted-device (td_id)
  // cookie, which is what lets later logins skip OTP entirely.
  remember: 'input[name="remember"], input[type="checkbox"][id*="remember" i]',
  loginError: '.oe_login_form .alert-danger, form .alert-danger',
  webClient: '.o_main_navbar, .o_home_menu',
};

const LOCK_FILE = `${env.AUTH_FILE}.lock`;

/** Poll a set of selectors and return the key of the first one that becomes visible. */
async function firstVisible(page, selectors, timeout) {
  const deadline = Date.now() + timeout;
  while (Date.now() < deadline) {
    for (const [key, selector] of Object.entries(selectors)) {
      if (await page.locator(selector).first().isVisible().catch(() => false)) return key;
    }
    await page.waitForTimeout(500);
  }
  throw new Error(`None of [${Object.keys(selectors).join(', ')}] appeared within ${timeout}ms (url: ${page.url()})`);
}

/** True when the saved storage state still opens the Odoo web client without redirecting to /web/login. */
async function isSessionValid(browser, file = env.AUTH_FILE) {
  if (!fs.existsSync(file)) return false;
  const context = await browser.newContext({ storageState: file, baseURL: env.BASE_URL });
  try {
    const page = await context.newPage();
    await page.goto('/web', { waitUntil: 'domcontentloaded' });
    const state = await firstVisible(page, { app: SEL.webClient, login: SEL.login }, 30_000).catch(() => 'login');
    return state === 'app';
  } finally {
    await context.close();
  }
}

async function submitOtp(page) {
  const remember = page.locator(SEL.remember).first();
  if (await remember.isVisible().catch(() => false)) await remember.check({ force: true });

  if (env.TOTP_SECRET) {
    if (secondsLeft() < 5) await page.waitForTimeout(secondsLeft() * 1000 + 500);
    const code = generateTOTP(env.TOTP_SECRET);
    const boxes = page.locator(SEL.otp);
    if ((await boxes.count()) >= code.length) {
      // Custom OTP screen with one box per digit.
      for (let i = 0; i < code.length; i++) await boxes.nth(i).fill(code[i]);
    } else {
      await boxes.first().fill(code);
    }
    await page.locator(SEL.submit).first().click();
    await page.locator(SEL.webClient).first().waitFor({ timeout: 60_000 });
    return;
  }

  console.log(
    `\n[auth] OTP required. Enter the code in the opened browser window ` +
      `(tick "Don't ask again on this device"). Waiting up to ${env.OTP_WAIT_MS / 1000}s...\n`,
  );
  await page.locator(SEL.webClient).first().waitFor({ timeout: env.OTP_WAIT_MS });
}

/** Fill the Odoo login form, handle OTP if asked, and save the storage state. */
async function performLogin(page, file = env.AUTH_FILE) {
  await page.goto('/web/login', { waitUntil: 'domcontentloaded' });

  if ((await firstVisible(page, { app: SEL.webClient, login: SEL.login }, 30_000)) === 'login') {
    await page.locator(SEL.login).fill(env.USERNAME);
    await page.locator(SEL.password).fill(env.PASSWORD);
    await page.locator(SEL.submit).first().click();

    const next = await firstVisible(page, { app: SEL.webClient, otp: SEL.otp, error: SEL.loginError }, 60_000);
    if (next === 'error') {
      const msg = await page.locator(SEL.loginError).first().innerText();
      throw new Error(`Login failed for ${env.USERNAME}: ${msg.trim()}`);
    }
    if (next === 'otp') await submitOtp(page);
  }

  fs.mkdirSync(path.dirname(file), { recursive: true });
  await page.context().storageState({ path: file });
}

async function withLock(fn) {
  fs.mkdirSync(path.dirname(LOCK_FILE), { recursive: true });
  const deadline = Date.now() + env.OTP_WAIT_MS + 60_000;
  for (;;) {
    try {
      fs.closeSync(fs.openSync(LOCK_FILE, 'wx'));
      break;
    } catch {
      // Stale lock from a crashed run.
      const age = Date.now() - fs.statSync(LOCK_FILE, { throwIfNoEntry: false })?.mtimeMs;
      if (age > env.OTP_WAIT_MS + 60_000) fs.rmSync(LOCK_FILE, { force: true });
      if (Date.now() > deadline) throw new Error('Timed out waiting for another worker to finish logging in');
      await new Promise((r) => setTimeout(r, 1000));
    }
  }
  try {
    return await fn();
  } finally {
    fs.rmSync(LOCK_FILE, { force: true });
  }
}

/**
 * Returns a storage-state file that is logged in. Reuses .auth/user.json while
 * the session is valid; otherwise logs in once (OTP via TOTP_SECRET, or by
 * hand in a headed window) and saves it. The previous state is loaded into the
 * login context so Odoo's trusted-device cookie survives and OTP is skipped.
 */
async function ensureAuthState(browser, playwright) {
  if (await isSessionValid(browser)) return env.AUTH_FILE;

  return withLock(async () => {
    if (await isSessionValid(browser)) return env.AUTH_FILE; // another worker just did it

    const headed = !env.TOTP_SECRET;
    const loginBrowser = headed ? await playwright.chromium.launch({ headless: false }) : browser;
    const context = await loginBrowser.newContext({
      baseURL: env.BASE_URL,
      storageState: fs.existsSync(env.AUTH_FILE) ? env.AUTH_FILE : undefined,
    });
    try {
      await performLogin(await context.newPage());
    } finally {
      await context.close();
      if (headed) await loginBrowser.close();
    }
    return env.AUTH_FILE;
  });
}

module.exports = { ensureAuthState, performLogin, isSessionValid, SEL };
