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
import { dashboardStatisticsGraphBasedOnTeam } from "../../../api/api-client/dashboardApi";
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
export const TeamStatisticGraphFilterComponent = ({
  closeOffcanvas,
  setIsLoadingContextUpdated,
  setStatisticsTeamSummaryData,
  setStatisticsTeamGraphData,
  setPrintDateRangeForTeamStatisticsGraph,
  setDisplayTeamName,
}) => {
  const { user } = useContext(userContext);

  const [teamOptions, setTeamOptions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    fetchAllTeam()
      .then((response) => {
        setTeamOptions(
          response.data.map((option) => ({
            value: option.id,
            label: option.team_name,
          }))
        );
      })
      .catch(errorMessage)
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  const fetchStatisticGraphByTeam = (values) => {
    dashboardStatisticsGraphBasedOnTeam(values).then((response) => {
      if (response?.data?.ticketCountsTotal) {
        setStatisticsTeamSummaryData(
          response.data.ticketCountsTotal?.[0] || {}
        );
        setStatisticsTeamGraphData(response.data.ticketCounts || []);
      }
    });
  };

  const formik = useFormik({
    initialValues: {
      team: "",
      fromDate: "",
      toDate: "",
    },
    validationSchema: Yup.object({
      team: Yup.string().required("Team is required"),
    }),
    onSubmit: (values, { resetForm }) => {
      setIsLoadingContextUpdated(true);
      Promise.all([fetchStatisticGraphByTeam(values)])
        .catch(errorMessage)
        .finally(() => {
          closeOffcanvas();
          const range =
            values.fromDate && values.toDate
              ? `${moment(values.fromDate).format("ll")} - ${moment(
                  values.toDate
                ).format("ll")}`
              : printDateRangeLastThirtyDays();

          setPrintDateRangeForTeamStatisticsGraph(range);
          const selectedTeam = teamOptions?.find(
            (team) => team.value == values.team
          );
          resetForm();
          setDisplayTeamName(selectedTeam?.label);
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
              id='team'
              placeholder='Team'
              options={teamOptions}
              value={formik.values.team}
              onChange={(value) => formik.setFieldValue("team", value)}
              disabled={isLoading}
            />
          </div>
          {formik.touched.team && formik.errors.team && (
            <div className='text-danger small'>{formik.errors.team}</div>
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
