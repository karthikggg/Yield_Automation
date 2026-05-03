import * as XLSX from "xlsx";

/**
 * Convert an Excel File object → JSON array
 *
 * @param {File}    file
 * @param {Object}  options
 * @param {string}    [options.sheet]          – Sheet name. Defaults to first sheet.
 * @param {boolean}   [options.allSheets]      – Return { sheetName: rows[] } for all sheets.
 * @param {string}    [options.dateFormat]     – "string" | "date" | "number". Default: "string"
 * @param {number}    [options.headerRow]      – Row index (0-based) for headers. Default: 1 (row 2)
 * @param {boolean}   [options.skipHidden]     – Skip columns marked hidden in Excel. Default: true
 * @param {boolean}   [options.skipFormulas]   – Skip columns where data cells are formulas. Default: true
 * @param {string[]}  [options.skipColumns]    – Column letters to always skip. e.g. ["A","B","C"]
 * @param {string[]}  [options.onlyColumns]    – Whitelist: only include these column letters. e.g. ["D","E","F"]
 * @param {string[]}  [options.skipHeaders]    – Skip columns by header name. e.g. ["Was", "Revise To"]
 * @param {string[]}  [options.onlyHeaders]    – Whitelist: only include these header names.
 */
export async function excelToJson(file, options = {}) {
  const {
    sheet = null,
    allSheets = false,
    dateFormat = "string",
    headerRow = 0,
    skipHidden = true,
    skipFormulas = true,
    skipColumns = [],
    onlyColumns = [],
    skipHeaders = [],
    onlyHeaders = [],
  } = options;

  const arrayBuffer = await file.arrayBuffer();

  const workbook = XLSX.read(arrayBuffer, {
    type: "array",
    cellDates: dateFormat === "date",
    cellNF: true,    // keep number formats
    cellText: true,  // pre-compute formatted text (cell.w)
  });

  const colLetterToIndex = (letter) =>
    XLSX.utils.decode_col(letter.toUpperCase());

  const parseSheet = (sheetName) => {
    const ws = workbook.Sheets[sheetName];
    const range = XLSX.utils.decode_range(ws["!ref"] || "A1");
    const colInfo = ws["!cols"] || [];

    // ── Build skip/only sets ───────────────────────────────────────
    const skipColIndexes = new Set(skipColumns.map(colLetterToIndex));
    const onlyColIndexes = onlyColumns.length
      ? new Set(onlyColumns.map(colLetterToIndex))
      : null;

    // ── Decide visible columns ─────────────────────────────────────
    const visibleCols = [];
    for (let C = range.s.c; C <= range.e.c; C++) {
      // Whitelist by column letter
      if (onlyColIndexes && !onlyColIndexes.has(C)) continue;

      // Blacklist by column letter
      if (skipColIndexes.has(C)) continue;

      // Hidden column
      if (skipHidden && colInfo[C]?.hidden) continue;

      // Formula column (check first data cell)
      if (skipFormulas) {
        const firstData = ws[XLSX.utils.encode_cell({ r: headerRow + 1, c: C })];
        if (firstData?.f) continue;
      }

      visibleCols.push(C);
    }

    // ── Extract headers ────────────────────────────────────────────
    const headers = visibleCols.map((C) => {
      const cell = ws[XLSX.utils.encode_cell({ r: headerRow, c: C })];
      return cell?.v != null ? String(cell.v) : `Col_${C}`;
    });

    // ── Apply header-based filters ─────────────────────────────────
    const skipHeaderSet = new Set(skipHeaders.map((h) => h.toLowerCase()));
    const onlyHeaderSet = onlyHeaders.length
      ? new Set(onlyHeaders.map((h) => h.toLowerCase()))
      : null;

    const finalCols = visibleCols.filter((_, i) => {
      const h = headers[i].toLowerCase();
      if (onlyHeaderSet && !onlyHeaderSet.has(h)) return false;
      if (skipHeaderSet.has(h)) return false;
      return true;
    });

    const finalHeaders = finalCols.map((C) => headers[visibleCols.indexOf(C)]);

    // ── Build rows ─────────────────────────────────────────────────
    const rows = [];
    for (let R = headerRow + 1; R <= range.e.r; R++) {
      const row = {};
      let hasValue = false;

      finalCols.forEach((C, i) => {
        const cell = ws[XLSX.utils.encode_cell({ r: R, c: C })];

        // cell.w = formatted value (exactly as shown in Excel e.g. "10:00 PM", "4/22/2026")
        // cell.v = raw value (decimals, serial dates — avoid)
        const val = cell?.w ?? cell?.v ?? "";

        row[finalHeaders[i]] = val;
        if (val !== "") hasValue = true;
      });

      if (hasValue) rows.push(row);
    }

    return rows;
  };

  if (allSheets) {
    return Object.fromEntries(
      workbook.SheetNames.map((name) => [name, parseSheet(name)])
    );
  }

  const targetSheet = sheet ?? workbook.SheetNames[0];
  if (!workbook.SheetNames.includes(targetSheet)) {
    throw new Error(
      `Sheet "${targetSheet}" not found. Available: ${workbook.SheetNames.join(", ")}`
    );
  }

  return parseSheet(targetSheet);
}

/**
 * Get sheet names without parsing data.
 * @param {File} file
 * @returns {Promise<string[]>}
 */
export async function getSheetNames(file) {
  const arrayBuffer = await file.arrayBuffer();
  const workbook = XLSX.read(arrayBuffer, { type: "array" });
  return workbook.SheetNames;
}