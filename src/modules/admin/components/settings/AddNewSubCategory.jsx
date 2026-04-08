// import React, { useContext, useEffect, useState } from "react";
// import { toast } from "react-toastify";
// import { useFormik } from "formik";
// import { fetchCompany } from "../../../../api/api-client/settings/companyApi";
// import {
//   fetchCategory,
//   fetchCategoryByDefaultBusinessEntityId,
// } from "../../../../api/api-client/settings/categoryApi";
// import { SelectDropdown } from "../SelectDropdown";
// import {
//   fetchSubCategoryById,
//   store,
//   update,
// } from "../../../../api/api-client/settings/subCategoryApi";
// import { subCategoryValidationSchema } from "../../../../schema/ValidationSchemas";
// import {
//   errorMessage,
//   successMessage,
// } from "../../../../api/api-config/apiResponseMessage";
// import { fetchAllTeam } from "../../../../api/api-client/settings/teamApi";
// import { userContext } from "../../../context/UserContext";

// export const AddNewSubCategory = ({ id }) => {
//   const { user } = useContext(userContext);
//   const [companyOptions, setCompanyOptions] = useState([]);
//   const [categoryOptions, setCategoryOptions] = useState([]);
//   const [banglaCategoryOptions, setBanglaCategoryOptions] = useState([]);
//   const [teamOptions, setTeamOptions] = useState([]);
//   const [isLoading, setIsLoading] = useState(false);

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

//     const fetchCategoryOptions = () =>
//       fetchCategory().then((response) => {
//         setCategoryOptions(
//           response.data.map((option) => ({
//             value: option.id,
//             label: option.category_in_english,
//           }))
//         );
//         setBanglaCategoryOptions(
//           response.data.map((option) => ({
//             value: option.id,
//             label: option.category_in_bangla,
//           }))
//         );
//       });

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
//       // fetchCategoryOptions(),
//       fetchTeamOptions(),
//     ])
//       .catch(errorMessage)
//       .finally(() => setIsLoading(false));
//   }, []);

//   useEffect(() => {
//     if (id) {
//       setIsLoading(true);
//       fetchSubCategoryById(id)
//         .then((response) => {
//           const teamOptions = response.data.sub_category_team.map((team) => ({
//             value: team.team_id,
//           }));
//           const selectedBanglaCategory = banglaCategoryOptions.find(
//             (item) => item.value === response.data.sub_category.category_id
//           );

//           formik.setValues({
//             companyId: response.data.sub_category.company_id || "",
//             teamId: teamOptions.map((option) => option.value),
//             categoryInEnglishId: response.data.sub_category.category_id || "",
//             categoryInBanglaId: selectedBanglaCategory
//               ? selectedBanglaCategory.label
//               : "",
//             subCategoryInEnglish:
//               response.data.sub_category.sub_category_in_english || "",
//             subCategoryInBangla:
//               response.data.sub_category.sub_category_in_bangla || "",
//           });
//           setIsLoading(false);
//         })
//         .catch((error) => {
//           errorMessage(error);
//           setIsLoading(false);
//         });
//     }
//   }, [id, banglaCategoryOptions]);

//   const formik = useFormik({
//     initialValues: {
//       companyId: "",
//       teamId: [],
//       categoryInEnglishId: "",
//       categoryInBanglaId: "",
//       subCategoryInEnglish: "",
//       subCategoryInBangla: "",
//     },
//     validationSchema: subCategoryValidationSchema,
//     onSubmit: (values, { resetForm }) => {
//       setIsLoading(true);
//       const apiCall = id ? update(id, values) : store(values);
//       apiCall
//         .then((response) => {
//           resetForm();
//           successMessage(response);
//         })
//         .catch(errorMessage)
//         .finally(() => {
//           setIsLoading(false);
//         });
//     },
//   });

//   useEffect(() => {
//     if (formik.values.categoryInEnglishId) {
//       const selectedCategory = categoryOptions.find(
//         (option) => option.value === formik.values.categoryInEnglishId
//       );
//       if (selectedCategory) {
//         const selectedBanglaCategory = banglaCategoryOptions.find(
//           (item) => item.value === formik.values.categoryInEnglishId
//         );
//         if (selectedBanglaCategory) {
//           formik.setFieldValue(
//             "categoryInBanglaId",
//             selectedBanglaCategory.label
//           );
//         }
//       }
//     }
//   }, [formik.values.categoryInEnglishId]);

//   useEffect(() => {
//     const companyId = formik.values.companyId;

//     if (!companyId) {
//       setCategoryOptions([]);
//       setBanglaCategoryOptions([]);
//       return;
//     }

//     fetchCategoryByDefaultBusinessEntityId(formik.values.companyId)
//       .then((response) => {
//         setCategoryOptions(
//           response.data.map((option) => ({
//             value: option.id,
//             label: option.category_in_english,
//           }))
//         );
//         setBanglaCategoryOptions(
//           response.data.map((option) => ({
//             value: option.id,
//             label: option.category_in_bangla,
//           }))
//         );
//       })
//       .catch((error) => {
//         errorMessage(error);
//         setIsLoading(false);
//       });
//   }, [formik.values.companyId]);
//   console.log(formik.values);
//   return (
//     <div className='row'>
//       <div className='col-sm-12 col-md-12 col-lg-12 col-xl-12'>
//         <div class='alert alert-secondary p-2' role='alert'>
//           <h6>{id ? "Update " : "Create "}Sub Category</h6>
//           <span>
//             <i>Please input the required information.</i>
//           </span>
//         </div>
//       </div>
//       <div className='col-sm-12 col-md-6 col-lg-6 col-xl-6'>
//         <form onSubmit={formik.handleSubmit}>
//           <div className='row'>
//             <div className='col-12'>
//               <div class='input-group mb-3'>
//                 <span
//                   class='input-group-text w-25 label-cat-w'
//                   id='basic-addon1'>
//                   Business Entity
//                 </span>

//                 <SelectDropdown
//                   id='companyId'
//                   placeholder='Business entity'
//                   options={companyOptions}
//                   value={formik.values.companyId}
//                   onChange={(value) => formik.setFieldValue("companyId", value)}
//                   disabled={isLoading}
//                 />
//               </div>
//               {formik.touched.companyId && formik.errors.companyId ? (
//                 <div className='text-danger'>{formik.errors.companyId}</div>
//               ) : null}
//             </div>

//             <div className='col-sm-12 col-md-12 col-lg-12 col-xl-12'>
//               <div class='input-group mb-3'>
//                 <span
//                   class='input-group-text w-25 label-cat-w'
//                   id='basic-addon1'>
//                   Team
//                 </span>

//                 <SelectDropdown
//                   id='teamId'
//                   placeholder='Team'
//                   options={teamOptions}
//                   value={formik.values.teamId}
//                   onChange={(value) => formik.setFieldValue("teamId", value)}
//                   disabled={isLoading}
//                   isMulti={true}
//                 />
//               </div>
//               {formik.touched.teamId && formik.errors.teamId ? (
//                 <div className='text-danger'>{formik.errors.teamId}</div>
//               ) : null}
//             </div>

//             <div className='col-sm-12 col-md-12 col-lg-12 col-xl-12'>
//               <div class='input-group mb-3'>
//                 <span
//                   class='input-group-text w-25 label-cat-w'
//                   id='basic-addon1'>
//                   Category in English
//                 </span>
//                 <SelectDropdown
//                   id='categoryInEnglishId'
//                   placeholder='Category in English'
//                   options={categoryOptions}
//                   value={formik.values.categoryInEnglishId}
//                   onChange={(value) =>
//                     formik.setFieldValue("categoryInEnglishId", value)
//                   }
//                   disabled={isLoading}
//                 />
//               </div>
//               {formik.touched.categoryInEnglishId &&
//               formik.errors.categoryInEnglishId ? (
//                 <div className='text-danger'>
//                   {formik.errors.categoryInEnglishId}
//                 </div>
//               ) : null}
//             </div>
//             <div className='col-sm-12 col-md-12 col-lg-12 col-xl-12'>
//               <div class='input-group mb-3'>
//                 <span
//                   class='input-group-text w-25 label-cat-w'
//                   id='basic-addon1'>
//                   ক্যাটাগরির নাম
//                 </span>
//                 <input
//                   type='text'
//                   className='form-control'
//                   id='categoryInBanglaId'
//                   placeholder='ক্যাটাগরির নাম'
//                   value={formik.values.categoryInBanglaId}
//                   onChange={(value) =>
//                     formik.setFieldValue("categoryInBanglaId", value)
//                   }
//                   disabled={true}
//                 />
//               </div>
//             </div>
//             <div className='col-sm-12 col-md-12 col-lg-12 col-xl-12'>
//               <div class='input-group mb-3'>
//                 <span class='input-group-text w-25' id='basic-addon1'>
//                   Sub-category in English
//                 </span>
//                 <input
//                   type='text'
//                   class='form-control'
//                   id='subCategoryInEnglish'
//                   placeholder='Sub-category in English'
//                   value={formik.values.subCategoryInEnglish}
//                   onChange={formik.handleChange}
//                   onBlur={formik.handleBlur}
//                 />
//               </div>
//               {formik.touched.subCategoryInEnglish &&
//               formik.errors.subCategoryInEnglish ? (
//                 <div className='text-danger'>
//                   {formik.errors.subCategoryInEnglish}
//                 </div>
//               ) : null}
//             </div>

//             <div className='col-sm-12 col-md-12 col-lg-12 col-xl-12'>
//               <div class='input-group mb-3'>
//                 <span class='input-group-text w-25' id='basic-addon1'>
//                   সাব-ক্যাটাগরির নাম
//                 </span>
//                 <input
//                   type='text'
//                   class='form-control'
//                   id='subCategoryInBangla'
//                   placeholder='সাব-ক্যাটাগরির নাম'
//                   value={formik.values.subCategoryInBangla}
//                   onChange={formik.handleChange}
//                   onBlur={formik.handleBlur}
//                 />
//               </div>
//               {formik.touched.subCategoryInBangla &&
//               formik.errors.subCategoryInBangla ? (
//                 <div className='text-danger'>
//                   {formik.errors.subCategoryInBangla}
//                 </div>
//               ) : null}
//             </div>
//             <div className='text-end'>
//               <button type='submit' className='custom-btn'>
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
import { toast } from "react-toastify";
import { useFormik } from "formik";
import { fetchCompany } from "../../../../api/api-client/settings/companyApi";
import {
  fetchCategory,
  fetchCategoryByDefaultBusinessEntityId,fetchUniqueCategory,
} from "../../../../api/api-client/settings/categoryApi";
import { SelectDropdown } from "../SelectDropdown";
import {
  fetchSubCategoryById,
  store,
  update,
} from "../../../../api/api-client/settings/subCategoryApi";
import { subCategoryValidationSchema } from "../../../../schema/ValidationSchemas";
import {
  errorMessage,
  successMessage,
} from "../../../../api/api-config/apiResponseMessage";
import { fetchAllTeam } from "../../../../api/api-client/settings/teamApi";
import { userContext } from "../../../context/UserContext";

export const AddNewSubCategory = ({ id }) => {
  const { user } = useContext(userContext);
  const [companyOptions, setCompanyOptions] = useState([]);
  const [categoryOptions, setCategoryOptions] = useState([]);
  const [banglaCategoryOptions, setBanglaCategoryOptions] = useState([]);
  const [teamOptions, setTeamOptions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

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

    const fetchCategoryOptions = () =>
      fetchCategory().then((response) => {
        setCategoryOptions(
          response.data.map((option) => ({
            value: option.id,
            label: option.category_in_english,
          }))
        );
        setBanglaCategoryOptions(
          response.data.map((option) => ({
            value: option.id,
            label: option.category_in_bangla,
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

    Promise.all([
      fetchCompanyOptions(),
      // fetchCategoryOptions(),
      fetchTeamOptions(),
    ])
      .catch(errorMessage)
      .finally(() => setIsLoading(false));
  }, []);

  useEffect(() => {
    if (id) {
      setIsLoading(true);
      fetchSubCategoryById(id)
        .then((response) => {
          const { companyIds, categoryId, teamIds } = response.data;

          formik.setValues({
            companyId: companyIds[0] || "",
            teamId: teamIds,
            categoryInEnglishId: categoryId,
            categoryInBanglaId: "",
            subCategoryInEnglish:
              response.data.sub_category?.sub_category_in_english || "",
            subCategoryInBangla:
              response.data.sub_category?.sub_category_in_bangla || "",
          });
        })
        .catch(errorMessage)
        .finally(() => setIsLoading(false));
    }
  }, [id]);

  const formik = useFormik({
    initialValues: {
      companyId: "",
      teamId: [],
      categoryInEnglishId: "",
      categoryInBanglaId: "",
      subCategoryInEnglish: "",
      subCategoryInBangla: "",
    },
    validationSchema: subCategoryValidationSchema,
    onSubmit: (values, { resetForm }) => {
      setIsLoading(true);

      // Extract IDs from selected objects
      const formattedValues = {
        companyIds: values.companyId ? [values.companyId] : [],
        teamIds: Array.isArray(values.teamId)
          ? values.teamId.map((item) => item.value || item)
          : [],
        categoryInEnglishId:
          values.categoryInEnglishId?.value || values.categoryInEnglishId,
        subCategoryInEnglish: values.subCategoryInEnglish,
        subCategoryInBangla: values.subCategoryInBangla,
      };

      const apiCall = id ? update(id, formattedValues) : store(formattedValues);
      apiCall
        .then((response) => {
          successMessage(response);
          if (!id) {
            resetForm();
          }
        })
        .catch(errorMessage)
        .finally(() => {
          setIsLoading(false);
        });
    },
  });

  useEffect(() => {
    if (formik.values.categoryInEnglishId) {
      const selectedCategory = categoryOptions.find(
        (option) => option.value === formik.values.categoryInEnglishId
      );
      if (selectedCategory) {
        const selectedBanglaCategory = banglaCategoryOptions.find(
          (item) => item.value === formik.values.categoryInEnglishId
        );
        if (selectedBanglaCategory) {
          formik.setFieldValue(
            "categoryInBanglaId",
            selectedBanglaCategory.label
          );
        }
      }
    }
  }, [formik.values.categoryInEnglishId]);

  useEffect(() => {
    const companyId = formik.values.companyId;

    if (!companyId) {
      setCategoryOptions([]);
      setBanglaCategoryOptions([]);
      return;
    }

    fetchUniqueCategory(formik.values.companyId)
      .then((response) => {
        setCategoryOptions(
          response.data.map((option) => ({
            value: option.id,
            label: option.category_in_english,
          }))
        );
        setBanglaCategoryOptions(
          response.data.map((option) => ({
            value: option.id,
            label: option.category_in_bangla,
          }))
        );
      })
      .catch((error) => {
        errorMessage(error);
        setIsLoading(false);
      });
  }, [formik.values.companyId]);
  console.log(formik.values);
  return (
    <div className='row'>
      <div className='col-sm-12 col-md-12 col-lg-12 col-xl-12'>
        <div class='alert alert-secondary p-2' role='alert'>
          <h6>{id ? "Update " : "Create "}Sub Category</h6>
          <span>
            <i>Please input the required information.</i>
          </span>
        </div>
      </div>
      <div className='col-sm-12 col-md-6 col-lg-6 col-xl-6'>
        <form onSubmit={formik.handleSubmit}>
          <div className='row'>
            <div className='col-12'>
              <div class='input-group mb-3'>
                <span
                  class='input-group-text w-25 label-cat-w'
                  id='basic-addon1'>
                  Business Entity
                </span>

                <SelectDropdown
                  id='companyId'
                  placeholder='Business entity'
                  options={companyOptions}
                  value={formik.values.companyId}
                  onChange={(value) => formik.setFieldValue("companyId", value)}
                  disabled={isLoading}
                />
              </div>
              {formik.touched.companyId && formik.errors.companyId ? (
                <div className='text-danger'>{formik.errors.companyId}</div>
              ) : null}
            </div>

            <div className='col-sm-12 col-md-12 col-lg-12 col-xl-12'>
              <div class='input-group mb-3'>
                <span
                  class='input-group-text w-25 label-cat-w'
                  id='basic-addon1'>
                  Team
                </span>

                <SelectDropdown
                  id='teamId'
                  placeholder='Team'
                  options={teamOptions}
                  value={formik.values.teamId}
                  onChange={(value) => formik.setFieldValue("teamId", value)}
                  disabled={isLoading}
                  isMulti={true}
                />
              </div>
              {formik.touched.teamId && formik.errors.teamId ? (
                <div className='text-danger'>{formik.errors.teamId}</div>
              ) : null}
            </div>

            <div className='col-sm-12 col-md-12 col-lg-12 col-xl-12'>
              <div class='input-group mb-3'>
                <span
                  class='input-group-text w-25 label-cat-w'
                  id='basic-addon1'>
                  Category in English
                </span>
                <SelectDropdown
                  id='categoryInEnglishId'
                  placeholder='Category in English'
                  options={categoryOptions}
                  value={formik.values.categoryInEnglishId}
                  onChange={(value) =>
                    formik.setFieldValue("categoryInEnglishId", value)
                  }
                  disabled={isLoading}
                />
              </div>
              {formik.touched.categoryInEnglishId &&
              formik.errors.categoryInEnglishId ? (
                <div className='text-danger'>
                  {formik.errors.categoryInEnglishId}
                </div>
              ) : null}
            </div>
            <div className='col-sm-12 col-md-12 col-lg-12 col-xl-12'>
              <div class='input-group mb-3'>
                <span
                  class='input-group-text w-25 label-cat-w'
                  id='basic-addon1'>
                  ক্যাটাগরির নাম
                </span>
                <input
                  type='text'
                  className='form-control'
                  id='categoryInBanglaId'
                  placeholder='ক্যাটাগরির নাম'
                  value={formik.values.categoryInBanglaId}
                  onChange={(value) =>
                    formik.setFieldValue("categoryInBanglaId", value)
                  }
                  disabled={true}
                />
              </div>
            </div>
            <div className='col-sm-12 col-md-12 col-lg-12 col-xl-12'>
              <div class='input-group mb-3'>
                <span class='input-group-text w-25' id='basic-addon1'>
                  Sub-category in English
                </span>
                <input
                  type='text'
                  class='form-control'
                  id='subCategoryInEnglish'
                  placeholder='Sub-category in English'
                  value={formik.values.subCategoryInEnglish}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
              </div>
              {formik.touched.subCategoryInEnglish &&
              formik.errors.subCategoryInEnglish ? (
                <div className='text-danger'>
                  {formik.errors.subCategoryInEnglish}
                </div>
              ) : null}
            </div>

            <div className='col-sm-12 col-md-12 col-lg-12 col-xl-12'>
              <div class='input-group mb-3'>
                <span class='input-group-text w-25' id='basic-addon1'>
                  সাব-ক্যাটাগরির নাম
                </span>
                <input
                  type='text'
                  class='form-control'
                  id='subCategoryInBangla'
                  placeholder='সাব-ক্যাটাগরির নাম'
                  value={formik.values.subCategoryInBangla}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
              </div>
              {formik.touched.subCategoryInBangla &&
              formik.errors.subCategoryInBangla ? (
                <div className='text-danger'>
                  {formik.errors.subCategoryInBangla}
                </div>
              ) : null}
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
          </div>
        </form>
      </div>
    </div>
  );
};



// import React, { useContext, useEffect, useState } from "react";
// import { useFormik } from "formik";
// import { fetchCompany } from "../../../../api/api-client/settings/companyApi";
// import {
//   fetchCategory,
//   fetchUniqueCategory,
// } from "../../../../api/api-client/settings/categoryApi";
// import { SelectDropdown } from "../SelectDropdown";
// import {
//   fetchSubCategoryById,
//   store,
//   update,
// } from "../../../../api/api-client/settings/subCategoryApi";
// import { subCategoryValidationSchema } from "../../../../schema/ValidationSchemas";
// import {
//   errorMessage,
//   successMessage,
// } from "../../../../api/api-config/apiResponseMessage";
// import { fetchAllTeam } from "../../../../api/api-client/settings/teamApi";
// import { userContext } from "../../../context/UserContext";

// export const AddNewSubCategory = ({ id }) => {
//   const { user } = useContext(userContext);
//   const [companyOptions, setCompanyOptions] = useState([]);
//   const [categoryOptions, setCategoryOptions] = useState([]);
//   const [banglaCategoryOptions, setBanglaCategoryOptions] = useState([]);
//   const [teamOptions, setTeamOptions] = useState([]);
//   const [isLoading, setIsLoading] = useState(false);

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

//     const fetchCategoryOptions = () =>
//       fetchCategory().then((response) => {
//         setCategoryOptions(
//           response.data.map((option) => ({
//             value: option.id,
//             label: option.category_in_english,
//           }))
//         );
//         setBanglaCategoryOptions(
//           response.data.map((option) => ({
//             value: option.id,
//             label: option.category_in_bangla,
//           }))
//         );
//       });

//     const fetchTeamOptions = () =>
//       fetchAllTeam().then((response) => {
//         setTeamOptions(
//           response.data.map((option) => ({
//             value: option.id,
//             label: option.team_name,
//           }))
//         );
//       });

//     Promise.all([
//       fetchCompanyOptions(),
//       fetchCategoryOptions(),
//       fetchTeamOptions(),
//     ])
//       .catch(errorMessage)
//       .finally(() => setIsLoading(false));
//   }, [user]);

//   const formik = useFormik({
//     initialValues: {
//       companyId: [],
//       teamId: [],
//       categoryInEnglishId: "",
//       categoryInBanglaId: "",
//       subCategoryInEnglish: "",
//       subCategoryInBangla: "",
//     },
//     validationSchema: subCategoryValidationSchema,
//     onSubmit: (values) => {
//       setIsLoading(true);

//       // Extract IDs from selected objects
//       const formattedValues = {
//         companyIds: Array.isArray(values.companyId)
//           ? values.companyId.map((item) => item.value || item)
//           : [],
//         teamIds: Array.isArray(values.teamId)
//           ? values.teamId.map((item) => item.value || item)
//           : [],
//         categoryInEnglishId:
//           values.categoryInEnglishId?.value || values.categoryInEnglishId,
//         subCategoryInEnglish: values.subCategoryInEnglish,
//         subCategoryInBangla: values.subCategoryInBangla,
//       };

//       const apiCall = id ? update(id, formattedValues) : store(formattedValues);
//       apiCall
//         .then((response) => {
//           successMessage(response);
//           formik.resetForm();
//         })
//         .catch(errorMessage)
//         .finally(() => setIsLoading(false));
//     },
//   });

//   // Handle edit mode - fetch existing data
//   useEffect(() => {
//     if (
//       id &&
//       companyOptions.length > 0 &&
//       teamOptions.length > 0 &&
//       categoryOptions.length > 0
//     ) {
//       setIsLoading(true);
//       fetchSubCategoryById(id)
//         .then((response) => {
//           const { companyIds, categoryId, teamIds } = response.data;

//           // Match companies
//           const selectedCompanies = companyOptions.filter((opt) =>
//             companyIds.some((id) => parseInt(id) === parseInt(opt.value))
//           );

//           // Match category
//           const selectedCategory = categoryOptions.find(
//             (opt) => parseInt(opt.value) === parseInt(categoryId)
//           );

//           // Match teams
//           const selectedTeams = teamOptions.filter((opt) =>
//             teamIds.some((id) => parseInt(id) === parseInt(opt.value))
//           );

//           formik.setValues({
//             companyId: selectedCompanies,
//             teamId: selectedTeams,
//             categoryInEnglishId: selectedCategory || "",
//             categoryInBanglaId:
//               selectedCategory
//                 ? banglaCategoryOptions.find(
//                     (opt) => opt.value === selectedCategory.value
//                   )?.label
//                 : "",
//             subCategoryInEnglish:
//               response.data.sub_category?.sub_category_in_english || "",
//             subCategoryInBangla:
//               response.data.sub_category?.sub_category_in_bangla || "",
//           });
//         })
//         .catch(errorMessage)
//         .finally(() => setIsLoading(false));
//     }
//   }, [
//     id,
//     companyOptions,
//     teamOptions,
//     categoryOptions,
//     banglaCategoryOptions,
//   ]);

//   // Update Bangla category name when English category changes
//   useEffect(() => {
//     if (formik.values.categoryInEnglishId) {
//       const selectedCategoryId =
//         formik.values.categoryInEnglishId?.value ||
//         formik.values.categoryInEnglishId;
//       const selectedBanglaCategory = banglaCategoryOptions.find(
//         (opt) => opt.value === selectedCategoryId
//       );
//       if (selectedBanglaCategory) {
//         formik.setFieldValue("categoryInBanglaId", selectedBanglaCategory.label);
//       }
//     }
//   }, [formik.values.categoryInEnglishId, banglaCategoryOptions]);

//   // Update category options when company changes
//   useEffect(() => {
//     const companyIds = formik.values.companyId;

//     if (!companyIds || companyIds.length === 0) {
//       setCategoryOptions([]);
//       setBanglaCategoryOptions([]);
//       return;
//     }

//     // Get first selected company ID
//     const firstCompanyId = Array.isArray(companyIds)
//       ? companyIds[0]?.value || companyIds[0]
//       : companyIds;

//     fetchUniqueCategory(firstCompanyId)
//       .then((response) => {
//         setCategoryOptions(
//           response.data.map((option) => ({
//             value: option.id,
//             label: option.category_in_english,
//           }))
//         );
//         setBanglaCategoryOptions(
//           response.data.map((option) => ({
//             value: option.id,
//             label: option.category_in_bangla,
//           }))
//         );
//       })
//       .catch(errorMessage);
//   }, [formik.values.companyId]);

//   return (
//     <div className="row">
//       <div className="col-sm-12 col-md-12 col-lg-12 col-xl-12">
//         <div className="alert alert-secondary p-2" role="alert">
//           <h6>{id ? "Update" : "Create"} Sub Category</h6>
//           <span>
//             <i>Please input the required information.</i>
//           </span>
//         </div>
//       </div>
//       <div className="col-sm-12 col-md-6 col-lg-6 col-xl-6">
//         <form onSubmit={formik.handleSubmit}>
//           <div className="row">
//             <div className="col-12">
//               <div className="input-group mb-3">
//                 <span
//                   className="input-group-text w-25 label-cat-w"
//                   id="basic-addon1"
//                 >
//                   Business Entity
//                 </span>

//                 <SelectDropdown
//                   id="companyId"
//                   placeholder="Select business entities"
//                   options={companyOptions}
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
//                   Category in English
//                 </span>
//                 <SelectDropdown
//                   id="categoryInEnglishId"
//                   placeholder="Select category"
//                   options={categoryOptions}
//                   value={formik.values.categoryInEnglishId}
//                   onChange={(value) =>
//                     formik.setFieldValue("categoryInEnglishId", value)
//                   }
//                   disabled={isLoading}
//                 />
//               </div>
//               {formik.touched.categoryInEnglishId &&
//               formik.errors.categoryInEnglishId ? (
//                 <div className="text-danger">
//                   {formik.errors.categoryInEnglishId}
//                 </div>
//               ) : null}
//             </div>

//             <div className="col-sm-12 col-md-12 col-lg-12 col-xl-12">
//               <div className="input-group mb-3">
//                 <span
//                   className="input-group-text w-25 label-cat-w"
//                   id="basic-addon1"
//                 >
//                   ক্যাটাগরির নাম
//                 </span>
//                 <input
//                   type="text"
//                   className="form-control"
//                   id="categoryInBanglaId"
//                   placeholder="ক্যাটাগরির নাম"
//                   value={formik.values.categoryInBanglaId}
//                   disabled={true}
//                 />
//               </div>
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
//                   onChange={(value) =>
//                     formik.setFieldValue("teamId", value || [])
//                   }
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
//                 <span className="input-group-text w-25" id="basic-addon1">
//                   Sub-category in English
//                 </span>
//                 <input
//                   type="text"
//                   className="form-control"
//                   id="subCategoryInEnglish"
//                   placeholder="Sub-category in English"
//                   value={formik.values.subCategoryInEnglish}
//                   onChange={formik.handleChange}
//                   onBlur={formik.handleBlur}
//                 />
//               </div>
//               {formik.touched.subCategoryInEnglish &&
//               formik.errors.subCategoryInEnglish ? (
//                 <div className="text-danger">
//                   {formik.errors.subCategoryInEnglish}
//                 </div>
//               ) : null}
//             </div>

//             <div className="col-sm-12 col-md-12 col-lg-12 col-xl-12">
//               <div className="input-group mb-3">
//                 <span className="input-group-text w-25" id="basic-addon1">
//                   সাব-ক্যাটাগরির নাম
//                 </span>
//                 <input
//                   type="text"
//                   className="form-control"
//                   id="subCategoryInBangla"
//                   placeholder="সাব-ক্যাটাগরির নাম"
//                   value={formik.values.subCategoryInBangla}
//                   onChange={formik.handleChange}
//                   onBlur={formik.handleBlur}
//                 />
//               </div>
//               {formik.touched.subCategoryInBangla &&
//               formik.errors.subCategoryInBangla ? (
//                 <div className="text-danger">
//                   {formik.errors.subCategoryInBangla}
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
