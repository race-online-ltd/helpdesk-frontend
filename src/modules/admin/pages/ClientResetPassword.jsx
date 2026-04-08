import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import * as Yup from "yup";
import { errorMessage } from "../../../api/api-config/apiResponseMessage";
import { useFormik } from "formik";
import { clientResetPassword } from "../../../api/api-client/utilityApi";

export const ClientResetPassword = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  console.log("ID:", id);
  const formik = useFormik({
    initialValues: {
      userId: id || "",
      password: "",
    },
    validationSchema: Yup.object({
      userId: Yup.number()
        .typeError("User ID must be a number")
        .required("User ID is required"),
      password: Yup.string()
        .min(6, "Password must be at least 6 characters")
        .required("Password is required"),
    }),
    onSubmit: (values, { resetForm }) => {
      setIsLoading(true);
      clientResetPassword(values)
        .then((response) => {
          navigate("/admin/settings");
        })
        .catch(errorMessage)
        .finally(() => {
          setIsLoading(false);
          resetForm();
        });
    },
  });

  return (
    <div className='container-fluid'>
      <div className='row'>
        <div className='col-sm-12 col-md-12 col-lg-12 col-xl-12'>
          <div className='alert alert-secondary p-2' role='alert'>
            <h6>Reset Password</h6>
            <span>
              <i>Please input the required information.</i>
            </span>
          </div>
        </div>
      </div>
      <form onSubmit={formik.handleSubmit} className='row'>
        <div className='col-sm-12 col-md-6 col-lg-6 col-xl-6'>
          <div className='input-group mb-3'>
            <span className='input-group-text w-25'>Password</span>
            <input
              type='text'
              id='password'
              className='form-control'
              placeholder='Password'
              value={formik.values.password}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
          </div>
          {formik.touched.password && formik.errors.password ? (
            <div className='text-danger'>{formik.errors.password}</div>
          ) : null}
        </div>
        <div className='col-sm-12 col-md-6 col-lg-6 col-xl-6'>
          <button type='submit' className='custom-btn'>
            {isLoading ? "Resetting..." : "Reset"}
          </button>
        </div>
      </form>
    </div>
  );
};
