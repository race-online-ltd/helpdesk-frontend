// import React, { useContext, useEffect, useState } from "react";
// import { useFormik } from "formik";
// import * as Yup from "yup";
// import {
//   errorMessage,
//   successMessage,
// } from "../../../../api/api-config/apiResponseMessage";
// import {
//   fetchSmsTemplateById,
//   storeSms,
//   updateSms,
// } from "../../../../api/api-client/settings/smsApi";
// import { fetchCompany } from "../../../../api/api-client/settings/companyApi";
// import { SelectDropdown } from "../SelectDropdown";
// import { userContext } from "../../../context/UserContext";
// import {
//   getClientListFromLocal,
//   fetchEvents,
// } from "../../../../api/api-client/ticketApi";
// import { fetchEmailAttribute } from "../../../../api/api-client/settings/emailApi";

// // Validation schema for SMS (no subject needed)
// const smsTemplateValidationSchema = Yup.object({
//   name: Yup.string().required("Template name is required"),
//   content: Yup.string().required("Template content is required"),
//   eventId: Yup.string().required("Event is required"),
// });

// // Available placeholders — matches your backend {{placeholder}} syntax
// const SMS_PLACEHOLDERS = [
//   { label: "Sub Category Name",    value: "{{subCategoryName}}" },
//   { label: "Message Type",         value: "{{messageType}}" },
//   { label: "Ticket Number",        value: "{{lastTicketNumber}}" },
//   { label: "Business Entity Name", value: "{{businessEntityName}}" },
//   { label: "Client Name",          value: "{{clientName}}" },
//   { label: "Agent Name",           value: "{{agentName}}" },
// ];

// // Preview replacements — show sample values in preview panel
// const PREVIEW_VALUES = {
//   "{{subCategoryName}}":    "Internet Issue",
//   "{{messageType}}":        "সমাধান",
//   "{{lastTicketNumber}}":   "TKT-20240001",
//   "{{businessEntityName}}": "Orbit BD",
//   "{{clientName}}":         "Acme Corp",
//   "{{agentName}}":          "John Doe",
// };

// const SMS_MAX_CHARS = 660; // 4 SMS parts

// export const AddNewSms = ({ id }) => {
//   const { user } = useContext(userContext);

//   const [isLoading,        setIsLoading]        = useState(false);
//   const [businessEntityOptions, setBusinessEntityOptions] = useState([]);
//   const [clientOptions,    setClientOptions]    = useState([]);
//   const [selectedBusinessId, setSelectedBusinessId] = useState(null);
//   const [isClientLoading,  setIsClientLoading]  = useState(false);
//   const [eventOptions,     setEventOptions]     = useState([]);
//   const [isEventLoading,   setIsEventLoading]   = useState(false);
//   const [textareaRef,      setTextareaRef]      = useState(null);

//   // ── Fetch Events ──────────────────────────────────────────────
//   useEffect(() => {
//     setIsEventLoading(true);
//     fetchEvents()
//       .then((response) => {
//         setEventOptions(
//           response.data.map((event) => ({
//             value: event.id,
//             label: event.event_name,
//           }))
//         );
//       })
//       .catch(errorMessage)
//       .finally(() => setIsEventLoading(false));
//   }, []);

//   // ── Fetch Business Entity ─────────────────────────────────────
//   useEffect(() => {
//     fetchCompany({ userType: user?.type, userId: user?.id })
//       .then((response) => {
//         setBusinessEntityOptions(
//           response.result.map((option) => ({
//             value: option.id,
//             label: option.company_name,
//           }))
//         );
//       })
//       .catch(errorMessage);
//   }, []);

//   // ── Fetch Clients on Business Entity change ───────────────────
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

//   // ── Load existing template if editing ────────────────────────
//   useEffect(() => {
//     if (id) {
//       setIsLoading(true);
//       fetchSmsTemplateById(id)
//         .then((response) => {
//           formik.setValues({
//             name:           response.data.template_name  || "",
//             status:         response.data.status         || "Active",
//             content:        response.data.template       || "",  // ← your DB column is "template"
//             businessEntity: response.data.business_entity_id || "",
//             client:         response.data.client_id      || "",
//             eventId:        response.data.event_id       || "",
//           });
//           if (response.data.business_entity_id) {
//             setSelectedBusinessId(response.data.business_entity_id);
//           }
//         })
//         .catch(errorMessage)
//         .finally(() => setIsLoading(false));
//     }
//   }, [id]);

//   // ── Formik ────────────────────────────────────────────────────
//   const formik = useFormik({
//     initialValues: {
//       name:           "",
//       status:         "Active",
//       content:        "",
//       businessEntity: "",
//       client:         "",
//       eventId:        "",
//     },
//     validationSchema: smsTemplateValidationSchema,
//     onSubmit: (values, { resetForm }) => {
//       setIsLoading(true);

//       // Map frontend field names → backend column names
//       const payload = {
//         template_name:      values.name,
//         status:             values.status,
//         template:           values.content,   // ← your DB column
//         business_entity_id: values.businessEntity || null,
//         client_id:          values.client         || null,
//         event_id:           values.eventId,
//       };

//       const apiCall = id ? updateSms(id, payload) : storeSms(payload);
//       apiCall
//         .then((response) => {
//           successMessage(response);
//           if (!id) resetForm();
//         })
//         .catch(errorMessage)
//         .finally(() => setIsLoading(false));
//     },
//   });

//   // ── Insert placeholder at cursor position in textarea ─────────
//   const insertPlaceholder = (placeholder) => {
//     if (!textareaRef) return;

//     const start  = textareaRef.selectionStart;
//     const end    = textareaRef.selectionEnd;
//     const before = formik.values.content.substring(0, start);
//     const after  = formik.values.content.substring(end);
//     const newContent = before + placeholder + after;

//     formik.setFieldValue("content", newContent);

//     // Restore cursor position after React re-render
//     setTimeout(() => {
//       textareaRef.focus();
//       textareaRef.setSelectionRange(
//         start + placeholder.length,
//         start + placeholder.length
//       );
//     }, 0);
//   };

//   // ── Build preview text (replace {{placeholders}} with samples) ─
//   const buildPreview = (text) => {
//     let preview = text;
//     Object.entries(PREVIEW_VALUES).forEach(([key, val]) => {
//       preview = preview.replaceAll(key, val);
//     });
//     return preview;
//   };

//   const charCount = formik.values.content.length;
//   const smsPartCount = charCount === 0 ? 0 : Math.ceil(charCount / 160);

//   return (
//     <div className="row">
//       {/* ── Header ── */}
//       <div className="col-sm-12 col-md-12 col-lg-12 col-xl-12">
//         <div className="alert alert-secondary p-2" role="alert">
//           <h6>{id ? "Update" : "Create"} New SMS Template</h6>
//           <span>
//             <i>Please input the required information.</i>
//           </span>
//         </div>
//       </div>

//       {/* ── Left: Form ── */}
//       <div className="col-sm-12 col-md-6 col-lg-6 col-xl-6">
//         <form onSubmit={formik.handleSubmit} className="row">

//           {/* Event */}
//           <div className="col-sm-12 col-md-12 col-lg-12 col-xl-12">
//             <div className="input-group mb-3">
//               <span className="input-group-text w-25">Event</span>
//               <SelectDropdown
//                 id="eventId"
//                 placeholder="Select Event"
//                 options={eventOptions}
//                 value={formik.values.eventId}
//                 onChange={(value) => formik.setFieldValue("eventId", value)}
//                 disabled={isEventLoading}
//               />
//             </div>
//             {formik.touched.eventId && formik.errors.eventId && (
//               <div className="text-danger mb-2">{formik.errors.eventId}</div>
//             )}
//           </div>

//           {/* Business Entity */}
//           <div className="col-sm-12 col-md-12 col-lg-12 col-xl-12">
//             <div className="input-group mb-3">
//               <span className="input-group-text w-25">Business Entity</span>
//               <SelectDropdown
//                 id="businessEntity"
//                 placeholder="Select Business Entity"
//                 options={businessEntityOptions}
//                 value={formik.values.businessEntity}
//                 onChange={(value) => {
//                   formik.setFieldValue("businessEntity", value);
//                   setSelectedBusinessId(value);
//                   formik.setFieldValue("client", "");
//                   setClientOptions([]);
//                 }}
//                 disabled={isLoading}
//               />
//             </div>
//           </div>

//           {/* Client */}
//           <div className="col-sm-12 col-md-12 col-lg-12 col-xl-12">
//             <div className="input-group mb-3">
//               <span className="input-group-text w-25">Client</span>
//               <SelectDropdown
//                 id="client"
//                 placeholder="Select Client"
//                 options={clientOptions}
//                 value={formik.values.client}
//                 onChange={(value) => formik.setFieldValue("client", value)}
//                 disabled={isClientLoading || !selectedBusinessId}
//               />
//             </div>
//           </div>

//           {/* Template Name */}
//           <div className="col-sm-12 col-md-12 col-lg-12 col-xl-12">
//             <div className="input-group mb-3">
//               <span className="input-group-text w-25">Name</span>
//               <input
//                 type="text"
//                 name="name"
//                 className="form-control"
//                 placeholder="Template Name"
//                 onChange={formik.handleChange}
//                 onBlur={formik.handleBlur}
//                 value={formik.values.name}
//               />
//             </div>
//             {formik.touched.name && formik.errors.name && (
//               <div className="text-danger mb-2">{formik.errors.name}</div>
//             )}
//           </div>

//           {/* Placeholder Buttons + Status Toggle — same row */}
//           <div className="col-sm-12 col-md-12 col-lg-12 col-xl-12">
//             <div className="d-flex justify-content-between align-items-start mb-2 flex-wrap gap-2">

//               {/* Placeholder chips */}
//               <div className="d-flex flex-wrap gap-1">
//                 {SMS_PLACEHOLDERS.map((ph) => (
//                   <button
//                     key={ph.value}
//                     type="button"
//                     className="btn btn-sm btn-outline-secondary"
//                     title={`Insert ${ph.value}`}
//                     onClick={() => insertPlaceholder(ph.value)}
//                   >
//                     + {ph.label}
//                   </button>
//                 ))}
//               </div>

//               {/* Status toggle */}
//               <div className="form-check form-switch">
//                 <input
//                   className="form-check-input"
//                   type="checkbox"
//                   id="status"
//                   checked={formik.values.status === "Active"}
//                   onChange={(e) =>
//                     formik.setFieldValue(
//                       "status",
//                       e.target.checked ? "Active" : "Inactive"
//                     )
//                   }
//                 />
//                 <label className="form-check-label" htmlFor="status">
//                   {formik.values.status === "Active" ? "Active" : "Inactive"}
//                 </label>
//               </div>
//             </div>
//           </div>

//           {/* SMS Content Textarea */}
//           <div className="col-sm-12 col-md-12 col-lg-12 col-xl-12">
//             <div className="mb-1">
//               <textarea
//                 ref={(el) => setTextareaRef(el)}
//                 name="content"
//                 className="form-control"
//                 rows={8}
//                 placeholder="Type your SMS message here... Click placeholder buttons above to insert variables."
//                 onChange={formik.handleChange}
//                 onBlur={formik.handleBlur}
//                 value={formik.values.content}
//                 maxLength={SMS_MAX_CHARS}
//                 style={{ fontFamily: "monospace", fontSize: "0.9rem" }}
//               />
//             </div>

//             {/* Character / SMS part counter */}
//             <div className="d-flex justify-content-between mb-2">
//               <small
//                 className={
//                   charCount > SMS_MAX_CHARS - 50
//                     ? "text-danger"
//                     : "text-muted"
//                 }
//               >
//                 {charCount} / {SMS_MAX_CHARS} characters
//               </small>
//               <small className="text-muted">
//                 ≈{" "}
//                 <span
//                   className={
//                     smsPartCount > 2 ? "text-warning fw-bold" : "text-success"
//                   }
//                 >
//                   {smsPartCount} SMS part{smsPartCount !== 1 ? "s" : ""}
//                 </span>
//               </small>
//             </div>

//             {formik.touched.content && formik.errors.content && (
//               <div className="text-danger mb-2">{formik.errors.content}</div>
//             )}
//           </div>

//           {/* Submit */}
//           <div className="text-end">
//             <button type="submit" className="custom-btn" disabled={isLoading}>
//               {isLoading
//                 ? id ? "Updating..." : "Saving..."
//                 : id ? "Update" : "Save"}
//             </button>
//           </div>
//         </form>
//       </div>

//       {/* ── Right: Live Preview ── */}
//       <div className="col-sm-12 col-md-6 col-lg-6 col-xl-6">
//         <div
//           className="card w-100 p-0 border rounded"
//           style={{ minHeight: "412px", height: "auto" }}
//         >
//           <h6 className="card-header text-center">SMS Preview</h6>
//           <div className="card-body bg-white">
//             {/* Phone mockup wrapper */}
//             <div
//               className="mx-auto p-3 rounded"
//               style={{
//                 maxWidth: "320px",
//                 background: "#f0f0f0",
//                 border: "2px solid #dee2e6",
//                 borderRadius: "12px",
//                 minHeight: "200px",
//               }}
//             >
//               <div
//                 className="p-3 rounded"
//                 style={{
//                   background: "#dcf8c6",         // WhatsApp-style green bubble
//                   fontSize: "0.85rem",
//                   lineHeight: "1.5",
//                   wordBreak: "break-word",
//                   whiteSpace: "pre-wrap",
//                   borderRadius: "0 12px 12px 12px",
//                   boxShadow: "0 1px 2px rgba(0,0,0,0.15)",
//                 }}
//               >
//                 {formik.values.content
//                   ? buildPreview(formik.values.content)
//                   : (
//                     <span className="text-muted fst-italic">
//                       Your SMS preview will appear here...
//                     </span>
//                   )}
//               </div>

//               {/* Placeholder legend */}
//               {formik.values.content && (
//                 <div className="mt-3">
//                   <small className="text-muted d-block mb-1 fw-bold">
//                     Sample values used in preview:
//                   </small>
//                   {SMS_PLACEHOLDERS.map((ph) =>
//                     formik.values.content.includes(ph.value) ? (
//                       <small key={ph.value} className="d-block text-muted">
//                         <code>{ph.value}</code> → {PREVIEW_VALUES[ph.value]}
//                       </small>
//                     ) : null
//                   )}
//                 </div>
//               )}
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };




// import React, { useContext, useEffect, useState } from "react";
// import { useFormik } from "formik";
// import * as Yup from "yup";
// import {
//   errorMessage,
//   successMessage,
// } from "../../../../api/api-config/apiResponseMessage";
// import {
//   fetchSmsTemplateById,
//   storeSms,
//   updateSms,
// } from "../../../../api/api-client/settings/smsApi";
// import { fetchCompany } from "../../../../api/api-client/settings/companyApi";
// import { SelectDropdown } from "../SelectDropdown";
// import { userContext } from "../../../context/UserContext";
// import {
//   getClientListFromLocal,
//   fetchEvents,
// } from "../../../../api/api-client/ticketApi";

// const smsTemplateValidationSchema = Yup.object({
//   name: Yup.string().required("Template name is required"),
//   content: Yup.string().required("Template content is required"),
//   eventId: Yup.string().required("Event is required"),
// });

// const SMS_PLACEHOLDERS = [
//   { label: "Sub Category Name",    value: "{{subCategoryName}}" },
//   { label: "Message Type",         value: "{{messageType}}" },
//   { label: "Ticket Number",        value: "{{lastTicketNumber}}" },
//   { label: "Business Entity Name", value: "{{businessEntityName}}" },
//   { label: "Client Name",          value: "{{clientName}}" },
//   { label: "Agent Name",           value: "{{agentName}}" },
// ];

// const PREVIEW_VALUES = {
//   "{{subCategoryName}}":    "Internet Issue",
//   "{{messageType}}":        "সমাধান",
//   "{{lastTicketNumber}}":   "TKT-20240001",
//   "{{businessEntityName}}": "Orbit BD",
//   "{{clientName}}":         "Acme Corp",
//   "{{agentName}}":          "John Doe",
// };

// const SMS_MAX_CHARS = 660;

// export const AddNewSms = ({ id }) => {
//   const { user } = useContext(userContext);

//   const [isLoading,             setIsLoading]             = useState(false);
//   const [businessEntityOptions, setBusinessEntityOptions] = useState([]);
//   const [clientOptions,         setClientOptions]         = useState([]);
//   const [selectedBusinessId,    setSelectedBusinessId]    = useState(null);
//   const [isClientLoading,       setIsClientLoading]       = useState(false);
//   const [eventOptions,          setEventOptions]          = useState([]);
//   const [isEventLoading,        setIsEventLoading]        = useState(false);
//   const [textareaRef,           setTextareaRef]           = useState(null);

//   // ── Fetch Events ──────────────────────────────────────────────
//   useEffect(() => {
//     setIsEventLoading(true);
//     fetchEvents()
//       .then((response) => {
//         setEventOptions(
//           response.data.map((event) => ({
//             value: event.id,
//             label: event.event_name,
//           }))
//         );
//       })
//       .catch(errorMessage)
//       .finally(() => setIsEventLoading(false));
//   }, []);

//   // ── Fetch Business Entity ─────────────────────────────────────
//   useEffect(() => {
//     fetchCompany({ userType: user?.type, userId: user?.id })
//       .then((response) => {
//         setBusinessEntityOptions(
//           response.result.map((option) => ({
//             value: option.id,
//             label: option.company_name,
//           }))
//         );
//       })
//       .catch(errorMessage);
//   }, []);

//   // ── Fetch Clients on Business Entity change ───────────────────
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

//   // ── Load existing template if editing ────────────────────────
//   useEffect(() => {
//     if (id) {
//       setIsLoading(true);
//       fetchSmsTemplateById(id)
//         .then((response) => {
//           formik.setValues({
//             name:           response.data.template_name      || "",
//             status:         response.data.status             || "Active",
//             content:        response.data.template           || "",
//             businessEntity: response.data.business_entity_id || "",
//             client:         response.data.client_id          || "",
//             eventId:        response.data.event_id           || "",
//             excludeNotify:  response.data.exclude_notify     || [],
//           });
//           if (response.data.business_entity_id) {
//             setSelectedBusinessId(response.data.business_entity_id);
//           }
//         })
//         .catch(errorMessage)
//         .finally(() => setIsLoading(false));
//     }
//   }, [id]);

//   // ── Formik ────────────────────────────────────────────────────
//   const formik = useFormik({
//     initialValues: {
//       name:           "",
//       status:         "Active",
//       content:        "",
//       businessEntity: "",
//       client:         "",
//       eventId:        "",
//       excludeNotify:  [],
//     },
//     validationSchema: smsTemplateValidationSchema,
//     onSubmit: (values, { resetForm }) => {
//       setIsLoading(true);

//       const payload = {
//         template_name:      values.name,
//         status:             values.status,
//         template:           values.content,
//         business_entity_id: values.businessEntity || null,
//         client_id:          values.client         || null,
//         event_id:           values.eventId,
//         exclude_notify:     values.excludeNotify.length ? values.excludeNotify : null,
//       };

//       const apiCall = id ? updateSms(id, payload) : storeSms(payload);
//       apiCall
//         .then((response) => {
//           successMessage(response);
//           if (!id) resetForm();
//         })
//         .catch(errorMessage)
//         .finally(() => setIsLoading(false));
//     },
//   });

//   // ── Derived flags for mutual exclusion ───────────────────────
//   const clientSelected        = !!formik.values.client;
//   const excludeNotifySelected = formik.values.excludeNotify.length > 0;

//   // ── Insert placeholder at cursor position ────────────────────
//   const insertPlaceholder = (placeholder) => {
//     if (!textareaRef) return;

//     const start      = textareaRef.selectionStart;
//     const end        = textareaRef.selectionEnd;
//     const before     = formik.values.content.substring(0, start);
//     const after      = formik.values.content.substring(end);
//     const newContent = before + placeholder + after;

//     formik.setFieldValue("content", newContent);

//     setTimeout(() => {
//       textareaRef.focus();
//       textareaRef.setSelectionRange(
//         start + placeholder.length,
//         start + placeholder.length
//       );
//     }, 0);
//   };

//   // ── Build preview text ────────────────────────────────────────
//   const buildPreview = (text) => {
//     let preview = text;
//     Object.entries(PREVIEW_VALUES).forEach(([key, val]) => {
//       preview = preview.replaceAll(key, val);
//     });
//     return preview;
//   };

//   const charCount    = formik.values.content.length;
//   const smsPartCount = charCount === 0 ? 0 : Math.ceil(charCount / 160);

//   return (
//     <div className="row">
//       {/* ── Header ── */}
//       <div className="col-sm-12 col-md-12 col-lg-12 col-xl-12">
//         <div className="alert alert-secondary p-2" role="alert">
//           <h6>{id ? "Update" : "Create"} New SMS Template</h6>
//           <span>
//             <i>Please input the required information.</i>
//           </span>
//         </div>
//       </div>

//       {/* ── Left: Form ── */}
//       <div className="col-sm-12 col-md-6 col-lg-6 col-xl-6">
//         <form onSubmit={formik.handleSubmit} className="row">

//           {/* Event */}
//           <div className="col-sm-12 col-md-12 col-lg-12 col-xl-12">
//             <div className="input-group mb-3">
//               <span className="input-group-text w-25">Event</span>
//               <SelectDropdown
//                 id="eventId"
//                 placeholder="Select Event"
//                 options={eventOptions}
//                 value={formik.values.eventId}
//                 onChange={(value) => formik.setFieldValue("eventId", value)}
//                 disabled={isEventLoading}
//               />
//             </div>
//             {formik.touched.eventId && formik.errors.eventId && (
//               <div className="text-danger mb-2">{formik.errors.eventId}</div>
//             )}
//           </div>

//           {/* Business Entity */}
//           <div className="col-sm-12 col-md-12 col-lg-12 col-xl-12">
//             <div className="input-group mb-3">
//               <span className="input-group-text w-25">Business Entity</span>
//               <SelectDropdown
//                 id="businessEntity"
//                 placeholder="Select Business Entity"
//                 options={businessEntityOptions}
//                 value={formik.values.businessEntity}
//                 onChange={(value) => {
//                   formik.setFieldValue("businessEntity", value);
//                   setSelectedBusinessId(value);
//                   formik.setFieldValue("client", "");
//                   formik.setFieldValue("excludeNotify", []);
//                   setClientOptions([]);
//                 }}
//                 disabled={isLoading}
//               />
//             </div>
//           </div>

//           {/* Client — disabled if excludeNotify has selections */}
//           <div className="col-sm-12 col-md-12 col-lg-12 col-xl-12">
//             <div className="input-group mb-3">
//               <span className="input-group-text w-25">
//                 Client
//                 {excludeNotifySelected && (
//                   <span
//                     className="ms-1 text-muted"
//                     title="Clear 'Exclude Notify' to enable this field"
//                     style={{ fontSize: "0.7rem", cursor: "help" }}
//                   >
//                     🔒
//                   </span>
//                 )}
//               </span>
//               <SelectDropdown
//                 id="client"
//                 placeholder="Select Client"
//                 options={clientOptions}
//                 value={formik.values.client}
//                 onChange={(value) => {
//                   formik.setFieldValue("client", value);
//                   formik.setFieldValue("excludeNotify", []);
//                 }}
//                 disabled={isClientLoading || !selectedBusinessId || excludeNotifySelected}
//               />
//             </div>
//             {excludeNotifySelected && (
//               <small className="text-muted d-block mb-2" style={{ marginTop: "-8px" }}>
//                 ℹ️ Clear "Exclude Notify" selection to use this field.
//               </small>
//             )}
//           </div>

//           {/* Exclude Notify (multiselect) — disabled if client is selected */}
//           <div className="col-sm-12 col-md-12 col-lg-12 col-xl-12">
//             <div className="input-group mb-3">
//               <span className="input-group-text w-25">
//                 Exclude Notify
//                 {clientSelected && (
//                   <span
//                     className="ms-1 text-muted"
//                     title="Clear 'Client' to enable this field"
//                     style={{ fontSize: "0.7rem", cursor: "help" }}
//                   >
//                     🔒
//                   </span>
//                 )}
//               </span>
//               <SelectDropdown
//                 id="excludeNotify"
//                 placeholder="Select clients to exclude"
//                 options={clientOptions}
//                 value={formik.values.excludeNotify}
//                 onChange={(value) => {
//                   formik.setFieldValue("excludeNotify", value || []);
//                   formik.setFieldValue("client", "");
//                 }}
//                 disabled={isClientLoading || !selectedBusinessId || clientSelected}
//                 isMulti={true}
//               />
//             </div>
//             {clientSelected && (
//               <small className="text-muted d-block mb-2" style={{ marginTop: "-8px" }}>
//                 ℹ️ Clear "Client" selection to use this field.
//               </small>
//             )}
//             {/* Selected exclude tags */}
//             {formik.values.excludeNotify.length > 0 && (
//               <div className="d-flex flex-wrap gap-1 mb-2" style={{ marginTop: "-8px" }}>
//                 {formik.values.excludeNotify.map((val) => {
//                   const option = clientOptions.find((o) => o.value === val);
//                   return option ? (
//                     <span
//                       key={val}
//                       className="badge bg-secondary d-flex align-items-center gap-1"
//                       style={{ fontSize: "0.75rem" }}
//                     >
//                       {option.label}
//                       <button
//                         type="button"
//                         className="btn-close btn-close-white"
//                         style={{ fontSize: "0.5rem" }}
//                         onClick={() => {
//                           const updated = formik.values.excludeNotify.filter((v) => v !== val);
//                           formik.setFieldValue("excludeNotify", updated);
//                         }}
//                         aria-label="Remove"
//                       />
//                     </span>
//                   ) : null;
//                 })}
//               </div>
//             )}
//           </div>

//           {/* Template Name */}
//           <div className="col-sm-12 col-md-12 col-lg-12 col-xl-12">
//             <div className="input-group mb-3">
//               <span className="input-group-text w-25">Name</span>
//               <input
//                 type="text"
//                 name="name"
//                 className="form-control"
//                 placeholder="Template Name"
//                 onChange={formik.handleChange}
//                 onBlur={formik.handleBlur}
//                 value={formik.values.name}
//               />
//             </div>
//             {formik.touched.name && formik.errors.name && (
//               <div className="text-danger mb-2">{formik.errors.name}</div>
//             )}
//           </div>

//           {/* Placeholder Dropdown + Status Toggle */}
//           <div className="col-sm-12 col-md-12 col-lg-12 col-xl-12">
//             <div className="d-flex justify-content-between align-items-center mb-2 flex-wrap gap-2">

//               {/* Placeholder dropdown */}
//               <div className="input-group" style={{ maxWidth: "300px" }}>
//                 <span className="input-group-text" style={{ fontSize: "0.85rem" }}>
//                   Insert Variable
//                 </span>
//                 <select
//                   className="form-select"
//                   style={{ fontSize: "0.85rem" }}
//                   value=""
//                   onChange={(e) => {
//                     if (e.target.value) {
//                       insertPlaceholder(e.target.value);
//                       e.target.value = "";
//                     }
//                   }}
//                 >
//                   <option value="">— Select placeholder —</option>
//                   {SMS_PLACEHOLDERS.map((ph) => (
//                     <option key={ph.value} value={ph.value}>
//                       {ph.label}  •  {ph.value}
//                     </option>
//                   ))}
//                 </select>
//               </div>

//               {/* Status toggle */}
//               <div className="form-check form-switch">
//                 <input
//                   className="form-check-input"
//                   type="checkbox"
//                   id="status"
//                   checked={formik.values.status === "Active"}
//                   onChange={(e) =>
//                     formik.setFieldValue(
//                       "status",
//                       e.target.checked ? "Active" : "Inactive"
//                     )
//                   }
//                 />
//                 <label className="form-check-label" htmlFor="status">
//                   {formik.values.status === "Active" ? "Active" : "Inactive"}
//                 </label>
//               </div>
//             </div>
//           </div>

//           {/* SMS Content Textarea */}
//           <div className="col-sm-12 col-md-12 col-lg-12 col-xl-12">
//             <div className="mb-1">
//               <textarea
//                 ref={(el) => setTextareaRef(el)}
//                 name="content"
//                 className="form-control"
//                 rows={8}
//                 placeholder="Type your SMS message here... Use 'Insert Variable' dropdown above to insert placeholders."
//                 onChange={formik.handleChange}
//                 onBlur={formik.handleBlur}
//                 value={formik.values.content}
//                 maxLength={SMS_MAX_CHARS}
//                 style={{ fontFamily: "monospace", fontSize: "0.9rem" }}
//               />
//             </div>

//             {/* Character / SMS part counter */}
//             <div className="d-flex justify-content-between mb-2">
//               <small className={charCount > SMS_MAX_CHARS - 50 ? "text-danger" : "text-muted"}>
//                 {charCount} / {SMS_MAX_CHARS} characters
//               </small>
//               <small className="text-muted">
//                 ≈{" "}
//                 <span className={smsPartCount > 2 ? "text-warning fw-bold" : "text-success"}>
//                   {smsPartCount} SMS part{smsPartCount !== 1 ? "s" : ""}
//                 </span>
//               </small>
//             </div>

//             {formik.touched.content && formik.errors.content && (
//               <div className="text-danger mb-2">{formik.errors.content}</div>
//             )}
//           </div>

//           {/* Submit */}
//           <div className="text-end">
//             <button type="submit" className="custom-btn" disabled={isLoading}>
//               {isLoading
//                 ? id ? "Updating..." : "Saving..."
//                 : id ? "Update" : "Save"}
//             </button>
//           </div>
//         </form>
//       </div>

//       {/* ── Right: Live Preview ── */}
//       <div className="col-sm-12 col-md-6 col-lg-6 col-xl-6">
//         <div
//           className="card w-100 p-0 border rounded"
//           style={{ minHeight: "412px", height: "auto" }}
//         >
//           <h6 className="card-header text-center">SMS Preview</h6>
//           <div className="card-body bg-white">
//             <div
//               className="mx-auto p-3 rounded"
//               style={{
//                 maxWidth: "320px",
//                 background: "#f0f0f0",
//                 border: "2px solid #dee2e6",
//                 borderRadius: "12px",
//                 minHeight: "200px",
//               }}
//             >
//               <div
//                 className="p-3 rounded"
//                 style={{
//                   background: "#dcf8c6",
//                   fontSize: "0.85rem",
//                   lineHeight: "1.5",
//                   wordBreak: "break-word",
//                   whiteSpace: "pre-wrap",
//                   borderRadius: "0 12px 12px 12px",
//                   boxShadow: "0 1px 2px rgba(0,0,0,0.15)",
//                 }}
//               >
//                 {formik.values.content
//                   ? buildPreview(formik.values.content)
//                   : (
//                     <span className="text-muted fst-italic">
//                       Your SMS preview will appear here...
//                     </span>
//                   )}
//               </div>

//               {/* Placeholder legend */}
//               {formik.values.content && (
//                 <div className="mt-3">
//                   <small className="text-muted d-block mb-1 fw-bold">
//                     Sample values used in preview:
//                   </small>
//                   {SMS_PLACEHOLDERS.map((ph) =>
//                     formik.values.content.includes(ph.value) ? (
//                       <small key={ph.value} className="d-block text-muted">
//                         <code>{ph.value}</code> → {PREVIEW_VALUES[ph.value]}
//                       </small>
//                     ) : null
//                   )}
//                 </div>
//               )}
//             </div>

//             {/* Targeting summary */}
//             {(formik.values.client || formik.values.excludeNotify.length > 0) && (
//               <div className="mt-3 mx-auto" style={{ maxWidth: "320px" }}>
//                 {formik.values.client && (
//                   <small className="d-block text-info">
//                     📨 Sending to:{" "}
//                     <strong>
//                       {clientOptions.find((o) => o.value === formik.values.client)?.label || formik.values.client}
//                     </strong>
//                   </small>
//                 )}
//                 {formik.values.excludeNotify.length > 0 && (
//                   <small className="d-block text-warning">
//                     🚫 Excluding:{" "}
//                     <strong>
//                       {formik.values.excludeNotify
//                         .map((val) => clientOptions.find((o) => o.value === val)?.label || val)
//                         .join(", ")}
//                     </strong>
//                   </small>
//                 )}
//               </div>
//             )}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };



// import React, { useContext, useEffect, useState } from "react";
// import { useFormik } from "formik";
// import * as Yup from "yup";
// import {
//   errorMessage,
//   successMessage,
// } from "../../../../api/api-config/apiResponseMessage";
// import {
//   fetchSmsTemplateById,
//   storeSms,
//   updateSms,
// } from "../../../../api/api-client/settings/smsApi";
// import { fetchSmsAttributes } from "../../../../api/api-client/settings/smsAttributeApi";
// import { fetchCompany } from "../../../../api/api-client/settings/companyApi";
// import { SelectDropdown } from "../SelectDropdown";
// import { userContext } from "../../../context/UserContext";
// import {
//   getClientListFromLocal,
//   fetchEvents,
// } from "../../../../api/api-client/ticketApi";

// const smsTemplateValidationSchema = Yup.object({
//   name:    Yup.string().required("Template name is required"),
//   content: Yup.string().required("Template content is required"),
//   eventId: Yup.string().required("Event is required"),
// });

// // Fallback preview values (used for live preview substitution)
// const PREVIEW_VALUES = {
//   "{{subCategoryName}}":    "Internet Issue",
//   "{{messageType}}":        "সমাধান",
//   "{{lastTicketNumber}}":   "TKT-20240001",
//   "{{businessEntityName}}": "Orbit BD",
//   "{{clientName}}":         "Acme Corp",
//   "{{agentName}}":          "John Doe",
// };

// const SMS_MAX_CHARS = 660;

// export const AddNewSms = ({ id }) => {
//   const { user } = useContext(userContext);

//   const [isLoading,             setIsLoading]             = useState(false);
//   const [businessEntityOptions, setBusinessEntityOptions] = useState([]);
//   const [clientOptions,         setClientOptions]         = useState([]);
//   const [selectedBusinessId,    setSelectedBusinessId]    = useState(null);
//   const [isClientLoading,       setIsClientLoading]       = useState(false);
//   const [eventOptions,          setEventOptions]          = useState([]);
//   const [isEventLoading,        setIsEventLoading]        = useState(false);
//   const [textareaRef,           setTextareaRef]           = useState(null);

//   // ── SMS Attributes (placeholders) ────────────────────────────
//   const [smsPlaceholders,    setSmsPlaceholders]    = useState([]);
//   const [isPlaceholderLoading, setIsPlaceholderLoading] = useState(false);

//   useEffect(() => {
//     setIsPlaceholderLoading(true);
//     fetchSmsAttributes()
//       .then((response) => {
//         setSmsPlaceholders(
//           response.data.map((attr) => ({
//             label: attr.label,
//             value: attr.value,
//           }))
//         );
//       })
//       .catch(errorMessage)
//       .finally(() => setIsPlaceholderLoading(false));
//   }, []);

//   // ── Fetch Events ──────────────────────────────────────────────
//   useEffect(() => {
//     setIsEventLoading(true);
//     fetchEvents()
//       .then((response) => {
//         setEventOptions(
//           response.data.map((event) => ({
//             value: event.id,
//             label: event.event_name,
//           }))
//         );
//       })
//       .catch(errorMessage)
//       .finally(() => setIsEventLoading(false));
//   }, []);

//   // ── Fetch Business Entity ─────────────────────────────────────
//   useEffect(() => {
//     fetchCompany({ userType: user?.type, userId: user?.id })
//       .then((response) => {
//         setBusinessEntityOptions(
//           response.result.map((option) => ({
//             value: option.id,
//             label: option.company_name,
//           }))
//         );
//       })
//       .catch(errorMessage);
//   }, []);

//   // ── Fetch Clients on Business Entity change ───────────────────
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

//   // ── Load existing template if editing ────────────────────────
//   useEffect(() => {
//     if (id) {
//       setIsLoading(true);
//       fetchSmsTemplateById(id)
//         .then((response) => {
//           formik.setValues({
//             name:           response.data.template_name      || "",
//             status:         response.data.status             || "Active",
//             content:        response.data.template           || "",
//             businessEntity: response.data.business_entity_id || "",
//             client:         response.data.client_id          || "",
//             eventId:        response.data.event_id           || "",
//             excludeNotify:  response.data.exclude_notify     || [],
//           });
//           if (response.data.business_entity_id) {
//             setSelectedBusinessId(response.data.business_entity_id);
//           }
//         })
//         .catch(errorMessage)
//         .finally(() => setIsLoading(false));
//     }
//   }, [id]);

//   // ── Formik ────────────────────────────────────────────────────
//   const formik = useFormik({
//     initialValues: {
//       name:           "",
//       status:         "Active",
//       content:        "",
//       businessEntity: "",
//       client:         "",
//       eventId:        "",
//       excludeNotify:  [],
//     },
//     validationSchema: smsTemplateValidationSchema,
//     onSubmit: (values, { resetForm }) => {
//       setIsLoading(true);

//       const payload = {
//         template_name:      values.name,
//         status:             values.status,
//         template:           values.content,
//         business_entity_id: values.businessEntity || null,
//         client_id:          values.client         || null,
//         event_id:           values.eventId,
//         exclude_notify:     values.excludeNotify.length ? values.excludeNotify : null,
//       };

//       const apiCall = id ? updateSms(id, payload) : storeSms(payload);
//       apiCall
//         .then((response) => {
//           successMessage(response);
//           if (!id) resetForm();
//         })
//         .catch(errorMessage)
//         .finally(() => setIsLoading(false));
//     },
//   });

//   // ── Derived flags for mutual exclusion ───────────────────────
//   const clientSelected        = !!formik.values.client;
//   const excludeNotifySelected = formik.values.excludeNotify.length > 0;

//   // ── Insert placeholder at cursor position ────────────────────
//   const insertPlaceholder = (placeholder) => {
//     if (!textareaRef) return;

//     const start      = textareaRef.selectionStart;
//     const end        = textareaRef.selectionEnd;
//     const before     = formik.values.content.substring(0, start);
//     const after      = formik.values.content.substring(end);
//     const newContent = before + placeholder + after;

//     formik.setFieldValue("content", newContent);

//     setTimeout(() => {
//       textareaRef.focus();
//       textareaRef.setSelectionRange(
//         start + placeholder.length,
//         start + placeholder.length
//       );
//     }, 0);
//   };

//   // ── Build preview text ────────────────────────────────────────
//   const buildPreview = (text) => {
//     let preview = text;
//     // Use dynamic placeholders for preview, fallback to PREVIEW_VALUES
//     smsPlaceholders.forEach(({ value }) => {
//       const sample = PREVIEW_VALUES[value] || value;
//       preview = preview.replaceAll(value, sample);
//     });
//     return preview;
//   };

//   const charCount    = formik.values.content.length;
//   const smsPartCount = charCount === 0 ? 0 : Math.ceil(charCount / 160);

//   return (
//     <div className="row">
//       {/* ── Header ── */}
//       <div className="col-sm-12 col-md-12 col-lg-12 col-xl-12">
//         <div className="alert alert-secondary p-2" role="alert">
//           <h6>{id ? "Update" : "Create"} New SMS Template</h6>
//           <span>
//             <i>Please input the required information.</i>
//           </span>
//         </div>
//       </div>

//       {/* ── Left: Form ── */}
//       <div className="col-sm-12 col-md-6 col-lg-6 col-xl-6">
//         <form onSubmit={formik.handleSubmit} className="row">

//           {/* Event */}
//           <div className="col-sm-12 col-md-12 col-lg-12 col-xl-12">
//             <div className="input-group mb-3">
//               <span className="input-group-text w-25">Event</span>
//               <SelectDropdown
//                 id="eventId"
//                 placeholder="Select Event"
//                 options={eventOptions}
//                 value={formik.values.eventId}
//                 onChange={(value) => formik.setFieldValue("eventId", value)}
//                 disabled={isEventLoading}
//               />
//             </div>
//             {formik.touched.eventId && formik.errors.eventId && (
//               <div className="text-danger mb-2">{formik.errors.eventId}</div>
//             )}
//           </div>

//           {/* Business Entity */}
//           <div className="col-sm-12 col-md-12 col-lg-12 col-xl-12">
//             <div className="input-group mb-3">
//               <span className="input-group-text w-25">Business Entity</span>
//               <SelectDropdown
//                 id="businessEntity"
//                 placeholder="Select Business Entity"
//                 options={businessEntityOptions}
//                 value={formik.values.businessEntity}
//                 onChange={(value) => {
//                   formik.setFieldValue("businessEntity", value);
//                   setSelectedBusinessId(value);
//                   formik.setFieldValue("client", "");
//                   formik.setFieldValue("excludeNotify", []);
//                   setClientOptions([]);
//                 }}
//                 disabled={isLoading}
//               />
//             </div>
//           </div>

//           {/* Client — disabled if excludeNotify has selections */}
//           <div className="col-sm-12 col-md-12 col-lg-12 col-xl-12">
//             <div className="input-group mb-3">
//               <span className="input-group-text w-25">
//                 Client
//                 {excludeNotifySelected && (
//                   <span
//                     className="ms-1 text-muted"
//                     title="Clear 'Exclude Notify' to enable this field"
//                     style={{ fontSize: "0.7rem", cursor: "help" }}
//                   >
//                     🔒
//                   </span>
//                 )}
//               </span>
//               <SelectDropdown
//                 id="client"
//                 placeholder="Select Client"
//                 options={clientOptions}
//                 value={formik.values.client}
//                 onChange={(value) => {
//                   formik.setFieldValue("client", value);
//                   formik.setFieldValue("excludeNotify", []);
//                 }}
//                 disabled={isClientLoading || !selectedBusinessId || excludeNotifySelected}
//               />
//             </div>
//             {excludeNotifySelected && (
//               <small className="text-muted d-block mb-2" style={{ marginTop: "-8px" }}>
//                 ℹ️ Clear "Exclude Notify" selection to use this field.
//               </small>
//             )}
//           </div>

//           {/* Exclude Notify (multiselect) — disabled if client is selected */}
//           <div className="col-sm-12 col-md-12 col-lg-12 col-xl-12">
//             <div className="input-group mb-3">
//               <span className="input-group-text w-25">
//                 Exclude Notify
//                 {clientSelected && (
//                   <span
//                     className="ms-1 text-muted"
//                     title="Clear 'Client' to enable this field"
//                     style={{ fontSize: "0.7rem", cursor: "help" }}
//                   >
//                     🔒
//                   </span>
//                 )}
//               </span>
//               <SelectDropdown
//                 id="excludeNotify"
//                 placeholder="Select clients to exclude"
//                 options={clientOptions}
//                 value={formik.values.excludeNotify}
//                 onChange={(value) => {
//                   formik.setFieldValue("excludeNotify", value || []);
//                   formik.setFieldValue("client", "");
//                 }}
//                 disabled={isClientLoading || !selectedBusinessId || clientSelected}
//                 isMulti={true}
//               />
//             </div>
//             {clientSelected && (
//               <small className="text-muted d-block mb-2" style={{ marginTop: "-8px" }}>
//                 ℹ️ Clear "Client" selection to use this field.
//               </small>
//             )}
//             {/* Selected exclude tags */}
//             {formik.values.excludeNotify.length > 0 && (
//               <div className="d-flex flex-wrap gap-1 mb-2" style={{ marginTop: "-8px" }}>
//                 {formik.values.excludeNotify.map((val) => {
//                   const option = clientOptions.find((o) => o.value === val);
//                   return option ? (
//                     <span
//                       key={val}
//                       className="badge bg-secondary d-flex align-items-center gap-1"
//                       style={{ fontSize: "0.75rem" }}
//                     >
//                       {option.label}
//                       <button
//                         type="button"
//                         className="btn-close btn-close-white"
//                         style={{ fontSize: "0.5rem" }}
//                         onClick={() => {
//                           const updated = formik.values.excludeNotify.filter((v) => v !== val);
//                           formik.setFieldValue("excludeNotify", updated);
//                         }}
//                         aria-label="Remove"
//                       />
//                     </span>
//                   ) : null;
//                 })}
//               </div>
//             )}
//           </div>

//           {/* Template Name */}
//           <div className="col-sm-12 col-md-12 col-lg-12 col-xl-12">
//             <div className="input-group mb-3">
//               <span className="input-group-text w-25">Name</span>
//               <input
//                 type="text"
//                 name="name"
//                 className="form-control"
//                 placeholder="Template Name"
//                 onChange={formik.handleChange}
//                 onBlur={formik.handleBlur}
//                 value={formik.values.name}
//               />
//             </div>
//             {formik.touched.name && formik.errors.name && (
//               <div className="text-danger mb-2">{formik.errors.name}</div>
//             )}
//           </div>

//           {/* Placeholder Dropdown + Status Toggle */}
//           <div className="col-sm-12 col-md-12 col-lg-12 col-xl-12">
//             <div className="d-flex justify-content-between align-items-center mb-2 flex-wrap gap-2">

//               {/* Placeholder dropdown — loaded dynamically from API */}
//               <div className="input-group" style={{ maxWidth: "300px" }}>
//                 <span className="input-group-text" style={{ fontSize: "0.85rem" }}>
//                   Insert Variable
//                 </span>
//                 <select
//                   className="form-select"
//                   style={{ fontSize: "0.85rem" }}
//                   value=""
//                   disabled={isPlaceholderLoading}
//                   onChange={(e) => {
//                     if (e.target.value) {
//                       insertPlaceholder(e.target.value);
//                       e.target.value = "";
//                     }
//                   }}
//                 >
//                   <option value="">
//                     {isPlaceholderLoading ? "Loading..." : "— Select placeholder —"}
//                   </option>
//                   {smsPlaceholders.map((ph) => (
//                     <option key={ph.value} value={ph.value}>
//                       {ph.label}  •  {ph.value}
//                     </option>
//                   ))}
//                 </select>
//               </div>

//               {/* Status toggle */}
//               <div className="form-check form-switch">
//                 <input
//                   className="form-check-input"
//                   type="checkbox"
//                   id="status"
//                   checked={formik.values.status === "Active"}
//                   onChange={(e) =>
//                     formik.setFieldValue(
//                       "status",
//                       e.target.checked ? "Active" : "Inactive"
//                     )
//                   }
//                 />
//                 <label className="form-check-label" htmlFor="status">
//                   {formik.values.status === "Active" ? "Active" : "Inactive"}
//                 </label>
//               </div>
//             </div>
//           </div>

//           {/* SMS Content Textarea */}
//           <div className="col-sm-12 col-md-12 col-lg-12 col-xl-12">
//             <div className="mb-1">
//               <textarea
//                 ref={(el) => setTextareaRef(el)}
//                 name="content"
//                 className="form-control"
//                 rows={8}
//                 placeholder="Type your SMS message here... Use 'Insert Variable' dropdown above to insert placeholders."
//                 onChange={formik.handleChange}
//                 onBlur={formik.handleBlur}
//                 value={formik.values.content}
//                 maxLength={SMS_MAX_CHARS}
//                 style={{ fontFamily: "monospace", fontSize: "0.9rem" }}
//               />
//             </div>

//             {/* Character / SMS part counter */}
//             <div className="d-flex justify-content-between mb-2">
//               <small className={charCount > SMS_MAX_CHARS - 50 ? "text-danger" : "text-muted"}>
//                 {charCount} / {SMS_MAX_CHARS} characters
//               </small>
//               <small className="text-muted">
//                 ≈{" "}
//                 <span className={smsPartCount > 2 ? "text-warning fw-bold" : "text-success"}>
//                   {smsPartCount} SMS part{smsPartCount !== 1 ? "s" : ""}
//                 </span>
//               </small>
//             </div>

//             {formik.touched.content && formik.errors.content && (
//               <div className="text-danger mb-2">{formik.errors.content}</div>
//             )}
//           </div>

//           {/* Submit */}
//           <div className="text-end">
//             <button type="submit" className="custom-btn" disabled={isLoading}>
//               {isLoading
//                 ? id ? "Updating..." : "Saving..."
//                 : id ? "Update" : "Save"}
//             </button>
//           </div>
//         </form>
//       </div>

//       {/* ── Right: Live Preview ── */}
//       <div className="col-sm-12 col-md-6 col-lg-6 col-xl-6">
//         <div
//           className="card w-100 p-0 border rounded"
//           style={{ minHeight: "412px", height: "auto" }}
//         >
//           <h6 className="card-header text-center">SMS Preview</h6>
//           <div className="card-body bg-white">
//             <div
//               className="mx-auto p-3 rounded"
//               style={{
//                 maxWidth: "320px",
//                 background: "#f0f0f0",
//                 border: "2px solid #dee2e6",
//                 borderRadius: "12px",
//                 minHeight: "200px",
//               }}
//             >
//               <div
//                 className="p-3 rounded"
//                 style={{
//                   background: "#dcf8c6",
//                   fontSize: "0.85rem",
//                   lineHeight: "1.5",
//                   wordBreak: "break-word",
//                   whiteSpace: "pre-wrap",
//                   borderRadius: "0 12px 12px 12px",
//                   boxShadow: "0 1px 2px rgba(0,0,0,0.15)",
//                 }}
//               >
//                 {formik.values.content
//                   ? buildPreview(formik.values.content)
//                   : (
//                     <span className="text-muted fst-italic">
//                       Your SMS preview will appear here...
//                     </span>
//                   )}
//               </div>

//               {/* Dynamic placeholder legend */}
//               {formik.values.content && smsPlaceholders.some((ph) =>
//                 formik.values.content.includes(ph.value)
//               ) && (
//                 <div className="mt-3">
//                   <small className="text-muted d-block mb-1 fw-bold">
//                     Sample values used in preview:
//                   </small>
//                   {smsPlaceholders.map((ph) =>
//                     formik.values.content.includes(ph.value) ? (
//                       <small key={ph.value} className="d-block text-muted">
//                         <code>{ph.value}</code> → {PREVIEW_VALUES[ph.value] || ph.label}
//                       </small>
//                     ) : null
//                   )}
//                 </div>
//               )}
//             </div>

//             {/* Targeting summary */}
//             {(formik.values.client || formik.values.excludeNotify.length > 0) && (
//               <div className="mt-3 mx-auto" style={{ maxWidth: "320px" }}>
//                 {formik.values.client && (
//                   <small className="d-block text-info">
//                     📨 Sending to:{" "}
//                     <strong>
//                       {clientOptions.find((o) => o.value === formik.values.client)?.label || formik.values.client}
//                     </strong>
//                   </small>
//                 )}
//                 {formik.values.excludeNotify.length > 0 && (
//                   <small className="d-block text-warning">
//                     🚫 Excluding:{" "}
//                     <strong>
//                       {formik.values.excludeNotify
//                         .map((val) => clientOptions.find((o) => o.value === val)?.label || val)
//                         .join(", ")}
//                     </strong>
//                   </small>
//                 )}
//               </div>
//             )}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };







import React, { useContext, useEffect, useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import {
  errorMessage,
  successMessage,
} from "../../../../api/api-config/apiResponseMessage";
import {
  fetchSmsTemplateById,
  storeSms,
  updateSms,
} from "../../../../api/api-client/settings/smsApi";
import { fetchSmsAttributes } from "../../../../api/api-client/settings/smsAttributeApi";
import { fetchCompany } from "../../../../api/api-client/settings/companyApi";
import { SelectDropdown } from "../SelectDropdown";
import { userContext } from "../../../context/UserContext";
import {
  getClientListFromLocal,
  fetchEvents,
} from "../../../../api/api-client/ticketApi";

const smsTemplateValidationSchema = Yup.object({
  name:    Yup.string().required("Template name is required"),
  content: Yup.string().required("Template content is required"),
  eventId: Yup.string().required("Event is required"),
});

// Fallback preview values (used for live preview substitution)
const PREVIEW_VALUES = {
  "{{subCategoryName}}":    "Internet Issue",
  "{{messageType}}":        "সমাধান",
  "{{lastTicketNumber}}":   "TKT-20240001",
  "{{businessEntityName}}": "Orbit BD",
  "{{clientName}}":         "Acme Corp",
  "{{agentName}}":          "John Doe",
};

const SMS_MAX_CHARS  = 660;
const ORBIT_OWN_ID   = 9; // Orbit Own business entity ID — disables client fields

export const AddNewSms = ({ id }) => {
  const { user } = useContext(userContext);

  const [isLoading,               setIsLoading]               = useState(false);
  const [businessEntityOptions,   setBusinessEntityOptions]   = useState([]);
  const [clientOptions,           setClientOptions]           = useState([]);
  const [selectedBusinessId,      setSelectedBusinessId]      = useState(null);
  const [isClientLoading,         setIsClientLoading]         = useState(false);
  const [eventOptions,            setEventOptions]            = useState([]);
  const [isEventLoading,          setIsEventLoading]          = useState(false);
  const [textareaRef,             setTextareaRef]             = useState(null);
  const [smsPlaceholders,         setSmsPlaceholders]         = useState([]);
  const [isPlaceholderLoading,    setIsPlaceholderLoading]    = useState(false);

  // ── Is Orbit Own selected? ────────────────────────────────────
  const isOrbitOwn = selectedBusinessId === ORBIT_OWN_ID;

  // ── Fetch SMS Attributes (placeholders) ──────────────────────
  useEffect(() => {
    setIsPlaceholderLoading(true);
    fetchSmsAttributes()
      .then((response) => {
        setSmsPlaceholders(
          response.data.data.map((attr) => ({
            label: attr.label,
            value: attr.value,
          }))
        );
      })
      .catch(errorMessage)
      .finally(() => setIsPlaceholderLoading(false));
  }, []);

  // ── Fetch Events ──────────────────────────────────────────────
  useEffect(() => {
    setIsEventLoading(true);
    fetchEvents()
      .then((response) => {
        setEventOptions(
          response.data.map((event) => ({
            value: event.id,
            label: event.event_name,
          }))
        );
      })
      .catch(errorMessage)
      .finally(() => setIsEventLoading(false));
  }, []);

  // ── Fetch Business Entity ─────────────────────────────────────
  useEffect(() => {
    fetchCompany({ userType: user?.type, userId: user?.id })
      .then((response) => {
        setBusinessEntityOptions(
          response.result.map((option) => ({
            value: option.id,
            label: option.company_name,
          }))
        );
      })
      .catch(errorMessage);
  }, []);

  // ── Fetch Clients on Business Entity change ───────────────────
  useEffect(() => {
    if (selectedBusinessId != null && !isOrbitOwn) {
      setIsClientLoading(true);
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

  // ── Load existing template if editing ────────────────────────
  useEffect(() => {
    if (id) {
      setIsLoading(true);
      fetchSmsTemplateById(id)
        .then((response) => {
          formik.setValues({
            name:           response.data.template_name      || "",
            status:         response.data.status             || "Active",
            content:        response.data.template           || "",
            businessEntity: response.data.business_entity_id || "",
            client:         response.data.client_id          || "",
            eventId:        response.data.event_id           || "",
            excludeNotify:  response.data.exclude_notify     || [],
          });
          if (response.data.business_entity_id) {
            setSelectedBusinessId(response.data.business_entity_id);
          }
        })
        .catch(errorMessage)
        .finally(() => setIsLoading(false));
    }
  }, [id]);

  // ── Formik ────────────────────────────────────────────────────
  const formik = useFormik({
    initialValues: {
      name:           "",
      status:         "Active",
      content:        "",
      businessEntity: "",
      client:         "",
      eventId:        "",
      excludeNotify:  [],
    },
    validationSchema: smsTemplateValidationSchema,
    onSubmit: (values, { resetForm }) => {
      setIsLoading(true);

      const payload = {
        template_name:      values.name,
        status:             values.status,
        template:           values.content,
        business_entity_id: values.businessEntity || null,
        client_id:          values.client         || null,
        event_id:           values.eventId,
        exclude_notify:     values.excludeNotify.length ? values.excludeNotify : null,
      };

      const apiCall = id ? updateSms(id, payload) : storeSms(payload);
      apiCall
        .then((response) => {
          successMessage(response);
          if (!id) resetForm();
        })
        .catch(errorMessage)
        .finally(() => setIsLoading(false));
    },
  });

  // ── Derived flags ─────────────────────────────────────────────
  const clientSelected        = !!formik.values.client;
  const excludeNotifySelected = formik.values.excludeNotify.length > 0;

  // ── Insert placeholder at cursor ──────────────────────────────
  const insertPlaceholder = (placeholder) => {
    if (!textareaRef) return;

    const start      = textareaRef.selectionStart;
    const end        = textareaRef.selectionEnd;
    const before     = formik.values.content.substring(0, start);
    const after      = formik.values.content.substring(end);
    const newContent = before + placeholder + after;

    formik.setFieldValue("content", newContent);

    setTimeout(() => {
      textareaRef.focus();
      textareaRef.setSelectionRange(
        start + placeholder.length,
        start + placeholder.length
      );
    }, 0);
  };

  // ── Build preview text ────────────────────────────────────────
  const buildPreview = (text) => {
    let preview = text;
    smsPlaceholders.forEach(({ value }) => {
      const sample = PREVIEW_VALUES[value] || value;
      preview = preview.replaceAll(value, sample);
    });
    return preview;
  };

  const charCount    = formik.values.content.length;
  const smsPartCount = charCount === 0 ? 0 : Math.ceil(charCount / 160);

  return (
    <div className="row">
      {/* ── Header ── */}
      <div className="col-sm-12 col-md-12 col-lg-12 col-xl-12">
        <div className="alert alert-secondary p-2" role="alert">
          <h6>{id ? "Update" : "Create"} New SMS Template</h6>
          <span>
            <i>Please input the required information.</i>
          </span>
        </div>
      </div>

      {/* ── Left: Form ── */}
      <div className="col-sm-12 col-md-6 col-lg-6 col-xl-6">
        <form onSubmit={formik.handleSubmit} className="row">

          {/* Event */}
          <div className="col-sm-12 col-md-12 col-lg-12 col-xl-12">
            <div className="input-group mb-3">
              <span className="input-group-text w-25">Event</span>
              <SelectDropdown
                id="eventId"
                placeholder="Select Event"
                options={eventOptions}
                value={formik.values.eventId}
                onChange={(value) => formik.setFieldValue("eventId", value)}
                disabled={isEventLoading}
              />
            </div>
            {formik.touched.eventId && formik.errors.eventId && (
              <div className="text-danger mb-2">{formik.errors.eventId}</div>
            )}
          </div>

          {/* Business Entity */}
          <div className="col-sm-12 col-md-12 col-lg-12 col-xl-12">
            <div className="input-group mb-3">
              <span className="input-group-text w-25">Business Entity</span>
              <SelectDropdown
                id="businessEntity"
                placeholder="Select Business Entity"
                options={businessEntityOptions}
                value={formik.values.businessEntity}
                onChange={(value) => {
                  formik.setFieldValue("businessEntity", value);
                  setSelectedBusinessId(value);
                  // Always reset client fields on entity change
                  formik.setFieldValue("client", "");
                  formik.setFieldValue("excludeNotify", []);
                  setClientOptions([]);
                }}
                disabled={isLoading}
              />
            </div>
            {/* Orbit Own notice */}
            {isOrbitOwn && (
              <small className="text-info d-block mb-2" style={{ marginTop: "-8px" }}>
                ℹ️ Client and Exclude Notify fields are not available for Orbit Own.
              </small>
            )}
          </div>

          {/* Client — disabled if Orbit Own OR excludeNotify has selections */}
          <div className="col-sm-12 col-md-12 col-lg-12 col-xl-12">
            <div className="input-group mb-3">
              <span className="input-group-text w-25">
                Client
                {(excludeNotifySelected || isOrbitOwn) && (
                  <span
                    className="ms-1 text-muted"
                    title={
                      isOrbitOwn
                        ? "Not available for Orbit Own"
                        : "Clear 'Exclude Notify' to enable this field"
                    }
                    style={{ fontSize: "0.7rem", cursor: "help" }}
                  >
                    🔒
                  </span>
                )}
              </span>
              <SelectDropdown
                id="client"
                placeholder={isOrbitOwn ? "N/A for Orbit Own" : "Select Client"}
                options={clientOptions}
                value={formik.values.client}
                onChange={(value) => {
                  formik.setFieldValue("client", value);
                  formik.setFieldValue("excludeNotify", []);
                }}
                disabled={
                  isClientLoading ||
                  !selectedBusinessId ||
                  excludeNotifySelected ||
                  isOrbitOwn          // ← disabled for Orbit Own
                }
              />
            </div>
            {excludeNotifySelected && !isOrbitOwn && (
              <small className="text-muted d-block mb-2" style={{ marginTop: "-8px" }}>
                ℹ️ Clear "Exclude Notify" selection to use this field.
              </small>
            )}
          </div>

          {/* Exclude Notify — disabled if Orbit Own OR client is selected */}
          <div className="col-sm-12 col-md-12 col-lg-12 col-xl-12">
            <div className="input-group mb-3">
              <span className="input-group-text w-25">
                Exclude Notify
                {(clientSelected || isOrbitOwn) && (
                  <span
                    className="ms-1 text-muted"
                    title={
                      isOrbitOwn
                        ? "Not available for Orbit Own"
                        : "Clear 'Client' to enable this field"
                    }
                    style={{ fontSize: "0.7rem", cursor: "help" }}
                  >
                    🔒
                  </span>
                )}
              </span>
              <SelectDropdown
                id="excludeNotify"
                placeholder={isOrbitOwn ? "N/A for Orbit Own" : "Select clients to exclude"}
                options={clientOptions}
                value={formik.values.excludeNotify}
                onChange={(value) => {
                  formik.setFieldValue("excludeNotify", value || []);
                  formik.setFieldValue("client", "");
                }}
                disabled={
                  isClientLoading ||
                  !selectedBusinessId ||
                  clientSelected      ||
                  isOrbitOwn          // ← disabled for Orbit Own
                }
                isMulti={true}
              />
            </div>
            {clientSelected && !isOrbitOwn && (
              <small className="text-muted d-block mb-2" style={{ marginTop: "-8px" }}>
                ℹ️ Clear "Client" selection to use this field.
              </small>
            )}
            {/* Selected exclude tags */}
            {!isOrbitOwn && formik.values.excludeNotify.length > 0 && (
              <div className="d-flex flex-wrap gap-1 mb-2" style={{ marginTop: "-8px" }}>
                {formik.values.excludeNotify.map((val) => {
                  const option = clientOptions.find((o) => o.value === val);
                  return option ? (
                    <span
                      key={val}
                      className="badge bg-secondary d-flex align-items-center gap-1"
                      style={{ fontSize: "0.75rem" }}
                    >
                      {option.label}
                      <button
                        type="button"
                        className="btn-close btn-close-white"
                        style={{ fontSize: "0.5rem" }}
                        onClick={() => {
                          const updated = formik.values.excludeNotify.filter((v) => v !== val);
                          formik.setFieldValue("excludeNotify", updated);
                        }}
                        aria-label="Remove"
                      />
                    </span>
                  ) : null;
                })}
              </div>
            )}
          </div>

          {/* Template Name */}
          <div className="col-sm-12 col-md-12 col-lg-12 col-xl-12">
            <div className="input-group mb-3">
              <span className="input-group-text w-25">Name</span>
              <input
                type="text"
                name="name"
                className="form-control"
                placeholder="Template Name"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.name}
              />
            </div>
            {formik.touched.name && formik.errors.name && (
              <div className="text-danger mb-2">{formik.errors.name}</div>
            )}
          </div>

          {/* Placeholder Dropdown + Status Toggle */}
          <div className="col-sm-12 col-md-12 col-lg-12 col-xl-12">
            <div className="d-flex justify-content-between align-items-center mb-2 flex-wrap gap-2">

              {/* Placeholder dropdown */}
              <div className="input-group" style={{ maxWidth: "300px" }}>
                <span className="input-group-text" style={{ fontSize: "0.85rem" }}>
                  Insert Variable
                </span>
                <select
                  className="form-select"
                  style={{ fontSize: "0.85rem" }}
                  value=""
                  disabled={isPlaceholderLoading}
                  onChange={(e) => {
                    if (e.target.value) {
                      insertPlaceholder(e.target.value);
                      e.target.value = "";
                    }
                  }}
                >
                  <option value="">
                    {isPlaceholderLoading ? "Loading..." : "— Select placeholder —"}
                  </option>
                  {smsPlaceholders.map((ph) => (
                    <option key={ph.value} value={ph.value}>
                      {ph.label}  •  {ph.value}
                    </option>
                  ))}
                </select>
              </div>

              {/* Status toggle */}
              <div className="form-check form-switch">
                <input
                  className="form-check-input"
                  type="checkbox"
                  id="status"
                  checked={formik.values.status === "Active"}
                  onChange={(e) =>
                    formik.setFieldValue(
                      "status",
                      e.target.checked ? "Active" : "Inactive"
                    )
                  }
                />
                <label className="form-check-label" htmlFor="status">
                  {formik.values.status === "Active" ? "Active" : "Inactive"}
                </label>
              </div>
            </div>
          </div>

          {/* SMS Content Textarea */}
          <div className="col-sm-12 col-md-12 col-lg-12 col-xl-12">
            <div className="mb-1">
              <textarea
                ref={(el) => setTextareaRef(el)}
                name="content"
                className="form-control"
                rows={8}
                placeholder="Type your SMS message here... Use 'Insert Variable' dropdown above to insert placeholders."
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.content}
                maxLength={SMS_MAX_CHARS}
                style={{ fontFamily: "monospace", fontSize: "0.9rem" }}
              />
            </div>

            {/* Character / SMS part counter */}
            <div className="d-flex justify-content-between mb-2">
              <small className={charCount > SMS_MAX_CHARS - 50 ? "text-danger" : "text-muted"}>
                {charCount} / {SMS_MAX_CHARS} characters
              </small>
              <small className="text-muted">
                ≈{" "}
                <span className={smsPartCount > 2 ? "text-warning fw-bold" : "text-success"}>
                  {smsPartCount} SMS part{smsPartCount !== 1 ? "s" : ""}
                </span>
              </small>
            </div>

            {formik.touched.content && formik.errors.content && (
              <div className="text-danger mb-2">{formik.errors.content}</div>
            )}
          </div>

          {/* Submit */}
          <div className="text-end">
            <button type="submit" className="custom-btn" disabled={isLoading}>
              {isLoading
                ? id ? "Updating..." : "Saving..."
                : id ? "Update" : "Save"}
            </button>
          </div>
        </form>
      </div>

      {/* ── Right: Live Preview ── */}
      <div className="col-sm-12 col-md-6 col-lg-6 col-xl-6">
        <div
          className="card w-100 p-0 border rounded"
          style={{ minHeight: "412px", height: "auto" }}
        >
          <h6 className="card-header text-center">SMS Preview</h6>
          <div className="card-body bg-white">
            <div
              className="mx-auto p-3 rounded"
              style={{
                maxWidth: "320px",
                background: "#f0f0f0",
                border: "2px solid #dee2e6",
                borderRadius: "12px",
                minHeight: "200px",
              }}
            >
              <div
                className="p-3 rounded"
                style={{
                  background: "#dcf8c6",
                  fontSize: "0.85rem",
                  lineHeight: "1.5",
                  wordBreak: "break-word",
                  whiteSpace: "pre-wrap",
                  borderRadius: "0 12px 12px 12px",
                  boxShadow: "0 1px 2px rgba(0,0,0,0.15)",
                }}
              >
                {formik.values.content
                  ? buildPreview(formik.values.content)
                  : (
                    <span className="text-muted fst-italic">
                      Your SMS preview will appear here...
                    </span>
                  )}
              </div>

              {/* Dynamic placeholder legend */}
              {formik.values.content && smsPlaceholders.some((ph) =>
                formik.values.content.includes(ph.value)
              ) && (
                <div className="mt-3">
                  <small className="text-muted d-block mb-1 fw-bold">
                    Sample values used in preview:
                  </small>
                  {smsPlaceholders.map((ph) =>
                    formik.values.content.includes(ph.value) ? (
                      <small key={ph.value} className="d-block text-muted">
                        <code>{ph.value}</code> → {PREVIEW_VALUES[ph.value] || ph.label}
                      </small>
                    ) : null
                  )}
                </div>
              )}
            </div>

            {/* Targeting summary */}
            {(formik.values.client || formik.values.excludeNotify.length > 0) && (
              <div className="mt-3 mx-auto" style={{ maxWidth: "320px" }}>
                {formik.values.client && (
                  <small className="d-block text-info">
                    📨 Sending to:{" "}
                    <strong>
                      {clientOptions.find((o) => o.value === formik.values.client)?.label || formik.values.client}
                    </strong>
                  </small>
                )}
                {formik.values.excludeNotify.length > 0 && (
                  <small className="d-block text-warning">
                    🚫 Excluding:{" "}
                    <strong>
                      {formik.values.excludeNotify
                        .map((val) => clientOptions.find((o) => o.value === val)?.label || val)
                        .join(", ")}
                    </strong>
                  </small>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};