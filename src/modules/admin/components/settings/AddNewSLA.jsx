// import React, { useState, useEffect, useContext } from "react";
// import Select from "react-select";
// import { FormikConsumer, useFormik } from "formik";
// import * as Yup from "yup";
// import { plusIcon } from "../../../../data/data";
// import { fetchCompany } from "../../../../api/api-client/settings/companyApi";
// import { fetchAllTeam } from "../../../../api/api-client/settings/teamApi";
// import {
//   errorMessage,
//   successMessage,
// } from "../../../../api/api-config/apiResponseMessage";
// import {
//   fetchSubCategoriesByTeamId,fetchClientsByBusinessEntityId,
//   store,
// } from "../../../../api/api-client/settings/slaApi";
// import { createSlaValidationSchema } from "../../../../schema/ValidationSchemas";
// import { userContext } from "../../../context/UserContext";
// import { storeSlaSubcatConfig, fetchSlaSubcatConfigById, updateSlaSubcatConfig } from "../../../../api/api-client/settings/sla_subcat_configsApi";

// export const AddNewSLA = () => {
//   const { user } = useContext(userContext);
//   const [slaTypeCheck, setSLATypeCheck] = useState("");
//   const [companyOptions, setCompanyOptions] = useState([]);
//   const [teamOptions, setTeamOptions] = useState([]);
//   const [clientOptions, setClientOptions] = useState([]);
//   const [businessEntityId, setBusinessEntityId] = useState(null);
//   const [subCategoryByTeamOptions, setSubCategoryByTeamOptions] = useState([]);
//   const [resolutionWarning, setResolutionWarning] = useState('');

//   const slaTypeOptions = [
//     { value: "Sub-Category", label: "Sub-Category" },
//     { value: "Client", label: "Client" },
//   ];


//   useEffect(() => {
//     const fetchCompanyOptions = () =>
//       fetchCompany({
//         userType: user?.type,
//         userId: user?.id,
//       }).then((response) =>
//         setCompanyOptions(
//           response.result.map((option) => ({
//             value: option.id,
//             label: option.company_name,
//           }))
//         )
//       );

//     const fetchTeamOptions = () => {
//       fetchAllTeam().then((response) => {
//         setTeamOptions(
//           response.data.map((option) => ({
//             value: option.id,
//             label: option.team_name,
//           }))
//         );
//       });
//     };
//     Promise.all([
//       fetchCompanyOptions(),
//       fetchTeamOptions(),
//     ])
//       .catch(errorMessage)
//       .finally(() => setIsLoading(false));
//   }, []);

//   const customStyles = {
//     control: (provided) => ({
//       ...provided,
//       minHeight: "30px",
//       height: "30px",
//       width: "100%",
//     }),
//     valueContainer: (provided) => ({
//       ...provided,
//       height: "30px",
//       padding: "0 6px",
//     }),
//     input: (provided) => ({
//       ...provided,
//       margin: "0px",
//     }),
//     indicatorsContainer: (provided) => ({
//       ...provided,
//       height: "30px",
//     }),
//   };

//   const handleFetchSubcategoriesByTeam = (teamId) => {
//     if (teamId) {
//       fetchSubCategoriesByTeamId(teamId)
//         .then((response) => {
//           setSubCategoryByTeamOptions(
//             response.data.map((item) => ({
//               value: item.sub_category_id,
//               label: item.sub_category_in_english,
//             }))
//           );
//         })
//         .catch(errorMessage);
//     } else {
//       setSubCategoryByTeamOptions([]);
//     }
//   };


//   const formik = useFormik({
//     initialValues: {
//       businessEntity: "",
//       slaType: "",
//       slaForClient: "",
//       slaForTeam: "",
//       subcategories: [],
//       resolutionTime: "",
//       defaultEscalate: 1,
//       defaultStatus: 1,
//     },
//     // validationSchema: validationSchema,
//     onSubmit: (values, { resetForm }) => {
//       setIsLoading(true);
//       store(values)
//         .then((response) => {
//           successMessage(response);
//           resetForm();
//         })
//         .catch(errorMessage)
//         .finally(() => {
//           setIsLoading(false);
//         });
//     },
//   });

//   return (
//     <div className='row'>
//       <div className='col-sm-12 col-md-12 col-lg-12 col-xl-12'>
//         <div className='alert alert-secondary p-2' role='alert'>
//           <h6>Create New SLA Policy</h6>
//           <span>
//             <i>Please input the required information.</i>
//           </span>
//         </div>
//       </div>
//       <form onSubmit={formik.handleSubmit}>
//         <div className='row mb-4'>
//           <div className='col-sm-12 col-md-5 col-lg-5 col-xl-5'>
//             <div className='row'>
              
//               <div className='col-sm-12 col-md-12 col-lg-12 col-xl-12'>
//                 <div className='input-group mb-3'>
//                   <span className='input-group-text w-25' id='basic-addon1'>
//                     Business Entity
//                   </span>
//                   <Select
//                     options={companyOptions}
//                     placeholder={"Business entity"}
//                     className='form-control'
//                     styles={customStyles}
//                     id='businessEntity'
//                     onChange={(option) => {
//                       formik.setFieldValue("businessEntity", option);
//                       setBusinessEntityId(option.value);
//                       if (slaTypeCheck === "Client") {
//                         formik.setFieldValue("slaForClient", null);
//                         fetchClientsByBusinessEntityId(option.value).then(response => {
//                           setClientOptions(response.data.map(item => ({ value: item.client_id, label: item.client_name })));
//                         }).catch(errorMessage);
//                       } else if (slaTypeCheck === "Sub-Category") {
//                         formik.setFieldValue("slaForTeam", null);
//                         formik.setFieldValue("subcategories", []);
//                       }
//                     }}
//                     onBlur={formik.handleBlur}
//                     value={formik.values.businessEntity}
//                   />
//                 </div>
//               </div>
//               <div className='col-sm-12 col-md-12 col-lg-12 col-xl-12'>
//                 <div className='input-group mb-3'>
//                   <span className='input-group-text w-25' id='basic-addon1'>
//                     SLA Type
//                   </span>
//                   <Select
//                     options={slaTypeOptions}
//                     placeholder={"SLA type"}
//                     className='form-control'
//                     styles={customStyles}
//                     id='slaType'
//                     onChange={(option) => {
//                       formik.setFieldValue("slaType", option);
//                       setSLATypeCheck(option.value);
//                       if (option.value === "Client" && businessEntityId) {
//                         formik.setFieldValue("slaForClient", null);
//                         fetchClientsByBusinessEntityId(businessEntityId).then(response => {
//                           setClientOptions(response.data.map(item => ({ value: item.client_id, label: item.client_name })));
//                         }).catch(errorMessage);
//                       }
//                     }}
//                     onBlur={formik.handleBlur}
//                     value={formik.values.slaType}
//                   />
//                 </div>
//               </div>

//               <div className='col-sm-12 col-md-12 col-lg-12 col-xl-12'>
//                 {slaTypeCheck === "Client" && (
//                   <div className='input-group mb-3'>
//                     <span className='input-group-text w-25' id='basic-addon1'>
//                       Client
//                     </span>
//                     <Select
//                       options={clientOptions}
//                       placeholder={"Select client"}
//                       className='form-control p-0'
//                       styles={customStyles}
//                       id='slaForClient'
//                       name='slaForClient'
//                       onChange={(option) => {
//                         formik.setFieldValue("slaForClient", option);
//                       }}
//                       onBlur={formik.handleBlur}
//                       value={formik.values.slaForClient}
//                     />
//                   </div>
//                 )}

//                 {slaTypeCheck === "Sub-Category" && (
//                   <div className='input-group mb-3'>
//                     <span className='input-group-text w-25' id='basic-addon1'>
//                       Team
//                     </span>
//                     <Select
//                       options={teamOptions}
//                       placeholder={"Select team"}
//                       className='form-control p-0'
//                       styles={customStyles}
//                       id='slaForTeam'
//                       name='slaForTeam'
//                       onChange={(option) => {
//                         formik.setFieldValue("slaForTeam", option);
//                         formik.setFieldValue("subcategories", []);
//                         handleFetchSubcategoriesByTeam(option.value);
//                       }}
//                       onBlur={formik.handleBlur}
//                       value={formik.values.slaForTeam}
//                     />
//                   </div>
//                 )}

//                 {slaTypeCheck === "Sub-Category" && (
//                   <div className='input-group mb-3'>
//                     <span className='input-group-text w-25' id='basic-addon1'>
//                       Select Sub-Category
//                     </span>
//                     <Select
//                       options={subCategoryByTeamOptions}
//                       placeholder={"Select sub categories"}
//                       className='form-control p-0'
//                       styles={customStyles}
//                       id='subcategories'
//                       name='subcategories'
//                       isMulti
//                       onChange={(options) => formik.setFieldValue("subcategories", options)}
//                       onBlur={formik.handleBlur}
//                       value={formik.values.subcategories}
//                     />
//                   </div>
//                 )}


//                 <div className='col-sm-12 col-md-12 col-lg-12 col-xl-12'>
//                   <div className='input-group mb-3'>
//                     <span className='input-group-text w-25' id='basic-addon1'>
//                       Resolution Time
//                     </span>
//                     <input
//                       type='text'
//                       className={`form-control ${formik.touched.resolutionTime && formik.errors.resolutionTime ? 'is-invalid' : ''}`}
//                       placeholder='Enter SLA in Minutes'
//                       id='resolutionTime'
//                       name='resolutionTime'
//                       onChange={(e) => {
//                         const value = e.target.value;
//                         if (/^\d*$/.test(value)) {
//                           formik.setFieldValue('resolutionTime', value);
//                           setResolutionWarning('');
//                         } else {
//                           setResolutionWarning('Only numbers allowed');
//                         }
//                       }}
//                       onBlur={formik.handleBlur}
//                       value={formik.values.resolutionTime}
//                     />
//                     {resolutionWarning && (
//                       <div className='text-danger mt-1'>
//                         {resolutionWarning}
//                       </div>
//                     )}
//                     {formik.touched.resolutionTime && formik.errors.resolutionTime && !resolutionWarning ? (
//                       <div className='invalid-feedback'>
//                         {formik.errors.resolutionTime}
//                       </div>
//                     ) : null}
//                   </div>
//                 </div>

//                 <div className='col-sm-12 col-md-12 col-lg-12 col-xl-12'>
//                   <div className='d-flex justify-content-start'>
//                     <div className='form-check form-switch me-3'>
//                       <input
//                         className='form-check-input'
//                         type='checkbox'
//                         role='switch'
//                         id='defaultStatus'
//                         checked={formik.values.defaultStatus}
//                         onChange={(e) =>
//                           formik.setFieldValue(
//                             'defaultStatus',
//                             e.target.checked ? 1 : 0
//                           )
//                         }
//                       />
//                       <label className='form-check-label ms-2' htmlFor='defaultStatus'>
//                         Status
//                       </label>
//                     </div>
//                     <div className='form-check form-switch'>
//                       <input
//                         className='form-check-input'
//                         type='checkbox'
//                         role='switch'
//                         id='defaultEscalate'
//                         checked={formik.values.defaultEscalate}
//                         onChange={(e) =>
//                           formik.setFieldValue(
//                             'defaultEscalate',
//                             e.target.checked ? 1 : 0
//                           )
//                         }
//                       />
//                       <label className='form-check-label ms-2' htmlFor='defaultEscalate'>
//                         Escalation Status
//                       </label>
//                     </div>
//                   </div>
//                 </div>
                
//               </div>
//             </div>
//           </div>
//         </div>
        
//         <div className='text-end'>
//           <button type='submit' className='custom-btn'>
//             Save
//           </button>
//         </div>
//       </form>
//     </div>
//   );
// };








// import React, { useState, useEffect, useContext } from "react";
// import Select from "react-select";
// import { useFormik } from "formik";
// import { fetchCompany } from "../../../../api/api-client/settings/companyApi";
// import { fetchAllTeam } from "../../../../api/api-client/settings/teamApi";
// import {
//   errorMessage,
//   successMessage,
// } from "../../../../api/api-config/apiResponseMessage";
// import {
//   fetchSubCategoriesByTeamId,
//   fetchClientsByBusinessEntityId,
//   store,
// } from "../../../../api/api-client/settings/slaApi";
// import { userContext } from "../../../context/UserContext";
// import {
//   storeSlaSubcatConfig,
//   fetchSlaSubcatConfigById,
//   updateSlaSubcatConfig,
// } from "../../../../api/api-client/settings/sla_subcat_configsApi";

// export const AddNewSLA = () => {
//   const { user } = useContext(userContext);
//   const [slaTypeCheck, setSLATypeCheck] = useState("");
//   const [companyOptions, setCompanyOptions] = useState([]);
//   const [teamOptions, setTeamOptions] = useState([]);
//   const [clientOptions, setClientOptions] = useState([]);
//   const [businessEntityId, setBusinessEntityId] = useState(null);
//   const [subCategoryByTeamOptions, setSubCategoryByTeamOptions] = useState([]);
//   const [resolutionWarning, setResolutionWarning] = useState('');
//   const [isLoading, setIsLoading] = useState(false);

//   const slaTypeOptions = [
//     { value: "Sub-Category", label: "Sub-Category" },
//     { value: "Client", label: "Client" },
//   ];

//   useEffect(() => {
//     setIsLoading(true);

//     const fetchCompanyOptions = () =>
//       fetchCompany({
//         userType: user?.type,
//         userId: user?.id,
//       }).then((response) =>
//         setCompanyOptions(
//           response.result.map((option) => ({
//             value: option.id,
//             label: option.company_name,
//           }))
//         )
//       );

//     const fetchTeamOptions = () => {
//       fetchAllTeam().then((response) => {
//         setTeamOptions(
//           response.data.map((option) => ({
//             value: option.id,
//             label: option.team_name,
//           }))
//         );
//       });
//     };

//     Promise.all([fetchCompanyOptions(), fetchTeamOptions()])
//       .catch(errorMessage)
//       .finally(() => setIsLoading(false));
//   }, [user]);

//   const customStyles = {
//     control: (provided) => ({
//       ...provided,
//       minHeight: "30px",
//       height: "30px",
//       width: "100%",
//     }),
//     valueContainer: (provided) => ({
//       ...provided,
//       height: "30px",
//       padding: "0 6px",
//     }),
//     input: (provided) => ({
//       ...provided,
//       margin: "0px",
//     }),
//     indicatorsContainer: (provided) => ({
//       ...provided,
//       height: "30px",
//     }),
//   };

//   const handleFetchSubcategoriesByTeam = (teamId) => {
//     if (teamId) {
//       fetchSubCategoriesByTeamId(teamId)
//         .then((response) => {
//           setSubCategoryByTeamOptions(
//             response.data.map((item) => ({
//               value: item.sub_category_id,
//               label: item.sub_category_in_english,
//             }))
//           );
//         })
//         .catch(errorMessage);
//     } else {
//       setSubCategoryByTeamOptions([]);
//     }
//   };

//   const formik = useFormik({
//     initialValues: {
//       businessEntity: "",
//       slaType: "",
//       slaForClient: "",
//       slaForTeam: "",
//       subcategories: [],
//       resolutionTime: "",
//       defaultEscalate: 1,
//       defaultStatus: 1,
//     },
//     onSubmit: (values, { resetForm }) => {
//       setIsLoading(true);

//       // Sub-Category SLA handling
//       if (slaTypeCheck === "Sub-Category") {
//         const payloads = values.subcategories.map((subcat) => ({
//           business_entity_id: values.businessEntity.value,
//           team_id: values.slaForTeam.value,
//           subcategory_id: subcat.value,
//           resolution_min: parseInt(values.resolutionTime),
//           sla_status: values.defaultStatus ? "Active" : "Inactive",
//           escalation_status: values.defaultEscalate ? "Escalate" : "No Escalate",
//         }));

//         Promise.all(
//           payloads.map((payload) => storeSlaSubcatConfig(payload))
//         )
//           .then(() => {
//             successMessage("SLA configuration saved successfully!");
//             resetForm();
//           })
//           .catch(errorMessage)
//           .finally(() => setIsLoading(false));
//       }

//       // Client SLA handling
//       if (slaTypeCheck === "Client") {
//         store(values)
//           .then((response) => {
//             successMessage(response);
//             resetForm();
//           })
//           .catch(errorMessage)
//           .finally(() => setIsLoading(false));
//       }
//     },
//   });

//   return (
//     <div className='row'>
//       <div className='col-sm-12 col-md-12 col-lg-12 col-xl-12'>
//         <div className='alert alert-secondary p-2' role='alert'>
//           <h6>Create New SLA Policy</h6>
//           <span>
//             <i>Please input the required information.</i>
//           </span>
//         </div>
//       </div>
//       <form onSubmit={formik.handleSubmit}>
//         <div className='row mb-4'>
//           <div className='col-sm-12 col-md-5 col-lg-5 col-xl-5'>
//             <div className='row'>
//               <div className='col-sm-12 col-md-12 col-lg-12 col-xl-12'>
//                 <div className='input-group mb-3'>
//                   <span className='input-group-text w-25'>Business Entity</span>
//                   <Select
//                     options={companyOptions}
//                     placeholder='Business entity'
//                     className='form-control'
//                     styles={customStyles}
//                     id='businessEntity'
//                     onChange={(option) => {
//                       formik.setFieldValue("businessEntity", option);
//                       setBusinessEntityId(option.value);
//                       if (slaTypeCheck === "Client") {
//                         formik.setFieldValue("slaForClient", null);
//                         fetchClientsByBusinessEntityId(option.value)
//                           .then((response) => {
//                             setClientOptions(
//                               response.data.map((item) => ({
//                                 value: item.client_id,
//                                 label: item.client_name,
//                               }))
//                             );
//                           })
//                           .catch(errorMessage);
//                       } else if (slaTypeCheck === "Sub-Category") {
//                         formik.setFieldValue("slaForTeam", null);
//                         formik.setFieldValue("subcategories", []);
//                       }
//                     }}
//                     value={formik.values.businessEntity}
//                   />
//                 </div>
//               </div>

//               <div className='col-sm-12 col-md-12 col-lg-12 col-xl-12'>
//                 <div className='input-group mb-3'>
//                   <span className='input-group-text w-25'>SLA Type</span>
//                   <Select
//                     options={slaTypeOptions}
//                     placeholder='SLA type'
//                     className='form-control'
//                     styles={customStyles}
//                     id='slaType'
//                     onChange={(option) => {
//                       formik.setFieldValue("slaType", option);
//                       setSLATypeCheck(option.value);
//                       if (option.value === "Client" && businessEntityId) {
//                         formik.setFieldValue("slaForClient", null);
//                         fetchClientsByBusinessEntityId(businessEntityId)
//                           .then((response) => {
//                             setClientOptions(
//                               response.data.map((item) => ({
//                                 value: item.client_id,
//                                 label: item.client_name,
//                               }))
//                             );
//                           })
//                           .catch(errorMessage);
//                       }
//                     }}
//                     value={formik.values.slaType}
//                   />
//                 </div>
//               </div>

//               {slaTypeCheck === "Client" && (
//                 <div className='col-sm-12 col-md-12 col-lg-12 col-xl-12'>
//                   <div className='input-group mb-3'>
//                     <span className='input-group-text w-25'>Client</span>
//                     <Select
//                       options={clientOptions}
//                       placeholder='Select client'
//                       className='form-control p-0'
//                       styles={customStyles}
//                       id='slaForClient'
//                       name='slaForClient'
//                       onChange={(option) => formik.setFieldValue("slaForClient", option)}
//                       value={formik.values.slaForClient}
//                     />
//                   </div>
//                 </div>
//               )}

//               {slaTypeCheck === "Sub-Category" && (
//                 <>
//                   <div className='col-sm-12 col-md-12 col-lg-12 col-xl-12'>
//                     <div className='input-group mb-3'>
//                       <span className='input-group-text w-25'>Team</span>
//                       <Select
//                         options={teamOptions}
//                         placeholder='Select team'
//                         className='form-control p-0'
//                         styles={customStyles}
//                         id='slaForTeam'
//                         name='slaForTeam'
//                         onChange={(option) => {
//                           formik.setFieldValue("slaForTeam", option);
//                           formik.setFieldValue("subcategories", []);
//                           handleFetchSubcategoriesByTeam(option.value);
//                         }}
//                         value={formik.values.slaForTeam}
//                       />
//                     </div>
//                   </div>

//                   <div className='col-sm-12 col-md-12 col-lg-12 col-xl-12'>
//                     <div className='input-group mb-3'>
//                       <span className='input-group-text w-25'>Select Sub-Category</span>
//                       <Select
//                         options={subCategoryByTeamOptions}
//                         placeholder='Select sub categories'
//                         className='form-control p-0'
//                         styles={customStyles}
//                         id='subcategories'
//                         name='subcategories'
//                         isMulti
//                         onChange={(options) => formik.setFieldValue("subcategories", options)}
//                         value={formik.values.subcategories}
//                       />
//                     </div>
//                   </div>
//                 </>
//               )}

//               <div className='col-sm-12 col-md-12 col-lg-12 col-xl-12'>
//                 <div className='input-group mb-3'>
//                   <span className='input-group-text w-25'>Resolution Time</span>
//                   <input
//                     type='text'
//                     className={`form-control ${formik.touched.resolutionTime && formik.errors.resolutionTime ? 'is-invalid' : ''}`}
//                     placeholder='Enter SLA in Minutes'
//                     id='resolutionTime'
//                     name='resolutionTime'
//                     onChange={(e) => {
//                       const value = e.target.value;
//                       if (/^\d*$/.test(value)) {
//                         formik.setFieldValue('resolutionTime', value);
//                         setResolutionWarning('');
//                       } else {
//                         setResolutionWarning('Only numbers allowed');
//                       }
//                     }}
//                     value={formik.values.resolutionTime}
//                   />
//                   {resolutionWarning && (
//                     <div className='text-danger mt-1'>{resolutionWarning}</div>
//                   )}
//                 </div>
//               </div>

//               <div className='col-sm-12 col-md-12 col-lg-12 col-xl-12'>
//                   <div className='d-flex justify-content-start'>
//                     <div className='form-check form-switch me-3'>
//                       <input
//                         className='form-check-input'
//                         type='checkbox'
//                         role='switch'
//                         id='defaultStatus'
//                         checked={formik.values.defaultStatus}
//                         onChange={(e) =>
//                           formik.setFieldValue(
//                             'defaultStatus',
//                             e.target.checked ? 1 : 0
//                           )
//                         }
//                       />
//                       <label className='form-check-label ms-2' htmlFor='defaultStatus'>
//                         Status
//                       </label>
//                     </div>
//                     <div className='form-check form-switch'>
//                       <input
//                         className='form-check-input'
//                         type='checkbox'
//                         role='switch'
//                         id='defaultEscalate'
//                         checked={formik.values.defaultEscalate}
//                         onChange={(e) =>
//                           formik.setFieldValue(
//                             'defaultEscalate',
//                             e.target.checked ? 1 : 0
//                           )
//                         }
//                       />
//                       <label className='form-check-label ms-2' htmlFor='defaultEscalate'>
//                         Escalation Status
//                       </label>
//                     </div>
//                   </div>
//                 </div>

//             </div>
//           </div>
//         </div>

//         <div className='text-end'>
//           <button type='submit' className='custom-btn' disabled={isLoading}>
//             {isLoading ? 'Saving...' : 'Save'}
//           </button>
//         </div>
//       </form>
//     </div>
//   );
// };



// import React, { useState, useEffect, useContext } from "react";
// import Select from "react-select";
// import { useFormik } from "formik";
// import * as Yup from "yup";
// import { fetchCompany } from "../../../../api/api-client/settings/companyApi";
// import { fetchAllTeam } from "../../../../api/api-client/settings/teamApi";
// import {
//   errorMessage,
//   successMessage,
// } from "../../../../api/api-config/apiResponseMessage";
// import {
//   fetchSubCategoriesByTeamId,
//   fetchClientsByBusinessEntityId,
//   store,
//   update,
// } from "../../../../api/api-client/settings/slaApi";
// import { userContext } from "../../../context/UserContext";
// import {
//   storeSlaSubcatConfig,
//   fetchSlaSubcatConfigById,
//   updateSlaSubcatConfig,
// } from "../../../../api/api-client/settings/sla_subcat_configsApi";
// import { storeSlaClientConfig,fetchSlaClientConfigById, updateSlaClientConfig } from "../../../../api/api-client/settings/slaClientConfigApi";

// export const AddNewSLA = ({ id }) => {
//   const { user } = useContext(userContext);
//   const [slaTypeCheck, setSLATypeCheck] = useState("");
//   const [companyOptions, setCompanyOptions] = useState([]);
//   const [teamOptions, setTeamOptions] = useState([]);
//   const [clientOptions, setClientOptions] = useState([]);
//   const [businessEntityId, setBusinessEntityId] = useState(null);
//   const [subCategoryByTeamOptions, setSubCategoryByTeamOptions] = useState([]);
//   const [resolutionWarning, setResolutionWarning] = useState("");
//   const [isLoading, setIsLoading] = useState(false);
//   const [isEditMode, setIsEditMode] = useState(!!id);

//   console.log("AddNewSLA Component - id prop:", id, "isEditMode:", !!id);

//   const slaTypeOptions = [
//     { value: "Sub-Category", label: "Sub-Category" },
//     { value: "Client", label: "Client" },
//   ];

//   useEffect(() => {
//     setIsLoading(true);

//     const fetchCompanyOptions = () =>
//       fetchCompany({
//         userType: user?.type,
//         userId: user?.id,
//       }).then((response) =>
//         setCompanyOptions(
//           response.result.map((option) => ({
//             value: option.id,
//             label: option.company_name,
//           }))
//         )
//       );

//     const fetchTeamOptions = () => {
//       fetchAllTeam().then((response) => {
//         setTeamOptions(
//           response.data.map((option) => ({
//             value: option.id,
//             label: option.team_name,
//           }))
//         );
//       });
//     };

//     Promise.all([fetchCompanyOptions(), fetchTeamOptions()])
//       .catch(errorMessage)
//       .finally(() => setIsLoading(false));
//   }, [user]);

//   const customStyles = {
//     control: (provided) => ({
//       ...provided,
//       minHeight: "30px",
//       height: "30px",
//       width: "100%",
//     }),
//     valueContainer: (provided) => ({
//       ...provided,
//       height: "30px",
//       padding: "0 6px",
//     }),
//     input: (provided) => ({
//       ...provided,
//       margin: "0px",
//     }),
//     indicatorsContainer: (provided) => ({
//       ...provided,
//       height: "30px",
//     }),
//   };

//   const handleFetchSubcategoriesByTeam = (teamId) => {
//     if (teamId) {
//       fetchSubCategoriesByTeamId(teamId, businessEntityId)
//         .then((response) => {
//           setSubCategoryByTeamOptions(
//             response.data.map((item) => ({
//               value: item.sub_category_id,
//               label: item.sub_category_in_english,
//             }))
//           );
//         })
//         .catch(errorMessage);
//     } else {
//       setSubCategoryByTeamOptions([]);
//     }
//   };

//   // Fetch existing SLA data if id is provided
//   useEffect(() => {
//     if (id) {
//       console.log("Fetching SLA with ID:", id);
//       setIsEditMode(true);
//       setIsLoading(true);
//       fetchSlaSubcatConfigById(id)
//         .then((response) => {
//           console.log("SLA Data Response:", response.data);
//           const data = response.data[0];
//           console.log("sla_status:", data.sla_status, "Type:", typeof data.sla_status);
//           console.log("escalation_status:", data.escalation_status, "Type:", typeof data.escalation_status);
          
//           setSLATypeCheck("Sub-Category");
//           setBusinessEntityId(data.business_entity_id);

//           // Fetch subcategories for the team
//           if (data.team_id) {
//             fetchSubCategoriesByTeamId(data.team_id, data.business_entity_id)
//               .then((response) => {
//                 setSubCategoryByTeamOptions(
//                   response.data.map((item) => ({
//                     value: item.sub_category_id,
//                     label: item.sub_category_in_english,
//                   }))
//                 );
//               })
//               .catch(errorMessage);
//           }

//           // Determine status values - handle string "1" or "0"
//           const statusValue = data.sla_status === "1" || data.sla_status === 1 || data.sla_status === true ? 1 : 0;
//           const escalateValue = data.escalation_status === "1" || data.escalation_status === 1 || data.escalation_status === true ? 1 : 0;

//           console.log("statusValue:", statusValue, "escalateValue:", escalateValue);

//           // Set all values in updateFormik
//           updateFormik.setValues({
//             businessEntity: {
//               value: data.business_entity_id,
//               label: data.company_name,
//             },
//             slaForTeam: {
//               value: data.team_id,
//               label: data.team_name,
//             },
//             subcategories: [
//               {
//                 value: data.subcategory_id,
//                 label: data.sub_category_in_english,
//               },
//             ],
//             resolutionTime: data.resolution_min?.toString() || "",
//             defaultStatus: statusValue,
//             defaultEscalate: escalateValue,
//           });
//         })
//         .catch((err) => {
//           console.error("Error fetching SLA:", err);
//           errorMessage(err);
//         })
//         .finally(() => setIsLoading(false));
//     } else {
//       setIsEditMode(false);
//     }
//   }, [id]);

//   const formik = useFormik({
//     initialValues: {
//       businessEntity: "",
//       slaType: "",
//       slaForClient: "",
//       slaForTeam: "",
//       subcategories: [],
//       resolutionTime: "",
//       defaultEscalate: 1,
//       defaultStatus: 1,
//     },
//     onSubmit: (values, { resetForm }) => {
//       setIsLoading(true);

//       // Sub-Category SLA handling
//       if (slaTypeCheck === "Sub-Category") {
//         const payloads = values.subcategories.map((subcat) => ({
//           business_entity_id: values.businessEntity.value,
//           team_id: values.slaForTeam.value,
//           subcategory_id: subcat.value,
//           resolution_min: parseInt(values.resolutionTime),
//           sla_status: values.defaultStatus ? "1" : "0",
//           escalation_status: values.defaultEscalate ? "1" : "0",
//         }));

//         Promise.all(
//           payloads.map((payload) => storeSlaSubcatConfig(payload))
//         )
//           .then(() => {
//             successMessage("SLA configuration saved successfully!");
//             resetForm();
//           })
//           .catch(errorMessage)
//           .finally(() => setIsLoading(false));
//       }

//       // Client SLA handling
//       if (slaTypeCheck === "Client") {
//         store(values)
//           .then((response) => {
//             successMessage(response);
//             resetForm();
//           })
//           .catch(errorMessage)
//           .finally(() => setIsLoading(false));
//       }
//     },
//   });

//   // Update FormIK for edit mode
//   const updateFormik = useFormik({
//     initialValues: {
//       businessEntity: "",
//       slaForTeam: "",
//       subcategories: [],
//       resolutionTime: "",
//       defaultStatus: 1,
//       defaultEscalate: 1,
//     },
//     onSubmit: (values, { resetForm }) => {
//       setIsLoading(true);
//       const payload = {
//         business_entity_id: values.businessEntity.value,
//         team_id: values.slaForTeam.value,
//         subcategory_id: values.subcategories[0]?.value,
//         resolution_min: parseInt(values.resolutionTime),
//         sla_status: values.defaultStatus ? "1" : "0",
//         escalation_status: values.defaultEscalate ? "1" : "0",
//       };

//       updateSlaSubcatConfig(id, payload)
//         .then(() => {
//           successMessage("SLA configuration updated successfully!");
//           resetForm();
//         })
//         .catch(errorMessage)
//         .finally(() => setIsLoading(false));
//     },
//   });

//   // SHOW UPDATE FORM IF ID EXISTS
//   if (isEditMode && id) {
//     return (
//       <div className="row">
//         <div className="col-sm-12 col-md-12 col-lg-12 col-xl-12">
//           <div className="alert alert-secondary p-2" role="alert">
//             <h6>Update SLA Policy</h6>
//             <span>
//               <i>Please input the required information.</i>
//             </span>
//           </div>
//         </div>
//         <form onSubmit={updateFormik.handleSubmit}>
//           <div className="row mb-4">
//             <div className="col-sm-12 col-md-5 col-lg-5 col-xl-5">
//               <div className="row">
//                 <div className="col-sm-12 col-md-12 col-lg-12 col-xl-12">
//                   <div className="input-group mb-3">
//                     <span className="input-group-text w-25">
//                       Business Entity
//                     </span>
//                     <Select
//                       options={companyOptions}
//                       placeholder="Business entity"
//                       className="form-control"
//                       styles={customStyles}
//                       id="businessEntity"
//                       value={updateFormik.values.businessEntity}
//                       isDisabled={true}
//                     />
//                   </div>
//                 </div>

//                 <div className="col-sm-12 col-md-12 col-lg-12 col-xl-12">
//                   <div className="input-group mb-3">
//                     <span className="input-group-text w-25">Team</span>
//                     <Select
//                       options={teamOptions}
//                       placeholder="Select team"
//                       className="form-control p-0"
//                       styles={customStyles}
//                       id="slaForTeam"
//                       value={updateFormik.values.slaForTeam}
//                       isDisabled={true}
//                     />
//                   </div>
//                 </div>

//                 <div className="col-sm-12 col-md-12 col-lg-12 col-xl-12">
//                   <div className="input-group mb-3">
//                     <span className="input-group-text w-25">
//                       Sub-Category
//                     </span>
//                     <Select
//                       options={subCategoryByTeamOptions}
//                       placeholder="Select sub categories"
//                       className="form-control p-0"
//                       styles={customStyles}
//                       id="subcategories"
//                       name="subcategories"
//                       value={updateFormik.values.subcategories}
//                       isDisabled={true}
//                     />
//                   </div>
//                 </div>

//                 <div className="col-sm-12 col-md-12 col-lg-12 col-xl-12">
//                   <div className="input-group mb-3">
//                     <span className="input-group-text w-25">
//                       Resolution Time
//                     </span>
//                     <input
//                       type="text"
//                       className="form-control"
//                       placeholder="Enter SLA in Minutes"
//                       id="resolutionTime"
//                       name="resolutionTime"
//                       onChange={(e) => {
//                         const value = e.target.value;
//                         if (/^\d*$/.test(value)) {
//                           updateFormik.setFieldValue("resolutionTime", value);
//                           setResolutionWarning("");
//                         } else {
//                           setResolutionWarning("Only numbers allowed");
//                         }
//                       }}
//                       value={updateFormik.values.resolutionTime}
//                       disabled={isLoading}
//                     />
//                     {resolutionWarning && (
//                       <div className="text-danger mt-1">
//                         {resolutionWarning}
//                       </div>
//                     )}
//                   </div>
//                 </div>

//                 <div className="col-sm-12 col-md-12 col-lg-12 col-xl-12">
//                   <div className="d-flex justify-content-start gap-5">
//                     <div className="form-check form-switch me-3">
//                       <input
//                         className="form-check-input"
//                         type="checkbox"
//                         role="switch"
//                         id="defaultStatus"
//                         checked={updateFormik.values.defaultStatus}
//                         onChange={(e) =>
//                           updateFormik.setFieldValue(
//                             "defaultStatus",
//                             e.target.checked ? 1 : 0
//                           )
//                         }
//                         disabled={isLoading}
//                       />
//                       <label
//                         className="form-check-label ms-2"
//                         htmlFor="defaultStatus"
//                       >
//                         Service Time SLA ( Active / Inactive )
//                       </label>
//                     </div>
//                     <div className="form-check form-switch">
//                       <input
//                         className="form-check-input"
//                         type="checkbox"
//                         role="switch"
//                         id="defaultEscalate"
//                         checked={updateFormik.values.defaultEscalate}
//                         onChange={(e) =>
//                           updateFormik.setFieldValue(
//                             "defaultEscalate",
//                             e.target.checked ? 1 : 0
//                           )
//                         }
//                         disabled={isLoading}
//                       />
//                       <label
//                         className="form-check-label ms-2"
//                         htmlFor="defaultEscalate"
//                       >
//                         Escalate ( Yes / No )
//                       </label>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>

//           <div className="text-end">
//             <button type="submit" className="custom-btn" disabled={isLoading}>
//               {isLoading ? "Updating..." : "Update"}
//             </button>
//           </div>
//         </form>
//       </div>
//     );
//   }

//   // SHOW CREATE FORM IF NO ID
//   return (
//     <div className="row">
//       <div className="col-sm-12 col-md-12 col-lg-12 col-xl-12">
//         <div className="alert alert-secondary p-2" role="alert">
//           <h6>Create New SLA Policy</h6>
//           <span>
//             <i>Please input the required information.</i>
//           </span>
//         </div>
//       </div>
//       <form onSubmit={formik.handleSubmit}>
//         <div className="row mb-4">
//           <div className="col-sm-12 col-md-5 col-lg-5 col-xl-5">
//             <div className="row">
//               <div className="col-sm-12 col-md-12 col-lg-12 col-xl-12">
//                 <div className="input-group mb-3">
//                   <span className="input-group-text w-25">Business Entity</span>
//                   <Select
//                     options={companyOptions}
//                     placeholder="Business entity"
//                     className="form-control"
//                     styles={customStyles}
//                     id="businessEntity"
//                     onChange={(option) => {
//                       formik.setFieldValue("businessEntity", option);
//                       setBusinessEntityId(option.value);
//                       if (slaTypeCheck === "Client") {
//                         formik.setFieldValue("slaForClient", null);
//                         fetchClientsByBusinessEntityId(option.value)
//                           .then((response) => {
//                             setClientOptions(
//                               response.data.map((item) => ({
//                                 value: item.client_id,
//                                 label: item.client_name,
//                               }))
//                             );
//                           })
//                           .catch(errorMessage);
//                       } else if (slaTypeCheck === "Sub-Category") {
//                         formik.setFieldValue("slaForTeam", null);
//                         formik.setFieldValue("subcategories", []);
//                       }
//                     }}
//                     value={formik.values.businessEntity}
//                     isDisabled={isLoading}
//                   />
//                 </div>
//               </div>

//               <div className="col-sm-12 col-md-12 col-lg-12 col-xl-12">
//                 <div className="input-group mb-3">
//                   <span className="input-group-text w-25">SLA Type</span>
//                   <Select
//                     options={slaTypeOptions}
//                     placeholder="SLA type"
//                     className="form-control"
//                     styles={customStyles}
//                     id="slaType"
//                     onChange={(option) => {
//                       formik.setFieldValue("slaType", option);
//                       setSLATypeCheck(option.value);
//                       if (option.value === "Client" && businessEntityId) {
//                         formik.setFieldValue("slaForClient", null);
//                         fetchClientsByBusinessEntityId(businessEntityId)
//                           .then((response) => {
//                             setClientOptions(
//                               response.data.map((item) => ({
//                                 value: item.client_id,
//                                 label: item.client_name,
//                               }))
//                             );
//                           })
//                           .catch(errorMessage);
//                       }
//                     }}
//                     value={formik.values.slaType}
//                     isDisabled={isLoading}
//                   />
//                 </div>
//               </div>

//               {slaTypeCheck === "Client" && (
//                 <div className="col-sm-12 col-md-12 col-lg-12 col-xl-12">
//                   <div className="input-group mb-3">
//                     <span className="input-group-text w-25">Client</span>
//                     <Select
//                       options={clientOptions}
//                       placeholder="Select client"
//                       className="form-control p-0"
//                       styles={customStyles}
//                       id="slaForClient"
//                       name="slaForClient"
//                       onChange={(option) =>
//                         formik.setFieldValue("slaForClient", option)
//                       }
//                       value={formik.values.slaForClient}
//                       isDisabled={isLoading}
//                     />
//                   </div>
//                 </div>
//               )}

//               {slaTypeCheck === "Sub-Category" && (
//                 <>
//                   <div className="col-sm-12 col-md-12 col-lg-12 col-xl-12">
//                     <div className="input-group mb-3">
//                       <span className="input-group-text w-25">Team</span>
//                       <Select
//                         options={teamOptions}
//                         placeholder="Select team"
//                         className="form-control p-0"
//                         styles={customStyles}
//                         id="slaForTeam"
//                         name="slaForTeam"
//                         onChange={(option) => {
//                           formik.setFieldValue("slaForTeam", option);
//                           formik.setFieldValue("subcategories", []);
//                           handleFetchSubcategoriesByTeam(option.value);
//                         }}
//                         value={formik.values.slaForTeam}
//                         isDisabled={isLoading}
//                       />
//                     </div>
//                   </div>

//                   <div className="col-sm-12 col-md-12 col-lg-12 col-xl-12">
//                     <div className="input-group mb-3">
//                       <span className="input-group-text w-25">
//                         Select Sub-Category
//                       </span>
//                       <Select
//                         options={subCategoryByTeamOptions}
//                         placeholder="Select sub categories"
//                         className="form-control p-0"
//                         styles={customStyles}
//                         id="subcategories"
//                         name="subcategories"
//                         isMulti
//                         onChange={(options) =>
//                           formik.setFieldValue("subcategories", options)
//                         }
//                         value={formik.values.subcategories}
//                         isDisabled={isLoading}
//                       />
//                     </div>
//                   </div>
//                 </>
//               )}

//               <div className="col-sm-12 col-md-12 col-lg-12 col-xl-12">
//                 <div className="input-group mb-3">
//                   <span className="input-group-text w-25">Resolution Time</span>
//                   <input
//                     type="text"
//                     className={`form-control ${
//                       resolutionWarning ? "is-invalid" : ""
//                     }`}
//                     placeholder="Enter SLA in Minutes"
//                     id="resolutionTime"
//                     name="resolutionTime"
//                     onChange={(e) => {
//                       const value = e.target.value;
//                       if (/^\d*$/.test(value)) {
//                         formik.setFieldValue("resolutionTime", value);
//                         setResolutionWarning("");
//                       } else {
//                         setResolutionWarning("Only numbers allowed");
//                       }
//                     }}
//                     value={formik.values.resolutionTime}
//                     disabled={isLoading}
//                   />
//                   {resolutionWarning && (
//                     <div className="text-danger mt-1">{resolutionWarning}</div>
//                   )}
//                 </div>
//               </div>

//               <div className="col-sm-12 col-md-12 col-lg-12 col-xl-12">
//                 <div className="d-flex justify-content-start gap-5">
//                   <div className="form-check form-switch me-3">
//                     <input
//                       className="form-check-input"
//                       type="checkbox"
//                       role="switch"
//                       id="defaultStatus"
//                       checked={formik.values.defaultStatus}
//                       onChange={(e) =>
//                         formik.setFieldValue(
//                           "defaultStatus",
//                           e.target.checked ? 1 : 0
//                         )
//                       }
//                       disabled={isLoading}
//                     />
//                     <label
//                       className="form-check-label ms-2"
//                       htmlFor="defaultStatus"
//                     >
//                       Service Time SLA ( Active / Inactive )
//                     </label>
//                   </div>
//                   <div className="form-check form-switch">
//                     <input
//                       className="form-check-input"
//                       type="checkbox"
//                       role="switch"
//                       id="defaultEscalate"
//                       checked={formik.values.defaultEscalate}
//                       onChange={(e) =>
//                         formik.setFieldValue(
//                           "defaultEscalate",
//                           e.target.checked ? 1 : 0
//                         )
//                       }
//                       disabled={isLoading}
//                     />
//                     <label
//                       className="form-check-label ms-2"
//                       htmlFor="defaultEscalate"
//                     >
//                       Escalate ( Yes / No )
//                     </label>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>

//         <div className="text-end">
//           <button type="submit" className="custom-btn" disabled={isLoading}>
//             {isLoading ? "Saving..." : "Save"}
//           </button>
//         </div>
//       </form>
//     </div>
//   );
// };







// import React, { useState, useEffect, useContext } from "react";
// import Select from "react-select";
// import { useFormik } from "formik";
// import * as Yup from "yup";
// import { fetchCompany } from "../../../../api/api-client/settings/companyApi";
// import { fetchAllTeam } from "../../../../api/api-client/settings/teamApi";
// import {
//   errorMessage,
//   successMessage,
// } from "../../../../api/api-config/apiResponseMessage";
// import {
//   fetchSubCategoriesByTeamId,
//   fetchClientsByBusinessEntityId,
//   store,
//   update,
// } from "../../../../api/api-client/settings/slaApi";
// import { userContext } from "../../../context/UserContext";
// import {
//   storeSlaSubcatConfig,
//   fetchSlaSubcatConfigById,
//   updateSlaSubcatConfig,
// } from "../../../../api/api-client/settings/sla_subcat_configsApi";
// import {
//   storeSlaClientConfig,
//   fetchSlaClientConfigById,
//   updateSlaClientConfig,
// } from "../../../../api/api-client/settings/slaClientConfigApi";

// export const AddNewSLA = ({ id }) => {
//   const { user } = useContext(userContext);
//   const [slaTypeCheck, setSLATypeCheck] = useState("");
//   const [companyOptions, setCompanyOptions] = useState([]);
//   const [teamOptions, setTeamOptions] = useState([]);
//   const [clientOptions, setClientOptions] = useState([]);
//   const [businessEntityId, setBusinessEntityId] = useState(null);
//   const [subCategoryByTeamOptions, setSubCategoryByTeamOptions] = useState([]);
//   const [resolutionWarning, setResolutionWarning] = useState("");
//   const [isLoading, setIsLoading] = useState(false);
//   const [isEditMode, setIsEditMode] = useState(!!id);

//   console.log("AddNewSLA Component - id prop:", id, "isEditMode:", !!id);

//   const slaTypeOptions = [
//     { value: "Sub-Category", label: "Sub-Category" },
//     { value: "Client", label: "Client" },
//   ];

//   useEffect(() => {
//     setIsLoading(true);

//     const fetchCompanyOptions = () =>
//       fetchCompany({
//         userType: user?.type,
//         userId: user?.id,
//       }).then((response) =>
//         setCompanyOptions(
//           response.result.map((option) => ({
//             value: option.id,
//             label: option.company_name,
//           }))
//         )
//       );

//     const fetchTeamOptions = () => {
//       fetchAllTeam().then((response) => {
//         setTeamOptions(
//           response.data.map((option) => ({
//             value: option.id,
//             label: option.team_name,
//           }))
//         );
//       });
//     };

//     Promise.all([fetchCompanyOptions(), fetchTeamOptions()])
//       .catch(errorMessage)
//       .finally(() => setIsLoading(false));
//   }, [user]);

//   const customStyles = {
//     control: (provided) => ({
//       ...provided,
//       minHeight: "30px",
//       height: "30px",
//       width: "100%",
//     }),
//     valueContainer: (provided) => ({
//       ...provided,
//       height: "30px",
//       padding: "0 6px",
//     }),
//     input: (provided) => ({
//       ...provided,
//       margin: "0px",
//     }),
//     indicatorsContainer: (provided) => ({
//       ...provided,
//       height: "30px",
//     }),
//   };

//   const handleFetchSubcategoriesByTeam = (teamId) => {
//     if (teamId) {
//       fetchSubCategoriesByTeamId(teamId, businessEntityId)
//         .then((response) => {
//           setSubCategoryByTeamOptions(
//             response.data.map((item) => ({
//               value: item.sub_category_id,
//               label: item.sub_category_in_english,
//             }))
//           );
//         })
//         .catch(errorMessage);
//     } else {
//       setSubCategoryByTeamOptions([]);
//     }
//   };

//   // Fetch existing SLA data if id is provided
//   useEffect(() => {
//     if (id) {
//       console.log("Fetching SLA with ID:", id);
//       setIsEditMode(true);
//       setIsLoading(true);
//       fetchSlaSubcatConfigById(id)
//         .then((response) => {
//           console.log("SLA Data Response:", response.data);
//           const data = response.data[0];
//           console.log("sla_status:", data.sla_status, "Type:", typeof data.sla_status);
//           console.log("escalation_status:", data.escalation_status, "Type:", typeof data.escalation_status);
          
//           setSLATypeCheck("Sub-Category");
//           setBusinessEntityId(data.business_entity_id);

//           // Fetch subcategories for the team
//           if (data.team_id) {
//             fetchSubCategoriesByTeamId(data.team_id, data.business_entity_id)
//               .then((response) => {
//                 setSubCategoryByTeamOptions(
//                   response.data.map((item) => ({
//                     value: item.sub_category_id,
//                     label: item.sub_category_in_english,
//                   }))
//                 );
//               })
//               .catch(errorMessage);
//           }

//           // Determine status values - handle string "1" or "0"
//           const statusValue = data.sla_status === "1" || data.sla_status === 1 || data.sla_status === true ? 1 : 0;
//           const escalateValue = data.escalation_status === "1" || data.escalation_status === 1 || data.escalation_status === true ? 1 : 0;

//           console.log("statusValue:", statusValue, "escalateValue:", escalateValue);

//           // Set all values in updateFormik
//           updateFormik.setValues({
//             businessEntity: {
//               value: data.business_entity_id,
//               label: data.company_name,
//             },
//             slaForTeam: {
//               value: data.team_id,
//               label: data.team_name,
//             },
//             subcategories: [
//               {
//                 value: data.subcategory_id,
//                 label: data.sub_category_in_english,
//               },
//             ],
//             resolutionTime: data.resolution_min?.toString() || "",
//             defaultStatus: statusValue,
//             defaultEscalate: escalateValue,
//           });
//         })
//         .catch((err) => {
//           console.error("Error fetching SLA:", err);
//           errorMessage(err);
//         })
//         .finally(() => setIsLoading(false));
//     } else {
//       setIsEditMode(false);
//     }
//   }, [id]);

//   const formik = useFormik({
//     initialValues: {
//       businessEntity: "",
//       slaType: "",
//       slaForClient: "",
//       slaForTeam: "",
//       subcategories: [],
//       resolutionTime: "",
//       defaultEscalate: 1,
//       defaultStatus: 1,
//     },
//     onSubmit: (values, { resetForm }) => {
//       setIsLoading(true);

//       // Sub-Category SLA handling
//       if (slaTypeCheck === "Sub-Category") {
//         const payloads = values.subcategories.map((subcat) => ({
//           business_entity_id: values.businessEntity.value,
//           team_id: values.slaForTeam.value,
//           subcategory_id: subcat.value,
//           resolution_min: parseInt(values.resolutionTime),
//           sla_status: values.defaultStatus ? "1" : "0",
//           escalation_status: values.defaultEscalate ? "1" : "0",
//         }));

//         Promise.all(
//           payloads.map((payload) => storeSlaSubcatConfig(payload))
//         )
//           .then(() => {
//             successMessage("SLA configuration saved successfully!");
//             resetForm();
//           })
//           .catch(errorMessage)
//           .finally(() => setIsLoading(false));
//       }

//       // Client SLA handling
//       if (slaTypeCheck === "Client") {
//         const clientPayload = {
//           business_entity_id: values.businessEntity.value,
//           client_id: values.slaForClient.value,
//           client_vendor_id: null, // Optional field from backend
//           resolution_min: parseInt(values.resolutionTime),
//           sla_status: values.defaultStatus ? "1" : "0",
//           escalation_status: values.defaultEscalate ? "1" : "0",
//         };

//         storeSlaClientConfig(clientPayload)
//           .then((response) => {
//             successMessage(response.message || "Client SLA configuration saved successfully!");
//             resetForm();
//           })
//           .catch((err) => {
//             if (err.response?.status === 409) {
//               errorMessage(err.response.data.message || "SLA Client Config already exists");
//             } else {
//               errorMessage(err);
//             }
//           })
//           .finally(() => setIsLoading(false));
//       }
//     },
//   });

//   // Update FormIK for edit mode
//   const updateFormik = useFormik({
//     initialValues: {
//       businessEntity: "",
//       slaForTeam: "",
//       subcategories: [],
//       resolutionTime: "",
//       defaultStatus: 1,
//       defaultEscalate: 1,
//     },
//     onSubmit: (values, { resetForm }) => {
//       setIsLoading(true);
//       const payload = {
//         business_entity_id: values.businessEntity.value,
//         team_id: values.slaForTeam.value,
//         subcategory_id: values.subcategories[0]?.value,
//         resolution_min: parseInt(values.resolutionTime),
//         sla_status: values.defaultStatus ? "1" : "0",
//         escalation_status: values.defaultEscalate ? "1" : "0",
//       };

//       updateSlaSubcatConfig(id, payload)
//         .then(() => {
//           successMessage("SLA configuration updated successfully!");
//           resetForm();
//         })
//         .catch(errorMessage)
//         .finally(() => setIsLoading(false));
//     },
//   });

//   // SHOW UPDATE FORM IF ID EXISTS
//   if (isEditMode && id) {
//     return (
//       <div className="row">
//         <div className="col-sm-12 col-md-12 col-lg-12 col-xl-12">
//           <div className="alert alert-secondary p-2" role="alert">
//             <h6>Update SLA Policy</h6>
//             <span>
//               <i>Please input the required information.</i>
//             </span>
//           </div>
//         </div>
//         <form onSubmit={updateFormik.handleSubmit}>
//           <div className="row mb-4">
//             <div className="col-sm-12 col-md-5 col-lg-5 col-xl-5">
//               <div className="row">
//                 <div className="col-sm-12 col-md-12 col-lg-12 col-xl-12">
//                   <div className="input-group mb-3">
//                     <span className="input-group-text w-25">
//                       Business Entity
//                     </span>
//                     <Select
//                       options={companyOptions}
//                       placeholder="Business entity"
//                       className="form-control"
//                       styles={customStyles}
//                       id="businessEntity"
//                       value={updateFormik.values.businessEntity}
//                       isDisabled={true}
//                     />
//                   </div>
//                 </div>

//                 <div className="col-sm-12 col-md-12 col-lg-12 col-xl-12">
//                   <div className="input-group mb-3">
//                     <span className="input-group-text w-25">Team</span>
//                     <Select
//                       options={teamOptions}
//                       placeholder="Select team"
//                       className="form-control p-0"
//                       styles={customStyles}
//                       id="slaForTeam"
//                       value={updateFormik.values.slaForTeam}
//                       isDisabled={true}
//                     />
//                   </div>
//                 </div>

//                 <div className="col-sm-12 col-md-12 col-lg-12 col-xl-12">
//                   <div className="input-group mb-3">
//                     <span className="input-group-text w-25">
//                       Sub-Category
//                     </span>
//                     <Select
//                       options={subCategoryByTeamOptions}
//                       placeholder="Select sub categories"
//                       className="form-control p-0"
//                       styles={customStyles}
//                       id="subcategories"
//                       name="subcategories"
//                       value={updateFormik.values.subcategories}
//                       isDisabled={true}
//                     />
//                   </div>
//                 </div>

//                 <div className="col-sm-12 col-md-12 col-lg-12 col-xl-12">
//                   <div className="input-group mb-3">
//                     <span className="input-group-text w-25">
//                       Resolution Time
//                     </span>
//                     <input
//                       type="text"
//                       className="form-control"
//                       placeholder="Enter SLA in Minutes"
//                       id="resolutionTime"
//                       name="resolutionTime"
//                       onChange={(e) => {
//                         const value = e.target.value;
//                         if (/^\d*$/.test(value)) {
//                           updateFormik.setFieldValue("resolutionTime", value);
//                           setResolutionWarning("");
//                         } else {
//                           setResolutionWarning("Only numbers allowed");
//                         }
//                       }}
//                       value={updateFormik.values.resolutionTime}
//                       disabled={isLoading}
//                     />
//                     {resolutionWarning && (
//                       <div className="text-danger mt-1">
//                         {resolutionWarning}
//                       </div>
//                     )}
//                   </div>
//                 </div>

//                 <div className="col-sm-12 col-md-12 col-lg-12 col-xl-12">
//                   <div className="d-flex justify-content-start gap-5">
//                     <div className="form-check form-switch me-3">
//                       <input
//                         className="form-check-input"
//                         type="checkbox"
//                         role="switch"
//                         id="defaultStatus"
//                         checked={updateFormik.values.defaultStatus}
//                         onChange={(e) =>
//                           updateFormik.setFieldValue(
//                             "defaultStatus",
//                             e.target.checked ? 1 : 0
//                           )
//                         }
//                         disabled={isLoading}
//                       />
//                       <label
//                         className="form-check-label ms-2"
//                         htmlFor="defaultStatus"
//                       >
//                         Service Time SLA ( Active / Inactive )
//                       </label>
//                     </div>
//                     <div className="form-check form-switch">
//                       <input
//                         className="form-check-input"
//                         type="checkbox"
//                         role="switch"
//                         id="defaultEscalate"
//                         checked={updateFormik.values.defaultEscalate}
//                         onChange={(e) =>
//                           updateFormik.setFieldValue(
//                             "defaultEscalate",
//                             e.target.checked ? 1 : 0
//                           )
//                         }
//                         disabled={isLoading}
//                       />
//                       <label
//                         className="form-check-label ms-2"
//                         htmlFor="defaultEscalate"
//                       >
//                         Escalate ( Yes / No )
//                       </label>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>

//           <div className="text-end">
//             <button type="submit" className="custom-btn" disabled={isLoading}>
//               {isLoading ? "Updating..." : "Update"}
//             </button>
//           </div>
//         </form>
//       </div>
//     );
//   }

//   // SHOW CREATE FORM IF NO ID
//   return (
//     <div className="row">
//       <div className="col-sm-12 col-md-12 col-lg-12 col-xl-12">
//         <div className="alert alert-secondary p-2" role="alert">
//           <h6>Create New SLA Policy</h6>
//           <span>
//             <i>Please input the required information.</i>
//           </span>
//         </div>
//       </div>
//       <form onSubmit={formik.handleSubmit}>
//         <div className="row mb-4">
//           <div className="col-sm-12 col-md-5 col-lg-5 col-xl-5">
//             <div className="row">
//               <div className="col-sm-12 col-md-12 col-lg-12 col-xl-12">
//                 <div className="input-group mb-3">
//                   <span className="input-group-text w-25">Business Entity</span>
//                   <Select
//                     options={companyOptions}
//                     placeholder="Business entity"
//                     className="form-control"
//                     styles={customStyles}
//                     id="businessEntity"
//                     onChange={(option) => {
//                       formik.setFieldValue("businessEntity", option);
//                       setBusinessEntityId(option.value);
//                       if (slaTypeCheck === "Client") {
//                         formik.setFieldValue("slaForClient", null);
//                         fetchClientsByBusinessEntityId(option.value)
//                           .then((response) => {
//                             setClientOptions(
//                               response.data.map((item) => ({
//                                 value: item.client_id,
//                                 label: item.client_name,
//                               }))
//                             );
//                           })
//                           .catch(errorMessage);
//                       } else if (slaTypeCheck === "Sub-Category") {
//                         formik.setFieldValue("slaForTeam", null);
//                         formik.setFieldValue("subcategories", []);
//                       }
//                     }}
//                     value={formik.values.businessEntity}
//                     isDisabled={isLoading}
//                   />
//                 </div>
//               </div>

//               <div className="col-sm-12 col-md-12 col-lg-12 col-xl-12">
//                 <div className="input-group mb-3">
//                   <span className="input-group-text w-25">SLA Type</span>
//                   <Select
//                     options={slaTypeOptions}
//                     placeholder="SLA type"
//                     className="form-control"
//                     styles={customStyles}
//                     id="slaType"
//                     onChange={(option) => {
//                       formik.setFieldValue("slaType", option);
//                       setSLATypeCheck(option.value);
//                       if (option.value === "Client" && businessEntityId) {
//                         formik.setFieldValue("slaForClient", null);
//                         fetchClientsByBusinessEntityId(businessEntityId)
//                           .then((response) => {
//                             setClientOptions(
//                               response.data.map((item) => ({
//                                 value: item.client_id,
//                                 label: item.client_name,
//                               }))
//                             );
//                           })
//                           .catch(errorMessage);
//                       }
//                     }}
//                     value={formik.values.slaType}
//                     isDisabled={isLoading}
//                   />
//                 </div>
//               </div>

//               {slaTypeCheck === "Client" && (
//                 <div className="col-sm-12 col-md-12 col-lg-12 col-xl-12">
//                   <div className="input-group mb-3">
//                     <span className="input-group-text w-25">Client</span>
//                     <Select
//                       options={clientOptions}
//                       placeholder="Select client"
//                       className="form-control p-0"
//                       styles={customStyles}
//                       id="slaForClient"
//                       name="slaForClient"
//                       onChange={(option) =>
//                         formik.setFieldValue("slaForClient", option)
//                       }
//                       value={formik.values.slaForClient}
//                       isDisabled={isLoading}
//                     />
//                   </div>
//                 </div>
//               )}

//               {slaTypeCheck === "Sub-Category" && (
//                 <>
//                   <div className="col-sm-12 col-md-12 col-lg-12 col-xl-12">
//                     <div className="input-group mb-3">
//                       <span className="input-group-text w-25">Team</span>
//                       <Select
//                         options={teamOptions}
//                         placeholder="Select team"
//                         className="form-control p-0"
//                         styles={customStyles}
//                         id="slaForTeam"
//                         name="slaForTeam"
//                         onChange={(option) => {
//                           formik.setFieldValue("slaForTeam", option);
//                           formik.setFieldValue("subcategories", []);
//                           handleFetchSubcategoriesByTeam(option.value);
//                         }}
//                         value={formik.values.slaForTeam}
//                         isDisabled={isLoading}
//                       />
//                     </div>
//                   </div>

//                   <div className="col-sm-12 col-md-12 col-lg-12 col-xl-12">
//                     <div className="input-group mb-3">
//                       <span className="input-group-text w-25">
//                         Select Sub-Category
//                       </span>
//                       <Select
//                         options={subCategoryByTeamOptions}
//                         placeholder="Select sub categories"
//                         className="form-control p-0"
//                         styles={customStyles}
//                         id="subcategories"
//                         name="subcategories"
//                         isMulti
//                         onChange={(options) =>
//                           formik.setFieldValue("subcategories", options)
//                         }
//                         value={formik.values.subcategories}
//                         isDisabled={isLoading}
//                       />
//                     </div>
//                   </div>
//                 </>
//               )}

//               <div className="col-sm-12 col-md-12 col-lg-12 col-xl-12">
//                 <div className="input-group mb-3">
//                   <span className="input-group-text w-25">Resolution Time</span>
//                   <input
//                     type="text"
//                     className={`form-control ${
//                       resolutionWarning ? "is-invalid" : ""
//                     }`}
//                     placeholder="Enter SLA in Minutes"
//                     id="resolutionTime"
//                     name="resolutionTime"
//                     onChange={(e) => {
//                       const value = e.target.value;
//                       if (/^\d*$/.test(value)) {
//                         formik.setFieldValue("resolutionTime", value);
//                         setResolutionWarning("");
//                       } else {
//                         setResolutionWarning("Only numbers allowed");
//                       }
//                     }}
//                     value={formik.values.resolutionTime}
//                     disabled={isLoading}
//                   />
//                   {resolutionWarning && (
//                     <div className="text-danger mt-1">{resolutionWarning}</div>
//                   )}
//                 </div>
//               </div>

//               <div className="col-sm-12 col-md-12 col-lg-12 col-xl-12">
//                 <div className="d-flex justify-content-start gap-5">
//                   <div className="form-check form-switch me-3">
//                     <input
//                       className="form-check-input"
//                       type="checkbox"
//                       role="switch"
//                       id="defaultStatus"
//                       checked={formik.values.defaultStatus}
//                       onChange={(e) =>
//                         formik.setFieldValue(
//                           "defaultStatus",
//                           e.target.checked ? 1 : 0
//                         )
//                       }
//                       disabled={isLoading}
//                     />
//                     <label
//                       className="form-check-label ms-2"
//                       htmlFor="defaultStatus"
//                     >
//                       Service Time SLA ( Active / Inactive )
//                     </label>
//                   </div>
//                   <div className="form-check form-switch">
//                     <input
//                       className="form-check-input"
//                       type="checkbox"
//                       role="switch"
//                       id="defaultEscalate"
//                       checked={formik.values.defaultEscalate}
//                       onChange={(e) =>
//                         formik.setFieldValue(
//                           "defaultEscalate",
//                           e.target.checked ? 1 : 0
//                         )
//                       }
//                       disabled={isLoading}
//                     />
//                     <label
//                       className="form-check-label ms-2"
//                       htmlFor="defaultEscalate"
//                     >
//                       Escalate ( Yes / No )
//                     </label>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>

//         <div className="text-end">
//           <button type="submit" className="custom-btn" disabled={isLoading}>
//             {isLoading ? "Saving..." : "Save"}
//           </button>
//         </div>
//       </form>
//     </div>
//   );
// };






import React, { useState, useEffect, useContext } from "react";
import Select from "react-select";
import { useFormik } from "formik";
import * as Yup from "yup";
import { fetchCompany } from "../../../../api/api-client/settings/companyApi";
import { fetchAllTeam } from "../../../../api/api-client/settings/teamApi";
import {
  errorMessage,
  successMessage,
} from "../../../../api/api-config/apiResponseMessage";
import {
  fetchSubCategoriesByTeamId,
  fetchClientsByBusinessEntityId,
  store,
  update,
} from "../../../../api/api-client/settings/slaApi";
import { userContext } from "../../../context/UserContext";
import {
  storeSlaSubcatConfig,
  fetchSlaSubcatConfigById,
  updateSlaSubcatConfig,
} from "../../../../api/api-client/settings/sla_subcat_configsApi";
import {
  storeSlaClientConfig,
  fetchSlaClientConfigById,
  updateSlaClientConfig,
} from "../../../../api/api-client/settings/slaClientConfigApi";

export const AddNewSLA = ({ id, slaType }) => {
  const { user } = useContext(userContext);
  const [slaTypeCheck, setSLATypeCheck] = useState(slaType || "");
  const [companyOptions, setCompanyOptions] = useState([]);
  const [teamOptions, setTeamOptions] = useState([]);
  const [clientOptions, setClientOptions] = useState([]);
  const [businessEntityId, setBusinessEntityId] = useState(null);
  const [subCategoryByTeamOptions, setSubCategoryByTeamOptions] = useState([]);
  const [resolutionWarning, setResolutionWarning] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isEditMode, setIsEditMode] = useState(!!id);


  const slaTypeOptions = [
    { value: "Sub-Category", label: "Sub-Category" },
    { value: "Client", label: "Client" },
  ];

  useEffect(() => {
    setIsLoading(true);

    const fetchCompanyOptions = () =>
      fetchCompany({
        userType: user?.type,
        userId: user?.id,
      }).then((response) =>
        setCompanyOptions(
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
      .finally(() => setIsLoading(false));
  }, [user]);

  const customStyles = {
    control: (provided) => ({
      ...provided,
      minHeight: "30px",
      height: "30px",
      width: "100%",
    }),
    valueContainer: (provided) => ({
      ...provided,
      height: "30px",
      padding: "0 6px",
    }),
    input: (provided) => ({
      ...provided,
      margin: "0px",
    }),
    indicatorsContainer: (provided) => ({
      ...provided,
      height: "30px",
    }),
  };

  const handleFetchSubcategoriesByTeam = (teamId) => {
    if (teamId) {
      fetchSubCategoriesByTeamId(teamId, businessEntityId)
        .then((response) => {
          setSubCategoryByTeamOptions(
            response.data.map((item) => ({
              value: item.sub_category_id,
              label: item.sub_category_in_english,
            }))
          );
        })
        .catch(errorMessage);
    } else {
      setSubCategoryByTeamOptions([]);
    }
  };

  
  useEffect(() => {
    if (id) {
      console.log("Fetching SLA with ID:", id, "Type:", slaTypeCheck);
      setIsEditMode(true);
      setIsLoading(true);

      const fetchFunction = slaTypeCheck === "Client" 
        ? fetchSlaClientConfigById 
        : fetchSlaSubcatConfigById;

      fetchFunction(id)
        .then((response) => {
          const data = response.data?.[0];
      
          setBusinessEntityId(data.business_entity_id);

          // Determine status values - handle string "1" or "0"
          const statusValue = data.sla_status === "1" || data.sla_status === 1 || data.sla_status === true ? 1 : 0;
          const escalateValue = data.escalation_status === "1" || data.escalation_status === 1 || data.escalation_status === true ? 1 : 0;

          if (slaTypeCheck === "Client") {
            // Client edit mode
            // Set the client option immediately from the fetched data
            const clientOption = {
              value: data.client_id,
              label: data.client_name,
            };
            
            updateClientFormik.setValues({
              businessEntity: {
                value: data.business_entity_id,
                label: data.company_name,
              },
              slaForClient: clientOption,
              resolutionTime: data.resolution_min?.toString() || "",
              defaultStatus: statusValue,
              defaultEscalate: escalateValue,
            });

            // Fetch clients for the business entity
            if (data.business_entity_id) {
              fetchClientsByBusinessEntityId(data.business_entity_id)
                .then((response) => {
                  setClientOptions(
                    response.data.map((item) => ({
                      value: item.client_id,
                      label: item.client_name,
                    }))
                  );
                })
                .catch(errorMessage);
            }
          } else {
            // Sub-Category edit mode
            // Fetch subcategories for the team
            if (data.team_id) {
              fetchSubCategoriesByTeamId(data.team_id, data.business_entity_id)
                .then((response) => {
                  setSubCategoryByTeamOptions(
                    response.data.map((item) => ({
                      value: item.sub_category_id,
                      label: item.sub_category_in_english,
                    }))
                  );
                })
                .catch(errorMessage);
            }

            // Sub-Category edit mode
            updateFormik.setValues({
              businessEntity: {
                value: data.business_entity_id,
                label: data.company_name,
              },
              slaForTeam: {
                value: data.team_id,
                label: data.team_name,
              },
              subcategories: [
                {
                  value: data.subcategory_id,
                  label: data.sub_category_in_english,
                },
              ],
              resolutionTime: data.resolution_min?.toString() || "",
              defaultStatus: statusValue,
              defaultEscalate: escalateValue,
            });
          }
        })
        .catch((err) => {
          console.error("Error fetching SLA:", err);
          errorMessage(err);
        })
        .finally(() => setIsLoading(false));
    } else {
      setIsEditMode(false);
    }
  }, [id, slaTypeCheck]);

  const formik = useFormik({
    initialValues: {
      businessEntity: "",
      slaType: "",
      slaForClient: "",
      slaForTeam: "",
      subcategories: [],
      resolutionTime: "",
      defaultEscalate: 1,
      defaultStatus: 1,
    },
    onSubmit: (values, { resetForm }) => {
      setIsLoading(true);

      // Sub-Category SLA handling
      if (slaTypeCheck === "Sub-Category") {
        const payloads = values.subcategories.map((subcat) => ({
          business_entity_id: values.businessEntity.value,
          team_id: values.slaForTeam.value,
          subcategory_id: subcat.value,
          resolution_min: parseInt(values.resolutionTime),
          sla_status: values.defaultStatus ? "1" : "0",
          escalation_status: values.defaultEscalate ? "1" : "0",
        }));

        Promise.all(
          payloads.map((payload) => storeSlaSubcatConfig(payload))
        )
          .then((response) => {
            successMessage(response);
            resetForm();
          })
          // .catch(errorMessage)
          .catch((error)=>console.log(error))
          .finally(() => setIsLoading(false));
      }

      // Client SLA handling
      if (slaTypeCheck === "Client") {
        const clientPayload = {
          business_entity_id: values.businessEntity.value,
          client_id: values.slaForClient.value,
          resolution_min: parseInt(values.resolutionTime),
          sla_status: values.defaultStatus ? "1" : "0",
          escalation_status: values.defaultEscalate ? "1" : "0",
        };

        storeSlaClientConfig(clientPayload)
          .then((response) => {
            successMessage(response);
            resetForm();
          })
             .catch(errorMessage)
         
          .finally(() => setIsLoading(false));
      }
    },
  });

  // Update FormIK for Sub-Category edit mode
  const updateFormik = useFormik({
    initialValues: {
      businessEntity: "",
      slaForTeam: "",
      subcategories: [],
      resolutionTime: "",
      defaultStatus: 1,
      defaultEscalate: 1,
    },
    onSubmit: (values, { resetForm }) => {
      setIsLoading(true);
      const payload = {
        business_entity_id: values.businessEntity.value,
        team_id: values.slaForTeam.value,
        subcategory_id: values.subcategories[0]?.value,
        resolution_min: parseInt(values.resolutionTime),
        sla_status: values.defaultStatus ? "1" : "0",
        escalation_status: values.defaultEscalate ? "1" : "0",
      };

      updateSlaSubcatConfig(id, payload)
        .then((response) => {
            successMessage(response);
          resetForm();
        })
        .catch(errorMessage)
        .finally(() => setIsLoading(false));
    },
  });

  // Update FormIK for Client edit mode
  const updateClientFormik = useFormik({
    initialValues: {
      businessEntity: "",
      slaForClient: "",
      resolutionTime: "",
      defaultStatus: 1,
      defaultEscalate: 1,
    },
    onSubmit: (values, { resetForm }) => {
      setIsLoading(true);
      const payload = {
        business_entity_id: values.businessEntity.value,
        client_id: values.slaForClient.value,
        resolution_min: parseInt(values.resolutionTime),
        sla_status: values.defaultStatus ? "1" : "0",
        escalation_status: values.defaultEscalate ? "1" : "0",
      };

      updateSlaClientConfig(id, payload)
        .then((response) => {
            successMessage(response);
          resetForm();
        })
        
        .catch(errorMessage)
        .finally(() => setIsLoading(false));
    },
  });

  // SHOW CLIENT UPDATE FORM IF ID EXISTS AND TYPE IS CLIENT
  if (isEditMode && id && slaTypeCheck === "Client") {
    return (
      <div className="row">
        <div className="col-sm-12 col-md-12 col-lg-12 col-xl-12">
          <div className="alert alert-secondary p-2" role="alert">
            <h6>Update Client SLA Policy</h6>
            <span>
              <i>Please input the required information.</i>
            </span>
          </div>
        </div>
        <form onSubmit={updateClientFormik.handleSubmit}>
          <div className="row mb-4">
            <div className="col-sm-12 col-md-5 col-lg-5 col-xl-5">
              <div className="row">
                <div className="col-sm-12 col-md-12 col-lg-12 col-xl-12">
                  <div className="input-group mb-3">
                    <span className="input-group-text w-25">
                      Business Entity
                    </span>
                    <Select
                      options={companyOptions}
                      placeholder="Business entity"
                      className="form-control"
                      styles={customStyles}
                      id="businessEntity"
                      value={updateClientFormik.values.businessEntity}
                      isDisabled={true}
                    />
                  </div>
                </div>

                <div className="col-sm-12 col-md-12 col-lg-12 col-xl-12">
                  <div className="input-group mb-3">
                    <span className="input-group-text w-25">Client</span>
                    <Select
                      options={clientOptions}
                      placeholder="Select client"
                      className="form-control p-0"
                      styles={customStyles}
                      id="slaForClient"
                      value={updateClientFormik.values.slaForClient}
                      isDisabled={true}
                    />
                  </div>
                </div>

                <div className="col-sm-12 col-md-12 col-lg-12 col-xl-12">
                  <div className="input-group mb-3">
                    <span className="input-group-text w-25">
                      Resolution Time
                    </span>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Enter SLA in Minutes"
                      id="resolutionTime"
                      name="resolutionTime"
                      onChange={(e) => {
                        const value = e.target.value;
                        if (/^\d*$/.test(value)) {
                          updateClientFormik.setFieldValue("resolutionTime", value);
                          setResolutionWarning("");
                        } else {
                          setResolutionWarning("Only numbers allowed");
                        }
                      }}
                      value={updateClientFormik.values.resolutionTime}
                      disabled={isLoading}
                    />
                    {resolutionWarning && (
                      <div className="text-danger mt-1">
                        {resolutionWarning}
                      </div>
                    )}
                  </div>
                </div>

                <div className="col-sm-12 col-md-12 col-lg-12 col-xl-12">
                  <div className="d-flex justify-content-start gap-5">
                    <div className="form-check form-switch me-3">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        role="switch"
                        id="defaultStatus"
                        checked={updateClientFormik.values.defaultStatus}
                        onChange={(e) =>
                          updateClientFormik.setFieldValue(
                            "defaultStatus",
                            e.target.checked ? 1 : 0
                          )
                        }
                        disabled={isLoading}
                      />
                      <label
                        className="form-check-label ms-2"
                        htmlFor="defaultStatus"
                      >
                        Service Time SLA ( Active / Inactive )
                      </label>
                    </div>
                    <div className="form-check form-switch">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        role="switch"
                        id="defaultEscalate"
                        checked={updateClientFormik.values.defaultEscalate}
                        onChange={(e) =>
                          updateClientFormik.setFieldValue(
                            "defaultEscalate",
                            e.target.checked ? 1 : 0
                          )
                        }
                        disabled={isLoading}
                      />
                      <label
                        className="form-check-label ms-2"
                        htmlFor="defaultEscalate"
                      >
                        Escalate ( Yes / No )
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="text-end">
            <button type="submit" className="custom-btn" disabled={isLoading}>
              {isLoading ? "Updating..." : "Update"}
            </button>
          </div>
        </form>
      </div>
    );
  }

  // SHOW SUB-CATEGORY UPDATE FORM IF ID EXISTS AND TYPE IS SUB-CATEGORY
  if (isEditMode && id && slaTypeCheck === "Sub-Category") {
    return (
      <div className="row">
        <div className="col-sm-12 col-md-12 col-lg-12 col-xl-12">
          <div className="alert alert-secondary p-2" role="alert">
            <h6>Update SLA Policy</h6>
            <span>
              <i>Please input the required information.</i>
            </span>
          </div>
        </div>
        <form onSubmit={updateFormik.handleSubmit}>
          <div className="row mb-4">
            <div className="col-sm-12 col-md-5 col-lg-5 col-xl-5">
              <div className="row">
                <div className="col-sm-12 col-md-12 col-lg-12 col-xl-12">
                  <div className="input-group mb-3">
                    <span className="input-group-text w-25">
                      Business Entity
                    </span>
                    <Select
                      options={companyOptions}
                      placeholder="Business entity"
                      className="form-control"
                      styles={customStyles}
                      id="businessEntity"
                      value={updateFormik.values.businessEntity}
                      isDisabled={true}
                    />
                  </div>
                </div>

                <div className="col-sm-12 col-md-12 col-lg-12 col-xl-12">
                  <div className="input-group mb-3">
                    <span className="input-group-text w-25">Team</span>
                    <Select
                      options={teamOptions}
                      placeholder="Select team"
                      className="form-control p-0"
                      styles={customStyles}
                      id="slaForTeam"
                      value={updateFormik.values.slaForTeam}
                      isDisabled={true}
                    />
                  </div>
                </div>

                <div className="col-sm-12 col-md-12 col-lg-12 col-xl-12">
                  <div className="input-group mb-3">
                    <span className="input-group-text w-25">
                      Sub-Category
                    </span>
                    <Select
                      options={subCategoryByTeamOptions}
                      placeholder="Select sub categories"
                      className="form-control p-0"
                      styles={customStyles}
                      id="subcategories"
                      name="subcategories"
                      value={updateFormik.values.subcategories}
                      isDisabled={true}
                    />
                  </div>
                </div>

                <div className="col-sm-12 col-md-12 col-lg-12 col-xl-12">
                  <div className="input-group mb-3">
                    <span className="input-group-text w-25">
                      Resolution Time
                    </span>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Enter SLA in Minutes"
                      id="resolutionTime"
                      name="resolutionTime"
                      onChange={(e) => {
                        const value = e.target.value;
                        if (/^\d*$/.test(value)) {
                          updateFormik.setFieldValue("resolutionTime", value);
                          setResolutionWarning("");
                        } else {
                          setResolutionWarning("Only numbers allowed");
                        }
                      }}
                      value={updateFormik.values.resolutionTime}
                      disabled={isLoading}
                    />
                    {resolutionWarning && (
                      <div className="text-danger mt-1">
                        {resolutionWarning}
                      </div>
                    )}
                  </div>
                </div>

                <div className="col-sm-12 col-md-12 col-lg-12 col-xl-12">
                  <div className="d-flex justify-content-start gap-5">
                    <div className="form-check form-switch me-3">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        role="switch"
                        id="defaultStatus"
                        checked={updateFormik.values.defaultStatus}
                        onChange={(e) =>
                          updateFormik.setFieldValue(
                            "defaultStatus",
                            e.target.checked ? 1 : 0
                          )
                        }
                        disabled={isLoading}
                      />
                      <label
                        className="form-check-label ms-2"
                        htmlFor="defaultStatus"
                      >
                        Service Time SLA ( Active / Inactive )
                      </label>
                    </div>
                    <div className="form-check form-switch">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        role="switch"
                        id="defaultEscalate"
                        checked={updateFormik.values.defaultEscalate}
                        onChange={(e) =>
                          updateFormik.setFieldValue(
                            "defaultEscalate",
                            e.target.checked ? 1 : 0
                          )
                        }
                        disabled={isLoading}
                      />
                      <label
                        className="form-check-label ms-2"
                        htmlFor="defaultEscalate"
                      >
                        Escalate ( Yes / No )
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="text-end">
            <button type="submit" className="custom-btn" disabled={isLoading}>
              {isLoading ? "Updating..." : "Update"}
            </button>
          </div>
        </form>
      </div>
    );
  }

  // SHOW CREATE FORM IF NO ID
  return (
    <div className="row">
      <div className="col-sm-12 col-md-12 col-lg-12 col-xl-12">
        <div className="alert alert-secondary p-2" role="alert">
          <h6>Create New SLA Policy</h6>
          <span>
            <i>Please input the required information.</i>
          </span>
        </div>
      </div>
      <form onSubmit={formik.handleSubmit}>
        <div className="row mb-4">
          <div className="col-sm-12 col-md-5 col-lg-5 col-xl-5">
            <div className="row">
              <div className="col-sm-12 col-md-12 col-lg-12 col-xl-12">
                <div className="input-group mb-3">
                  <span className="input-group-text w-25">Business Entity</span>
                  <Select
                    options={companyOptions}
                    placeholder="Business entity"
                    className="form-control"
                    styles={customStyles}
                    id="businessEntity"
                    onChange={(option) => {
                      formik.setFieldValue("businessEntity", option);
                      setBusinessEntityId(option.value);
                      if (slaTypeCheck === "Client") {
                        formik.setFieldValue("slaForClient", null);
                        fetchClientsByBusinessEntityId(option.value)
                          .then((response) => {
                            setClientOptions(
                              response.data.map((item) => ({
                                value: item.client_id,
                                label: item.client_name,
                              }))
                            );
                          })
                          .catch(errorMessage);
                      } else if (slaTypeCheck === "Sub-Category") {
                        formik.setFieldValue("slaForTeam", null);
                        formik.setFieldValue("subcategories", []);
                      }
                    }}
                    value={formik.values.businessEntity}
                    isDisabled={isLoading}
                  />
                </div>
              </div>

              <div className="col-sm-12 col-md-12 col-lg-12 col-xl-12">
                <div className="input-group mb-3">
                  <span className="input-group-text w-25">SLA Type</span>
                  <Select
                    options={slaTypeOptions}
                    placeholder="SLA type"
                    className="form-control"
                    styles={customStyles}
                    id="slaType"
                    onChange={(option) => {
                      formik.setFieldValue("slaType", option);
                      setSLATypeCheck(option.value);
                      if (option.value === "Client" && businessEntityId) {
                        formik.setFieldValue("slaForClient", null);
                        fetchClientsByBusinessEntityId(businessEntityId)
                          .then((response) => {
                            setClientOptions(
                              response.data.map((item) => ({
                                value: item.client_id,
                                label: item.client_name,
                              }))
                            );
                          })
                          .catch(errorMessage);
                      }
                    }}
                    value={formik.values.slaType}
                    isDisabled={isLoading}
                  />
                </div>
              </div>

              {slaTypeCheck === "Client" && (
                <div className="col-sm-12 col-md-12 col-lg-12 col-xl-12">
                  <div className="input-group mb-3">
                    <span className="input-group-text w-25">Client</span>
                    <Select
                      options={clientOptions}
                      placeholder="Select client"
                      className="form-control p-0"
                      styles={customStyles}
                      id="slaForClient"
                      name="slaForClient"
                      onChange={(option) =>
                        formik.setFieldValue("slaForClient", option)
                      }
                      value={formik.values.slaForClient}
                      isDisabled={isLoading}
                    />
                  </div>
                </div>
              )}

              {slaTypeCheck === "Sub-Category" && (
                <>
                  <div className="col-sm-12 col-md-12 col-lg-12 col-xl-12">
                    <div className="input-group mb-3">
                      <span className="input-group-text w-25">Team</span>
                      <Select
                        options={teamOptions}
                        placeholder="Select team"
                        className="form-control p-0"
                        styles={customStyles}
                        id="slaForTeam"
                        name="slaForTeam"
                        onChange={(option) => {
                          formik.setFieldValue("slaForTeam", option);
                          formik.setFieldValue("subcategories", []);
                          handleFetchSubcategoriesByTeam(option.value);
                        }}
                        value={formik.values.slaForTeam}
                        isDisabled={isLoading}
                      />
                    </div>
                  </div>

                  <div className="col-sm-12 col-md-12 col-lg-12 col-xl-12">
                    <div className="input-group mb-3">
                      <span className="input-group-text w-25">
                        Select Sub-Category
                      </span>
                      <Select
                        options={subCategoryByTeamOptions}
                        placeholder="Select sub categories"
                        className="form-control p-0"
                        styles={customStyles}
                        id="subcategories"
                        name="subcategories"
                        isMulti
                        onChange={(options) =>
                          formik.setFieldValue("subcategories", options)
                        }
                        value={formik.values.subcategories}
                        isDisabled={isLoading}
                      />
                    </div>
                  </div>
                </>
              )}

              <div className="col-sm-12 col-md-12 col-lg-12 col-xl-12">
                <div className="input-group mb-3">
                  <span className="input-group-text w-25">Resolution Time</span>
                  <input
                    type="text"
                    className={`form-control ${
                      resolutionWarning ? "is-invalid" : ""
                    }`}
                    placeholder="Enter SLA in Minutes"
                    id="resolutionTime"
                    name="resolutionTime"
                    onChange={(e) => {
                      const value = e.target.value;
                      if (/^\d*$/.test(value)) {
                        formik.setFieldValue("resolutionTime", value);
                        setResolutionWarning("");
                      } else {
                        setResolutionWarning("Only numbers allowed");
                      }
                    }}
                    value={formik.values.resolutionTime}
                    disabled={isLoading}
                  />
                  {resolutionWarning && (
                    <div className="text-danger mt-1">{resolutionWarning}</div>
                  )}
                </div>
              </div>

              <div className="col-sm-12 col-md-12 col-lg-12 col-xl-12">
                <div className="d-flex justify-content-start gap-5">
                  <div className="form-check form-switch me-3">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      role="switch"
                      id="defaultStatus"
                      checked={formik.values.defaultStatus}
                      onChange={(e) =>
                        formik.setFieldValue(
                          "defaultStatus",
                          e.target.checked ? 1 : 0
                        )
                      }
                      disabled={isLoading}
                    />
                    <label
                      className="form-check-label ms-2"
                      htmlFor="defaultStatus"
                    >
                      Service Time SLA ( Active / Inactive )
                    </label>
                  </div>
                  <div className="form-check form-switch">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      role="switch"
                      id="defaultEscalate"
                      checked={formik.values.defaultEscalate}
                      onChange={(e) =>
                        formik.setFieldValue(
                          "defaultEscalate",
                          e.target.checked ? 1 : 0
                        )
                      }
                      disabled={isLoading}
                    />
                    <label
                      className="form-check-label ms-2"
                      htmlFor="defaultEscalate"
                    >
                      Escalate ( Yes / No )
                    </label>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="text-end">
          <button type="submit" className="custom-btn" disabled={isLoading}>
            {isLoading ? "Saving..." : "Save"}
          </button>
        </div>
      </form>
    </div>
  );
};