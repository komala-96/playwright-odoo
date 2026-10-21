const path = require('path');
const XLSX = require('xlsx');

/**
 * Reads a data-driven test sheet the same way utils/ReadExcelData.java did:
 * row 0 is a header row and is skipped, every other cell is returned as a string.
 *
 * Note: the original ReadExcelData.readData() always opened the "positive" sheet,
 * even from the negativetestcases test classes (customerCare.xlsx etc. also ship a
 * "negative" sheet with near-identical rows that Java never actually read). That
 * quirk is preserved here via the default `sheetName` so behavior matches the
 * existing suite; pass sheetName: 'negative' explicitly if a spec should read it.
 *
 * @param {string} fileBaseName - xlsx file name under ./data, without extension
 * @param {string} [sheetName]
 * @returns {string[][]} one array of string cells per data row
 */
function readExcelRows(fileBaseName, sheetName = 'positive') {
  const filePath = path.join(__dirname, '..', 'data', `${fileBaseName}.xlsx`);
  const workbook = XLSX.readFile(filePath);
  const sheet = workbook.Sheets[sheetName];
  if (!sheet) {
    throw new Error(`Sheet "${sheetName}" not found in ${filePath}`);
  }

  const rows = XLSX.utils.sheet_to_json(sheet, { header: 1, defval: '', raw: false });
  return rows.slice(1).map((row) => row.map((cell) => String(cell ?? '')));
}

module.exports = { readExcelRows };
