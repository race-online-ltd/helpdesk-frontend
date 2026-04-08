import React, { useState } from "react";
import { DateRangePicker, Stack } from "rsuite";
import subDays from "date-fns/subDays";
import startOfWeek from "date-fns/startOfWeek";
import endOfWeek from "date-fns/endOfWeek";
import addDays from "date-fns/addDays";
import startOfMonth from "date-fns/startOfMonth";
import endOfMonth from "date-fns/endOfMonth";
import addMonths from "date-fns/addMonths";
import { SelectDropdown } from "../SelectDropdown";
import {
  ticketStatisticsBarData,
  topComplaintBarData,
} from "../../../../data/chart";
import { faMagnifyingGlassIcon } from "../../../../data/data";
import { BubbleChartComponent } from "../graph/BubbleChartComponent";
import { BarChartComponent } from "../graph/BarChartComponent";
import { ReportDataTable } from "../ReportDataTable";

export const TopComplaint = () => {
  const [reportFilter, setReportFilter] = useState(false);
  const predefinedRanges = [
    {
      label: "Today",
      value: [new Date(), new Date()],
      placement: "left",
    },
    {
      label: "Yesterday",
      value: [addDays(new Date(), -1), addDays(new Date(), -1)],
      placement: "left",
    },
    {
      label: "This week",
      value: [startOfWeek(new Date()), endOfWeek(new Date())],
      placement: "left",
    },
    {
      label: "Last 7 days",
      value: [subDays(new Date(), 6), new Date()],
      placement: "left",
    },
    {
      label: "Last 30 days",
      value: [subDays(new Date(), 29), new Date()],
      placement: "left",
    },
    {
      label: "This month",
      value: [startOfMonth(new Date()), new Date()],
      placement: "left",
    },
    {
      label: "Last month",
      value: [
        startOfMonth(addMonths(new Date(), -1)),
        endOfMonth(addMonths(new Date(), -1)),
      ],
      placement: "left",
    },
  ];

  const templateData = [
    {
      Id: 1,
      organization: "Race Online Limited",
      category: "Complaint",
      subcategory: "Internet Slow Issue",
      open: "232",
      closed: "233",
    },
    {
      Id: 2,
      organization: "Race Online Limited",
      category: "Complaint",
      subcategory: "Internet Slow Issue",
      open: "232",
      closed: "233",
    },
    {
      Id: 3,
      organization: "Race Online Limited",
      category: "Complaint",
      subcategory: "Internet Slow Issue",
      open: "232",
      closed: "233",
    },
    {
      Id: 4,
      organization: "Race Online Limited",
      category: "Complaint",
      subcategory: "Internet Slow Issue",
      open: "232",
      closed: "233",
    },
    {
      Id: 5,
      organization: "Race Online Limited",
      category: "Complaint",
      subcategory: "Internet Slow Issue",
      open: "232",
      closed: "233",
    },
    {
      Id: 6,
      organization: "Race Online Limited",
      category: "Complaint",
      subcategory: "Internet Slow Issue",
      open: "232",
      closed: "233",
    },
  ];
  const templateColumns = [
    {
      name: "Id",
      selector: (row) => row.Id,
      sortable: true,
    },

    {
      name: "Organization",
      selector: (row) => row.organization,
      sortable: true,
    },
    {
      name: "Category",
      selector: (row) => row.category,
      sortable: true,
    },
    {
      name: "Sub Category",
      selector: (row) => row.subcategory,
      sortable: true,
    },
    {
      name: "Open",
      selector: (row) => row.open,
      sortable: true,
    },
    {
      name: "Closed",
      selector: (row) => row.closed,
      sortable: true,
    },
  ];

  const data = {
    labels: topComplaintBarData.map((item) => item.label),
    datasets: [
      {
        label: "Open",
        data: topComplaintBarData.map((item) => item.value),
        backgroundColor: "#0D6EFD",
      },
      {
        label: "Closed",
        data: topComplaintBarData.map((item) => item.value),
        backgroundColor: "#198754",
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      title: {
        display: true,
        text: "10-Jan-2024 - 30-Sep-2024",
        align: "center",
      },
    },
    scales: {
      x: {
        grid: {
          display: false,
        },
        ticks: {
          display: false,
        },
      },
      y: {
        grid: {
          display: false,
        },
        ticks: {
          display: true,
        },
      },
    },
  };

  return (
    <>
      <button
        type='button'
        className='btn-button report-filter-btn'
        onClick={() => setReportFilter(!reportFilter)}>
        <i className='bi bi-filter me-2'></i>Filter
      </button>
      <div
        className={`row ${
          reportFilter
            ? "d-block animate__animated animate__fadeInLeft"
            : "report-filter-container"
        }`}>
        <div className='col-12'>
          <div className='px-2'>
            <div className='row d-flex align-items-center h-100 justify-content-center'>
              <div className='col-sm-12 col-md-2 col-lg-2 col-xl-2 mb-2 mb-sm-0'>
                <DateRangePicker
                  ranges={predefinedRanges}
                  placeholder='Select Date Range'
                  style={{ width: 300 }}
                  onShortcutClick={(shortcut, event) => {
                    console.log(shortcut);
                  }}
                />
              </div>
              <div className='col-sm-12 col-md-2 col-lg-2 col-xl-2 mb-2 mb-sm-0'>
                <SelectDropdown
                  placeholder={"Company"}
                  data={null}
                  option={null}
                />
              </div>
              <div className='col-sm-12 col-md-2 col-lg-2 col-xl-2 mb-2 mb-sm-0'>
                <SelectDropdown
                  placeholder={"Category"}
                  data={null}
                  option={null}
                />
              </div>
              <div className='col-sm-12 col-md-2 col-lg-2 col-xl-2 mb-2 mb-sm-0'>
                <SelectDropdown
                  placeholder={"Sub Category"}
                  data={null}
                  option={null}
                />
              </div>
              <div className='col-sm-12 col-md-2 col-lg-2 col-xl-2 mb-2 mb-sm-0'>
                <SelectDropdown
                  placeholder={"Client"}
                  data={null}
                  option={null}
                />
              </div>

              <div className='col-auto'>
                <button type='submit' className='custom-btn'>
                  {faMagnifyingGlassIcon}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className='row'>
        <div className='col-12 col-sm-10 offset-sm-1'>
          <div className='my-3 border rounded'>
            <div className='row'>
              <div className='col-12'>
                <div className='p-4'>
                  <BarChartComponent data={data} options={options} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <ReportDataTable data={templateData} columns={templateColumns} />
    </>
  );
};
