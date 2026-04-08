import React, { useContext, useEffect, useState, useRef, useCallback } from 'react';
import { useFormik } from 'formik';

import {
  faUserClockIcon,
  faBusinessTimeIcon,
  emailIcon,
  faBuildingIcon,
  faPhoneIcon,
  faUserTieIcon,
  plusIcon,
  faBriefcaseIcon,
  faBangladeshiTakaSignIcon,
  faUpDownIcon,
  faListOlIcon,
} from '../../../data/data';
import { fetchCompany } from '../../../api/api-client/settings/companyApi';
import { fetchDefaultClientRole } from '../../../api/api-client/settings/roleApi';
import { fetchUserSerial } from '../../../api/api-client/settings/clientApi';
import {
  errorMessage,
  successMessage,
  warningMessage,
} from '../../../api/api-config/apiResponseMessage';
import { SelectDropdown } from '../components/SelectDropdown';
import {
  generateStrongPassword,
  getFirstCaracterOfFirstTwoWord,
  getWarningMessage,
} from '../../../utils/utility';
import {
  fetchBackboneElementListById,
  fetchBackboneElements,
  fetchRaceMaximEntity,
  fetchRaceMaximEntityDetails,
  fetchWebAppEntityDetails,
  fetchWebAppEntityDetailsOwn,
  fetchWebAppOwnEntity,
  fetchWebAppPartnerEntity,
  fetchWebAppSIDDetails,
  getBranchDetailsById,
  getClientIdGenaratedBySystem,
  getClientListFromLocal,
  getOpenTicketsForSID,
  sendSMSByPartnerNumber,
  sendSMSBySID,
  store,
} from '../../../api/api-client/ticketApi';
import { getCcEmail, getPriority, getSource, getStatus } from '../../../api/api-client/utilityApi';
import { fetchAllTeam, fetchTeamBySubCategory } from '../../../api/api-client/settings/teamApi';
import {
  fetchCategory,
  fetchCategoryByDefaultBusinessEntityId,
} from '../../../api/api-client/settings/categoryApi';
import { fetchDivision } from '../../../api/api-client/settings/divisionApi';
import { createTicketValidationSchema } from '../../../schema/ValidationSchemas';
import { fetchSubCategoryByCategoryId } from '../../../api/api-client/settings/subCategoryApi';
import { userContext } from '../../context/UserContext';
import { fetchSLABySubcategoryId } from '../../../api/api-client/settings/slaApi';
import {
  fetchAgentsByDefaultBusinessEntityTeam,
  fetchAgentsByTeam,
} from '../../../api/api-client/settings/agentApi';
import {
  dhakaColoClientDetails,
  dhakaColoClients,
  earthClientDetails,
  earthClients,
  raceClientDetails,
  raceClients,
} from '../../../api/api-client/prismerpApi';
import { useUserRolePermissions } from '../../custom-hook/useUserRolePermissions';
import { IsLoadingContext } from '../../context/LoaderContext';
import { Link, useNavigate } from 'react-router-dom';
import { fetchBranchListByClientId } from '../../../api/api-client/settings/branchApi';
import { DivLoader } from '../components/loader/DivLoader';
import { set } from 'lodash/set';
import { fetchAggregatorsByClient } from '../../../api/api-client/settings/clientAggregatorMapping';
import TextEditor from '../components/text-editor/TextEditor';
import { sendSMSForClient } from '../../../api/api-client/settings/smsApi';
import { useDropzone } from 'react-dropzone';

export const AddNewTicket = () => {
  const { user } = useContext(userContext);
  const navigate = useNavigate();
  const { setIsLoadingContextUpdated } = useContext(IsLoadingContext);
  const { hasSidebarItem, hasPermission } = useUserRolePermissions();
  const [businessEntityOptions, setBusinessEntityOptions] = useState([]);
  const [clientOptions, setClientOptions] = useState([]);
  const [selectedClientId, setSelectedClientId] = useState(null);
  const [clientListAll, setClientListAll] = useState([]);
  const [foundClientInfo, setFoundClientInfo] = useState([]);
  const [sourceOptions, setSourceOptions] = useState([]);
  const [statusOptions, setStatusOptions] = useState([]);
  const [priorityOptions, setPriorityOptions] = useState([]);
  const [ccEmailOptions, setCcEmailOptions] = useState([]);
  const [categoryOptions, setCategoryOptions] = useState([]);
  const [subCategoryOptions, setSubCategoryOptions] = useState([]);
  const [divisionOptions, setDivisionOptions] = useState([]);
  const [teamOptions, setTeamOptions] = useState([]);
  const [defaultRoleOptions, setDefaultRoleOptions] = useState([]);
  const [userSeriealNumber, setUserSeriealNumber] = useState('');
  const [selectedCategoryId, setSelectedCategoryId] = useState(null);
  const [selectedBusinessId, setSelectedBusinessId] = useState(null);
  const [selectedBusinessEntityName, setSelectedBusinessEntityName] = useState(null);
  const [selectedSubCategoryId, setSelectedSubCategoryId] = useState(null);
  const [selectedTeamId, setSelectedTeamId] = useState(null);

  const [slaInfo, setSLAInfo] = useState(null);
  const [agents, setAgents] = useState(null);

  const [isLoading, setIsLoading] = useState(false);
  const [isClientDetailsLoading, setIsClientDetailsLoading] = useState(false);

  const [isClientLoading, setIsClientLoading] = useState(false);
  const [aggregators, setAggregators] = useState({});
  const [labelValue, setLabelValue] = useState('Client');
  const [networkBackboneElementListOptions, setNetworkBackboneElementListOptions] = useState([]);
  const [branchListOptions, setBranchListOptions] = useState([]);
  const [branchDetails, setBranchDetails] = useState(null);

  const [isInfoVisible, setIsInfoVisible] = useState(false);
  const [openTicketSelectedClient, setOpenTicketSelectedClient] = useState([]);
  const [searchClient, setSearchClient] = useState('');
  const [inputValue, setInputValue] = useState('');

  let isSIDFieldVisible = [8, 9, 11].includes(selectedBusinessId);
  let isNBElement = [16, 17, 18].includes(selectedClientId);

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

    const fetchSourceOptions = () => {
      getSource().then((response) => {
        setSourceOptions(
          response.data.map((option) => ({
            value: option.id,
            label: option.source_name,
          }))
        );
      });
    };

    const fetchStatusOptions = () => {
      getStatus().then((response) => {
        setStatusOptions(
          response.data.map((option) => ({
            value: option.id,
            label: option.status_name,
          }))
        );
        const openOption = response.data.find((option) => option.status_name === 'Open');
        if (openOption) {
          formik.setFieldValue('ticketInfo.status', openOption.id);
        }
      });
    };

    const fetchPriorityOptions = () => {
      getPriority().then((response) => {
        setPriorityOptions(
          response.data.map((option) => ({
            value: option.id,
            label: option.priority_name,
          }))
        );
        const lowOption = response.data.find((option) => option.priority_name === 'Low');
        if (lowOption) {
          formik.setFieldValue('ticketInfo.priority', lowOption.id);
        }
      });
    };

    const fetchCcEmailOptions = () => {
      getCcEmail().then((response) => {
        setCcEmailOptions(
          response.data.map((option) => ({
            value: option.id,
            label: option.email_primary,
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
      fetchDefaultClientRole().then((response) => {
        setDefaultRoleOptions(
          response.data.map((option) => ({
            value: option.id,
            label: option.default_type,
          }))
        );
      });
    };

    Promise.all([
      fetchBusinessEntityOptions(),
      fetchDefaultroleOptions(),
      fetchSourceOptions(),
      fetchStatusOptions(),
      fetchPriorityOptions(),
      fetchCcEmailOptions(),
      // fetchDivisionOptions(),
      fetchTeamOptions(),
    ])
      .catch(errorMessage)
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  useEffect(() => {
    if (selectedBusinessId != null) {
      setIsLoading(true);
      const selectedOption = businessEntityOptions.find(
        (option) => option.value === selectedBusinessId
      );

      if (selectedOption) {
        setSelectedBusinessEntityName(selectedOption.label);
        if (selectedOption.label === 'Network & Backbone') {
          setLabelValue('N & B Elements');
        } else {
          setLabelValue('Client');
        }
      }
      fetchCategoryByDefaultBusinessEntityId(selectedBusinessId)
        .then((response) => {
          setCategoryOptions(
            response.data.map((option) => ({
              value: option.id,
              label: option.category_in_english,
            }))
          );
        })
        .catch(errorMessage)
        .finally(() => setIsLoading(false));

      fetchAgentsByDefaultBusinessEntityTeam(selectedBusinessId)
        .then((response) => {
          setAgents([]);
          // setAgents(response.data);
          setAgents(
            response.data.map((option) => ({
              value: option.id,
              label: option.fullname,
            }))
          );
        })
        .catch(errorMessage)
        .finally(() => setIsLoading(false));
    }
  }, [selectedBusinessId]);

  // fetch opent ticket for client
  useEffect(() => {
    if (selectedClientId != null && selectedBusinessId != null && !formik.values.ticketInfo.sid) {
      setIsLoading(true);
      const paramData = {
        vendorId: selectedClientId,
        businessEntity: selectedBusinessId,
      };
      getClientIdGenaratedBySystem(paramData)
        .then((response) => {
          setOpenTicketSelectedClient(response.data);
        })
        .catch(errorMessage)
        .finally(() => setIsLoading(false));
    }
  }, [selectedClientId]);

  // Open Tickets for sid
  const opentTicketsForSid = (sid) => {
    const param = {
      sid: sid,
    };
    getOpenTicketsForSID(param)
      .then((response) => {
        setOpenTicketSelectedClient([]);
        setOpenTicketSelectedClient(response.data);
      })
      .catch(errorMessage)
      .finally(() => setIsLoading(false));
  };

  // client list call from local db
  // useEffect(() => {
  //   if (selectedBusinessId != null) {
  //     setIsClientLoading(true);

  //     getClientListFromLocal(selectedBusinessId)
  //       .then((response) => {
  //         setClientOptions(
  //           response?.data?.map((option) => ({
  //             value: option.client_id,
  //             label: option.client_name,
  //           }))
  //         );
  //       })
  //       .catch(errorMessage)
  //       .finally(() => setIsClientLoading(false));
  //   }
  // }, [selectedBusinessId]);

  useEffect(() => {
    if (!selectedBusinessId) return;

    if (!searchClient || searchClient.trim().length < 2) {
      setClientOptions([]);
      return;
    }

    const delayDebounce = setTimeout(() => {
      setIsClientLoading(true);

      getClientListFromLocal(selectedBusinessId, searchClient)
        .then((response) => {
          setClientOptions(
            response?.data?.map((option) => ({
              value: option.client_id,
              label: option.client_name,
            }))
          );
        })
        .catch(errorMessage)
        .finally(() => setIsClientLoading(false));
    }, 400);

    return () => clearTimeout(delayDebounce);
  }, [selectedBusinessId, searchClient]);

  // Prism Api Calling
  // useEffect(() => {
  //   if (selectedBusinessEntityName != null) {
  //     if (selectedBusinessEntityName === 'Race Online Ltd') {
  //       setIsClientLoading(true);
  //       raceClients()
  //         .then((response) => {
  //           setClientOptions(
  //             response.map((option) => ({
  //               value: option.id,
  //               label: option.name,
  //             }))
  //           );
  //         })
  //         .catch(errorMessage)
  //         .finally(() => {
  //           setIsClientLoading(false);
  //           setFoundClientInfo([]);
  //         });
  //     } else if (selectedBusinessEntityName === 'Earth Telecommunication') {
  //       setIsClientLoading(true);
  //       earthClients()
  //         .then((response) => {
  //           setClientOptions(
  //             response.map((option) => ({
  //               value: option.id,
  //               label: option.name,
  //             }))
  //           );
  //         })
  //         .catch(errorMessage)
  //         .finally(() => {
  //           setIsClientLoading(false);
  //           setFoundClientInfo([]);
  //         });
  //     } else if (selectedBusinessEntityName === 'Dhaka Colo') {
  //       setIsClientLoading(true);
  //       dhakaColoClients()
  //         .then((response) => {
  //           setClientOptions(
  //             response.map((option) => ({
  //               value: option.id,
  //               label: option.name,
  //             }))
  //           );
  //         })
  //         .catch(errorMessage)
  //         .finally(() => {
  //           setIsClientLoading(false);
  //           setFoundClientInfo([]);
  //         });
  //     } else if (selectedBusinessEntityName === 'Orbit OWN') {
  //       setIsClientLoading(true);
  //       fetchWebAppOwnEntity()
  //         .then((response) => {
  //           setClientOptions(
  //             response.map((option) => ({
  //               value: option.entity_id,
  //               label: option.entity_name,
  //             }))
  //           );
  //         })
  //         .catch(errorMessage)
  //         .finally(() => {
  //           setIsClientLoading(false);
  //           setFoundClientInfo([]);
  //         });
  //     } else if (selectedBusinessEntityName === 'Orbit Partner') {
  //       setIsClientLoading(true);
  //       fetchWebAppPartnerEntity()
  //         .then((response) => {
  //           setClientOptions(
  //             response.map((option) => ({
  //               value: option.entity_id,
  //               label: option.source_entity,
  //             }))
  //           );
  //         })
  //         .catch(errorMessage)
  //         .finally(() => {
  //           setIsClientLoading(false);
  //           setFoundClientInfo([]);
  //         });
  //     } else if (selectedBusinessEntityName === 'Race Partner') {
  //       setIsClientLoading(true);
  //       fetchRaceMaximEntity()
  //         .then((response) => {
  //           setClientOptions(
  //             response.map((option) => ({
  //               value: option.entity_id,
  //               label: option.source_entity,
  //             }))
  //           );
  //         })
  //         .catch(errorMessage)
  //         .finally(() => {
  //           setIsClientLoading(false);
  //           setFoundClientInfo([]);
  //         });
  //     }
  //   }
  // }, [selectedBusinessEntityName]);

  const handleDeepSearch = async () => {
    if (!selectedBusinessEntityName) return;

    setIsClientLoading(true);
    setFoundClientInfo([]);

    try {
      let response = [];

      switch (selectedBusinessEntityName) {
        case 'Race Online Ltd':
          response = await raceClients();
          setClientOptions(
            response.map((o) => ({
              value: o.id,
              label: o.name,
            }))
          );
          break;

        case 'Earth Telecommunication':
          response = await earthClients();
          setClientOptions(
            response.map((o) => ({
              value: o.id,
              label: o.name,
            }))
          );
          break;

        case 'Dhaka Colo':
          response = await dhakaColoClients();
          setClientOptions(
            response.map((o) => ({
              value: o.id,
              label: o.name,
            }))
          );
          break;

        case 'Orbit OWN':
          response = await fetchWebAppOwnEntity();
          setClientOptions(
            response.map((o) => ({
              value: o.entity_id,
              label: o.entity_name,
            }))
          );
          break;

        case 'Orbit Partner':
          response = await fetchWebAppPartnerEntity();
          setClientOptions(
            response.map((o) => ({
              value: o.entity_id,
              label: o.source_entity,
            }))
          );
          break;

        case 'Race Partner':
          response = await fetchRaceMaximEntity();
          setClientOptions(
            response.map((o) => ({
              value: o.entity_id,
              label: o.source_entity,
            }))
          );
          break;

        default:
          break;
      }
    } catch (err) {
      errorMessage(err);
    } finally {
      setIsClientLoading(false);
    }
  };

  useEffect(() => {
    if (selectedClientId != null && selectedBusinessId !== 7) {
      setIsLoading(true);
      if (selectedBusinessEntityName === 'Dhaka Colo') {
        dhakaColoClientDetails(selectedClientId)
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
            formik.setFieldValue('clientInfo.status', response?.inactive ? 1 : 0);
          })
          .catch(errorMessage)
          .finally(() => setIsLoading(false));
      } else if (selectedBusinessEntityName === 'Race Online Ltd') {
        raceClientDetails(selectedClientId)
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
            formik.setFieldValue('clientInfo.status', response?.inactive ? 1 : 0);
          })
          .catch(errorMessage)
          .finally(() => setIsLoading(false));
      } else if (selectedBusinessEntityName === 'Earth Telecommunication') {
        earthClientDetails(selectedClientId)
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
            formik.setFieldValue('clientInfo.status', response?.inactive ? 1 : 0);
          })
          .catch(errorMessage)
          .finally(() => setIsLoading(false));
      } else if (selectedBusinessEntityName === 'Orbit OWN') {
        fetchWebAppEntityDetailsOwn(selectedClientId)
          .then((response) => {
            setFoundClientInfo(response[0]);
            updateOrbitFormikClientInfo(response[0]);
          })
          .catch(errorMessage)
          .finally(() => setIsLoading(false));
      } else if (selectedBusinessEntityName === 'Orbit Partner') {
        fetchWebAppEntityDetails(selectedClientId)
          .then((response) => {
            setFoundClientInfo(response[0]);
            updateOrbitFormikClientInfo(response[0]);
            fetchAggregatorsByClient(selectedClientId)
              .then((res) => {
                setAggregators(res.data?.[0]);
                formik.setFieldValue('ticketInfo.aggregatorId', '');
                formik.setFieldValue('ticketInfo.aggregatorId', res.data?.[0]?.aggregator_id);
              })
              .catch(errorMessage);
          })
          .catch(errorMessage)
          .finally(() => setIsLoading(false));
      } else if (selectedBusinessEntityName === 'Race Partner') {
        fetchRaceMaximEntityDetails(selectedClientId)
          .then((response) => {
            setFoundClientInfo(response[0]);
            updateOrbitFormikClientInfo(response[0]);
            fetchAggregatorsByClient(selectedClientId)
              .then((res) => {
                setAggregators(res.data?.[0]);
                formik.setFieldValue('ticketInfo.aggregatorId', '');
                formik.setFieldValue('ticketInfo.aggregatorId', res.data?.[0]?.aggregator_id);
              })
              .catch(errorMessage);
          })
          .catch(errorMessage)
          .finally(() => setIsLoading(false));
      }
    }
  }, [selectedClientId]);
  // End

  // Network Backbone
  useEffect(() => {
    if (selectedBusinessId != null && selectedBusinessId === 7) {
      setIsClientLoading(true);

      fetchBackboneElements()
        .then((response) => {
          setClientOptions(
            response.data.map((option) => ({
              value: option.id,
              label: option.name,
            }))
          );
        })
        .catch(errorMessage)
        .finally(() => {
          setIsClientLoading(false);
          setFoundClientInfo([]);
        });
    }
  }, [selectedBusinessId]);

  useEffect(() => {
    if (selectedClientId != null && selectedBusinessId === 7) {
      setIsLoading(true);

      fetchBackboneElementListById(selectedClientId)
        .then((response) => {
          setNetworkBackboneElementListOptions(
            response.data.map((option) => ({
              value: option.id,
              label: option.name,
            }))
          );
        })
        .catch(errorMessage)
        .finally(() => {
          setIsLoading(false);
          const nmc = clientOptions.find((item) => item.value === selectedClientId);
          if (nmc.label) {
            formik.setFieldValue('clientInfo.clientName', nmc.label);
            formik.setFieldValue('clientInfo.fullName', nmc.label);
            formik.setFieldValue('clientInfo.primaryEmail', '');
            formik.setFieldValue('clientInfo.secondaryEmail', '');
            formik.setFieldValue('clientInfo.primaryPhone', '');
            formik.setFieldValue('clientInfo.secondaryPhone', '');
            formik.setFieldValue('clientInfo.password', generateStrongPassword());
            formik.setFieldValue('clientInfo.lock', 0);
            formik.setFieldValue('clientInfo.status', 1);
          }
        });
    }
  }, [selectedClientId]);
  // End NB Element

  // Internal Operation

  useEffect(() => {
    if (selectedBusinessId != null && selectedBusinessId === 10) {
      setIsClientLoading(true);

      fetchCompany({
        userType: user?.type,
        userId: user?.id,
      })
        .then((response) => {
          setClientOptions(
            response.result
              .filter((option) => option.id !== 10 && option.id !== 7)
              .map((option) => ({
                value: option.id,
                label: option.company_name,
              }))
          );
        })
        .catch(errorMessage)
        .finally(() => {
          setIsClientLoading(false);
          setFoundClientInfo([]);
        });
    }
  }, [selectedBusinessId]);

  useEffect(() => {
    if (selectedClientId != null && selectedBusinessId === 10) {
      const selectedInfo = businessEntityOptions?.filter(
        (option) => option.value === selectedClientId
      );

      formik.setFieldValue('clientInfo.clientName', selectedInfo?.[0]?.label);
      formik.setFieldValue('clientInfo.fullName', selectedInfo?.[0]?.label);
      formik.setFieldValue('clientInfo.primaryEmail', '');
      formik.setFieldValue('clientInfo.secondaryEmail', '');
      formik.setFieldValue('clientInfo.primaryPhone', '');
      formik.setFieldValue('clientInfo.secondaryPhone', '');
      formik.setFieldValue('clientInfo.password', generateStrongPassword());
      formik.setFieldValue('clientInfo.lock', 0);
      formik.setFieldValue('clientInfo.status', 1);
    }
  }, [selectedClientId]);
  // for branch
  useEffect(() => {
    if (selectedClientId != null) {
      formik.setFieldValue('ticketInfo.branch', '');
      fetchBranchListByClientId(selectedClientId)
        .then((response) => {
          setBranchListOptions(
            response.data.map((option) => ({
              value: option.id,
              label: option.branch_name,
            }))
          );
        })
        .catch(errorMessage);
    }
  }, [selectedClientId]);

  // end branch
  useEffect(() => {
    if (selectedCategoryId != null && selectedBusinessId != null) {
      setIsLoading(true);
      fetchSubCategoryByCategoryId(selectedBusinessId, selectedCategoryId)
        .then((response) => {
          setSubCategoryOptions(
            response.data.map((option) => ({
              value: option.id,
              label: option.sub_category_in_english,
            }))
          );
        })
        .catch(errorMessage)
        .finally(() => setIsLoading(false));
    }
  }, [selectedCategoryId]);

  useEffect(() => {
    if (selectedSubCategoryId != null) {
      setIsLoading(true);
      // fetchTeamBySubCategory(selectedSubCategoryId)
      //   .then((response) => {
      //     setTeamOptions(
      //       response.data.map((option) => ({
      //         value: option.team_id,
      //         label: option.team_name,
      //       }))
      //     );
      //   })
      //   .catch(errorMessage)
      //   .finally(() => setIsLoading(false));

      fetchSLABySubcategoryId(selectedSubCategoryId)
        .then((response) => {
          setSLAInfo(response.data);
        })
        .catch(errorMessage)
        .finally(() => setIsLoading(false));
    }
  }, [selectedSubCategoryId]);

  useEffect(() => {
    if (selectedTeamId != null) {
      setIsLoading(true);
      fetchAgentsByTeam(selectedTeamId)
        .then((response) => {
          setAgents([]);
          setAgents(
            response.data.map((option) => ({
              value: option.id,
              label: option.fullname,
            }))
          );
        })
        .catch(errorMessage)
        .finally(() => setIsLoading(false));
    }
  }, [selectedTeamId]);

  useEffect(() => {
    if (teamOptions.length > 0) {
      const helpDeskOption = teamOptions.find((option) => option.label === 'helpdesk');

      if (helpDeskOption) {
        formik.setFieldValue('ticketInfo.teamId', helpDeskOption.value);
      }
    }
  }, [teamOptions]);

  useEffect(() => {
    if (userSeriealNumber) {
      formik.setFieldValue('clientInfo.userName', userSeriealNumber);
    }

    if (defaultRoleOptions.length > 0) {
      formik.setFieldValue('clientInfo.role', defaultRoleOptions[0].value);
    }
  }, [userSeriealNumber, defaultRoleOptions]);

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

  // const createFormData = (data, formData = new FormData(), parentKey = '') => {
  //   for (const key in data) {
  //     if (data.hasOwnProperty(key)) {
  //       const value = data[key];
  //       const formKey = parentKey ? `${parentKey}[${key}]` : key;

  //       if (value instanceof Object && !(value instanceof File)) {
  //         createFormData(value, formData, formKey);
  //       } else if (value instanceof FileList) {
  //         Array.from(value).forEach((file, index) => {
  //           formData.append(`${formKey}[${index}]`, file);
  //         });
  //       } else {
  //         formData.append(formKey, value !== undefined && value !== null ? value : '');
  //       }
  //     }
  //   }
  //   return formData;
  // };
  const createFormData = (data, formData = new FormData(), parentKey = '') => {
    if (data === null || data === undefined) {
      formData.append(parentKey, '');
      return formData;
    }

    // ✅ Handle FileList — must be before Object check
    if (data instanceof FileList) {
      Array.from(data).forEach((file, index) => {
        formData.append(`${parentKey}[${index}]`, file);
      });
      return formData;
    }

    // ✅ Handle plain File
    if (data instanceof File) {
      formData.append(parentKey, data);
      return formData;
    }

    // ✅ Handle Array
    if (Array.isArray(data)) {
      if (data.length === 0) {
        formData.append(parentKey, '');
      } else {
        data.forEach((item, index) => {
          createFormData(item, formData, `${parentKey}[${index}]`);
        });
      }
      return formData;
    }

    // ✅ Handle plain Object
    if (typeof data === 'object') {
      Object.keys(data).forEach((key) => {
        const value = data[key];
        const formKey = parentKey ? `${parentKey}[${key}]` : key;
        createFormData(value, formData, formKey);
      });
      return formData;
    }

    // ✅ Handle primitives
    formData.append(parentKey, data !== undefined && data !== null ? data : '');
    return formData;
  };
  const smsSend = (smsData) => {
    sendSMSBySID(smsData)
      .then((response) => {})
      .catch(errorMessage);
  };

  const smsSendForPatner = (smsData) => {
    sendSMSByPartnerNumber(smsData)
      .then((response) => {})
      .catch(errorMessage);
  };

  const smsSendForClient = (smsData) => {
    sendSMSForClient(smsData)
      .then((response) => {})
      .catch(errorMessage);
  };
  const formik = useFormik({
    initialValues: {
      loginUserId: user?.id,
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
        userName: userSeriealNumber,
        password: '',
        division: '',
        district: '',
        lock: 0,
        status: 1,
      },
      ticketInfo: {
        businessEntity: '',
        client: '',
        branch: '',
        elementList: '',
        elementListA: '',
        elementListB: '',
        sid: '',
        ccEmail: [],
        source: '',
        category: '',
        subCategory: '',
        teamId: '',
        assingedAgentId: '',
        aggregatorId: '',
        priority: '',
        status: '',
        refTicket: '',
        mobileNumber: '',
        attachment: [],
        descriptions: '',
      },
    },
    validationSchema: createTicketValidationSchema,
    onSubmit: (values, { resetForm }) => {
      setIsLoadingContextUpdated(true);
      const formData = createFormData(values);

      store(formData)
        .then((response) => {
          successMessage(response);
          formik.setFieldValue('clientInfo.userName', '');
          if (defaultRoleOptions.length > 0) {
            formik.setFieldValue('clientInfo.role', defaultRoleOptions[0].value);
          }

          navigate(`/admin/ticket-details/${response?.data?.ticket_number}`);
          const smsData = {
            sid: values.ticketInfo.sid,
            nature: values.ticketInfo.subCategory,
            phone: foundClientInfo?.mobile_phone,
          };
          if (values.ticketInfo.sid) {
            smsSend(smsData);
          }

          const patnerSMSData = {
            // ticket_number: response?.data?.ticket_number,
            businessEntity: values.clientInfo.clientName,
            nature: values.ticketInfo.subCategory,
            phone: values.ticketInfo.mobileNumber,
          };

          const clientSMSData = {
            businessEntityName: selectedBusinessEntityName,
            lastTicketNumber: response?.data?.ticket_number,
            subCategoryName: values.ticketInfo.subCategory,
            mobileFromEntity: values.clientInfo.primaryPhone,
            business_entity_id: response?.data?.business_entity_id,
            client_id: response?.data?.client_id_helpdesk,
          };

          if (values.ticketInfo.mobileNumber) {
            smsSendForPatner(patnerSMSData);
          }
          if (values.clientInfo.primaryPhone) {
            smsSendForClient(clientSMSData);
          }
        })
        .catch(errorMessage)
        .finally(() => {
          setIsLoadingContextUpdated(false);
          resetForm();
        });
    },
  });

  const handleSIDApiDetails = (sid) => {
    setIsClientLoading(true);
    setIsClientDetailsLoading(true);

    fetchWebAppSIDDetails(sid)
      .then((response) => {
        if (
          selectedBusinessId === 9 &&
          (response[0]?.entity_type === 'Sub-reseller' ||
            response[0]?.entity_type === 'Reseller' ||
            response[0]?.entity_type === 'RESELLER')
        ) {
          warningMessage({
            message: 'The SID does not belong to the selected business entity.',
          });
          return;
        } else if (
          selectedBusinessId === 8 &&
          (response[0]?.entity_type === 'Area Office' ||
            response[0]?.entity_type === 'Zonal Office')
        ) {
          warningMessage({
            message: 'The SID does not belong to the selected business entity.',
          });
          return;
        }

        setFoundClientInfo(response[0]);
        updateOrbitFormikClientInfo(response[0]);

        setClientOptions(
          response.map((option) => ({
            value: option.entity_id,
            label: option.source_entity,
          }))
        );

        formik.setFieldValue('clientInfo.client', response[0]?.entity_id);
        formik.setFieldValue('ticketInfo.client', response[0]?.entity_id);
        // setSelectedClientId(response[0]?.entity_id);
      })
      .catch(errorMessage)
      .finally(() => {
        setIsClientLoading(false);
        setIsClientDetailsLoading(false);
      });
  };

  const handleSIDSubmit = () => {
    if (formik.values.ticketInfo.sid) {
      handleSIDApiDetails(formik.values.ticketInfo.sid);
      opentTicketsForSid(formik.values.ticketInfo.sid);
    }
  };

  const updateOrbitFormikClientInfo = (response) => {
    formik.setFieldValue('clientInfo.clientName', response?.entity_name || '');
    formik.setFieldValue('clientInfo.fullName', response?.entity_name || '');
    formik.setFieldValue('clientInfo.clientType', response?.entity_type || '');
    formik.setFieldValue('clientInfo.billingSource', response?.source || '');

    formik.setFieldValue('clientInfo.primaryEmail', '');
    formik.setFieldValue('clientInfo.secondaryEmail', '');
    formik.setFieldValue('clientInfo.primaryPhone', response?.mobile_phone || '');
    formik.setFieldValue('clientInfo.secondaryPhone', '');
    formik.setFieldValue('clientInfo.password', generateStrongPassword());
    formik.setFieldValue('clientInfo.lock', 0);
    formik.setFieldValue('clientInfo.status', response?.status === 'Active' ? 1 : 0);
    formik.setFieldValue('clientInfo.division', response?.division || '');
    formik.setFieldValue('clientInfo.district', response?.district || '');
  };

  const renderClientDetails = () => {
    switch (selectedBusinessId) {
      case 8:
      case 9:
      case 11:
        return (
          <div className="col-sm-12 col-md-12 col-lg-12 col-xl-12 ">
            <div className="custom-card">
              <h6 className="custom-card-header">Client Details</h6>
              <div className="p-3">
                <p className="mb-3">
                  <b>{faBuildingIcon}Business Entity : </b>
                  {selectedBusinessEntityName ?? null}
                </p>
                <p className="mb-3">
                  <b>{faUserTieIcon}Client : </b>
                  {foundClientInfo?.entity_name}
                </p>
                <p className="mb-3">
                  <b>{faUserTieIcon}Client Type : </b>
                  {foundClientInfo?.entity_type}
                </p>

                {foundClientInfo?.fullname && (
                  <p className="mb-3">
                    <b>{faUserTieIcon}Name : </b>
                    {foundClientInfo?.fullname}
                  </p>
                )}

                {foundClientInfo?.username && (
                  <p className="mb-3">
                    <b>{faUserTieIcon}PPPoE : </b>
                    {foundClientInfo?.username}
                  </p>
                )}

                {foundClientInfo?.password && (
                  <p className="mb-3">
                    <b>
                      <i className="bi bi-lock-fill me-1"></i>Password :{' '}
                    </b>
                    {foundClientInfo?.password}
                  </p>
                )}

                {foundClientInfo?.real_ip && (
                  <p className="mb-3">
                    <b>
                      <i className="bi bi-globe me-1"></i>Real IP :{' '}
                    </b>
                    {foundClientInfo?.real_ip}
                  </p>
                )}

                {foundClientInfo?.customer_nbr && (
                  <p className="mb-3">
                    <b>{faUserTieIcon}SID : </b>
                    {foundClientInfo?.customer_nbr}
                  </p>
                )}

                {foundClientInfo?.mobile_phone && (
                  <p className="mb-3">
                    <b>{faPhoneIcon}Phone : </b>
                    {foundClientInfo?.mobile_phone}
                  </p>
                )}
                {foundClientInfo?.home_phone && (
                  <p className="mb-3">
                    <b>{faPhoneIcon}Home : </b>
                    {foundClientInfo?.home_phone}
                  </p>
                )}
                {foundClientInfo?.work_phone && (
                  <p className="mb-3">
                    <b>{faPhoneIcon}work : </b>
                    {foundClientInfo?.work_phone}
                  </p>
                )}
                {foundClientInfo?.division && (
                  <p className="mb-3">
                    <b>{faUserTieIcon}Division : </b>
                    {foundClientInfo?.division}
                  </p>
                )}
                {foundClientInfo?.district && (
                  <p className="mb-3">
                    <b>{faUserTieIcon}District : </b>
                    {foundClientInfo?.district}
                  </p>
                )}
                {aggregators && (
                  <p className="mb-3">
                    <b>{faUserTieIcon} Aggregator : </b>
                    {aggregators?.name}
                  </p>
                )}
                <p className="mb-3">
                  <b>
                    <i className="bi bi-ui-checks-grid me-1"></i>Billing Source :{' '}
                  </b>
                  {foundClientInfo?.source}
                </p>

                {foundClientInfo?.available_balance && (
                  <p className="mb-3">
                    <b> ৳ Available Balance : </b>
                    {foundClientInfo?.available_balance}
                  </p>
                )}
                {foundClientInfo?.plan_desc && (
                  <p className="mb-3">
                    <b>
                      <i className="bi bi-briefcase-fill me-1"></i>Plan :{' '}
                    </b>
                    {foundClientInfo?.plan_desc}
                  </p>
                )}

                {foundClientInfo?.plan_amount && (
                  <p className="mb-3">
                    <b> ৳ Plan Amount : </b>
                    {foundClientInfo?.plan_amount}
                  </p>
                )}

                {foundClientInfo?.end_date && (
                  <p className="mb-3">
                    <b>
                      <i className="bi bi-clock-fill me-1"></i>Expire Date :{' '}
                    </b>
                    {foundClientInfo?.end_date}
                  </p>
                )}

                {foundClientInfo?.sales_person && (
                  <p className="mb-3">
                    <b>{faUserTieIcon}Sales Person : </b>
                    {foundClientInfo?.sales_person}
                  </p>
                )}

                {foundClientInfo?.address && (
                  <p className="mb-3">
                    <b>
                      <i className="bi bi-house-door-fill me-1"></i>Address :{' '}
                    </b>
                    {foundClientInfo?.address}
                  </p>
                )}

                <p className="mb-3">
                  <b>{faUpDownIcon}Status : </b>
                  {foundClientInfo?.status}
                </p>

                {foundClientInfo?.payment1 && (
                  <>
                    <h6 className="bg-secondary p-2 mb-3">Payment</h6>
                    <div className="mb-3 border-bottom">
                      <div className="d-flex justify-content-between">
                        <h6 className="fw-bolder">৳ {foundClientInfo?.payment1}</h6>
                        <p> {foundClientInfo?.payment_date_1}</p>
                      </div>
                      <p>{foundClientInfo?.payment_number_1}</p>
                    </div>
                  </>
                )}
                {foundClientInfo?.payment2 && (
                  <div className="mb-3 border-bottom">
                    <div className="d-flex justify-content-between">
                      <h6 className="fw-bolder">৳ {foundClientInfo?.payment2}</h6>
                      <p> {foundClientInfo?.payment_date_2}</p>
                    </div>
                    <p>{foundClientInfo?.payment_number_2}</p>
                  </div>
                )}
                {foundClientInfo?.payment3 && (
                  <div className="mb-3 border-bottom">
                    <div className="d-flex justify-content-between">
                      <h6 className="fw-bolder">৳ {foundClientInfo?.payment3}</h6>
                      <p> {foundClientInfo?.payment_date_3}</p>
                    </div>
                    <p>{foundClientInfo?.payment_number_3}</p>
                  </div>
                )}
                {foundClientInfo?.payment4 && (
                  <div className="mb-3 border-bottom">
                    <div className="d-flex justify-content-between">
                      <h6 className="fw-bolder">৳ {foundClientInfo?.payment4}</h6>
                      <p> {foundClientInfo?.payment_date_4}</p>
                    </div>
                    <p>{foundClientInfo?.payment_number_4}</p>
                  </div>
                )}
                {foundClientInfo?.payment5 && (
                  <div className="mb-3 border-bottom">
                    <div className="d-flex justify-content-between">
                      <h6 className="fw-bolder">৳ {foundClientInfo?.payment5}</h6>
                      <p> {foundClientInfo?.payment_date_5}</p>
                    </div>
                    <p>{foundClientInfo?.payment_number_5}</p>
                  </div>
                )}
                {foundClientInfo?.payment6 && (
                  <div className="mb-3 border-bottom">
                    <div className="d-flex justify-content-between">
                      <h6 className="fw-bolder">৳ {foundClientInfo?.payment6}</h6>
                      <p> {foundClientInfo?.payment_date_6}</p>
                    </div>
                    <p>{foundClientInfo?.payment_number_6}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        );

      case 4:
      case 5:
      case 6:
        return (
          <div className={`col-sm-12 col-md-12 col-lg-12 col-xl-12`}>
            <div className="custom-card">
              <h6 className="custom-card-header">Client Details</h6>
              <div className="p-3">
                <p className="mb-3">
                  <b>{faBuildingIcon}Business Entity : </b>
                  {selectedBusinessEntityName ?? null}
                </p>
                <p className="mb-3">
                  <b>{faUserTieIcon}Client : </b>
                  {foundClientInfo?.name}
                </p>
                <p className="mb-3">
                  <b>{faUserTieIcon}Client Type : </b>
                  {foundClientInfo?.type}
                </p>
                <p className="mb-3">
                  <b>{emailIcon}Email : </b>
                  {foundClientInfo?.email}
                </p>
                <p className="mb-3">
                  <b>{faPhoneIcon}Phone : </b>
                  {foundClientInfo?.phone}
                </p>
                <p className="mb-3">
                  <b>{faListOlIcon}Service Count : </b>
                  {foundClientInfo?.service_count}
                </p>
                <p className="mb-3">
                  <b>{faBriefcaseIcon}Service Name : </b>
                  {foundClientInfo?.services?.join(', ')}
                </p>

                <p className="mb-3">
                  <b>{faUserTieIcon}KAM : </b>
                  {foundClientInfo?.supervisor}
                </p>
                {/* <p className='mb-3'>
                      <b>{faBangladeshiTakaSignIcon}Balance : </b>
                      {foundClientInfo?.balance}
                    </p> */}
                <p className="mb-3">
                  <b>{faUpDownIcon}Status : </b>
                  {foundClientInfo?.inactive !== undefined
                    ? foundClientInfo.inactive === false
                      ? 'Active'
                      : 'Inactive'
                    : ''}
                </p>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  // Branch details
  useEffect(() => {
    if (formik.values.ticketInfo.branch) {
      getBranchDetailsById(formik.values.ticketInfo.branch)
        .then((response) => {
          setBranchDetails(response.data);
        })
        .catch(errorMessage);
    }
  }, [formik.values.ticketInfo.branch]);

  // For drag and drop file upload
  // Dropdowns
  const inputRef = useRef(null);

  // Keep auto-focus active so the cursor always blinks
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, [formik.values.ticketInfo.attachment]);

  // Prevent typing inside the input field (allow paste only)
  const handleKeyDown = (e) => {
    // Allow only Ctrl+V (Windows) or Cmd+V (Mac) for paste
    if ((e.ctrlKey || e.metaKey) && e.key === 'v') {
      return;
    }

    // Block all other keystrokes to prevent manual typing
    e.preventDefault();
  };

  // Handle drag & drop file upload
  // const onDrop = useCallback(
  //   (acceptedFiles) => {
  //     const existingFiles = formik.values.ticketInfo.attachment
  //       ? Array.from(formik.values.ticketInfo.attachment)
  //       : [];

  //     formik.setFieldValue('ticketInfo.attachment', [...existingFiles, ...acceptedFiles]);
  //   },
  //   [formik]
  // );
  const fileListRef = useRef(new DataTransfer());

  const syncFilesToFormik = (dataTransfer) => {
    fileListRef.current = dataTransfer;
    formik.setFieldValue('ticketInfo.attachment', dataTransfer.files); // real FileList
  };

  const onDrop = useCallback(
    (acceptedFiles) => {
      const dt = new DataTransfer();
      // Keep existing files
      const existing = formik.values.ticketInfo.attachment;
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

  // // Handle screenshot/file paste from clipboard
  // const handlePaste = useCallback(
  //   (event) => {
  //     const items = event.clipboardData.items;
  //     const pastedFiles = [];

  //     for (let i = 0; i < items.length; i++) {
  //       if (items[i].kind === 'file') {
  //         const file = items[i].getAsFile();

  //         if (file) {
  //           // Rename pasted screenshot using timestamp
  //           const renamedFile = new File([file], `pasted_img_${Date.now()}.png`, {
  //             type: file.type,
  //           });

  //           pastedFiles.push(renamedFile);
  //         }
  //       }
  //     }

  //     // Append pasted files to existing attachments
  //     if (pastedFiles.length > 0) {
  //       const existingFiles = formik.values.ticketInfo.attachment
  //         ? Array.from(formik.values.ticketInfo.attachment)
  //         : [];

  //       formik.setFieldValue('ticketInfo.attachment', [...existingFiles, ...pastedFiles]);
  //     }
  //   },
  //   [formik]
  // );

  // // Remove selected file by index
  // const removeFile = (index) => {
  //   const currentFiles = Array.from(formik.values.ticketInfo.attachment);

  //   currentFiles.splice(index, 1);

  //   formik.setFieldValue('ticketInfo.attachment', currentFiles);
  // };

  // Replace your onDrop, handlePaste, removeFile, and the JSX attachment section

  const handlePaste = useCallback(
    (event) => {
      const items = event.clipboardData.items;
      const dt = new DataTransfer();
      const existing = formik.values.ticketInfo.attachment;
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
    const existing = formik.values.ticketInfo.attachment;
    Array.from(existing).forEach((f, i) => {
      if (i !== index) dt.items.add(f);
    });
    syncFilesToFormik(dt);
  };

  console.log(formik.values);
  // console.log(userSeriealNumber);
  // console.log(foundClientInfo);
  // console.log(openTicketSelectedClient);
  // console.log("SID:", formik.ticketInfo?.sid);
  // console.log("ClientName:", formik.values.clientInfo?.clientName);
  // console.log(formik.values.ticketInfo?.sid);
  // console.log(selectedBusinessId);
  // console.log(branchDetails);
  // console.log('debug', aggregators);
  // console.log('agentst---', agents);

  return (
    <section>
      <div className="container-fluid">
        <div className="row">
          <div className="col-sm-12 col-md-12 col-lg-12 col-xl-12">
            <div className="alert alert-secondary p-2" role="alert">
              <h6>Create New Ticket</h6>
              <span>
                <i>Please input the required information.</i>
              </span>
              {/* <button
                type='button'
                className='info-btn'
                onClick={() => setIsInfoVisible(true)}>
                Info
              </button> */}
            </div>
          </div>
        </div>

        <div className="row">
          <div className="col-sm-12 col-md-9 col-lg-9 col-xl-9">
            <form className="w-100" onSubmit={formik.handleSubmit} encType="multipart/form-data">
              <div className="custom-card">
                <div className="custom-card-header">Client Information</div>
                <div className="p-3">
                  <div className="row">
                    <div className="col-sm-12 col-md-12 col-lg-12 col-xl-12">
                      <div className="input-group mb-3">
                        <span className="input-group-text w-25 label-cat-w" id="basic-addon1">
                          Business Entity <span className="text-danger fw-bolder fs-5">*</span>
                        </span>

                        <SelectDropdown
                          id="businessEntity"
                          placeholder="Business entity"
                          options={businessEntityOptions}
                          value={formik.values.clientInfo.businessEntity}
                          onChange={(value, label) => {
                            formik.setFieldValue('clientInfo.division', '');
                            formik.setFieldValue('clientInfo.district', '');
                            formik.setFieldValue('clientInfo.businessEntity', value);
                            formik.setFieldValue('clientInfo.defaultBusinessEntity', value);
                            formik.setFieldValue('ticketInfo.businessEntity', value);
                            fetchUserSerialNumber(value);
                            setSelectedBusinessId(value);
                            setSelectedClientId(null);
                            setClientOptions([]);
                            setSearchClient('');
                            setNetworkBackboneElementListOptions([]);
                          }}
                          disabled={isLoading}
                        />
                      </div>
                      {formik.touched.ticketInfo?.businessEntity &&
                      formik.errors.ticketInfo?.businessEntity ? (
                        <div className="text-danger">{formik.errors.ticketInfo.businessEntity}</div>
                      ) : null}
                    </div>

                    {/* <div className='col-sm-12 col-md-8 col-lg-8 col-xl-8'>
                      <div className='input-group mb-3'>
                        <span
                          className='input-group-text w-25 label-cat-w'
                          id='basic-addon1'>
                          Client{" "}
                          <span className='text-danger fw-bolder fs-5'>*</span>
                        </span>

                        <SelectDropdown
                          id='client'
                          placeholder='Client'
                          options={clientOptions}
                          value={formik.values.clientInfo.client}
                          onChange={(value) => {
                            formik.setFieldValue("clientInfo.client", value);
                            formik.setFieldValue("ticketInfo.client", value);
                            setSelectedClientId(value);
                          }}
                          disabled={isClientLoading}
                        />
                      </div>
                      {formik.touched.ticketInfo?.client &&
                      formik.errors.ticketInfo?.client ? (
                        <div className='text-danger'>
                          {formik.errors.ticketInfo.client}
                        </div>
                      ) : null}
                    </div> */}

                    <div
                      className={`col-sm-12 col-md-${
                        isSIDFieldVisible ? '8' : selectedBusinessId === 7 ? '6' : '12'
                      } col-lg-${
                        isSIDFieldVisible ? '8' : selectedBusinessId === 7 ? '6' : '12'
                      } col-xl-${isSIDFieldVisible ? '8' : selectedBusinessId === 7 ? '6' : '12'}`}
                    >
                      <div className="input-group mb-3">
                        <span className="input-group-text w-25 label-cat-w" id="basic-addon1">
                          {labelValue} <span className="text-danger fw-bolder fs-5">*</span>
                        </span>

                        {/* <SelectDropdown
                          id="client"
                          placeholder={
                            selectedBusinessId
                              ? 'Type to search client...'
                              : 'Select business first'
                          }
                          isLoading={isClientLoading}
                          options={clientOptions}
                          value={formik.values.clientInfo.client}
                          onChange={(value) => {
                            formik.setFieldValue('clientInfo.client', value);
                            formik.setFieldValue('ticketInfo.client', value);
                            setSelectedClientId(value);
                          }}
                          disabled={selectedBusinessEntityName === 'Orbit OWN'}
                          onDeepSearch={handleDeepSearch}
                        /> */}

                        <SelectDropdown
                          id="client"
                          placeholder="Type to search client..."
                          options={clientOptions}
                          isLoading={isClientLoading}
                          value={formik.values.clientInfo.client}
                          onChange={(value) => {
                            formik.setFieldValue('clientInfo.client', value);
                            formik.setFieldValue('ticketInfo.client', value);
                            setSelectedClientId(value);

                            // setSearchClient('');
                          }}
                          onInputChange={(val) => {
                            setSearchClient(val);
                          }}
                          searchValue={searchClient}
                          disabled={selectedBusinessEntityName === 'Orbit OWN'}
                          onDeepSearch={handleDeepSearch}
                        />
                      </div>
                      {formik.touched.ticketInfo?.client && formik.errors.ticketInfo?.client ? (
                        <div className="text-danger">{formik.errors.ticketInfo.client}</div>
                      ) : null}
                    </div>
                    {branchListOptions.length > 0 && (
                      <div className={`col-sm-12 col-md-12 col-lg-12 col-xl-12`}>
                        <div className="input-group mb-3">
                          <span className="input-group-text w-25 label-cat-w" id="basic-addon1">
                            Branch List{' '}
                          </span>

                          <SelectDropdown
                            id="branch"
                            placeholder="Branch List"
                            options={branchListOptions}
                            value={formik.values.ticketInfo.branch}
                            onChange={(value) => {
                              formik.setFieldValue('ticketInfo.branch', value);
                            }}
                            disabled={isClientLoading}
                          />
                        </div>
                      </div>
                    )}

                    <div
                      className={`col-sm-12 col-md-6 col-lg-6 col-xl-6 ${
                        selectedBusinessId === 7 ? 'd-block' : 'd-none'
                      }`}
                    >
                      <div className="input-group mb-3">
                        <span className="input-group-text w-25 label-cat-w" id="basic-addon1">
                          Element List{' '}
                        </span>

                        <SelectDropdown
                          id="elementList"
                          placeholder="Element List"
                          options={networkBackboneElementListOptions}
                          value={formik.values.ticketInfo.elementList}
                          onChange={(value) => {
                            formik.setFieldValue('ticketInfo.elementList', value);
                          }}
                          disabled={isNBElement}
                        />
                      </div>
                    </div>

                    <div
                      className={`col-sm-12 col-md-6 col-lg-6 col-xl-6 ${
                        isNBElement ? 'd-block' : 'd-none'
                      }`}
                    >
                      <div className="input-group mb-3">
                        <span className="input-group-text w-25 label-cat-w" id="basic-addon1">
                          Element List A{' '}
                        </span>

                        <SelectDropdown
                          id="elementListA"
                          placeholder="Element List A"
                          options={networkBackboneElementListOptions}
                          value={formik.values.ticketInfo.elementListA}
                          onChange={(value) => {
                            formik.setFieldValue('ticketInfo.elementListA', value);
                          }}
                          disabled={isClientLoading}
                        />
                      </div>
                    </div>

                    <div
                      className={`col-sm-12 col-md-6 col-lg-6 col-xl-6 ${
                        isNBElement ? 'd-block' : 'd-none'
                      }`}
                    >
                      <div className="input-group mb-3">
                        <span className="input-group-text w-25 label-cat-w" id="basic-addon1">
                          Element List B{' '}
                        </span>

                        <SelectDropdown
                          id="elementListB"
                          placeholder="Element List B"
                          options={networkBackboneElementListOptions}
                          value={formik.values.ticketInfo.elementListB}
                          onChange={(value) => {
                            formik.setFieldValue('ticketInfo.elementListB', value);
                          }}
                          disabled={isClientLoading}
                        />
                      </div>
                    </div>

                    <div
                      className={`col-sm-12 col-md-4 col-lg-4 col-xl-4 ${
                        isSIDFieldVisible ? 'd-block' : 'd-none'
                      }`}
                    >
                      <div className="input-group mb-3">
                        <span className="input-group-text w-25" id="basic-addon1">
                          {/* SID / UID */}
                          SID
                        </span>

                        <input
                          type="text"
                          className="form-control"
                          id="sid"
                          name="ticketInfo.sid"
                          placeholder="Enter"
                          value={formik.values.ticketInfo.sid}
                          // onChange={formik.handleChange}
                          onChange={(event) => {
                            const value = event.target.value;
                            const removeSpace = value
                              .replace(/[^a-zA-Z0-9\s]/g, '')
                              .replace(/\s+/g, '');
                            const convertUpperCase = removeSpace.toUpperCase();
                            formik.setFieldValue('ticketInfo.sid', convertUpperCase);
                          }}
                        />
                        <button
                          type="button"
                          disabled={isClientLoading ? true : false}
                          onClick={() => handleSIDSubmit()}
                          className="btn "
                          style={{ color: 'white', background: '#12344d' }}
                        >
                          <i className="bi bi-box-arrow-in-right"></i>
                        </button>
                      </div>
                    </div>
                    {(selectedBusinessId === 8 || selectedBusinessId === 11) && (
                      <div className="col-sm-12 col-md-4 col-lg-4 col-xl-4">
                        <div className="input-group mb-3">
                          <span className="input-group-text w-25 label-cat-w">Cell No.</span>
                          <input
                            className="form-control"
                            id="mobileNumber"
                            type="text"
                            placeholder="For SMS Notification"
                            value={formik.values.ticketInfo.mobileNumber}
                            onChange={(event) => {
                              // Use event.target.value
                              formik.setFieldValue('ticketInfo.mobileNumber', event.target.value);
                            }}
                          />
                        </div>
                      </div>
                    )}

                    <div
                      className={`col-sm-12 ${
                        selectedBusinessId === 8 || selectedBusinessId === 11
                          ? 'col-md-4 col-lg-4 col-xl-4'
                          : 'col-md-8 col-lg-8 col-xl-8'
                      }`}
                    >
                      <div className="input-group mb-3">
                        <span className="input-group-text w-25 label-cat-w" id="basic-addon1">
                          Cc{' '}
                          {/* <small className='text-success ms-2'>
                            {"(Notification)"}
                          </small> */}
                        </span>

                        <SelectDropdown
                          id="ccEmail"
                          placeholder="Select email"
                          options={ccEmailOptions}
                          value={formik.values.ticketInfo.ccEmail}
                          onChange={(value) => {
                            formik.setFieldValue('ticketInfo.ccEmail', value);
                          }}
                          disabled={isLoading}
                          isMulti={true}
                        />
                      </div>
                    </div>

                    <div className="col-sm-12 col-md-4 col-lg-4 col-xl-4">
                      <div className="input-group mb-3">
                        <span className="input-group-text w-25 label-cat-w" id="basic-addon1">
                          Source
                        </span>

                        <SelectDropdown
                          id="source"
                          placeholder="Select source"
                          options={sourceOptions}
                          value={formik.values.ticketInfo.source}
                          onChange={(value) => {
                            formik.setFieldValue('ticketInfo.source', value);
                          }}
                          disabled={isLoading}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="custom-card">
                <div className="custom-card-header">Ticket Information</div>
                <div className="p-3">
                  <div className="row">
                    <div className="col-sm-12 col-md-6 col-lg-6 col-xl-6">
                      <div className="input-group mb-3">
                        <span className="input-group-text w-25 label-cat-w" id="basic-addon1">
                          Category <span className="text-danger fw-bolder fs-5">*</span>
                        </span>

                        <SelectDropdown
                          id="category"
                          placeholder="Select category"
                          options={categoryOptions}
                          value={formik.values.ticketInfo.category}
                          onChange={(value) => {
                            formik.setFieldValue('ticketInfo.category', value);
                            setSelectedCategoryId(value);
                          }}
                          disabled={isLoading}
                        />
                      </div>
                      {formik.touched.ticketInfo?.category && formik.errors.ticketInfo?.category ? (
                        <div className="text-danger">{formik.errors.ticketInfo.category}</div>
                      ) : null}
                    </div>
                    <div className="col-sm-12 col-md-6 col-lg-6 col-xl-6">
                      <div className="input-group mb-3">
                        <span className="input-group-text w-25 label-cat-w" id="basic-addon1">
                          Sub-Category <span className="text-danger fw-bolder fs-5">*</span>
                        </span>
                        <SelectDropdown
                          id="subCategory"
                          placeholder="Select sub-category"
                          options={subCategoryOptions}
                          value={formik.values.ticketInfo.subCategory}
                          onChange={(value) => {
                            formik.setFieldValue('ticketInfo.subCategory', value);
                            setSelectedSubCategoryId(value);
                          }}
                          disabled={isLoading}
                        />
                      </div>
                      {formik.touched.ticketInfo?.subCategory &&
                      formik.errors.ticketInfo?.subCategory ? (
                        <div className="text-danger">{formik.errors.ticketInfo.subCategory}</div>
                      ) : null}
                    </div>

                    <div className="col-sm-12 col-md-6 col-lg-6 col-xl-6">
                      <div className="input-group mb-3">
                        <span className="input-group-text w-25 label-cat-w" id="basic-addon1">
                          Assigned Team
                          <span className="text-danger fw-bolder fs-5">*</span>
                        </span>
                        <SelectDropdown
                          id="teamId"
                          name="ticketInfo.teamId"
                          placeholder="Unassinged"
                          options={teamOptions}
                          value={formik.values.ticketInfo.teamId}
                          onChange={(value) => {
                            formik.setFieldValue('ticketInfo.teamId', value);
                            setSelectedTeamId(value);
                          }}
                          disabled={isLoading}
                        />
                      </div>
                      {formik.touched.ticketInfo?.teamId && formik.errors.ticketInfo?.teamId ? (
                        <div className="text-danger">{formik.errors.ticketInfo.teamId}</div>
                      ) : null}
                    </div>

                    <div className="col-sm-12 col-md-6 col-lg-6 col-xl-6">
                      <div className="input-group mb-3">
                        <span className="input-group-text w-25 label-cat-w" id="basic-addon1">
                          Assigned Agent
                          <span className="text-danger fw-bolder fs-5"></span>
                        </span>
                        <SelectDropdown
                          id="assingedAgentId"
                          name="ticketInfo.assingedAgentId"
                          placeholder="Unassinged"
                          options={agents}
                          value={formik.values.ticketInfo.assingedAgentId}
                          onChange={(value) => {
                            formik.setFieldValue('ticketInfo.assingedAgentId', value);
                          }}
                          disabled={isLoading}
                        />
                      </div>
                    </div>

                    <div className="col-sm-12 col-md-6 col-lg-6 col-xl-6">
                      <div className="input-group mb-3">
                        <span className="input-group-text w-25 label-cat-w" id="basic-addon1">
                          Priority
                        </span>
                        <SelectDropdown
                          id="priority"
                          placeholder="Select priority"
                          options={priorityOptions}
                          value={formik.values.ticketInfo.priority}
                          onChange={(value) => {
                            formik.setFieldValue('ticketInfo.priority', value);
                          }}
                          disabled={isLoading}
                        />
                      </div>
                    </div>
                    <div className="col-sm-12 col-md-6 col-lg-6 col-xl-6">
                      <div className="input-group mb-3">
                        <span className="input-group-text w-25 label-cat-w" id="basic-addon1">
                          Status
                        </span>
                        <SelectDropdown
                          id="status"
                          placeholder="Select status"
                          options={statusOptions}
                          value={formik.values.ticketInfo.status}
                          onChange={(value) => {
                            formik.setFieldValue('ticketInfo.status', value);
                          }}
                          disabled={isLoading}
                        />
                      </div>
                    </div>
                    {/* <div className="col-sm-12 col-md-6 col-lg-6 col-xl-6">
                      <div className="input-group mb-3">
                        <span className="input-group-text w-25 label-cat-w" id="basic-addon1">
                          Ref. Ticket
                        </span>
                        <input
                          type="text"
                          id="refTicket"
                          className="form-control"
                          placeholder="Enter ticket no."
                          value={formik.values.ticketInfo.refTicket}
                          onChange={(e) => {
                            formik.setFieldValue('ticketInfo.refTicket', e.target.value);
                          }}
                        />
                      </div>
                    </div> */}
                  </div>
                </div>
              </div>
              <div className="custom-card">
                <div className="custom-card-header">Other Information</div>
                <div className="p-3">
                  <div className="row">
                    {/* <div className="col-sm-12 col-md-12 col-lg-12 col-xl-12">
                      <div className="input-group mb-3 ">
                        <input
                          className="form-control"
                          id="attachment"
                          type="file"
                          multiple
                          onChange={(e) =>
                            formik.setFieldValue('ticketInfo.attachment', e.currentTarget.files)
                          }
                          onBlur={formik.handleBlur}
                        />
                      </div>
                      <div></div>
                    </div> */}
                    {/* ===================== Ticket Attachment ==================== */}
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
                          Choose Files
                        </span>

                        <input
                          ref={inputRef}
                          type="text"
                          onKeyDown={handleKeyDown}
                          onPaste={handlePaste}
                          autoComplete="off"
                          className="form-control bg-white shadow-none"
                          placeholder={
                            formik.values.ticketInfo.attachment?.length > 0
                              ? `${formik.values.ticketInfo.attachment.length} files selected`
                              : 'Attach files by dragging, dropping, or pasting screenshots'
                          }
                          style={{
                            cursor: 'text',
                            caretColor: 'black',
                          }}
                        />
                      </div>

                      {formik.values.ticketInfo.attachment?.length > 0 && (
                        <div className="mb-3">
                          {Array.from(formik.values.ticketInfo.attachment).map((file, index) => (
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
                    {/* ========== */}

                    {/* <div className="col-sm-12 col-md-12 col-lg-12 col-xl-12">
                      <div className="input-group mb-3">
                        <span className="input-group-text description-label" id="addressTextArea">
                          Description
                        </span>
                        <textarea
                          className="form-control"
                          id="descriptions"
                          name="ticketInfo.descriptions"
                          placeholder="Write your description here..."
                          rows="3"
                          value={formik.values.ticketInfo.descriptions}
                          onChange={formik.handleChange}
                        ></textarea>
                      </div>
                    </div> */}
                    <div className="col-sm-12 col-md-12 col-lg-12 col-xl-12">
                      <div className="input-group mb-3">
                        <span className="input-group-text description-label">Description</span>

                        <div className="flex-grow-1">
                          <TextEditor
                            name="ticketInfo.descriptions"
                            value={formik.values.ticketInfo.descriptions}
                            placeholder="Write your description here..."
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="col-12 text-end mb-3 mb-sm-0">
                <button type="submit" className="custom-btn">
                  Save
                </button>
              </div>
            </form>
          </div>

          <div className={`col-sm-12 col-md-3 col-lg-3 col-xl-3 `}>
            <div className="row">
              {!isClientDetailsLoading ? renderClientDetails() : <DivLoader />}

              {branchDetails && (
                <div className="col-sm-12 col-md-12 col-lg-12 col-xl-12">
                  <div className="custom-card">
                    <h6 className="custom-card-header">Service Contact</h6>
                    <div className="p-3">
                      <p className="mb-3">
                        <b>{faBuildingIcon} Branch : </b>
                        {branchDetails.branch_name}
                      </p>
                      <p className="mb-3">
                        <b>{faBriefcaseIcon} Address: </b>
                        {branchDetails.service_address || 'N/A'}
                      </p>
                      <p className="mb-3">
                        <b>{faPhoneIcon} Phone 1: </b>
                        {branchDetails.mobile1 || 'N/A'}
                      </p>
                      <p className="mb-3">
                        <b>{faPhoneIcon} Phone 2: </b>
                        {branchDetails.mobile2 || 'N/A'}
                      </p>
                      <p className="mb-3">
                        <b>{emailIcon} Email 1: </b>
                        {branchDetails.email1 || 'N/A'}
                      </p>
                      <p className="mb-3">
                        <b>{emailIcon} Email 2: </b>
                        {branchDetails.email2 || 'N/A'}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {openTicketSelectedClient && openTicketSelectedClient.length !== 0 && (
                <div className="col-sm-12 col-md-12 col-lg-12 col-xl-12">
                  <div className="custom-card">
                    <div className="custom-card-header">
                      {'Open Tickets for '}
                      <i className="fw-normal">
                        {formik.values.ticketInfo?.sid
                          ? formik.values.ticketInfo?.sid
                          : formik.values.clientInfo?.clientName}
                      </i>
                    </div>
                    <div className="p-3">
                      {openTicketSelectedClient?.map((item, index) => (
                        <Link
                          to={`/admin/ticket-details/${item.ticket_number}`}
                          className="notification-comment p-3"
                          key={index}
                        >
                          <div className="container-fluid">
                            <div className="row d-flex align-items-center">
                              <div className="col-md-12 ps-0">
                                <div className="row">
                                  <div className="col-md-12">
                                    <div className="ticket-number">
                                      <p>
                                        <i className="bi bi-ticket-detailed me-2"></i>
                                        {item.ticket_number}
                                      </p>
                                    </div>
                                  </div>
                                </div>
                                <div className="row">
                                  <div className="col-md-12">
                                    <div className="description">
                                      <h6>{item.sub_category_in_english}</h6>
                                      <div className="d-flex align-items-center justify-content-between">
                                        <p className="fst-italic" style={{ color: '#183d9f' }}>
                                          {item.category_in_english}
                                        </p>
                                        <small>Created {item.created_at}</small>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              <div className="col-sm-12 col-md-12 col-lg-12 col-xl-12">
                <div className="custom-card">
                  <h6 className="custom-card-header">SLA</h6>
                  <div className="p-3">
                    <p className="mb-3">
                      <b>{faUserClockIcon}First Response Time : </b>
                      {slaInfo?.fr_res_time_str}
                    </p>
                    <p className="">
                      <b>{faBusinessTimeIcon}Service Time : </b>
                      {slaInfo?.srv_time_str}
                    </p>
                  </div>
                </div>
              </div>
              {agents != null && (
                <div className="col-sm-12 col-md-12 col-lg-12 col-xl-12">
                  <div className="custom-card">
                    <h6 className="custom-card-header">Agents</h6>
                    <div className="p-3">
                      {agents.length !== 0 &&
                        agents.map((item, index) => (
                          <p className="mb-3 d-flex align-items-center" key={index}>
                            <div className="avater me-2">
                              {getFirstCaracterOfFirstTwoWord(item.label)}
                            </div>
                            {item.label}
                          </p>
                        ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
