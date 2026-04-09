import { apiClient } from '../api-config/config';

export const store = async (data) => {
  try {
    const response = await apiClient.post('ticket/store', data);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const fetchTicket = async () => {
  try {
    const response = await apiClient.get('ticket/show');
    return response.data;
  } catch (error) {
    throw error;
  }
};

// export const getClientListFromLocal = async (businessEntityId) => {
//   try {
//     const response = await apiClient.get(`ticket/client-list/${businessEntityId}`);
//     return response.data;
//   } catch (error) {
//     throw error;
//   }
// };

export const getClientListFromLocal = async (businessEntityId, search = '') => {
  try {
    const response = await apiClient.get(`ticket/client-list/${businessEntityId}`, {
      params: {
        search: search,
      },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const ticketCount = async (data) => {
  try {
    const response = await apiClient.post('ticket/show/count', data);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const fetchSelfTicket = async (data) => {
  try {
    const response = await apiClient.post('ticket/self/show', data);
    return response.data;
  } catch (error) {
    throw error;
  }
};
export const forwardedSelfTicket = async (data) => {
  try {
    const response = await apiClient.post('ticket/forward/self', data);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const copySelfTicketToTicket = async (data) => {
  try {
    const response = await apiClient.post('ticket/self-ticket-to-ticket', data);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// export const copySelfTicketToTicket = async (id,data) => {
//   try {
//     const response = await apiClient.post("ticket/self-ticket-to-ticket/${id}", data);
//     return response.data;
//   } catch (error) {
//     throw error;
//   }
// };

export const fetchTicketById = async (id) => {
  try {
    const response = await apiClient.get(`ticket/show/${id}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};
export const isTicketReal = async (id) => {
  try {
    const response = await apiClient.get(`ticket/is-ticket-real/${id}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};
export const update = async (id, data) => {
  try {
    const response = await apiClient.put(`ticket/update/${id}`, data);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// export const fetchTicketByStatusAndDefaultEntity = async (status, entity) => {
//   try {
//     const response = await apiClient.get(
//       `ticket/show/by/status/entity/${status}/${entity}`
//     );
//     return response.data;
//   } catch (error) {
//     throw error;
//   }
// };
export const fetchTicketByStatusAndDefaultEntity = async (data) => {
  try {
    const response = await apiClient.post('ticket/show/by/status/entity', data);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const fetchTicketDetailsById = async (id) => {
  try {
    const response = await apiClient.get(`ticket/details/show/${id}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const storeSelfTicket = async (data) => {
  try {
    const response = await apiClient.post('ticket/store/self/ticket', data);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const forwardToHQ = async (data) => {
  try {
    const response = await apiClient.post('ticket/forward-to-hq', data);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const createVoiceTicket = async (data) => {
  try {
    const response = await apiClient.post('ticket/create-voice-ticket', data);
    return response.data;
  } catch (error) {
    throw error;
  }
};



export const selfTicketToTicket = async (data) => {
  try {
    const response = await apiClient.post('ticket/self-ticket-to-ticket', data);
    return response.data;
  } catch (error) {
    throw error;
  }
};

/// For comment

export const commentStore = async (data) => {
  try {
    const response = await apiClient.post('ticket/comment/store', data);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const fetchCommentsByTicketNumber = async (id) => {
  try {
    const response = await apiClient.get(`ticket/comment/show/by/ticket/${id}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const fetchCommentsByUserTeam = async (data) => {
  try {
    const response = await apiClient.post('ticket/notification/comment/show', data);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const changeStatusByStatusIdAndTicketNumber = async (status, ticketNo, userId) => {
  try {
    const response = await apiClient.get(
      `ticket/status/change/by/status/ticket/${status}/${ticketNo}/${userId}`
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const reOpenStatusIdAndTicketNumber = async (status, ticketNo, userId) => {
  try {
    const response = await apiClient.get(
      `ticket/status/changetoopen/by/status/ticket/${status}/${ticketNo}/${userId}`
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const assignTeamAndStore = async (data) => {
  try {
    const response = await apiClient.post(`ticket/assign/team/store`, data);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const fetchTeamBySubcategory = async (id) => {
  try {
    const response = await apiClient.get(`ticket/assing/team/show/by/subcategory/${id}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const fetchViolatedFirstResponseTimeSla = async (id) => {
  try {
    const response = await apiClient.get(`ticket/violated/first/response/time/sla/${id}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const fetchViolatedServiceResponseTimeSla = async (id) => {
  try {
    const response = await apiClient.get(`ticket/violated/service/response/time/sla/${id}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const ticketDetailsInLevelByTicket = async (ticketNumber) => {
  try {
    const response = await apiClient.get('ticket/ticket-details-by-ticket', {
      params: { ticket_number: ticketNumber },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const fetchTicketHistory = async (id) => {
  try {
    const response = await apiClient.get(`ticket/ticket-details-by-ticket/${id}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// export const fetchBackboneElementListsById = async (id) => {
//   try {
//     const response = await apiClient.get(`ticket/backbone/element/list/by/${id}`);
//     return response.data;
//   } catch (error) {
//     throw error;
//   }
// };

// export const fetchEntityListBySid = async (data) => {
//   try {
//     const response = await apiClient.post('fetch-entity-list', data);
//     return response.data;
//   } catch (error) {
//     throw error;
//   }
// };

export const fetchWebAppPartnerEntity = async () => {
  try {
    const response = await apiClient.get('https://webapp.race.net.bd/api/webapppartnerentity');
    return response.data;
  } catch (error) {
    throw error;
  }
};
export const fetchRaceMaximEntity = async () => {
  try {
    const response = await apiClient.get(
      'https://webapp.race.net.bd/api/maxim/race/webapppartnerentity'
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const fetchWebAppOwnEntity = async () => {
  try {
    const response = await apiClient.get('https://webapp.race.net.bd/api/webappownentity');
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const fetchWebAppSIDDetails = async (id) => {
  try {
    const response = await apiClient.get(
      `https://webapp.race.net.bd/api/fetch-entity-list-by-sid/${id}`
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const fetchWebAppEntityDetails = async (id) => {
  try {
    const response = await apiClient.get(
      `https://webapp.race.net.bd/api/fetch-entity-details-by-entity/${id}`
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};
export const fetchRaceMaximEntityDetails = async (id) => {
  try {
    const response = await apiClient.get(
      `https://webapp.race.net.bd/api/maxim/race/fetch-entity-details-by-entity/${id}`
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const fetchWebAppEntityDetailsOwn = async (id) => {
  try {
    const response = await apiClient.get(
      `https://webapp.race.net.bd/api/fetch-entity-details-by-entity-own/${id}`
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const fetchBackboneElements = async () => {
  try {
    const response = await apiClient.get(`ticket/backbone-elements`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const fetchBackboneElementListById = async (id) => {
  try {
    const response = await apiClient.get(`ticket/backbone/element/list/by/${id}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getClientIdGenaratedBySystem = async (data) => {
  try {
    const response = await apiClient.post('ticket/get-selected-client-id', data);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getOpenTicketsForSID = async (data) => {
  try {
    const response = await apiClient.post('ticket/get-open-ticket-for-sid', data);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getTicketListForMergeTicket = async (data) => {
  try {
    const response = await apiClient.post('ticket/get-ticket-list-for-merge', data);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const mergeTickets = async (data) => {
  try {
    const response = await apiClient.post('ticket/merge-tickets', data);
    return response.data;
  } catch (error) {
    console.error('Error merging tickets:', error);
    throw error;
  }
};

export const sendSMSBySID = async (data) => {
  try {
    const response = await apiClient.post('/send-sms-by-sid', data);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const sendSMSByPartnerNumber = async (data) => {
  try {
    const response = await apiClient.post('/send-sms-by-partner-number', data);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const fetchSidDetailsInfo = async (id) => {
  try {
    const response = await apiClient.get(
      `https://webapp.race.net.bd/api/fetch-entity-user-number-by-sid/${id}`
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const fetchRecentlyOpenAndClosedSidWise = async (data) => {
  try {
    const response = await apiClient.post(`ticket/recently-open-and-closed-by`, data);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Branch
export const getBranchDetailsById = async (id) => {
  try {
    const response = await apiClient.get(`ticket/branch-id/${id}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getOpenTicketsByTeam = async (teamId) => {
  try {
    const response = await apiClient.get(`ticket/open/by/team/${teamId}`);
    return response.data?.data || response.data;
  } catch (error) {
    throw error;
  }
};

export const mergeTicketTeamWise = async (data) => {
  try {
    const response = await apiClient.post(`ticket/merge`, data);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// export const fetchBackboneElements = async () => {
//   try {
//     const response = await apiClient.get(`ticket/backbone-elements`);
//     return response.data;
//   } catch (error) {
//     throw error;
//   }
// };

export const fetchDistricts = async () => {
  try {
    const response = await apiClient.get(`ticket/districts`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const fetchDivisions = async () => {
  try {
    const response = await apiClient.get(`ticket/divisions`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const fetchAggregators = async () => {
  try {
    const response = await apiClient.get(`ticket/aggregators`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const fetchBranches = async () => {
  try {
    const response = await apiClient.get(`ticket/branches`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// export const fetchAgents = async () => {
//   try {
//     const response = await apiClient.get(`ticket/agents`);
//     return response.data;
//   } catch (error) {
//     throw error;
//   }
// };

export const fetchAgents = async (teamId) => {
  try {
    const response = await apiClient.get(`ticket/agents`, {
      params: { team_id: teamId },
    });

    return response.data;
  } catch (error) {
    throw error;
  }
};

export const fetchEvents = async () => {
  try {
    const response = await apiClient.get(`ticket/events`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getSlaHistoryByTicketNumber = async (ticketNumber) => {
  try {
    const response = await apiClient.get(`ticket/${ticketNumber}/sla-report`);
    return response.data;
  } catch (error) {
    throw error;
  }
};
