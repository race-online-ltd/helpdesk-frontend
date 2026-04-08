import { useFormik } from 'formik';
import React, { useEffect, useState } from 'react';
import { useParams,useNavigate } from 'react-router-dom';
import { fetchTeamById, store, update } from '../../../api/api-client/settings/teamApi';
import { toast } from 'react-toastify';
import { SelectDropdown } from '../components/SelectDropdown';
import { errorMessage, successMessage } from '../../../api/api-config/apiResponseMessage';
import { fetchAgentOptions } from '../../../api/api-client/settings/agentApi';
import { fetchAllTeam } from '../../../api/api-client/settings/teamApi';
import { teamAdditionalConfigValidationSchema } from '../../../schema/ValidationSchemas';
import { teamAdditionalConfigStore,fetchConfigurationByTeamId } from '../../../api/api-client/settings/teamApi';
import { fetchAgentsByTeam } from '../../../api//api-client/settings/agentApi';

export const TeamWiseAdditionalConfig = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [agentOptions, setAgentOptions] = useState([]);
  const [teamOptions, setTeamOptions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setIsLoading(true);
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
    const getAgentOptions = () => {
      fetchAgentsByTeam(id).then((response) => {
        const agents = response.data.map((option) => ({
          value: option.id,
          label: option.fullname,
        }));

        setAgentOptions(agents);
      });
    };

    Promise.all([fetchTeamOptions(), getAgentOptions()])
      .catch(errorMessage)
      .finally(() => setIsLoading(false));
  }, [id]);

  // useEffect(() => {
  //   if (id) {
  //     setIsLoading(true);
  //     fetchConfigurationByTeamId(id)
  //       .then((response) => {
  //         formik.setValues({
  //           teamIds: id || '',
  //           ticketSlaHold: [],
  //           ticketReopen: [],
  //           ticketMerge: [],
  //           ticketEscalate: [],
  //           additionalEmailcc: [],
  //         });
  //       })
  //       .catch(errorMessage)
  //       .finally(() => {
  //         setIsLoading(false);
  //       });
  //   }
  // }, [id]);


  useEffect(() => {
  if (!id || agentOptions.length === 0) return;

  setIsLoading(true);

  fetchConfigurationByTeamId(id)
    .then((response) => {
      const data = response.data;

      const isAll = (arr) => Array.isArray(arr) && arr.includes('all');

      const mapAgents = (arr) => {
        if (!Array.isArray(arr) || arr.includes('all')) return [];
        return arr;
      };

      formik.setValues({
        teamIds: id,

        ticketSlaHold: mapAgents(data.sla_hold_agents),
        slaHoldAll: isAll(data.sla_hold_agents),

        ticketReopen: mapAgents(data.reopen_agents),
        reopenAll: isAll(data.reopen_agents),

        ticketMerge: mapAgents(data.merge_agents),
        mergeAll: isAll(data.merge_agents),

        ticketEscalate: mapAgents(data.escalate_agents),
        escalateAll: isAll(data.escalate_agents),

        additionalEmailcc: data.additional_emails || [],
        additionalEmailInput: '',
      });
    })
    .catch(errorMessage)
    .finally(() => setIsLoading(false));
}, [id, agentOptions]);

  const formik = useFormik({
    initialValues: {
      teamIds: '',
      ticketSlaHold: [],
      ticketReopen: [],
      ticketMerge: [],
      ticketEscalate: [],
      slaHoldAll: false,
      reopenAll: false,
      mergeAll: false,
      escalateAll: false,
      additionalEmailcc: [],
      additionalEmailInput: '',
    },
    validationSchema: teamAdditionalConfigValidationSchema,
    onSubmit: (values, { resetForm }) => {
      setIsLoading(true);
      teamAdditionalConfigStore(values)
        .then((response) => {
          resetForm();
          successMessage(response);
          navigate("/admin/settings");
        })
        // .catch(errorMessage)
        .catch((error)=>console.log(error))
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

  const handleAllToggle = (field, allField, checked) => {
    formik.setFieldValue(allField, checked);

    if (checked) {
      // all agent ids pass হবে
      const allAgentIds = agentOptions.filter((a) => a.value !== 'all').map((a) => a.value);

      formik.setFieldValue(field, ['all']);
    } else {
      // uncheck করলে empty
      formik.setFieldValue(field, []);
    }
  };


  return (
    <div className="row">
      <div className="col-sm-12 col-md-12 col-lg-12 col-xl-12">
        <div className="alert alert-secondary p-2" role="alert">
          <h6>{id ? 'Update' : 'Create'} Team Configurations</h6>
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

                <SelectDropdown
                  id="teamIds"
                  placeholder="Teams"
                  options={teamOptions}
                  value={formik.values.teamIds}
                  onChange={(value) => formik.setFieldValue('teamIds', value)}
                  disabled={isLoading || id}
                  isMulti={true}
                />
              </div>
              {formik.touched.teamIds && formik.errors.teamIds ? (
                <div className="text-danger">{formik.errors.teamIds}</div>
              ) : null}
            </div>
            <div className="col-sm-12 col-md-12 col-lg-12 col-xl-12">
              <div className="input-group mb-3 d-flex align-items-center">
                <span className="input-group-text w-25" id="basic-addon1">
                  SLA Hold
                </span>

                <SelectDropdown
                  id="ticketSlaHold"
                  placeholder="Select Agent"
                  options={agentOptions}
                  value={formik.values.ticketSlaHold}
                  onChange={(value) => formik.setFieldValue('ticketSlaHold', value)}
                  disabled={isLoading || formik.values.slaHoldAll}
                  isMulti={true}
                />
                <div className="form-check ms-2">
                  <input
                    id="slaHoldAll"
                    type="checkbox"
                    className="form-check-input"
                    checked={formik.values.slaHoldAll}
                    onChange={(e) =>
                      handleAllToggle('ticketSlaHold', 'slaHoldAll', e.target.checked)
                    }
                  />
                  <label htmlFor="slaHoldAll">All</label>
                </div>
              </div>
              {formik.touched.ticketSlaHold && formik.errors.ticketSlaHold ? (
                <div className="text-danger">{formik.errors.ticketSlaHold}</div>
              ) : null}
            </div>
            <div className="col-sm-12 col-md-12 col-lg-12 col-xl-12">
              <div className="input-group mb-3 d-flex align-items-center">
                <span className="input-group-text w-25" id="basic-addon1">
                  Reopen
                </span>

                <SelectDropdown
                  id="ticketReopen"
                  placeholder="Select Agent"
                  options={agentOptions}
                  value={formik.values.ticketReopen}
                  onChange={(value) => formik.setFieldValue('ticketReopen', value)}
                  disabled={isLoading || formik.values.reopenAll}
                  isMulti={true}
                />
                <div className="form-check ms-2">
                  <input
                    id="reopenAll"
                    type="checkbox"
                    className="form-check-input"
                    checked={formik.values.reopenAll}
                    onChange={(e) => handleAllToggle('ticketReopen', 'reopenAll', e.target.checked)}
                  />
                  <label htmlFor="reopenAll">All</label>
                </div>
              </div>
              {formik.touched.ticketReopen && formik.errors.ticketReopen ? (
                <div className="text-danger">{formik.errors.ticketReopen}</div>
              ) : null}
            </div>
            <div className="col-sm-12 col-md-12 col-lg-12 col-xl-12">
              <div className="input-group mb-3 d-flex align-items-center">
                <span className="input-group-text w-25" id="basic-addon1">
                  Merge
                </span>

                <SelectDropdown
                  id="ticketMerge"
                  placeholder="Select Agent"
                  options={agentOptions}
                  value={formik.values.ticketMerge}
                  onChange={(value) => formik.setFieldValue('ticketMerge', value)}
                  disabled={isLoading || formik.values.mergeAll}
                  isMulti={true}
                />
                <div className="form-check ms-2">
                  <input
                    id="mergeAll"
                    type="checkbox"
                    className="form-check-input"
                    checked={formik.values.mergeAll}
                    onChange={(e) => handleAllToggle('ticketMerge', 'mergeAll', e.target.checked)}
                  />
                  <label htmlFor="mergeAll">All</label>
                </div>
              </div>
              {formik.touched.ticketMerge && formik.errors.ticketMerge ? (
                <div className="text-danger">{formik.errors.ticketMerge}</div>
              ) : null}
            </div>

            <div className="col-sm-12 col-md-12 col-lg-12 col-xl-12">
              <div className="input-group mb-3 d-flex align-items-center">
                <span className="input-group-text w-25" id="basic-addon1">
                  Escalate
                </span>

                <SelectDropdown
                  id="ticketEscalate"
                  placeholder="Select Supervisor"
                  options={agentOptions}
                  value={formik.values.ticketEscalate}
                  onChange={(value) => formik.setFieldValue('ticketEscalate', value)}
                  disabled={isLoading || formik.values.escalateAll}
                  isMulti={true}
                />
                <div className="form-check ms-2">
                  <input
                    id="escalateAll"
                    type="checkbox"
                    className="form-check-input"
                    checked={formik.values.escalateAll}
                    onChange={(e) =>
                      handleAllToggle('ticketEscalate', 'escalateAll', e.target.checked)
                    }
                  />
                  <label htmlFor="escalateAll">All</label>
                </div>
              </div>
              {formik.touched.ticketEscalate && formik.errors.ticketEscalate ? (
                <div className="text-danger">{formik.errors.ticketEscalate}</div>
              ) : null}
            </div>

            <div className="input-group mb-3">
              <span className="input-group-text w-25">Escalate Email (Cc)</span>

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
