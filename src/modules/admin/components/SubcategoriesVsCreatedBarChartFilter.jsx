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
  dashboardStatisticsGraphBasedOnTeam,
  dashboardSubcategoryVsCreated,
  getTicketSummaryByBusinessEntity,
} from "../../../api/api-client/dashboardApi";
import { errorMessage } from "../../../api/api-config/apiResponseMessage";
import { printDateRangeLastThirtyDays, toUTC } from "../../../utils/utility";
import { SelectDropdown } from "./SelectDropdown";
import { fetchAllTeam } from "../../../api/api-client/settings/teamApi";
import { fetchCompany } from "../../../api/api-client/settings/companyApi";
import { get } from "lodash/get";
import { fetchDivision } from "../../../api/api-client/settings/divisionApi";
import { fetchDepartment } from "../../../api/api-client/settings/departmentApi";

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
export const SubcategoriesVsCreatedBarChartFilter = ({
  closeOffcanvas,
  setIsLoadingContextUpdated,
  setSubcategoryVsCreatedGraphData,
  setPrintDateRangeForSubcategoryVsCreated,
  setDisplayNameForSubcategoryVsCreated,
}) => {
  const { user } = useContext(userContext);

  const [businessEntityOptions, setBusinessEntityOptions] = useState([]);
  const [departmentOptions, setDepartmentOptions] = useState([]);
  const [divisionOptions, setDivisionOptions] = useState([]);
  const [teamOptions, setTeamOptions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setIsLoading(true);
    const fetchBusinessEntityOption = () => {
      fetchCompany({
        userType: user?.type,
        userId: user?.id,
      }).then((response) => {
        setBusinessEntityOptions(
          response.result.map((option) => ({
            value: option.id,
            label: option.company_name,
          }))
        );
      });
    };
    const fetchDepartmentOptions = () => {
      fetchDepartment().then((response) => {
        setDepartmentOptions(
          response.result.map((option) => ({
            value: option.id,
            label: option.department_name,
          }))
        );
      });
    };

    const fetchDivisionOptions = () => {
      fetchDivision().then((response) => {
        setDivisionOptions(
          response.data.map((option) => ({
            value: option.id,
            label: option.division_name,
          }))
        );
      });
    };
    const fetchAllTeamOption = () => {
      fetchAllTeam().then((response) => {
        setTeamOptions(
          response.data.map((option) => ({
            value: option.id,
            label: option.team_name,
          }))
        );
      });
    };
    Promise.all([
      fetchBusinessEntityOption(),
      fetchDepartmentOptions(),
      fetchDivisionOptions(),
      fetchAllTeamOption(),
    ])
      .catch(errorMessage)
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  const fetchSubcategoryWiseFilterData = (values) => {
    dashboardSubcategoryVsCreated(values).then((response) => {
      setSubcategoryVsCreatedGraphData(response.data);
    });
  };

  const formik = useFormik({
    initialValues: {
      filterId: "",
      businessId: "",
      departmentId: "",
      divisionId: "",
      teamId: "",
      fromDate: "",
      toDate: "",
    },

    validationSchema: Yup.object({
      filterId: Yup.string().required("Filter type is required"),
      businessId: Yup.string()
        .nullable()
        .when("filterId", {
          is: "business_entity",
          then: (schema) => schema.required("Business Entity is required"),
        }),
      departmentId: Yup.string()
        .nullable()
        .when("filterId", {
          is: "department",
          then: (schema) => schema.required("Department is required"),
        }),
      divisionId: Yup.string()
        .nullable()
        .when("filterId", {
          is: "division",
          then: (schema) => schema.required("Division is required"),
        }),
      teamId: Yup.string()
        .nullable()
        .when("filterId", {
          is: "team",
          then: (schema) => schema.required("Team is required"),
        }),
    }),

    onSubmit: (values, { resetForm }) => {
      setIsLoadingContextUpdated(true);
      Promise.all([fetchSubcategoryWiseFilterData(values)])
        .catch(errorMessage)
        .finally(() => {
          closeOffcanvas();
          const range =
            values.fromDate && values.toDate
              ? `${moment(values.fromDate).format("ll")} - ${moment(
                  values.toDate
                ).format("ll")}`
              : printDateRangeLastThirtyDays();

          setPrintDateRangeForSubcategoryVsCreated(range);

          const optionsMap = {
            business_entity: {
              key: "businessId",
              options: businessEntityOptions,
            },
            team: { key: "teamId", options: teamOptions },
            department: { key: "departmentId", options: departmentOptions },
            division: { key: "divisionId", options: divisionOptions },
          };

          const selectedConfig = optionsMap[values.filterId] || {};
          const selectedValue = values[selectedConfig.key] ?? null;
          const selectedEntity = selectedConfig.options?.find(
            (entity) => entity.value === selectedValue
          );

          setDisplayNameForSubcategoryVsCreated(selectedEntity?.label || "");
          setIsLoadingContextUpdated(false);
          resetForm();
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
                { value: "business_entity", label: "Business Entity" },
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
            style={{ width: "300px" }}
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
        </div>

        {formik.values.filterId === "business_entity" && (
          <div className='col-12 mt-3 mb-sm-0'>
            <div className='input-group'>
              <SelectDropdown
                id='businessId'
                placeholder='Business Entity'
                options={businessEntityOptions}
                value={formik.values.businessId}
                onChange={(value) => formik.setFieldValue("businessId", value)}
                disabled={isLoading}
              />
            </div>
            {formik.touched.businessId && formik.errors.businessId && (
              <div className='text-danger small'>
                {formik.errors.businessId}
              </div>
            )}
          </div>
        )}

        {formik.values.filterId === "department" && (
          <div className='col-12 mt-3 mb-sm-0'>
            <div className='input-group'>
              <SelectDropdown
                id='departmentId'
                placeholder='Select Department'
                options={departmentOptions}
                value={formik.values.departmentId}
                onChange={(value) =>
                  formik.setFieldValue("departmentId", value)
                }
                disabled={isLoading}
              />
            </div>
            {formik.touched.departmentId && formik.errors.departmentId && (
              <div className='text-danger small'>
                {formik.errors.departmentId}
              </div>
            )}
          </div>
        )}

        {formik.values.filterId === "division" && (
          <div className='col-12 mt-3 mb-sm-0'>
            <div className='input-group'>
              <SelectDropdown
                id='divisionId'
                placeholder='Select Division'
                options={divisionOptions}
                value={formik.values.divisionId}
                onChange={(value) => formik.setFieldValue("divisionId", value)}
                disabled={isLoading}
              />
            </div>
            {formik.touched.divisionId && formik.errors.divisionId && (
              <div className='text-danger small'>
                {formik.errors.divisionId}
              </div>
            )}
          </div>
        )}

        {formik.values.filterId === "team" && (
          <div className='col-12 mt-3 mb-sm-0'>
            <div className='input-group'>
              <SelectDropdown
                id='teamId'
                placeholder='Select Team'
                options={teamOptions}
                value={formik.values.teamId}
                onChange={(value) => formik.setFieldValue("teamId", value)}
                disabled={isLoading}
              />
            </div>
            {formik.touched.teamId && formik.errors.teamId && (
              <div className='text-danger small'>{formik.errors.teamId}</div>
            )}
          </div>
        )}

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
