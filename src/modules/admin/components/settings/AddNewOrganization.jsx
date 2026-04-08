import React, { useContext, useEffect, useState } from "react";
import { useFormik } from "formik";
import { companyValidationSchema } from "../../../../schema/ValidationSchemas";
import {
  fetchCompanyById,
  store,
  update,
} from "../../../../api/api-client/settings/companyApi";
import {
  errorMessage,
  successMessage,
} from "../../../../api/api-config/apiResponseMessage";
import { SelectDropdown } from "../SelectDropdown";
import { fetchAllTeam } from "../../../../api/api-client/settings/teamApi";
import { userContext } from "../../../context/UserContext";

export const AddNewOrganization = ({ id }) => {
  const { user } = useContext(userContext);
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
    Promise.all([fetchTeamOptions()])
      .catch(errorMessage)
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  const formik = useFormik({
    initialValues: {
      companyName: "",
      companyPrefix: "",
      websiteUrl: "",
      phoneNo: "",
      teams: "",
      address: "",
    },
    validationSchema: companyValidationSchema,
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

  useEffect(() => {
    if (id) {
      setIsLoading(true);
      fetchCompanyById(id)
        .then((response) => {
          formik.setValues({
            companyName: response.result.company_name || "",
            companyPrefix: response.result.prefix || "",
            websiteUrl: response.result.url || "",
            phoneNo: response.result.phone || "",
            teams: response.result.team_id || "",
            address: response.result.address || "",
          });
        })
        .catch(errorMessage)
        .finally(() => {
          setIsLoading(false);
        });
    }
  }, [id]);

  return (
    <div className='row'>
      <div className='col-sm-12 col-md-12 col-lg-12 col-xl-12'>
        <div className='alert alert-secondary p-2' role='alert'>
          <h6>{id ? "Update" : "Create"} Business Entity</h6>
          <span>
            <i>Please input the required information.</i>
          </span>
        </div>
      </div>
      <div className='col-sm-12 col-md-6 col-lg-6 col-xl-6'>
        <form onSubmit={formik.handleSubmit}>
          <div className='row'>
            <div className='col-sm-12 col-md-12 col-lg-12 col-xl-12'>
              <div className='input-group mb-3'>
                <span className='input-group-text w-25' id='basic-addon1'>
                  Name
                </span>
                <input
                  type='text'
                  className='form-control'
                  id='companyName'
                  name='companyName'
                  placeholder='Business entity'
                  aria-label='Company Name'
                  aria-describedby='basic-addon1'
                  value={formik.values.companyName}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
              </div>
              {formik.touched.companyName && formik.errors.companyName ? (
                <div className='text-danger'>{formik.errors.companyName}</div>
              ) : null}
            </div>
            <div className='col-sm-12 col-md-12 col-lg-12 col-xl-12'>
              <div className='input-group mb-3'>
                <span className='input-group-text w-25' id='basic-addon1'>
                  Prefix
                </span>
                <input
                  type='text'
                  className='form-control'
                  id='companyPrefix'
                  name='companyPrefix'
                  placeholder='Prefix of business entity'
                  value={formik.values.companyPrefix}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
              </div>
              {formik.touched.companyPrefix && formik.errors.companyPrefix ? (
                <div className='text-danger'>{formik.errors.companyPrefix}</div>
              ) : null}
            </div>

            <div className='col-sm-12 col-md-12 col-lg-12 col-xl-12'>
              <div className='input-group mb-3'>
                <span className='input-group-text w-25' id='basic-addon1'>
                  Website
                </span>
                <input
                  type='text'
                  className='form-control'
                  id='websiteUrl'
                  name='websiteUrl'
                  placeholder='Website URL'
                  aria-label='Website URL'
                  aria-describedby='basic-addon1'
                  value={formik.values.websiteUrl}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
              </div>
            </div>

            <div className='col-sm-12 col-md-12 col-lg-12 col-xl-12'>
              <div className='input-group mb-3'>
                <span className='input-group-text w-25' id='basic-addon1'>
                  Phone
                </span>
                <input
                  type='text'
                  className='form-control'
                  id='phoneNo'
                  name='phoneNo'
                  placeholder='+880'
                  aria-label='Phone Number'
                  aria-describedby='basic-addon1'
                  value={formik.values.phoneNo}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
              </div>
            </div>

            <div className='col-sm-12 col-md-12 col-lg-12 col-xl-12'>
              <div class='input-group mb-3'>
                <span class='input-group-text w-25 label-cat-w'>
                  Default Team
                </span>
                <SelectDropdown
                  id='teams'
                  placeholder='Teams'
                  options={teamOptions}
                  value={formik.values.teams}
                  onChange={(value) => formik.setFieldValue("teams", value)}
                  disabled={isLoading}
                />
              </div>
              {formik.touched.teams && formik.errors.teams ? (
                <div className='text-danger'>{formik.errors.teams}</div>
              ) : null}
            </div>
            <div className='col-sm-12 col-md-12 col-lg-12 col-xl-12'>
              <div className='input-group mb-3'>
                <span className='input-group-text w-25' id='addressTextArea'>
                  Address
                </span>
                <textarea
                  className='form-control'
                  id='address'
                  name='address'
                  placeholder='Type office address'
                  rows='3'
                  value={formik.values.address}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}></textarea>
              </div>
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
