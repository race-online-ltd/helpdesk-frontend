import React, { useContext, useState } from 'react';
import { useFormik } from 'formik';
import { faHeadSetLoginIcon, faLockIcon, faUserIcon } from '../../data/data';
import { loginSchema } from './../../schema/ValidationSchemas';
import { useNavigate } from 'react-router-dom';
import { authenticateUser } from '../../api/api-client/userApi';
import { errorMessage } from '../../api/api-config/apiResponseMessage';
import { userContext } from '../context/UserContext';
import { encryptData } from '../../utils/cryptoUtils';
import { ToastContainer } from 'react-toastify';
import logo1 from '../../assets/48x48_Orbit-Final-Logo.png';
import logo2 from '../../assets/72x72_Orbit-Final-Logo.png';
import orbitLogo from '../../assets/orbit.png';

export const Login = () => {
  const { user, setUser } = useContext(userContext);
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const formik = useFormik({
    initialValues: {
      username: '',
      password: '',
    },
    validationSchema: loginSchema,
    onSubmit: async (values, { resetForm }) => {
      setIsLoading(true);
      authenticateUser(values)
        .then((response) => {
          const { password_change } = response.data;
          const encryptedUserData = encryptData(response.data);
          setUser(response.data);
          localStorage.setItem('user', encryptedUserData);
          localStorage.setItem('token', response.token);

          const shouldNavigateToChangePassword =
            response.message === 'customer' || password_change === 1;

          navigate(shouldNavigateToChangePassword ? '/change-password' : '/admin/tickets');

          resetForm();
        })
        .catch(errorMessage)
        .finally(() => {
          setIsLoading(false);
        });
    },
  });

  return (
    <section className="d-flex flex-column min-vh-100">
      <div className="container d-flex flex-grow-1 align-items-center justify-content-center">
        <div className="col col-md-5">
          <div className="custom-card rounded-lg shadow-lg">
            <div className="custom-card-header d-flex justify-content-center align-items-center p-4 rounded-t-lg">
              {/* <h5 className='mb-0 me-2'>{faHeadSetLoginIcon}</h5>{" "} */}
              <img src={orbitLogo} alt="logo" height="40px" width="60px" className="logo me-2" />
              <h5 className="mt-3">HelpDesk</h5>
            </div>
            <div className="p-5">
              <form className="row g-3" onSubmit={formik.handleSubmit}>
                <div className="col-12">
                  <div className="input-group mb-2">
                    <span className="input-group-text rounded-l-md" id="basic-addon1">
                      {faUserIcon}
                    </span>
                    <input
                      type="text"
                      className={`form-control rounded-r-md ${
                        formik.touched.username && formik.errors.username ? 'is-invalid' : ''
                      }`}
                      placeholder="Username"
                      name="username"
                      value={formik.values.username}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                    />
                    {formik.touched.username && formik.errors.username ? (
                      <div className="invalid-feedback">{formik.errors.username}</div>
                    ) : null}
                  </div>
                </div>
                <div className="col-12">
                  <div className="input-group mb-2">
                    <span className="input-group-text rounded-l-md" id="basic-addon1">
                      {faLockIcon}
                    </span>
                    <input
                      type="password"
                      className={`form-control rounded-r-md ${
                        formik.touched.password && formik.errors.password ? 'is-invalid' : ''
                      }`}
                      placeholder="Password"
                      name="password"
                      value={formik.values.password}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                    />
                    {formik.touched.password && formik.errors.password ? (
                      <div className="invalid-feedback">{formik.errors.password}</div>
                    ) : null}
                  </div>
                </div>
                <div className="col-12">
                  <button
                    type="submit"
                    className="custom-btn w-100 btn btn-primary rounded-md py-2"
                    disabled={isLoading}
                  >
                    {isLoading ? 'Logging in...' : 'Login'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
      <div className="text-center py-3">
        <small>© Copyright {new Date().getFullYear()}. ORBIT (A Brand Of Race Online Ltd.)</small>
      </div>
      <ToastContainer />
    </section>
  );
};
