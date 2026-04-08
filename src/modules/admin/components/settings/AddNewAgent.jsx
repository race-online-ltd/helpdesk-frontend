import React, { useContext, useEffect, useState } from "react";
import { useFormik } from "formik";
import { agentValidationSchema } from "../../../../schema/ValidationSchemas";
import {
  fetchAgentById,
  store,
  update,
} from "../../../../api/api-client/settings/agentApi";
import {
  errorMessage,
  successMessage,
} from "../../../../api/api-config/apiResponseMessage";
import { SelectDropdown } from "../SelectDropdown";
import { fetchCompany } from "../../../../api/api-client/settings/companyApi";
import { fetchAllTeam } from "../../../../api/api-client/settings/teamApi";

import { userContext } from "../../../context/UserContext";
import {
  fetchDefaultAgentRole,
  fetchRole,
} from "../../../../api/api-client/settings/roleApi";

export const AddNewAgent = ({ id }) => {
  const { user } = useContext(userContext);
  const [options, setOptions] = useState([]);
  const [teamOptions, setTeamOptions] = useState([]);
  const [defaultRoleOptions, setDefaultRoleOptions] = useState([]);
  const [roleOptions, setRoleOptions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isRoleDisabled, setIsRoleDisabled] = useState(true);

  useEffect(() => {
    setIsLoading(true);
    const fetchBusinessEntityOptions = () => {
      fetchCompany({
        userType: user?.type,
        userId: user?.id,
      }).then((response) => {
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

    const fetchDefaultroleOptions = () => {
      fetchDefaultAgentRole().then((response) => {
        console.log(response.data);
        setDefaultRoleOptions(
          response.data.map((option) => ({
            value: option.id,
            label: option.name,
          }))
        );
      });
    };

    const fetchRoleOptions = () => {
      fetchRole().then((response) => {
        setRoleOptions(
          response.data.map((option) => ({
            value: option.id,
            label: option.name,
          }))
        );
      });
    };

    Promise.all([
      fetchBusinessEntityOptions(),
      fetchTeamOptions(),
      fetchDefaultroleOptions(),
      fetchRoleOptions(),
    ])
      .catch(errorMessage)
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  useEffect(() => {
    if (id) {
      return;
    }
    if (defaultRoleOptions.length > 0) {
      formik.setFieldValue("role", defaultRoleOptions[0].value);
    }
  }, [defaultRoleOptions]);

  useEffect(() => {
    if (id) {
      setIsLoading(true);
      fetchAgentById(id)
        .then((response) => {
          const {
            teams,
            fullname,
            email_primary,
            email_secondary,
            mobile_primary,
            mobile_secondary,
            default_entity_id,
            role_id,
            user_type,
            username,
            lock,
            status,
          } = response.data;

          formik.setValues({
            userType: user_type || "",
            teams: teams.map((team) => parseInt(team.team_id)),
            fullName: fullname || "",
            primaryEmail: email_primary || "",
            secondaryEmail: email_secondary || "",
            primaryPhone: mobile_primary || "",
            secondaryPhone: mobile_secondary || "",
            defaultBusinessEntity: default_entity_id || "",
            role: role_id || "",
            userName: username || "",
            password: "",
            lock: lock,
            status: status,
          });

          setIsRoleDisabled(false);
        })
        .catch(errorMessage)
        .finally(() => {
          setIsLoading(false);
        });
    } else {
      setIsRoleDisabled(true);
    }
  }, [id]);

  const formik = useFormik({
    initialValues: {
      userType: "Agent",
      teams: [],
      fullName: "",
      primaryEmail: "",
      secondaryEmail: "",
      primaryPhone: "",
      secondaryPhone: "",
      defaultBusinessEntity: "",
      role: "",
      userName: "",
      password: "",
      lock: false,
      status: true,
    },
    validationSchema: agentValidationSchema,
    onSubmit: (values, { resetForm }) => {
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
          if (defaultRoleOptions.length > 0) {
            formik.setFieldValue("role", defaultRoleOptions[0].value);
          }
        });
    },
  });

  return (
    <div className='row'>
      <div className='col-sm-12 col-md-12 col-lg-12 col-xl-12'>
        <div className='alert alert-secondary p-2' role='alert'>
          <h6>{id ? "Update " : "Create "}Agent</h6>
          <span>
            <i>Please input the required information.</i>
          </span>
        </div>
      </div>
      <div className='col-sm-12 col-md-12 col-lg-12 col-xl-12'>
        <form onSubmit={formik.handleSubmit} className='h-100'>
          <div className='row'>
            <div className='col-sm-12 col-md-6 col-lg-6 col-xl-6'>
              <div className='input-group mb-3'>
                <span className='input-group-text w-25 label-cat-w'>Teams</span>
                <SelectDropdown
                  id='teams'
                  placeholder='Teams'
                  options={teamOptions}
                  value={formik.values.teams}
                  onChange={(value) => formik.setFieldValue("teams", value)}
                  disabled={isLoading}
                  isMulti={true}
                />
              </div>
              {formik.touched.teams && formik.errors.teams ? (
                <div className='text-danger'>{formik.errors.teams}</div>
              ) : null}
            </div>

            <div className='col-sm-12 col-md-6 col-lg-6 col-xl-6'>
              <div className='input-group mb-3'>
                <span className='input-group-text w-25'>Full name </span>
                <input
                  type='text'
                  id='fullName'
                  className='form-control'
                  placeholder='Full name'
                  value={formik.values.fullName}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
              </div>
              {formik.touched.fullName && formik.errors.fullName ? (
                <div className='text-danger'>{formik.errors.fullName}</div>
              ) : null}
            </div>

            <div className='col-sm-12 col-md-6 col-lg-6 col-xl-6'>
              <div className='input-group mb-3'>
                <span
                  className='input-group-text w-25 label-cat-w'
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
            <div className='col-sm-12 col-md-6 col-lg-6 col-xl-6'>
              <div className='input-group mb-3'>
                <span className='input-group-text w-25'>Email </span>
                <input
                  type='email'
                  id='primaryEmail'
                  className='form-control'
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
            <div className='col-sm-12 col-md-6 col-lg-6 col-xl-6'>
              <div className='input-group mb-3'>
                <span
                  className='input-group-text w-25 label-cat-w'
                  id='basic-addon1'>
                  {`${id ? "Role" : "Default role"}`}
                </span>

                <SelectDropdown
                  id='role'
                  placeholder={`${id ? "Role" : "Default role"}`}
                  options={id ? roleOptions : defaultRoleOptions}
                  value={formik.values.role}
                  onChange={(value) => formik.setFieldValue("role", value)}
                  disabled={isRoleDisabled}
                />
              </div>
              {formik.touched.role && formik.errors.role ? (
                <div className='text-danger'>{formik.errors.role}</div>
              ) : null}
            </div>
            <div className='col-sm-12 col-md-6 col-lg-6 col-xl-6'>
              <div className='input-group mb-3'>
                <span className='input-group-text w-25'>
                  Email <small className='ms-2'>(optional)</small>
                </span>
                <input
                  type='email'
                  id='secondaryEmail'
                  className='form-control'
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

            <div className='col-sm-12 col-md-6 col-lg-6 col-xl-6'>
              <div className='input-group mb-3'>
                <span className='input-group-text w-25'>Username</span>
                <input
                  type='text'
                  id='userName'
                  className='form-control'
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
            <div className='col-sm-12 col-md-6 col-lg-6 col-xl-6'>
              <div className='input-group mb-3'>
                <span className='input-group-text w-25'>Phone </span>
                <input
                  type='text'
                  id='primaryPhone'
                  className='form-control'
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
              <div className='input-group mb-3'>
                <span className='input-group-text w-25'>
                  Phone <small className='ms-2'>(optional)</small>
                </span>
                <input
                  type='text'
                  id='secondaryPhone'
                  className='form-control'
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
              <div className='d-flex justify-content-between'>
                <div className='d-flex'>
                  
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
                    <label className='form-check-label' htmlFor='status'>
                      Active
                    </label>
                  </div>
                </div>
                <div>
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
  );
};
