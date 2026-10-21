// node perf/report.js  [RUN_ID=...]  -> reports/Performance_Results_<run>.xlsx and .md from perf/results/perf-<run>.json
const fs = require('fs');
const path = require('path');
const XLSX = require('xlsx');

const dir = path.join(__dirname, 'results');
const run = process.env.RUN_ID
  || fs.readdirSync(dir).map((f) => f.match(/^perf-(\d+)\.json$/)?.[1]).filter(Boolean).sort().pop();
const data = JSON.parse(fs.readFileSync(path.join(dir, `perf-${run}.json`), 'utf8'));
const sec = (ms) => (ms === undefined || ms === null ? '' : Math.round(ms / 100) / 10);
const scenarios = Object.values(data.scenarios).sort((a, b) => a.no - b.no);
const sum = (steps, pred, key = 'ms') => steps.filter(pred).reduce((a, s) => a + (s[key] || 0), 0);
const KIND = { app: 'Application response', flow: 'Fill + save full form', ui: 'Robot typing / selecting', setup: 'Setup (not measured)' };

// Main measurement of each scenario: the save / confirm / delete / generate the scenario is about.
const isKey = (s) => /^(Save|Confirm|Approve|Delete|Add \d+|Create )/.test(s.name) || /: generate$/.test(s.name);

const summary = scenarios.map((s) => {
  const measured = s.steps.filter((x) => x.kind !== 'setup');
  return {
    'No': s.no,
    'Scenario': s.title,
    'Status': s.status,
    'Total time (s)': sec(sum(measured, () => true)),
    'Application wait time (s)': sec(sum(measured, (x) => x.kind === 'app')),
    'Server time for save/confirm/delete calls (s)': sec(sum(measured, () => true, 'serverMs')),
    'Key action(s)': measured.filter(isKey).filter((x) => !/: generate$/.test(x.name)).map((x) => `${x.name}: ${sec(x.ms)} s${x.serverMs ? ` (server ${sec(x.serverMs)} s)` : ''}`).join('\n')
      || (s.no === 14 ? `${measured.filter((x) => /: generate$/.test(x.name)).length} reports generated` : ''),
    'Notes': [...s.notes.filter((n) => s.no !== 14 || /failed/i.test(n)), s.error ? `ERROR: ${s.error}` : ''].filter(Boolean).join('\n'),
  };
});

const steps = scenarios.flatMap((s) => s.steps.map((x) => ({
  'No': s.no, 'Scenario': s.title, 'Step': x.name, 'Type': KIND[x.kind] || x.kind, 'Time (s)': sec(x.ms),
  'Server time (s)': x.serverMs ? sec(x.serverMs) : '',
  'Server calls': (x.calls || []).map((c) => `${c.call} ${sec(c.ms)}s`).join(', '),
  'Passed': x.ok ? 'Yes' : 'No',
})));

const reports = [];
const rep = data.scenarios[14];
if (rep) {
  const by = {};
  for (const x of rep.steps) {
    const m = x.name.match(/^(.*?) > (.*): (open|set dates|generate)$/);
    if (!m) continue;
    const key = `${m[1]} > ${m[2]}`;
    by[key] = by[key] || { 'Category': m[1], 'Report': m[2] };
    by[key][{ open: 'Open report screen (s)', 'set dates': 'Set filters (s)', generate: 'Generate (s)' }[m[3]]] = sec(x.ms);
    if (m[3] === 'generate' && x.serverMs) by[key]['Generate server (s)'] = sec(x.serverMs);
  }
  for (const n of rep.notes) {
    const m = n.match(/^(.*?) > (.*?): (.*)$/);
    if (m && by[`${m[1]} > ${m[2]}`]) by[`${m[1]} > ${m[2]}`]['Result'] = m[3];
  }
  reports.push(...Object.values(by));
}

const info = [
  ['Application', data.baseUrl], ['Run ID', data.runId], ['Started', data.startedAt], ['Finished', data.finishedAt],
  ['Lines per order', process.env.PERF_LINES || 150],
  ['How to read', 'Total time = what the user experiences for the whole scenario (incl. filling every field). Application wait time = steps where the user only waits for the app (open list/form, Add, Save, Confirm, Delete, Generate). Server time = time the server spent on save / create / confirm / delete calls.'],
];

const wb = XLSX.utils.book_new();
const sheet = (rows, widths) => { const ws = XLSX.utils.json_to_sheet(rows); ws['!cols'] = widths.map((w) => ({ wch: w })); return ws; };
XLSX.utils.book_append_sheet(wb, sheet(summary, [5, 55, 9, 14, 18, 22, 80, 70]), 'Summary');
XLSX.utils.book_append_sheet(wb, sheet(steps, [5, 45, 80, 24, 10, 12, 70, 8]), 'Steps');
if (reports.length) XLSX.utils.book_append_sheet(wb, sheet(reports, [22, 45, 18, 14, 12, 16, 60]), 'Reports');
const infoWs = XLSX.utils.aoa_to_sheet(info); infoWs['!cols'] = [{ wch: 18 }, { wch: 120 }];
XLSX.utils.book_append_sheet(wb, infoWs, 'Run info');

const outDir = path.join(__dirname, '..', 'reports');
fs.mkdirSync(outDir, { recursive: true });
const xlsxFile = path.join(outDir, `Performance_Results_${run}.xlsx`);
XLSX.writeFile(wb, xlsxFile);

const md = [
  `# AveriGo performance run - ${data.baseUrl}`, '',
  `Run ${data.runId}, ${data.startedAt} to ${data.finishedAt}`, '',
  '| No | Scenario | Status | Total (s) | App wait (s) | Server (s) | Key action(s) |', '|---|---|---|---|---|---|---|',
  ...summary.map((r) => `| ${r.No} | ${r.Scenario} | ${r.Status} | ${r['Total time (s)']} | ${r['Application wait time (s)']} | ${r['Server time for save/confirm/delete calls (s)']} | ${String(r['Key action(s)']).replace(/\n/g, '<br>')} |`),
  '',
  ...(reports.length ? ['## Reports', '', '| Category | Report | Open (s) | Generate (s) | Result |', '|---|---|---|---|---|',
    ...reports.map((r) => `| ${r.Category} | ${r.Report} | ${r['Open report screen (s)'] ?? ''} | ${r['Generate (s)'] ?? ''} | ${r.Result ?? ''} |`)] : []),
].join('\n');
const mdFile = path.join(outDir, `Performance_Results_${run}.md`);
fs.writeFileSync(mdFile, md);
console.log(`${xlsxFile}\n${mdFile}`);
