

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import moment from 'moment';
import { toast } from 'react-toastify';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faBuilding,
  faBuildingUser,
  faUser,
  faUsers,
  faList,
  faSitemap,
  faUserTie,
  faGear,
} from '@fortawesome/free-solid-svg-icons';
import {
  branchIcon,
  emailIcon,
  faBuildingIcon,
  faBuildingUserIcon,
  faUserTieIcon,
  handShakeIcon,
  networkIcon,
  plusIcon,
  roleIcon,
  settingIcon,
} from '../../../data/data';
import { OrganaizationHeader } from '../components/settings/OrganaizationHeader';
import { DepartmentHeader } from '../components/settings/DepartmentHeader';
import { TeamHeader } from '../components/settings/TeamHeader';
import { AgentHeader } from '../components/settings/AgentHeader';
import { ClientHeader } from '../components/settings/ClientHeader';
import { RoleHeader } from '../components/settings/RoleHeader';
import { EmailHeader } from '../components/settings/EmailHeader';
import { SmsHeader } from '../components/settings/SmsHeader';
import { AddNewAgent } from '../components/settings/AddNewAgent';
import { AddNewOrganization } from './../components/settings/AddNewOrganization';
import { AddNewDepartment } from './../components/settings/AddNewDepartment';
import { AddNewTeam } from './../components/settings/AddNewTeam';
import { AddNewClient } from './../components/settings/AddNewClient';
import { AddNewRole } from './../components/settings/AddNewRole';
import { AddNewEmail } from './../components/settings/AddNewEmail';
import { AddNewSms } from '../components/settings/AddNewSms';
import { SettingsDataTable } from '../components/SettingsDataTable';
import { AddNewCategory } from '../components/settings/AddNewCategory';
import { AddNewSubCategory } from '../components/settings/AddNewSubCategory';
import { CategoryHeader } from './../components/settings/CategoryHeader';
import { SubCategoryHeader } from './../components/settings/SubCategoryHeader';
import { SLAHeader } from '../components/settings/SLAHeader';
import { AddNewSLA } from '../components/settings/AddNewSLA';
import { EmailNotification } from './EmailNotification';
import { fetchCompany } from '../../../api/api-client/settings/companyApi';
import { fetchDepartment } from '../../../api/api-client/settings/departmentApi';
import { fetchTeam } from '../../../api/api-client/settings/teamApi';
import {
  fetchCategory,
  updateCategoryVisibility,
} from '../../../api/api-client/settings/categoryApi';
import { fetchSubCategory, updateSubCategoryVisibility } from '../../../api/api-client/settings/subCategoryApi';
import { fetchEmailTemplate } from '../../../api/api-client/settings/emailApi';
import { errorMessage, successMessage } from '../../../api/api-config/apiResponseMessage';
import { fetchSLA } from '../../../api/api-client/settings/slaApi';
import { fetchAgent } from '../../../api/api-client/settings/agentApi';
import { fetchClient } from '../../../api/api-client/settings/clientApi';
import { useUserRolePermissions } from '../../custom-hook/useUserRolePermissions';
import { NetworkBackboneHeader } from '../components/settings/NetworkBackboneHeader';
import { AddNewElement } from '../components/settings/AddNewElement';
import { AddNewElementList } from '../components/settings/AddNewElementList';

import {
  fetchElement,
  fetchNetworkBackboneEelements,
} from '../../../api/api-client/settings/networkBackboneApi';
import { AddNewBranch } from '../components/settings/AddNewBranch';
import { BranchHeader } from '../components/settings/BranchHeader';
import { AggregatorHeader } from '../components/settings/AggregatorHeader';
import { TeamMappingHeader } from '../components/settings/TeamMappingHeader';
import { fetchBranch } from '../../../api/api-client/settings/branchApi';
import { fetchAggregator } from '../../../api/api-client/settings/aggregator';
import {
  fetchClientAggregatorMapping,
  fetchClientAggregatorMappingList,
} from '../../../api/api-client/settings/clientAggregatorMapping';
import { AddNewAggregator } from '../components/settings/AddNewAggregator';
import { AddNewTeamMapping } from '../components/settings/AddNewTeamMapping';
import { fetchTeamMapping } from '../../../api/api-client/settings/teamMappingApi';
import { fetchAllSlaSubcatConfigs } from '../../../api/api-client/settings/sla_subcat_configsApi';
import { formatAdditionalEmail, formatIdleTime } from '../../../utils/utility';
import { fetchAllSlaClientConfigs } from '../../../api/api-client/settings/slaClientConfigApi';
import { fetchSmsTemplate } from '../../../api/api-client/settings/smsApi';



export const Settings = () => {
  const { hasPermission } = useUserRolePermissions();
  const [activeTab, setActiveTab] = useState('organization');
  const [selectedId, setSelectedId] = useState(null);
  const [businessId, setBusinessId] = useState(null);

  const [selectedUserName, setSelectedUserName] = useState(null);
  const [selectedFilter, setSelectedFilter] = useState('');
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [slaType, setSlaType] = useState(null);

  const handleSetActiveTab = (tab, id = null, userName = null, bentityId = null, type = null) => {
    setActiveTab(tab);
    setSelectedId(id);
    setSelectedUserName(userName);
    setBusinessId(bentityId);
    if (type) {
      setSlaType(type);
    }
  };

  const handleIsClientVisible = async (row) => {
    try {
      setIsLoading(true);
      const payloads = {
        company_id: row.company_id,
        category_id: row.id,
        is_client_visible: row.is_client_visible,
      };

      const res = await updateCategoryVisibility(payloads);
      if (res?.status === true) {
        const response = await fetchCategory();
        setData([]);
        setData(response.data);
        setSelectedFilter('');
        successMessage(response);
      }
    } catch (error) {
      errorMessage(error);
    } finally {
      setIsLoading(false);
    }
  };


  const handleIsClientVisibleSubCategory = async (row) => {
    console.log('Full row data:', row);
    try {
      setIsLoading(true);
      const payloads = {
        company_id: row.company_id,
        category_id: row.category_id,
        sub_category_id: row.id,
        is_client_visible: row.is_client_visible,
      };

      const res = await updateSubCategoryVisibility(payloads);
      if (res?.status === true) {
        const response = await fetchSubCategory();
        setData([]);
        setData(response.data);
        setSelectedFilter('');
        successMessage(response);
      }
    } catch (error) {
      errorMessage(error);
    } finally {
      setIsLoading(false);
    }
  };

  const organizationColumns = [
    {
      name: 'Id',
      selector: (row) => row.id,
      sortable: true,
    },
    {
      name: 'Business Entity Name',
      selector: (row) => row.company_name,
      sortable: true,
      cell: (row) => (
        <div className="w-100">
          <button
            type="button"
            onClick={() => handleSetActiveTab('addNewOrganization', row.id)}
            className="ticket-link-btn"
          >
            <span>{row.company_name}</span>
          </button>
        </div>
      ),
    },
    {
      name: 'Prefix',
      selector: (row) => row.prefix,
      sortable: true,
    },
    {
      name: 'Website',
      selector: (row) => row.url || 'N/A',
      sortable: true,
    },
    {
      name: 'Phone',
      selector: (row) => row.phone || 'N/A',
      sortable: true,
    },
    {
      name: 'Address',
      selector: (row) => row.address || 'N/A',
      sortable: true,
    },
    {
      name: 'Default Team',
      selector: (row) => row.team_name || 'N/A',
      sortable: true,
    },
    {
      name: 'Created Date',
      selector: (row) => row.created_at,
      sortable: true,
      cell: (row) => (
        <div className="w-100">
          <i className="bi bi-calendar-check me-2 text-primary"></i>
          <span>{moment(row.created_at).format('ll')}</span>
        </div>
      ),
    },
  ];

  const departmentColumns = [
    {
      name: 'Id',
      selector: (row) => row.id,
      sortable: true,
    },
    {
      name: 'Department',
      selector: (row) => row.department_name,
      sortable: true,
      cell: (row) => (
        <div className="w-100">
          <button
            type="button"
            onClick={() => handleSetActiveTab('addNewDepartment', row.id)}
            className="ticket-link-btn"
          >
            <span>{row.department_name}</span>
          </button>
        </div>
      ),
    },
    {
      name: 'Created Date',
      selector: (row) => row.created_at,
      sortable: true,
      cell: (row) => (
        <div className="w-100">
          <i className="bi bi-calendar-check me-2 text-primary"></i>
          <span>{moment(row.created_at).format('ll')}</span>
        </div>
      ),
    },
  ];

  const teamColumns = [
    {
      name: 'Id',
      selector: (row) => row.id,
      sortable: true,
    },
    {
      name: 'Team Name',
      selector: (row) => row.team_name,
      sortable: true,
      cell: (row) => (
        <div className="w-100">
          <button
            type="button"
            onClick={() => handleSetActiveTab('addNewTeam', row.id)}
            className="ticket-link-btn"
          >
            <span>{row.team_name}</span>
          </button>
        </div>
      ),
    },
    {
      name: 'Group Email',
      selector: (row) => row.group_email,
      sortable: true,
      cell: (row) => <div className="w-100 text-wrap">{row.group_email}</div>,
    },
    {
      name: 'Additional Email',
      selector: (row) => formatAdditionalEmail(row.additional_email),
      sortable: false,
      cell: (row) => (
        <div className="w-100 text-wrap">{formatAdditionalEmail(row.additional_email)}</div>
      ),
    },

    {
      name: 'Supervisor',
      selector: (row) => row.supervisors,
      sortable: true,
      cell: (row) => <div className="w-100 text-wrap">{row.supervisors}</div>,
    },
    {
      name: 'Department',
      selector: (row) => row.department_name,
      sortable: true,
    },

    {
      name: 'Division',
      selector: (row) => row.division_name,
      sortable: true,
    },

    {
      name: 'Idle Time',
      selector: (row) => row,
      sortable: true,
      cell: (row) => <div className="w-100 text-wrap">{formatIdleTime(row)}</div>,
    },
    // {
    //   name: 'Idle Duration (min)',
    //   selector: (row) => row.idle_start_end_diff_min,
    //   sortable: true,
    // },
    {
      name: 'First Response SLA',
      selector: (row) => row.first_response_duration,
      sortable: true,
      cell: (row) => <div className="w-100 text-wrap">{row.first_response_duration + ' Min'}</div>,
    },

    {
      name: 'Created Date',
      selector: (row) => row.created_at,
      sortable: true,
      cell: (row) => (
        <div className="w-100">
          <i className="bi bi-calendar-check me-2 text-primary"></i>
          <span>{moment(row.created_at).format('ll')}</span>
        </div>
      ),
    },
    {
      name: 'Additional Config',
      sortable: true,
      cell: (row) => (
        <div className="w-100">
          <Link to={`/admin/additional-config/${row.id}`} className="ticket-link-btn">
            <i className="bi bi-pencil-square me-2 text-primary"></i>
          </Link>
        </div>
      ),
    },
  ];

  const agentColumns = [
    // {
    //   name: "Id",
    //   selector: (row) => row.id,
    //   sortable: true,
    // },
    {
      name: 'Department',
      selector: (row) => row.department_name,
      sortable: true,
    },
    {
      name: 'Division',
      selector: (row) => row.division_name,
      sortable: true,
    },
    {
      name: 'Team',
      selector: (row) => row.teams,
      sortable: true,
      cell: (row) => (
        <div>
          {row.teams && row.teams.length > 0 ? (
            <ul className="d-flex justify-content-center m-0 p-0">
              {row.teams.map((team, index) => (
                <li className="me-2 custom-btn" key={index}>
                  {team.team_name}
                </li>
              ))}
            </ul>
          ) : (
            <span className="text-danger">No teams</span>
          )}
        </div>
      ),
    },
    {
      name: 'Fullname',
      selector: (row) => row.fullname,
      sortable: true,
    },
    {
      name: 'Username',
      selector: (row) => row.username,
      sortable: true,
      cell: (row) => (
        <div className="w-100">
          <button
            type="button"
            onClick={() => handleSetActiveTab('addNewAgent', row.id)}
            className="ticket-link-btn"
          >
            <span>{row.username}</span>
          </button>
        </div>
      ),
    },
    {
      name: 'Default Entity',
      selector: (row) => row.company_name,
      sortable: true,
    },
    // {
    //   name: 'Account',
    //   selector: (row) => row.lock,
    //   sortable: true,
    //   cell: (row) =>
    //     row.lock === 0 ? (
    //       <span className="text-success">Unlock</span>
    //     ) : (
    //       <span className="text-danger">Locked</span>
    //     ),
    // },
    {
      name: 'Status',
      selector: (row) => row.status,
      sortable: true,
      cell: (row) =>
        row.status === 0 ? (
          <span className="text-danger">Inactive</span>
        ) : (
          <span className="text-success">Active</span>
        ),
    },
    {
      name: 'Created Date',
      selector: (row) => row.created_at,
      sortable: true,
      cell: (row) => (
        <div className="w-100">
          <i className="bi bi-calendar-check me-2 text-primary"></i>
          <span>{moment(row.created_at).format('ll')}</span>
        </div>
      ),
    },
    {
      name: 'Reset Password',
      sortable: true,
      cell: (row) => (
        <div className="w-100">
          <Link to={`/admin/reset-password/${row.id}`} className="ticket-link-btn">
            <i className="bi bi-unlock-fill me-2 text-primary"></i>
            Reset
          </Link>
        </div>
      ),
    },

    // {
    //   name: "Reset Password",
    //   sortable: true,
    //   cell: (row) => (
    //     <div className='w-100'>
    //       <i className='bi bi-unlock-fill me-2 text-primary'></i>
    //     </div>
    //   ),
    // },
  ];

  const categoryColumns = [
    {
      name: 'Id',
      selector: (row) => row.id,
      sortable: true,
    },
    {
      name: 'Business Entity Name',
      selector: (row) => row.company_name,
      sortable: true,
    },
    {
      name: 'Category In English',
      selector: (row) => row.category_in_english,
      sortable: true,
      cell: (row) => (
        <div className="w-100">
          <button
            type="button"
            onClick={() => handleSetActiveTab('addNewCategory', row.id)}
            className="ticket-link-btn"
          >
            <span>{row.category_in_english}</span>
          </button>
        </div>
      ),
    },
    {
      name: 'Category In Bangla',
      selector: (row) => row.category_in_bangla,
      sortable: true,
    },

    {
      name: 'Is Client Visible',
      selector: (row) => row.is_client_visible,
      sortable: true,
      cell: (row) => (
        <div className="w-100">
          <button
            type="button"
            onClick={() => handleIsClientVisible(row)}
            className={`btn btn-sm ${row.is_client_visible === 1 ? 'btn-success' : 'btn-danger'}`}
          >
            <span>{row.is_client_visible === 1 ? 'Yes' : 'No'}</span>
          </button>
        </div>
      ),
    },
    {
      name: 'Created Date',
      selector: (row) => row.created_at,
      sortable: true,
      cell: (row) => (
        <div className="w-100">
          <i className="bi bi-calendar-check me-2 text-primary"></i>
          <span>{moment(row.created_at).format('ll')}</span>
        </div>
      ),
    },
  ];

  const subCategoryColumns = [
    {
      name: 'Id',
      selector: (row) => row.id,
      sortable: true,
    },
    {
      name: 'Business Entity Name',
      selector: (row) => row.company_name,
      sortable: true,
    },
    {
      name: 'Category In English',
      selector: (row) => row.category_in_english,
      sortable: true,
    },

    {
      name: 'Category In Bangla',
      selector: (row) => row.category_in_bangla,
      sortable: true,
    },

    // {
    //   name: 'Is Client Visible',
    //   selector: (row) => row.is_client_visible,
    //   sortable: true,
    //   cell: (row) => (
    //     <div className="w-100">
    //       <button
    //         type="button"
    //         onClick={() => handleIsClientVisible(row)}
    //         className={`btn btn-sm ${row.is_client_visible === 1 ? 'btn-success' : 'btn-danger'}`}
    //       >
    //         <span>{row.is_client_visible === 1 ? 'Yes' : 'No'}</span>
    //       </button>
    //     </div>
    //   ),
    // },

    {
      name: 'Sub Category in English',
      selector: (row) => row.sub_category_in_english,
      sortable: true,
      cell: (row) => (
        <div className="w-100">
          <button
            type="button"
            onClick={() => handleSetActiveTab('addNewSubCategory', row.id)}
            className="ticket-link-btn"
          >
            <span>{row.sub_category_in_english}</span>
          </button>
        </div>
      ),
    },

    {
      name: 'Sub Category in Bangla',
      selector: (row) => row.sub_category_in_bangla,
      sortable: true,
    },

    {
      name: 'Is Client Visible',
      selector: (row) => row.is_client_visible,
      sortable: true,
      cell: (row) => (
        <div className="w-100">
          <button
            type="button"
            onClick={() => handleIsClientVisibleSubCategory(row)}
            className={`btn btn-sm ${row.is_client_visible === 1 ? 'btn-success' : 'btn-danger'}`}
          >
            <span>{row.is_client_visible === 1 ? 'Yes' : 'No'}</span>
          </button>
        </div>
      ),
    },
    {
      name: 'Team',
      selector: (row) => row.teams,
      sortable: true,
      cell: (row) => (
        <div>
          {row.teams && row.teams.length > 0 ? (
            <ul className="d-flex justify-content-center m-0 p-0">
              {row.teams.map((team) => (
                <li className="me-2 custom-btn" key={team.id}>
                  {team.team_name}
                </li>
              ))}
            </ul>
          ) : (
            <span className="text-danger">No teams</span>
          )}
        </div>
      ),
    },
    {
      name: 'Created Date',
      selector: (row) => row.sub_category_created_at,
      sortable: true,
      cell: (row) => (
        <div className="w-100">
          <i className="bi bi-calendar-check me-2 text-primary"></i>
          <span>{moment(row.sub_category_created_at).format('ll')}</span>
        </div>
      ),
    },
  ];

  const clientColumns = [
    {
      name: 'Username',
      selector: (row) => row.username,
      sortable: true,
      cell: (row) => (
        <div className="w-100">
          <button
            type="button"
            onClick={() => handleSetActiveTab('addNewClient', row.id, row.username)}
            className="ticket-link-btn"
          >
            <span className="me-2">{row.username}</span>
            {plusIcon}
          </button>
        </div>
      ),
    },
    {
      name: 'Business Entity',
      selector: (row) => row.company_name,
      sortable: true,
    },

    {
      name: 'Client',
      selector: (row) => row.client_name,
      sortable: true,
      cell: (row) => (
        <div className="w-100">
          <button
            type="button"
            onClick={() => handleSetActiveTab('addNewClient', row.id, null, row.business_entity_id)}
            className="ticket-link-btn"
          >
            <span>{row.client_name}</span>
          </button>
        </div>
      ),
    },
    {
      name: 'Created Date',
      selector: (row) => row.created_at,
      sortable: true,
      cell: (row) => (
        <div className="w-100">
          <i className="bi bi-calendar-check me-2 text-primary"></i>
          <span>{moment(row.created_at).format('ll')}</span>
        </div>
      ),
    },
    {
      name: 'Reset Password',
      sortable: true,
      cell: (row) => (
        <div className="w-100">
          <Link to={`/admin/client-reset-password/${row.id}`} className="ticket-link-btn">
            <i className="bi bi-unlock-fill me-2 text-primary"></i>
            Reset
          </Link>
        </div>
      ),
    },
  ];

  const SLAColumns = [
    // {
    //   name: 'Id',
    //   selector: (row, index) => index + 1,
    //   sortable: true,
    // },

    {
      name: 'SAL Type',
      selector: (row) => row.type,
      sortable: true,
    },
    {
      name: 'Business Entity',
      selector: (row) => row.company_name,
      sortable: true,
    },
    {
      name: 'Team',
      selector: (row) => row.team_name,
      sortable: true,
    },
    {
      name: 'Sub-Category / Client',
      selector: (row) => row.sub_category_in_english,
      sortable: true,
      cell: (row) => (
        <div className="w-100">
          <button
            type="button"
            // CHANGED: Pass row.type as the 4th parameter
            onClick={() => {
              const slaType = row.type === 'Client' ? 'Client' : 'Sub-Category';
              handleSetActiveTab('addNewSLA', row.id, null, null, slaType);
            }}
            className="ticket-link-btn"
          >
            <span>{row.sub_category_in_english}</span>
          </button>
        </div>
      ),
    },
    {
      name: 'Service Time',
      selector: (row) => row.resolution_min + ' Min',
      sortable: true,
    },
    {
      name: 'Escalate',
      selector: (row) =>
        row.escalation_status == 1 ? (
          <span className="text-success">Yes</span>
        ) : (
          <span className="text-danger">No</span>
        ),
      sortable: true,
    },
    {
      name: 'Service Time SLA',
      selector: (row) =>
        row.sla_status == 1 ? (
          <span className="text-success">Active</span>
        ) : (
          <span className="text-danger">Inactive</span>
        ),
      sortable: true,
    },
    {
      name: 'Created Date',
      selector: (row) => row.created_at,
      sortable: true,
      cell: (row) => (
        <div className="w-100">
          <i className="bi bi-calendar-check me-2 text-primary"></i>
          <span>{moment(row.created_at).format('ll')}</span>
        </div>
      ),
    },
    // {
    //   name: 'Service Time',
    //   selector: (row) => row.srv_time_str,
    //   sortable: true,
    // },

    // {
    //   name: "SLA Name",
    //   selector: (row) => row.sla_name,
    //   sortable: true,
    //   cell: (row) => (
    //     <div className='w-100'>
    //       <Link to={`/admin/sla-details/${row.id}`}>{row.sla_name}</Link>
    //     </div>
    //   ),
    // },
  ];

  const templateColumns = [
    {
      name: 'Id',
      selector: (row) => row.id,
      sortable: true,
    },

    {
      name: 'Template Name',
      selector: (row) => row.template_name,
      sortable: true,
      cell: (row) => (
        <div className="w-100">
          <button
            type="button"
            onClick={() => handleSetActiveTab('addNewEmail', row.id)}
            className="ticket-link-btn"
          >
            <span>{row.template_name}</span>
          </button>
        </div>
      ),
    },

    {
      name: 'Status',
      selector: (row) => row.status,
      sortable: true,
    },
    {
      name: 'Created Date',
      selector: (row) => row.created_at,
      sortable: true,
      cell: (row) => (
        <div className="w-100">
          <i className="bi bi-calendar-check me-2 text-primary"></i>
          <span>{moment(row.created_at).format('ll')}</span>
        </div>
      ),
    },
  ];

  const templateColumnsSms = [
    {
      name: 'Id',
      selector: (row) => row.id,
      sortable: true,
      width: '60px',
    },
    {
      name: 'Template Name',
      selector: (row) => row.template_name,
      sortable: true,
      cell: (row) => (
        <div className="w-100">
          <button
            type="button"
            onClick={() => handleSetActiveTab('addNewSms', row.id)}
            className="ticket-link-btn"
          >
            <span>{row.template_name}</span>
          </button>
        </div>
      ),
    },
    {
      name: 'Key',
      selector: (row) => row.key,
      sortable: true,
      cell: (row) => (
        <div className="w-100">
          <code style={{ fontSize: '0.75rem', background: '#f1f3f5', padding: '2px 6px', borderRadius: '4px' }}>
            {row.key}
          </code>
        </div>
      ),
    },
    {
      name: 'Event',
      selector: (row) => row.event_name,
      sortable: true,
      cell: (row) => (
        <div className="w-100">
          {row.event_name
            ? <span className="badge bg-primary">{row.event_name}</span>
            : <span className="text-muted">—</span>
          }
        </div>
      ),
    },
    {
      name: 'Business Entity',
      selector: (row) => row.company_name,
      sortable: true,
      cell: (row) => (
        <div className="w-100">
          {row.company_name
            ? <span>{row.company_name}</span>
            : <span className="text-muted">—</span>
          }
        </div>
      ),
    },
    {
      name: 'Client',
      selector: (row) => row.client_name,
      sortable: true,
      cell: (row) => (
        <div className="w-100">
          {row.client_name
            ? <span>{row.client_name}</span>
            : <span className="text-muted">—</span>
          }
        </div>
      ),
    },

    {
      name: 'Exclude Client',
      selector: (row) => row.excluded_fullnames,
      sortable: true,
      cell: (row) => (
        <div className="w-100">
          {row.excluded_fullnames
            ? <span>{row.excluded_fullnames}</span>
            : <span className="text-muted">—</span>
          }
        </div>
      ),
    },

    {
      name: 'Template Preview',
      selector: (row) => row.template,
      sortable: false,
      cell: (row) => (
        <div className="w-100 position-relative template-preview-cell">
          {/* Truncated text */}
          <div
            className="text-wrap"
            style={{ fontSize: '0.78rem', color: '#555' }}
          >
            {row.template?.length > 80
              ? row.template.substring(0, 80) + '...'
              : row.template
            }
          </div>

          {/* Hover tooltip — full template */}
          {row.template?.length > 80 && (
            <div className="template-full-tooltip">
              {row.template}
            </div>
          )}
        </div>
      ),
    },
    {
      name: 'Status',
      selector: (row) => row.status,
      sortable: true,
      cell: (row) => (
        <span className={`badge ${row.status === 'Active' ? 'bg-success' : 'bg-danger'}`}>
          {row.status}
        </span>
      ),
    },
    {
      name: 'Created Date',
      selector: (row) => row.created_at,
      sortable: true,
      cell: (row) => (
        <div className="w-100">
          <i className="bi bi-calendar-check me-2 text-primary"></i>
          <span>{moment(row.created_at).format('ll')}</span>
        </div>
      ),
    },
  ];

  const roleData = [
    {
      Id: 1,
      'Role Name': 'Super Admin',
      'Total Agent': '1212',
      'Created Date': '2024-06-01',
    },
    {
      Id: 2,
      'Role Name': 'Admin',
      'Total Agent': '1212',
      'Created Date': '2024-06-01',
    },
    {
      Id: 3,
      'Role Name': 'Helpdesk',
      'Total Agent': '1212',
      'Created Date': '2024-06-01',
    },
    {
      Id: 4,
      'Role Name': 'Customer',
      'Total Agent': '1212',
      'Created Date': '2024-06-01',
    },
    {
      Id: 5,
      'Role Name': 'Supervisor',
      'Total Agent': '1212',
      'Created Date': '2024-06-01',
    },
    {
      Id: 6,
      'Role Name': 'Agent',
      'Total Agent': '1212',
      'Created Date': '2024-06-01',
    },
  ];

  const roleColumns = [
    {
      name: 'Id',
      selector: (row) => row.id,
      sortable: true,
    },

    {
      name: 'Role Name',
      selector: (row) => row['Role Name'],
      sortable: true,
      cell: (row) => (
        <div className="w-100">
          <button
            type="button"
            onClick={() => setActiveTab('addNewRole', row.id)}
            className="ticket-link-btn"
          >
            <span>{row['Role Name']}</span>
          </button>
        </div>
      ),
    },
    {
      name: 'Total Agent',
      selector: (row) => row['Total Agent'],
      sortable: true,
    },

    {
      name: 'Created Date',
      selector: (row) => row['Created Date'],
      sortable: true,
      cell: (row) => (
        <div className="w-100">
          <i className="bi bi-calendar-check me-2 text-primary"></i>
          <span>{row['Created Date']}</span>
        </div>
      ),
    },
  ];

  const networkBackboneColumns = [
    {
      name: 'Element Name',
      selector: (row) => row.element_name,
      sortable: true,
      cell: (row) => (
        <div className="w-100">
          <button
            disabled={true}
            type="button"
            onClick={() => handleSetActiveTab('addNewElement', row.id)}
            className="ticket-link-btn"
          >
            <span>{row.element_name}</span>
          </button>
        </div>
      ),
    },
    {
      name: 'Element List',
      selector: (row) => row.list_names,
      sortable: true,
      cell: (row) => (
        <div className="w-100 my-2">
          <ul className="">
            {row.list_names?.split('||')?.map((item, index) => (
              <li className="list-group-item" key={index}>
                <i className="bi bi-check text-success me-2"></i>
                {item}
              </li>
            ))}
          </ul>

          {/* <button
            type='button'
            onClick={() => handleSetActiveTab("addNewElementList", row.id)}
            className='ticket-link-btn'>
            <span>{row.list_names}</span>
          </button> */}
        </div>
      ),
    },

    {
      name: 'Created Date',
      selector: (row) => row.created_at,
      sortable: true,
      cell: (row) => (
        <div className="w-100">
          <i className="bi bi-calendar-check me-2 text-primary"></i>
          <span>{moment(row.created_at).format('ll')}</span>
        </div>
      ),
    },
  ];
  const branchColumns = [
    {
      name: 'Business Entity',
      selector: (row) => row.company_name,
      sortable: true,
    },
    {
      name: 'Client Name',
      selector: (row) => row.client_name,
      sortable: true,
    },

    {
      name: 'Branch Names',
      selector: (row) => row.branch_names,
      sortable: true,
      cell: (row) => (
        <div className="w-100 my-2">
          <ul className="">
            {row.branch_names?.split('||')?.map((item, index) => (
              <li className="list-group-item" key={index}>
                <button
                  type="button"
                  onClick={() =>
                    handleSetActiveTab(
                      'addNewBranch',
                      row.branch_id || row.id // ✅ make sure correct id is passed
                    )
                  }
                  className="ticket-link-btn"
                >
                  <i className="bi bi-check text-success me-2"></i>
                  <span>{item}</span>
                </button>
              </li>
            ))}
          </ul>
        </div>
      ),
    },
    {
      name: 'Mobile 1',
      selector: (row) => row.mobile1,
      sortable: true,
      cell: (row) => (
        <div className="w-100 my-2">
          {' '}
          <ul className="">
            {' '}
            {row.mobile1?.split('||')?.map((item, index) => (
              <li className="list-group-item" key={index}>
                {' '}
                <i className="bi bi-check text-success me-2"></i> {item}{' '}
              </li>
            ))}{' '}
          </ul>{' '}
        </div>
      ),
    },
    {
      name: 'Mobile 2',
      selector: (row) => row.mobile2,
      sortable: true,
      cell: (row) => (
        <div className="w-100 my-2">
          {' '}
          <ul className="">
            {' '}
            {row.mobile2?.split('||')?.map((item, index) => (
              <li className="list-group-item" key={index}>
                {' '}
                <i className="bi bi-check text-success me-2"></i> {item}{' '}
              </li>
            ))}{' '}
          </ul>{' '}
        </div>
      ),
    },
    {
      name: 'Email 1',
      selector: (row) => row.email1,
      sortable: true,
      cell: (row) => (
        <div className="w-100 my-2">
          {' '}
          <ul className="">
            {' '}
            {row.email1?.split('||')?.map((item, index) => (
              <li className="list-group-item" key={index}>
                {' '}
                <i className="bi bi-check text-success me-2"></i> {item}{' '}
              </li>
            ))}{' '}
          </ul>{' '}
        </div>
      ),
    },
    {
      name: 'Email 2',
      selector: (row) => row.email2,
      sortable: true,
      cell: (row) => (
        <div className="w-100 my-2">
          {' '}
          <ul className="">
            {' '}
            {row.email2?.split('||')?.map((item, index) => (
              <li className="list-group-item" key={index}>
                {' '}
                <i className="bi bi-check text-success me-2"></i> {item}{' '}
              </li>
            ))}{' '}
          </ul>{' '}
        </div>
      ),
    },
    {
      name: 'Service Address',
      selector: (row) => row.service_address,
      sortable: true,
      cell: (row) => (
        <div className="w-100 my-2">
          {' '}
          <ul className="">
            {' '}
            {row.service_address?.split('||')?.map((item, index) => (
              <li className="list-group-item" key={index}>
                {' '}
                <i className="bi bi-check text-success me-2"></i> {item}{' '}
              </li>
            ))}{' '}
          </ul>{' '}
        </div>
      ),
    },
    {
      name: 'Created Date',
      selector: (row) => row.created_at,
      sortable: true,
      cell: (row) => (
        <div className="w-100">
          {' '}
          <i className="bi bi-calendar-check me-2 text-primary"></i>{' '}
          <span>{moment(row.created_at).format('ll')}</span>{' '}
        </div>
      ),
    },
  ];

  const aggregatorsColumns = [
    {
      name: 'Business Entity',
      selector: (row) => row.company_name || row.business_entity_id,
      sortable: true,
    },
    {
      name: 'Client Name',
      selector: (row) => row.client_name || row.client_id,
      sortable: true,
    },
    {
      name: 'Aggregator',
      selector: (row) => row.aggregator_name,
      sortable: true,
      cell: (row) => (
        <div className="w-100">
          <button
            type="button"
            onClick={() =>
              handleSetActiveTab(
                'addNewAggregator',
                row.id,
                row.aggregator_name,
                row.business_entity_id
              )
            }
            className="ticket-link-btn"
          >
            <i className="bi bi-diagram-3 text-success me-2"></i>
            <span>{row.aggregator_name}</span>
          </button>
        </div>
      ),
    },
    {
      name: 'Created Date',
      selector: (row) => row.created_at,
      sortable: true,
      cell: (row) => (
        <div className="w-100">
          <i className="bi bi-calendar-check me-2 text-primary"></i>
          <span>{moment(row.created_at).format('ll')}</span>
        </div>
      ),
    },
  ];

  const teamMappingColumns = [
    {
      name: 'Business Entity',
      selector: (row) => row.company?.company_name || 'N/A',
      sortable: true,
      cell: (row) => (
        <div className="w-100">
          <i className="bi bi-building text-info me-2"></i>
          <span>{row.company?.company_name || 'N/A'}</span>
        </div>
      ),
    },
    {
      name: 'Category',
      selector: (row) => row.category?.category_in_english || 'N/A',
      sortable: true,
      cell: (row) => (
        <div className="w-100">
          <i className="bi bi-list text-secondary me-2"></i>
          <span>{row.category?.category_in_english || 'N/A'}</span>
        </div>
      ),
    },
    {
      name: 'Subcategory',
      selector: (row) => row.subcategory?.sub_category_in_english || 'N/A',
      sortable: true,
      cell: (row) => (
        <div className="w-100">
          <button
            type="button"
            onClick={() =>
              handleSetActiveTab(
                'addNewTeamMapping',
                row.id,
                row.subcategory?.sub_category_in_english,
                row.subcategory_id
              )
            }
            className="ticket-link-btn"
          >
            <i className="bi bi-tag text-info me-2"></i>
            <span>{row.subcategory?.sub_category_in_english || 'N/A'}</span>
          </button>
        </div>
      ),
    },
    {
      name: 'Team',
      selector: (row) => row.team?.team_name || 'N/A',
      sortable: true,
      cell: (row) => (
        <div className="w-100">
          <i className="bi bi-people text-primary me-2"></i>
          <span>{row.team?.team_name || 'N/A'}</span>
        </div>
      ),
    },
    {
      name: 'Status',
      selector: (row) => row.is_active,
      sortable: true,
      cell: (row) => (
        <div className="w-100">
          <span className={`badge ${row.is_active ? 'bg-success' : 'bg-danger'}`}>
            {row.is_active ? 'Active' : 'Inactive'}
          </span>
        </div>
      ),
    },
    {
      name: 'Created Date',
      selector: (row) => row.created_at,
      sortable: true,
      cell: (row) => (
        <div className="w-100">
          <i className="bi bi-calendar-check me-2 text-primary"></i>
          <span>{moment(row.created_at).format('ll')}</span>
        </div>
      ),
    },
  ];

  useEffect(() => {
    setIsLoading(true);
    switch (activeTab) {
      case 'organization':
        fetchCompany()
          .then((response) => {
            setData(response.result);
            setSelectedFilter('');
          })
          .catch((error) => {
            toast.error(error.response.data.message, {
              position: 'top-right',
            });
          })
          .finally(() => {
            setIsLoading(false);
          });
        break;
      case 'department':
        fetchDepartment()
          .then((response) => {
            setData(response.result);
            setSelectedFilter('');
          })
          .catch((error) => {
            toast.error(error.response.data.message, {
              position: 'top-right',
            });
          })
          .finally(() => {
            setIsLoading(false);
          });
        break;
      case 'team':
        fetchTeam()
          .then((response) => {
            setData(response.data);
            setSelectedFilter('');
          })
          .catch(errorMessage)
          .finally(() => {
            setIsLoading(false);
          });
        break;
      case 'category':
        fetchCategory()
          .then((response) => {
            setData(response.data);
            setSelectedFilter('');
          })
          .catch(errorMessage)
          .finally(() => {
            setIsLoading(false);
          });
        break;
      case 'subCategory':
        fetchSubCategory()
          .then((response) => {
            setData(response.data);
            setSelectedFilter('');
          })
          .catch(errorMessage)
          .finally(() => {
            setIsLoading(false);
          });
        break;
      case 'email':
        fetchEmailTemplate()
          .then((response) => {
            setData(response.data);
            setSelectedFilter('');
          })
          .catch(errorMessage)
          .finally(() => {
            setIsLoading(false);
          });
        break;
      // case 'sms':
      //   fetchEmailTemplate()
      //     .then((response) => {
      //       setData(response.data);
      //       setSelectedFilter('');
      //     })
      //     .catch(errorMessage)
      //     .finally(() => {
      //       setIsLoading(false);
      //     });
      //   break;

      // Inside the useEffect switch, add BEFORE the default:
      case 'sms':
        fetchSmsTemplate()
          .then((response) => {
            setData(response.data);   // ← matches ApiResponse structure
            setSelectedFilter('');
          })
          .catch(errorMessage)
          .finally(() => {
            setIsLoading(false);
          });
        break;
      case 'SLA':
        setIsLoading(true);
        Promise.all([fetchAllSlaSubcatConfigs(), fetchAllSlaClientConfigs()])
          .then(([subcatResponse, clientResponse]) => {
            // Combine both arrays
            const combinedData = [...subcatResponse.data, ...clientResponse.data];
            setData(combinedData);
            setSelectedFilter('');
          })
          .catch(errorMessage)
          .finally(() => {
            setIsLoading(false);
          });
        break;
      case 'agent':
        fetchAgent()
          .then((response) => {
            setData(response.data);
            setSelectedFilter('');
          })
          .catch(errorMessage)
          .finally(() => {
            setIsLoading(false);
          });

        break;
      case 'client':
        fetchClient()
          .then((response) => {
            setData(response.data);
            setSelectedFilter('');
          })
          .catch(errorMessage)
          .finally(() => {
            setIsLoading(false);
          });

        break;
      case 'networkBackbone':
        fetchNetworkBackboneEelements()
          .then((response) => {
            setData(response.data);
            setSelectedFilter('');
          })
          .catch(errorMessage)
          .finally(() => {
            setIsLoading(false);
          });

        break;
      case 'branch':
        fetchBranch()
          .then((response) => {
            setData(response.data);
            setSelectedFilter('');
          })
          .catch(errorMessage)
          .finally(() => {
            setIsLoading(false);
          });

        break;

      case 'aggregator':
        fetchClientAggregatorMappingList()
          .then((response) => {
            setData(response.data);
            setSelectedFilter('');
          })
          .catch(errorMessage)
          .finally(() => {
            setIsLoading(false);
          });

        break;

      case 'teamMapping':
        fetchTeamMapping()
          .then((response) => {
            setData(response.data);
            setSelectedFilter('');
          })
          .catch(errorMessage)
          .finally(() => {
            setIsLoading(false);
          });

      default:
        return;
    }
  }, [activeTab]);

  const handleFilterChange = (value) => {
    setSelectedFilter(value);
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'organization':
        return (
          <div className="bg-white">
            <OrganaizationHeader
              setActiveTab={handleSetActiveTab}
              onFilterChange={handleFilterChange}
              searchQuery={selectedFilter}
            />
            <SettingsDataTable
              data={data}
              columns={organizationColumns}
              isLoading={isLoading}
              setActiveTab={handleSetActiveTab}
              filterValue={selectedFilter}
            />
          </div>
        );
      case 'department':
        return (
          <div className="bg-white">
            <DepartmentHeader
              setActiveTab={handleSetActiveTab}
              onFilterChange={handleFilterChange}
              searchQuery={selectedFilter}
            />
            <SettingsDataTable
              data={data}
              columns={departmentColumns}
              isLoading={isLoading}
              setActiveTab={handleSetActiveTab}
              filterValue={selectedFilter}
            />
          </div>
        );
      case 'team':
        return (
          <div className="bg-white">
            <TeamHeader
              setActiveTab={handleSetActiveTab}
              onFilterChange={handleFilterChange}
              searchQuery={selectedFilter}
            />
            <SettingsDataTable
              data={data}
              columns={teamColumns}
              isLoading={isLoading}
              setActiveTab={handleSetActiveTab}
              filterValue={selectedFilter}
            />
          </div>
        );
      case 'agent':
        return (
          <div className="bg-white">
            <AgentHeader
              setActiveTab={handleSetActiveTab}
              onFilterChange={handleFilterChange}
              searchQuery={selectedFilter}
            />

            <SettingsDataTable
              data={data}
              columns={agentColumns}
              isLoading={isLoading}
              setActiveTab={handleSetActiveTab}
              filterValue={selectedFilter}
            />
          </div>
        );
      case 'category':
        return (
          <div className="bg-white">
            <CategoryHeader
              setActiveTab={handleSetActiveTab}
              onFilterChange={handleFilterChange}
              searchQuery={selectedFilter}
            />
            <SettingsDataTable
              data={data}
              columns={categoryColumns}
              isLoading={isLoading}
              setActiveTab={handleSetActiveTab}
              filterValue={selectedFilter}
            />
          </div>
        );
      case 'subCategory':
        return (
          <div className="bg-white">
            <SubCategoryHeader
              setActiveTab={handleSetActiveTab}
              onFilterChange={handleFilterChange}
              searchQuery={selectedFilter}
            />
            <SettingsDataTable
              data={data}
              columns={subCategoryColumns}
              isLoading={isLoading}
              setActiveTab={handleSetActiveTab}
              filterValue={selectedFilter}
            />
          </div>
        );
      case 'SLA':
        return (
          <div className="bg-white">
            <SLAHeader
              setActiveTab={handleSetActiveTab}
              onFilterChange={handleFilterChange}
              searchQuery={selectedFilter}
            />
            <SettingsDataTable
              data={data}
              columns={SLAColumns}
              isLoading={isLoading}
              setActiveTab={handleSetActiveTab}
              filterValue={selectedFilter}
            />
          </div>
        );
      case 'client':
        return (
          <div className="bg-white">
            <ClientHeader
              setActiveTab={handleSetActiveTab}
              onFilterChange={handleFilterChange}
              searchQuery={selectedFilter}
            />
            <SettingsDataTable
              data={data}
              columns={clientColumns}
              isLoading={isLoading}
              setActiveTab={handleSetActiveTab}
              filterValue={selectedFilter}
            />
          </div>
        );
      case 'role':
        return (
          <div className="bg-white">
            <RoleHeader
              setActiveTab={setActiveTab}
              onFilterChange={handleFilterChange}
              searchQuery={selectedFilter}
            />
            <SettingsDataTable
              data={roleData}
              columns={roleColumns}
              setActiveTab={handleSetActiveTab}
              filterValue={selectedFilter}
            />
          </div>
        );
      case 'email':
        return (
          <div className="bg-white">
            <EmailHeader
              setActiveTab={handleSetActiveTab}
              onFilterChange={handleFilterChange}
              searchQuery={selectedFilter}
            />
            <SettingsDataTable
              data={data}
              columns={templateColumns}
              isLoading={isLoading}
              setActiveTab={handleSetActiveTab}
              filterValue={selectedFilter}
            />
          </div>
        );
      case 'sms':
        return (
          <div className="bg-white">
            <SmsHeader
              setActiveTab={handleSetActiveTab}
              onFilterChange={handleFilterChange}
              searchQuery={selectedFilter}
            />
            <SettingsDataTable
              data={data}
              columns={templateColumnsSms}
              isLoading={isLoading}
              setActiveTab={handleSetActiveTab}
              filterValue={selectedFilter}
            />
          </div>
        );

      case 'networkBackbone':
        return (
          <div className="bg-white">
            <NetworkBackboneHeader
              setActiveTab={handleSetActiveTab}
              onFilterChange={handleFilterChange}
              searchQuery={selectedFilter}
            />
            <SettingsDataTable
              data={data}
              columns={networkBackboneColumns}
              isLoading={isLoading}
              setActiveTab={handleSetActiveTab}
              filterValue={selectedFilter}
            />
          </div>
        );

      case 'branch':
        return (
          <div className="bg-white">
            <BranchHeader
              setActiveTab={handleSetActiveTab}
              onFilterChange={handleFilterChange}
              searchQuery={selectedFilter}
            />
            <SettingsDataTable
              data={data}
              columns={branchColumns}
              isLoading={isLoading}
              setActiveTab={handleSetActiveTab}
              filterValue={selectedFilter}
            />
          </div>
        );

      case 'aggregator':
        return (
          <div className="bg-white">
            <AggregatorHeader
              setActiveTab={handleSetActiveTab}
              onFilterChange={handleFilterChange}
              searchQuery={selectedFilter}
            />
            <SettingsDataTable
              data={data}
              columns={aggregatorsColumns}
              isLoading={isLoading}
              setActiveTab={handleSetActiveTab}
              filterValue={selectedFilter}
            />
          </div>
        );

      case 'teamMapping':
        return (
          <div className="bg-white">
            <TeamMappingHeader
              setActiveTab={handleSetActiveTab}
              onFilterChange={handleFilterChange}
              searchQuery={selectedFilter}
            />
            <SettingsDataTable
              data={data}
              columns={teamMappingColumns}
              isLoading={isLoading}
              setActiveTab={handleSetActiveTab}
              filterValue={selectedFilter}
            />
          </div>
        );
      case 'addNewOrganization':
        return (
          <div className="bg-white py-3 px-2 p-sm-4  animate__animated animate__fadeIn">
            <AddNewOrganization id={selectedId} />
          </div>
        );
      case 'addNewDepartment':
        return (
          <div className="bg-white py-3 px-2 p-sm-4 animate__animated animate__fadeIn">
            <AddNewDepartment id={selectedId} />
          </div>
        );
      case 'addNewTeam':
        return (
          <div className="bg-white py-3 px-2 p-sm-4 animate__animated animate__fadeIn">
            <AddNewTeam id={selectedId} />
          </div>
        );
      case 'addNewAgent':
        return (
          <div className="bg-white py-3 px-2 p-sm-4 animate__animated animate__fadeIn">
            <AddNewAgent id={selectedId} />
          </div>
        );
      case 'addNewCategory':
        return (
          <div className="bg-white py-3 px-2 p-sm-4 animate__animated animate__fadeIn">
            <AddNewCategory id={selectedId} />
          </div>
        );
      case 'addNewSubCategory':
        return (
          <div className="bg-white py-3 px-2 p-sm-4 animate__animated animate__fadeIn">
            <AddNewSubCategory id={selectedId} />
          </div>
        );
      case 'addNewClient':
        return (
          <div className="bg-white py-3 px-2 p-sm-4 animate__animated animate__fadeIn">
            <AddNewClient
              id={selectedId}
              addBusinessEntity={selectedUserName}
              businessEnId={businessId}
            />
          </div>
        );

      case 'addNewSLA':
        return (
          <div className="bg-white py-3 px-2 p-sm-4 animate__animated animate__fadeIn">
            <AddNewSLA id={selectedId} slaType={slaType} />
          </div>
        );
      case 'addNewRole':
        return (
          <div className="bg-white py-3 px-2 p-sm-4 animate__animated animate__fadeIn">
            <AddNewRole id={selectedId} />
          </div>
        );
      case 'addNewEmail':
        return (
          <div className="py-3 px-2 p-sm-4 animate__animated animate__fadeIn">
            <AddNewEmail id={selectedId} />
          </div>
        );
      case 'addNewSms':
        return (
          <div className="py-3 px-2 p-sm-4 animate__animated animate__fadeIn">
            <AddNewSms id={selectedId} />
          </div>
        );
      case 'addNewNotification':
        return (
          <div className="py-3 px-2 p-sm-4 animate__animated animate__fadeIn">
            <EmailNotification id={selectedId} />
          </div>
        );
      case 'addNewElement':
        return (
          <div className="py-3 px-2 p-sm-4 animate__animated animate__fadeIn">
            <AddNewElement id={selectedId} />
          </div>
        );
      case 'addNewElementList':
        return (
          <div className="py-3 px-2 p-sm-4 animate__animated animate__fadeIn">
            <AddNewElementList id={selectedId} />
          </div>
        );

      case 'addNewBranch':
        return (
          <div className="py-3 px-2 p-sm-4 animate__animated animate__fadeIn">
            <AddNewBranch id={selectedId} />
          </div>
        );

      case 'addNewAggregator':
        return (
          <div className="py-3 px-2 p-sm-4 animate__animated animate__fadeIn">
            <AddNewAggregator id={selectedId} />
          </div>
        );

      case 'addNewTeamMapping':
        return (
          <div className="py-3 px-2 p-sm-4 animate__animated animate__fadeIn">
            <AddNewTeamMapping id={selectedId} />
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="container-fluid">
      <div className="row">
        <div className="col-sm-12 col-md-12 col-lg-12 col-xl-12">
          <ul className="nav nav-tabs" id="myTab" role="tablist">
            {hasPermission('Business_Entity') && (
              <li className="nav-item" role="presentation">
                <button
                  className={`nav-link ${activeTab === 'organization' ? 'active' : ''}`}
                  onClick={() => setActiveTab('organization')}
                  type="button"
                  role="tab"
                >
                  {faBuildingIcon}
                  Business Entity
                </button>
              </li>
            )}
            {hasPermission('Department') && (
              <li className="nav-item" role="presentation">
                <button
                  className={`nav-link ${activeTab === 'department' ? 'active' : ''}`}
                  onClick={() => setActiveTab('department')}
                  type="button"
                  role="tab"
                >
                  {faBuildingUserIcon}
                  Department
                </button>
              </li>
            )}
            {hasPermission('Team') && (
              <li className="nav-item" role="presentation">
                <button
                  className={`nav-link ${activeTab === 'team' ? 'active' : ''}`}
                  onClick={() => setActiveTab('team')}
                  type="button"
                  role="tab"
                >
                  <FontAwesomeIcon
                    icon={faUsers}
                    className="me-1"
                    style={{ color: 'lightcoral' }}
                  />{' '}
                  Team
                </button>
              </li>
            )}
            {hasPermission('Agent') && (
              <li className="nav-item" role="presentation">
                <button
                  className={`nav-link ${activeTab === 'agent' ? 'active' : ''}`}
                  onClick={() => setActiveTab('agent')}
                  type="button"
                  role="tab"
                >
                  <FontAwesomeIcon icon={faUser} className="me-1" style={{ color: 'grey' }} /> Agent
                </button>
              </li>
            )}
            {hasPermission('Category') && (
              <li className="nav-item" role="presentation">
                <button
                  className={`nav-link ${activeTab === 'category' ? 'active' : ''}`}
                  onClick={() => setActiveTab('category')}
                  type="button"
                  role="tab"
                >
                  <FontAwesomeIcon icon={faList} className="me-1" style={{ color: 'dodgerblue' }} />{' '}
                  Category
                </button>
              </li>
            )}
            {hasPermission('Sub-Category') && (
              <li className="nav-item" role="presentation">
                <button
                  className={`nav-link ${activeTab === 'subCategory' ? 'active' : ''}`}
                  onClick={() => setActiveTab('subCategory')}
                  type="button"
                  role="tab"
                >
                  <FontAwesomeIcon icon={faSitemap} className="me-1" style={{ color: '#413e3e' }} />{' '}
                  Sub-Category
                </button>
              </li>
            )}
            {hasPermission('SLA') && (
              <li className="nav-item" role="presentation">
                <button
                  className={`nav-link ${activeTab === 'SLA' ? 'active' : ''}`}
                  onClick={() => setActiveTab('SLA')}
                  type="button"
                  role="tab"
                >
                  {handShakeIcon}
                  SLA
                </button>
              </li>
            )}
            {hasPermission('Client') && (
              <li className="nav-item" role="presentation">
                <button
                  className={`nav-link ${activeTab === 'client' ? 'active' : ''}`}
                  onClick={() => setActiveTab('client')}
                  type="button"
                  role="tab"
                >
                  {faUserTieIcon}
                  Client
                </button>
              </li>
            )}
            {hasPermission('Role') && (
              <li className="nav-item" role="presentation">
                <button
                  className={`nav-link ${activeTab === 'role' ? 'active' : ''}`}
                  onClick={() => setActiveTab('role')}
                  type="button"
                  role="tab"
                >
                  {roleIcon} Role
                </button>
              </li>
            )}

            {hasPermission('Email') && (
              <li className="nav-item" role="presentation">
                <button
                  className={`nav-link ${activeTab === 'email' ? 'active' : ''}`}
                  onClick={() => setActiveTab('email')}
                  type="button"
                  role="tab"
                >
                  {emailIcon} Email
                </button>
              </li>
            )}
            {hasPermission('Email') && (
              <li className="nav-item" role="presentation">
                <button
                  className={`nav-link ${activeTab === 'sms' ? 'active' : ''}`}
                  onClick={() => setActiveTab('sms')}
                  type="button"
                  role="tab"
                >
                  {emailIcon} SMS
                </button>
              </li>
            )}
            {hasPermission('Network_&_Backbone') && (
              <li className="nav-item" role="presentation">
                <button
                  className={`nav-link ${activeTab === 'networkBackbone' ? 'active' : ''}`}
                  onClick={() => setActiveTab('networkBackbone')}
                  type="button"
                  role="tab"
                >
                  {networkIcon} Network & Backbone
                </button>
              </li>
            )}
            {hasPermission('Network_&_Backbone') && (
              <li className="nav-item" role="presentation">
                <button
                  className={`nav-link ${activeTab === 'branch' ? 'active' : ''}`}
                  onClick={() => setActiveTab('branch')}
                  type="button"
                  role="tab"
                >
                  {branchIcon} Branch
                </button>
              </li>
            )}
            {hasPermission('Network_&_Backbone') && (
              <li className="nav-item" role="presentation">
                <button
                  className={`nav-link ${activeTab === 'aggregator' ? 'active' : ''}`}
                  onClick={() => setActiveTab('aggregator')}
                  type="button"
                  role="tab"
                >
                  {settingIcon} Aggregator
                </button>
              </li>
            )}
            {hasPermission('Network_&_Backbone') && (
              <li className="nav-item" role="presentation">
                <button
                  className={`nav-link ${activeTab === 'teamMapping' ? 'active' : ''}`}
                  onClick={() => setActiveTab('teamMapping')}
                  type="button"
                  role="tab"
                >
                  {handShakeIcon} Team Mapping
                </button>
              </li>
            )}
          </ul>
          <div className="tab-content" id="myTabContent">
            {renderTabContent()}
          </div>
        </div>
      </div>
    </div>
  );
};
