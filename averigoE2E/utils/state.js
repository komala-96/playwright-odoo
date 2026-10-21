const fs = require('fs');
const path = require('path');
const env = require('../config/env');

// Values produced by one test and consumed by a later one (record URLs,
// invoice numbers, totals). Persisted per RUN_ID so specs can be resumed.
const file = () => path.join(env.RUNTIME_DIR, `state-${process.env.RUN_ID}.json`);

function load() {
  try {
    return JSON.parse(fs.readFileSync(file(), 'utf8'));
  } catch {
    return {};
  }
}

function get(key) {
  const value = load()[key];
  if (value === undefined) throw new Error(`Runtime state "${key}" not found for RUN_ID=${process.env.RUN_ID}; run the spec that creates it first.`);
  return value;
}

function optional(key, fallback = undefined) {
  const value = load()[key];
  return value === undefined ? fallback : value;
}

function set(key, value) {
  fs.mkdirSync(env.RUNTIME_DIR, { recursive: true });
  fs.writeFileSync(file(), JSON.stringify({ ...load(), [key]: value }, null, 2));
  return value;
}

module.exports = { get, optional, set };
