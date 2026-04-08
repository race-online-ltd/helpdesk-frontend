import React, { useContext, useEffect, useState } from 'react';
import { useFormik } from 'formik';
import { SelectDropdown } from '../SelectDropdown';
import {
  fetchClientById,
  fetchUserSerial,
  store,
  storeMultipleClientWithBusinessEntity,
  update,
} from '../../../../api/api-client/settings/clientApi';
import { errorMessage, successMessage } from '../../../../api/api-config/apiResponseMessage';
import {
  fetchClientBusinessEntity,
  fetchCompany,
} from '../../../../api/api-client/settings/companyApi';
import {
  addMultipleBusinessEntityUnderClientValidationSchema,
  clientValidationSchema,
} from '../../../../schema/ValidationSchemas';
import { faCopyIcon } from '../../../../data/data';
import { fetchDefaultClientRole, fetchRole } from '../../../../api/api-client/settings/roleApi';

import { userContext } from '../../../context/UserContext';
import {
  dhakaColoClients,
  earthClients,
  raceClients,
} from '../../../../api/api-client/prismerpApi';
import {
  fetchWebAppOwnEntity,
  fetchWebAppPartnerEntity,
} from '../../../../api/api-client/ticketApi';

export const AddNewClient = ({ id, addBusinessEntity, businessEnId }) => {
  const { user } = useContext(userContext);
  const [options, setOptions] = useState([]);
  const [defaultBusinessEntityOptions, setDefaultBusinessEntityOptions] = useState([]);
  const [clientOptions, setClientOptions] = useState([]);
  const [childClientOptions, setChildClientOptions] = useState([]);
  const [selectedClientId, setSelectedClientId] = useState(null);
  const [selectedChildClientId, setSelectedChildClientId] = useState(null);

  const [selectedBusinessEntityId, setSelectedBusinessEntityId] = useState(null);
  const [defaultRoleOptions, setDefaultRoleOptions] = useState([]);
  const [roleOptions, setRoleOptions] = useState([]);
  const [userNameCopyText, setUserNameCopyText] = useState(faCopyIcon);
  const [passwordCopyText, setPasswordCopyText] = useState(faCopyIcon);
  const [userSeriealNumber, setUserSeriealNumber] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isClientLoading, setIsClientLoading] = useState(false);
  const [isRoleDisabled, setIsRoleDisabled] = useState(true);

  const [selectedBusinessEntityName, setSelectedBusinessEntityName] = useState(null);

  const [updateSelectedBusinessEntityName, setUpdateSelectedBusinessEntityName] = useState(null);

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

    const fetchDefaultroleOptions = () => {
      fetchDefaultClientRole().then((response) => {
        setDefaultRoleOptions(
          response.data.map((option) => ({
            value: option.id,
            label: option.default_type,
          }))
        );
      });
    };

    const fetchRoleOptions = () => {
      fetchRole().then((response) => {
        setRoleOptions(
          response.data.map((option) => ({
            value: option.id,
            label: option.default_type,
          }))
        );
      });
    };

    Promise.all([fetchBusinessEntityOptions(), fetchDefaultroleOptions(), fetchRoleOptions()])
      .catch(errorMessage)
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  const fetchClientBusinessEntityOptions = (data) => {
    fetchClientBusinessEntity({
      userId: data,
    })
      .then((response) => {
        setDefaultBusinessEntityOptions(
          response.data.map((option) => ({
            value: option.id,
            label: option.company_name,
          }))
        );
      })
      .catch(errorMessage)
      .finally(() => {
        setIsLoading(false);
      });
  };

  useEffect(() => {
    if (userSeriealNumber) {
      formik.setFieldValue('userName', userSeriealNumber);
    }
  }, [userSeriealNumber]);

  useEffect(() => {
    if (defaultRoleOptions.length > 0) {
      formik.setFieldValue('role', defaultRoleOptions[0].value);
    }
  }, [defaultRoleOptions]);

  const fetchUserSerialNumber = (entityId) => {
    if (entityId != '') {
      fetchUserSerial(entityId)
        .then((response) => {
          setUserSeriealNumber(response.data);
        })
        .catch(errorMessage)
        .finally(() => {
          setIsLoading(false);
        });
    }
  };

  const generateRandomSixDigitPassword = () => {
    const upperCaseLetters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const lowerCaseLetters = 'abcdefghijklmnopqrstuvwxyz';
    const numbers = '0123456789';
    const specialCharacters = '@$!%*?&';

    const passwordArray = [
      upperCaseLetters[Math.floor(Math.random() * upperCaseLetters.length)],
      lowerCaseLetters[Math.floor(Math.random() * lowerCaseLetters.length)],
      numbers[Math.floor(Math.random() * numbers.length)],
      specialCharacters[Math.floor(Math.random() * specialCharacters.length)],
    ];

    const allCharacters = upperCaseLetters + lowerCaseLetters + numbers + specialCharacters;

    for (let i = passwordArray.length; i < 8; i++) {
      passwordArray.push(allCharacters[Math.floor(Math.random() * allCharacters.length)]);
    }
    const shuffledPassword = passwordArray.sort(() => Math.random() - 0.5).join('');

    return shuffledPassword;
  };

  const handleCopyPassword = (copyValue, type) => {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard
        .writeText(copyValue)
        .then(() => {
          if (type === 'username') {
            setUserNameCopyText('');
            setUserNameCopyText(<small className="text-success fw-bold">Copied!</small>);
            setTimeout(() => {
              setUserNameCopyText(faCopyIcon);
            }, 3000);
          } else {
            setPasswordCopyText(<small className="text-success fw-bold">Copied!</small>);
            setTimeout(() => {
              setPasswordCopyText(faCopyIcon);
            }, 3000);
          }
        })
        .catch(errorMessage);
    } else {
      alert('copy function work only https request');
    }
  };

  useEffect(() => {
    if (id && options && clientOptions) {
      setIsLoading(true);
      fetchClientById(id, businessEnId)
        .then((response) => {
          const {
            business_entity_id,
            default_entity_id,
            client_id,
            id,
            user_id,
            client_name,
            fullname,
            email_primary,
            email_secondary,
            mobile_primary,
            mobile_secondary,
            role_id,
            user_type,
            username,
            lock,
            status,
            one_time_password,
          } =
            Array.isArray(response.data.client_data) && response.data.client_data.length > 0
              ? response.data.client_data[0]
              : {};

          setChildClientOptions(
            response.data.company_entities &&
              response.data.company_entities.map((option) => ({
                value: option.client_id_vendor,
                label: option.client_name,
              }))
          );
          const childIds =
            response.data.company_entities &&
            response.data.company_entities.map((option) => option.client_id_vendor);

          fetchClientBusinessEntityOptions(user_id);

          const findEnityName =
            options && options.find((item) => item.value === parseInt(business_entity_id));

          if (findEnityName?.label) {
            setUpdateSelectedBusinessEntityName(findEnityName?.label);
          }

          const matchedClient = clientOptions?.find((client) => client.value == client_id);

          const checkBusinessEntity = [8, 9, 11].includes(formik.values.businessEntity);
          const matchedClientChild = childIds.map((item) => {
            return clientOptions?.find((client) =>
              client.value === checkBusinessEntity ? String(item) : item
            );
          });

          formik.setValues({
            userType: user_type || '',
            businessEntity: parseInt(business_entity_id) || '',
            defaultClient: matchedClient?.value || '',
            childClient: childIds || '',
            clientName: matchedClient?.label || '',
            childClientName: matchedClientChild?.map((item) => item.label) || '',
            fullName: fullname || '',
            primaryEmail: email_primary || '',
            secondaryEmail: email_secondary || '',
            primaryPhone: mobile_primary || '',
            secondaryPhone: mobile_secondary || '',
            defaultBusinessEntity: default_entity_id || '',
            role: role_id || '',
            userName: username || '',
            password: one_time_password || '',
            lock: lock,
            status: status,
          });

          setIsRoleDisabled(false);
        })
        .catch((error) => console.log(error))
        .finally(() => {
          setIsLoading(false);
        });
    } else {
      setIsRoleDisabled(true);
    }
  }, [id, options, clientOptions]);

  // Prism Api Calling

  useEffect(() => {
    if (selectedBusinessEntityId != null) {
      const findEnityName = options.find((item) => item.value === selectedBusinessEntityId);

      if (findEnityName) {
        setSelectedBusinessEntityName(findEnityName.label);
      }
    }
  }, [selectedBusinessEntityId]);

  useEffect(() => {
    if (selectedBusinessEntityName != null) {
      if (selectedBusinessEntityName.includes('Race Online Ltd')) {
        setIsClientLoading(true);
        raceClients()
          .then((response) => {
            setClientOptions(
              response.map((option) => ({
                value: option.id,
                label: option.name,
              }))
            );
          })
          .catch(errorMessage)
          .finally(() => setIsClientLoading(false));
      } else if (selectedBusinessEntityName.includes('Earth Telecommunication')) {
        setIsClientLoading(true);
        earthClients()
          .then((response) => {
            setClientOptions(
              response.map((option) => ({
                value: option.id,
                label: option.name,
              }))
            );
          })
          .catch(errorMessage)
          .finally(() => setIsClientLoading(false));
      } else if (selectedBusinessEntityName.includes('Dhaka Colo')) {
        setIsClientLoading(true);
        dhakaColoClients()
          .then((response) => {
            setClientOptions(
              response.map((option) => ({
                value: option.id,
                label: option.name,
              }))
            );
          })
          .catch(errorMessage)
          .finally(() => setIsClientLoading(false));
      } else if (selectedBusinessEntityName.includes('Orbit OWN')) {
        setIsClientLoading(true);

        fetchWebAppOwnEntity()
          .then((response) => {
            setClientOptions(
              response.map((option) => ({
                value: option.entity_id,
                label: option.entity_name,
              }))
            );
          })
          .catch(errorMessage)
          .finally(() => setIsClientLoading(false));
      } else if (selectedBusinessEntityName.includes('Orbit Partner')) {
        setIsClientLoading(true);
        fetchWebAppPartnerEntity()
          .then((response) => {
            setClientOptions(
              response.map((option) => ({
                value: option.entity_id,
                label: option.source_entity,
              }))
            );
          })
          .catch(errorMessage)
          .finally(() => setIsClientLoading(false));
      }
    }
  }, [selectedBusinessEntityName]);

  useEffect(() => {
    if (updateSelectedBusinessEntityName != null) {
      if (updateSelectedBusinessEntityName.includes('Race Online Ltd')) {
        setIsClientLoading(true);
        raceClients()
          .then((response) => {
            setClientOptions(
              response.map((option) => ({
                value: option.id,
                label: option.name,
              }))
            );
          })
          .catch(errorMessage)
          .finally(() => setIsClientLoading(false));
      } else if (updateSelectedBusinessEntityName.includes('Earth Telecommunication')) {
        setIsClientLoading(true);
        earthClients()
          .then((response) => {
            setClientOptions(
              response.map((option) => ({
                value: option.id,
                label: option.name,
              }))
            );
          })
          .catch(errorMessage)
          .finally(() => setIsClientLoading(false));
      } else if (updateSelectedBusinessEntityName.includes('Dhaka Colo')) {
        setIsClientLoading(true);
        dhakaColoClients()
          .then((response) => {
            setClientOptions(
              response.map((option) => ({
                value: option.id,
                label: option.name,
              }))
            );
          })
          .catch(errorMessage)
          .finally(() => setIsClientLoading(false));
      } else if (updateSelectedBusinessEntityName.includes('Orbit OWN')) {
        setIsClientLoading(true);

        fetchWebAppOwnEntity()
          .then((response) => {
            setClientOptions(
              response.map((option) => ({
                value: option.entity_id,
                label: option.entity_name,
              }))
            );
          })
          .catch(errorMessage)
          .finally(() => setIsClientLoading(false));
      } else if (updateSelectedBusinessEntityName.includes('Orbit Partner')) {
        setIsClientLoading(true);
        fetchWebAppPartnerEntity()
          .then((response) => {
            setClientOptions(
              response.map((option) => ({
                value: option.entity_id,
                label: option.source_entity,
              }))
            );
          })
          .catch(errorMessage)
          .finally(() => setIsClientLoading(false));
      }
    }
  }, [updateSelectedBusinessEntityName]);

  useEffect(() => {
    if (selectedClientId != null) {
      const selectedClientNames =
        clientOptions && clientOptions.find((option) => option.value === selectedClientId);
      formik.setFieldValue('clientName', selectedClientNames?.label);
      formikAddBusiness.setFieldValue('defaultClientName', selectedClientNames?.label);
    }
  }, [selectedClientId, clientOptions]);

  // get child client name
  useEffect(() => {
    if (selectedChildClientId != null) {
      const selectedClientNames = selectedChildClientId.map((item) => {
        return clientOptions?.find((option) => option.value === item)?.label;
      });

      formik.setFieldValue('childClientName', selectedClientNames);
      formikAddBusiness.setFieldValue('childClientName', selectedClientNames);
    }
  }, [selectedChildClientId, clientOptions]);

  // End
  // console.log(selectedBusinessEntityName);

  const formik = useFormik({
    initialValues: {
      userType: 'Client',
      businessEntity: '',
      defaultClient: '',
      // client: [],
      clientName: '',
      childClient: [],
      childClientName: [],
      fullName: '',
      primaryEmail: '',
      secondaryEmail: '',
      primaryPhone: '',
      secondaryPhone: '',
      defaultBusinessEntity: '',
      role: '',
      userName: userSeriealNumber,
      password: '',
      lock: false,
      status: true,
    },
    validationSchema: clientValidationSchema,
    onSubmit: (values, { resetForm }) => {
      setIsLoading(true);
      const apiCall = id ? update(id, values) : store(values);
      apiCall
        .then((response) => {
          successMessage(response);
          formik.setFieldValue('userName', '');
          resetForm();
        })
        .catch(errorMessage)
        .finally(() => {
          setIsLoading(false);
          if (defaultRoleOptions.length > 0) {
            formik.setFieldValue('role', defaultRoleOptions[0].value);
          }
        });
    },
  });

  const formikAddBusiness = useFormik({
    initialValues: {
      userType: 'Client',
      userId: addBusinessEntity,
      businessEntity: '',
      defaultClient: '',
      defaultClientName: '',
      childClient: [],
      childClientName: [],
    },
    validationSchema: addMultipleBusinessEntityUnderClientValidationSchema,
    onSubmit: (values, { resetForm }) => {
      setIsLoading(true);
      storeMultipleClientWithBusinessEntity(values)
        .then((response) => {
          successMessage(response);
          // resetForm();
        })
        .catch(errorMessage)
        .finally(() => {
          setIsLoading(false);
        });
    },
  });

  // console.log(selectedChildClientId);
  // console.log(formik.values);
  // console.log(formikAddBusiness.values);
  // console.log(formik.errors);
  // console.log("ID " + id);
  // console.log("username " + addBusinessEntity);

  // console.log(selectedBusinessEntityId);

  // console.log(formikAddBusiness.values);
  // console.log('selectedBusinessEntityName', formik.values.businessEntity);

  // console.log('client list', clientOptions);

  if (addBusinessEntity) {
    return (
      <div className="row">
        <div className="col-sm-12 col-md-12 col-lg-12 col-xl-12">
          <div class="alert alert-secondary p-2" role="alert">
            <h6>Add More Business Entity</h6>
            <span>
              <i>Please input the required information.</i>
            </span>
          </div>
        </div>
        <div className="col-sm-12 col-md-6 col-lg-6 col-xl-6">
          <form className="row" onSubmit={formikAddBusiness.handleSubmit}>
            <div className="col-12">
              <div class="input-group mb-3">
                <span class="input-group-text w-25 label-cat-w" id="basic-addon1">
                  Business Entity
                </span>

                <SelectDropdown
                  id="businessEntity"
                  placeholder="Business entity"
                  options={options}
                  value={formikAddBusiness.values.businessEntity}
                  onChange={(value) => {
                    formikAddBusiness.setFieldValue('businessEntity', value);
                    setSelectedBusinessEntityId(value);
                  }}
                  disabled={isLoading}
                />
              </div>
              {formikAddBusiness.touched.businessEntity &&
              formikAddBusiness.errors.businessEntity ? (
                <div className="text-danger">{formikAddBusiness.errors.businessEntity}</div>
              ) : null}
            </div>

            <div className="col-12">
              <div class="input-group mb-3">
                <span class="input-group-text w-25 label-cat-w">Default Client</span>
                <SelectDropdown
                  id="defaultClient"
                  placeholder="Default client"
                  options={clientOptions}
                  value={formikAddBusiness.values.defaultClient}
                  onChange={(value) => {
                    setSelectedClientId(value);
                    formikAddBusiness.setFieldValue('defaultClient', value);
                  }}
                  disabled={isClientLoading}
                />
              </div>
              {formikAddBusiness.touched.defaultClient && formikAddBusiness.errors.defaultClient ? (
                <div className="text-danger">{formikAddBusiness.errors.defaultClient}</div>
              ) : null}
            </div>

            <div className="col-12">
              <div class="input-group mb-3">
                <span class="input-group-text w-25 label-cat-w">Child Client</span>
                <SelectDropdown
                  id="childClient"
                  placeholder="Child Client"
                  options={clientOptions}
                  value={formikAddBusiness.values.childClient}
                  onChange={(value) => {
                    setSelectedChildClientId(value);
                    formikAddBusiness.setFieldValue('childClient', value);
                  }}
                  disabled={isClientLoading}
                  isMulti={true}
                />
              </div>
              {formikAddBusiness.touched.childClient && formikAddBusiness.errors.childClient ? (
                <div className="text-danger">{formikAddBusiness.errors.childClient}</div>
              ) : null}
            </div>

            <div className="col-12 text-end">
              <button type="submit" className="custom-btn">
                Save
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="row">
      <div className="col-sm-12 col-md-12 col-lg-12 col-xl-12">
        <div class="alert alert-secondary p-2" role="alert">
          <h6>{id ? 'Update' : 'Create'} New Client</h6>
          <span>
            <i>Please input the required information.</i>
          </span>
        </div>
      </div>
      <div className="col-sm-12 col-md-12 col-lg-12 col-xl-12">
        <form onSubmit={formik.handleSubmit}>
          <div className="row">
            <div className="col-sm-12 col-md-6 col-lg-6 col-xl-6">
              <div class="input-group mb-3">
                <span class="input-group-text w-25 label-cat-w" id="basic-addon1">
                  Business Entity
                </span>

                <SelectDropdown
                  id="businessEntity"
                  placeholder="Business entity"
                  options={options}
                  value={formik.values.businessEntity}
                  onChange={(value) => {
                    formik.setFieldValue('businessEntity', value);

                    setSelectedBusinessEntityId(value);
                    fetchUserSerialNumber(value);
                    const randomPassword = generateRandomSixDigitPassword();
                    formik.setFieldValue('password', randomPassword);
                  }}
                  disabled={id ? true : isLoading}
                />
              </div>
              {formik.touched.businessEntity && formik.errors.businessEntity ? (
                <div className="text-danger">{formik.errors.businessEntity}</div>
              ) : null}
            </div>

            <div className="col-sm-12 col-md-6 col-lg-6 col-xl-6">
              <div class="input-group mb-3">
                <span class="input-group-text w-25">Full name </span>
                <input
                  type="text"
                  id="fullName"
                  class="form-control"
                  placeholder="Full name"
                  value={formik.values.fullName}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
              </div>
              {formik.touched.fullName && formik.errors.fullName ? (
                <div className="text-danger">{formik.errors.fullName}</div>
              ) : null}
            </div>

            <div className="col-sm-12 col-md-6 col-lg-6 col-xl-6">
              <div class="input-group mb-3">
                <span class="input-group-text w-25 label-cat-w">Default Client</span>
                <SelectDropdown
                  id="defaultClient"
                  placeholder="Default client"
                  options={clientOptions}
                  value={formik.values.defaultClient}
                  onChange={(value) => {
                    setSelectedClientId(value);
                    formik.setFieldValue('defaultClient', value);
                  }}
                  disabled={isLoading}
                />
              </div>
              {formik.touched.defaultClient && formik.errors.defaultClient ? (
                <div className="text-danger">{formik.errors.defaultClient}</div>
              ) : null}
            </div>
            <div className="col-sm-12 col-md-6 col-lg-6 col-xl-6">
              <div class="input-group mb-3">
                <span class="input-group-text w-25 label-cat-w">Child Client</span>
                <SelectDropdown
                  id="childClient"
                  placeholder="Child client"
                  options={clientOptions}
                  value={formik.values.childClient}
                  onChange={(value) => {
                    setSelectedChildClientId(value);
                    formik.setFieldValue('childClient', value);
                  }}
                  disabled={isLoading}
                  isMulti={true}
                />
              </div>
            </div>

            <div className="col-sm-12 col-md-6 col-lg-6 col-xl-6">
              <div class="input-group mb-3">
                <span class="input-group-text w-25">Email </span>
                <input
                  type="email"
                  id="primaryEmail"
                  class="form-control"
                  placeholder="Primary"
                  value={formik.values.primaryEmail}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
              </div>
              {formik.touched.primaryEmail && formik.errors.primaryEmail ? (
                <div className="text-danger">{formik.errors.primaryEmail}</div>
              ) : null}
            </div>
            {/* <div className='col-sm-12 col-md-6 col-lg-6 col-xl-6'>
              <div class='input-group mb-3'>
                <span class='input-group-text w-25 label-cat-w'>
                  Child Client
                </span>
                <SelectDropdown
                  id='client'
                  placeholder='Client'
                  options={clientOptions}
                  value={formik.values.client}
                  onChange={(value) => {
                    setSelectedClientId(value);
                    formik.setFieldValue("client", value);
                  }}
                  disabled={isClientLoading}
                  isMulti={true}
                />
              </div>
              {formik.touched.client && formik.errors.client ? (
                <div className='text-danger'>{formik.errors.client}</div>
              ) : null}
            </div> */}

            <div className="col-sm-12 col-md-6 col-lg-6 col-xl-6">
              <div class="input-group mb-3">
                <span class="input-group-text w-25 label-cat-w" id="basic-addon1">
                  Default Entity
                </span>

                <SelectDropdown
                  id="defaultBusinessEntity"
                  placeholder="Default business entity"
                  options={
                    id
                      ? defaultBusinessEntityOptions
                      : options.filter((option) => selectedBusinessEntityId === option.value)
                  }
                  value={formik.values.defaultBusinessEntity}
                  onChange={(value) => formik.setFieldValue('defaultBusinessEntity', value)}
                  disabled={isLoading}
                />
              </div>
              {formik.touched.defaultBusinessEntity && formik.errors.defaultBusinessEntity ? (
                <div className="text-danger">{formik.errors.defaultBusinessEntity}</div>
              ) : null}
            </div>

            <div className="col-sm-12 col-md-6 col-lg-6 col-xl-6">
              <div class="input-group mb-3">
                <span class="input-group-text w-25">
                  Email <small className="ms-2">(optional)</small>
                </span>
                <input
                  type="email"
                  id="secondaryEmail"
                  class="form-control"
                  placeholder="Secondary"
                  value={formik.values.secondaryEmail}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
              </div>
              {formik.touched.secondaryEmail && formik.errors.secondaryEmail ? (
                <div className="text-danger">{formik.errors.secondaryEmail}</div>
              ) : null}
            </div>
            <div className="col-sm-12 col-md-6 col-lg-6 col-xl-6">
              <div class="input-group mb-3">
                <span class="input-group-text w-25 label-cat-w" id="basic-addon1">
                  {`${id ? 'Role' : 'Default role'}`}
                </span>

                <SelectDropdown
                  id="role"
                  placeholder={`${id ? 'Role' : 'Default role'}`}
                  options={id ? roleOptions : defaultRoleOptions}
                  value={formik.values.role}
                  onChange={(value) => formik.setFieldValue('role', value)}
                  disabled={isRoleDisabled}
                />
              </div>
              {formik.touched.role && formik.errors.role ? (
                <div className="text-danger">{formik.errors.role}</div>
              ) : null}
            </div>

            <div className="col-sm-12 col-md-6 col-lg-6 col-xl-6">
              <div class="input-group mb-3">
                <span class="input-group-text w-25">Phone </span>
                <input
                  type="text"
                  id="primaryPhone"
                  class="form-control"
                  placeholder="Primary"
                  value={formik.values.primaryPhone}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
              </div>
              {formik.touched.primaryPhone && formik.errors.primaryPhone ? (
                <div className="text-danger">{formik.errors.primaryPhone}</div>
              ) : null}
            </div>

            <div className="col-sm-12 col-md-6 col-lg-6 col-xl-6">
              <div class="input-group mb-3">
                <span class="input-group-text w-25">Username</span>
                <input
                  type="text"
                  id="userName"
                  class="form-control"
                  placeholder="Username"
                  value={formik.values.userName}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  disabled={true}
                />
                <button
                  className="bg-white ms-2 rounded px-2"
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    handleCopyPassword(formik.values.userName, 'username');
                  }}
                >
                  {userNameCopyText}
                </button>
              </div>
              {formik.touched.userName && formik.errors.userName ? (
                <div className="text-danger">{formik.errors.userName}</div>
              ) : null}
            </div>

            <div className="col-sm-12 col-md-6 col-lg-6 col-xl-6">
              <div class="input-group mb-3">
                <span class="input-group-text w-25">
                  Phone <small className="ms-2">(optional)</small>
                </span>
                <input
                  type="text"
                  id="secondaryPhone"
                  class="form-control"
                  placeholder="Secondary"
                  value={formik.values.secondaryPhone}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
              </div>
              {formik.touched.secondaryPhone && formik.errors.secondaryPhone ? (
                <div className="text-danger">{formik.errors.secondaryPhone}</div>
              ) : null}
            </div>

            <div className="col-sm-12 col-md-6 col-lg-6 col-xl-6">
              <div class="input-group mb-3">
                <span class="input-group-text w-25">Password</span>
                <input
                  type="text"
                  id="password"
                  class="form-control"
                  placeholder="Password"
                  value={formik.values.password}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  disabled={isRoleDisabled}
                />
                <button
                  className="bg-white ms-2 rounded px-2"
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    handleCopyPassword(formik.values.password, 'password');
                  }}
                >
                  {passwordCopyText}
                </button>
              </div>
              {formik.touched.password && formik.errors.password ? (
                <div className="text-danger">{formik.errors.password}</div>
              ) : null}
            </div>

            <div className="col-sm-12 col-md-6 col-lg-6 col-xl-6">
              <div className="d-flex justify-content-between align-items-center">
                <div className="d-flex">
                  <div className="form-check me-5">
                    <input
                      className="form-check-input bordered"
                      type="checkbox"
                      id="lock"
                      checked={formik.values.lock}
                      onChange={(e) => {
                        formik.setFieldValue('lock', e.target.checked);
                      }}
                    />
                    <label className="form-check-label" htmlFor="lock">
                      Lock
                    </label>
                  </div>
                  <div className="form-check">
                    <input
                      className="form-check-input bordered"
                      type="checkbox"
                      id="status"
                      checked={formik.values.status}
                      onChange={(e) => {
                        formik.setFieldValue('status', e.target.checked);
                      }}
                    />
                    <label className="form-check-label" htmlFor="status">
                      Active
                    </label>
                  </div>
                </div>
                <div>
                  <button type="submit" className="custom-btn">
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
