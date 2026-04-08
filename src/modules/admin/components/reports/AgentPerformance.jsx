import React, { useContext, useEffect, useState } from 'react';
import { DateRangePicker } from 'rsuite';
import { useFormik } from 'formik';
import subDays from 'date-fns/subDays';
import startOfWeek from 'date-fns/startOfWeek';
import endOfWeek from 'date-fns/endOfWeek';
import addDays from 'date-fns/addDays';
import startOfMonth from 'date-fns/startOfMonth';
import endOfMonth from 'date-fns/endOfMonth';
import addMonths from 'date-fns/addMonths';
import { SelectDropdown } from '../SelectDropdown';
import { getAgentPerformance } from '../../../../api/api-client/reportsApi';
import { errorMessage } from '../../../../api/api-config/apiResponseMessage';
import { userContext } from '../../../context/UserContext';
import { fetchCompany } from '../../../../api/api-client/settings/companyApi';
import { fetchAgentAll } from '../../../../api/api-client/settings/agentApi';
import { fetchCategoryAll } from '../../../../api/api-client/settings/categoryApi';
import { fetchSubcategoryAll } from '../../../../api/api-client/settings/subCategoryApi';
import { fetchAllTeam } from '../../../../api/api-client/settings/teamApi';
import * as XLSX from 'xlsx'; // Import XLSX for Excel export

export const AgentPerformance = () => {
  const { user } = useContext(userContext);
  const [reportFilter, setReportFilter] = useState(false);
  const [dynamicHeaders, setDynamicHeaders] = useState([]);
  const [ticketReportDetails, setTicketReportDetails] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isReportLoading, setIsReportLoading] = useState(false);
  const [businessEntityOptions, setBusinessEntityOptions] = useState([]);
  const [subCatOptions, setSubCatOptions] = useState([]);
  const [teamOptions, setTeamOptions] = useState([]);
  const [categoryOptions, setCategoryOptions] = useState([]);
  const [agentOptions, setAgentOptions] = useState([]);
  const [selectedDateRange, setSelectedDateRange] = useState(null);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(20);

  const predefinedRanges = [
    { label: 'Today', value: [new Date(), new Date()], placement: 'left' },
    {
      label: 'Yesterday',
      value: [addDays(new Date(), -1), addDays(new Date(), -1)],
      placement: 'left',
    },
    {
      label: 'This week',
      value: [startOfWeek(new Date()), endOfWeek(new Date())],
      placement: 'left',
    },
    {
      label: 'Last 7 days',
      value: [subDays(new Date(), 6), new Date()],
      placement: 'left',
    },
    {
      label: 'Last 30 days',
      value: [subDays(new Date(), 29), new Date()],
      placement: 'left',
    },
    {
      label: 'This month',
      value: [startOfMonth(new Date()), new Date()],
      placement: 'left',
    },
    {
      label: 'Last month',
      value: [startOfMonth(addMonths(new Date(), -1)), endOfMonth(addMonths(new Date(), -1))],
      placement: 'left',
    },
  ];

  const getDynamicHeaders = () => {
    return ['Agent', 'Team', 'Created', 'Closed', 'Commented', 'Escalated', 'Total'];
  };

  useEffect(() => {
    setIsLoading(true);
    const fetchCompanyOptions = () => {
      fetchCompany({ userType: user?.type, userId: user?.id })
        .then((response) => {
          setBusinessEntityOptions(
            response.result.map((option) => ({
              value: option.id,
              label: option.company_name,
            }))
          );
        })
        .catch(errorMessage)
        .finally(() => setIsLoading(false));
    };

    fetchCompanyOptions();
  }, [user]);

  useEffect(() => {
    setIsLoading(true);
    const fetchCategoryAllOptions = () => {
      fetchAgentAll({ userType: user?.type, userId: user?.id })
        .then((response) => {
          setAgentOptions(
            response.data.map((option) => ({
              value: option.id,
              label: option.fullname,
            }))
          );
        })
        .catch(errorMessage)
        .finally(() => setIsLoading(false));
    };

    fetchCategoryAllOptions();
  }, [user]);

  useEffect(() => {
    setIsLoading(true);
    const fetchAllTeamOptions = () => {
      fetchAllTeam({ userType: user?.type, userId: user?.id })
        .then((response) =>
          setTeamOptions(
            response.data.map((option) => ({
              value: option.id,
              label: option.team_name,
            }))
          )
        )
        .catch(errorMessage)
        .finally(() => setIsLoading(false));
    };

    fetchAllTeamOptions();
  }, [user]);

  const formik = useFormik({
    initialValues: {
      allTeam: '',
      allAgent: '',
      fromDate: '',
      toDate: '',
    },
    onSubmit: (values, { resetForm }) => {
      if (!values.fromDate || !values.toDate) {
        alert('Please select a date range.');
        return;
      }

      const payload = {
        ...values,
        fromDate: values.fromDate.toISOString(),
        toDate: values.toDate.toISOString(),
      };
      setIsReportLoading(true);
      getAgentPerformance(payload)
        .then((response) => {
          setDynamicHeaders(getDynamicHeaders());
          setTicketReportDetails(response.data || []);
          setCurrentPage(1);
        })
        .catch(errorMessage)
        .finally(() => {
          setIsReportLoading(false);
          resetForm();
        });
    },
  });

  // const handleDateRangeChange = (value) => {
  //     if (value) {
  //         formik.setFieldValue("fromDate", value[0]);
  //         formik.setFieldValue("toDate", value[1]);
  //         setSelectedDateRange(value);
  //     } else {
  //         formik.setFieldValue("fromDate", "");
  //         formik.setFieldValue("toDate", "");
  //         setSelectedDateRange(null);
  //     }
  // };

  const handleDateRangeChange = (value) => {
    if (value) {
      const offsetMs = 6 * 60 * 60 * 1000; // +6 hours in milliseconds

      const fromDateLocal = new Date(value[0].getTime() + offsetMs);
      const toDateLocal = new Date(value[1].getTime() + offsetMs);

      formik.setFieldValue('fromDate', fromDateLocal);
      formik.setFieldValue('toDate', toDateLocal);
      setSelectedDateRange([fromDateLocal, toDateLocal]);
    } else {
      formik.setFieldValue('fromDate', '');
      formik.setFieldValue('toDate', '');
      setSelectedDateRange(null);
    }
  };

  const formatDateRange = (dateRange) => {
    if (!dateRange) return '';
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return `${dateRange[0].toLocaleDateString(
      'en-US',
      options
    )} - ${dateRange[1].toLocaleDateString('en-US', options)}`;
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = ticketReportDetails.slice(indexOfFirstItem, indexOfLastItem);

  const totalPages = Math.ceil(ticketReportDetails.length / itemsPerPage);

  const getPageNumbers = () => {
    const pageNumbers = [];
    const maxVisiblePages = 3;

    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i);
      }
    } else {
      if (currentPage <= 4) {
        for (let i = 1; i <= 5; i++) {
          pageNumbers.push(i);
        }
        pageNumbers.push('...');
        pageNumbers.push(totalPages);
      } else if (currentPage >= totalPages - 3) {
        pageNumbers.push(1);
        pageNumbers.push('...');
        for (let i = totalPages - 4; i <= totalPages; i++) {
          pageNumbers.push(i);
        }
      } else {
        pageNumbers.push(1);
        pageNumbers.push('...');
        for (let i = currentPage - 1; i <= currentPage + 1; i++) {
          pageNumbers.push(i);
        }
        pageNumbers.push('...');
        pageNumbers.push(totalPages);
      }
    }

    return pageNumbers;
  };

  const paginate = (pageNumber) => {
    if (pageNumber === '...') return;
    setCurrentPage(pageNumber);
  };

  // Export to Excel function
  const exportToExcel = (data, fileName) => {
    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
    XLSX.writeFile(wb, fileName);
  };

  return (
    <>
      <button
        type="button"
        className="btn-button report-filter-btn"
        onClick={() => setReportFilter(!reportFilter)}
      >
        <i className="bi bi-filter me-2"></i>Filter
      </button>
      <div
        className={`row mb-3 ${
          reportFilter ? 'd-block animate__animated animate__fadeInLeft' : 'report-filter-container'
        }`}
      >
        <div className="col-12">
          <div className="px-2">
            <form
              onSubmit={formik.handleSubmit}
              className="row d-flex align-items-center h-100 justify-content-center"
            >
              <div className="col-sm-12 col-md-2 col-lg-2 col-xl-2 mb-2 mb-sm-0">
                <SelectDropdown
                  id="allTeam"
                  placeholder="Team"
                  options={teamOptions}
                  value={formik.values.allTeam}
                  onChange={(value) => formik.setFieldValue('allTeam', value)}
                  disabled={isLoading || formik.values.allAgent}
                />
              </div>

              <div className="col-sm-12 col-md-2 col-lg-2 col-xl-2 mb-2 mb-sm-0">
                <SelectDropdown
                  id="allAgent"
                  placeholder="Agent"
                  options={agentOptions}
                  value={formik.values.allAgent}
                  onChange={(value) => formik.setFieldValue('allAgent', value)}
                  disabled={isLoading || formik.values.allTeam}
                />
              </div>

              <div className="col-sm-12 col-md-3 col-lg-3 col-xl-3 mb-2 mb-sm-0">
                <DateRangePicker
                  ranges={predefinedRanges}
                  placeholder="Select Date Range"
                  style={{ width: 300 }}
                  value={
                    formik.values.fromDate && formik.values.toDate
                      ? [formik.values.fromDate, formik.values.toDate]
                      : []
                  }
                  onChange={handleDateRangeChange}
                />
              </div>

              <div className="col-auto">
                <button
                  type="submit"
                  className="custom-btn"
                  disabled={isReportLoading || !formik.values.fromDate || !formik.values.toDate}
                  title={
                    !formik.values.fromDate || !formik.values.toDate
                      ? 'Please select date range'
                      : ''
                  }
                >
                  <i className="bi bi-search"></i>
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      <div className="row">
        <div className="col-12">
          <div className="bg-white px-2">
            {isReportLoading ? (
              <h6 className="text-center fw-bolder">Loading...</h6>
            ) : (
              <>
                <div className="d-flex justify-content-between align-items-center mb-2">
                  <div>
                    <button
                      type="button"
                      className="btn-button"
                      disabled={ticketReportDetails.length === 0}
                      onClick={() => exportToExcel(ticketReportDetails, 'Agent_Performance.xlsx')}
                    >
                      <i className="bi bi-file-earmark-excel-fill text-success"></i>
                      Export
                    </button>
                  </div>
                  <div>
                    {selectedDateRange && (
                      <span
                        className="text-muted"
                        style={{
                          fontWeight: 'bold',
                          color: 'black',
                        }}
                      >
                        {formatDateRange(selectedDateRange)}
                      </span>
                    )}
                  </div>
                </div>
                <div
                  style={{
                    width: '100%',
                    height: '350px',
                    overflow: 'auto',
                  }}
                >
                  <table className="table table-bordered">
                    <thead
                      style={{
                        position: 'sticky',
                        top: '0',
                      }}
                    >
                      <tr>
                        {dynamicHeaders.map((header, index) => (
                          <th key={index}>{header}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {currentItems.map((ticket, ticketIndex) => (
                        <tr key={ticketIndex}>
                          {dynamicHeaders.map((header, headerIndex) => (
                            <td key={headerIndex}>{ticket[header]}</td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Pagination Controls */}
                <div className="d-flex justify-content-center mt-3">
                  <button
                    className="btn btn-sm btn-outline-primary mx-1"
                    onClick={() => paginate(currentPage - 1)}
                    disabled={currentPage === 1}
                  >
                    Previous
                  </button>
                  {getPageNumbers().map((number, index) => (
                    <button
                      key={index}
                      className={`btn btn-sm mx-1 ${
                        currentPage === number ? 'btn-primary' : 'btn-outline-primary'
                      }`}
                      onClick={() => paginate(number)}
                      disabled={number === '...'}
                    >
                      {number}
                    </button>
                  ))}
                  <button
                    className="btn btn-sm btn-outline-primary mx-1"
                    onClick={() => paginate(currentPage + 1)}
                    disabled={currentPage === totalPages}
                  >
                    Next
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
};
