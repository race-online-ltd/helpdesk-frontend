import React, { useEffect, useState } from "react";
import { useFormik } from "formik";
import moment from "moment";
import { SelectDropdown } from "../components/SelectDropdown";
import { SettingsDataTable } from "./../components/SettingsDataTable";
import {
  update,
  store,
  fetchNotificationById,
  fetchNotification,
} from "../../../api/api-client/settings/notificationApi";
import {
  errorMessage,
  successMessage,
} from "../../../api/api-config/apiResponseMessage";
import { notificationValidationSchema } from "../../../schema/ValidationSchemas";
import { fetchEmailTemplate } from "../../../api/api-client/settings/emailApi";

export const EmailNotification = () => {
  const [id, setId] = useState(null);
  const [data, setData] = useState([]);
  const [options, setOptions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const columns = [
    {
      name: "Id",
      selector: (row) => row.id,
      sortable: true,
    },
    {
      name: "Notification Name",
      selector: (row) => row.notification_name,
      sortable: true,
      cell: (row) => (
        <div className='w-100'>
          <button
            type='button'
            onClick={() => {
              setId(row.id);
            }}
            className='ticket-link-btn'>
            <span>{row.notification_name}</span>
          </button>
        </div>
      ),
    },
    {
      name: "Email Template",
      selector: (row) => row.email_template_id,
      sortable: true,
    },

    {
      name: "Client",
      selector: (row) => row.client,
      sortable: true,
    },
    {
      name: "Status",
      selector: (row) => row.status,
      sortable: true,
    },

    {
      name: "Created Date",
      selector: (row) => row.created_at,
      sortable: true,
      cell: (row) => (
        <div className='w-100'>
          <i className='bi bi-calendar-check me-2 text-primary'></i>
          <span>{moment(row.created_at).format("ll")}</span>
        </div>
      ),
    },
  ];

  const fetchNotificationData = () =>
    fetchNotification().then((response) => {
      setData(response.data);
    });

  useEffect(() => {
    setIsLoading(true);
    const fetchTemplateOptions = () =>
      fetchEmailTemplate().then((response) =>
        setOptions(
          response.data.map((option) => ({
            value: option.id,
            label: option.template_name,
          }))
        )
      );
    Promise.all([fetchTemplateOptions(), fetchNotificationData()])
      .catch(errorMessage)
      .finally(() => setIsLoading(false));
  }, []);

  useEffect(() => {
    if (id) {
      setIsLoading(true);
      fetchNotificationById(id)
        .then((response) => {
          console.log(response);
          formik.setValues({
            notificationName: response.data.notification_name || "",
            emailTemplate: response.data.email_template_id || "",
            client: response.data.client == 1 ? true : false || "",
            status: response.data.status || "",
          });
        })
        .catch(errorMessage)
        .finally(() => setIsLoading(false));
    }
  }, [id]);

  const formik = useFormik({
    initialValues: {
      notificationName: "",
      emailTemplate: null,
      client: false,
      status: "Active",
    },
    validationSchema: notificationValidationSchema,
    onSubmit: (values, { resetForm }) => {
      setIsLoading(true);
      const apiCall = id ? update(id, values) : store(values);
      apiCall
        .then((response) => {
          successMessage(response);
          fetchNotificationData();
        })
        .catch((error) => {
          errorMessage(error);
        })
        .finally(() => {
          setIsLoading(false);
          resetForm();
          setId(null);
        });
    },
  });

  return (
    <section>
      {/* {"row id = " + selectedRow} */}
      <div className='container-fluid'>
        <div className='row'>
          <div className='col-12'>
            <div className='custom-card w-100'>
              <h6 className='custom-card-header'>Notification Type</h6>
              <div className='p-3'>
                <form onSubmit={formik.handleSubmit} className='row'>
                  <div className='col-12 col-sm-5'>
                    <div className='row'>
                      <div className='col-12 mb-2 mb-sm-0'>
                        <div className='input-group mb-3'>
                          <span
                            className='input-group-text w-25 label-w'
                            id='basic-addon1'>
                            Notification
                          </span>
                          <input
                            type='text'
                            placeholder='Notification name'
                            className='form-control'
                            id='notificationName'
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            value={formik.values.notificationName}
                          />
                        </div>
                        {formik.touched.notificationName &&
                        formik.errors.notificationName ? (
                          <div className='text-danger'>
                            {formik.errors.notificationName}
                          </div>
                        ) : null}
                      </div>
                      <div className='col-12 mb-2 mb-sm-0'>
                        <div className='input-group mb-3'>
                          <span
                            className='input-group-text w-25 label-w'
                            id='basic-addon1'>
                            Email Template
                          </span>
                          <SelectDropdown
                            id='emailTemplate'
                            placeholder='Email template'
                            options={options}
                            value={formik.values.emailTemplate}
                            onChange={(value) =>
                              formik.setFieldValue("emailTemplate", value)
                            }
                            disabled={isLoading}
                          />
                        </div>
                        {formik.touched.emailTemplate &&
                        formik.errors.emailTemplate ? (
                          <div className='text-danger'>
                            {formik.errors.emailTemplate}
                          </div>
                        ) : null}
                      </div>
                      <div className='col-12 mb-3 mb-sm-0'>
                        <div className='d-flex justify-content-start justify-content-sm-between flex-column flex-sm-row align-items-center'>
                          <div className='form-check'>
                            <input
                              className='form-check-input'
                              type='checkbox'
                              id='client'
                              onChange={formik.handleChange}
                              onBlur={formik.handleBlur}
                              checked={formik.values.client}
                            />
                            <label
                              className='form-check-label'
                              htmlFor='client'>
                              Client
                            </label>
                          </div>

                          <div className='form-check form-switch'>
                            <input
                              className='form-check-input'
                              type='checkbox'
                              value={formik.values.status}
                              id='status'
                              checked={
                                formik.values.status === "Active" ? true : false
                              }
                              onChange={(e) => {
                                const newStatus = e.target.checked
                                  ? "Active"
                                  : "Inactive";
                                formik.setFieldValue("status", newStatus);
                              }}
                            />
                            <label
                              className='form-check-label'
                              htmlFor='status'
                              style={{ width: "44px" }}>
                              {formik.values.status === "Active"
                                ? "Active"
                                : "Inactive"}
                            </label>
                          </div>
                        </div>
                      </div>
                      <div className='col-12 text-end'>
                        <button type='submit' className='custom-btn'>
                          {id ? "Update" : "Save"}
                        </button>
                      </div>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className='container-fluid'>
        <div className='row'>
          <div className='col-12'>
            <div className='bg-white py-4 rounded'>
              <SettingsDataTable data={data} columns={columns} />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
