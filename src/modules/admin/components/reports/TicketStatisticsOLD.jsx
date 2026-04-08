import React, { useContext, useEffect, useState } from "react";
import { DateRangePicker, Stack } from "rsuite";
import subDays from "date-fns/subDays";
import startOfWeek from "date-fns/startOfWeek";
import endOfWeek from "date-fns/endOfWeek";
import addDays from "date-fns/addDays";
import startOfMonth from "date-fns/startOfMonth";
import endOfMonth from "date-fns/endOfMonth";
import addMonths from "date-fns/addMonths";
import { SelectDropdown } from "../SelectDropdown";
import { ticketStatisticsBarData } from "../../../../data/chart";
import { BarChartComponent } from "../graph/BarChartComponent";
import { faMagnifyingGlassIcon } from "../../../../data/data";
import { ReportDataTable } from "../ReportDataTable";
import { statisticsReport } from "../../../../api/api-client/reportsApi";
import { errorMessage } from "../../../../api/api-config/apiResponseMessage";
import { useFormik } from "formik";
import { userContext } from "../../../context/UserContext";
import { toUTC } from "../../../../utils/utility";
import React from "react";

export const TicketStatisticsOLD = () => {
  const { user } = useContext(userContext);
  const [reportFilter, setReportFilter] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  // const [activeData, setActiveData] = useState('statistics');
  const [statisticsData, setStatisticsData] = useState([]);
  const [statisticsDataGraph, setStatisticsDataGraph] = useState([]);

  const [teamTicketData, setTeamTicketData] = useState([]);

  const predefinedRanges = [
    {
      label: "Today",
      value: [toUTC(new Date()), toUTC(new Date())],
      placement: "left",
    },
    {
      label: "Yesterday",
      value: [toUTC(addDays(new Date(), -1)), toUTC(addDays(new Date(), -1))],
      placement: "left",
    },
    {
      label: "This week",
      value: [toUTC(startOfWeek(new Date())), toUTC(endOfWeek(new Date()))],
      placement: "left",
    },
    {
      label: "Last 7 days",
      value: [toUTC(subDays(new Date(), 6)), toUTC(new Date())],
      placement: "left",
    },
    {
      label: "Last 30 days",
      value: [toUTC(subDays(new Date(), 29)), toUTC(new Date())],
      placement: "left",
    },
    {
      label: "This month",
      value: [toUTC(startOfMonth(new Date())), toUTC(new Date())],
      placement: "left",
    },
    {
      label: "Last month",
      value: [
        toUTC(startOfMonth(addMonths(new Date(), -1))),
        toUTC(endOfMonth(addMonths(new Date(), -1))),
      ],
      placement: "left",
    },
  ];

  useEffect(() => {
    setIsLoading(true);
    const fetchStatisticsData = () => {
      statisticsReport({
        fromDate: "",
        toDate: "",
      }).then((response) => {
        setStatisticsData(response.data.details);
        setStatisticsDataGraph(response.data.summary);
        setTeamTicketData(response.data.teamTicket);
      });
    };

    Promise.all([fetchStatisticsData()])
      .catch(errorMessage)
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  const templateColumns = [
    {
      name: "Id",
      selector: (row, index) => index + 1,
      sortable: true,
    },

    // {
    //   name: "Company",
    //   selector: (row) => row.company_name,
    //   sortable: true,
    // },
    {
      name: "Division",
      selector: (row) => row.division_name,
      sortable: true,
    },
    {
      name: "Team",
      selector: (row) => row.team_name,
      sortable: true,
    },
    {
      name: "Open",
      selector: (row) => row.ticket_open_by_team,
      sortable: true,
    },
    {
      name: "Closed",
      selector: (row) => row.ticket_closed_by_team,
      sortable: true,
    },
    {
      name: "First Response Violated",
      selector: (row) => row.over_due_fr,
      sortable: true,
    },

    {
      name: "Service Time Violated",
      selector: (row) => row.over_due,
      sortable: true,
    },
    {
      name: "Avg. First Response Time",
      selector: (row) => row.average_time,
      sortable: true,
    },

    {
      name: "Avg. Service Time",
      selector: (row) => row.average_srv_time,
      sortable: true,
    },
  ];

  const graph = {
    labels:
      statisticsDataGraph && statisticsDataGraph.map((data) => data.label),
    datasets: [
      {
        label: "",
        data:
          statisticsDataGraph && statisticsDataGraph.map((data) => data.value),

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

  const formik = useFormik({
    initialValues: {
      fromDate: "",
      toDate: "",
    },
    onSubmit: (values, { resetForm }) => {
      setIsLoading(true);
      statisticsReport(values)
        .then((response) => {
          setStatisticsData(response.data.details);
          setStatisticsDataGraph(response.data.summary);
          setTeamTicketData(response.data.teamTicket);
        })
        .catch(errorMessage)
        .finally(() => {
          setIsLoading(false);
          resetForm();
        });
    },
  });

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
            <form
              onSubmit={formik.handleSubmit}
              className='row d-flex align-items-center h-100 justify-content-center'>
              <div className='col-sm-12 col-md-3 col-lg-3 col-xl-3 mb-2 mb-sm-0'>
                <DateRangePicker
                  ranges={predefinedRanges}
                  placeholder='Select Date Range'
                  style={{ width: 300 }}
                  // onShortcutClick={(shortcut, event) => {
                  //   console.log(shortcut);
                  // }}
                  value={
                    formik.values.fromDate && formik.values.toDate
                      ? [formik.values.fromDate, formik.values.toDate]
                      : []
                  }
                  onChange={(value) => {
                    if (value) {
                      formik.setFieldValue("fromDate", toUTC(value[0]));
                      formik.setFieldValue("toDate", toUTC(value[1]));
                    }
                  }}
                />
              </div>

              {/* <div className='col-sm-12 col-md-3 col-lg-3 col-xl-3 mb-2 mb-sm-0'>
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
              </div> */}

              <div className='col-auto'>
                <button type='submit' className='custom-btn'>
                  {faMagnifyingGlassIcon}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
      <div className='row'>
        <div className='col-12 col-sm-10 offset-sm-1'>
          <div className='my-3 border rounded'>
            <div className='row'>
              <div className='col-12'>
                <div className='p-4'>
                  <BarChartComponent data={graph} options={options} />
                </div>
              </div>
            </div>
            <div className='border-top'></div>
            <div className='row'>
              <div className='col-12'>
                <div className='py-2'>
                  <div className='report-summary-container'>
                    {statisticsDataGraph &&
                      statisticsDataGraph.map((item, index) => (
                        <div className='report-summary-item' key={index}>
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
      <ReportDataTable data={statisticsData} columns={templateColumns} />
      {/* <ReportDataTable 
        data={activeData === 'statistics' ? statisticsData : teamTicketData} 
        columns={templateColumns} 
      /> */}
    </>
  );
};
