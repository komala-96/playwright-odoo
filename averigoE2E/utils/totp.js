const crypto = require('crypto');

const BASE32 = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567';

function base32Decode(secret) {
  const clean = secret.replace(/[\s=-]/g, '').toUpperCase();
  let bits = '';
  for (const ch of clean) {
    const v = BASE32.indexOf(ch);
    if (v < 0) throw new Error(`Invalid base32 character "${ch}" in TOTP_SECRET`);
    bits += v.toString(2).padStart(5, '0');
  }
  const bytes = [];
  for (let i = 0; i + 8 <= bits.length; i += 8) bytes.push(parseInt(bits.slice(i, i + 8), 2));
  return Buffer.from(bytes);
}

/** RFC 6238 TOTP (SHA1, 30s, 6 digits) - the scheme Odoo's auth_totp uses. */
function generateTOTP(secret, { step = 30, digits = 6, time = Date.now() } = {}) {
  const counter = Buffer.alloc(8);
  counter.writeBigUInt64BE(BigInt(Math.floor(time / 1000 / step)));
  const hmac = crypto.createHmac('sha1', base32Decode(secret)).update(counter).digest();
  const offset = hmac[hmac.length - 1] & 0x0f;
  const code = (hmac.readUInt32BE(offset) & 0x7fffffff) % 10 ** digits;
  return String(code).padStart(digits, '0');
}

/** Seconds left in the current TOTP window; avoids submitting a code about to expire. */
function secondsLeft(step = 30) {
  return step - (Math.floor(Date.now() / 1000) % step);
}

module.exports = { generateTOTP, secondsLeft };
