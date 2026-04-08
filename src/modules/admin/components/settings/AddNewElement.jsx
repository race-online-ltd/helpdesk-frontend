import React, { useEffect, useState } from "react";
import { useFormik } from "formik";
import { elementValidationSchema } from "../../../../schema/ValidationSchemas";

import {
  errorMessage,
  successMessage,
} from "../../../../api/api-config/apiResponseMessage";
import {
  storeElement,
  updateElement,
} from "../../../../api/api-client/settings/networkBackboneApi";

export const AddNewElement = ({ id }) => {
  const [isLoading, setIsLoading] = useState(false);

  const formik = useFormik({
    initialValues: {
      elementName: "",
    },
    validationSchema: elementValidationSchema,
    onSubmit: (values, { resetForm }) => {
      setIsLoading(true);
      const apiCall = id ? updateElement(id, values) : storeElement(values);
      apiCall
        .then((response) => {
          resetForm();
          successMessage(response);
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
  //       fetchDepartmentById(id)
  //         .then((response) => {
  //           formik.setValues({
  //             departmentName: response.result.department_name || "",
  //           });
  //           setIsLoading(false);
  //         })
  //         .catch((error) => {
  //           setIsLoading(false);
  //           toast.error(
  //             error.response?.data?.message || "Error fetching company data",
  //             {
  //               position: "top-right",
  //             }
  //           );
  //         });
  //     }
  //   }, [id]);

  return (
    <div className='row'>
      <div className='col-sm-12 col-md-12 col-lg-12 col-xl-12'>
        <div class='alert alert-secondary p-2' role='alert'>
          <h6>{id ? "Update" : "Create"} Element</h6>
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
                <span class='input-group-text w-25' id='basic-addon1'>
                  Element
                </span>
                <input
                  type='text'
                  class='form-control'
                  id='elementName'
                  placeholder='Enter name'
                  value={formik.values.elementName}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
              </div>
              {formik.touched.elementName && formik.errors.elementName ? (
                <div className='text-danger'>{formik.errors.elementName}</div>
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
