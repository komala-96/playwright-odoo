const path = require('path');

require('dotenv').config({ path: path.join(__dirname, '..', '.env'), quiet: true });

const ROOT = path.join(__dirname, '..');

function required(name) {
  const value = process.env[name];
  if (!value) throw new Error(`Missing ${name}. Copy .env.example to .env and fill it in.`);
  return value;
}

const BASE_URL = (process.env.BASE_URL || 'https://martiserv.averigoqa.com').replace(/\/$/, '');
// Tenant = first label of the host (martiserv, ultraserv, ...). Each tenant keeps its own login session.
const TENANT = new URL(BASE_URL).hostname.split('.')[0];

module.exports = {
  ROOT,
  BASE_URL,
  TENANT,
  get USERNAME() { return required('AVERIGO_USERNAME'); },
  get PASSWORD() { return required('AVERIGO_PASSWORD'); },
  TOTP_SECRET: process.env.TOTP_SECRET || '',
  OTP_WAIT_MS: Number(process.env.OTP_WAIT_MS || 180_000),
  AUTH_FILE: path.join(ROOT, '.auth', TENANT === 'martiserv' ? 'user.json' : `user-${TENANT}.json`),
  RUNTIME_DIR: path.join(ROOT, '.runtime'),
  TESTER: process.env.TESTER || 'QA Automation',
};
