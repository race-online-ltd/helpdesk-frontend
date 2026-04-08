import React, { useState, useEffect, useContext, useMemo } from 'react';
import DataTable from 'react-data-table-component';
import { useFormik } from 'formik';
import { defaultThemes } from 'react-data-table-component';
import { Link, useNavigate } from 'react-router-dom';
import moment from 'moment';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHandshakeSimple } from '@fortawesome/free-solid-svg-icons';
import {
  faBusinessTimeIcon,
  faUserClockIcon,
  faUserTieIcon,
  iconMapping,
  plusIcon,
  refreshIcon,
  USER_TICKET_VALIDATION_MESSAGES,
} from '../../../../data/data';

import { OffcanvasForTicketMerge } from './../OffcanvasForTicketMerge';
import { assignValidationSchema, mergeTicketSchema } from './../../../../schema/ValidationSchemas';
import { SelectDropdown } from '../SelectDropdown';
import { OffcanvasForTicketAssign } from '../OffcanvasForTicketAssign';
import { OffcanvasForSlaHistory } from './../OffcanvasForSlaHistory';
import { fetchAllTeam, fetchTeamBySubCategory } from '../../../../api/api-client/settings/teamApi';
import {
  errorMessage,
  successMessage,
  warningMessage,
} from '../../../../api/api-config/apiResponseMessage';
import { getStatus } from '../../../../api/api-client/utilityApi';
import {
  assignTeamAndStore,
  changeStatusByStatusIdAndTicketNumber,
  fetchCommentsByTicketNumber,
  fetchSelfTicket,
  isTicketReal,
  selfTicketToTicket,
  getOpenTicketsByTeam,
  mergeTicketTeamWise,
  reOpenStatusIdAndTicketNumber,
  getSlaHistoryByTicketNumber,
} from '../../../../api/api-client/ticketApi';
import { fetchAgentsByTeam } from '../../../../api/api-client/settings/agentApi';
import { userContext } from '../../../context/UserContext';
import { getWarningMessage, truncateString, htmlToPlainText } from '../../../../utils/utility';
import { ExportToExcel } from '../ExportToExcel';
import { useUserRolePermissions } from '../../../custom-hook/useUserRolePermissions';
import { IsLoadingContext } from '../../../context/LoaderContext';
import { text } from '@fortawesome/fontawesome-svg-core';
// import ReactTooltip from "react-tooltip";
import TextEditor from '../text-editor/TextEditor';

export const OpenDataTable = ({
  ticketList,
  setTikcetData,
  activeTab,
  setActiveTab,
  isLoadingTableData,
}) => {
  const { user } = useContext(userContext);
  console.log('User:', user);
  const navigate = useNavigate();
  const { setIsLoadingContextUpdated } = useContext(IsLoadingContext);
  const { hasPermission } = useUserRolePermissions();
  const [rowsPerPage, setRowsPerPage] = useState(50);

  const [searchText, setSearchText] = useState('');
  const [selectedRows, setSelectedRows] = useState([]);
  const [toggledClearRows, setToggleClearRows] = useState(false);
  const [actionButtons, setActionButtons] = useState(false);
  const [statusOptions, setStatusOptions] = useState([]);
  const [statusForAssignOptions, setStatusForAssignOptions] = useState([]);

  const [teamOptions, setTeamOptions] = useState([]);
  const [agents, setAgents] = useState(null);
  const [selectedTeamId, setSelectedTeamId] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingAssign, setIsLoadingAssign] = useState(false);
  const [isLoadingMerge, setIsLoadingMerge] = useState(false);

  // Inside your OpenDataTable component, add a new state for dynamic options
  const [ticketOptions, setTicketOptions] = useState([]);
  const [ticketDetailsMap, setTicketDetailsMap] = useState({}); // Store full ticket details
  const [isLoadingTicketOptions, setIsLoadingTicketOptions] = useState(false);

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

  const customStyles = {
    header: {
      style: {
        minHeight: '56px',
      },
    },
    headRow: {
      style: {
        borderTopStyle: 'solid',
        borderTopWidth: '1px',
        borderTopColor: defaultThemes.default.divider.default,
        background: '#EBEFF3',
        fontWeight: 'bold',
      },
    },
    headCells: {
      style: {
        '&:not(:last-of-type)': {
          borderRightStyle: 'solid',
          borderRightWidth: '1px',
          borderRightColor: defaultThemes.default.divider.default,
        },
      },
    },
    rows: {
      style: {
        '&:hover': {
          backgroundColor: 'var(--secondary-bg-color)',
          cursor: 'pointer',
        },
      },
    },
    cells: {
      style: {
        '&:not(:last-of-type)': {
          borderRightStyle: 'solid',
          borderRightWidth: '1px',
          borderRightColor: defaultThemes.default.divider.default,
        },
      },
    },
  };

  const statusColorSet = (Priority) => {
    switch (Priority) {
      case 'High':
        return (
          <div>
            <i
              className="bi bi-square-fill me-2"
              style={{
                color: 'var(--priority-high-color)',
                fontSize: '8px',
              }}
            ></i>
            {Priority}
          </div>
        );

      case 'Low':
        return (
          <div>
            <i
              className="bi bi-square-fill me-2"
              style={{
                color: 'var(--priority-low-color)',
                fontSize: '8px',
              }}
            ></i>
            {Priority}
          </div>
        );

      case 'Medium':
        return (
          <div>
            <i
              className="bi bi-square-fill me-2"
              style={{
                color: 'var(--priority-medium-color)',
                fontSize: '8px',
              }}
            ></i>
            {Priority}
          </div>
        );

      default:
        return Priority;
    }
  };
  // const handleIsTicketReal = (e, tNo) => {
  //   e.preventDefault();

  //   isTicketReal(tNo)
  //     .then((response) => {
  //       if (!response.data.exists) {
  //         return warningMessage({
  //           message: USER_TICKET_VALIDATION_MESSAGES.TICKET_NO_DETAILS,
  //         });
  //       }
  //       navigate(`/admin/ticket-details/${tNo}`);
  //     })
  //     .catch(errorMessage)
  //     .finally(() => {});
  // };

  const handleIsTicketReal = (e, tNo) => {
    if (e.ctrlKey || e.metaKey || e.shiftKey) {
      return;
    }

    e.preventDefault();

    isTicketReal(tNo)
      .then((response) => {
        if (!response.data.exists) {
          return warningMessage({
            message: USER_TICKET_VALIDATION_MESSAGES.TICKET_NO_DETAILS,
          });
        }
        navigate(`/admin/ticket-details/${tNo}`);
      })
      .catch(errorMessage)
      .finally(() => {});
  };

  const agentColumns = [
    // {
    //   name: 'Ticket No.',
    //   selector: (row) => row.ticket_number,
    //   cell: (row) => (
    //     <div className="w-100" style={{ whiteSpace: 'nowrap' }}>
    //       <a
    //         href={`/admin/ticket-details/${row.ticket_number}`}
    //         target="_blank"
    //         rel="noopener noreferrer"
    //         className="ticket-link bg-transparent"
    //         // onClick={(e) => handleIsTicketReal(e, row.ticket_number)}
    //       >
    //         <i
    //           className="bi bi-ticket-detailed me-2"
    //           style={{
    //             color: `${row.status_name === 'Closed' ? 'green' : '#FF3131'}`,
    //           }}
    //         ></i>
    //         <span>{row.ticket_number}</span>
    //       </a>
    //     </div>
    //   ),
    // },

    {
      name: 'Ticket No.',
      selector: (row) => row.ticket_number,
      cell: (row) => (
        <div className="w-100" style={{ whiteSpace: 'nowrap' }}>
          <Link
            to={`/admin/ticket-details/${row.ticket_number}`}
            target="_blank"
            rel="noopener noreferrer"
            className="ticket-link bg-transparent"
          >
            <i
              className="bi bi-ticket-detailed me-2"
              style={{
                color: `${row.status_name === 'Closed' ? 'green' : '#FF3131'} `,
              }}
            ></i>
            <span>{row.ticket_number}</span>
            <br />
            <small>
              <i className="fw-normal ms-2" style={{ color: '#00bcd4' }}>
                {row.ticket_relationship}
              </i>
            </small>
          </Link>
        </div>
      ),
    },

    {
      name: 'User Type',
      selector: (row) => row.user_type,
      cell: (row) => (
        <div>
          <span className={`badge ${row.user_type === 'Agent' ? 'bg-primary' : 'bg-info'}`}>
            {row.user_type ?? '---'}
          </span>
        </div>
      ),
    },

    {
      name: 'Platform',
      selector: (row) => row.platform_name,
      cell: (row) => <div>{row.platform_name ?? '---'}</div>,
    },

    {
      name: 'Business Entity',
      selector: (row) => row.company_name,
      cell: (row) => <div>{row.company_name ?? '---'}</div>,
    },

    {
      name: 'Client',
      selector: (row) => row.raised_for,
      cell: (row) => (
        <div>
          <span>{row.raised_for ?? '---'}</span>
        </div>
      ),
    },

    {
      name: 'SID / UID',
      selector: (row) => row.sid_uid,
      cell: (row) => (
        <div>
          <span>{row.sid_uid ?? '---'}</span>
        </div>
      ),
    },

    {
      name: 'Category',
      selector: (row) => row.category_in_english,
      cell: (row) => <div>{statusColorSet(row.category_in_english ?? '---')}</div>,
    },

    {
      name: 'Sub-category',
      selector: (row) => row.sub_category_in_english,
      cell: (row) => (
        <div>
          <i className="bi bi-file-text-fill me-2" style={{ color: '#1E90FF' }}></i>
          <span>{row.sub_category_in_english ?? '---'}</span>
        </div>
      ),
    },

    // {
    //   name: 'Last Comment',
    //   selector: (row) => row.last_comment,
    //   cell: (row) => (
    //     <div title={row.last_comment || 'No comment'}>
    //       {truncateString(row.last_comment || 'No comment', 30)}
    //     </div>
    //   ),
    // },
    {
      name: 'Last Comment',
      selector: (row) => row.last_comment,
      cell: (row) => {
        const plainText = htmlToPlainText(row.last_comment);
        const shortText = truncateString(plainText || 'No comment', 30);

        return (
          <div
            title={plainText || 'No comment'}
            style={{
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              maxWidth: '220px',
            }}
          >
            {shortText}
          </div>
        );
      },
    },

    {
      name: 'SLA F.Response',
      selector: (row) => row.fr_response_status,
      cell: (row) => (
        <div
          className={`rounded text-center d-flex flex-column p-1 ${
            row.fr_response_status === 'Failed'
              ? 'bg-danger text-white'
              : row.fr_response_status === 'Success'
                ? 'bg-success text-white'
                : row.fr_response_status === 'Started'
                  ? 'bg-warning text-dark'
                  : 'bg-secondary text-white'
          }`}
        >
          <span>{row.fr_response_status ?? '---'}</span>
        </div>
      ),
    },

    {
      name: 'SLA Service Time',
      selector: (row) => row.srv_response_status,
      cell: (row) => {
        const slaStatus = row.srv_client_response_status ?? row.srv_response_status ?? '---';

        return (
          <div
            className={`rounded text-center d-flex flex-column p-1 ${
              slaStatus === 'Failed'
                ? 'bg-danger text-white'
                : slaStatus === 'Success'
                  ? 'bg-success text-white'
                  : slaStatus === 'Started'
                    ? 'bg-warning text-dark'
                    : 'bg-secondary text-white'
            }`}
          >
            <span>{slaStatus}</span>
          </div>
        );
      },
    },

    {
      name: 'Total SLA Success',
      selector: (row) => row.id,
      // cell: (row) => (
      //   <div>
      //     <a href={`/admin/ticket-sla-details/${row.ticket_number}?type=success`}>
      //       <span className="badge bg-success">
      //         FR: {row.fr_sla_success_count} | SRV:{' '}
      //         {row.srv_sla_success_count + row.srv_client_sla_success_count}
      //       </span>
      //     </a>
      //   </div>
      // ),
      cell: (row) => (
        <div>
          <span
            className="badge bg-success"
            style={{ cursor: 'pointer' }}
            onClick={() => handleOpenSlaHistory(row, 'success')}
          >
            FR: {row.fr_sla_success_count} | SRV:{' '}
            {row.srv_sla_success_count + row.srv_client_sla_success_count}
          </span>
        </div>
      ),
    },
    {
      name: 'Total SLA Violated',
      selector: (row) => row.id,
      // cell: (row) => (
      //   <div>
      //     <a href={`/admin/ticket-sla-details/${row.ticket_number}?type=violated`}>
      //       <span className="badge bg-danger">
      //         FR: {row.fr_sla_failed_count} | SRV:{' '}
      //         {row.srv_sla_failed_count + row.srv_client_sla_failed_count}
      //       </span>
      //     </a>
      //   </div>
      // ),
      cell: (row) => (
        <div>
          <span
            className="badge bg-danger"
            style={{ cursor: 'pointer' }}
            onClick={() => handleOpenSlaHistory(row, 'violated')}
          >
            FR: {row.fr_sla_failed_count} | SRV:{' '}
            {row.srv_sla_failed_count + row.srv_client_sla_failed_count}
          </span>
        </div>
      ),
    },

    {
      name: 'Assigned Team',
      selector: (row) => row.team_name,
      cell: (row) => (
        <div style={{ whiteSpace: 'wrap' }}>
          <i className="bi bi-people-fill me-2" style={{ color: 'gray' }}></i>
          <span>{row.team_name ?? '---'}</span>
        </div>
      ),
    },

    {
      name: 'Assigned Agent',
      selector: (row) => row.assigned_agent,
      cell: (row) => (
        <div style={{ whiteSpace: 'wrap' }}>
          <i className="bi bi-people-fill me-2" style={{ color: 'gray' }}></i>
          <span>{row.assigned_agent ?? '---'}</span>
        </div>
      ),
    },

    {
      name: 'Age',
      selector: (row) => row.ticket_age,
      cell: (row) => (
        <div style={{ whiteSpace: 'nowrap' }}>
          <i className="bi bi-clock me-2" style={{ color: 'gray' }}></i>
          <span>{row.ticket_age ?? '---'}</span>
        </div>
      ),
    },

    {
      name: 'Division',
      selector: (row) => row.division,
      cell: (row) => (
        <div style={{ whiteSpace: 'nowrap' }}>
          <i className="bi bi-geo-alt me-2" style={{ color: 'gray' }}></i>
          <span>{row.division ?? '---'}</span>
        </div>
      ),
    },

    {
      name: 'District',
      selector: (row) => row.district,
      cell: (row) => (
        <div style={{ whiteSpace: 'nowrap' }}>
          <i className="bi bi-geo me-2" style={{ color: 'gray' }}></i>
          <span>{row.district ?? '---'}</span>
        </div>
      ),
    },

    {
      name: 'Aggregator',
      selector: (row) => row.aggregator_name,
      cell: (row) => (
        <div>
          <span>{row.aggregator_name ?? '---'}</span>
        </div>
      ),
    },

    {
      name: 'Branch',
      selector: (row) => row.branch,
      cell: (row) => (
        <div style={{ whiteSpace: 'nowrap' }}>
          <i className="bi bi-diagram-3 me-2" style={{ color: 'gray' }}></i>
          <span>{row.branch ?? '---'}</span>
        </div>
      ),
    },

    {
      name: 'Status',
      selector: (row) => row.status_name,
      cell: (row) => (
        <div>
          <i
            className={`${iconMapping[row.status_name] || 'bi bi-question-circle'} me-2`}
            style={{
              color: `${row.status_name === 'Closed' ? 'green' : ''}`,
            }}
          ></i>
          {row.status_name ?? '---'}
        </div>
      ),
    },

    {
      name: 'Created By',
      selector: (row) => row.created_by,
      cell: (row) => <div>{row.created_by ?? '---'}</div>,
    },

    ...(activeTab === 'closed'
      ? [
          {
            name: 'Closed By',
            selector: (row) => row.status_updated_by,
            cell: (row) => <div>{row.status_updated_by ?? '---'}</div>,
          },
        ]
      : []),

    {
      name: 'Created Date',
      selector: (row) => moment(row.created_at).format('lll'),
      cell: (row) => (
        <div>{moment(row.created_at).isValid() ? moment(row.created_at).format('lll') : '---'}</div>
      ),
    },

    {
      name: 'Last Updated',
      selector: (row) => moment(row.updated_at).format('lll'),
      cell: (row) => (
        <div>{moment(row.updated_at).isValid() ? moment(row.updated_at).format('lll') : '---'}</div>
      ),
    },
  ];

  const clientColumns = [
    // {
    //   name: 'Ticket No.',
    //   selector: (row) => row.ticket_number,
    //   cell: (row) => (
    //     <div className="w-100" style={{ whiteSpace: 'nowrap' }}>
    //       <a
    //         href={`/admin/ticket-details/${row.ticket_number}`}
    //         target="_blank"
    //         rel="noopener noreferrer"
    //         className="ticket-link bg-transparent"
    //         onClick={(e) => handleIsTicketReal(e, row.ticket_number)}
    //       >
    //         <i
    //           className="bi bi-ticket-detailed me-2"
    //           style={{
    //             color: `${row.status_name === 'Closed' ? 'green' : '#FF3131'}`,
    //           }}
    //         ></i>
    //         <span>{row.ticket_number}</span>
    //       </a>
    //     </div>
    //   ),
    // },
    {
      name: 'Ticket No.',
      selector: (row) => row.ticket_number,
      cell: (row) => (
        <div className="w-100" style={{ whiteSpace: 'nowrap' }}>
          <Link
            to={`/admin/ticket-details/${row.ticket_number}`}
            target="_blank"
            rel="noopener noreferrer"
            className="ticket-link bg-transparent"
          >
            <i
              className="bi bi-ticket-detailed me-2"
              style={{
                color: `${row.status_name === 'Closed' ? 'green' : '#FF3131'} `,
              }}
            ></i>
            <span>{row.ticket_number}</span>

            {row.ticket_partner && (
              <small>
                <i className="fw-normal ms-2" style={{ color: '#00bcd4' }}>
                  Partner
                </i>
              </small>
            )}
          </Link>
        </div>
      ),
    },

    // {
    //   name: 'Ticket No.',
    //   selector: (row) => row.ticket_number,
    //   cell: (row) => (
    //     <div className="w-100" style={{ whiteSpace: 'nowrap' }}>
    //       <Link
    //         to={`/admin/ticket-details/${row.ticket_number}`}
    //         target="_blank"
    //         rel="noopener noreferrer"
    //         className="ticket-link bg-transparent"
    //       >
    //         <i
    //           className="bi bi-ticket-detailed me-2"
    //           style={{
    //             color: row.status_name === 'Closed' ? 'green' : '#FF3131',
    //           }}
    //         />
    //         <span>{row.ticket_number}</span>
    //       </Link>
    //     </div>
    //   ),
    // },

    {
      name: 'User Type',
      selector: (row) => row.user_type,
      cell: (row) => (
        <div>
          <span className={`badge ${row.user_type === 'Agent' ? 'bg-primary' : 'bg-info'}`}>
            {row.user_type ?? '---'}
          </span>
        </div>
      ),
    },

    {
      name: 'Business Entity',
      selector: (row) => row.company_name,
      cell: (row) => <div>{row.company_name ?? '---'}</div>,
    },

    {
      name: 'Client',
      selector: (row) => row.raised_for,
      cell: (row) => (
        <div>
          <span>{row.raised_for ?? '---'}</span>
        </div>
      ),
    },

    {
      name: 'SID / UID',
      selector: (row) => row.sid_uid,
      cell: (row) => (
        <div>
          <span>{row.sid_uid ?? '---'}</span>
        </div>
      ),
    },

    {
      name: 'Category',
      selector: (row) => row.category_in_english,
      cell: (row) => <div>{statusColorSet(row.category_in_english ?? '---')}</div>,
    },

    {
      name: 'Sub-category',
      selector: (row) => row.sub_category_in_english,
      cell: (row) => (
        <div>
          <i className="bi bi-file-text-fill me-2" style={{ color: '#1E90FF' }}></i>
          <span>{row.sub_category_in_english ?? '---'}</span>
        </div>
      ),
    },

    // {
    //   name: 'Last Comment',
    //   selector: (row) => row.last_comment,
    //   cell: (row) => (
    //     <div title={row.last_comment || 'No comment'}>
    //       {truncateString(row.last_comment || 'No comment', 30)}
    //     </div>
    //   ),
    // },
    {
      name: 'Last Comment',
      selector: (row) => row.last_comment,
      cell: (row) => {
        const plainText = htmlToPlainText(row.last_comment);
        const shortText = truncateString(plainText || 'No comment', 30);

        return (
          <div
            title={plainText || 'No comment'}
            style={{
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              maxWidth: '220px',
            }}
          >
            {shortText}
          </div>
        );
      },
    },
    {
      name: 'Aggregator',
      selector: (row) => row.aggregator_name,
      cell: (row) => (
        <div>
          <i className="bi bi-box-seam me-2" style={{ color: 'gray' }}></i>
          <span>{row.aggregator_name ?? '---'}</span>
        </div>
      ),
    },

    {
      name: 'Age',
      selector: (row) => row.ticket_age,
      cell: (row) => (
        <div style={{ whiteSpace: 'nowrap' }}>
          <i className="bi bi-clock me-2" style={{ color: 'gray' }}></i>
          <span>{row.ticket_age ?? '---'}</span>
        </div>
      ),
    },

    {
      name: 'Status',
      selector: (row) => row.status_name,
      cell: (row) => (
        <div>
          <i
            className={`${iconMapping[row.status_name] || 'bi bi-question-circle'} me-2`}
            style={{
              color: `${row.status_name === 'Closed' ? 'green' : ''}`,
            }}
          ></i>
          {row.status_name ?? '---'}
        </div>
      ),
    },

    {
      name: 'Created By',
      selector: (row) => row.created_by,
      cell: (row) => <div>{row.created_by ?? '---'}</div>,
    },

    ...(activeTab === 'closed'
      ? [
          {
            name: 'Closed By',
            selector: (row) => row.status_updated_by,
            cell: (row) => <div>{row.status_updated_by ?? '---'}</div>,
          },
        ]
      : []),

    {
      name: 'Created Date',
      selector: (row) => moment(row.created_at).format('lll'),
      cell: (row) => (
        <div>{moment(row.created_at).isValid() ? moment(row.created_at).format('lll') : '---'}</div>
      ),
    },

    {
      name: 'Last Updated',
      selector: (row) => moment(row.updated_at).format('lll'),
      cell: (row) => (
        <div>{moment(row.updated_at).isValid() ? moment(row.updated_at).format('lll') : '---'}</div>
      ),
    },
  ];

  const customerColumns = [
    {
      name: 'Ticket No.',
      selector: (row) => row.ticket_number,
      cell: (row) => (
        <div className="w-100" style={{ whiteSpace: 'nowrap' }}>
          <a
            href={`/admin/ticket-details/${row.ticket_number}`}
            target="_blank"
            rel="noopener noreferrer"
            className="ticket-link bg-transparent"
            onClick={(e) => handleIsTicketReal(e, row.ticket_number)}
          >
            <i
              className="bi bi-ticket-detailed me-2"
              style={{
                color: `${row.status_name === 'Closed' ? 'green' : '#FF3131'} `,
              }}
            ></i>
            <span>{row.ticket_number}</span>
          </a>
        </div>
      ),
    },

    // {
    //   name: "Business Entity",
    //   selector: (row) => row.company_name,
    //   cell: (row) => (
    //     <div style={{ width: "950px", whiteSpace: "nowrap" }}>
    //       {row.company_name}
    //     </div>
    //   ),
    // },

    {
      name: 'Category',
      selector: (row) => row.category_in_english,
      cell: (row) => statusColorSet(row.category_in_english),
    },

    {
      name: 'Sub-category',
      selector: (row) => row.sub_category_in_english,
      cell: (row) => (
        <div>
          <i className="bi bi-file-text-fill me-2" style={{ color: '#1E90FF' }}></i>
          <span>{row.sub_category_in_english}</span>
        </div>
      ),
    },
    {
      name: 'SID / UID',
      selector: (row) => row.sid,
      cell: (row) => (
        <div>
          <span>{row.sid ?? '---'}</span>
        </div>
      ),
      omit: (row) => row.business_entity_id !== 8,
    },
    {
      name: 'Age',
      selector: (row) => row.ticket_age,
      cell: (row) => (
        <div>
          <i className="bi bi-clock me-2" style={{ color: 'gray' }}></i>
          <span>{row.ticket_age}</span>
        </div>
      ),
    },

    {
      name: 'Status',
      selector: (row) => row.status_name,
      cell: (row) => (
        <div>
          <i
            className={`${iconMapping[row.status_name]} me-2`}
            style={{
              color: `${row.status_name === 'Closed' ? 'green' : ''}`,
            }}
          ></i>{' '}
          {row.status_name}
        </div>
      ),
    },

    {
      name: 'Created By',
      selector: (row) => row.created_by,
      cell: (row) => <div>{row.created_by}</div>,
    },
    ...(activeTab === 'closed'
      ? [
          {
            name: 'Closed By',
            selector: (row) => row.status_update_by,
            cell: (row) => <div>{row.status_update_by}</div>,
          },
        ]
      : []),

    {
      name: 'Created Date',
      selector: (row) => moment(row.created_at).format('lll'),
      cell: (row) => <div>{moment(row.created_at).format('lll')}</div>,
    },
    {
      name: 'Last Updated',
      selector: (row) => moment(row.updated_at).format('lll'),
      cell: (row) => <div>{moment(row.updated_at).format('lll')}</div>,
    },
  ];

  const filteredData = useMemo(() => {
    return (
      ticketList &&
      ticketList.filter((ticket) => {
        const ticketNumber = String(ticket.ticket_number || '');
        const client_name = (ticket.client_name || '').toLowerCase();
        const category_in_english = (ticket.category_in_english || '').toLowerCase();
        const sub_category_in_english = (ticket.sub_category_in_english || '').toLowerCase();
        const team = (ticket.team_name || '').toLowerCase();
        const created_by = (ticket.created_by || '').toLowerCase();
        const sid = (ticket.sid || '').toLowerCase();
        const closed_by = (ticket.status_update_by || '').toLowerCase();
        const last_comment = (ticket.last_comment || '').toLowerCase();

        const match =
          ticketNumber.includes(searchText) ||
          client_name.includes(searchText.toLowerCase()) ||
          category_in_english.includes(searchText.toLowerCase()) ||
          sub_category_in_english.includes(searchText.toLowerCase()) ||
          team.includes(searchText.toLowerCase()) ||
          created_by.includes(searchText.toLowerCase()) ||
          closed_by.includes(searchText.toLowerCase()) ||
          sid.includes(searchText.toLowerCase()) ||
          last_comment.includes(searchText.toLowerCase());

        return match;
      })
    );
  }, [ticketList, searchText]);

  useEffect(() => {
    fetchAllTeam()
      .then((response) => {
        setTeamOptions(
          response.data.map((option) => ({
            value: option.id,
            label: option.team_name,
          }))
        );
      })
      .catch(errorMessage)
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  useEffect(() => {
    setIsLoading(true);
    const fetchStatusOptions = () => {
      getStatus().then((response) => {
        setStatusOptions(response.data);
        setStatusForAssignOptions(
          response.data
            .filter(
              (option) =>
                option.status_name !== 'Closed' && option.status_name !== 'Request Resolved'
            )
            .map((option) => ({
              value: option.id,
              label: option.status_name,
            }))
        );

        const defaultStatus = response.data.find(
          (option) => option.id === selectedRows[0]?.status_id
        );

        if (defaultStatus) {
          formikAssign.setFieldValue('statusId', defaultStatus.id);
        }
      });
    };

    Promise.all([fetchStatusOptions()])
      .catch(errorMessage)
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  const handleGetRowId = ({ selectedRows }) => {
    setSelectedRows(selectedRows);
  };
  const handleClearRows = () => {
    setToggleClearRows(!toggledClearRows);
  };
  const handleChangeRowsPerPage = (newRowsPerPage) => {
    setRowsPerPage(newRowsPerPage);
  };
  const [primaryIndex, setPrimaryIndex] = useState(null);
  const [markAsReadActionShow, setMarkAsReadActionShow] = useState(false);
  const [selectedMergeTickets, setSelectedMergeTickets] = useState([]);

  const [showOffcanvas, setShowOffcanvas] = useState(false);
  const [showOffcanvasTicketAssign, setShowOffcanvasTicketAssign] = useState(false);
  const [offcanvasContent, setOffcanvasContent] = useState('');
  const [offcanvasTitle, setOffcanvasTitle] = useState('');

  const [offcanvasSubTitle, setOffcanvasSubTitle] = useState('');

  const handleShowOffcanvas = (title, text) => {
    setOffcanvasTitle('');
    setOffcanvasSubTitle('');
    setOffcanvasTitle(title);
    setOffcanvasSubTitle(text);

    // If opening Merge Tickets canvas, prepopulate selectedMergeTickets from table selection
    if (title === 'Merge Tickets') {
      if (!selectedRows || selectedRows.length === 0) {
        warningMessage({ message: 'Please select tickets to merge' });
        return;
      }

      // Map selectedRows to merge ticket format
      const mapped = selectedRows.map((r) => ({
        value: r.ticket_number,
        label: `Ticket #${r.ticket_number}`,
      }));

      setSelectedMergeTickets(mapped);
      // default primary to first selected
      setPrimaryIndex(0);
    }

    setShowOffcanvas(true);
  };
  const handleAssignTicket = (title, text) => {
    const warning = getWarningMessage(selectedRows.length);
    if (warning) {
      warningMessage({ message: warning });
      return;
    }

    const selectedTicketNo = selectedRows[0]?.ticket_number;
    if (selectedTicketNo) {
      formikAssign.setFieldValue('ticketNumber', selectedTicketNo);
    }

    setOffcanvasTitle('');
    setOffcanvasSubTitle('');
    setOffcanvasTitle(title);
    setOffcanvasSubTitle(text);
    setShowOffcanvasTicketAssign(true);
  };

  const handleReopenTicket = () => {
    const warning = getWarningMessage(selectedRows.length);
    if (warning) {
      warningMessage({ message: warning });
      return;
    }

    const selectedTicketNo = selectedRows[0]?.ticket_number;
    if (!selectedTicketNo) {
      warningMessage({ message: 'Please select a ticket to reopen' });
      return;
    }

    setIsLoadingContextUpdated(true);
    // Pass status (1 for reopened), ticketNo, and userId
    reOpenStatusIdAndTicketNumber(1, selectedTicketNo, user?.id)
      .then((response) => {
        successMessage(response);
        setToggleClearRows(!toggledClearRows);
      })
      .catch((error) => {
        errorMessage(error);
      })
      .finally(() => {
        setIsLoadingContextUpdated(false);
      });
  };

  const handleCloseOffcanvas = () => setShowOffcanvas(false);
  const handleTicketAssignCloseOffcanvas = () => setShowOffcanvasTicketAssign(false);

  const formik = useFormik({
    initialValues: {
      selectedTicket: null, // Initialize with null or appropriate default
    },
    onSubmit: (values) => {
      console.log('Form data:', values);
    },
  });

  const formikAssign = useFormik({
    initialValues: {
      ticketNumber: '',
      userId: user?.id || '',
      teamId: '',
      // statusId: 1,
      agentId: '',
      comment: '',
      attachedFile: '',
      isInternal: 1,
    },

    validationSchema: assignValidationSchema,
    onSubmit: (values, { resetForm }) => {
      const formData = new FormData();
      formData.append('ticketNumber', values.ticketNumber);
      formData.append('userId', values.userId);
      formData.append('teamId', values.teamId);
      // formData.append('statusId', values.statusId);
      formData.append('agentId', values.agentId);
      formData.append('comment', values.comment);
      formData.append('isInternal', values.isInternal);
      if (values.attachedFile) {
        formData.append('attachedFile', values.attachedFile);
      }

      setIsLoadingAssign(true);
      setIsLoadingContextUpdated(true);
      assignTeamAndStore(formData)
        .then((response) => {
          successMessage(response);
        })
        .catch((error) => {
          errorMessage(error);
        })
        .finally(() => {
          setIsLoadingAssign(false);
          setShowOffcanvasTicketAssign(false);
          setToggleClearRows(!toggledClearRows);
          setIsLoadingContextUpdated(false);
          resetForm();
        });
    },
  });

  // Replace your existing useEffect with this one
  useEffect(() => {
    const fetchTicketOptions = () => {
      if (!user?.team_id) {
        console.warn('User team_id is not available');
        return;
      }

      setIsLoadingTicketOptions(true);
      getOpenTicketsByTeam(user?.team_id)
        .then((response) => {
          const ticketsData = response?.data || response;

          if (Array.isArray(ticketsData) && ticketsData.length > 0) {
            const formattedOptions = ticketsData.map((ticket) => ({
              value: ticket.ticket_number,
              label: `Ticket #${ticket.ticket_number}`,
            }));

            setTicketOptions(formattedOptions);
          } else {
            console.warn('No tickets found or invalid data format');
            setTicketOptions([]);
          }
        })
        .catch((error) => {
          errorMessage(error);
          console.error('Error fetching ticket options:', error);
          setTicketOptions([]);
        })
        .finally(() => {
          setIsLoadingTicketOptions(false);
        });
    };

    fetchTicketOptions();
  }, [user?.team_id]);

  const handleSelect = (selectedOption) => {
    // Then check if selectedOption is null (user cleared it)
    if (!selectedOption) {
      formik.setFieldValue('selectedTicket', null);
      return;
    }

    console.log('Raw selected option:', selectedOption);
    console.log('Selected option keys:', Object.keys(selectedOption));

    // Handle both possible structures from SelectDropdown
    const optionValue = selectedOption?.value !== undefined ? selectedOption.value : selectedOption;
    const optionLabel =
      selectedOption?.label !== undefined ? selectedOption.label : String(selectedOption);

    console.log('Extracted value:', optionValue);
    console.log('Extracted label:', optionLabel);
    console.log('Current selected tickets:', selectedMergeTickets);

    // Normalize the selected value
    const selectedValue = String(optionValue).trim();

    // Check if ticket is already selected
    const isAlreadySelected = selectedMergeTickets.some(
      (ticket) => String(ticket.value).trim() === selectedValue
    );

    console.log('Is already selected:', isAlreadySelected);

    if (isAlreadySelected) {
      warningMessage({ message: 'This ticket is already selected' });
      // Clear the dropdown value
      formik.setFieldValue('selectedTicket', null);
      return;
    }

    // Add the selected ticket
    setSelectedMergeTickets((prevTickets) => {
      const updatedTickets = [
        ...prevTickets,
        {
          value: optionValue,
          label: optionLabel,
        },
      ];
      console.log('Updated tickets after add:', updatedTickets);
      return updatedTickets;
    });

    // Reset the dropdown AFTER adding the ticket
    setTimeout(() => {
      formik.setFieldValue('selectedTicket', null);
    }, 10);
  };

  const handleRemoveTicket = (index) => {
    setSelectedMergeTickets((prevTickets) => {
      const updated = prevTickets.filter((_, i) => i !== index);
      console.log('Removed ticket, remaining:', updated);
      return updated;
    });

    // If the primary item is removed, reset the primaryIndex
    if (primaryIndex === index) {
      setPrimaryIndex(null);
    }

    // Reset dropdown
    formik.setFieldValue('selectedTicket', null);
  };

  // Set the primary ticket
  const handleSetPrimary = (index) => {
    setPrimaryIndex(index);
  };

  const handleStatusChange = (status) => {
    const warning = getWarningMessage(selectedRows.length);
    if (warning) {
      warningMessage({ message: warning });
      return;
    }

    // const isClientOrCustomer =
    //   user?.type === "Client" || user?.type === "Customer";
    // const isOwner = selectedRows[0]?.user_id === user?.id;
    // if (isClientOrCustomer && !isOwner) {
    //   return warningMessage({
    //     message: USER_TICKET_VALIDATION_MESSAGES.COLOSE_ALLOW,
    //   });
    // }

    // const isClient = user?.type === "Client";
    // const isSelfTicket = selectedRows?.[0]?.source_type === "Self-Ticket";

    // const loginUserTeamId = user?.user_teams;
    // const canCloseTicket = loginUserTeamId.includes(selectedRows?.[0]?.team_id);
    // if (!canCloseTicket) {
    //   return warningMessage({
    //     message: USER_TICKET_VALIDATION_MESSAGES.COLOSE_ALLOW,
    //   });
    // }

    const isAgent = user?.type === 'Agent';
    const isClient = user?.type === 'Client';
    const isSelfTicket = selectedRows?.[0]?.source_type === 'Self-Ticket';
    if (isAgent && !user?.user_teams?.includes(selectedRows?.[0]?.team_id)) {
      return warningMessage({
        message: USER_TICKET_VALIDATION_MESSAGES.COLOSE_ALLOW,
      });
    }
    if (isClient && (!isSelfTicket || selectedRows?.[0]?.team_id !== user?.team_id)) {
      return warningMessage({
        message: USER_TICKET_VALIDATION_MESSAGES.COLOSE_ALLOW,
      });
    }

    setIsLoadingContextUpdated(true);
    const selectedTicketNo = selectedRows[0]?.ticket_number;
    changeStatusByStatusIdAndTicketNumber(status, selectedTicketNo, user?.id)
      .then((response) => {
        successMessage(response);
      })
      .catch(errorMessage)
      .finally(() => {
        setToggleClearRows(!toggledClearRows);
        setIsLoadingContextUpdated(false);
      });
  };

  const handleColumns = () => {
    const columnsMap = {
      Agent: agentColumns,
      Client: clientColumns,
      Customer: customerColumns,
    };

    return columnsMap[user?.type];
  };

  const handleSelfTicket = () => {
    fetchSelfTicket({
      businessEntity: user?.default_entity_id,
      userId: user?.id,
      status: activeTab,
    })
      .then((response) => {
        setTikcetData(response.data);
      })
      .catch(errorMessage)
      .finally(() => {
        setIsLoading(false);
      });
  };

  const handleForwardSelfTicket = () => {
    const warning = getWarningMessage(selectedRows.length);
    if (warning) {
      warningMessage({ message: warning });
      return;
    }
    setIsLoadingContextUpdated(true);
    selfTicketToTicket({ ticket_number: selectedRows[0]?.ticket_number })
      .then((response) => {
        successMessage(response);
      })
      .catch(errorMessage)
      .finally(() => {
        setIsLoadingContextUpdated(false);
      });
  };

  // Handle merge ticket submission
  const handleMergeSubmit = () => {
    if (selectedMergeTickets.length < 2) {
      warningMessage({ message: 'Please select at least 2 tickets to merge' });
      return;
    }

    if (primaryIndex === null) {
      warningMessage({ message: 'Please select a primary ticket' });
      return;
    }

    // Prepare data for backend
    const primaryTicket = selectedMergeTickets[primaryIndex].value;
    const allTickets = selectedMergeTickets.map((ticket) => ticket.value);

    const mergeData = {
      parent_ticket_number: primaryTicket,
      tickets: allTickets,
      merged_by: user?.id,
    };

    console.log('Merge data being sent:', mergeData);

    setIsLoadingMerge(true);
    setIsLoadingContextUpdated(true);
    mergeTicketTeamWise(mergeData)
      .then((response) => {
        successMessage(response);
        // Reset the merge form
        setSelectedMergeTickets([]);
        setPrimaryIndex(null);
        formik.setFieldValue('selectedTicket', null);
        // Close offcanvas
        handleCloseOffcanvas();
      })
      .catch((error) => {
        errorMessage(error);
      })
      .finally(() => {
        setIsLoadingMerge(false);
        setIsLoadingContextUpdated(false);
      });
  };

  const mergeContent = () => {
    // Filter out selected tickets - ensure proper comparison
    const filteredOptions = ticketOptions.filter(
      (option) =>
        !selectedMergeTickets.some(
          (selected) => String(selected.value).trim() === String(option.value).trim()
        )
    );

    // console.log('=== RENDER DEBUG ===');
    // console.log('All ticket options:', ticketOptions);
    // console.log('Selected tickets:', selectedMergeTickets);
    // console.log('Filtered options (available):', filteredOptions);
    // console.log('Current dropdown value:', formik.values.selectedTicket);

    return (
      <section>
        <form onSubmit={formik.handleSubmit}>
          <div className="container-fluid">
            <div className="row">
              <div className="col-12">
                <div className="mb-3">
                  {selectedMergeTickets.length > 0 && (
                    <label className="text-muted mb-2">
                      ({selectedMergeTickets.length}) tickets selected. Secondary tickets will be
                      added to the primary ticket.
                    </label>
                  )}

                  <div className="mb-2 p-2 bg-light">
                    <small>
                      <strong>Debug Info:</strong>
                      <br />
                      Total tickets: {ticketOptions.length}
                      <br />
                      Selected: {selectedMergeTickets.length}
                      <br />
                      Available: {filteredOptions.length}
                    </small>
                  </div>

                  <SelectDropdown
                    placeholder={'Search ticket...'}
                    options={filteredOptions}
                    value={formik.values.selectedTicket}
                    onChange={handleSelect}
                    disabled={isLoadingTicketOptions || filteredOptions.length === 0}
                    isClearable={true}
                  />
                </div>
                {isLoadingTicketOptions && <small className="text-muted">Loading tickets...</small>}
                {filteredOptions.length === 0 && selectedMergeTickets.length > 0 && (
                  <small className="text-muted">All tickets have been selected</small>
                )}
              </div>
            </div>
          </div>
        </form>

        {selectedMergeTickets.length > 0 && (
          <div className="mt-4">
            {selectedMergeTickets.map((item, index) => (
              <Link to="#" className="notification-comment" key={`ticket-${item.value}-${index}`}>
                <div className="container-fluid">
                  <div className="row d-flex align-items-center">
                    <div className="col-1">
                      <div className="">
                        <button
                          type="button"
                          className="bg-transparent"
                          onClick={() => handleRemoveTicket(index)}
                        >
                          <i className="bi bi-dash-circle text-danger"></i>
                        </button>
                      </div>
                    </div>

                    <div className="col-9 ps-0">
                      <div className="row">
                        <div className="col-md-12">
                          <div className="ticket-number">
                            <p>
                              <i className="bi bi-ticket-detailed me-2"></i>
                              <strong>Ticket #{item.value}</strong>
                            </p>
                          </div>
                        </div>
                      </div>
                      <div className="row">
                        <div className="col-md-12">
                          <div className="description">
                            <div className="">
                              <h6>Ticket #{item.value}</h6>
                            </div>
                            <div className="">
                              <p>Complaint | Number Replacement Request</p>
                            </div>
                            <small>created 24hr 59m 59s</small>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="col-2">
                      <div className="d-flex flex-column align-items-center">
                        <button
                          type="button"
                          className={`bg-transparent ${index === primaryIndex ? 'text-success' : ''}`}
                          onClick={() => handleSetPrimary(index)}
                        >
                          {index === primaryIndex ? (
                            <i className="bi bi-check-circle-fill"></i>
                          ) : (
                            <i className="bi bi-circle"></i>
                          )}
                        </button>
                        <p
                          className={`text-success ${index === primaryIndex ? 'fw-bold' : ''}`}
                          style={{ width: '48px', height: '30px' }}
                        >
                          {index === primaryIndex ? 'Primary' : 'Secondary'}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}

        {selectedMergeTickets.length > 0 && primaryIndex !== null && (
          <div className="d-flex justify-content-end gap-3 bg-light p-3 mt-4 rounded">
            <button
              type="button"
              className="btn-button"
              onClick={() => {
                setSelectedMergeTickets([]);
                setPrimaryIndex(null);
                formik.setFieldValue('selectedTicket', null);
              }}
            >
              Cancel
            </button>
            <button
              type="button"
              className="custom-btn-for-canvas"
              onClick={handleMergeSubmit}
              disabled={isLoadingMerge || selectedMergeTickets.length < 2}
            >
              {isLoadingMerge ? 'Merging...' : 'Merge Tickets'}
            </button>
          </div>
        )}
      </section>
    );
  };

  const ticketAssign = () => {
    return (
      <section>
        <form onSubmit={formikAssign.handleSubmit}>
          <div className="container-fluid">
            <div className="row">
              <div className="col-12">
                <div className="mb-3">
                  <SelectDropdown
                    id="teamId"
                    placeholder="Select Team"
                    options={teamOptions}
                    value={formikAssign.values.teamId}
                    onChange={(value) => {
                      formikAssign.setFieldValue('teamId', value);
                      setSelectedTeamId(value);
                    }}
                    disabled={isLoading}
                  />
                </div>

                {formikAssign.touched.teamId && formikAssign.errors.teamId ? (
                  <div className="text-danger">{formikAssign.errors.teamId}</div>
                ) : null}
              </div>
              {/* <div className="col-12">
                <div className="mb-3">
                  <SelectDropdown
                    id="statusId"
                    placeholder="Select status"
                    options={statusForAssignOptions}
                    value={formikAssign.values.statusId}
                    onChange={(value) => {
                      formikAssign.setFieldValue('statusId', value);
                    }}
                    disabled={isLoading}
                  />
                </div>

                {formikAssign.touched.statusId && formikAssign.errors.statusId ? (
                  <div className="text-danger">{formikAssign.errors.statusId}</div>
                ) : null}
              </div> */}

              <div className="col-12">
                <div className="mb-3">
                  <SelectDropdown
                    id="agentId"
                    placeholder="Select Agent (Optional)"
                    options={agents}
                    value={formikAssign.values.agentId}
                    onChange={(value) => {
                      formikAssign.setFieldValue('agentId', value);
                    }}
                    disabled={isLoading}
                  />
                </div>
              </div>
              {/* <div className="col-12">
                <div className="mb-3">
                  <textarea
                    className="form-control"
                    placeholder="Write comment..."
                    id="comment"
                    name="comment"
                    value={formikAssign.values.comment}
                    onChange={formikAssign.handleChange}
                    rows="3"
                  ></textarea>
                </div>
                {formikAssign.touched.comment && formikAssign.errors.comment ? (
                  <div className="text-danger">{formikAssign.errors.comment}</div>
                ) : null}
              </div> */}

              <div className="col-12">
                <div className="mb-3">
                  <TextEditor
                    name="comment"
                    value={formikAssign.values.comment}
                    placeholder="Write comment..."
                    onChange={formikAssign.handleChange}
                    onBlur={formikAssign.handleBlur}
                  />
                </div>

                {formikAssign.touched.comment && formikAssign.errors.comment ? (
                  <div className="text-danger">{formikAssign.errors.comment}</div>
                ) : null}
              </div>

              <div className="col-8">
                <div className="">
                  <label htmlFor="attachedFile" className="btn-button">
                    <span
                      style={{
                        transform: 'rotate(217deg)',
                        display: 'inline-block',
                      }}
                    >
                      {' '}
                      <i className="bi bi-paperclip"></i>
                    </span>
                    Attachment{' '}
                  </label>
                  {formikAssign.values.attachedFile
                    ? formikAssign.values.attachedFile.name
                    : 'No file selected'}
                  <input
                    className="form-control"
                    id="attachedFile"
                    type="file"
                    hidden
                    onChange={(e) => formikAssign.setFieldValue('attachedFile', e.target.files[0])}
                  />
                </div>
              </div>
              <div className="d-flex justify-content-end gap-3 bg-light p-3 position-absolute bottom-0 end-0">
                <button
                  type="button"
                  className="btn-button"
                  onClick={handleTicketAssignCloseOffcanvas}
                >
                  Cancel
                </button>
                <button type="submit" className="custom-btn-for-canvas">
                  Save
                </button>
              </div>
            </div>
          </div>
        </form>
      </section>
    );
  };

  // SLA History content for offcanvas
  const [slaHistoryData, setSlaHistoryData] = useState([]);
  const [slaHistoryLoading, setSlaHistoryLoading] = useState(false);

  const handleSlaHistoryCloseOffcanvas = () => setShowOffcanvasSlaHistory(false);
  const [showOffcanvasSlaHistory, setShowOffcanvasSlaHistory] = useState(false);

  const handleOpenSlaHistory = (row, type) => {
    setShowOffcanvasSlaHistory(true); // 👈 first open
    setOffcanvasTitle('SLA History');
    setOffcanvasSubTitle(`SLA journey details`);

    setSlaHistoryLoading(true);
    console.log('Fetching SLA history for ticket:', row.ticket_number);
    getSlaHistoryByTicketNumber(row.ticket_number)
      .then((res) => {
        setSlaHistoryData(res.data);
      })
      .catch(errorMessage)
      .finally(() => {
        setSlaHistoryLoading(false);
      });
  };

  const slaHistoryContent = () => {
    if (slaHistoryLoading) {
      return <div className="text-center p-5">Loading...</div>;
    }

    const historyData = slaHistoryData?.details || [];

    return (
      <div style={{ fontSize: '14px', padding: '30px 20px' }}>
        {/* Overview Card */}
        <div
          style={{
            background: '#ebeff3',
            borderRadius: '12px',
            border: '0.5px solid #c8d0da',
            padding: '16px',
            marginBottom: '20px',
          }}
        >
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'flex-start',
              marginBottom: '14px',
            }}
          >
            <div className="d-flex align-items-center justify-content-center gap-2">
              <div
                style={{
                  fontSize: '16px',
                  textTransform: 'capitalize',
                  letterSpacing: '.06em',
                  marginBottom: '2px',
                  fontWeight: '700',
                }}
              >
                Ticket No:{' '}
              </div>
              <div style={{ fontSize: '16px', fontWeight: '700' }}>
                {slaHistoryData?.ticket_number}
              </div>
            </div>
            <span
              style={{
                fontSize: '11px',
                fontWeight: '500',
                background: '#d0d8e4',
                color: '#2c445e',
                padding: '4px 10px',
                borderRadius: '20px',
              }}
            >
              {slaHistoryData?.sub_category}
            </span>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '12px',
              borderTop: '0.5px solid #c8d0da',
              paddingTop: '12px',
              marginBottom: '12px',
            }}
          >
            {[
              {
                label: 'First Response',
                success: `${slaHistoryData?.fr_success_count}`,
                fail: `${slaHistoryData?.fr_failed_count}`,
              },
              {
                label: 'Service Time',
                success: `${slaHistoryData?.sla_success_count}`,
                fail: `${slaHistoryData?.sla_failed_count}`,
              },
            ].map((s, i) => (
              <div key={i}>
                <div style={{ fontSize: '11px', color: '#888', marginBottom: '4px' }}>
                  {s.label}
                </div>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    fontSize: '13px',
                    fontWeight: '500',
                  }}
                >
                  <span style={{ color: 'green' }}>
                    <i className="bi bi-check-circle-fill"></i> {s.success}
                  </span>
                  <span style={{ color: '#aaa' }}>/</span>
                  <span style={{ color: 'red' }}>
                    <i className="bi bi-x-circle-fill"></i> {s.fail}
                  </span>
                </div>
              </div>
            ))}
          </div>

          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              borderTop: '0.5px solid #c8d0da',
              paddingTop: '10px',
            }}
          >
            <span style={{ fontSize: '12px' }}>
              <i className="bi bi-hourglass-split me-1"></i>Total age:{' '}
              <strong style={{ color: '#222' }}>{slaHistoryData?.ticket_age}</strong>
            </span>
            <span style={{ fontSize: '12px' }}>
              <i className="bi bi-people me-1"></i>Teams involved:{' '}
              <strong style={{ color: '#222' }}>{slaHistoryData?.teams_traversed_count}</strong>
            </span>
          </div>
        </div>

        {/* Section Title */}
        <div
          style={{
            fontSize: '11px',
            fontWeight: '800',
            color: '#212529',
            textTransform: 'uppercase',
            letterSpacing: '.07em',
            marginBottom: '12px',
          }}
        >
          Ticket Journey
        </div>

        {/* Cards — no dot/line column */}
        {historyData.map((item, idx) => (
          <div
            key={idx}
            style={{
              borderRadius: '12px',
              border: '0.5px solid #c8d0da',
              overflow: 'hidden',
              marginBottom: '12px',
            }}
          >
            {/* Card Header */}
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '10px 14px',
                background: '#dde3eb',
                borderBottom: '0.5px solid #c8d0da',
              }}
            >
              <span
                style={{
                  fontWeight: '500',
                  fontSize: '13px',
                  color: '#2c445e',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                }}
              >
                <i className="bi bi-shield-check"></i>
                {item.team_name}
              </span>
              <span style={{ fontSize: '13px', fontWeight: '600' }}>0{item.step}</span>
            </div>

            <div style={{ padding: '12px 14px' }}>
              {/* In / Out Times */}
              <div
                style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}
              >
                <div>
                  <div
                    style={{
                      fontSize: '10px',
                      color: '#888',
                      textTransform: 'uppercase',
                      letterSpacing: '.05em',
                      marginBottom: '2px',
                      fontWeight: '600',
                    }}
                  >
                    In time
                  </div>
                  <div style={{ fontSize: '14px', fontWeight: '500' }}>
                    {moment(item.in_time).format('lll')}
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div
                    style={{
                      fontSize: '10px',
                      color: '#888',
                      textTransform: 'uppercase',
                      letterSpacing: '.05em',
                      marginBottom: '2px',
                      fontWeight: '600',
                    }}
                  >
                    Out time
                  </div>
                  <div style={{ fontSize: '14px', fontWeight: '500' }}>
                    {moment(item.out_time).format('lll')}
                  </div>
                </div>
              </div>

              {/* SLA Rows */}
              <div
                style={{
                  borderTop: '0.5px solid #c8d0da',
                  paddingTop: '10px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '8px',
                }}
              >
                {/* First Response */}
                <div
                  style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
                >
                  <span
                    style={{
                      fontSize: '13px',
                      color: `${item.fr_result === 'Success' ? 'green' : 'red'}`,
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                    }}
                  >
                    <i
                      className={`bi ${item.fr_result === 'Success' ? 'bi-check-circle-fill' : 'bi-x-circle-fill'}`}
                    ></i>
                    First Response: <strong>{item.fr_allowed_duration_min} Min</strong>
                  </span>
                  <span style={{ fontSize: '13px', fontWeight: '700', color: '#555' }}>
                    SLA: {item.fr_duration_min} Min
                  </span>
                </div>

                {/* Service Time */}
                <div
                  style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
                >
                  <span
                    style={{
                      fontSize: '13px',
                      color: `${item.sla_result === 'Success' ? 'green' : 'red'}`,
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                    }}
                  >
                    <i
                      className={`bi ${item.sla_result === 'Success' ? 'bi-check-circle-fill' : 'bi-x-circle-fill'}`}
                    ></i>
                    Service Time: <strong>{item.resolution_min} Min</strong>
                  </span>
                  <span style={{ fontSize: '13px', fontWeight: '700', color: '#555' }}>
                    SLA: {item.duration_min} Min
                  </span>
                </div>
              </div>

              {/* Stay Time */}
              <div
                style={{
                  marginTop: '10px',
                  background: '#dde3eb',
                  border: '0.5px solid #c8d0da',
                  borderRadius: '8px',
                  padding: '7px 12px',
                  display: 'flex',
                  justifyContent: 'space-between',
                }}
              >
                <span style={{ fontSize: '12px' }}>Stay time</span>
                <span style={{ fontSize: '13px', fontWeight: '500' }}>{item.stay_time}</span>
              </div>
            </div>
          </div>
        ))}

        {/* Footer */}
        {/* <div style={{ position: 'sticky', bottom: 0, background: '#fff', borderTop: '0.5px solid #c8d0da', paddingTop: '10px', display: 'flex', justifyContent: 'flex-end', gap: '8px', marginTop: '16px' }}>
          <button className="btn btn-light border btn-sm px-4" onClick={handleTicketHistoryCloseOffcanvas}>Cancel</button>
          <button className="btn btn-sm px-4" style={{ background: '#2c445e', color: '#fff', border: 'none' }}>
            <i className="bi bi-download me-1"></i> Export Logs
          </button>
        </div> */}
      </div>
    );
  };

  return (
    <div className="row pt-3">
      <div className="col-12">
        <div className="bg-white px-2">
          <div className="row mb-2">
            <div className="col-12 col-sm-6">
              <div className="d-flex justify-content-start">
                {hasPermission('Client_Ticket') && (
                  <Link
                    to="/admin/customer-complaint-create"
                    className="custom-btn-link me-2"
                    style={{ width: '90px' }}
                  >
                    {plusIcon}
                    {/* <span className='action-filter-container'>
                      {user?.role_name === "Admin"
                        ? "Client Ticket"
                        : "New Ticket"}
                    </span> */}
                    <span className="">
                      {user?.role_name === 'Admin' ? 'Client Ticket' : 'Ticket'}
                    </span>
                  </Link>
                )}
                {hasPermission('Create_Ticket') && (
                  <Link to="/admin/add-new-ticket" className="custom-btn-link me-2">
                    {plusIcon}
                    <span className="action-filter-container">New Ticket</span>
                  </Link>
                )}
                <div className="input-group w-50 search-input">
                  <span className="input-group-text" id="searchText1">
                    <i className="bi bi-search"></i>
                  </span>
                  <input
                    type="text"
                    id="searchText"
                    className="form-control"
                    placeholder="Search"
                    style={{ background: 'var(--secondary-bg-color)' }}
                    value={searchText}
                    onChange={(e) => setSearchText(e.target.value)}
                  />
                </div>
                {user?.type === 'Client' && (
                  <div className="dropdown">
                    <button
                      className="btn py-0 px-1"
                      style={{ backgroundColor: 'transparent' }}
                      type="button"
                      onClick={() => ExportToExcel(filteredData)}
                    >
                      <i className="bi bi-file-earmark-excel-fill fs-4 text-success me-1"></i>
                    </button>
                  </div>
                )}

                {/* <button
                  type='button'
                  className='btn-button my-0 me-0 action-filter-btn '
                  onClick={() => setActionButtons(!actionButtons)}>
                  <i className='bi bi-three-dots-vertical'></i>
                </button> */}
              </div>
            </div>
            <div
              className={`col-12 col-sm-6 d-flex justify-content-sm-end justify-content-center mt-sm-0 mt-2 `}
            >
              <div className="d-flex ">
                {activeTab === 'open' && (
                  <>
                    {hasPermission('Self_Ticket') && user?.type === 'Client' && (
                      <div className="dropdown">
                        <button
                          className="custom-btn me-2"
                          type="button"
                          onClick={() => handleSelfTicket()}
                        >
                          <i className="bi bi-person-fill-down me-1"></i>
                          <span className="action-filter-container">Self Ticket</span>
                        </button>
                      </div>
                    )}
                    {hasPermission('Status') && (
                      <div className="dropdown">
                        <button
                          className="custom-btn me-2 dropdown-toggle"
                          type="button"
                          data-bs-toggle="dropdown"
                          aria-expanded="false"
                        >
                          <i className="bi bi-flag-fill me-1"></i>
                          {'Status'}
                        </button>
                        <ul className="dropdown-menu">
                          {statusOptions &&
                            statusOptions.map((item, index) => {
                              if (item.status_name === 'Request Resolved') {
                                return null;
                              }
                              return (
                                <li key={index}>
                                  <button type="button" onClick={() => handleStatusChange(item.id)}>
                                    <i className={`${iconMapping[item.status_name]} me-2`}></i>
                                    {item.status_name}
                                  </button>
                                </li>
                              );
                            })}
                        </ul>
                      </div>
                    )}

                    {hasPermission('Forward_To_HQ') && (
                      <div className="dropdown">
                        <button
                          className="custom-btn me-2"
                          type="button"
                          onClick={() => handleForwardSelfTicket()}
                        >
                          <i className="bi bi-fast-forward-fill me-1"></i>

                          {'Forward'}
                        </button>
                      </div>
                    )}
                    {hasPermission('Assign') && (
                      <div className="dropdown">
                        <button
                          className="custom-btn me-2"
                          type="button"
                          onClick={() =>
                            handleAssignTicket(
                              'Assign Ticket',
                              'Forward ticket to the designated team.'
                            )
                          }
                        >
                          <i className="bi bi-person-fill-add me-1"></i>
                          {'Assign'}
                        </button>
                      </div>
                    )}
                    {hasPermission('Merge') && (
                      <div className="dropdown ">
                        <button
                          className="custom-btn me-2"
                          type="button"
                          onClick={() =>
                            handleShowOffcanvas(
                              'Merge Tickets',
                              'Secondary tickets will be added to the primary ticket.'
                            )
                          }
                        >
                          <i className="bi bi-intersect me-1"></i>
                          {'Merge'}
                        </button>
                      </div>
                    )}
                  </>
                )}

                {activeTab === 'closed' && (
                  <div className="dropdown">
                    <button
                      className="custom-btn me-2"
                      type="button"
                      onClick={() => handleReopenTicket()}
                      disabled={selectedRows.length === 0}
                    >
                      <i className="bi bi-repeat me-1"></i>
                      {'Reopen'}
                    </button>
                  </div>
                )}
                {user?.type != 'Client' && (
                  <div className="dropdown">
                    <button
                      className="custom-btn"
                      type="button"
                      onClick={() => ExportToExcel(filteredData)}
                    >
                      <i className="bi bi-file-earmark-excel-fill me-1"></i>
                      {'Export'}
                    </button>
                  </div>
                )}
                {/* <div className='dropdown'>
                  <button
                    className='custom-btn'
                    type='button'
                    onClick={() => ExportToExcel(filteredData)}>
                    <i className='bi bi-file-earmark-excel-fill me-1'></i>
                    {"Export"}
                  </button>
                </div> */}
              </div>
            </div>
          </div>
          <div className="row">
            <div className="col-12">
              <div className="">
                <DataTable
                  columns={handleColumns()}
                  data={filteredData}
                  // data={ticketList}
                  progressPending={isLoadingTableData}
                  fixedHeader
                  fixedHeaderScrollHeight="calc(100vh - 295px)"
                  pagination
                  paginationPerPage={rowsPerPage}
                  paginationRowsPerPageOptions={[50, 75, 100]}
                  onChangeRowsPerPage={handleChangeRowsPerPage}
                  selectableRows
                  onSelectedRowsChange={handleGetRowId}
                  clearSelectedRows={toggledClearRows}
                  customStyles={customStyles}
                  dense
                  responsive
                  persistTableHead
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <OffcanvasForTicketMerge
        show={showOffcanvas}
        onHide={handleCloseOffcanvas}
        icon={
          offcanvasTitle === 'Merge Tickets' ? (
            <i className="bi bi-intersect me-2"></i>
          ) : (
            <i className="bi bi-card-text me-2"></i>
          )
        }
        title={offcanvasTitle}
        subTitle={offcanvasSubTitle}
        content={mergeContent()}
      />

      <OffcanvasForTicketAssign
        show={showOffcanvasTicketAssign}
        onHide={handleTicketAssignCloseOffcanvas}
        icon={<i className="bi bi-person-fill-add me-2"></i>}
        title={offcanvasTitle}
        subTitle={offcanvasSubTitle}
        content={ticketAssign()}
      />

      <OffcanvasForSlaHistory
        show={showOffcanvasSlaHistory}
        onHide={handleSlaHistoryCloseOffcanvas} // Don't forget to uncomment this later!
        title={offcanvasTitle}
        subTitle={offcanvasSubTitle}
        content={slaHistoryContent()}
      />
    </div>
  );
};
