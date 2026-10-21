/**
 * Data for the performance run.
 *  - mine: the suite's full-field test data (data/testData.js) for this RUN_ID - every UI field has a value - with
 *          the main records renamed PERF-...-<run> so they are easy to find.
 *  - ref : records that already exist on the tenant, created by an earlier complete E2E run (employee, route, parent
 *          customer, UoM type, bin, category, warehouse, equipment configuration, part, catalogue). The forms point
 *          at them (Accounts Manager, Route, Parent, ...). PERF_REF_RUN picks the run; default: VERIFIED_REF_RUN below.
 */
const fs = require('fs');
const path = require('path');
const env = require('../config/env');

function loadTestData(runId) {
  const file = require.resolve('../data/testData');
  const saved = process.env.RUN_ID;
  delete require.cache[file];
  process.env.RUN_ID = runId;
  try {
    return require(file);
  } finally {
    process.env.RUN_ID = saved;
    delete require.cache[file];
  }
}

function newestCompleteRun() {
  const need = ['p1Url', 'customer2Url', 'vendorUrl', 'mmUrl', 'equipment1Url', 'partUrl', 'warehouseUrl'];
  const runs = fs.readdirSync(env.RUNTIME_DIR)
    .map((f) => f.match(/^state-(\d+)\.json$/)?.[1]).filter(Boolean)
    .filter((r) => {
      const s = JSON.parse(fs.readFileSync(path.join(env.RUNTIME_DIR, `state-${r}.json`), 'utf8'));
      return need.every((k) => k in s);
    })
    .sort();
  if (!runs.length) throw new Error('No complete E2E run in .runtime/ to take reference records from; set PERF_REF_RUN.');
  return runs[runs.length - 1];
}

// Runs in .runtime/ can belong to another tenant (ultraserv): per tenant, the run whose records were verified on it.
const VERIFIED_REF_RUN = { martiserv: '1791175992196' };
const REF_RUN = process.env.PERF_REF_RUN || VERIFIED_REF_RUN[env.TENANT] || newestCompleteRun();
const ref = loadTestData(REF_RUN);
const mine = loadTestData(process.env.RUN_ID);
const SHORT = process.env.RUN_ID.slice(-5);

const customer = { ...mine.customer2, name: `PERF-CUST-${SHORT}`, code: `PERFC${SHORT}` };
const vendor = { ...mine.vendor, name: `PERF-VEND-${SHORT}` };
const product = { ...mine.products.p2, code: `PERF-PROD-${SHORT}`, name: `PERF Product ${SHORT}` };
const market = { ...mine.microMarket, name: `PERF-MM-${SHORT}` };

module.exports = { REF_RUN, ref, mine, SHORT, customer, vendor, product, market };
