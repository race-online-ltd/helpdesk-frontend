import React, { useState, useEffect, useContext } from "react";
import Select from "react-select";
import { FormikConsumer, useFormik } from "formik";
import * as Yup from "yup";
import { plusIcon } from "../../../../data/data";
import { fetchCompany } from "../../../../api/api-client/settings/companyApi";
import { fetchSubCategory } from "../../../../api/api-client/settings/subCategoryApi";
import { fetchAllTeam } from "../../../../api/api-client/settings/teamApi";
import {
  errorMessage,
  successMessage,
} from "../../../../api/api-config/apiResponseMessage";
import {
  fetchSLAById,
  fetchSubcategoryByBusinessEntity,
  fetchSubcategoryByTeamNew,
  store,
  update,
} from "../../../../api/api-client/settings/slaApi";
import { createSlaValidationSchema } from "../../../../schema/ValidationSchemas";
import { fetchEmailTemplate } from "../../../../api/api-client/settings/emailApi";
import { fetchAgentOptions } from "../../../../api/api-client/settings/agentApi";
import { userContext } from "../../../context/UserContext";

export const AddRemainingSLA = ({ id }) => {
  const { user } = useContext(userContext);
  const [indivisual, setIndivisual] = useState(true);
  const [isDisabled, setIsDisabled] = useState(true);
  const [slaTypeCheck, setSLATypeCheck] = useState("");
  const [companyOptions, setCompanyOptions] = useState([]);
  const [subCategoryOptions, setSubCategoryOptions] = useState([]);
  const [subCategoryListByTeam, setSubCategoryListByTeam] = useState([]);
  const [teamOptions, setTeamOptions] = useState([]);
  const [emailTemplateOptions, setEmailTemplateOptions] = useState([]);
  const [agentOptions, setAgentOptions] = useState([]);
  const [businessEntityId, setBusinessEntityId] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const slaTypeOptions = [
    { value: "Sub-Category", label: "Sub-Category" },
    { value: "Client", label: "Client" },
  ];

  const clientOptions = [
    { value: 1, label: "Client-A" },
    { value: 2, label: "Client-B" },
    { value: 3, label: "Client-C" },
    { value: 4, label: "Client-D" },
    { value: 5, label: "Client-E" },
    { value: 6, label: "Client-F" },
    { value: 7, label: "Client-G" },
  ];

  const escalateData = [
    { value: "Immediately", label: "Immediately" },
    { value: "After 5 minutes", label: "After 5 Minutes" },
    { value: "After 10 minutes", label: "After 10 Minutes" },
    { value: "After 15 minutes", label: "After 15 Minutes" },
    { value: "After 30 minutes", label: "After 30 Minutes" },
    { value: "After 1 hour", label: "After 1 hour" },
    { value: "After 3 hour", label: "After 3 hour" },
    { value: "After 5 hour", label: "After 5 hour" },
  ];

  useEffect(() => {
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

    const fetchSubCategoryOptions = () =>
      fetchSubCategory().then((response) => {
        setSubCategoryOptions(
          response.data.map((option) => ({
            value: option.id,
            label: option.category_in_english,
          }))
        );
      });

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
    const fetchTemplateOptions = () =>
      fetchEmailTemplate().then((response) =>
        setEmailTemplateOptions(
          response.data.map((option) => ({
            value: option.id,
            label: option.template_name,
          }))
        )
      );

    const fetchAgentList = () =>
      fetchAgentOptions().then((response) =>
        setAgentOptions(
          response.data.map((option) => ({
            value: option.id,
            label: option.fullname,
          }))
        )
      );
    Promise.all([
      fetchCompanyOptions(),
      fetchSubCategoryOptions(),
      fetchTeamOptions(),
      fetchTemplateOptions(),
      fetchAgentList(),
    ])
      .catch(errorMessage)
      .finally(() => setIsLoading(false));
  }, []);

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

  const addLevel = () => {
    const newId = formik.values.escalationLevels.length + 1;
    const newLevel = {
      id: newId,
      timeframe: null,
      agents: [],
      sendmail: false,
      emailTemplate: null,
    };
    formik.setFieldValue("escalationLevels", [
      ...formik.values.escalationLevels,
      newLevel,
    ]);
  };

  const addLevelServiceTime = () => {
    const newId = formik.values.escalationServiceLevels.length + 1;
    const newLevel = {
      id: newId,
      timeframe: null,
      agents: [],
      sendmail: false,
      emailTemplate: null,
    };
    formik.setFieldValue("escalationServiceLevels", [
      ...formik.values.escalationServiceLevels,
      newLevel,
    ]);
  };
  const deleteLevel = (index) => {
    const updatedLevels = formik.values.escalationLevels.filter(
      (_, i) => i !== index
    );
    formik.setFieldValue("escalationLevels", updatedLevels);
  };

  const deleteServiceTimeLevel = (index) => {
    const updatedLevels = formik.values.escalationServiceLevels.filter(
      (_, i) => i !== index
    );
    formik.setFieldValue("escalationServiceLevels", updatedLevels);
  };

  const handleFetchSubcategoriesByTeam = (teamId) => {
    setIsLoading(true);
    fetchSubcategoryByTeamNew(teamId, businessEntityId)
      .then((response) => {
        setSubCategoryListByTeam(response.data);
      })
      .catch(errorMessage)
      .finally(() => setIsLoading(false));
  };

  // const handleFetchSubcategoriesByTeam = (teamId) => {
  //     setIsLoading(true);
  //     fetchSubcategoryByTeamNew(teamId, businessEntityId)
  //       .then((response) => {
  //         setSubCategoryListByTeam(response.data);
  //       })
  //       .catch(errorMessage)
  //       .finally(() => setIsLoading(false));
  //   };

  const handleFetchSubcategoryByBusinessEntity = (entityId) => {
    if (entityId != null) {
      setIsLoading(true);
      fetchSubcategoryByBusinessEntity(entityId)
        .then((response) => {
          setSubCategoryListByTeam(response.data);
        })
        .catch(errorMessage)
        .finally(() => setIsLoading(false));
    }
  };

  const validationSchema = Yup.object({
    slaName: Yup.string().required("SLA Name is required"),
    businessEntity: Yup.string().required("Business Entity is required"),
    slaType: Yup.string().required("SLA Type is required"),
    slaForClient: Yup.string().required("SLA For Client is required"),
    slaForTeam: Yup.string().required("SLA For Team is required"),

    firstResponseTimeDay: Yup.number()
      .required("First Response Time (Day) is required")
      .integer("Must be an integer")
      .min(0, "Must be greater than or equal to 0")
      .max(31, "Must be less than or equal to 31"),
    firstResponseTimeHrs: Yup.number()
      .required("First Response Time (Hours) is required")
      .integer("Must be an integer")
      .min(0, "Must be greater than or equal to 0")
      .max(23, "Must be less than or equal to 23"),
    firstResponseTimeMins: Yup.number()
      .required("First Response Time (Minutes) is required")
      .integer("Must be an integer")
      .min(0, "Must be greater than or equal to 0")
      .max(59, "Must be less than or equal to 59"),
    serviceTimeDay: Yup.number()
      .required("Service Time (Day) is required")
      .integer("Must be an integer")
      .min(0, "Must be greater than or equal to 0")
      .max(31, "Must be less than or equal to 31"),
    serviceTimeHrs: Yup.number()
      .required("Service Time (Hours) is required")
      .integer("Must be an integer")
      .min(0, "Must be greater than or equal to 0")
      .max(23, "Must be less than or equal to 23"),
    serviceTimeMins: Yup.number()
      .required("Service Time (Minutes) is required")
      .integer("Must be an integer")
      .min(0, "Must be greater than or equal to 0")
      .max(59, "Must be less than or equal to 59"),
    escalationLevels: Yup.array().of(
      Yup.object().shape({
        id: Yup.number().required(),
        timeframe: Yup.number().nullable(),
        agents: Yup.array().required("At least one agent is required"),
        sendmail: Yup.boolean(),
        emailTemplate: Yup.string().nullable(),
      })
    ),
    escalationServiceLevels: Yup.array().of(
      Yup.object().shape({
        id: Yup.number().required(),
        timeframe: Yup.number().nullable(),
        agents: Yup.array().required("At least one agent is required"),
        sendmail: Yup.boolean(),
        emailTemplate: Yup.string().nullable(),
      })
    ),
  });
  const updateSLAvalidationSchema = Yup.object({
    defaultFirstResponseTimeDay: Yup.number()
      .required("First Response Time (Day) is required")
      .integer("Must be an integer")
      .min(0, "Must be greater than or equal to 0")
      .max(31, "Must be less than or equal to 31"),
    defaultFirstResponseTimeHrs: Yup.number()
      .required("First Response Time (Hours) is required")
      .integer("Must be an integer")
      .min(0, "Must be greater than or equal to 0")
      .max(23, "Must be less than or equal to 23"),
    defaultFirstResponseTimeMins: Yup.number()
      .required("First Response Time (Minutes) is required")
      .integer("Must be an integer")
      .min(0, "Must be greater than or equal to 0")
      .max(59, "Must be less than or equal to 59"),
    defaultServiceTimeDay: Yup.number()
      .required("Service Time (Day) is required")
      .integer("Must be an integer")
      .min(0, "Must be greater than or equal to 0")
      .max(31, "Must be less than or equal to 31"),
    defaultServiceTimeHrs: Yup.number()
      .required("Service Time (Hours) is required")
      .integer("Must be an integer")
      .min(0, "Must be greater than or equal to 0")
      .max(23, "Must be less than or equal to 23"),
    defaultServiceTimeMins: Yup.number()
      .required("Service Time (Minutes) is required")
      .integer("Must be an integer")
      .min(0, "Must be greater than or equal to 0")
      .max(59, "Must be less than or equal to 59"),

    defaultStatus: Yup.number().required(),
    defaultEscalate: Yup.number().required(),
  });

  const formik = useFormik({
    initialValues: {
      slaName: "",
      businessEntity: "",
      slaType: "",
      slaForClient: "",
      slaForTeam: "",
      indivisual: 0,
      defaultFirstResponseTimeDay: "",
      defaultFirstResponseTimeHrs: "",
      defaultFirstResponseTimeMins: "",
      defaultServiceTimeDay: "",
      defaultServiceTimeHrs: "",
      defaultServiceTimeMins: "",
      defaultStatus: 1,
      defaultEscalate: 1,
      subcategories: [],
      escalationLevels: [
        {
          id: 1,
          timeframe: null,
          agents: [],
          sendmail: false,
          emailTemplate: null,
        },
      ],

      escalationServiceLevels: [
        {
          id: 1,
          timeframe: null,
          agents: [],
          sendmail: false,
          emailTemplate: null,
        },
      ],
    },
    // validationSchema: validationSchema,
    onSubmit: (values, { resetForm, setFieldValue, setValues }) => {
      setIsLoading(true);
      const apiCall = id ? update(id, valuesToSubmit) : store(values);
      apiCall
        .then((response) => {
          successMessage(response);
          resetForm();
          setSubCategoryListByTeam("");
          // setFieldValue("subcategories", []);
          setFieldValue("escalationLevels", []);
          setFieldValue("escalationServiceLevels", []);
        })
        .catch(errorMessage)
        .finally(() => {
          setIsLoading(false);
        });
    },
  });

  useEffect(() => {
    if (subCategoryListByTeam.length > 0) {
      formik.setFieldValue(
        "subcategories",
        subCategoryListByTeam.map((item) => ({
          id: item.id || "",
          firstResponseTimeDay: Number(item.firstResponseTimeDay) || 0,
          firstResponseTimeHrs: Number(item.firstResponseTimeHrs) || 0,
          firstResponseTimeMins: Number(item.firstResponseTimeMins) || 0,
          serviceTimeDay: Number(item.serviceTimeDay) || 0,
          serviceTimeHrs: Number(item.serviceTimeHrs) || 0,
          serviceTimeMins: Number(item.serviceTimeMins) || 0,
          status: item.status !== undefined ? item.status : 1,
          escalateStatus:
            item.escalateStatus !== undefined ? item.escalateStatus : 1,
        }))
      );
    }
  }, [subCategoryListByTeam]);

//   useEffect(() => {
//     if (id) {
//       setIsLoading(true);
//       fetchSLAById(id)
//         .then((response) => {
//           updateFormik.setValues({
//             defaultFirstResponseTimeDay: response.data.fr_res_day ?? 0,
//             defaultFirstResponseTimeHrs: response.data.fr_res_hr ?? 0,
//             defaultFirstResponseTimeMins: response.data.fr_res_min ?? 0,
//             defaultServiceTimeDay: response.data.srv_day ?? 0,
//             defaultServiceTimeHrs: response.data.srv_hr ?? 0,
//             defaultServiceTimeMins: response.data.srv_min ?? 0,
//             defaultStatus: response.data.status ?? 0,
//             defaultEscalate: response.data.esc_status ?? 0,
//           });
//         })
//         .catch(errorMessage)
//         .finally(() => {
//           setIsLoading(false);
//         });
//     }
//   }, [id]);

  // Update
//   const updateFormik = useFormik({
//     initialValues: {
//       defaultFirstResponseTimeDay: "",
//       defaultFirstResponseTimeHrs: "",
//       defaultFirstResponseTimeMins: "",
//       defaultServiceTimeDay: "",
//       defaultServiceTimeHrs: "",
//       defaultServiceTimeMins: "",
//       defaultStatus: "",
//       defaultEscalate: "",
//     },
//     validationSchema: updateSLAvalidationSchema,
//     onSubmit: (values, { resetForm }) => {
//       setIsLoading(true);
//       update(id, values)
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

  // console.log(updateFormik.errors);
  // console.log(updateFormik.values);

//   if (id) {
//     return (
//       <div className='row'>
//         <div className='col-sm-12 col-md-12 col-lg-12 col-xl-12'>
//           <div className='alert alert-secondary p-2' role='alert'>
//             <h6>Update New SLA Policy</h6>
//             <span>
//               <i>Please input the required information.</i>
//             </span>
//           </div>
//         </div>
//         <form className='row' onSubmit={updateFormik.handleSubmit}>
//           <div className='col'>
//             <div className='d-flex justify-content-center day-hrs-mins'>
//               First Response
//               <input
//                 type='text'
//                 className={`ms-2 form-control ${
//                   updateFormik.touched.defaultFirstResponseTimeDay &&
//                   updateFormik.errors.defaultFirstResponseTimeDay
//                     ? "is-invalid"
//                     : ""
//                 }`}
//                 placeholder='Day'
//                 id='defaultFirstResponseTimeDay'
//                 onChange={updateFormik.handleChange}
//                 onBlur={updateFormik.handleBlur}
//                 value={updateFormik.values.defaultFirstResponseTimeDay}
//                 style={{ width: "70px" }}
//               />
//               <input
//                 type='text'
//                 className={`form-control ${
//                   updateFormik.touched.defaultFirstResponseTimeHrs &&
//                   updateFormik.errors.defaultFirstResponseTimeHrs
//                     ? "is-invalid"
//                     : ""
//                 }`}
//                 placeholder='Hrs'
//                 id='defaultFirstResponseTimeHrs'
//                 onChange={updateFormik.handleChange}
//                 onBlur={updateFormik.handleBlur}
//                 value={updateFormik.values.defaultFirstResponseTimeHrs}
//                 style={{ width: "70px" }}
//               />
//               <input
//                 type='text'
//                 className={`form-control ${
//                   updateFormik.touched.defaultFirstResponseTimeMins &&
//                   updateFormik.errors.defaultFirstResponseTimeMins
//                     ? "is-invalid"
//                     : ""
//                 }`}
//                 placeholder='Mins'
//                 id='defaultFirstResponseTimeMins'
//                 onChange={updateFormik.handleChange}
//                 onBlur={updateFormik.handleBlur}
//                 value={updateFormik.values.defaultFirstResponseTimeMins}
//                 style={{ width: "70px" }}
//               />
//             </div>
//             {updateFormik.touched.defaultFirstResponseTimeDay &&
//             updateFormik.errors.defaultFirstResponseTimeDay ? (
//               <div className='invalid-feedback'>
//                 {updateFormik.errors.defaultFirstResponseTimeDay}
//               </div>
//             ) : null}
//             {updateFormik.touched.defaultFirstResponseTimeHrs &&
//             updateFormik.errors.defaultFirstResponseTimeHrs ? (
//               <div className='invalid-feedback'>
//                 {updateFormik.errors.defaultFirstResponseTimeHrs}
//               </div>
//             ) : null}
//             {updateFormik.touched.defaultFirstResponseTimeMins &&
//             updateFormik.errors.defaultFirstResponseTimeMins ? (
//               <div className='invalid-feedback'>
//                 {updateFormik.errors.defaultFirstResponseTimeMins}
//               </div>
//             ) : null}
//           </div>
//           <div className='col'>
//             <div className='d-flex justify-content-center day-hrs-mins'>
//               Service Time
//               <input
//                 type='text'
//                 className={`ms-2 form-control ${
//                   updateFormik.touched.defaultServiceTimeDay &&
//                   updateFormik.errors.defaultServiceTimeDay
//                     ? "is-invalid"
//                     : ""
//                 }`}
//                 placeholder='Day'
//                 id='defaultServiceTimeDay'
//                 onChange={updateFormik.handleChange}
//                 onBlur={updateFormik.handleBlur}
//                 value={updateFormik.values.defaultServiceTimeDay}
//                 style={{ width: "70px" }}
//               />
//               <input
//                 type='text'
//                 className={`form-control ${
//                   updateFormik.touched.defaultServiceTimeHrs &&
//                   updateFormik.errors.defaultServiceTimeHrs
//                     ? "is-invalid"
//                     : ""
//                 }`}
//                 placeholder='Hrs'
//                 id='defaultServiceTimeHrs'
//                 onChange={updateFormik.handleChange}
//                 onBlur={updateFormik.handleBlur}
//                 value={updateFormik.values.defaultServiceTimeHrs}
//                 style={{ width: "70px" }}
//               />
//               <input
//                 type='text'
//                 className={`form-control ${
//                   updateFormik.touched.defaultServiceTimeMins &&
//                   updateFormik.errors.defaultServiceTimeMins
//                     ? "is-invalid"
//                     : ""
//                 }`}
//                 placeholder='Mins'
//                 id='defaultServiceTimeMins'
//                 onChange={updateFormik.handleChange}
//                 onBlur={updateFormik.handleBlur}
//                 value={updateFormik.values.defaultServiceTimeMins}
//                 style={{ width: "70px" }}
//               />
//             </div>
//             {updateFormik.touched.defaultServiceTimeDay &&
//             updateFormik.errors.defaultServiceTimeDay ? (
//               <div className='invalid-feedback'>
//                 {updateFormik.errors.defaultServiceTimeDay}
//               </div>
//             ) : null}
//             {updateFormik.touched.defaultServiceTimeHrs &&
//             updateFormik.errors.defaultServiceTimeHrs ? (
//               <div className='invalid-feedback'>
//                 {updateFormik.errors.defaultServiceTimeHrs}
//               </div>
//             ) : null}
//             {updateFormik.touched.defaultServiceTimeMins &&
//             updateFormik.errors.defaultServiceTimeMins ? (
//               <div className='invalid-feedback'>
//                 {updateFormik.errors.defaultServiceTimeMins}
//               </div>
//             ) : null}
//           </div>
//           <div className='col-md-1'>
//             <div className='form-check form-switch d-flex justify-content-center'>
//               <input
//                 className='form-check-input text-center'
//                 id='defaultStatus'
//                 type='checkbox'
//                 role='switch'
//                 checked={updateFormik.values.defaultStatus}
//                 onChange={(e) =>
//                   updateFormik.setFieldValue(
//                     "defaultStatus",
//                     e.target.checked ? 1 : 0
//                   )
//                 }
//               />
//               <span className='ms-1'>
//                 Status
//                 {updateFormik.touched.defaultStatus &&
//                 updateFormik.errors.defaultStatus ? (
//                   <span className='text-danger'>*</span>
//                 ) : null}
//               </span>
//             </div>
//           </div>
//           <div className='col-md-1'>
//             <div className='form-check form-switch d-flex justify-content-center'>
//               <input
//                 className='form-check-input text-center'
//                 type='checkbox'
//                 role='switch'
//                 id='defaultEscalate'
//                 checked={updateFormik.values.defaultEscalate}
//                 onChange={(e) =>
//                   updateFormik.setFieldValue(
//                     "defaultEscalate",
//                     e.target.checked ? 1 : 0
//                   )
//                 }
//               />
//               <span className='ms-1'>
//                 Escalate
//                 {updateFormik.touched.defaultEscalate &&
//                 updateFormik.errors.defaultEscalate ? (
//                   <span className='text-danger'>*</span>
//                 ) : null}
//               </span>
//             </div>
//           </div>
//           <div className='col-md-1'>
//             <button className='custom-btn' type='submit'>
//               Update
//             </button>
//           </div>
//         </form>
//       </div>
//     );
//   }

  return (
    <div className='row'>
      <div className='col-sm-12 col-md-12 col-lg-12 col-xl-12'>
        <div className='alert alert-secondary p-2' role='alert'>
          <h6>Create New SLA Policy</h6>
          <span>
            <i>Please input the required information.</i>
          </span>
        </div>
      </div>
      <form onSubmit={formik.handleSubmit}>
        <div className='row mb-4'>
          <div className='col-sm-12 col-md-5 col-lg-5 col-xl-5'>
            <div className='row'>
              <div className='col-sm-12 col-md-12 col-lg-12 col-xl-12'>
                <div className='input-group mb-3'>
                  <span className='input-group-text w-25' id='basic-addon1'>
                    SLA Name
                  </span>
                  <input
                    type='text'
                    className='form-control'
                    placeholder='Enter name'
                    id='slaName'
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.slaName}
                  />
                  {formik.touched.slaName && formik.errors.slaName ? (
                    <div className='invalid-feedback'>
                      {formik.errors.slaName}
                    </div>
                  ) : null}
                </div>
              </div>
              <div className='col-sm-12 col-md-12 col-lg-12 col-xl-12'>
                <div className='input-group mb-3'>
                  <span className='input-group-text w-25' id='basic-addon1'>
                    Business Entity
                  </span>
                  <Select
                    options={companyOptions}
                    placeholder={"Business entity"}
                    className='form-control'
                    styles={customStyles}
                    id='businessEntity'
                    onChange={(option) => {
                      formik.setFieldValue("businessEntity", option);
                      setBusinessEntityId(option.value);
                    }}
                    onBlur={formik.handleBlur}
                    value={formik.values.businessEntity}
                  />
                </div>
              </div>
              <div className='col-sm-12 col-md-12 col-lg-12 col-xl-12'>
                <div className='input-group mb-3'>
                  <span className='input-group-text w-25' id='basic-addon1'>
                    SLA Type
                  </span>
                  <Select
                    options={slaTypeOptions}
                    placeholder={"SLA type"}
                    className='form-control'
                    styles={customStyles}
                    id='slaType'
                    onChange={(option) => {
                      formik.setFieldValue("slaType", option);
                      setSLATypeCheck(option.value);
                    }}
                    onBlur={formik.handleBlur}
                    value={formik.values.slaType}
                  />
                </div>
              </div>

              <div className='col-sm-12 col-md-12 col-lg-12 col-xl-12'>
                {slaTypeCheck === "Client" && (
                  <div className='input-group mb-3'>
                    <span className='input-group-text w-25' id='basic-addon1'>
                      Client
                    </span>
                    <Select
                      options={clientOptions}
                      placeholder={"Select client"}
                      className='form-control p-0'
                      styles={customStyles}
                      id='slaForClient'
                      name='slaForClient'
                      onChange={(option) => {
                        formik.setFieldValue("slaForClient", option);
                        handleFetchSubcategoryByBusinessEntity(
                          businessEntityId
                        );
                      }}
                      onBlur={formik.handleBlur}
                      value={formik.values.slaForClient}
                    />
                  </div>
                )}

                {slaTypeCheck === "Sub-Category" && (
                  <div className='input-group mb-3'>
                    <span className='input-group-text w-25' id='basic-addon1'>
                      Team
                    </span>
                    <Select
                      options={teamOptions}
                      placeholder={"Select team"}
                      className='form-control p-0'
                      styles={customStyles}
                      id='slaForTeam'
                      name='slaForTeam'
                      onChange={(option) => {
                        formik.setFieldValue("slaForTeam", option);
                        handleFetchSubcategoriesByTeam(option.value);
                      }}
                      onBlur={formik.handleBlur}
                      value={formik.values.slaForTeam}
                    />
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className='row'>
          <div className='col-sm-12 col-md-12 col-lg-12 col-xl-12'>
            <div className='d-flex justify-content-end'>
              <div className='form-check'>
                <input
                  className='form-check-input bordered'
                  type='checkbox'
                  id='setindivisual'
                  onChange={(e) => {
                    formik.setFieldValue(
                      "indivisual",
                      e.target.checked ? 1 : 0
                    );
                    setIndivisual(!indivisual);
                  }}
                />
                <label
                  className='form-check-label fw-bold'
                  htmlFor='setindivisual'>
                  Remaining SLA
                </label>
              </div>
            </div>
            <div
              className='table-responsive'
              style={{ maxHeight: "300px", overflowY: "auto" }}>
              <table className='table table-sm border sla-table'>
                <thead style={{ position: "sticky", top: "0" }}>
                  <tr>
                    <th>Sub-Category</th>
                    <th>First Response Time</th>
                    <th>Service Time</th>
                    <th>Status</th>
                    <th>Escalation</th>
                  </tr>
                </thead>
                <tbody>
                  {indivisual ? (
                    // Default row
                    <tr>
                      <td>Default</td>
                      <td>
                        <div className='d-flex justify-content-center day-hrs-mins'>
                          <input
                            type='text'
                            className='form-control'
                            placeholder='Day'
                            id='defaultFirstResponseTimeDay'
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            value={formik.values.defaultFirstResponseTimeDay}
                            style={{ width: "70px" }}
                          />
                          <input
                            type='text'
                            className='form-control'
                            placeholder='Hrs'
                            id='defaultFirstResponseTimeHrs'
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            value={formik.values.defaultFirstResponseTimeHrs}
                            style={{ width: "70px" }}
                          />
                          <input
                            type='text'
                            className='form-control'
                            placeholder='Mins'
                            id='defaultFirstResponseTimeMins'
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            value={formik.values.defaultFirstResponseTimeMins}
                            style={{ width: "70px" }}
                          />
                        </div>
                        {formik.touched.defaultFirstResponseTimeDay &&
                        formik.errors.defaultFirstResponseTimeDay ? (
                          <div className='invalid-feedback'>
                            {formik.errors.defaultFirstResponseTimeDay}
                          </div>
                        ) : null}
                        {formik.touched.defaultFirstResponseTimeHrs &&
                        formik.errors.defaultFirstResponseTimeHrs ? (
                          <div className='invalid-feedback'>
                            {formik.errors.defaultFirstResponseTimeHrs}
                          </div>
                        ) : null}
                        {formik.touched.defaultFirstResponseTimeMins &&
                        formik.errors.defaultFirstResponseTimeMins ? (
                          <div className='invalid-feedback'>
                            {formik.errors.defaultFirstResponseTimeMins}
                          </div>
                        ) : null}
                      </td>
                      <td>
                        <div className='d-flex justify-content-center day-hrs-mins'>
                          <input
                            type='text'
                            className='form-control'
                            placeholder='Day'
                            id='defaultServiceTimeDay'
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            value={formik.values.defaultServiceTimeDay}
                            style={{ width: "70px" }}
                          />
                          <input
                            type='text'
                            className='form-control'
                            placeholder='Hrs'
                            id='defaultServiceTimeHrs'
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            value={formik.values.defaultServiceTimeHrs}
                            style={{ width: "70px" }}
                          />
                          <input
                            type='text'
                            className='form-control'
                            placeholder='Mins'
                            id='defaultServiceTimeMins'
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            value={formik.values.defaultServiceTimeMins}
                            style={{ width: "70px" }}
                          />
                        </div>
                        {formik.touched.defaultServiceTimeDay &&
                        formik.errors.defaultServiceTimeDay ? (
                          <div className='invalid-feedback'>
                            {formik.errors.defaultServiceTimeDay}
                          </div>
                        ) : null}
                        {formik.touched.defaultServiceTimeHrs &&
                        formik.errors.defaultServiceTimeHrs ? (
                          <div className='invalid-feedback'>
                            {formik.errors.defaultServiceTimeHrs}
                          </div>
                        ) : null}
                        {formik.touched.defaultServiceTimeMins &&
                        formik.errors.defaultServiceTimeMins ? (
                          <div className='invalid-feedback'>
                            {formik.errors.defaultServiceTimeMins}
                          </div>
                        ) : null}
                      </td>
                      <td>
                        <div className='form-check form-switch d-flex justify-content-center'>
                          <input
                            className='form-check-input text-center'
                            id='defaultStatus'
                            type='checkbox'
                            role='switch'
                            checked={formik.values.defaultStatus}
                            onChange={(e) =>
                              formik.setFieldValue(
                                "defaultStatus",
                                e.target.checked ? 1 : 0
                              )
                            }
                          />
                        </div>
                      </td>
                      <td>
                        <div className='form-check form-switch d-flex justify-content-center'>
                          <input
                            className='form-check-input text-center'
                            type='checkbox'
                            role='switch'
                            id='defaultEscalate'
                            checked={formik.values.defaultEscalate}
                            onChange={(e) =>
                              formik.setFieldValue(
                                "defaultEscalate",
                                e.target.checked ? 1 : 0
                              )
                            }
                          />
                        </div>
                      </td>
                    </tr>
                  ) : subCategoryListByTeam &&
                    subCategoryListByTeam.length > 0 ? (
                    subCategoryListByTeam.map((item, index) => (
                      <tr key={index}>
                        <td>{item.sub_category_in_english}</td>
                        <td>
                          <div className='d-flex justify-content-center day-hrs-mins'>
                            <input
                              type='text'
                              className='form-control'
                              placeholder='Day'
                              id={`subcategories[${index}].firstResponseTimeDay`}
                              onChange={(e) => {
                                formik.setFieldValue(
                                  `subcategories[${index}].firstResponseTimeDay`,
                                  e.target.value
                                );
                              }}
                              style={{ width: "70px" }}
                            />
                            <input
                              type='text'
                              className='form-control'
                              placeholder='Hrs'
                              id={`subcategories[${index}].firstResponseTimeHrs`}
                              onChange={(e) =>
                                formik.setFieldValue(
                                  `subcategories[${index}].firstResponseTimeHrs`,
                                  e.target.value
                                )
                              }
                              style={{ width: "70px" }}
                            />
                            <input
                              type='text'
                              className='form-control'
                              placeholder='Mins'
                              id={`subcategories[${index}].firstResponseTimeMins`}
                              onChange={(e) =>
                                formik.setFieldValue(
                                  `subcategories[${index}].firstResponseTimeMins`,
                                  e.target.value
                                )
                              }
                              style={{ width: "70px" }}
                            />
                          </div>
                          {formik.touched.firstResponseTimeDay &&
                          formik.errors.firstResponseTimeDay ? (
                            <div className='invalid-feedback'>
                              {formik.errors.firstResponseTimeDay}
                            </div>
                          ) : null}
                          {formik.touched.firstResponseTimeHrs &&
                          formik.errors.firstResponseTimeHrs ? (
                            <div className='invalid-feedback'>
                              {formik.errors.firstResponseTimeHrs}
                            </div>
                          ) : null}
                          {formik.touched.firstResponseTimeMins &&
                          formik.errors.firstResponseTimeMins ? (
                            <div className='invalid-feedback'>
                              {formik.errors.firstResponseTimeMins}
                            </div>
                          ) : null}
                        </td>
                        <td>
                          <div className='d-flex justify-content-center day-hrs-mins'>
                            <input
                              type='text'
                              className={`form-control ${
                                formik.touched.serviceTimeDay &&
                                formik.errors.serviceTimeDay
                                  ? "is-invalid"
                                  : formik.touched.serviceTimeDay
                                  ? "is-valid"
                                  : ""
                              }`}
                              placeholder='Day'
                              id={`subcategories[${index}].serviceTimeDay`}
                              onChange={(e) =>
                                formik.setFieldValue(
                                  `subcategories[${index}].serviceTimeDay`,
                                  e.target.value
                                )
                              }
                              style={{ width: "70px" }}
                            />
                            <input
                              type='text'
                              className={`form-control ${
                                formik.touched.serviceTimeHrs &&
                                formik.errors.serviceTimeHrs
                                  ? "is-invalid"
                                  : formik.touched.serviceTimeHrs
                                  ? "is-valid"
                                  : ""
                              }`}
                              placeholder='Hrs'
                              id={`subcategories[${index}].serviceTimeHrs`}
                              onChange={(e) =>
                                formik.setFieldValue(
                                  `subcategories[${index}].serviceTimeHrs`,
                                  e.target.value
                                )
                              }
                              style={{ width: "70px" }}
                            />
                            <input
                              type='text'
                              className={`form-control ${
                                formik.touched.serviceTimeMins &&
                                formik.errors.serviceTimeMins
                                  ? "is-invalid"
                                  : formik.touched.serviceTimeMins
                                  ? "is-valid"
                                  : ""
                              }`}
                              placeholder='Mins'
                              id={`subcategories[${index}].serviceTimeMins`}
                              onChange={(e) =>
                                formik.setFieldValue(
                                  `subcategories[${index}].serviceTimeMins`,
                                  e.target.value
                                )
                              }
                              style={{ width: "70px" }}
                            />
                          </div>
                          {formik.touched.serviceTimeDay &&
                          formik.errors.serviceTimeDay ? (
                            <div className='invalid-feedback'>
                              {formik.errors.serviceTimeDay}
                            </div>
                          ) : null}
                          {formik.touched.serviceTimeHrs &&
                          formik.errors.serviceTimeHrs ? (
                            <div className='invalid-feedback'>
                              {formik.errors.serviceTimeHrs}
                            </div>
                          ) : null}
                          {formik.touched.serviceTimeMins &&
                          formik.errors.serviceTimeMins ? (
                            <div className='invalid-feedback'>
                              {formik.errors.serviceTimeMins}
                            </div>
                          ) : null}
                        </td>

                        <td>
                          <div className='form-check form-switch d-flex justify-content-center'>
                            <input
                              className='form-check-input text-center'
                              type='checkbox'
                              role='switch'
                              id={`subcategories[${index}].status`}
                              checked={
                                formik.values.subcategories[index] &&
                                formik.values.subcategories[index].status
                              }
                              onChange={(e) =>
                                formik.setFieldValue(
                                  `subcategories[${index}].status`,
                                  e.target.checked ? 1 : 0
                                )
                              }
                            />
                          </div>
                        </td>
                        <td>
                          <div className='form-check form-switch d-flex justify-content-center'>
                            <input
                              className='form-check-input text-center'
                              type='checkbox'
                              role='switch'
                              id={`subcategories[${index}].escalateStatus`}
                              checked={
                                formik.values.subcategories[index] &&
                                formik.values.subcategories[index]
                                  .escalateStatus
                              }
                              onChange={(e) =>
                                formik.setFieldValue(
                                  `subcategories[${index}].escalateStatus`,
                                  e.target.checked ? 1 : 0
                                )
                              }
                            />
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan='4' className='text-center text-danger'>
                        No Subcategory Found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
        <div className='row mt-5'>
          <div className='col-sm-12 col-md-12 col-lg-12 col-xl-12'>
            <p className='mb-2'>
              When <span className='fw-bold'>First Response Time</span> is not
              met, escalate & notify
            </p>
            <div className='card'>
              <div className='card-body'>
                {formik.values.escalationLevels.map((level, index) => (
                  <div
                    key={level.id}
                    className='row pt-3 rounded border mb-3'
                    style={{ background: "#EBEFF3" }}>
                    <div className='col-sm-12 col-md-2 col-lg-2 col-xl-2'>
                      <p className='mb-0 mt-1 text-center'>
                        Level {index + 1} escalation
                      </p>
                    </div>
                    <div className='col-sm-12 col-md-2 col-lg-2 col-xl-2'>
                      <div className='mb-3'>
                        <Select
                          options={escalateData}
                          placeholder={"Immediately"}
                          styles={customStyles}
                          id={`escalationLevels[${index}].timeframe`}
                          name={`escalationLevels[${index}].timeframe`}
                          onChange={(option) =>
                            formik.setFieldValue(
                              `escalationLevels[${index}].timeframe`,
                              option
                            )
                          }
                        />
                      </div>
                    </div>
                    <div className='col-sm-12 col-md-4 col-lg-4 col-xl-4'>
                      <div className='input-group input-group-sm mb-3'>
                        <span className='input-group-text' id='basic-addon1'>
                          To
                        </span>
                        <Select
                          options={agentOptions}
                          placeholder={"Assigned Agent"}
                          styles={customStyles}
                          isMulti
                          id={`escalationLevels[${index}].agents`}
                          name={`escalationLevels[${index}].agents`}
                          className='form-control'
                          onChange={(option) =>
                            formik.setFieldValue(
                              `escalationLevels[${index}].agents`,
                              option
                            )
                          }
                        />
                      </div>
                    </div>
                    <div className='col-sm-12 col-md-3 col-lg-3 col-xl-3'>
                      <div className='input-group input-group-sm mb-3'>
                        <div className='form-check mb-0 mt-2'>
                          <input
                            type='checkbox'
                            name={`escalationLevels[${index}].sendmail`}
                            id={`escalationLevels[${index}].sendmail`}
                            className='form-check-input form-check-input-sm text-center me-2'
                            onChange={() => {
                              const updatedLevels = [
                                ...formik.values.escalationLevels,
                              ];
                              updatedLevels[index].sendmail =
                                !updatedLevels[index].sendmail;
                              formik.setFieldValue(
                                "escalationLevels",
                                updatedLevels
                              );
                            }}
                          />
                        </div>
                        <span className='input-group-text' id='basic-addon1'>
                          Send email
                        </span>
                        <Select
                          options={emailTemplateOptions}
                          placeholder={"Template"}
                          styles={customStyles}
                          id={`escalationLevels[${index}].emailTemplate`}
                          name={`escalationLevels[${index}].emailTemplate`}
                          className='form-control form-control-sm p-0'
                          isDisabled={
                            !formik.values.escalationLevels[index].sendmail
                          }
                          onChange={(option) =>
                            formik.setFieldValue(
                              `escalationLevels[${index}].emailTemplate`,
                              option
                            )
                          }
                        />
                      </div>
                    </div>
                    <div className='col-sm-12 col-md-1 col-lg-1 col-xl-1 text-center'>
                      <button
                        type='button'
                        onClick={() => deleteLevel(index)}
                        className='btn bg-transparent'>
                        <i className='bi bi-trash-fill'></i>
                      </button>
                    </div>
                  </div>
                ))}
                <div className='w-25 mt-3'>
                  <button
                    type='button'
                    className='bg-transparent'
                    onClick={addLevel}>
                    {plusIcon} Add level
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className='col-sm-12 col-md-12 col-lg-12 col-xl-12'>
            <p className='mb-2'>
              When <span className='fw-bold'>Service Time</span> is not met,
              escalate & notify
            </p>
            <div className='card'>
              <div className='card-body'>
                {formik.values.escalationServiceLevels.map((level, index) => (
                  <div
                    key={level.id}
                    className='row pt-3 rounded border mb-3'
                    style={{ background: "#EBEFF3" }}>
                    <div className='col-sm-12 col-md-2 col-lg-2 col-xl-2'>
                      <p className='mb-0 mt-1 text-center'>
                        Level {index + 1} escalation
                      </p>
                    </div>
                    <div className='col-sm-12 col-md-2 col-lg-2 col-xl-2'>
                      <div className='mb-3'>
                        <Select
                          options={escalateData}
                          placeholder={"Immediately"}
                          styles={customStyles}
                          id={`escalationServiceLevels[${index}].timeframe`}
                          name={`escalationServiceLevels[${index}].timeframe`}
                          onChange={(option) =>
                            formik.setFieldValue(
                              `escalationServiceLevels[${index}].timeframe`,
                              option
                            )
                          }
                        />
                      </div>
                    </div>
                    <div className='col-sm-12 col-md-4 col-lg-4 col-xl-4'>
                      <div className='input-group mb-3'>
                        <span className='input-group-text' id='basic-addon1'>
                          To
                        </span>
                        <Select
                          options={agentOptions}
                          placeholder={"Assigned Agent"}
                          styles={customStyles}
                          isMulti
                          id={`escalationServiceLevels[${index}].agents`}
                          name={`escalationServiceLevels[${index}].agents`}
                          className='form-control'
                          onChange={(option) =>
                            formik.setFieldValue(
                              `escalationServiceLevels[${index}].agents`,
                              option
                            )
                          }
                        />
                      </div>
                    </div>
                    <div className='col-sm-12 col-md-3 col-lg-3 col-xl-3'>
                      <div className='input-group mb-3'>
                        <div className='form-check mb-0 mt-2'>
                          <input
                            type='checkbox'
                            name={`escalationServiceLevels[${index}].sendmail`}
                            id={`escalationServiceLevels[${index}].sendmail`}
                            className='form-check-input text-center me-2'
                            onChange={() => {
                              const updatedLevels = [
                                ...formik.values.escalationServiceLevels,
                              ];
                              updatedLevels[index].sendmail =
                                !updatedLevels[index].sendmail;
                              formik.setFieldValue(
                                "escalationServiceLevels",
                                updatedLevels
                              );
                            }}
                          />
                        </div>
                        <span className='input-group-text' id='basic-addon1'>
                          Send email
                        </span>
                        <Select
                          options={emailTemplateOptions}
                          placeholder={"Template"}
                          styles={customStyles}
                          id={`escalationServiceLevels[${index}].emailTemplate`}
                          name={`escalationServiceLevels[${index}].emailTemplate`}
                          className='form-control form-control-sm p-0'
                          isDisabled={
                            !formik.values.escalationServiceLevels[index]
                              .sendmail
                          }
                          onChange={(option) =>
                            formik.setFieldValue(
                              `escalationServiceLevels[${index}].emailTemplate`,
                              option
                            )
                          }
                        />
                      </div>
                    </div>
                    <div className='col-sm-12 col-md-1 col-lg-1 col-xl-1 text-center'>
                      <button
                        type='button'
                        onClick={() => deleteServiceTimeLevel(index)}
                        className='btn bg-transparent'>
                        <i className='bi bi-trash-fill'></i>
                      </button>
                    </div>
                  </div>
                ))}
                <div className='w-25 mt-3'>
                  <button
                    type='button'
                    className='bg-transparent'
                    onClick={addLevelServiceTime}>
                    {plusIcon} Add level
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className='text-end'>
          <button type='submit' className='custom-btn'>
            Save
          </button>
        </div>
      </form>
    </div>
  );
};
