import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCircle,
  faCircleCheck,
  faGear,
} from "@fortawesome/free-solid-svg-icons";
import { faUsers } from "@fortawesome/free-solid-svg-icons";
import { faTicketSimple } from "@fortawesome/free-solid-svg-icons";
import { faTachometerAlt } from "@fortawesome/free-solid-svg-icons";
import { faPlusCircle } from "@fortawesome/free-solid-svg-icons";
import {
  faHandsHelping,
  faHandshakeSimple,
} from "@fortawesome/free-solid-svg-icons";
import {
  faFileAlt,
  faEnvelope,
  faArrowsRotate,
  faComment,
} from "@fortawesome/free-solid-svg-icons";
import {
  faChartLine,
  faEnvelopeOpen,
  faBusinessTime,
  faUserClock,
  faBuilding,
  faBuildingUser,
  faUserTie,
  faPhone,
  faUpDown,
  faFlag,
  faLock,
  faArrowAltCircleRight,
  faHeadset,
  faUser,
  faMagnifyingGlass,
} from "@fortawesome/free-solid-svg-icons";
import { faBell } from "@fortawesome/free-regular-svg-icons";

import React, { useState, useEffect } from 'react';
import { apiClient } from "../api/api-config/config";


// Sidebar API fetching function
export const fetchSidebarItems = async () => {
  try {
    const response = await apiClient.get("admin/settings/showsidebaritems");
    return response.data; // Assuming response.data contains the items for "Sidebar"
  } catch (error) {
    console.error("Error fetching sidebar items:", error);
    throw error;
  }
};

const Sidebar = () => {
  const [sidebarChildren, setSidebarChildren] = useState([]);

  // Fetch sidebar items on mount
  useEffect(() => {
    const getSidebarItems = async () => {
      try {
        const fetchedItems = await fetchSidebarItems();
        // Assuming fetchedItems is an array of items for Sidebar
        setSidebarChildren(fetchedItems);
      } catch (error) {
        console.error("Failed to load sidebar items:", error);
      }
    };

    getSidebarItems();
  }, []);





const pagePermissions = [
  {
    name: "Sidebar",
    children: sidebarChildren.length ? sidebarChildren : [
      { name: "Loading..." } // Fallback in case of loading issues
    ],
  },
  {
    name: "Dashboard",
    children: [
      { name: "Unresolved" },
      { name: "Overdue" },
      { name: "Due today" },
      { name: "Open" },
      { name: "On hold" },
      { name: "Unassigned" },
      { name: "Last 30 days" },
      { name: "Statistics" },
    ],
  },
  {
    name: "Tickets",
    children: [
      { name: "New Ticket" },
      { name: "Status" },
      { name: "Assign To" },
      { name: "SLA Missed" },
      { name: "Merge" },
      { name: "Reopen" },
      { name: "Export" },
      { name: "History-->SLA" },
      { name: "History-->Responsible Teams" },
      { name: "History-->Requester's Tickets" },
    ],
  },
  {
    name: "Reports",
    children: [
      { name: "Ticket Statistics" },
      { name: "Ticket Lifecycle" },
      { name: "Top Complaint" },
      { name: "Agent Performance" },
      { name: "SLA Violation" },
    ],
  },
];
const permissions = [
  { name: "Create" },
  { name: "Assign" },
  { name: "Close" },
  { name: "Reopen" },
  { name: "Merge" },
  { name: "Edit" },
  { name: "Reply" },
  { name: "New Client" },
  { name: "Private Note" },
];

pagePermissions.push({
  name: "Permissions",
  children: permissions,
});

};

// const permissions = [
//   {
//     name: "Create",
//   },
//   {
//     name: "Assign",
//   },
//   {
//     name: "Close",
//   },
//   {
//     name: "Reopen",
//   },
//   {
//     name: "Merge",
//   },
//   {
//     name: "Edit",
//   },
//   {
//     name: "Reply",
//   },
//   {
//     name: "New Client",
//   },
//   {
//     name: "Private Note",
//   },
// ];
