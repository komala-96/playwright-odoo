const fs = require('fs');
const path = require('path');
const XLSX = require('xlsx');
const env = require('../config/env');

const SOURCE = path.join(__dirname, '..', 'data', 'End_to_End_QA_Test_Cases.xlsx');
const STATUS = { passed: 'Pass', failed: 'Fail', timedOut: 'Fail', skipped: 'Blocked', interrupted: 'Not Executed' };

/**
 * Fills the spreadsheet's "Execution" sheet (Actual Result, Status, Tester,
 * Execution Date, Remarks) from the run and writes a copy to reports/.
 * The source spreadsheet in data/ is never modified.
 */
class ExcelExecutionReporter {
  constructor({ outputFile = 'reports/Execution_Results.xlsx' } = {}) {
    this.outputFile = path.resolve(outputFile);
    this.results = new Map();
  }

  onTestEnd(test, result) {
    // Whole IDs only: "NTC-001" (negative case) must not be read as "TC-001".
    const id = (test.title.match(/(?<![A-Z])N?TC-\d{3}[A-Z]?/) || [])[0];
    if (!id) return;
    const expected = test.annotations.find((a) => a.type === 'Expected Result')?.description || '';
    const blocked = [...test.annotations, ...(result.annotations || [])].find((a) => a.type === 'Blocked')?.description;
    const error = result.error?.message?.replace(/\u001b\[[0-9;]*m/g, '').split('\n')[0] || '';
    this.results.set(id, {
      status: STATUS[result.status] || result.status,
      actual: result.status === 'passed' ? `As expected: ${expected}` : result.status === 'skipped' ? (blocked || 'Skipped - prerequisite test failed') : error,
      remarks: `RUN_ID=${process.env.RUN_ID}; ${(result.duration / 1000).toFixed(1)}s${result.retry ? `; retry ${result.retry}` : ''}`,
    });
    // Written after every test, so a stopped/paused run keeps the results it already has.
    this.write(false);
  }

  onEnd() {
    this.write(true);
  }

  write(final) {
    if (!this.results.size) return;
    // EXCEL_ACCUMULATE=1 (one test per invocation, e.g. tools/run-sheet.sh): add to the existing results file.
    const base = process.env.EXCEL_ACCUMULATE === '1' && fs.existsSync(this.outputFile) ? this.outputFile : SOURCE;
    const wb = XLSX.readFile(base);
    const ws = wb.Sheets.Execution;
    const rows = XLSX.utils.sheet_to_json(ws, { header: 1, defval: '' });
    const today = new Date().toISOString().slice(0, 10);
    for (const row of rows.slice(1)) {
      const r = this.results.get(String(row[0]).trim());
      if (!r) continue;
      row[1] = r.actual;
      row[2] = r.status;
      row[4] = env.TESTER;
      row[5] = today;
      row[6] = r.remarks;
    }
    wb.Sheets.Execution = XLSX.utils.aoa_to_sheet(rows);
    // Negative cases: Status / Actual Result / Execution Date columns on the "Negative Test Cases" sheet.
    const neg = wb.Sheets['Negative Test Cases'];
    if (neg && [...this.results.keys()].some((k) => k.startsWith('NTC-'))) {
      const nrows = XLSX.utils.sheet_to_json(neg, { header: 1, defval: '' });
      const hdr = nrows[0];
      const col = (name) => { let i = hdr.indexOf(name); if (i < 0) { hdr.push(name); i = hdr.length - 1; } return i; };
      const [cs, ca, cd] = [col('Status'), col('Actual Result'), col('Execution Date')];
      for (const row of nrows.slice(1)) {
        const r = this.results.get(String(row[0]).trim());
        if (!r) continue;
        row[cs] = r.status; row[ca] = r.actual; row[cd] = today;
      }
      wb.Sheets['Negative Test Cases'] = XLSX.utils.aoa_to_sheet(nrows);
    }
    fs.mkdirSync(path.dirname(this.outputFile), { recursive: true });
    XLSX.writeFile(wb, this.outputFile);
    if (final) console.log(`\nExecution results written to ${path.relative(process.cwd(), this.outputFile)}`);
  }
}

module.exports = ExcelExecutionReporter;
