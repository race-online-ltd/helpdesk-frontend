import React, { useContext, useEffect, useState } from "react";
import { useFormik } from "formik";
import {
  categoryValidationSchema,
  elementListValidationSchema,
} from "../../../../schema/ValidationSchemas";
import { SelectDropdown } from "./../SelectDropdown";
import { userContext } from "../../../context/UserContext";
import {
  errorMessage,
  successMessage,
} from "../../../../api/api-config/apiResponseMessage";
import {
  fetchElement,
  storeElementList,
  updateElementList,
} from "../../../../api/api-client/settings/networkBackboneApi";

export const AddNewElementList = ({ id }) => {
  const { user } = useContext(userContext);
  const [elementOptions, setElementOptions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setIsLoading(true);
    const fetchElementOptions = () => {
      fetchElement().then((response) => {
        setElementOptions(
          response.data.map((option) => ({
            value: option.id,
            label: option.name,
          }))
        );
      });
    };

    Promise.all([fetchElementOptions()])
      .catch(errorMessage)
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  const formik = useFormik({
    initialValues: {
      elementName: "",
      elementList: "",
    },
    validationSchema: elementListValidationSchema,
    onSubmit: (values, { resetForm }) => {
      setIsLoading(true);
      const apiCall = id
        ? updateElementList(id, values)
        : storeElementList(values);
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

  //   useEffect(() => {
  //     if (id) {
  //       setIsLoading(true);
  //       fetchCategoryById(id)
  //         .then((response) => {
  //           const teamOptions = response.data.category_team.map((team) => ({
  //             value: team.team_id,
  //           }));
  //           formik.setValues({
  //             companyId: response.data.category.company_id || "",
  //             teamId: teamOptions.map((option) => option.value),
  //             categoryInEnglish: response.data.category.category_in_english || "",
  //             categoryInBangla: response.data.category.category_in_bangla || "",
  //           });
  //         })
  //         .catch(errorMessage)
  //         .finally(() => {
  //           setIsLoading(false);
  //         });
  //     }
  //   }, [id]);

  return (
    <div className='row'>
      <div className='col-sm-12 col-md-12 col-lg-12 col-xl-12'>
        <div class='alert alert-secondary p-2' role='alert'>
          <h6>{id ? "Update" : "Create"} Element List</h6>
          <span>
            <i>Please input the required information.</i>
          </span>
        </div>
      </div>
      <div className='col-sm-12 col-md-6 col-lg-6 col-xl-6'>
        <form onSubmit={formik.handleSubmit}>
          <div className='row'>
            <div className='col-sm-12 col-md-12 col-lg-12 col-xl-12'>
              <div class='input-group mb-3'>
                <span
                  class='input-group-text w-25 label-cat-w'
                  id='basic-addon1'>
                  Element
                </span>

                <SelectDropdown
                  id='elementName'
                  placeholder='Select Element'
                  options={elementOptions}
                  value={formik.values.elementName}
                  onChange={(value) =>
                    formik.setFieldValue("elementName", value)
                  }
                  disabled={isLoading}
                />
              </div>
              {formik.touched.elementName && formik.errors.elementName ? (
                <div className='text-danger'>{formik.errors.elementName}</div>
              ) : null}
            </div>

            <div className='col-sm-12 col-md-12 col-lg-12 col-xl-12'>
              <div class='input-group mb-3'>
                <span
                  class='input-group-text w-25 label-cat-w'
                  id='basic-addon1'>
                  Element List
                </span>
                <input
                  type='text'
                  class='form-control'
                  id='elementList'
                  placeholder='Enter element name'
                  value={formik.values.elementList}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
              </div>
              {formik.touched.elementList && formik.errors.elementList ? (
                <div className='text-danger'>{formik.errors.elementList}</div>
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
