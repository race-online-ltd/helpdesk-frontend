// import React, { useContext, useEffect, useState } from "react";
// import { useFormik } from "formik";
// import { categoryValidationSchema } from "../../../../schema/ValidationSchemas";
// import { SelectDropdown } from "./../SelectDropdown";
// import {
//   fetchCategoryById,
//   store,
//   update,
// } from "../../../../api/api-client/settings/categoryApi";
// import { fetchCompany } from "../../../../api/api-client/settings/companyApi";
// import {
//   fetchAllTeam,
//   fetchTeam,
// } from "../../../../api/api-client/settings/teamApi";

// import { userContext } from "../../../context/UserContext";
// import {
//   errorMessage,
//   successMessage,
// } from "../../../../api/api-config/apiResponseMessage";

// export const AddNewCategory = ({ id }) => {
//   const { user } = useContext(userContext);
//   const [options, setOptions] = useState([]);
//   const [teamOptions, setTeamOptions] = useState([]);
//   const [isLoading, setIsLoading] = useState(false);

//   useEffect(() => {
//     setIsLoading(true);

//     const fetchBusinessEntityOptions = () => {
//       fetchCompany({
//         userType: user?.type,
//         userId: user?.id,
//       }).then((response) => {
//         setOptions(
//           response.result.map((option) => ({
//             value: option.id,
//             label: option.company_name,
//           }))
//         );
//       });
//     };

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

//     Promise.all([fetchBusinessEntityOptions(), fetchTeamOptions()])
//       .catch(errorMessage)
//       .finally(() => {
//         setIsLoading(false);
//       });
//   }, [user]);

//   const formik = useFormik({
//     initialValues: {
//       companyId: [],
//       teamId: [],
//       categoryInEnglish: "",
//       categoryInBangla: "",
//     },
//     validationSchema: categoryValidationSchema,
//     onSubmit: (values, { resetForm }) => {
//       setIsLoading(true);

//       // Extract IDs from selected objects
//       const formattedValues = {
//         companyIds: Array.isArray(values.companyId)
//           ? values.companyId.map((item) => item.value || item)
//           : [],
//         teamIds: Array.isArray(values.teamId)
//           ? values.teamId.map((item) => item.value || item)
//           : [],
//         categoryInEnglish: values.categoryInEnglish,
//         categoryInBangla: values.categoryInBangla,
//       };

//       const apiCall = id
//         ? update(id, formattedValues)
//         : store(formattedValues);

//       apiCall
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

//   useEffect(() => {
//     if (id) {
//       setIsLoading(true);
//       fetchCategoryById(id)
//         .then((response) => {
//           const { companyIds, teamIds } = response.data;

//           formik.setValues({
//             companyId: companyIds,
//             teamId: teamIds,
//             categoryInEnglish:
//               response.data.category?.category_in_english || "",
//             categoryInBangla: response.data.category?.category_in_bangla || "",
//           });
//         })
//         .catch(errorMessage)
//         .finally(() => {
//           setIsLoading(false);
//         });
//     }
//   }, [id]);

//   return (
//     <div className="row">
//       <div className="col-sm-12 col-md-12 col-lg-12 col-xl-12">
//         <div className="alert alert-secondary p-2" role="alert">
//           <h6>{id ? "Update" : "Create"} Category</h6>
//           <span>
//             <i>Please input the required information.</i>
//           </span>
//         </div>
//       </div>
//       <div className="col-sm-12 col-md-6 col-lg-6 col-xl-6">
//         <form onSubmit={formik.handleSubmit}>
//           <div className="row">
//             <div className="col-sm-12 col-md-12 col-lg-12 col-xl-12">
//               <div className="input-group mb-3">
//                 <span
//                   className="input-group-text w-25 label-cat-w"
//                   id="basic-addon1"
//                 >
//                   Business Entities
//                 </span>
//                 <SelectDropdown
//                   id="companyId"
//                   placeholder="Select business entities"
//                   options={options}
//                   value={formik.values.companyId}
//                   onChange={(value) =>
//                     formik.setFieldValue("companyId", value || [])
//                   }
//                   disabled={isLoading}
//                   isMulti={true}
//                 />
//               </div>
//               {formik.touched.companyId && formik.errors.companyId ? (
//                 <div className="text-danger">{formik.errors.companyId}</div>
//               ) : null}
//             </div>

//             <div className="col-sm-12 col-md-12 col-lg-12 col-xl-12">
//               <div className="input-group mb-3">
//                 <span
//                   className="input-group-text w-25 label-cat-w"
//                   id="basic-addon1"
//                 >
//                   Team
//                 </span>
//                 <SelectDropdown
//                   id="teamId"
//                   placeholder="Select teams"
//                   options={teamOptions}
//                   value={formik.values.teamId}
//                   onChange={(value) => formik.setFieldValue("teamId", value || [])}
//                   disabled={isLoading}
//                   isMulti={true}
//                 />
//               </div>
//               {formik.touched.teamId && formik.errors.teamId ? (
//                 <div className="text-danger">{formik.errors.teamId}</div>
//               ) : null}
//             </div>

//             <div className="col-sm-12 col-md-12 col-lg-12 col-xl-12">
//               <div className="input-group mb-3">
//                 <span
//                   className="input-group-text w-25 label-cat-w"
//                   id="basic-addon1"
//                 >
//                   Category in English
//                 </span>
//                 <input
//                   type="text"
//                   className="form-control"
//                   id="categoryInEnglish"
//                   placeholder="Category name"
//                   value={formik.values.categoryInEnglish}
//                   onChange={formik.handleChange}
//                   onBlur={formik.handleBlur}
//                 />
//               </div>
//               {formik.touched.categoryInEnglish &&
//               formik.errors.categoryInEnglish ? (
//                 <div className="text-danger">
//                   {formik.errors.categoryInEnglish}
//                 </div>
//               ) : null}
//             </div>

//             <div className="col-sm-12 col-md-12 col-lg-12 col-xl-12">
//               <div className="input-group mb-3">
//                 <span
//                   className="input-group-text w-25 label-cat-w"
//                   id="basic-addon1"
//                 >
//                   Category in বাংলা
//                 </span>
//                 <input
//                   type="text"
//                   className="form-control"
//                   id="categoryInBangla"
//                   placeholder="ক্যাটাগরির নাম"
//                   value={formik.values.categoryInBangla}
//                   onChange={formik.handleChange}
//                   onBlur={formik.handleBlur}
//                 />
//               </div>
//               {formik.touched.categoryInBangla &&
//               formik.errors.categoryInBangla ? (
//                 <div className="text-danger">
//                   {formik.errors.categoryInBangla}
//                 </div>
//               ) : null}
//             </div>

//             <div className="text-end">
//               <button type="submit" className="custom-btn">
//                 {isLoading
//                   ? id
//                     ? "Updating..."
//                     : "Saving..."
//                   : id
//                   ? "Update"
//                   : "Save"}
//               </button>
//             </div>
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// };






import React, { useContext, useEffect, useState } from "react";
import { useFormik } from "formik";
import { categoryValidationSchema } from "../../../../schema/ValidationSchemas";
import { SelectDropdown } from "./../SelectDropdown";

import {
  fetchCategoryById,
  store,
  update,
} from "../../../../api/api-client/settings/categoryApi";

import { fetchCompany } from "../../../../api/api-client/settings/companyApi";

import { userContext } from "../../../context/UserContext";
import {
  errorMessage,
  successMessage,
} from "../../../../api/api-config/apiResponseMessage";

export const AddNewCategory = ({ id }) => {
  const { user } = useContext(userContext);

  const [options, setOptions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  /* =========================
     FETCH BUSINESS ENTITIES
     ========================= */
  useEffect(() => {
    setIsLoading(true);

    fetchCompany({
      userType: user?.type,
      userId: user?.id,
    })
      .then((response) => {
        setOptions(
          response.result.map((item) => ({
            value: item.id,
            label: item.company_name,
          }))
        );
      })
      .catch(errorMessage)
      .finally(() => {
        setIsLoading(false);
      });
  }, [user]);

  /* =========================
     FORMIK
     ========================= */
  const formik = useFormik({
    initialValues: {
      companyId: [],
      categoryInEnglish: "",
      categoryInBangla: "",
    },
    validationSchema: categoryValidationSchema,
    onSubmit: (values, { resetForm }) => {
      setIsLoading(true);

      const formattedValues = {
        companyIds: Array.isArray(values.companyId)
          ? values.companyId.map((item) => item.value || item)
          : [],
        categoryInEnglish: values.categoryInEnglish,
        categoryInBangla: values.categoryInBangla,
      };

      const apiCall = id
        ? update(id, formattedValues)
        : store(formattedValues);

      apiCall
        .then((response) => {
          successMessage(response);
          resetForm();
        })
        .catch(errorMessage)
        .finally(() => {
          setIsLoading(false);
        });
    },
  });

  /* =========================
     EDIT MODE DATA LOAD
     ========================= */
  useEffect(() => {
    if (!id) return;

    setIsLoading(true);

    fetchCategoryById(id)
      .then((response) => {
        const { companyIds, category } = response.data;

        formik.setValues({
          companyId: companyIds || [],
          categoryInEnglish: category?.category_in_english || "",
          categoryInBangla: category?.category_in_bangla || "",
        });
      })
      .catch(errorMessage)
      .finally(() => {
        setIsLoading(false);
      });
  }, [id]);

  /* =========================
     UI
     ========================= */
  return (
    <div className="row">
      <div className="col-12">
        <div className="alert alert-secondary p-2">
          <h6>{id ? "Update" : "Create"} Category</h6>
          <i>Please input the required information.</i>
        </div>
      </div>

      <div className="col-md-6">
        <form onSubmit={formik.handleSubmit}>
          <div className="row">

            {/* BUSINESS ENTITY */}
            <div className="col-12">
              <div className="input-group mb-3">
                <span className="input-group-text w-25 label-cat-w">
                  Business Entities
                </span>
                <SelectDropdown
                  id="companyId"
                  placeholder="Select business entities"
                  options={options}
                  value={formik.values.companyId}
                  onChange={(value) =>
                    formik.setFieldValue("companyId", value || [])
                  }
                  disabled={isLoading}
                  isMulti
                />
              </div>
              {formik.touched.companyId && formik.errors.companyId && (
                <div className="text-danger">{formik.errors.companyId}</div>
              )}
            </div>

            {/* CATEGORY ENGLISH */}
            <div className="col-12">
              <div className="input-group mb-3">
                <span className="input-group-text w-25 label-cat-w">
                  Category in English
                </span>
                <input
                  type="text"
                  className="form-control"
                  id="categoryInEnglish"
                  placeholder="Category name"
                  {...formik.getFieldProps("categoryInEnglish")}
                />
              </div>
              {formik.touched.categoryInEnglish &&
                formik.errors.categoryInEnglish && (
                  <div className="text-danger">
                    {formik.errors.categoryInEnglish}
                  </div>
                )}
            </div>

            {/* CATEGORY BANGLA */}
            <div className="col-12">
              <div className="input-group mb-3">
                <span className="input-group-text w-25 label-cat-w">
                  Category in বাংলা
                </span>
                <input
                  type="text"
                  className="form-control"
                  id="categoryInBangla"
                  placeholder="ক্যাটাগরির নাম"
                  {...formik.getFieldProps("categoryInBangla")}
                />
              </div>
              {formik.touched.categoryInBangla &&
                formik.errors.categoryInBangla && (
                  <div className="text-danger">
                    {formik.errors.categoryInBangla}
                  </div>
                )}
            </div>

            {/* SUBMIT */}
            <div className="text-end">
              <button type="submit" className="custom-btn" disabled={isLoading}>
                {isLoading
                  ? id
                    ? "Updating..."
                    : "Saving..."
                  : id
                  ? "Update"
                  : "Save"}
              </button>
            </div>

          </div>
        </form>
      </div>
    </div>
  );
};
