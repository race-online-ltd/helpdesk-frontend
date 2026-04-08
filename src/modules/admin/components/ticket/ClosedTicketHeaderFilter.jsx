import React, { useState } from "react";
import { Link } from "react-router-dom";
import { DateRangePicker, Stack } from "rsuite";
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

export const ClosedTicketHeaderFilter = ({ ticketFilter, setActiveTab }) => {
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

  return (
    <div
      className={`px-2 pt-3 row d-flex justify-content-center ${
        ticketFilter
          ? "d-block animate__animated animate__fadeInLeft"
          : "ticket-filter-container "
      }`}>
      <div className='col-12 col-sm-8'>
        <div className='row d-flex align-items-center'>
          <div className='col-sm-12 col-md-4 col-lg-4 col-xl-4 mb-2 mb-sm-0'>
            <select className='form-select' defaultValue='Company'>
              <option value='Organization'>Company</option>
              <option value='1'>Earth Telecommunication Limited</option>
              <option value='2'>Race Online Limited</option>
              <option value='3'>Orbit</option>
              <option value='4'>Digital Square Limited</option>
              <option value='5'>Creative Bangladesh</option>
            </select>
          </div>
          <div className='col-sm-12 col-md-3 col-lg-3 col-xl-3 mb-2 mb-sm-0'>
            <select className='form-select' defaultValue='Team'>
              <option value='Team'>Team</option>
              <option value='1'>IT & Billing</option>
              <option value='2'>Call Center</option>
              <option value='3'>System</option>
              <option value='4'>Buisness</option>
              <option value='5'>Transmission</option>
            </select>
          </div>
          <div className='col-sm-12 col-md-3 col-lg-3 col-xl-3 mb-2 mb-sm-0'>
            <DateRangePicker
              ranges={predefinedRanges}
              placeholder='Select Date Range'
              style={{ width: 300 }}
              onShortcutClick={(shortcut, event) => {
                console.log(shortcut);
              }}
            />
          </div>
          <div className='col-sm-12 col-md-2 col-lg-2 col-xl-2'>
            <button type='button' className='custom-btn d-block w-100'>
              {faMagnifyingGlassIcon}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
