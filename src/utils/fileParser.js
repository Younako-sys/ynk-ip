import * as XLSX from 'xlsx';
import Papa from 'papaparse';

function isValidVin(value) {
  if (!value) return false;
  const str = String(value).trim().toUpperCase();
  return /^[A-Z0-9]{8,20}$/.test(str);
}

// Try to extract concessionnaire name from the workbook
function extractConcessionnaire(workbook) {
  try {
    const sheet = workbook.Sheets[workbook.SheetNames[0]];
    const rows = XLSX.utils.sheet_to_json(sheet, { header: 1, defval: '' });
    // Look in first 5 rows for a company name
    for (let i = 0; i < Math.min(5, rows.length); i++) {
      for (let j = 0; j < rows[i].length; j++) {
        const val = String(rows[i][j]).trim();
        if (val.length > 5 && val.length < 60 && /[A-Z]{2,}/.test(val) && !isValidVin(val)) {
          // Looks like a company name
          if (val.toUpperCase().includes('AUTO') || val.toUpperCase().includes('SERVICES') ||
              val.toUpperCase().includes('CONCESS') || val.toUpperCase().includes('RENAULT') ||
              val.toUpperCase().includes('DACIA') || val.toUpperCase().includes('SALA')) {
            return val;
          }
        }
      }
    }
  } catch (e) {}
  return '';
}

export function parseFile(file) {
  return new Promise((resolve, reject) => {
    const ext = file.name.split('.').pop().toLowerCase();

    if (ext === 'csv') {
      Papa.parse(file, {
        header: true,
        skipEmptyLines: true,
        complete: (results) => {
          const hdrs = results.meta.fields;
          const colMarque  = hdrs[0];
          const colModele  = hdrs[2];
          const colChassis = hdrs[3];
          const rows = results.data
            .filter((row) => isValidVin(row[colChassis]))
            .map((row) => ({
              [colMarque]:  String(row[colMarque]  || '').trim(),
              [colModele]:  String(row[colModele]  || '').trim(),
              [colChassis]: String(row[colChassis] || '').trim().toUpperCase(),
            }));
          resolve({ rows, headers: [colMarque, colModele, colChassis], concessionnaire: '' });
        },
        error: reject,
      });
    } else {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const workbook = XLSX.read(e.target.result, { type: 'array' });
          const concessionnaire = extractConcessionnaire(workbook);
          const sheet = workbook.Sheets[workbook.SheetNames[0]];
          const allRows = XLSX.utils.sheet_to_json(sheet, { defval: '' });
          const allHeaders = allRows.length > 0 ? Object.keys(allRows[0]) : [];

          const colMarque  = allHeaders[0];
          const colModele  = allHeaders[2];
          const colChassis = allHeaders[3];

          const filtered = allRows
            .filter((row) => isValidVin(String(row[colChassis])))
            .map((row) => ({
              [colMarque]:  String(row[colMarque]  || '').trim(),
              [colModele]:  String(row[colModele]  || '').trim(),
              [colChassis]: String(row[colChassis] || '').trim().toUpperCase(),
            }));

          resolve({ rows: filtered, headers: [colMarque, colModele, colChassis], concessionnaire });
        } catch (err) {
          reject(err);
        }
      };
      reader.onerror = reject;
      reader.readAsArrayBuffer(file);
    }
  });
}

export function detectVinColumn(headers) {
  return headers[2];
}
