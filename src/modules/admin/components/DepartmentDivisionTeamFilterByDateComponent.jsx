import React, { useContext, useEffect, useRef, useState } from "react";
import moment from "moment";
import * as Yup from "yup";
import { DateRangePicker, Stack } from "rsuite";
import subDays from "date-fns/subDays";
import startOfWeek from "date-fns/startOfWeek";
import endOfWeek from "date-fns/endOfWeek";
import addDays from "date-fns/addDays";
import startOfMonth from "date-fns/startOfMonth";
import endOfMonth from "date-fns/endOfMonth";
import addMonths from "date-fns/addMonths";
import { faMagnifyingGlassIcon } from "../../../data/data";
import { userContext } from "../../context/UserContext";
import { useFormik } from "formik";
import {
  dashboardStatisticsBasedOnDepartment,
  dashboardStatisticsBasedOnDivision,
  dashboardStatisticsBasedOnTeam,
  dashboardStatisticsGraphBasedOnTeam,
} from "../../../api/api-client/dashboardApi";
import { errorMessage } from "../../../api/api-config/apiResponseMessage";
import { printDateRangeLastThirtyDays, toUTC } from "../../../utils/utility";
import { SelectDropdown } from "./SelectDropdown";
import { fetchAllTeam } from "../../../api/api-client/settings/teamApi";

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
export const DepartmentDivisionTeamFilterByDateComponent = ({
  closeOffcanvas,
  setTeamData,
  setDivisionData,
  setDepartmentData,
  setPrintDateRange,
  setIsLoadingTeamStatisticsAllEntities,
  setIsLoadingDivisionStatisticsAllEntities,
  setIsLoadingDepartmentStatisticsAllEntities,
  setActiveTab,
}) => {
  const { user } = useContext(userContext);
  const [isLoading, setIsLoading] = useState(false);

  const fetchDashboardStatisticsTeam = (values) => {
    return dashboardStatisticsBasedOnTeam(values).then((response) => {
      setTeamData(response.data);
    });
  };

  const fetchDashboardStatisticsDivision = (values) => {
    return dashboardStatisticsBasedOnDivision(values).then((response) => {
      setDivisionData(response.data);
    });
  };

  const fetchDashboardStatisticsDepartment = (values) => {
    return dashboardStatisticsBasedOnDepartment(values).then((response) => {
      setDepartmentData(response.data);
    });
  };

  const formik = useFormik({
    initialValues: {
      filterId: "",
      fromDate: "",
      toDate: "",
    },
    validationSchema: Yup.object({
      filterId: Yup.string().required("Filter is required"),
      fromDate: Yup.string().required("Date is required"),
    }),
    onSubmit: (values, { resetForm }) => {
      closeOffcanvas();
      setActiveTab(values.filterId);
      const range =
        values.fromDate && values.toDate
          ? `${moment(values.fromDate).format("ll")} - ${moment(
              values.toDate
            ).format("ll")}`
          : printDateRangeLastThirtyDays();
      setPrintDateRange(range);

      let apiCall;

      switch (values.filterId) {
        case "team":
          apiCall = fetchDashboardStatisticsTeam(values);
          setIsLoadingTeamStatisticsAllEntities(true);
          break;
        case "division":
          apiCall = fetchDashboardStatisticsDivision(values);
          setIsLoadingDivisionStatisticsAllEntities(true);
          break;
        case "department":
          apiCall = fetchDashboardStatisticsDepartment(values);
          setIsLoadingDepartmentStatisticsAllEntities(true);
          break;
        default:
          console.error("Invalid filter selected");
          setIsLoading(false);
          return;
      }
      apiCall
        .then(() => {
          resetForm();
        })
        .catch(errorMessage)
        .finally(() => {
          setIsLoading(false);
          setIsLoadingTeamStatisticsAllEntities(false);
          setIsLoadingDivisionStatisticsAllEntities(false);
          setIsLoadingDepartmentStatisticsAllEntities(false);
        });
    },
  });
  const clearDateRange = () => {
    formik.setFieldValue("fromDate", "");
    formik.setFieldValue("toDate", "");
  };
  return (
    <section>
      <form onSubmit={formik.handleSubmit} className='row'>
        <div className='col-6 mb-2 mb-sm-0'>
          <div className='input-group'>
            <SelectDropdown
              id='filterId'
              placeholder='Filter By'
              options={[
                { value: "department", label: "Department" },
                { value: "division", label: "Division" },
                { value: "team", label: "Team" },
              ]}
              value={formik.values.filterId}
              onChange={(value) => {
                formik.setFieldValue("filterId", value);
              }}
              disabled={isLoading}
            />
          </div>
          {formik.touched.filterId && formik.errors.filterId && (
            <div className='text-danger small'>{formik.errors.filterId}</div>
          )}
        </div>
        <div className={`col-6 mb-2 mb-sm-0`}>
          <DateRangePicker
            ranges={predefinedRanges}
            placeholder='Select Date Range'
            style={{ width: "100%", margin: "auto" }}
            value={
              formik.values.fromDate && formik.values.toDate
                ? [formik.values.fromDate, formik.values.toDate]
                : []
            }
            onClean={() => clearDateRange()}
            onChange={(value) => {
              if (value) {
                formik.setFieldValue("fromDate", toUTC(value[0]));
                formik.setFieldValue("toDate", toUTC(value[1]));
              }
            }}
          />
          {formik.touched.fromDate && formik.errors.fromDate && (
            <div className='text-danger small'>{formik.errors.fromDate}</div>
          )}
        </div>

        <div className='d-flex justify-content-end gap-3 bg-light p-3 position-absolute bottom-0 end-0'>
          <button type='button' className='btn-button' onClick={closeOffcanvas}>
            Cancel
          </button>
          <button type='submit' className='custom-btn-for-canvas'>
            Search
          </button>
        </div>
      </form>
    </section>
  );
};
