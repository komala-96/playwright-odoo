const { expect } = require('@playwright/test');

/** "$ 1,234.50" / "(12.00)" / "-12" -> number. Empty -> 0. */
function parseMoney(text) {
  if (text === null || text === undefined) return 0;
  const s = String(text).trim();
  if (!s) return 0;
  const negative = /^\(.*\)$/.test(s) || s.includes('-');
  const n = parseFloat(s.replace(/[^0-9.]/g, ''));
  if (Number.isNaN(n)) return 0;
  return negative ? -n : n;
}

const round2 = (n) => Math.round(n * 100) / 100;

function expectMoney(actual, expected, label = 'amount') {
  expect(round2(actual), `${label}: expected ${expected}, got ${actual}`).toBeCloseTo(round2(expected), 2);
}

module.exports = { parseMoney, round2, expectMoney };
