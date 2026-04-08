import React, { useEffect, useReducer, useState } from "react";
import { useParams } from "react-router-dom";
import { fetchSLAByTeamId } from "../../../../api/api-client/settings/slaApi";
import { errorMessage } from "../../../../api/api-config/apiResponseMessage";
import { SelectDropdown } from "../SelectDropdown";
import { useFormik } from "formik";
import { fetchAgentOptions } from "../../../../api/api-client/settings/agentApi";
import { fetchEmailTemplate } from "../../../../api/api-client/settings/emailApi";
import { plusIcon } from "../../../../data/data";

export const EscalateEdit = () => {
  const { teamId } = useParams();
  const [isLoading, setIsLoading] = useState(false);
  const [emailTemplateOptions, setEmailTemplateOptions] = useState([]);
  const [firstResponsEscalateData, setFirstResponsEscalateData] = useState([]);
  const [serviceTimeEscalateData, setServiceTimeEscalateData] = useState([]);
  const [agentOptions, setAgentOptions] = useState([]);
  const [firstResponseLevelCount, setFirstResponseLevelCount] = useState(0);
  const [serviceTimeLevelCount, setServiceTimeLevelCount] = useState(0);

  const [notifyDataOption, setNotifyDataOption] = useState([
    { value: "Immediately", label: "Immediately" },
    { value: "After 5 minutes", label: "After 5 Minutes" },
    { value: "After 10 minutes", label: "After 10 Minutes" },
    { value: "After 15 minutes", label: "After 15 Minutes" },
    { value: "After 30 minutes", label: "After 30 Minutes" },
    { value: "After 1 hour", label: "After 1 hour" },
    { value: "After 3 hour", label: "After 3 hour" },
    { value: "After 5 hour", label: "After 5 hour" },
  ]);

  useEffect(() => {
    const fetchEscalateOptions = () => {
      fetchSLAByTeamId(teamId).then((response) => {
        setFirstResponsEscalateData(response.data.first_response);
        setServiceTimeEscalateData(response.data.service_time);
        setFirstResponseLevelCount(response.data.first_response.length);
        setServiceTimeLevelCount(response.data.service_time.length);
      });
    };

    const fetchTemplateOptions = () =>
      fetchEmailTemplate().then((response) =>
        setEmailTemplateOptions(
          response.data.map((option) => ({
            value: option.id,
            label: option.template_name,
          }))
        )
      );

    const fetchAgentList = () =>
      fetchAgentOptions().then((response) =>
        setAgentOptions(
          response.data.map((option) => ({
            value: option.id,
            label: option.fullname,
          }))
        )
      );
    Promise.all([
      fetchEscalateOptions(),
      fetchTemplateOptions(),
      fetchAgentList(),
    ])
      .catch(errorMessage)
      .finally(() => {
        frFormik.setFieldValue("teamId", Number(teamId) ?? null);
        frFormik.setFieldValue("level", firstResponseLevelCount);
        setIsLoading(false);
      });
  }, [teamId]);

  const frFormik = useFormik({
    initialValues: {
      teamId: null,
      level: 1,
      notifyTime: "Immediately",
      agents: [],
      isEmailSend: 0,
      emailTemplate: null,
    },
    // validationSchema: validationSchema,
    onSubmit: (values, { resetForm, setFieldValue, setValues }) => {
      setIsLoading(true);
      //   update(id, valuesToSubmit)
      //     .then((response) => {})
      //     .catch(errorMessage)
      //     .finally(() => {
      //       setIsLoading(false);
      //     });
    },
  });

  const srvFormik = useFormik({
    initialValues: {
      teamId: null,
      level: 1,
      notifyTime: null,
      agents: [],
      isEmailSend: 0,
      emailTemplate: null,
    },
    // validationSchema: validationSchema,
    onSubmit: (values, { resetForm, setFieldValue, setValues }) => {
      setIsLoading(true);
      //   update(id, valuesToSubmit)
      //     .then((response) => {})
      //     .catch(errorMessage)
      //     .finally(() => {
      //       setIsLoading(false);
      //     });
    },
  });

  const handleFirstResponseUpdate = (item) => {
    console.log(item);
    frFormik.setFieldValue("level", item.level_id);
    frFormik.setFieldValue("notifyTime", item.notification_str);
    frFormik.setFieldValue("agents", item.userid);
    frFormik.setFieldValue("isEmailSend", item.send_email_status);
    frFormik.setFieldValue("emailTemplate", item.email_id);
  };
  const handleServiceTimeUpdate = (level) => {
    console.log(level);
  };
  // console.log(firstResponsEscalateData);
  // console.log(serviceTimeEscalateData);
  console.log(frFormik.values);
  return (
    <div className='container-fluid'>
      <div className='row'>
        <div className='col-sm-12 col-md-12 col-lg-12 col-xl-12'>
          <p className='mb-2'>
            When <span className='fw-bold'>First Response Time</span> is not
            met, escalate & notify
          </p>
          <div className='card'>
            <form onSubmit={frFormik.handleSubmit} className='card-body'>
              <div
                className='row pt-3 rounded border mb-3'
                style={{ background: "#EBEFF3" }}>
                <div className='col-sm-12 col-md-2 col-lg-2 col-xl-2'>
                  <p className='mb-0 mt-1 text-center'>
                    Level {firstResponseLevelCount && firstResponseLevelCount}
                    escalation
                  </p>
                </div>
                <div className='col-sm-12 col-md-2 col-lg-2 col-xl-2'>
                  <div className='mb-3'>
                    <SelectDropdown
                      options={notifyDataOption}
                      placeholder={"Immediately"}
                      id='notifyTime'
                      name='notifyTime'
                      value={frFormik.values.notifyTime}
                      onChange={(option) =>
                        frFormik.setFieldValue("notifyTime", option)
                      }
                    />
                  </div>
                </div>
                <div className='col-sm-12 col-md-4 col-lg-4 col-xl-4'>
                  <div className='input-group input-group-sm mb-3'>
                    <span className='input-group-text' id='basic-addon1'>
                      To
                    </span>
                    <SelectDropdown
                      options={agentOptions}
                      placeholder={"Assigned Agent"}
                      isMulti={true}
                      id='agents'
                      name='agents'
                      className='form-control'
                      value={frFormik.values.agents}
                      onChange={(option) =>
                        frFormik.setFieldValue("agents", option)
                      }
                    />
                  </div>
                </div>
                <div className='col-sm-12 col-md-3 col-lg-3 col-xl-3'>
                  <div className='input-group input-group-sm mb-3'>
                    <div className='form-check mb-0 mt-2'>
                      <input
                        type='checkbox'
                        name='isEmailSend'
                        id='isEmailSend'
                        value={frFormik.values.isEmailSend}
                        className='form-check-input form-check-input-sm text-center me-2'
                        onChange={(e) => {
                          frFormik.setFieldValue(
                            "isEmailSend",
                            e.target.checked
                          );
                        }}
                      />
                    </div>
                    <span className='input-group-text' id='basic-addon1'>
                      Send email
                    </span>
                    <SelectDropdown
                      options={emailTemplateOptions}
                      placeholder={"Template"}
                      id='emailTemplate'
                      name='emailTemplate'
                      className='form-control form-control-sm p-0'
                      isDisabled={!frFormik.values.emailTemplate}
                      onChange={(option) =>
                        frFormik.setFieldValue("emailTemplate", option)
                      }
                    />
                  </div>
                </div>
              </div>
              <div className='text-end mt-3'>
                <button type='submit' className='custom-btn'>
                  {plusIcon} Add First Response Level
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Service Time */}
        <div className='col-sm-12 col-md-12 col-lg-12 col-xl-12'>
          <p className='mb-2'>
            When <span className='fw-bold'>Service Time</span> is not met,
            escalate & notify
          </p>
          <div className='card'>
            <form onSubmit={srvFormik.handleSubmit} className='card-body'>
              <div
                className='row pt-3 rounded border mb-3'
                style={{ background: "#EBEFF3" }}>
                <div className='col-sm-12 col-md-2 col-lg-2 col-xl-2'>
                  <p className='mb-0 mt-1 text-center'>
                    Level {serviceTimeLevelCount && serviceTimeLevelCount}
                    escalation
                  </p>
                </div>
                <div className='col-sm-12 col-md-2 col-lg-2 col-xl-2'>
                  <div className='mb-3'>
                    <SelectDropdown
                      options={notifyDataOption}
                      placeholder={"Immediately"}
                      id='notifyTime'
                      name='notifyTime'
                      value={srvFormik.values.notifyTime}
                      onChange={(option) =>
                        srvFormik.setFieldValue("notifyTime", option)
                      }
                    />
                  </div>
                </div>
                <div className='col-sm-12 col-md-4 col-lg-4 col-xl-4'>
                  <div className='input-group input-group-sm mb-3'>
                    <span className='input-group-text' id='basic-addon1'>
                      To
                    </span>
                    <SelectDropdown
                      options={agentOptions}
                      placeholder={"Assigned Agent"}
                      isMulti={true}
                      id='agents'
                      name='agents'
                      className='form-control'
                      value={srvFormik.values.agents}
                      onChange={(option) =>
                        srvFormik.setFieldValue("agents", option)
                      }
                    />
                  </div>
                </div>
                <div className='col-sm-12 col-md-3 col-lg-3 col-xl-3'>
                  <div className='input-group input-group-sm mb-3'>
                    <div className='form-check mb-0 mt-2'>
                      <input
                        type='checkbox'
                        name='isEmailSend'
                        id='isEmailSend'
                        value={srvFormik.values.isEmailSend}
                        className='form-check-input form-check-input-sm text-center me-2'
                        onChange={(e) => {
                          srvFormik.setFieldValue(
                            "isEmailSend",
                            e.target.checked
                          );
                        }}
                      />
                    </div>
                    <span className='input-group-text' id='basic-addon1'>
                      Send email
                    </span>
                    <SelectDropdown
                      options={emailTemplateOptions}
                      placeholder={"Template"}
                      id='emailTemplate'
                      name='emailTemplate'
                      className='form-control form-control-sm p-0'
                      isDisabled={!srvFormik.values.emailTemplate}
                      onChange={(option) =>
                        srvFormik.setFieldValue("emailTemplate", option)
                      }
                    />
                  </div>
                </div>
              </div>
              <div className='text-end mt-3'>
                <button type='submit' className='custom-btn'>
                  {plusIcon} Add Service Time Level
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      <div className='row'>
        <div className='col'>
          <h6 className='fw-bold text-center'>First Response Time</h6>
          <table className='table'>
            <thead>
              <tr>
                <th>Label</th>
                <th>Notification</th>
                <th>Notification Duration</th>
                <th>Template</th>
                <th>Email Status</th>
                <th>Emails</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {firstResponsEscalateData &&
                firstResponsEscalateData.map((item, index) => (
                  <tr key={index}>
                    <td>{item.level_id}</td>
                    <td>{item.notification_min}</td>
                    <td>{item.notification_str}</td>
                    <td>{item.template_name}</td>
                    <td>{item.send_email_status}</td>
                    <td>{item.emails}</td>
                    <td>
                      <button
                        className='btn btn-sm'
                        type='button'
                        onClick={() => handleFirstResponseUpdate(item)}>
                        <i className='bi bi-pencil-square text-success'></i>
                      </button>
                      <button className='btn btn-sm'>
                        <i className='bi bi-trash3-fill text-danger'></i>
                      </button>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className='row mt-5'>
        <div className='col'>
          <h6 className='fw-bold text-center'>Service Time</h6>
          <table className='table'>
            <thead>
              <tr>
                <th>Label</th>
                <th>Notification</th>
                <th>Notification Duration</th>
                <th>Template</th>
                <th>Email Status</th>
                <th>Emails</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {serviceTimeEscalateData &&
                serviceTimeEscalateData.map((item, index) => (
                  <tr key={index}>
                    <td>{item.level_id}</td>
                    <td>{item.notification_min}</td>
                    <td>{item.notification_str}</td>
                    <td>{item.template_name}</td>
                    <td>{item.send_email_status}</td>
                    <td>{item.emails}</td>
                    <td>
                      <button
                        className='btn btn-sm'
                        onClick={() => handleServiceTimeUpdate(item)}>
                        <i className='bi bi-pencil-square text-success'></i>
                      </button>
                      <button className='btn btn-sm'>
                        <i className='bi bi-trash3-fill text-danger'></i>
                      </button>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
