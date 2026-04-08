import React, { useEffect, useState } from "react";
import DataTable from "react-data-table-component";
import moment from "moment";
import { ExportToExcel } from "./ExportToExcel";
import { iconMapping, tableCustomStyles } from "../../../data/data";
import {
  getTeamVsBusinessTicketCountDetails,
  getTicketCountDetails,
} from "../../../api/api-client/dashboardApi";
import { errorMessage } from "../../../api/api-config/apiResponseMessage";
import { truncateString } from "../../../utils/utility";

export const TeamVsOrbitOwnEntityTicketDetails = ({
  closeOffcanvas,
  setIsLoadingContextUpdated,
  data,
}) => {
  const [rowsPerPage, setRowsPerPage] = useState(50);
  const [ticketCountDetailsData, setTicketCountDetailsData] = useState([]);
  const [isLoadingTableData, setIsLoadingTableData] = useState(false);

  const statusColorSet = (Priority) => {
    switch (Priority) {
      case "High":
        return (
          <div>
            <i
              className='bi bi-square-fill me-2'
              style={{
                color: "var(--priority-high-color)",
                fontSize: "8px",
              }}></i>
            {Priority}
          </div>
        );

      case "Low":
        return (
          <div>
            <i
              className='bi bi-square-fill me-2'
              style={{
                color: "var(--priority-low-color)",
                fontSize: "8px",
              }}></i>
            {Priority}
          </div>
        );

      case "Medium":
        return (
          <div>
            <i
              className='bi bi-square-fill me-2'
              style={{
                color: "var(--priority-medium-color)",
                fontSize: "8px",
              }}></i>
            {Priority}
          </div>
        );

      default:
        return Priority;
    }
  };

  useEffect(() => {
    setIsLoadingTableData(true);
    getTeamVsBusinessTicketCountDetails(data)
      .then((response) => {
        setTicketCountDetailsData(response.data);
      })
      .catch(errorMessage)
      .finally(() => {
        setIsLoadingTableData(false);
      });
  }, [data]);

  const agentColumns = [
    {
      name: "Ticket No.",
      selector: (row) => row.ticket_number,
      cell: (row) => (
        <div className='w-100' style={{ whiteSpace: "nowrap" }}>
          <a
            href={`/admin/ticket-details/${row.ticket_number}`}
            target='_blank'
            rel='noopener noreferrer'
            className='ticket-link bg-transparent'
            onClick={(e) => handleIsTicketReal(e, row.ticket_number)}>
            <i
              className='bi bi-ticket-detailed me-2'
              style={{
                color: `${row.status_name === "Closed" ? "green" : "#FF3131"} `,
              }}></i>
            <span>{row.ticket_number}</span>
          </a>
        </div>
      ),
    },
    {
      name: "Business Entity",
      selector: (row) => row.company_name,
      cell: (row) => <div>{row.company_name}</div>,
      style: { width: "950px", whiteSpace: "nowrap" },
    },

    {
      name: "Raised For",
      selector: (row) => row.client_name,
      cell: (row) => (
        <div>
          <span>{row.client_name}</span>
        </div>
      ),
    },
    {
      name: "SID / UID",
      selector: (row) => row.sid,
      cell: (row) => (
        <div>
          <span>{row.sid ?? "---"}</span>
        </div>
      ),
    },

    {
      name: "Category",
      selector: (row) => row.category_in_english,
      cell: (row) => <div>{statusColorSet(row.category_in_english)}</div>,
    },

    {
      name: "Sub-category",
      selector: (row) => row.sub_category_in_english,
      cell: (row) => (
        <div>
          <i
            className='bi bi-file-text-fill me-2'
            style={{ color: "#1E90FF" }}></i>
          <span>{row.sub_category_in_english}</span>
        </div>
      ),
    },

    {
      name: "Last Comment",
      selector: (row) => row.last_comment,
      cell: (row) => (
        <div title={row.last_comment}>
          {truncateString(row.last_comment, 30)}
        </div>
      ),
    },

    {
      name: "SLA F.Response",
      selector: (row) => row.fr_response_status_name,
      cell: (row) => (
        <div
          className={`rounded text-center d-flex flex-column p-1 ${
            row.fr_response_status_name === "violated"
              ? "bg-danger text-white"
              : row.fr_response_status_name === null
              ? ""
              : "bg-success text-white"
          }`}>
          {row.fr_response_status_name}
          <p>{row.fr_due_time ?? "---"}</p>
        </div>
      ),
    },
    {
      name: "SLA Resolved",
      selector: (row) => row.srv_time_status_name,
      cell: (row) => (
        <div
          className={`rounded d-flex text-center flex-column p-1 ${
            row.srv_time_status_name === "violated"
              ? "bg-danger text-white"
              : row.srv_time_status_name === null
              ? ""
              : "bg-success text-white"
          }`}>
          <p>{row.srv_time_status_name ?? "---"}</p>
          <p>{row.srv_due_time}</p>
        </div>
      ),
    },
    {
      name: "Assigned Team",
      selector: (row) => row.team_name,
      cell: (row) => (
        <div style={{ whiteSpace: "wrap" }}>
          <i className='bi bi-people-fill me-2' style={{ color: "gray" }}></i>
          <span>{row.team_name}</span>
        </div>
      ),
    },

    {
      name: "Age",
      selector: (row) => row.ticket_age,
      cell: (row) => (
        <div style={{ whiteSpace: "nowrap" }}>
          <i className='bi bi-clock me-2' style={{ color: "gray" }}></i>
          <span>{row.ticket_age}</span>
        </div>
      ),
    },

    {
      name: "Status",
      selector: (row) => row.status_name,
      cell: (row) => (
        <div>
          <i
            className={`${iconMapping[row.status_name]} me-2`}
            style={{
              color: `${row.status_name === "Closed" ? "green" : ""}`,
            }}></i>{" "}
          {row.status_name}
        </div>
      ),
    },

    {
      name: "Created By",
      selector: (row) => row.created_by,
      cell: (row) => <div>{row.created_by}</div>,
    },

    {
      name: "Created Date",
      selector: (row) => moment(row.created_at).format("lll"),
      cell: (row) => <div>{moment(row.created_at).format("lll")}</div>,
    },
    {
      name: "Last Updated",
      selector: (row) => moment(row.updated_at).format("lll"),
      cell: (row) => <div>{moment(row.updated_at).format("lll")}</div>,
    },
  ];

  return (
    <div className='container-fluid'>
      <div className='row'>
        <div className='col-12'>
          <div className='text-end mb-3'>
            <button
              className='custom-btn'
              type='button'
              onClick={() => ExportToExcel(ticketCountDetailsData)}>
              <i className='bi bi-file-earmark-excel-fill me-1'></i>
              {"Export"}
            </button>
          </div>
          <div className=''>
            <DataTable
              columns={agentColumns}
              data={ticketCountDetailsData}
              progressPending={isLoadingTableData}
              fixedHeader
              fixedHeaderScrollHeight='calc(100vh - 295px)'
              pagination
              paginationPerPage={rowsPerPage}
              paginationRowsPerPageOptions={[50, 75, 100]}
              customStyles={tableCustomStyles}
              dense
              responsive
              persistTableHead
            />
          </div>
        </div>
      </div>
      <div className='d-flex justify-content-end gap-3 bg-light p-3 position-absolute bottom-0 end-0 w-100'>
        <button type='button' className='btn-button' onClick={closeOffcanvas}>
          Cancel
        </button>
      </div>
    </div>
  );
};
