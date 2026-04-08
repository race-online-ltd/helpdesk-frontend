import React, { useContext, useEffect, useRef, useState } from "react";
import { DateRangePicker, Stack } from "rsuite";
import DataTable from "react-data-table-component";
import { defaultThemes } from "react-data-table-component";

import { useFormik } from "formik";
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
import {
  fetchLocalClientsByBusinessEntityId,
  ticketLifeCycleReport,
} from "../../../../api/api-client/reportsApi";
import { errorMessage } from "../../../../api/api-config/apiResponseMessage";
import { userContext } from "../../../context/UserContext";
import { fetchCompany } from "../../../../api/api-client/settings/companyApi";
import { fetchAllTeam } from "../../../../api/api-client/settings/teamApi";
import { ExportToExcel } from "../ExportToExcel";

export const TicketLifecycle = () => {
  const { user } = useContext(userContext);
  const [reportFilter, setReportFilter] = useState(false);
  const [dynamicHeaders, setDynamicHeaders] = useState([]);
  const [ticketLifeCycleData, setTicketLifeCycleData] = useState([]);

  const [isLoading, setIsLoading] = useState(false);
  const [isReportLoading, setIsReportLoading] = useState(false);

  const [isClientLoading, setIsClientLoading] = useState(false);

  const [businessEntityOptions, setBusinessEntityOptions] = useState([]);
  const [teamOptions, setTeamOptions] = useState([]);
  const [localClientOptions, setLocalClientOptions] = useState([]);

  const [selectedBusinessEntity, setSelectedBusinessEntity] = useState(null);
  const [selectedAllTeams, setSelectedAllTeams] = useState(null);

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

  const getDynamicHeaders = (data) => {
    const headers = [
      "Ticket No.",
      "Business Entity",
      "Client Name",
      "Category [Subcategory]",
      "Created",
    ];

    // const maxLevels = Math.max(...data.map((ticket) => ticket.levels.length));
    const maxLevels = Math.max(
      ...data.map((ticket) =>
        Array.isArray(ticket.levels) ? ticket.levels.length : 0
      )
    );

    for (let i = 0; i < maxLevels; i++) {
      headers.push(`Level ${i + 1}`);
    }

    return headers;
  };

  const getDynamicRows_old = (ticket, maxLevels) => {
    const rows = [
      ticket.ticket_number,
      ticket.company_name,
      ticket.client_name,
      ticket.category_subcategory,
      ticket.created_at,
    ];

    for (let i = 0; i < maxLevels; i++) {
      const level = ticket.levels[i];
      if (level) {
        const levelData = `<div class="">
  <p><i class='bi bi-person-fill me-1'></i> Agent : ${level.agent || "-"}</p>
  <p><i class='bi bi-person-fill me-1'></i> Assigned To Agent : ${level.assigned_agent || "-"}</p>

 <p> <i class='bi bi-people-fill me-1'></i> Assigned To Team : ${
   level.assigned_to || "-"
 }</p>
  <p class=""><i class='bi bi-chat-dots me-1'></i> Comment : ${
    level.comment || "-"
  }</p>
  
  <p><i class='bi bi-clock me-1'></i> Age : ${level.ticket_age || "-"}</p>
  <p><i class='bi bi-calendar me-1'></i> Date & Time : ${
    level.updated_at || "-"
  }</p>
 <p> <i class='bi bi-stopwatch-fill me-1'></i> SLA : ${level.sla || "-"}</p>
 <p>
  <i class='bi bi-flag me-1'></i> SLA Status : ${
    level.sla_status === 2 ? 'Started' : 
    level.sla_status === 1 ? 'Success' : 
    level.sla_status === 0 ? 'Failed' : '-'
  }
</p>
  <p><i class='bi bi-flag-fill me-1'></i> Status : ${
    level.ticket_status || "-"
  }</p>
  </div> `;
        rows.push(levelData);
      } else {
        rows.push("");
      }
    }

    return rows;
  };
  const getDynamicRows = (ticket, maxLevels) => {
    const rows = [
      ticket.ticket_number,
      ticket.company_name,
      ticket.client_name,
      ticket.category_subcategory,
      ticket.created_at,
    ];

    if (Array.isArray(ticket.levels)) {
      for (let i = 0; i < maxLevels; i++) {
        const level = ticket.levels[i];
        if (level) {
          const levelData = `
            <div class="">
              <p><i class='bi bi-person-fill me-1'></i> Agent: ${
                level.agent || "-"
              }</p>
              <p><i class='bi bi-person-fill me-1'></i> Assigned To Agent : ${level.assigned_agent || "-"}</p>
              <p><i class='bi bi-people-fill me-1'></i> Assigned To Team: ${
                level.assigned_to || "-"
              }</p>
              <p><i class='bi bi-chat-dots me-1'></i> Comment: ${
                level.comment || "-"
              }</p>
              <p><i class='bi bi-clock me-1'></i> Age: ${
                level.ticket_age || "-"
              }</p>
              <p><i class='bi bi-calendar me-1'></i> Date & Time: ${
                level.updated_at || "-"
              }</p>
              <p>
                <i class='bi bi-flag me-1'></i> SLA Status : ${
                  level.sla_status === 2 ? 'Started' : 
                  level.sla_status === 1 ? 'Success' : 
                  level.sla_status === 0 ? 'Failed' : '-'
                }
              </p>
              
              <p><i class='bi bi-flag-fill me-1'></i> Status: ${
                level.ticket_status || "-"
              }</p>
            </div>
          `;
          rows.push(levelData);
        } else {
          rows.push("");
        }
      }
    }

    return rows;
  };

  useEffect(() => {
    setIsLoading(true);
    const fetchCompanyOptions = () => {
      fetchCompany({
        userType: user?.type,
        userId: user?.id,
      }).then((response) =>
        setBusinessEntityOptions(
          response.result.map((option) => ({
            value: option.id,
            label: option.company_name,
          }))
        )
      );
    };

    Promise.all([fetchCompanyOptions()])
      .catch(errorMessage)
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  useEffect(() => {
    setIsLoading(true);
    const fetchAllTeamOptions = () => {
      fetchAllTeam({
        userType: user?.type,
        userId: user?.id,
      }).then((response) =>
        setTeamOptions(
          response.data.map((option) => ({
            value: option.id,
            label: option.team_name,
          }))
        )
      );
    };

    Promise.all([fetchAllTeamOptions()])
      .catch(errorMessage)
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  useEffect(() => {
    if (selectedBusinessEntity != null) {
      setIsClientLoading(true);
      fetchLocalClientsByBusinessEntityId(selectedBusinessEntity)
        .then((response) => {
          setLocalClientOptions(
            response.data.map((option) => ({
              value: option.id,
              label: option.fullname,
            }))
          );
        })
        .catch(errorMessage)
        .finally(() => setIsClientLoading(false));
    }
  }, [selectedBusinessEntity]);

  const data = {
    labels: ticketStatisticsBarData.map((data) => data.label),
    datasets: [
      {
        label: "",
        data: ticketStatisticsBarData.map((data) => data.value),
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
      businessEntity: "",
      allTeams: "",
      localClients: "",
      fromDate: "",
      toDate: "",
    },
    onSubmit: (values, { resetForm }) => {
      setIsReportLoading(true);
      ticketLifeCycleReport(values)
        .then((response) => {
          const dynamicHeaderss = getDynamicHeaders(response);
          setDynamicHeaders(dynamicHeaderss);
          setTicketLifeCycleData(response);
        })
        .catch(errorMessage)
        .finally(() => {
          setIsReportLoading(false);
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
        className={`row mb-3 ${
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
                <SelectDropdown
                  id='businessEntity'
                  placeholder=' Business Entity'
                  options={businessEntityOptions}
                  value={formik.values.businessEntity}
                  onChange={(value) => {
                    setSelectedBusinessEntity(value);
                    formik.setFieldValue("businessEntity", value);
                  }}
                  disabled={isLoading}
                />
              </div>

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
                      formik.setFieldValue("fromDate", value[0]);
                      formik.setFieldValue("toDate", value[1]);
                    }
                  }}
                />
              </div>

              <div className='col-sm-12 col-md-3 col-lg-3 col-xl-3 mb-2 mb-sm-0'>
                <SelectDropdown
                  id='localClients'
                  placeholder='Clients'
                  options={localClientOptions}
                  value={formik.values.localClients}
                  onChange={(value) =>
                    formik.setFieldValue("localClients", value)
                  }
                  disabled={isClientLoading}
                />
              </div>

              <div className='col-sm-12 col-md-2 col-lg-2 col-xl-2 mb-2 mb-sm-0'>
                <SelectDropdown
                  id='allTeams'
                  placeholder='Teams'
                  options={teamOptions}
                  value={formik.values.allTeams}
                  onChange={(value) => {
                    setSelectedAllTeams(value);
                    formik.setFieldValue("allTeams", value);
                  }}
                  disabled={isLoading}
                />
              </div>

              <div className='col-auto'>
                <button
                  type='submit'
                  className='custom-btn'
                  disabled={isReportLoading ? true : false}>
                  {faMagnifyingGlassIcon}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* <ReportDataTable
          data={ticketLifeCycleData}
          columns={templateColumns}
          isLoading={isLoading}
        /> */}

      <div className='row'>
        <div className='col-12'>
          <div className='bg-white px-2'>
            {isReportLoading ? (
              <h6 className='text-center fw-bolder'>Loading...</h6>
            ) : (
              <>
                <button
                  type='button'
                  className='btn-button float-end mb-2'
                  disabled={ticketLifeCycleData.length === 0 ? true : false}
                  onClick={() => {
                    // const maxLevels = Math.max(
                    //   ...ticketLifeCycleData.map((t) => t.levels.length)
                    // );
                    const maxLevels = Math.max(
                      ...ticketLifeCycleData.map((t) =>
                        Array.isArray(t.levels) ? t.levels.length : 0
                      )
                    );

                    TicketLifeCycleExportToExcel(
                      ticketLifeCycleData,
                      dynamicHeaders,
                      maxLevels,
                      "Ticket_Lifecycle_Report.xlsx"
                    );
                  }}>
                  <i className='bi bi-file-earmark-excel-fill text-success'></i>
                  Export
                </button>
                <div
                  style={{ width: "100%", height: "350px", overflow: "auto" }}>
                  <table className='table table-bordered'>
                    <thead style={{ position: "sticky", top: "0" }}>
                      <tr>
                        {dynamicHeaders &&
                          dynamicHeaders.map((header, index) => (
                            <th key={index}>{header}</th>
                          ))}
                      </tr>
                    </thead>
                    <tbody>
                      {ticketLifeCycleData &&
                        ticketLifeCycleData.map((ticket, ticketIndex) => {
                          // const maxLevels = Math.max(
                          //   ...ticketLifeCycleData.map((t) => t.levels.length)
                          // );
                          const maxLevels = Math.max(
                            ...ticketLifeCycleData.map((t) =>
                              Array.isArray(t.levels) ? t.levels.length : 0
                            )
                          );

                          return (
                            <tr key={ticketIndex} className=''>
                              {getDynamicRows(ticket, maxLevels).map(
                                (value, valueIndex) => (
                                  <td
                                    style={{
                                      minWidth: "180px",
                                      maxWidth: "450px",
                                      verticalAlign: "middle",
                                    }}
                                    className='text-start'
                                    key={valueIndex}
                                    dangerouslySetInnerHTML={{
                                      __html: value,
                                    }}></td>
                                )
                              )}
                            </tr>
                          );
                        })}
                    </tbody>
                  </table>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

import { FullPageLoader } from "../loader/FullPageLoader";
import { TicketLifeCycleExportToExcel } from "../TicketLifeCycleExportToExcel";

