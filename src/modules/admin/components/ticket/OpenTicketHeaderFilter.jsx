import React, { useContext, useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { DateRangePicker } from "rsuite";
import * as Yup from "yup";
import subDays from "date-fns/subDays";
import startOfWeek from "date-fns/startOfWeek";
import endOfWeek from "date-fns/endOfWeek";
import addDays from "date-fns/addDays";
import startOfMonth from "date-fns/startOfMonth";
import endOfMonth from "date-fns/endOfMonth";
import addMonths from "date-fns/addMonths";
import {
  faMagnifyingGlassIcon,
  plusIcon,
  settingIcon,
} from "../../../../data/data";
import { SelectDropdown } from "../SelectDropdown";
import { useFormik } from "formik";
import { errorMessage } from "../../../../api/api-config/apiResponseMessage";
import { fetchAllTeam } from "../../../../api/api-client/settings/teamApi";
import { fetchCompany } from "../../../../api/api-client/settings/companyApi";
import { fetchTicketByStatusAndDefaultEntity } from "../../../../api/api-client/ticketApi";
import { toUTC } from "../../../../utils/utility";
import { userContext } from "../../../context/UserContext";
import { useUserRolePermissions } from "../../../custom-hook/useUserRolePermissions";

export const OpenTicketHeaderFilter = ({
  setIsLoading,
  ticketFilter,
  setTikcetData,
  activeTab,
}) => {
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
  const { hasPermission } = useUserRolePermissions();

  const { user } = useContext(userContext);
  const [businessEntityOptions, setBusinessEntityOptions] = useState([]);
  const [teamOptions, setTeamOptions] = useState([]);
  const [slaMissedOptions, setSlaMissedOptions] = useState([
    { value: "0", label: "First Response Violated" },
    { value: "0", label: "Resolved Violated" },
  ]);

  const [orbitOptions, setOrbitOptions] = useState([
    { value: "ENTITY", label: "Partner" },
    { value: "SID", label: "Single User" },
  ]);

  const [isSearching, setIsSearching] = useState(false);
  const [isDropdowLoading, setIsDropdowLoading] = useState(false);

  useEffect(() => {
    formik.setFieldValue("status", activeTab || "");
    // formik.setFieldValue("businessEntity", user?.default_entity_id || "");
    formik.setFieldValue("userType", user?.type || "");
    formik.setFieldValue("userId", user?.id || "");
  }, [activeTab, user]);

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

    const fetchTeamOptions = () => {
      fetchAllTeam().then((response) => {
        setTeamOptions(
          response.data.map((option) => ({
            value: option.id,
            label: option.team_name,
          }))
        );
      });
    };

    Promise.all([fetchCompanyOptions(), fetchTeamOptions()])
      .catch(errorMessage)
      .finally(() => setIsDropdowLoading(false));
  }, []);

  const formik = useFormik({
    initialValues: {
      businessEntity: "",
      // team: "",
      team1: "",
      slaMissed: "",
      orbit: "",
      fromDate: "",
      toDate: "",
      status: "",
      userType: "",
      userId: "",
      ticketNumber: "",
    },
    validationSchema: Yup.object({
      ticketNumber: Yup.number()
        .typeError("Ticket number must be a number")
        .integer("Ticket number must be an integer"),
    }),

    onSubmit: (values, { resetForm }) => {
      setIsSearching(true);
      setIsLoading(true);
      fetchTicketByStatusAndDefaultEntity(values)
        .then((response) => {
          setTikcetData(response.data);
        })
        .catch(errorMessage)
        .finally(() => {
          setIsLoading(false);
          setIsSearching(false);
          resetForm();
          formik.setFieldValue("status", activeTab || "");
          // formik.setFieldValue("businessEntity", user?.default_entity_id || "");
          formik.setFieldValue("userType", user?.type || "");
          formik.setFieldValue("userId", user?.id || "");
        });
    },
  });

  const applyMargin = () => {
    setTimeout(() => {
      const popup = document.querySelector(".rs-picker-popup");
      if (popup) {
        popup.style.marginLeft = "-150px";
      }
    }, 0);
  };
  const clearDateRange = () => {
    formik.setFieldValue("fromDate", null);
    formik.setFieldValue("toDate", null);
  };
  return (
    <div
      className={`px-2 pt-3 row d-flex justify-content-center ${
        ticketFilter
          ? "d-block animate__animated animate__fadeInLeft"
          : "ticket-filter-container "
      }`}>
      <div className='col-12 col-md-12'>
        <form
          onSubmit={formik.handleSubmit}
          className='row d-flex align-items-center justify-content-center'>
          {hasPermission("Filter_BusinessEntity") && (
            <div className='col-sm-12 col-md-2 col-lg-2 col-xl-2 mb-2 mb-sm-0'>
              <SelectDropdown
                id='businessEntity'
                placeholder=' Business Entity'
                options={businessEntityOptions}
                value={formik.values.businessEntity}
                onChange={(value) =>
                  formik.setFieldValue("businessEntity", value)
                }
                disabled={isDropdowLoading}
              />
            </div>
          )}

          {hasPermission("Filter_Team") && (
            <div className='col-sm-12 col-md-2 col-lg-2 col-xl-2 mb-2 mb-sm-0'>
              <SelectDropdown
                id='team1'
                placeholder='Team'
                options={teamOptions}
                value={formik.values.team1}
                onChange={(value) => formik.setFieldValue("team1", value)}
                disabled={isDropdowLoading}
              />
            </div>
          )}
          {hasPermission("Filter_SLA") && (
            <div className='col-sm-12 col-md-2 col-lg-2 col-xl-2 mb-2 mb-sm-0'>
              <SelectDropdown
                id='slaMissed'
                placeholder='SLA'
                options={slaMissedOptions}
                value={formik.values.slaMissed}
                onChange={(value) => formik.setFieldValue("slaMissed", value)}
                disabled={isDropdowLoading}
              />
            </div>
          )}
          {hasPermission("Filter_Partner") && (
            <div className='col-sm-12 col-md-2 col-lg-2 col-xl-2 mb-2 mb-sm-0'>
              <SelectDropdown
                id='orbit'
                placeholder='Partner / User'
                options={orbitOptions}
                value={formik.values.orbit}
                onChange={(value) => formik.setFieldValue("orbit", value)}
                disabled={isDropdowLoading}
              />
            </div>
          )}
          <div className='col-sm-12 col-md-2 col-lg-2 col-xl-2 pe-0 mb-2 mb-sm-0'>
            <DateRangePicker
              ranges={predefinedRanges}
              placeholder='Select Date Range'
              // style={{ width: 300 }}
              onOpen={applyMargin}
              // onShortcutClick={(shortcut, event) => {
              //   console.log(shortcut);
              // }}
              onClean={() => clearDateRange()}
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
          <div className='col-sm-12 col-md-1 col-lg-1 col-xl-1 mb-2 mb-sm-0'>
            <input
              type='text'
              id='ticketNumber'
              placeholder='Ticket No.'
              className='form-control'
              onChange={(e) =>
                formik.setFieldValue("ticketNumber", e.target.value)
              }
              value={formik.values.ticketNumber}
              onBlur={formik.handleBlur}
            />
            {formik.touched.ticketNumber && formik.errors.ticketNumber && (
              <div className='text-danger'>{formik.errors.ticketNumber}</div>
            )}
          </div>
          <div className='col-sm-12 col-md-1 col-lg-1 col-xl-1'>
            <button
              disabled={isSearching}
              type='submit'
              className='custom-btn d-block w-100'>
              {faMagnifyingGlassIcon}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
