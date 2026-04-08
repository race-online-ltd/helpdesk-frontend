import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

export const TicketLifeCycleExportToExcel = (
  data,
  headers,
  maxLevels,
  filename = "data.xlsx"
) => {
  const formattedData = data.map((ticket) => {
    const baseData = {
      "Ticket No.": ticket.ticket_number,
      "Business Entity": ticket.company_name,
      "Client Name": ticket.client_name,
      "Category[Subcategory]": ticket.category_subcategory,
      Created_at: ticket.created_at,
    };

    const levels = Array.isArray(ticket.levels) ? ticket.levels : [];
    for (let i = 0; i < maxLevels; i++) {
      const level = levels[i];
      if (level) {
        baseData[`Level ${i + 1} Agent`] = level.agent || "-";
        baseData[`Level ${i + 1} Assigned To`] = level.assigned_to || "-";
        baseData[`Level ${i + 1} Comment`] = level.comment || "-";
        baseData[`Level ${i + 1} Age`] = level.ticket_age || "-";
        baseData[`Level ${i + 1} Date & Time`] = level.updated_at || "-";
        baseData[`Level ${i + 1} SLA`] = level.sla || "-";
        baseData[`Level ${i + 1} SLA Status`] = level.sla_status || "-";
        baseData[`Level ${i + 1} Status`] = level.ticket_status || "-";
      } else {
        // Fill empty level cells
        baseData[`Level ${i + 1} Agent`] = "";
        baseData[`Level ${i + 1} Assigned To`] = "";
        baseData[`Level ${i + 1} Comment`] = "";
        baseData[`Level ${i + 1} Age`] = "";
        baseData[`Level ${i + 1} Date & Time`] = "";
        baseData[`Level ${i + 1} SLA`] = "";
        baseData[`Level ${i + 1} SLA Status`] = "";
        baseData[`Level ${i + 1} Status`] = "";
      }
    }

    return baseData;
  });

  // Convert data to worksheet
  const ws = XLSX.utils.json_to_sheet(formattedData);

  // Create a workbook and append the worksheet
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Sheet1");

  // Write workbook and save as a file
  const wbout = XLSX.write(wb, { bookType: "xlsx", type: "binary" });
  const buf = new ArrayBuffer(wbout.length);
  const view = new Uint8Array(buf);
  for (let i = 0; i < wbout.length; i++) view[i] = wbout.charCodeAt(i) & 0xff;
  const blob = new Blob([buf], { type: "application/octet-stream" });
  saveAs(blob, filename);
};
