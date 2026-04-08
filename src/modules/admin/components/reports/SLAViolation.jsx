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
  slaViolationBarData,
  ticketStatisticsBarData,
} from "../../../../data/chart";
import { BarChartComponent } from "../graph/BarChartComponent";
import { faMagnifyingGlassIcon } from "../../../../data/data";
import { ReportDataTable } from "../ReportDataTable";

export const SLAViolation = () => {
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
      division: "Dhaka",
      team: "Team - 1",
      "first response time": "36527",
      "service time": "34857",
    },
    {
      Id: 2,
      organization: "Race Online Limited",
      division: "Khulna",
      team: "Team - 1",
      "first response time": "36527",
      "service time": "34857",
    },
    {
      Id: 3,
      organization: "Race Online Limited",
      division: "Barishal",
      team: "Team - 1",
      "first response time": "36527",
      "service time": "34857",
    },
    {
      Id: 4,
      organization: "Race Online Limited",
      division: "Rangpur",
      team: "Team - 1",
      "first response time": "36527",
      "service time": "34857",
    },
    {
      Id: 5,
      organization: "Race Online Limited",
      division: "Shylet",
      team: "Team - 1",
      "first response time": "36527",
      "service time": "34857",
    },
    {
      Id: 6,
      organization: "Race Online Limited",
      division: "Rajshahi",
      team: "Team - 1",
      "first response time": "36527",
      "service time": "34857",
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
      name: "Division",
      selector: (row) => row.division,
      sortable: true,
    },
    {
      name: "Team",
      selector: (row) => row.team,
      sortable: true,
    },

    {
      name: "First Response Time",
      selector: (row) => row["first response time"],
      sortable: true,
    },

    {
      name: "Service Time",
      selector: (row) => row["service time"],
      sortable: true,
    },
  ];

  const data = {
    labels: slaViolationBarData.map((data) => data.label),
    datasets: [
      {
        label: "",
        data: slaViolationBarData.map((data) => data.value),
        backgroundColor: "#0D6EFD",
        fill: true,
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
              <div className='col-sm-12 col-md-3 col-lg-3 col-xl-3 mb-2 mb-sm-0'>
                <DateRangePicker
                  ranges={predefinedRanges}
                  placeholder='Select Date Range'
                  style={{ width: 300 }}
                  onShortcutClick={(shortcut, event) => {
                    console.log(shortcut);
                  }}
                />
              </div>
              <div className='col-sm-12 col-md-3 col-lg-3 col-xl-3 mb-2 mb-sm-0'>
                <SelectDropdown
                  placeholder={"Company"}
                  data={null}
                  option={null}
                />
              </div>
              <div className='col-sm-12 col-md-2 col-lg-2 col-xl-2 mb-2 mb-sm-0'>
                <SelectDropdown
                  placeholder={"Division"}
                  data={null}
                  option={null}
                />
              </div>
              <div className='col-sm-12 col-md-3 col-lg-3 col-xl-3 mb-2 mb-sm-0'>
                <SelectDropdown
                  placeholder={"Team"}
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
            <div className='border-top'></div>
            <div className='row'>
              <div className='col-12'>
                <div className='py-2'>
                  <div className='report-summary-container'>
                    {slaViolationBarData.map((item, index) => (
                      <div
                        className='report-sla-violation-summary-item'
                        key={index}>
                        <p>{item.label}</p>
                        <h4>{item.value}</h4>
                      </div>
                    ))}
                  </div>
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
