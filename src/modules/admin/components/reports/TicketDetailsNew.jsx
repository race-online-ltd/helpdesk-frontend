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
import { ticketNewDetailsReport } from '../../../../api/api-client/reportsApi';
import { errorMessage } from '../../../../api/api-config/apiResponseMessage';
import { userContext } from '../../../context/UserContext';
import { fetchCompany } from '../../../../api/api-client/settings/companyApi';
import { fetchSubcategoryAll } from '../../../../api/api-client/settings/subCategoryApi';
import { fetchCategoryAll } from '../../../../api/api-client/settings/categoryApi';
import * as XLSX from 'xlsx';
import { toUTC } from '../../../../utils/utility';
import { htmlToPlainText } from '../../../../utils/utility';

export const TicketDetailsNew = () => {
  const { user } = useContext(userContext);
  const [reportFilter, setReportFilter] = useState(false);
  const [dynamicHeaders, setDynamicHeaders] = useState([]);
  const [ticketReportDetails, setTicketReportDetails] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isReportLoading, setIsReportLoading] = useState(false);
  const [businessEntityOptions, setBusinessEntityOptions] = useState([]);
  const [subCatOptions, setSubCatOptions] = useState([]);
  const [categoryOptions, setCategoryOptions] = useState([]);
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
    return [
      'Ticket_Number',
      'Business_Entity',
      'Team',
      'Client_Name',
      'Category',
      'Sub_Category',
      'ID',
      'Status',
      'Age',
      'Branch_Name',
      'Element_Name',
      'Element_List',
      'Element_List_A',
      'Element_List_B',
      'Created_by',
      'Created_Team',
      'Created_Time',
      'Closed_by',
      'Closed_Team',
      'Closed_Time',
      'Last_Comment',
      'Last_Commented_by',
      'Last_Commented_Team',
      'Last_Comment_Time',
      'RCA_Comment',
      'RCA_by',
      'RCA_Team',
      'RCA_Time',
      'Complaint_Number',
      'Escalation_Count',
    ];
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
      fetchCategoryAll({ userType: user?.type, userId: user?.id })
        .then((response) => {
          setCategoryOptions(
            response.data.map((option) => ({
              value: option.id,
              label: option.category_in_english,
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
    const fetchSubcategoryAllOptions = () => {
      fetchSubcategoryAll({ userType: user?.type, userId: user?.id })
        .then((response) =>
          setSubCatOptions(
            response.data.map((option) => ({
              value: option.id,
              label: option.sub_category_in_english,
            }))
          )
        )
        .catch(errorMessage)
        .finally(() => setIsLoading(false));
    };

    fetchSubcategoryAllOptions();
  }, [user]);

  const formik = useFormik({
    initialValues: {
      businessEntity: '',
      allSubcat: '',
      allCategory: '',
      status: '',
      fromDate: '',
      toDate: '',
      dateFilterType: 'created_at', // Default to 'created_at'
    },
    onSubmit: (values, { resetForm }) => {
      if (!values.fromDate || !values.toDate) {
        alert('Please select a date range.');
        return;
      }

      setIsReportLoading(true);
      // Pass the dateFilterType to the API call
      ticketNewDetailsReport({
        ...values,
        dateFilterType: values.dateFilterType,
      })
        .then((response) => {
          console.log('API Response:', response);
          setDynamicHeaders(getDynamicHeaders());
          setTicketReportDetails(response.data || []);
          setCurrentPage(1);
        })
        .catch(errorMessage)
        .finally(() => {
          setIsReportLoading(false);
          // resetForm(); // Kept commented out as per previous preference
        });
    },
  });

  const handleDateRangeChange = (value) => {
    if (value) {
      formik.setFieldValue('fromDate', value[0]);
      formik.setFieldValue('toDate', value[1]);
      setSelectedDateRange(value);
    } else {
      formik.setFieldValue('fromDate', '');
      formik.setFieldValue('toDate', '');
      setSelectedDateRange(null);
    }
  };

  // New handler for dateFilterType change
  const handleDateFilterTypeChange = (value) => {
    formik.setFieldValue('dateFilterType', value);
    if (value === 'updated_at') {
      formik.setFieldValue('status', 'Closed');
    } else {
      formik.setFieldValue('status', ''); // Clear status when "Created Date" is selected
    }
  };

  const formatDateRange = (dateRange) => {
    if (!dateRange || !dateRange[0] || !dateRange[1]) return ''; // Added null checks for safety
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

  const clearDateRange = () => {
    formik.setFieldValue('fromDate', '');
    formik.setFieldValue('toDate', '');
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
              <div className="col-sm-12 col-md-3 col-lg-2 col-xl-2 mb-2 mb-sm-0">
                <SelectDropdown
                  id="businessEntity"
                  placeholder="Business Entity"
                  options={businessEntityOptions}
                  value={formik.values.businessEntity}
                  onChange={(value) => formik.setFieldValue('businessEntity', value)}
                />
              </div>

              {/* Select for Date Filter Type */}
              <div className="col-sm-12 col-md-3 col-lg-2 col-xl-2 mb-2 mb-sm-0">
                <SelectDropdown
                  id="dateFilterType"
                  placeholder="Filter By Date" // Keeping placeholder for consistent look, initial value handles default selection
                  options={[
                    {
                      label: 'Created Date',
                      value: 'created_at',
                    },
                    {
                      label: 'Closed Date',
                      value: 'updated_at',
                    },
                  ]}
                  value={formik.values.dateFilterType}
                  onChange={handleDateFilterTypeChange} // Using new handler
                />
              </div>

              <div className="col-sm-12 col-md-3 col-lg-2 col-xl-2 mb-2 mb-sm-0">
                <DateRangePicker
                  ranges={predefinedRanges}
                  placeholder="Select Date Range"
                  style={{ width: '100%' }}
                  value={
                    formik.values.fromDate && formik.values.toDate
                      ? [new Date(formik.values.fromDate), new Date(formik.values.toDate)]
                      : []
                  }
                  onClean={() => clearDateRange()}
                  onChange={(value) => {
                    if (value) {
                      formik.setFieldValue('fromDate', toUTC(value[0]));
                      formik.setFieldValue('toDate', toUTC(value[1]));
                    }
                  }}
                />
              </div>
              <div className="col-sm-12 col-md-2 col-lg-2 col-xl-2 mb-2 mb-sm-0">
                <SelectDropdown
                  id="allCategory"
                  placeholder="Category"
                  options={categoryOptions}
                  value={formik.values.allCategory}
                  onChange={(value) => formik.setFieldValue('allCategory', value)}
                />
              </div>
              <div className="col-sm-12 col-md-2 col-lg-2 col-xl-2 mb-2 mb-sm-0">
                <SelectDropdown
                  id="allSubcat"
                  placeholder="Sub-Category"
                  options={subCatOptions}
                  value={formik.values.allSubcat}
                  onChange={(value) => formik.setFieldValue('allSubcat', value)}
                />
              </div>
              <div className="col-sm-12 col-md col-lg col-xl mb mb-sm-0">
                <SelectDropdown
                  id="status"
                  placeholder="Status"
                  options={[
                    { label: 'Open', value: 'Open' },
                    { label: 'Closed', value: 'Closed' },
                  ]}
                  value={formik.values.status}
                  onChange={(value) => formik.setFieldValue('status', value)}
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
                      onClick={() =>
                        exportToExcel(ticketReportDetails, 'Ticket_Details_Report.xlsx')
                      }
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
                        backgroundColor: 'white', // Added for sticky header visibility
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
                            // <td
                            //     key={
                            //         headerIndex
                            //     }
                            // >
                            //     {
                            //         ticket[
                            //             header
                            //         ]
                            //     }
                            // </td>
                            <td key={headerIndex}>
                              {['Last_Comment', 'RCA_Comment'].includes(header)
                                ? htmlToPlainText(ticket[header])
                                : ticket[header]}
                            </td>
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
