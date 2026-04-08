// import React, { useContext, useEffect, useState } from "react";
// import { DateRangePicker } from "rsuite";
// import * as Yup from "yup";
// import subDays from "date-fns/subDays";
// import startOfWeek from "date-fns/startOfWeek";
// import endOfWeek from "date-fns/endOfWeek";
// import addDays from "date-fns/addDays";
// import startOfMonth from "date-fns/startOfMonth";
// import endOfMonth from "date-fns/endOfMonth";
// import addMonths from "date-fns/addMonths";
// import { SelectDropdown } from "../SelectDropdown";
// import { useFormik } from "formik";
// import { errorMessage } from "../../../../api/api-config/apiResponseMessage";
// import { fetchAllTeam } from "../../../../api/api-client/settings/teamApi";
// import { fetchCompany } from "../../../../api/api-client/settings/companyApi";
// import {
//   fetchTicketByStatusAndDefaultEntity,
//   fetchDistricts,
//   fetchDivisions,
//   fetchAggregators,
//   fetchBranches,
//   fetchAgents,
//   getClientListFromLocal,
// } from "../../../../api/api-client/ticketApi";
// import { toUTC } from "../../../../utils/utility";
// import { userContext } from "../../../context/UserContext";
// import { useUserRolePermissions } from "../../../custom-hook/useUserRolePermissions";

// export const AdvancedTicketFilter = ({
//   setIsLoading,
//   setTikcetData,
//   activeTab,
//   isOpen,
//   onClose,
// }) => {
//   const predefinedRanges = [
//     {
//       label: "Today",
//       value: [toUTC(new Date()), toUTC(new Date())],
//       placement: "left",
//     },
//     {
//       label: "Yesterday",
//       value: [toUTC(addDays(new Date(), -1)), toUTC(addDays(new Date(), -1))],
//       placement: "left",
//     },
//     {
//       label: "This week",
//       value: [toUTC(startOfWeek(new Date())), toUTC(endOfWeek(new Date()))],
//       placement: "left",
//     },
//     {
//       label: "Last 7 days",
//       value: [toUTC(subDays(new Date(), 6)), toUTC(new Date())],
//       placement: "left",
//     },
//     {
//       label: "Last 30 days",
//       value: [toUTC(subDays(new Date(), 29)), toUTC(new Date())],
//       placement: "left",
//     },
//     {
//       label: "This month",
//       value: [toUTC(startOfMonth(new Date())), toUTC(new Date())],
//       placement: "left",
//     },
//     {
//       label: "Last month",
//       value: [
//         toUTC(startOfMonth(addMonths(new Date(), -1))),
//         toUTC(endOfMonth(addMonths(new Date(), -1))),
//       ],
//       placement: "left",
//     },
//   ];

//   const { hasPermission } = useUserRolePermissions();
//   const { user } = useContext(userContext);

//   const [businessEntityOptions, setBusinessEntityOptions] = useState([]);
//   const [teamOptions, setTeamOptions] = useState([]);

//   const [slaMissedOptions, setSlaMissedOptions] = useState([
//     { value: "response", label: "First Response Violated" },
//     { value: "resolved", label: "Resolved Violated" },
//   ]);

//   const [orbitOptions, setOrbitOptions] = useState([
//     { value: "ENTITY", label: "Partner" },
//     { value: "SID", label: "Single User" },
//   ]);

//   const [platformOptions, setPlatformOptions] = useState([
//     { value: "1", label: "Web" },
//     { value: "2", label: "SuperApp" },
//     { value: "3", label: "Mobile" },
//   ]);

//   const [clientOptions, setClientOptions] = useState([]);
//   const [agentOptions, setAgentOptions] = useState([]);
//   const [aggregatorOptions, setAggregatorOptions] = useState([]);
//   const [branchOptions, setBranchOptions] = useState([]);
//   const [divisionOptions, setDivisionOptions] = useState([]);
//   const [districtOptions, setDistrictOptions] = useState([]);

//   const [isSearching, setIsSearching] = useState(false);
//   const [isDropdowLoading, setIsDropdowLoading] = useState(false);

//   const formik = useFormik({
//     initialValues: {
//       businessEntity: "",
//       team1: "",
//       slaMissed: "",
//       orbit: "",
//       fromDate: "",
//       toDate: "",
//       status: "",
//       userType: "",
//       userId: "",
//       ticketNumber: "",
//       agent: "",
//       aggregator: "",
//       branch: "",
//       division: "",
//       district: "",
//       platform: "",
//     },
//     validationSchema: Yup.object({
//       ticketNumber: Yup.number()
//         .typeError("Ticket number must be a number")
//         .integer("Ticket number must be an integer"),
//     }),
//     onSubmit: (values, { resetForm }) => {
//       setIsSearching(true);
//       setIsLoading(true);
//       fetchTicketByStatusAndDefaultEntity(values)
//         .then((response) => {
//           setTikcetData(response.data);
//           onClose();
//         })
//         .catch(errorMessage)
//         .finally(() => {
//           setIsLoading(false);
//           setIsSearching(false);
//           formik.setFieldValue("status", activeTab || "");
//           formik.setFieldValue("userType", user?.type || "");
//           formik.setFieldValue("userId", user?.id || "");
//         });
//     },
//   });

//   // Sync status, userType, userId when activeTab or user changes
//   useEffect(() => {
//     formik.setFieldValue("status", activeTab || "");
//     formik.setFieldValue("userType", user?.type || "");
//     formik.setFieldValue("userId", user?.id || "");
//   }, [activeTab, user]);

//     // useEffect(() => {
//     //   if (selectedBusinessId != null) {
//     //     setIsClientLoading(true);

//     //     getClientListFromLocal(selectedBusinessId)
//     //       .then((response) => {
//     //         setClientOptions(
//     //           response?.data?.map((option) => ({
//     //             value: option.client_id,
//     //             label: option.client_name,
//     //           }))
//     //         );
//     //       })
//     //       .catch(errorMessage)
//     //       .finally(() => setIsClientLoading(false));
//     //   }
//     // }, [selectedBusinessId]);

//   // Fetch agents whenever selected team changes
//   useEffect(() => {
//     const teamId = formik.values.team1 || undefined;
//     formik.setFieldValue("agent", ""); // clear stale agent selection
//     fetchAgents(teamId)
//       .then((response) => {
//         setAgentOptions(
//           response.data.map((option) => ({
//             value: option.user_id,
//             label: option.fullname,
//           }))
//         );
//       })
//       .catch(errorMessage);
//   }, [formik.values.team1]);

//   // Fetch all dropdown options on mount
//   useEffect(() => {
//     const fetchCompanyOptions = () =>
//       fetchCompany({
//         userType: user?.type,
//         userId: user?.id,
//       }).then((response) =>
//         setBusinessEntityOptions(
//           response.result.map((option) => ({
//             value: option.id,
//             label: option.company_name,
//           }))
//         )
//       );

//     const fetchTeamOptions = () =>
//       fetchAllTeam().then((response) => {
//         setTeamOptions(
//           response.data.map((option) => ({
//             value: option.id,
//             label: option.team_name,
//           }))
//         );
//       });

//     const fetchAggregatorOptions = () =>
//       fetchAggregators().then((response) => {
//         setAggregatorOptions(
//           response.data.map((option) => ({
//             value: option.id,
//             label: option.aggregator_name,
//           }))
//         );
//       });

//     const fetchBranchOptions = () =>
//       fetchBranches().then((response) => {
//         setBranchOptions(
//           response.data.map((option) => ({
//             value: option.id,
//             label: option.branch_name,
//           }))
//         );
//       });

//     const fetchDivisionOptions = () =>
//       fetchDivisions().then((response) => {
//         setDivisionOptions(
//           response.data.map((option) => ({
//             value: option.division,
//             label: option.division,
//           }))
//         );
//       });

//     const fetchDistrictOptions = () =>
//       fetchDistricts().then((response) => {
//         setDistrictOptions(
//           response.data.map((option) => ({
//             value: option.district,
//             label: option.district,
//           }))
//         );
//       });

//     Promise.all([
//       fetchCompanyOptions(),
//       fetchTeamOptions(),
//       fetchAggregatorOptions(),
//       fetchBranchOptions(),
//       fetchDivisionOptions(),
//       fetchDistrictOptions(),
//     ])
//       .catch(errorMessage)
//       .finally(() => setIsDropdowLoading(false));
//   }, []);

//   const applyMargin = () => {
//     setTimeout(() => {
//       const popup = document.querySelector(".rs-picker-popup");
//       if (popup) {
//         popup.style.marginLeft = "-150px";
//       }
//     }, 0);
//   };

//   const clearDateRange = () => {
//     formik.setFieldValue("fromDate", null);
//     formik.setFieldValue("toDate", null);
//   };

//   const handleReset = () => {
//     formik.resetForm();
//     formik.setFieldValue("status", activeTab || "");
//     formik.setFieldValue("userType", user?.type || "");
//     formik.setFieldValue("userId", user?.id || "");
//   };

//   return (
//     <>
//       {/* Overlay */}
//       {isOpen && (
//         <div
//           className='fixed-overlay'
//           onClick={onClose}
//           style={{
//             position: "fixed",
//             top: 0,
//             left: 0,
//             right: 0,
//             bottom: 0,
//             backgroundColor: "rgba(0, 0, 0, 0.5)",
//             zIndex: 999,
//           }}
//         />
//       )}

//       {/* Drawer */}
//       <div
//         className={`advanced-filter-drawer ${
//           isOpen ? "drawer-open" : "drawer-closed"
//         }`}
//         style={{
//           position: "fixed",
//           right: 0,
//           top: 0,
//           bottom: 0,
//           width: "450px",
//           backgroundColor: "white",
//           boxShadow: "-2px 0 8px rgba(0, 0, 0, 0.15)",
//           transform: isOpen ? "translateX(0)" : "translateX(100%)",
//           transition: "transform 0.3s ease-in-out",
//           zIndex: 1000,
//           overflowY: "auto",
//           padding: "20px",
//         }}>
//         <div className='d-flex justify-content-between align-items-center mb-4'>
//           <h5 className='mb-0'>Advanced Filters</h5>
//           <button
//             type='button'
//             className='btn-close'
//             onClick={onClose}
//             aria-label='Close'
//           />
//         </div>

//         <form onSubmit={formik.handleSubmit}>

//           <div className='mb-3'>
//             {/* <label className='form-label'>Ticket Number</label> */}
//             <input
//               type='text'
//               id='ticketNumber'
//               placeholder='Enter Ticket No.'
//               className='form-control'
//               onChange={(e) =>
//                 formik.setFieldValue("ticketNumber", e.target.value)
//               }
//               value={formik.values.ticketNumber}
//               onBlur={formik.handleBlur}
//             />
//             {formik.touched.ticketNumber && formik.errors.ticketNumber && (
//               <div className='text-danger small mt-1'>
//                 {formik.errors.ticketNumber}
//               </div>
//             )}
//           </div>

//           {hasPermission("Filter_BusinessEntity") && (
//             <div className='mb-3'>
//               {/* <label className='form-label'>Business Entity</label> */}
//               <SelectDropdown
//                 id='businessEntity'
//                 placeholder='Business Entity'
//                 options={businessEntityOptions}
//                 value={formik.values.businessEntity}
//                 onChange={(value) =>
//                   formik.setFieldValue("businessEntity", value)
//                 }
//                 disabled={isDropdowLoading}
//               />
//             </div>
//           )}

//           {/* <div className="input-group mb-3">

//                                   <SelectDropdown
//                                     id="client"
//                                     placeholder={labelValue}
//                                     options={clientOptions}
//                                     value={formik.values.clientInfo.client}
//                                     onChange={(value) => {
//                                       formik.setFieldValue('clientInfo.client', value);
//                                       formik.setFieldValue('ticketInfo.client', value);
//                                       setSelectedClientId(value);
//                                     }}
//                                     disabled={
//                                       selectedBusinessEntityName === 'Orbit OWN' ? true : isClientLoading
//                                     }
//                                     onDeepSearch={handleDeepSearch}
//                                   />
//                                 </div> */}

//           <div className='mb-3'>
//               <SelectDropdown
//                 id='businessEntity'
//                 placeholder='Client'
//                 options={businessEntityOptions}
//                 value={formik.values.businessEntity}
//                 onChange={(value) =>
//                   formik.setFieldValue("businessEntity", value)
//                 }
//                 disabled={isDropdowLoading}
//               />
//             </div>

//           {hasPermission("Filter_Team") && (
//             <div className='mb-3'>
//               {/* <label className='form-label'>Team</label> */}
//               <SelectDropdown
//                 id='team1'
//                 placeholder='Team'
//                 options={teamOptions}
//                 value={formik.values.team1}
//                 onChange={(value) => formik.setFieldValue("team1", value)}
//                 disabled={isDropdowLoading}
//               />
//             </div>
//           )}

//           <div className='mb-3'>
//             {/* <label className='form-label'>Agent</label> */}
//             <SelectDropdown
//               id='agent'
//               placeholder='Agent'
//               options={agentOptions}
//               value={formik.values.agent}
//               onChange={(value) => formik.setFieldValue("agent", value)}
//               disabled={isDropdowLoading}
//             />
//           </div>

//           <div className='mb-3'>
//             {/* <label className='form-label'>Date Range</label> */}
//             <DateRangePicker
//               ranges={predefinedRanges}
//               placeholder='Select Date Range'
//               style={{ width: "100%" }}
//               onOpen={applyMargin}
//               onClean={() => clearDateRange()}
//               value={
//                 formik.values.fromDate && formik.values.toDate
//                   ? [formik.values.fromDate, formik.values.toDate]
//                   : []
//               }
//               onChange={(value) => {
//                 if (value) {
//                   formik.setFieldValue("fromDate", toUTC(value[0]));
//                   formik.setFieldValue("toDate", toUTC(value[1]));
//                 }
//               }}
//             />
//           </div>

//           {hasPermission("Filter_SLA") && (
//             <div className='mb-3'>
//               {/* <label className='form-label'>SLA</label> */}
//               <SelectDropdown
//                 id='slaMissed'
//                 placeholder='SLA'
//                 options={slaMissedOptions}
//                 value={formik.values.slaMissed}
//                 onChange={(value) => formik.setFieldValue("slaMissed", value)}
//                 disabled={isDropdowLoading}
//               />
//             </div>
//           )}

//           {hasPermission("Filter_Partner") && (
//             <div className='mb-3'>
//               {/* <label className='form-label'>Partner / User</label> */}
//               <SelectDropdown
//                 id='orbit'
//                 placeholder='Partner / User'
//                 options={orbitOptions}
//                 value={formik.values.orbit}
//                 onChange={(value) => formik.setFieldValue("orbit", value)}
//                 disabled={isDropdowLoading}
//               />
//             </div>
//           )}

//           <div className='mb-3'>
//             {/* <label className='form-label'>Aggregator</label> */}
//             <SelectDropdown
//               id='aggregator'
//               placeholder='Aggregator'
//               options={aggregatorOptions}
//               value={formik.values.aggregator}
//               onChange={(value) => formik.setFieldValue("aggregator", value)}
//               disabled={isDropdowLoading}
//             />
//           </div>

//           <div className='mb-3'>
//             {/* <label className='form-label'>Branch</label> */}
//             <SelectDropdown
//               id='branch'
//               placeholder='Branch'
//               options={branchOptions}
//               value={formik.values.branch}
//               onChange={(value) => formik.setFieldValue("branch", value)}
//               disabled={isDropdowLoading}
//             />
//           </div>

//           <div className='mb-3'>
//             {/* <label className='form-label'>Division</label> */}
//             <SelectDropdown
//               id='division'
//               placeholder='Division'
//               options={divisionOptions}
//               value={formik.values.division}
//               onChange={(value) => formik.setFieldValue("division", value)}
//               disabled={isDropdowLoading}
//             />
//           </div>

//           <div className='mb-3'>
//             {/* <label className='form-label'>District</label> */}
//             <SelectDropdown
//               id='district'
//               placeholder='District'
//               options={districtOptions}
//               value={formik.values.district}
//               onChange={(value) => formik.setFieldValue("district", value)}
//               disabled={isDropdowLoading}
//             />
//           </div>

//           <div className='mb-3'>
//             {/* <label className='form-label'>Platform</label> */}
//             <SelectDropdown
//               id='platform'
//               placeholder='Platform'
//               options={platformOptions}
//               value={formik.values.platform}
//               onChange={(value) => formik.setFieldValue("platform", value)}
//               disabled={isDropdowLoading}
//             />
//           </div>

//           <div className='d-flex gap-2 mt-4'>
//             <button
//               type='submit'
//               disabled={isSearching}
//               className='btn btn-primary flex-grow-1'>
//               {isSearching ? "Searching..." : "Apply Filters"}
//             </button>
//             <button
//               type='button'
//               onClick={handleReset}
//               className='btn btn-outline-secondary flex-grow-1'>
//               Reset
//             </button>
//           </div>
//         </form>
//       </div>
//     </>
//   );
// };

// import React, { useContext, useEffect, useState } from "react";
// import { DateRangePicker } from "rsuite";
// import * as Yup from "yup";
// import subDays from "date-fns/subDays";
// import startOfWeek from "date-fns/startOfWeek";
// import endOfWeek from "date-fns/endOfWeek";
// import addDays from "date-fns/addDays";
// import startOfMonth from "date-fns/startOfMonth";
// import endOfMonth from "date-fns/endOfMonth";
// import addMonths from "date-fns/addMonths";
// import { SelectDropdown } from "../SelectDropdown";
// import { useFormik } from "formik";
// import { errorMessage } from "../../../../api/api-config/apiResponseMessage";
// import { fetchAllTeam } from "../../../../api/api-client/settings/teamApi";
// import { fetchCompany } from "../../../../api/api-client/settings/companyApi";
// import {
//   fetchTicketByStatusAndDefaultEntity,
//   fetchDistricts,
//   fetchDivisions,
//   fetchAggregators,
//   fetchBranches,
//   fetchAgents,
//   getClientListFromLocal,
// } from "../../../../api/api-client/ticketApi";
// import { toUTC } from "../../../../utils/utility";
// import { userContext } from "../../../context/UserContext";
// import { useUserRolePermissions } from "../../../custom-hook/useUserRolePermissions";

// export const AdvancedTicketFilter = ({
//   setIsLoading,
//   setTikcetData,
//   activeTab,
//   isOpen,
//   onClose,
// }) => {
//   const predefinedRanges = [
//     {
//       label: "Today",
//       value: [toUTC(new Date()), toUTC(new Date())],
//       placement: "left",
//     },
//     {
//       label: "Yesterday",
//       value: [toUTC(addDays(new Date(), -1)), toUTC(addDays(new Date(), -1))],
//       placement: "left",
//     },
//     {
//       label: "This week",
//       value: [toUTC(startOfWeek(new Date())), toUTC(endOfWeek(new Date()))],
//       placement: "left",
//     },
//     {
//       label: "Last 7 days",
//       value: [toUTC(subDays(new Date(), 6)), toUTC(new Date())],
//       placement: "left",
//     },
//     {
//       label: "Last 30 days",
//       value: [toUTC(subDays(new Date(), 29)), toUTC(new Date())],
//       placement: "left",
//     },
//     {
//       label: "This month",
//       value: [toUTC(startOfMonth(new Date())), toUTC(new Date())],
//       placement: "left",
//     },
//     {
//       label: "Last month",
//       value: [
//         toUTC(startOfMonth(addMonths(new Date(), -1))),
//         toUTC(endOfMonth(addMonths(new Date(), -1))),
//       ],
//       placement: "left",
//     },
//   ];

//   const { hasPermission } = useUserRolePermissions();
//   const { user } = useContext(userContext);

//   const [businessEntityOptions, setBusinessEntityOptions] = useState([]);
//   const [teamOptions, setTeamOptions] = useState([]);

//   const [slaMissedOptions, setSlaMissedOptions] = useState([
//     { value: "response", label: "First Response Violated" },
//     { value: "resolved", label: "Resolved Violated" },
//   ]);

//   const [orbitOptions, setOrbitOptions] = useState([
//     { value: "ENTITY", label: "Partner" },
//     { value: "SID", label: "Single User" },
//   ]);

//   const [platformOptions, setPlatformOptions] = useState([
//     { value: "1", label: "Web" },
//     { value: "2", label: "SuperApp" },
//     { value: "3", label: "Mobile" },
//   ]);

//   const [clientOptions, setClientOptions] = useState([]);
//   const [agentOptions, setAgentOptions] = useState([]);
//   const [aggregatorOptions, setAggregatorOptions] = useState([]);
//   const [branchOptions, setBranchOptions] = useState([]);
//   const [divisionOptions, setDivisionOptions] = useState([]);
//   const [districtOptions, setDistrictOptions] = useState([]);

//   const [isSearching, setIsSearching] = useState(false);
//   const [isDropdowLoading, setIsDropdowLoading] = useState(false);
//   const [selectedBusinessId, setSelectedBusinessId] = useState(null); // <-- added
//   const [isClientLoading, setIsClientLoading] = useState(false);      // <-- added

//   const formik = useFormik({
//     initialValues: {
//       businessEntity: "",
//       team1: "",
//       slaMissed: "",
//       orbit: "",
//       fromDate: "",
//       toDate: "",
//       status: "",
//       userType: "",
//       userId: "",
//       ticketNumber: "",
//       agent: "",
//       aggregator: "",
//       branch: "",
//       division: "",
//       district: "",
//       platform: "",
//     },
//     validationSchema: Yup.object({
//       ticketNumber: Yup.number()
//         .typeError("Ticket number must be a number")
//         .integer("Ticket number must be an integer"),
//     }),
//     onSubmit: (values, { resetForm }) => {
//       setIsSearching(true);
//       setIsLoading(true);
//       fetchTicketByStatusAndDefaultEntity(values)
//         .then((response) => {
//           setTikcetData(response.data);
//           onClose();
//         })
//         .catch(errorMessage)
//         .finally(() => {
//           setIsLoading(false);
//           setIsSearching(false);
//           formik.setFieldValue("status", activeTab || "");
//           formik.setFieldValue("userType", user?.type || "");
//           formik.setFieldValue("userId", user?.id || "");
//         });
//     },
//   });

//   // Sync status, userType, userId when activeTab or user changes
//   useEffect(() => {
//     formik.setFieldValue("status", activeTab || "");
//     formik.setFieldValue("userType", user?.type || "");
//     formik.setFieldValue("userId", user?.id || "");
//   }, [activeTab, user]);

//   // Fetch clients whenever selected business entity changes  // <-- added
//   useEffect(() => {
//     if (selectedBusinessId != null) {
//       setIsClientLoading(true);
//       getClientListFromLocal(selectedBusinessId)
//         .then((response) => {
//           setClientOptions(
//             response?.data?.map((option) => ({
//               value: option.client_id,
//               label: option.client_name,
//             }))
//           );
//         })
//         .catch(errorMessage)
//         .finally(() => setIsClientLoading(false));
//     }
//   }, [selectedBusinessId]);

//   // Fetch agents whenever selected team changes
//   useEffect(() => {
//     const teamId = formik.values.team1 || undefined;
//     formik.setFieldValue("agent", ""); // clear stale agent selection
//     fetchAgents(teamId)
//       .then((response) => {
//         setAgentOptions(
//           response.data.map((option) => ({
//             value: option.user_id,
//             label: option.fullname,
//           }))
//         );
//       })
//       .catch(errorMessage);
//   }, [formik.values.team1]);

//   // Fetch all dropdown options on mount
//   useEffect(() => {
//     const fetchCompanyOptions = () =>
//       fetchCompany({
//         userType: user?.type,
//         userId: user?.id,
//       }).then((response) =>
//         setBusinessEntityOptions(
//           response.result.map((option) => ({
//             value: option.id,
//             label: option.company_name,
//           }))
//         )
//       );

//     const fetchTeamOptions = () =>
//       fetchAllTeam().then((response) => {
//         setTeamOptions(
//           response.data.map((option) => ({
//             value: option.id,
//             label: option.team_name,
//           }))
//         );
//       });

//     const fetchAggregatorOptions = () =>
//       fetchAggregators().then((response) => {
//         setAggregatorOptions(
//           response.data.map((option) => ({
//             value: option.id,
//             label: option.aggregator_name,
//           }))
//         );
//       });

//     const fetchBranchOptions = () =>
//       fetchBranches().then((response) => {
//         setBranchOptions(
//           response.data.map((option) => ({
//             value: option.id,
//             label: option.branch_name,
//           }))
//         );
//       });

//     const fetchDivisionOptions = () =>
//       fetchDivisions().then((response) => {
//         setDivisionOptions(
//           response.data.map((option) => ({
//             value: option.division,
//             label: option.division,
//           }))
//         );
//       });

//     const fetchDistrictOptions = () =>
//       fetchDistricts().then((response) => {
//         setDistrictOptions(
//           response.data.map((option) => ({
//             value: option.district,
//             label: option.district,
//           }))
//         );
//       });

//     Promise.all([
//       fetchCompanyOptions(),
//       fetchTeamOptions(),
//       fetchAggregatorOptions(),
//       fetchBranchOptions(),
//       fetchDivisionOptions(),
//       fetchDistrictOptions(),
//     ])
//       .catch(errorMessage)
//       .finally(() => setIsDropdowLoading(false));
//   }, []);

//   const applyMargin = () => {
//     setTimeout(() => {
//       const popup = document.querySelector(".rs-picker-popup");
//       if (popup) {
//         popup.style.marginLeft = "-150px";
//       }
//     }, 0);
//   };

//   const clearDateRange = () => {
//     formik.setFieldValue("fromDate", null);
//     formik.setFieldValue("toDate", null);
//   };

//   const handleReset = () => {
//     formik.resetForm();
//     formik.setFieldValue("status", activeTab || "");
//     formik.setFieldValue("userType", user?.type || "");
//     formik.setFieldValue("userId", user?.id || "");
//   };

//   return (
//     <>
//       {/* Overlay */}
//       {isOpen && (
//         <div
//           className='fixed-overlay'
//           onClick={onClose}
//           style={{
//             position: "fixed",
//             top: 0,
//             left: 0,
//             right: 0,
//             bottom: 0,
//             backgroundColor: "rgba(0, 0, 0, 0.5)",
//             zIndex: 999,
//           }}
//         />
//       )}

//       {/* Drawer */}
//       <div
//         className={`advanced-filter-drawer ${
//           isOpen ? "drawer-open" : "drawer-closed"
//         }`}
//         style={{
//           position: "fixed",
//           right: 0,
//           top: 0,
//           bottom: 0,
//           width: "450px",
//           backgroundColor: "white",
//           boxShadow: "-2px 0 8px rgba(0, 0, 0, 0.15)",
//           transform: isOpen ? "translateX(0)" : "translateX(100%)",
//           transition: "transform 0.3s ease-in-out",
//           zIndex: 1000,
//           overflowY: "auto",
//           padding: "20px",
//         }}>
//         <div className='d-flex justify-content-between align-items-center mb-4'>
//           <h5 className='mb-0'>Advanced Filters</h5>
//           <button
//             type='button'
//             className='btn-close'
//             onClick={onClose}
//             aria-label='Close'
//           />
//         </div>

//         <form onSubmit={formik.handleSubmit}>

//           <div className='mb-3'>
//             {/* <label className='form-label'>Ticket Number</label> */}
//             <input
//               type='text'
//               id='ticketNumber'
//               placeholder='Enter Ticket No.'
//               className='form-control'
//               onChange={(e) =>
//                 formik.setFieldValue("ticketNumber", e.target.value)
//               }
//               value={formik.values.ticketNumber}
//               onBlur={formik.handleBlur}
//             />
//             {formik.touched.ticketNumber && formik.errors.ticketNumber && (
//               <div className='text-danger small mt-1'>
//                 {formik.errors.ticketNumber}
//               </div>
//             )}
//           </div>

//           {hasPermission("Filter_BusinessEntity") && (
//             <div className='mb-3'>
//               {/* <label className='form-label'>Business Entity</label> */}
//               <SelectDropdown
//                 id='businessEntity'
//                 placeholder='Business Entity'
//                 options={businessEntityOptions}
//                 value={formik.values.businessEntity}
//                 onChange={(value) => {
//                   formik.setFieldValue("businessEntity", value); // <-- unchanged
//                   setSelectedBusinessId(value);                  // <-- added: triggers client fetch
//                 }}
//                 disabled={isDropdowLoading}
//               />
//             </div>
//           )}

//           <div className='mb-3'>
//             <SelectDropdown
//               id='client'
//               placeholder='Client'
//               options={clientOptions}                            // <-- fixed: uses clientOptions
//               value={formik.values.client}
//               onChange={(value) => formik.setFieldValue("client", value)}
//               disabled={isClientLoading}                        // <-- fixed: uses isClientLoading
//             />
//           </div>

//           {hasPermission("Filter_Team") && (
//             <div className='mb-3'>
//               {/* <label className='form-label'>Team</label> */}
//               <SelectDropdown
//                 id='team1'
//                 placeholder='Team'
//                 options={teamOptions}
//                 value={formik.values.team1}
//                 onChange={(value) => formik.setFieldValue("team1", value)}
//                 disabled={isDropdowLoading}
//               />
//             </div>
//           )}

//           <div className='mb-3'>
//             {/* <label className='form-label'>Agent</label> */}
//             <SelectDropdown
//               id='agent'
//               placeholder='Agent'
//               options={agentOptions}
//               value={formik.values.agent}
//               onChange={(value) => formik.setFieldValue("agent", value)}
//               disabled={isDropdowLoading}
//             />
//           </div>

//           <div className='mb-3'>
//             {/* <label className='form-label'>Date Range</label> */}
//             <DateRangePicker
//               ranges={predefinedRanges}
//               placeholder='Select Date Range'
//               style={{ width: "100%" }}
//               onOpen={applyMargin}
//               onClean={() => clearDateRange()}
//               value={
//                 formik.values.fromDate && formik.values.toDate
//                   ? [formik.values.fromDate, formik.values.toDate]
//                   : []
//               }
//               onChange={(value) => {
//                 if (value) {
//                   formik.setFieldValue("fromDate", toUTC(value[0]));
//                   formik.setFieldValue("toDate", toUTC(value[1]));
//                 }
//               }}
//             />
//           </div>

//           {hasPermission("Filter_SLA") && (
//             <div className='mb-3'>
//               {/* <label className='form-label'>SLA</label> */}
//               <SelectDropdown
//                 id='slaMissed'
//                 placeholder='SLA'
//                 options={slaMissedOptions}
//                 value={formik.values.slaMissed}
//                 onChange={(value) => formik.setFieldValue("slaMissed", value)}
//                 disabled={isDropdowLoading}
//               />
//             </div>
//           )}

//           {hasPermission("Filter_Partner") && (
//             <div className='mb-3'>
//               {/* <label className='form-label'>Partner / User</label> */}
//               <SelectDropdown
//                 id='orbit'
//                 placeholder='Partner / User'
//                 options={orbitOptions}
//                 value={formik.values.orbit}
//                 onChange={(value) => formik.setFieldValue("orbit", value)}
//                 disabled={isDropdowLoading}
//               />
//             </div>
//           )}

//           <div className='mb-3'>
//             {/* <label className='form-label'>Aggregator</label> */}
//             <SelectDropdown
//               id='aggregator'
//               placeholder='Aggregator'
//               options={aggregatorOptions}
//               value={formik.values.aggregator}
//               onChange={(value) => formik.setFieldValue("aggregator", value)}
//               disabled={isDropdowLoading}
//             />
//           </div>

//           <div className='mb-3'>
//             {/* <label className='form-label'>Branch</label> */}
//             <SelectDropdown
//               id='branch'
//               placeholder='Branch'
//               options={branchOptions}
//               value={formik.values.branch}
//               onChange={(value) => formik.setFieldValue("branch", value)}
//               disabled={isDropdowLoading}
//             />
//           </div>

//           <div className='mb-3'>
//             {/* <label className='form-label'>Division</label> */}
//             <SelectDropdown
//               id='division'
//               placeholder='Division'
//               options={divisionOptions}
//               value={formik.values.division}
//               onChange={(value) => formik.setFieldValue("division", value)}
//               disabled={isDropdowLoading}
//             />
//           </div>

//           <div className='mb-3'>
//             {/* <label className='form-label'>District</label> */}
//             <SelectDropdown
//               id='district'
//               placeholder='District'
//               options={districtOptions}
//               value={formik.values.district}
//               onChange={(value) => formik.setFieldValue("district", value)}
//               disabled={isDropdowLoading}
//             />
//           </div>

//           <div className='mb-3'>
//             {/* <label className='form-label'>Platform</label> */}
//             <SelectDropdown
//               id='platform'
//               placeholder='Platform'
//               options={platformOptions}
//               value={formik.values.platform}
//               onChange={(value) => formik.setFieldValue("platform", value)}
//               disabled={isDropdowLoading}
//             />
//           </div>

//           <div className='d-flex gap-2 mt-4'>
//             <button
//               type='submit'
//               disabled={isSearching}
//               className='btn btn-primary flex-grow-1'>
//               {isSearching ? "Searching..." : "Apply Filters"}
//             </button>
//             <button
//               type='button'
//               onClick={handleReset}
//               className='btn btn-outline-secondary flex-grow-1'>
//               Reset
//             </button>
//           </div>
//         </form>
//       </div>
//     </>
//   );
// };

import React, { useContext, useEffect, useState } from 'react';
import { DateRangePicker } from 'rsuite';
import * as Yup from 'yup';
import subDays from 'date-fns/subDays';
import startOfWeek from 'date-fns/startOfWeek';
import endOfWeek from 'date-fns/endOfWeek';
import addDays from 'date-fns/addDays';
import startOfMonth from 'date-fns/startOfMonth';
import endOfMonth from 'date-fns/endOfMonth';
import addMonths from 'date-fns/addMonths';
import { SelectDropdown } from '../SelectDropdown';
import { useFormik } from 'formik';
import { errorMessage } from '../../../../api/api-config/apiResponseMessage';
import { fetchAllTeam } from '../../../../api/api-client/settings/teamApi';
import { fetchCompany } from '../../../../api/api-client/settings/companyApi';
import {
  fetchTicketByStatusAndDefaultEntity,
  fetchDistricts,
  fetchDivisions,
  fetchAggregators,
  fetchBranches,
  fetchAgents,
  getClientListFromLocal,
} from '../../../../api/api-client/ticketApi';
import { toUTC } from '../../../../utils/utility';
import { userContext } from '../../../context/UserContext';
import { useUserRolePermissions } from '../../../custom-hook/useUserRolePermissions';

export const AdvancedTicketFilter = ({
  setIsLoading,
  setTikcetData,
  activeTab,
  isOpen,
  onClose,
}) => {
  const predefinedRanges = [
    {
      label: 'Today',
      value: [toUTC(new Date()), toUTC(new Date())],
      placement: 'left',
    },
    {
      label: 'Yesterday',
      value: [toUTC(addDays(new Date(), -1)), toUTC(addDays(new Date(), -1))],
      placement: 'left',
    },
    {
      label: 'This week',
      value: [toUTC(startOfWeek(new Date())), toUTC(endOfWeek(new Date()))],
      placement: 'left',
    },
    {
      label: 'Last 7 days',
      value: [toUTC(subDays(new Date(), 6)), toUTC(new Date())],
      placement: 'left',
    },
    {
      label: 'Last 30 days',
      value: [toUTC(subDays(new Date(), 29)), toUTC(new Date())],
      placement: 'left',
    },
    {
      label: 'This month',
      value: [toUTC(startOfMonth(new Date())), toUTC(new Date())],
      placement: 'left',
    },
    {
      label: 'Last month',
      value: [
        toUTC(startOfMonth(addMonths(new Date(), -1))),
        toUTC(endOfMonth(addMonths(new Date(), -1))),
      ],
      placement: 'left',
    },
  ];

  const { hasPermission } = useUserRolePermissions();
  const { user } = useContext(userContext);

  const [businessEntityOptions, setBusinessEntityOptions] = useState([]);
  const [teamOptions, setTeamOptions] = useState([]);

  const [slaMissedOptions, setSlaMissedOptions] = useState([
    { value: 'response', label: 'First Response Violated' },
    { value: 'resolved', label: 'Resolved Violated' },
  ]);

  const [orbitOptions, setOrbitOptions] = useState([
    { value: 'ENTITY', label: 'Partner' },
    { value: 'SID', label: 'Single User' },
  ]);

  const [platformOptions, setPlatformOptions] = useState([
    { value: '1', label: 'Web' },
    { value: '2', label: 'SuperApp' },
    { value: '3', label: 'Mobile' },
  ]);

  const [clientOptions, setClientOptions] = useState([]);
  const [agentOptions, setAgentOptions] = useState([]);
  const [aggregatorOptions, setAggregatorOptions] = useState([]);
  const [branchOptions, setBranchOptions] = useState([]);
  const [divisionOptions, setDivisionOptions] = useState([]);
  const [districtOptions, setDistrictOptions] = useState([]);

  const [isSearching, setIsSearching] = useState(false);
  const [isDropdowLoading, setIsDropdowLoading] = useState(false);
  const [selectedBusinessId, setSelectedBusinessId] = useState(null);
  const [isClientLoading, setIsClientLoading] = useState(false);

  const formik = useFormik({
    initialValues: {
      businessEntity: '',
      client: '', // <-- ADDED: client field so it gets sent to backend
      team1: '',
      slaMissed: '',
      orbit: '',
      fromDate: '',
      toDate: '',
      status: '',
      userType: '',
      userId: '',
      ticketNumber: '',
      agent: '',
      aggregator: '',
      branch: '',
      division: '',
      district: '',
      platform: '',
    },
    validationSchema: Yup.object({
      ticketNumber: Yup.number()
        .typeError('Ticket number must be a number')
        .integer('Ticket number must be an integer'),
    }),
    onSubmit: (values, { resetForm }) => {
      setIsSearching(true);
      setIsLoading(true);
      fetchTicketByStatusAndDefaultEntity(values) // client id is now included in values
        .then((response) => {
          setTikcetData(response.data);
          onClose();
        })
        .catch(errorMessage)
        .finally(() => {
          setIsLoading(false);
          setIsSearching(false);
          formik.setFieldValue('status', activeTab || '');
          formik.setFieldValue('userType', user?.type || '');
          formik.setFieldValue('userId', user?.id || '');
        });
    },
  });

  // Sync status, userType, userId when activeTab or user changes
  useEffect(() => {
    formik.setFieldValue('status', activeTab || '');
    formik.setFieldValue('userType', user?.type || '');
    formik.setFieldValue('userId', user?.id || '');
  }, [activeTab, user]);

  // Fetch clients whenever selected business entity changes
  useEffect(() => {
    if (selectedBusinessId != null) {
      setIsClientLoading(true);
      setClientOptions([]); // clear stale options
      formik.setFieldValue('client', ''); // clear stale selection
      getClientListFromLocal(selectedBusinessId)
        .then((response) => {
          setClientOptions(
            response?.data?.map((option) => ({
              value: option.client_id,
              label: option.client_name,
            }))
          );
        })
        .catch(errorMessage)
        .finally(() => setIsClientLoading(false));
    }
  }, [selectedBusinessId]);

  // Fetch agents whenever selected team changes
  useEffect(() => {
    const teamId = formik.values.team1 || undefined;
    formik.setFieldValue('agent', '');
    if (!teamId) {
      setAgentOptions([]);
      return;
    }

    fetchAgents(teamId)
      .then((response) => {
        setAgentOptions(
          response.data.map((option) => ({
            value: option.user_id,
            label: option.fullname,
          }))
        );
      })
      .catch(errorMessage);
  }, [formik.values.team1]);

  // Fetch all dropdown options on mount
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

    const fetchTeamOptions = () =>
      fetchAllTeam().then((response) => {
        setTeamOptions(
          response.data.map((option) => ({
            value: option.id,
            label: option.team_name,
          }))
        );
      });

    const fetchAggregatorOptions = () =>
      fetchAggregators().then((response) => {
        setAggregatorOptions(
          response.data.map((option) => ({
            value: option.id,
            label: option.aggregator_name,
          }))
        );
      });

    const fetchBranchOptions = () =>
      fetchBranches().then((response) => {
        setBranchOptions(
          response.data.map((option) => ({
            value: option.id,
            label: option.branch_name,
          }))
        );
      });

    const fetchDivisionOptions = () =>
      fetchDivisions().then((response) => {
        setDivisionOptions(
          response.data.map((option) => ({
            value: option.division,
            label: option.division,
          }))
        );
      });

    const fetchDistrictOptions = () =>
      fetchDistricts().then((response) => {
        setDistrictOptions(
          response.data.map((option) => ({
            value: option.district,
            label: option.district,
          }))
        );
      });

    Promise.all([
      fetchCompanyOptions(),
      fetchTeamOptions(),
      fetchAggregatorOptions(),
      fetchBranchOptions(),
      fetchDivisionOptions(),
      fetchDistrictOptions(),
    ])
      .catch(errorMessage)
      .finally(() => setIsDropdowLoading(false));
  }, []);

  const applyMargin = () => {
    setTimeout(() => {
      const popup = document.querySelector('.rs-picker-popup');
      if (popup) {
        popup.style.marginLeft = '-150px';
      }
    }, 0);
  };

  const clearDateRange = () => {
    formik.setFieldValue('fromDate', null);
    formik.setFieldValue('toDate', null);
  };

  const handleReset = () => {
    formik.resetForm();
    setSelectedBusinessId(null); // reset so client dropdown disables
    setClientOptions([]); // clear client options
    formik.setFieldValue('status', activeTab || '');
    formik.setFieldValue('userType', user?.type || '');
    formik.setFieldValue('userId', user?.id || '');
  };

  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed-overlay"
          onClick={onClose}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            zIndex: 999,
          }}
        />
      )}

      {/* Drawer */}
      <div
        className={`advanced-filter-drawer ${isOpen ? 'drawer-open' : 'drawer-closed'}`}
        style={{
          position: 'fixed',
          right: 0,
          top: 0,
          bottom: 0,
          width: '450px',
          backgroundColor: 'white',
          boxShadow: '-2px 0 8px rgba(0, 0, 0, 0.15)',
          transform: isOpen ? 'translateX(0)' : 'translateX(100%)',
          transition: 'transform 0.3s ease-in-out',
          zIndex: 1000,
          overflowY: 'auto',
          padding: '20px',
        }}
      >
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h5 className="mb-0">Advanced Filters</h5>
          <button type="button" className="btn-close" onClick={onClose} aria-label="Close" />
        </div>

        <form onSubmit={formik.handleSubmit}>
          <div className="mb-3">
            <input
              type="text"
              id="ticketNumber"
              placeholder="Enter Ticket No."
              className="form-control"
              onChange={(e) => formik.setFieldValue('ticketNumber', e.target.value)}
              value={formik.values.ticketNumber}
              onBlur={formik.handleBlur}
            />
            {formik.touched.ticketNumber && formik.errors.ticketNumber && (
              <div className="text-danger small mt-1">{formik.errors.ticketNumber}</div>
            )}
          </div>

          {hasPermission('Filter_BusinessEntity') && (
            <div className="mb-3">
              <SelectDropdown
                id="businessEntity"
                placeholder="Business Entity"
                options={businessEntityOptions}
                value={formik.values.businessEntity}
                onChange={(value) => {
                  formik.setFieldValue('businessEntity', value);
                  setSelectedBusinessId(value); // triggers client fetch
                }}
                disabled={isDropdowLoading}
              />
            </div>
          )}

          {/* Client — loads after Business Entity is selected, sends client id to backend */}
          <div className="mb-3">
            <SelectDropdown
              id="client"
              placeholder="Client"
              options={clientOptions}
              value={formik.values.client}
              onChange={(value) => formik.setFieldValue('client', value)}
              disabled={isClientLoading || !selectedBusinessId}
            />
          </div>

          {hasPermission('Filter_Team') && (
            <div className="mb-3">
              <SelectDropdown
                id="team1"
                placeholder="Team"
                options={teamOptions}
                value={formik.values.team1}
                onChange={(value) => formik.setFieldValue('team1', value)}
                disabled={isDropdowLoading}
              />
            </div>
          )}

          <div className="mb-3">
            <SelectDropdown
              id="agent"
              placeholder="Agent"
              options={agentOptions}
              value={formik.values.agent}
              onChange={(value) => formik.setFieldValue('agent', value)}
              disabled={isDropdowLoading}
            />
          </div>

          <div className="mb-3">
            <DateRangePicker
              ranges={predefinedRanges}
              placeholder="Select Date Range"
              style={{ width: '100%' }}
              onOpen={applyMargin}
              onClean={() => clearDateRange()}
              value={
                formik.values.fromDate && formik.values.toDate
                  ? [formik.values.fromDate, formik.values.toDate]
                  : []
              }
              onChange={(value) => {
                if (value) {
                  formik.setFieldValue('fromDate', toUTC(value[0]));
                  formik.setFieldValue('toDate', toUTC(value[1]));
                }
              }}
            />
          </div>

          {hasPermission('Filter_SLA') && (
            <div className="mb-3">
              <SelectDropdown
                id="slaMissed"
                placeholder="SLA"
                options={slaMissedOptions}
                value={formik.values.slaMissed}
                onChange={(value) => formik.setFieldValue('slaMissed', value)}
                disabled={isDropdowLoading}
              />
            </div>
          )}

          {hasPermission('Filter_Partner') && (
            <div className="mb-3">
              <SelectDropdown
                id="orbit"
                placeholder="Partner / User"
                options={orbitOptions}
                value={formik.values.orbit}
                onChange={(value) => formik.setFieldValue('orbit', value)}
                disabled={isDropdowLoading}
              />
            </div>
          )}

          <div className="mb-3">
            <SelectDropdown
              id="aggregator"
              placeholder="Aggregator"
              options={aggregatorOptions}
              value={formik.values.aggregator}
              onChange={(value) => formik.setFieldValue('aggregator', value)}
              disabled={isDropdowLoading}
            />
          </div>

          <div className="mb-3">
            <SelectDropdown
              id="branch"
              placeholder="Branch"
              options={branchOptions}
              value={formik.values.branch}
              onChange={(value) => formik.setFieldValue('branch', value)}
              disabled={isDropdowLoading}
            />
          </div>

          <div className="mb-3">
            <SelectDropdown
              id="division"
              placeholder="Division"
              options={divisionOptions}
              value={formik.values.division}
              onChange={(value) => formik.setFieldValue('division', value)}
              disabled={isDropdowLoading}
            />
          </div>

          <div className="mb-3">
            <SelectDropdown
              id="district"
              placeholder="District"
              options={districtOptions}
              value={formik.values.district}
              onChange={(value) => formik.setFieldValue('district', value)}
              disabled={isDropdowLoading}
            />
          </div>

          <div className="mb-3">
            <SelectDropdown
              id="platform"
              placeholder="Platform"
              options={platformOptions}
              value={formik.values.platform}
              onChange={(value) => formik.setFieldValue('platform', value)}
              disabled={isDropdowLoading}
            />
          </div>

          <div className="d-flex gap-2 mt-4">
            <button type="submit" disabled={isSearching} className="btn btn-primary flex-grow-1">
              {isSearching ? 'Searching...' : 'Apply Filters'}
            </button>
            <button
              type="button"
              onClick={handleReset}
              className="btn btn-outline-secondary flex-grow-1"
            >
              Reset
            </button>
          </div>
        </form>
      </div>
    </>
  );
};
