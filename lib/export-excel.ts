import type { Lead } from "@/types/lead";
import { buildExportFilename } from "./formatters";
import { saveAs } from "file-saver";

const COLUMNS: { key: keyof Lead; header: string; width?: number }[] = [
  { key: "name", header: "Business Name", width: 32 },
  { key: "category", header: "Category", width: 18 },
  { key: "rating", header: "Rating", width: 9 },
  { key: "reviews", header: "Reviews", width: 10 },
  { key: "phone", header: "Phone", width: 18 },
  { key: "email", header: "Email", width: 28 },
  { key: "website", header: "Website", width: 30 },
  { key: "address", header: "Address", width: 32 },
  { key: "city", header: "City", width: 16 },
  { key: "state", header: "State", width: 8 },
  { key: "postalCode", header: "Postal Code", width: 12 },
  { key: "country", header: "Country", width: 12 },
  { key: "latitude", header: "Latitude", width: 12 },
  { key: "longitude", header: "Longitude", width: 12 },
  { key: "hours", header: "Hours", width: 24 },
  { key: "verified", header: "Verified", width: 10 },
];

/**
 * Export leads as an .xlsx workbook. Runs entirely in the browser using SheetJS.
 * Returns the filename it wrote.
 */
export async function exportLeadsToExcel(
  leads: Lead[],
  baseName = "leads",
): Promise<string> {
  const XLSX = await import("xlsx");

  const headerRow = COLUMNS.map((c) => c.header);
  const dataRows = leads.map((lead) =>
    COLUMNS.map((col) => {
      const v = lead[col.key];
      if (v === undefined || v === null) return "";
      if (typeof v === "boolean") return v ? "Yes" : "No";
      return v as string | number;
    }),
  );

  const sheetData = [headerRow, ...dataRows];
  const worksheet = XLSX.utils.aoa_to_sheet(sheetData);
  worksheet["!cols"] = COLUMNS.map((c) => ({ wch: c.width ?? 16 }));
  // Freeze the header row.
  worksheet["!freeze"] = { xSplit: 0, ySplit: 1 };

  // Apply header styling (SheetJS Pro features needed for full styling, but
  // basic !cols sizing + bold via cell.s where possible).
  const range = XLSX.utils.decode_range(worksheet["!ref"] ?? "A1");
  for (let c = range.s.c; c <= range.e.c; c++) {
    const addr = XLSX.utils.encode_cell({ r: 0, c });
    const cell = worksheet[addr];
    if (cell) {
      cell.s = {
        font: { bold: true, color: { rgb: "FFFFFF" } },
        fill: { fgColor: { rgb: "0058BE" } },
        alignment: { vertical: "center" },
      };
    }
  }

  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Leads");

  const filename = buildExportFilename(baseName, "xlsx");
  const wbout = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
  saveAs(
    new Blob([wbout], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    }),
    filename,
  );
  return filename;
}

/**
 * Export leads as a JSON file.
 */
export async function exportLeadsToJson(
  leads: Lead[],
  baseName = "leads",
): Promise<string> {
  const filename = buildExportFilename(baseName, "json");
  const json = JSON.stringify(leads, null, 2);
  saveAs(new Blob([json], { type: "application/json;charset=utf-8;" }), filename);
  return filename;
}
export async function exportLeadsToCsv(
  leads: Lead[],
  baseName = "leads",
): Promise<string> {
  const headerRow = COLUMNS.map((c) => c.header).join(",");
  const escape = (val: unknown) => {
    if (val === null || val === undefined) return "";
    const s = String(val).replace(/"/g, '""');
    return /[",\n]/.test(s) ? `"${s}"` : s;
  };
  const dataRows = leads.map((lead) =>
    COLUMNS.map((col) => {
      const v = lead[col.key];
      if (typeof v === "boolean") return v ? "Yes" : "No";
      return escape(v);
    }).join(","),
  );
  const filename = buildExportFilename(baseName, "csv");
  const csv = [headerRow, ...dataRows].join("\r\n");
  saveAs(new Blob([csv], { type: "text/csv;charset=utf-8;" }), filename);
  return filename;
}
