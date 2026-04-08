import { apiClient } from "../api-config/config";

export const statisticsReport = async (data) => {
  try {
    const response = await apiClient.post("reports/statistics/show", data);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// export const ticketLifeCycleReport = async () => {
//   try {
//     const response = await apiClient.get("reports/life/cycle/show");
//     return response.data;
//   } catch (error) {
//     throw error;
//   }
// };

export const ticketLifeCycleReport = async (data) => {
  try {
    const response = await apiClient.post("reports/ticket-details", data);
    return response.data;
  } catch (error) {
    throw error;
  }
};


export const ticketNewDetailsReport = async (data) => {
  try {
    const response = await apiClient.post("reports/new-details", data);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getAgentPerformance = async (data) => {
  try {
    const response = await apiClient.post("reports/agent-performance", data);
    return response.data;
  } catch (error) {
    throw error;
  }
};


export const getAgentPerformanceDetails = async (data) => {
  try {
    const response = await apiClient.post(
      "reports/agent-performance-details",
      data
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const topComplaintReport = async () => {
  try {
    const response = await apiClient.get("reports/top/complaint/show");
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const agentPerformanceReport = async () => {
  try {
    const response = await apiClient.get("reports/agent/performance/show");
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const slaViolationReport = async () => {
  try {
    const response = await apiClient.get("reports/sla/violation/show");
    return response.data;
  } catch (error) {
    throw error;
  }
};

// export const ticketDetailsInLevel = async (startDate, endDate) => {
//   try {
//     const response = await apiClient.get("reports/ticket-details", {
//       params: { startDate, endDate },
//     });
//     return response.data;
//   } catch (error) {
//     throw error;
//   }
// };

export const ticketDetailsInLevel = async (
  startDate,
  endDate,
  businessEntity,
  localClients
) => {
  try {
    const response = await apiClient.post("reports/ticket-details", {
      params: { startDate, endDate, businessEntity, localClients },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

// export const ticketDetailsInLevelByTicket = async (ticketNumber) => {
//   try {
//     const response = await apiClient.get("ticket/ticket-details-by-ticket", {
//       params: { ticket_number: ticketNumber },
//     });
//     return response.data;
//   } catch (error) {
//     throw error;
//   }
// };

export const fetchLocalClientsByBusinessEntityId = async (id) => {
  try {
    const response = await apiClient.get(
      `reports/get-local-clients-by-business-entity/${id}`
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};



