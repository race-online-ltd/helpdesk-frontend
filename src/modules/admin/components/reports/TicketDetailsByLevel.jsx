import React, { useState } from "react";
import { ticketDetailsInLevel } from "../../../../api/api-client/reportsApi";
import * as XLSX from "xlsx";

const TicketDetailsByLevel = () => {
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [tickets, setTickets] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await ticketDetailsInLevel(fromDate, toDate);

      console.log("API Response:", response);

      const formattedTickets = Object.values(response)
        .filter(
          (ticket) =>
            ticket &&
            typeof ticket === "object" &&
            Object.keys(ticket).length > 0
        )
        .map((ticket) => ticket[Object.keys(ticket)[0]]);

      console.log("Formatted Tickets:", formattedTickets);

      setTickets(formattedTickets);
    } catch (err) {
      console.error("Error fetching tickets:", err);
      setError("Failed to fetch ticket details");
    } finally {
      setLoading(false);
    }
  };

  const getDynamicHeaders = (tickets) => {
    const headers = new Set();
    tickets.forEach((ticket) => {
      if (ticket) {
        Object.keys(ticket).forEach((key) => {
          if (key.startsWith("Level")) headers.add(key);
        });
      }
    });
    return Array.from(headers);
  };

  const dynamicHeaders = tickets.length > 0 ? getDynamicHeaders(tickets) : [];

  const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(tickets);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Ticket Details");

    XLSX.writeFile(workbook, "ticket_details.xlsx");
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.heading}>Ticket Details Report</h1>

      <form onSubmit={handleSubmit} style={styles.form}>
        <div style={styles.inputGroup}>
          <label style={styles.label}>From Date:</label>
          <input
            type='date'
            value={fromDate}
            onChange={(e) => setFromDate(e.target.value)}
            required
            style={styles.input}
          />
        </div>
        <div style={styles.inputGroup}>
          <label style={styles.label}>To Date:</label>
          <input
            type='date'
            value={toDate}
            onChange={(e) => setToDate(e.target.value)}
            required
            style={styles.input}
          />
        </div>
        <button type='submit' style={styles.button}>
          Get Ticket Details
        </button>
      </form>

      {error && <div style={styles.error}>{error}</div>}
      {loading && <div style={styles.loading}>Loading...</div>}

      {!loading && tickets.length > 0 && (
        <>
          <button onClick={exportToExcel} style={styles.exportButton}>
            Export to Excel
          </button>
          <table style={styles.table}>
            <thead>
              <tr style={styles.tableHeader}>
                <th style={styles.tableCell}>Ticket Number</th>
                <th style={styles.tableCell}>Company Name</th>
                <th style={styles.tableCell}>Client Name</th>
                <th style={styles.tableCell}>Category/Subcategory</th>
                <th style={styles.tableCell}>Created At</th>
                {dynamicHeaders.map((level, index) => (
                  <th key={index} style={styles.tableCell}>
                    {level.replace("_", " ")}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {tickets.map((ticket, index) => (
                <tr
                  key={index}
                  style={
                    index % 2 === 0 ? styles.tableRowEven : styles.tableRowOdd
                  }>
                  <td style={styles.tableCell}>{ticket.ticket_number}</td>
                  <td style={styles.tableCell}>{ticket.company_name}</td>
                  <td style={styles.tableCell}>{ticket.client_name}</td>
                  <td style={styles.tableCell}>
                    {ticket.category_subcategory}
                  </td>
                  <td style={styles.tableCell}>{ticket.created_at}</td>
                  {dynamicHeaders.map((level, idx) => (
                    <td key={idx} style={styles.tableCell}>
                      {ticket[level] || "N/A"}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}

      {!loading && tickets.length === 0 && (
        <div style={styles.noData}>No tickets found.</div>
      )}
    </div>
  );
};

const styles = {
  container: {
    margin: "20px auto",
    padding: "20px",
    maxWidth: "1200px",
    fontFamily: "Arial, sans-serif",
    backgroundColor: "#f9f9f9",
    borderRadius: "8px",
    boxShadow: "0 2px 10px rgba(0, 0, 0, 0.1)",
  },
  heading: {
    textAlign: "center",
    marginBottom: "20px",
    color: "#333",
  },
  form: {
    display: "flex",
    justifyContent: "space-between",
    marginBottom: "20px",
    alignItems: "center",
  },
  inputGroup: {
    display: "flex",
    flexDirection: "column",
    marginRight: "10px",
  },
  label: {
    marginBottom: "5px",
    fontWeight: "bold",
    color: "#555",
  },
  input: {
    padding: "8px",
    fontSize: "14px",
    border: "1px solid #ccc",
    borderRadius: "4px",
  },
  button: {
    padding: "10px 20px",
    backgroundColor: "#007bff",
    color: "#fff",
    fontWeight: "bold",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
  },
  exportButton: {
    padding: "10px 20px",
    backgroundColor: "#28a745",
    color: "#fff",
    fontWeight: "bold",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
    marginBottom: "20px",
  },
  error: {
    color: "red",
    marginBottom: "20px",
  },
  loading: {
    textAlign: "center",
    margin: "20px 0",
    color: "#007bff",
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
    marginTop: "20px",
  },
  tableHeader: {
    backgroundColor: "#007bff",
    color: "#fff",
  },
  tableCell: {
    padding: "10px",
    border: "1px solid #ddd",
    textAlign: "center",
  },
  tableRowEven: {
    backgroundColor: "#f2f2f2",
  },
  tableRowOdd: {
    backgroundColor: "#fff",
  },
  noData: {
    textAlign: "center",
    marginTop: "20px",
    color: "#888",
  },
};

export default TicketDetailsByLevel;
