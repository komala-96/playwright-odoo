const XLSX = require('xlsx');
const path = require('path');

/**
 * Mirrors inventory/utils/readExcelData.js: reads every data row (skipping
 * the header) from the given sheet of ./data/<fileName>.xlsx as an array of
 * string arrays, suitable for driving a parameterized test loop.
 */
function readData(fileName, sheetName = 'positive') {
  const filePath = path.join(__dirname, '..', 'data', `${fileName}.xlsx`);
  const workbook = XLSX.readFile(filePath);
  const sheet = workbook.Sheets[sheetName];
  if (!sheet) {
    throw new Error(`Sheet "${sheetName}" not found in ${filePath}`);
  }

  const rows = XLSX.utils.sheet_to_json(sheet, { header: 1, raw: false, defval: '' });
  const [, ...dataRows] = rows;

  return dataRows
    .filter((row) => row.some((cell) => String(cell).trim() !== ''))
    .map((row) => row.map((cell) => (cell === undefined || cell === null ? '' : String(cell))));
}

module.exports = { readData };
