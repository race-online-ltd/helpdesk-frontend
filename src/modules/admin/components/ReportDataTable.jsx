import React, { useState, useEffect } from "react";
import DataTable from "react-data-table-component"; // Import DataTable from react-data-table-component
import { defaultThemes } from "react-data-table-component";

import { ExportToExcel } from "./ExportToExcel";

export const ReportDataTable = ({ columns, data, isLoading }) => {
  const [filteredData, setFilteredData] = useState([]);

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

  // useEffect(() => {
  //   // Simulate data fetching
  //   setTimeout(() => {
  //     setFilteredData(data);
  //     setLoading(false);
  //   }, 100);
  // }, []);

  return (
    <div className='row'>
      <div className='col-12'>
        <div className='bg-white px-2'>
          <button
            type='button'
            className='btn-button float-end mb-2'
            onClick={() => ExportToExcel(data)}>
            <i className='bi bi-file-earmark-excel-fill text-success'></i>Export
          </button>
          <DataTable
            columns={columns}
            data={data}
            progressPending={isLoading}
            fixedHeader
            // fixedHeaderScrollHeight='180px'
            pagination
            customStyles={customStyles}
            dense
          />
        </div>
      </div>
    </div>
  );
};
