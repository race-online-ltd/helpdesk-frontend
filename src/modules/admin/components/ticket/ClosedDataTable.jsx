import React, { useState, useEffect } from "react";
import DataTable from "react-data-table-component";
import { useFormik } from "formik";
import { defaultThemes } from "react-data-table-component";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHandshakeSimple } from "@fortawesome/free-solid-svg-icons";
import {
  faBusinessTimeIcon,
  faUserClockIcon,
  plusIcon,
  refreshIcon,
} from "../../../../data/data";

export const ClosedDataTable = ({ setActiveTab }) => {
  const [filteredData, setFilteredData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedRows, setSelectedRows] = useState(false);
  const [toggledClearRows, setToggleClearRows] = useState(false);
  const [actionButtons, setActionButtons] = useState(false);

  const customStyles = {
    header: {
      style: {
        minHeight: "56px",
      },
    },
    headRow: {
      style: {
        borderTopStyle: "solid",
        borderTopWidth: "1px",
        borderTopColor: defaultThemes.default.divider.default,
        background: "#EBEFF3",
        fontWeight: "bold",
      },
    },
    headCells: {
      style: {
        "&:not(:last-of-type)": {
          borderRightStyle: "solid",
          borderRightWidth: "1px",
          borderRightColor: defaultThemes.default.divider.default,
        },
      },
    },
    rows: {
      style: {
        "&:hover": {
          backgroundColor: "var(--secondary-bg-color)",
          cursor: "pointer",
        },
      },
    },
    cells: {
      style: {
        "&:not(:last-of-type)": {
          borderRightStyle: "solid",
          borderRightWidth: "1px",
          borderRightColor: defaultThemes.default.divider.default,
        },
      },
    },
  };

  const statusColorSet = (Priority) => {
    switch (Priority) {
      case "High":
        return (
          <div>
            <i
              class='bi bi-square-fill me-2'
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
              class='bi bi-square-fill me-2'
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
              class='bi bi-square-fill me-2'
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

  const data = [
    {
      id: 1,
      Ticket: "998259",
      "Last Updated": "3/24/24 11:56 AM",
      Subject: "osTicket Installed!",
      Priority: "High",
      Age: "1hr 30m 02s ",
      "Assigned Team": "ITB",
    },
    {
      id: 2,
      Ticket: "998259",
      "Last Updated": "3/24/24 11:56 AM",
      Subject: "Bandwidth Issues",
      Priority: "Low",
      Age: "2hr 30m 02s ",
      "Assigned Team": "B",
    },
    {
      id: 3,
      Ticket: "998259",
      "Last Updated": "3/24/24 11:56 AM",
      Subject: "Cable Cut",
      Priority: "Medium",
      Age: "3hr 30m 02s ",
      "Assigned Team": "TX",
    },
    {
      id: 4,
      Ticket: "998259",
      "Last Updated": "3/24/24 11:56 AM",
      Subject: "Authentication Failed",
      Priority: "High",
      Age: "4hr 30m 02s ",
      "Assigned Team": "AAA",
    },
    {
      id: 5,
      Ticket: "998259",
      "Last Updated": "3/24/24 11:56 AM",
      Subject: "Testing Ticket",
      Priority: "High",
      Age: "5hr 30m 02s ",
      "Assigned Team": "ITB",
    },
  ];

  const columns = [
    {
      name: "Ticket",
      selector: (row) => row.Ticket,
      sortable: true,
      cell: (row) => (
        <div className='w-100'>
          <Link to={`/admin/ticket-details/${row.id}`} className='ticket-link'>
            <i
              className='bi bi-ticket-detailed me-2'
              style={{ color: "	#FF3131" }}></i>
            <span>{row.Ticket}</span>
          </Link>
        </div>
      ),
    },
    {
      name: "Last Updated",
      selector: (row) => row["Last Updated"],
      sortable: true,
    },
    {
      name: "Subject",
      selector: (row) => row.Subject,
      sortable: true,
      cell: (row) => (
        <div>
          <i
            className='bi bi-file-text-fill me-2'
            style={{ color: "#1E90FF" }}></i>
          <span>{row.Subject}</span>
        </div>
      ),
    },
    {
      name: "Priority",
      selector: (row) => row.Priority,
      sortable: true,
      cell: (row) => statusColorSet(row.Priority),
    },
    {
      name: "Age",
      selector: (row) => row.Age,
      sortable: true,
      cell: (row) => statusColorSet(row.Age),
    },
    {
      name: "Assigned Team",
      selector: (row) => row["Assigned Team"],
      sortable: true,
      cell: (row) => (
        <div>
          <i className='bi bi-people-fill me-2' style={{ color: "gray" }}></i>
          <span>{row["Assigned Team"]}</span>
        </div>
      ),
    },
  ];

  useEffect(() => {
    // Simulate data fetching
    setTimeout(() => {
      setFilteredData(data);
      setLoading(false);
    }, 100);
  }, []);

  const handleGetRowId = ({ selectedRows }) => {
    setSelectedRows(selectedRows);
  };
  const handleClearRows = () => {
    setToggleClearRows(!toggledClearRows);
  };

  return (
    <div className='row pt-3'>
      <div className='col-12'>
        <div className='bg-white px-2'>
          <div className='row mb-3'>
            <div className='col-12 col-sm-6'>
              <div className='d-flex justify-content-start'>
                <Link
                  to='/admin/add-new-ticket'
                  className='custom-btn-link me-2'>
                  {plusIcon}
                  <span className='action-filter-container'>New Ticket</span>
                </Link>
                <div className='input-group w-50 search-input'>
                  <span className='input-group-text' id='searchText1'>
                    <i className='bi bi-search'></i>
                  </span>
                  <input
                    type='text'
                    id='searchText1'
                    className='form-control'
                    placeholder='Search...'
                    style={{ background: "var(--secondary-bg-color)" }}
                  />
                </div>
                <button
                  type='button'
                  className='btn-button my-0 me-0 action-filter-btn '
                  onClick={() => setActionButtons(!actionButtons)}>
                  <i className='bi bi-three-dots-vertical'></i>
                </button>
              </div>
            </div>
            <div
              className={`col-12 col-sm-6 d-flex justify-content-sm-end justify-content-center mt-sm-0 mt-2 ${
                actionButtons
                  ? "d-block animate__animated animate__fadeInLeft"
                  : "action-filter-container"
              }`}>
              <div className='d-flex'>
                {/* <div className='dropdown'>
                  <button
                    className='custom-btn me-2 dropdown-toggle'
                    type='button'
                    data-bs-toggle='dropdown'
                    aria-expanded='false'>
                    <FontAwesomeIcon
                      icon={faHandshakeSimple}
                      className='me-1'
                      style={{ color: "white" }}
                    />
                    {"SLA Missed"}
                  </button>
                  <ul className='dropdown-menu'>
                    <li>
                      <button type='button'>
                        {faUserClockIcon}
                        Frist Response Time
                      </button>
                    </li>
                    <li>
                      <button type='button'>
                        {faBusinessTimeIcon}
                        Service Time
                      </button>
                    </li>
                  </ul>
                </div> */}

                <div className='dropdown'>
                  <button className='custom-btn me-2' type='button'>
                    <i class='bi bi-repeat me-1'></i>
                    {"Reopen"}
                  </button>
                </div>
                <div className='dropdown'>
                  <button className='custom-btn' type='button'>
                    <i class='bi bi-file-earmark-excel-fill me-1'></i>
                    {"Export"}
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div className='row'>
            <div className='col-12'>
              <div className=''>
                <DataTable
                  columns={columns}
                  data={filteredData}
                  progressPending={loading}
                  fixedHeader
                  // fixedHeaderScrollHeight='180px'
                  pagination
                  selectableRows
                  onSelectedRowsChange={handleGetRowId}
                  clearSelectedRows={toggledClearRows}
                  customStyles={customStyles}
                  dense
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
