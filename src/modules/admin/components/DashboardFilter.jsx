import React, { useContext, useEffect, useRef, useState } from "react";
import moment from "moment";
import { DateRangePicker, Stack } from "rsuite";
import subDays from "date-fns/subDays";
import startOfWeek from "date-fns/startOfWeek";
import endOfWeek from "date-fns/endOfWeek";
import addDays from "date-fns/addDays";
import startOfMonth from "date-fns/startOfMonth";
import endOfMonth from "date-fns/endOfMonth";
import addMonths from "date-fns/addMonths";
import { faMagnifyingGlassIcon } from "../../../data/data";
import { fetchCompany } from "../../../api/api-client/settings/companyApi";
import { SelectDropdown } from "./SelectDropdown";
import { useFormik } from "formik";
import { errorMessage } from "../../../api/api-config/apiResponseMessage";
import {
  dashboardStatisticsBasedOnDepartment,
  dashboardStatisticsBasedOnDivision,
  dashboardStatisticsBasedOnTeam,
  dashboardSummary,
  dashboardLastThirtyDays,
} from "../../../api/api-client/dashboardApi";
import { printDateRangeLastThirtyDays, toUTC } from "../../../utils/utility";
import { userContext } from "../../context/UserContext";
import { useUserRolePermissions } from "../../custom-hook/useUserRolePermissions";

export const DashboardFilter = ({
  setSummaryData,
  setLastThirtyDaysSummaryData,
  setLastThirtyDaysGraphData,

  setPrintDateRange,
}) => {
  const { user } = useContext(userContext);
  const { hasPermission } = useUserRolePermissions();
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
  const [businessEntityOptions, setBusinessEntityOptions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isOpenDahboardFilter, setIsOpenDahboardFilter] = useState(false);

  useEffect(() => {
    const fetchCompanyOptions = () =>
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

    Promise.all([fetchCompanyOptions()])
      .catch(errorMessage)
      .finally(() => setIsLoading(false));
  }, []);

  const formik = useFormik({
    initialValues: {
      businessEntity: user?.default_entity_id || "",
      fromDate: "",
      toDate: "",
      userType: user?.type,
      userId: user?.id,
    },
    onSubmit: (values, { resetForm }) => {
      const range =
        values.fromDate && values.toDate
          ? `${moment(values.fromDate).format("ll")} - ${moment(
              values.toDate
            ).format("ll")}`
          : printDateRangeLastThirtyDays();
      setPrintDateRange(range);

      const fetchDashboardSummary = () => {
        dashboardSummary(values).then((response) => {
          setSummaryData(response.data[0] ? response.data[0] : []);
        });
      };

      const fetchDashboardLastThirtyDays = () => {
        dashboardLastThirtyDays(values).then((response) => {
          setLastThirtyDaysSummaryData(response.data.summary);
          setLastThirtyDaysGraphData(response.data.opencloseByLast30Days);
        });
      };

      Promise.all([fetchDashboardSummary(), fetchDashboardLastThirtyDays()])
        .catch(errorMessage)
        .finally(() => {
          setIsLoading(false);
          resetForm();
          formik.setFieldValue("businessEntity", values.businessEntity);
        });
    },
  });

  return (
    <div className={`header-filter mb-3 `}>
      <div className={`container-fluid `}>
        <form
          onSubmit={formik.handleSubmit}
          className='row d-flex justify-content-center align-items-center py-2'>
          {hasPermission("Business_Entity_Filter") && (
            <div className='col-sm-12 col-md-3 col-lg-3 col-xl-3 mb-2 mb-sm-0 '>
              <div className='input-group d-flex align-items-center'>
                <SelectDropdown
                  id='businessEntity'
                  placeholder='Business entity'
                  options={businessEntityOptions}
                  value={formik.values.businessEntity}
                  onChange={(value) =>
                    formik.setFieldValue("businessEntity", value)
                  }
                  disabled={isLoading}
                />

                <button
                  type='button'
                  className='btn-button d-block d-sm-none ms-2'
                  onClick={() =>
                    setIsOpenDahboardFilter(!isOpenDahboardFilter)
                  }>
                  <i className='bi bi-filter'></i>
                </button>
              </div>
            </div>
          )}
          {hasPermission("Can_View_Responsive_Filter_Button") && (
            <button
              type='button'
              className='btn-button d-block d-sm-none ms-2'
              onClick={() => setIsOpenDahboardFilter(!isOpenDahboardFilter)}>
              <i className='bi bi-filter'></i>
            </button>
          )}
          <div
            className={`col-12 col-md-3 mb-2 mb-sm-0 ${
              isOpenDahboardFilter
                ? "d-block animate__animated animate__fadeInLeft"
                : "ticket-filter-container "
            }`}>
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

          <div
            className={`col-12 col-md-2 ${
              isOpenDahboardFilter
                ? "d-block animate__animated animate__fadeInLeft"
                : "ticket-filter-container "
            }`}>
            <button type='submit' className='custom-btn w-100'>
              {faMagnifyingGlassIcon}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
