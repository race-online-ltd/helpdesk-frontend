import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { defaultThemes } from "react-data-table-component";
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
  faGlobe,
} from "@fortawesome/free-solid-svg-icons";
import {
  faFileAlt,
  faEnvelope,
  faArrowsRotate,
  faComment,
  faUserPlus,
  faBriefcase,
  faBangladeshiTakaSign,
  faCodeBranch,
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
  faCopy,
  faListOl,
} from "@fortawesome/free-solid-svg-icons";
import { faBell } from "@fortawesome/free-regular-svg-icons";

// import React, { useState, useEffect } from 'react';
// import { apiClient } from "../api/api-config/config";

// Sidebar API fetching function
// export const fetchSidebarItems = async () => {
//   try {
//     const response = await apiClient.get("admin/settings/showsidebaritems");
//     return response.data; // Assuming response.data contains the items for "Sidebar"
//   } catch (error) {
//     console.error("Error fetching sidebar items:", error);
//     throw error;
//   }
// };

// const Sidebar = () => {
//   const [sidebarChildren, setSidebarChildren] = useState([]);

//   // Fetch sidebar items on mount
//   useEffect(() => {
//     const getSidebarItems = async () => {
//       try {
//         const fetchedItems = await fetchSidebarItems();
//         // Assuming fetchedItems is an array of items for Sidebar
//         setSidebarChildren(fetchedItems);
//       } catch (error) {
//         console.error("Failed to load sidebar items:", error);
//       }
//     };

//     getSidebarItems();
//   }, []);

export const sidebarNavItems = [
  {
    id: 1,
    title: "Dashboard",
    link: "dashboard",
    icon: <FontAwesomeIcon icon={faTachometerAlt} className='fa-icon' />,
  },
  {
    id: 2,
    title: "Tickets",
    link: "tickets",
    icon: <FontAwesomeIcon icon={faTicketSimple} className='fa-icon' />,
  },
  {
    id: 3,
    title: "Reports",
    link: "reports",
    icon: <FontAwesomeIcon icon={faChartLine} className='fa-icon' />,
  },

  {
    id: 4,
    title: "Settings",
    link: "settings",
    icon: <FontAwesomeIcon icon={faGear} className='fa-icon' />,
  },
];

export const headerNavItems = [
  {
    id: 1,
    title: "Home",
    link: "/",
  },
  {
    id: 2,
    title: "Home",
    link: "/",
  },
  {
    id: 3,
    title: "Home",
    link: "/",
  },
  {
    id: 4,
    title: "Home",
    link: "/",
  },
];

export const faCopyIcon = (
  <FontAwesomeIcon icon={faCopy} className='fw-bolder' />
);
export const faMagnifyingGlassIcon = (
  <FontAwesomeIcon icon={faMagnifyingGlass} className='fw-bolder' />
);

export const faHeadSetLoginIcon = (
  <FontAwesomeIcon
    icon={faHeadset}
    size='2x'
    className='me-2 text-success fw-bold'
  />
);
export const faHeadSetIcon = (
  <FontAwesomeIcon
    icon={faHeadset}
    size='1x'
    className='me-2 text-success fw-bold'
  />
);
export const faUserIcon = (
  <FontAwesomeIcon icon={faUser} className='me-2 text-secondary' />
);
export const faUserPlusIcon = (
  <FontAwesomeIcon icon={faUserPlus} className='me-2 text-secondary' />
);
export const faLockIcon = (
  <FontAwesomeIcon icon={faLock} className='me-2 text-secondary' />
);
export const faLogoutIcon = (
  <FontAwesomeIcon
    icon={faArrowAltCircleRight}
    className='me-2 text-secondary'
  />
);
export const faFlagIcon = (
  <FontAwesomeIcon
    icon={faFlag}
    className='me-1'
    style={{ color: "var(--text-heading-color)" }}
  />
);
export const faUpDownIcon = (
  <FontAwesomeIcon
    icon={faUpDown}
    className='me-1'
    style={{ color: "var(--priority-high-color)" }}
  />
);
export const faPhoneIcon = (
  <FontAwesomeIcon
    icon={faPhone}
    className='me-1'
    style={{ color: "darkgreen" }}
  />
);

export const faBriefcaseIcon = (
  <FontAwesomeIcon
    icon={faBriefcase}
    className='me-1'
    style={{ color: "#575757" }}
  />
);

export const faListOlIcon = (
  <FontAwesomeIcon
    icon={faListOl}
    className='me-1'
    style={{ color: "darkgreen" }}
  />
);

export const faBangladeshiTakaSignIcon = (
  <FontAwesomeIcon
    icon={faBangladeshiTakaSign}
    className='me-1'
    style={{ color: "darkgreen" }}
  />
);

export const faUserTieIcon = (
  <FontAwesomeIcon
    icon={faUserTie}
    className='me-1'
    style={{ color: "#575757" }}
  />
);
export const faBuildingIcon = (
  <FontAwesomeIcon
    icon={faBuilding}
    className='me-1'
    style={{ color: "sandybrown" }}
  />
);
export const faBuildingUserIcon = (
  <FontAwesomeIcon
    icon={faBuildingUser}
    className='me-1'
    style={{ color: "indianred" }}
  />
);
export const bellIcon = (
  <FontAwesomeIcon
    icon={faBell}
    className='fs-4'
    style={{ color: "var(--button-bg-color)" }}
  />
);
export const settingIcon = <FontAwesomeIcon icon={faGear} className='me-1' />;
export const plusIcon = (
  <FontAwesomeIcon icon={faPlusCircle} className='me-1' />
);
// export const handShakeIcon = (
//   <FontAwesomeIcon
//     icon={faHandsHelping}
//     className='me-1'
//     style={{ color: "saddlebrown" }}
//   />
// );

export const faUserClockIcon = (
  <FontAwesomeIcon
    icon={faUserClock}
    className='me-1'
    style={{ color: "grey" }}
  />
);
export const faBusinessTimeIcon = (
  <FontAwesomeIcon
    icon={faBusinessTime}
    className='me-1'
    style={{ color: "grey" }}
  />
);
export const handShakeIcon = (
  <FontAwesomeIcon
    icon={faHandshakeSimple}
    className='me-1'
    style={{ color: "saddlebrown" }}
  />
);
export const commentIcon = (
  <FontAwesomeIcon
    icon={faComment}
    className='me-1'
    style={{ color: "grey" }}
  />
);

export const roleIcon = (
  <FontAwesomeIcon
    icon={faFileAlt}
    className='me-1'
    style={{ color: "darkorange" }}
  />
);
export const emailIcon = (
  <FontAwesomeIcon
    icon={faEnvelope}
    className='me-1'
    style={{ color: "teal" }}
  />
);
export const networkIcon = (
  <FontAwesomeIcon
    icon={faGlobe}
    className='me-1'
    style={{ color: "#1675e0" }}
  />
);

export const branchIcon = (
  <FontAwesomeIcon
    icon={faCodeBranch}
    className='me-1'
    style={{ color: "#1675e0" }}
  />
);

export const openIcon = (
  <FontAwesomeIcon
    icon={faEnvelopeOpen}
    className='me-1'
    style={{ color: "	#FF3131" }}
  />
);
export const closedIcon = (
  <FontAwesomeIcon
    icon={faCircleCheck}
    className='me-1'
    style={{ color: "green" }}
  />
);
export const refreshIcon = (
  <FontAwesomeIcon
    icon={faArrowsRotate}
    className='me-1'
    style={{ color: "gray" }}
  />
);

export const categoryList = [
  {
    id: 1,
    name: "Complaint",
  },
  {
    id: 2,
    name: "Feedback",
  },
  {
    id: 3,
    name: "Support Request",
  },
  {
    id: 4,
    name: "Service Request",
  },
  {
    id: 5,
    name: "Question",
  },
  {
    id: 6,
    name: "Incident",
  },
];

export const subCategoryList = [
  {
    id: 1,
    catId: 1,
    subCategory: [
      {
        id: 11,
        name: "Product Complaint",
      },
      {
        id: 12,
        name: "Service Complaint",
      },
    ],
  },
  {
    id: 2,
    catId: 2,
    subCategory: [
      {
        id: 21,
        name: "Positive Feedback",
      },
      {
        id: 22,
        name: "Negative Feedback",
      },
    ],
  },
  {
    id: 3,
    catId: 3,
    subCategory: [
      {
        id: 31,
        name: "Technical Support",
      },
      {
        id: 32,
        name: "Billing Support",
      },
    ],
  },
  {
    id: 4,
    catId: 4,
    subCategory: [
      {
        id: 41,
        name: "New Service Request",
      },
      {
        id: 42,
        name: "Modify Service Request",
      },
    ],
  },
  {
    id: 5,
    catId: 5,
    subCategory: [
      {
        id: 51,
        name: "General Question",
      },
      {
        id: 52,
        name: "Product Question",
      },
    ],
  },
  {
    id: 6,
    catId: 6,
    subCategory: [
      {
        id: 61,
        name: "Security Incident",
      },
      {
        id: 62,
        name: "Service Incident",
      },
      {
        id: 62,
        name: "Service Incident",
      },
      {
        id: 62,
        name: "Service Incident",
      },
      {
        id: 62,
        name: "Service Incident",
      },
      {
        id: 62,
        name: "Service Incident",
      },
      {
        id: 62,
        name: "Service Incident",
      },
      {
        id: 62,
        name: "Service Incident",
      },
      {
        id: 62,
        name: "Service Incident",
      },
      {
        id: 62,
        name: "Service Incident",
      },
      {
        id: 62,
        name: "Service Incident",
      },
      {
        id: 62,
        name: "Service Incident",
      },
      {
        id: 62,
        name: "Service Incident",
      },
      {
        id: 62,
        name: "Service Incident",
      },
      {
        id: 62,
        name: "Service Incident",
      },
      {
        id: 62,
        name: "Service Incident",
      },
      {
        id: 62,
        name: "Service Incident",
      },
      {
        id: 62,
        name: "Service Incident",
      },
      {
        id: 62,
        name: "Service Incident",
      },
      {
        id: 62,
        name: "Service Incident",
      },
      {
        id: 62,
        name: "Service Incident",
      },
      {
        id: 62,
        name: "Service Incident",
      },
      {
        id: 62,
        name: "Service Incident",
      },
      {
        id: 62,
        name: "Service Incident",
      },
      {
        id: 62,
        name: "Service Incident",
      },
      {
        id: 62,
        name: "Service Incident",
      },
      {
        id: 62,
        name: "Service Incident",
      },
      {
        id: 62,
        name: "Service Incident",
      },
      {
        id: 62,
        name: "Service Incident",
      },
      {
        id: 62,
        name: "Service Incident",
      },
      {
        id: 62,
        name: "Service Incident",
      },
      {
        id: 62,
        name: "Service Incident",
      },
      {
        id: 62,
        name: "Service Incident",
      },
      {
        id: 62,
        name: "Service Incident",
      },
      {
        id: 62,
        name: "Service Incident",
      },
      {
        id: 62,
        name: "Service Incident",
      },
      {
        id: 62,
        name: "Service Incident",
      },
      {
        id: 62,
        name: "Service Incident",
      },
      {
        id: 62,
        name: "Service Incident",
      },
      {
        id: 62,
        name: "Service Incident",
      },
      {
        id: 62,
        name: "Service Incident",
      },
      {
        id: 62,
        name: "Service Incident",
      },
      {
        id: 62,
        name: "Service Incident",
      },
      {
        id: 62,
        name: "Service Incident",
      },
      {
        id: 62,
        name: "Service Incident",
      },
      {
        id: 62,
        name: "Service Incident",
      },
      {
        id: 62,
        name: "Service Incident",
      },
      {
        id: 62,
        name: "Service Incident",
      },
      {
        id: 62,
        name: "Service Incident",
      },
    ],
  },
];

export const permissions = [
  {
    name: "Create",
  },
  {
    name: "Assign",
  },
  {
    name: "Close",
  },
  {
    name: "Reopen",
  },
  {
    name: "Merge",
  },
  {
    name: "Edit",
  },
  {
    name: "Reply",
  },
  {
    name: "New Client",
  },
  {
    name: "Private Note",
  },
];
export const pagePermissions = [
  {
    name: "Sidebar",
    children: [
      {
        name: "Dashboard",
      },
      {
        name: "Tickets",
      },
      {
        name: "Reports",
      },
      {
        name: "Settings",
      },
    ],
  },
  {
    name: "Dashboard",
    children: [
      {
        name: "Unresolved",
      },
      {
        name: "Overdue",
      },
      {
        name: "Due today",
      },
      {
        name: "Open",
      },
      {
        name: "On hold",
      },
      {
        name: "Unassigned",
      },
      {
        name: "Last 30 days",
      },
      {
        name: "Statistics",
      },
    ],
  },
  {
    name: "Tickets",
    children: [
      {
        name: "New Ticket",
      },
      {
        name: "New Ticket",
      },
      {
        name: "Status",
      },
      {
        name: "Assign To",
      },
      {
        name: "SLA Missed",
      },
      {
        name: "Merge",
      },
      {
        name: "Reopen",
      },
      {
        name: "Export",
      },
      {
        name: "History-->SLA",
      },
      {
        name: "History-->Responsible Teams",
      },
      {
        name: "History-->Requester's Tickets",
      },
    ],
  },
  {
    name: "Reports",
    children: [
      {
        name: "Ticket Statistics",
      },
      {
        name: "Ticket Lifecycle",
      },
      {
        name: "Top Complaint",
      },
      {
        name: "Agent Performance",
      },
      {
        name: "SLA Violation",
      },
    ],
  },
  {
    name: "Settings",
    children: [
      {
        name: "Organaization",
      },
      {
        name: "Department",
      },
      {
        name: "Team",
      },
      {
        name: "Agent",
      },
      {
        name: "Category",
      },
      {
        name: "Sub-category",
      },
      {
        name: "SLA",
      },
      {
        name: "Client",
      },
      {
        name: "Role",
      },
      {
        name: "Email",
      },
    ],
  },
];

// const pagePermissions = [
//   {
//     name: "Sidebar",
//     children: sidebarChildren.length ? sidebarChildren : [
//       { name: "Loading..." } // Fallback in case of loading issues
//     ],
//   },
//   {
//     name: "Dashboard",
//     children: [
//       { name: "Unresolved" },
//       { name: "Overdue" },
//       { name: "Due today" },
//       { name: "Open" },
//       { name: "On hold" },
//       { name: "Unassigned" },
//       { name: "Last 30 days" },
//       { name: "Statistics" },
//     ],
//   },
//   {
//     name: "Tickets",
//     children: [
//       { name: "New Ticket" },
//       { name: "Status" },
//       { name: "Assign To" },
//       { name: "SLA Missed" },
//       { name: "Merge" },
//       { name: "Reopen" },
//       { name: "Export" },
//       { name: "History-->SLA" },
//       { name: "History-->Responsible Teams" },
//       { name: "History-->Requester's Tickets" },
//     ],
//   },
//   {
//     name: "Reports",
//     children: [
//       { name: "Ticket Statistics" },
//       { name: "Ticket Lifecycle" },
//       { name: "Top Complaint" },
//       { name: "Agent Performance" },
//       { name: "SLA Violation" },
//     ],
//   },
// ];
// };

// export const dashboardPermission = [
//   "Open",
//   "Closed",
//   "SLA Violated (first response)",
//   "SLA Violated (service time)",
// ];

export const iconMapping = {
  Open: "bi bi-arrow-clockwise",
  // Pending: "bi bi-clock",
  "In Progress": "bi bi-hourglass-split",
  // "On Hold": "bi bi-pause-circle",
  "Request Resolved": "bi bi-send-check",
  Closed: "bi bi-check-circle",
};

export const USER_TICKET_VALIDATION_MESSAGES = {
  SELECT_ONE_TICKET: "Please select a single ticket to assign.",
  SELECT_AT_LEAST_ONE: "Please select a ticket.",
  INVALID_STATUS: "Invalid status selected.",
  COLOSE_ALLOW: "You do not have privilege to close the external ticket.",
  TICKET_STATUS_CLOSED: "Closed ticket can't be CLOSED.",
  TICKET_STATUS_OPEN: "Closed ticket can't be OPEN.",
  TICKET_NO_DETAILS: "Self ticket has no details to view.",
  RCA_ALLOW:
    "You do not have privilege to provide RCA for the external ticket.",
};

export const tableCustomStyles = {
  header: {
    style: {
      minHeight: "56px",
    },
  },
  headRow: {
    style: {
      borderTopStyle: "solid",
      borderTopWidth: "1px",
      borderTopColor: defaultThemes.default.divider.default,
      background: "#EBEFF3",
      fontWeight: "bold",
    },
  },
  headCells: {
    style: {
      "&:not(:last-of-type)": {
        borderRightStyle: "solid",
        borderRightWidth: "1px",
        borderRightColor: defaultThemes.default.divider.default,
      },
    },
  },
  rows: {
    style: {
      "&:hover": {
        backgroundColor: "var(--secondary-bg-color)",
        cursor: "pointer",
      },
    },
  },
  cells: {
    style: {
      "&:not(:last-of-type)": {
        borderRightStyle: "solid",
        borderRightWidth: "1px",
        borderRightColor: defaultThemes.default.divider.default,
      },
    },
  },
};
