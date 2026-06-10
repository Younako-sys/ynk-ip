import * as XLSX from 'xlsx';

function downloadBlob(blob, filename) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.style.display = 'none';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  setTimeout(() => URL.revokeObjectURL(url), 2000);
}

export function exportXLSX(vehicles) {
  const data = vehicles.map((v) => ({
    ...v.raw,
    LIEU: v.lieu || '',
    STATUT: v.found ? 'TROUVE' : 'RESTANT',
    DATE: v.foundAt ? new Date(v.foundAt).toLocaleString('fr-FR') : '',
  }));
  const ws = XLSX.utils.json_to_sheet(data);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Inventaire');
  const buf = XLSX.write(wb, { type: 'array', bookType: 'xlsx' });
  const blob = new Blob([buf], {
    type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  });
  downloadBlob(blob, 'inventaire_' + new Date().toISOString().slice(0, 10) + '.xlsx');
}

export function exportCSV(vehicles) {
  const headers = vehicles.length > 0 ? Object.keys(vehicles[0].raw) : [];
  const allHeaders = [...headers, 'LIEU', 'STATUT', 'DATE'];
  const rows = vehicles.map((v) => {
    const vals = headers.map((h) => '"' + String(v.raw[h] ?? '').replace(/"/g, '""') + '"');
    vals.push('"' + (v.lieu || '') + '"');
    vals.push('"' + (v.found ? 'TROUVE' : 'RESTANT') + '"');
    vals.push('"' + (v.foundAt ? new Date(v.foundAt).toLocaleString('fr-FR') : '') + '"');
    return vals.join(',');
  });
  const csv = [allHeaders.map((h) => '"' + h + '"').join(','), ...rows].join('\n');
  const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8;' });
  downloadBlob(blob, 'inventaire_' + new Date().toISOString().slice(0, 10) + '.csv');
}
