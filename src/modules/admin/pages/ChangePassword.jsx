import React, { useContext, useEffect, useState } from "react";
import { useFormik } from "formik";
import { ToastContainer } from "react-toastify";
import { changePasswordSchema } from "../../../schema/ValidationSchemas";
import { changePassword } from "../../../api/api-client/userApi";
import {
  errorMessage,
  successMessage,
} from "../../../api/api-config/apiResponseMessage";
import { userContext } from "../../context/UserContext";
import { useNavigate } from "react-router-dom";

export const ChangePassword = () => {
  const { user } = useContext(userContext);
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    formik.setFieldValue("id", user?.id);
  }, [user]);

  const formik = useFormik({
    initialValues: {
      id: "",
      // oldPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
    validationSchema: changePasswordSchema,
    onSubmit: async (values) => {
      setIsLoading(true);
      changePassword(values)
        .then((response) => {
          navigate("/");
        })
        .catch(errorMessage)
        .finally(() => {
          setIsLoading(false);
        });
    },
  });

  return (
    <section>
      <div className='container-fluid'>
        <div
          className='row d-flex justify-content-center align-items-center'
          style={{ height: "100vh" }}>
          <div className='col-sm-12 col-md-5 col-lg-5 col-xl-5'>
            <div className='custom-card'>
              <h6 className='custom-card-header'>Change Password</h6>
              <div className='p-3'>
                <form onSubmit={formik.handleSubmit} className='row'>
                  <div className='col-12'>
                    <div className='row'>
                      {/* <div className='col-12'>
                        <div
                          className={`input-group mb-3 ${
                            formik.touched.oldPassword &&
                            formik.errors.oldPassword
                              ? "is-invalid"
                              : ""
                          }`}>
                          <span
                            className='input-group-text w-25 label-w'
                            id='inputGroup-sizing-sm'>
                            Old Password
                          </span>
                          <input
                            type='password'
                            id='oldPassword'
                            name='oldPassword'
                            placeholder='Old password'
                            className={`form-control ${
                              formik.touched.oldPassword &&
                              formik.errors.oldPassword
                                ? "is-invalid"
                                : ""
                            }`}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            value={formik.values.oldPassword}
                          />
                          {formik.touched.oldPassword &&
                          formik.errors.oldPassword ? (
                            <div className='invalid-feedback'>
                              {formik.errors.oldPassword}
                            </div>
                          ) : null}
                        </div>
                      </div> */}

                      <div className='col-12'>
                        <div
                          className={`input-group mb-3 ${
                            formik.touched.newPassword &&
                            formik.errors.newPassword
                              ? "is-invalid"
                              : ""
                          }`}>
                          <span
                            className='input-group-text w-25 label-w'
                            id='inputGroup-sizing-sm'>
                            New Password
                          </span>
                          <input
                            type='password'
                            id='newPassword'
                            name='newPassword'
                            placeholder='New password'
                            className={`form-control ${
                              formik.touched.newPassword &&
                              formik.errors.newPassword
                                ? "is-invalid"
                                : ""
                            }`}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            value={formik.values.newPassword}
                          />
                          {formik.touched.newPassword &&
                          formik.errors.newPassword ? (
                            <div className='invalid-feedback'>
                              {formik.errors.newPassword}
                            </div>
                          ) : null}
                        </div>
                      </div>
                      <div className='col-12'>
                        <div
                          className={`input-group mb-3 ${
                            formik.touched.confirmPassword &&
                            formik.errors.confirmPassword
                              ? "is-invalid"
                              : ""
                          }`}>
                          <span
                            className='input-group-text w-25 label-w'
                            id='inputGroup-sizing-sm'>
                            Retype Password
                          </span>
                          <input
                            type='password'
                            id='confirmPassword'
                            name='confirmPassword'
                            placeholder='Retype password'
                            className={`form-control ${
                              formik.touched.confirmPassword &&
                              formik.errors.confirmPassword
                                ? "is-invalid"
                                : ""
                            }`}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            value={formik.values.confirmPassword}
                          />
                          {formik.touched.confirmPassword &&
                          formik.errors.confirmPassword ? (
                            <div className='invalid-feedback'>
                              {formik.errors.confirmPassword}
                            </div>
                          ) : null}
                        </div>
                      </div>
                      <div className='col-12'>
                        <div className='text-end'>
                          <button type='submit' className='custom-btn'>
                            Save
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
      <ToastContainer />
    </section>
  );
};
