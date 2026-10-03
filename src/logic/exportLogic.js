function escapeCsv(value) {
  const text = Array.isArray(value) ? value.join(", ") : String(value ?? "");
  return `"${text.replaceAll('"', '""')}"`;
}

export function exportCsv(filename, rows, columns) {
  const header = columns.map((column) => escapeCsv(column.label)).join(",");
  const body = rows.map((row) => columns.map((column) => escapeCsv(column.value ? column.value(row) : row[column.key])).join(","));
  const blob = new Blob(["\uFEFF", [header, ...body].join("\r\n")], { type: "text/csv;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}