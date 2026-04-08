import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

export const NewReportDetailsExport = (
  data, // Array of ticket objects
  filename = "Ticket_Details_Report.xlsx" // Default filename
) => {
  // Format the data for Excel export
  const formattedData = data.map((ticket) => {
    return {
      "Ticket No.": ticket.ticket_number || "",
      "Company Name": ticket.company_name || "",
      "Client Name": ticket.client_name || "",
      "Category": ticket.category_in_english || "",
      "Sub-Category": ticket.sub_category_in_english || "",
      "Ticket Status": ticket.ticket_status || "",
      "Ticket Age": ticket.ticket_age || "",
      "Branch Name": ticket.branch_name || "",
      "Element List A": ticket.Element_List_A || "",
      "Element List B": ticket.Element_List_B || "",
      "Created By": ticket.created_by || "",
      "Open By Team": ticket.open_by_team || "",
      "Ticket Create Time": ticket.ticket_create_time || "",
      "Status Update By": ticket.status_update_by || "",
      "Updated By Team": ticket.updated_by_team || "",
      "Ticket Update Time": ticket.ticket_update_time || "",
      "Last Comment": ticket.last_comment || "",
      "Last Comment Username": ticket.last_comment_username || "",
      "Last Comment Team Name": ticket.last_comment_team_name || "",
      "Last Comment Created At": ticket.last_comment_created_at || "",
      "RCA Comments": ticket.RCA_Comments || "",
      "RCA UserName": ticket.RCA_UserName || "",
      "RCA Team Name": ticket.RCA_team_name || "",
      "RCA Create Time": ticket.RCA_create_time || "",
      "Team Escalate Count": ticket.team_escalate_count || "",
    };
  });

  // Convert data to worksheet
  const ws = XLSX.utils.json_to_sheet(formattedData);

  // Create a workbook and append the worksheet
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Ticket Details");

  // Write workbook and save as a file
  const wbout = XLSX.write(wb, { bookType: "xlsx", type: "binary" });
  const buf = new ArrayBuffer(wbout.length);
  const view = new Uint8Array(buf);
  for (let i = 0; i < wbout.length; i++) view[i] = wbout.charCodeAt(i) & 0xff;
  const blob = new Blob([buf], { type: "application/octet-stream" });
  saveAs(blob, filename);
};