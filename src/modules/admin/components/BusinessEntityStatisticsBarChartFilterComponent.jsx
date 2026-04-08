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
  getTicketSummaryByBusinessEntity,
} from "../../../api/api-client/dashboardApi";
import { errorMessage } from "../../../api/api-config/apiResponseMessage";
import { printDateRangeLastThirtyDays, toUTC } from "../../../utils/utility";
import { SelectDropdown } from "./SelectDropdown";
import { fetchAllTeam } from "../../../api/api-client/settings/teamApi";
import { fetchCompany } from "../../../api/api-client/settings/companyApi";
import { get } from "lodash/get";

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
export const BusinessEntityStatisticsBarChartFilterComponent = ({
  closeOffcanvas,
  setIsLoadingContextUpdated,
  setTicketbusinessEntityWiseSummaryData,
  setPrintDateRangeForCreatedVsClosed,
  setDisplayBusinessEntityName,
}) => {
  const { user } = useContext(userContext);

  const [businessEntityOptions, setBusinessEntityOptions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    fetchCompany({
      userType: user?.type,
      userId: user?.id,
    })
      .then((response) => {
        setBusinessEntityOptions(
          response.result.map((option) => ({
            value: option.id,
            label: option.company_name,
          }))
        );
      })
      .catch(errorMessage)
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  const fetchTicketSummaryByBusinessEntity = (values) => {
    getTicketSummaryByBusinessEntity(values).then((response) => {
      setTicketbusinessEntityWiseSummaryData(response.data);
    });
  };

  const formik = useFormik({
    initialValues: {
      businessEntity: "",
      fromDate: "",
      toDate: "",
    },
    validationSchema: Yup.object({
      businessEntity: Yup.string().required("BusinessEntity is required"),
    }),
    onSubmit: (values, { resetForm }) => {
      setIsLoadingContextUpdated(true);
      Promise.all([fetchTicketSummaryByBusinessEntity(values)])
        .catch(errorMessage)
        .finally(() => {
          closeOffcanvas();
          const range =
            values.fromDate && values.toDate
              ? `${moment(values.fromDate).format("ll")} - ${moment(
                  values.toDate
                ).format("ll")}`
              : printDateRangeLastThirtyDays();

          setPrintDateRangeForCreatedVsClosed(range);
          const selectedTeam = businessEntityOptions?.find(
            (entity) => entity.value == values.businessEntity
          );
          resetForm();
          setDisplayBusinessEntityName(selectedTeam?.label);
          setIsLoadingContextUpdated(false);
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
              id='businessEntity'
              placeholder='Business Entity'
              options={businessEntityOptions}
              value={formik.values.businessEntity}
              onChange={(value) =>
                formik.setFieldValue("businessEntity", value)
              }
              disabled={isLoading}
            />
          </div>
          {formik.touched.businessEntity && formik.errors.businessEntity && (
            <div className='text-danger small'>
              {formik.errors.businessEntity}
            </div>
          )}
        </div>

        <div className={`col-6 mb-sm-0`}>
          <DateRangePicker
            ranges={predefinedRanges}
            placeholder='Select Date Range'
            style={{ width: 300 }}
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
