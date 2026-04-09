import React, { useContext, useEffect, useRef, useState, useCallback } from 'react';
import { useFormik } from 'formik';
import { Smile } from 'lucide-react';
import { categoryList, faPhoneIcon, subCategoryList } from '../../../data/data';
import { errorMessage, successMessage } from '../../../api/api-config/apiResponseMessage';
import { fetchCompany } from '../../../api/api-client/settings/companyApi';
import { SelectDropdown } from '../components/SelectDropdown';
import { userContext } from '../../context/UserContext';
import {
  fetchClientByDefaultEntity,
  fetchUserSerial,
} from '../../../api/api-client/settings/clientApi';
import {
  fetchCategory,
  fetchCategoryAllForPartner,
  fetchCategoryByDefaultBusinessEntityId,
} from '../../../api/api-client/settings/categoryApi';
import {
  fetchSubcategoryAllForPartner,
  fetchSubCategoryByCategoryId,
} from '../../../api/api-client/settings/subCategoryApi';
import { partnerComplainValidationSchema } from '../../../schema/ValidationSchemas';
import { fetchTeamByDefaultBusinessEntity } from '../../../api/api-client/settings/teamApi';
import { Link, useNavigate } from 'react-router-dom';
import {
  fetchWebAppEntityDetails,
  forwardToHQ,
  createVoiceTicket,
  sendSMSByPartnerNumber,
  storeSelfTicket,
} from '../../../api/api-client/ticketApi';
import {
  dhakaColoClientDetails,
  earthClientDetails,
  raceClientDetails,
} from '../../../api/api-client/prismerpApi';
import { generateStrongPassword } from '../../../utils/utility';
import { fetchDefaultClientRole } from '../../../api/api-client/settings/roleApi';
import { useUserRolePermissions } from '../../custom-hook/useUserRolePermissions';
import { fetchAggregatorsByClient } from '../../../api/api-client/settings/clientAggregatorMapping';
import CustomerTextEditor from '../components/text-editor/CustomerTextEditor';
import { FloatingVoiceRecorderButton } from '../components/recorder/FloatingVoiceRecorderButton';
import { VoiceComplaintRecorderModal } from '../components/recorder/VoiceComplaintRecorderModal';
import { IsLoadingContext } from '../../context/LoaderContext';

import { useDropzone } from 'react-dropzone';

export const CustomerComplaintCreate = () => {
  const { user } = useContext(userContext);
  const { setIsLoadingContextUpdated } = useContext(IsLoadingContext);
  const { hasPermission } = useUserRolePermissions();
  const navigate = useNavigate();
  const clearAttachtmentRef = useRef();
  const [businessEntityOptions, setBusinessEntityOptions] = useState([]);
  const [clientOptions, setClientOptions] = useState([]);
  const [categoryOptions, setCategoryOptions] = useState([]);
  const [subCategoryOptions, setSubCategoryOptions] = useState([]);
  const [clientName, setClientName] = useState(null);
  const [defaultClientId, setDefaultClientId] = useState(null);
  const [selectedClientId, setSelectedClientId] = useState(null);
  const [foundClientInfo, setFoundClientInfo] = useState([]);
  const [clientCount, setClientCount] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isChecked, setIsChecked] = useState(false);
  const [languageLabel, setLanguageLabel] = useState('Bangla');
  const [selectedCategoryId, setSelectedCategoryId] = useState(null);
  const [defaultBusinessEntityId, setDefaultBusinessEntityId] = useState(null);
  const [submitType, setSubmitType] = useState('');
  const [defaultRoleOptions, setDefaultRoleOptions] = useState([]);
  const [aggregatorOptions, setAggregatorOptions] = useState([]);
  const [isLoadingAggregators, setIsLoadingAggregators] = useState(false);
  const [vendorClientId, setVendorClientId] = useState(null);
  const [isVoiceRecorderOpen, setIsVoiceRecorderOpen] = useState(false);

  const isUserCustomer = user?.type === 'Customer';

  useEffect(() => {
    setDefaultBusinessEntityId(user?.default_entity_id);
  }, [user?.default_entity_id]);

  useEffect(() => {
    formik.setFieldValue('clientInfo.role', defaultRoleOptions?.[0]?.value);
  }, [defaultClientId]);

  useEffect(() => {
    setIsLoading(true);
    const fetchBusinessEntityOptions = () => {
      fetchCompany({
        userType: user?.type,
        userId: user?.id,
      }).then((response) => {
        setBusinessEntityOptions(
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

    Promise.all([fetchBusinessEntityOptions(), fetchDefaultroleOptions()])
      .catch(errorMessage)
      .finally(() => setIsLoading(false));
  }, []);

  // Fetch aggregators when business entity is 8 and we have vendor client ID
  useEffect(() => {
    if (vendorClientId && defaultBusinessEntityId === 8) {
      setIsLoadingAggregators(true);

      fetchAggregatorsByClient(vendorClientId)
        .then((response) => {
          if (response.success && response.data && response.data.length > 0) {
            const formattedAggregators = response.data.map((agg) => ({
              value: agg.aggregator_id,
              label: agg.name,
            }));

            setAggregatorOptions(formattedAggregators);

            // Set the first aggregator as default
            setAggregatorId(formattedAggregators[0].value);
            formik.setFieldValue('aggregatorId', formattedAggregators[0].value);
          } else {
            setAggregatorOptions([]);
            formik.setFieldValue('aggregatorId', '');
          }
        })
        .catch((error) => {
          errorMessage('Error fetching aggregators');

          setAggregatorOptions([]);
          formik.setFieldValue('aggregatorId', '');
        })
        .finally(() => {
          setIsLoadingAggregators(false);
        });
    } else {
      // Reset aggregator options if conditions are not met
      setAggregatorOptions([]);
      formik.setFieldValue('aggregatorId', '');
    }
  }, [vendorClientId, defaultBusinessEntityId]);

  useEffect(() => {
    if (defaultBusinessEntityId != null) {
      const fetchCategoryByEntity = () => {
        fetchCategoryAllForPartner(defaultBusinessEntityId).then((response) => {
          setCategoryOptions(response.data);
        });
      };

      const fetchClientByEntity = () => {
        fetchClientByDefaultEntity({
          userType: user?.type,
          userId: user?.id,
          businessEntity: defaultBusinessEntityId,
        }).then((response) => {
          setClientOptions(
            response.data.clients.map((option) => ({
              value: option.client_id,
              label: option.client_name,
            }))
          );

          setDefaultClientId(response.data.clients?.[0]?.client_id);
          setClientCount(response.data.rowCount);
          setClientName(response.data.clients?.[0]?.client_name);
          formik.setFieldValue('client', response.data.clients?.[0]?.client_id);
          formik.setFieldValue('clientInfo.client', response.data.clients?.[0]?.client_id);
        });
      };

      const fetchTeamByEntity = () => {
        fetchTeamByDefaultBusinessEntity(defaultBusinessEntityId).then((response) => {
          formik.setFieldValue('teamId', response.data.team_id);
        });
      };

      Promise.all([
        fetchCategoryByEntity(),
        fetchClientByEntity(),
        fetchTeamByEntity(),
        fetchUserSerialNumber(defaultBusinessEntityId),
      ])
        .catch(errorMessage)
        .finally(() => {
          formik.setFieldValue('clientInfo.role', defaultRoleOptions?.[0]?.value);
          formik.setFieldValue('clientInfo.password', generateStrongPassword());
          formik.setFieldValue('clientInfo.businessEntity', defaultBusinessEntityId);
          formik.setFieldValue('clientInfo.defaultBusinessEntity', defaultBusinessEntityId);
          formik.setFieldValue('user_id', user?.id);
          formik.setFieldValue('businessEntity', defaultBusinessEntityId);
          setIsLoading(false);
        });
    }
  }, [defaultBusinessEntityId]);

  const handleLanguageLabel = () => {
    setIsChecked(!isChecked);
    setLanguageLabel(!isChecked ? 'English' : 'Bangla');
  };

  const fetchUserSerialNumber = (entityId) => {
    if (entityId != '') {
      fetchUserSerial(entityId)
        .then((response) => {
          formik.setFieldValue('clientInfo.userName', response.data);
        })
        .catch(errorMessage);
    }
  };

  useEffect(() => {
    if (selectedCategoryId != null && defaultBusinessEntityId != null) {
      setIsLoading(true);
      fetchSubcategoryAllForPartner(selectedCategoryId, defaultBusinessEntityId)
        .then((response) => {
          setSubCategoryOptions(response.data);
        })
        .catch(errorMessage)
        .finally(() => setIsLoading(false));
    }
  }, [selectedCategoryId, defaultBusinessEntityId]);

  useEffect(() => {
    if (defaultClientId != null) {
      if (defaultBusinessEntityId == 4) {
        setIsLoading(true);
        fetchUserSerialNumber(defaultBusinessEntityId);
        dhakaColoClientDetails(defaultClientId)
          .then((response) => {
            setFoundClientInfo(response);
            formik.setFieldValue('clientInfo.clientName', response?.name);
            formik.setFieldValue('clientInfo.fullName', response?.name);
            formik.setFieldValue('clientInfo.primaryEmail', response?.email || '');
            formik.setFieldValue('clientInfo.secondaryEmail', '');
            formik.setFieldValue('clientInfo.primaryPhone', response?.phone || '');
            formik.setFieldValue('clientInfo.secondaryPhone', '');
            formik.setFieldValue('clientInfo.password', generateStrongPassword());
            formik.setFieldValue('clientInfo.lock', 0);
            formik.setFieldValue('clientInfo.status', 1);
          })
          .catch(errorMessage)
          .finally(() => setIsLoading(false));
      } else if (defaultBusinessEntityId == 6) {
        setIsLoading(true);
        fetchUserSerialNumber(defaultBusinessEntityId);
        earthClientDetails(defaultClientId)
          .then((response) => {
            setFoundClientInfo(response);
            formik.setFieldValue('clientInfo.clientName', response?.name);
            formik.setFieldValue('clientInfo.fullName', response?.name);
            formik.setFieldValue('clientInfo.primaryEmail', response?.email || '');
            formik.setFieldValue('clientInfo.secondaryEmail', '');
            formik.setFieldValue('clientInfo.primaryPhone', response?.phone || '');
            formik.setFieldValue('clientInfo.secondaryPhone', '');
            formik.setFieldValue('clientInfo.password', generateStrongPassword());
            formik.setFieldValue('clientInfo.lock', 0);
            formik.setFieldValue('clientInfo.status', 1);
          })
          .catch(errorMessage)
          .finally(() => setIsLoading(false));
      } else if (defaultBusinessEntityId == 5) {
        setIsLoading(true);
        fetchUserSerialNumber(defaultBusinessEntityId);
        raceClientDetails(defaultClientId)
          .then((response) => {
            setFoundClientInfo(response);
            formik.setFieldValue('clientInfo.clientName', response?.name);
            formik.setFieldValue('clientInfo.fullName', response?.name);
            formik.setFieldValue('clientInfo.primaryEmail', response?.email || '');
            formik.setFieldValue('clientInfo.secondaryEmail', '');
            formik.setFieldValue('clientInfo.primaryPhone', response?.phone || '');
            formik.setFieldValue('clientInfo.secondaryPhone', '');
            formik.setFieldValue('clientInfo.password', generateStrongPassword());
            formik.setFieldValue('clientInfo.lock', 0);
            formik.setFieldValue('clientInfo.status', 1);
          })
          .catch(errorMessage)
          .finally(() => setIsLoading(false));
      } else if (defaultBusinessEntityId == 8) {
        setIsLoading(true);
        fetchUserSerialNumber(defaultBusinessEntityId);

        fetchWebAppEntityDetails(defaultClientId)
          .then((response) => {
            setFoundClientInfo(response?.[0]);

            // Extract and store the vendor client_id (entity_id)
            const entityId = response?.[0]?.entity_id;
            if (entityId) {
              setVendorClientId(entityId);
            }

            formik.setFieldValue('clientInfo.clientName', response?.[0]?.entity_name);
            formik.setFieldValue('clientInfo.fullName', response?.[0]?.entity_name);
            formik.setFieldValue('clientInfo.clientType', response?.[0]?.entity_type || '');
            formik.setFieldValue('clientInfo.billingSource', response?.[0]?.source || '');
            formik.setFieldValue('clientInfo.primaryEmail', response?.[0]?.email || '');
            formik.setFieldValue('clientInfo.secondaryEmail', '');
            formik.setFieldValue('clientInfo.primaryPhone', response?.[0]?.phone || '');
            formik.setFieldValue('clientInfo.secondaryPhone', '');
            formik.setFieldValue('clientInfo.password', generateStrongPassword());
            formik.setFieldValue('clientInfo.lock', 0);
            formik.setFieldValue('clientInfo.status', 1);
          })
          .catch(errorMessage)
          .finally(() => setIsLoading(false));
      }
    }
  }, [defaultClientId]);

  const smsSendForPatner = (smsData) => {
    sendSMSByPartnerNumber(smsData)
      .then((response) => {})
      .catch(errorMessage);
  };



  const formik = useFormik({
    initialValues: {
      clientInfo: {
        userType: 'Client',
        businessEntity: '',
        client: '',
        clientName: '',
        clientType: '',
        fullName: '',
        billingSource: '',
        primaryEmail: '',
        secondaryEmail: '',
        primaryPhone: '',
        secondaryPhone: '',
        defaultBusinessEntity: '',
        role: '',
        userName: '',
        password: '',
        lock: 0,
        status: 1,
      },
      user_id: '',
      businessEntity: '',
      client: '',
      category: '',
      subCategory: '',
      sid: '',
      ccEmail: [],
      source: 1,
      teamId: '',
      priority: 3,
      status: 1,
      refTicket: '',
      mobileNumber: '',
      attachment: [],
      descriptions: '',
      aggregatorId: '',
    },
    validationSchema: partnerComplainValidationSchema,
    onSubmit: (values, { resetForm }) => {
      setIsLoading(true);

      const formData = new FormData();

      Object.keys(values.clientInfo).forEach((key) => {
        formData.append(`clientInfo[${key}]`, values.clientInfo[key]);
      });

      formData.append('user_id', values.user_id);
      formData.append('businessEntity', values.businessEntity);
      formData.append('client', values.client);
      formData.append('sid', '');
      formData.append('ccEmail', []);
      formData.append('source', '');
      formData.append('category', values.category);
      formData.append('subCategory', values.subCategory);
      formData.append('teamId', values.teamId);
      formData.append('priority', values.priority);
      formData.append('status', values.status);
      formData.append('refTicket', '');
      formData.append('mobileNumber', values.mobileNumber);

      // Add aggregator ID if business entity is 8
      if (defaultBusinessEntityId === 8 && values.aggregatorId) {
        formData.append('aggregatorId', values.aggregatorId);
      }

      const subcateName = subCategoryOptions?.filter((item) => item.id == values.subCategory);
      formData.append('subCategoryName', subcateName[0]?.sub_category_in_english);
     

      const attachments =
        values.attachment instanceof FileList
          ? Array.from(values.attachment)
          : values.attachment || [];

      attachments.forEach((file, index) => {
        formData.append(`attachment[${index}]`, file);
      });
      formData.append('descriptions', values.descriptions);


      const apiCall = submitType === 'self_ticket_create' ? storeSelfTicket : forwardToHQ;
      apiCall(formData)
        .then((response) => {
          successMessage(response);
          navigate('/admin/tickets');
          const patnerSMSData = {
            businessEntity: user?.fullname,
            nature: values.subCategory,
            phone: values.mobileNumber,
          };

          if (values.mobileNumber) {
            smsSendForPatner(patnerSMSData);
          }
        })
        .catch(errorMessage)
        .finally(() => {
          setIsLoading(false);
        });
    },
  });

  // For drag and drop file upload
  // Dropdowns
  const inputRef = useRef(null);

  // Keep auto-focus active so the cursor always blinks
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, [formik.values.attachment]);

  // Prevent typing inside the input field (allow paste only)
  const handleKeyDown = (e) => {
    // Allow only Ctrl+V (Windows) or Cmd+V (Mac) for paste
    if ((e.ctrlKey || e.metaKey) && e.key === 'v') {
      return;
    }

    // Block all other keystrokes to prevent manual typing
    e.preventDefault();
  };

  const fileListRef = useRef(new DataTransfer());

  const syncFilesToFormik = (dataTransfer) => {
    fileListRef.current = dataTransfer;
    formik.setFieldValue('attachment', dataTransfer.files); // real FileList
  };

  const onDrop = useCallback(
    (acceptedFiles) => {
      const dt = new DataTransfer();
      // Keep existing files
      const existing = formik.values.attachment;
      if (existing && existing.length > 0) {
        Array.from(existing).forEach((f) => dt.items.add(f));
      }
      acceptedFiles.forEach((f) => dt.items.add(f));
      syncFilesToFormik(dt);
    },
    [formik]
  );

  // React Dropzone configuration
  const { getRootProps, getInputProps, isDragActive, open } = useDropzone({
    onDrop,
    multiple: true,
    noClick: true, // Disable default click-to-open behavior
    noKeyboard: true, // Disable keyboard-triggered file dialog
  });

  const handlePaste = useCallback(
    (event) => {
      const items = event.clipboardData.items;
      const dt = new DataTransfer();
      const existing = formik.values.attachment;
      if (existing && existing.length > 0) {
        Array.from(existing).forEach((f) => dt.items.add(f));
      }
      for (let i = 0; i < items.length; i++) {
        if (items[i].kind === 'file') {
          const file = items[i].getAsFile();
          if (file) {
            const renamed = new File([file], `pasted_img_${Date.now()}.png`, { type: file.type });
            dt.items.add(renamed);
          }
        }
      }
      syncFilesToFormik(dt);
    },
    [formik]
  );

  const removeFile = (index) => {
    const dt = new DataTransfer();
    const existing = formik.values.attachment;
    Array.from(existing).forEach((f, i) => {
      if (i !== index) dt.items.add(f);
    });
    syncFilesToFormik(dt);
  };
  
  // voice integration handlers
 const sendVoiceToApi = async (file) => {
  const formData = new FormData();

  // ✅ Required by backend
  formData.append("file", file);


  try {
    const companyId = formik.values.businessEntity;

    const response = await fetch(
      `${import.meta.env.VITE_VOICE_API_URL}?company_id=${companyId}`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${import.meta.env.VITE_VOICE_API_KEY}`,
        },
        body: formData, 
      }
    );

    const data = await response.json();

    return data;
  } catch (error) {
    errorMessage("Failed to process voice input. Please try again.");
    console.error("Voice API Error:", error);
    return null;
  }
};

  const handleVoiceApiSubmit = async ({ number, file,voiceData }) => {
  try {
    
    const values = formik.values;
    const formData = new FormData();

    // clientInfo
    Object.keys(values.clientInfo).forEach((key) => {
      formData.append(`clientInfo[${key}]`, values.clientInfo[key]);
    });

    // normal fields
    formData.append('user_id', values.user_id);
    formData.append('businessEntity', values.businessEntity);
    formData.append('client', values.client);
    formData.append('sid', '');
    formData.append('ccEmail', []);
    formData.append('source', '');
    // ✅ category & subcategory from AI
    formData.append('category', voiceData?.category_id);
    formData.append('subCategory', voiceData?.subcategory_id);
    formData.append('subCategoryName', voiceData?.subcategory);

    formData.append('teamId', values.teamId);
    formData.append('priority', values.priority);
    formData.append('status', values.status);
    formData.append('refTicket', '');

    // ✅ OVERRIDE mobile number from voice
    formData.append('mobileNumber', number);

    // aggregator
    if (defaultBusinessEntityId === 8 && values.aggregatorId) {
      formData.append('aggregatorId', values.aggregatorId);
    }


    // ✅ existing attachments + voice file merge
    const existingFiles =
      values.attachment instanceof FileList
        ? Array.from(values.attachment)
        : values.attachment || [];

    [...existingFiles, file].forEach((f, index) => {
      formData.append(`attachment[${index}]`, f);
    });

    formData.append('descriptions', values.descriptions);


    // ✅ NEW API CALL (replace with your API)
    createVoiceTicket(formData)
      .then((response) => {
        successMessage(response);
        navigate('/admin/tickets');

         const patnerSMSData = {
            businessEntity: user?.fullname,
            nature: values.subCategory,
            phone: values.mobileNumber,
          };

        // optional SMS
        if (number) {
          smsSendForPatner(patnerSMSData);
        }
      })
      .catch(errorMessage)
      .finally(() => setIsLoadingContextUpdated(false));

  } catch (err) {
    console.error(err);
    setIsLoadingContextUpdated(false);
  }
};

const handleVoiceComplaintSubmit = async ({ number, file }) => {
  setIsVoiceRecorderOpen(false);
  setIsLoadingContextUpdated(true);

  // ✅ first call voice API
  const voiceResponse = await sendVoiceToApi(file);

  // ✅ only if success
  if (voiceResponse) {
    
    handleVoiceApiSubmit({ number, file, voiceData: voiceResponse });
  } else {
    errorMessage("Voice processing failed");
  }
};




  return (
    <section>
      <div className="container-fluid">
        <div className="row">
          <div className="col-12">
            <div
              className="alert alert-secondary p-2 d-flex justify-content-between align-items-center"
              role="alert"
            >
              <div className="">
                <div className="d-flex gap-1">
                  <Smile color="black" strokeWidth={1} fill="rgb(255 193 7)" />
                  <div className="">
                    {isUserCustomer ? (
                      <h6 title={user?.fullname}>
                        Welcome, <span style={{ color: 'rgb(0, 188, 212)' }}>{user?.fullname}</span>
                      </h6>
                    ) : (
                      <h6 title={clientName}>
                        Welcome,{' '}
                        <span style={{ color: 'rgb(0, 188, 212)' }}>
                          {clientName ? `${clientName.slice(0, 30)} ...` : ''}
                        </span>
                      </h6>
                    )}
                  </div>
                </div>
                <span>
                  <i>We are here to assist you for any queries. Please drop a ticket.</i>
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="container-fluid">
        <form onSubmit={formik.handleSubmit}>
          {user?.type === 'Client' && (
            <div className="row">
              <div className="col-12 col-sm-6 col-md-6">
                <div className="row flex-row-reverse flex-sm-row flex-md-row flex-lg-row flex-xl-row">
                  <div className="col-4 col-sm-2 col-md-2 col-lg-2 col-xl-2">
                    <div className="input-group mt-1 mb-3">
                      <label className="form-check-label mt-1" htmlFor="read-unread">
                        {languageLabel}
                      </label>

                      <div className="form-check form-switch form-check-reverse">
                        <input
                          className="form-check-input fs-5"
                          type="checkbox"
                          role="switch"
                          id="read-unread"
                          checked={isChecked}
                          onChange={handleLanguageLabel}
                        />
                      </div>
                    </div>
                  </div>
                  <div className="col-8 col-sm-10 col-md-10 col-lg-10 col-xl-10">
                    <div className="input-group mb-3">
                      <span className="input-group-text w-25" id="basic-addon1">
                        Entity
                      </span>

                      <SelectDropdown
                        id="businessEntity"
                        placeholder="Business entity"
                        options={businessEntityOptions}
                        value={formik.values.businessEntity}
                        onChange={(value) => {
                          formik.setFieldValue('businessEntity', value);
                          formik.setFieldValue('clientInfo.businessEntity', value);
                          formik.setFieldValue('clientInfo.defaultBusinessEntity', value);
                          setDefaultBusinessEntityId(value);
                        }}
                        disabled={isLoading || businessEntityOptions.length == 1}
                      />
                    </div>
                    {formik.touched.businessEntity && formik.errors.businessEntity && (
                      <div className="text-danger">{formik.errors.businessEntity}</div>
                    )}
                  </div>
                </div>
              </div>

              {clientCount && clientCount > 1 && (
                <div className="col-sm-12 col-md-6 col-lg-6 col-xl-6">
                  <div className="input-group mb-3">
                    <span className="input-group-text w-25">Client</span>
                    <SelectDropdown
                      id="client"
                      placeholder="Name"
                      options={clientOptions}
                      value={formik.values.client}
                      onChange={(value) => {
                        setDefaultClientId(value);
                        formik.setFieldValue('client', value);
                        formik.setFieldValue('clientInfo.client', value);
                        const findClient = clientOptions.find((option) => option.value === value);
                        setClientName(findClient?.label || '');
                      }}
                      disabled={isLoading}
                    />
                  </div>
                  {formik.touched.client && formik.errors.client && (
                    <div className="text-danger">{formik.errors.client}</div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Aggregator Dropdown - Only show for business entity 8 */}
          {defaultBusinessEntityId === 8 && aggregatorOptions.length > 0 && (
            <div className="row">
              <div className="col-12">
                <div className="input-group mb-3">
                  <span className="input-group-text w-25">Aggregator</span>
                  <SelectDropdown
                    id="aggregatorId"
                    placeholder="Select Aggregator"
                    options={aggregatorOptions}
                    value={formik.values.aggregatorId}
                    onChange={(value) => {
                      formik.setFieldValue('aggregatorId', value);
                    }}
                    disabled={isLoadingAggregators}
                  />
                </div>
                {formik.touched.aggregatorId && formik.errors.aggregatorId && (
                  <div className="text-danger">{formik.errors.aggregatorId}</div>
                )}
              </div>
            </div>
          )}

          <div className="row">
            <div className="col-sm-12 col-md-3 col-lg-3 col-xl-3">
              <div className="custom-card">
                {isUserCustomer ? (
                  <h6 className="custom-card-header d-flex justify-content-between">
                    <span> Choose Category</span>
                    <div className="input-group w-auto me-2">
                      <label className="form-check-label mt-1" htmlFor="read-unread">
                        {languageLabel}
                      </label>

                      <div className="form-check form-switch form-check-reverse">
                        <input
                          className="form-check-input fs-5"
                          type="checkbox"
                          role="switch"
                          id="read-unread"
                          checked={isChecked}
                          onChange={handleLanguageLabel}
                        />
                      </div>
                    </div>
                  </h6>
                ) : (
                  <h6 className="custom-card-header">Choose Category</h6>
                )}

                <div className="pb-1 pt-3 px-3 customer-category-list">
                  <ul>
                    {categoryOptions &&
                      categoryOptions.map((item, index) => (
                        <li key={index}>
                          <div className="form-check form-check-inline">
                            <input
                              className="form-check-input"
                              type="radio"
                              name="category"
                              id={`catid${index}`}
                              value={item.id}
                              checked={formik.values.category === item.id}
                              onChange={() => {
                                formik.setFieldValue('category', item.id);
                                setSelectedCategoryId(item.id);
                                formik.setFieldValue('subCategory', '');
                              }}
                            />
                            <label className="form-check-label" htmlFor={`catid${index}`}>
                              {isChecked ? item.category_in_english : item.category_in_bangla}
                            </label>
                          </div>
                          {formik.touched.category && formik.errors.category ? (
                            <div className="text-danger">{formik.errors.category}</div>
                          ) : null}
                        </li>
                      ))}
                  </ul>
                </div>
              </div>
            </div>
            {subCategoryOptions.length > 0 && (
              <div className="col-sm-12 col-md-9 col-lg-9 col-xl-9">
                <div className="custom-card">
                  <h6 className="custom-card-header">Pick your item</h6>
                  <div className="pb-1 pt-3 px-3 customer-subcategory-list">
                    <ul>
                      {(subCategoryOptions &&
                        subCategoryOptions.map((item, index) => (
                          <li key={index}>
                            <div className="form-check form-check-inline">
                              <input
                                className="form-check-input"
                                type="radio"
                                name="subCategory"
                                id={`subid${index}`}
                                value={item.id}
                                checked={formik.values.subCategory === item.id}
                                onChange={() => {
                                  formik.setFieldValue('subCategory', item.id);
                                }}
                              />
                              <label className="form-check-label" htmlFor={`subid${index}`}>
                                {isChecked
                                  ? item.sub_category_in_english
                                  : item.sub_category_in_bangla}
                              </label>
                            </div>
                            {formik.touched.subCategory && formik.errors.subCategory ? (
                              <div className="text-danger">{formik.errors.subCategory}</div>
                            ) : null}
                          </li>
                        ))) || <p>No Record Found !</p>}
                    </ul>
                  </div>
                </div>
              </div>
            )}
          </div>
          <div className="row">
            <div className="col-12">
              <div className="input-group mb-3">
                <span className="input-group-text">{faPhoneIcon}</span>
                <input
                  className="form-control"
                  id="mobileNumber"
                  type="text"
                  placeholder={isChecked
                  ? 'Enter your mobile number'
                  : 'আপনার মোবাইল নম্বর টাইপ করুন'}
                  value={formik.values.mobileNumber}
                  onChange={formik.handleChange}
                />
              </div>
              {formik.touched.mobileNumber && formik.errors.mobileNumber ? (
                <div className="text-danger">{formik.errors.mobileNumber}</div>
              ) : null}
            </div>
            {/*
            <div className="col-12">
              <div className="">
                <input
                  ref={clearAttachtmentRef}
                  className="form-control"
                  id="attachment"
                  type="file"
                  multiple
                  onChange={(e) => {
                    formik.setFieldValue('attachment', e.currentTarget.files);
                  }}
                />
              </div>
            </div> */}

            <div className="col-sm-12 col-md-12 col-lg-12 col-xl-12">
              <div
                {...getRootProps()}
                className={`input-group mb-3 ${isDragActive ? 'border border-primary' : ''}`}
                style={{ outline: 'none' }}
              >
                <input {...getInputProps()} />

                <span
                  className="input-group-text px-3 bg-light text-dark border-end-0"
                  style={{
                    borderRadius: '5px 0 0 5px',
                    cursor: 'pointer',
                    fontWeight: '500',
                  }}
                  onClick={(e) => {
                    e.stopPropagation();
                    open();
                  }}
                >
                   <i className="bi bi-upload"></i>
                </span>

                <input
                  ref={inputRef}
                  type="text"
                  onKeyDown={handleKeyDown}
                  onPaste={handlePaste}
                  autoComplete="off"
                  className="form-control bg-white shadow-none"
                  // placeholder={
                  //   formik.values.attachment?.length > 0
                  //     ? `${formik.values.attachment.length} files selected`
                  //     : 'Attach files by dragging, dropping, or pasting screenshots'
                  // }
                  placeholder={
                  formik.values.attachment?.length > 0
                    ? `${formik.values.attachment.length} files selected`
                    : isChecked
                      ? 'Drag, paste, or upload files'
                       : 'ফাইল drag, paste বা upload করুন'
                }
                  style={{
                    cursor: 'text',
                    caretColor: 'black',
                  }}
                />
              </div>

              {formik.values.attachment?.length > 0 && (
                <div className="mb-3">
                  {Array.from(formik.values.attachment).map((file, index) => (
                    <div
                      key={index}
                      className="d-flex align-items-center justify-content-between p-2 mb-1 border rounded bg-white shadow-sm"
                    >
                      <div className="d-flex align-items-center text-truncate small">
                        <i className="bi bi-file-earmark-image me-2 text-primary"></i>
                        <span className="text-truncate" title={file.name}>
                          {file.name}
                        </span>
                        <small className="ms-2 text-muted">
                          ({(file.size / 1024).toFixed(1)} KB)
                        </small>
                      </div>
                      <button
                        type="button"
                        className="btn btn-sm text-danger p-0 ms-2"
                        onClick={(e) => {
                          e.stopPropagation();
                          removeFile(index);
                        }}
                      >
                        <i className="bi bi-x-circle-fill"></i>
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* <div className="col-12">
              <div className="input-group my-3">
                <span className="input-group-text">Description</span>
                <textarea
                  className="form-control"
                  rows="1"
                  id="descriptions"
                  value={formik.values.descriptions}
                  onChange={formik.handleChange}
                ></textarea>
              </div>
            </div> */}
            <div className="col-12">
              <div className="input-group my-3">

                <div className="flex-grow-1" style={{ minHeight: '200px' }}>
                  <CustomerTextEditor
                    name="descriptions"
                    value={formik.values.descriptions}
                    placeholder={isChecked
                    ? 'Write description...'
                    : 'বিস্তারিত লিখুন...'}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                  />
                </div>
              </div>
            </div>

            <div className="col-12">
              <div className="d-flex justify-content-end gap-1">
                {hasPermission('Raise_Ticket') && (
                  <button
                    type="submit"
                    className="custom-btn-for-canvas"
                    onClick={() => setSubmitType('forwardToHQ')}
                  >
                    <i className="bi bi-send me-1"></i>টিকেট করুন
                  </button>
                )}
              </div>
            </div>
          </div>
        </form>
      </div>


            <FloatingVoiceRecorderButton
        onClick={() => setIsVoiceRecorderOpen(true)}
        ariaLabel={isChecked ? 'Open voice complaint recorder' : 'ভয়েস অভিযোগ রেকর্ডার খুলুন'}
        tooltipText={
          isChecked
            ? 'You can also create a ticket with your voice.'
            : 'আপনি চাইলে ভয়েস রেকর্ড করেও টিকেট করতে পারবেন।'
        }
      />
      <VoiceComplaintRecorderModal
        show={isVoiceRecorderOpen}
        onClose={() => setIsVoiceRecorderOpen(false)}
        onSubmit={handleVoiceComplaintSubmit}
        isSubmitting={isLoading}
        isEnglish={isChecked}
        initialNumber={formik.values.mobileNumber}
      />

    </section>
  );
};
