import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

export const ExportToExcel = (data, filename = "data.xlsx") => {
  // Convert JSON data to worksheet
  const ws = XLSX.utils.json_to_sheet(data);
  // Create a new workbook and add the worksheet
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Sheet1");
  // Generate a binary string representation of the workbook
  const wbout = XLSX.write(wb, { bookType: "xlsx", type: "binary" });

  // Create a Blob from the binary string and save it
  const buf = new ArrayBuffer(wbout.length);
  const view = new Uint8Array(buf);
  for (let i = 0; i < wbout.length; i++) view[i] = wbout.charCodeAt(i) & 0xff;
  const blob = new Blob([buf], { type: "application/octet-stream" });
  saveAs(blob, filename);
};
