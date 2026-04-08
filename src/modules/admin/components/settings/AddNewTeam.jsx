import { useFormik } from 'formik';
import React, { useEffect, useState } from 'react';
import { teamValidationSchema } from '../../../../schema/ValidationSchemas';
import { fetchTeamById, store, update } from '../../../../api/api-client/settings/teamApi';
import { toast } from 'react-toastify';
import { SelectDropdown } from '../SelectDropdown';
import { fetchDepartment } from '../../../../api/api-client/settings/departmentApi';
import { errorMessage, successMessage } from '../../../../api/api-config/apiResponseMessage';
import { fetchDivision } from '../../../../api/api-client/settings/divisionApi';
import { fetchAgentOptions } from '../../../../api/api-client/settings/agentApi';

export const AddNewTeam = ({ id }) => {
  const [options, setOptions] = useState([]);
  const [divisionOptions, setDivisionOptions] = useState([]);
  const [agentOptions, setAgentOptions] = useState([]);

  const [idleStartHourOptions, setIdleStartHourOptions] = useState([
    { value: 0, label: 0 },
    { value: 1, label: 1 },
    { value: 2, label: 2 },
    { value: 3, label: 3 },
    { value: 4, label: 4 },
    { value: 5, label: 5 },
    { value: 6, label: 6 },
    { value: 7, label: 7 },
    { value: 8, label: 8 },
    { value: 9, label: 9 },
    { value: 10, label: 10 },
    { value: 11, label: 11 },
    { value: 12, label: 12 },
    { value: 13, label: 13 },
    { value: 14, label: 14 },
    { value: 15, label: 15 },
    { value: 16, label: 16 },
    { value: 17, label: 17 },
    { value: 18, label: 18 },
    { value: 19, label: 19 },
    { value: 20, label: 20 },
    { value: 21, label: 21 },
    { value: 22, label: 22 },
    { value: 23, label: 23 },
  ]);
  const [idleStartMinuteOptions, setIdleStartMinuteOptions] = useState([
    { value: 0, label: 0 },
    { value: 5, label: 5 },
    { value: 10, label: 10 },
    { value: 15, label: 15 },
    { value: 20, label: 20 },
    { value: 25, label: 25 },
    { value: 30, label: 30 },
    { value: 35, label: 35 },
    { value: 40, label: 40 },
    { value: 45, label: 45 },
    { value: 50, label: 50 },
    { value: 55, label: 55 },
  ]);

  const [idleEndHourOptions, setIdleEndHourOptions] = useState([
    { value: 0, label: 0 },
    { value: 1, label: 1 },
    { value: 2, label: 2 },
    { value: 3, label: 3 },
    { value: 4, label: 4 },
    { value: 5, label: 5 },
    { value: 6, label: 6 },
    { value: 7, label: 7 },
    { value: 8, label: 8 },
    { value: 9, label: 9 },
    { value: 10, label: 10 },
    { value: 11, label: 11 },
    { value: 12, label: 12 },
    { value: 13, label: 13 },
    { value: 14, label: 14 },
    { value: 15, label: 15 },
    { value: 16, label: 16 },
    { value: 17, label: 17 },
    { value: 18, label: 18 },
    { value: 19, label: 19 },
    { value: 20, label: 20 },
    { value: 21, label: 21 },
    { value: 22, label: 22 },
    { value: 23, label: 23 },
  ]);
  const [idleEndMinuteOptions, setIdleEndMinuteOptions] = useState([
    { value: 0, label: 0 },
    { value: 5, label: 5 },
    { value: 10, label: 10 },
    { value: 15, label: 15 },
    { value: 20, label: 20 },
    { value: 25, label: 25 },
    { value: 30, label: 30 },
    { value: 35, label: 35 },
    { value: 40, label: 40 },
    { value: 45, label: 45 },
    { value: 50, label: 50 },
    { value: 55, label: 55 },
  ]);

  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setIsLoading(true);
    const fetchDepartmentOptions = () => {
      fetchDepartment().then((response) => {
        setOptions(
          response.result.map((option) => ({
            value: option.id,
            label: option.department_name,
          }))
        );
      });
    };

    const fetchDivisionOptions = () => {
      fetchDivision().then((response) => {
        setDivisionOptions(
          response.data.map((option) => ({
            value: option.id,
            label: option.division_name,
          }))
        );
      });
    };

    const getAgentOptions = () => {
      fetchAgentOptions().then((response) => {
        setAgentOptions(
          response.data.map((option) => ({
            value: option.id,
            label: option.fullname,
          }))
        );
      });
    };

    Promise.all([fetchDepartmentOptions(), fetchDivisionOptions(), getAgentOptions()])
      .catch(errorMessage)
      .finally(() => setIsLoading(false));
  }, []);

  // useEffect(() => {
  //   if (id) {
  //     setIsLoading(true);
  //     fetchTeamById(id)
  //       .then((response) => {
  //         const supervisorOptions = response.data.team_supervisor.map((supervisor) => ({
  //           value: supervisor.agent_id,
  //           label: supervisor.fullname,
  //         }));

  //         formik.setValues({
  //           teamName: response.data.team.team_name || '',
  //           groupEmail: response.data.team.group_email || '',
  //           supervisorName: supervisorOptions && supervisorOptions.map((option) => option.value),
  //           departmentId: response.data.team.department_id || '',
  //           divisionId: response.data.team.division_id || '',
  //           idleStartHours: response.data.team.idle_start_hr ?? 0,
  //           idleStartMinutes: response.data.team.idle_start_min ?? 0,
  //           idleEndHours: response.data.team.idle_end_hr ?? 0,
  //           idleEndMinutes: response.data.team.idle_end_min ?? 0,
  //         });
  //       })
  //       .catch(errorMessage)
  //       .finally(() => {
  //         setIsLoading(false);
  //       });
  //   }
  // }, [id]);

  useEffect(() => {
  if (id) {
    setIsLoading(true);

    fetchTeamById(id)
      .then((response) => {
        const { team, team_supervisor, first_response_config } = response.data;

        // supervisors → array of ids
        const supervisorIds = team_supervisor.map((s) => s.agent_id);

        formik.setValues({
          teamName: team.team_name || '',
          groupEmail: team.group_email || '',

          supervisorName: supervisorIds,

          // 🔥 additional email (already array)
          additionalEmailcc: team.additional_email || [],
          additionalEmailInput: '',

          departmentId: team.department_id || '',
          divisionId: team.division_id || '',

          idleStartHours: team.idle_start_hr ?? 0,
          idleStartMinutes: team.idle_start_min ?? 0,
          idleEndHours: team.idle_end_hr ?? 0,
          idleEndMinutes: team.idle_end_min ?? 0,

          // 🔥 first response config
          first_response_duration: first_response_config?.duration_min ?? '',
          first_res_status: first_response_config?.first_response_status ?? 1,
          escalation_status: first_response_config?.escalation_status ?? 1,
        });
      })
      .catch(errorMessage)
      .finally(() => setIsLoading(false));
  }
}, [id]);

  const formik = useFormik({
    initialValues: {
      teamName: '',
      groupEmail: '',
      supervisorName: [],
      additionalEmailcc: [],
      additionalEmailInput: '',
      departmentId: '',
      divisionId: '',
      idleStartHours: '',
      idleStartMinutes: '',
      idleEndHours: '',
      idleEndMinutes: '',
      first_response_duration: '',
      first_res_status: 1,
      escalation_status: 1,
    },
    validationSchema: teamValidationSchema,
    onSubmit: (values, { resetForm }) => {
      setIsLoading(true);
      const apiCall = id ? update(id, values) : store(values);
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

  const handleAddEmail = (e) => {
    if (e.key === 'Enter' || e.key === ';') {
      e.preventDefault();

      const email = formik.values.additionalEmailInput.trim();

      if (!email) return;

      // simple email validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        toast.error('Invalid email');
        return;
      }

      if (!formik.values.additionalEmailcc.includes(email)) {
        formik.setFieldValue('additionalEmailcc', [...formik.values.additionalEmailcc, email]);
      }

      formik.setFieldValue('additionalEmailInput', '');
    }
  };

  const removeEmail = (email) => {
    formik.setFieldValue(
      'additionalEmailcc',
      formik.values.additionalEmailcc.filter((e) => e !== email)
    );
  };

  return (
    <div className="row">
      <div className="col-sm-12 col-md-12 col-lg-12 col-xl-12">
        <div className="alert alert-secondary p-2" role="alert">
          <h6>{id ? 'Update' : 'Create'} Team</h6>
          <span>
            <i>Please input the required information.</i>
          </span>
        </div>
      </div>
      <div className="col-sm-12 col-md-6 col-lg-6 col-xl-6">
        <form onSubmit={formik.handleSubmit}>
          <div className="row">
            <div className="col-sm-12 col-md-12 col-lg-12 col-xl-12">
              <div className="input-group mb-3">
                <span className="input-group-text w-25" id="basic-addon1">
                  Team
                </span>
                <input
                  type="text"
                  className="form-control"
                  id="teamName"
                  placeholder="Name"
                  value={formik.values.teamName}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
              </div>
              {formik.touched.teamName && formik.errors.teamName ? (
                <div className="text-danger">{formik.errors.teamName}</div>
              ) : null}
            </div>
            <div className="col-sm-12 col-md-12 col-lg-12 col-xl-12">
              <div className="input-group mb-3">
                <span className="input-group-text w-25" id="basic-addon1">
                  Group Email
                </span>
                <input
                  type="email"
                  className="form-control"
                  id="groupEmail"
                  placeholder="Group email"
                  value={formik.values.groupEmail}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
              </div>
            </div>
            <div className="col-sm-12 col-md-12 col-lg-12 col-xl-12">
              <div className="input-group mb-3">
                <span className="input-group-text w-25" id="basic-addon1">
                  Supervisor
                </span>

                <SelectDropdown
                  id="supervisorName"
                  placeholder="Supervisor"
                  options={agentOptions}
                  value={formik.values.supervisorName}
                  onChange={(value) => formik.setFieldValue('supervisorName', value)}
                  disabled={isLoading}
                  isMulti={true}
                />
              </div>
              {formik.touched.supervisorName && formik.errors.supervisorName ? (
                <div className="text-danger">{formik.errors.supervisorName}</div>
              ) : null}
            </div>

            <div className="input-group mb-3">
              <span className="input-group-text w-25">Additional Email (Cc)</span>

              <div className="form-control" style={{ minHeight: '38px' }}>
                <div className="d-flex flex-wrap gap-1">
                  {formik.values.additionalEmailcc.map((email, index) => (
                    <span
                      key={index}
                      className="badge rounded-0 d-flex align-items-center"
                      style={{
                        background: '#E6E5E6',
                        color: 'rgb(27 26 28)',
                        fontWeight: 'normal',
                        fontSize: '12px',
                      }}
                    >
                      {email}
                      <button
                        type="button"
                        className="btn-close btn-close-black ms-2"
                        style={{ fontSize: '10px' }}
                        onClick={() => removeEmail(email)}
                      />
                    </span>
                  ))}

                  <input
                    type="text"
                    className="border-0 flex-grow-1"
                    style={{ outline: 'none' }}
                    placeholder="Type email and press Enter or Semicolon (;) to add"
                    value={formik.values.additionalEmailInput}
                    onChange={(e) => formik.setFieldValue('additionalEmailInput', e.target.value)}
                    onKeyDown={handleAddEmail}
                  />
                </div>
              </div>
            </div>

            <div className="col-sm-12 col-md-12 col-lg-12 col-xl-12">
              <div className="input-group mb-3">
                <span className="input-group-text w-25" id="basic-addon1">
                  Department
                </span>

                <SelectDropdown
                  id="departmentId"
                  placeholder="Department"
                  options={options}
                  value={formik.values.departmentId}
                  onChange={(value) => formik.setFieldValue('departmentId', value)}
                  disabled={isLoading}
                />
              </div>
              {formik.touched.departmentId && formik.errors.departmentId ? (
                <div className="text-danger">{formik.errors.departmentId}</div>
              ) : null}
            </div>

            <div className="col-sm-12 col-md-12 col-lg-12 col-xl-12">
              <div className="input-group mb-3">
                <span className="input-group-text w-25" id="basic-addon1">
                  Division
                </span>

                <SelectDropdown
                  id="divisionId"
                  placeholder="Division"
                  options={divisionOptions}
                  value={formik.values.divisionId}
                  onChange={(value) => formik.setFieldValue('divisionId', value)}
                  disabled={isLoading}
                />
              </div>
              {formik.touched.divisionId && formik.errors.divisionId ? (
                <div className="text-danger">{formik.errors.divisionId}</div>
              ) : null}
            </div>

            <div className="col-sm-12 col-md-12 col-lg-12 col-xl-12">
              <div className="input-group mb-3">
                <span className="input-group-text w-25" id="basic-addon1">
                  Idle Start Time
                </span>

                <SelectDropdown
                  id="idleStartHours"
                  placeholder="Hour"
                  options={idleStartHourOptions}
                  value={formik.values.idleStartHours}
                  onChange={(value) => formik.setFieldValue('idleStartHours', value)}
                  disabled={isLoading}
                />
                <SelectDropdown
                  id="idleStartMinutes"
                  placeholder="Minute"
                  options={idleStartMinuteOptions}
                  value={formik.values.idleStartMinutes}
                  onChange={(value) => formik.setFieldValue('idleStartMinutes', value)}
                  disabled={isLoading}
                />
              </div>
              {formik.touched.idleStartHours && formik.errors.idleStartHours ? (
                <div className="text-danger">{formik.errors.idleStartHours}</div>
              ) : null}
              {formik.touched.idleStartMinutes && formik.errors.idleStartMinutes ? (
                <div className="text-danger">{formik.errors.idleStartMinutes}</div>
              ) : null}
            </div>

            <div className="col-sm-12 col-md-12 col-lg-12 col-xl-12">
              <div className="input-group mb-3">
                <span className="input-group-text w-25" id="basic-addon1">
                  Idle End Time
                </span>

                <SelectDropdown
                  id="idleEndHours"
                  placeholder="Hour"
                  options={idleEndHourOptions}
                  value={formik.values.idleEndHours}
                  onChange={(value) => formik.setFieldValue('idleEndHours', value)}
                  disabled={isLoading}
                />
                <SelectDropdown
                  id="idleEndMinutes"
                  placeholder="Minute"
                  options={idleEndMinuteOptions}
                  value={formik.values.idleEndMinutes}
                  onChange={(value) => formik.setFieldValue('idleEndMinutes', value)}
                  disabled={isLoading}
                />
              </div>
              {formik.touched.idleEndHours && formik.errors.idleEndHours ? (
                <div className="text-danger">{formik.errors.idleStartHours}</div>
              ) : null}
              {formik.touched.idleEndMinutes && formik.errors.idleEndMinutes ? (
                <div className="text-danger">{formik.errors.idleEndMinutes}</div>
              ) : null}
            </div>

            <div className="col-sm-12 col-md-12 col-lg-12 col-xl-12">
              <div className="input-group mb-3">
                <span className="input-group-text w-25" id="basic-addon1">
                  First Response Time
                </span>
                <input
                  type="number"
                  className="form-control"
                  id="first_response_duration"
                  placeholder="Duration in minutes"
                  value={formik.values.first_response_duration}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
              </div>
              {formik.touched.first_response_duration && formik.errors.first_response_duration ? (
                <div className="text-danger">{formik.errors.first_response_duration}</div>
              ) : null}
            </div>

            <div className="col-sm-12 col-md-12 col-lg-12 col-xl-12">
              <div className="d-flex justify-content-center gap-5">
                <div className="form-check form-switch me-3">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    role="switch"
                    id="first_res_status"
                    checked={formik.values.first_res_status}
                    onChange={(e) =>
                      formik.setFieldValue('first_res_status', e.target.checked ? 1 : 0)
                    }
                  />
                  <label className="form-check-label ms-2" htmlFor="first_res_status">
                    First Response SLA (Active / Inactive)
                  </label>
                </div>
                <div className="form-check form-switch">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    role="switch"
                    id="escalation_status"
                    checked={formik.values.escalation_status}
                    onChange={(e) =>
                      formik.setFieldValue('escalation_status', e.target.checked ? 1 : 0)
                    }
                  />
                  <label className="form-check-label ms-2" htmlFor="escalation_status">
                    Escalate (Yes / No)
                  </label>
                </div>
              </div>
            </div>

            <div className="text-end">
              <button type="submit" className="custom-btn">
                {isLoading ? (id ? 'Updating...' : 'Saving...') : id ? 'Update' : 'Save'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
