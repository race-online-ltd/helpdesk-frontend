import React, { useEffect, useState } from "react";
import { useFormik } from "formik";
import { fetchCompany } from "../../api/api-client/settings/companyApi";
import { SelectDropdown } from "../admin/components/SelectDropdown";
import { store, update } from "../../api/api-client/settings/registerApi";
import {
  errorMessage,
  successMessage,
} from "../../api/api-config/apiResponseMessage";
import { fetchAllTeam } from "../../api/api-client/settings/teamApi";

export const Register = ({ id }) => {
  const [options, setOptions] = useState([]);
  const [roleOptions, setRoleOptions] = useState([]);
  const [teamOptions, setTeamOptions] = useState([]);
  const [userType, setUserType] = useState("");
  const [copyButtonText, setCopyButtonText] = useState("Copy");
  const [isLoading, setIsLoading] = useState(false);

  const userTypeOptions = [
    {
      value: "Client",
      label: "Client",
    },
    {
      value: "Agent",
      label: "Agent",
    },
  ];

  useEffect(() => {
    setIsLoading(true);

    const fetchBusinessEntityOptions = () => {
      fetchCompany().then((response) => {
        setOptions(
          response.result.map((option) => ({
            value: option.id,
            label: option.company_name,
          }))
        );
      });
    };

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

    const fetchRoleOptions = () => {
      fetchCompany().then((response) => {
        setRoleOptions(
          response.result.map((option) => ({
            value: option.id,
            label: option.company_name,
          }))
        );
      });
    };

    Promise.all([
      fetchBusinessEntityOptions(),
      fetchRoleOptions(),
      fetchTeamOptions(),
    ])
      .catch(errorMessage)
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  const generateRandomSixDigitPassword = () => {
    return Math.floor(100000 + Math.random() * 900000);
  };

  const handleCopyPassword = (copyValue) => {
    navigator.clipboard
      .writeText(copyValue)
      .then(() => {
        setCopyButtonText("Copied");
        setTimeout(() => {
          setCopyButtonText("Copy");
        }, 5000);
      })
      .catch((err) => {
        console.error("Failed to copy password: ", err);
      });
  };

  const formik = useFormik({
    initialValues: {
      userType: "",
      businessEntity: [],
      client: "",
      team: [],
      fullName: "",
      primaryEmail: "",
      secondaryEmail: "",
      primaryPhone: "",
      secondaryPhone: "",
      role: "",
      defaultBusinessEntity: "",
      userName: "",
      password: generateRandomSixDigitPassword(),
      lock: false,
      status: true,
    },
    // validationSchema: categoryValidationSchema,
    onSubmit: (values, { resetForm }) => {
      console.log(values);
      setIsLoading(true);
      const apiCall = id ? update(id, values) : store(values);
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

  // useEffect(() => {
  //   if (id) {
  //     setIsLoading(true);
  //     fetchCategoryById(id)
  //       .then((response) => {
  //         const teamOptions = response.data.category_team.map((team) => ({
  //           value: team.team_id,
  //         }));
  //         formik.setValues({
  //           companyId: response.data.category.company_id || "",
  //           teamId: teamOptions.map((option) => option.value),
  //           categoryInEnglish: response.data.category.category_in_english || "",
  //           categoryInBangla: response.data.category.category_in_bangla || "",
  //         });
  //       })
  //       .catch(errorMessage)
  //       .finally(() => {
  //         setIsLoading(false);
  //       });
  //   }
  // }, [id]);

  return (
    <div className='row'>
      <div className='col-sm-12 col-md-12 col-lg-12 col-xl-12'>
        <div class='alert alert-secondary p-2' role='alert'>
          <h6>Create New User</h6>
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
                <span class='input-group-text w-25 label-cat-w'>Type</span>

                <SelectDropdown
                  id='userType'
                  placeholder='User type'
                  options={userTypeOptions}
                  value={formik.values.userType}
                  onChange={(value) => {
                    formik.setFieldValue("userType", value);
                    setUserType(value);
                  }}
                  disabled={isLoading}
                />
              </div>
              {formik.touched.userType && formik.errors.userType ? (
                <div className='text-danger'>{formik.errors.userType}</div>
              ) : null}
            </div>
            <div className='col-sm-12 col-md-12 col-lg-12 col-xl-12'>
              <div class='input-group mb-3'>
                <span
                  class='input-group-text w-25 label-cat-w'
                  id='basic-addon1'>
                  Business Entity
                </span>

                <SelectDropdown
                  id='businessEntity'
                  placeholder='Business entity'
                  options={options}
                  value={formik.values.businessEntity}
                  onChange={(value) =>
                    formik.setFieldValue("businessEntity", value)
                  }
                  disabled={isLoading}
                  isMulti={true}
                />
              </div>
              {formik.touched.businessEntity && formik.errors.businessEntity ? (
                <div className='text-danger'>
                  {formik.errors.businessEntity}
                </div>
              ) : null}
            </div>
            {userType === "Client" && (
              <div className='col-sm-12 col-md-12 col-lg-12 col-xl-12'>
                <div class='input-group mb-3'>
                  <span class='input-group-text w-25 label-cat-w'>Client</span>
                  <SelectDropdown
                    id='client'
                    placeholder='Client'
                    options={options}
                    value={formik.values.client}
                    onChange={(value) => formik.setFieldValue("client", value)}
                    disabled={isLoading}
                  />
                </div>
                {formik.touched.client && formik.errors.client ? (
                  <div className='text-danger'>{formik.errors.client}</div>
                ) : null}
              </div>
            )}

            {userType === "Agent" && (
              <div className='col-sm-12 col-md-12 col-lg-12 col-xl-12'>
                <div class='input-group mb-3'>
                  <span
                    class='input-group-text w-25 label-cat-w'
                    id='basic-addon1'>
                    Team
                  </span>

                  <SelectDropdown
                    id='team'
                    placeholder='Team'
                    options={teamOptions}
                    value={formik.values.team}
                    onChange={(value) => formik.setFieldValue("team", value)}
                    disabled={isLoading}
                    isMulti={true}
                  />
                </div>
                {formik.touched.team && formik.errors.team ? (
                  <div className='text-danger'>{formik.errors.team}</div>
                ) : null}
              </div>
            )}

            <div className='col-sm-12 col-md-12 col-lg-12 col-xl-12'>
              <div class='input-group mb-3'>
                <span class='input-group-text w-25'>Email </span>
                <input
                  type='email'
                  id='primaryEmail'
                  class='form-control'
                  placeholder='Primary'
                  value={formik.values.primaryEmail}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
              </div>
              {formik.touched.primaryEmail && formik.errors.primaryEmail ? (
                <div className='text-danger'>{formik.errors.primaryEmail}</div>
              ) : null}
            </div>
            <div className='col-sm-12 col-md-12 col-lg-12 col-xl-12'>
              <div class='input-group mb-3'>
                <span class='input-group-text w-25'>
                  Email <small className='ms-2'>Optional</small>
                </span>
                <input
                  type='email'
                  id='secondaryEmail'
                  class='form-control'
                  placeholder='Secondary'
                  value={formik.values.secondaryEmail}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
              </div>
              {formik.touched.secondaryEmail && formik.errors.secondaryEmail ? (
                <div className='text-danger'>
                  {formik.errors.secondaryEmail}
                </div>
              ) : null}
            </div>

            <div className='col-sm-12 col-md-12 col-lg-12 col-xl-12'>
              <div class='input-group mb-3'>
                <span class='input-group-text w-25'>Phone </span>
                <input
                  type='text'
                  id='primaryPhone'
                  class='form-control'
                  placeholder='Primary'
                  value={formik.values.primaryPhone}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
              </div>
              {formik.touched.primaryPhone && formik.errors.primaryPhone ? (
                <div className='text-danger'>{formik.errors.primaryPhone}</div>
              ) : null}
            </div>
            <div className='col-sm-12 col-md-12 col-lg-12 col-xl-12'>
              <div class='input-group mb-3'>
                <span class='input-group-text w-25'>
                  Phone <small className='ms-2'>Optional</small>
                </span>
                <input
                  type='text'
                  id='secondaryPhone'
                  class='form-control'
                  placeholder='Secondary'
                  value={formik.values.secondaryPhone}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
              </div>
              {formik.touched.secondaryPhone && formik.errors.secondaryPhone ? (
                <div className='text-danger'>
                  {formik.errors.secondaryPhone}
                </div>
              ) : null}
            </div>

            <div className='col-sm-12 col-md-12 col-lg-12 col-xl-12'>
              <div class='input-group mb-3'>
                <span
                  class='input-group-text w-25 label-cat-w'
                  id='basic-addon1'>
                  Role
                </span>

                <SelectDropdown
                  id='role'
                  placeholder='Role'
                  options={options}
                  value={formik.values.role}
                  onChange={(value) => formik.setFieldValue("role", value)}
                  disabled={isLoading}
                />
              </div>
              {formik.touched.role && formik.errors.role ? (
                <div className='text-danger'>{formik.errors.role}</div>
              ) : null}
            </div>

            {userType === "Agent" && (
              <div className='col-sm-12 col-md-12 col-lg-12 col-xl-12'>
                <div class='input-group mb-3'>
                  <span
                    class='input-group-text w-25 label-cat-w'
                    id='basic-addon1'>
                    Default Entity
                  </span>

                  <SelectDropdown
                    id='defaultBusinessEntity'
                    placeholder='Default business entity'
                    options={options}
                    value={formik.values.defaultBusinessEntity}
                    onChange={(value) =>
                      formik.setFieldValue("defaultBusinessEntity", value)
                    }
                    disabled={isLoading}
                  />
                </div>
                {formik.touched.defaultBusinessEntity &&
                formik.errors.defaultBusinessEntity ? (
                  <div className='text-danger'>
                    {formik.errors.defaultBusinessEntity}
                  </div>
                ) : null}
              </div>
            )}

            <div className='col-sm-12 col-md-12 col-lg-12 col-xl-12'>
              <div class='input-group mb-3'>
                <span class='input-group-text w-25'>Username</span>
                <input
                  type='text'
                  id='userName'
                  class='form-control'
                  placeholder='Username'
                  value={formik.values.userName}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
              </div>
              {formik.touched.userName && formik.errors.userName ? (
                <div className='text-danger'>{formik.errors.userName}</div>
              ) : null}
            </div>
            <div className='col-sm-12 col-md-12 col-lg-12 col-xl-12'>
              <div class='input-group mb-3'>
                <span class='input-group-text w-25'>Password</span>
                <input
                  type='text'
                  id='password'
                  class='form-control'
                  placeholder='Password'
                  value={formik.values.password}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  disabled={true}
                />
                <button
                  className='bg-white ms-2 rounded px-2'
                  type='button'
                  onClick={() => handleCopyPassword(formik.values.password)}>
                  {copyButtonText}
                </button>
              </div>
              {formik.touched.password && formik.errors.password ? (
                <div className='text-danger'>{formik.errors.password}</div>
              ) : null}
            </div>
            <div className='col-sm-12 col-md-12 col-lg-12 col-xl-12'>
              <div className='d-flex justify-content-start'>
                <div className='form-check me-3'>
                  <input
                    className='form-check-input bordered'
                    type='checkbox'
                    id='lock'
                    checked={formik.values.lock}
                    onChange={(e) => {
                      formik.setFieldValue("lock", e.target.checked);
                    }}
                  />
                  <label className='form-check-label fw-bold' htmlFor='lock'>
                    Lock
                  </label>
                </div>
                <div className='form-check'>
                  <input
                    className='form-check-input bordered'
                    type='checkbox'
                    id='status'
                    checked={formik.values.status}
                    onChange={(e) => {
                      formik.setFieldValue("status", e.target.checked);
                    }}
                  />
                  <label className='form-check-label fw-bold' htmlFor='status'>
                    Active
                  </label>
                </div>
              </div>
            </div>

            <div className='text-end'>
              <button type='submit' className='custom-btn'>
                Save
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
