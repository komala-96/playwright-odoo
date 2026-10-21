const path = require('path');
const XLSX = require('xlsx');

// Negative test case metadata from the "Negative Test Cases" sheet of the source spreadsheet.
const FILE = path.join(__dirname, '..', 'data', 'End_to_End_QA_Test_Cases.xlsx');
let cache;
function negatives() {
  if (cache) return cache;
  const rows = XLSX.utils.sheet_to_json(XLSX.readFile(FILE).Sheets['Negative Test Cases'], { defval: '' });
  cache = Object.fromEntries(rows.filter((r) => r['NTC ID']).map((r) => [String(r['NTC ID']).trim(), r]));
  return cache;
}
const slug = (s) => `@${String(s).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')}`;

/** [title, details] for test(): title "NTC-001 | Module | Negative scenario", tags @ntc-001 @negative @<priority> @<module>. */
function ntc(id) {
  const c = negatives()[id];
  if (!c) throw new Error(`${id} not found in the Negative Test Cases sheet`);
  return [`${id} | ${c.Module} | ${c['Negative Scenario']}`, {
    tag: [slug(id), '@negative', slug(c.Priority), slug(c.Module)],
    annotation: [
      { type: 'Related TC', description: String(c['Related TC']) },
      { type: 'Test Data', description: String(c['Test Data']) },
      { type: 'Expected Result', description: String(c['Expected Result']) },
      { type: 'Basis', description: String(c.Basis) },
    ],
  }];
}
module.exports = { ntc, negatives };
