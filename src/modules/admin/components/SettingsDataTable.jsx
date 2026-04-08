import React, { useState, useEffect, useMemo } from "react";
import DataTable from "react-data-table-component";
import { defaultThemes } from "react-data-table-component";
import { ExportToExcel } from "./ExportToExcel";

export const SettingsDataTable = ({
  columns = [],
  data = [],
  isLoading,
  filterValue = {},
}) => {
  const [rowsPerPage, setRowsPerPage] = useState(10);
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

  const handleChangeRowsPerPage = (newRowsPerPage) => {
    setRowsPerPage(newRowsPerPage);
  };

  const filteredDataMemo = useMemo(() => {
    if (!filterValue) return data;

    const toLower = (value) =>
      typeof value === "string" ? value.toLowerCase() : "";
    const queryText = toLower(filterValue);

    return data.filter((item) => {
      const companyName = toLower(item.company_name);
      const departmentName = toLower(item.department_name);
      const categoryName = toLower(item.category_in_english);
      const team = toLower(item.team_name);
      const division = toLower(item.division_name);
      const fullname = toLower(item.fullname);
      const username = toLower(item.username);
      const subcategory = toLower(item.sub_category_in_english);
      const clientName = toLower(item.client_name);
      const templateName = toLower(item.template_name);
      const elementName = toLower(item.element_name);
      const branch = toLower(item.branch_names);

      return (
        companyName.includes(queryText) ||
        departmentName.includes(queryText) ||
        categoryName.includes(queryText) ||
        team.includes(queryText) ||
        division.includes(queryText) ||
        fullname.includes(queryText) ||
        username.includes(queryText) ||
        subcategory.includes(queryText) ||
        clientName.includes(queryText) ||
        templateName.includes(queryText) ||
        elementName.includes(queryText) ||
        branch.includes(queryText)
      );
    });
  }, [data, filterValue]);

  return (
    <div className='row'>
      <div className='col-12'>
        <div className='w-100 text-end mb-3'>
          <button
            className='custom-btn '
            type='button'
            onClick={() => ExportToExcel(filteredDataMemo)}>
            <i className='bi bi-file-earmark-excel-fill me-1'></i>
            {"Export"}
          </button>
        </div>
        <div className='bg-white px-2'>
          <DataTable
            columns={columns}
            data={filteredDataMemo}
            progressPending={isLoading}
            fixedHeader
            // fixedHeaderScrollHeight='180px'
            pagination
            paginationPerPage={rowsPerPage}
            paginationRowsPerPageOptions={[10, 20, 30, 50, 75, 100]}
            onChangeRowsPerPage={handleChangeRowsPerPage}
            customStyles={customStyles}
            dense
          />
        </div>
      </div>
    </div>
  );
};
