

// import React, { useContext, useEffect, useRef, useState } from "react";

// import { CKEditor } from "@ckeditor/ckeditor5-react";
// import {
//   ClassicEditor,
//   AccessibilityHelp,
//   Autosave,
//   BalloonToolbar,
//   Bold,
//   Code,
//   Essentials,
//   FontBackgroundColor,
//   FontColor,
//   FontFamily,
//   FontSize,
//   Highlight,
//   Italic,
//   Paragraph,
//   RemoveFormat,
//   SelectAll,
//   SpecialCharacters,
//   Strikethrough,
//   Subscript,
//   Superscript,
//   Underline,
//   Undo,
//   Table,
//   TableToolbar,
//   TableCellProperties,
//   TableProperties,
// } from "ckeditor5";

// import { useFormik } from "formik";

// import "ckeditor5/ckeditor5.css";
// import { emailTemplateValidationSchema } from "../../../../schema/ValidationSchemas";
// import {
//   errorMessage,
//   successMessage,
// } from "../../../../api/api-config/apiResponseMessage";
// import {
//   fetchEmailAttribute,
//   fetchEmailTemplateById,
//   store,
//   update,
// } from "../../../../api/api-client/settings/emailApi";
// import { fetchCompany } from "../../../../api/api-client/settings/companyApi";
// import { SelectDropdown } from "../SelectDropdown";
// import { userContext } from "../../../context/UserContext";
// import {
//   getClientListFromLocal,
//   fetchEvents,
// } from "../../../../api/api-client/ticketApi";

// export const AddNewEmail = ({ id }) => {
//   const { user } = useContext(userContext);

//   const [editorContent, setEditorContent] = useState("");
//   const editorRef = useRef();
//   const [dropdownValue, setDropdownValue] = useState("");
//   const [options, setOptions] = useState([]);
//   const [isLoading, setIsLoading] = useState(false);

//   const [businessEntityOptions, setBusinessEntityOptions] = useState([]);
//   const [clientOptions, setClientOptions] = useState([]);
//   const [selectedBusinessEntityName, setSelectedBusinessEntityName] = useState(null);
//   const [selectedBusinessId, setSelectedBusinessId] = useState(null);
//   const [foundClientInfo, setFoundClientInfo] = useState(null);
//   const [isClientLoading, setIsClientLoading] = useState(false);

//   // ✅ New state for Events
//   const [eventOptions, setEventOptions] = useState([]);
//   const [isEventLoading, setIsEventLoading] = useState(false);

//   const editorConfig = {
//     toolbar: {
//       items: [
//         "undo",
//         "redo",
//         "|",
//         "fontSize",
//         "fontFamily",
//         "fontColor",
//         "fontBackgroundColor",
//         "|",
//         "bold",
//         "italic",
//         "underline",
//         "|",
//         "highlight",
//         "|",
//         "insertTable",
//         "tableColumn",
//         "tableRow",
//         "mergeTableCells",
//         "tableProperties",
//         "tableCellProperties",
//       ],
//     },
//     plugins: [
//       AccessibilityHelp,
//       Autosave,
//       BalloonToolbar,
//       Bold,
//       Code,
//       Essentials,
//       FontBackgroundColor,
//       FontColor,
//       FontFamily,
//       FontSize,
//       Highlight,
//       Italic,
//       Paragraph,
//       RemoveFormat,
//       SelectAll,
//       SpecialCharacters,
//       Strikethrough,
//       Subscript,
//       Superscript,
//       Underline,
//       Undo,
//       Table,
//       TableToolbar,
//       TableCellProperties,
//       TableProperties,
//     ],
//     fontFamily: {
//       supportAllValues: true,
//     },
//     fontSize: {
//       options: [10, 12, 14, "default", 18, 20, 22],
//       supportAllValues: true,
//     },
//     initialData: "",
//     placeholder: "Type or paste your content here!",
//   };

//   // ✅ Fetch Events on mount
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

//   // Fetch Business Entity options on mount
//   useEffect(() => {
//     fetchCompany({
//       userType: user?.type,
//       userId: user?.id,
//     })
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

//   // Fetch Client options when Business Entity changes
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

//   useEffect(() => {
//     setIsLoading(true);
//     fetchEmailAttribute()
//       .then((response) => {
//         setOptions(response.data);
//       })
//       .catch(errorMessage)
//       .finally(() => {
//         setIsLoading(false);
//       });
//   }, []);

//   const handleReady = (editor) => {
//     editorRef.current = editor;
//   };

//   const insertTextAtCursor = (text) => {
//     if (editorRef.current) {
//       const editor = editorRef.current;
//       const viewFragment = editor.data.processor.toView(text);
//       const modelFragment = editor.data.toModel(viewFragment);
//       editor.model.insertContent(
//         modelFragment,
//         editor.model.document.selection
//       );
//     }
//   };

//   const handleAssignVariableChange = (event) => {
//     const value = event.target.value;
//     setDropdownValue(value);
//     if (value) {
//       insertTextAtCursor(value);
//       setDropdownValue("");
//     }
//   };

//   useEffect(() => {
//     if (id) {
//       setIsLoading(true);
//       fetchEmailTemplateById(id)
//         .then((response) => {
//           formik.setValues({
//             name: response.data.template_name || "",
//             subject: response.data.subject || "",
//             status: response.data.status || "",
//             content: response.data.content || "",
//             businessEntity: response.data.business_entity_id || "",
//             client: response.data.client_id || "",
//             eventId: response.data.event_id || "", // ✅ load saved event
//           });
//           setEditorContent(response.data.content || "");
//         })
//         .catch(errorMessage)
//         .finally(() => setIsLoading(false));
//     }
//   }, [id]);

//   const formik = useFormik({
//     initialValues: {
//       name: "",
//       subject: "",
//       status: "Active",
//       content: "",
//       businessEntity: "",
//       client: "",
//       eventId: "", // ✅ new
//     },
//     validationSchema: emailTemplateValidationSchema,
//     onSubmit: (values, { resetForm }) => {
//       setIsLoading(true);
//       const apiCall = id ? update(id, values) : store(values);
//       apiCall
//         .then((response) => {
//           successMessage(response);
//           setEditorContent("");
//           if (editorRef.current) {
//             editorRef.current.setData("");
//           }
//           formik.setFieldValue("content", "");
//         })
//         .catch((error) => {
//           errorMessage(error);
//         })
//         .finally(() => {
//           setIsLoading(false);
//           resetForm();
//         });
//     },
//   });

//   return (
//     <div className='row'>
//       <div className='col-sm-12 col-md-12 col-lg-12 col-xl-12'>
//         <div className='alert alert-secondary p-2' role='alert'>
//           <h6>{id ? "Update " : "Create "} New Email Template</h6>
//           <span>
//             <i>Please input the required information.</i>
//           </span>
//         </div>
//       </div>

//       <div className='col-sm-12 col-md-6 col-lg-6 col-xl-6'>
//         <form onSubmit={formik.handleSubmit} className='row'>

//           {/* ✅ Events Dropdown — shown BEFORE Business Entity */}
//           <div className='col-sm-12 col-md-12 col-lg-12 col-xl-12'>
//             <div className='input-group mb-3'>
//               <span className='input-group-text w-25' id='basic-addon1'>
//                 Event
//               </span>
//               <SelectDropdown
//                 id='eventId'
//                 placeholder='Select Event'
//                 options={eventOptions}
//                 value={formik.values.eventId}
//                 onChange={(value) => {
//                   formik.setFieldValue("eventId", value);
//                 }}
//                 disabled={isEventLoading}
//               />
//             </div>
//           </div>

//           {/* Business Entity Dropdown */}
//           <div className='col-sm-12 col-md-12 col-lg-12 col-xl-12'>
//             <div className='input-group mb-3'>
//               <span className='input-group-text w-25' id='basic-addon1'>
//                 Business Entity
//               </span>
//               <SelectDropdown
//                 id='businessEntity'
//                 placeholder='Select Business Entity'
//                 options={businessEntityOptions}
//                 value={formik.values.businessEntity}
//                 onChange={(value) => {
//                   formik.setFieldValue("businessEntity", value);
//                   setSelectedBusinessId(value);
//                   const selected = businessEntityOptions.find((o) => o.value === value);
//                   setSelectedBusinessEntityName(selected?.label ?? null);
//                   formik.setFieldValue("client", "");
//                   setFoundClientInfo(null);
//                   setClientOptions([]);
//                 }}
//                 disabled={isLoading}
//               />
//             </div>
//           </div>

//           {/* Client Dropdown */}
//           <div className='col-sm-12 col-md-12 col-lg-12 col-xl-12'>
//             <div className='input-group mb-3'>
//               <span className='input-group-text w-25' id='basic-addon1'>
//                 Client
//               </span>
//               <SelectDropdown
//                 id='client'
//                 placeholder='Select Client'
//                 options={clientOptions}
//                 value={formik.values.client}
//                 onChange={(value) => {
//                   formik.setFieldValue("client", value);
//                   const selected = clientOptions.find((o) => o.value === value);
//                   setFoundClientInfo({ entity_name: selected?.label ?? null });
//                 }}
//                 disabled={isClientLoading || !selectedBusinessId}
//               />
//             </div>
//           </div>


//           {/* Template Name */}
//           <div className='col-sm-12 col-md-12 col-lg-12 col-xl-12'>
//             <div className='input-group mb-3'>
//               <span className='input-group-text w-25' id='basic-addon1'>
//                 Name
//               </span>
//               <input
//                 type='text'
//                 name='name'
//                 className='form-control'
//                 placeholder='Template Name'
//                 onChange={formik.handleChange}
//                 onBlur={formik.handleBlur}
//                 value={formik.values.name}
//               />
//             </div>
//             {formik.touched.name && formik.errors.name ? (
//               <div className='text-danger'>{formik.errors.name}</div>
//             ) : null}
//           </div>

//           {/* Subject */}
//           <div className='col-sm-12 col-md-12 col-lg-12 col-xl-12'>
//             <div className='input-group mb-3'>
//               <span className='input-group-text w-25' id='basic-addon1'>
//                 Subject
//               </span>
//               <input
//                 type='text'
//                 name='subject'
//                 className='form-control'
//                 placeholder='Subject'
//                 onChange={formik.handleChange}
//                 onBlur={formik.handleBlur}
//                 value={formik.values.subject}
//               />
//             </div>
//             {formik.touched.subject && formik.errors.subject ? (
//               <div className='text-danger'>{formik.errors.subject}</div>
//             ) : null}
//           </div>

//           {/* Attribute Selector */}
//           <div className='col-sm-12 col-md-6 col-lg-6 col-xl-6'>
//             <div className='mb-3'>
//               <select
//                 className='form-select'
//                 defaultValue={dropdownValue}
//                 onChange={handleAssignVariableChange}>
//                 <option value=''>Select attribute</option>
//                 {options &&
//                   options.map((attribute) => (
//                     <option
//                       key={attribute.id}
//                       value={attribute.attribute_value}>
//                       {attribute.name}
//                     </option>
//                   ))}
//               </select>
//             </div>
//           </div>

//           {/* Status Toggle */}
//           <div className='col-sm-12 col-md-6 col-lg-6 col-xl-6'>
//             <div className='mb-3 w-100 d-flex justify-content-end align-items-center'>

//               <div className='form-check me-3'>
//                  <input
//                    className='form-check-input'
//                     type='checkbox'
//                      id='client'
//                       onChange={formik.handleChange}
//                       onBlur={formik.handleBlur}
//                       checked={formik.values.client}
//                       />
//                             <label
//                               className='form-check-label'
//                               htmlFor='client'>
//                               Client
//                             </label>
//                           </div>           


//               <div className='form-check form-switch'>
//                 <input
//                   className='form-check-input'
//                   type='checkbox'
//                   value={formik.values.status}
//                   id='status'
//                   checked={formik.values.status === "Active"}
//                   onChange={(e) => {
//                     const newStatus = e.target.checked ? "Active" : "Inactive";
//                     formik.setFieldValue("status", newStatus);
//                   }}
//                 />
//                 <label className='form-check-label' htmlFor='status'>
//                   {formik.values.status === "Active" ? "Active" : "Inactive"}
//                 </label>
//               </div>
//             </div>
//           </div>

//           {/* CKEditor */}
//           <div className='col-sm-12 col-md-12 col-lg-12 col-xl-12'>
//             <div className='mb-3'>
//               <CKEditor
//                 editor={ClassicEditor}
//                 config={editorConfig}
//                 onReady={handleReady}
//                 data={formik.values.content}
//                 onChange={(event, editor) => {
//                   let data = editor.getData();
//                   formik.setFieldValue("content", data);
//                   setEditorContent(data);
//                 }}
//               />
//               {formik.touched.content && formik.errors.content ? (
//                 <div className='text-danger'>{formik.errors.content}</div>
//               ) : null}
//             </div>
//           </div>

//           <div className='text-end'>
//             <button type='submit' className='custom-btn'>
//               {isLoading
//                 ? id
//                   ? "Updating..."
//                   : "Saving..."
//                 : id
//                 ? "Update"
//                 : "Save"}
//             </button>
//           </div>
//         </form>
//       </div>

//       {/* Preview Panel */}
//       <div className='col-sm-12 col-md-6 col-lg-6 col-xl-6'>
//         <div
//           className='card w-100 p-0 border rounded'
//           style={{ minHeight: "412px", height: "auto" }}>
//           <h6 className='card-header text-center'>Template Preview</h6>
//           <div className='card-body bg-white'>
//             <div
//               dangerouslySetInnerHTML={{
//                 __html: editorContent
//                   .replace("{Ticket Title}", "Sample Ticket Title")
//                   .replace("{Ticket Number}", "12345")
//                   .replace("{Age}", "30")
//                   .replace("{Assigned By}", "Jane Doe")
//                   .replace("{First Response Time}", "1 hour")
//                   .replace("{Service Time}", "2 hours")
//                   .replace("{Agent Name}", "John Doe")
//                   .replace("{Comment}", "This is a sample comment.")
//                   .replace("{Client Name}", "Acme Corporation"),
//               }}
//             />
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };




import React, { useContext, useEffect, useRef, useState } from "react";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import {
  ClassicEditor,
  AccessibilityHelp,
  Autosave,
  BalloonToolbar,
  Bold,
  Code,
  Essentials,
  FontBackgroundColor,
  FontColor,
  FontFamily,
  FontSize,
  Highlight,
  Italic,
  Paragraph,
  RemoveFormat,
  SelectAll,
  SpecialCharacters,
  Strikethrough,
  Subscript,
  Superscript,
  Underline,
  Undo,
  Table,
  TableToolbar,
  TableCellProperties,
  TableProperties,
} from "ckeditor5";

import { useFormik } from "formik";

import "ckeditor5/ckeditor5.css";
import { emailTemplateValidationSchema } from "../../../../schema/ValidationSchemas";
import {
  errorMessage,
  successMessage,
} from "../../../../api/api-config/apiResponseMessage";
import {
  fetchEmailAttribute,
  fetchEmailTemplateById,
  store,
  update,
} from "../../../../api/api-client/settings/emailApi";
import { fetchCompany } from "../../../../api/api-client/settings/companyApi";
import { SelectDropdown } from "../SelectDropdown";
import { userContext } from "../../../context/UserContext";
import {
  getClientListFromLocal,
  fetchEvents,
} from "../../../../api/api-client/ticketApi";

export const AddNewEmail = ({ id }) => {
  const { user } = useContext(userContext);

  const [editorContent, setEditorContent] = useState("");
  const editorRef = useRef();
  const [dropdownValue, setDropdownValue] = useState("");
  const [options, setOptions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const [businessEntityOptions, setBusinessEntityOptions] = useState([]);
  const [clientOptions, setClientOptions] = useState([]);
  const [selectedBusinessEntityName, setSelectedBusinessEntityName] = useState(null);
  const [selectedBusinessId, setSelectedBusinessId] = useState(null);
  const [foundClientInfo, setFoundClientInfo] = useState(null);
  const [isClientLoading, setIsClientLoading] = useState(false);

  const [eventOptions, setEventOptions] = useState([]);
  const [isEventLoading, setIsEventLoading] = useState(false);

  const editorConfig = {
    toolbar: {
      items: [
        "undo",
        "redo",
        "|",
        "fontSize",
        "fontFamily",
        "fontColor",
        "fontBackgroundColor",
        "|",
        "bold",
        "italic",
        "underline",
        "|",
        "highlight",
        "|",
        "insertTable",
        "tableColumn",
        "tableRow",
        "mergeTableCells",
        "tableProperties",
        "tableCellProperties",
      ],
    },
    plugins: [
      AccessibilityHelp,
      Autosave,
      BalloonToolbar,
      Bold,
      Code,
      Essentials,
      FontBackgroundColor,
      FontColor,
      FontFamily,
      FontSize,
      Highlight,
      Italic,
      Paragraph,
      RemoveFormat,
      SelectAll,
      SpecialCharacters,
      Strikethrough,
      Subscript,
      Superscript,
      Underline,
      Undo,
      Table,
      TableToolbar,
      TableCellProperties,
      TableProperties,
    ],
    fontFamily: {
      supportAllValues: true,
    },
    fontSize: {
      options: [10, 12, 14, "default", 18, 20, 22],
      supportAllValues: true,
    },
    initialData: "",
    placeholder: "Type or paste your content here!",
  };

  // Fetch Events on mount
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

  // Fetch Business Entity options on mount
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
      .catch(errorMessage);
  }, []);

  // Fetch Client options when Business Entity changes
  useEffect(() => {
    if (selectedBusinessId != null) {
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

  useEffect(() => {
    setIsLoading(true);
    fetchEmailAttribute()
      .then((response) => {
        setOptions(response.data);
      })
      .catch(errorMessage)
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  const handleReady = (editor) => {
    editorRef.current = editor;
  };

  const insertTextAtCursor = (text) => {
    if (editorRef.current) {
      const editor = editorRef.current;
      const viewFragment = editor.data.processor.toView(text);
      const modelFragment = editor.data.toModel(viewFragment);
      editor.model.insertContent(
        modelFragment,
        editor.model.document.selection
      );
    }
  };

  const handleAssignVariableChange = (event) => {
    const value = event.target.value;
    setDropdownValue(value);
    if (value) {
      insertTextAtCursor(value);
      setDropdownValue("");
    }
  };

  useEffect(() => {
    if (id) {
      setIsLoading(true);
      fetchEmailTemplateById(id)
        .then((response) => {
          formik.setValues({
            name: response.data.template_name || "",
            subject: response.data.subject || "",
            status: response.data.status || "",
            content: response.data.content || "",
            businessEntity: response.data.business_entity_id || "",
            client: response.data.client_id || "",
            eventId: response.data.event_id || "",
            notifyClient: response.data.notify_client === 1, // ✅ load as boolean
          });
          setEditorContent(response.data.content || "");
        })
        .catch(errorMessage)
        .finally(() => setIsLoading(false));
    }
  }, [id]);

  const formik = useFormik({
    initialValues: {
      name: "",
      subject: "",
      status: "Active",
      content: "",
      businessEntity: "",
      client: "",
      eventId: "",
      notifyClient: false, // ✅ boolean, unchecked by default
    },
    validationSchema: emailTemplateValidationSchema,
    onSubmit: (values, { resetForm }) => {
      setIsLoading(true);

      // ✅ Convert boolean to 1 / 0 for backend
      const payload = {
        ...values,
        notifyClient: values.notifyClient ? 1 : 0,
      };

      const apiCall = id ? update(id, payload) : store(payload);
      apiCall
        .then((response) => {
          successMessage(response);
          setEditorContent("");
          if (editorRef.current) {
            editorRef.current.setData("");
          }
          formik.setFieldValue("content", "");
        })
        .catch((error) => {
          errorMessage(error);
        })
        .finally(() => {
          setIsLoading(false);
          resetForm();
        });
    },
  });

  return (
    <div className='row'>
      <div className='col-sm-12 col-md-12 col-lg-12 col-xl-12'>
        <div className='alert alert-secondary p-2' role='alert'>
          <h6>{id ? "Update " : "Create "} New Email Template</h6>
          <span>
            <i>Please input the required information.</i>
          </span>
        </div>
      </div>

      <div className='col-sm-12 col-md-6 col-lg-6 col-xl-6'>
        <form onSubmit={formik.handleSubmit} className='row'>

          {/* Events Dropdown */}
          <div className='col-sm-12 col-md-12 col-lg-12 col-xl-12'>
            <div className='input-group mb-3'>
              <span className='input-group-text w-25' id='basic-addon1'>
                Event
              </span>
              <SelectDropdown
                id='eventId'
                placeholder='Select Event'
                options={eventOptions}
                value={formik.values.eventId}
                onChange={(value) => {
                  formik.setFieldValue("eventId", value);
                }}
                disabled={isEventLoading}
              />
            </div>
          </div>

          {/* Business Entity Dropdown */}
          <div className='col-sm-12 col-md-12 col-lg-12 col-xl-12'>
            <div className='input-group mb-3'>
              <span className='input-group-text w-25' id='basic-addon1'>
                Business Entity
              </span>
              <SelectDropdown
                id='businessEntity'
                placeholder='Select Business Entity'
                options={businessEntityOptions}
                value={formik.values.businessEntity}
                onChange={(value) => {
                  formik.setFieldValue("businessEntity", value);
                  setSelectedBusinessId(value);
                  const selected = businessEntityOptions.find((o) => o.value === value);
                  setSelectedBusinessEntityName(selected?.label ?? null);
                  formik.setFieldValue("client", "");
                  setFoundClientInfo(null);
                  setClientOptions([]);
                }}
                disabled={isLoading}
              />
            </div>
          </div>

          {/* Client Dropdown */}
          <div className='col-sm-12 col-md-12 col-lg-12 col-xl-12'>
            <div className='input-group mb-3'>
              <span className='input-group-text w-25' id='basic-addon1'>
                Client
              </span>
              <SelectDropdown
                id='client'
                placeholder='Select Client'
                options={clientOptions}
                value={formik.values.client}
                onChange={(value) => {
                  formik.setFieldValue("client", value);
                  const selected = clientOptions.find((o) => o.value === value);
                  setFoundClientInfo({ entity_name: selected?.label ?? null });
                }}
                disabled={isClientLoading || !selectedBusinessId}
              />
            </div>
          </div>

          {/* Template Name */}
          <div className='col-sm-12 col-md-12 col-lg-12 col-xl-12'>
            <div className='input-group mb-3'>
              <span className='input-group-text w-25' id='basic-addon1'>
                Name
              </span>
              <input
                type='text'
                name='name'
                className='form-control'
                placeholder='Template Name'
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.name}
              />
            </div>
            {formik.touched.name && formik.errors.name ? (
              <div className='text-danger'>{formik.errors.name}</div>
            ) : null}
          </div>

          {/* Subject */}
          <div className='col-sm-12 col-md-12 col-lg-12 col-xl-12'>
            <div className='input-group mb-3'>
              <span className='input-group-text w-25' id='basic-addon1'>
                Subject
              </span>
              <input
                type='text'
                name='subject'
                className='form-control'
                placeholder='Subject'
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.subject}
              />
            </div>
            {formik.touched.subject && formik.errors.subject ? (
              <div className='text-danger'>{formik.errors.subject}</div>
            ) : null}
          </div>

          {/* Attribute Selector */}
          <div className='col-sm-12 col-md-6 col-lg-6 col-xl-6'>
            <div className='mb-3'>
              <select
                className='form-select'
                defaultValue={dropdownValue}
                onChange={handleAssignVariableChange}>
                <option value=''>Select attribute</option>
                {options &&
                  options.map((attribute) => (
                    <option
                      key={attribute.id}
                      value={attribute.attribute_value}>
                      {attribute.name}
                    </option>
                  ))}
              </select>
            </div>
          </div>

          {/* Notify Client Checkbox + Status Toggle */}
          <div className='col-sm-12 col-md-6 col-lg-6 col-xl-6'>
            <div className='mb-3 w-100 d-flex justify-content-end align-items-center gap-3'>

              {/* ✅ Fixed Notify Client checkbox — uses notifyClient (boolean) */}
              <div className='form-check'>
                <input
                  className='form-check-input'
                  type='checkbox'
                  id='notifyClient'
                  name='notifyClient'
                  checked={formik.values.notifyClient}   // ✅ controlled by boolean
                  onChange={(e) => {
                    formik.setFieldValue("notifyClient", e.target.checked); // ✅ toggles correctly
                  }}
                />
                <label className='form-check-label' htmlFor='notifyClient'>
                  Notify Client
                </label>
              </div>

              {/* Status Toggle */}
              <div className='form-check form-switch'>
                <input
                  className='form-check-input'
                  type='checkbox'
                  id='status'
                  checked={formik.values.status === "Active"}
                  onChange={(e) => {
                    const newStatus = e.target.checked ? "Active" : "Inactive";
                    formik.setFieldValue("status", newStatus);
                  }}
                />
                <label className='form-check-label' htmlFor='status'>
                  {formik.values.status === "Active" ? "Active" : "Inactive"}
                </label>
              </div>

            </div>
          </div>

          {/* CKEditor */}
          <div className='col-sm-12 col-md-12 col-lg-12 col-xl-12'>
            <div className='mb-3'>
              <CKEditor
                editor={ClassicEditor}
                config={editorConfig}
                onReady={handleReady}
                data={formik.values.content}
                onChange={(event, editor) => {
                  let data = editor.getData();
                  formik.setFieldValue("content", data);
                  setEditorContent(data);
                }}
              />
              {formik.touched.content && formik.errors.content ? (
                <div className='text-danger'>{formik.errors.content}</div>
              ) : null}
            </div>
          </div>

          <div className='text-end'>
            <button type='submit' className='custom-btn'>
              {isLoading
                ? id
                  ? "Updating..."
                  : "Saving..."
                : id
                ? "Update"
                : "Save"}
            </button>
          </div>
        </form>
      </div>

      {/* Preview Panel */}
      <div className='col-sm-12 col-md-6 col-lg-6 col-xl-6'>
        <div
          className='card w-100 p-0 border rounded'
          style={{ minHeight: "412px", height: "auto" }}>
          <h6 className='card-header text-center'>Template Preview</h6>
          <div className='card-body bg-white'>
            <div
              dangerouslySetInnerHTML={{
                __html: editorContent
                  .replace("{Ticket Title}", "Sample Ticket Title")
                  .replace("{Ticket Number}", "12345")
                  .replace("{Age}", "30")
                  .replace("{Assigned By}", "Jane Doe")
                  .replace("{First Response Time}", "1 hour")
                  .replace("{Service Time}", "2 hours")
                  .replace("{Agent Name}", "John Doe")
                  .replace("{Comment}", "This is a sample comment.")
                  .replace("{Client Name}", "Acme Corporation"),
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};