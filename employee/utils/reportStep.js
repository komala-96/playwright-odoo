const fs = require('fs');
const path = require('path');

const SNAPS_DIR = path.join(__dirname, '..', 'snaps');

/**
 * Mirrors BaseClass.reportStep()/takeSnap() from the Java suite: screenshots
 * the current page, logs the step, and throws on failure so the Playwright
 * test fails at the same point the Java test would (which also threw on a
 * failed reportStep).
 */
async function reportStep(page, stepInfo, status) {
  if (!fs.existsSync(SNAPS_DIR)) {
    fs.mkdirSync(SNAPS_DIR, { recursive: true });
  }

  const randNum = Math.floor(Math.random() * 999999) + 10000000;
  const snapPath = path.join(SNAPS_DIR, `img${randNum}.png`);

  try {
    await page.screenshot({ path: snapPath });
  } catch {
    // page may already be closed/navigated away; ignore, still report the step
  }

  if (status.toLowerCase() === 'pass') {
    console.log(`[PASS] ${stepInfo} (screenshot: ${snapPath})`);
  } else if (status.toLowerCase() === 'fail') {
    console.log(`[FAIL] ${stepInfo} (screenshot: ${snapPath})`);
    throw new Error(stepInfo);
  }
}

module.exports = { reportStep };
